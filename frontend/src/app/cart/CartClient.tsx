"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { resolveImage } from "@/lib/image-utils";

export function CartClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  // Prevent hydration mismatch between server HTML and localStorage payload
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-eco-900 mb-10 tracking-tight">
        Your Shopping Cart
      </h1>
      
      {items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-eco-50 rounded-3xl border border-eco-100"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-eco-300">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-eco-900 mb-2">Your cart is completely empty.</h2>
          <p className="text-eco-600 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Let's find your next eco-friendly gift.</p>
          <Link href="/collections">
            <Button size="lg" className="rounded-full font-semibold">Start Shopping <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Roster */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:flex-row gap-6 bg-white border border-border p-4 rounded-2xl shadow-sm"
                >
                  <div className="w-full sm:w-32 h-32 bg-eco-50 rounded-xl shrink-0 flex items-center justify-center border border-eco-100 p-1 overflow-hidden">
                     {item.images && item.images.length > 0 ? (
                        <img src={resolveImage(item.images[0])} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                     ) : (
                        <ShoppingBag className="w-12 h-12 text-eco-300 relative z-0 opacity-50" />
                     )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className="text-xs font-bold text-earth-600 uppercase tracking-widest block mb-1">{item.category}</span>
                         <Link href={`/collections/${item.id}`} className="hover:text-eco-600 transition-colors">
                           <h3 className="font-heading font-semibold text-lg text-eco-900 line-clamp-1">{item.name}</h3>
                         </Link>
                       </div>
                       <p className="font-bold text-eco-900 whitespace-nowrap ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 bg-eco-50 p-1 rounded-full border border-eco-200">
                        <button 
                          onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                          className="w-8 h-8 flex flex-col items-center justify-center bg-white rounded-full text-eco-600 shadow-sm hover:text-eco-900 hover:bg-eco-100 transition-all font-bold disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center text-eco-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                          className="w-8 h-8 flex flex-col items-center justify-center bg-white rounded-full text-eco-600 shadow-sm hover:text-eco-900 hover:bg-eco-100 transition-all font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id!)}
                        className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Cart Breakdown */}
          <div className="lg:col-span-1">
             <div className="bg-eco-50/50 border border-eco-200 p-6 rounded-3xl sticky top-24">
                <h3 className="font-heading font-bold text-xl text-eco-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm text-eco-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-eco-900">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Estimate</span>
                    <span className="font-semibold text-eco-900 text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="text-eco-500 italic">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-eco-200 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-lg text-eco-900">Total</span>
                    <span className="font-bold text-2xl text-eco-900">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button onClick={() => router.push("/checkout")} size="lg" className="w-full rounded-full h-14 text-base font-semibold shadow-sm hover:bg-eco-800">
                  Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <p className="text-xs text-eco-500 text-center mt-6 mt-4 font-medium flex items-center justify-center gap-1.5">
                   Secured by End-to-End Encryption
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
