import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    // 🔹 Auth Info (Step 1)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // 🔹 Personal Info (Step 2)
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
    phone: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    // 🔹 Professional Info (Step 3)
    specialty: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
    },
    medicalDegree: {
      type: String,
    },
    bio: {
      type: String,
    },

    // 🔹 Consultation Info (Step 4)
    consultationFee: {
      type: Number,
      required: true,
    },
    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    availableTimeSlots: {
      start: String, // "09:00"
      end: String, // "18:00"
    },

    // 🔹 Clinic Info
    clinicAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    hospital: {
      type: String,
    },

    // 🔹 Media
    profileImage: {
      type: String,
    },

    // 🔹 Documents (Verification)
    documents: {
      degreeCertificate: String,
      idProof: String,
    },

    // 🔹 System Fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalConsultations: {
      type: Number,
      default: 0,
    },

    // 🔹 Languages
    languages: [String],

    // 🔹 Relations (IMPORTANT for future)
    appointments: [
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
  },
  { timestamps: true },
);

// 🔐 Hash password
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Match password
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
