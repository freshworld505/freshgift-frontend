"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Package } from "lucide-react";

export default function ActiveDeliveries() {
  const activeDeliveries = [
    {
      id: "FG001234",
      customer: "John Smith",
      phone: "+44 7123 456789",
      address: "123 Main Street, London SW1A 1AA",
      items: 8,
      estimatedTime: "2:30 PM",
      status: "ready",
      orderValue: "£45.20",
      specialInstructions: "Ring doorbell twice, deliver to side door",
    },
    {
      id: "FG001235",
      customer: "Sarah Johnson",
      phone: "+44 7987 654321",
      address: "456 Oak Avenue, London E1 6AN",
      items: 5,
      estimatedTime: "3:00 PM",
      status: "in-transit",
      orderValue: "£32.15",
      specialInstructions: "Leave with neighbor if not available",
    },
    {
      id: "FG001236",
      customer: "Michael Brown",
      phone: "+44 7555 123456",
      address: "789 High Street, London W1K 5SE",
      items: 12,
      estimatedTime: "3:45 PM",
      status: "ready",
      orderValue: "£78.50",
      specialInstructions: "Fragile items - handle with care",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return "Ready for Pickup";
      case "in-transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Active Deliveries</h1>
        <Badge variant="outline" className="px-3 py-1">
          {activeDeliveries.length} Active
        </Badge>
      </div>

      <div className="grid gap-6">
        {activeDeliveries.map((delivery) => (
          <Card key={delivery.id} className="shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Order #{delivery.id}</CardTitle>
                <Badge className={getStatusColor(delivery.status)}>
                  {getStatusText(delivery.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{delivery.customer}</strong> • {delivery.items}{" "}
                      items • {delivery.orderValue}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{delivery.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{delivery.phone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Est. delivery: {delivery.estimatedTime}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Special Instructions
                    </h4>
                    <p className="text-sm bg-muted p-2 rounded">
                      {delivery.specialInstructions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {delivery.status === "ready" && (
                  <>
                    <Button size="sm" className="flex-1">
                      Start Delivery
                    </Button>
                    <Button size="sm" variant="outline">
                      View Route
                    </Button>
                  </>
                )}
                {delivery.status === "in-transit" && (
                  <>
                    <Button size="sm" className="flex-1">
                      Mark as Delivered
                    </Button>
                    <Button size="sm" variant="outline">
                      Call Customer
                    </Button>
                    <Button size="sm" variant="outline">
                      Report Issue
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
