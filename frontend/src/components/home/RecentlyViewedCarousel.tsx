"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { ProductCard } from "@/components/product/ProductCard";
import { motion } from "framer-motion";

export function RecentlyViewedCarousel() {
  const [mounted, setMounted] = useState(false);
  const items = useRecentlyViewedStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden border-t border-eco-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-eco-100">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-eco-900 tracking-tight mb-2">
              Recently Viewed
            </h2>
            <p className="text-eco-600 font-medium tracking-wide">Pick up right where you left off.</p>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
          {items.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="snap-start shrink-0"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
