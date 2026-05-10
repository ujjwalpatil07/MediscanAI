import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // 🔹 Relations
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

    // 🔹 Appointment Timing (IMPROVED)
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: Date, // exact datetime
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    slotDuration: {
      type: Number, // in minutes (e.g., 30)
      default: 30,
    },

    // 🔹 Type & Status
    appointmentType: {
      type: String,
      enum: ["online", "clinic"],
      default: "clinic",
    },

    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },

    // 🔹 Payment (IMPROVED)
    consultationFee: {
      type: Number,
      required: true,
    },

    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      method: {
        type: String,
        enum: ["upi", "card", "cash"],
      },
      transactionId: String,
      paidAt: Date,
    },

    // 🔹 Medical Info
    symptoms: String,
    diagnosis: String,
    notes: String,

    // 🔹 Family Booking (VERY IMPORTANT 🔥)
    patientDetails: {
      name: String,
      age: Number,
      gender: String,
      relation: String, // father, mother, self
    },

    // 🔹 Snapshot (for fast UI)
    doctorSnapshot: {
      name: String,
      specialty: String,
      image: String,
      rating: Number,
    },

    // 🔹 Location
    location: {
      city: String,
      state: String,
      fullAddress: String,
    },

    // 🔹 Video Call
    meetingLink: String,

    // 🔹 Cancellation Tracking
    cancelledBy: {
      type: String,
      enum: ["patient", "doctor", "system"],
    },
    cancelReason: String,

    // 🔹 Prescription
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
  },
  { timestamps: true },
);

// 🔥 Prevent double booking (IMPORTANT)
appointmentSchema.index({ doctorId: 1, startTime: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
