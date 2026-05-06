import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true, // ← This creates an index automatically
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash", "upi", "card"],
      default: "online",
    },
    paymentGateway: {
      type: String,
      enum: ["razorpay", "stripe", "cash", "none"],
      default: "none",
    },
    gatewayTransactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "processing"],
      default: "pending",
    },
    appointmentType: {
      type: String,
      enum: [
        "online",
        "clinic-visit",
        "consultation",
        "follow-up",
        "emergency",
      ],
    },
    patientName: {
      type: String,
    },
    refundReason: {
      type: String,
    },
    refundDate: {
      type: Date,
    },
    invoiceUrl: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

// Generate unique transaction ID
transactionSchema.pre("save", function (next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

// After transaction is completed, update doctor's earnings
transactionSchema.post("save", async function () {
  if (this.status === "completed") {
    const Doctor = mongoose.model("Doctor");
    await Doctor.findByIdAndUpdate(this.doctorId, {
      $inc: {
        "paymentDetails.totalEarnings": this.netAmount,
        "paymentDetails.pendingPayments": -this.netAmount,
      },
    });
  }
});

transactionSchema.index({ doctorId: 1, createdAt: -1 });
transactionSchema.index({ appointmentId: 1 });
transactionSchema.index({ status: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
