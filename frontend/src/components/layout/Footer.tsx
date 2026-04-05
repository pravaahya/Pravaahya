"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Shop All", href: "/collections" },
      { name: "About Us", href: "/about" },
      { name: "Blog", href: "/blog" },
    ],
    policies: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund" },
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/pravaahya/" },
    { icon: XIcon, href: "https://x.com/pravaahya" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/pravaahya" },
  ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-eco-900 border-t border-eco-800">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <Link href="/" className="inline-block">
                <div className="bg-white p-2 rounded-xl border border-white/20 shadow-sm transition-transform hover:rotate-3 inline-block">
                   <img src="/logo.png" alt="Pravaahya" className="h-10 w-auto object-contain" />
                </div>
              </Link>
              <p className="mt-4 text-eco-200 text-sm max-w-sm leading-relaxed">
                <span className="font-bold text-white block mb-1">The Flow of Sustainability.</span>
                Curated, sustainable gifts for every occasion. We hope you enjoy and come back to buy again!
              </p>
            </div>
            
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-eco-300">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="inline-block">
                    <motion.span 
                      className="text-sm text-eco-200 hover:text-white transition-colors flex items-center gap-1"
                      whileHover={{ x: 3 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-eco-300">
              Policies
            </h3>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="inline-block">
                    <motion.span 
                      className="text-sm text-eco-200 hover:text-white transition-colors flex items-center gap-1"
                      whileHover={{ x: 3 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-eco-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-eco-400">
            &copy; {currentYear} Pravaahya. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <motion.a 
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-eco-300 hover:text-white hover:bg-eco-800 rounded-full transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
