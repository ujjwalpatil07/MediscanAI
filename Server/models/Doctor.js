// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const doctorSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//     phone: {
//       type: String,
//     },
//     dob: {
//       type: Date,
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//     },
//     specialty: {
//       type: String,
//     },
//     licenseNumber: {
//       type: String,
//     },
//     yearsOfExperience: {
//       type: Number,
//     },
//     medicalDegree: {
//       type: String,
//     },
//     consultationFee: {
//       type: Number,
//     },
//     availableDays: [String],
//     availableTimeSlots: {
//       start: String,
//       end: String,
//     },
//     clinicAddress: {
//       street: String,
//       city: String,
//       state: String,
//       pincode: String,
//     },
//     degreeCertificate: {
//       type: String,
//     },
//     idProof: {
//       type: String,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     rating: {
//       type: Number,
//       default: 0,
//     },
//     totalConsultations: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// doctorSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// doctorSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const Doctor = mongoose.model("Doctor", doctorSchema);
// export default Doctor;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    // Auth
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

    // Personal Information
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
    bloodGroup: {
      type: String,
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    profilePhoto: {
      type: String,
      default: null,
    },

    // Professional Information
    specialty: {
      type: String,
    },
    subSpecialty: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },
    medicalDegree: {
      type: String,
    },
    university: {
      type: String,
    },
    graduationYear: {
      type: Number,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    languages: [
      {
        type: String,
      },
    ],
    certifications: [
      {
        type: String,
      },
    ],
    memberships: [
      {
        type: String,
      },
    ],

    // Clinic Information
    clinicName: {
      type: String,
    },
    clinicAddress: {
      type: String,
    },
    clinicCity: {
      type: String,
    },
    clinicState: {
      type: String,
    },
    clinicPincode: {
      type: String,
    },
    clinicPhone: {
      type: String,
    },
    clinicEmail: {
      type: String,
      lowercase: true,
    },
    clinicWebsite: {
      type: String,
    },
    clinicTimings: {
      monday: {
        start: { type: String },
        end: { type: String },
      },
      tuesday: {
        start: { type: String },
        end: { type: String },
      },
      wednesday: {
        start: { type: String },
        end: { type: String },
      },
      thursday: {
        start: { type: String },
        end: { type: String },
      },
      friday: {
        start: { type: String },
        end: { type: String },
      },
      saturday: {
        start: { type: String },
        end: { type: String },
      },
      sunday: {
        start: { type: String },
        end: { type: String },
      },
    },

    // Availability
    availableDays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
    ],
    availableTimeSlots: {
      start: { type: String },
      end: { type: String },
    },

    // Documents
    degreeCertificate: {
      type: String,
    },
    idProof: {
      type: String,
    },
    // Add these to the Documents section
    profilePhotoPublicId: {
      type: String,
    },
    degreeCertificatePublicId: {
      type: String,
    },
    idProofPublicId: {
      type: String,
    },

    // References to other collections
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    withdrawals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Withdrawal",
      },
    ],

    // Stats & Ratings
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalPatients: {
      type: Number,
      default: 0,
    },
    totalAppointments: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
    },
    publications: {
      type: Number,
      default: 0,
    },
    awards: {
      type: Number,
      default: 0,
    },

    // Account Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
    },

    // Reviews (Embedded)
    reviews: [
      {
        patientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Patient",
        },
        patientName: {
          type: String,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
        },
        appointmentType: {
          type: String,
          enum: ["online", "clinic-visit"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Activity Log (Embedded)
    recentActivity: [
      {
        action: {
          type: String,
        },
        description: {
          type: String,
        },
        icon: {
          type: String,
          enum: [
            "calendar",
            "file-text",
            "user-plus",
            "book-open",
            "settings",
            "message",
            "payment",
            "prescription",
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Settings
    settings: {
      notifications: {
        emailNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: false },
        appointmentReminders: { type: Boolean, default: true },
        newPatientAlerts: { type: Boolean, default: true },
        messageAlerts: { type: Boolean, default: true },
        paymentAlerts: { type: Boolean, default: true },
        reminderTime: { type: String, default: "30" },
        dailySummary: { type: Boolean, default: true },
        weeklyReport: { type: Boolean, default: false },
        urgentOnly: { type: Boolean, default: false },
      },
      appointments: {
        autoAccept: { type: Boolean, default: false },
        requireConfirmation: { type: Boolean, default: true },
        allowRescheduling: { type: Boolean, default: true },
        maxPatientsPerDay: { type: Number, default: 20 },
        appointmentDuration: { type: Number, default: 30 },
        bufferTime: { type: Number, default: 10 },
        onlineConsultation: { type: Boolean, default: true },
        clinicVisit: { type: Boolean, default: true },
        allowEmergency: { type: Boolean, default: true },
        advanceBookingDays: { type: Number, default: 30 },
      },
      privacy: {
        showProfileInSearch: { type: Boolean, default: true },
        showExperience: { type: Boolean, default: true },
        showReviews: { type: Boolean, default: true },
        showFees: { type: Boolean, default: true },
        twoFactorAuth: { type: Boolean, default: false },
        sessionTimeout: { type: String, default: "30" },
        loginAlerts: { type: Boolean, default: true },
        dataSharing: { type: Boolean, default: false },
      },
      messages: {
        allowPatientMessages: { type: Boolean, default: true },
        autoReply: { type: Boolean, default: false },
        autoReplyMessage: { type: String },
        messageForwarding: { type: Boolean, default: false },
        forwardingEmail: { type: String },
        chatAvailability: {
          type: String,
          enum: ["always", "business-hours", "custom"],
          default: "always",
        },
        allowAttachments: { type: Boolean, default: true },
      },
      patientManagement: {
        autoSharePrescriptions: { type: Boolean, default: true },
        allowPatientNotes: { type: Boolean, default: true },
        patientCanUpload: { type: Boolean, default: true },
        showVisitHistory: { type: Boolean, default: true },
        showLabResults: { type: Boolean, default: true },
        allowPatientFeedback: { type: Boolean, default: true },
        newPatientApproval: { type: Boolean, default: false },
      },
    },

    // Payment Information
    paymentDetails: {
      bankAccounts: [
        {
          bankName: { type: String },
          accountHolder: { type: String },
          accountNumber: { type: String },
          ifscCode: { type: String },
          isDefault: { type: Boolean, default: false },
        },
      ],
      upiId: { type: String },
      totalEarnings: { type: Number, default: 0 },
      totalWithdrawn: { type: Number, default: 0 },
      pendingPayments: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

// Hash password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for full name
doctorSchema.virtual("fullName").get(function () {
  return `Dr. ${this.firstName} ${this.lastName}`;
});

// Virtual for calculating profile completion
doctorSchema.virtual("calculateProfileCompletion").get(function () {
  let completed = 0;
  const total = 15;

  if (this.firstName && this.lastName) completed++;
  if (this.email) completed++;
  if (this.phone) completed++;
  if (this.specialty) completed++;
  if (this.licenseNumber) completed++;
  if (this.medicalDegree) completed++;
  if (this.yearsOfExperience) completed++;
  if (this.consultationFee) completed++;
  if (this.bio) completed++;
  if (this.clinicName) completed++;
  if (this.clinicAddress) completed++;
  if (this.availableDays?.length > 0) completed++;
  if (this.profilePhoto) completed++;
  if (this.degreeCertificate) completed++;
  if (this.idProof) completed++;

  return Math.round((completed / total) * 100);
});

// Method to add activity
doctorSchema.methods.addActivity = function (action, description, icon) {
  this.recentActivity.unshift({
    action,
    description,
    icon,
    timestamp: new Date(),
  });

  // Keep only last 20 activities
  if (this.recentActivity.length > 20) {
    this.recentActivity = this.recentActivity.slice(0, 20);
  }

  return this.save();
};

// Method to update stats
doctorSchema.methods.updateStats = async function () {
  const Appointment = mongoose.model("Appointment");
  const Patient = mongoose.model("Patient");

  this.totalAppointments = await Appointment.countDocuments({
    doctorId: this._id,
  });
  this.totalPatients = await Patient.countDocuments({
    _id: { $in: this.patients },
  });

  return this.save();
};

// Indexes for better performance
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ "clinicInfo.city": 1 });
doctorSchema.index({ rating: -1 });
doctorSchema.index({ consultationFee: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;