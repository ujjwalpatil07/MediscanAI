// import express from "express";
// import {
//   patientSignup,
//   patientLogin,
//   getCurrentPatient,
// } from "../controllers/auth.controller.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/patient/signup", patientSignup);
// router.post("/patient/login", patientLogin);
// router.get("/patient/me", authMiddleware, getCurrentPatient);

// export default router;

import express from "express";
import {
  patientSignup,
  patientLogin,
  getCurrentPatient,
  doctorSignup,
  doctorLogin,
  getCurrentDoctor,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

router.post("/patient/signup",wrapAsync(patientSignup));
router.post("/patient/login", wrapAsync(patientLogin));
router.get("/patient/me", authMiddleware, wrapAsync(getCurrentPatient));

router.post("/doctor/signup", wrapAsync(doctorSignup));
router.post("/doctor/login", wrapAsync(doctorLogin));
router.get("/doctor/me", authMiddleware, wrapAsync(getCurrentDoctor));

router.get("/me", authMiddleware, wrapAsync(getCurrentUser));


export default router;