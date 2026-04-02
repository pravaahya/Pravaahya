"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, LayoutDashboard, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { resolveImage } from "@/lib/image-utils";

interface Collection {
  _id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

export default function AdminCollections() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [imageData, setImageData] = useState<File | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("pravaahya_token");
      if (!token) { router.push("/admin/login"); return; }
      
      const [colRes, prodRes] = await Promise.all([
         fetch("https://pravaahya.com/api/collections", { headers: { Authorization: `Bearer ${token}` } }),
         fetch("https://pravaahya.com/api/products", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const colJson = await colRes.json();
      const prodJson = await prodRes.json();
      
      if (!colRes.ok && (colRes.status === 401 || colRes.status === 403)) {
         sessionStorage.removeItem("pravaahya_token");
         router.push("/admin/login");
         return;
      }
      
      if (colJson.success) setCollections(colJson.data);
      if (prodJson.success) setProducts(prodJson.data);
    } catch (err) {
      toast.error("Network disconnect structurally accessing analytical arrays.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [router]);

  const openForm = (collection?: Collection) => {
    setFormError("");
    if (collection) {
      setEditingId(collection._id);
      setFormData({ name: collection.name, description: collection.description || "" });
      setSelectedProducts(collection.products.map(p => p._id || (p as any).id));
      setImageData(null);
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "" });
      setSelectedProducts([]);
      setImageData(null);
    }
    setIsModalOpen(true);
  };

  const toggleProduct = (pid: string) => {
     if (selectedProducts.includes(pid)) {
         setSelectedProducts(selectedProducts.filter(id => id !== pid));
     } else {
         setSelectedProducts([...selectedProducts, pid]);
     }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name) {
      setFormError("Collection name is strictly unconditionally mandatory.");
      return;
    }

    try {
      const token = sessionStorage.getItem("pravaahya_token");
      const url = editingId 
        ? `https://pravaahya.com/api/collections/${editingId}`
        : "https://pravaahya.com/api/collections";
      const method = editingId ? "PUT" : "POST";

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("products", JSON.stringify(selectedProducts)); // Arrays sent natively as strings
      
      if (imageData) payload.append("image", imageData);

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Mutation rejected organically by server.");
      
      setIsModalOpen(false);
      fetchData();
      toast.success(editingId ? "Matrix Configuration updated!" : "New Collection deployed organically!");
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this collection? This action cannot be undone.")) return;
    try {
      const token = sessionStorage.getItem("pravaahya_token");
      const res = await fetch(`https://pravaahya.com/api/collections/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Backend server structurally declined operations.");
      toast.success("Collection safely destroyed.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return <div className="h-full flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" /><p className="font-bold text-gray-500 tracking-wider">Resolving Collection Arrays...</p></div>;
  }

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto flex flex-col min-h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-200 pb-8">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200/50 text-gray-900 shrink-0">
               <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-3xl font-heading font-black tracking-tight text-gray-900">Manage <span className="text-green-600">Collections</span></h1>
               <p className="font-medium text-gray-500 mt-1">Group products into custom curated collections.</p>
            </div>
         </div>
         <Button onClick={() => openForm()} className="h-12 px-8 rounded-full font-bold shadow-md shadow-green-600/20 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all text-white flex shrink-0 whitespace-nowrap overflow-hidden z-10">
            <Plus className="w-5 h-5 mr-2 stroke-[3]" /> Create Collection
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.length === 0 ? (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 drop-shadow-sm"><LayoutDashboard className="w-10 h-10" /></div>
             <p className="text-gray-500 font-bold max-w-sm">No collections have been created yet.</p>
          </div>
        ) : (
          collections.map((col) => (
              <div key={col._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative group hover:shadow-xl hover:shadow-gray-200/40 transition-all hover:-translate-y-1">
                 <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                    {col.image ? (
                      <img src={resolveImage(col.image)} alt={col.name} className="w-full h-full object-cover" />
                    ) : (
                      <LayoutDashboard className="w-10 h-10 text-gray-300" />
                    )}
                 </div>
                 <div>
                    <h3 className="text-xl font-black font-heading text-gray-900 tracking-tight leading-tight line-clamp-1 truncate">{col.name}</h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full tracking-widest mt-2 inline-block border border-gray-200 uppercase">{col.products.length} {col.products.length === 1 ? 'Product' : 'Products'}</span>
                 </div>
                 <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-50">
                     <button onClick={() => openForm(col)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 flex-1 justify-center border border-transparent hover:border-blue-100">
                        <Pencil className="w-4 h-4" /> <span className="text-[11px] font-bold uppercase tracking-wider">Edit</span>
                     </button>
                     <button onClick={() => handleDelete(col._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 flex-1 justify-center border border-transparent hover:border-red-100">
                        <Trash2 className="w-4 h-4" /> <span className="text-[11px] font-bold uppercase tracking-wider">Delete</span>
                     </button>
                 </div>
              </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-4xl w-full relative z-10 flex flex-col md:flex-row shadow-gray-900/20 max-h-[90vh]">
               <div className="w-full md:w-1/3 bg-gray-50 p-8 flex flex-col border-r border-gray-100 shrink-0">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-900 mb-6 border border-gray-100">
                     {editingId ? <Pencil className="w-8 h-8" /> : <Plus className="w-8 h-8 stroke-[3]" />}
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-gray-900 font-heading mb-2 leading-tight">
                     {editingId ? "Edit Collection" : "Create Collection"}
                  </h2>
               </div>
               
               <div className="w-full md:w-2/3 p-8 md:p-10 flex-col flex overflow-y-auto">
                 {formError && (
                   <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100">
                      <p className="text-xs font-bold uppercase tracking-widest mb-1 text-red-400">Structural Exception Detected</p>
                      <p className="text-sm font-medium">{formError}</p>
                   </div>
                 )}
                 <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Collection Name</label>
                          <input type="text" required placeholder="Summer Essentials" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-inner" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Collection Image (Optional)</label>
                          <input type="file" accept="image/*" onChange={e => { if (e.target.files) setImageData(e.target.files[0]) }} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                       </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                        <textarea placeholder="The best organic..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all min-h-[100px] resize-none shadow-inner" />
                     </div>

                     <div className="border-t border-gray-100 pt-6">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">Attach Products</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {products.map(p => (
                             <div 
                               key={(p as any)._id} 
                               onClick={() => toggleProduct((p as any)._id)}
                               className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedProducts.includes((p as any)._id) ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                             >
                               <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mr-4 transition-colors ${selectedProducts.includes((p as any)._id) ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                  {selectedProducts.includes((p as any)._id) && (
                                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                     </svg>
                                  )}
                               </div>
                               <div className="min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate block">{p.name}</p>
                                  <p className="text-xs font-medium text-gray-500 block truncate">₹{p.price.toFixed(2)}</p>
                               </div>
                             </div>
                           ))}
                           {products.length === 0 && <p className="text-gray-400 text-sm font-bold bg-gray-50 py-8 text-center rounded-2xl col-span-2">No products available.</p>}
                        </div>
                     </div>

                     <div className="flex gap-4 mt-auto pt-6 justify-end">
                       <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-full px-8 text-sm font-bold hover:bg-gray-100">Cancel</Button>
                       <Button type="submit" className="rounded-full px-10 text-sm font-bold bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20">{editingId ? 'Save Changes' : 'Create Collection'}</Button>
                     </div>
                 </form>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
