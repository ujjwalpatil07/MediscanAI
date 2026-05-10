// pages/BlogView.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Clock,
  User,
  Tag,
  ChevronLeft,
  Loader,
  Send,
  MoreVertical,
  Trash2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  X
} from "lucide-react";
import { format } from "date-fns";
import api from "../../api/api";

export default function BlogView() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${blogId}`);
      if (response.data.success) {
        setBlog(response.data.data.blog);
        setRelatedBlogs(response.data.data.relatedBlogs);
        setLiked(response.data.data.blog.userLiked || false);
        setLikesCount(response.data.data.blog.likes || 0);
        setComments(response.data.data.blog.commentsList || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/blogs/${blogId}/like`);
      if (response.data.success) {
        setLiked(response.data.liked);
        setLikesCount(response.data.likes);
      }
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/blogs/${blogId}/comment`, {
        comment: newComment
      });
      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/blogs/${blogId}/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = blog.title;
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }

    // Track share count
    try {
      await api.post(`/blogs/${blogId}/share`);
    } catch (err) {
      console.error("Error tracking share:", err);
    }

    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Loader className="w-12 h-12 text-green-600 dark:text-green-500 animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Blog not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Author Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
            {blog.authorId?.profilePhoto ? (
              <img
                src={blog.authorId.profilePhoto}
                alt={blog.authorName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-green-600 dark:text-green-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Dr. {blog.authorName}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {blog.authorId?.specialty || "Medical Professional"}
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(blog.publishedDate), "MMMM dd, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {blog.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {blog.views} views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {likesCount} likes
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {blog.comments} comments
          </span>
        </div>

        {/* Category & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            {blog.category}
          </span>
          {blog.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-8 prose-neutral dark:prose-neutral"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 py-8 border-y border-neutral-200 dark:border-neutral-700">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition ${liked
              ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>

            {showShareMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowShareMenu(false)}
                />
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-2 z-20 min-w-[200px]">
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded flex items-center gap-2 transition"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded flex items-center gap-2 transition"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded flex items-center gap-2 transition"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded flex items-center gap-2 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-6 border-b border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab("comments")}
              className={`pb-2 text-sm font-medium transition ${activeTab === "comments"
                ? "text-green-600 dark:text-green-500 border-b-2 border-green-600 dark:border-green-500"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
            >
              Comments ({blog.comments})
            </button>
            <button
              onClick={() => setActiveTab("related")}
              className={`pb-2 text-sm font-medium transition ${activeTab === "related"
                ? "text-green-600 dark:text-green-500 border-b-2 border-green-600 dark:border-green-500"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
            >
              Related Articles
            </button>
          </div>

          {activeTab === "comments" && (
            <>
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 resize-none transition"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Post Comment
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                            {comment.userAvatar ? (
                              <img
                                src={comment.userAvatar}
                                alt={comment.userName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-neutral-900 dark:text-white">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {format(new Date(comment.createdAt), "MMM dd, yyyy")}
                              </span>
                            </div>
                            <p className="text-neutral-700 dark:text-neutral-300">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                        {(comment.userId === JSON.parse(localStorage.getItem("user"))?.id ||
                          blog.authorId._id === JSON.parse(localStorage.getItem("user"))?.id) && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                            >
                              <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                            </button>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                    <p className="text-neutral-500 dark:text-neutral-400">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "related" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blogs/${relatedBlog._id}`}
                  className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 hover:border-green-300 dark:hover:border-green-700 transition group"
                >
                  {relatedBlog.coverImage && (
                    <img
                      src={relatedBlog.coverImage}
                      alt={relatedBlog.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-500 transition">
                    {relatedBlog.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-2">
                    {relatedBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {relatedBlog.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {relatedBlog.likes}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}