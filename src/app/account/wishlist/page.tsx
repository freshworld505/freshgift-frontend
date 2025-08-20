"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/hooks/use-wishlist";
import { useAllProducts } from "@/hooks/use-products";
import type { Product } from "@/lib/types";
import ProductList from "@/components/products/ProductList";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistItems, addToWishlist, clearWishlist, _hasHydrated } =
    useWishlistStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all products from the API
  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
    error,
  } = useAllProducts();

  // Debug function to add test items
  const addTestItems = () => {
    // Add the first few product IDs from the actual products
    if (allProducts.length > 0) {
      addToWishlist(allProducts[0].id);
      addToWishlist(allProducts[1]?.id);
      addToWishlist(allProducts[2]?.id);
    }
  };

  useEffect(() => {
    // Only proceed if hydration has completed and products are loaded
    if (!_hasHydrated || isLoadingProducts || !allProducts.length) return;

    // Debug logging
    //console.log("Wishlist items from store:", wishlistItems);
    //console.log("All products available:", allProducts.length);

    // Filter products based on wishlist items from localStorage
    const products = allProducts.filter((p: Product) =>
      wishlistItems.includes(p.id)
    );
    //console.log("Filtered wishlist products:", products);

    setWishlistProducts(products);
    setIsLoading(false);
  }, [wishlistItems, _hasHydrated, allProducts, isLoadingProducts]);

  if (isLoading || !_hasHydrated || isLoadingProducts) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            My Wishlist
          </h2>
          <p className="text-gray-600">Loading your favorite products...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="h-48 bg-gray-100 rounded-xl mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          My Wishlist
        </h2>
        <p className="text-gray-600">
          Your carefully curated collection of favorite products
        </p>
      </div>

      {/* Wishlist Content */}
      {wishlistProducts.length > 0 ? (
        <div className="space-y-6">
          {/* Stats Section */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {wishlistProducts.length}{" "}
                    {wishlistProducts.length === 1 ? "Item" : "Items"} Saved
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Keep track of products you love
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-pink-200 hover:bg-pink-50"
              >
                <Link href="/products">Add More</Link>
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <ProductList products={wishlistProducts} />
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartCrack className="h-12 w-12 text-pink-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Your Wishlist is Empty
            </h3>
            <p className="text-gray-600 mb-8">
              Discover amazing products and save your favorites here. Start
              exploring our fresh collection!
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl px-8"
            >
              <Link href="/products">Discover Products</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
