import api from "../api/api";

export const fetchCurrentPatient = () => {
  return api.get("/auth/patient/me");
};

export const fetchCurrentDoctor = () => {
  return api.get("/auth/doctor/me");
};

export const fetchCurrentUser = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return Promise.reject(new Error("No token found"));
  }

  return api.get("/auth/me");
};