"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const { items, clearWishlist } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-7xl min-h-[70vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 pb-4 border-b border-eco-100 gap-4">
         <div>
           <h1 className="text-3xl md:text-4xl font-heading font-bold text-eco-900 tracking-tight mb-2">
             Saved Items
           </h1>
           <p className="text-eco-600 font-medium">{items.length} product{items.length !== 1 ? 's' : ''} saved</p>
         </div>
         
         {items.length > 0 && (
            <Button onClick={clearWishlist} variant="outline" className="rounded-full shadow-sm text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors">
              Clear Wishlist
            </Button>
         )}
      </div>
      
      {items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-eco-50 rounded-[3rem] border border-eco-100"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-eco-300">
            <Heart className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-eco-900 mb-3">Your wishlist is empty.</h2>
          <p className="text-eco-600 mb-8 max-w-md text-lg">You haven't saved any items yet. Keep track of things you love by clicking the heart icon on any product.</p>
          <Link href="/collections">
            <Button size="lg" className="rounded-full font-semibold px-8 h-14 bg-eco-600 hover:bg-eco-700 text-lg shadow-md">
              Explore Collections <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
          {items.map((product) => (
             <div key={product.id} className="relative group/parent">
               <ProductCard product={product} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
