"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage after mount to avoid hydration mismatches
    const isDismissed = localStorage.getItem("pravaahya-announcement-dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pravaahya-announcement-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-eco-200 text-eco-900 border-b border-eco-300 overflow-hidden relative z-50"
        >
          <div className="container mx-auto px-4 py-2 flex items-center justify-center text-xs sm:text-sm font-medium">
            <p className="text-center pr-8 sm:pr-0">
              Spring Sale is here! Enjoy 20% off all sustainable gifts. Use code: 
              <span className="font-bold ml-1.5 px-1.5 py-0.5 rounded bg-eco-900 text-eco-50 tracking-wider">SPRING20</span>
            </p>
            <button
              onClick={handleDismiss}
              className="absolute right-2 md:right-4 p-1 rounded-full hover:bg-eco-300 transition-colors text-eco-900"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
