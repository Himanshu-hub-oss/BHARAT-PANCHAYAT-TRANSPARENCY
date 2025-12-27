import React from "react";
import { motion } from "framer-motion";
import { MdDashboard, MdWork, MdReport, MdLogout, MdPeople, MdHistory } from "react-icons/md";

export default function Sidebar({ current, setCurrent, setRole }) {
  const menu = [
    { key: "dashboard", label: "Overview", sub: "डैशबोर्ड", icon: <MdDashboard /> },
    { key: "projects", label: "Projects", sub: "परियोजनाएं", icon: <MdWork /> },
    { key: "complaints", label: "Complaints", sub: "शिकायतें", icon: <MdReport /> },
    { key: "updates", label: "Work Logs", sub: "अपडेट्स", icon: <MdHistory /> },
    { key: "contractors", label: "Registry", sub: "ठेकेदार", icon: <MdPeople /> },
  ];

  return (
    <div className="w-80 min-h-screen relative overflow-hidden flex flex-col p-8 z-20">
      {/* Glassmorphism Background - Light Ivory Glass */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl border-r border-white/20 shadow-2xl"></div>

      {/* Profile/Branding Section */}
      <div className="relative mb-14 mt-4 px-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-5"
        >
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-3xl shadow-xl shadow-teal-500/20 border border-white/20 transition-transform hover:scale-110">
            <MdWork />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Rural Admin</p>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-tight">Officer Panel</h2>
          </div>
        </motion.div>
      </div>

      <nav className="relative flex-1 space-y-4">
        {menu.map((m, idx) => (
          <motion.button
            key={m.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 8, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className={`w-full group flex items-center gap-5 px-6 py-5 rounded-[2.5rem] transition-all duration-300 relative
              ${current === m.key
                ? "bg-white/20 text-gray-900 shadow-2xl shadow-black/20 border border-white/20"
                : "text-gray-500 hover:text-gray-900 hover:bg-white/5"}`}
            onClick={() => setCurrent(m.key)}
          >
            {current === m.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 w-2.5 h-10 bg-teal-500 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.6)]"
              />
            )}

            <span className={`text-3xl transition-all duration-300 group-hover:scale-110 ${current === m.key ? "text-teal-600 drop-shadow-[0_0_10px_rgba(20,184,166,0.2)]" : "text-gray-400"}`}>
              {m.icon}
            </span>

            <div className="flex flex-col items-start leading-none">
              <span className={`font-black text-[13px] uppercase tracking-widest transition-colors ${current === m.key ? "text-gray-900" : "text-gray-500"}`}>{m.label}</span>
              <span className={`text-[12px] mt-1.5 font-black transition-opacity ${current === m.key ? "text-teal-600" : "opacity-30 text-gray-500"}`}>
                {m.sub}
              </span>
            </div>
          </motion.button>
        ))}
      </nav>

      <div className="relative pt-8 border-t border-white/10">
        <button
          onClick={() => setRole(null)}
          className="mt-auto relative z-10 w-full py-5 bg-black/5 hover:bg-rose-600 hover:text-white text-gray-900 rounded-[28px] font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 border border-black/5 shadow-inner"
        >
          <MdLogout className="text-xl" />
          Terminate Session
        </button>

        <div className="mt-8 text-center">
          <div className="text-[11px] text-gray-400 font-black tracking-[0.4em] uppercase">Auth v2.0.4</div>
        </div>
      </div>
    </div>
  );
}
