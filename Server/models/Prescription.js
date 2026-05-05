import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: String,            // "500mg"
    frequency: String,         // "Twice daily"
    duration: String,          // "7 days"
    instructions: String,      // Notes for patient
    quantity: String,          // "30 tablets"
    refills: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    // 🔗 Relations
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // 👤 Patient Snapshot (IMPORTANT for history)
    patientSnapshot: {
      name: String,
      relation: String, // self / father / mother etc.
      age: Number,
    },

    // 👨‍⚕️ Doctor Snapshot (optional but useful)
    doctorSnapshot: {
      name: String,
      specialty: String,
    },

    // 📅 Prescription Info
    date: {
      type: Date,
      default: Date.now,
    },

    appointmentType: {
      type: String,
      enum: ["video", "clinic"],
    },

    notes: String,

    // 💊 Medicines List
    medicines: [medicineSchema],
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;