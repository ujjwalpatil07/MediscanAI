import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import { updatePassword, updateProfile } from "../../controllers/patient/profile.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/update", authMiddleware, wrapAsync(updateProfile));

router.put("/change-password", authMiddleware, wrapAsync(updatePassword));

export default router;
