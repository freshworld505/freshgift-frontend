/**
 * ProductCard Component - Updated for New Schema
 *
 * This component now works directly with the new Product schema format
 * without requiring any adapters or compatibility layers.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCartStore, useAuthStore } from "@/lib/store";
import { ShoppingCart, Heart, Star, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/api/cartApi";
import { useState, useRef, useEffect } from "react";
import { formatCurrency, convertINRtoGBP } from "@/lib/currency";

interface ProductCardProps {
  product: Product;
}

export default function ProductCardMigrated({ product }: ProductCardProps) {
  const { fetchCart } = useCartStore();
  const { user, isAuthenticated, addToWishlist, removeFromWishlist } =
    useAuthStore();

  const isInWishlist = isAuthenticated && user?.wishlist?.includes(product.id);

  // Get product images directly from new schema
  const images = product.productImages || [];
  const primaryImage = images[0] || "/placeholder-product.jpg";

  // If no images available, use a fallback
  const displayImages = images.length > 0 ? images : [primaryImage];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get price and discount info directly from new schema
  const displayPrice = product.finalPrice;
  const hasDiscount = product.discount && product.discount > 0;
  const discountPercentage = product.discount || 0;
  const savingsAmount = hasDiscount
    ? product.actualPrice - product.finalPrice
    : 0;

  const scrollToImage = (index: number) => {
    setCurrentImageIndex(index);
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollLeft = (scrollWidth / displayImages.length) * index;
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  const handleAddToCart = async () => {
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
      console.error("Error adding to cart:", error);
      toast({
        title: "Error adding to cart",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

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

  // Auto-scroll through images on hover
  useEffect(() => {
    if (isHovering && displayImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 1500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, displayImages.length]);

  // Update scroll position when currentImageIndex changes
  useEffect(() => {
    scrollToImage(currentImageIndex);
  }, [currentImageIndex]);

  return (
    <Card className="overflow-hidden border border-border/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-2 rounded-2xl">
      {/* Image Section */}
      <div
        className="relative aspect-square overflow-hidden rounded-t-2xl"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Link href={`/products/${product.id}`}>
          <div
            ref={scrollRef}
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
            }}
          >
            {displayImages.map((imageUrl, index) => (
              <div key={index} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={`${product.productName} - Image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* NEW: Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
            <Tag className="w-3 h-3" />
            <span>{discountPercentage}% OFF</span>
          </div>
        )}

        {/* NEW: Featured/Trending/New Badges */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1">
          {product.isFeatured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              Featured
            </span>
          )}
          {product.isTrending && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
              Trending
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
              New
            </span>
          )}
        </div>

        {/* Image indicators */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === index
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/80 hover:scale-110"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white border-0 rounded-lg text-red-500 hover:text-red-600 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 w-8 h-8"
          onClick={(e) => {
            e.preventDefault();
            handleWishlistToggle();
          }}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4">
        <CardHeader className="p-0 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {/* MIGRATION: Changed from product.name to product.productName */}
                {product.productName}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {product.category}
                {product.subCategory && ` • ${product.subCategory}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-grow">
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* NEW: Rating Display */}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= (product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.rating.toFixed(1)})
              </span>
            </div>
          )}

          {/* NEW: Tags Display */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-0 pt-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              {/* MIGRATION: Enhanced price display with discount */}
              {hasDiscount ? (
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(convertINRtoGBP(displayPrice))}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(
                      convertINRtoGBP(product.actualPrice || displayPrice)
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(convertINRtoGBP(displayPrice))}
                </span>
              )}

              {hasDiscount && (
                <span className="text-xs text-green-600 font-medium">
                  Save {formatCurrency(convertINRtoGBP(savingsAmount))}
                </span>
              )}
            </div>

            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
