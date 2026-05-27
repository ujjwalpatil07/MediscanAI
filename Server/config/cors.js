import 'dotenv/config';

import dotenv from "dotenv";

dotenv.config()

export const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "https://mediscan-ai-rose.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
