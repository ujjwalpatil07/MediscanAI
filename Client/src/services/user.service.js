import api from "../api/api";

export const fetchCurrentUser = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return Promise.reject(new Error("No token found"));
  }

  return api.get("/auth/me");
};