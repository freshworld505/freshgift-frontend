"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Filter,
  RotateCcw,
} from "lucide-react";
import { useAdminStore } from "@/hooks/use-admin-store";
import {
  SalesChart,
  RevenueChart,
  CategoryChart,
  OrdersChart,
} from "@/components/admin/charts";
import {
  getTotalRevenueAndOrdersByCategory,
  getTotalOrdersAndRevenueBySubcategory,
  getTotalOrdersAndRevenueByTag,
  getTotalOrdersAndRevenueByDateRange,
  PRODUCT_CATEGORIES,
  PRODUCT_SUBCATEGORIES,
  PRODUCT_TAGS,
} from "@/api/admin/analyticsApi";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  items?: Array<{
    name: string;
    orders: number;
    revenue: number;
    percentage?: number;
  }>;
}

export default function AdminAnalytics() {
  const { stats, statsLoading, fetchStats } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    items: [],
  });
  const [subcategoryData, setSubcategoryData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    items: [],
  });
  const [tagData, setTagData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    items: [],
  });
  const [dateRangeData, setDateRangeData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    items: [],
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const fetchCategoryAnalytics = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const data = await getTotalRevenueAndOrdersByCategory(selectedCategory);

      setCategoryData({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        items: [
          {
            name: selectedCategory,
            orders: data.totalOrders || 0,
            revenue: data.totalRevenue || 0,
            percentage: 100,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching category analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategoryAnalytics = async () => {
    if (!selectedSubcategory) return;

    setLoading(true);
    try {
      const data = await getTotalOrdersAndRevenueBySubcategory(
        selectedSubcategory
      );
      setSubcategoryData({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        items: [
          {
            name: selectedSubcategory,
            orders: data.totalOrders || 0,
            revenue: data.totalRevenue || 0,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching subcategory analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTagAnalytics = async () => {
    if (!selectedTag) return;

    setLoading(true);
    try {
      const data = await getTotalOrdersAndRevenueByTag(selectedTag);
      setTagData({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        items: [
          {
            name: selectedTag,
            orders: data.totalOrders || 0,
            revenue: data.totalRevenue || 0,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching tag analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDateRangeAnalytics = async () => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    setLoading(true);
    try {
      const data = await getTotalOrdersAndRevenueByDateRange(
        dateRange.startDate,
        dateRange.endDate,
        selectedCategory || "",
        selectedTag || ""
      );
      setDateRangeData({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        items: [
          {
            name: `${dateRange.startDate} to ${dateRange.endDate}`,
            orders: data.totalOrders || 0,
            revenue: data.totalRevenue || 0,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching date range analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedTag("");
    setDateRange({ startDate: "", endDate: "" });
    setCategoryData({ totalRevenue: 0, totalOrders: 0, items: [] });
    setSubcategoryData({ totalRevenue: 0, totalOrders: 0, items: [] });
    setTagData({ totalRevenue: 0, totalOrders: 0, items: [] });
    setDateRangeData({ totalRevenue: 0, totalOrders: 0, items: [] });
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your store's performance and insights
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{stats?.totalRevenue || 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% from last month
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
              {stats?.totalProducts || 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Dashboard */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Visual Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive charts and graphs showing your store's performance
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Analytics Filters
          </CardTitle>
          <CardDescription>
            Filter analytics data by category, subcategory, tags, or date range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Filter */}
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Select
                value={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_SUBCATEGORIES.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filter */}
            <div className="space-y-2">
              <Label>Tag</Label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TAGS.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  placeholder="Start date"
                />
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  placeholder="End date"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={fetchCategoryAnalytics}
              disabled={!selectedCategory || loading}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyze Category
            </Button>
            <Button
              onClick={fetchSubcategoryAnalytics}
              disabled={!selectedSubcategory || loading}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyze Subcategory
            </Button>
            <Button
              onClick={fetchTagAnalytics}
              disabled={!selectedTag || loading}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyze Tag
            </Button>
            <Button
              onClick={fetchDateRangeAnalytics}
              disabled={!dateRange.startDate || !dateRange.endDate || loading}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Analyze Date Range
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Analytics */}
        {categoryData.items && categoryData.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Category Analytics: {selectedCategory}</CardTitle>
              <CardDescription>
                Revenue: £{categoryData.totalRevenue} | Orders:{" "}
                {categoryData.totalOrders}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.orders} orders
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{item.revenue}</div>
                      {item.percentage && (
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subcategory Analytics */}
        {subcategoryData.items && subcategoryData.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Subcategory Analytics: {selectedSubcategory}
              </CardTitle>
              <CardDescription>
                Revenue: £{subcategoryData.totalRevenue} | Orders:{" "}
                {subcategoryData.totalOrders}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subcategoryData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.orders} orders
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{item.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tag Analytics */}
        {tagData.items && tagData.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tag Analytics: {selectedTag}</CardTitle>
              <CardDescription>
                Revenue: £{tagData.totalRevenue} | Orders: {tagData.totalOrders}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tagData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.orders} orders
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{item.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Range Analytics */}
        {dateRangeData.items && dateRangeData.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Date Range Analytics</CardTitle>
              <CardDescription>
                {dateRange.startDate} to {dateRange.endDate} | Revenue: £
                {dateRangeData.totalRevenue} | Orders:{" "}
                {dateRangeData.totalOrders}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dateRangeData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.orders} orders
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{item.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}
