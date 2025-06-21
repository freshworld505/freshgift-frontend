"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { sampleProducts } from "@/lib/products";
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
import { ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/api/cartApi";
import { formatCurrency, convertINRtoGBP } from "@/lib/currency";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchCart } = useCartStore();
  const { user, isAuthenticated, addToWishlist, removeFromWishlist } =
    useAuthStore();

  const productIdParam = params.id;
  const productId = Array.isArray(productIdParam)
    ? productIdParam[0]
    : productIdParam;

  const product: Product | undefined = sampleProducts.find(
    (p) => p.id === productId
  );

  if (!product) {
    notFound();
  }

  const isInWishlist = isAuthenticated && user?.wishlist?.includes(product.id);

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
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center text-primary hover:underline mb-6 px-0 hover:bg-transparent"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            <Image
              src={product.productImages?.[0] || "/placeholder-product.jpg"}
              alt={product.productName || "Product"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              data-ai-hint={product.dataAiHint || "product detail image"}
            />
          </div>
          <div className="flex flex-col">
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl lg:text-4xl font-bold mb-2">
                    {product.productName}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground mb-4">
                    {product.category}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary rounded-full hover:bg-primary/10 mt-1"
                  onClick={handleWishlistToggle}
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-7 w-7 ${
                      isInWishlist
                        ? "fill-primary stroke-primary"
                        : "stroke-primary"
                    }`}
                  />
                </Button>
              </div>
              <p className="text-3xl lg:text-4xl font-extrabold text-primary mb-4">
                {formatCurrency(convertINRtoGBP(product.finalPrice || 0))}
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-grow">
              <h3 className="text-xl font-semibold mb-2">
                Product Description
              </h3>
              <p className="text-base text-foreground leading-relaxed">
                {product.description || "No description available."}
              </p>
            </CardContent>
            <CardFooter className="p-6 border-t">
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-lg"
                onClick={handleAddToCart}
                aria-label={`Add ${product.productName} to cart`}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
