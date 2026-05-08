import express from "express";
import {
  getDashboardData,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
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
  getAllDoctors,
  getDoctorById,
  getDoctorPatients,
} from "../controllers/doctor.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import wrapAsync from "../utils/wrapAsync.js";
import { getBlogById } from "../../Client/src/services/doctor.service.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ==================== DASHBOARD ====================
router.get("/dashboard", wrapAsync(getDashboardData));

// ==================== APPOINTMENTS ====================
router.get("/appointments", wrapAsync(getAppointments));
router.get("/appointments/:appointmentId", wrapAsync(getAppointmentById));
router.put(
  "/appointments/:appointmentId/status",
  wrapAsync(updateAppointmentStatus),
);

// ==================== PATIENTS ====================
// ✅ SPECIFIC routes MUST come before "/:id"
router.get("/patients", wrapAsync(getDoctorPatients));
router.get("/patients/:patientId", wrapAsync(getPatientById));

// ==================== PRESCRIPTIONS ====================
router.get("/prescriptions", wrapAsync(getPrescriptions));
router.post("/prescriptions", wrapAsync(createPrescription));

// ==================== BLOGS ====================
router.get("/blogs", wrapAsync(getBlogs));
router.get("/blogs/:blogId", wrapAsync(getBlogById));
router.post("/blogs", wrapAsync(createBlog));
router.put("/blogs/:blogId", wrapAsync(updateBlog));
router.delete("/blogs/:blogId", wrapAsync(deleteBlog));

// ==================== SETTINGS ====================
router.get("/settings", wrapAsync(getSettings));
router.put("/settings", wrapAsync(updateSettings));

// ==================== PAYMENTS ====================
router.get("/payments/dashboard", wrapAsync(getPaymentDashboard));
router.get("/payments/transactions", wrapAsync(getTransactions));
router.post("/payments/bank-account", wrapAsync(addBankAccount));
router.post("/payments/withdraw", wrapAsync(requestWithdrawal));

// ==================== NOTIFICATIONS ====================
router.get("/notifications", wrapAsync(getNotifications));
router.put(
  "/notifications/:notificationId/read",
  wrapAsync(markNotificationRead),
);
router.put("/notifications/read-all", wrapAsync(markAllNotificationsRead));

// ==================== DOCTOR PROFILE (PUBLIC) ====================
router.get("/", wrapAsync(getAllDoctors));
router.get("/:id", wrapAsync(getDoctorById));

export default router;
