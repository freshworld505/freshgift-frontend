import type { Product } from "@/lib/types";
import ProductListCard from "./ProductListCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  showCount?: boolean;
  viewMode?: "grid" | "list";
}

function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  );
}

export default function ProductList({
  products,
  loading = false,
  error,
  emptyMessage = "No products available at the moment.",
  showCount = false,
  viewMode = "grid",
}: ProductListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">
            Error Loading Products
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-gray-800 font-semibold mb-2">
            No Products Found
          </h3>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showCount && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div
        className={`grid ${
          viewMode === "list"
            ? "grid-cols-1 gap-4"
            : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
        }`}
      >
        {products.map((product) => (
          <div
            key={product.id || product.productCode}
            className={viewMode === "list" ? "max-w-none" : ""}
          >
            <ProductListCard product={product} viewMode={viewMode} />
          </div>
        ))}
      </div>
    </div>
  );
}
