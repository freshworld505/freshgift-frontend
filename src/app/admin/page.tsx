"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAdminStore } from "@/hooks/use-admin-store";
import {
  SalesChart,
  RevenueChart,
  CategoryChart,
  OrdersChart,
} from "@/components/admin/charts";

// Default fallback stats for when data is loading
const defaultStats = {
  totalRevenue: 0,
  revenueChange: 0,
  totalOrders: 0,
  ordersChange: 0,
  totalProducts: 0,
  totalUsers: 0,
  usersChange: 0,
};

export default function AdminDashboard() {
  const {
    stats,
    recentOrders,
    topProducts,
    orders,
    products,
    statsLoading,
    error,
    fetchStats,
    fetchRecentOrders,
    fetchTopProducts,
    fetchOrders,
    fetchProducts,
  } = useAdminStore();

  // Use actual stats or defaults
  const currentStats = stats || defaultStats;

  useEffect(() => {
    // Fetch all dashboard data
    const loadDashboardData = async () => {
      try {
        console.log("🔄 Loading dashboard data...");

        // Fetch stats first
        await fetchStats();

        // Fetch base data (orders and products) first for fallback
        try {
          console.log("🔄 Loading base orders and products data...");
          await Promise.all([fetchOrders(), fetchProducts()]);
          console.log("✅ Base data loaded successfully");
        } catch (error) {
          console.warn("⚠️ Base data loading failed:", error);
        }

        // Try to fetch recent orders, with fallback
        try {
          await fetchRecentOrders(4);
          console.log("✅ Recent orders loaded successfully");
        } catch (error) {
          console.warn(
            "⚠️ Recent orders API failed, this is expected if endpoint doesn't exist yet"
          );
          console.error("Recent orders error:", error);
        }

        // Try to fetch top products, with fallback
        try {
          await fetchTopProducts();
          console.log("✅ Top products loaded successfully");
        } catch (error) {
          console.warn(
            "⚠️ Top products API failed, this is expected if endpoint doesn't exist yet"
          );
          console.error("Top products error:", error);
        }

        console.log("✅ Dashboard data loading completed");
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
      }
    };

    loadDashboardData();
  }, [
    fetchStats,
    fetchRecentOrders,
    fetchTopProducts,
    fetchOrders,
    fetchProducts,
  ]);

  if (statsLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading your FreshGift admin dashboard...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Error loading dashboard data: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome to your FreshGift admin dashboard. Here's what's happening
          with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{currentStats.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {currentStats.revenueChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span
                className={
                  currentStats.revenueChange > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(currentStats.revenueChange)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentStats.totalOrders.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">
                {currentStats.ordersChange}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentStats.totalProducts.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              <span className="text-red-500">0%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentStats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">
                {currentStats.usersChange}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Dashboard */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Analytics Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Visual insights into your store's performance and trends
          </p>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <RevenueChart />
          <CategoryChart />
          <OrdersChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              Recent Orders
            </CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders?.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div
                    key={order.orderId || order.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          Order #
                          {(order.orderId || order.id)?.slice(0, 8) || "N/A"}
                        </p>
                        <Badge
                          variant={
                            order.orderStatus === "Delivered"
                              ? "default"
                              : order.orderStatus === "Processing"
                              ? "secondary"
                              : order.orderStatus === "Shipped"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {order.orderStatus || order.status || "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {order.user?.name ||
                          order.user?.email ||
                          order.customer ||
                          order.customerName ||
                          "Unknown Customer"}{" "}
                        • {order.items?.length || 0} items
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(
                          order.createdAt || order.orderDate || new Date()
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        £{(order.totalAmount || order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    No recent orders available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              Top Products
            </CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts?.length > 0 ? (
                topProducts.map((product: any, index: number) => (
                  <div
                    key={
                      product.productId ||
                      product.id ||
                      product.productName ||
                      index
                    }
                    className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {index + 1}
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex-shrink-0 overflow-hidden ring-2 ring-white/50 dark:ring-slate-600/50">
                      <img
                        src={
                          product?.productImage ||
                          product?.productImages?.[0] ||
                          product?.images?.[0] ||
                          "/placeholder-product.svg"
                        }
                        alt={product?.productName || product?.name || "Product"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-product.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {product.productName ||
                          product.name ||
                          "Unknown Product"}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {product.totalSold || product.sales || 0} sold •{" "}
                        {product.category || "Unknown Category"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        £
                        {(
                          product.revenue ||
                          product.totalRevenue ||
                          product.finalPrice ||
                          0
                        ).toFixed(2)}
                      </p>
                      {product.stock !== undefined && (
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Stock: {product.stock}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    No top products data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
