import { Server } from "socket.io";
import { corsOptions } from "../config/cors.js";

export const ACTIVE_USERS = new Map();

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log("User is disconnected!");
    });
  });

  return io;
};
