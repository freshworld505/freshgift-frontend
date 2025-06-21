"use client";

import { useEffect, useState } from "react";
import ProductList from "@/components/products/ProductList";
import HeroSection from "@/components/layout/HeroSection";
import WhyChooseUsSection from "@/components/layout/WhyChooseUsSection";
import type { Product } from "@/lib/types";
import {
  Sun,
  Sprout,
  Star,
  LayoutGrid,
  Leaf,
  Apple,
  Coffee,
  Cake,
  Milk,
  Cookie,
  Snowflake,
  ShoppingBasket,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  searchProducts,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  getProductsByTag,
} from "@/api/productApi";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [seasonalSpotlightProducts, setSeasonalSpotlightProducts] = useState<
    Product[]
  >([]);
  const [leafyGreensProducts, setLeafyGreensProducts] = useState<Product[]>([]);
  const [organicProducts, setOrganicProducts] = useState<Product[]>([]);
  const [freshFruits, setFreshFruits] = useState<Product[]>([]);
  const [beveragesProducts, setBeveragesProducts] = useState<Product[]>([]);
  const [bakeryProducts, setBakeryProducts] = useState<Product[]>([]);
  const [dairyProducts, setDairyProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  const [instantDelivery, setInstantDelivery] = useState<Product[]>([]);
  const [rootVegetables, setRootVegetables] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Helper function to safely fetch with detailed error handling
        const safeFetch = async (
          fetchFunction: () => Promise<any>,
          name: string
        ): Promise<any[]> => {
          try {
            console.log(`🔄 Starting to fetch ${name}...`);
            const result = await fetchFunction();
            const count = Array.isArray(result)
              ? result.length
              : result?.products?.length || 0;
            console.log(`✅ ${name} fetched successfully: ${count} items`);
            return Array.isArray(result) ? result : result?.products || [];
          } catch (error: any) {
            console.warn(`⚠️ ${name} failed:`, {
              message: error?.message,
              status: error?.response?.status,
              statusText: error?.response?.statusText,
              url: error?.config?.url,
              data: error?.response?.data,
            });
            return [];
          }
        };

        // Fetch all products for the full range section
        const allProductsResult = await safeFetch(
          () => searchProducts("", 1, 100),
          "All products"
        );

        // safeFetch already extracts the products array, so we can use it directly
        if (allProductsResult && allProductsResult.length > 0) {
          setAllProducts(allProductsResult);
          console.log(
            "✅ All products loaded successfully:",
            allProductsResult.length
          );
        } else {
          console.log("⚠️ No products found");
        }

        // Fetch fresh fruits by category (confirmed exists: "Fruits")
        const fruitsProducts = await safeFetch(
          () => getProductsByCategory("Fruits", 1, 8),
          "Fresh fruits category"
        );
        setFreshFruits(fruitsProducts);

        // Fetch featured products with Top Pick tag
        const featuredProducts = await safeFetch(
          () => getProductsByTag("Top Pick", 1, 4),
          "Top Pick tagged products"
        );
        setFeaturedProducts(featuredProducts);

        // Fetch herbs by category (confirmed exists: "Herbs")
        const herbsProducts = await safeFetch(
          () => getProductsByCategory("Herbs", 1, 4),
          "Herbs category"
        );
        setOrganicProducts(herbsProducts);

        // Fetch organic products by tag
        const organicTagged = await safeFetch(
          () => getProductsByTag("Organic", 1, 4),
          "Organic tagged products"
        );
        setSeasonalSpotlightProducts(organicTagged);

        // Fetch fresh products by tag
        const freshTagged = await safeFetch(
          () => getProductsByTag("Fresh", 1, 4),
          "Fresh tagged products"
        );
        setNewArrivals(freshTagged);

        // Fetch new arrival products by tag
        const newArrivalProducts = await safeFetch(
          () => getProductsByTag("New Arrival", 1, 4),
          "New Arrival tagged products"
        );
        setBeveragesProducts(newArrivalProducts);

        // Fetch on sale products by tag
        const onSaleProducts = await safeFetch(
          () => getProductsByTag("On Sale", 1, 4),
          "On Sale tagged products"
        );
        setOnSaleProducts(onSaleProducts);

        // Fetch instant delivery products by tag
        const instantProducts = await safeFetch(
          () => getProductsByTag("Instant Delivery", 1, 4),
          "Instant Delivery tagged products"
        );
        setInstantDelivery(instantProducts);

        // Fetch imported products by tag
        const importedProducts = await safeFetch(
          () => getProductsByTag("Imported", 1, 4),
          "Imported tagged products"
        );
        setBakeryProducts(importedProducts);

        // Fetch products by subcategory (Fruits + Leafy Greens)
        const leafyGreens = await safeFetch(
          () =>
            getProductsByCategoryAndSubcategory("Fruits", "Leafy Greens", 1, 4),
          "Fruits Leafy Greens subcategory"
        );
        setLeafyGreensProducts(leafyGreens);

        // Fetch products by subcategory (Fruits + Fresh Juices)
        const freshJuices = await safeFetch(
          () =>
            getProductsByCategoryAndSubcategory("Fruits", "Fresh Juices", 1, 4),
          "Fruits Fresh Juices subcategory"
        );
        setDairyProducts(freshJuices);

        // Fetch products by subcategory (Fruits + Seasonal Picks)
        const seasonalPicks = await safeFetch(
          () =>
            getProductsByCategoryAndSubcategory(
              "Fruits",
              "Seasonal Picks",
              1,
              4
            ),
          "Fruits Seasonal Picks subcategory"
        );
        setRootVegetables(seasonalPicks);

        console.log("🎉 All product fetching completed successfully!");
      } catch (error) {
        console.error("❌ Critical error in fetchProducts:", error);
        setError("Failed to load products. Please try again later.");
        // Set empty arrays on error
        setFeaturedProducts([]);
        setSeasonalSpotlightProducts([]);
        setLeafyGreensProducts([]);
        setOrganicProducts([]);
        setFreshFruits([]);
        setBeveragesProducts([]);
        setBakeryProducts([]);
        setDairyProducts([]);
        setNewArrivals([]);
        setOnSaleProducts([]);
        setInstantDelivery([]);
        setRootVegetables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12">
        <HeroSection />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <HeroSection />

      {featuredProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Star className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl font-semibold">Today's Top Picks</h2>
          </div>
          <ProductList
            products={featuredProducts}
            loading={loading}
            error={error}
            emptyMessage="No featured products available right now."
            viewMode="grid"
          />
        </section>
      )}

      {seasonalSpotlightProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Sun className="h-8 w-8 text-accent mr-3" />
            <h2 className="text-3xl font-semibold">Seasonal Spotlight</h2>
          </div>
          <ProductList
            products={seasonalSpotlightProducts}
            loading={loading}
            error={error}
            emptyMessage="No seasonal products available right now."
            viewMode="grid"
          />
        </section>
      )}

      {leafyGreensProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Sprout className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-semibold">Leafy Greens</h2>
          </div>
          <ProductList
            products={leafyGreensProducts}
            loading={loading}
            error={error}
            emptyMessage="No leafy greens available right now."
            viewMode="grid"
          />
        </section>
      )}

      {organicProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Leaf className="h-8 w-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-semibold">Organic Choices</h2>
          </div>
          <ProductList
            products={organicProducts}
            loading={loading}
            error={error}
            emptyMessage="No organic products available right now."
            viewMode="grid"
          />
        </section>
      )}

      {freshFruits.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Apple className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-3xl font-semibold">Fresh Fruits</h2>
          </div>
          <ProductList
            products={freshFruits}
            loading={loading}
            error={error}
            emptyMessage="No fresh fruits available right now."
            viewMode="grid"
          />
        </section>
      )}

      {newArrivals.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-semibold">Fresh Selection</h2>
          </div>
          <ProductList
            products={newArrivals}
            loading={loading}
            error={error}
            emptyMessage="No fresh products available right now."
            viewMode="grid"
          />
        </section>
      )}

      {onSaleProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Star className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-3xl font-semibold">On Sale</h2>
          </div>
          <ProductList
            products={onSaleProducts}
            loading={loading}
            error={error}
            emptyMessage="No sale items available right now."
            viewMode="grid"
          />
        </section>
      )}

      {beveragesProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Coffee className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl font-semibold">New Arrivals</h2>
          </div>
          <ProductList
            products={beveragesProducts}
            loading={loading}
            error={error}
            emptyMessage="No new arrivals available right now."
            viewMode="grid"
          />
        </section>
      )}

      {bakeryProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Cake className="h-8 w-8 text-yellow-600 mr-3" />
            <h2 className="text-3xl font-semibold">Imported Selection</h2>
          </div>
          <ProductList
            products={bakeryProducts}
            loading={loading}
            error={error}
            emptyMessage="No imported products available right now."
            viewMode="grid"
          />
        </section>
      )}

      {dairyProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Milk className="h-8 w-8 text-blue-400 mr-3" />
            <h2 className="text-3xl font-semibold">Fresh Juices</h2>
          </div>
          <ProductList
            products={dairyProducts}
            loading={loading}
            error={error}
            emptyMessage="No fresh juices available right now."
            viewMode="grid"
          />
        </section>
      )}

      {rootVegetables.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <ShoppingBasket className="h-8 w-8 text-amber-700 mr-3" />
            <h2 className="text-3xl font-semibold">Seasonal Picks</h2>
          </div>
          <ProductList
            products={rootVegetables}
            loading={loading}
            error={error}
            emptyMessage="No seasonal picks available right now."
            viewMode="grid"
          />
        </section>
      )}

      {instantDelivery.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <Zap className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-semibold">Instant Delivery</h2>
          </div>
          <ProductList
            products={instantDelivery}
            loading={loading}
            error={error}
            emptyMessage="No instant delivery items available right now."
            viewMode="grid"
          />
        </section>
      )}

      <WhyChooseUsSection />

      {allProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-center sm:justify-start mb-6">
            <LayoutGrid className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-semibold">Explore Our Full Range</h2>
          </div>
          <ProductList
            products={allProducts}
            loading={loading}
            error={error}
            emptyMessage="No products available right now."
            showCount={true}
            viewMode="grid"
          />
        </section>
      )}
    </div>
  );
}
