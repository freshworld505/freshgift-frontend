import { ensureAuthenticated } from './authTokenHelper';
import axios from 'axios';


const API_BASE_URL = 'https://freshgiftbackend.onrender.com/api/coupons';

// Create a new coupon
export const createCoupon = async (couponData: {
  code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
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
    console.log("✅ Coupon created successfully:", response.data);
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
    console.log("✅ Coupon assigned to all users successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error assigning coupon to all users:", error);
    throw error;
  }
}

// Asign a coupon to a specific user or users
// TODO: will add here after implemneting this in backend

// Get available coupons
export const getAllCoupons = async (): Promise<any[]> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/available`);
    
    // Check if response has the expected structure
    if (!response.data || !response.data.coupons || !Array.isArray(response.data.coupons)) {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    // Extract the actual coupon data from the nested structure
    const coupons = response.data.coupons.map((item: any) => item.coupon);
    
    console.log("✅ Coupons fetched successfully:", coupons);
    return coupons;
  } catch (error) {
    console.error("❌ Error fetching coupons:", error);
    throw error;
  }
}
