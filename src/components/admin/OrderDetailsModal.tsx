"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { updateOrderStatus, approveRefund } from "@/api/admin/orderApi";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onOrderUpdated: () => void;
}

const ORDER_STATUSES = [
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function OrderDetailsModal({
  open,
  onOpenChange,
  order,
  onOrderUpdated,
}: OrderDetailsModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    order?.orderStatus || ""
  );
  const [deliveryPartner, setDeliveryPartner] = useState(
    order?.deliveryPartner || ""
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order?.trackingNumber || ""
  );

  // Update state when order changes
  useEffect(() => {
    if (order) {
      setSelectedStatus(order.orderStatus || "");
      setDeliveryPartner(order.deliveryPartner || "");
      setTrackingNumber(order.trackingNumber || "");
    }
  }, [order]);

  const handleStatusUpdate = async () => {
    if (!order || !selectedStatus) return;

    setLoading(true);
    try {
      // Include delivery details when updating status
      await updateOrderStatus(order.id || order.orderId, {
        orderStatus: selectedStatus as any,
        deliveryPartner: deliveryPartner.trim(),
        trackingNumber: trackingNumber.trim(),
      });
      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });
      onOrderUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRefund = async () => {
    if (!order) return;

    setLoading(true);
    try {
      await approveRefund(order.id || order.orderId);
      toast({
        title: "Success",
        description: "Refund approved successfully!",
      });
      onOrderUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error approving refund:", error);
      toast({
        title: "Error",
        description: "Failed to approve refund. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "completed":
      case "delivered":
        return <Badge variant="default">Delivered</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View and manage order #{order.orderId || order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Order ID
              </Label>
              <p className="font-mono">{order.orderId || order.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Status
              </Label>
              <div>{getStatusBadge(order.orderStatus)}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Order Date
              </Label>
              <p>{formatDate(order.orderDate || order.createdAt)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Total Amount
              </Label>
              <p className="font-semibold text-lg">
                £{(order.totalAmount || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Name
                </Label>
                <p>
                  {order.user?.name ||
                    order.customerName ||
                    order.userName ||
                    "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Email
                </Label>
                <p>
                  {order.user?.email || order.userEmail || order.email || "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Phone
                </Label>
                <p>
                  {order.user?.phone || order.userPhone || order.phone || "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Payment Method
                </Label>
                <p>{order.paymentMethod || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Address */}
          {(order.deliveryAddress || order.shippingAddress) && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p>{order.deliveryAddress || order.shippingAddress}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {item.productName || item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        {item.productCode && (
                          <p className="text-sm text-gray-500">
                            Code: {item.productCode}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          £
                          {(
                            (item.unitPrice || 0) * (item.quantity || 0)
                          ).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          £{(item.unitPrice || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Delivery Tracking */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryPartner">Delivery Partner</Label>
                <Input
                  id="deliveryPartner"
                  value={deliveryPartner}
                  onChange={(e) => setDeliveryPartner(e.target.value)}
                  placeholder="Enter delivery partner name"
                />
                {order.deliveryPartner && (
                  <p className="text-sm text-gray-600">
                    Current: {order.deliveryPartner}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
                {order.trackingNumber && (
                  <p className="text-sm text-gray-600">
                    Current: {order.trackingNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Actions</h3>
            <div className="space-y-4">
              {/* Update Status */}
              <div className="space-y-2">
                <Label>Update Order Status</Label>
                <div className="flex space-x-2">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={
                      !selectedStatus ||
                      selectedStatus === order.orderStatus ||
                      loading
                    }
                  >
                    {loading ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </div>

              {/* Refund Actions */}
              {(order.refundStatus === "Pending" || order.requestedRefund) && (
                <div className="space-y-2">
                  <Label>Refund Actions</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleApproveRefund}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Approve Refund"}
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Refund Requested</Badge>
                      {order.refundReason && (
                        <span className="text-sm text-gray-600">
                          Reason: {order.refundReason}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
