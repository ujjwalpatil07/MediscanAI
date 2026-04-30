import express from "express";
import {
  patientSignup,
  patientLogin,
  getCurrentPatient,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/patient/signup", patientSignup);
router.post("/patient/login", patientLogin);
router.get("/patient/me", authMiddleware, getCurrentPatient);

export default router;
