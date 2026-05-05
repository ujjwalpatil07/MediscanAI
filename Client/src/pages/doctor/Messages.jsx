import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Phone,
  Video,
  Send,
  Paperclip,
  Image,
  Smile,
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
} from "lucide-react";
import {
  generatePatients,
  generateConversations,
  generateMessageStats,
} from "../../utils/doctorMessageDummyData";

export default function DoctorMessages() {
  const [patients] = useState(generatePatients);
  const [conversations] = useState(generateConversations);
  const [stats] = useState(generateMessageStats);

  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedPatient, conversations]);

  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return fullName.includes(search);
      });
    }

    switch (filterType) {
      case "unread":
        filtered = filtered.filter((p) => p.unreadCount > 0);
        break;
      case "online":
        filtered = filtered.filter((p) => p.isOnline);
        break;
      case "in-treatment":
        filtered = filtered.filter((p) => p.status === "In-Treatment");
        break;
      default:
        break;
    }

    return filtered;
  }, [patients, searchTerm, filterType]);

  const currentConversation = conversations[selectedPatient._id] || [];

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatLastMessage = (patientId) => {
    const msgs = conversations[patientId];
    if (!msgs || msgs.length === 0) return "No messages yet";
    const lastMsg = msgs[msgs.length - 1];
    const prefix = lastMsg.sender === "doctor" ? "You: " : "";
    return prefix + lastMsg.message;
  };

  const getLastMessageTime = (patientId) => {
    const msgs = conversations[patientId];
    if (!msgs || msgs.length === 0) return "";
    const lastMsg = msgs[msgs.length - 1];
    return formatTime(lastMsg.timestamp);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const filterOptions = [
    { value: "all", label: "All Messages" },
    { value: "unread", label: "Unread" },
    { value: "online", label: "Online" },
    { value: "in-treatment", label: "In Treatment" },
  ];

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Messages
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {stats.unread} unread • {stats.activeChats} active chats
        </p>
      </div>

      <div className="flex-1 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden flex">
        <div
          className={`${showMobileChat ? "hidden lg:flex" : "flex"
            } w-full lg:w-80 xl:w-96 flex-shrink-0 flex-col border-r border-gray-200 dark:border-neutral-700`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients..."
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

          <div className="flex-1 overflow-y-auto">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  onClick={() => handlePatientSelect(patient)}
                  className={`px-4 py-3 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-neutral-750 border-b border-gray-100 dark:border-neutral-700/50 ${selectedPatient._id === patient._id
                      ? "bg-green-50 dark:bg-green-900/10 border-l-4 border-l-green-600"
                      : ""
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                        <span className="text-base font-semibold text-gray-600 dark:text-gray-400">
                          {getInitials(patient.firstName, patient.lastName)}
                        </span>
                      </div>
                      {patient.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">
                          {patient.firstName} {patient.lastName}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {getLastMessageTime(patient._id)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                        {formatLastMessage(patient._id)}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${patient.status === "In-Treatment"
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                            : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          }`}>
                          {patient.status}
                        </span>

                        {patient.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-medium">
                            {patient.unreadCount}
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
                  No conversations found
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${!showMobileChat ? "hidden lg:flex" : "flex"
            } flex-1 flex-col min-w-0`}
        >
          {selectedPatient ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition lg:hidden"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </button>

                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {getInitials(selectedPatient.firstName, selectedPatient.lastName)}
                      </span>
                    </div>
                    {selectedPatient.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedPatient.isOnline
                        ? "Online"
                        : `Last seen ${selectedPatient.lastSeen}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                    title="Voice Call"
                  >
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                    title="Video Call"
                  >
                    <Video className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                    title="View Profile"
                  >
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
                          <Ban className="w-4 h-4" /> Block Patient
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-neutral-900/50">
                {currentConversation.length > 0 ? (
                  currentConversation.map((msg, index) => {
                    const isDoctor = msg.sender === "doctor";
                    const showAvatar =
                      index === 0 ||
                      currentConversation[index - 1]?.sender !== msg.sender;

                    return (
                      <div
                        key={msg._id}
                        className={`flex items-end gap-2 ${isDoctor ? "justify-end" : "justify-start"
                          }`}
                      >
                        {!isDoctor && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              {getInitials(selectedPatient.firstName, selectedPatient.lastName)}
                            </span>
                          </div>
                        )}
                        {!isDoctor && !showAvatar && (
                          <div className="w-8 flex-shrink-0" />
                        )}

                        <div className={`max-w-[75%] sm:max-w-md ${isDoctor ? "order-1" : "order-2"}`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl ${isDoctor
                                ? "bg-green-600 text-white rounded-br-md"
                                : "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm border border-gray-100 dark:border-neutral-700"
                              }`}
                          >
                            {msg.type === "text" && (
                              <p className="text-sm">{msg.message}</p>
                            )}
                            {msg.type === "image" && (
                              <div className="w-48 h-48 rounded-lg bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                                <Image className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div
                            className={`flex items-center gap-1 mt-1 ${isDoctor ? "justify-end" : "justify-start"
                              }`}
                          >
                            <span className="text-xs text-gray-400">
                              {formatTime(msg.timestamp)}
                            </span>
                            {isDoctor &&
                              (msg.read ? (
                                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-gray-400" />
                              ))}
                          </div>
                        </div>

                        {isDoctor && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 order-2">
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                              SC
                            </span>
                          </div>
                        )}
                        {isDoctor && !showAvatar && (
                          <div className="w-8 flex-shrink-0 order-2" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No messages yet
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Start a conversation with this patient
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition text-gray-400 hover:text-green-600 dark:hover:text-green-400 hidden sm:block">
                      <Image className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition text-gray-400 hover:text-green-600 dark:hover:text-green-400 hidden sm:block">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm resize-none"
                      style={{ maxHeight: "120px" }}
                    />
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Your Messages
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Select a patient from the list to view your conversation.
                  You can chat with patients about their health concerns,
                  appointments, and prescriptions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}