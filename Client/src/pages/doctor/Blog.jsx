import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Clock,
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Tag,
  FolderOpen,
  MoreVertical,
  Send,
  Image,
  Paperclip,
  X,
  RotateCcw,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  generateBlogPosts,
  generateBlogStats,
  generateCategories,
  generatePopularTags,
} from "../../utils/doctorBlogDummyData";

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

const categoryFilters = [
  { value: "all", label: "All Categories" },
  ...generateCategories().map((cat) => ({
    value: cat.name,
    label: cat.name,
  })),
];

export default function DoctorBlog() {
  const [allPosts] = useState(generateBlogPosts);
  const [stats] = useState(generateBlogStats);
  const [categories] = useState(generateCategories);
  const [tags] = useState(generatePopularTags);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorData, setEditorData] = useState({
    title: "",
    category: "",
    tags: "",
    excerpt: "",
    content: "",
    status: "draft",
  });

  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search) ||
          post.tags.some((tag) => tag.toLowerCase().includes(search)) ||
          post.category.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

    switch (sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.publishedDate || a.lastModified) -
            new Date(b.publishedDate || b.lastModified)
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.publishedDate || b.lastModified) -
            new Date(a.publishedDate || a.lastModified)
        );
        break;
    }

    return filtered;
  }, [allPosts, searchTerm, statusFilter, categoryFilter, sortBy]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const formatDate = (dateString) => {
    if (!dateString) return "Not published";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm || statusFilter !== "all" || categoryFilter !== "all" || sortBy !== "newest";

  const handleCreatePost = () => {
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

  const handleEditPost = (post) => {
    setEditorData({
      title: post.title,
      category: post.category,
      tags: post.tags.join(", "),
      excerpt: post.excerpt,
      content: post.content,
      status: post.status,
    });
    setSelectedPost(post._id);
    setShowEditor(true);
  };

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
            {stats.totalComments}
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
                        {categoryFilters.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
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
                {visiblePosts.length > 0 ? (
                  visiblePosts.map((post) => (
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
                              {post.status.charAt(0).toUpperCase() +
                                post.status.slice(1)}
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
                            {post.tags.map((tag, index) => (
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
                                  ? `Scheduled: ${formatDate(post.publishedDate)}`
                                  : `Modified: ${formatDate(post.lastModified)}`}
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

              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="px-6 py-2.5 bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition font-medium text-sm"
                  >
                    Load More Posts ({filteredPosts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
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
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setCategoryFilter(category.name);
                    setStatusFilter("all");
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

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => setSearchTerm(tag.name)}
                  className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              Popular Posts
            </h3>
            <div className="space-y-3">
              {allPosts
                .filter((p) => p.status === "published")
                .sort((a, b) => b.views - a.views)
                .slice(0, 4)
                .map((post) => (
                  <div key={post._id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">
                        {post.title[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatNumber(post.views)} views
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedPost ? "Edit Post" : "Create New Post"}
              </h3>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setSelectedPost(null);
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
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
                    Category
                  </label>
                  <select
                    value={editorData.category}
                    onChange={(e) =>
                      setEditorData({ ...editorData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                  Content
                </label>
                <div className="border border-gray-200 dark:border-neutral-600 rounded-lg">
                  <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-neutral-600">
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                      <Image className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <textarea
                    value={editorData.content}
                    onChange={(e) =>
                      setEditorData({ ...editorData, content: e.target.value })
                    }
                    rows={10}
                    placeholder="Write your post content here..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border-0 focus:outline-none focus:ring-0 text-sm rounded-b-lg resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditor(false);
                    setSelectedPost(null);
                  }}
                  className="px-6 py-2.5 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button className="px-6 py-2.5 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition text-sm font-medium">
                  Save as Draft
                </button>
                <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  {editorData.status === "published" ? "Publish" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}