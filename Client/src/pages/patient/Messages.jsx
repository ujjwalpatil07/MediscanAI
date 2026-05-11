// pages/patient/PatientMessages.jsx
import { useState, useMemo, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  Video,
  Send,
  Paperclip,
  MoreVertical,
  ChevronDown,
  User,
  Check,
  CheckCheck,
  ArrowLeft,
  MessageCircle,
  Filter,
  Star,
  Archive,
  Trash2,
  Ban,
  Stethoscope,
  X,
  Smile,
  Mic,
  Image,
  File,
  Clock,
  Calendar,
  Shield,
  Heart,
  Activity,
  Users,
  Sparkles,
  TrendingUp,
  GraduationCap,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import useChat from "../../hooks/useChat";
import MedicalBackground from "../../components/common/MedicalBackground";

export default function PatientMessages() {
  const { loginUser } = useContext(AuthContext);
  const {
    conversations,
    messages,
    selectedUser,
    loadingMessages,
    connected,
    selectUser,
    sendMessage,
  } = useChat();

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const searchInputRef = useRef(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter conversations by search term and filter type
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    // Search by doctor name or specialty or hospital
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((conv) => {
        const fullName = `${conv.user?.firstName || ""} ${conv.user?.lastName || ""}`.toLowerCase();
        const specialty = (conv.user?.specialty || "").toLowerCase();
        const hospital = (conv.user?.hospital || conv.user?.clinicName || "").toLowerCase();
        return fullName.includes(search) || specialty.includes(search) || hospital.includes(search);
      });
    }

    // Filter by type
    switch (filterType) {
      case "unread":
        filtered = filtered.filter((c) => c.unreadCount > 0);
        break;
      case "online":
        filtered = filtered.filter((c) => c.user?.isActive);
        break;
      case "recent":
        filtered = filtered.sort((a, b) => 
          new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [conversations, searchTerm, filterType]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [conversations]);

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 7) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (days > 0) {
      if (days === 1) return "Yesterday";
      return `${days}d ago`;
    }
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // Format last message preview
  const formatLastMessage = (conversation) => {
    if (!conversation.lastMessage) return "No messages yet";
    const isMine = conversation.lastMessage.senderModel === "Patient";
    const prefix = isMine ? "You: " : "Dr. ";
    const message = conversation.lastMessage.message || "";
    return prefix + (message.length > 50 ? message.substring(0, 47) + "..." : message);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const text = newMessage;
    setNewMessage("");
    await sendMessage(text);
    scrollToBottom();
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle doctor selection
  const handleDoctorSelect = (conversation) => {
    selectUser(conversation);
    setShowMobileChat(true);
  };

  // Handle mobile back button
  const handleBackToList = () => {
    setShowMobileChat(false);
    setShowActions(false);
  };

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Messages", icon: MessageCircle },
    { value: "unread", label: "Unread", icon: Ban },
    { value: "online", label: "Online", icon: Users },
    { value: "recent", label: "Recent", icon: Clock },
  ];

  // Get rating color
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (rating >= 4) return "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400";
    if (rating >= 3.5) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400";
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900">
      <MedicalBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Messages
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread • ` : ""}
                {filteredConversations.length} conversations with your doctors
              </p>
            </div>
            {!connected && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  Connecting to secure server...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex transition-all duration-300 h-[calc(100vh-220px)] lg:h-[calc(100vh-200px)]">
          {/* ==================== LEFT SIDEBAR - Doctor List ==================== */}
          <div
            className={`${
              showMobileChat ? "hidden lg:flex" : "flex"
            } w-full lg:w-80 xl:w-96 flex-shrink-0 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900`}
          >
            {/* Search and Filter Section */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 space-y-3 bg-gradient-to-b from-gray-50/50 to-white dark:from-neutral-900 dark:to-neutral-900">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, specialty, or hospital..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    {filterOptions.find((f) => f.value === filterType)?.label}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                </button>

                {showFilterDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilterDropdown(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-20 overflow-hidden">
                      {filterOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilterType(option.value);
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2 ${
                              filterType === option.value
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Doctor List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredConversations.map((conversation, idx) => (
                    <div
                      key={conversation.userId}
                      onClick={() => handleDoctorSelect(conversation)}
                      className={`group px-4 py-3 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/10 dark:hover:to-emerald-900/5 ${
                        selectedUser?.userId === conversation.userId
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-l-4 border-l-green-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Doctor Avatar */}
                        <div className="relative flex-shrink-0">
                          {conversation.user?.profilePhoto ? (
                            <img
                              src={conversation.user.profilePhoto}
                              alt={conversation.user.firstName}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800 group-hover:ring-green-300 transition-all"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 flex items-center justify-center ring-2 ring-white dark:ring-neutral-800 group-hover:ring-green-300 transition-all">
                              <span className="text-base font-bold text-green-700 dark:text-green-400">
                                {getInitials(conversation.user?.firstName, conversation.user?.lastName)}
                              </span>
                            </div>
                          )}
                          {conversation.user?.isActive && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800 animate-pulse" />
                          )}
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                              Dr. {conversation.user?.firstName} {conversation.user?.lastName}
                            </h4>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {formatTime(conversation.lastMessage?.createdAt)}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1.5">
                            {formatLastMessage(conversation)}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Stethoscope className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-400 capitalize">
                                {conversation.user?.specialty || "General Physician"}
                              </span>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium flex items-center justify-center shadow-md">
                                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    No conversations found
                  </p>
                  <p className="text-xs text-gray-400">
                    {searchTerm
                      ? "Try a different search term"
                      : "Chat with doctors after booking an appointment"}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats Footer */}
            {conversations.length > 0 && (
              <div className="flex-shrink-0 p-3 border-t border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800/50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-green-500" />
                    {conversations.length} doctors
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    {unreadCount} unread
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    End-to-end encrypted
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ==================== RIGHT SIDE - Chat Area ==================== */}
          <div
            className={`${
              !showMobileChat ? "hidden lg:flex" : "flex"
            } flex-1 flex-col min-w-0 bg-gray-50 dark:bg-neutral-900/50`}
          >
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 bg-white dark:bg-neutral-900 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToList}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition lg:hidden"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="relative">
                      {selectedUser.user?.profilePhoto ? (
                        <img
                          src={selectedUser.user.profilePhoto}
                          alt={selectedUser.user.firstName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 flex items-center justify-center">
                          <span className="text-sm font-bold text-green-700 dark:text-green-400">
                            {getInitials(selectedUser.user?.firstName, selectedUser.user?.lastName)}
                          </span>
                        </div>
                      )}
                      {selectedUser.user?.isActive && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800 animate-pulse" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        Dr. {selectedUser.user?.firstName} {selectedUser.user?.lastName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          {selectedUser.user?.specialty || "Doctor"}
                        </span>
                        {selectedUser.user?.rating && (
                          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${getRatingColor(selectedUser.user.rating)}`}>
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>{selectedUser.user.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {selectedUser.user?.isActive && (
                          <span className="text-green-600 dark:text-green-400">• Online</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all" title="Voice Call">
                      <Phone className="w-5 h-5 text-gray-500 hover:text-green-600" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all" title="Video Call">
                      <Video className="w-5 h-5 text-gray-500 hover:text-green-600" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(!showActions)}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      {showActions && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
                          <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-20 overflow-hidden">
                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                              <Star className="w-4 h-4" /> Mark as Important
                            </button>
                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                              <Archive className="w-4 h-4" /> Archive Chat
                            </button>
                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                              <Shield className="w-4 h-4" /> Report Issue
                            </button>
                            <hr className="my-1 border-gray-200 dark:border-neutral-700" />
                            <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors">
                              <Trash2 className="w-4 h-4" /> Delete Chat
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-10 h-10 border-3 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Loading messages...</p>
                      </div>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg, index) => {
                      const isPatient = msg.senderModel === "Patient";
                      const showAvatar = index === 0 || messages[index - 1]?.senderModel !== msg.senderModel;
                      const showTimestamp = index === messages.length - 1 || 
                        new Date(msg.createdAt).getDate() !== new Date(messages[index + 1]?.createdAt).getDate();

                      return (
                        <div key={msg._id || index} className="animate-fade-in">
                          {/* Date Separator */}
                          {showTimestamp && index > 0 && 
                            new Date(msg.createdAt).getDate() !== new Date(messages[index - 1]?.createdAt).getDate() && (
                              <div className="flex justify-center my-4">
                                <div className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 rounded-full">
                                  <span className="text-xs text-gray-500">
                                    {new Date(msg.createdAt).toLocaleDateString("en-US", { 
                                      weekday: "long", 
                                      month: "long", 
                                      day: "numeric" 
                                    })}
                                  </span>
                                </div>
                              </div>
                            )}
                          
                          <div className={`flex items-end gap-2 ${isPatient ? "justify-end" : "justify-start"}`}>
                            {/* Doctor Avatar */}
                            {!isPatient && showAvatar && (
                              <div className="flex-shrink-0 mb-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center ring-2 ring-white dark:ring-neutral-800">
                                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                                    {getInitials(selectedUser.user?.firstName, selectedUser.user?.lastName)}
                                  </span>
                                </div>
                              </div>
                            )}
                            {!isPatient && !showAvatar && <div className="w-8 flex-shrink-0" />}

                            {/* Message Bubble */}
                            <div className={`max-w-[80%] sm:max-w-md group`}>
                              <div
                                className={`px-4 py-2.5 rounded-2xl shadow-md ${
                                  isPatient
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-br-md"
                                    : "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-100 dark:border-neutral-700"
                                }`}
                              >
                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                  {msg.message}
                                </p>
                              </div>

                              {/* Timestamp and Read Receipt */}
                              <div className={`flex items-center gap-1.5 mt-1 ${isPatient ? "justify-end" : "justify-start"} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                                <span className="text-xs text-gray-400">
                                  {formatTime(msg.createdAt)}
                                </span>
                                {isPatient && (
                                  msg.read ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-gray-400" />
                                  )
                                )}
                              </div>
                            </div>

                            {/* Patient Avatar */}
                            {isPatient && showAvatar && (
                              <div className="flex-shrink-0 mb-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 flex items-center justify-center ring-2 ring-white dark:ring-neutral-800">
                                  <span className="text-xs font-bold text-green-700 dark:text-green-400">
                                    {getInitials(loginUser?.firstName, loginUser?.lastName)}
                                  </span>
                                </div>
                              </div>
                            )}
                            {isPatient && !showAvatar && <div className="w-8 flex-shrink-0" />}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          No messages yet
                        </p>
                        <p className="text-xs text-gray-400">
                          Send a message to start the conversation!
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
                  <div className="flex items-end gap-2">
                    <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all text-gray-400">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all text-gray-400">
                      <Smile className="w-5 h-5" />
                    </button>

                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none transition-all"
                      style={{ maxHeight: "100px" }}
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-md"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Press Enter to send, Shift + Enter for new line • End-to-end encrypted
                  </p>
                </div>
              </>
            ) : (
              /* Empty State - No Doctor Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to Secure Messaging
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    Select a doctor from the list to start or continue a conversation.
                    Chat about appointments, prescriptions, or any health concerns.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-700 dark:text-green-300">End-to-end encrypted</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-blue-700 dark:text-blue-300">Instant delivery</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                      <Heart className="w-3 h-3 text-purple-500" />
                      <span className="text-xs text-purple-700 dark:text-purple-300">Care team</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}