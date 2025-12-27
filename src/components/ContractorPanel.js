import React, { useState, useEffect } from "react";
import { fetchContractors, fetchContractorProjects, submitContractorUpdate, verifyContractorPin } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { FaHardHat, FaCamera, FaFileInvoiceDollar } from "react-icons/fa";

export default function ContractorPanel({ setRole }) {
    const [contractorId, setContractorId] = useState(null);
    const [contractors, setContractors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const [tempPin, setTempPin] = useState("");

    // Load contractors for simulated login
    useEffect(() => {
        fetchContractors().then((res) => setContractors(res || []));
    }, []);

    // Load projects when contractor is selected
    useEffect(() => {
        if (!contractorId) return;
        fetchContractorProjects(contractorId).then((res) => setProjects(res || []));
    }, [contractorId]);

    const handleLogin = async () => {
        if (!tempId) return alert("Select Name");
        const res = await verifyContractorPin(tempId, tempPin);
        if (res.success) {
            setContractorId(tempId);
        } else {
            alert("Invalid PIN");
        }
    };

    // Using a temp state for selection before verifying PIN
    const [tempId, setTempId] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const selectedContractor = contractors.find(c => c.id == tempId);

    if (!contractorId) {
        return (
            <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden p-6">
                {/* Immersive Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] scale-110"
                    style={{ backgroundImage: `url('/hero_image.jpg')` }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative z-10 w-full max-w-md px-6"
                >
                    <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[48px] border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center">

                        {/* Header Icon */}
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-2xl bg-orange-600 text-white"
                        >
                            <FaHardHat />
                        </motion.div>

                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Contractor Login</h2>
                        <p className="text-white/60 font-medium mb-10 text-center text-sm leading-relaxed">
                            Authorized personnel only. Please select your name and enter security PIN.
                        </p>

                        <div className="w-full space-y-6">
                            {/* Custom Premium Dropdown */}
                            <div className="relative">
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full bg-white/5 border-2 border-white/10 hover:border-white/30 p-4 rounded-2xl text-lg text-white cursor-pointer flex justify-between items-center transition-all font-bold"
                                >
                                    <span className={selectedContractor ? "text-white" : "text-white/40"}>
                                        {selectedContractor ? selectedContractor.name : "Select Your Name"}
                                    </span>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        className="text-white/40"
                                    >
                                        ▼
                                    </motion.span>
                                </motion.div>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 5, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute top-full left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl mt-2"
                                        >
                                            <div className="max-h-60 overflow-y-auto py-2">
                                                {contractors.length === 0 && (
                                                    <div className="px-4 py-3 text-white/40 text-center text-sm">No contractors found</div>
                                                )}
                                                {contractors.map(c => (
                                                    <motion.div
                                                        key={c.id}
                                                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                                        onClick={() => {
                                                            setTempId(c.id);
                                                            setIsOpen(false);
                                                        }}
                                                        className="px-6 py-4 text-white font-bold cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                                    >
                                                        {c.name}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative group">
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border-2 border-white/10 group-hover:border-white/30 p-4 rounded-2xl text-center text-3xl tracking-[0.5em] text-white focus:outline-none focus:border-orange-500/50 transition-all font-black placeholder:text-white/10 placeholder:tracking-normal placeholder:text-sm"
                                    placeholder="••••"
                                    value={tempPin}
                                    onChange={(e) => setTempPin(e.target.value)}
                                    maxLength={4}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05, x: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setRole(null)}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white/80 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all border border-white/5"
                                >
                                    ← Back
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogin}
                                    className="flex-[1.5] py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg bg-orange-600 text-white shadow-orange-500/20 hover:bg-orange-700"
                                >
                                    Access Panel
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="mt-10 flex justify-center items-center gap-2 opacity-30 grayscale">
                        <div className="w-8 h-[2px] bg-white rounded-full"></div>
                        <div className="text-[10px] text-white font-black tracking-[0.3em] uppercase">Rural Auth v2.0</div>
                        <div className="w-8 h-[2px] bg-white rounded-full"></div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen font-sans">
            {/* Background for Dashboard */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ backgroundImage: `url('/tree_bg.jpg')` }}
            >
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px]"></div>
            </div>

            <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                            <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-500/30">
                                <FaHardHat className="text-white text-3xl" />
                            </div>
                            Contractor Portal
                        </h1>
                        <p className="text-gray-600 font-medium mt-2 ml-1">Managing Rural Infrastructure Projects</p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setContractorId(null)}
                        className="bg-white/40 backdrop-blur-md text-gray-800 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg border border-white/40 hover:bg-white/60 transition-all"
                    >
                        Secure Logout
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((p, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            key={p.id}
                            className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/50 shadow-2xl shadow-black/5 overflow-hidden flex flex-col group"
                        >
                            <div className={`h-3 w-full ${getStatusColor(p.status)} opacity-80`} />

                            <div className="p-8 flex flex-col flex-1">
                                {p.village && (
                                    <div className="text-[10px] uppercase tracking-widest font-black text-orange-600 mb-2">
                                        {p.village.block.district.state.name} • {p.village.block.district.name} • {p.village.block.name} • {p.village.name}
                                    </div>
                                )}
                                <h3 className="font-black text-2xl text-gray-900 leading-tight mb-4 group-hover:text-orange-700 transition-colors">
                                    {p.name}
                                </h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-end text-sm font-bold">
                                        <span className="text-gray-500 uppercase tracking-wider">Utilization</span>
                                        <span className="text-gray-900">₹{p.spent.toLocaleString()} / ₹{p.budget.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-black/5 rounded-full h-4 relative overflow-hidden ring-1 ring-black/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((p.spent / p.budget) * 100, 100)}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full rounded-full ${getStatusColor(p.status)} shadow-lg shadow-current/20`}
                                        />
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedProject(p)}
                                        className="w-full py-4 bg-white/60 hover:bg-orange-600 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-black/5 flex items-center justify-center gap-2 group-hover:shadow-xl group-hover:shadow-orange-500/20"
                                    >
                                        Update Progress →
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/40">
                            <span className="text-3xl">🏜️</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-2">No active assignments</h2>
                        <p className="text-gray-500 font-medium">Currently no projects have been assigned to your profile by the District Officer.</p>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <UpdateModal
                        project={selectedProject}
                        contractorId={contractorId}
                        onClose={() => setSelectedProject(null)}
                        onSuccess={() => {
                            setSelectedProject(null);
                            fetchContractorProjects(contractorId).then(setProjects);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function UpdateModal({ project, contractorId, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        formData.append("project_id", project.id);
        formData.append("contractor_id", contractorId);

        await submitContractorUpdate(formData);
        setLoading(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="bg-white/10 backdrop-blur-2xl rounded-[48px] border border-white/20 w-full max-w-2xl p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                {project.village && (
                    <div className="text-[10px] uppercase tracking-widest font-black text-orange-500 mb-2">
                        {project.village.block.district.state.name} • {project.village.block.district.name} • {project.village.block.name} • {project.village.name}
                    </div>
                )}
                <h2 className="text-3xl font-black text-white tracking-tighter mb-8 uppercase">
                    Submit Project Progress
                    <span className="block text-sm font-medium text-white/40 mt-1 lowercase tracking-normal">for {project.name}</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-black text-white/60 uppercase tracking-widest mb-3 ml-1">Incurred Expense (₹)</label>
                            <input
                                name="amount_spent" type="number" step="0.01" required
                                className="w-full bg-white/5 border-2 border-white/10 hover:border-white/20 focus:border-orange-500/50 p-4 rounded-2xl text-white font-bold transition-all focus:outline-none"
                                placeholder="e.g. 50000"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-white/60 uppercase tracking-widest mb-3 ml-1">Est. Completion</label>
                            <input
                                name="expected_completion_date" type="date" required
                                className="w-full bg-white/5 border-2 border-white/10 hover:border-white/20 focus:border-orange-500/50 p-4 rounded-2xl text-white font-bold transition-all focus:outline-none color-white"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-white/60 uppercase tracking-widest mb-3 ml-1">Activity Log / Remarks</label>
                        <textarea
                            name="description" required rows="3"
                            className="w-full bg-white/5 border-2 border-white/10 hover:border-white/20 focus:border-orange-500/50 p-4 rounded-2xl text-white font-medium transition-all focus:outline-none resize-none"
                            placeholder="Detail the work milestones achieved..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="relative group">
                            <input name="bill_image" type="file" accept="image/*" className="hidden" id="bill_upload" />
                            <label htmlFor="bill_upload" className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-6 text-center cursor-pointer hover:bg-white/5 hover:border-orange-500/30 transition-all group">
                                <FaFileInvoiceDollar className="text-3xl text-white/40 mb-3 group-hover:text-orange-500 transition-colors" />
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Upload Invoice</div>
                            </label>
                        </div>

                        <div className="relative group">
                            <input name="work_image" type="file" accept="image/*" className="hidden" id="work_upload" />
                            <label htmlFor="work_upload" className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-6 text-center cursor-pointer hover:bg-white/5 hover:border-orange-500/30 transition-all group">
                                <FaCamera className="text-3xl text-white/40 mb-3 group-hover:text-orange-500 transition-colors" />
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Site Photo</div>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button" onClick={onClose}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-white/5"
                        >
                            Dismiss
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" disabled={loading}
                            className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-3 ${loading ? 'bg-white/5 text-white/20' : 'bg-orange-600 text-white shadow-orange-500/20 hover:bg-orange-700'
                                }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Authenticate & Submit</>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case "completed": return "bg-green-500";
        case "delayed": return "bg-red-500";
        default: return "bg-blue-500";
    }
}
