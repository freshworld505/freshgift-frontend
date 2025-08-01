"use client";

import { useState, useMemo, useEffect } from "react";
import { Product } from "@/lib/types";
import ProductListCard from "@/components/products/ProductListCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  Leaf,
  TrendingUp,
  Star,
} from "lucide-react";
import { useAllProducts, useSearchProducts } from "@/hooks/use-products";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "category";
type ViewMode = "grid" | "list";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Simple debounce implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use React Query hooks for data fetching
  const allProductsQuery = useAllProducts(1, 250);
  const searchQuery = useSearchProducts(
    debouncedSearchTerm,
    debouncedSearchTerm.trim().length > 0
  );

  // Determine which data to use
  const currentQuery =
    debouncedSearchTerm.trim().length > 0 ? searchQuery : allProductsQuery;
  const products =
    debouncedSearchTerm.trim().length > 0
      ? searchQuery.data?.products || []
      : allProductsQuery.data || [];

  const loading = currentQuery.isLoading;
  const error = currentQuery.error?.message || null;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p: Product) => p.category)));
    return cats.sort();
  }, [products]);

  // Calculate price range
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 50; // Default max price in £
    const maxPrice = Math.max(
      ...products.map((p: Product) => p.finalPrice || 0)
    );
    return maxPrice;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product: Product) => {
      // Search filter
      const matchesSearch =
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      // Price filter
      const productPrice = product.finalPrice || 0;
      const matchesPrice =
        productPrice >= priceRange[0] && productPrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "name-asc":
          return (a.productName || "").localeCompare(b.productName || "");
        case "name-desc":
          return (b.productName || "").localeCompare(a.productName || "");
        case "price-asc":
          return (a.finalPrice || 0) - (b.finalPrice || 0);
        case "price-desc":
          return (b.finalPrice || 0) - (a.finalPrice || 0);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategories, priceRange, sortBy]);

  // Update price range when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const maxPrice = Math.max(
        ...products.map((p: Product) => p.finalPrice || 0)
      );
      setPriceRange([0, maxPrice]);
    }
  }, [products]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
  };

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-[1600px]">
        {/* Header Section */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Fresh Products
              </h1>
              <p className="text-muted-foreground text-sm sm:text-lg hidden sm:block">
                Discover our collection of fresh, organic produce
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-2 sm:p-4 flex items-center gap-2 sm:gap-3">
                <div className="p-1 sm:p-2 bg-primary/20 rounded-lg">
                  <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="hidden sm:inline">Total Products</span>
                    <span className="sm:hidden">Products</span>
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">
                    {loading ? "..." : products.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-2 sm:p-4 flex items-center gap-2 sm:gap-3">
                <div className="p-1 sm:p-2 bg-accent/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Categories
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-accent">
                    {loading ? "..." : categories.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary/20">
              <CardContent className="p-2 sm:p-4 flex items-center gap-2 sm:gap-3">
                <div className="p-1 sm:p-2 bg-secondary/30 rounded-lg">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Showing
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-secondary-foreground">
                    {filteredProducts.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground z-10 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search fresh products..."
              className="pl-10 sm:pl-12 pr-4 h-10 sm:h-14 bg-background/50 backdrop-blur-sm border-border/50 rounded-xl sm:rounded-2xl text-sm sm:text-lg focus:bg-background focus:border-primary/50 shadow-lg transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden h-8 sm:h-10 px-3 sm:px-4 rounded-full border-border/50 hover:bg-primary/10 text-xs sm:text-sm"
                  >
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Filters</span>
                    <span className="sm:hidden">Filter</span>
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your product search
                    </SheetDescription>
                  </SheetHeader>
                  <MobileFilters
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    maxPrice={maxPrice}
                    onClearFilters={clearAllFilters}
                  />
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-32 sm:w-48 h-8 sm:h-10 rounded-full border-border/50 hover:bg-primary/10 text-xs sm:text-sm">
                  <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">
                    Price (High to Low)
                  </SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="h-8 sm:h-10 px-2 sm:px-4 rounded-full hover:bg-destructive/10 text-destructive text-xs sm:text-sm"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    Clear ({activeFiltersCount})
                  </span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted/30 p-0.5 sm:p-1 rounded-full">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-full"
              >
                <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-full"
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-pointer"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                  <X className="h-3 w-3 ml-2" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 sm:gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <Card className="sticky top-24 bg-background/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 sm:p-6">
                <DesktopFilters
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  maxPrice={maxPrice}
                  onClearFilters={clearAllFilters}
                />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <Card className="bg-background/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Loading products...
                  </h3>
                  <p className="text-muted-foreground">
                    Please wait while we fetch fresh products
                  </p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="bg-background/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="p-4 bg-destructive/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <X className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-destructive">
                    Error loading products
                  </h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button
                    onClick={() => {
                      // Retry the current query
                      if (debouncedSearchTerm.trim().length > 0) {
                        searchQuery.refetch();
                      } else {
                        allProductsQuery.refetch();
                      }
                    }}
                    variant="outline"
                    className="rounded-full"
                  >
                    Try again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredProducts.length === 0 ? (
              <Card className="bg-background/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="rounded-full"
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 2xl:grid-cols-6"
                    : "grid-cols-1 gap-4"
                }`}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={viewMode === "list" ? "max-w-none" : ""}
                  >
                    <ProductListCard product={product} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Filters Component
function DesktopFilters({
  categories,
  selectedCategories,
  onCategoryToggle,
  priceRange,
  setPriceRange,
  maxPrice,
  onClearFilters,
}: {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  onClearFilters: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
        >
          Clear all
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Categories
        </h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-3">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryToggle(category)}
                className="rounded-md"
              />
              <label
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Price Range
        </h4>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>£{priceRange[0]}</span>
            <span>£{priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Filters Component
function MobileFilters({
  categories,
  selectedCategories,
  onCategoryToggle,
  priceRange,
  setPriceRange,
  maxPrice,
  onClearFilters,
}: {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  onClearFilters: () => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="w-full rounded-full"
      >
        Clear all filters
      </Button>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Categories
        </h4>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-3">
              <Checkbox
                id={`mobile-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryToggle(category)}
                className="rounded-md"
              />
              <label
                htmlFor={`mobile-${category}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Price Range
        </h4>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>£{priceRange[0]}</span>
            <span>£{priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
