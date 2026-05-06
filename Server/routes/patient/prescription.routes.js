import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import wrapAsync from "../../utils/wrapAsync.js";
import {
  createPrescription,
  deletePrescription,
  getMyPrescriptions,
  getPrescriptionByAppointment,
  getPrescriptionById,
} from "../../controllers/patient/prescription.controller.js";

const router = express.Router();

router.get("/my", authMiddleware, wrapAsync(getMyPrescriptions));

router.get(
  "/appointment/:appointmentId",
  authMiddleware,
  wrapAsync(getPrescriptionByAppointment),
);

router.post("/create", authMiddleware, wrapAsync(createPrescription));

router.get("/:id", authMiddleware, wrapAsync(getPrescriptionById));

router.delete("/:id", authMiddleware, wrapAsync(deletePrescription));

export default router;
