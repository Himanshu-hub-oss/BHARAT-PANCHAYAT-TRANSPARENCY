import React from "react";
import { motion } from "framer-motion";
import { MdWork, MdReport, MdCheckCircle } from "react-icons/md";

export default function OfficerDashboard({ stats }) {
  const cards = [
    {
      label: "Gross Projects",
      sub: "कुल परियोजनाएं",
      val: stats?.total_projects || 0,
      icon: <MdWork />,
      color: "from-teal-600 to-emerald-500 shadow-teal-500/20"
    },
    {
      label: "Active Issues",
      sub: "शिकायतें",
      val: stats?.complaints || 0,
      icon: <MdReport />,
      color: "from-rose-600 to-pink-500 shadow-rose-500/20"
    },
    {
      label: "Deliverables",
      sub: "पूर्ण",
      val: stats?.completed_projects || 0,
      icon: <MdCheckCircle />,
      color: "from-indigo-400 to-blue-500 shadow-indigo-400/20"
    },
  ];

  return (
    <div className="py-2 px-4">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Regional Statistics</h2>
        <div className="h-1.5 w-16 bg-gradient-to-r from-teal-500 to-indigo-600 mt-4 rounded-full shadow-lg"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((c, idx) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative"
          >
            <div className="relative z-10 p-8 bg-white/40 backdrop-blur-2xl rounded-[48px] border border-white shadow-2xl overflow-hidden group transition-all">
              <div className="flex justify-between items-start mb-10">
                <div className={`${c.color} text-white p-5 rounded-3xl text-3xl shadow-xl shadow-current/20 group-hover:rotate-12 transition-transform duration-500`}>
                  {c.icon}
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-gray-900 tracking-tighter drop-shadow-sm">{c.val}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Analytics</div>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] leading-none mb-1">
                  {c.label}
                </span>
                <span className="text-[12px] font-black text-teal-600 uppercase tracking-widest">
                  {c.sub}
                </span>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundColor: c.color.includes('teal') ? '#14b8a6' : c.color.includes('rose') ? '#e11d48' : '#6366f1' }}>
              </div>

              {/* Decorative Subtle Background Text */}
              <div className="absolute -top-10 -left-10 text-8xl font-black text-black/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
                {c.label.charAt(0)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
