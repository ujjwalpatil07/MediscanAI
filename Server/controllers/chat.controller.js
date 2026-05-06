import Message from "../models/Message.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import mongoose from "mongoose";

// Get all conversations for a user
export const getConversations = async (req, res) => {
  const userId = req.user.id;
  const userModel = req.user.role === "doctor" ? "Doctor" : "Patient";

  // Find all unique conversations
  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [
          { senderId: new mongoose.Types.ObjectId(userId) },
          { receiverId: new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
            "$receiverId",
            "$senderId",
          ],
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", new mongoose.Types.ObjectId(userId)] },
                  { $eq: ["$read", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: { "lastMessage.createdAt": -1 },
    },
  ]);

  // Get user details for each conversation
  const conversationDetails = await Promise.all(
    conversations.map(async (conv) => {
      const otherUserId = conv._id;
      let userDetails = null;

      // Try to find in Doctor collection first
      userDetails = await Doctor.findById(otherUserId)
        .select("firstName lastName profilePhoto specialty isActive")
        .lean();

      // If not found, try Patient collection
      if (!userDetails) {
        userDetails = await Patient.findById(otherUserId)
          .select("firstName lastName gender")
          .lean();
      }

      return {
        userId: otherUserId,
        user: userDetails,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
      };
    }),
  );

  res.status(200).json({
    success: true,
    data: conversationDetails,
  });
};

// Get messages between two users
export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { userId: otherUserId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
    $or: [{ deletedFor: { $ne: userId } }, { deletedFor: { $exists: false } }],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Mark messages as read
  await Message.updateMany(
    {
      senderId: otherUserId,
      receiverId: userId,
      read: false,
    },
    { read: true, readAt: new Date() },
  );

  res.status(200).json({
    success: true,
    data: messages.reverse(), // Return in chronological order
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(messages.length / parseInt(limit)),
    },
  });
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  const userId = req.user.id;

  const count = await Message.countDocuments({
    receiverId: userId,
    read: false,
  });

  res.status(200).json({
    success: true,
    data: { unreadCount: count },
  });
};

// Mark conversation as read
export const markConversationRead = async (req, res) => {
  const userId = req.user.id;
  const { userId: otherUserId } = req.params;

  await Message.updateMany(
    {
      senderId: otherUserId,
      receiverId: userId,
      read: false,
    },
    { read: true, readAt: new Date() },
  );

  res.status(200).json({
    success: true,
    message: "Messages marked as read",
  });
};

// Delete message (soft delete)
export const deleteMessage = async (req, res) => {
  const userId = req.user.id;
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Message not found",
    });
  }

  // Only sender can delete
  if (message.senderId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own messages",
    });
  }

  // Soft delete
  message.deletedFor.push(userId);
  message.isDeleted = message.deletedFor.length >= 2;
  await message.save();

  res.status(200).json({
    success: true,
    message: "Message deleted",
  });
};
