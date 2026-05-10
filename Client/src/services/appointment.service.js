// services/appointment.service.js
import api from "../api/api.js";

export const fetchAvailableSlots = (doctorId, date) => {
  return api.get(`/p/appointment/available-slots/${doctorId}`, {
    params: { date },
  });
};

export const bookAppointmentService = (data) => {
  return api.post("/p/appointment/book", data);
};

export const getMyAppointmentsService = () => {
  return api.get("/p/appointment/my");
};

// Get single appointment by ID
export const getAppointmentByIdService = (appointmentId) => {
  return api.get(`/p/appointment/${appointmentId}`);
};

// Cancel appointment
export const cancelAppointmentService = (appointmentId) => {
  return api.put(`/p/appointment/cancel/${appointmentId}`);
};

// Mark appointment as paid
export const markAsPaidService = (appointmentId) => {
  return api.put(`/p/appointment/pay/${appointmentId}`);
};
