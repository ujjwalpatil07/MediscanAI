import express from "express";
import {
  getConversations,
  getMessages,
  getUnreadCount,
  deleteMessage,
  markConversationRead,
} from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

router.use(authMiddleware);

// Get all conversations for logged-in user
router.get("/conversations", wrapAsync(getConversations));

// Get messages with specific user
router.get("/messages/:userId", wrapAsync(getMessages));

// Get unread message count
router.get("/unread-count", wrapAsync(getUnreadCount));

// Mark conversation as read
router.put("/conversation/:userId/read", wrapAsync(markConversationRead));

// Delete message
router.delete("/messages/:messageId", wrapAsync(deleteMessage));

export default router;
