"use client";

import ProductList from "@/components/products/ProductList";
import HeroSection from "@/components/layout/HeroSection";
import WhyChooseUsSection from "@/components/layout/WhyChooseUsSection";
import { useHomepageProducts } from "@/hooks/use-products";
import { useCartStore } from "@/lib/store";
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
  ShoppingBasket,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useEffect } from "react";

export default function HomePage() {
  const {
    allProducts,
    featuredProducts,
    seasonalSpotlightProducts,
    leafyGreensProducts,
    organicProducts,
    freshFruits,
    newArrivals,
    onSaleProducts,
    beveragesProducts,
    bakeryProducts,
    dairyProducts,
    rootVegetables,
    instantDelivery,
    isLoading,
    error,
  } = useHomepageProducts();

  const { fetchCart } = useCartStore();

  useEffect(() => {
    // Fetch cart status in background when homepage loads
    fetchCart();
  }, [fetchCart]);

  if (isLoading) {
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
            products={featuredProducts.slice(0, 4)}
            loading={isLoading}
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
            products={seasonalSpotlightProducts.slice(0, 4)}
            loading={isLoading}
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
            products={leafyGreensProducts.slice(0, 4)}
            loading={isLoading}
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
            products={organicProducts.slice(0, 4)}
            loading={isLoading}
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
            products={freshFruits.slice(0, 4)}
            loading={isLoading}
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
            products={newArrivals.slice(0, 4)}
            loading={isLoading}
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
            products={onSaleProducts.slice(0, 4)}
            loading={isLoading}
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
            products={beveragesProducts.slice(0, 4)}
            loading={isLoading}
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
            products={bakeryProducts.slice(0, 4)}
            loading={isLoading}
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
            products={dairyProducts.slice(0, 4)}
            loading={isLoading}
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
            products={rootVegetables.slice(0, 4)}
            loading={isLoading}
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
            products={instantDelivery.slice(0, 4)}
            loading={isLoading}
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
            loading={isLoading}
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
