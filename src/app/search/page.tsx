"use client";

import { useSearchParams } from "next/navigation";
import ProductList from "@/components/products/ProductList";
import { searchProducts } from "@/api/productApi";
import type { Product } from "@/lib/types";
import { useEffect, useState, Suspense } from "react";
import { SearchX, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  suggestProductsFromSearch,
  type SuggestProductsFromSearchInput,
  type SuggestProductsFromSearchOutput,
} from "@/ai/flows/suggest-products-from-search-flow";
import { useCartStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { items: cartItems } = useCartStore();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      setAiSuggestions([]); // Reset AI suggestions on new query

      if (query && query.trim()) {
        try {
          // Call the backend search API
          const searchResponse = await searchProducts(query.trim(), 1, 50); // page 1, limit 50
          setFilteredProducts(searchResponse.products);
        } catch (error) {
          console.error("Error searching products:", error);
          setFilteredProducts([]);
        }
      } else {
        setFilteredProducts([]);
      }
      setIsLoading(false);
    };

    fetchSearchResults();
  }, [query]);

  const handleAiSearch = async () => {
    if (!query) return;
    setIsAiLoading(true);
    setAiSuggestions([]);
    try {
      const currentCartProductNames = cartItems
        .map((item) => item.product.productName || "")
        .filter((name) => name !== "");
      const input: SuggestProductsFromSearchInput = {
        searchQuery: query,
        currentCartItems:
          currentCartProductNames.length > 0
            ? currentCartProductNames
            : undefined,
      };
      const result: SuggestProductsFromSearchOutput =
        await suggestProductsFromSearch(input);
      setAiSuggestions(result.suggestedIdeas);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      setAiSuggestions(["Sorry, couldn't fetch AI suggestions at this time."]);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Searching for products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {query ? (
        <>
          <h1 className="text-3xl font-semibold mb-8 text-center">
            Search Results for &quot;{query}&quot;
          </h1>
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="text-center py-12">
              <SearchX className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t find any products matching &quot;{query}&quot;.
                Try a different search term or browse our categories.
              </p>
            </div>
          )}

          {/* AI Suggestions Section */}
          {(filteredProducts.length < 3 || aiSuggestions.length > 0) && (
            <Card className="mt-12 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="text-accent" />
                  Need More Ideas for &quot;{query}&quot;?
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isAiLoading && aiSuggestions.length === 0 && (
                  <Button
                    onClick={handleAiSearch}
                    disabled={isAiLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isAiLoading ? "Thinking..." : "Get AI Product Ideas"}
                  </Button>
                )}
                {isAiLoading && (
                  <p className="text-muted-foreground">Our AI is thinking...</p>
                )}
                {!isAiLoading && aiSuggestions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">
                      Here are some AI-powered suggestions:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {aiSuggestions.map((idea, index) => (
                        <li key={index}>{idea}</li>
                      ))}
                    </ul>
                    <Button
                      onClick={handleAiSearch}
                      disabled={isAiLoading}
                      variant="outline"
                      className="mt-4"
                    >
                      {isAiLoading ? "Thinking..." : "Get More AI Ideas"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <h1 className="text-2xl font-semibold">
            Please enter a search term in the header.
          </h1>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="text-center py-10">Loading search...</div>}
    >
      <SearchContent />
    </Suspense>
  );
}
