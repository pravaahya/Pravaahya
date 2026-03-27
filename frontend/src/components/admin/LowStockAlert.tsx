"use client";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function LowStockAlert({ token }: { token: string }) {
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;
        fetch("http://127.0.0.1:5000/api/products/stocks/low", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error("Invalid Route");
            return res.json();
        })
        .then(json => {
            if (json.success && json.data.length > 0) {
                setAlerts(json.data);
            }
        })
        .catch(console.error);
    }, [token]);

    if (alerts.length === 0) return null;

    return (
        <div className="bg-red-50 border-l-[6px] border-red-500 rounded-2xl p-6 shadow-sm mb-8 relative overflow-hidden transition-all duration-500 group hover:shadow-red-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
            <div className="flex items-start">
               <div className="bg-red-100 p-2 rounded-full mr-4 flex-shrink-0 animate-pulse">
                  <AlertCircle className="w-6 h-6 text-red-600" />
               </div>
               <div className="flex-1">
                  <h3 className="text-base font-black text-red-900 uppercase tracking-widest mb-1.5 shadow-xs">Critical Network Depletion Alert</h3>
                  <p className="text-sm text-red-700 font-medium mb-5">The following parameters reached structurally designated lower boundaries requiring immediate supply-chain interaction:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                     {alerts.map(item => (
                         <li key={item._id} className="text-xs font-bold text-red-900 bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-red-100/50 hover:border-red-200 transition-colors">
                            <span className="truncate mr-4 text-gray-800">{item.name}</span>
                            <span className="bg-red-50 text-red-600 font-black px-2.5 py-1 rounded-lg border border-red-100 min-w-max uppercase tracking-wider shadow-inner">
                               Stock: {item.stock} / {item.lowStockThreshold}
                            </span>
                         </li>
                     ))}
                  </ul>
               </div>
            </div>
        </div>
    );
}
