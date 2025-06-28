import { useQuery } from "@tanstack/react-query";
import {
  searchProducts,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  getProductsByTag,
} from "@/api/productApi";
import type { Product } from "@/lib/types";

// Query keys for consistent caching
export const productQueryKeys = {
  all: ['products'] as const,
  search: (query: string, page: number, limit: number) => 
    [...productQueryKeys.all, 'search', query, page, limit] as const,
  category: (category: string, page: number, limit: number) => 
    [...productQueryKeys.all, 'category', category, page, limit] as const,
  subcategory: (category: string, subcategory: string, page: number, limit: number) => 
    [...productQueryKeys.all, 'subcategory', category, subcategory, page, limit] as const,
  tag: (tag: string, page: number, limit: number) => 
    [...productQueryKeys.all, 'tag', tag, page, limit] as const,
};

// Helper function to extract products array from API response
const extractProducts = (result: any): Product[] => {
  return Array.isArray(result) ? result : result?.products || [];
};

// Custom hooks for different product queries
export const useAllProducts = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: productQueryKeys.search("", page, limit),
    queryFn: async () => {
      const result = await searchProducts("", page, limit);
      return extractProducts(result);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for all products
  });
};

export const useProductsByCategory = (category: string, page = 1, limit = 8) => {
  return useQuery({
    queryKey: productQueryKeys.category(category, page, limit),
    queryFn: async () => {
      const result = await getProductsByCategory(category, page, limit);
      return extractProducts(result);
    },
    enabled: !!category,
  });
};

export const useProductsByCategoryAndSubcategory = (
  category: string, 
  subcategory: string, 
  page = 1, 
  limit = 4
) => {
  return useQuery({
    queryKey: productQueryKeys.subcategory(category, subcategory, page, limit),
    queryFn: async () => {
      const result = await getProductsByCategoryAndSubcategory(category, subcategory, page, limit);
      return extractProducts(result);
    },
    enabled: !!category && !!subcategory,
  });
};

export const useProductsByTag = (tag: string, page = 1, limit = 4) => {
  return useQuery({
    queryKey: productQueryKeys.tag(tag, page, limit),
    queryFn: async () => {
      const result = await getProductsByTag(tag, page, limit);
      return extractProducts(result);
    },
    enabled: !!tag,
  });
};

// Search products hook with debouncing support
export const useSearchProducts = (searchTerm: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productQueryKeys.search(searchTerm, 1, 100),
    queryFn: async () => {
      const result = await searchProducts(searchTerm, 1, 100);
      return result; // Return the full response with products and pagination
    },
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Combined hook for homepage data - executes all queries in parallel
export const useHomepageProducts = () => {
  const allProducts = useAllProducts(1, 100);
  const featuredProducts = useProductsByTag("Top Pick", 1, 4);
  const organicProducts = useProductsByTag("Organic", 1, 4);
  const freshProducts = useProductsByTag("Fresh", 1, 4);
  const newArrivals = useProductsByTag("New Arrival", 1, 4);
  const onSaleProducts = useProductsByTag("On Sale", 1, 4);
  const instantDelivery = useProductsByTag("Instant Delivery", 1, 4);
  const importedProducts = useProductsByTag("Imported", 1, 4);
  
  const freshFruits = useProductsByCategory("Fruits", 1, 8);
  const herbs = useProductsByCategory("Herbs", 1, 4);
  
  const leafyGreens = useProductsByCategoryAndSubcategory("Fruits", "Leafy Greens", 1, 4);
  const freshJuices = useProductsByCategoryAndSubcategory("Fruits", "Fresh Juices", 1, 4);
  const seasonalPicks = useProductsByCategoryAndSubcategory("Fruits", "Seasonal Picks", 1, 4);

  // Aggregate loading state
  const isLoading = [
    allProducts.isLoading,
    featuredProducts.isLoading,
    organicProducts.isLoading,
    freshProducts.isLoading,
    newArrivals.isLoading,
    onSaleProducts.isLoading,
    instantDelivery.isLoading,
    importedProducts.isLoading,
    freshFruits.isLoading,
    herbs.isLoading,
    leafyGreens.isLoading,
    freshJuices.isLoading,
    seasonalPicks.isLoading,
  ].some(Boolean);

  // Aggregate error state
  const error = [
    allProducts.error,
    featuredProducts.error,
    organicProducts.error,
    freshProducts.error,
    newArrivals.error,
    onSaleProducts.error,
    instantDelivery.error,
    importedProducts.error,
    freshFruits.error,
    herbs.error,
    leafyGreens.error,
    freshJuices.error,
    seasonalPicks.error,
  ].find(Boolean);

  return {
    // Data
    allProducts: allProducts.data || [],
    featuredProducts: featuredProducts.data || [],
    seasonalSpotlightProducts: organicProducts.data || [],
    leafyGreensProducts: leafyGreens.data || [],
    organicProducts: herbs.data || [],
    freshFruits: freshFruits.data || [],
    newArrivals: freshProducts.data || [],
    onSaleProducts: onSaleProducts.data || [],
    beveragesProducts: newArrivals.data || [],
    bakeryProducts: importedProducts.data || [],
    dairyProducts: freshJuices.data || [],
    rootVegetables: seasonalPicks.data || [],
    instantDelivery: instantDelivery.data || [],
    
    // States
    isLoading,
    error: error?.message || undefined,
    
    // Individual query states for more granular control if needed
    queries: {
      allProducts,
      featuredProducts,
      organicProducts,
      freshProducts,
      newArrivals,
      onSaleProducts,
      instantDelivery,
      importedProducts,
      freshFruits,
      herbs,
      leafyGreens,
      freshJuices,
      seasonalPicks,
    }
  };
};
