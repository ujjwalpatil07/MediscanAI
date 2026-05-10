// services/doctor.service.js
import api from "../api/api.js";

// ==================== DOCTOR PROFILE ====================
export const getDoctorById = (doctorId) => {
  return api.get(`/doctor/${doctorId}`);
};

export const getAllDoctorsService = (params) => {
  return api.get("/doctor", { params });
};

// ==================== PATIENTS ====================
export const getMyPatients = (params) => {
  return api.get("/doctor/patients", { params });
};

export const getDoctorPatientById = (patientId) => {
  return api.get(`/doctor/patients/${patientId}`);
};

// ==================== APPOINTMENTS ====================
export const getDoctorAppointments = (params = {}) => {
  return api.get("/doctor/appointments", { params });
};

export const getAppointmentById = (appointmentId) => {
  return api.get(`/doctor/appointments/${appointmentId}`);
};

export const updateAppointmentStatus = (appointmentId, status) => {
  // Note: Backend uses PUT method, not PATCH
  return api.put(`/doctor/appointments/${appointmentId}/status`, { status });
};

// ==================== STATS ====================
export const getAppointmentStats = () => {
  // This endpoint doesn't exist separately in your routes
  // Stats are included in getDoctorAppointments response
  // You can either remove this or create a stats endpoint
  return api.get("/doctor/appointments/stats");
};

// ==================== DASHBOARD ====================
export const getDashboardData = () => {
  return api.get("/doctor/dashboard");
};

// ==================== PRESCRIPTIONS ====================
export const getPrescriptions = (params) => {
  return api.get("/doctor/prescriptions", { params });
};

export const createPrescription = (data) => {
  return api.post("/doctor/prescriptions", data);
};

// ==================== BLOGS ====================
// services/doctor.service.js (add these blog functions)

// ==================== BLOGS ====================
export const getBlogs = (params = {}) => {
  return api.get("/doctor/blogs", { params });
};

export const getBlogById = (blogId) => {
  return api.get(`/doctor/blogs/${blogId}`);
};

export const createBlog = (data) => {
  return api.post("/doctor/blogs", data);
};

export const updateBlog = (blogId, data) => {
  return api.put(`/doctor/blogs/${blogId}`, data);
};

export const deleteBlog = (blogId) => {
  return api.delete(`/doctor/blogs/${blogId}`);
};

// Public blog endpoints (for patients/visitors)
export const getAllPublicBlogs = (params = {}) => {
  return api.get("/blogs", { params });
};

export const getPublicBlogById = (blogId) => {
  return api.get(`/blogs/${blogId}`);
};

export const likeBlog = (blogId) => {
  return api.post(`/blogs/${blogId}/like`);
};

export const addComment = (blogId, comment) => {
  return api.post(`/blogs/${blogId}/comment`, { comment });
};

// ==================== SETTINGS ====================
export const getSettings = () => {
  return api.get("/doctor/settings");
};

export const updateSettings = (data) => {
  return api.put("/doctor/settings", data);
};

// ==================== PAYMENTS ====================
export const getPaymentDashboard = () => {
  return api.get("/doctor/payments/dashboard");
};

export const getTransactions = (params) => {
  return api.get("/doctor/payments/transactions", { params });
};

export const addBankAccount = (data) => {
  return api.post("/doctor/payments/bank-account", data);
};

export const requestWithdrawal = (data) => {
  return api.post("/doctor/payments/withdraw", data);
};

// ==================== NOTIFICATIONS ====================
export const getNotifications = (params) => {
  return api.get("/doctor/notifications", { params });
};

export const markNotificationRead = (notificationId) => {
  return api.put(`/doctor/notifications/${notificationId}/read`);
};

export const markAllNotificationsRead = () => {
  return api.put("/doctor/notifications/read-all");
};
