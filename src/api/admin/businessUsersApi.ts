import axios from 'axios';
import { ensureAuthenticated, getTokenForApiCalls } from './authTokenHelper';

const API_BASE_URL = 'https://freshgiftbackend.onrender.com/api/business';
//const API_BASE_URL = 'http://localhost:5004/api/business';

// Type definitions for business requests
interface User {
  userId: string;
  firebaseId: string;
  name: string;
  isBusinessAccount?: boolean;
  email: string;
  phone: string | null;
  profile: string | null;
  profilePicture: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Address {
  addressId: string;
  userId: string;
  label: string;
  addressLine: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BusinessRequest {
  requestId: string;
  userId: string;
  addressId: string;
  businessName: string;
  businessId: string;
  businessPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  user: User;
  address: Address;
}

interface BusinessRequestsResponse {
  requests: BusinessRequest[];
}

interface BusinessStatusResponse {
  message: string;
  requests: BusinessRequest[];
}

interface ApproveBusinessResponse {
  message: string;
  user: User;
}

interface RejectBusinessResponse {
  message: string;
}

// Function to get all business requests
export const getBusinessRequests = async (): Promise<BusinessRequest[]> => {
  await ensureAuthenticated();
  const token = await getTokenForApiCalls();
  const response = await axios.get<BusinessRequestsResponse>(`${API_BASE_URL}/admin/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.requests;
};

// Function to approve a business request
export const approveBusinessRequest = async (requestId: string): Promise<ApproveBusinessResponse> => {
  await ensureAuthenticated();
  const token = await getTokenForApiCalls();
  const response = await axios.put<ApproveBusinessResponse>(`${API_BASE_URL}/admin/requests/approve/${requestId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to reject a business request
export const rejectBusinessRequest = async (requestId: string): Promise<RejectBusinessResponse> => {
  await ensureAuthenticated();
  const token = await getTokenForApiCalls();
  const response = await axios.put<RejectBusinessResponse>(`${API_BASE_URL}/admin/requests/rejects/${requestId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to check business user status - get users with particular status (pending, approved, or rejected)
export const checkBusinessUserStatus = async (status: string): Promise<BusinessStatusResponse> => {
  await ensureAuthenticated();
  const token = await getTokenForApiCalls();
  const response = await axios.get<BusinessStatusResponse>(`${API_BASE_URL}/admin/requests/status?status=${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //console.log("✅ Successfully checked business user status:", response.data);
  return response.data;
};

// Export types for use in components
export type { BusinessRequest, User, Address, BusinessRequestsResponse, BusinessStatusResponse, ApproveBusinessResponse, RejectBusinessResponse };

