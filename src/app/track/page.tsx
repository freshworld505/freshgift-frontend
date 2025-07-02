"use client";

import { useState } from "react";
import {
  Package,
  Search,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock tracking data
  const mockTrackingData = {
    orderNumber: "FG-2024-001234",
    status: "In Transit",
    estimatedDelivery: "Today, 2:00 PM - 4:00 PM",
    customer: {
      name: "John Doe",
      address: "123 Main St, Anytown, CA 90210",
    },
    items: [
      { name: "Organic Bananas", quantity: 2, price: 5.98 },
      { name: "Fresh Spinach", quantity: 1, price: 3.49 },
      { name: "Red Apples", quantity: 3, price: 7.47 },
    ],
    total: 16.94,
    timeline: [
      {
        status: "Order Placed",
        timestamp: "2024-01-15, 10:30 AM",
        description: "Your order has been received and is being prepared",
        completed: true,
      },
      {
        status: "Processing",
        timestamp: "2024-01-15, 11:15 AM",
        description: "Items are being picked and quality checked",
        completed: true,
      },
      {
        status: "Packed",
        timestamp: "2024-01-15, 12:45 PM",
        description: "Order packed and ready for delivery",
        completed: true,
      },
      {
        status: "Out for Delivery",
        timestamp: "2024-01-15, 1:30 PM",
        description: "Your order is on the way",
        completed: true,
        current: true,
      },
      {
        status: "Delivered",
        timestamp: "Expected: Today, 2:00-4:00 PM",
        description: "Order delivered to your address",
        completed: false,
      },
    ],
  };

  const handleTrackOrder = () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Please enter an order number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (orderNumber.toLowerCase().includes("fg") || orderNumber.length >= 6) {
        setTrackingResult(mockTrackingData);
      } else {
        toast({
          title: "Order not found",
          description: "Please check your order number and try again.",
          variant: "destructive",
        });
        setTrackingResult(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (
    status: string,
    completed: boolean,
    current: boolean
  ) => {
    if (current) {
      return <Truck className="h-5 w-5 text-blue-600" />;
    }
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "out for delivery":
      case "in transit":
        return "bg-blue-100 text-blue-800";
      case "processing":
      case "packed":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <Package className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Track Your <span className="text-blue-600">Order</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Stay updated on your fresh produce delivery. Enter your order
              number below to see real-time tracking information.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tracking Input */}
          <Card className="shadow-lg border-0 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900">
                Enter Order Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="e.g., FG-2024-001234"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                    onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                  />
                </div>
                <Button
                  onClick={handleTrackOrder}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                >
                  {isLoading ? "Tracking..." : "Track Order"}
                </Button>
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">
                You can find your order number in your confirmation email or
                account dashboard
              </p>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingResult && (
            <div className="space-y-8">
              {/* Order Status Overview */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        Order {trackingResult.orderNumber}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={getStatusColor(trackingResult.status)}
                        >
                          {trackingResult.status}
                        </Badge>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600">
                          {trackingResult.estimatedDelivery}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600 mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Delivery Address
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {trackingResult.customer.address}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Order Timeline */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    Order Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {trackingResult.timeline.map((step: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {getStatusIcon(
                            step.status,
                            step.completed,
                            step.current
                          )}
                          {index < trackingResult.timeline.length - 1 && (
                            <div
                              className={`w-0.5 h-12 mt-2 ${
                                step.completed ? "bg-green-600" : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3
                              className={`font-semibold ${
                                step.current
                                  ? "text-blue-600"
                                  : step.completed
                                  ? "text-green-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {step.status}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {step.description}
                          </p>
                          {step.current && (
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 text-sm font-medium">
                                Current Status
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingResult.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">
                        ${trackingResult.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card className="shadow-lg border-0 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Need Help?
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        If you have any questions about your order or delivery,
                        our customer support team is here to help.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" size="sm">
                          Contact Support
                        </Button>
                        <Button variant="outline" size="sm">
                          View Order Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Section for no results */}
          {!trackingResult && (
            <Card className="shadow-lg border-0 bg-gray-50">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Looking for your order?
                </h3>
                <p className="text-gray-600 mb-6">
                  Enter your order number above to track your fresh produce
                  delivery. You can find your order number in your confirmation
                  email.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline">Contact Support</Button>
                  <Button variant="outline">View Order History</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
