// Server/models/AIAnalysis.js
import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userType: {
    type: String,
    enum: ["Patient", "Doctor", "patient", "doctor"], // Accept both cases
    required: true,
    set: function (value) {
      // Capitalize the first letter when saving
      if (value === "patient") return "Patient";
      if (value === "doctor") return "Doctor";
      return value;
    },
  },
  type: {
    type: String,
    enum: ["symptom", "wound"],
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
aiAnalysisSchema.index({ userId: 1, createdAt: -1 });
aiAnalysisSchema.index({ type: 1 });

const AIAnalysis = mongoose.model("AIAnalysis", aiAnalysisSchema);
export default AIAnalysis;
