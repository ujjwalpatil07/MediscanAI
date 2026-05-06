import express from "express";
import {
  getDashboardData,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getPatients,
  getPatientById,
  getPrescriptions,
  createPrescription,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getSettings,
  updateSettings,
  getPaymentDashboard,
  getTransactions,
  addBankAccount,
  requestWithdrawal,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/doctor.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

// All routes require authentication and doctor role
router.use(authMiddleware);

// Dashboard
router.get("/dashboard", wrapAsync(getDashboardData));

// Appointments
router.get("/appointments", wrapAsync(getAppointments));
router.get("/appointments/:appointmentId", wrapAsync(getAppointmentById));
router.put(
  "/appointments/:appointmentId/status",
  wrapAsync(updateAppointmentStatus),
);

// Patients
router.get("/patients", wrapAsync(getPatients));
router.get("/patients/:patientId", wrapAsync(getPatientById));

// Prescriptions
router.get("/prescriptions", wrapAsync(getPrescriptions));
router.post("/prescriptions", wrapAsync(createPrescription));

// Blogs
router.get("/blogs", wrapAsync(getBlogs));
router.post("/blogs", wrapAsync(createBlog));
router.put("/blogs/:blogId", wrapAsync(updateBlog));
router.delete("/blogs/:blogId", wrapAsync(deleteBlog));

// Settings
router.get("/settings", wrapAsync(getSettings));
router.put("/settings", wrapAsync(updateSettings));

// Payments
router.get("/payments/dashboard", wrapAsync(getPaymentDashboard));
router.get("/payments/transactions", wrapAsync(getTransactions));
router.post("/payments/bank-account", wrapAsync(addBankAccount));
router.post("/payments/withdraw", wrapAsync(requestWithdrawal));

// Notifications
router.get("/notifications", wrapAsync(getNotifications));
router.put(
  "/notifications/:notificationId/read",
  wrapAsync(markNotificationRead),
);
router.put("/notifications/read-all", wrapAsync(markAllNotificationsRead));

export default router;
