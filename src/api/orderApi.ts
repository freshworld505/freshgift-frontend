import axios from 'axios';
import type { Product, CreateProductPayload, Order, OrdersResponse, OrderStatus, PaymentStatus, CreateOrderRequest } from '@/lib/types';
import { getTokenForApiCalls, setAuthToken } from './productApi';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`;




// Helper function to ensure authentication before API calls

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

// Get all orders
export const getAllMyOrders = async (): Promise<Order[]> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const token = await getTokenForApiCalls();
    const response = await axios.get<{ orders: Order[] }>(`${API_BASE_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.orders;
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    throw error;
  }
}

// Get a single order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const token = await getTokenForApiCalls();
    const response = await axios.get<{ order: Order }>(`${API_BASE_URL}/user/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.order;
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    throw error;
  }
};


// Create a new order
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const token = await getTokenForApiCalls();
    const response = await axios.post<{ message: string; orderId: string; total: number }>(`${API_BASE_URL}/place`, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Since the backend doesn't return the full order object, we need to fetch it
    const createdOrder = await getOrderById(response.data.orderId);
    return createdOrder;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const token = await getTokenForApiCalls();
    await axios.patch<{ message: string }>(`${API_BASE_URL}/cancel/${orderId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
     
    // Fetch the updated order since the backend doesn't return it
    const updatedOrder = await getOrderById(orderId);
    return updatedOrder;
  } catch (error) {
    console.error(`Failed to cancel order ${orderId}:`, error);
    throw error;
  }
};

// Update order status (admin function)
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const token = await getTokenForApiCalls();
    const response = await axios.patch<Order>(`${API_BASE_URL}/${orderId}/status`, 
      { orderStatus: status }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update order status for ${orderId}:`, error);
    throw error;
  }
};

// Get order by tracking number
export const getOrderByTrackingNumber = async (trackingNumber: string): Promise<Order> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const token = await getTokenForApiCalls();
    const response = await axios.get<{ order: Order }>(`${API_BASE_URL}/track/${trackingNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.order;
  } catch (error) {
    console.error(`Failed to fetch order with tracking number ${trackingNumber}:`, error);
    throw error;
  }
};

// Update delivery address for a pending order
export const updateOrderDeliveryAddress = async (orderId: string, deliveryAddress: string): Promise<Order> => {
  if (!(await ensureAuthenticated())) {
    throw new Error('User is not authenticated');
  }

  try {
    const token = await getTokenForApiCalls();
    const response = await axios.patch<{ message: string; order: Order }>(`${API_BASE_URL}/user/${orderId}/address`, 
      { deliveryAddress }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.order;
  } catch (error) {
    console.error(`Failed to update delivery address for order ${orderId}:`, error);
    throw error;
  }
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
