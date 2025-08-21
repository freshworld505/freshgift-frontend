import { ensureAuthenticated } from './authTokenHelper';
import axios from 'axios';

export const PRODUCT_CATEGORIES = [
  'Fruits',
  'Vegetables', 
  'Beverages',
  'Bakery',
  'Dairy',
  'Snacks',
  'Frozen Foods',
  'Pantry',
  'Herbs',
];

export const PRODUCT_SUBCATEGORIES = [
  'Leafy Greens',
  'Root Vegetables',
  'Seasonal Picks',
  'Citrus Fruits',
  'Fresh Juices',
  'Organic Choices',
];

export const PRODUCT_TAGS = [
  'Fresh',
  'Organic',
  'Imported',
  'On Sale',
  'New Arrival',
  'Top Pick',
  'Instant Delivery',
];

// Base URL for the API
//const API_BASE_URL = 'https://freshgiftbackend.onrender.com/api/orders/admin';
const API_BASE_URL = 'http://localhost:5003/api/orders/admin';

// Total orders revenue
export const getTotalOrdersRevenue = async (): Promise<number> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/analytics/filter`);
    
    if (!response.data || typeof response.data.totalRevenue !== 'number') {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    console.log("✅ Total orders revenue fetched successfully:", response.data);
    return response.data.totalRevenue;
  } catch (error) {
    console.error("❌ Error fetching total orders revenue:", error);
    throw error;
  }
};

// Total revenue and orders by Category
export const getTotalRevenueAndOrdersByCategory = async (category: string): Promise<any> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/analytics/filter?category=${category}`);
    
    if (!response.data || typeof response.data.totalRevenue !== 'number' || typeof response.data.totalOrders !== 'number') {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    console.log("✅ Total revenue and orders by category fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching total revenue and orders by category:", error);
    throw error;
  }
}

// Total orders and revenue by subcategory
export const getTotalOrdersAndRevenueBySubcategory = async (subCategory: string): Promise<any> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/analytics/filter?subCategory=${subCategory}`);
    
    if (!response.data || typeof response.data.totalRevenue !== 'number' || typeof response.data.totalOrders !== 'number') {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }

    console.log("✅ Total orders and revenue by subcategory fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching total orders and revenue by subcategory:", error);
    throw error;
  }
}

// Total orders and revenue by tag
export const getTotalOrdersAndRevenueByTag = async (tag: string): Promise<any> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/analytics/filter?tag=${tag}`);
    
    if (!response.data || typeof response.data.totalRevenue !== 'number' || typeof response.data.totalOrders !== 'number') {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    console.log("✅ Total orders and revenue by tag fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching total orders and revenue by tag:", error);
    throw error;
  }
}

// Total orders and revenue by date range and more filters
export const getTotalOrdersAndRevenueByDateRange = async (
  startDate: string, 
  endDate: string, 
  category: string, 
  tag: string
): Promise<{ 
  totalRevenue: number; 
  totalOrders: number; 
  startDate: string; 
  endDate: string; 
  category: string; 
  subCategory: string; 
  tag: string 
}> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/analytics/filter`, {
      params: { startDate, endDate, category, tag }
    });
    
    if (!response.data || typeof response.data.totalRevenue !== 'number' || typeof response.data.totalOrders !== 'number') {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    console.log("✅ Total orders and revenue by date range fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching total orders and revenue by date range:", error);
    throw error;
  }
}

// All orders
export const getAllOrders = async (): Promise<any[]> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    if (!response.data || !Array.isArray(response.data.orders)) {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    console.log("✅ All orders fetched successfully:", response.data);
    return response.data.orders;
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    throw error;
  }
}

// Recent orders
export const getRecentOrders = async (limit: number = 10): Promise<any[]> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/analytics/recent-orders`, {
      params: { limit }
    });
    
    if (!response.data || !Array.isArray(response.data.recentOrders)) {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    console.log("✅ Recent orders fetched successfully:", response.data);
    return response.data.recentOrders;
  } catch (error) {
    console.error("❌ Error fetching recent orders:", error);
    throw error;
  }
}

// Top selling products
export const getTopSellingProducts = async (): Promise<any[]> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/analytics/top-products`);
    
    if (!response.data || !Array.isArray(response.data.topSellingProducts)) {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    console.log("✅ Top selling products fetched successfully:", response.data);
    return response.data.topSellingProducts;
  } catch (error) {
    console.error("❌ Error fetching top selling products:", error);
    throw error;
  }
}
