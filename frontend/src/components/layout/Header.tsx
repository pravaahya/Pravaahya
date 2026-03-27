"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Leaf } from "lucide-react";
import { cn } from "@/utils/cn";
import { useDebounce } from "@/hooks/useDebounce";
import { Product } from "@/types/product";
import { resolveImage } from "@/lib/image-utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.items.length);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [collections, setCollections] = useState<{_id: string, name: string}[]>([]);
  const [featuredCoupon, setFeaturedCoupon] = useState<{code: string, discountPercentage: number} | null>(null);

  useEffect(() => {
    const fetchCols = async () => {
       try {
           const res = await fetch('/api/collections');
           const json = await res.json();
           if (json.data) setCollections(json.data);
       } catch (e) {}
    };
    fetchCols();

    const fetchPromo = async () => {
       try {
           const resUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
           const res = await fetch(`${resUrl}/coupons/featured`);
           if (res.ok) {
              const json = await res.json();
              if (json.success && json.data) {
                 setFeaturedCoupon(json.data);
              }
           }
       } catch (e) { console.error("Promo banner network interrupt.", e); }
    };
    fetchPromo();
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    
    const fetchSearch = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(debouncedSearch)}&limit=5`);
        if (res.ok) {
          const json = await res.json();
          setSearchResults(json.data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Fast discovery parsing error:", err);
      } finally {
        setIsSearching(false);
      }
    };
    
    fetchSearch();
  }, [debouncedSearch]);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
      )}
    >
      {/* Global Promotional Banner Array */}
      <AnimatePresence>
         {featuredCoupon && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full bg-eco-900 text-eco-50 py-2.5 px-4 text-center z-[60] flex items-center justify-center shrink-0 border-b border-white/10"
            >
               <p className="text-xs md:text-sm font-bold tracking-wide">
                  🌱 <span className="text-white">Sustainable Offer:</span> Apply code <strong className="font-black font-mono tracking-widest text-amber-300 mx-1">{featuredCoupon.code}</strong> at checkout to unlock <strong className="font-black text-amber-300">{featuredCoupon.discountPercentage}% OFF</strong> your entire cart!
               </p>
            </motion.div>
         )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center z-50">
          <img src="/logo.png" alt="Pravaahya" className="w-auto h-8 md:h-12 object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={cn("text-sm transition-colors", pathname === "/" ? "font-bold text-eco-700" : "font-medium text-foreground hover:text-eco-600")}>
            Home
          </Link>
          <Link href="/collections" className={cn("text-sm transition-colors", pathname.startsWith("/collections") ? "font-bold text-eco-700" : "font-medium text-foreground hover:text-eco-600")}>
            Shop All
          </Link>
          
          {/* Collections Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsCollectionsHovered(true)}
            onMouseLeave={() => setIsCollectionsHovered(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium hover:text-eco-600 transition-colors py-2">
              Collections
              <ChevronDown className={cn("w-4 h-4 transition-transform", isCollectionsHovered && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isCollectionsHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="flex flex-col py-2">
                    {collections.length > 0 ? (
                       collections.map(c => (
                         <Link key={c._id} href={`/collections?collectionId=${c._id}`} className="px-4 py-2 text-sm font-medium hover:bg-eco-50 hover:text-eco-800 transition-colors">
                           {c.name}
                         </Link>
                       ))
                    ) : (
                       <div className="px-4 py-3 text-xs italic text-eco-400">No collections...</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about" className={cn("text-sm transition-colors", pathname.startsWith("/about") ? "font-bold text-eco-700" : "font-medium text-foreground hover:text-eco-600")}>
            About
          </Link>
        </nav>

        {/* Icons (Search, Wishlist, Cart) & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4 z-50">
          {/* Expandable Search with Debounced Fast-Discovery Typeahead */}
          <div className="relative flex items-center" ref={searchContainerRef}>
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute right-10 flex items-center bg-white border border-eco-200 rounded-full h-10 shadow-sm hidden md:flex z-50 overflow-visible"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sustainable products..."
                    className="w-full bg-transparent px-4 text-sm outline-none text-eco-900 placeholder:text-eco-400"
                    onFocus={() => { if(searchResults.length > 0) setShowDropdown(true); }}
                  />
                  {isSearching && (
                    <div className="pr-3">
                      <div className="w-4 h-4 border-2 border-eco-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* Dropdown Results Overlay Matrix */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-12 right-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-eco-100 overflow-hidden z-[100] flex flex-col"
                      >
                        {searchResults.length > 0 ? (
                          <div className="py-2">
                             <div className="px-4 py-2 text-[11px] font-bold text-eco-400 uppercase tracking-widest bg-eco-50/50">Relevant Products</div>
                             {searchResults.map((product) => (
                                <Link 
                                  key={product.id} 
                                  href={`/collections/${product.id}`}
                                  onClick={() => { setShowDropdown(false); setIsSearchExpanded(false); setSearchQuery(""); }}
                                  className="flex items-center gap-4 px-4 py-3 hover:bg-eco-50 transition-colors group/item"
                                >
                                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0 border border-transparent group-hover/item:border-green-100 transition-colors">
                                     <img src={resolveImage(product.images[0])} alt={product.name} className="w-8 h-8 object-contain" />
                                  </div>
                                  <div className="flex-1 min-w-0 pr-4">
                                     <p className="text-sm font-bold text-eco-900 truncate group-hover/item:text-eco-700">{product.name}</p>
                                     <p className="text-xs text-eco-500 truncate font-medium">₹{product.price.toFixed(2)}</p>
                                  </div>
                                </Link>
                             ))}
                             <Link 
                               href={`/collections?search=${encodeURIComponent(debouncedSearch)}`}
                               onClick={() => { setShowDropdown(false); setIsSearchExpanded(false); }}
                               className="block mt-2 px-4 py-3.5 text-center text-sm font-bold text-eco-600 hover:bg-eco-50 border-t border-eco-50 transition-colors bg-white hover:text-eco-800"
                             >
                               View all results for "{searchQuery}"
                             </Link>
                          </div>
                        ) : (
                          <div className="px-4 py-10 text-center flex flex-col items-center">
                             <Search className="w-8 h-8 text-eco-200 mb-3" />
                             <p className="text-eco-600 text-sm font-medium">No sustainable products found matching "{searchQuery}"</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => {
                 setIsSearchExpanded(!isSearchExpanded);
                 if (isSearchExpanded) {
                    setShowDropdown(false);
                    setSearchQuery("");
                 }
              }}
              className="p-2 hover:bg-eco-50 rounded-full transition-colors text-foreground z-10"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <Link href="/wishlist" className="relative p-2 hover:bg-eco-50 rounded-full transition-colors text-foreground hidden sm:block">
            <Heart className="w-5 h-5" />
            {mounted && wishlistItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 shadow-sm">
                {wishlistItems}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative p-2 hover:bg-eco-50 rounded-full transition-colors text-foreground">
            <ShoppingBag className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-eco-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="p-2 hover:bg-eco-50 rounded-full transition-colors md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-0 left-0 right-0 bg-background border-b border-border pt-20 px-4 pb-6 overflow-hidden flex flex-col gap-4"
          >
            <Link 
              href="/" 
              className={cn("text-lg py-3 border-b border-border", pathname === "/" ? "font-bold text-eco-700" : "font-medium text-foreground")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/collections" 
              className={cn("text-lg py-3 border-b border-border", pathname.startsWith("/collections") ? "font-bold text-eco-700" : "font-medium text-foreground")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop All
            </Link>
            
            <div className="flex flex-col border-b border-border py-2">
              <span className="text-lg font-medium py-2 text-eco-800">Collections</span>
              <div className="flex flex-col pl-4 gap-3 py-2">
                 {collections.map(c => (
                    <Link key={c._id} href={`/collections?collectionId=${c._id}`} onClick={() => setIsMobileMenuOpen(false)} className="text-foreground/80 font-medium">
                       {c.name}
                    </Link>
                 ))}
                 {collections.length === 0 && <span className="text-sm italic text-eco-400">Empty</span>}
              </div>
            </div>

            <Link 
              href="/about" 
              className={cn("text-lg py-3 border-b border-border", pathname.startsWith("/about") ? "font-bold text-eco-700" : "font-medium text-foreground")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <Link 
              href="/wishlist" 
              className="text-lg font-medium py-3 border-b border-border flex items-center justify-between"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Wishlist
              <Heart className="w-5 h-5" />
            </Link>

            {/* Mobile Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search store..." 
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-background/50 outline-none focus:border-eco-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
