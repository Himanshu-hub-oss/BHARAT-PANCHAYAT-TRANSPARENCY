import React, { useState, useEffect, useCallback } from "react";
import LocationSelector from "./components/LocationSelector";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./components/ProjectDetail";
import Dashboard from "./components/Dashboard";
import OfficerPanel from "./components/OfficerPanel";
import ContractorPanel from "./components/ContractorPanel";
import PinVerification from "./components/PinVerification";
import { fetchProjectsByVillage } from "./api";
import { motion } from "framer-motion";

export default function App() {
  const [role, setRole] = useState(null);
  const [villageId, setVillageId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleVillageSelect = useCallback(async (id) => {
    if (!id) {
      setVillageId(null);
      setProjects([]);
      setSelectedProjectId(null);
      return;
    }
    setVillageId(id);
    setSelectedProjectId(null);
    try {
      const data = await fetchProjectsByVillage(id);
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      setTimeout(() => {
        document
          .getElementById("project-detail")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [selectedProjectId]);

  // Officer PIN Verification Screen
  if (role === "officer-auth") {
    return (
      <PinVerification
        onSuccess={() => setRole("officer")}
        onBack={() => setRole(null)}
      />
    );
  }

  // Officer Panel Screen
  if (role === "officer") return <OfficerPanel setRole={setRole} />;

  // Contractor Panel Screen
  if (role === "contractor") return <ContractorPanel setRole={setRole} />;

  // Role Selection Screen
  if (!role) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
        {/* Immersive Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url('/hero_image.jpg')` }}
        >
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-4xl px-4 py-12 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl tracking-tight mb-2">
              BHARAT PANCHAYAT
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium tracking-widest uppercase">
              Transparency & Development Portal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { id: "citizen", label: "Citizen", sub: "View projects & share feedback", icon: "👥", color: "from-blue-600 to-blue-800", shadow: "shadow-blue-500/40" },
              { id: "officer-auth", label: "Officer", sub: "Manage projects & complaints", icon: "👮", color: "from-emerald-600 to-emerald-800", shadow: "shadow-emerald-500/40" },
              { id: "contractor", label: "Contractor", sub: "Submit updates & project status", icon: "👷", color: "from-orange-600 to-orange-800", shadow: "shadow-orange-500/40" }
            ].map((r, idx) => (
              <motion.button
                key={r.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1, type: "spring", stiffness: 300 }}
                onClick={() => setRole(r.id)}
                className={`relative group bg-gradient-to-br ${r.color} p-8 rounded-3xl ${r.shadow} shadow-2xl flex flex-col items-center gap-4 transition-all overflow-hidden border border-white/20`}
              >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

                <span className="text-6xl group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">
                  {r.icon}
                </span>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">{r.label}</h2>
                  <p className="text-sm text-white/80 font-medium leading-tight">{r.sub}</p>
                </div>

                <div className="mt-4 bg-white/20 px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Get Started →
                </div>
              </motion.button>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-white/60 text-sm font-medium italic"
          >
            Digitalizing Rural Governance for a Better Tomorrow
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Citizen Dashboard
  return (
    <div className="relative min-h-screen font-sans">
      {/* Immersive Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url('/tree_bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[4px]"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRole(null)}
          className="mb-6 bg-white/40 backdrop-blur-md text-gray-800 px-6 py-2 rounded-full font-bold shadow-lg border border-white/40 flex items-center gap-2 hover:bg-white/60 transition-all"
        >
          ← EXIT PORTAL
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/30 backdrop-blur-xl rounded-[40px] border border-white/50 p-6 md:p-10 shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Citizen Dashboard</h1>
              <p className="text-gray-600 font-medium mt-1">Village Progress & Transparency</p>
            </div>

            <div className="w-full md:w-auto min-w-[300px]">
              <LocationSelector onVillageSelected={handleVillageSelect} />
            </div>
          </div>

          {!villageId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-indigo-50/50 animate-pulse">
                <span className="text-4xl">📍</span>
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-2">Location Required</h2>
              <p className="text-gray-500 font-medium max-w-sm">Please select a State, District, Block, and Village to unlock the dashboard analytics and project records.</p>
            </motion.div>
          )}

          {villageId && (
            <div className="space-y-12">
              <Dashboard villageId={villageId} />

              {projects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-10 border-t border-black/5"
                >
                  <ProjectList projects={projects} onSelect={setSelectedProjectId} />
                </motion.div>
              )}
            </div>
          )}

          {selectedProjectId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 pt-12 border-t border-black/5"
              id="project-detail"
            >
              <ProjectDetail key={selectedProjectId} projectId={selectedProjectId} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
