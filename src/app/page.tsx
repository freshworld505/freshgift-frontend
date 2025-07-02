"use client";

import HeroSection from "@/components/layout/HeroSection";
import WhyChooseUsSection from "@/components/layout/WhyChooseUsSection";
import { useCartStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/products/ProductList";
import { useAllProducts } from "@/hooks/use-products";
import { getMostBoughtProducts } from "@/api/productApi";
import type { Product } from "@/lib/types";
import {
  Sun,
  Sprout,
  Star,
  LayoutGrid,
  Leaf,
  Apple,
  Coffee,
  Cake,
  Milk,
  ShoppingBasket,
  Zap,
  TrendingUp,
  ArrowRight,
  Clock,
  Percent,
  Flame,
  Vegan,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const { fetchCart } = useCartStore();
  const router = useRouter();
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);

  // Fallback to all products if most bought fails
  const { data: allProducts = [], isLoading: isLoadingAllProducts } =
    useAllProducts(1, 8);

  useEffect(() => {
    // Fetch cart status in background when homepage loads
    fetchCart();
  }, [fetchCart]);

  // Separate effect for popular products to avoid dependency issues
  useEffect(() => {
    // Fetch popular/most bought products
    const fetchPopularProducts = async () => {
      setIsLoadingPopular(true);
      try {
        const mostBoughtProducts = await getMostBoughtProducts();

        if (mostBoughtProducts && mostBoughtProducts.length > 0) {
          // Use the actual product data from MostBoughtProduct and take first 8
          const convertedProducts: Product[] = mostBoughtProducts
            .slice(0, 8)
            .map((product) => ({
              id: product.id,
              productCode: product.productCode,
              productName: product.productName,
              productImages: product.productImages,
              description: product.description,
              actualPrice: product.actualPrice,
              discount: product.discount,
              finalPrice: product.finalPrice,
              stock: product.stock,
              category: product.category,
              subCategory: product.subCategory,
              tags: product.tags,
              rating: product.rating,
              isFeatured: product.isFeatured,
              isTrending: product.isTrending,
              isNew: product.isNew,
              expiryDate: product.expiryDate
                ? new Date(product.expiryDate)
                : undefined,
              harvestDate: product.harvestDate
                ? new Date(product.harvestDate)
                : undefined,
              shelfLife: product.shelfLife,
              returnable: product.returnable,
              storageInstructions: product.storageInstructions || undefined,
              maxPurchaseLimit: product.maxPurchaseLimit,
              deliveryType: product.deliveryType || undefined,
              createdAt: new Date(product.createdAt),
              updatedAt: new Date(product.updatedAt),
            }));
          setPopularProducts(convertedProducts);
        } else {
          // Fallback to first 8 products from all products
          if (allProducts.length > 0) {
            setPopularProducts(allProducts.slice(0, 8));
          }
        }
      } catch (error) {
        console.error("Failed to fetch popular products:", error);
        // Fallback to first 8 products from all products
        if (allProducts.length > 0) {
          setPopularProducts(allProducts.slice(0, 8));
        }
      } finally {
        setIsLoadingPopular(false);
      }
    };

    fetchPopularProducts();
  }, []); // Empty dependency array - only run once on mount

  // Separate effect to handle fallback when allProducts are loaded
  useEffect(() => {
    if (
      !isLoadingAllProducts &&
      allProducts.length > 0 &&
      popularProducts.length === 0
    ) {
      setPopularProducts(allProducts.slice(0, 8));
      setIsLoadingPopular(false);
    }
  }, [isLoadingAllProducts, allProducts.length, popularProducts.length]);

  // Define categories with their details
  const categories = [
    {
      id: "featured",
      title: "Today's Top Picks",
      description: "Handpicked fresh products for you",
      icon: Star,
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      badge: "Featured",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "seasonal",
      title: "Seasonal Spotlight",
      description: "Fresh seasonal produce",
      icon: Sun,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      badge: "Seasonal",
      badgeColor: "bg-orange-100 text-orange-800",
    },
    {
      id: "leafy-greens",
      title: "Leafy Greens",
      description: "Fresh and crispy greens",
      icon: Sprout,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      badge: "Fresh",
      badgeColor: "bg-green-100 text-green-800",
    },
    {
      id: "organic",
      title: "Organic Choices",
      description: "Certified organic products",
      icon: Leaf,
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      badge: "Organic",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "fresh-fruits",
      title: "Fresh Fruits",
      description: "Sweet and juicy fruits",
      icon: Apple,
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      badge: "Sweet",
      badgeColor: "bg-red-100 text-red-800",
    },
    {
      id: "bakery",
      title: "Imported Selection",
      description: "Premium imported goods",
      icon: Cake,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      badge: "Premium",
      badgeColor: "bg-purple-100 text-purple-800",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  return (
    <div className="space-y-16">
      <HeroSection />

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover fresh, quality products organized just for you
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200 bg-white"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader
                  className={`${category.bgColor} rounded-t-lg relative overflow-hidden p-3 md:p-4`}
                >
                  <div className="flex flex-col items-center mb-2">
                    <div
                      className={`p-2 md:p-3 rounded-full bg-gradient-to-r ${category.color} shadow-lg mb-2`}
                    >
                      <IconComponent className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <Badge
                      className={`${category.badgeColor} border-0 text-xs`}
                    >
                      {category.badge}
                    </Badge>
                  </div>

                  <CardTitle
                    className={`text-sm md:text-base lg:text-xl font-bold ${category.textColor} group-hover:text-gray-900 transition-colors text-center leading-tight`}
                  >
                    {category.title}
                  </CardTitle>

                  {/* Decorative gradient overlay */}
                  <div
                    className={`absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-gradient-to-br ${category.color} opacity-10 rounded-full transform group-hover:scale-110 transition-transform duration-300`}
                  ></div>
                </CardHeader>

                <CardContent className="p-3 md:p-4 lg:p-6">
                  <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-2 md:mb-3 lg:mb-4 group-hover:text-gray-700 transition-colors text-center line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-center sm:justify-between">
                    <span className="text-xs md:text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors hidden sm:block">
                      Explore Collection
                    </span>
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Most Bought Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Popular Products
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customer favorites and most-bought items this week
          </p>
        </div>

        {isLoadingPopular || isLoadingAllProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : popularProducts.length > 0 ? (
          <div className="space-y-6">
            <ProductList products={popularProducts} />
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <Link href="/products">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  View All Products
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-12 text-center">
              <div className="p-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full w-fit mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Popular Products Coming Soon
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We're gathering data on customer favorites. Check back soon to
                see what's trending!
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Link href="/products">Browse All Products</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Quick Access Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-green-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-center">
            <div className="lg:col-span-2 text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                Need something specific?
              </h3>
              <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-6">
                Browse our complete product range or search for exactly what you
                need.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border border-green-200"
                  onClick={() => router.push("/products")}
                >
                  <CardContent className="p-3 md:p-4 flex items-center justify-center lg:justify-start space-x-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <LayoutGrid className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                        All Products
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        Browse everything
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-2xl">
                <ShoppingBasket className="h-10 w-10 md:h-16 md:w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUsSection />
    </div>
  );
}
