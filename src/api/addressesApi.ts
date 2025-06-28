import axios from 'axios';
import type { Address } from '@/lib/types';
import { ensureAuthenticated, getAuthHeaders, withAuthentication } from './ensureAuthenticated';
import { getAuth } from 'firebase/auth';

// Backend address response type
type BackendAddress = {
  addressId: string;
  userId: string;
  label: string;
  addressLine: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

// Backend response type for addresses
type GetAddressesResponse = {
  addresses: BackendAddress[];
};

// Backend response type for update address
type UpdateAddressResponse = {
  message: string;
  address: BackendAddress;
};

// Backend response type for create address
type CreateAddressResponse = {
  message: string;
  address: BackendAddress;
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

// API function to get all user addresses
export const getUserAddresses = async (): Promise<Address[]> => {
  return withAuthentication(async () => {
    try {
      const response = await axios.get<GetAddressesResponse>(`${API_BASE_URL}/address/my`);
      console.log("✅ Successfully fetched user addresses");
      
      // Map backend response to frontend Address type
      const addresses: Address[] = response.data.addresses.map((backendAddress: BackendAddress) => ({
        id: backendAddress.addressId,
        street: backendAddress.addressLine,
        city: backendAddress.city,
        state: backendAddress.state,
        zipCode: backendAddress.pincode,
        country: backendAddress.country,
        landmark: backendAddress.landmark,
        isDefault: backendAddress.isDefault,
      }));
      
      return addresses;
    } catch (error) {
      console.error("Failed to fetch user addresses:", error);
      throw error;
    }
  });
};

// API function to create a new address
export const createAddress = async (addressData: Omit<Address, 'id'>): Promise<Address> => {
  return withAuthentication(async () => {
    try {
      // Map frontend Address type to backend format
      const backendAddressData = {
        label: "Home", // Default label, could be made configurable
        addressLine: addressData.street,
        landmark: addressData.landmark || "",
        pincode: addressData.zipCode,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        isDefault: addressData.isDefault || false,
      };

      const response = await axios.post<CreateAddressResponse>(`${API_BASE_URL}/address/add`, backendAddressData);
      console.log("✅ Successfully created new address");
      console.log("🔍 Raw backend response:", response.data);
      console.log("🔍 Backend response message:", response.data.message);
      console.log("🔍 Backend address object:", response.data.address);
      console.log("🆔 Backend addressId:", response.data.address?.addressId);
      
      // Map backend response to frontend Address type
      const backendAddress = response.data.address;
      
      if (!backendAddress) {
        throw new Error("No address object in backend response");
      }
      
      const newAddress: Address = {
        id: backendAddress.addressId,
        street: backendAddress.addressLine,
        city: backendAddress.city,
        state: backendAddress.state,
        zipCode: backendAddress.pincode,
        country: backendAddress.country,
        landmark: backendAddress.landmark,
        isDefault: backendAddress.isDefault,
      };
      
      console.log("🏠 Mapped frontend address:", newAddress);
      console.log("🆔 Frontend address ID:", newAddress.id);
      
      return newAddress;
    } catch (error) {
      console.error("Failed to create address:", error);
      throw error;
    }
  });
};

// API function to delete an address
export const deleteAddress = async (addressId: string): Promise<void> => {
  return withAuthentication(async () => {
    try {
      await axios.delete(`${API_BASE_URL}/address/${addressId}`);
      console.log("✅ Successfully deleted address");
    } catch (error) {
      console.error("Failed to delete address:", error);
      throw error;
    }
  });
};

// API function to update an existing address
export const updateAddress = async (addressId: string, addressLine: string)=> {
  return withAuthentication(async () => {
    try {
      // Map frontend Address type to backend format
      const body = {
          addressLine,
      }

      const response = await axios.put<UpdateAddressResponse>(`${API_BASE_URL}/address/${addressId}`, body);
      console.log("✅ Successfully updated address");
      
      // Map backend response to frontend Address type
      const updatedAddress: Address = {
        id: response.data.address.addressId,
        street: response.data.address.addressLine,
        city: response.data.address.city,
        state: response.data.address.state,
        zipCode: response.data.address.pincode,
        country: response.data.address.country,
        landmark: response.data.address.landmark,
        isDefault: response.data.address.isDefault,
      };
      
      return updatedAddress;
    } catch (error) {
      console.error("Failed to update address:", error);
      throw error;
    }
  });
};


