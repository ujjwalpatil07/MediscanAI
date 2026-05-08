import Blog from "../models/Blog.js";

export const getAllPublicBlogs = async (req, res) => {
  const {
    category,
    tag,
    search,
    sort = "newest",
    page = 1,
    limit = 10,
  } = req.query;

  const query = { status: "published" };

  if (category && category !== "all") {
    query.category = category;
  }

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  let sortOption = {};
  switch (sort) {
    case "popular":
      sortOption = { views: -1, likes: -1 };
      break;
    case "oldest":
      sortOption = { publishedDate: 1 };
      break;
    case "newest":
    default:
      sortOption = { publishedDate: -1 };
      break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("authorId", "firstName lastName profilePhoto specialty")
      .lean(),
    Blog.countDocuments(query),
  ]);

  // Get categories and tags for sidebar
  const categories = await Blog.aggregate([
    { $match: { status: "published" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const tags = await Blog.aggregate([
    { $match: { status: "published" } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({
    success: true,
    data: {
      blogs,
      categories: categories.map((c) => ({ name: c._id, count: c.count })),
      tags: tags.map((t) => ({ name: t._id, count: t.count })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
};

// Get single blog (public)
export const getPublicBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Increment view count
    await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });

    const blog = await Blog.findOne({
      _id: blogId,
      status: "published",
    })
      .populate("authorId", "firstName lastName profilePhoto specialty bio")
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Get related blogs (same category)
    const relatedBlogs = await Blog.find({
      _id: { $ne: blogId },
      category: blog.category,
      status: "published",
    })
      .limit(3)
      .select("title excerpt publishedDate views likes coverImage")
      .lean();

    // Check if current user has liked the blog
    let userLiked = false;
    if (req.user) {
      userLiked =
        blog.likedBy?.some((like) => like.userId.toString() === req.user.id) ||
        false;
    }

    res.status(200).json({
      success: true,
      data: {
        blog: {
          ...blog,
          userLiked,
        },
        relatedBlogs,
      },
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

// Like/Unlike blog
export const likeBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.id;
  const userModel = req.user.role === "patient" ? "Patient" : "Doctor";

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  const hasLiked = blog.likedBy.some((id) => id.toString() === userId);

  if (hasLiked) {
    // Unlike
    await Blog.findByIdAndUpdate(blogId, {
      $pull: { likedBy: userId },
      $inc: { likes: -1 },
    });
    return res.status(200).json({
      success: true,
      message: "Blog unliked",
      liked: false,
    });
  } else {
    // Like
    await Blog.findByIdAndUpdate(blogId, {
      $push: { likedBy: userId },
      $inc: { likes: 1 },
    });
    return res.status(200).json({
      success: true,
      message: "Blog liked",
      liked: true,
    });
  }
};

// Add comment to blog
export const addComment = async (req, res) => {
  const { blogId } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;
  const userModel = req.user.role === "patient" ? "Patient" : "Doctor";
  const userName = `${req.user.firstName} ${req.user.lastName}`;

  if (!comment || comment.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Comment cannot be empty",
    });
  }

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: {
        commentsList: {
          userId,
          userModel,
          userName,
          comment: comment.trim(),
          date: new Date(),
        },
      },
      $inc: { comments: 1 },
    },
    { new: true },
  ).populate("commentsList.userId", "firstName lastName profilePhoto");

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  const newComment = blog.commentsList[blog.commentsList.length - 1];

  res.status(200).json({
    success: true,
    message: "Comment added successfully",
    data: newComment,
  });
};

// Like/Unlike blog
export const toggleLikeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === "patient" ? "Patient" : "Doctor";
    
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    const hasLiked = blog.likedBy?.some(
      like => like.userId.toString() === userId
    );
    
    if (hasLiked) {
      // Unlike
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { likedBy: { userId } },
        $inc: { likes: -1 }
      });
      
      res.status(200).json({
        success: true,
        message: "Blog unliked",
        liked: false,
        likes: blog.likes - 1
      });
    } else {
      // Like
      await Blog.findByIdAndUpdate(blogId, {
        $push: { 
          likedBy: { 
            userId, 
            userModel, 
            likedAt: new Date() 
          } 
        },
        $inc: { likes: 1 }
      });
      
      res.status(200).json({
        success: true,
        message: "Blog liked",
        liked: true,
        likes: blog.likes + 1
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process like"
    });
  }
};

// Add comment to blog
export const addCommentToBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const userModel = req.user.role === "patient" ? "Patient" : "Doctor";
    const userName = `${req.user.firstName} ${req.user.lastName}`;
    const userAvatar = req.user.profilePhoto || null;
    
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty"
      });
    }
    
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: {
          commentsList: {
            userId,
            userModel,
            userName,
            userAvatar,
            comment: comment.trim(),
            createdAt: new Date(),
            likes: [],
            replies: []
          }
        },
        $inc: { comments: 1 }
      },
      { new: true }
    ).populate("commentsList.userId", "firstName lastName profilePhoto");
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    const newComment = blog.commentsList[blog.commentsList.length - 1];
    
    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: newComment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment"
    });
  }
};

// Get comments for a blog (with pagination)
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const blog = await Blog.findById(blogId)
      .select("commentsList")
      .lean();
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    const comments = blog.commentsList || [];
    const sortedComments = comments.sort((a, b) => b.createdAt - a.createdAt);
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginatedComments = sortedComments.slice(start, start + parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: {
        comments: paginatedComments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(comments.length / parseInt(limit)),
          totalComments: comments.length,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments"
    });
  }
};

// Delete comment (only author or blog author can delete)
export const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user.id;
    
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    const comment = blog.commentsList.id(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }
    
    // Check if user is comment author or blog author
    const isCommentAuthor = comment.userId.toString() === userId;
    const isBlogAuthor = blog.authorId.toString() === userId;
    
    if (!isCommentAuthor && !isBlogAuthor) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this comment"
      });
    }
    
    await Blog.findByIdAndUpdate(blogId, {
      $pull: { commentsList: { _id: commentId } },
      $inc: { comments: -1 }
    });
    
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment"
    });
  }
};

// Share blog
export const shareBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    await Blog.findByIdAndUpdate(blogId, {
      $inc: { shareCount: 1 }
    });
    
    res.status(200).json({
      success: true,
      message: "Share counted"
    });
  } catch (error) {
    console.error("Error sharing blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record share"
    });
  }
};

// Get all published blogs (for public view)
export const getAllPublishedBlogs = async (req, res) => {
  try {
    const {
      category,
      tag,
      search,
      sort = "newest",
      page = 1,
      limit = 9
    } = req.query;
    
    const query = { status: "published" };
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }
    
    let sortOption = {};
    switch (sort) {
      case "popular":
        sortOption = { likes: -1, views: -1 };
        break;
      case "oldest":
        sortOption = { publishedDate: 1 };
        break;
      case "trending":
        sortOption = { views: -1, likes: -1 };
        break;
      case "newest":
      default:
        sortOption = { publishedDate: -1 };
        break;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("authorId", "firstName lastName profilePhoto specialty")
        .lean(),
      Blog.countDocuments(query)
    ]);
    
    // Get categories and tags for sidebar
    const categories = await Blog.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const tags = await Blog.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        blogs,
        categories: categories.map(c => ({ name: c._id, count: c.count })),
        tags: tags.map(t => ({ name: t._id, count: t.count })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs"
    });
  }
};