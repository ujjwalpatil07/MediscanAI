// Server/routes/ai.routes.js
import express from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import wrapAsync from "../utils/wrapAsync.js";
import {
  healthCheck,
  analyzeSymptoms,
  streamAnalyze,
  analyzeWound,
  getAnalysisHistory,
  saveAnalysis,
  deleteAnalysis,
} from "../controllers/ai.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ==================== HEALTH CHECK ====================
router.get("/health", wrapAsync(healthCheck));

// ==================== SYMPTOM ANALYSIS ====================
router.post("/analyze-symptoms", authMiddleware, wrapAsync(analyzeSymptoms));

// ==================== STREAMING SYMPTOM ANALYSIS ====================
router.post("/stream-analyze", authMiddleware, wrapAsync(streamAnalyze));

// ==================== WOUND ANALYSIS ====================
router.post(
  "/analyze-wound",
  authMiddleware,
  upload.single("image"),
  wrapAsync(analyzeWound),
);

// ==================== ANALYSIS HISTORY ====================
router.get("/history", authMiddleware, wrapAsync(getAnalysisHistory));

// ==================== SAVE ANALYSIS ====================
router.post("/save-analysis", authMiddleware, wrapAsync(saveAnalysis));

// ==================== DELETE ANALYSIS ====================
router.delete(
  "/analysis/:analysisId",
  authMiddleware,
  wrapAsync(deleteAnalysis),
);

export default router;
