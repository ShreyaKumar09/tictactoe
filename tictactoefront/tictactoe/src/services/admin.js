import api from "../api";

export async function clearMatchHistory() {
  const token = localStorage.getItem("token");

  const response = await api.delete("/admin/match-history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}