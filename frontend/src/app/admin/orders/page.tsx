"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";

interface AdminOrder {
  _id: string;
  user: {
    name: string;
    phone: string;
    email?: string;
    address?: {
      houseNo: string;
      streetArea: string;
      landmark?: string;
      cityVillage: string;
      district: string;
      state: string;
      country: string;
      pincode: string;
    }
  };
  total: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  statusHistory?: { status: string; timestamp: string }[];
  products: any[];
}

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<AdminOrder | null>(null);

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem("pravaahya_token");
      if (!token) { router.push("/admin/login"); return; }
      
      const res = await fetch("https://pravaahya.com/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) {
         if (res.status === 401 || res.status === 403) {
             sessionStorage.removeItem("pravaahya_token");
             router.push("/admin/login");
             return;
         }
         throw new Error(json.error || "Blocked: Network payload exception natively.");
      }
      setOrders(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [router]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const token = sessionStorage.getItem("pravaahya_token");
      if (!token) { router.push("/admin/login"); return; } // Added token check
      const res = await fetch(`https://pravaahya.com/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, notifyWhatsApp, notifyEmail })
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Validation block dropped dynamically.");

      // Refresh UI structurally via state mapping natively to avoid generic reloads
      setOrders(orders.map(o => o._id === id ? { 
         ...o, 
         status: newStatus, 
         updatedAt: new Date().toISOString(),
         statusHistory: [...(o.statusHistory || []), { status: newStatus, timestamp: new Date().toISOString() }]
      } : o));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return "bg-gray-100 text-gray-700 border-gray-200";
    if (s === "paid") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "processing") return "bg-orange-50 text-orange-700 border-orange-200";
    if (s === "shipped") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "delivered") return "bg-green-100 text-green-800 border-green-300";
    if (s === "cancelled" || s === "failed") return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending" || s === "paid") return <Clock className="w-3.5 h-3.5 bg-transparent" />;
    if (s === "processing") return <Package className="w-3.5 h-3.5 bg-transparent" />;
    if (s === "shipped") return <Truck className="w-3.5 h-3.5 bg-transparent" />;
    if (s === "delivered") return <CheckCircle2 className="w-3.5 h-3.5 bg-transparent" />;
    if (s === "cancelled" || s === "failed") return <XCircle className="w-3.5 h-3.5 bg-transparent" />;
    return <Package className="w-3.5 h-3.5 bg-transparent" />;
  };

  const availableStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Global Database Matrix...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order <span className="text-blue-600">Operations Node</span></h1>
            <p className="text-gray-500 text-sm font-medium mt-2">Manage customer transactions, processing states, and historical deliveries securely.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm">
                <div className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifyEmail ? 'bg-blue-500' : 'bg-gray-200'}`} onClick={() => setNotifyEmail(!notifyEmail)}>
                   <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifyEmail ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-gray-900 tracking-tight leading-none">SMTP Mail</span>
                </div>
             </div>
             
             <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm">
                <div className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifyWhatsApp ? 'bg-green-500' : 'bg-gray-200'}`} onClick={() => setNotifyWhatsApp(!notifyWhatsApp)}>
                   <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifyWhatsApp ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-gray-900 tracking-tight leading-none">WhatsApp</span>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Global Identification</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Target Customer</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase">Amount Extracted</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase text-center">Action Status</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 tracking-widest uppercase text-right">Timestamp</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {orders.map((order) => {
                   const isUnpaid = ["pending", "cancelled", "failed"].includes(order.status.toLowerCase());
                   const displayStatus = isUnpaid ? "cancelled" : order.status;
                   
                   return (
                   <tr key={order._id} className={`hover:bg-gray-50/50 transition-colors group ${isUnpaid ? 'opacity-80' : ''}`}>
                      <td className="px-4 py-5 max-w-[120px]">
                         <p className="font-bold text-gray-900 text-xs break-all leading-tight">{order._id}</p>
                         <p className="text-[10px] text-gray-400 font-medium mt-1">{order.products?.length || 0} Assets Requested</p>
                      </td>
                      <td className="px-6 py-5">
                         <p className="font-bold text-gray-900 line-clamp-1">{order.user?.name || "Anonymous Guest"}</p>
                         <p className="text-xs text-gray-500 font-medium">{order.user?.phone || "No Route Data"}</p>
                         <button 
                             onClick={() => setSelectedOrder(order)} 
                             className="text-xs mt-1 font-bold text-gray-500 hover:text-green-600 transition-colors underline underline-offset-2 decoration-dotted block"
                         >
                             View Full Details
                         </button>
                         {!isUnpaid ? (
                            <div className="flex flex-col gap-2 mt-3 w-max">
                               <a href={`https://pravaahya.com/api/orders/${order._id}/invoice`} target="_blank" rel="noopener noreferrer" className="inline-block text-[10px] text-center font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors">
                                  View Invoice
                               </a>
                               <a href={`https://pravaahya.com/api/orders/${order._id}/invoice?download=true`} className="inline-block text-[10px] text-center font-bold text-green-600 hover:text-green-800 uppercase tracking-widest border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-full transition-colors">
                                  Download Invoice
                               </a>
                            </div>
                         ) : (
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 rounded-full bg-red-50 border border-red-200 px-3 py-1 inline-block w-max">Invoice Unavailable</p>
                         )}
                      </td>
                      <td className={`px-6 py-5 font-black ${isUnpaid ? 'text-red-500' : 'text-green-700'}`}>₹{(order.total || 0).toFixed(2)}</td>
                      <td className="px-6 py-5 text-center">
                         <div className="relative inline-block w-full min-w-[130px]">
                            <select 
                               value={displayStatus} 
                               onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                               disabled={isUnpaid}
                               className={`w-full appearance-none border text-xs font-bold py-2 px-4 pr-8 rounded-full shadow-sm outline-none transition-all uppercase tracking-wider ${isUnpaid ? 'opacity-60 cursor-not-allowed border-red-100' : 'cursor-pointer focus:ring-2 focus:ring-offset-1'} ${getStatusColor(displayStatus)}`}
                            >
                               {availableStatuses
                                   .filter(s => isUnpaid || s !== "cancelled")
                                   .map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                               <svg className="fill-current w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                         </div>
                         <button 
                             onClick={() => setSelectedTrackOrder(order)} 
                             className="mt-2 text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-widest underline underline-offset-2 transition-colors inline-block text-center w-full"
                         >
                             Track Option
                         </button>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Order Initialized</p>
                         <p className="text-sm font-bold text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                         <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                       </td>
                    </tr>
                 )})}
               </tbody>
             </table>
             {orders.length === 0 && (
                <div className="p-16 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-gray-300" />
                   </div>
                   <p className="text-gray-500 font-medium">No order matrices historically discovered within this backend zone.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Customer Detail Modal Overlay */}
      {selectedOrder && (
         <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
               <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-heading font-black text-xl text-gray-900 tracking-tight">Customer Trace</h3>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                     <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
               </div>
               <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Full Name</p>
                        <p className="font-bold text-gray-900 text-sm">{selectedOrder.user?.name || "N/A"}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Contact Route</p>
                        <p className="font-bold text-gray-900 text-sm">{selectedOrder.user?.phone || "N/A"}</p>
                     </div>
                     <div className="col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Endpoint</p>
                        <p className="font-bold text-gray-900 text-sm">{selectedOrder.user?.email || "No Email Provided"}</p>
                     </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Fulfillment Geographic Locale</p>
                     {selectedOrder.user?.address ? (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1 text-sm font-medium text-gray-700">
                           <p><span className="font-bold text-gray-900">House/Flat:</span> {selectedOrder.user.address.houseNo}</p>
                           <p><span className="font-bold text-gray-900">Street/Area:</span> {selectedOrder.user.address.streetArea}</p>
                           {selectedOrder.user.address.landmark && <p><span className="font-bold text-gray-900">Landmark:</span> {selectedOrder.user.address.landmark}</p>}
                           <p>{selectedOrder.user.address.cityVillage}, {selectedOrder.user.address.district}</p>
                           <p>{selectedOrder.user.address.state}, {selectedOrder.user.address.country}</p>
                           <p className="font-black tracking-widest text-eco-700 mt-2">{selectedOrder.user.address.pincode}</p>
                        </div>
                     ) : (
                        <p className="text-sm font-medium text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">No structured address data preserved in payload.</p>
                     )}
                  </div>
               </div>
            </div>
         </div>
      )}

      {selectedTrackOrder && (() => {
         const isTrackUnpaid = ["pending", "cancelled", "failed"].includes(selectedTrackOrder.status.toLowerCase());
         return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all" onClick={() => setSelectedTrackOrder(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                 <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest">Status Lifecycle Log</h2>
                 <p className="text-xs font-mono text-gray-500 mt-1 uppercase max-w-[200px] truncate">{selectedTrackOrder._id}</p>
              </div>
              <button onClick={() => setSelectedTrackOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
               <ul className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {/* Origin Block */}
                  <li className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isTrackUnpaid ? 'bg-red-50 text-red-500 shadow-red-100' : 'bg-green-100/50 text-green-500 shadow-green-200'}`}>
                       {isTrackUnpaid ? <XCircle className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                       <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold text-sm uppercase tracking-wider ${isTrackUnpaid ? 'text-red-500' : 'text-gray-900'}`}>
                             {isTrackUnpaid ? 'Not Paid (Origin)' : 'Payment Completed (Origin)'}
                          </span>
                       </div>
                       <time className="block text-xs font-medium text-gray-500 mt-2">{new Date(selectedTrackOrder.createdAt).toLocaleString()}</time>
                    </div>
                  </li>
                  
                  {/* Map Historic Branches organically */}
                  {selectedTrackOrder.statusHistory?.map((log, index) => (
                    <li key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-50 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-blue-400">
                         <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900 text-sm uppercase tracking-wider">{log.status}</span>
                         </div>
                         <time className="block text-xs font-medium text-gray-500 mt-2">{new Date(log.timestamp).toLocaleString()}</time>
                      </div>
                    </li>
                  ))}
                  
                  {(!selectedTrackOrder.statusHistory || selectedTrackOrder.statusHistory.length === 0) && (
                     <div className="text-center p-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 rounded-lg">No modifications tracked post-origin.</div>
                  )}
               </ul>
            </div>
            
            <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-100 flex justify-end">
               <button onClick={() => setSelectedTrackOrder(null)} className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow transition-colors w-full">Close Log Tracker</button>
            </div>
          </div>
        </div>
      )})()}
    </div>
  );
}
