import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const patientSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    // 🔹 Contact Info
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
    },
    address: {
      type: String,
    },

    // 🔹 Auth
    password: {
      type: String,
      required: true,
    },
    appointments : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "Appointment"
    }],

    prescriptions : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "Prescription"
    }],

    // 🔹 Medical Info
    medicalHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],

    bloodGroup: {
      type: String,
    },

    height: Number, // in cm
    weight: Number, // in kg

    allergies: [String],
    
    currentMedications: [
      {
        name: String,
        dosage: String,
      },
    ],

    // 🔹 Medical Info
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        notes: String,
      },
    ],

    // 🔹 Optional (for future)
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },
  },
  { timestamps: true },
);

patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
