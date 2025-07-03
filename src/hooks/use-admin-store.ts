import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Import admin APIs
import { 
  getAllOrders, 
  getRecentOrders, 
  getTopSellingProducts,
  getTotalOrdersRevenue 
} from '@/api/admin/analyticsApi';
import { getAllUsers, getAllCustomersCount, getActiveAndInactiveUsers } from '@/api/admin/usersApi';
import { searchProducts, createProduct, editProduct, deleteProduct } from '@/api/admin/productApi';
import { getAllOrdersForAdmin, getOrderById } from '@/api/admin/orderApi';

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
}

interface AdminState {
  // Data
  stats: AdminStats | null;
  orders: any[];
  products: any[];
  users: any[];
  recentOrders: any[];
  topProducts: any[];
  userStatusData: any | null;
  
  // Loading states
  isLoading: boolean;
  statsLoading: boolean;
  ordersLoading: boolean;
  productsLoading: boolean;
  usersLoading: boolean;
  userStatusLoading: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchProducts: (searchTerm?: string, page?: number, limit?: number) => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchUserStatus: () => Promise<void>;
  fetchRecentOrders: (limit?: number) => Promise<void>;
  fetchTopProducts: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<any>;
  createProduct: (productData: any) => Promise<any>;
  updateProduct: (productId: string, productData: any) => Promise<any>;
  deleteProduct: (productId: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    (set, get) => ({
      // Initial state
      stats: null,
      orders: [],
      products: [],
      users: [],
      recentOrders: [],
      topProducts: [],
      userStatusData: null,
      
      isLoading: false,
      statsLoading: false,
      ordersLoading: false,
      productsLoading: false,
      usersLoading: false,
      userStatusLoading: false,
      
      error: null,

      // Actions
      fetchStats: async () => {
        set({ statsLoading: true, error: null });
        try {
          // Fetch all required data for stats
          const [ordersData, customersData, productsData] = await Promise.allSettled([
            getAllOrders(),
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

          const stats: AdminStats = {
            totalRevenue,
            totalOrders,
            totalProducts,
            totalUsers,
            revenueChange: 12.5, // Mock data - replace with actual calculation
            ordersChange: 8.3,   // Mock data - replace with actual calculation
            usersChange: 15.2,   // Mock data - replace with actual calculation
          };

          set({ stats, statsLoading: false });
        } catch (error: any) {
          console.error('Error fetching admin stats:', error);
          set({ 
            error: error.message || 'Failed to fetch admin statistics',
            statsLoading: false 
          });
        }
      },

      fetchOrders: async () => {
        set({ ordersLoading: true, error: null });
        try {
          const orders = await getAllOrdersForAdmin();
          set({ orders, ordersLoading: false });
        } catch (error: any) {
          console.error('Error fetching orders:', error);
          set({ 
            error: error.message || 'Failed to fetch orders',
            ordersLoading: false 
          });
        }
      },

      fetchProducts: async (searchTerm = '', page = 1, limit = 50) => {
        set({ productsLoading: true, error: null });
        try {
          const response = await searchProducts(searchTerm, page, limit);
          set({ products: response.products, productsLoading: false });
        } catch (error: any) {
          console.error('Error fetching products:', error);
          set({ 
            error: error.message || 'Failed to fetch products',
            productsLoading: false 
          });
        }
      },

      fetchUsers: async () => {
        set({ usersLoading: true, error: null });
        try {
          const users = await getAllUsers();
          set({ users, usersLoading: false });
        } catch (error: any) {
          console.error('Error fetching users:', error);
          set({ 
            error: error.message || 'Failed to fetch users',
            usersLoading: false 
          });
        }
      },

      fetchUserStatus: async () => {
        set({ userStatusLoading: true });
        try {
          const userStatusData = await getActiveAndInactiveUsers();
          set({ userStatusData, userStatusLoading: false });
        } catch (error: any) {
          console.error('Error fetching user status:', error);
          set({ userStatusLoading: false });
        }
      },

      fetchRecentOrders: async (limit = 5) => {
        try {
          console.log(`🔄 Fetching ${limit} recent orders...`);
          const recentOrders = await getRecentOrders(limit);
          console.log("✅ Recent orders fetched from API:", recentOrders?.length || 0);
          set({ recentOrders });
        } catch (error: any) {
          console.warn('⚠️ Recent orders API failed, trying fallback with regular orders');
          console.error('Recent orders API error:', error);
          
          // Fallback: use regular orders data if available
          try {
            const { orders } = get();
            if (orders && orders.length > 0) {
              const fallbackRecentOrders = orders
                .sort((a: any, b: any) => new Date(b.createdAt || b.orderDate || 0).getTime() - new Date(a.createdAt || a.orderDate || 0).getTime())
                .slice(0, limit);
              console.log("✅ Using fallback recent orders:", fallbackRecentOrders?.length || 0);
              set({ recentOrders: fallbackRecentOrders });
            } else {
              console.log("📋 No orders available for fallback");
              set({ recentOrders: [] });
            }
          } catch (fallbackError) {
            console.error('❌ Fallback for recent orders also failed:', fallbackError);
            set({ recentOrders: [] });
          }
        }
      },

      fetchTopProducts: async () => {
        try {
          console.log("🔄 Fetching top products...");
          const topProducts = await getTopSellingProducts();
          console.log("✅ Top products fetched from API:", topProducts?.length || 0);
          set({ topProducts });
        } catch (error: any) {
          console.warn('⚠️ Top products API failed, trying fallback with regular products');
          console.error('Top products API error:', error);
          
          // Fallback: use regular products data if available
          try {
            const { products } = get();
            if (products && products.length > 0) {
              const fallbackTopProducts = products
                .filter((product: any) => product && product.finalPrice)
                .sort((a: any, b: any) => (b?.finalPrice || 0) - (a?.finalPrice || 0))
                .slice(0, 5)
                .map((product: any) => ({
                  ...product,
                  name: product.productName,
                  revenue: product.finalPrice,
                  sales: product.stock || 0, // Mock sales data
                }));
              console.log("✅ Using fallback top products:", fallbackTopProducts?.length || 0);
              set({ topProducts: fallbackTopProducts });
            } else {
              console.log("📋 No products available for fallback");
              set({ topProducts: [] });
            }
          } catch (fallbackError) {
            console.error('❌ Fallback for top products also failed:', fallbackError);
            set({ topProducts: [] });
          }
        }
      },

      fetchOrderById: async (orderId: string) => {
        try {
          const order = await getOrderById(orderId);
          return order;
        } catch (error: any) {
          console.error('Error fetching order by ID:', error);
          throw error;
        }
      },

      createProduct: async (productData: any) => {
        set({ productsLoading: true, error: null });
        try {
          await createProduct(productData);
          // Optionally, refetch products or update state to include the new product
          const response = await searchProducts('', 1, 50);
          set({ products: response.products, productsLoading: false });
        } catch (error: any) {
          console.error('Error creating product:', error);
          set({ 
            error: error.message || 'Failed to create product',
            productsLoading: false 
          });
        }
      },

      updateProduct: async (productId: string, productData: any) => {
        set({ productsLoading: true, error: null });
        try {
          // Use editProduct with the correct data format
          const editData = {
            productId,
            ...productData
          };
          await editProduct(editData);
          // Refetch products to update the list
          const response = await searchProducts('', 1, 50);
          set({ products: response.products, productsLoading: false });
        } catch (error: any) {
          console.error('Error updating product:', error);
          set({ 
            error: error.message || 'Failed to update product',
            productsLoading: false 
          });
        }
      },

      deleteProduct: async (productId: string) => {
        set({ productsLoading: true, error: null });
        try {
          await deleteProduct(productId);
          // Refetch products to update the list
          const response = await searchProducts('', 1, 50);
          set({ products: response.products, productsLoading: false });
        } catch (error: any) {
          console.error('Error deleting product:', error);
          set({ 
            error: error.message || 'Failed to delete product',
            productsLoading: false 
          });
        }
      },

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'admin-store',
    }
  )
);
