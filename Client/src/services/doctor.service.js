import api from "../api/api.js";

export const getDoctorByIdService = (doctorId) => {
  return api.get(`/doctor/${doctorId}`);
};

export const getAllDoctorsService = (params) => {
  return api.get("/doctor", { params });
};