import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { Calendar, Clock, ChevronRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The Pravaahya Journal | Eco-Tips & Sustainability Insights",
  description: "Explore our comprehensive library of professionally architected articles detailing optimal sustainability paradigms, zero waste guides, and actionable eco-tips mapping exactly to high-impact routines.",
  keywords: ["sustainability blog", "eco friendly tips", "zero waste guide", "sustainable living", "Pravaahya journal"],
};

export default function BlogIndex() {
  // Pre-compute category filters natively 
  const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.category)))];

  return (
    <div className="bg-white min-h-[80vh]">
      {/* Blog Discovery Hero */}
      <div className="bg-eco-50/50 py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Leaf className="w-12 h-12 text-eco-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-heading font-black text-eco-950 mb-6 tracking-tight">The Sustainable Journal</h1>
          <p className="text-lg md:text-xl text-eco-700 max-w-2xl mx-auto leading-relaxed">
             Actionable advice, deep-dive investigations, and structural paradigms mapping out an absolutely frictionless zero-waste future globally.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-16">
        
        {/* Semantic Category Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          {categories.map((cat, i) => (
            <button 
              key={cat} 
              className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all ${i === 0 ? "bg-eco-900 text-white" : "bg-white border border-eco-200 text-eco-600 hover:border-eco-900 hover:text-eco-900"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Semantic Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="flex flex-col bg-white border border-eco-100/80 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              {/* Aspect Ratio Semantic Visual Placeholder */}
              <Link href={`/blog/${post.slug}`} className="block relative aspect-video bg-eco-100 overflow-hidden">
                 <div className="absolute inset-0 bg-eco-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                    <Leaf className="w-16 h-16 text-eco-300" />
                 </div>
                 <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-eco-800 shadow-sm uppercase tracking-wide">
                      {post.category}
                    </span>
                 </div>
              </Link>
              
              <div className="p-6 md:p-8 flex flex-col flex-1">
                 <div className="flex items-center gap-4 text-xs font-medium text-eco-500 mb-4">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</div>
                 </div>
                 
                 <Link href={`/blog/${post.slug}`} className="block block group-hover:text-eco-600 transition-colors mb-4">
                    <h2 className="text-2xl font-bold font-heading text-eco-950 leading-snug line-clamp-2">{post.title}</h2>
                 </Link>
                 
                 <p className="text-eco-700 leading-relaxed mb-8 line-clamp-3 flex-1">{post.excerpt}</p>
                 
                 <Link href={`/blog/${post.slug}`} className="mt-auto flex items-center font-bold text-eco-700 hover:text-eco-900 group/link">
                    Read Full Article <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                 </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
