import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  bookAppointment,
  cancelAppointment,
  getAppointmentById,
  getAvailableSlots,
  getMyAppointments,
  markAsPaid,
} from "../../controllers/patient/appointment.controller.js";

const router = express.Router();

router.post("/book", authMiddleware, wrapAsync(bookAppointment));

router.get(
  "/available-slots/:doctorId",
  authMiddleware,
  wrapAsync(getAvailableSlots),
);

router.get("/my", authMiddleware, wrapAsync(getMyAppointments)); // Get all my appointments

router.get("/:id", authMiddleware, wrapAsync(getAppointmentById)); // get single appointment details

router.put("/cancel/:id", authMiddleware, wrapAsync(cancelAppointment)); // cancel appointment

router.put("/pay/:id", authMiddleware, wrapAsync(markAsPaid)); // mark as paid

export default router;
