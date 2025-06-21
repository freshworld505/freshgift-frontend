import axios from 'axios';
import { getAuth } from 'firebase/auth';
import type { Product, CreateProductPayload } from '@/lib/types';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`;

// Token caching
let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

// API response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

// New backend response structure
interface BackendResponse {
  message: string;
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Set auth token for API authorization
export const setAuthToken = (token: string | null) => {
  if (token) {
    // Apply token to every request if available
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    cachedToken = token;
    // Set token expiration to 50 minutes from now (assuming 1 hour token validity)
    tokenExpiration = Date.now() + (50 * 60 * 1000);
    console.log("✅ Auth token set for API requests");
  } else {
    // Delete auth header if token is not available
    delete axios.defaults.headers.common['Authorization'];
    cachedToken = null;
    tokenExpiration = null;
    console.log("⚠️ Auth token removed from API requests");
  }
}

// Check if current token is still valid
const isTokenValid = (): boolean => {
  return cachedToken !== null && tokenExpiration !== null && Date.now() < tokenExpiration;
}

// Remove Firebase token function - using JWT tokens only

// Generate jwt token for API authorization
export const generateJwtToken = async (userId: string): Promise<string> => {
  try {
    const response = await axios.post(`https://freshgiftbackend.onrender.com/api/auth/generatetoken`, { firebaseId: userId });
    if (response.data && response.data.jwt) {
      setAuthToken(response.data.jwt);
      console.log("✅ JWT token generated and set for API authorization");
      return response.data.jwt;
    } else {
      console.error("❌ Failed to generate JWT token:", response.data);
      throw new Error("Failed to generate JWT token");
    }
  } catch (error) {
    console.error("❌ Error generating JWT token:", error);
    throw error;
  }
}

// get token for me to use in API calls
export const getTokenForApiCalls = async (): Promise<string | null> => {
  try {
    // Check if we have a valid cached token first
    if (isTokenValid()) {
      console.log("✅ Using cached JWT token");
      return cachedToken;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await generateJwtToken(user.uid);
      if (!token) {
        console.error("❌ Failed to generate token for API calls");
        throw new Error("Failed to generate token for API calls");
      }
      // Set the JWT token for API calls
      setAuthToken(token);
      console.log("✅ New JWT Token retrieved and set for API calls");
      return token;
    } else {
      console.log("⚠️ No user is signed in, cannot retrieve token");
      setAuthToken(null);
      return null;
    }
  } catch (error) {
    console.error("❌ Error retrieving token for API calls:", error);
    setAuthToken(null);
    throw error;
  }
}

