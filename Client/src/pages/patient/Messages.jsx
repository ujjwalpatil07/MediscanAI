import { useState, useMemo, useRef, useEffect, useContext } from "react";
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
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import useChat from "../../hooks/useChat";

export default function PatientMessages() {
  // Get logged-in patient info
  const { loginUser } = useContext(AuthContext);

  // Use our chat hook - same hook works for both doctor and patient
  const {
    conversations,        // List of doctors with their conversations
    messages,             // Messages for the currently selected doctor
    selectedUser,         // Currently selected doctor
    loadingMessages,      // Loading state
    connected,            // Socket connection status
    selectUser,           // Function to select a doctor
    sendMessage,          // Function to send a message
  } = useChat();

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const messagesEndRef = useRef(null);

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

    // Search by doctor name or specialty
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((conv) => {
        const fullName = `${conv.user?.firstName || ""} ${conv.user?.lastName || ""}`.toLowerCase();
        const specialty = (conv.user?.specialty || "").toLowerCase();
        return fullName.includes(search) || specialty.includes(search);
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
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      if (days === 1) return "Yesterday";
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  // Format last message preview
  const formatLastMessage = (conversation) => {
    if (!conversation.lastMessage) return "No messages yet";
    // If patient sent the last message, prefix with "You: "
    const isMine = conversation.lastMessage.senderModel === "Patient";
    const prefix = isMine ? "You: " : "Dr: ";
    return prefix + (conversation.lastMessage.message || "");
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const text = newMessage;
    setNewMessage("");

    await sendMessage(text);
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
  };

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Messages" },
    { value: "unread", label: "Unread" },
    { value: "online", label: "Online" },
  ];

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Messages
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {unreadCount} unread • {conversations.length} conversations
        </p>
        {!connected && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Connecting to chat server...
          </p>
        )}
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden flex">

        {/* ==================== LEFT SIDEBAR - Doctor List ==================== */}
        <div
          className={`${showMobileChat ? "hidden lg:flex" : "flex"
            } w-full lg:w-80 xl:w-96 flex-shrink-0 flex-col border-r border-gray-200 dark:border-neutral-700`}
        >
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doctors..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  {filterOptions.find((f) => f.value === filterType)?.label}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-20">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterType(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${filterType === option.value
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Doctor List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  onClick={() => handleDoctorSelect(conversation)}
                  className={`px-4 py-3 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-neutral-750 border-b border-gray-100 dark:border-neutral-700/50 ${selectedUser?.userId === conversation.userId
                      ? "bg-green-50 dark:bg-green-900/10 border-l-4 border-l-green-600"
                      : ""
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Doctor Avatar */}
                    <div className="relative flex-shrink-0">
                      {conversation.user?.profilePhoto ? (
                        <img
                          src={conversation.user.profilePhoto}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                            {getInitials(conversation.user?.firstName, conversation.user?.lastName)}
                          </span>
                        </div>
                      )}
                      {conversation.user?.isActive && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800" />
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">
                          Dr. {conversation.user?.firstName} {conversation.user?.lastName}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatTime(conversation.lastMessage?.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                        {formatLastMessage(conversation)}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          {conversation.user?.specialty || "Doctor"}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-medium">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-4">
                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No conversations yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Chat with doctors after booking an appointment
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ==================== RIGHT SIDE - Chat Area ==================== */}
        <div
          className={`${!showMobileChat ? "hidden lg:flex" : "flex"
            } flex-1 flex-col min-w-0`}
        >
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition lg:hidden"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </button>

                  {/* Doctor Avatar */}
                  <div className="relative">
                    {selectedUser.user?.profilePhoto ? (
                      <img
                        src={selectedUser.user.profilePhoto}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {getInitials(selectedUser.user?.firstName, selectedUser.user?.lastName)}
                        </span>
                      </div>
                    )}
                    {selectedUser.user?.isActive && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800" />
                    )}
                  </div>

                  {/* Doctor Name & Specialty */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Dr. {selectedUser.user?.firstName} {selectedUser.user?.lastName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedUser.user?.specialty || "Doctor"}
                      {selectedUser.user?.isActive ? " • Online" : ""}
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition" title="Voice Call">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition" title="Video Call">
                    <Video className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition" title="View Profile">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowActions(!showActions)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    {showActions && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-20">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                          <Star className="w-4 h-4" /> Mark as Important
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                          <Archive className="w-4 h-4" /> Archive Chat
                        </button>
                        <hr className="my-1 border-gray-200 dark:border-neutral-700" />
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-neutral-900/50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-500">Loading messages...</p>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => {
                    // Check if this message was sent by the current patient
                    const isPatient = msg.senderModel === "Patient";

                    // Show avatar only for first message in a group
                    const showAvatar =
                      index === 0 || messages[index - 1]?.senderModel !== msg.senderModel;

                    return (
                      <div
                        key={msg._id || index}
                        className={`flex items-end gap-2 ${isPatient ? "justify-end" : "justify-start"}`}
                      >
                        {/* Doctor Avatar (left side) */}
                        {!isPatient && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {getInitials(selectedUser.user?.firstName, selectedUser.user?.lastName)}
                            </span>
                          </div>
                        )}
                        {!isPatient && !showAvatar && <div className="w-8 flex-shrink-0" />}

                        {/* Message Bubble */}
                        <div className={`max-w-[75%] sm:max-w-md`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl ${isPatient
                                ? "bg-green-600 text-white rounded-br-md"
                                : "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm border border-gray-100 dark:border-neutral-700"
                              }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>

                          {/* Timestamp and Read Receipt */}
                          <div className={`flex items-center gap-1 mt-1 ${isPatient ? "justify-end" : "justify-start"}`}>
                            <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                            {isPatient && (
                              msg.read ? (
                                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-gray-400" />
                              )
                            )}
                          </div>
                        </div>

                        {/* Patient Avatar (right side) */}
                        {isPatient && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                              {getInitials(loginUser?.firstName, loginUser?.lastName)}
                            </span>
                          </div>
                        )}
                        {isPatient && !showAvatar && <div className="w-8 flex-shrink-0" />}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No messages yet. Send a message to start!
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition text-gray-400">
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm resize-none"
                    style={{ maxHeight: "120px" }}
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Your Messages
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Select a doctor from the list to view your conversation.
                  Chat with your doctors about appointments, prescriptions, and health concerns.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}