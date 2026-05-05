import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    // 🔗 Relation
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // 📄 File Info
    title: {
      type: String,
      required: true, // e.g. "Blood Test Report"
    },

    fileUrl: {
      type: String,
      required: true, // stored on cloud (Cloudinary / S3)
    },

    fileType: {
      type: String,
      enum: ["pdf", "image"],
      default: "pdf",
    },

    // 🏥 Extra Info (optional but useful)
    doctorName: String, // who gave this report
    hospitalName: String, // where test was done

    // 📅 Date
    recordDate: {
      type: Date,
      default: Date.now,
    },

    notes: String, // optional description
  },
  { timestamps: true },
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;
