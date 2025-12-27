import React from "react";
import { motion } from "framer-motion";
import { FaProjectDiagram } from "react-icons/fa";

export default function ProjectList({ projects, onSelect }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white/30 backdrop-blur-md p-10 rounded-[40px] border border-white/40 text-center">
        <p className="text-gray-500 font-bold tracking-widest uppercase italic">No active initiatives found for this location.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Initiative Ledger</h2>
        <div className="h-1 flex-1 bg-black/5 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(p.id)}
            className="group cursor-pointer p-8 bg-white/40 hover:bg-white/80 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-xl transition-all flex flex-col justify-between h-full relative overflow-hidden"
          >
            {/* Decorative background flare */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white/50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
                  <FaProjectDiagram className="text-xl" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg ${p.status === 'completed' ? 'bg-emerald-500 text-white' :
                  p.status === 'delayed' ? 'bg-rose-500 text-white' :
                    'bg-indigo-500 text-white'
                  }`}>
                  {p.status}
                </span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-[1.1] uppercase tracking-tighter mb-2">
                {p.name}
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">{p.contractor?.name || "Independent"}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center text-xs font-black tracking-widest text-gray-400 group-hover:text-indigo-600">
              <span>PROJECT DOSSIER</span>
              <span className="text-lg group-hover:translate-x-3 transition-transform">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
