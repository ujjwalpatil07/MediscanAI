import api from "../api/api";

export const patientSignup = (signupData) => {
  return api.post("/auth/patient/signup", signupData);
};

export const patientLogin = (credentials) => {
  return api.post("/auth/patient/login", credentials);
};
