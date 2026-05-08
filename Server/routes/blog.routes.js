// routes/blog.routes.js
import express from "express";
import {
  getAllPublishedBlogs,
  getPublicBlogById,
  toggleLikeBlog,
  addCommentToBlog,
  getBlogComments,
  deleteComment,
  shareBlog,
} from "../controllers/blog.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

// Public routes (no auth required for viewing)
router.get("/", wrapAsync(getAllPublishedBlogs));
router.get("/:blogId", wrapAsync(getPublicBlogById));

// Protected routes (require auth for interaction)
router.post("/:blogId/like", authMiddleware, wrapAsync(toggleLikeBlog));
router.post("/:blogId/comment", authMiddleware, wrapAsync(addCommentToBlog));
router.get("/:blogId/comments", authMiddleware, wrapAsync(getBlogComments));
router.delete(
  "/:blogId/comments/:commentId",
  authMiddleware,
  wrapAsync(deleteComment),
);
router.post("/:blogId/share", authMiddleware, wrapAsync(shareBlog));

export default router;
