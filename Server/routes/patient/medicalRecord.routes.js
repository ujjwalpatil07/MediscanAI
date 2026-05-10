// routes/patient/medicalRecord.routes.js
import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  uploadMedicalRecord,
  getMyMedicalRecords,
  deleteMedicalRecord,
  getMedicalRecordById,
  updateMedicalRecord,
} from "../../controllers/patient/medicalRecord.controller.js";
import {
  uploadMedicalRecord as uploadMiddleware,
  handleMedicalRecordMulterError,
} from "../../config/multer.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Upload medical record
router.post(
  "/upload",
  uploadMiddleware,
  handleMedicalRecordMulterError,
  wrapAsync(uploadMedicalRecord),
);

// Get all medical records for patient
router.get("/my", wrapAsync(getMyMedicalRecords));

// Get single medical record
router.get("/:id", wrapAsync(getMedicalRecordById));

// Update medical record
router.put("/:id", wrapAsync(updateMedicalRecord));

// Delete medical record
router.delete("/:id", wrapAsync(deleteMedicalRecord));

export default router;
