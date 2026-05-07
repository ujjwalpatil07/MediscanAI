import api from "../api/api";

export const getMyPrescriptions = () => {
  return api.get(`/p/prescription/my`);
};

export const getPrescriptionByAppointment = (appointmentId) => {
  return api.get(`/p/prescription/appointment/${appointmentId}`);
};

export const createPrescription = (prescriptionData) => {
  return api.post(`/p/prescription/create`, prescriptionData);
};

export const getPrescriptionById = (id) => {
  return api.get(`/p/prescription/${id}`);
};

export const deletePrescription = (id) => {
  return api.delete(`/p/prescription/${id}`);
};
