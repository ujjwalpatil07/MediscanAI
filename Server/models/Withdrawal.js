import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["bank", "upi"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "rejected"],
      default: "pending",
    },
    reference: {
      type: String,
      unique: true,
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      accountHolder: String,
    },
    upiId: {
      type: String,
    },
    processedDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

// Generate reference number
withdrawalSchema.pre("save", function (next) {
  if (!this.reference) {
    const timestamp = Date.now().toString(36).toUpperCase();
    this.reference = `WDR${timestamp}`;
  }
  next();
});

withdrawalSchema.index({ doctorId: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ reference: 1 });

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;
