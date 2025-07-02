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

      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Image Section */}
          <div className="space-y-2">
            {/* Main Product Image */}
            <div className="relative aspect-square w-full max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group">
              <Image
                src={product.productImages?.[0] || "/placeholder-product.jpg"}
                alt={product.productName || "Product"}
                fill
                sizes="(max-width: 1024px) 400px, 320px"
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  !isInStock ? "grayscale" : ""
                }`}
                priority
                data-ai-hint={product.dataAiHint || "product detail image"}
              />

              {/* Floating Action Badges */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                <div className="space-y-1">
                  <Badge className="bg-white/95 backdrop-blur-sm text-gray-700 border-0 shadow-sm font-medium px-2 py-1 text-xs">
                    {product.category}
                  </Badge>
                  {product.actualPrice > product.finalPrice && (
                    <Badge
                      variant="destructive"
                      className="shadow-sm font-bold px-2 py-1 text-xs"
                    >
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-sm transition-all duration-300 hover:scale-110 w-8 h-8 border-0"
                  onClick={handleWishlistToggle}
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-3.5 w-3.5 transition-all duration-300 ${
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
                    className="text-sm py-1.5 px-4 shadow-lg font-bold"
                  >
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.productImages && product.productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
                {product.productImages.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden bg-white border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${product.productName} view ${index + 2}`}
                      fill
                      sizes="80px"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            {/* Header Section */}
            <div className="space-y-3">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.productName}
                </h1>
                <p className="text-lg text-gray-600">
                  {product.subCategory || product.category}
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-base font-medium text-gray-700">4.5</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-green-700">
                  £{product.finalPrice || 0}
                </span>
                {product.actualPrice > product.finalPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-500 line-through">
                      £{product.actualPrice || 0}
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-300 px-2 py-1 text-sm">
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
                  <span className="text-green-700 font-medium">In Stock</span>
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-3">
              {!isInStock ? (
                <Button
                  className="w-full h-12 bg-gray-100 text-gray-500 cursor-not-allowed font-semibold text-base rounded-xl"
                  disabled
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Out of Stock
                </Button>
              ) : isInCart ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-center text-green-700 font-semibold mb-3">
                    Item in cart
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-10 w-10 rounded-full border-2 border-green-300 hover:bg-green-100 transition-colors"
                      onClick={handleDecreaseQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {cartQuantity}
                      </div>
                      <div className="text-sm text-green-600">in cart</div>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-10 w-10 rounded-full border-2 border-green-300 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleIncreaseQuantity}
                      disabled={!canAddMore}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-green-700 font-semibold">
                      Total: £
                      {((product.finalPrice || 0) * cartQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleAddToCart}
                  aria-label={`Add ${product.productName} to cart`}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              )}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              {product.deliveryType && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="font-semibold text-blue-900 text-sm">
                    {product.deliveryType}
                  </p>
                  <p className="text-xs text-blue-700">Delivery</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
              <CardTitle className="text-xl font-bold text-gray-900">
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Description & Tags */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {product.description || "No description available."}
                    </p>
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 px-3 py-1 text-sm font-medium"
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Specifications
                  </h3>
                  <div className="space-y-2">
                    {product.shelfLife && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-semibold text-gray-700 text-sm">
                          Shelf Life
                        </span>
                        <span className="text-gray-900 font-medium text-sm">
                          {product.shelfLife} days
                        </span>
                      </div>
                    )}

                    {product.storageInstructions &&
                      product.storageInstructions !== "NA" && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="font-semibold text-gray-700 text-sm">
                            Storage Instructions
                          </span>
                          <span className="text-gray-900 font-medium text-right max-w-xs text-sm">
                            {product.storageInstructions}
                          </span>
                        </div>
                      )}

                    {product.maxPurchaseLimit && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-semibold text-gray-700 text-sm">
                          Max Purchase Limit
                        </span>
                        <span className="text-gray-900 font-medium text-sm">
                          {product.maxPurchaseLimit} items
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700 text-sm">
                        Product Code
                      </span>
                      <span className="text-gray-900 font-mono text-sm">
                        {product.productCode || product.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Similar Products
              </h2>
              <p className="text-gray-600 text-sm">
                More great products from this category
              </p>
            </div>

            <div className="relative">
              {/* Horizontal Scrolling Container */}
              <div className="flex gap-3 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory scrollbar-hide">
                {relatedProducts.map((relatedProduct) => {
                  const relatedIsInStock = (relatedProduct.stock ?? 0) > 0;
                  const relatedCartItem = items.find(
                    (item) => item.product.id === relatedProduct.id
                  );
                  const relatedIsInCart = !!relatedCartItem;

                  return (
                    <Card
                      key={relatedProduct.id}
                      className="min-w-[200px] lg:min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer snap-start"
                      onClick={() =>
                        router.push(`/products/${relatedProduct.id}`)
                      }
                    >
                      <div className="relative aspect-square rounded-t-lg overflow-hidden">
                        <Image
                          src={
                            relatedProduct.productImages?.[0] ||
                            "/placeholder-product.jpg"
                          }
                          alt={relatedProduct.productName}
                          fill
                          sizes="(max-width: 1024px) 200px, 240px"
                          className={`object-cover transition-all duration-300 ${
                            !relatedIsInStock ? "grayscale" : ""
                          }`}
                        />

                        {/* Category Badge */}
                        <Badge className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-gray-700 border-0 shadow-sm text-xs px-2 py-1">
                          {relatedProduct.category}
                        </Badge>

                        {/* Discount Badge */}
                        {relatedProduct.actualPrice >
                          relatedProduct.finalPrice && (
                          <Badge
                            variant="destructive"
                            className="absolute top-2 right-2 shadow-sm font-bold text-xs px-2 py-1"
                          >
                            {relatedProduct.discount}% OFF
                          </Badge>
                        )}

                        {/* Out of Stock Overlay */}
                        {!relatedIsInStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge
                              variant="destructive"
                              className="text-xs py-1 px-2"
                            >
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">
                            {relatedProduct.productName}
                          </h3>

                          <div className="flex items-center space-x-1">
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

                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-green-600">
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
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">
                                In Stock
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-3 pt-0">
                        {!relatedIsInStock ? (
                          <Button
                            className="w-full bg-gray-100 text-gray-500 cursor-not-allowed text-xs h-8"
                            disabled
                            onClick={(e) => e.stopPropagation()}
                          >
                            Out of Stock
                          </Button>
                        ) : relatedIsInCart ? (
                          <div
                            className="w-full bg-green-50 border border-green-200 rounded-lg p-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 rounded-full border-green-300 hover:bg-green-100 transition-colors flex-shrink-0"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    if (relatedCartItem!.quantity > 1) {
                                      await updateQuantity(
                                        relatedProduct.id,
                                        relatedCartItem!.quantity - 1
                                      );
                                    } else {
                                      await updateQuantity(
                                        relatedProduct.id,
                                        0
                                      );
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
                              <div className="text-center flex-1">
                                <div className="text-sm font-bold text-green-700">
                                  {relatedCartItem!.quantity}
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 rounded-full border-green-300 hover:bg-green-100 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8"
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
                            <ShoppingCart className="mr-1 h-3 w-3" />
                            Add to Cart
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Scroll Indicators */}
              {relatedProducts.length > 3 && (
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-1">
                    {Array.from({
                      length: Math.ceil(relatedProducts.length / 3),
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="w-1.5 h-1.5 rounded-full bg-gray-300"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Loading State for Related Products */}
            {isLoadingRelated && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
