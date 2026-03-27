"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, Zap, ShieldCheck, Truck, ChevronLeft, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = API_URL.replace('/api', '');

const resolveImage = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("data:")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

export function ProductDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addItem);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  const [mounted, setMounted] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const json = await res.json();
        setProduct(json.product);
        setRelated(json.related);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    setMounted(true);
    if (product) {
       setIsWishlisted(isInWishlist(product.id));
       addRecentlyViewed(product);
    }
  }, [product, isInWishlist, addRecentlyViewed]);

  const handleWishlistToggle = () => {
    if (!product) return;
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-eco-500 mb-4" />
        <span className="text-sm font-medium text-eco-600">Loading Product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-eco-900 mb-4">Product Not Found</h1>
        <Button onClick={() => router.back()} className="rounded-full">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Breadcrumb / Back Navigation */}
      <Link href="/collections" className="inline-flex items-center text-sm font-medium text-eco-600 hover:text-eco-900 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Collections
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
        {/* Images Studio Area */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="aspect-square bg-eco-50 rounded-3xl flex items-center justify-center relative overflow-hidden border border-eco-100"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center"
              >
                {product.images && product.images[activeImage] ? (
                   <img src={resolveImage(product.images[activeImage])} alt={`${product.name} view ${activeImage + 1}`} className="w-full h-full object-cover" />
                ) : (
                   <ShoppingBag className="w-32 h-32 md:w-48 md:h-48 text-eco-300 drop-shadow-sm" />
                )}
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {product.stock < 10 && (
                <span className="px-3 py-1 bg-red-500/10 text-red-600 text-xs font-bold rounded-full tracking-wider uppercase backdrop-blur-sm">
                  Low Stock
                </span>
              )}
              {product.tags.includes("organic") && (
                <span className="px-3 py-1 bg-eco-600/10 text-eco-700 text-xs font-bold rounded-full tracking-wider uppercase backdrop-blur-sm">
                  Organic
                </span>
              )}
            </div>
            
            <button onClick={handleWishlistToggle} className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-white rounded-full shadow-sm text-eco-900 transition-colors backdrop-blur-sm z-10 group">
              <Heart className={`w-5 h-5 transition-colors ${mounted && isWishlisted ? "fill-red-500 text-red-500" : "group-hover:fill-red-500 group-hover:text-red-500"}`} />
            </button>
          </motion.div>
          
          {/* Thumbnail Gallery (Mocking Product.images) */}
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                className={`shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex items-center justify-center border-2 transition-all p-1 snap-start ${activeImage === i ? "border-eco-600 bg-white" : "border-transparent bg-eco-50 opacity-60 hover:opacity-100"}`}
                onClick={() => setActiveImage(i)}
              >
                 {img ? (
                    <img src={resolveImage(img)} alt="" className="w-full h-full object-cover rounded-xl" />
                 ) : (
                    <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-eco-300" />
                 )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Actions Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-widest text-earth-600">{product.category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-eco-900 leading-tight mb-4">
            {product.name}
          </h1>
          <div className="text-2xl md:text-3xl font-bold text-eco-900 mb-6">
            ₹{product.price.toFixed(2)}
          </div>
          
          <div className="text-eco-700 md:text-lg leading-relaxed mb-8 max-w-xl">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-eco-100 text-eco-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          {/* Action Area */}
          <div className="space-y-4 pt-8 border-t border-eco-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => { addItem(product); toast.success(`${product.name} added to cart!`); }} size="lg" className="flex-1 rounded-full h-14 text-base font-semibold shadow-md text-white hover:bg-eco-800 group">
                <ShoppingBag className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Add to Cart
              </Button>
              <Button onClick={() => { addItem(product); router.push("/cart"); }} size="lg" variant="secondary" className="flex-1 rounded-full h-14 text-base font-semibold bg-earth-400 hover:bg-earth-500 text-white border-0 shadow-md group">
                <Zap className="w-5 h-5 mr-3 fill-current group-hover:scale-110 transition-transform" />
                Buy it Now
              </Button>
            </div>
            
            <p className="text-sm text-center text-eco-600 font-medium pt-2">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {product.stock} items left in stock — Ships in 24 hours
            </p>
          </div>


        </motion.div>
      </div>

      {/* Related Products Feature */}
      {related.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="pt-16 md:pt-24 border-t border-eco-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-eco-900 tracking-tight">You might also like</h2>
            <Link href="/collections" className="text-sm font-bold text-eco-600 hover:text-eco-900 transition-colors uppercase tracking-wider">
              Shop All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
