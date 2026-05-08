import express from "express";

import wrapAsync from "../../utils/wrapAsync.js";

import {
  updatePassword,
  updateProfile,
  getProfile,
  sendVerificationOtp,
  verifyEmail,
} from "../../controllers/patient/profile.controller.js";

import { authMiddleware } from "../../middlewares/authMiddleware.js";

import { uploadProfilePhoto, handleMulterError } from "../../config/multer.js";

const router = express.Router();

router.get("/", authMiddleware, wrapAsync(getProfile));

router.put(
  "/update",
  authMiddleware,
  uploadProfilePhoto,
  handleMulterError,
  wrapAsync(updateProfile),
);

router.put("/change-password", authMiddleware, wrapAsync(updatePassword));

router.post("/send-otp", authMiddleware, wrapAsync(sendVerificationOtp));

router.post("/verify-email", authMiddleware, wrapAsync(verifyEmail));

export default router;
