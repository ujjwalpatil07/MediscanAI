import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    coverImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    scheduledDate: {
      type: Date,
    },
    publishedDate: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    commentsList: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "commentsList.userModel",
        },
        userModel: {
          type: String,
          enum: ["Patient", "Doctor"],
        },
        userName: String,
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

// Auto-set published date when status changes to published
blogSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedDate
  ) {
    this.publishedDate = new Date();
  }

  // Calculate read time based on content length (avg 200 words per minute)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    this.readTime = `${minutes} min`;
  }

  next();
});

blogSchema.index({ authorId: 1, status: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1, publishedDate: -1 });
blogSchema.index({ views: -1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
