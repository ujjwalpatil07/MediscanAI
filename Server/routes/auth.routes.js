import express from "express";
import {
  patientSignup,
  patientLogin,
  doctorSignup,
  doctorLogin,
  getCurrentUser,
  updateDoctorProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateDoctorSignup } from "../middlewares/validateMiddleware.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

router.post("/patient/signup", wrapAsync(patientSignup));
router.post("/patient/login", wrapAsync(patientLogin));

router.post("/doctor/signup", validateDoctorSignup, wrapAsync(doctorSignup));
router.post("/doctor/login", wrapAsync(doctorLogin));
// Add this route
router.put("/doctor/update-profile", authMiddleware, wrapAsync(updateDoctorProfile));

router.get("/me", authMiddleware, wrapAsync(getCurrentUser));

export default router;
