"use client";
import React, { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("pravaahya_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if(data.success) setUsers(data.data);
      });
  }, []);

  const viewDetails = async (id: string) => {
    const token = sessionStorage.getItem("pravaahya_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if(data.success) setSelectedUser(data.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 pt-24">
       <div className="max-w-6xl w-full bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>
          <h1 className="text-2xl font-black text-gray-900 mb-8">Admin User Management</h1>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-500">
               <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-200">
                 <tr>
                   <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                   <th className="px-6 py-4 font-bold tracking-wider">Name</th>
                   <th className="px-6 py-4 font-bold tracking-wider">Phone</th>
                   <th className="px-6 py-4 font-bold tracking-wider">Total Orders</th>
                   <th className="px-6 py-4 font-bold tracking-wider">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {users.map(u => (
                   <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 font-medium text-gray-900">{u.email}</td>
                     <td className="px-6 py-4">{u.name || '-'}</td>
                     <td className="px-6 py-4">{u.phone || '-'}</td>
                     <td className="px-6 py-4 font-bold">{u.totalOrders}</td>
                     <td className="px-6 py-4">
                        <button onClick={() => viewDetails(u._id)} className="text-xs font-bold bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-900">View Details</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>

          {selectedUser && (
            <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-black text-gray-900 mb-4 border-b border-gray-200 pb-2">User: {selectedUser.user.email}</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Name</p>
                    <p className="text-gray-900 font-medium">{selectedUser.user.name || '-'}</p>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-gray-900 font-medium">{selectedUser.user.phone || '-'}</p>
                 </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-4">Historical Orders</h3>
              {selectedUser.orders.length === 0 ? (
                 <p className="text-sm text-gray-500 italic">No transactions recorded.</p>
              ) : (
                 <div className="space-y-3">
                   {selectedUser.orders.map((o: any) => (
                     <div key={o._id} className="bg-white border text-sm border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <p className="font-bold text-gray-900">Order #{o._id.substring(0, 8).toUpperCase()}</p>
                       <p className="text-gray-500 font-medium">Total: ₹{o.total}</p>
                       <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Status: {o.status}</p>
                     </div>
                   ))}
                 </div>
              )}
            </div>
          )}
       </div>
    </div>
  );
}
