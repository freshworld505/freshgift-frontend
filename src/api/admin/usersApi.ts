import { ensureAuthenticated } from './authTokenHelper';
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

// User interface based on the API response format
export interface AdminUser {
  userId: string;
  firebaseId: string;
  name: string;
  email: string;
  phone: string | null;
  profile: any | null;
  profilePicture: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// API response interface
interface UsersResponse {
  users: AdminUser[];
}

// Customer count response interface
interface CustomerCountResponse {
  totalCustomers: number;
  monthlyCustomers: number;
}

// New users between dates response interface
export interface NewUsersResponse {
  totalUsers: number;
  users: AdminUser[];
  startDate: string;
  endDate: string;
}

// Get all users
export const getAllUsers = async (): Promise<AdminUser[]> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/users/admin/all`);
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }

    //console.log("✅ Users fetched successfully:", response.data);
    
    // Handle the response format
    const apiData = response.data as UsersResponse;
    
    if (apiData.users && Array.isArray(apiData.users)) {
      return apiData.users;
    } else if (Array.isArray(response.data)) {
      // Fallback if API returns users array directly
      return response.data;
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      throw new Error("Unexpected API response format");
    }
  } catch (error: any) {
    console.error("❌ Error fetching all users:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Get all customers count
export const getAllCustomersCount = async (): Promise<CustomerCountResponse> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/users/admin/customers/stats`);
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }

    //console.log("✅ Customer count fetched successfully:", response.data);
    
    // Handle the response format
    const apiData = response.data as CustomerCountResponse;
    
    if (typeof apiData.totalCustomers === 'number' && typeof apiData.monthlyCustomers === 'number') {
      return apiData;
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      throw new Error("Unexpected API response format");
    }
  } catch (error: any) {
    console.error("❌ Error fetching customer count:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Get new users between two dates
export const getNewUsersBetweenDates = async (startDate: string, endDate: string): Promise<NewUsersResponse> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/users/admin/customers/filter`, {
      params: { startDate, endDate }
    });
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }

    //console.log("✅ New users fetched successfully:", response.data);
    
    // Handle the response format
    const apiData = response.data as NewUsersResponse;
    
    if (apiData.users && Array.isArray(apiData.users) && typeof apiData.totalUsers === 'number') {
      return apiData;
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      throw new Error("Unexpected API response format");
    }
  } catch (error: any) {
    console.error("❌ Error fetching new users between dates:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Promote user to admin (NOT USED ANYWHERE)
export const promoteUserToAdmin = async (userId: string): Promise<AdminUser> => {
  try {
    await ensureAuthenticated();
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/promote`);
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }

    //console.log("✅ User promoted to admin successfully:", response.data);
    
    // Handle the response format
    const apiData = response.data as AdminUser;
    
    return apiData;
  } catch (error: any) {
    console.error("❌ Error promoting user to admin:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Block/Unblock user
export const toggleUserStatus = async (userId: string, action: 'block' | 'unblock'): Promise<AdminUser> => {
  try {
    await ensureAuthenticated();
    const response = await axios.patch(`${API_BASE_URL}/users/admin/${userId}/${action}`);
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }

    //console.log(`✅ User ${action}ed successfully:`, response.data);
    return response.data.user || response.data;
  } catch (error: any) {
    console.error(`❌ Error ${action}ing user:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Get user details by ID
export const getUserById = async (userId: string): Promise<AdminUser> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/users/admin/${userId}`);
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }

    //console.log("✅ User details fetched successfully:", response.data);
    return response.data.user || response.data;
  } catch (error: any) {
    console.error("❌ Error fetching user details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

interface TopUsers {
  userId: string;
  name: string;
  email: string;
  phone: string | "";
  totalOrders: number;
}

interface TopUsersResponse {
  message: string;
  topUsers: TopUsers[];
}

// get top 15 users for coupons page
export const getTopUsersForCoupons = async (): Promise<TopUsers[]> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/users/admin/top-users`);

    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }

    //console.log("✅ Top users for coupons fetched successfully:", response.data);
    
    // Handle the response format
    const apiData = response.data as TopUsersResponse;
    
    if (apiData.topUsers && Array.isArray(apiData.topUsers)) {
      return apiData.topUsers;
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      throw new Error("Unexpected API response format");
    }
  } catch (error: any) {
    console.error("❌ Error fetching top users for coupons:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

interface StatusBasedUser {
  userId: string;
  firebaseId: string;
  name: string;
  email: string;
  phone: string | null;
  profile: any | null;
  profilePicture: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface ActiveInactiveUsersResponse {
  activeUsersCount: number;
  inactiveUsersCount: number;
  activeUsers: StatusBasedUser[];
  inactiveUsers: StatusBasedUser[];
}

// active and inactive users
export const getActiveAndInactiveUsers = async (): Promise<ActiveInactiveUsersResponse> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/users/admin/customers/active-inactive`);
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }

    //console.log("✅ Active and inactive users fetched successfully:", response.data);
    
    // Handle the response format
    const apiData = response.data as ActiveInactiveUsersResponse;
    
    if (typeof apiData.activeUsersCount === 'number' && 
        typeof apiData.inactiveUsersCount === 'number' &&
        Array.isArray(apiData.activeUsers) &&
        Array.isArray(apiData.inactiveUsers)) {
      return apiData;
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      throw new Error("Unexpected API response format");
    }
  } catch (error: any) {
    console.error("❌ Error fetching active and inactive users:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}