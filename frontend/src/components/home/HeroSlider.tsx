"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gift, Leaf, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Conscious Gifting, Elevated",
    description: "Discover curated, sustainable gifts that leave a lasting impression on your loved ones and the planet.",
    cta: "Shop Spring Collection",
    href: "/collections",
    icon: Gift,
    bgClass: "bg-eco-50",
    textClass: "text-eco-900",
    iconClass: "text-eco-600",
  },
  {
    id: 2,
    title: "100% Eco-Friendly Materials",
    description: "Every product is sourced responsibly, packaged without plastics, and crafted to endure.",
    cta: "Read Our Story",
    href: "/about",
    icon: Leaf,
    bgClass: "bg-earth-50",
    textClass: "text-earth-900",
    iconClass: "text-earth-600",
  },
  {
    id: 3,
    title: "Gifts that Give Back",
    description: "we are selling, eco friendly bamboo mug or cup with stainless steel assembled in it.",
    cta: "Shop Collection",
    href: "/collections",
    icon: Globe,
    bgClass: "bg-eco-100",
    textClass: "text-eco-900",
    iconClass: "text-eco-700",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  const slideVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: "tween" as const, duration: 0.5 },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { type: "tween" as const, duration: 0.5 },
    }),
  };

  const IconComponent = slides[current].icon;

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`absolute inset-0 flex items-center justify-center ${slides[current].bgClass}`}
        >
          <div className="container mx-auto px-10 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
            {/* Text Content */}
            <div className={`space-y-6 z-10 ${slides[current].textClass}`}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight"
              >
                {slides[current].title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl opacity-90 max-w-lg"
              >
                {slides[current].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link href={slides[current].href}>
                  <Button size="lg" className="mt-4 rounded-full px-8">
                    {slides[current].cta}
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            {/* SVG Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="hidden md:flex justify-end items-center z-10"
            >
              <IconComponent 
                className={`w-64 h-64 lg:w-80 lg:h-80 opacity-20 ${slides[current].iconClass}`} 
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white text-eco-900 shadow-sm transition-all z-20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-eco-500 hidden md:flex"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white text-eco-900 shadow-sm transition-all z-20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-eco-500 hidden md:flex"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${idx === current ? "w-8 h-2.5 bg-eco-600" : "w-2.5 h-2.5 bg-eco-300 hover:bg-eco-400"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
