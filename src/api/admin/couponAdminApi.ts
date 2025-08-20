import { ensureAuthenticated } from './authTokenHelper';
import axios from 'axios';


const API_BASE_URL = 'https://freshgiftbackend.onrender.com/api/coupons';

// Create a new coupon
export const createCoupon = async (couponData: {
  code: string;
    description: string;
    discountType: 'percentage' | 'flat';
  discountValue: number;
  discountMaxLimit?: number;
  expiryDate: string; // format: "2025-12-31"
  minimumOrderValue?: number;
  applicableCategories?: string[]; // eg ["Fruits", "Vegetables"]
  usageLimitPerUser?: number;
  usageLimitGlobal?: number;
}): Promise<any> => {
  try {
    await ensureAuthenticated();
    const response = await axios.post(`${API_BASE_URL}/create`, couponData);
    //console.log("✅ Coupon created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating coupon:", error);
    throw error;
  }
}

// Asign a coupon to all users
export const assignCouponToAllUsers = async (couponCode: string): Promise<any> => {
  try {
    await ensureAuthenticated();
    const response = await axios.post(`${API_BASE_URL}/assign-all`, { couponCode });
    //console.log("✅ Coupon assigned to all users successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error assigning coupon to all users:", error);
    throw error;
  }
}

// Get available coupons
export const getAllCoupons = async (): Promise<any[]> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`https://freshgiftbackend.onrender.com/api/coupons/admin/coupons/all`);
    
    // Check if response has the expected structure
    if (!response.data || !response.data.userCoupons || !Array.isArray(response.data.userCoupons)) {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    // Extract the coupon data directly from userCoupons array
    const coupons = response.data.userCoupons;
    
    //console.log("✅ Coupons fetched successfully:", coupons);
    return coupons;
  } catch (error) {
    console.error("❌ Error fetching coupons:", error);
    throw error;
  }
}

// assign a coupon to a user's userId array
export const assignCouponToUserArray = async (userIds: string[], couponCode: string): Promise<any> => {
  try {
    await ensureAuthenticated();
    const response = await axios.post(`https://freshgiftbackend.onrender.com/api/coupons/assign-multiple`, { userIds, couponCode });
    //console.log("✅ Coupon assigned to users successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error assigning coupon to user:", error);
    throw error;
  }
}
