import axios from 'axios';
import type { Product, CreateProductPayload } from '@/lib/types';
import { getTokenForApiCalls, setAuthToken } from './productApi';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

// Token caching
let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

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

// Create new payment intent
export const createPaymentIntent = async (addressId: string, couponCode?: string) => {
  try {
    // Ensure user is authenticated before making API call
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    }

    const body = {
        couponCode,
        addressId
    }

    const response = await axios.post(`${API_BASE_URL}/orders/create-payment-intent`, body);

    if (response && response.data && response.data.clientSecret) {
      console.log("✅ Payment intent created successfully");
      return response.data;
    } else {
      console.error("❌ Failed to create payment intent:", response);
      throw new Error("Failed to create payment intent");
    }
  } catch (error) {
    console.error("❌ Error creating payment intent:", error);
    throw error;
  }
}
// Confirm payment intent
export const confirmPaymentIntent = async (paymentIntentId: string, addressId: string, deliveryType: string, scheduledTime: string, userInstructions: string) => {
  try {
    // Ensure user is authenticated before making API call
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    }

    const body = {
      paymentIntentId,
      addressId,
      deliveryType,
      scheduledTime,
      userInstructions
    };
    const response = await axios.post(`${API_BASE_URL}/orders/confirm`, body);

    if (response && response) {
      console.log("✅ Payment intent confirmed successfully");
      return response;
    } else {
      console.error("❌ Failed to confirm payment intent:", response);
      throw new Error("Failed to confirm payment intent");
    }
  } catch (error) {
    console.error("❌ Error confirming payment intent:", error);
    throw error;
  }
}