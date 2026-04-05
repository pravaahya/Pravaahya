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
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getApiUrl } from "@/lib/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function AdminAnalytics() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("pravaahya_token");
    if (!token) { router.push("/admin/login"); return; }

    fetch(getApiUrl("/analytics/summary"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Authentication failed retrieving structural analytics bounds.");
        return res.json();
      })
      .then((json) => setData(json.data))
      .catch((err) => setError(err.message));
  }, [router]);

  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
  if (!data) return <div className="p-8 text-center text-gray-500 font-bold tracking-widest text-xs uppercase">Decrypting Performance Tracking Matrix...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 border-b border-gray-200">
         <h1 className="text-3xl font-black text-gray-900 tracking-tight">Growth <span className="text-blue-600">Analytics</span></h1>
         <p className="text-gray-500 font-medium text-sm mt-2">Monitor active visitor pathways mapping directly to organic conversion variables natively.</p>
      </div>

      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Total Platform Contexts" value={data.totalVisits.toLocaleString()} color="text-indigo-600" />
          <MetricCard title="Completed Transactions" value={data.totalConversions.toLocaleString()} color="text-green-600" />
          <MetricCard title="Aggregate Effectiveness Rate" value={`${data.conversionRate}%`} color="text-amber-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-96">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Traffic Matrices</h3>
            <div className="flex-1 w-full relative">
                <Line
                options={{ responsive: true, maintainAspectRatio: false }}
                className="absolute inset-0"
                data={{
                    labels: data.daily.map((d: any) => new Date(d.date).toLocaleDateString()),
                    datasets: [{
                    label: "Raw Navigations",
                    data: data.daily.map((d: any) => d.visits),
                    borderColor: "#4f46e5",
                    backgroundColor: "rgba(79, 70, 229, 0.1)",
                    fill: true,
                    tension: 0.4
                    }],
                }}
                />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-96">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Terminal Success Matrix</h3>
            <div className="flex-1 w-full relative">
                <Line
                options={{ responsive: true, maintainAspectRatio: false }}
                className="absolute inset-0"
                data={{
                    labels: data.daily.map((d: any) => new Date(d.date).toLocaleDateString()),
                    datasets: [{
                    label: "Verified Operations",
                    data: data.daily.map((d: any) => d.conversions),
                    borderColor: "#16a34a",
                    backgroundColor: "rgba(22, 163, 74, 0.1)",
                    fill: true,
                    tension: 0.4
                    }],
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
