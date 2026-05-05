import express from "express";
import {
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  uploadProfilePhoto as uploadPhotoMiddleware,
  handleMulterError,
} from "../config/multer.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

// Profile photo routes
router.post(
  "/profile-photo",
  authMiddleware,
  (req, res, next) => {
    uploadPhotoMiddleware(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  wrapAsync(uploadProfilePhoto),
);

router.delete("/profile-photo", authMiddleware, wrapAsync(deleteProfilePhoto));


export default router;
