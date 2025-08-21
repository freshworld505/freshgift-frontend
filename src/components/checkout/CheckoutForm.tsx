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
import { use, useEffect, useState } from "react";
import { getStripeCompatibleAmount, convertToPence } from "@/lib/currency";
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
  Phone,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent, confirmPaymentIntent } from "@/api/payment";
import { createAddress, updatePhoneNumber } from "@/api/addressesApi";
import StripePaymentForm from "./StripePaymentForm";
import SelectAddress from "./SelectAddress";
import SaveCardPage from "./SaveCardForm";
import Lottie from "lottie-react";
import successAnimation from "../../../public/Success.json";
import { getShippingDetails, getTotalAfterShippingCost } from "@/api/orderApi";

interface TotalCostAfterShippingCostResponse {
  shippingCost: number;
  cartTotal: number;
  finalTotal: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
}

interface ShippingCostResponse {
  message: string;
  shippingCharge: number;
  freeShippingThreshold: number;
}

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
  phoneNumber: z
    .string()
    .min(10, "Valid phone number is required.")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
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
  {
    id: "ts4",
    label: "3 days from now, 10:00 AM - 6:00 PM",
    date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
  },
  {
    id: "ts5",
    label: "Next Week, 10:00 AM - 6:00 PM",
    date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  },
];

