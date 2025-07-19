"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface SaveCardFormProps {
  onClose: () => void;
  onSuccess?: (paymentMethodId: string) => void;
  isOrderPlacing?: boolean;
}
const SaveCardFormContent = ({
  onClose,
  onSuccess,
  isOrderPlacing,
}: SaveCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!stripe || !elements) {
      setMessage("Stripe not loaded");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMessage("Card element not found");
      setLoading(false);
      return;
    }

    try {
      // ✅ Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setMessage(error.message || "Error creating payment method");
        setLoading(false);
        return;
      }

      // ✅ Console log the payment method ID as requested
      console.log("Payment Method ID:", paymentMethod.id);
      console.log("Full Payment Method:", paymentMethod);

      if (onSuccess) {
        setMessage("Card saved successfully! Placing your order...");
        // Call the success callback with payment method ID
        onSuccess(paymentMethod.id);
      } else {
        setMessage("Card saved successfully!");
        setLoading(false);
        // Close the form after successful save if no success callback
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error saving card:", err);
      setMessage("An unexpected error occurred");
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937",
        fontFamily: '"Inter", "system-ui", sans-serif',
        fontWeight: "500",
        "::placeholder": {
          color: "#9ca3af",
          fontWeight: "400",
        },
        backgroundColor: "transparent",
        iconColor: "#059669",
        lineHeight: "24px",
        padding: "12px 0",
      },
      invalid: {
        color: "#dc2626",
        iconColor: "#dc2626",
      },
      complete: {
        color: "#059669",
        iconColor: "#059669",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl">Save Payment Method</div>
                  <div className="text-sm font-normal text-emerald-50 mt-1">
                    Secure and encrypted storage
                  </div>
                </div>
              </CardTitle>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSaveCard} className="space-y-6">
              <div className="space-y-6">
                {/* Card Input Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Card Information
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-5 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/20 transition-all duration-300 shadow-sm hover:shadow-md">
                      <CardElement options={cardElementOptions} />
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        <Lock className="h-4 w-4" />
                        <span>Bank-level Security</span>
                      </div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                        Your card information is encrypted with
                        industry-standard TLS and stored securely. We never
                        store your full card number.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading || isOrderPlacing}
                  className="flex-1 h-12 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-all duration-200"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!stripe || loading || isOrderPlacing}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base font-semibold border-0 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {loading || isOrderPlacing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                      <span>
                        {isOrderPlacing ? "Placing Order..." : "Saving..."}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <span>Save Card</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Status Message */}
              {(message || isOrderPlacing) && (
                <div
                  className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300 animate-in slide-in-from-top-2 ${
                    (message && message.includes("successfully")) ||
                    isOrderPlacing
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-700"
                      : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        (message && message.includes("successfully")) ||
                        isOrderPlacing
                          ? "bg-emerald-100 dark:bg-emerald-900/50"
                          : "bg-red-100 dark:bg-red-900/50"
                      }`}
                    >
                      {isOrderPlacing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600/30 border-t-emerald-600"></div>
                      ) : message && message.includes("successfully") ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          (message && message.includes("successfully")) ||
                          isOrderPlacing
                            ? "text-emerald-800 dark:text-emerald-200"
                            : "text-red-800 dark:text-red-200"
                        }`}
                      >
                        {isOrderPlacing
                          ? "Processing..."
                          : message && message.includes("successfully")
                          ? "Success!"
                          : "Error"}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          (message && message.includes("successfully")) ||
                          isOrderPlacing
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {isOrderPlacing
                          ? "Placing your recurring order..."
                          : message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function SaveCardForm(props: SaveCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <SaveCardFormContent {...props} />
    </Elements>
  );
}
