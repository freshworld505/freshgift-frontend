"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useAuthStore } from "@/lib/store";
import { useWishlistStore } from "@/hooks/use-wishlist";
import { ShoppingCart, Heart, Star, Minus, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/api/cartApi";

interface ProductListCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductListCard({
  product,
  viewMode = "grid",
}: ProductListCardProps) {
  const { fetchCart, items, updateQuantity } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist: checkIsInWishlist,
  } = useWishlistStore();

  const isInWishlist = checkIsInWishlist(product.id);

  const isInStock = (product.stock ?? 0) > 0;

  // Check if product is in cart and get quantity
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  // Check if we can add more items (cart quantity hasn't reached stock limit)
  const canAddMore = cartQuantity < (product.stock ?? 0);

  // Handle product images using new schema
  const getProductImage = () => {
    // Check if productImages array exists and has items
    if (
      product.productImages &&
      Array.isArray(product.productImages) &&
      product.productImages.length > 0
    ) {
      const imageUrl = product.productImages[0];
      // Ensure the image URL is not empty or just whitespace
      return imageUrl && typeof imageUrl === "string" && imageUrl.trim()
        ? imageUrl.trim()
        : null;
    }
    // Return null if no image is available - this will prevent empty src error
    return null;
  };

  const imageUrl = getProductImage();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: `${product.productName} removed from wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: `${product.productName} added to wishlist!`,
      });
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      // redirect to login page after 1 second
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    try {
      // Call the API to add to cart
      await addToCart(product.id, 1);

      // Refresh cart from backend to get updated data
      await fetchCart();

      toast({
        title: `${product.productName} added to cart!`,
        description: "Item successfully added to your cart.",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error adding to cart",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIncreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleDecreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden border border-border/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 group rounded-xl">
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0">
            {" "}
            <Link href={`/products/${product.id}`}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.productName || "Product"}
                  fill
                  sizes="(max-width: 640px) 80px, 128px"
                  className={`object-cover rounded-l-xl transition-transform duration-300 group-hover:scale-105 ${
                    !isInStock ? "grayscale" : ""
                  }`}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-l-xl flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
            </Link>
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white/90 hover:bg-white border-0 rounded-lg text-red-500 hover:text-red-600 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 w-6 h-6 sm:w-8 sm:h-8"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${
                  isInWishlist
                    ? "fill-red-500 stroke-red-500"
                    : "stroke-red-500"
                }`}
              />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between p-2 sm:p-4">
            <div>
              <Link href={`/products/${product.id}`}>
                <div className="flex items-start justify-between mb-1 sm:mb-2">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-lg group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {product.productName}
                    </h3>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {product.category}
                    </Badge>
                  </div>
                  <p className="text-sm sm:text-xl font-bold text-orange-400 ml-2 sm:ml-4">
                    £{product.finalPrice || 0}
                  </p>
                </div>
              </Link>
              {product.description && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 sm:mt-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-2 sm:mt-3">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  (4.5)
                </span>
              </div>
              {!isInStock ? (
                <Button
                  size="sm"
                  className="bg-gray-400 text-gray-600 cursor-not-allowed font-medium rounded-lg"
                  disabled
                >
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Out of Stock
                </Button>
              ) : isInCart ? (
                <div className="flex items-center gap-1 bg-blue-600/10 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 rounded-md hover:bg-blue-600/20 transition-colors"
                    onClick={handleDecreaseQuantity}
                  >
                    <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                  <span className="min-w-[1.5rem] sm:min-w-[2rem] text-center text-xs sm:text-sm font-semibold text-blue-600">
                    {cartQuantity}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 rounded-md hover:bg-blue-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleIncreaseQuantity}
                    disabled={!canAddMore}
                  >
                    <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 font-medium rounded-lg transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="overflow-hidden border border-border/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group hover:-translate-y-1 rounded-xl">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <Link href={`/products/${product.id}`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.productName || "Product"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                !isInStock ? "grayscale" : ""
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-white/90 hover:bg-white border-0 rounded-lg text-red-500 hover:text-red-600 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 w-6 h-6 sm:w-7 sm:h-7"
          onClick={handleWishlistToggle}
        >
          <Heart
            className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-300 ${
              isInWishlist ? "fill-red-500 stroke-red-500" : "stroke-red-500"
            }`}
          />
        </Button>

        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-white/90 backdrop-blur-sm text-xs font-medium py-0.5 px-1.5 sm:px-2"
        >
          {product.category}
        </Badge>
      </div>

      {/* Content Section */}
      <CardContent className="p-1.5 sm:p-3 flex-grow">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-xs sm:text-sm group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-1 leading-tight">
            {product.productName}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-1 hidden sm:block">
            {product.description.slice(0, 50) + "..."}
          </p>
        )}

        {/* Rating - hide on mobile */}
        <div className="hidden sm:flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400"
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-sm sm:text-base font-bold text-orange-400">
            £{product.finalPrice || 0}
          </p>
        </div>
      </CardContent>

      {/* Footer with Add to Cart */}
      <CardFooter className="p-1.5 sm:p-3 pt-0 mt-auto">
        {!isInStock ? (
          <Button
            className="w-full bg-gray-400 text-gray-600 cursor-not-allowed font-medium py-1 text-xs rounded-lg"
            disabled
          >
            <ShoppingCart className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Out of Stock</span>
            <span className="sm:hidden">Out</span>
          </Button>
        ) : isInCart ? (
          <div className="flex items-center gap-1 w-full bg-blue-600/10 rounded-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-md hover:bg-blue-600/20 transition-colors"
              onClick={handleDecreaseQuantity}
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="flex-1 text-center text-xs sm:text-sm font-semibold text-blue-600">
              {cartQuantity}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-md hover:bg-blue-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleIncreaseQuantity}
              disabled={!canAddMore}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] hover:shadow-md font-medium py-1 text-xs rounded-lg transition-all duration-300 shadow-sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
