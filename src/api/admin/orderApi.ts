import { ensureAuthenticated } from './authTokenHelper';
import axios from 'axios';

const API_BASE_URL = 'https://freshgiftbackend.onrender.com/api/orders';

// Valid refund status values
type RefundStatus = 'Pending' | 'Approved' | 'Refunded';

// Valid order status values (updated to match backend)
type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

// Recurring Order interfaces
export interface RecurringOrderUser {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface RecurringOrderProduct {
  id: string;
  productName: string;
  productImages: string[];
  finalPrice: number;
}

export interface RecurringOrderItem {
  id: string;
  recurringOrderId: string;
  productId: string;
  quantity: number;
  product: RecurringOrderProduct;
}

export interface RecurringOrderAddress {
  addressId: string;
  label: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface RecurringOrder {
  id: string;
  userId: string;
  addressId: string;
  frequency: string;
  dayOfWeek: number;
  nextRunAt: string;
  paymentMethodId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: RecurringOrderUser;
  items: RecurringOrderItem[];
  address: RecurringOrderAddress;
}

interface RecurringOrdersResponse {
  recurringOrders: RecurringOrder[];
}

// Get orders by refund status
export const getOrdersByRefundStatus = async (status: RefundStatus): Promise<any[]> => {
  try {
    // Validate refund status
    const validStatuses: RefundStatus[] = ['Pending', 'Approved', 'Refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid refund status. Valid values are: ${validStatuses.join(', ')}`);
    }

    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/orders/refunds`, {
      params: { refundStatus: status }
    });
    
    if (!response.data || !response.data.orders || !Array.isArray(response.data.orders)) {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    //console.log(`✅ Orders with refund status "${status}" fetched successfully:`, response.data.orders);
    return response.data.orders;
  } catch (error) {
    console.error("❌ Error fetching orders by refund status:", error);
    throw error;
  }
}

// Approve a refund for an order
export const approveRefund = async (orderId: string): Promise<void> => {
  try {
    // Validate orderId
    if (!orderId || orderId.trim() === '') {
      throw new Error('Order ID is required');
    }

    await ensureAuthenticated();
    const response = await axios.post(`${API_BASE_URL}/admin/approve-refund/${orderId}`);
    
    if (response.status === 200) {
      //console.log(`✅ Refund for order ${orderId} approved successfully:`, response.data);
      console.log(`✅ Refund for order ${orderId} approved successfully`);
    } else {
      console.error("❌ Failed to approve refund:", response.data);
      throw new Error(response.data?.message || "Failed to approve refund");
    }
  } catch (error: any) {
    // Handle specific error cases based on backend responses
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          console.error("❌ Order not found or refund not pending");
          throw new Error(data?.message || "Order not found or refund not pending");
        case 400:
          console.error("❌ Refund cannot be approved yet:", data?.message);
          throw new Error(data?.message || "Refund cannot be approved before 3 business days");
        case 500:
          console.error("❌ Server error while approving refund:", data?.message);
          throw new Error(data?.message || "Internal server error");
        default:
          console.error("❌ Unexpected error:", data?.message);
          throw new Error(data?.message || "Failed to approve refund");
      }
    } else {
      console.error("❌ Network or request error:", error.message);
      throw error;
    }
  }
}

// Update order status and related details
export const updateOrderStatus = async (
  orderId: string, 
  updateData: {
    orderStatus: OrderStatus;
    deliveryPartner?: string;
    trackingNumber?: string;
  }
): Promise<void> => {
  try {
    // Validate orderId and status
    if (!orderId || orderId.trim() === '') {
      throw new Error('Order ID is required');
    }
    if (!updateData.orderStatus || updateData.orderStatus.trim() === '') {
      throw new Error('Order status is required');
    }

    // Validate order status (updated to match backend)
    const validStatuses: OrderStatus[] = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(updateData.orderStatus)) {
      throw new Error(`Invalid order status. Valid values are: ${validStatuses.join(', ')}`);
    }

    await ensureAuthenticated();
    const response = await axios.patch(`${API_BASE_URL}/admin/update-status/${orderId}`, updateData);
    
    if (response.status === 200) {
      //console.log(`✅ Order ${orderId} updated successfully:`, response.data);
      console.log(`✅ Order ${orderId} updated successfully`);
    } else {
      console.error("❌ Failed to update order:", response.data);
      throw new Error(response.data?.message || "Failed to update order");
    }
  } catch (error: any) {
    // Handle specific error cases based on backend responses
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          console.error("❌ Order not found");
          throw new Error(data?.message || "Order not found");
        case 400:
          console.error("❌ Invalid request data:", data?.message);
          throw new Error(data?.message || "Invalid request data");
        case 500:
          console.error("❌ Server error while updating order:", data?.message);
          throw new Error(data?.message || "Internal server error");
        default:
          console.error("❌ Unexpected error:", data?.message);
          throw new Error(data?.message || "Failed to update order");
      }
    } else {
      console.error("❌ Network or request error:", error.message);
      throw error;
    }
  }
}

// Convenience function for simple status updates
export const updateOrderStatusOnly = async (orderId: string, status: OrderStatus): Promise<void> => {
  return updateOrderStatus(orderId, { orderStatus: status });
}

// Get all orders (for admin dashboard)
export const getAllOrdersForAdmin = async (): Promise<any[]> => {
  try {
    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/admin/all`);
    
    if (!response.data || !Array.isArray(response.data.orders)) {
      console.error("❌ Invalid data received from API");
      throw new Error("Invalid data received from API");
    }
    
    //console.log("✅ All orders for admin fetched successfully:", response.data);
    return response.data.orders;
  } catch (error) {
    console.error("❌ Error fetching all orders for admin:", error);
    throw error;
  }
}

// Get order by ID
export const getOrderById = async (orderId: string): Promise<any> => {
  try {
    if (!orderId || orderId.trim() === '') {
      throw new Error('Order ID is required');
    }

    await ensureAuthenticated();
    const response = await axios.get(`${API_BASE_URL}/${orderId}`);
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }
    
    //console.log(`✅ Order ${orderId} fetched successfully:`, response.data);
    return response.data.order || response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.error("❌ Order not found");
      throw new Error("Order not found");
    }
    console.error("❌ Error fetching order by ID:", error);
    throw error;
  }
}

// Admin apis for recurring orders
const API_BASE_URL_FOR_RECURRING = 'https://freshgiftbackend.onrender.com/api/recurring';
//const API_BASE_URL_FOR_RECURRING = 'http://localhost:5004/api/recurring';

// Get all recurring orders
export const getAllRecurringOrders = async (): Promise<RecurringOrder[]> => {
  await ensureAuthenticated();
  const response = await axios.get<RecurringOrdersResponse>(`${API_BASE_URL_FOR_RECURRING}/all`);
  if (!response.data || !Array.isArray(response.data.recurringOrders)) {
    console.error("❌ Invalid data received from API");
    throw new Error("Invalid data received from API");
  }
  //console.log("✅ All recurring orders fetched successfully:", response.data.recurringOrders);
  return response.data.recurringOrders;  
}
