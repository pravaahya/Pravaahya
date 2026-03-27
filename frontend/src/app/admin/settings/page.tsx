"use client";

import { useState, useEffect } from "react";
import { Save, Mail, Shield, Smartphone } from "lucide-react";
import { toast, Toaster } from "sonner"; // For internal UI tracking natively.

export default function AdminSettings() {
  const [enableEmails, setEnableEmails] = useState(false);
  const [enableWhatsApp, setEnableWhatsApp] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Simulate mapping environment values safely masking local operations visually.
    const savedEmail = localStorage.getItem("pravaahya_smtp_enabled");
    if (savedEmail === "true") setEnableEmails(true);

    const savedWA = localStorage.getItem("pravaahya_wa_enabled");
    if (savedWA === "true") setEnableWhatsApp(true);

    setMounted(true);
  }, []);

  const handleToggle = (type: "email" | "wa") => {
    if (type === "email") {
       const newVal = !enableEmails;
       setEnableEmails(newVal);
       localStorage.setItem("pravaahya_smtp_enabled", String(newVal));
    } else {
       const newVal = !enableWhatsApp;
       setEnableWhatsApp(newVal);
       localStorage.setItem("pravaahya_wa_enabled", String(newVal));
    }
  };

  const handleSave = () => {
    toast.success("Architectural Environmental Metrics Synchronized Successfully.");
  };

  if (!mounted) return <div className="p-8 text-center text-gray-500 font-bold tracking-widest text-xs uppercase">Decoding Logical Vectors...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System <span className="text-blue-600">Settings</span></h1>
          <p className="text-gray-500 text-sm font-medium mt-2">Manage environmental thresholds and global notification communication bounds seamlessly.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
           
           <div className="flex items-start gap-5 pb-8 border-b border-gray-100">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 shadow-inner">
                  <Mail className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Enable Generic SMTP Network</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">Automatically dispatch transactional HTML array matrices to strictly verifiable customer email blocks globally protecting parameters natively.</p>
               </div>
               <div 
                  onClick={() => handleToggle("email")}
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ring-4 ring-transparent ${enableEmails ? 'bg-blue-600 hover:bg-blue-700 hover:ring-blue-100' : 'bg-gray-200 hover:bg-gray-300'}`}
               >
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${enableEmails ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </div>
           </div>

           <div className="flex items-start gap-5 pb-8 border-b border-gray-100">
               <div className="p-3 bg-green-50 text-green-600 rounded-2xl shrink-0 shadow-inner">
                  <Smartphone className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Enable Meta WhatsApp API</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">Deploy Graph API v18.0 routing nodes mapping directly mapping internal transition events internally connecting safely over JSON templates.</p>
               </div>
               <div 
                  onClick={() => handleToggle("wa")}
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ring-4 ring-transparent ${enableWhatsApp ? 'bg-green-600 hover:bg-green-700 hover:ring-green-100' : 'bg-gray-200 hover:bg-gray-300'}`}
               >
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${enableWhatsApp ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </div>
           </div>

           <div className="pt-2">
             <button onClick={handleSave} className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md active:scale-[0.98] flex items-center gap-3">
               <Save className="w-5 h-5" /> Save Internal State Vectors
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
