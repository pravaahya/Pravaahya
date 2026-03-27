"use client";
import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("Failed to send OTP securely");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed natively");
      sessionStorage.setItem("pravaahya_token", data.token); // Store secure app-level token
      window.location.href = "/profile";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl max-w-sm w-full border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>
        <div className="text-center mb-10">
           <h1 className="text-2xl font-black text-gray-900 mb-2">Client Gateway</h1>
           <p className="text-gray-500 font-medium text-sm">Secure passwordless verification.</p>
        </div>

        {error && (
           <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold shadow-sm border border-red-100">
             {error}
           </div>
        )}

        {step === 1 ? (
          <form onSubmit={sendOtp} className="space-y-5">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Identifier</label>
               <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="identifier@domain.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-gray-900 focus:bg-white transition-all shadow-inner" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white rounded-xl py-4 font-black tracking-widest text-sm shadow-xl transition-all mt-4">{loading ? "Dispatched..." : "Send OTP"}</button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-5">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Verification Code</label>
               <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required placeholder="6-digit hash" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium tracking-widest focus:outline-none focus:border-gray-900 focus:bg-white transition-all shadow-inner text-center" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white rounded-xl py-4 font-black tracking-widest text-sm shadow-xl transition-all mt-4">{loading ? "Authenticating..." : "Verify Identity"}</button>
            
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
               <button type="button" onClick={sendOtp} disabled={loading} className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">
                  Didn't receive code? Resend OTP
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
