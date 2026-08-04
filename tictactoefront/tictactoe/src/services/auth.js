import api from "../api";

export async function login(username, password) {
  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

export function logout() {
  localStorage.removeItem("token");
}