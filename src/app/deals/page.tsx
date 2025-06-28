"use client";

import { useState, useEffect } from "react";
import { sampleProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Flame,
  Star,
  ShoppingCart,
  Heart,
  Timer,
  Zap,
  TrendingDown,
  Gift,
  Sparkles,
} from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/store";
import { useWishlistStore } from "@/hooks/use-wishlist";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/api/cartApi";

// Mock deals data - in real app this would come from API
const generateDeals = () => {
  const dealTypes = [
    { type: "flash", discount: 40, label: "Flash Sale", color: "bg-red-500" },
    {
      type: "daily",
      discount: 25,
      label: "Daily Deal",
      color: "bg-emerald-500",
    },
    {
      type: "weekly",
      discount: 30,
      label: "Weekly Special",
      color: "bg-blue-500",
    },
    {
      type: "clearance",
      discount: 50,
      label: "Clearance",
      color: "bg-purple-500",
    },
  ];

  return sampleProducts.slice(0, 12).map((product, index) => {
    const deal = dealTypes[index % dealTypes.length];
    const originalPrice = product.finalPrice || 0;
    const discountedPrice = originalPrice * (1 - deal.discount / 100);
    const endTime = new Date(
      Date.now() + (24 - new Date().getHours()) * 60 * 60 * 1000
    );

    return {
      ...product,
      deal: {
        ...deal,
        originalPrice,
        discountedPrice: Math.round(discountedPrice * 100) / 100,
        endTime,
        sold: Math.floor(Math.random() * 50) + 10,
        total: Math.floor(Math.random() * 30) + 70,
      },
    };
  });
};

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const { fetchCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist: checkIsInWishlist,
  } = useWishlistStore();

  useEffect(() => {
    setDeals(generateDeals());
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const newTimeLeft: { [key: string]: string } = {};
      deals.forEach((deal) => {
        const now = new Date().getTime();
        const endTime = new Date(deal.deal.endTime).getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          newTimeLeft[deal.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[deal.id] = "Expired";
        }
      });
      setTimeLeft(newTimeLeft);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [deals]);

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the API to add to cart
      await addToCart(product.id, 1);

      // Refresh cart from backend to get updated data
      await fetchCart();

      toast({
        title: "Added to cart",
        description: `${product.productName} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = (product: Product) => {
    const isInWishlist = checkIsInWishlist(product.id);
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.productName} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.productName} has been added to your wishlist.`,
      });
    }
  };

  const getProgressPercentage = (sold: number, total: number) => {
    return (sold / total) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 dark:from-emerald-950 dark:via-background dark:to-lime-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-red-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-200 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-300 rounded-full blur-2xl animate-bounce" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-medium border border-red-200 dark:border-red-800 animate-pulse">
              <Flame className="h-4 w-4 fill-current" />
              Limited Time • Hot Deals • Save Big
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Mega Deals
                </span>
                <br />
                <span className="text-foreground">Fresh & Affordable</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover incredible savings on premium fresh produce.
                <span className="text-emerald-600 font-semibold">
                  {" "}
                  Limited time offers
                </span>{" "}
                you don't want to miss!
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-2xl mx-auto">
              <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl font-bold text-red-600">Up to 50%</div>
                <div className="text-sm text-muted-foreground">Off</div>
              </div>
              <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl font-bold text-emerald-600">24hrs</div>
                <div className="text-sm text-muted-foreground">Flash Sales</div>
              </div>
              <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl font-bold text-blue-600">Daily</div>
                <div className="text-sm text-muted-foreground">New Deals</div>
              </div>
              <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl font-bold text-purple-600">Free</div>
                <div className="text-sm text-muted-foreground">Shipping*</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Today's Hot Deals
          </h2>
          <Button variant="outline" className="rounded-full">
            <Sparkles className="h-4 w-4 mr-2" />
            View All Deals
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((product) => {
            const isInWishlist = checkIsInWishlist(product.id);
            const progressPercentage = getProgressPercentage(
              product.deal.sold,
              product.deal.total
            );

            return (
              <Card
                key={product.id}
                className="group relative overflow-hidden border-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl"
              >
                {/* Deal badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge
                    className={`${product.deal.color} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}
                  >
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {product.deal.discount}% OFF
                  </Badge>
                </div>

                {/* Wishlist button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 transition-all"
                  onClick={() => handleWishlistToggle(product)}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isInWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>

                <CardHeader className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                      <Image
                        src={product.productImages?.[0] || "/placeholder.jpg"}
                        alt={product.productName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {product.productName}
                    </CardTitle>

                    {/* Timer */}
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <Timer className="h-4 w-4" />
                      <span className="font-mono font-medium">
                        {timeLeft[product.id] || "Loading..."}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-600">
                        £{product.deal.discountedPrice}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        £{product.deal.originalPrice}
                      </span>
                    </div>

                    {/* Stock progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Sold: {product.deal.sold}
                        </span>
                        <span className="text-muted-foreground">
                          Available: {product.deal.total - product.deal.sold}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-orange-600 font-medium">
                        🔥 {Math.round(progressPercentage)}% claimed
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Load more section */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/50"
          >
            <Gift className="h-5 w-5 mr-2" />
            Load More Deals
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-lime-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold">Never Miss a Deal!</h3>
            <p className="text-xl text-emerald-100">
              Subscribe to our newsletter and be the first to know about flash
              sales, exclusive offers, and daily deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-full px-8 py-3 font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
