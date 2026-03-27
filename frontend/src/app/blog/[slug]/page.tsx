import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Force Dynamic Meta-Tag Generation uniquely targeting Exact Slug Paths
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return { title: 'Article Not Found | Pravaahya' };
  }
  
  return {
    title: `${post.title} | Pravaahya Journal`,
    description: post.excerpt,
    publisher: "Pravaahya Eco",
    authors: [{ name: post.author }],
    openGraph: {
       title: post.title,
       description: post.excerpt,
       type: 'article',
       publishedTime: post.publishedAt,
       authors: [post.author],
       tags: [post.category, "Sustainability", "Eco Friendly"]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
       <div className="bg-eco-50/40">
         <div className="container mx-auto px-4 md:px-6 max-w-4xl py-12 md:py-20">
            <Link href="/blog" className="inline-flex items-center text-eco-600 font-bold hover:text-eco-900 mb-10 transition-colors group">
               <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Journal
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
               <span className="bg-eco-200/50 text-eco-800 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">{post.category}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-eco-950 leading-tight mb-8">
               {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-eco-600 border-t border-eco-200/60 pt-6">
               <div className="flex items-center gap-2"><User className="w-4 h-4 text-eco-400" /> By {post.author}</div>
               <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-eco-400" /> {new Date(post.publishedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</div>
               <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-eco-400" /> {post.readTime}</div>
            </div>
         </div>
       </div>

       <main className="container mx-auto px-4 md:px-6 max-w-3xl py-16 md:py-24">
          <article className="mx-auto">
             {/* Excerpt Lead */}
             <p className="text-xl md:text-2xl font-medium text-eco-900 leading-relaxed mb-12 italic border-l-4 border-eco-400 pl-6">
                {post.excerpt}
             </p>
             
             {/* Dynamic Paragraph Looping safely escaping structural content rendering perfectly */}
             {post.content.map((paragraph, idx) => (
                <p key={idx} className="mb-8 text-lg text-eco-800 leading-relaxed">{paragraph}</p>
             ))}
          </article>
          
          <hr className="my-16 border-eco-100" />
          
          <div className="flex justify-between items-center bg-eco-50 p-8 rounded-3xl">
             <div className="flex-1">
                <h3 className="text-xl font-bold font-heading text-eco-950 mb-2">Want more eco tips?</h3>
                <p className="text-sm text-eco-700">Subscribe natively for completely green insights securely delivered to your inbox.</p>
             </div>
             <Button className="rounded-full shadow-md font-bold text-base h-12 px-6 bg-eco-900 hover:bg-black">Subscribe Now</Button>
          </div>
       </main>
    </div>
  );
}
