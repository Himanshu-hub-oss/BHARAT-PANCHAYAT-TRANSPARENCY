import React, { useEffect, useState } from "react";
import { fetchVillageDashboard } from "../api";
import StatusPie from "./charts/StatusPie";
import BudgetBar from "./charts/BudgetBar";
import ProgressLine from "./charts/ProgressLine";
import { motion } from "framer-motion";
import {
  FaChartPie,
  FaCheckCircle,
  FaTools,
  FaClock,
  FaPercentage,
  FaWallet,
  FaCoins,
  FaProjectDiagram
} from "react-icons/fa";

export default function Dashboard({ villageId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDash = async () => {
      if (!villageId) return;
      setLoading(true);
      try {
        const res = await fetchVillageDashboard(villageId);
        setData(res);
      } catch (err) {
        console.error("📌 Dashboard fetch error:", err);
      }
      setLoading(false);
    };
    loadDash();
  }, [villageId]);

  if (!villageId) return null;
  if (loading) return (
    <div className="flex flex-col items-center py-20 animate-pulse">
      <div className="w-16 h-16 bg-white/20 rounded-full mb-4 ring-4 ring-white/10"></div>
      <div className="text-gray-500 font-bold tracking-widest uppercase text-xs">Fetching Analytics...</div>
    </div>
  );
  if (!data) return <div className="text-red-500 bg-white/50 backdrop-blur-md p-8 rounded-[32px] border border-red-200 shadow-xl">⚠️ Failed to load analytics. Please refresh.</div>;

  const list = data?.project_list || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      {/* Analytics Summary - Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={data.total_projects} icon={<FaProjectDiagram />} color="bg-indigo-600" />
        <StatCard title="Completed" value={data.completed_projects} icon={<FaCheckCircle />} color="bg-emerald-600" />
        <StatCard title="Ongoing" value={data.ongoing_projects} icon={<FaTools />} color="bg-sky-600" />
        <StatCard title="Delayed" value={data.delayed_projects} icon={<FaClock />} color="bg-rose-600" />
        <StatCard title="Avg Progress" value={`${data.avg_progress}%`} icon={<FaPercentage />} color="bg-amber-600" />
        <StatCard title="Total Budget" value={`₹${data.total_budget?.toLocaleString()}`} icon={<FaWallet />} color="bg-teal-600" />
        <StatCard title="Total Spent" value={`₹${data.total_spent?.toLocaleString()}`} icon={<FaCoins />} color="bg-fuchsia-600" />
      </div>

      {/* CHARTS SECTION - Advanced & Glassy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="p-8 bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-2xl h-[450px] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><FaChartPie /></div>
            <h3 className="font-black uppercase tracking-tighter text-gray-800">Status Mix</h3>
          </div>
          <div className="flex-1 min-h-0">
            <StatusPie
              completed={data.completed_projects}
              ongoing={data.ongoing_projects}
              delayed={data.delayed_projects}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-2 p-8 bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-2xl h-[450px] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><FaWallet /></div>
            <h3 className="font-black uppercase tracking-tighter text-gray-800">Financial Utilization</h3>
          </div>
          <div className="flex-1 min-h-0">
            <BudgetBar projects={list} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-3 p-8 bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-2xl h-[450px] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><FaTools /></div>
            <h3 className="font-black uppercase tracking-tighter text-gray-800">Progress Vector Analytics</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ProgressLine timeline={list} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-7 bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-2xl overflow-hidden group transition-all"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700 blur-3xl`}></div>
      <div className="flex items-center gap-5 relative z-10">
        <div className={`${color} text-white p-5 rounded-[28px] text-2xl shadow-xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</div>
          <div className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}
