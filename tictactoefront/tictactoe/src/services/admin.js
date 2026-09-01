import api from "../services/api";

export async function clearMatchHistory() {
  const token = sessionStorage.getItem("token");

  const response = await api.delete("/admin/match-history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getAdminMatchHistory() {
  const token = sessionStorage.getItem("token");

  const response = await api.get("/admin/match-history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}