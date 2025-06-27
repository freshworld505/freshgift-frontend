"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductList from "@/components/products/ProductList";
import { useHomepageProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sun,
  Sprout,
  Star,
  Leaf,
  Apple,
  Coffee,
  Cake,
  Milk,
  ShoppingBasket,
  Zap,
  TrendingUp,
  Percent,
  Loader2,
} from "lucide-react";
import type { Product } from "@/lib/types";

// Category mapping
const categoryConfig = {
  featured: {
    title: "Today's Top Picks",
    description: "Handpicked fresh products for you",
    icon: Star,
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    badge: "Featured",
    badgeColor: "bg-yellow-100 text-yellow-800",
    dataKey: "featuredProducts",
  },
  seasonal: {
    title: "Seasonal Spotlight",
    description: "Fresh seasonal produce perfect for this time of year",
    icon: Sun,
    color: "from-orange-400 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    badge: "Seasonal",
    badgeColor: "bg-orange-100 text-orange-800",
    dataKey: "seasonalSpotlightProducts",
  },
  "leafy-greens": {
    title: "Leafy Greens",
    description: "Fresh and crispy greens packed with nutrients",
    icon: Sprout,
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    badge: "Fresh",
    badgeColor: "bg-green-100 text-green-800",
    dataKey: "leafyGreensProducts",
  },
  organic: {
    title: "Organic Choices",
    description: "Certified organic products for healthy living",
    icon: Leaf,
    color: "from-emerald-400 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    badge: "Organic",
    badgeColor: "bg-emerald-100 text-emerald-800",
    dataKey: "organicProducts",
  },
  "fresh-fruits": {
    title: "Fresh Fruits",
    description: "Sweet and juicy fruits bursting with flavor",
    icon: Apple,
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    badge: "Sweet",
    badgeColor: "bg-red-100 text-red-800",
    dataKey: "freshFruits",
  },
  "new-arrivals": {
    title: "Fresh Selection",
    description: "Latest fresh arrivals and trending products",
    icon: TrendingUp,
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    badge: "New",
    badgeColor: "bg-blue-100 text-blue-800",
    dataKey: "newArrivals",
  },
  "on-sale": {
    title: "On Sale",
    description: "Special discounts and amazing deals",
    icon: Percent,
    color: "from-pink-400 to-pink-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
    badge: "Sale",
    badgeColor: "bg-pink-100 text-pink-800",
    dataKey: "onSaleProducts",
  },
  beverages: {
    title: "New Arrivals",
    description: "Latest beverages and refreshing drinks",
    icon: Coffee,
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    badge: "Trending",
    badgeColor: "bg-amber-100 text-amber-800",
    dataKey: "beveragesProducts",
  },
  bakery: {
    title: "Imported Selection",
    description: "Premium imported goods and specialty items",
    icon: Cake,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    badge: "Premium",
    badgeColor: "bg-purple-100 text-purple-800",
    dataKey: "bakeryProducts",
  },
  dairy: {
    title: "Fresh Juices",
    description: "Cold-pressed fresh juices and healthy drinks",
    icon: Milk,
    color: "from-cyan-400 to-cyan-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
    badge: "Fresh",
    badgeColor: "bg-cyan-100 text-cyan-800",
    dataKey: "dairyProducts",
  },
  "root-vegetables": {
    title: "Seasonal Picks",
    description: "Seasonal root vegetables and fresh produce",
    icon: ShoppingBasket,
    color: "from-yellow-600 to-yellow-800",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800",
    badge: "Seasonal",
    badgeColor: "bg-yellow-100 text-yellow-900",
    dataKey: "rootVegetables",
  },
  "instant-delivery": {
    title: "Instant Delivery",
    description: "Quick delivery available for immediate needs",
    icon: Zap,
    color: "from-violet-400 to-violet-600",
    bgColor: "bg-violet-50",
    textColor: "text-violet-700",
    badge: "Fast",
    badgeColor: "bg-violet-100 text-violet-800",
    dataKey: "instantDelivery",
  },
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryId = Array.isArray(params.categoryId)
    ? params.categoryId[0]
    : params.categoryId;

  const categoryInfo =
    categoryConfig[categoryId as keyof typeof categoryConfig];

  const {
    featuredProducts,
    seasonalSpotlightProducts,
    leafyGreensProducts,
    organicProducts,
    freshFruits,
    newArrivals,
    onSaleProducts,
    beveragesProducts,
    bakeryProducts,
    dairyProducts,
    rootVegetables,
    instantDelivery,
    isLoading,
    error,
  } = useHomepageProducts();

  // Get products based on category
  const getProductsForCategory = (): Product[] => {
    if (!categoryInfo) return [];

    const dataMap = {
      featuredProducts,
      seasonalSpotlightProducts,
      leafyGreensProducts,
      organicProducts,
      freshFruits,
      newArrivals,
      onSaleProducts,
      beveragesProducts,
      bakeryProducts,
      dairyProducts,
      rootVegetables,
      instantDelivery,
    };

    return dataMap[categoryInfo.dataKey as keyof typeof dataMap] || [];
  };

  const products = getProductsForCategory();

  // Show 404 if category doesn't exist
  if (!categoryInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Category Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = categoryInfo.icon;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      {/* Header */}
      <div className={`${categoryInfo.bgColor} border-b border-gray-200`}>
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 px-0 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>

          {/* Category Header */}
          <div className="flex items-center gap-6 mb-6">
            <div
              className={`p-4 rounded-2xl bg-gradient-to-r ${categoryInfo.color} shadow-lg`}
            >
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  {categoryInfo.title}
                </h1>
                <Badge className={`${categoryInfo.badgeColor} border-0`}>
                  {categoryInfo.badge}
                </Badge>
              </div>
              <p className="text-xl text-gray-600">
                {categoryInfo.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{products.length} products available</span>
            <span>•</span>
            <span>Fresh daily delivery</span>
            <span>•</span>
            <span>Quality guaranteed</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        <ProductList
          products={products}
          loading={isLoading}
          error={error}
          emptyMessage={`No ${categoryInfo.title.toLowerCase()} available right now.`}
          viewMode={viewMode}
          showCount={true}
        />
      </div>
    </div>
  );
}
