"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCartStore,
  useAuthStore,
  useOrderStore,
  useCouponStore,
} from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  formatCurrency,
  getStripeCompatibleAmount,
  getCurrencyCode,
  convertINRtoGBP,
} from "@/lib/currency";
import type {
  TimeSlot,
  CreateOrderRequest,
  OrderDeliveryType,
  PaymentMethod,
  PaymentStatus,
  Address,
} from "@/lib/types";
import {
  MapPin,
  Clock,
  CreditCard,
  Shield,
  Truck,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent, confirmPaymentIntent } from "@/api/payment";
import StripePaymentForm from "./StripePaymentForm";
import SelectAddress from "./SelectAddress";

// Initialize Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51QZJQiJL6O9wYf8fJH8e7mJN3nJpeTVdGVjQoJCZE3v7ZlYmn6V9e5VdgXjfhO6xjdw7GhJKOGnDXODMjpPjCHKC00bSm8PmEu"
);

// Function to convert common country names to ISO 3166-1 alpha-2 country codes
const convertToCountryCode = (country: string): string => {
  const countryMapping: { [key: string]: string } = {
    // United States
    usa: "US",
    "united states": "US",
    "united states of america": "US",
    america: "US",

    // United Kingdom
    uk: "GB",
    "united kingdom": "GB",
    "great britain": "GB",
    britain: "GB",
    england: "GB",
    scotland: "GB",
    wales: "GB",

    // Canada
    canada: "CA",

    // Australia
    australia: "AU",

    // Germany
    germany: "DE",
    deutschland: "DE",

    // France
    france: "FR",

    // India
    india: "IN",

    // Japan
    japan: "JP",

    // China
    china: "CN",

    // Brazil
    brazil: "BR",

    // Italy
    italy: "IT",

    // Spain
    spain: "ES",

    // Netherlands
    netherlands: "NL",
    holland: "NL",

    // Switzerland
    switzerland: "CH",

    // Norway
    norway: "NO",

    // Sweden
    sweden: "SE",

    // Denmark
    denmark: "DK",

    // Ireland
    ireland: "IE",
  };

  const normalizedCountry = country.toLowerCase().trim();

  // Check if it's already a 2-letter country code
  if (normalizedCountry.length === 2 && /^[A-Z]{2}$/i.test(normalizedCountry)) {
    return normalizedCountry.toUpperCase();
  }

  // Look for mapping
  return countryMapping[normalizedCountry] || "US"; // Default to US if not found
};

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  streetAddress: z.string().min(5, "Street address is required."),
  city: z.string().min(2, "City is required."),
  zipCode: z.string().min(5, "Valid ZIP code is required."),
  country: z.string().min(2, "Country is required."),
  deliveryTimeSlot: z.string().min(1, "Please select a delivery time slot."),
});

const availableTimeSlots: TimeSlot[] = [
  {
    id: "ts1",
    label: "Today, 2:00 PM - 4:00 PM",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "ts2",
    label: "Tomorrow, 10:00 AM - 06:00 PM",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  },
  {
    id: "ts3",
    label: "Day after Tomorrow, 10:00 AM - 6:00 PM",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  },
];

