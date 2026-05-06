import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Patient", "Doctor"],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Patient", "Doctor"],
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "prescription", "appointment"],
      default: "text",
    },
    attachmentUrl: {
      type: String,
    },
    attachmentName: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    conversationId: {
      type: String,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

// Generate conversation ID (sorted participant IDs)
messageSchema.pre("save", function (next) {
  if (!this.conversationId) {
    const participants = [
      this.senderId.toString(),
      this.receiverId.toString(),
    ].sort();
    this.conversationId = participants.join("_");
  }
  next();
});

// After message created, update unread count for receiver
messageSchema.post("save", async function () {
  if (!this.read && this.receiverModel === "Doctor") {
    // Could emit socket event here
  }
});

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, read: 1 });
messageSchema.index({ senderId: 1, receiverId: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
