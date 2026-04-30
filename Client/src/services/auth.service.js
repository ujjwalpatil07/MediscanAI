import api from "../api/api";

export const patientSignup = (signupData) => {
  return api.post("/auth/patient/signup", signupData);
};

export const patientLogin = (credentials) => {
  return api.post("/auth/patient/login", credentials);
};

export const doctorSignup = (signupData) => {
  return api.post("/auth/doctor/signup", signupData);
};

export const doctorLogin = (credentials) => {
  return api.post("/auth/doctor/login", credentials);
};