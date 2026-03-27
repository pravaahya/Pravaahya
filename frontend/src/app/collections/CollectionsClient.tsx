"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export function CollectionsClient() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Protected query parameters via unbouncing
  const debouncedSearch = useDebounce(search, 500);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  useEffect(() => {
    const fetchGrid = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "12");
        if (category) params.append("category", category);
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (debouncedMinPrice) params.append("minPrice", debouncedMinPrice);
        if (debouncedMaxPrice) params.append("maxPrice", debouncedMaxPrice);
        if (collectionId) params.append("collectionId", collectionId);
        params.append("sortBy", sortBy);
        params.append("sortDir", sortDir);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("API Route missing or failed");
        const json = await res.json();
        
        setProducts(json.data);
        setTotalPages(json.metadata.totalPages);
      } catch (error) {
        console.error("Fetch Data Error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGrid();
  }, [page, category, debouncedSearch, debouncedMinPrice, debouncedMaxPrice, sortBy, sortDir, collectionId]);

  // Instantly Reset page iteration correctly when filter states alter
  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch, debouncedMinPrice, debouncedMaxPrice, sortBy, sortDir]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        
        {/* Sidebar Constraints Block */}
        <motion.div 
          className="w-full md:w-64 shrink-0 space-y-8 bg-zinc-50 border border-zinc-100 p-6 rounded-2xl md:sticky md:top-24"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3 className="text-lg font-heading font-semibold text-eco-900 mb-6 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filter Board
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-eco-800">Search Tags/Names</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-eco-400" />
                  <Input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="e.g. organic"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-eco-800">Category Select</label>
                <select 
                  className="w-full h-10 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-eco-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Home">Home</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Apparel">Apparel</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-eco-800">Price Range</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-eco-400">-</span>
                  <Input 
                    type="number"
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Products List */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-eco-100 gap-4">
            <h2 className="text-2xl font-heading font-bold text-eco-900 tracking-tight">Browse Collections</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-eco-800 whitespace-nowrap">Sort by:</label>
              <select 
                className="h-9 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:border-eco-500"
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [b, d] = e.target.value.split("-");
                  setSortBy(b);
                  setSortDir(d);
                }}
              >
                <option value="id-asc">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A-Z</option>
              </select>
            </div>
          </div>

          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10"
                >
                  <Loader2 className="w-8 h-8 text-eco-500 animate-spin" />
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <p className="text-lg text-eco-600 font-medium max-w-sm">
                    No products could be mapped to your active selection filters.
                  </p>
                  <Button variant="outline" className="mt-6 rounded-full" onClick={() => {
                    setSearch(""); setCategory(""); setMinPrice(""); setMaxPrice("");
                  }}>Clear All Filters</Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {products.map((product) => (
                    <div key={product.id} className="flex justify-center w-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Core React Pagination Engine */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-10 h-10 shadow-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex flex-col items-center text-sm font-medium text-eco-800">
                <span>Page {page} of {totalPages}</span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-10 h-10 shadow-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
