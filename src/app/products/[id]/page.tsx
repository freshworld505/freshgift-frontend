"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
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
import {
  ShoppingCart,
  ArrowLeft,
  Heart,
  Loader2,
  Minus,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/api/cartApi";
import { getProductById, getProductsByCategory } from "@/api/productApi";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/hooks/use-wishlist";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchCart, items, updateQuantity } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist: checkIsInWishlist,
  } = useWishlistStore();

  // Local state for product data
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productIdParam = params.id;
  const productId = Array.isArray(productIdParam)
    ? productIdParam[0]
    : productIdParam;

  // Function to fetch product by ID
  const fetchProduct = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(`🔍 Fetching product with ID: ${id}`);

      const productData = await getProductById(id);

      if (productData === null) {
        // Product not found
        setProduct(null);
      } else {
        // Product found successfully
        setProduct(productData);
        // Fetch related products based on category
        fetchRelatedProducts(productData.category, id);
      }
    } catch (err) {
      console.error(`Failed to fetch product ${id}:`, err);
      setError(err instanceof Error ? err.message : "Failed to fetch product");
      toast({
        title: "Error fetching product",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //const finalDiscount = () => {
  //  if (product?.businessDiscount == "0%") {
  //    return `${product?.discount}%`;
  //  } else {
  //    return product?.businessDiscount;
  //  }
  //};

  // Helper function to get discount for any product (main or related)
  //const getProductDiscount = (productItem: Product) => {
  //  if (productItem?.businessDiscount == "0%") {
  //    return `${productItem?.discount}%`;
  //  } else {
  //    return productItem?.businessDiscount;
  //  }
  //};

  // Function to fetch related products
  const fetchRelatedProducts = async (
    category: string,
    currentProductId: string
  ) => {
    try {
      setIsLoadingRelated(true);
      const products = await getProductsByCategory(category, 1, 8);
      // Filter out the current product and limit to 6 items
      const filteredProducts = products
        .filter((p) => p.id !== currentProductId)
        .slice(0, 6);
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setIsLoadingRelated(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  // Handle product images
  const getProductImages = () => {
    if (
      product?.productImages &&
      Array.isArray(product.productImages) &&
      product.productImages.length > 0
    ) {
      return product.productImages
        .map((imageUrl) => {
          return imageUrl && typeof imageUrl === "string" && imageUrl.trim()
            ? imageUrl.trim()
            : null;
        })
        .filter(Boolean);
    }
    return [];
  };

  const productImages = getProductImages();
  const hasMultipleImages = productImages.length > 1;
  const currentImageUrl =
    productImages[currentImageIndex] || "/placeholder-product.jpg";

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }
  };

  const previousImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + productImages.length) % productImages.length
      );
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle keyboard navigation for images
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (hasMultipleImages) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previousImage();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          nextImage();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [hasMultipleImages, productImages.length]);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (hasMultipleImages) {
      if (isLeftSwipe) {
        nextImage();
      } else if (isRightSwipe) {
        previousImage();
      }
    }
  };

  // Auto-play images (optional - can be enabled)
  useEffect(() => {
    if (isAutoPlay && hasMultipleImages && productImages.length > 1) {
      const interval = setInterval(() => {
        nextImage();
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlay, hasMultipleImages, currentImageIndex, productImages.length]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-lg text-destructive">Error: {error}</p>
          <Button
            onClick={() => productId && fetchProduct(productId)}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show not found if no product and not loading (API call completed but no product found)
  if (!isLoading && !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Product Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/products")} variant="outline">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  // If still loading or no product, don't render the main content
  if (!product) {
    return null;
  }

  const isInWishlist = checkIsInWishlist(product.id);
  const isInStock = (product.stock ?? 0) > 0;

  // Check if product is in cart and get quantity
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  // Check if we can add more items (cart quantity hasn't reached stock limit)
  const canAddMore = cartQuantity < (product.stock ?? 0);

  const handleWishlistToggle = () => {
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

  const handleIncreaseQuantity = async () => {
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

  const handleDecreaseQuantity = async () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Enhanced Header with Breadcrumb */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 px-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </Button>
              <div className="hidden sm:flex items-center text-sm text-gray-500">
                <span>Products</span>
                <span className="mx-2">/</span>
                <span className="text-gray-700 font-medium">
                  {product.category}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWishlistToggle}
                className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist
                      ? "fill-red-500 stroke-red-500"
                      : "stroke-gray-400"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Gallery Section */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Main Product Image */}
              <div
                className="relative aspect-square w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden group"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  src={currentImageUrl}
                  alt={product.productName || "Product"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                    !isInStock ? "grayscale" : ""
                  }`}
                  priority
                />

                {/* Premium Floating Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                  <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 shadow-lg font-semibold px-2.5 py-1 text-xs rounded-full">
                    {product.category}
                  </Badge>
                  {product.actualPrice > product.finalPrice && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg font-bold px-2.5 py-1 text-xs rounded-full">
                      {product.discount}% OFF
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg font-bold px-2.5 py-1 text-xs rounded-full">
                      ⭐ Featured
                    </Badge>
                  )}
                </div>

                {/* Image Navigation */}
                {hasMultipleImages && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0 rounded-full text-gray-700 hover:text-gray-900 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={previousImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0 rounded-full text-gray-700 hover:text-gray-900 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Out of Stock Overlay */}
                {!isInStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <Badge className="bg-red-600 text-white text-base py-2 px-4 shadow-2xl font-bold rounded-full">
                        Out of Stock
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
                  {productImages.slice(0, 5).map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                        index === currentImageIndex
                          ? "ring-2 ring-blue-500 shadow-lg scale-105"
                          : "hover:shadow-md hover:scale-102"
                      }`}
                      onClick={() => selectImage(index)}
                    >
                      <Image
                        src={image || "/placeholder-product.jpg"}
                        alt={`${product.productName} view ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-1 space-y-4">
            {/* Product Header */}
            <div className="space-y-3">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2">
                  {product.productName}
                </h1>
                <p className="text-base text-gray-600 font-medium">
                  {product.subCategory || product.category}
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-base font-semibold text-gray-700">
                  4.5
                </span>
                <span className="text-gray-500 text-sm">(12)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/60">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">
                    £{(product.finalPrice || 0).toFixed(2)}
                  </span>
                  {product.actualPrice > product.finalPrice && (
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500 line-through">
                        £{(product.actualPrice || 0).toFixed(2)}
                      </span>
                      <Badge className="bg-green-100 text-green-800 px-1.5 py-0.5 text-xs font-semibold">
                        Save £
                        {(
                          product.actualPrice - product.finalPrice || 0
                        ).toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>

                {isInStock ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-semibold text-sm">
                      In Stock
                    </span>
                    <span className="text-gray-500 text-xs">
                      ({product.stock} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-semibold text-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-3">
              {!isInStock ? (
                <Button
                  className="w-full h-10 bg-gray-200 text-gray-500 cursor-not-allowed font-bold rounded-lg text-sm"
                  disabled
                >
                  Unavailable
                </Button>
              ) : isInCart ? (
                <div className="bg-white border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg">
                  <div className="flex items-center h-10">
                    <Button
                      size="icon"
                      className="h-full w-10 rounded-none bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleDecreaseQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center bg-blue-50 h-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-lg">
                        {cartQuantity}
                      </span>
                    </div>
                    <Button
                      size="icon"
                      className="h-full w-10 rounded-none bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      onClick={handleIncreaseQuantity}
                      disabled={!canAddMore}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-3 w-3" />
                  Add to Cart
                </Button>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-8 rounded-lg border font-semibold hover:bg-gray-50 text-xs"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`mr-1 h-3 w-3 ${
                      isInWishlist ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {isInWishlist ? "Saved" : "Save"}
                </Button>
                {product.deliveryType && (
                  <div className="h-8 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-semibold text-xs">
                        {product.deliveryType}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Features - Compact */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200/60">
              <h3 className="font-bold text-amber-800 text-sm mb-2">
                🌟 Quality Promise
              </h3>
              <ul className="space-y-1 text-amber-700 text-xs">
                <li className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Fresh from farms</span>
                </li>
                <li className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Quality guaranteed</span>
                </li>
                <li className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Best prices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Product Details Section */}
        <div className="mt-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Description Card */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  📝 Product Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description ||
                    "This premium quality product is carefully selected to ensure the best taste and nutritional value. Perfect for your daily needs."}
                </p>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1.5 text-sm font-medium rounded-full"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications Card */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  📊 Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {product.shelfLife && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="font-semibold text-gray-700">
                        Shelf Life
                      </span>
                      <span className="text-gray-900 font-bold">
                        {product.shelfLife} days
                      </span>
                    </div>
                  )}

                  {product.storageInstructions &&
                    product.storageInstructions !== "NA" && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="font-semibold text-gray-700">
                          Storage
                        </span>
                        <span className="text-gray-900 font-medium text-right max-w-xs">
                          {product.storageInstructions}
                        </span>
                      </div>
                    )}

                  {product.maxPurchaseLimit && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="font-semibold text-gray-700">
                        Max Limit
                      </span>
                      <span className="text-gray-900 font-bold">
                        {product.maxPurchaseLimit} items
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700">
                      Product Code
                    </span>
                    <span className="text-gray-900 font-mono font-bold">
                      {product.productCode || product.id}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                You Might Also Like
              </h2>
              <p className="text-gray-600 text-lg">
                Discover more amazing products from the same category
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedIsInStock = (relatedProduct.stock ?? 0) > 0;
                const relatedCartItem = items.find(
                  (item) => item.product.id === relatedProduct.id
                );
                const relatedIsInCart = !!relatedCartItem;

                return (
                  <Card
                    key={relatedProduct.id}
                    className="bg-white border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group"
                    onClick={() =>
                      router.push(`/products/${relatedProduct.id}`)
                    }
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={
                          relatedProduct.productImages?.[0] ||
                          "/placeholder-product.jpg"
                        }
                        alt={relatedProduct.productName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                          !relatedIsInStock ? "grayscale" : ""
                        }`}
                      />

                      {/* Floating Badges */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/95 backdrop-blur-sm text-gray-700 border-0 shadow-lg text-xs px-2 py-1 rounded-full">
                          {relatedProduct.category}
                        </Badge>
                      </div>

                      {relatedProduct.actualPrice >
                        relatedProduct.finalPrice && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg font-bold text-xs px-2 py-1 rounded-full">
                            {relatedProduct.discount}% OFF
                          </Badge>
                        </div>
                      )}

                      {!relatedIsInStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Badge className="bg-red-600 text-white text-sm py-1 px-3 rounded-full">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-2">
                        {relatedProduct.productName}
                      </h3>

                      <div className="flex items-center space-x-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          (4.5)
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xl font-bold text-blue-600">
                          £{relatedProduct.finalPrice}
                        </span>
                        {relatedProduct.actualPrice >
                          relatedProduct.finalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            £{relatedProduct.actualPrice}
                          </span>
                        )}
                      </div>

                      {relatedIsInStock && (
                        <div className="flex items-center space-x-1 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">
                            In Stock
                          </span>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      {!relatedIsInStock ? (
                        <Button
                          className="w-full bg-gray-200 text-gray-500 cursor-not-allowed text-sm h-10 rounded-xl"
                          disabled
                          onClick={(e) => e.stopPropagation()}
                        >
                          Out of Stock
                        </Button>
                      ) : relatedIsInCart ? (
                        <div
                          className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl p-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full border-blue-300 hover:bg-blue-100"
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  if (relatedCartItem!.quantity > 1) {
                                    await updateQuantity(
                                      relatedProduct.id,
                                      relatedCartItem!.quantity - 1
                                    );
                                  } else {
                                    await updateQuantity(relatedProduct.id, 0);
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error updating quantity:",
                                    error
                                  );
                                }
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-bold text-blue-700">
                              {relatedCartItem!.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full border-blue-300 hover:bg-blue-100 disabled:opacity-50"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (
                                  relatedCartItem!.quantity >=
                                  (relatedProduct.stock ?? 0)
                                ) {
                                  toast({
                                    title: "Stock limit reached",
                                    description: `Only ${relatedProduct.stock} items available in stock.`,
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                try {
                                  await updateQuantity(
                                    relatedProduct.id,
                                    relatedCartItem!.quantity + 1
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error updating quantity:",
                                    error
                                  );
                                }
                              }}
                              disabled={
                                relatedCartItem!.quantity >=
                                (relatedProduct.stock ?? 0)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm h-10 rounded-xl font-semibold"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) {
                              toast({
                                title: "Login Required",
                                description:
                                  "Please log in to add items to your cart.",
                                variant: "destructive",
                              });
                              return;
                            }
                            try {
                              await addToCart(relatedProduct.id, 1);
                              await fetchCart();
                              toast({
                                title: `${relatedProduct.productName} added to cart!`,
                                description:
                                  "Item successfully added to your cart.",
                              });
                            } catch (error) {
                              console.error("Error adding to cart:", error);
                              toast({
                                title: "Error adding to cart",
                                description:
                                  "Failed to add item to cart. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {isLoadingRelated && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
