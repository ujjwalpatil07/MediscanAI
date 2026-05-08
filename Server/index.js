import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "node:http";

import { initializeSocket } from "./socket/socket.js";

import patientProfileRoutes from "./routes/patient/profile.routes.js";
import appointmentRoutes from "./routes/patient/appointment.routes.js";
import prescriptionRoutes from "./routes/patient/prescription.routes.js";
import medicalRecordRoutes from "./routes/patient/medicalRecord.routes.js";
import aiRoutes from "./routes/patient/ai.routes.js";

import doctorRoutes from "./routes/doctor.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import chatRoutes from "./routes/chat.routes.js"; 
import blogRoutes from "./routes/blog.routes.js";

import { connectDB } from "./config/initDB.js";
import { corsOptions } from "./config/cors.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = initializeSocket(server);
app.set("io", io);

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/socket-status", (req, res) => {
  const io = req.app.get("io");

  // Get Socket.IO engine stats
  const clientsCount = io?.engine?.clientsCount || 0;

  res.json({
    success: true,
    serverRunning: true,
    socketIO: {
      initialized: !!io,
      connectedClients: clientsCount,
    },
  });
});


// ------------------- PATIENT ROUTES -----------------------
app.use("/p/profile", patientProfileRoutes);
app.use("/p/appointment", appointmentRoutes);
app.use("/p/prescription", prescriptionRoutes);
app.use("/p/medical-record", medicalRecordRoutes);
app.use("/p/ai", aiRoutes);



app.use("/doctor", doctorRoutes);
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/chat", chatRoutes); 
app.use("/blogs", blogRoutes);


// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "MediscanAI API is running...",
    socketIO: !!io,
  });
});

// Socket status check
app.get("/socket-status", (req, res) => {
  const io = req.app.get("io");
  res.json({
    success: true,
    ioInitialized: !!io,
    connectedClients: io?.engine?.clientsCount || 0,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server function
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
