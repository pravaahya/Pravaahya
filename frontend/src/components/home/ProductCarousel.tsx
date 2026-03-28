"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Product } from "@/types/product";
import { fetchProducts } from "@/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { fetchApi } from "@/lib/api";

export function ProductCarousel({ title }: { title: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { 
      root: scrollContainerRef.current, 
      rootMargin: "300px", 
      threshold: 0 
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        const res = await fetchApi('/products?featured=true&limit=4');
        if (res.ok) {
           const json = await res.json();
           if (json.success) {
              setProducts(json.data);
              setHasMore(false); // Limited to 4 featured components structurally natively
           }
        }
      } catch (err) {
        console.error("Featured array fetch failure natively caught:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <h2 className="text-3xl font-heading font-bold text-eco-900">{title}</h2>
      </div>
      
      {/* Horizontal Scroll Layout container */}
      <div 
        ref={scrollContainerRef}
        className={cn(
          "w-full overflow-x-auto pb-10 snap-x snap-mandatory pt-2",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" // Tailwind arbitrary variants to hide scrollbar inline cleanly
        )}
      >
        <div className="flex gap-6 w-max px-4 md:px-6 lg:ml-auto lg:mr-auto lg:max-w-[1400px]">
          {products.map((product, index) => {
             const isLast = index === products.length - 1;
             return (
               <div key={`${product.id}-${index}`} ref={isLast ? lastElementRef : null}>
                 <ProductCard product={product} />
               </div>
             )
          })}
          
          {loading && (
            <div className="min-w-[200px] flex items-center justify-center h-[400px]">
              <Loader2 className="w-8 h-8 text-eco-500 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
