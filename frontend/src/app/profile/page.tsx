"use client";
import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token =
    sessionStorage.removeItem("pravaahya_token");
        if (!token) {
           window.location.href = '/login';
           return;
        }
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        
        const profileRes = await fetch(`${baseUrl}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
        if (profileRes.ok) {
           const profileData = await profileRes.json();
           if (profileData.success) {
             setProfile(profileData.data);
             setName(profileData.data.name || '');
             setPhone(profileData.data.phone || '');
           }
        }

        const ordersRes = await fetch(`${baseUrl}/user/orders`, { headers: { Authorization: `Bearer ${token}` } });
        if (ordersRes.ok) {
           const ordersData = await ordersRes.json();
           if (ordersData.success) setOrders(ordersData.data);
        }
      } catch (err) {
        console.error("Async Fetch Error natively swallowed:", err);
      }
    };

    fetchProfileData();
  }, []);

  const updateName = async (e: React.FormEvent) => {
    e.preventDefault();
    const token =
    sessionStorage.removeItem("pravaahya_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, phone: profile.phone })
    });
    const data = await res.json();
    if (!data.success) return alert(data.error || 'Update failed natively');
    setProfile((prev: any) => ({ ...prev, name }));
    setIsEditingName(false);
  };

  const updatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const token =
    sessionStorage.removeItem("pravaahya_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: profile.name, phone })
    });
    const data = await res.json();
    if (!data.success) return alert(data.error || 'Update failed natively');
    setProfile((prev: any) => ({ ...prev, phone }));
    setIsEditingPhone(false);
  };

  const downloadInvoice = async (id: string) => {
    const token =
    sessionStorage.removeItem("pravaahya_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/${id}/invoice`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
       const blob = await res.blob();
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `invoice-${id}.pdf`;
       a.click();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pravaahya_token");
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-24">
      <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl max-w-2xl w-full border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>
        <div className="mb-10 flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-black text-gray-900 mb-2">User Profile</h1>
             <p className="text-gray-500 font-medium text-sm">Manage your secure identity and network history.</p>
           </div>
           <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl transition-colors text-sm">
             Log Out
           </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between mt-4">
             <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Identifier</p>
             <p className="text-gray-900 font-medium">{profile.email || <span className="italic text-gray-400">Not provided</span>}</p>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between group gap-2">
                <div className="flex-1">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Name</p>
                   {!isEditingName ? (
                      <p className="text-gray-900 font-medium">{profile.name || '-'}</p>
                   ) : (
                      <form onSubmit={updateName} className="flex items-center gap-2 mt-1">
                         <input type="text" value={name} onChange={e => setName(e.target.value)} autoFocus className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-gray-900 flex-1 max-w-[250px]" />
                         <button type="submit" className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition">Save</button>
                         <button type="button" onClick={() => setIsEditingName(false)} className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                      </form>
                   )}
                </div>
                {!isEditingName && (
                   <button onClick={() => { setName(profile.name || ''); setIsEditingName(true); }} className="opacity-100 sm:opacity-0 group-hover:opacity-100 self-start sm:self-center shrink-0 flex items-center gap-1 text-xs font-bold text-eco-600 bg-eco-50 hover:bg-eco-100 border border-eco-200 px-2 py-1 rounded-lg transition-all">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                   </button>
                )}
             </div>
             
             <div className="w-full h-px bg-gray-200 my-2"></div>
             
             <div className="flex flex-col sm:flex-row sm:items-center justify-between group gap-2">
                <div className="flex-1">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                   {!isEditingPhone ? (
                      <p className="text-gray-900 font-medium">{profile.phone || '-'}</p>
                   ) : (
                      <form onSubmit={updatePhone} className="flex items-center gap-2 mt-1">
                         <input type="text" value={phone} onChange={e => setPhone(e.target.value)} autoFocus className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-gray-900 flex-1 max-w-[250px]" />
                         <button type="submit" className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition">Save</button>
                         <button type="button" onClick={() => setIsEditingPhone(false)} className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                      </form>
                   )}
                </div>
                {!isEditingPhone && (
                   <button onClick={() => { setPhone(profile.phone || ''); setIsEditingPhone(true); }} className="opacity-100 sm:opacity-0 group-hover:opacity-100 self-start sm:self-center shrink-0 flex items-center gap-1 text-xs font-bold text-eco-600 bg-eco-50 hover:bg-eco-100 border border-eco-200 px-2 py-1 rounded-lg transition-all">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                   </button>
                )}
             </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
          {orders.length === 0 ? (
             <p className="text-sm text-gray-500 italic">No historical transactions mapped to this node yet.</p>
          ) : (
             <div className="space-y-4">
               {orders.map(order => (
                 <div key={order._id} className="bg-white border text-sm border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                      <p className="font-bold text-gray-900 mb-1">Order #{order._id.substring(0, 8).toUpperCase()}</p>
                      <p className="text-gray-500"><span className="font-semibold text-gray-700">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-500">
                         <span className="font-semibold text-gray-700">Status:</span> 
                         <span className={`ml-1 font-bold ${order.status?.toUpperCase() === 'PAID' ? 'text-green-600' : 'text-red-500'}`}>{order.status?.toUpperCase() === 'PENDING' ? 'FAILED' : order.status}</span>
                      </p>
                      <p className="text-gray-500"><span className="font-semibold text-gray-700">Amount:</span> ₹{order.total}</p>
                   </div>
                   {order.status?.toUpperCase() === 'PAID' && (
                     <button onClick={() => downloadInvoice(order._id)} className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">Download Invoice</button>
                   )}
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
