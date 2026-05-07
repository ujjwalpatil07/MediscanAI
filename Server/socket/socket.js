import { Server } from "socket.io";
import Message from "../models/Message.js";
import { verifyToken } from "../utils/token.js";
import { corsOptions } from "../config/cors.js";

let io;
const onlineUsers = new Map(); // userId -> { socketId, role }

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors : corsOptions
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log("User is disconnected!");
    });
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error("Invalid token"));
    }

    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`${socket.userRole} connected: ${socket.userId} (${socket.userRole})`);
    
    // Store online user
    onlineUsers.set(socket.userId.toString(), {
      socketId: socket.id,
      role: socket.userRole,
    });

    // Join personal room for direct messaging
    socket.join(socket.userId.toString());

    // Notify others that user is online
    socket.broadcast.emit("user:online", {
      userId: socket.userId,
      role: socket.userRole,
    });

    // ============ CHAT EVENTS ============

    // Send message
    socket.on("message:send", async (data, callback) => {
      try {
        const {
          receiverId,
          message,
          messageType = "text",
          attachmentUrl,
        } = data;

        // Create message in database
        const newMessage = await Message.create({
          senderId: socket.userId,
          senderModel: socket.userRole === "doctor" ? "Doctor" : "Patient",
          receiverId,
          receiverModel: socket.userRole === "doctor" ? "Patient" : "Doctor",
          message,
          messageType,
          attachmentUrl,
        });

        // Populate sender info
        const populatedMessage = await Message.findById(newMessage._id).lean();

        // Send to receiver if online
        const receiverData = onlineUsers.get(receiverId.toString());
        if (receiverData) {
          io.to(receiverData.socketId).emit("message:receive", {
            ...populatedMessage,
            senderId: socket.userId,
            senderRole: socket.userRole,
          });
        }

        // Send confirmation back to sender
        if (callback) {
          callback({
            success: true,
            data: populatedMessage,
          });
        }
      } catch (error) {
        if (callback) {
          callback({
            success: false,
            error: error.message,
          });
        }
      }
    });

    // Mark messages as read
    socket.on("message:read", async (data) => {
      const { conversationWith } = data;

      await Message.updateMany(
        {
          senderId: conversationWith,
          receiverId: socket.userId,
          read: false,
        },
        { read: true, readAt: new Date() },
      );

      // Notify sender that messages were read
      const senderData = onlineUsers.get(conversationWith.toString());
      if (senderData) {
        io.to(senderData.socketId).emit("message:read-receipt", {
          readBy: socket.userId,
        });
      }
    });

    // Typing indicator
    socket.on("message:typing", (data) => {
      const receiverData = onlineUsers.get(data.receiverId.toString());
      if (receiverData) {
        io.to(receiverData.socketId).emit("message:typing", {
          userId: socket.userId,
          isTyping: data.isTyping,
        });
      }
    });

    // Join conversation
    socket.on("conversation:join", (data) => {
      socket.join(`conversation:${data.conversationId}`);
    });

    // Leave conversation
    socket.on("conversation:leave", (data) => {
      socket.leave(`conversation:${data.conversationId}`);
    });

    // ============ DISCONNECT ============
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId.toString());

      // Notify others
      socket.broadcast.emit("user:offline", {
        userId: socket.userId,
      });
    });
  });

  return io;
};

// Helper to get online users
export const getOnlineUsers = () => onlineUsers;

// Helper to check if user is online
export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};

// Helper to emit event to specific user
export const emitToUser = (userId, event, data) => {
  const userData = onlineUsers.get(userId.toString());
  if (userData && io) {
    io.to(userData.socketId).emit(event, data);
  }
};

export { io };