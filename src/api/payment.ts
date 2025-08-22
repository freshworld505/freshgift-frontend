import axios from 'axios';
import type { Product, CreateProductPayload } from '@/lib/types';
import { ensureAuthenticated, getAuthHeaders, withAuthentication } from './ensureAuthenticated';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

// Create new payment intent
export const createPaymentIntent = async (addressId: string, couponCode?: string) => {
  return withAuthentication(async () => {
    try {
      const body = {
          couponCode,
          addressId
      }

      const response = await axios.post(`${API_BASE_URL}/orders/create-payment-intent`, body);

      if (response && response.data && response.data.clientSecret) {
        //console.log("✅ Payment intent created successfully");
        return response.data;
      } else {
        console.error("❌ Failed to create payment intent:", response);
        throw new Error("Failed to create payment intent");
      }
    } catch (error) {
      console.error("❌ Error creating payment intent:", error);
      throw error;
    }
  });
}
// Confirm payment intent
export const confirmPaymentIntent = async (paymentIntentId: string, addressId: string, deliveryType: string, scheduledTime: string, userInstructions: string) => {
  return withAuthentication(async () => {
    try {
      const body = {
        paymentIntentId,
        addressId,
        deliveryType,
        scheduledTime,
        userInstructions
      };
      const response = await axios.post(`${API_BASE_URL}/orders/confirm`, body);

      if (response && response) {
        //console.log("✅ Payment intent confirmed successfully");
        return response;
      } else {
        console.error("❌ Failed to confirm payment intent:", response);
        throw new Error("Failed to confirm payment intent");
      }
    } catch (error) {
      console.error("❌ Error confirming payment intent:", error);
      throw error;
    }
  });
}