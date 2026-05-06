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