// Helper function to ensure authentication before API calls
const ensureAuthenticated = async () => {
  try {
    // Check if we have a valid cached token first
    if (isTokenValid()) {
      console.log("✅ Using cached token for authentication");
      return true;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      // Only generate new token if cached one is invalid/expired
      const token = await generateJwtToken(user.uid);
      setAuthToken(token);
      console.log("✅ New JWT token generated for authentication");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to get JWT token:", error);
    return false;
  }
};

// Search product or get all products
export const searchProducts = async (searchTerm: string, page: number, limit: number): Promise<ProductsResponse> => {
  try {
    // Ensure user is authenticated before making the request
    //await ensureAuthenticated();
    
    const response = await axios.get(`${API_BASE_URL}/search?searchTerm=${searchTerm}&page=${page}&limit=${limit}`);
    console.log("✅ Products fetched successfully:", response.data);
    
    // Handle new backend response format
    const apiData = response.data as BackendResponse;
    let products: any[] = [];
    
    if (apiData.products) {
      products = apiData.products;
    } else if (Array.isArray(apiData)) {
      // Fallback for old format
      products = apiData;
    }
    
    // Convert products to new schema format directly
    const convertedProducts = products.map(product => {
      // Ensure all required fields are present from new schema
      return {
        ...product,
        productName: product.productName || '',
        finalPrice: product.finalPrice || 0,
        productImages: product.productImages || [],
        actualPrice: product.actualPrice || product.finalPrice || 0,
        productCode: product.productCode || product.id || '',
        category: product.category || 'other',
        createdAt: product.createdAt || new Date(),
        updatedAt: product.updatedAt || new Date()
      } as Product;
    });
    
    return {
      products: convertedProducts,
      total: apiData.pagination?.total || convertedProducts.length,
      page: apiData.pagination?.page || page,
      limit: apiData.pagination?.limit || limit
    };
  } catch (error: any) {
    console.error('❌ Error fetching products:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Return empty response instead of throwing to prevent homepage crash
    return {
      products: [],
      total: 0,
      page: page,
      limit: limit
    };
  }
}


// Get product by category
export const getProductsByCategory = async (category: string, page: number, limit: number): Promise<Product[]> => {
  try {
    //await ensureAuthenticated();

    // Build query string manually for proper URL format
    const url = `${API_BASE_URL}/filter?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`;

    console.log(`🔍 Fetching products by category: ${category}, URL: ${url}`);
    const response = await axios.get(url);

    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }
    console.log("✅ Products by category fetched successfully:", response.data);

    // Handle new backend response format
    const apiData = response.data as BackendResponse;
    let products: any[] = [];

    if (apiData.products) {
      products = apiData.products;
    } else if (Array.isArray(apiData)) {
      // Fallback for old format
      products = apiData;
    }

    const convertedProducts = products.map(product => ({
      ...product,
      productName: product.productName || '',
      finalPrice: product.finalPrice || 0,
      productImages: product.productImages || [],
      actualPrice: product.actualPrice || product.finalPrice || 0,
      productCode: product.productCode || product.id || '',
      category: product.category || 'other',
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    }) as Product);

    console.log(`✅ Converted ${convertedProducts.length} products for category: ${category}`);
    return convertedProducts;
  } catch (error: any) {
    console.error(`❌ Error fetching products by category ${category}:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Return empty array instead of throwing to prevent homepage crash
    return [];
  }
}

// Get product by category and subcategory
export const getProductsByCategoryAndSubcategory = async (category: string, subCategory: string, page: number, limit: number): Promise<Product[]> => {
  try {
    //await ensureAuthenticated();

    // Build query string manually for proper URL format
    const url = `${API_BASE_URL}/filter?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}&page=${page}&limit=${limit}`;

    console.log(`🔍 Fetching products by category and subcategory: ${category}/${subCategory}, URL: ${url}`);
    const response = await axios.get(url);

    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }
    console.log("✅ Products by category and subcategory fetched successfully:", response.data);

    // Handle new backend response format
    const apiData = response.data as BackendResponse;
    let products: any[] = [];

    if (apiData.products) {
      products = apiData.products;
    } else if (Array.isArray(apiData)) {
      // Fallback for old format
      products = apiData;
    }

    const convertedProducts = products.map(product => ({
      ...product,
      productName: product.productName || '',
      finalPrice: product.finalPrice || 0,
      productImages: product.productImages || [],
      actualPrice: product.actualPrice || product.finalPrice || 0,
      productCode: product.productCode || product.id || '',
      category: product.category || 'other',
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    }) as Product);

    console.log(`✅ Converted ${convertedProducts.length} products for category/subcategory: ${category}/${subCategory}`);
    return convertedProducts;
  } catch (error: any) {
    console.error(`❌ Error fetching products by category/subcategory ${category}/${subCategory}:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Return empty array instead of throwing to prevent homepage crash
    return [];
  }
}

// Get product by tag
export const getProductsByTag = async (tags: string, page: number, limit: number): Promise<Product[]> => {
  try {
    // Ensure user is authenticated before making the request
    //await ensureAuthenticated();

    if (!tags) {
      console.error("❌ No tags provided for filtering");
      throw new Error("No tags provided for filtering");
    }

    // Build query string manually for proper URL format
    const url = `${API_BASE_URL}/filter?tags=${encodeURIComponent(tags)}&page=${page}&limit=${limit}`;

    console.log(`🔍 Fetching products with tags: ${tags}, URL: ${url}`);
    const response = await axios.get(url);

    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }
    console.log("✅ Products by tag fetched successfully:", response.data);

    const apiData = response.data;
    let products: any[] = [];

    // Handle the new backend response structure
    if (apiData.products) {
      products = apiData.products;
    } else if (Array.isArray(apiData)) {
      products = apiData;
    }

    const convertedProducts = products.map(product => ({
      ...product,
      productName: product.productName || '',
      finalPrice: product.finalPrice || 0,
      productImages: product.productImages || [],
      actualPrice: product.actualPrice || product.finalPrice || 0,
      productCode: product.productCode || product.id || '',
      category: product.category || 'other',
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    }) as Product);

    console.log(`✅ Converted ${convertedProducts.length} products for tags: ${tags}`);
    return convertedProducts;
  } catch (error: any) {
    console.error(`❌ Error fetching products by tag ${tags}:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Return empty array instead of throwing to prevent homepage crash
    return [];
  }
}
