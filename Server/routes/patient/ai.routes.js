import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import wrapAsync from "../../utils/wrapAsync.js";

const router = express.Router();

router.post("/symptom-check", authMiddleware, wrapAsync({}));

router.post("/ask", authMiddleware, wrapAsync({}));

export default router;
