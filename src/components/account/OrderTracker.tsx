"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrderByTrackingNumber } from "@/api/orderApi";
import type { Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Package,
  MapPin,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function OrderTracker() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking number required",
        description: "Please enter a tracking number to search for your order.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const foundOrder = await getOrderByTrackingNumber(trackingNumber.trim());
      setOrder(foundOrder);
      toast({
        title: "Order found!",
        description: `Order #${foundOrder.orderId.slice(-8)} has been located.`,
      });
    } catch (error) {
      console.error("Failed to track order:", error);
      setError(
        "Order not found. Please check your tracking number and try again."
      );
      toast({
        title: "Order not found",
        description: "Please check your tracking number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: Order["orderStatus"]) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Processing":
        return "secondary";
      case "Pending":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: Order["orderStatus"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "Processing":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-black";
      case "Cancelled":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Track Your Order
          </CardTitle>
          <CardDescription>
            Enter your tracking number to see the current status of your order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter tracking number..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Track Order"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setError(null);
                  setTrackingNumber("");
                }}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Found */}
      {order && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order #{order.orderId.slice(-8)}
                </CardTitle>
                <CardDescription>
                  Tracking: {order.trackingNumber}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <Badge
                  variant={getStatusBadgeVariant(order.orderStatus)}
                  className={`text-sm ${getStatusColor(order.orderStatus)}`}
                >
                  {order.orderStatus}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Placed: {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment
                </h4>
                <div className="text-sm space-y-1">
                  <p>Total: £{order.totalAmount}</p>
                  <Badge
                    variant={order.isPaid ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {order.paymentStatus}
                  </Badge>
                  <p className="text-muted-foreground">{order.paymentMethod}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Delivery
                </h4>
                <div className="text-sm space-y-1">
                  <p>{order.deliveryType}</p>
                  {order.deliveryPartner && (
                    <p className="text-muted-foreground">
                      via {order.deliveryPartner}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Schedule
                </h4>
                <div className="text-sm">
                  <p className="text-muted-foreground">
                    {order.scheduledTime
                      ? format(new Date(order.scheduledTime), "PPP p")
                      : "Standard delivery"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Delivery Address */}
            <div className="space-y-2">
              <h4 className="font-semibold">Delivery Address</h4>
              <p className="text-sm text-muted-foreground">
                {order.deliveryAddress}
              </p>
            </div>

            {/* Special Instructions */}
            {(order.userInstructions || order.orderNotes) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold">Special Instructions</h4>
                  {order.userInstructions && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Your Instructions:</strong>{" "}
                      {order.userInstructions}
                    </p>
                  )}
                  {order.orderNotes && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Order Notes:</strong> {order.orderNotes}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Items Preview */}
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">
                  Order Items ({order.items.length})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/account/orders/${order.orderId}`)
                  }
                >
                  View Full Details
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Total value: £
                {order.items.reduce((sum, item) => sum + item.totalPrice, 0)}
                {order.discountAmount > 0 && (
                  <span className="text-green-600 ml-2">
                    (Saved £{order.discountAmount})
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
