import axios from 'axios';
import { Product } from '@/lib/types';
import { ensureAuthenticated, getTokenForApiCalls } from './authTokenHelper';

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
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

interface EditProductData {
  productId: string;
  productName?: string;
  productCode?: string;
  description?: string;
  actualPrice?: number;
  discount?: number;
  finalPrice?: number;
  stock?: number; // Must be number, not string
  category?: string;
  subCategory?: string;
  tags?: string[]; // Array of strings
  rating?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  expiryDate?: string; // Send as string in YYYY-MM-DD format
  harvestDate?: string; // Send as string in YYYY-MM-DD format
  shelfLife?: number;
  returnable?: boolean;
  storageInstructions?: string;
  maxPurchaseLimit?: number;
  businessDiscount?: number; // Business discount as number, not string
  deliveryType?: string;
  productImages?: string[];
}

const API_BASE_URL = 'https://freshgiftbackend.onrender.com/api/products';
//const API_BASE_URL = 'http://localhost:5004/api/products';

// Create a new product
export async function createProduct(productData: any) {
  try {
    // Ensure the user is authenticated before making the API call
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User is not authenticated. Please log in.");
    }

    // Get the auth token explicitly for the request
    const token = await getTokenForApiCalls();
    if (!token) {
      throw new Error("Unable to retrieve authentication token.");
    }

    // Validate productData before sending
    if (!productData || typeof productData !== 'object') {
      throw new Error("Invalid product data provided.");
    }

    const requiredFields = ['productName', 'actualPrice', 'finalPrice'];
    requiredFields.forEach(field => {
      if (!productData[field]) throw new Error(`${field} is required.`);
    });

    const formData = new FormData();

    // Map and append form fields
    const fields = [
      'productCode', 'productName', 'description', 'actualPrice', 'discount',
      'finalPrice', 'category', 'subCategory', 'rating', 'isFeatured',
      'isTrending', 'isNew', 'expiryDate', 'harvestDate', 'shelfLife',
      'returnable', 'storageInstructions', 'maxPurchaseLimit', 'deliveryType', 'stock', 'businessDiscount'
    ];

    fields.forEach(field => {
      if (productData[field] !== undefined && productData[field] !== null) {
        formData.append(field, productData[field].toString());
      }
    });

    // Handle tags specially - convert array to comma-separated string for form data
    if (productData.tags) {
      if (Array.isArray(productData.tags)) {
        formData.append('tags', productData.tags.join(','));
      } else {
        formData.append('tags', productData.tags.toString());
      }
    }

    // Handle productImages (file upload)
    if (productData.productImages) {
      if (Array.isArray(productData.productImages)) {
        productData.productImages.forEach((file: File) => {
          formData.append('productImages', file);
        });
      } else {
        formData.append('productImages', productData.productImages);
      }
    }

    // Debug: Log the FormData contents
    //console.log('📦 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        //console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        //console.log(`${key}: ${value}`);
      }
    }

    //console.log('🔐 Making API request with token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

    const response = await axios.post(`${API_BASE_URL}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    //console.log('Product created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Search product or get all products
export const searchProducts = async (searchTerm: string, page: number, limit: number): Promise<ProductsResponse> => {
  try {
    // Ensure user is authenticated before making the request
    await ensureAuthenticated();
    
    const response = await axios.get(`${API_BASE_URL}/search?searchTerm=${searchTerm}&page=${page}&limit=${limit}`);
    //console.log("✅ Products fetched successfully:", response.data);
    
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
        tags: product.tags ? (typeof product.tags === 'string' ? product.tags.split(',').filter(Boolean) : Array.isArray(product.tags) ? product.tags : []) : [],
        createdAt: product.createdAt || new Date(),
        updatedAt: product.updatedAt || new Date()
      } as Product;
    });
    
    return {
      products: convertedProducts,
      total: apiData.pagination?.totalItems || convertedProducts.length,
      page: apiData.pagination?.currentPage || page,
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
    await ensureAuthenticated();

    // Build query string manually for proper URL format
    const url = `${API_BASE_URL}/filter?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`;

    //console.log(`🔍 Fetching products by category: ${category}, URL: ${url}`);
    const response = await axios.get(url);

    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }
    //console.log("✅ Products by category fetched successfully:", response.data);

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
      tags: product.tags ? (typeof product.tags === 'string' ? product.tags.split(',').filter(Boolean) : Array.isArray(product.tags) ? product.tags : []) : [],
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    }) as Product);

    //console.log(`✅ Converted ${convertedProducts.length} products for category: ${category}`);
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
    await ensureAuthenticated();

    // Build query string manually for proper URL format
    const url = `${API_BASE_URL}/filter?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}&page=${page}&limit=${limit}`;

    //console.log(`🔍 Fetching products by category and subcategory: ${category}/${subCategory}, URL: ${url}`);
    const response = await axios.get(url);

    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }
    //console.log("✅ Products by category and subcategory fetched successfully:", response.data);

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
      tags: product.tags ? (typeof product.tags === 'string' ? product.tags.split(',').filter(Boolean) : Array.isArray(product.tags) ? product.tags : []) : [],
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    }) as Product);

    //console.log(`✅ Converted ${convertedProducts.length} products for category/subcategory: ${category}/${subCategory}`);
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
    await ensureAuthenticated();

    if (!tags) {
      console.error("❌ No tags provided for filtering");
      throw new Error("No tags provided for filtering");
    }

    // Build query string manually for proper URL format
    const url = `${API_BASE_URL}/filter?tags=${encodeURIComponent(tags)}&page=${page}&limit=${limit}`;

    //console.log(`🔍 Fetching products with tags: ${tags}, URL: ${url}`);
    const response = await axios.get(url);

    if (!response.data) {
      console.error("❌ No data received from API");
      throw new Error("No data received from API");
    }
    //console.log("✅ Products by tag fetched successfully:", response.data);

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
      tags: product.tags ? (typeof product.tags === 'string' ? product.tags.split(',').filter(Boolean) : Array.isArray(product.tags) ? product.tags : []) : [],
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    }) as Product);

    //console.log(`✅ Converted ${convertedProducts.length} products for tags: ${tags}`);
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

// Edit product API
export const editProduct = async (EditProductData: EditProductData): Promise<Product> => {
  try {
    // Ensure user is authenticated before making the request
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User is not authenticated. Please log in.");
    }

    // Get the auth token for the request
    const token = await getTokenForApiCalls();
    if (!token) {
      throw new Error("Unable to retrieve authentication token.");
    }

    if (!EditProductData.productId) {
      throw new Error("Product ID is required");
    }

    // Validate EditProductData
    if (!EditProductData || typeof EditProductData !== 'object') {
      throw new Error("Invalid product data provided.");
    }

    // Ensure businessDiscount is a number if provided
    const requestData = {
      ...EditProductData,
      businessDiscount: EditProductData.businessDiscount ? Number(EditProductData.businessDiscount) : undefined
    };

    // Remove undefined values to avoid sending them to the backend
    Object.keys(requestData).forEach(key => {
      if (requestData[key as keyof EditProductData] === undefined) {
        delete requestData[key as keyof EditProductData];
      }
    });

    // Add more detailed logging to debug the request
    console.log("📤 Sending edit product request:", {
      url: `${API_BASE_URL}/edit`,
      data: requestData,
      productId: requestData.productId,
      dataKeys: Object.keys(requestData),
      dataStructure: JSON.stringify(requestData, null, 2)
    });

    const response = await axios.put(`${API_BASE_URL}/edit`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error("No data received from API");
    }

    console.log("✅ Product updated successfully:", response.data);
    return response.data.product || response.data;
  } catch (error: any) {
    // Enhanced error logging to see the full backend response
    console.error("❌ Error updating product:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data, // This will show the actual backend error
      requestData: EditProductData
    });
    
    // Also log the full error response if available
    if (error.response?.data) {
      console.error("🔍 Backend error details:", error.response.data);
    }
    
    throw error;
  }
}

// Upload product images API
export const uploadProductImages = async (imageFiles: File[]): Promise<string[]> => {
  try {
    // Ensure user is authenticated before making the request
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User is not authenticated. Please log in.");
    }

    // Get the auth token for the request
    const token = await getTokenForApiCalls();
    if (!token) {
      throw new Error("Unable to retrieve authentication token.");
    }

    if (!imageFiles || imageFiles.length === 0) {
      throw new Error("No image files provided");
    }

    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('productImages', file);
    });

    const response = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.data || !response.data.urls) {
      throw new Error("No image URLs received from API");
    }

    console.log("✅ Images uploaded successfully:", response.data);
    return response.data.urls;
  } catch (error: any) {
    console.error("❌ Error uploading images:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Delete product API
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    // Ensure user is authenticated before making the request
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User is not authenticated. Please log in.");
    }

    if (!productId) {
      throw new Error("Product ID is required");
    }

    const response = await axios.delete(`${API_BASE_URL}/delete/${productId}`);

    console.log("✅ Product deleted successfully:", response.data);
  } catch (error: any) {
    console.error("❌ Error deleting product:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Get product by ID API
export const getProductById = async (productId: string): Promise<Product> => {
  try {
    // Ensure user is authenticated before making the request
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User is not authenticated. Please log in.");
    }

    if (!productId) {
      throw new Error("Product ID is required");
    }

    const response = await axios.get(`${API_BASE_URL}/${productId}`);

    if (!response.data) {
      throw new Error("No data received from API");
    }

    console.log("✅ Product fetched successfully:", response.data);
    
    // Handle the response format and convert to Product type
    const product = response.data.product || response.data;
    
    // Ensure all required fields are present
    const convertedProduct = {
      ...product,
      productName: product.productName || '',
      finalPrice: product.finalPrice || 0,
      productImages: product.productImages || [],
      actualPrice: product.actualPrice || product.finalPrice || 0,
      productCode: product.productCode || product.id || '',
      category: product.category || 'other',
      tags: product.tags ? (typeof product.tags === 'string' ? product.tags.split(',').filter(Boolean) : Array.isArray(product.tags) ? product.tags : []) : [],
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    } as Product;

    return convertedProduct;
  } catch (error: any) {
    console.error("❌ Error fetching product by ID:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}
