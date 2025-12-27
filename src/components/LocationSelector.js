// import React, { useEffect, useState } from "react";
// import {
//   fetchStates,
//   fetchDistricts,
//   fetchBlocks,
//   fetchVillages,
// } from "../api";

// export default function LocationSelector({ onVillageSelected }) {
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [villages, setVillages] = useState([]);

//   const [stateId, setStateId] = useState("");
//   const [districtId, setDistrictId] = useState("");
//   const [blockId, setBlockId] = useState("");
//   const [villageId, setVillageId] = useState("");

//   useEffect(() => {
//     fetchStates().then(setStates);
//   }, []);

//   useEffect(() => {
//     if (stateId) fetchDistricts(stateId).then(setDistricts);
//   }, [stateId]);

//   useEffect(() => {
//     if (districtId) fetchBlocks(districtId).then(setBlocks);
//   }, [districtId]);

//   useEffect(() => {
//     if (blockId) fetchVillages(blockId).then(setVillages);
//   }, [blockId]);

//   useEffect(() => {
//     if (villageId) onVillageSelected(villageId);
//   }, [villageId, onVillageSelected]);

//   return (
//     <div className="space-y-3">
//       <h3 className="text-lg font-bold text-blue-700">Select Village</h3>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

//         <select
//           value={stateId}
//           onChange={(e) => setStateId(e.target.value)}
//           className="p-2 rounded border"
//         >
//           <option value="">Select State</option>
//           {states.map((s) => (
//             <option key={s.id} value={s.id}>{s.name}</option>
//           ))}
//         </select>

//         <select
//           value={districtId}
//           onChange={(e) => setDistrictId(e.target.value)}
//           className="p-2 rounded border"
//         >
//           <option value="">Select District</option>
//           {districts.map((d) => (
//             <option key={d.id} value={d.id}>{d.name}</option>
//           ))}
//         </select>

//         <select
//           value={blockId}
//           onChange={(e) => setBlockId(e.target.value)}
//           className="p-2 rounded border"
//         >
//           <option value="">Select Block</option>
//           {blocks.map((b) => (
//             <option key={b.id} value={b.id}>{b.name}</option>
//           ))}
//         </select>

//         <select
//           value={villageId}
//           onChange={(e) => setVillageId(e.target.value)}
//           className="p-2 rounded border"
//         >
//           <option value="">Select Village</option>
//           {villages.map((v) => (
//             <option key={v.id} value={v.id}>{v.name}</option>
//           ))}
//         </select>

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { fetchStates, fetchDistricts, fetchBlocks, fetchVillages } from "../api";

export default function LocationSelector({ onVillageSelected }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);

  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [blockId, setBlockId] = useState("");
  const [villageId, setVillageId] = useState("");

  useEffect(() => {
    fetchStates().then((res) => setStates(res ?? []));
  }, []);

  useEffect(() => {
    if (stateId) fetchDistricts(stateId).then((res) => setDistricts(res ?? []));
    else setDistricts([]);
  }, [stateId]);

  useEffect(() => {
    if (districtId) fetchBlocks(districtId).then((res) => setBlocks(res ?? []));
    else setBlocks([]);
  }, [districtId]);

  useEffect(() => {
    if (blockId) fetchVillages(blockId).then((res) => setVillages(res ?? []));
    else setVillages([]);
  }, [blockId]);

  const handleStateChange = (val) => {
    setStateId(val);
    setDistrictId("");
    setBlockId("");
    setVillageId("");
    onVillageSelected(null);
  };

  const handleDistrictChange = (val) => {
    setDistrictId(val);
    setBlockId("");
    setVillageId("");
    onVillageSelected(null);
  };

  const handleBlockChange = (val) => {
    setBlockId(val);
    setVillageId("");
    onVillageSelected(null);
  };

  const handleVillageChange = (val) => {
    setVillageId(val);
    onVillageSelected(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-black/5 rounded-[24px]">
      {/* State */}
      <div className="relative group">
        <select
          className="appearance-none bg-white/40 border border-white/40 p-4 w-full rounded-2xl text-gray-800 font-semibold cursor-pointer focus:bg-white/80 transition-all outline-none backdrop-blur-sm"
          value={stateId}
          onChange={(e) => handleStateChange(e.target.value)}
        >
          <option value="">🗺 STATE</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
      </div>

      {/* District */}
      <div className="relative group">
        <select
          className="appearance-none bg-white/40 border border-white/40 p-4 w-full rounded-2xl text-gray-800 font-semibold cursor-pointer focus:bg-white/80 transition-all outline-none backdrop-blur-sm disabled:opacity-30"
          value={districtId}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={!stateId}
        >
          <option value="">🏢 DISTRICT</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
      </div>

      {/* Block */}
      <div className="relative group">
        <select
          className="appearance-none bg-white/40 border border-white/40 p-4 w-full rounded-2xl text-gray-800 font-semibold cursor-pointer focus:bg-white/80 transition-all outline-none backdrop-blur-sm disabled:opacity-30"
          value={blockId}
          onChange={(e) => handleBlockChange(e.target.value)}
          disabled={!districtId}
        >
          <option value="">🏘 BLOCK</option>
          {blocks.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
      </div>

      {/* Village */}
      <div className="relative group">
        <select
          className="appearance-none bg-white/40 border border-white/40 p-4 w-full rounded-2xl text-gray-800 font-semibold cursor-pointer focus:bg-white/80 transition-all outline-none backdrop-blur-sm disabled:opacity-30"
          value={villageId}
          disabled={!blockId}
          onChange={(e) => handleVillageChange(e.target.value)}
        >
          <option value="">📍 VILLAGE</option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
      </div>
    </div>
  );
}
