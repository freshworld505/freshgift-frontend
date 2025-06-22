import axios from 'axios';
import type { Product, CreateProductPayload } from '@/lib/types';
import { ensureAuthenticated, getAuthHeaders, withAuthentication } from './ensureAuthenticated';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/`;

// API response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  outOfStock: boolean;
  product: Product | null;
}

interface CartResponse {
  cart: CartItem[];
}

// Backend response types (matching the actual backend structure)
interface BackendCartResponse {
  message: string;
  cart?: CartItem[];
}

interface BackendAddToCartResponse {
  message: string;
}

// Add a product to the cart
export const addToCart = async (productId: string, quantity: number): Promise<{ success: boolean; message: string }> => {
  return withAuthentication(async () => {
    try {
      const response = await axios.post<BackendAddToCartResponse>(`${API_BASE_URL}add`, {
        productId,
        quantity
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error("Error adding product to cart:", error);
      const errorMessage = error.response?.data?.message || "Failed to add product to cart";
      throw new Error(errorMessage);
    }
  });
}

// Get the current user's cart
export const getCart = async (): Promise<CartItem[]> => {
  return withAuthentication(async () => {
    try {
      const response = await axios.get<BackendCartResponse>(`${API_BASE_URL}`);
      return response.data.cart || [];
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  });
}

// Update cart item quantity
export const updateCartItem = async (productId: string, quantity: number): Promise<{ success: boolean; message: string }> => {
  return withAuthentication(async () => {
    try {
      const response = await axios.put<BackendAddToCartResponse>(`${API_BASE_URL}update`, {
        productId,
        quantity
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      const errorMessage = error.response?.data?.message || "Failed to update cart item";
      throw new Error(errorMessage);
    }
  });
}

// Remove item from cart
export const removeCartItem = async (productId: string): Promise<{ success: boolean; message: string }> => {
  return withAuthentication(async () => {
    try {
      const response = await axios.delete<BackendAddToCartResponse>(`${API_BASE_URL}remove/${productId}`);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error("Error removing cart item:", error);
      const errorMessage = error.response?.data?.message || "Failed to remove cart item";
      throw new Error(errorMessage);
    }
  });
}