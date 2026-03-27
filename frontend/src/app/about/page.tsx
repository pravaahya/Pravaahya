"use client";

import { motion } from "framer-motion";
import { Leaf, Recycle, HeartHandshake, Globe } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-eco-50/50 -z-10" />
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-100/80 text-eco-800 text-sm font-bold tracking-widest uppercase mb-8">
              <Leaf className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-eco-900 tracking-tight mb-8 leading-tight">
              Rooted in Nature.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-600 to-emerald-400">
                The Flow of Sustainability.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Pravaahya was born from a simple belief: that everyday products can be beautiful, functional, and deeply respectful of the planet we call home. We carefully curate sustainable goods for everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-eco-900/20 to-transparent z-10" />
              <img 
                src="/bamboo-products.png" 
                alt="Curated Bamboo Products" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900">
                Curating sustainable everyday essentials.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At Pravaahya, our mission is to make sustainable living both beautiful and accessible. We believe that the items we use daily should be mindful of the planet without compromising on quality or aesthetics.
                </p>
                <p>
                  We specialize in carefully curating premium eco-friendly goods—such as our signature bamboo and stainless steel drinkware. By sourcing only from trusted partners who share our values, we help you replace disposable items with durable, nature-inspired alternatives.
                </p>
                <p className="font-medium text-eco-800 italic">
                  "The Flow of Sustainability starts with the choices we make every day."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-eco-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900 mb-6">Our Core Pillars</h2>
            <p className="text-lg text-gray-600">
              The uncompromising standards that guide our curation process, bringing the best sustainable goods to your hands.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <Globe className="w-8 h-8 text-eco-600" />,
                title: "Eco-Conscious Materials",
                desc: "Focusing on highly renewable resources like bamboo and durable stainless steel to minimize our ecological footprint."
              },
              {
                icon: <Recycle className="w-8 h-8 text-eco-600" />,
                title: "Mindful Packaging",
                desc: "Prioritizing minimal and recyclable packaging to ensure your selections arrive safely with less waste."
              },
              {
                icon: <HeartHandshake className="w-8 h-8 text-eco-600" />,
                title: "Ethical Partnerships",
                desc: "Carefully vetting our suppliers to ensure they share our commitment to fair wages and safe working conditions."
              },
              {
                icon: <Leaf className="w-8 h-8 text-eco-600" />,
                title: "Designed for Longevity",
                desc: "Curating premium everyday essentials built to last, helping you confidently choose reuse over single-use."
              }
            ].map((val, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-eco-50 flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-eco-900 z-0" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-8 leading-tight">
              Ready to walk lighter on the earth?
            </h2>
            <p className="text-xl text-eco-100 mb-12 max-w-xl mx-auto">
              Join thousands of conscious consumers who are proving that premium quality doesn't have to cost the planet.
            </p>
            <Link 
              href="/collections"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-eco-900 bg-white hover:bg-eco-50 rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              Explore Our Collection
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
