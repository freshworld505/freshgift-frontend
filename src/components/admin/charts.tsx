"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getTotalRevenueAndOrdersByCategory,
  getAllOrders,
  PRODUCT_CATEGORIES,
} from "@/api/admin/analyticsApi";
import { RefreshCw } from "lucide-react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  isLoading?: boolean;
}

function ChartCard({ title, children, onRefresh, isLoading }: ChartCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <div className="h-2 w-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
            {title}
          </CardTitle>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                <span className="text-sm">Loading chart data...</span>
              </div>
            </div>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSalesData = async () => {
    try {
      setIsLoading(true);

      // Get orders data and process it by month
      const orders = await getAllOrders();
      //console.log("📊 SalesChart: Fetched orders:", orders?.length || 0);

      // Process orders data to get monthly sales and orders
      const monthlyData = orders.reduce((acc: any, order: any) => {
        const date = new Date(order.createdAt || order.orderDate);
        const month = date.toLocaleDateString("en-US", { month: "short" });
        const year = date.getFullYear();
        const key = `${month} ${year}`;

        if (!acc[key]) {
          acc[key] = { month: key, sales: 0, orders: 0 };
        }

        // Ensure totalAmount is a valid number
        const orderAmount = Number(order.totalAmount || order.total || 0);
        if (!isNaN(orderAmount) && isFinite(orderAmount)) {
          acc[key].sales += orderAmount;
        }
        acc[key].orders += 1;

        return acc;
      }, {});

      // Convert to array and sort by date (show last 6 months)
      const sortedData = Object.values(monthlyData)
        .sort(
          (a: any, b: any) =>
            new Date(a.month).getTime() - new Date(b.month).getTime()
        )
        .slice(-6)
        .map((item: any) => ({
          ...item,
          sales: Number(item.sales.toFixed(2)), // Round sales to 2 decimal places
        }));

      //console.log("📊 SalesChart: Processed data:", sortedData);
      setChartData(sortedData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      // Fallback to mock data
      const fallbackData = [
        { month: "Jan", sales: 4000, orders: 240 },
        { month: "Feb", sales: 3000, orders: 139 },
        { month: "Mar", sales: 2000, orders: 980 },
        { month: "Apr", sales: 2780, orders: 390 },
        { month: "May", sales: 1890, orders: 480 },
        { month: "Jun", sales: 2390, orders: 380 },
      ];
      setChartData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <ChartCard
      title="Sales & Orders Overview"
      onRefresh={fetchSalesData}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={12}
            fontWeight={500}
          />
          <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
            }}
            formatter={(value: any, name: string) => [
              name === "Sales (£)" ? `£${Number(value).toFixed(2)}` : value,
              name,
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#10b981"
            strokeWidth={3}
            name="Sales (£)"
            dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
            activeDot={{
              r: 8,
              stroke: "#10b981",
              strokeWidth: 2,
              fill: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Orders"
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
            activeDot={{
              r: 8,
              stroke: "#3b82f6",
              strokeWidth: 2,
              fill: "#fff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenueChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);

      // Get recent orders for the last week
      const orders = await getAllOrders();
      //console.log("📊 RevenueChart: Fetched orders:", orders?.length || 0);

      // Process orders data to get daily revenue for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date,
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          revenue: 0,
        };
      });

      // Calculate revenue for each day
      orders.forEach((order: any) => {
        const orderDate = new Date(order.createdAt || order.orderDate);
        const dayIndex = last7Days.findIndex(
          (day) => day.date.toDateString() === orderDate.toDateString()
        );

        if (dayIndex !== -1) {
          // Ensure totalAmount is a valid number
          const orderAmount = Number(order.totalAmount || order.total || 0);
          if (!isNaN(orderAmount) && isFinite(orderAmount)) {
            last7Days[dayIndex].revenue += orderAmount;
          }
        }
      });

      // Round revenue values to 2 decimal places
      const roundedData = last7Days.map((day) => ({
        ...day,
        revenue: Number(day.revenue.toFixed(2)),
      }));

      //console.log("📊 RevenueChart: Processed data:", roundedData);
      setChartData(roundedData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      // Fallback to mock data
      const fallbackData = [
        { day: "Mon", revenue: 2400 },
        { day: "Tue", revenue: 1398 },
        { day: "Wed", revenue: 9800 },
        { day: "Thu", revenue: 3908 },
        { day: "Fri", revenue: 4800 },
        { day: "Sat", revenue: 3800 },
        { day: "Sun", revenue: 4300 },
      ];
      setChartData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  return (
    <ChartCard
      title="Weekly Revenue"
      onRefresh={fetchRevenueData}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis
            dataKey="day"
            stroke="#64748b"
            fontSize={12}
            fontWeight={500}
          />
          <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
            }}
            formatter={(value: any, name: string) => [
              name === "revenue" ? `£${Number(value).toFixed(2)}` : value,
              name === "revenue" ? "Revenue" : name,
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#colorRevenue)"
          />
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CategoryChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategoryData = async () => {
    try {
      setIsLoading(true);

      // Fetch revenue data for each category
      const categoryPromises = PRODUCT_CATEGORIES.map(async (category) => {
        try {
          const response = await getTotalRevenueAndOrdersByCategory(category);
          // Ensure revenue is a valid number
          const revenue = Number(response.totalRevenue || 0);
          const orders = Number(response.totalOrders || 0);

          return {
            name: category,
            value:
              !isNaN(revenue) && isFinite(revenue)
                ? Number(revenue.toFixed(2))
                : 0,
            orders: !isNaN(orders) && isFinite(orders) ? orders : 0,
            color: getCategoryColor(category),
          };
        } catch (error) {
          console.warn(`Failed to fetch data for category ${category}:`, error);
          return {
            name: category,
            value: 0,
            orders: 0,
            color: getCategoryColor(category),
          };
        }
      });

      const categoryData = await Promise.all(categoryPromises);
      //console.log("📊 CategoryChart: Fetched category data:", categoryData);

      // Filter out categories with no revenue and sort by value
      const filteredData = categoryData
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 6); // Show top 6 categories

      //console.log("📊 CategoryChart: Processed data:", filteredData);
      setChartData(filteredData);
    } catch (error) {
      console.error("Error fetching category data:", error);
      // Fallback to mock data
      const fallbackData = [
        { name: "Fruits", value: 400, color: "#22c55e" },
        { name: "Vegetables", value: 300, color: "#3b82f6" },
        { name: "Herbs", value: 200, color: "#f59e0b" },
        { name: "Exotic", value: 100, color: "#ef4444" },
      ];
      setChartData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Fruits: "#22c55e",
      Vegetables: "#3b82f6",
      Herbs: "#f59e0b",
      Beverages: "#ef4444",
      Bakery: "#8b5cf6",
      Dairy: "#06b6d4",
      Snacks: "#f97316",
      "Frozen Foods": "#84cc16",
      Pantry: "#ec4899",
    };
    return colors[category as keyof typeof colors] || "#64748b";
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <ChartCard
      title="Sales by Category"
      onRefresh={fetchCategoryData}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={40}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
            fontSize={12}
            fontWeight={500}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
            }}
            formatter={(value: any, name: string) => [
              `£${Number(value).toFixed(2)}`,
              "Revenue",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function OrdersChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrdersData = async () => {
    try {
      setIsLoading(true);

      // Get orders data and process it by month
      const orders = await getAllOrders();
      //console.log("📊 OrdersChart: Fetched orders:", orders?.length || 0);

      // Process orders data to get monthly order counts
      const monthlyData = orders.reduce((acc: any, order: any) => {
        const date = new Date(order.createdAt || order.orderDate);
        const month = date.toLocaleDateString("en-US", { month: "short" });
        const year = date.getFullYear();
        const currentYear = new Date().getFullYear();

        // Only include current year data
        if (year === currentYear) {
          const key = month;

          if (!acc[key]) {
            acc[key] = { month: key, orders: 0 };
          }

          acc[key].orders += 1;
        }

        return acc;
      }, {});

      // Create array for all months and fill with data
      const allMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentMonth = new Date().getMonth();

      // Show last 6 months including current month
      const last6Months = allMonths.slice(
        Math.max(0, currentMonth - 5),
        currentMonth + 1
      );

      const chartData = last6Months.map((month) => ({
        month,
        orders: monthlyData[month]?.orders || 0,
      }));

      //console.log("📊 OrdersChart: Processed data:", chartData);
      setChartData(chartData);
    } catch (error) {
      console.error("Error fetching orders data:", error);
      // Fallback to mock data
      const fallbackData = [
        { month: "Jan", orders: 240 },
        { month: "Feb", orders: 139 },
        { month: "Mar", orders: 180 },
        { month: "Apr", orders: 390 },
        { month: "May", orders: 480 },
        { month: "Jun", orders: 380 },
      ];
      setChartData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  return (
    <ChartCard
      title="Monthly Orders"
      onRefresh={fetchOrdersData}
      isLoading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={12}
            fontWeight={500}
          />
          <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          />
          <Bar
            dataKey="orders"
            fill="url(#colorOrders)"
            radius={[8, 8, 0, 0]}
            stroke="#3b82f6"
            strokeWidth={1}
          />
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
