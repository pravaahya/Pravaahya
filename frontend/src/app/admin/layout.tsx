"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut, Tag } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Escape loop immediately on target routes natively without payload checking
    if (pathname === '/admin/login') {
      setIsAuthorized(true);
      return;
    }
    
    // Assess formal authentication cache organically to authorize view structures
    const token = sessionStorage.getItem("pravaahya_token");
    if (!token) {
      window.location.href = "/admin/login";
    } else {
      setIsAuthorized(true);
    }
  }, [pathname]);

  // Dynamically bypass the navigational matrices explicitly if requesting authentication boundaries 
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Pre-hydration rendering block natively preventing layout flashes
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Securing Administrative Node...</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Collections', href: '/admin/collections', icon: LayoutDashboard },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
     sessionStorage.removeItem("pravaahya_token");
     window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Universal Desktop Navigation Sandbox */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 z-40 shadow-sm relative">
         <div className="h-16 flex items-center px-8 border-b border-gray-100 gap-3">
            <h1 className="font-heading font-black text-2xl tracking-tighter text-gray-900">Pravaahya<span className="text-green-600">Admin</span></h1>
         </div>
         <nav className="flex-1 p-5 space-y-3 mt-4 overflow-y-auto">
            {navItems.map((item) => {
               const isActive = pathname === item.href;
               const Icon = item.icon;
               return (
                  <Link 
                     key={item.name} 
                     href={item.href} 
                     className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
                        isActive 
                           ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 translate-x-1' 
                           : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1'
                     }`}
                  >
                     <Icon className="w-5 h-5" />
                     {item.name}
                  </Link>
               )
            })}
         </nav>
         
         <div className="p-5 border-t border-gray-100 bg-gray-50/50">
            <button 
               onClick={handleLogout} 
               className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl font-black text-red-600 border-2 border-transparent hover:border-red-100 hover:bg-red-50 w-full transition-all duration-300 shadow-sm"
            >
               <LogOut className="w-5 h-5 flex-shrink-0" />
               Close Session
            </button>
         </div>
      </aside>

      {/* Main Administrative Node Mapping */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
         <div className="flex-1 h-full max-h-screen overflow-y-auto scroll-smooth">
            {children}
         </div>
      </main>
    </div>
  );
}
