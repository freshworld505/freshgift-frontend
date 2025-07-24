"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/store";
import { useWishlistStore } from "@/hooks/use-wishlist";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/api/cartApi";
import { searchProducts } from "@/api/productApi";
import { getCurrentUserMode, switchUserRole } from "@/api/productApi";

export default function DealsPage() {
  const [deals, setDeals] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userMode, setUserMode] = useState<"user" | "business" | null>(null);
  const { fetchCart, items, updateQuantity } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist: checkIsInWishlist,
  } = useWishlistStore();

  // Function to get business discount value
  const getBusinessDiscountValue = (product: Product): number => {
    if (!product.businessDiscount || product.businessDiscount === "0%") {
      return 0;
    }
    const match = product.businessDiscount.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  };

  // Function to calculate discounted price
  const getDiscountedPrice = (product: Product): number => {
    const discountPercent = getBusinessDiscountValue(product);
    if (discountPercent === 0) return product.finalPrice;
    return product.finalPrice * (1 - discountPercent / 100);
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        // Get products with business discounts
        const result = await searchProducts("", 1, 50);
        const products = Array.isArray(result)
          ? result
          : result?.products || [];

        // Filter products that have business discounts
        const productsWithDiscounts = products.filter(
          (product) =>
            product.businessDiscount && product.businessDiscount !== "0%"
        );

        setDeals(productsWithDiscounts.slice(0, 12));
      } catch (error) {
        console.error("Error fetching deals:", error);
        toast({
          title: "Error",
          description: "Failed to load deals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Check user mode and switch to business mode if needed
  useEffect(() => {
    const ensureBusinessMode = async () => {
      if (!isAuthenticated) return;

      try {
        const currentMode = await getCurrentUserMode();
        setUserMode(currentMode.mode);

        // If user is not in business mode, switch them to business mode
        if (currentMode.mode !== "business") {
          console.log(
            "User is not in business mode, switching to business mode..."
          );
          await switchUserRole();
          setUserMode("business");

          toast({
            title: "Switched to Business Mode",
            description: "You're now viewing business deals and pricing.",
          });
        }
      } catch (error) {
        console.error("Error checking/switching user mode:", error);
        toast({
          title: "Mode Switch Failed",
          description:
            "Unable to switch to business mode. Some features may not be available.",
          variant: "destructive",
        });
      }
    };

    ensureBusinessMode();
  }, [isAuthenticated]);

  useEffect(() => {
    const updateTimer = () => {
      const newTimeLeft: { [key: string]: string } = {};
      deals.forEach((product) => {
        // Create a timer that ends at midnight
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const difference = endOfDay.getTime() - now.getTime();

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          newTimeLeft[product.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[product.id] = "Expired";
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
      await addToCart(product.id, 10);

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

  const handleIncreaseQuantity = async (product: Product) => {
    const cartItem = items.find((item) => item.product.id === product.id);
    const cartQuantity = cartItem?.quantity || 0;

    // Check if we can add more items
    if (cartQuantity >= (product.stock ?? 0)) {
      toast({
        title: "Stock limit reached",
        description: `Only ${product.stock} items available in stock.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateQuantity(product.id, cartQuantity + 1);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDecreaseQuantity = async (product: Product) => {
    const cartItem = items.find((item) => item.product.id === product.id);
    const cartQuantity = cartItem?.quantity || 0;

    try {
      if (cartQuantity > 1) {
        await updateQuantity(product.id, cartQuantity - 1);
      } else {
        // Remove item if quantity would become 0
        await updateQuantity(product.id, 0);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
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

  const getDealColor = (discountPercent: number): string => {
    if (discountPercent >= 40) return "bg-red-500";
    if (discountPercent >= 30) return "bg-purple-500";
    if (discountPercent >= 20) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getDealLabel = (discountPercent: number): string => {
    if (discountPercent >= 40) return "Flash Business Sale";
    if (discountPercent >= 30) return "Weekly Business Special";
    if (discountPercent >= 20) return "Daily Business Deal";
    return "Business Deal";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 dark:from-emerald-950 dark:via-background dark:to-lime-950 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="text-lg font-medium">Loading amazing deals...</span>
        </div>
      </div>
    );
  }

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
            {/* Badges Section */}
            <div className="flex flex-col items-center space-y-3">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-medium border border-red-200 dark:border-red-800 animate-pulse">
                <Flame className="h-4 w-4 fill-current" />
                Limited Time • Hot Deals • Save Big
              </div>

              {/* Business Mode Indicator */}
              {userMode === "business" && (
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
                  <Gift className="h-4 w-4 fill-current" />
                  Business Mode Active • Exclusive Business Deals
                </div>
              )}
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
                <div className="text-2xl font-bold text-red-600">Up to 80%</div>
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
          <h2 className="text-3xl font-bold text-foreground">Business Deals</h2>
        </div>

        {deals.length === 0 ? (
          <div className="text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900">
                No Business Deals Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Business deals are currently being updated. Check back soon for
                amazing discounts on fresh produce!
              </p>
              <Button asChild className="mt-6">
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((product) => {
              const isInWishlist = checkIsInWishlist(product.id);
              const discountPercent = getBusinessDiscountValue(product);
              const discountedPrice = getDiscountedPrice(product);
              const cartItem = items.find(
                (item) => item.product.id === product.id
              );
              const isInCart = !!cartItem;

              return (
                <Card
                  key={product.id}
                  className="group relative overflow-hidden border-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl"
                >
                  {/* Deal badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      className={`${getDealColor(
                        discountPercent
                      )} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}
                    >
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {discountPercent}% OFF
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
                    <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                      <Image
                        src={
                          product.productImages?.[0] ||
                          "/placeholder-product.jpg"
                        }
                        alt={product.productName}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                          product.stock === 0 ? "blur-sm" : ""
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {/* Out of stock overlay */}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="text-white text-lg font-bold">
                              You Missed Out!
                            </div>
                            <div className="text-red-400 text-sm font-medium">
                              Out of Stock
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
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
                          £{discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          £{product.finalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Stock info */}
                      <div className="space-y-2">
                        {/*
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Category: {product.category}
                          </span>
                          <span className="text-muted-foreground">
                            Stock: {product.stock || 0}
                          </span>
                        </div>
                        */}
                        <p className="text-xs text-orange-600 font-medium">
                          🔥 {getDealLabel(discountPercent)} - Limited Time!
                        </p>
                      </div>
                    </div>

                    {product.stock === 0 ? (
                      <Button
                        className="w-full bg-gray-400 hover:bg-gray-400 text-white rounded-xl font-semibold py-3 shadow-lg cursor-not-allowed"
                        disabled
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Out of Stock
                      </Button>
                    ) : isInCart ? (
                      <div className="flex items-center gap-1 w-full bg-emerald-600/10 rounded-xl p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-600/20 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDecreaseQuantity(product);
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="flex-1 text-center text-sm font-semibold text-emerald-600">
                          {cartItem?.quantity || 0}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleIncreaseQuantity(product);
                          }}
                          disabled={
                            (cartItem?.quantity || 0) >= (product.stock ?? 0)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Add to Cart
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Load more section */}
        {deals.length > 0 && (
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
        )}
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