export default function CheckoutForm() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder, isLoading: isOrderLoading } = useOrderStore();
  const { appliedCoupon, appliedDiscount } = useCouponStore();
  const [isClient, setIsClient] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentIntentData, setPaymentIntentData] = useState<{
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    discountAmount: number;
  } | null>(null);
  const [checkoutData, setCheckoutData] = useState<{
    values: z.infer<typeof checkoutSchema>;
    scheduledTime: string;
    userInstructions: string;
    selectedAddress: Address | null;
  } | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (items.length === 0) {
      toast({
        title: "Your cart is empty!",
        description: "Please add items before checking out.",
        variant: "destructive",
      });
      router.push("/cart");
    }
  }, [items, router]);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      streetAddress: user?.addresses?.[0]?.street || "",
      city: user?.addresses?.[0]?.city || "",
      zipCode: user?.addresses?.[0]?.zipCode || "",
      country: user?.addresses?.[0]?.country || "GB",
      deliveryTimeSlot: "",
    },
  });

  // Handler for address selection
  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  // Handler for form updates when address changes
  const handleAddressChange = (formData: {
    fullName: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    country: string;
  }) => {
    form.setValue("fullName", formData.fullName);
    form.setValue("streetAddress", formData.streetAddress);
    form.setValue("city", formData.city);
    form.setValue("zipCode", formData.zipCode);
    form.setValue("country", formData.country);
  };

  async function onSubmit(
    values: z.infer<typeof checkoutSchema>,
    paymentMethod: PaymentMethod = "Cash"
  ) {
    console.log("onSubmit called with:", {
      values,
      paymentMethod,
      selectedAddress,
    });

    if (!isAuthenticated || !user) {
      console.log("onSubmit: Authentication check failed");
      toast({
        title: "Authentication required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      return;
    }

    try {
      const totalAmountINR = getCartTotal();
      const discountAmountINR = appliedDiscount || 0;
      const finalAmountINR = totalAmountINR - discountAmountINR;

      // Convert to GBP for payment processing
      const totalAmountGBP = convertINRtoGBP(totalAmountINR);
      const discountAmountGBP = convertINRtoGBP(discountAmountINR);
      const finalAmountGBP = convertINRtoGBP(finalAmountINR);

      // Get Stripe-compatible amount (in pence)
      const stripeAmount = getStripeCompatibleAmount(finalAmountGBP);

      // Find the selected time slot
      const selectedTimeSlot = availableTimeSlots.find(
        (slot) => slot.id === values.deliveryTimeSlot
      );

      // Convert time slot to proper timestamp
      const getScheduledTimestamp = (
        timeSlot: TimeSlot | undefined
      ): string => {
        if (!timeSlot) {
          // Default to 2 hours from now if no slot selected
          return new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
        }

        // Parse the time from the label (e.g., "Today, 2:00 PM - 4:00 PM")
        const now = new Date();
        const baseDate = timeSlot.label.includes("Tomorrow")
          ? new Date(now.getTime() + 24 * 60 * 60 * 1000)
          : now;

        // Extract start time (e.g., "2:00 PM" from "Today, 2:00 PM - 4:00 PM")
        const timeMatch = timeSlot.label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
        if (timeMatch) {
          const [, hours, minutes, period] = timeMatch;
          let hour = parseInt(hours);
          if (period === "PM" && hour !== 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;

          const scheduledDate = new Date(baseDate);
          scheduledDate.setHours(hour, parseInt(minutes), 0, 0);
          return scheduledDate.toISOString();
        }

        // Fallback: 2 hours from now
        return new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      };

      const orderData: CreateOrderRequest = {
        ...(selectedAddress?.id
          ? { addressId: selectedAddress.id }
          : {
              deliveryAddress: `${values.streetAddress}, ${values.city}, ${values.zipCode}, ${values.country}`,
            }),
        deliveryType: "Instant" as OrderDeliveryType,
        paymentMethod: paymentMethod,
        paymentStatus:
          paymentMethod === "Cash"
            ? ("Pending" as PaymentStatus)
            : ("Paid" as PaymentStatus),
        couponCode: appliedCoupon?.coupon.code || "",
        transactionId:
          paymentMethod === "Cash"
            ? ""
            : `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        discountAmount: discountAmountINR,
        scheduledTime: getScheduledTimestamp(selectedTimeSlot),
        userInstructions: `Delivery to: ${values.fullName}`,
      };

      // Create the order using the order store
      const newOrder = await createOrder(orderData);

      // Clear the cart after successful order
      clearCart();

      // Redirect to order confirmation/history page
      router.push(`/account/orders/${newOrder.orderId}`);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        title: "Order placement failed",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleCashPayment = async () => {
    const values = form.getValues();

    console.log("Cash payment clicked - Selected address:", selectedAddress);
    console.log("Form values:", values);

    // If user has selected a saved address, skip address field validation
    if (selectedAddress?.id) {
      // Only validate non-address fields
      const isNameValid = await form.trigger("fullName");
      const isTimeSlotValid = await form.trigger("deliveryTimeSlot");

      console.log(
        "Validation results - Name:",
        isNameValid,
        "Time slot:",
        isTimeSlotValid
      );

      if (isNameValid && isTimeSlotValid) {
        await onSubmit(values, "Cash");
      }
    } else {
      // Validate all fields for manual address entry
      const isValid = await form.trigger();
      console.log("Full form validation result:", isValid);
      if (isValid) {
        await onSubmit(values, "Cash");
      }
    }
  };

  const handleCardPayment = async () => {
    const values = form.getValues();

    console.log("Card payment clicked - Selected address:", selectedAddress);
    console.log("Form values:", values);

    // If user has selected a saved address, skip address field validation
    let isValid = false;
    if (selectedAddress?.id) {
      // Only validate non-address fields
      const isNameValid = await form.trigger("fullName");
      const isTimeSlotValid = await form.trigger("deliveryTimeSlot");
      isValid = isNameValid && isTimeSlotValid;
      console.log(
        "Validation results - Name:",
        isNameValid,
        "Time slot:",
        isTimeSlotValid
      );
    } else {
      // Validate all fields for manual address entry
      isValid = await form.trigger();
      console.log("Full form validation result:", isValid);
    }

    if (!isValid) {
      console.log("Validation failed, stopping payment process");
      return;
    }

    if (!isAuthenticated || !user) {
      console.log(
        "Authentication check failed - isAuthenticated:",
        isAuthenticated,
        "user:",
        user
      );
      toast({
        title: "Authentication required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the selected time slot
      const selectedTimeSlot = availableTimeSlots.find(
        (slot) => slot.id === values.deliveryTimeSlot
      );

      // Convert time slot to proper timestamp
      const getScheduledTimestamp = (
        timeSlot: TimeSlot | undefined
      ): string => {
        if (!timeSlot) {
          return new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
        }

        const now = new Date();
        const baseDate = timeSlot.label.includes("Tomorrow")
          ? new Date(now.getTime() + 24 * 60 * 60 * 1000)
          : now;

        const timeMatch = timeSlot.label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
        if (timeMatch) {
          const [, hours, minutes, period] = timeMatch;
          let hour = parseInt(hours);
          if (period === "PM" && hour !== 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;

          const scheduledDate = new Date(baseDate);
          scheduledDate.setHours(hour, parseInt(minutes), 0, 0);
          return scheduledDate.toISOString();
        }

        return new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      };

      const deliveryAddress = `${values.streetAddress}, ${values.city}, ${values.zipCode}, ${values.country}`;
      const scheduledTime = getScheduledTimestamp(selectedTimeSlot);
      const userInstructions = `Delivery to: ${values.fullName}`;

      // Create payment intent with our API
      toast({
        title: "Setting up payment...",
        description: "Preparing your payment with Stripe...",
      });

      // Use addressId if available, otherwise fall back to delivery address string
      const addressIdentifier = selectedAddress?.id || deliveryAddress;

      const paymentIntentResponse = await createPaymentIntent(
        addressIdentifier,
        appliedCoupon?.coupon.code // couponCode
      );

      // Store the payment intent data and checkout data
      setPaymentIntentData(paymentIntentResponse);
      setCheckoutData({
        values,
        scheduledTime,
        userInstructions,
        selectedAddress,
      });

      // Show the Stripe payment form
      setShowStripePayment(true);
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      toast({
        title: "Payment setup failed",
        description: "Failed to set up payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!checkoutData) return;

    try {
      toast({
        title: "Confirming order...",
        description: "Payment successful! Creating your order...",
      });

      // Reconstruct delivery address from checkout data
      const deliveryAddress = `${checkoutData.values.streetAddress}, ${checkoutData.values.city}, ${checkoutData.values.zipCode}, ${checkoutData.values.country}`;

      // Use addressId if available, otherwise fall back to delivery address string
      const addressIdentifier =
        checkoutData.selectedAddress?.id || deliveryAddress;

      // Confirm the payment intent with our backend
      await confirmPaymentIntent(
        paymentIntentId,
        addressIdentifier,
        "Instant", // Instant or Scheduled,
        checkoutData.scheduledTime,
        checkoutData.userInstructions
      );

      // Clear the cart after successful payment
      clearCart();

      toast({
        title: "Order placed successfully!",
        description:
          "Your payment has been processed and order has been placed.",
      });

      // Redirect to order confirmation page
      router.push(`/account/orders`);
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      toast({
        title: "Order confirmation failed",
        description:
          "Payment was successful but order confirmation failed. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    });
    setShowStripePayment(false);
    setPaymentIntentData(null);
    setCheckoutData(null);
  };

  if (!isClient || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading checkout...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show Stripe payment form if payment intent is created
  if (showStripePayment && paymentIntentData && checkoutData) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Complete Your Payment</h2>
          <p className="text-muted-foreground">
            Enter your payment details to complete your order
          </p>
        </div>

        <StripePaymentForm
          clientSecret={paymentIntentData.clientSecret}
          paymentIntentId={paymentIntentData.paymentIntentId}
          amount={paymentIntentData.amount}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          billingDetails={{
            name: checkoutData.values.fullName,
            address: {
              line1: checkoutData.values.streetAddress,
              city: checkoutData.values.city,
              postal_code: checkoutData.values.zipCode,
              country: convertToCountryCode(checkoutData.values.country),
            },
          }}
        />

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setShowStripePayment(false);
              setPaymentIntentData(null);
              setCheckoutData(null);
            }}
            className="rounded-xl"
          >
            Back to Checkout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Main Checkout Form */}
      <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-lime-50 dark:from-emerald-950/20 dark:to-lime-950/20 border-b border-emerald-100 dark:border-emerald-800">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            Checkout Details
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form className="space-y-8">
              {/* Delivery Address Section */}
              <SelectAddress
                selectedAddress={selectedAddress}
                onAddressSelect={handleAddressSelect}
                onAddressChange={handleAddressChange}
              />

              {/* Full Name Field */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-12 rounded-xl border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address fields for new address or manual entry */}
                {(!selectedAddress ||
                  Object.keys(selectedAddress).length === 0) && (
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Street Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main St"
                              {...field}
                              className="h-12 rounded-xl border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Anytown"
                                {...field}
                                className="h-12 rounded-xl border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              ZIP Code
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="12345"
                                {...field}
                                className="h-12 rounded-xl border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Country
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="GB"
                                {...field}
                                className="h-12 rounded-xl border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Time Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-800">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Clock className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Delivery Time
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="deliveryTimeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Choose a Time Slot
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 focus:ring-emerald-500/20">
                            <SelectValue placeholder="Select a delivery time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {availableTimeSlots.map((slot) => (
                            <SelectItem
                              key={slot.id}
                              value={slot.id}
                              className="rounded-lg"
                            >
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Order Summary & Place Order */}
              <div className="space-y-6 pt-6 border-t border-emerald-100 dark:border-emerald-800">
                <Card className="bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-950/20 dark:to-lime-950/20 border-0 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold">Order Summary</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Items ({items.length})
                        </span>
                        <span className="font-medium">
                          {formatCurrency(convertINRtoGBP(getCartTotal()))}
                        </span>
                      </div>
                      {appliedCoupon && appliedDiscount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Discount ({appliedCoupon.coupon.code})
                          </span>
                          <span className="font-medium text-green-600">
                            -{formatCurrency(convertINRtoGBP(appliedDiscount))}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                      <hr className="border-emerald-200 dark:border-emerald-700" />
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total</span>
                        <span className="text-emerald-600">
                          {formatCurrency(
                            convertINRtoGBP(
                              getCartTotal() - (appliedDiscount || 0)
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    size="lg"
                    disabled={isOrderLoading}
                    onClick={handleCashPayment}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group h-14 text-lg font-semibold"
                  >
                    <Truck className="mr-2 h-5 w-5" />
                    {isOrderLoading ? "Placing Order..." : "Pay on Delivery"}
                    <Sparkles className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>

                  <Button
                    type="button"
                    size="lg"
                    disabled={isOrderLoading}
                    onClick={handleCardPayment}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group h-14 text-lg font-semibold"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {isOrderLoading ? "Processing..." : "Pay with Card"}
                    <Sparkles className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Additional Benefits Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Fast & Free Delivery</h3>
            </div>
            <p className="text-muted-foreground">
              Get your fresh groceries delivered within your selected time slot
              at no extra cost.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-lg">100% Fresh Guarantee</h3>
            </div>
            <p className="text-muted-foreground">
              If you're not satisfied with the freshness, we'll replace or
              refund your order.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
