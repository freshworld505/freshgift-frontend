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
import { CreditCard, Lock } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface SaveCardFormProps {
  onClose: () => void;
  onSuccess?: (paymentMethodId: string) => void;
}
const SaveCardFormContent = ({ onClose, onSuccess }: SaveCardFormProps) => {
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

      setMessage("Card saved successfully!");
      setLoading(false);

      // Call the success callback with payment method ID
      if (onSuccess) {
        onSuccess(paymentMethod.id);
      } else {
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
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        backgroundColor: "transparent",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  return (
    <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-b border-green-100 dark:border-green-800">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <CreditCard className="h-3 w-3 text-white" />
          </div>
          Save Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSaveCard} className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
              <CardElement options={cardElementOptions} />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your card information is secure and encrypted</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!stripe || loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-base font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Save Card and Continue
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="px-6 h-12 rounded-xl"
            >
              Cancel
            </Button>
          </div>

          {message && (
            <div
              className={`text-center text-sm p-3 rounded-lg border ${
                message.includes("successfully")
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default function SaveCardForm(props: SaveCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <SaveCardFormContent {...props} />
    </Elements>
  );
}
