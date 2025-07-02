"use client";

import { useCartStore, useCouponStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  MinusCircle,
  PlusCircle,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Gift,
  Sparkles,
  Truck,
  Shield,
  Tag,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import RecommendedProducts from "./RecommendedProducts";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";

export default function CartDisplay() {
  const {
    items,
    removeItem,
    updateQuantity,
    getCartTotal,
    clearCart,
    fetchCart,
    isLoading,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const {
    appliedCoupon,
    applyCouponToCart,
    removeCoupon,
    isLoading: isCouponLoading,
    coupons,
    fetchCoupons,
    getAvailableCoupons,
  } = useCouponStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  // Fetch cart data when component mounts or user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchCoupons(); // Fetch available coupons
    }
  }, [isAuthenticated, fetchCart, fetchCoupons]);

  // Debug available coupons
  useEffect(() => {
    const availableCoupons = getAvailableCoupons();
    console.log("🎫 Available coupons:", availableCoupons);
    console.log("🎫 All coupons:", coupons);
  }, [coupons, getAvailableCoupons]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 25 ? 0 : 1.99; // Free shipping over £25
  const savings = subtotal > 25 ? 1.99 : 0;

  // Calculate discount amount if coupon is applied
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.coupon.discountType === "percentage") {
      discountAmount = (subtotal * appliedCoupon.coupon.discountValue) / 100;
      if (appliedCoupon.coupon.discountMaxLimit) {
        discountAmount = Math.min(
          discountAmount,
          appliedCoupon.coupon.discountMaxLimit
        );
      }
    } else {
      discountAmount = appliedCoupon.coupon.discountValue;
    }
    discountAmount = Math.min(discountAmount, subtotal); // Can't discount more than subtotal
  }

  const total = subtotal + shipping - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponError("");
    const result = await applyCouponToCart(couponCode, subtotal);
    if (!result.success) {
      setCouponError(
        result.message || "Invalid coupon code or coupon not applicable"
      );
    } else {
      setCouponCode("");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponError("");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-8 sm:py-16 bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl">
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-emerald-100 to-lime-100 dark:from-emerald-900 dark:to-lime-900 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600" />
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-700" />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Your cart is empty
              </h3>
              <p className="text-muted-foreground text-base sm:text-lg">
                Start adding some fresh groceries to get started!
              </p>
            </div>

            <div className="pt-2 sm:pt-4">
              <Link href="/" passHref>
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8 max-w-4xl mx-auto">
      {/* Cart Items */}
      <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-lime-50 dark:from-emerald-950/20 dark:to-lime-950/20 border-b border-emerald-100 dark:border-emerald-800">
          <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            Your Cart ({items.length} item{items.length !== 1 ? "s" : ""})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-900/20 dark:to-gray-800/20 hover:from-emerald-50/50 hover:to-lime-50/50 dark:hover:from-emerald-950/20 dark:hover:to-lime-950/20 transition-all duration-200 border border-gray-200 dark:border-gray-700"
              >
                {/* Mobile Layout */}
                <div className="flex items-center gap-3 sm:hidden">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-lime-100 dark:from-emerald-900 dark:to-lime-900 p-1">
                      <Image
                        src={
                          item.product.productImages?.[0] ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.product.productName || "Product"}
                        width={64}
                        height={64}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {item.product.productName}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      >
                        {item.product.category}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 mt-1 block">
                      £{item.product.finalPrice || 0}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.product.id)}
                    className="h-8 w-8 rounded-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Mobile Quantity and Total Row */}
                <div className="flex items-center justify-between sm:hidden">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 rounded-full border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-900/20"
                    >
                      <MinusCircle className="h-3 w-3" />
                    </Button>

                    <span className="min-w-[2rem] text-center font-semibold text-sm">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="h-8 w-8 rounded-full border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-900/20"
                    >
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      £
                      {((item.product.finalPrice || 0) * item.quantity).toFixed(
                        2
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:items-center sm:gap-4 sm:w-full">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-lime-100 dark:from-emerald-900 dark:to-lime-900 p-1">
                      <Image
                        src={
                          item.product.productImages?.[0] ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.product.productName || "Product"}
                        width={80}
                        height={80}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg text-foreground truncate">
                      {item.product.productName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      >
                        {item.product.category}
                      </Badge>
                      <span className="text-lg font-bold text-emerald-600">
                        £{item.product.finalPrice || 0}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="h-10 w-10 rounded-full border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-900/20"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>

                    <span className="min-w-[3rem] text-center font-semibold text-lg">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="h-10 w-10 rounded-full border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-900/20"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Item Total and Remove Button */}
                  <div className="flex items-center gap-4">
                    <div className="text-right min-w-[6rem]">
                      <div className="text-xl font-bold text-foreground">
                        £
                        {(
                          (item.product.finalPrice || 0) * item.quantity
                        ).toFixed(2)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                      className="h-10 w-10 rounded-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="grid gap-4 sm:gap-8 grid-cols-1 md:grid-cols-2">
        {/* Left Column - Benefits */}
        <div className="space-y-3 sm:space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0 shadow-lg rounded-xl sm:rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg">
                  Free Shipping
                </h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                {subtotal > 25 ? (
                  <span className="text-green-600 font-medium">
                    🎉 You qualify for free shipping!
                  </span>
                ) : (
                  <span>
                    Add £{(25 - subtotal).toFixed(2)} more for free shipping
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-0 shadow-lg rounded-xl sm:rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg">
                  100% Fresh Guarantee
                </h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                If you're not satisfied, we'll replace or refund your order.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-xl sm:rounded-2xl">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                <Gift className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
              </div>
              Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex justify-between text-base sm:text-lg">
              <span>Subtotal:</span>
              <span className="font-semibold">£{subtotal.toFixed(2)}</span>
            </div>

            {/* Coupon Application Section */}
            <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50/50 to-lime-50/50 dark:from-emerald-950/10 dark:to-lime-950/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                <span className="font-medium text-xs sm:text-sm">
                  Have a coupon?
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                  className="ml-auto h-5 sm:h-6 px-1.5 sm:px-2 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                >
                  {showAvailableCoupons
                    ? "Hide"
                    : `Show available (${
                        getAvailableCoupons().filter(
                          (userCoupon, index, self) =>
                            index ===
                            self.findIndex(
                              (c) =>
                                c.coupon.couponId === userCoupon.coupon.couponId
                            )
                        ).length
                      })`}
                </Button>
              </div>
              <div>
                {showAvailableCoupons && (
                  <div className="mb-3 p-3 bg-white/50 dark:bg-gray-900/30 rounded-lg border border-emerald-100 dark:border-emerald-800">
                    <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                      Available Coupon Codes:
                    </h4>
                    {getAvailableCoupons().length > 0 ? (
                      <div className="space-y-2">
                        {getAvailableCoupons()
                          .filter(
                            (userCoupon, index, self) =>
                              index ===
                              self.findIndex(
                                (c) =>
                                  c.coupon.couponId ===
                                  userCoupon.coupon.couponId
                              )
                          )
                          .map((userCoupon) => (
                            <div
                              key={userCoupon.coupon.couponId}
                              className="flex items-center justify-between p-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-md border border-emerald-200 dark:border-emerald-700"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <code className="text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded">
                                    {userCoupon.coupon.code}
                                  </code>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {userCoupon.coupon.discountType ===
                                    "percentage"
                                      ? `${userCoupon.coupon.discountValue}% OFF`
                                      : `£${userCoupon.coupon.discountValue} OFF`}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {userCoupon.coupon.description}
                                </p>
                                {userCoupon.coupon.minimumOrderValue && (
                                  <p className="text-xs text-orange-600 dark:text-orange-400">
                                    Min order: £
                                    {userCoupon.coupon.minimumOrderValue}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCouponCode(userCoupon.coupon.code);
                                  setShowAvailableCoupons(false);
                                }}
                                className="ml-2 h-7 px-3 text-xs border-emerald-200 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-950/20"
                              >
                                Use
                              </Button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No available coupons at the moment.
                      </p>
                    )}
                  </div>
                )}
              </div>
              {appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700 dark:text-green-400">
                        {appliedCoupon.coupon.code}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="h-6 w-6 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {appliedCoupon.coupon.description}
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1 text-sm uppercase"
                    disabled={isCouponLoading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    disabled={isCouponLoading || !couponCode.trim()}
                    className="px-4"
                  >
                    {isCouponLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {couponError}
                </p>
              )}
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-base sm:text-lg text-green-600">
                <span>Discount Applied:</span>
                <span className="font-semibold">
                  -£{discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-base sm:text-lg">
              <span>Shipping:</span>
              <span
                className={`font-semibold ${
                  shipping === 0 ? "text-green-600" : ""
                }`}
              >
                {shipping === 0 ? "FREE" : `£${shipping.toFixed(2)}`}
              </span>
            </div>

            {savings > 0 && (
              <div className="flex justify-between text-base sm:text-lg text-green-600">
                <span>Savings:</span>
                <span className="font-semibold">-£{savings.toFixed(2)}</span>
              </div>
            )}

            <hr className="border-emerald-200 dark:border-emerald-700" />

            <div className="flex justify-between text-lg sm:text-xl font-bold">
              <span>Total:</span>
              <span className="text-emerald-600">£{total.toFixed(2)}</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 sm:gap-3 pt-4 sm:pt-6">
            <Button
              asChild
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group text-sm sm:text-base py-2 sm:py-3"
            >
              <Link
                href="/checkout"
                className="flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20 text-sm sm:text-base py-2 sm:py-3"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts />
    </div>
  );
}