export default function CheckoutForm() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder, isLoading: isOrderLoading } = useOrderStore();
  const { appliedCoupon, appliedDiscount } = useCouponStore();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [showCardSaving, setShowCardSaving] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isPlacingRecurringOrder, setIsPlacingRecurringOrder] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [recurringOrderData, setRecurringOrderData] = useState<{
    values: z.infer<typeof checkoutSchema>;
    scheduledTime: string;
    userInstructions: string;
    selectedAddress: Address | null;
  } | null>(null);
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
  const [shippingDetails, setShippingDetails] =
    useState<ShippingCostResponse | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const fetchShippingDetails = async () => {
    const details = await getShippingDetails();
    console.log("🚀Shipping details fetched:", details);
    setShippingDetails(details);
  };

  useEffect(() => {
    fetchShippingDetails();
  }, []);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      phoneNumber: user?.phone || "",
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

  // Helper function to create address from form data
  const createAddressFromForm = async (
    values: z.infer<typeof checkoutSchema>
  ): Promise<Address> => {
    console.log("🏠 Creating address from form values:", values);

    // Validate required fields
    if (
      !values.streetAddress ||
      !values.city ||
      !values.zipCode ||
      !values.country
    ) {
      throw new Error("Missing required address fields");
    }

    const newAddressData: Omit<Address, "id"> = {
      street: values.streetAddress.trim(),
      city: values.city.trim(),
      state: values.city.trim(), // Using city as state for simplicity, can be enhanced
      zipCode: values.zipCode.trim(),
      country: values.country.trim(),
      isDefault: false,
    };

    console.log("📝 Address data to be sent:", newAddressData);

    try {
      const createdAddress = await createAddress(newAddressData);
      console.log("✅ Address created successfully:", createdAddress);
      console.log("🔍 Address object keys:", Object.keys(createdAddress || {}));
      console.log("🆔 Address ID value:", createdAddress?.id);
      console.log("🆔 Address ID type:", typeof createdAddress?.id);

      // Validate that we received a proper address with ID
      if (!createdAddress || !createdAddress.id) {
        console.error(
          "❌ Address validation failed - createdAddress:",
          createdAddress
        );
        throw new Error("Address creation returned invalid data");
      }

      return createdAddress;
    } catch (error) {
      console.error("❌ Address creation API failed:", error);
      throw error;
    }
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
      const totalAmount = getCartTotal();
      const discountAmount = appliedDiscount || 0;
      const finalAmount = totalAmount - discountAmount;

      // Get Stripe-compatible amount (in pence for GBP)
      const stripeAmount = getStripeCompatibleAmount(finalAmount);

      // Update phone number if it has changed
      if (values.phoneNumber && values.phoneNumber !== user.phone) {
        try {
          console.log("📞 Updating phone number:", values.phoneNumber);
          await updatePhoneNumber(values.phoneNumber);
          console.log("✅ Phone number updated successfully");
          toast({
            title: "Phone number updated",
            description: "Your contact information has been saved.",
          });
        } catch (phoneError) {
          console.error("❌ Failed to update phone number:", phoneError);
          // Don't block the order if phone update fails, just log it
          toast({
            title: "Phone update failed",
            description:
              "Order will proceed, but phone number couldn't be updated.",
            variant: "destructive",
          });
        }
      }

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

      // Handle address: either use selected address or create new one
      let addressId: string;

      // Check if we have a valid selected address with an ID
      const hasValidSelectedAddress =
        selectedAddress &&
        typeof selectedAddress === "object" &&
        selectedAddress.id &&
        selectedAddress.id.trim() !== "";

      if (hasValidSelectedAddress) {
        // Use existing selected address
        addressId = selectedAddress.id;
        console.log("Using existing address:", addressId);
      } else {
        // Create new address from form data
        console.log("Creating new address from form data...");
        console.log("selectedAddress is:", selectedAddress);
        console.log("selectedAddress?.id is:", selectedAddress?.id);
        console.log("hasValidSelectedAddress:", hasValidSelectedAddress);
        toast({
          title: "Saving address...",
          description: "Creating your delivery address.",
        });

        try {
          const newAddress = await createAddressFromForm(values);
          addressId = newAddress.id;
          console.log(
            "✅ Successfully created new address with ID:",
            addressId
          );
          console.log("New address details:", newAddress);

          // Add a small delay to ensure address is fully saved on backend
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (addressError) {
          console.error("❌ Failed to create address:", addressError);
          toast({
            title: "Address creation failed",
            description: "Failed to save your address. Please try again.",
            variant: "destructive",
          });
          throw addressError;
        }
      }

      console.log("📋 Preparing order data with addressId:", addressId);

      const orderData: CreateOrderRequest = {
        addressId: addressId, // Always use addressId now
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
        discountAmount: discountAmount,
        scheduledTime: getScheduledTimestamp(selectedTimeSlot),
        userInstructions: `Delivery to: ${values.fullName}, Phone: ${values.phoneNumber}`,
      };

      console.log("📤 Sending order data to API:", orderData);
      console.log("🛒 Current cart items:", items);
      console.log("💰 Cart total:", totalAmount);
      console.log("🎫 Applied coupon:", appliedCoupon);
      console.log("💸 Discount amount:", discountAmount);
      console.log("👤 Current user:", user);
      console.log("🔐 Authentication status:", isAuthenticated);

      // Create the order using the order store
      console.log("🚀 Creating order...");
      const newOrder = await createOrder(orderData);
      console.log("✅ Order created successfully:", newOrder);

      // Clear the cart after successful order
      clearCart();

      showSuccessAnimationAndRedirect(
        newOrder.orderId,
        "Your order has been placed and will be delivered soon."
      );
    } catch (error) {
      console.error("❌ Failed to place order:", error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Check if it's an axios error for more details
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        console.error("Axios error response:", axiosError.response?.data);
        console.error("Axios error status:", axiosError.response?.status);
        console.error("Axios error headers:", axiosError.response?.headers);
      }

      toast({
        title: "Order placement failed",
        description: `Failed to place your order. ${
          error instanceof Error ? error.message : "Please try again."
        }`,
        variant: "destructive",
      });
    }
  }

  const handleCashPayment = async () => {
    const values = form.getValues();

    console.log("Cash payment clicked - Selected address:", selectedAddress);
    console.log("Form values:", values);

    // Check if we have a valid selected address with an ID
    const hasValidSelectedAddress =
      selectedAddress &&
      typeof selectedAddress === "object" &&
      selectedAddress.id &&
      selectedAddress.id.trim() !== "";

    // If user has selected a saved address, skip address field validation
    if (hasValidSelectedAddress) {
      // Only validate non-address fields
      const isNameValid = await form.trigger("fullName");
      const isPhoneValid = await form.trigger("phoneNumber");
      const isTimeSlotValid = await form.trigger("deliveryTimeSlot");

      console.log(
        "Validation results - Name:",
        isNameValid,
        "Phone:",
        isPhoneValid,
        "Time slot:",
        isTimeSlotValid
      );

      if (isNameValid && isPhoneValid && isTimeSlotValid) {
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

    // Check if we have a valid selected address with an ID
    const hasValidSelectedAddress =
      selectedAddress &&
      typeof selectedAddress === "object" &&
      selectedAddress.id &&
      selectedAddress.id.trim() !== "";

    // If user has selected a saved address, skip address field validation
    let isValid = false;
    if (hasValidSelectedAddress) {
      // Only validate non-address fields
      const isNameValid = await form.trigger("fullName");
      const isPhoneValid = await form.trigger("phoneNumber");
      const isTimeSlotValid = await form.trigger("deliveryTimeSlot");
      isValid = isNameValid && isPhoneValid && isTimeSlotValid;
      console.log(
        "Validation results - Name:",
        isNameValid,
        "Phone:",
        isPhoneValid,
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
      // Update phone number if it has changed
      if (values.phoneNumber && values.phoneNumber !== user.phone) {
        try {
          console.log(
            "📞 Updating phone number for card payment:",
            values.phoneNumber
          );
          await updatePhoneNumber(values.phoneNumber);
          console.log("✅ Phone number updated successfully");
          toast({
            title: "Phone number updated",
            description: "Your contact information has been saved.",
          });
        } catch (phoneError) {
          console.error("❌ Failed to update phone number:", phoneError);
          // Don't block the payment if phone update fails, just log it
          toast({
            title: "Phone update failed",
            description:
              "Payment will proceed, but phone number couldn't be updated.",
            variant: "destructive",
          });
        }
      }

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

      const scheduledTime = getScheduledTimestamp(selectedTimeSlot);
      const userInstructions = `Delivery to: ${values.fullName}, Phone: ${values.phoneNumber}`;

      // Handle address: either use selected address or create new one
      let addressIdentifier: string;
      let createdAddress: Address | null = null;

      // Check if we have a valid selected address with an ID
      const hasValidSelectedAddress =
        selectedAddress &&
        typeof selectedAddress === "object" &&
        selectedAddress.id &&
        selectedAddress.id.trim() !== "";

      if (hasValidSelectedAddress) {
        // Use existing selected address
        addressIdentifier = selectedAddress.id;
        console.log("Using existing address for payment:", addressIdentifier);
      } else {
        // Create new address from form data
        console.log("Creating new address for payment...");
        console.log("selectedAddress is:", selectedAddress);
        console.log("selectedAddress?.id is:", selectedAddress?.id);
        console.log("hasValidSelectedAddress:", hasValidSelectedAddress);
        toast({
          title: "Saving address...",
          description: "Creating your delivery address for payment.",
        });

        try {
          createdAddress = await createAddressFromForm(values);
          addressIdentifier = createdAddress.id;
          console.log(
            "✅ Successfully created new address for payment with ID:",
            addressIdentifier
          );
          console.log("New address details:", createdAddress);

          // Add a small delay to ensure address is fully saved on backend
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (addressError) {
          console.error(
            "❌ Failed to create address for payment:",
            addressError
          );
          toast({
            title: "Address creation failed",
            description: "Failed to save your address. Please try again.",
            variant: "destructive",
          });
          return; // Exit early if address creation fails
        }
      }

      // Create payment intent with our API
      toast({
        title: "Setting up payment...",
        description: "Preparing your payment with Stripe...",
      });

      const paymentIntentResponse = await createPaymentIntent(
        addressIdentifier, // Use addressId for payment intent
        appliedCoupon?.coupon.code // couponCode
      );
      console.log("🚀✅🚀❤️Payment Intent Response:", paymentIntentResponse);

      // Store the payment intent data and checkout data
      // Convert amount to pence for StripePaymentForm (it expects pence)
      const amountInPence = convertToPence(paymentIntentResponse.amount);
      console.log("💰 Converting amount for Stripe:", {
        originalAmount: paymentIntentResponse.amount,
        amountInPence: amountInPence,
      });

      setPaymentIntentData({
        ...paymentIntentResponse,
        amount: amountInPence,
      });
      setCheckoutData({
        values,
        scheduledTime,
        userInstructions,
        selectedAddress: createdAddress || selectedAddress, // Use created address if new, otherwise selected
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

      // Use the addressId from the stored checkout data
      const addressIdentifier = checkoutData.selectedAddress?.id;

      if (!addressIdentifier) {
        throw new Error("Address ID not found. This should not happen.");
      }

      // Confirm the payment intent with our backend
      await confirmPaymentIntent(
        paymentIntentId,
        addressIdentifier, // Always use addressId now
        "Instant", // Instant or Scheduled,
        checkoutData.scheduledTime,
        checkoutData.userInstructions
      );

      // Clear the cart after successful payment
      clearCart();

      // Small delay to ensure smooth transition
      setTimeout(() => {
        setShowSuccessAnimation(true);

        toast({
          title: "Order placed successfully!",
          description:
            "Your payment has been processed and order has been placed.",
        });

        // Show animation for 3.5 seconds, then redirect
        setTimeout(() => {
          setShowSuccessAnimation(false);
          router.push(`/account/orders`);
        }, 3500);
      }, 100);
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

  const handleRecurringOrderPayment = async () => {
    const values = form.getValues();

    // Validate form first
    const hasValidSelectedAddress =
      selectedAddress &&
      typeof selectedAddress === "object" &&
      selectedAddress.id &&
      selectedAddress.id.trim() !== "";

    let isValid = false;
    if (hasValidSelectedAddress) {
      const isNameValid = await form.trigger("fullName");
      const isPhoneValid = await form.trigger("phoneNumber");
      const isTimeSlotValid = await form.trigger("deliveryTimeSlot");
      isValid = isNameValid && isPhoneValid && isTimeSlotValid;
    } else {
      isValid = await form.trigger();
    }

    if (!isValid) {
      return;
    }

    // Find the selected time slot
    const selectedTimeSlot = availableTimeSlots.find(
      (slot) => slot.id === values.deliveryTimeSlot
    );

    const getScheduledTimestamp = (timeSlot: TimeSlot | undefined): string => {
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

    const scheduledTime = getScheduledTimestamp(selectedTimeSlot);
    const userInstructions = `Delivery to: ${values.fullName}, Phone: ${values.phoneNumber}`;

    // Store checkout data for recurring order
    setRecurringOrderData({
      values,
      scheduledTime,
      userInstructions,
      selectedAddress,
    });

    // Show card saving form
    setShowCardSaving(true);
  };

  const handleCardSaveSuccess = async (paymentMethodId: string) => {
    if (!recurringOrderData) {
      toast({
        title: "Error",
        description: "Missing order data. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingRecurringOrder(true);

    try {
      toast({
        title: "Card saved successfully!",
        description: "Now placing your recurring order...",
      });

      // Handle address: either use selected address or create new one
      let addressId: string;

      const hasValidSelectedAddress =
        recurringOrderData.selectedAddress &&
        typeof recurringOrderData.selectedAddress === "object" &&
        recurringOrderData.selectedAddress.id &&
        recurringOrderData.selectedAddress.id.trim() !== "";

      if (hasValidSelectedAddress) {
        addressId = recurringOrderData.selectedAddress!.id;
      } else {
        const newAddress = await createAddressFromForm(
          recurringOrderData.values
        );
        addressId = newAddress.id;
      }

      // Create recurring order
      const orderData: CreateOrderRequest = {
        addressId: addressId,
        deliveryType: "Recurring" as OrderDeliveryType,
        paymentMethod: "Card" as PaymentMethod,
        paymentStatus: "Paid" as PaymentStatus,
        couponCode: appliedCoupon?.coupon.code || "",
        transactionId: `recurring_${Date.now()}_${paymentMethodId}`,
        discountAmount: appliedDiscount || 0,
        scheduledTime: recurringOrderData.scheduledTime,
        userInstructions: recurringOrderData.userInstructions,
      };

      console.log("🔄 Creating recurring order with saved card...");
      const newOrder = await createOrder(orderData);

      // Clear the cart after successful order
      clearCart();

      showSuccessAnimationAndRedirect(
        newOrder.orderId,
        "Your recurring order has been set up with the saved payment method."
      );
    } catch (error) {
      console.error("❌ Failed to place recurring order:", error);
      toast({
        title: "Recurring order failed",
        description: `Failed to place your recurring order. ${
          error instanceof Error ? error.message : "Please try again."
        }`,
        variant: "destructive",
      });
    } finally {
      setIsPlacingRecurringOrder(false);
      setShowCardSaving(false);
      setRecurringOrderData(null);
    }
  };

  const handleCardSaveCancel = () => {
    setShowCardSaving(false);
    setRecurringOrderData(null);
  };

  const showSuccessAnimationAndRedirect = (
    orderId: string,
    message: string
  ) => {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowSuccessAnimation(true);

      toast({
        title: "Order placed successfully!",
        description: message,
      });

      // Show animation for 3.5 seconds, then redirect
      setTimeout(() => {
        setShowSuccessAnimation(false);
        router.push(`/account/orders/${orderId}`);
      }, 3500);
    }, 100);
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

  // Show Card save UI, if user selected recurring order
  if (showCardSaving) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {isPlacingRecurringOrder && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-700 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Placing Your Recurring Order
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Please wait while we set up your recurring delivery...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <SaveCardPage
          onClose={handleCardSaveCancel}
          onSuccess={handleCardSaveSuccess}
          isOrderPlacing={isPlacingRecurringOrder}
        />
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
      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center animate-in slide-in-from-bottom-4 duration-500 border border-green-200 dark:border-green-700">
            <div className="w-40 h-40 mx-auto mb-6">
              <Lottie
                animationData={successAnimation}
                loop={false}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Thank you for your order! Your fresh groceries will be delivered
                soon. You'll receive a confirmation email shortly.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-950/20 rounded-full px-4 py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                <span>Redirecting to your orders...</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

              {/* Contact Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-800">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Phone className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Contact Information
                  </h3>
                </div>

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

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+44 7911 123456"
                          type="tel"
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
                  !selectedAddress.id ||
                  selectedAddress.id.trim() === "" ||
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
                          £{getCartTotal().toFixed(2)}
                        </span>
                      </div>
                      {appliedCoupon && appliedDiscount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Discount ({appliedCoupon.coupon.code})
                          </span>
                          <span className="font-medium text-green-600">
                            -£{appliedDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium text-green-600">
                          {(() => {
                            const total =
                              getCartTotal() - (appliedDiscount || 0);
                            if (
                              total >=
                              (shippingDetails?.freeShippingThreshold || 0)
                            ) {
                              return "Free";
                            } else {
                              return `£${
                                Number(shippingDetails?.shippingCharge) || 0
                              }`;
                            }
                          })()}
                        </span>
                      </div>
                      <hr className="border-emerald-200 dark:border-emerald-700" />
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total</span>
                        <span className="text-emerald-600">
                          £
                          {(() => {
                            const total =
                              getCartTotal() - (appliedDiscount || 0);
                            const shippingCost =
                              total >=
                              (shippingDetails?.freeShippingThreshold || 0)
                                ? 0
                                : Number(shippingDetails?.shippingCharge || 0);
                            return (total + shippingCost).toFixed(2);
                          })()}
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

                {/* Recurring Order Button */}
                <div className="text-center pt-4 border-t border-emerald-100 dark:border-emerald-700">
                  <p className="text-sm text-muted-foreground mb-3">
                    Want this delivered regularly?
                  </p>
                  <Button
                    type="button"
                    size="lg"
                    disabled={isOrderLoading || isPlacingRecurringOrder}
                    onClick={handleRecurringOrderPayment}
                    className="w-full max-w-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group h-14 text-lg font-semibold"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {isPlacingRecurringOrder
                      ? "Setting up..."
                      : "Set up Recurring Order"}
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
