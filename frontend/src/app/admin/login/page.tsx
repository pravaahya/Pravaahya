"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Authentication Signature Failure.");

      sessionStorage.setItem("pravaahya_token", data.token);
      router.push("/admin"); // Redirect cleanly to newly authorized dashboards natively
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
           <h1 className="text-2xl font-black text-gray-900 mb-2">Admin Gateway</h1>
           <p className="text-gray-500 font-medium text-sm">Secure authorization payload required.</p>
        </div>
        
        {error && (
           <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold shadow-sm border border-red-100">
             {error}
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Unique Identifier</label>
              <div className="relative group">
                 <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-900 transition-colors" />
                 <input autoFocus type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-gray-900 focus:bg-white transition-all shadow-inner" />
              </div>
           </div>
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Secure Passkey</label>
              <div className="relative group">
                 <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-900 transition-colors" />
                 <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-gray-900 focus:bg-white transition-all shadow-inner" />
              </div>
           </div>
           
           <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white rounded-xl py-4 font-black tracking-widest text-sm shadow-xl transition-all mt-4 active:scale-[0.98]">
              {loading ? "Decrypting Matrix..." : "AUTHENTICATE CORE"}
           </button>
        </form>
      </div>
    </div>
  );
}
