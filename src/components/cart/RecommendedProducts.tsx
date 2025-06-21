"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import {
  recommendComplementaryProducts,
  type RecommendComplementaryProductsOutput,
} from "@/ai/flows/recommend-complementary-products";
import { useCartStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, Sparkles } from "lucide-react";
import { sampleProducts } from "@/lib/products";
import Image from "next/image";
import { addToCart } from "@/api/cartApi";
import { useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

export default function RecommendedProducts() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastAddedItem = useCartStore((state) => state.lastAddedItem);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { isAuthenticated } = useAuthStore();

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
        title: "Added to Cart",
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

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (lastAddedItem) {
        setIsLoading(true);
        setRecommendations([]);
        try {
          const result: RecommendComplementaryProductsOutput =
            await recommendComplementaryProducts({
              productName: lastAddedItem.productName || "",
              productCategory: lastAddedItem.category,
            });
          setRecommendations(
            result.complementaryProducts
              .filter(
                (name) =>
                  name.toLowerCase() !==
                  (lastAddedItem.productName || "").toLowerCase()
              )
              .slice(0, 3)
          );
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          setRecommendations([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, [lastAddedItem]);

  const findProductByName = (name: string): Product | undefined => {
    return sampleProducts.find(
      (p) => p.productName?.toLowerCase() === name.toLowerCase()
    );
  };

  if (!lastAddedItem && recommendations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-b border-yellow-100 dark:border-yellow-800">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-yellow-700" />
          </div>
          <div>
            <div className="text-foreground">Perfect Pairings</div>
            {lastAddedItem && (
              <div className="text-sm font-normal text-muted-foreground">
                Great with {lastAddedItem.productName}
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && recommendations.length === 0 && lastAddedItem && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No specific recommendations found for {lastAddedItem.productName}.
              <br />
              Explore more products in our store!
            </p>
          </div>
        )}

        {!isLoading && recommendations.length > 0 && (
          <div className="space-y-4">
            {recommendations.map((recName, index) => {
              const recommendedProduct = findProductByName(recName);
              if (recommendedProduct) {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-lime-50/50 dark:from-emerald-950/20 dark:to-lime-950/20 hover:from-emerald-100/50 hover:to-lime-100/50 dark:hover:from-emerald-900/30 dark:hover:to-lime-900/30 transition-all duration-200 border border-emerald-100 dark:border-emerald-800"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-lime-100 dark:from-emerald-900 dark:to-lime-900 p-1">
                        <Image
                          src={
                            recommendedProduct.productImages?.[0] ||
                            "/placeholder.jpg"
                          }
                          alt={recommendedProduct.productName || "Product"}
                          width={64}
                          height={64}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {recommendedProduct.productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                        >
                          {recommendedProduct.category}
                        </Badge>
                        <span className="text-sm font-semibold text-emerald-600">
                          ${(recommendedProduct.finalPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(recommendedProduct)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group h-10 px-4"
                    >
                      <Plus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                      Add
                    </Button>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-muted/50 text-muted-foreground text-center"
                >
                  {recName} (details unavailable)
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
