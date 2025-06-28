import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { 
  getAllOrders, 
  getRecentOrders, 
  getTopSellingProducts,
  getTotalOrdersRevenue 
} from '@/api/admin/analyticsApi';
import { getAllUsers, getAllCustomersCount } from '@/api/admin/usersApi';
import { searchProducts } from '@/api/admin/productApi';
import { getAllOrdersForAdmin } from '@/api/admin/orderApi';

// Query keys for consistent caching
export const adminQueryKeys = {
  all: ['admin'] as const,
  stats: () => [...adminQueryKeys.all, 'stats'] as const,
  orders: () => [...adminQueryKeys.all, 'orders'] as const,
  recentOrders: (limit: number) => [...adminQueryKeys.all, 'recent-orders', limit] as const,
  products: (searchTerm: string, page: number, limit: number) => 
    [...adminQueryKeys.all, 'products', searchTerm, page, limit] as const,
  users: () => [...adminQueryKeys.all, 'users'] as const,
  topProducts: () => [...adminQueryKeys.all, 'top-products'] as const,
  customersCount: () => [...adminQueryKeys.all, 'customers-count'] as const,
};

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
}

// Hook for fetching admin statistics
export const useAdminStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: async (): Promise<AdminStats> => {
      try {
        // Fetch all required data for stats in parallel
        const [ordersData, customersData, productsData] = await Promise.allSettled([
          getAllOrdersForAdmin(),
          getAllCustomersCount(),
          searchProducts('', 1, 1) // Just to get total count
        ]);

        // Calculate stats from the data
        let totalRevenue = 0;
        let totalOrders = 0;
        let totalUsers = 0;
        let totalProducts = 0;

        if (ordersData.status === 'fulfilled') {
          const orders = ordersData.value;
          totalOrders = orders.length;
          totalRevenue = orders
            .filter((order: any) => order.orderStatus === 'Delivered')
            .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
        }

        if (customersData.status === 'fulfilled') {
          totalUsers = customersData.value.totalCustomers;
        }

        if (productsData.status === 'fulfilled') {
          totalProducts = productsData.value.total;
        }

        return {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalUsers,
          revenueChange: 12.5, // Mock data - replace with actual calculation
          ordersChange: 8.3,   // Mock data - replace with actual calculation
          usersChange: 15.2,   // Mock data - replace with actual calculation
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    refetchOnMount: true, // Refresh on component mount
  });
};

// Hook for fetching all orders
export const useAdminOrders = () => {
  return useQuery({
    queryKey: adminQueryKeys.orders(),
    queryFn: getAllOrdersForAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  });
};

// Hook for fetching recent orders
export const useAdminRecentOrders = (limit: number = 4) => {
  return useQuery({
    queryKey: adminQueryKeys.recentOrders(limit),
    queryFn: () => getRecentOrders(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
    retry: 2,
    refetchOnWindowFocus: true, // More frequent updates for recent orders
  });
};

// Hook for fetching admin products
export const useAdminProducts = (searchTerm: string = '', page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: adminQueryKeys.products(searchTerm, page, limit),
    queryFn: () => searchProducts(searchTerm, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook for fetching all users
export const useAdminUsers = () => {
  return useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook for fetching top products
export const useAdminTopProducts = () => {
  return useQuery({
    queryKey: adminQueryKeys.topProducts(),
    queryFn: getTopSellingProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook for fetching customers count
export const useAdminCustomersCount = () => {
  return useQuery({
    queryKey: adminQueryKeys.customersCount(),
    queryFn: getAllCustomersCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Add query invalidation utilities
export const useAdminDashboardMutations = () => {
  const queryClient = useQueryClient();

  const invalidateStats = () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
  const invalidateOrders = () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders() });
  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
  const invalidateAll = () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });

  return {
    invalidateStats,
    invalidateOrders,
    invalidateProducts,
    invalidateAll,
  };
};

// Combined hook for dashboard data - executes all queries in parallel
export const useAdminDashboard = () => {
  const statsQuery = useAdminStats();
  const ordersQuery = useAdminOrders();
  const recentOrdersQuery = useAdminRecentOrders(4);
  const productsQuery = useAdminProducts('', 1, 50);
  const usersQuery = useAdminUsers();
  const topProductsQuery = useAdminTopProducts();

  // Aggregate loading state
  const isLoading = [
    statsQuery.isLoading,
    ordersQuery.isLoading,
    recentOrdersQuery.isLoading,
    productsQuery.isLoading,
    usersQuery.isLoading,
    topProductsQuery.isLoading,
  ].some(Boolean);

  // Check if any query is fetching (for refresh indicator)
  const isFetching = [
    statsQuery.isFetching,
    ordersQuery.isFetching,
    recentOrdersQuery.isFetching,
    productsQuery.isFetching,
    usersQuery.isFetching,
    topProductsQuery.isFetching,
  ].some(Boolean);

  // Aggregate error state
  const error = [
    statsQuery.error,
    ordersQuery.error,
    recentOrdersQuery.error,
    productsQuery.error,
    usersQuery.error,
    topProductsQuery.error,
  ].find(Boolean);

  return {
    // Data
    stats: statsQuery.data,
    orders: ordersQuery.data || [],
    recentOrders: recentOrdersQuery.data || [],
    products: productsQuery.data?.products || [],
    users: usersQuery.data || [],
    topProducts: topProductsQuery.data || [],
    
    // States
    isLoading,
    isFetching, // Added for refresh indicator
    statsLoading: statsQuery.isLoading,
    ordersLoading: ordersQuery.isLoading,
    productsLoading: productsQuery.isLoading,
    usersLoading: usersQuery.isLoading,
    error: error?.message || undefined,
    
    // Individual query states for more granular control
    queries: {
      stats: statsQuery,
      orders: ordersQuery,
      recentOrders: recentOrdersQuery,
      products: productsQuery,
      users: usersQuery,
      topProducts: topProductsQuery,
    },

    // Refetch functions
    refetchStats: statsQuery.refetch,
    refetchOrders: ordersQuery.refetch,
    refetchRecentOrders: recentOrdersQuery.refetch,
    refetchProducts: productsQuery.refetch,
    refetchUsers: usersQuery.refetch,
    refetchTopProducts: topProductsQuery.refetch,
    refetchAll: () => {
      return Promise.all([
        statsQuery.refetch(),
        ordersQuery.refetch(),
        recentOrdersQuery.refetch(),
        productsQuery.refetch(),
        usersQuery.refetch(),
        topProductsQuery.refetch(),
      ]);
    },
  };
};
