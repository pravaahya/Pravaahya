"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Plus, X, Tag, ShieldCheck, ShieldAlert } from "lucide-react";

interface AdminCoupon {
  _id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminCoupons() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Logical Mutation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    isActive: true,
    isFeatured: false
  });
  const [formError, setFormError] = useState("");

  const fetchCoupons = async () => {
    try {
      const token = sessionStorage.getItem("pravaahya_token");
      if (!token) { router.push("/admin/login"); return; }
      
      const res = await fetch("http://127.0.0.1:5000/api/coupons", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) {
         if (res.status === 401 || res.status === 403) {
             sessionStorage.removeItem("pravaahya_token");
             router.push("/admin/login");
             return;
         }
         throw new Error(json.error || "Network exception parsing analytical matrices.");
      }
      setCoupons(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [router]);

  const handleOpenModal = (coupon?: AdminCoupon) => {
    setFormError("");
    if (coupon) {
      setEditingId(coupon._id);
      setFormData({
        code: coupon.code,
        discountPercentage: coupon.discountPercentage.toString(),
        isActive: coupon.isActive,
        isFeatured: coupon.isFeatured
      });
    } else {
      setEditingId(null);
      setFormData({ code: "", discountPercentage: "", isActive: true, isFeatured: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Frontend Matrix Verification
    if (!formData.code || !formData.discountPercentage) {
      setFormError("All input text fields are unconditionally required.");
      return;
    }
    const dip = Number(formData.discountPercentage);
    if (dip < 1 || dip > 100) { 
        setFormError("Percentage mapping must mathematically lay identically between 1 and 100."); 
        return; 
    }

    try {
      const token = sessionStorage.getItem("pravaahya_token");
      const url = editingId 
        ? `http://127.0.0.1:5000/api/coupons/${editingId}`
        : "http://127.0.0.1:5000/api/coupons";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Mutation rejected organically by server layer.");

      setIsModalOpen(false);
      fetchCoupons(); // Synchronize array recursively naturally enforcing limit checks
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you securely confirming the deletion of this unique promotional code?")) return;
    
    try {
      const token = sessionStorage.getItem("pravaahya_token");
      const res = await fetch(`http://127.0.0.1:5000/api/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Backend authorization verification exception.");
      
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">Parsing Live Database Blocks...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage <span className="text-amber-600">Coupons</span></h1>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" /> Add New Coupon
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Promotional String</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Discount Value</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {coupons.map((coupon) => (
                   <tr key={coupon._id} className={"hover:bg-gray-50 transition-colors " + (!coupon.isActive ? "bg-gray-50/50 grayscale opacity-80" : "")}>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${coupon.isFeatured ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                               <Tag className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="font-bold text-gray-900 tracking-widest font-mono text-lg">{coupon.code}</p>
                               {coupon.isFeatured && <p className="text-[10px] font-black tracking-widest uppercase text-amber-600 mt-1">Global Header Live</p>}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5 font-black text-amber-700 text-xl">{coupon.discountPercentage}%</td>
                      <td className="px-6 py-5 flex items-center gap-2 mt-4 inline-flex">
                         {coupon.isActive ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest rounded-lg border border-green-200">
                               <ShieldCheck className="w-3.5 h-3.5" /> Active
                            </span>
                         ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-lg border border-gray-300">
                               <ShieldAlert className="w-3.5 h-3.5" /> Paused
                            </span>
                         )}
                      </td>
                      <td className="px-6 py-5 text-right space-x-3">
                         <button onClick={() => handleOpenModal(coupon)} className="p-2.5 text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-xl transition-colors inline-flex border border-blue-100 shadow-sm hover:shadow-md">
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleDelete(coupon._id)} className="p-2.5 text-red-600 bg-red-50/50 hover:bg-red-100 rounded-xl transition-colors inline-flex border border-red-100 shadow-sm hover:shadow-md">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {coupons.length === 0 && (
                <div className="p-16 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-300">
                      <Tag className="w-8 h-8 text-gray-300" />
                   </div>
                    <p className="text-gray-500 font-medium">No active discount bounds are mapped currently.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* CRUD Overlay Form Matrix */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm shadow-2xl">
           <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">{editingId ? "Edit Promotion" : "Generate Promotion"}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 bg-white hover:text-gray-900 p-2 rounded-full border border-gray-200 shadow-sm transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                 {formError && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold shadow-sm border border-red-100 flex items-center gap-3">
                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                       {formError}
                    </div>
                 )}
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Promo Code</label>
                    <input autoFocus type="text" required placeholder="SPRING20" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner" />
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Discount %</label>
                    <input type="number" required min="1" max="100" placeholder="20" value={formData.discountPercentage} onChange={e => setFormData({...formData, discountPercentage: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner" />
                 </div>
                 
                 <div className="space-y-3 pt-2">
                     <div className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-2xl border border-gray-200">
                        <input type="checkbox" id="activeToggle" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-green-600 rounded cursor-pointer focus:ring-green-500 border-gray-300" />
                        <div>
                           <label htmlFor="activeToggle" className="text-sm font-bold text-gray-900 cursor-pointer block">Activate Promotion</label>
                           <p className="text-[10px] text-gray-500 mt-0.5">Allows checkout terminals to accept this boundary.</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 bg-amber-50/50 hover:bg-amber-50 transition-colors p-4 rounded-2xl border border-amber-200">
                        <input type="checkbox" id="featuredToggle" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 text-amber-600 rounded cursor-pointer focus:ring-amber-500 border-amber-300" />
                        <div>
                           <label htmlFor="featuredToggle" className="text-sm font-bold text-gray-900 cursor-pointer block">Pin to Global Header</label>
                           <p className="text-[10px] text-gray-500 mt-0.5">Visually anchors this array to the absolute top of the client website natively replacing any prior pins.</p>
                        </div>
                     </div>
                 </div>

                 <div className="pt-6">
                     <button type="submit" className="w-full border border-amber-700 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl py-4 font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-[0.98]">
                        {editingId ? "Save Sequence" : "Inject Sequence"}
                     </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
