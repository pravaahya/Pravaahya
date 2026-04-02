"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import { resolveImage } from "@/lib/image-utils";

interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  isFeatured?: boolean;
}

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Logical Mutation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "General",
    tags: "",
    stock: "",
    isFeatured: false
  });
  const [imagesData, setImagesData] = useState<FileList | null>(null);
  const [formError, setFormError] = useState("");

  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem("pravaahya_token");
      if (!token) { router.push("/admin/login"); return; }
      
      const res = await fetch("https://pravaahya.com/api/products", {
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
      setProducts(json.data);
      
      // Auto-extract exact category sets intuitively matching database strings natively
      const derived = Array.from(new Set(json.data.map((p: any) => p.category).filter(Boolean)));
      setCustomCategories(derived as string[]);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [router]);

  const handleOpenModal = (product?: AdminProduct) => {
    setFormError("");
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        category: product.category || "General",
        tags: (product.tags || []).join(", "),
        stock: product.stock.toString(),
        isFeatured: product.isFeatured || false
      });
      setImagesData(null);
    } else {
      setEditingId(null);
      setFormData({ name: "", price: "", description: "", category: "General", tags: "", stock: "", isFeatured: false });
      setImagesData(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Frontend Matrix Verification
    if (!formData.name || !formData.price || !formData.description || !formData.stock) {
      setFormError("All input text fields are unconditionally required.");
      return;
    }
    if (!editingId && (!imagesData || imagesData.length === 0)) {
      setFormError("Minimum 1 logical product binary image must be attached organically.");
      return;
    }
    if (Number(formData.price) <= 0) { setFormError("Price values mathematically must exceed 0."); return; }
    if (Number(formData.stock) < 0) { setFormError("Stock values mathematically must not drop below 0."); return; }

    try {
      const token = sessionStorage.getItem("pravaahya_token");
      const url = editingId 
        ? `https://pravaahya.com/api/products/${editingId}`
        : "https://pravaahya.com/api/products";
      const method = editingId ? "PUT" : "POST";

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("description", formData.description);
      payload.append("category", formData.category || "General");
      if (formData.tags) {
         formData.tags.split(",").forEach(tag => {
            const trimmed = tag.trim();
            if (trimmed) payload.append("tags[]", trimmed);
         });
      }
      payload.append("stock", formData.stock);
      payload.append("isFeatured", String(formData.isFeatured));
      
      if (imagesData && imagesData.length > 0) {
        Array.from(imagesData).forEach((file) => {
           payload.append("images", file);
        });
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: payload
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Mutation rejected organically by server layer.");

      setIsModalOpen(false);
      fetchProducts(); // Synchronize array recursively
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    // Force Confirmation Layer
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      const token = sessionStorage.getItem("pravaahya_token");
      const res = await fetch(`https://pravaahya.com/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Backend authorization verification exception.");
      
      fetchProducts();
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage <span className="text-green-600">Products</span></h1>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Product</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Price</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Stock</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {products.map((product) => (
                   <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 group-hover:border-green-300 transition-colors">
                               {product.images?.[0] ? (
                                  <img src={resolveImage(product.images[0])} alt={product.name} className="w-8 h-8 object-contain" />
                               ) : (
                                  <div className="w-4 h-4 bg-gray-200 rounded-full" />
                               )}
                            </div>
                            <div>
                               <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                               <p className="text-xs font-medium text-gray-500 line-clamp-1 mt-0.5">{product.description}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5 font-black text-green-700">₹{product.price.toFixed(2)}</td>
                      <td className="px-6 py-5">
                         <span className={`px-3 py-1.5 text-xs font-bold rounded-lg tracking-wide ${product.stock > 0 ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"}`}>
                           {product.stock} Units Live
                         </span>
                      </td>
                      <td className="px-6 py-5 text-right space-x-3">
                         <button onClick={() => handleOpenModal(product)} className="p-2.5 text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-xl transition-colors inline-flex border border-blue-100 shadow-sm hover:shadow-md">
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleDelete(product._id)} className="p-2.5 text-red-600 bg-red-50/50 hover:bg-red-100 rounded-xl transition-colors inline-flex border border-red-100 shadow-sm hover:shadow-md">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {products.length === 0 && (
                <div className="p-16 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Trash2 className="w-8 h-8 text-gray-300" />
                   </div>
                    <p className="text-gray-500 font-medium">No products have been added yet.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* CRUD Overlay Form Matrix */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm shadow-2xl">
           <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">{editingId ? "Edit Product" : "Add New Product"}</h2>
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
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Product Name</label>
                    <input autoFocus type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-inner" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                       <div className="flex gap-2">
                           <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                              {Array.from(new Set([...customCategories, "General"])).map(c => (
                                 <option key={c} value={c}>{c}</option>
                              ))}
                           </select>
                           <button type="button" onClick={() => {
                               const newCat = window.prompt("Enter new category name:");
                               if (newCat && newCat.trim()) {
                                  const formatted = newCat.trim();
                                  setCustomCategories(prev => [...prev, formatted]);
                                  setFormData({...formData, category: formatted});
                               }
                           }} className="px-4 bg-gray-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-2xl whitespace-nowrap transition-colors shadow-sm">
                              Add New
                           </button>
                       </div>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Tags (Comma-separated)</label>
                       <input type="text" placeholder="e.g. Eco, Sustainable, Gift" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Price (₹)</label>
                       <input type="number" step="0.01" required min="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-inner" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Total Stock</label>
                       <input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Product Images (Multi-select)</label>
                    <input type="file" multiple accept="image/*" onChange={e => setImagesData(e.target.files)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                    {editingId && <p className="text-[10px] text-gray-400 mt-1 ml-2 italic">Leave empty to retain existing images.</p>}
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Product Description</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all resize-none shadow-inner"></textarea>
                 </div>
                 <div className="flex items-center gap-3 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                    <input type="checkbox" id="featuredToggle" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 text-green-600 rounded cursor-pointer focus:ring-green-500 border-gray-300" />
                    <div>
                       <label htmlFor="featuredToggle" className="text-sm font-bold text-gray-900 cursor-pointer block">Feature on Home Page</label>
                       <p className="text-[10px] text-gray-500 mt-0.5">Pins this product natively to the main customer hero carousel.</p>
                    </div>
                 </div>

                 <div className="pt-6">
                     <button type="submit" className="w-full border border-green-700 bg-green-600 hover:bg-green-700 text-white rounded-2xl py-4 font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-[0.98]">
                        {editingId ? "Save Changes" : "Create Product"}
                     </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
