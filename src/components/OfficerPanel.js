/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import {
  MdDashboard,
  MdWork, // Added
  MdReport,
  MdLogout,
  MdPeople,
  MdHistory,
} from "react-icons/md";
import {
  fetchStates,
  fetchDistricts,
  fetchBlocks,
  fetchVillages,
  fetchProjectsByVillage,
  createProject,
  updateProject,
  deleteProject,
  fetchProblematicFeedbacks,
  fetchContractors,
  fetchOfficerStats,
  fetchAllUpdates,
  checkAIAlerts
} from "../api";

import Sidebar from "./Sidebar";
import OfficerDashboard from "./OfficerDashboard";
import ContractorTab from "./ContractorTab";
import { motion, AnimatePresence } from "framer-motion";

export default function OfficerPanel({ setRole }) {

  const [tab, setTab] = useState("dashboard");

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);

  const [contractors, setContractors] = useState([]);
  const [stats, setStats] = useState({ total_projects: 0, completed_projects: 0, complaints: 0 }); // 🔥 State Added

  const [updates, setUpdates] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [blockId, setBlockId] = useState("");
  const [villageId, setVillageId] = useState("");

  const [projects, setProjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_year: "",
    duration_months: "",
    budget: "",
    status: "ongoing",
    contractor_id: ""
  });

  // Load dropdown data once
  useEffect(() => {
    fetchStates().then((res) => setStates(res || []));

    fetchContractors().then((res) => setContractors(res || []));
    fetchOfficerStats().then((res) => { if (res) setStats(res); }); // Initial Load
    // fetchAllUpdates().then((res) => setUpdates(res || [])); // REMOVED: Now logic is inside useEffect dependent on filters
    checkAIAlerts().then((res) => setAlerts(res || []));
  }, []);

  // Fetch Stats when filters change
  useEffect(() => {
    // Only fetch if at least state is selected (optional, or fetch global if nothing selected)
    // We pass current filter values
    const filters = {};
    if (stateId) filters.state_id = stateId;
    if (districtId) filters.district_id = districtId;
    if (blockId) filters.block_id = blockId;
    if (villageId) filters.village_id = villageId;

    fetchOfficerStats(filters).then((res) => { if (res) setStats(res); });
  }, [stateId, districtId, blockId, villageId]);


  // 🔥 Fetch Updates when filters change
  useEffect(() => {
    // If no state selected, optionally clear updates or show empty
    if (!stateId) {
      setUpdates([]);
      return;
    }
    const filters = {};
    if (stateId) filters.state_id = stateId;
    if (districtId) filters.district_id = districtId;
    if (blockId) filters.block_id = blockId;
    if (villageId) filters.village_id = villageId;

    fetchAllUpdates(filters).then((res) => setUpdates(res || []));
  }, [stateId, districtId, blockId, villageId]);

  const resetLower = () => {
    setDistricts([]);
    setBlocks([]);
    setVillages([]);
    setDistrictId("");
    setBlockId("");
    setVillageId("");
  };

  useEffect(() => {
    if (!stateId) return resetLower();
    fetchDistricts(stateId).then((res) => setDistricts(res || []));
  }, [stateId]);

  useEffect(() => {
    if (!districtId) return;
    fetchBlocks(districtId).then((res) => setBlocks(res || []));
  }, [districtId]);

  useEffect(() => {
    if (!blockId) return;
    fetchVillages(blockId).then((res) => setVillages(res || []));
  }, [blockId]);

  useEffect(() => {
    if (!villageId) return setProjects([]);

    fetchProjectsByVillage(villageId).then((res) => setProjects(res || []));
  }, [villageId]);

  useEffect(() => {
    if (!villageId) return setFeedbacks([]);
    fetchProblematicFeedbacks(villageId).then((res) => setFeedbacks(res || []));
  }, [villageId]);

  // Delete Project
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(id);
    fetchProjectsByVillage(villageId).then(setProjects);
  };

  // Submit form — Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      start_year: Number(form.start_year),
      duration_months: Number(form.duration_months),
      budget: Number(form.budget) || 0,
      contractor_id: form.contractor_id ? Number(form.contractor_id) : null,
      village_id: Number(villageId)
    };

    editingProject
      ? await updateProject(editingProject.id, payload)
      : await createProject(payload);

    resetForm();
    fetchProjectsByVillage(villageId).then(setProjects);
  };

  const resetForm = () => {
    setEditingProject(null);
    setForm({
      name: "",
      description: "",
      start_year: "",
      duration_months: "",
      budget: "",
      status: "ongoing",
      contractor_id: ""
    });
  };

  const handleEdit = (project) => {
    setTab("projects");
    setEditingProject(project);
    setForm({
      ...project,
      contractor_id: project.contractor_id || ""
    });
  };

  return (
    <div className="relative flex min-h-screen font-sans overflow-hidden">
      {/* Immersive Modern Modern Light Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url('/tree_bg.jpg')` }}
      >
        {/* Light Ivory Glass Overlay */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px]"></div>

        {/* Animated Vibrant Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Sidebar current={tab} setCurrent={setTab} setRole={setRole} />

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">

        {/* Unified Top Header / Filter Bar */}
        <div className="px-8 pt-8 pb-4">
          <div className="bg-white/10 backdrop-blur-3xl p-6 rounded-[32px] border border-white/20 shadow-2xl shadow-black/20 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 border-r border-gray-200 pr-6 mr-2">
              <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white text-3xl shadow-xl shadow-teal-500/20 transition-transform hover:scale-110">
                <MdDashboard />
              </div>
              <div className="leading-none">
                <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap">Administration</h1>
                <p className="text-[11px] font-black text-teal-600 mt-1 uppercase tracking-[0.2em] whitespace-nowrap">Portal Control</p>
              </div>
            </div>

            <div className="flex-1 flex gap-3">
              {[
                { label: "State", value: stateId, setter: setStateId, items: states },
                { label: "District", value: districtId, setter: setDistrictId, items: districts },
                { label: "Block", value: blockId, setter: setBlockId, items: blocks },
                { label: "Village", value: villageId, setter: setVillageId, items: villages }
              ].map((d, i) => (
                <div key={i} className="flex-1 relative group">
                  <select
                    className="w-full bg-white/60 border border-white hover:border-teal-500 p-3.5 pl-5 rounded-2xl text-xs font-black text-gray-900 appearance-none focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all cursor-pointer uppercase tracking-wider disabled:opacity-30 shadow-lg"
                    disabled={i !== 0 && ![stateId, districtId, blockId][i - 1]}
                    value={d.value}
                    onChange={(e) => d.setter(e.target.value)}
                  >
                    <option value="" className="text-gray-900">Select {d.label}</option>
                    {d.items.map((x) => (
                      <option key={x.id} value={x.id} className="text-gray-900">{x.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-teal-600 transition-colors text-[10px]">
                    ▼
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 pt-4">
          <AnimatePresence mode="wait">

            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!stateId ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-white/30">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl mb-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/5">📍</div>
                  <p className="text-xl font-black uppercase tracking-tighter text-white/60">Selection Required</p>
                  <p className="text-sm font-medium mt-1 text-white/30">Please select a regional scope to view analytics.</p>
                </div>
              ) : (
                <OfficerDashboard projects={projects} stats={stats} />
              )}
            </motion.div>

            {/* PROJECTS TAB */}
            {
              tab === "projects" && (
                <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  {/* Premium Form */}
                  {villageId && (
                    <form className="bg-white/10 backdrop-blur-3xl p-8 rounded-[40px] border border-white/20 shadow-2xl shadow-black/30" onSubmit={handleSubmit}>
                      <div className="mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
                          <MdWork className="text-xl" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">{editingProject ? "Redefine Project" : "Initiate Project"}</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2 ml-1">Project Identifier</label>
                          <input
                            className="w-full bg-white/40 border border-gray-200 p-4 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-teal-500 transition-all placeholder:text-gray-400"
                            placeholder="Enter project name..."
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2 ml-1">Objective Summary</label>
                          <textarea
                            className="w-full bg-white/40 border border-gray-200 p-4 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-teal-500 transition-all resize-none placeholder:text-gray-400"
                            placeholder="What does this project achieve?"
                            rows="2"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                          />
                        </div>
                        {[
                          { key: "start_year", label: "Fiscal Year", type: "number" },
                          { key: "duration_months", label: "Duration (Months)", type: "number" },
                          { key: "budget", label: "Budget Allocation (₹)", type: "number" }
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2 ml-1">{f.label}</label>
                            <input
                              type={f.type}
                              className="w-full bg-white/40 border border-gray-200 p-4 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-teal-500 transition-all"
                              value={form[f.key]}
                              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2 ml-1">Assigned Vendor</label>
                          <select
                            className="w-full bg-white/40 border border-gray-200 p-4 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-teal-500 transition-all appearance-none cursor-pointer"
                            value={form.contractor_id}
                            onChange={(e) => setForm({ ...form, contractor_id: e.target.value })}
                          >
                            <option value="" className="text-gray-900">Select Contractor</option>
                            {contractors.map((c) => (
                              <option key={c.id} value={c.id} className="text-gray-900">{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-4 p-8 bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white shadow-xl">
                        {editingProject && (
                          <button type="button" onClick={resetForm} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/50 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-white/10">Cancel</button>
                        )}
                        <button className="flex-[2] bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 transition-all">
                          {editingProject ? "Commit Changes" : "Deploy Project"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* PROJECT CARDS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((p, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={p.id}
                        className="bg-white/40 backdrop-blur-2xl p-6 rounded-[32px] border border-white shadow-xl group hover:bg-white/60 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-black text-xl text-gray-900 tracking-tighter leading-tight group-hover:text-teal-600 transition-colors uppercase">{p.name}</h3>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${p.status === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-sky-500/10 text-sky-600 border-sky-500/20"
                            }`}>
                            {p.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contractor</span>
                            <span className="font-black text-gray-900 text-sm">{p.contractor?.name || "Unassigned"}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Financials</span>
                            <span className="font-black text-gray-900 text-sm whitespace-nowrap">₹{p.spent.toLocaleString()} / ₹{p.budget.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-black/5">
                          <button className="flex-1 py-3 bg-white/60 hover:bg-teal-600 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-black/5" onClick={() => handleEdit(p)}>Modify</button>
                          <button className="flex-1 py-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-rose-100" onClick={() => handleDelete(p.id)}>Archive</button>
                        </div>
                      </motion.div>
                    ))}
                    {projects.length === 0 && villageId && (
                      <div className="col-span-full py-20 text-center font-black text-white/30 uppercase tracking-widest">No Projects Found In This Sector</div>
                    )}
                  </div>
                </motion.div>
              )
            }



            {/* COMPLAINTS TAB */}
            {
              tab === "complaints" && (
                <motion.div key="complaints" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  {feedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/30 font-black uppercase tracking-widest">
                      Excellent: No reports found
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {feedbacks.map((fb, idx) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={fb.id}
                          className="bg-white/10 backdrop-blur-3xl p-8 rounded-[40px] border border-white/20 shadow-xl shadow-black/20 flex flex-col md:flex-row gap-8 group hover:bg-white/15 transition-all"
                        >
                          {fb.image_path && (
                            <div className="w-full md:w-56 h-56 flex-shrink-0 relative">
                              <img
                                src={`http://localhost:8000/uploads/${fb.image_path}`}
                                alt="Complaint"
                                className="w-full h-full object-cover rounded-[32px] border border-white/20 shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500"
                              />
                              {fb.is_flagged && (
                                <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[11px] px-3 py-1.5 rounded-xl font-black tracking-widest shadow-xl rotate-6 border border-white/20">
                                  MISPLACED
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-black text-2xl text-gray-900 tracking-tighter uppercase leading-none group-hover:text-teal-600 transition-colors">
                                {fb.project_name}
                              </h4>
                              <div className="flex items-center gap-1 bg-amber-100 text-amber-600 px-3 py-1 rounded-xl font-black border border-amber-200 shadow-sm">
                                <span className="text-sm">★</span>
                                <span className="text-xs">{fb.rating}</span>
                              </div>
                            </div>

                            {fb.is_flagged && (
                              <div className="inline-block bg-rose-50 text-rose-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-rose-100 uppercase tracking-widest mb-4">
                                Ref: {fb.flag_reason || "Geofence Violation"}
                              </div>
                            )}

                            <p className="text-gray-600 font-black leading-relaxed mb-6 italic">"{fb.comment || "Statement not provided by citizen."}"</p>

                            <div className="flex items-center gap-3 pt-6 border-t border-black/5">
                              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SubmissionID #{fb.id}</div>
                              <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
                              <div className={`text-[10px] font-black uppercase tracking-widest ${fb.is_flagged ? 'text-rose-600' : 'text-emerald-600'}`}>Authenticity: {fb.is_flagged ? 'Low' : 'Verified'}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            }

            {/* CONTRACTOR TAB */}
            {
              tab === "contractors" && (
                <motion.div key="contr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ContractorTab
                    projects={projects}
                    reload={() => fetchProjectsByVillage(villageId).then(setProjects)}
                  />
                </motion.div>
              )
            }

            {/* UPDATES TAB */}
            {
              tab === "updates" && (
                <motion.div key="updates" className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* ALERTS */}
                  {alerts.length > 0 && (
                    <div className="bg-red-600/10 backdrop-blur-3xl border border-red-600/20 p-8 rounded-[40px] mb-8">
                      <h3 className="text-red-500 font-black text-xl tracking-tighter mb-6 uppercase flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-500/40">⚠️</div>
                        Critical Compliance Alerts
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {alerts.map((a, i) => (
                          <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 shadow-sm">
                            <div className="leading-none">
                              <span className="font-black text-white text-sm uppercase tracking-tighter">{a.contractor}</span>
                              <p className="text-[10px] font-bold text-white/30 mt-1 uppercase tracking-widest">{a.project}</p>
                            </div>
                            <div className="text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">{a.message.split(' ')[0]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!stateId ? (
                    <div className="text-center py-20 font-black text-white/30 uppercase tracking-widest">Selection Required To Fetch Work Logs</div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {updates.map((u, idx) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          key={u.id}
                          className="bg-white/10 backdrop-blur-3xl p-8 rounded-[40px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col group hover:bg-white/15 transition-all"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="leading-none">
                              <h3 className="font-black text-xl text-gray-900 tracking-tighter uppercase mb-1 drop-shadow-sm">Log Report</h3>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proj ID: #{u.project_id}</span>
                            </div>
                            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20">{u.submission_date.split('T')[0]}</span>
                          </div>

                          <div className="bg-teal-50 rounded-[32px] p-6 mb-6">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Financial Disclosure</span>
                            <div className="text-2xl font-black text-gray-900 mt-1 tracking-tighter uppercase">₹{u.amount_spent.toLocaleString()} <span className="text-xs font-black text-teal-600">Spent</span></div>
                          </div>

                          <p className="text-gray-600 font-black leading-relaxed mb-8 italic">"{u.description}"</p>

                          <div className="grid grid-cols-2 gap-4 mt-auto">
                            {u.work_image_path && (
                              <div className="group relative rounded-3xl overflow-hidden border border-white shadow-lg h-32">
                                <img src={`http://localhost:8000/uploads/${u.work_image_path}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Work" />
                                <div className="absolute inset-0 bg-black/20 flex items-end p-3"><span className="text-[9px] font-black text-white uppercase tracking-widest">Execution</span></div>
                              </div>
                            )}
                            {u.bill_image_path && (
                              <div className="group relative rounded-3xl overflow-hidden border border-white shadow-lg h-32">
                                <img src={`http://localhost:8000/uploads/${u.bill_image_path}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Bill" />
                                <div className="absolute inset-0 bg-black/20 flex items-end p-3"><span className="text-[9px] font-black text-white uppercase tracking-widest">Invoicing</span></div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {updates.length === 0 && <div className="col-span-full py-20 text-center font-black text-white/30 uppercase tracking-widest">No Active Logs Detected</div>}
                    </div>
                  )}
                </motion.div>
              )
            }

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
