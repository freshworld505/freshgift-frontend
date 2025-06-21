"use client";

import { useEffect } from "react";
import type { Order } from "@/lib/types";
import { useAuthStore, useOrderStore } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";
import { Eye, RefreshCw } from "lucide-react";
import { formatCurrency, convertINRtoGBP } from "@/lib/currency";

export default function OrderHistory() {
  const { user } = useAuthStore();
  const { orders, isLoading, error, fetchOrders, clearError } = useOrderStore();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const handleRefresh = () => {
    if (error) {
      clearError();
    }
    fetchOrders();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Order History
            </h3>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
          <Button variant="outline" size="sm" disabled className="rounded-xl">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <Skeleton className="h-6 w-1/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Orders
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl px-6"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            No Orders Yet
          </h3>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to see your order
            history here!
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-8"
          >
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Order History</h3>
          <p className="text-gray-600">Track and manage all your orders</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="rounded-xl border-green-200 hover:bg-green-50"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-gray-700">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Total
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Payment
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={order.orderId}
                className="hover:bg-gray-50/50 transition-colors border-b border-gray-100"
              >
                <TableCell className="font-medium text-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>#
                    {order.orderId.substring(order.orderId.length - 8)}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">
                      {formatCurrency(convertINRtoGBP(order.totalAmount))}
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        Saved{" "}
                        {formatCurrency(convertINRtoGBP(order.discountAmount))}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge
                      variant={order.isPaid ? "default" : "destructive"}
                      className={
                        order.isPaid
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : ""
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {order.paymentMethod}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(order.orderStatus)}
                    className={
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : order.orderStatus === "Processing"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : order.orderStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : order.orderStatus === "Cancelled"
                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                        : ""
                    }
                  >
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    <Link href={`/account/orders/${order.orderId}`}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
