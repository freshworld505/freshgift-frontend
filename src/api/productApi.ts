import axios from 'axios';
import type { Product, CreateProductPayload } from '@/lib/types';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`;


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

// Get product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    if (!productId) {
      console.error("❌ No product ID provided");
      throw new Error("No product ID provided");
    }

    const response = await axios.get(`${API_BASE_URL}/${productId}`);
    
    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }
    
    console.log("✅ Product fetched successfully:", response.data);

    // Handle the new backend response format: { message: string, product: Product }
    const apiData = response.data;
    let product: any = null;

    if (apiData.product) {
      // New format with wrapper object
      product = apiData.product;
    } else if (apiData.id) {
      // Fallback: direct product object (old format)
      product = apiData;
    } else {
      console.error("❌ No product data found in response");
      return null;
    }

    // Ensure all required fields are present
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
    };
  } catch (error: any) {
    console.error(`❌ Error fetching product by ID ${productId}:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    // Return null instead of throwing to prevent homepage crash
    return null;
  }
}