import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { getConversations, getMessages } from "../services/chat.service";

/**
 * useChat Hook
 *
 * This hook handles all chat-related logic:
 * - Fetching conversations from the API
 * - Loading messages for a specific user
 * - Listening for real-time incoming messages via socket
 * - Sending messages via socket
 *
 * @returns {Object} - Chat state and functions
 */
export default function useChat() {
  // Socket context - gives us access to the socket connection and helper functions
  const { socket, connected, sendMessage, markMessagesRead } = useSocket();

  // conversations = list of all users (doctors/patients) the current user has chatted with
  const [conversations, setConversations] = useState([]);

  // messages = array of messages for the currently selected conversation
  const [messages, setMessages] = useState([]);

  // selectedUser = the user (doctor or patient) currently being chatted with
  const [selectedUser, setSelectedUser] = useState(null);

  // loading states
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // error state
  const [error, setError] = useState(null);

  /**
   * Fetch all conversations from the server
   * This gets called when the component mounts
   */
  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    setError(null);

    try {
      const response = await getConversations();
      // The API returns conversations with user details, last message, and unread count
      setConversations(response.data.data || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  /**
   * Fetch messages for a specific user
   * @param {string} userId - The ID of the user to fetch messages with
   */
  const fetchMessages = useCallback(
    async (userId) => {
      setLoadingMessages(true);
      setError(null);

      try {
        const response = await getMessages(userId);
        setMessages(response.data.data || []);

        // Mark all messages from this user as read
        markMessagesRead(userId);

        // Update unread count in conversations list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.userId === userId ? { ...conv, unreadCount: 0 } : conv,
          ),
        );
      } catch (err) {
        console.error("Failed to load messages:", err);
        setError("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    },
    [markMessagesRead],
  );

  /**
   * Handle selecting a user to chat with
   * @param {Object} user - The conversation object from the conversations list
   */
  const selectUser = useCallback(
    (user) => {
      setSelectedUser(user);
      // When we select a user, immediately fetch their messages
      fetchMessages(user.userId);
    },
    [fetchMessages],
  );

  /**
   * Listen for incoming real-time messages
   * This effect runs when the socket connection or selected user changes
   */
  useEffect(() => {
    // Don't set up listener if socket isn't connected
    if (!socket) return;

    /**
     * Handler for incoming messages
     * This fires whenever ANYONE sends a message to the current user
     */
    const handleIncomingMessage = (newMessage) => {
      // Check if this message belongs to the currently open conversation
      if (selectedUser && newMessage.senderId === selectedUser.userId) {
        // Add the message to the current chat
        setMessages((prev) => [...prev, newMessage]);

        // Mark it as read since the conversation is open
        markMessagesRead(selectedUser.userId);
      } else {
        // Message is from someone else - refresh conversations to update unread count
        fetchConversations();
      }
    };

    // Attach the listener
    socket.on("message:receive", handleIncomingMessage);

    // Cleanup: remove listener when component unmounts or dependencies change
    return () => {
      socket.off("message:receive", handleIncomingMessage);
    };
  }, [socket, selectedUser, markMessagesRead, fetchConversations]);

  /**
   * Send a message to the currently selected user
   * @param {string} text - The message text to send
   */
  const handleSendMessage = useCallback(
    async (text) => {
      if (!text.trim() || !selectedUser) return;

      const messageText = text.trim();

      try {
        // Send via socket - this returns the saved message from the server
        const sentMessage = await sendMessage(selectedUser.userId, messageText);

        // Optimistically add the message to the UI immediately
        // This makes the chat feel instant even before the server confirms
        setMessages((prev) => [
          ...prev,
          {
            _id: sentMessage?._id || `temp-${Date.now()}`,
            senderId: "me", // We'll check this to style our own messages
            senderModel: "Patient", // or "Doctor" depending on who's logged in
            message: messageText,
            messageType: "text",
            createdAt: new Date().toISOString(),
            read: false,
          },
        ]);

        // Refresh conversations to update the last message preview
        fetchConversations();

        return true; // Success
      } catch (err) {
        console.error("Failed to send message:", err);
        return false; // Failed
      }
    },
    [selectedUser, sendMessage, fetchConversations],
  );

  /**
   * Load conversations when the component first mounts
   */
  useEffect(() => {
    if (connected) {
      fetchConversations();
    }
  }, [connected, fetchConversations]);

  // Return everything the component needs
  return {
    // State
    conversations,
    setConversations, // ← Add this
    messages,
    selectedUser,
    loadingConversations,
    loadingMessages,
    error,
    connected,

    // Actions
    selectUser,
    sendMessage: handleSendMessage,
    refreshConversations: fetchConversations,
    clearSelectedUser: () => setSelectedUser(null),
  };
}
