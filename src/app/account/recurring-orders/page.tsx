"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Repeat,
  MapPin,
  Package,
  Play,
  Pause,
  X,
  Calendar,
  Clock,
  RefreshCw,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getAllRecurringOrders,
  pauseRecurringOrder,
  resumeRecurringOrder,
  cancelRecurringOrder,
} from "@/api/orderApi";

// Recurring order type (based on API response)
type RecurringOrder = {
  id: string;
  frequency: string;
  dayOfWeek: number;
  nextRunAt: string;
  isActive: boolean;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      productName: string;
      productImages: string[];
      finalPrice: number;
    };
  }[];
  address: {
    addressId: string;
    label: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
};

export default function RecurringOrdersPage() {
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RecurringOrder | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch recurring orders
  useEffect(() => {
    const fetchRecurringOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const orders = await getAllRecurringOrders();
        setRecurringOrders(orders as unknown as RecurringOrder[]);
      } catch (error) {
        console.error("Error fetching recurring orders:", error);
        toast({
          title: "Error loading orders",
          description: "Failed to load your recurring orders.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchRecurringOrders();
  }, []);

  // Handle pause recurring order
  const handlePauseOrder = async (orderId: string) => {
    try {
      await pauseRecurringOrder(orderId);

      // Update local state
      setRecurringOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, isActive: false } : order
        )
      );

      toast({
        title: "Order Paused",
        description: "Your recurring order has been paused successfully.",
      });
    } catch (error) {
      console.error("Error pausing order:", error);
      toast({
        title: "Error",
        description: "Failed to pause recurring order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle resume recurring order
  const handleResumeOrder = async (orderId: string) => {
    try {
      await resumeRecurringOrder(orderId);

      // Update local state
      setRecurringOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, isActive: true } : order
        )
      );

      toast({
        title: "Order Resumed",
        description: "Your recurring order has been resumed successfully.",
      });
    } catch (error) {
      console.error("Error resuming order:", error);
      toast({
        title: "Error",
        description: "Failed to resume recurring order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle cancel recurring order
  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelRecurringOrder(orderId);

      // Remove from local state
      setRecurringOrders((prev) =>
        prev.filter((order) => order.id !== orderId)
      );

      toast({
        title: "Order Cancelled",
        description: "Your recurring order has been cancelled successfully.",
      });

      // Close modal if the cancelled order was being viewed
      if (selectedOrder?.id === orderId) {
        setShowDetailModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel recurring order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle view order details
  const handleViewOrder = (order: RecurringOrder) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-4 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            My Recurring Orders
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your recurring orders and subscriptions
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Recurring Orders Content */}
      {isLoadingOrders ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 sm:p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recurringOrders.length === 0 ? (
        <Card className="text-center py-8 sm:py-12">
          <CardContent>
            <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              No recurring orders found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
              You don't have any recurring orders yet. Create one from your cart
              to get started!
            </p>
            <Button
              onClick={() => (window.location.href = "/cart")}
              variant="outline"
              size="sm"
            >
              Go to Cart
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Orders Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-semibold">
              Active Subscriptions ({recurringOrders.length})
            </h3>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {recurringOrders.map((order) => {
              const orderTotal = order.items.reduce(
                (sum, item) => sum + item.product.finalPrice * item.quantity,
                0
              );
              const nextDelivery = new Date(order.nextRunAt);
              const dayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              return (
                <Card
                  key={order.id}
                  className={`${
                    !order.isActive ? "opacity-75" : ""
                  } hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Left side - Order Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <Repeat className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm sm:text-base">
                                {order.frequency} Order
                              </h3>
                              {order.isActive ? (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Paused
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                              Every {dayNames[order.dayOfWeek]} •{" "}
                              {order.items.length} items
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Center - Next Delivery & Total */}
                      <div className="hidden sm:flex flex-col items-center gap-1 mx-4">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{nextDelivery.toLocaleDateString()}</span>
                        </div>
                        <div className="font-semibold text-green-600">
                          £{orderTotal.toFixed(2)}
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex items-center gap-2">
                        {/* Mobile view - show total */}
                        <div className="sm:hidden text-right mr-2">
                          <div className="font-semibold text-green-600 text-sm">
                            £{orderTotal.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {nextDelivery.toLocaleDateString()}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <Button
                          onClick={() => handleViewOrder(order)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {order.isActive ? (
                          <Button
                            onClick={() => handlePauseOrder(order.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleResumeOrder(order.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          onClick={() => handleCancelOrder(order.id)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-purple-600" />
              Recurring Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 pr-4">
                {/* Order Status and Info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {selectedOrder.frequency} Order
                      </h3>
                      {selectedOrder.isActive ? (
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Paused</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Order ID: {selectedOrder.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Created:{" "}
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      £
                      {selectedOrder.items
                        .reduce(
                          (sum, item) =>
                            sum + item.product.finalPrice * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">per delivery</p>
                  </div>
                </div>

                {/* Schedule Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Delivery Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Frequency:</span>
                      <span className="text-sm font-medium">
                        Every{" "}
                        {
                          [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ][selectedOrder.dayOfWeek]
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Next Delivery:
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(selectedOrder.nextRunAt).toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {selectedOrder.address.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.address.addressLine}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.address.city},{" "}
                        {selectedOrder.address.state}{" "}
                        {selectedOrder.address.pincode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.address.country}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Items ({selectedOrder.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                        >
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={
                                item.product.productImages &&
                                item.product.productImages.length > 0
                                  ? item.product.productImages[0]
                                  : "/placeholder-product.jpg"
                              }
                              alt={item.product.productName}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">
                              {item.product.productName}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </span>
                              <span className="font-medium text-green-600">
                                £
                                {(
                                  item.product.finalPrice * item.quantity
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedOrder.isActive ? (
                    <Button
                      onClick={() => {
                        handlePauseOrder(selectedOrder.id);
                        setShowDetailModal(false);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Order
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handleResumeOrder(selectedOrder.id);
                        setShowDetailModal(false);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume Order
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to cancel this recurring order? This action cannot be undone."
                        )
                      ) {
                        handleCancelOrder(selectedOrder.id);
                      }
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
