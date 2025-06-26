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
import { formatCurrency, convertINRtoGBP } from "@/lib/currency";
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
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center text-primary hover:underline mb-6 px-0 hover:bg-transparent"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="overflow-hidden shadow-xl border border-border/50 bg-white/80 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            <Image
              src={product.productImages?.[0] || "/placeholder-product.jpg"}
              alt={product.productName || "Product"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover ${!isInStock ? "grayscale" : ""}`}
              priority
              data-ai-hint={product.dataAiHint || "product detail image"}
            />

            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-sm font-medium py-1 px-3"
            >
              {product.category}
            </Badge>

            {!isInStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg py-2 px-4">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col">
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-3xl lg:text-4xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {product.productName}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground mb-4">
                    {product.subCategory || product.category}
                  </CardDescription>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      (4.5)
                    </span>
                  </div>
                </div>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 rounded-full hover:bg-red-50 mt-1 transition-all duration-300 hover:scale-110"
                  onClick={handleWishlistToggle}
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-7 w-7 transition-all duration-300 ${
                      isInWishlist
                        ? "fill-red-500 stroke-red-500"
                        : "stroke-red-500"
                    }`}
                  />
                </Button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-3xl lg:text-4xl font-extrabold text-primary">
                  £{product.finalPrice || 0}
                </p>
                {product.actualPrice > product.finalPrice && (
                  <>
                    <p className="text-xl text-muted-foreground line-through">
                      £{product.actualPrice || 0}
                    </p>
                    <Badge variant="destructive" className="text-sm">
                      {product.discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Info */}
              {isInStock && (
                <p className="text-sm text-muted-foreground mb-4">
                  {product.stock} items in stock
                </p>
              )}
            </CardHeader>

            <CardContent className="p-6 pt-0 flex-grow">
              <h3 className="text-xl font-semibold mb-3">
                Product Description
              </h3>
              <p className="text-base text-foreground leading-relaxed mb-4">
                {product.description || "No description available."}
              </p>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.deliveryType && (
                  <div>
                    <span className="font-medium">Delivery:</span>
                    <p className="text-muted-foreground">
                      {product.deliveryType}
                    </p>
                  </div>
                )}
                {product.shelfLife && (
                  <div>
                    <span className="font-medium">Shelf Life:</span>
                    <p className="text-muted-foreground">
                      {product.shelfLife} days
                    </p>
                  </div>
                )}
                {product.returnable !== undefined && (
                  <div>
                    <span className="font-medium">Returnable:</span>
                    <p className="text-muted-foreground">
                      {product.returnable ? "Yes" : "No"}
                    </p>
                  </div>
                )}
                {product.storageInstructions &&
                  product.storageInstructions !== "NA" && (
                    <div>
                      <span className="font-medium">Storage:</span>
                      <p className="text-muted-foreground">
                        {product.storageInstructions}
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>

            {/* Footer with Add to Cart */}
            <CardFooter className="p-6 border-t">
              {!isInStock ? (
                <Button
                  className="w-full bg-gray-400 text-gray-600 cursor-not-allowed font-medium py-3 text-lg"
                  disabled
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Out of Stock
                </Button>
              ) : isInCart ? (
                <div className="flex items-center gap-4 w-full bg-primary/10 rounded-lg p-3">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-10 w-10 p-0 rounded-md hover:bg-primary/20 transition-colors"
                    onClick={handleDecreaseQuantity}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="flex-1 text-center text-lg font-semibold text-primary">
                    {cartQuantity} in cart
                  </span>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-10 w-10 p-0 rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleIncreaseQuantity}
                    disabled={!canAddMore}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white hover:scale-[1.02] hover:shadow-md font-medium py-3 text-lg transition-all duration-300"
                  onClick={handleAddToCart}
                  aria-label={`Add ${product.productName} to cart`}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
