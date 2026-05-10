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

// ==================== DASHBOARD ====================
router.get("/dashboard",authMiddleware, wrapAsync(getDashboardData));

// ==================== APPOINTMENTS ====================
router.get("/appointments",authMiddleware, wrapAsync(getAppointments));
router.get("/appointments/:appointmentId",authMiddleware, wrapAsync(getAppointmentById));
router.put(
  "/appointments/:appointmentId/status",
  wrapAsync(updateAppointmentStatus),
);

// ==================== PATIENTS ====================
// ✅ SPECIFIC routes MUST come before "/:id"
router.get("/patients",authMiddleware, wrapAsync(getDoctorPatients));
router.get("/patients/:patientId",authMiddleware, wrapAsync(getPatientById));

// ==================== PRESCRIPTIONS ====================
router.get("/prescriptions",authMiddleware, wrapAsync(getPrescriptions));
router.post("/prescriptions",authMiddleware, wrapAsync(createPrescription));

// ==================== BLOGS ====================
router.get("/blogs",authMiddleware, wrapAsync(getBlogs));
router.get("/blogs/:blogId",authMiddleware, wrapAsync(getBlogById));
router.post("/blogs",authMiddleware, wrapAsync(createBlog));
router.put("/blogs/:blogId",authMiddleware, wrapAsync(updateBlog));
router.delete("/blogs/:blogId",authMiddleware, wrapAsync(deleteBlog));

// ==================== SETTINGS ====================
router.get("/settings",authMiddleware, wrapAsync(getSettings));
router.put("/settings",authMiddleware, wrapAsync(updateSettings));

// ==================== PAYMENTS ====================
router.get("/payments/dashboard",authMiddleware, wrapAsync(getPaymentDashboard));
router.get("/payments/transactions",authMiddleware, wrapAsync(getTransactions));
router.post("/payments/bank-account",authMiddleware, wrapAsync(addBankAccount));
router.post("/payments/withdraw",authMiddleware, wrapAsync(requestWithdrawal));

// ==================== NOTIFICATIONS ====================
router.get("/notifications",authMiddleware, wrapAsync(getNotifications));
router.put(
  "/notifications/:notificationId/read",
  wrapAsync(markNotificationRead),
);
router.put("/notifications/read-all",authMiddleware, wrapAsync(markAllNotificationsRead));

// ==================== DOCTOR PROFILE (PUBLIC) ====================
router.get("/", wrapAsync(getAllDoctors));
router.get("/:id", wrapAsync(getDoctorById));

export default router;
