"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, Package } from "lucide-react";
import { useAdminStore } from "@/hooks/use-admin-store";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";

export default function AdminOrders() {
  const { orders, ordersLoading, error, fetchOrders } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleOrderUpdated = () => {
    fetchOrders(); // Refresh the orders list
  };

  useEffect(() => {
    // Fetch orders when component mounts
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (order: any) =>
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "completed":
      case "delivered":
        return <Badge variant="default">Delivered</Badge>;
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Shipped
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      completed: orders.filter(
        (o: any) =>
          o.orderStatus?.toLowerCase() === "delivered" ||
          o.status?.toLowerCase() === "completed"
      ).length,
      processing: orders.filter(
        (o: any) =>
          o.orderStatus?.toLowerCase() === "processing" ||
          o.status?.toLowerCase() === "processing"
      ).length,
      pending: orders.filter(
        (o: any) =>
          o.orderStatus?.toLowerCase() === "pending" ||
          o.status?.toLowerCase() === "pending"
      ).length,
      totalRevenue: orders
        .filter(
          (o: any) =>
            o.orderStatus?.toLowerCase() === "delivered" ||
            o.status?.toLowerCase() === "completed"
        )
        .reduce(
          (sum: number, o: any) => sum + (o.totalAmount || o.total || 0),
          0
        ),
    };
    return stats;
  };

  const stats = getOrderStats();

  if (ordersLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading order management...
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="mt-2 text-red-600">Error loading orders: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and track customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.processing}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{stats.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>View and manage all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No orders found
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order: any) => (
                    <TableRow key={order.id || order.orderId}>
                      <TableCell className="font-medium">
                        {order.id || order.orderId}
                      </TableCell>
                      <TableCell>
                        {order.user?.name ||
                          order.customer ||
                          order.customerName ||
                          order.user?.email?.split("@")[0] ||
                          order.userEmail?.split("@")[0]}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {order.user?.email || order.email || order.userEmail}
                      </TableCell>
                      <TableCell>
                        {order.items?.length ||
                          order.cartItems?.length ||
                          "N/A"}{" "}
                        items
                      </TableCell>
                      <TableCell className="font-medium">
                        £{(order.total || order.totalAmount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status || order.orderStatus)}
                      </TableCell>
                      <TableCell>
                        {order.date ||
                          (order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          open={orderDetailsOpen}
          onOpenChange={setOrderDetailsOpen}
          order={selectedOrder}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}
