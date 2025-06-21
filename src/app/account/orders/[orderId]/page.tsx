"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrderStore } from "@/lib/store";
import type { Order, OrderItem } from "@/lib/types";
import { canCancelOrder } from "@/api/orderApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  MapPin,
  CalendarDays,
  ListOrdered,
} from "lucide-react";
import { formatCurrency, convertINRtoGBP } from "@/lib/currency";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const {
    currentOrder,
    isLoading,
    error,
    fetchOrderById,
    cancelOrder: cancelOrderFromStore,
  } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        try {
          const fetchedOrder = await fetchOrderById(orderId);
          setOrder(fetchedOrder);
        } catch (error) {
          console.error("Failed to fetch order:", error);
        }
      }
    };

    loadOrder();
  }, [orderId, fetchOrderById]);

  const handleCancelOrder = async () => {
    if (!order || !canCancelOrder(order)) return;

    setIsCancelling(true);
    try {
      const cancelledOrder = await cancelOrderFromStore(order.orderId);
      setOrder(cancelledOrder);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="inline-flex items-center text-primary hover:underline px-0 hover:bg-transparent mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Orders
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="inline-flex items-center text-primary hover:underline px-0 hover:bg-transparent mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Orders
        </Button>

        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error || "Order not found"}</p>
            <Button onClick={() => router.push("/account/orders")}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center text-primary hover:underline px-0 hover:bg-transparent mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Orders
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Order Details
              </CardTitle>
              <CardDescription>
                Order ID: #{order.orderId.substring(order.orderId.length - 6)}
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 sm:text-right">
              <p>Date: {format(new Date(order.createdAt), "PPP p")}</p>
              <Badge
                variant={getStatusBadgeVariant(order.orderStatus)}
                className={`text-sm ${
                  order.orderStatus === "Delivered"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : order.orderStatus === "Processing"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : order.orderStatus === "Pending"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                    : ""
                }`}
              >
                Status: {order.orderStatus}
              </Badge>
              {canCancelOrder(order) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-primary" />
              Items Ordered
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden sm:table-cell">
                    Image
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: OrderItem) => (
                  <TableRow key={item.productId}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        src={item.productImage || "/placeholder.jpg"}
                        alt={item.productName || "Product"}
                        width={64}
                        height={64}
                        className="rounded-md object-cover aspect-square"
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        Product ID: {item.productId}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(convertINRtoGBP(item.unitPrice))}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(
                        convertINRtoGBP(item.unitPrice * item.quantity)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Address
              </h3>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p>{order.deliveryAddress}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Delivery Schedule
              </h3>
              <p className="text-sm text-muted-foreground">
                {order.scheduledTime
                  ? format(new Date(order.scheduledTime), "PPP p")
                  : "Standard delivery"}
              </p>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="p-6 bg-muted/50 rounded-b-lg">
          <div className="w-full space-y-1 text-right">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal (from items above):</span>
              <span>
                {formatCurrency(
                  convertINRtoGBP(
                    order.items.reduce((sum, item) => sum + item.totalPrice, 0)
                  )
                )}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount Applied:</span>
                <span>
                  -{formatCurrency(convertINRtoGBP(order.discountAmount))}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Shipping & Handling:</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground pt-1 border-t border-border mt-1">
              <span>Grand Total:</span>
              <span>{formatCurrency(convertINRtoGBP(order.totalAmount))}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
