import axios from 'axios';
import { getAuth } from 'firebase/auth';
import type { Product, CreateProductPayload, CouponsResponse, Coupon, UserCoupon } from '@/lib/types';
import { setAuthToken, generateJwtToken, getTokenForApiCalls } from './productApi';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coupons`;

// Helper function to ensure authentication before API calls
const ensureAuthenticated = async (): Promise<boolean> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await getTokenForApiCalls();
      if (token) {
        setAuthToken(token);
        console.log("✅ JWT token set for coupon API calls");
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Failed to authenticate for coupon API:", error);
    return false;
  }
};

// Get all coupons (user's available coupons)
export const getAllCoupons = async (): Promise<UserCoupon[]> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    console.log('🔍 Fetching coupons from:', `${API_BASE_URL}/all`);
    const response = await axios.get<{ coupons: UserCoupon[] }>(`${API_BASE_URL}/available`);
    console.log('✅ Coupons fetched successfully:', response.data.coupons);
    return response.data.coupons;
  } catch (error: any) {
    console.error("❌ Failed to fetch all coupons:", error.response?.data || error.message);
    throw error;
  }
};

// Apply coupon in user's cart
export const applyCoupon = async (couponCode: string, cartTotal: number): Promise<{ 
  success: boolean; 
  message: string; 
  discountAmount?: number; 
}> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await axios.post<{
      success?: boolean;
      message: string;
      discountAmount?: number;
    }>(`${API_BASE_URL}/apply`, { couponCode, cartTotal });
    
    // Transform the response to match expected format
    return {
      success: response.status === 200,
      message: response.data.message,
      discountAmount: response.data.discountAmount
    };
  } catch (error: any) {
    console.error(`Failed to apply coupon ${couponCode}:`, error);
    
    // Handle axios error response
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
    
    return {
      success: false,
      message: 'Failed to apply coupon. Please try again.'
    };
  }
};

// Redeem a coupon
export const redeemCoupon = async (couponCode: string): Promise<{ 
  success: boolean; 
  message: string; 
  userCoupon?: UserCoupon; 
}> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await axios.post<{
      message: string;
      userCoupon?: UserCoupon;
    }>(`${API_BASE_URL}/redeem`, { couponCode });
    
    return {
      success: response.status === 200,
      message: response.data.message,
      userCoupon: response.data.userCoupon
    };
  } catch (error: any) {
    console.error(`Failed to redeem coupon ${couponCode}:`, error);
    
    // Handle axios error response
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
    
    return {
      success: false,
      message: 'Failed to redeem coupon. Please try again.'
    };
  }
};

// Helper function to extract coupon details from UserCoupon
export const extractCouponDetails = (userCoupons: UserCoupon[]): Coupon[] => {
  return userCoupons.map(userCoupon => userCoupon.coupon);
};