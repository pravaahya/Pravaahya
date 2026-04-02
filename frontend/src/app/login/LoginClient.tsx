"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Phone, KeyRound, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function LoginClient() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please securely format a valid 10-digit phone number.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`https://pravaahya.com/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Network pipeline faltered.");
      
      // Notify explicitly through Sonner globally mapped tracker
      toast.success("Secure code dispatched securely via Twilio!");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Code sequence strictly requires 6 numeric items.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`https://pravaahya.com/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Decryption signature falsified.");
      
      // Store resilient runtime validation block 
      sessionStorage.setItem("pravaahya_token", data.token);
      toast.success("Identity Verified successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 lg:py-32 flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-eco-100 shadow-2xl w-full max-w-[440px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-eco-500 to-earth-500"></div>
        
        <div className="text-center mb-10 mt-2">
          <h1 className="text-3xl font-heading font-bold text-eco-900 mb-2">Welcome Back</h1>
          <p className="text-eco-600 font-medium">Frictionless, secure phone authentication.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
             <motion.form key="step-1" onSubmit={handleSendOtp} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-eco-800 uppercase tracking-widest pl-1">Phone Number</label>
                  <div className="relative group">
                     <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-eco-400 group-focus-within:text-eco-600 transition-colors" />
                     <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" className="pl-12 h-14 bg-eco-50/50 rounded-2xl border-eco-200 focus:border-eco-500 focus:bg-white transition-all text-lg" disabled={loading} />
                  </div>
                </div>
                <Button type="submit" disabled={loading} size="lg" className="w-full h-14 rounded-full text-base font-bold shadow-md hover:bg-eco-800 transition-all">
                   {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send Login Code"}
                </Button>
             </motion.form>
          ) : (
             <motion.form key="step-2" onSubmit={handleVerifyOtp} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="space-y-3">
                   <div className="flex justify-between items-end pl-1 pr-1">
                      <label className="text-xs font-bold text-eco-800 uppercase tracking-widest">Secure OTP</label>
                      <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-eco-500 hover:text-eco-700 hover:underline">Change Number?</button>
                   </div>
                  <div className="relative group">
                     <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-eco-400 group-focus-within:text-eco-600 transition-colors" />
                     <Input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} placeholder="• • • • • •" className="pl-12 h-14 bg-eco-50/50 rounded-2xl border-eco-200 focus:border-eco-500 focus:bg-white transition-all tracking-[0.5em] font-mono text-xl" disabled={loading} />
                  </div>
                </div>
                <Button type="submit" disabled={loading} size="lg" className="w-full h-14 rounded-full text-base font-bold shadow-md bg-eco-600 hover:bg-eco-700 transition-all">
                   {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="flex items-center justify-center">Verify Identity <ArrowRight className="w-4 h-4 ml-2" /></span>}
                </Button>
             </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
