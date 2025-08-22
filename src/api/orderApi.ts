import axios from 'axios';
import type { Product, CreateProductPayload, Order, OrdersResponse, OrderStatus, PaymentStatus, CreateOrderRequest } from '@/lib/types';
import { ensureAuthenticated, getAuthHeaders, withAuthentication, getTokenForApiCalls } from './ensureAuthenticated';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`;
const API_BASE_URL_FOR_RECURRING = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;
const API_BASE_URL_FOR_SHIPPING = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

// Get all orders
export const getAllMyOrders = async (): Promise<Order[]> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get<{ orders: Order[] }>(`${API_BASE_URL}/user`, { headers });
      return response.data.orders;
    } catch (error) {
      console.error("Failed to fetch all orders:", error);
      throw error;
    }
  });
}

// Get a single order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get<{ order: Order }>(`${API_BASE_URL}/user/${orderId}`, { headers });
      return response.data.order;
    } catch (error) {
      console.error(`Failed to fetch order ${orderId}:`, error);
      throw error;
    }
  });
};


// Create a new order
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      //console.log("🚀 OrderAPI: Creating order with data:", orderData);
      const headers = await getAuthHeaders();
      //console.log("🔑 OrderAPI: Using headers:", headers);
      
      const response = await axios.post<{ message: string; orderId: string; total: number }>(`${API_BASE_URL}/place`, orderData, { headers });
      //console.log("✅ OrderAPI: Order creation response:", response.data);
      
      // Since the backend doesn't return the full order object, we need to fetch it
      //console.log("📋 OrderAPI: Fetching created order details...");
      const createdOrder = await getOrderById(response.data.orderId);
      //console.log("✅ OrderAPI: Full order details:", createdOrder);
      
      return createdOrder;
    } catch (error) {
      console.error("❌ OrderAPI: Failed to create order:", error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error("❌ OrderAPI: Error response data:", axiosError.response?.data);
        console.error("❌ OrderAPI: Error status:", axiosError.response?.status);
        console.error("❌ OrderAPI: Error status text:", axiosError.response?.statusText);
      }
      
      throw error;
    }
  });
};

// get shipping cost
interface TotalCostAfterShippingCostResponse {
  shippingCost: number;
  cartTotal: number;
  finalTotal: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
}

export const getTotalAfterShippingCost = async (cartTotal: number) => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post<TotalCostAfterShippingCostResponse>(`${API_BASE_URL}/shipping/calculate`, { headers });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch shipping cost for cart total ${cartTotal}:`, error);
      throw error;
    }
  });
};

interface ShippingCostResponse {
  message: string;
  shippingCharge: number;
  freeShippingThreshold: number;
}

export const getShippingDetails = async () : Promise<ShippingCostResponse> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get<ShippingCostResponse>(`${API_BASE_URL_FOR_SHIPPING}/shipping/settings`, { headers });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch shipping details:", error);
      throw error;
    }
  });
};

// Cancel an order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      await axios.patch<{ message: string }>(`${API_BASE_URL}/cancel/${orderId}`, {}, { headers });
       
      // Fetch the updated order since the backend doesn't return it
      const updatedOrder = await getOrderById(orderId);
      return updatedOrder;
    } catch (error) {
      console.error(`Failed to cancel order ${orderId}:`, error);
      throw error;
    }
  });
};

