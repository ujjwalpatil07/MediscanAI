import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", wrapAsync({}));

router.post("/my", authMiddleware, wrapAsync({}));

router.delete("/:id", authMiddleware, wrapAsync({}));

export default router;
