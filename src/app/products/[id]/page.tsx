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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/api/cartApi";
import { getProductById } from "@/api/productApi";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchCart, items, updateQuantity } = useCartStore();
  const { user, isAuthenticated, addToWishlist, removeFromWishlist } =
    useAuthStore();

  // Local state for product data
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

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

  const isInWishlist = isAuthenticated && user?.wishlist?.includes(product.id);
  const isInStock = (product.stock ?? 0) > 0;

  // Check if product is in cart and get quantity
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  // Check if we can add more items (cart quantity hasn't reached stock limit)
  const canAddMore = cartQuantity < (product.stock ?? 0);

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      {/* Header with Back Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 px-0 hover:bg-transparent group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Products
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="relative aspect-square w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group">
              <Image
                src={product.productImages?.[0] || "/placeholder-product.jpg"}
                alt={product.productName || "Product"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                  !isInStock ? "grayscale" : ""
                }`}
                priority
                data-ai-hint={product.dataAiHint || "product detail image"}
              />

              {/* Floating Action Badges */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                <div className="space-y-2">
                  <Badge className="bg-white/95 backdrop-blur-sm text-gray-700 border-0 shadow-lg font-medium px-4 py-2">
                    {product.category}
                  </Badge>
                  {product.actualPrice > product.finalPrice && (
                    <Badge
                      variant="destructive"
                      className="shadow-lg font-bold px-4 py-2"
                    >
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 hover:scale-110 w-12 h-12 border-0"
                  onClick={handleWishlistToggle}
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-300 ${
                      isInWishlist
                        ? "fill-red-500 stroke-red-500"
                        : "stroke-gray-600 hover:stroke-red-500"
                    }`}
                  />
                </Button>
              </div>

              {/* Out of Stock Overlay */}
              {!isInStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <Badge
                    variant="destructive"
                    className="text-lg py-3 px-8 shadow-xl font-bold"
                  >
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.productImages && product.productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.productImages.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${product.productName} view ${index + 2}`}
                      fill
                      sizes="120px"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {product.productName}
                </h1>
                <p className="text-xl text-gray-600">
                  {product.subCategory || product.category}
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-700">4.5</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">128 reviews</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-5xl font-bold text-green-700">
                  £{product.finalPrice || 0}
                </span>
                {product.actualPrice > product.finalPrice && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-gray-500 line-through">
                      £{product.actualPrice || 0}
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                      Save £
                      {(product.actualPrice - product.finalPrice || 0).toFixed(
                        2
                      )}
                    </Badge>
                  </div>
                )}
              </div>

              {isInStock && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    {product.stock} items available
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              {!isInStock ? (
                <Button
                  className="w-full h-16 bg-gray-100 text-gray-500 cursor-not-allowed font-semibold text-lg rounded-2xl"
                  disabled
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Out of Stock
                </Button>
              ) : isInCart ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                  <p className="text-center text-green-700 font-semibold mb-4">
                    Item in cart
                  </p>
                  <div className="flex items-center justify-center gap-6">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-14 w-14 rounded-full border-2 border-green-300 hover:bg-green-100 transition-colors"
                      onClick={handleDecreaseQuantity}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700">
                        {cartQuantity}
                      </div>
                      <div className="text-sm text-green-600">in cart</div>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-14 w-14 rounded-full border-2 border-green-300 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleIncreaseQuantity}
                      disabled={!canAddMore}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-green-700 font-semibold">
                      Total: £
                      {((product.finalPrice || 0) * cartQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleAddToCart}
                  aria-label={`Add ${product.productName} to cart`}
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Add to Cart
                </Button>
              )}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {product.deliveryType && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-blue-900">
                    {product.deliveryType}
                  </p>
                  <p className="text-sm text-blue-700">Delivery</p>
                </div>
              )}

              {product.returnable !== undefined && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ArrowLeft className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="font-semibold text-purple-900">
                    {product.returnable ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-purple-700">Returnable</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-16">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-8">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Description & Tags */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.description || "No description available."}
                    </p>
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {product.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 px-4 py-2 text-sm font-medium"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Specifications
                  </h3>
                  <div className="space-y-4">
                    {product.shelfLife && (
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <span className="font-semibold text-gray-700">
                          Shelf Life
                        </span>
                        <span className="text-gray-900 font-medium">
                          {product.shelfLife} days
                        </span>
                      </div>
                    )}

                    {product.storageInstructions &&
                      product.storageInstructions !== "NA" && (
                        <div className="flex justify-between items-center py-4 border-b border-gray-200">
                          <span className="font-semibold text-gray-700">
                            Storage Instructions
                          </span>
                          <span className="text-gray-900 font-medium text-right max-w-xs">
                            {product.storageInstructions}
                          </span>
                        </div>
                      )}

                    {product.maxPurchaseLimit && (
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <span className="font-semibold text-gray-700">
                          Max Purchase Limit
                        </span>
                        <span className="text-gray-900 font-medium">
                          {product.maxPurchaseLimit} items
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">
                        Product Code
                      </span>
                      <span className="text-gray-900 font-mono">
                        {product.productCode || product.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
