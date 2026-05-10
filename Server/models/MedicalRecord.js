import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Lab Report", "Scan", "Prescription", "Vaccination", "Other"],
      default: "Lab Report",
    },
    date: {
      type: Date,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "image"],
      required: true,
    },
    fileMimeType: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filePublicId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    doctorName: {
      type: String,
      trim: true,
    },
    hospitalName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ patientId: 1, category: 1 });

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;