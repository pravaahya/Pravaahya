"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "sonner";
import { resolveImage } from "@/lib/image-utils";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const [mounted, setMounted] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsWishlisted(isInWishlist(product.id!));
  }, [isInWishlist, product.id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
    const stateWillBeIn = !isWishlisted;
    setIsWishlisted(stateWillBeIn);
    if (stateWillBeIn) {
      toast.success(`${product.name} saved manually!`, { 
        style: { background: "#FEF2F2", color: "#DC2626", border: "1px solid #FCA5A5" },
        icon: <Heart className="w-4 h-4 fill-red-500 text-red-500" />
      });
    }
  };

  return (
    <Card className="min-w-[280px] sm:min-w-[300px] w-full max-w-[320px] snap-start shrink-0 group hoverEffect flex flex-col justify-between h-[400px]">
      <div className="relative h-48 bg-eco-50 overflow-hidden cursor-pointer group/image">
        <Link href={`/collections/${product.id}`} className="absolute inset-0 flex items-center justify-center z-0">
          {product.images && product.images.length > 0 ? (
            <img src={resolveImage(product.images[0])} alt={product.name} className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-700 ease-out" />
          ) : (
            <div className="text-eco-400 opacity-30 group-hover/image:scale-110 transition-transform duration-700 ease-out">
              <ShoppingBag className="w-20 h-20" />
            </div>
          )}
        </Link>
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 p-2.5 bg-white hover:bg-eco-100 rounded-full shadow-sm text-eco-900 transition-all z-10"
        >
          <Heart className={`w-4 h-4 transition-colors ${mounted && isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-1 gap-2">
        <Link href={`/collections/${product.id}`}>
          <h3 className="font-heading font-semibold text-lg text-eco-900 hover:text-eco-600 transition-colors truncate">{product.name}</h3>
        </Link>
        <p className="text-sm text-eco-600 line-clamp-2 min-h-[40px] leading-relaxed">{product.description}</p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-bold text-lg text-eco-900">₹{product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-full gap-2 border-eco-300 hover:bg-eco-600 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
              toast.success(`${product.name} added to cart!`);
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
