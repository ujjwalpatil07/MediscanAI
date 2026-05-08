// pages/doctor/DoctorBlog.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Clock,
  Calendar,
  BookOpen,
  Filter,
  ChevronDown,
  FolderOpen,
  X,
  RotateCcw,
  Send,
  Loader,
} from "lucide-react";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../services/doctor.service";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

const ITEMS_PER_PAGE = 6;

const statusFilters = [
  { value: "all", label: "All Posts" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
  { value: "views", label: "Most Viewed" },
  { value: "title-asc", label: "Title A-Z" },
];

export default function DoctorBlog() {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorLoading, setEditorLoading] = useState(false);
  const [editorData, setEditorData] = useState({
    title: "",
    category: "",
    tags: "",
    excerpt: "",
    content: "",
    status: "draft",
  });

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: editorData.content,
    onUpdate: ({ editor }) => {
      setEditorData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Update editor content when editing an existing post
  useEffect(() => {
    if (editor && editorData.content !== editor.getHTML()) {
      editor.commands.setContent(editorData.content);
    }
  }, [editor, editorData.content]);

  // Fetch blogs from API
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (statusFilter !== "all") params.status = statusFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (sortBy !== "newest") params.sort = sortBy;
      if (searchTerm) params.search = searchTerm;

      const response = await getBlogs(params);

      if (response.data.success) {
        setBlogs(response.data.data.blogs);
        setStats(response.data.data.stats);
        setCategories(response.data.data.categories || []);
        setPagination(response.data.data.pagination);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, sortBy, currentPage, searchTerm]);

  // Fetch blogs on mount and filter changes
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchBlogs();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not published";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "draft":
        return "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400";
      case "scheduled":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-400";
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || categoryFilter !== "all" || sortBy !== "newest";

  // Handle create/edit blog
  const handleCreatePost = () => {
    setSelectedBlog(null);
    setEditorData({
      title: "",
      category: "",
      tags: "",
      excerpt: "",
      content: "",
      status: "draft",
    });
    setShowEditor(true);
  };

  const handleEditPost = (blog) => {
    setSelectedBlog(blog);
    setEditorData({
      title: blog.title,
      category: blog.category,
      tags: blog.tags.join(", "),
      excerpt: blog.excerpt || "",
      content: blog.content,
      status: blog.status,
    });
    setShowEditor(true);
  };

  const handleSavePost = async () => {
    if (!editorData.title.trim()) {
      setError("Title is required");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!editorData.category) {
      setError("Category is required");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!editorData.content.trim()) {
      setError("Content is required");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setEditorLoading(true);
    setError(null);

    try {
      const tagsArray = editorData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);

      const blogData = {
        title: editorData.title,
        category: editorData.category,
        tags: tagsArray,
        excerpt: editorData.excerpt || editorData.content.substring(0, 200).replace(/<[^>]*>/g, ''),
        content: editorData.content,
        status: editorData.status,
      };

      if (selectedBlog) {
        await updateBlog(selectedBlog._id, blogData);
      } else {
        await createBlog(blogData);
      }

      setShowEditor(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save blog");
      setTimeout(() => setError(null), 3000);
    } finally {
      setEditorLoading(false);
    }
  };

  const handleDeletePost = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlog(blogId);
        fetchBlogs();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete blog");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const { currentPage: page, totalPages, totalItems } = pagination;
    const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(page * ITEMS_PER_PAGE, totalItems);

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-neutral-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> posts
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm rounded-md transition ${page === pageNum
                    ? "bg-green-600 text-white"
                    : "border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Blog
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage your health articles
          </p>
        </div>
        <button
          onClick={handleCreatePost}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalPosts}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total Posts
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.totalViews)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total Views
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <MessageCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.totalComments)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Comments
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.totalLikes)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Likes
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts by title, tags, or category..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${showFilters || hasActiveFilters
                    ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                    : "bg-gray-50 dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        {statusFilters.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name} ({cat.count})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {blogs.length > 0 ? (
                  blogs.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl p-5 hover:border-green-200 dark:hover:border-green-800 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(post.status)}`}
                            >
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </span>
                            {post.featured && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                                Featured
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {post.category}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {post.tags?.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.status === "published"
                                ? formatDate(post.publishedDate)
                                : post.status === "scheduled"
                                  ? `Scheduled: ${formatDate(post.scheduledDate)}`
                                  : `Modified: ${formatDate(post.updatedAt)}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </span>
                            {post.status === "published" && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {formatNumber(post.views)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {post.comments}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No posts found
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm
                        ? "Try adjusting your search or filters"
                        : "Create your first blog post to get started"}
                    </p>
                    {searchTerm ? (
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Clear filters
                      </button>
                    ) : (
                      <button
                        onClick={handleCreatePost}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Create Post
                      </button>
                    )}
                  </div>
                )}
              </div>

              {renderPagination()}
            </div>
          </div>
        </div>

        <div className="lg:w-72 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-gray-400" />
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setCategoryFilter("all");
                  setCurrentPage(1);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition ${categoryFilter === "all"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700"
                  }`}
              >
                <span>All Categories</span>
                <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                  {stats.totalPosts}
                </span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setCategoryFilter(category.name);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition ${categoryFilter === category.name
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    }`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Editor Modal with TipTap */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-4xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedBlog ? "Edit Post" : "Create New Post"}
              </h3>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setSelectedBlog(null);
                  editor?.commands.setContent("");
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editorData.title}
                  onChange={(e) =>
                    setEditorData({ ...editorData, title: e.target.value })
                  }
                  placeholder="Enter post title..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={editorData.category}
                    onChange={(e) =>
                      setEditorData({ ...editorData, category: e.target.value })
                    }
                    placeholder="e.g., Cardiology, Neurology"
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editorData.status}
                    onChange={(e) =>
                      setEditorData({ ...editorData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Publish</option>
                    <option value="scheduled">Schedule</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editorData.tags}
                  onChange={(e) =>
                    setEditorData({ ...editorData, tags: e.target.value })
                  }
                  placeholder="e.g., heart health, cardiology, prevention"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={editorData.excerpt}
                  onChange={(e) =>
                    setEditorData({ ...editorData, excerpt: e.target.value })
                  }
                  rows={3}
                  placeholder="Brief description of the post..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content *
                </label>
                <div className="border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden bg-white dark:bg-neutral-800">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700/50">
                    <button
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition ${editor?.isActive('bold') ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Bold"
                    >
                      <b className="text-sm">B</b>
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition ${editor?.isActive('italic') ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Italic"
                    >
                      <i className="text-sm">I</i>
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleStrike().run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition ${editor?.isActive('strike') ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Strikethrough"
                    >
                      <s className="text-sm">S</s>
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-neutral-600 mx-1" />

                    <button
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition text-xs font-bold ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition text-xs font-bold ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition text-xs font-bold ${editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Heading 3"
                    >
                      H3
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-neutral-600 mx-1" />

                    <button
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition ${editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Bullet List"
                    >
                      <span className="text-sm">• List</span>
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition ${editor?.isActive('orderedList') ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Numbered List"
                    >
                      <span className="text-sm">1. List</span>
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-neutral-600 mx-1" />

                    <button
                      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                      className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition ${editor?.isActive('blockquote') ? 'bg-gray-200 dark:bg-neutral-600' : ''
                        }`}
                      title="Quote"
                    >
                      <span className="text-sm">"</span>
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition"
                      title="Horizontal Line"
                    >
                      <span className="text-sm">—</span>
                    </button>

                    <div className="w-px h-6 bg-gray-300 dark:bg-neutral-600 mx-1" />

                    <button
                      onClick={() => editor?.chain().focus().undo().run()}
                      disabled={!editor?.can().undo()}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition disabled:opacity-50"
                      title="Undo"
                    >
                      <span className="text-sm">↩️</span>
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().redo().run()}
                      disabled={!editor?.can().redo()}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-neutral-600 transition disabled:opacity-50"
                      title="Redo"
                    >
                      <span className="text-sm">↪️</span>
                    </button>
                  </div>

                  {/* Editor Content */}
                  <EditorContent
                    editor={editor}
                    className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use the toolbar to format your content. You can add images, lists, headings, and more.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 pt-0">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setSelectedBlog(null);
                }}
                className="px-6 py-2.5 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePost}
                disabled={editorLoading}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {editorLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {editorData.status === "published" ? "Publish" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}