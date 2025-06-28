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
import { useWishlistStore } from "@/hooks/use-wishlist";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { addToCart } from "@/api/cartApi";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { fetchCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist: checkIsInWishlist,
  } = useWishlistStore();

  const isInWishlist = checkIsInWishlist(product.id);

  const isInStock = (product.stock ?? 0) > 0;

  // Get images from productImages array
  const images =
    product.productImages && product.productImages.length > 0
      ? product.productImages
      : [
          "/placeholder-product.jpg",
          "/placeholder-product.jpg",
          "/placeholder-product.jpg",
          "/placeholder-product.jpg",
        ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToImage = (index: number) => {
    setCurrentImageIndex(index);
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollLeft = (scrollWidth / images.length) * index;
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const clientWidth = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / clientWidth);
      setCurrentImageIndex(newIndex);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovering && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          scrollToImage(nextIndex);
          return nextIndex;
        });
      }, 1500); // Change image every 1.5 seconds
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
  }, [isHovering, images.length]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking heart
    e.stopPropagation(); // Prevent event bubbling to parent Link

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({ title: `${product.productName} removed from wishlist.` });
    } else {
      addToWishlist(product.id);
      toast({ title: `${product.productName} added to wishlist!` });
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

  return (
    <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full group hover:-translate-y-2 rounded-2xl">
      <div
        className="relative overflow-hidden rounded-t-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Scrollable Image Gallery */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((image, index) => (
            <Link
              key={index}
              href={`/products/${product.id}`}
              passHref
              legacyBehavior
            >
              <a className="block cursor-pointer min-w-full snap-start">
                <CardHeader className="p-0">
                  <div className="aspect-square relative w-full group/image">
                    <Image
                      src={image}
                      alt={`${product.productName} - image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`object-cover transition-transform duration-700 group-hover/image:scale-110 ${
                        !isInStock ? "grayscale" : ""
                      }`}
                      data-ai-hint={product.dataAiHint || "product image"}
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </CardHeader>
              </a>
            </Link>
          ))}
        </div>

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            {images.map((_, index) => (
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
          className="absolute top-3 right-3 bg-white/90 hover:bg-white border-0 rounded-xl text-red-500 hover:text-red-600 z-10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
          onClick={handleWishlistToggle}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${
              isInWishlist
                ? "fill-red-500 stroke-red-500 scale-110"
                : "stroke-red-500"
            }`}
          />
        </Button>
      </div>

      <Link href={`/products/${product.id}`} passHref legacyBehavior>
        <a className="cursor-pointer flex flex-col flex-grow">
          <CardContent className="p-6 flex-grow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-grow">
                <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {product.productName}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                  {product.category}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                £{product.finalPrice || 0}
              </p>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </CardContent>
        </a>
      </Link>

      <CardFooter className="p-6 pt-0 mt-auto">
        <Button
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg transform border-0 ${
            isInStock
              ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white hover:shadow-xl hover:scale-[1.02]"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          onClick={handleAddToCart}
          disabled={!isInStock}
          aria-label={`Add ${product.productName} to cart`}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