// Update order status (admin function)
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.patch<Order>(`${API_BASE_URL}/${orderId}/status`, 
        { orderStatus: status }, 
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update order status for ${orderId}:`, error);
      throw error;
    }
  });
};

// Get order by tracking number
export const getOrderByTrackingNumber = async (trackingNumber: string): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get<{ order: Order }>(`${API_BASE_URL}/track/${trackingNumber}`, { headers });
      return response.data.order;
    } catch (error) {
      console.error(`Failed to fetch order with tracking number ${trackingNumber}:`, error);
      throw error;
    }
  });
};

// Update delivery address for a pending order
export const updateOrderDeliveryAddress = async (orderId: string, deliveryAddress: string): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.patch<{ message: string; order: Order }>(`${API_BASE_URL}/user/${orderId}/address`, 
        { deliveryAddress }, 
        { headers }
      );
      return response.data.order;
    } catch (error) {
      console.error(`Failed to update delivery address for order ${orderId}:`, error);
      throw error;
    }
  });
};

// Utility function to check if order can be cancelled
export const canCancelOrder = (order: Order): boolean => {
  return order.orderStatus === 'Pending' || order.orderStatus === 'Processing';
};

// Utility function to check if order can be modified
export const canModifyOrder = (order: Order): boolean => {
  return order.orderStatus === 'Pending';
};

// Utility function to get order status color for UI
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Pending':
      return 'orange';
    case 'Processing':
      return 'blue';
    case 'Delivered':
      return 'green';
    case 'Cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

// Utility function to get payment status color for UI
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'Paid':
      return 'green';
    case 'Pending':
      return 'orange';
    case 'Failed':
      return 'red';
    default:
      return 'gray';
  }
};

// Recurring order api functions. -->

// save card details for recurring orders --> stripe will save the card details and return a customer ID (payment method ID) that will we be give to this function
export const saveCardDetailsForRecurringOrders = async (paymentMethodId: string): Promise<string> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post<{ stripeCustomerId: string, paymentMethodId: string }>(`${API_BASE_URL_FOR_RECURRING}/recurring/save-card`, 
        { paymentMethodId }, 
        { headers }
      );
      return response.data.stripeCustomerId;
    } catch (error) {
      console.error("Failed to save card details for recurring orders:", error);
      throw error;
    }
  });
};

// Create a recurring order
interface CreateRecurringOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  frequency: string;
  dayOfWeek?: number; // 0 = Sunday, 6 = Saturday
  addressId: string;
  paymentMethodId: string;
  executionTime?: string; //HH:MM" format (24-hour) - Required for Daily
}
export const createRecurringOrder = async (orderData: CreateRecurringOrderRequest): Promise<string> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post<{ message: string }>(`${API_BASE_URL_FOR_RECURRING}/recurring/create`, orderData, { headers });
      return response.data.message;
    } catch (error) {
      console.error("Failed to create recurring order:", error);
      throw error;
    }
  });
};

// Pause a recurring order
export const pauseRecurringOrder = async (recurringOrderId: string): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post<{ order: Order }>(`${API_BASE_URL_FOR_RECURRING}/recurring/${recurringOrderId}/pause`, { headers });
      return response.data.order;
    } catch (error) {
      console.error(`Failed to pause recurring order ${recurringOrderId}:`, error);
      throw error;
    }
  });
}

// Resume a paused recurring order
export const resumeRecurringOrder = async (recurringOrderId: string): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post<{ order: Order }>(`${API_BASE_URL_FOR_RECURRING}/recurring/${recurringOrderId}/resume`, { headers });
      return response.data.order;
    } catch (error) {
      console.error(`Failed to resume recurring order ${recurringOrderId}:`, error);
      throw error;
    }
  });
}

// Cancel a recurring order
export const cancelRecurringOrder = async (recurringOrderId: string): Promise<Order> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete<{ order: Order }>(`${API_BASE_URL_FOR_RECURRING}/recurring/${recurringOrderId}`, { headers });
      return response.data.order;
    } catch (error) {
      console.error(`Failed to cancel recurring order ${recurringOrderId}:`, error);
      throw error;
    }
  });
}

// Get all recurring orders for the user
export const getAllRecurringOrders = async (): Promise<Order[]> => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get<{ recurringOrders: Order[] }>(`${API_BASE_URL_FOR_RECURRING}/recurring/my`, { headers });
      return response.data.recurringOrders;
    } catch (error) {
      console.error("Failed to fetch all recurring orders:", error);
      throw error;
    }
  });
}
