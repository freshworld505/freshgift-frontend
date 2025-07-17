"use client";

import { useState, useEffect } from "react";
import {
  getAllRecurringOrders,
  RecurringOrder,
  RecurringOrderItem,
} from "@/api/admin/orderApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Calendar,
  User,
  MapPin,
  Package,
  CreditCard,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";

export default function RecurringOrdersPage() {
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecurringOrders();
  }, []);

  const fetchRecurringOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const orders = await getAllRecurringOrders();
      setRecurringOrders(orders);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch recurring orders";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNextRun = (nextRunAt: string) => {
    const date = new Date(nextRunAt);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayOfWeek] || "Unknown";
  };

  const calculateOrderTotal = (items: RecurringOrderItem[]) => {
    return items.reduce(
      (total: number, item: RecurringOrderItem) =>
        total + item.product.finalPrice * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading recurring orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={fetchRecurringOrders}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Recurring Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage all recurring subscriptions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg py-2 px-4">
            Total: {recurringOrders.length} orders
          </Badge>
          <Button onClick={fetchRecurringOrders} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {recurringOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Recurring Orders
            </h3>
            <p className="text-gray-500">
              No recurring orders have been created yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {recurringOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Order #{order.id.slice(-8)}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{order.user.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {order.frequency} - {getDayName(order.dayOfWeek)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={order.isActive ? "default" : "secondary"}>
                      {order.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(calculateOrderTotal(order.items))}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer & Address Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Customer Details</span>
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.user.email}
                      </p>
                      {order.user.phone && (
                        <p className="text-sm text-gray-600">
                          {order.user.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Delivery Address</span>
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{order.address.label}</p>
                        <p>{order.address.addressLine}</p>
                        <p>
                          {order.address.city}, {order.address.state}{" "}
                          {order.address.pincode}
                        </p>
                        <p>{order.address.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Schedule Details</span>
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Frequency:</span>{" "}
                          {order.frequency}
                        </p>
                        <p>
                          <span className="font-medium">Day:</span>{" "}
                          {getDayName(order.dayOfWeek)}
                        </p>
                        <p>
                          <span className="font-medium">Next Run:</span>{" "}
                          {formatNextRun(order.nextRunAt)}
                        </p>
                        <p>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Payment</span>
                      </h4>
                      <p className="text-sm text-gray-600">
                        Method ID: {order.paymentMethodId.slice(-8)}...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Order Items ({order.items.length})</span>
                  </h4>
                  <div className="grid gap-3">
                    {order.items.map((item: RecurringOrderItem) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {item.product.productImages.length > 0 ? (
                            <img
                              src={item.product.productImages[0]}
                              alt={item.product.productName}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {item.product.productName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(item.product.finalPrice)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total:{" "}
                            {formatCurrency(
                              item.product.finalPrice * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions 
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button
                    variant={order.isActive ? "destructive" : "default"}
                    size="sm"
                  >
                    {order.isActive ? "Pause" : "Activate"}
                  </Button>
                </div>
                */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
