import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "node:http";

import { initSocket } from "./sockets/index.js";

import authRoutes from '../Server/routes/authRoutes.js'

import { connectDB } from "./config/initDB.js";
import { corsOptions } from "./config/cors.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = initSocket(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth", authRoutes);

app.get("*", (req, res) => {
  res
    .status(502)
    .send({ result: "Hey, you are looking for a page that doesn't exist!" });
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
  