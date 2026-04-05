"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { LowStockAlert } from "@/components/admin/LowStockAlert";
import { getApiUrl } from "@/lib/api";

// Bootstrap Chart configuration strictly preventing dynamic render drops
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("pravaahya_token"); // Sync with main auth storage natively
    if (!token) {
        router.push("/admin/login");
        return;
    }

    // Fetch analytical aggregates uniquely mapping to authenticated headers securely
    fetch(getApiUrl("/admin/insights"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
           if (res.status === 401 || res.status === 403) {
               sessionStorage.removeItem("pravaahya_token");
               router.push("/admin/login");
               return null;
           }
           let msg = "Network exception.";
           try { const errorData = await res.json(); msg = errorData.error || msg; } catch(e){}
           setError(msg);
           return null;
        }
        return res.json();
      })
      .then((json) => {
          if (json?.data) {
              setData(json.data);
          }
      })
      .catch((err) => {
          console.error(err);
          setError(err.message);
      });
  }, [router]);

  if (error) {
     return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
           <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-4 border-red-500">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-8 font-medium">{error}</p>
              <button onClick={() => router.push("/")} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">Return to Home</button>
           </div>
        </div>
     );
  }

  if (!data) {
     return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 space-y-4">
           <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Decrypting Secure Insights</p>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Admin Header Grid Overlay */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
           <h1 className="font-heading font-black text-xl text-gray-900 tracking-tight">Admin<span className="text-green-600">Core</span></h1>
           <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live</span>
           </div>
        </div>
      </header>
      
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Inject Low Stock Network Matrix */}
        {(typeof window !== 'undefined' && sessionStorage.getItem("pravaahya_token")) && (
           <LowStockAlert token={sessionStorage.getItem("pravaahya_token") || ""} />
        )}
      
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Business Intelligence</h2>

        {/* Aggregation Metric Matrices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Total Orders" value={data.totalOrders.toLocaleString()} color="text-blue-600" />
          <MetricCard title="Total Revenue" value={`₹${data.totalRevenue.toLocaleString()}`} color="text-green-600" />
          <MetricCard title="Total Accounts" value={data.totalUsers.toLocaleString()} color="text-purple-600" />
        </div>

        {/* Chart Dynamic Arrays */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Monthly Revenue Projections</h3>
            <div className="flex-1 w-full relative">
              <Line
                options={{ responsive: true, maintainAspectRatio: false }}
                className="absolute inset-0"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  datasets: [
                    {
                      label: "Revenue (₹)",
                      data: data.monthlyRevenue,
                      borderColor: "#16a34a",
                      backgroundColor: "rgba(22, 163, 74, 0.1)",
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Monthly Order Volume</h3>
            <div className="flex-1 w-full relative">
              <Bar
                options={{ responsive: true, maintainAspectRatio: false }}
                className="absolute inset-0"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  datasets: [
                    {
                      label: "Orders",
                      data: data.monthlyOrders,
                      backgroundColor: "#2563eb",
                      borderRadius: 4,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h4>
      <p className={`text-4xl font-black mt-3 ${color} tracking-tight`}>{value}</p>
    </div>
  );
}
