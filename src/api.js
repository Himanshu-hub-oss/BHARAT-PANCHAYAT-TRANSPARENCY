
const API = "http://127.0.0.1:8000";

async function apiCall(path, options = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      console.warn("API Error:", res.status, res.statusText);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("API Fetch Failed:", path, err);
    return null;
  }
}

// Locations
export const fetchStates = async () => {
  const res = await apiCall("/locations/states");
  console.log("States API response:", res);
  return res;
};

export const fetchDistricts = async (id) => {
  const res = await apiCall(`/locations/districts/${id}`);
  console.log(`Districts for state ${id}:`, res);
  return res;
};
export const fetchBlocks = async (id) => {
  const res = await apiCall(`/locations/blocks/${id}`);
  console.log(`Blocks for district ${id}:`, res);
  return res;
};
export const fetchVillages = async (id) => {
  const res = await apiCall(`/locations/villages/${id}`);
  console.log(`Villages for block ${id}:`, res);
  return res;
};

// Projects + Dashboard
export const fetchProjectsByVillage = (id) => apiCall(`/projects/by_village/${id}`);
export const fetchProjectDetail = (id) => apiCall(`/projects/${id}`);
export const fetchVillageDashboard = (id) => apiCall(`/dashboard/village/${id}`);

export const fetchOfficerStats = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.state_id) params.append("state_id", filters.state_id);
  if (filters.district_id) params.append("district_id", filters.district_id);
  if (filters.block_id) params.append("block_id", filters.block_id);
  if (filters.village_id) params.append("village_id", filters.village_id);

  return apiCall(`/dashboard/officer/stats?${params.toString()}`);
};

// Feedback
export const listFeedback = (id) => apiCall(`/feedback/list/${id}`);
export const submitFeedback = (id, payload) =>
  apiCall(`/feedback/add/${id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Officer Panel
export const createProject = (payload) =>
  apiCall("/projects/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateProject = (id, payload) =>
  apiCall(`/projects/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteProject = (id) =>
  apiCall(`/projects/delete/${id}`, {
    method: "DELETE",
  });

export const computeRisk = (payload) =>
  apiCall("/ai/risk", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export async function submitFeedbackWithFile(projectId, formData) {
  const res = await fetch(`${API}/feedback/add/${projectId}`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function fetchProblematicFeedbacks(villageId) {
  const res = await fetch(`${API}/feedback/problematic/${villageId}`);
  return res.json();
}

export const fetchContractors = () => apiCall("/contractors/list");

export const addContractor = (payload) =>
  apiCall("/contractors/add?" + new URLSearchParams(payload), {
    method: "POST",
  });

export const assignContractor = (projectId, contractorId) =>
  apiCall(`/contractors/assign/${projectId}?contractor_id=${contractorId}`, {
    method: "PUT",
  });

export const fetchContractorProjects = (id) => apiCall(`/contractors/projects/${id}`);

export const submitContractorUpdate = (formData) =>
  fetch(`${API}/contractors/update`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());


export const fetchAllUpdates = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.state_id) params.append("state_id", filters.state_id);
  if (filters.district_id) params.append("district_id", filters.district_id);
  if (filters.block_id) params.append("block_id", filters.block_id);
  if (filters.village_id) params.append("village_id", filters.village_id);
  return apiCall(`/contractors/updates/all?${params.toString()}`);
};

export async function deleteContractor(id) {
  await fetch(`${API}/contractors/${id}`, { method: "DELETE" });
}

export const checkAIAlerts = () => apiCall("/ai/alerts");

export const updateContractorPin = (id, pin) => {
  const formData = new FormData();
  formData.append("pin", pin);
  return fetch(`${API}/contractors/${id}/pin`, {
    method: "PUT",
    body: formData,
  }).then((res) => res.json());
};

export const verifyContractorPin = (id, pin) => {
  const formData = new FormData();
  formData.append("contractor_id", id);
  formData.append("pin", pin);
  return fetch(`${API}/contractors/verify-pin`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
};
