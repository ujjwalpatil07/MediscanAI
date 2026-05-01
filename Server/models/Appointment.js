import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    appointmentType: {
      type: String,
      enum: ["video", "in-person", "phone"],
      default: "video",
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled", "rescheduled"],
      default: "upcoming",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "refunded", "failed"],
      default: "pending",
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    symptoms: {
      type: String,
    },
    diagnosis: {
      type: String,
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
    notes: {
      type: String,
    },
    cancellationReason: {
      type: String,
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
