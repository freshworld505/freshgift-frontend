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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Loading Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing your dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive insights into your store's performance, sales trends,
            and customer behavior
          </p>
        </div>

        {/* Filters */}
        <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <div className="p-2 bg-white/20 rounded-lg mr-3">
                <Filter className="w-5 h-5" />
              </div>
              Analytics Filters
            </CardTitle>
            <CardDescription className="text-blue-100">
              Filter analytics data by category, subcategory, tags, or date
              range to get detailed insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Package className="w-4 h-4 mr-2 text-blue-500" />
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-colors">
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
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Package className="w-4 h-4 mr-2 text-green-500" />
                  Subcategory
                </Label>
                <Select
                  value={selectedSubcategory}
                  onValueChange={setSelectedSubcategory}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-600 hover:border-green-400 transition-colors">
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
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Badge className="w-4 h-4 mr-2 text-purple-500" />
                  Tag
                </Label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 transition-colors">
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
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                  Date Range
                </Label>
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
                    className="h-12 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-400 transition-colors"
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
                    className="h-12 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button
                onClick={fetchCategoryAnalytics}
                disabled={!selectedCategory || loading}
                className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Category
              </Button>
              <Button
                onClick={fetchSubcategoryAnalytics}
                disabled={!selectedSubcategory || loading}
                className="h-12 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Subcategory
              </Button>
              <Button
                onClick={fetchTagAnalytics}
                disabled={!selectedTag || loading}
                className="h-12 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Tag
              </Button>
              <Button
                onClick={fetchDateRangeAnalytics}
                disabled={!dateRange.startDate || !dateRange.endDate || loading}
                className="h-12 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Analyze Date Range
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="h-12 px-6 border-2 border-gray-300 dark:border-gray-600 hover:border-red-400 hover:text-red-600 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Analytics */}
          {categoryData.items && categoryData.items.length > 0 && (
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-white/20 rounded-lg mr-3">
                    <Package className="w-5 h-5" />
                  </div>
                  Category Analytics: {selectedCategory}
                </CardTitle>
                <CardDescription className="text-blue-100 text-base">
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Revenue: £{categoryData.totalRevenue}
                    </div>
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Orders: {categoryData.totalOrders}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {categoryData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-200 dark:border-gray-500 hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-lg">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          {item.orders} orders
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-blue-600 dark:text-blue-400">
                          £{item.revenue}
                        </div>
                        {item.percentage && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {item.percentage}%
                          </Badge>
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
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-white/20 rounded-lg mr-3">
                    <Package className="w-5 h-5" />
                  </div>
                  Subcategory Analytics: {selectedSubcategory}
                </CardTitle>
                <CardDescription className="text-green-100 text-base">
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Revenue: £{subcategoryData.totalRevenue}
                    </div>
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Orders: {subcategoryData.totalOrders}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {subcategoryData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-200 dark:border-gray-500 hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-lg">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          {item.orders} orders
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-green-600 dark:text-green-400">
                          £{item.revenue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tag Analytics */}
          {tagData.items && tagData.items.length > 0 && (
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-white/20 rounded-lg mr-3">
                    <Badge className="w-5 h-5" />
                  </div>
                  Tag Analytics: {selectedTag}
                </CardTitle>
                <CardDescription className="text-purple-100 text-base">
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Revenue: £{tagData.totalRevenue}
                    </div>
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Orders: {tagData.totalOrders}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {tagData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-purple-200 dark:border-gray-500 hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-lg">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          {item.orders} orders
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-purple-600 dark:text-purple-400">
                          £{item.revenue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date Range Analytics */}
          {dateRangeData.items && dateRangeData.items.length > 0 && (
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-white/20 rounded-lg mr-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  Date Range Analytics
                </CardTitle>
                <CardDescription className="text-orange-100 text-base">
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-sm">
                      {dateRange.startDate} to {dateRange.endDate}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Revenue: £{dateRangeData.totalRevenue}
                    </div>
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Orders: {dateRangeData.totalOrders}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {dateRangeData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-orange-200 dark:border-gray-500 hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-lg">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          {item.orders} orders
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-orange-600 dark:text-orange-400">
                          £{item.revenue}
                        </div>
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
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Loading analytics data...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
