"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Lock } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface StripePaymentFormProps {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  billingDetails: {
    name: string;
    address: {
      line1: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
}

const PaymentForm = ({
  clientSecret,
  paymentIntentId,
  amount,
  onSuccess,
  onError,
  billingDetails,
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  // Prevent navigation during payment processing
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue =
          "Your payment is being processed. Are you sure you want to leave?";
        return "Your payment is being processed. Are you sure you want to leave?";
      }
    },
    [isProcessing]
  );

  // Block browser navigation during payment
  useEffect(() => {
    if (isProcessing) {
      // Prevent page refresh/close
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Prevent back/forward navigation
      const handlePopState = (e: PopStateEvent) => {
        if (isProcessing) {
          // Push current state back to prevent navigation
          window.history.pushState(null, "", window.location.href);
          toast({
            title: "Payment in Progress",
            description: "Please wait while your payment is being processed.",
            variant: "destructive",
          });
        }
      };

      window.addEventListener("popstate", handlePopState);
      // Push current state to prevent back navigation
      window.history.pushState(null, "", window.location.href);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isProcessing, handleBeforeUnload]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError("Card element not found");
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      }
    );

    if (error) {
      setIsProcessing(false);
      console.error("Payment error:", error);
      onError(error.message || "Payment failed");
      return;
    }

    if (paymentIntent) {
      switch (paymentIntent.status) {
        case "succeeded":
          setIsProcessing(false);
          onSuccess(paymentIntentId);
          break;
        case "processing":
          // Keep processing state true and poll for status
          console.log("Payment is processing...");

          let pollCount = 0;
          const maxPollAttempts = 30; // 30 attempts * 2 seconds = 1 minute max

          // Poll every 2 seconds to check payment status
          const pollPaymentStatus = async () => {
            pollCount++;

            if (pollCount > maxPollAttempts) {
              setIsProcessing(false);
              onError(
                "Payment verification timeout. Please check your account or contact support."
              );
              return;
            }

            try {
              const { paymentIntent: updatedIntent } =
                await stripe.retrievePaymentIntent(clientSecret);
              if (updatedIntent?.status === "succeeded") {
                setIsProcessing(false);
                onSuccess(paymentIntentId);
              } else if (updatedIntent?.status === "canceled") {
                setIsProcessing(false);
                onError("Payment was canceled");
              } else if (updatedIntent?.status === "processing") {
                // Show extended processing message after 10 seconds
                if (pollCount === 5) {
                  toast({
                    title: "Payment Processing",
                    description:
                      "Your payment is taking longer than usual but is still being processed...",
                  });
                }
                // Continue polling
                setTimeout(pollPaymentStatus, 2000);
              } else {
                setIsProcessing(false);
                onError("Payment status unknown");
              }
            } catch (pollError) {
              console.error("Error polling payment status:", pollError);
              setIsProcessing(false);
              onError("Unable to verify payment status");
            }
          };
          setTimeout(pollPaymentStatus, 2000);
          break;
        case "requires_action":
          // This shouldn't happen with confirmCardPayment, but handle it
          setIsProcessing(false);
          onError("Payment requires additional authentication");
          break;
        case "canceled":
          setIsProcessing(false);
          onError("Payment was canceled");
          break;
        default:
          setIsProcessing(false);
          onError("Payment failed or status unknown");
      }
    } else {
      setIsProcessing(false);
      onError("Payment failed - no payment intent returned");
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
    <div className="relative">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-sm text-muted-foreground">
              Please don't close or refresh this page
            </p>
          </div>
        </div>
      )}

      <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-blue-100 dark:border-blue-800">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <CreditCard className="h-3 w-3 text-white" />
            </div>
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
                <CardElement options={cardElementOptions} />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-emerald-600">
                  £{(amount / 100).toFixed(2)}
                </span>
              </div>

              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-lg font-semibold disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay £{(amount / 100).toFixed(2)}
                  </>
                )}
              </Button>

              {isProcessing && (
                <div className="text-center text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <Lock className="h-4 w-4 inline mr-2" />
                  <strong>Do not close or refresh this page</strong> - Your
                  payment is being processed
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
