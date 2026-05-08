// models/Blog.js - Add these fields if not already present
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
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "likedBy.userModel",
        },
        userModel: {
          type: String,
          enum: ["Patient", "Doctor"],
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    commentsList: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "commentsList.userModel",
          required: true,
        },
        userModel: {
          type: String,
          enum: ["Patient", "Doctor"],
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        userAvatar: {
          type: String,
        },
        comment: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        replies: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              refPath: "commentsList.replies.userModel",
            },
            userModel: String,
            userName: String,
            comment: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],

    shareCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// ✅ Add indexes for better query performance
blogSchema.index({ status: 1, publishedDate: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ "commentsList.createdAt": -1 });

// Auto-set published date and calculate read time
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
    const wordCount = this.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }

  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
