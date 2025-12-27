import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdPersonAdd, MdVpnKey, MdAssignment, MdDelete, MdBadge, MdBusiness, MdPhone } from "react-icons/md";
import { fetchContractors, addContractor, assignContractor, updateContractorPin, deleteContractor } from "../api";

export default function ContractorTab({ projects = [], reload }) {
  const [contractors, setContractors] = useState([]);
  const [form, setForm] = useState({ name: "", company: "", phone: "" });
  const [selectedContractorId, setSelectedContractorId] = useState("");
  const [newPin, setNewPin] = useState("");

  async function load() {
    const data = await fetchContractors();
    setContractors(data || []);
  }

  useEffect(() => { load(); }, []);

  function handleChange(k, v) {
    setForm({ ...form, [k]: v });
  }

  async function create() {
    if (!form.name || !form.company) return alert("Missing required fields");
    await addContractor(form);
    setForm({ name: "", company: "", phone: "" });
    load();
  }

  async function handlePinUpdate() {
    if (!selectedContractorId || !newPin) {
      alert("Please select a contractor and enter a 4-digit PIN.");
      return;
    }
    await updateContractorPin(selectedContractorId, newPin);
    alert("Passkey Provisioned! ✅");
    setNewPin("");
  }

  async function handleRemove(id) {
    if (window.confirm("Purge contractor records? This will unbind all associated project links.")) {
      await deleteContractor(id);
      load();
    }
  }

  async function assign(pId, cId) {
    await assignContractor(pId, cId);
    reload();
  }

  return (
    <div className="space-y-10">

      {/* SECTION 1: REGISTRATION */}
      <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
            <MdPersonAdd className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Vendor Registration</h2>
            <p className="text-[10px] font-black text-teal-600 mt-1 uppercase tracking-[0.2em]">Add New Contractor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {[
            { key: "name", label: "Full Name", icon: <MdBadge /> },
            { key: "company", label: "Organization", icon: <MdBusiness /> },
            { key: "phone", label: "Contact #", icon: <MdPhone /> }
          ].map(x => (
            <div key={x.key} className="relative">
              <label className="block text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2 ml-1">{x.label}</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-teal-600 transition-colors">{x.icon}</span>
                <input
                  className="w-full bg-white/40 border border-gray-200 p-4 pl-12 rounded-2xl text-xs font-black text-gray-900 focus:outline-none focus:border-teal-500 transition-all uppercase tracking-wider placeholder:text-gray-400"
                  placeholder="..."
                  value={form[x.key]}
                  onChange={(e) => handleChange(x.key, e.target.value)}
                />
              </div>
            </div>
          ))}
          <button onClick={create} className="bg-teal-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2">
            Confirm Entry
          </button>
        </div>
      </div>

      {/* SECTION 2: PASSKEY PROVISIONING */}
      <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <MdVpnKey className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Access Management</h2>
            <p className="text-[10px] font-black text-indigo-600 mt-1 uppercase tracking-[0.2em]">Passkey Provisioning</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="relative">
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 ml-1">Identity Selection</label>
            <select
              className="w-full bg-white/40 border border-gray-200 p-4 rounded-2xl text-xs font-black text-gray-900 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer uppercase tracking-wider shadow-sm"
              value={selectedContractorId}
              onChange={(e) => setSelectedContractorId(e.target.value)}
            >
              <option value="" className="text-gray-900">-- Choose Vendor --</option>
              {contractors.map(c => (
                <option key={c.id} value={c.id} className="text-gray-900">{c.name} ({c.company})</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 ml-1">Secure Passkey (4-Digits)</label>
            <input
              type="text"
              className="w-full bg-white/40 border border-gray-200 p-4 rounded-2xl text-xs font-black text-center tracking-widest text-gray-900 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-400"
              placeholder="0 0 0 0"
              maxLength="4"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
            />
          </div>
          <button
            onClick={handlePinUpdate}
            className="bg-indigo-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-500/20 transition-all"
          >
            Provision Key
          </button>
        </div>
      </div>

      {/* SECTION 3: DEPLOYMENT MAPPING & REGISTRY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mapping Table */}
        <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
              <MdAssignment className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none">Execution Mapping</h3>
              <p className="text-[10px] font-black text-teal-600 mt-1 uppercase tracking-widest">Assign Active Projects</p>
            </div>
          </div>
          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-gray-100 hover:bg-white/60 transition-all shadow-sm">
                <div className="leading-none flex-1 pr-4">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate block">{p.name}</span>
                </div>
                <select
                  className="bg-white/60 border border-gray-200 p-2 rounded-xl text-[10px] font-black text-gray-900 focus:outline-none focus:border-teal-500 cursor-pointer uppercase tracking-widest w-40 shadow-sm"
                  value={p.contractor_id || ""}
                  onChange={(e) => assign(p.id, e.target.value)}
                >
                  <option value="" className="text-gray-900">Unassigned</option>
                  {contractors.map(c => (
                    <option key={c.id} value={c.id} className="text-gray-900">{c.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Registry Cards */}
        <div className="space-y-4">
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Active Registry</h3>
          <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            <AnimatePresence>
              {contractors.map(c => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={c.id}
                  className="p-5 bg-white/40 backdrop-blur-2xl border border-white rounded-[30px] flex justify-between items-center group hover:bg-white/60 transition-all shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-lg border border-teal-100 shadow-sm transition-transform group-hover:scale-110">
                      <MdBadge />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">{c.name}</p>
                      <p className="text-[9px] text-teal-600 font-black uppercase tracking-widest">{c.company}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(c.id)}
                    className="opacity-0 group-hover:opacity-100 p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-md active:scale-95"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
