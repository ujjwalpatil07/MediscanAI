import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import { getLandingStats } from "../controllers/public.controller.js";

const router = express.Router();

router.get("/stats", wrapAsync(getLandingStats));

export default router;