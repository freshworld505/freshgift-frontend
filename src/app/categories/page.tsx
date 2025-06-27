"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
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
  ArrowRight,
  ArrowLeft,
  Percent,
} from "lucide-react";

export default function CategoriesPage() {
  const router = useRouter();

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
      id: "new-arrivals",
      title: "Fresh Selection",
      description: "Latest fresh arrivals",
      icon: TrendingUp,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      badge: "New",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "on-sale",
      title: "On Sale",
      description: "Special discounts available",
      icon: Percent,
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      badge: "Sale",
      badgeColor: "bg-pink-100 text-pink-800",
    },
    {
      id: "beverages",
      title: "New Arrivals",
      description: "Latest beverages collection",
      icon: Coffee,
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      badge: "Trending",
      badgeColor: "bg-amber-100 text-amber-800",
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
    {
      id: "dairy",
      title: "Fresh Juices",
      description: "Cold-pressed fresh juices",
      icon: Milk,
      color: "from-cyan-400 to-cyan-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      badge: "Fresh",
      badgeColor: "bg-cyan-100 text-cyan-800",
    },
    {
      id: "root-vegetables",
      title: "Seasonal Picks",
      description: "Seasonal root vegetables",
      icon: ShoppingBasket,
      color: "from-yellow-600 to-yellow-800",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      badge: "Seasonal",
      badgeColor: "bg-yellow-100 text-yellow-900",
    },
    {
      id: "instant-delivery",
      title: "Instant Delivery",
      description: "Quick delivery available",
      icon: Zap,
      color: "from-violet-400 to-violet-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
      badge: "Fast",
      badgeColor: "bg-violet-100 text-violet-800",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 px-0 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover fresh, quality products organized just for you. Browse
              through our carefully curated categories to find exactly what you
              need.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200 bg-white"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader
                  className={`${category.bgColor} rounded-t-lg relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-3 rounded-full bg-gradient-to-r ${category.color} shadow-lg`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={`${category.badgeColor} border-0`}>
                      {category.badge}
                    </Badge>
                  </div>

                  <CardTitle
                    className={`text-xl font-bold ${category.textColor} group-hover:text-gray-900 transition-colors`}
                  >
                    {category.title}
                  </CardTitle>

                  {/* Decorative gradient overlay */}
                  <div
                    className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${category.color} opacity-10 rounded-full transform group-hover:scale-110 transition-transform duration-300`}
                  ></div>
                </CardHeader>

                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                      Explore Collection
                    </span>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
