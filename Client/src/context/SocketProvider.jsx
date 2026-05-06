import { useEffect, useState, useRef, useContext, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";
import SocketContext from "./SocketContext";

export const SocketProvider = ({ children }) => {
  const { loginUser, authLoading } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // Don't connect while auth is loading
    if (authLoading) {
      return;
    }

    // If no user logged in, disconnect any existing socket
    if (!loginUser?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setConnected(false);
      setOnlineUsers(new Set());
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    // Don't reconnect if already connected
    if (socketRef.current?.connected) {
      return;
    }

    // Create new socket connection
    const socketInstance = io(import.meta.env.VITE_API_URL || "http://localhost:9001", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    // Connection events
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setConnected(true);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setConnected(false);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setConnected(false);
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setConnected(true);
    });

    socketInstance.on("reconnect_error", (error) => {
      console.error("❌ Socket reconnection error:", error.message);
    });

    // User online/offline events
    socketInstance.on("user:online", (data) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.add(data.userId);
        return updated;
      });
    });

    socketInstance.on("user:offline", (data) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(data.userId);
        return updated;
      });
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
      setOnlineUsers(new Set());
    };
  }, [loginUser, authLoading]);

  // Send message function
  const sendMessage = useCallback((receiverId, message, messageType = "text", attachmentUrl = null) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      socketRef.current.emit(
        "message:send",
        {
          receiverId,
          message,
          messageType,
          attachmentUrl,
        },
        (response) => {
          if (response?.success) {
            resolve(response.data);
          } else {
            reject(new Error(response?.error || "Failed to send message"));
          }
        }
      );
    });
  }, []);

  // Mark messages as read
  const markMessagesRead = useCallback((conversationWith) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("message:read", { conversationWith });
    }
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback((receiverId, isTyping) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("message:typing", { receiverId, isTyping });
    }
  }, []);

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId?.toString());
  }, [onlineUsers]);

  // Listen for incoming messages
  const onMessageReceived = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("message:receive", callback);
      return () => {
        socketRef.current?.off("message:receive", callback);
      };
    }
  }, []);

  // Listen for typing indicators
  const onTypingIndicator = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("message:typing", callback);
      return () => {
        socketRef.current?.off("message:typing", callback);
      };
    }
  }, []);

  // Listen for read receipts
  const onReadReceipt = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("message:read-receipt", callback);
      return () => {
        socketRef.current?.off("message:read-receipt", callback);
      };
    }
  }, []);

  // Context value
  const value = useMemo(() => ({
    socket,
    connected,
    onlineUsers,
    sendMessage,
    markMessagesRead,
    sendTypingIndicator,
    isUserOnline,
    onMessageReceived,
    onTypingIndicator,
    onReadReceipt,
  }), [
    socket,
    connected,
    onlineUsers,
    sendMessage,
    markMessagesRead,
    sendTypingIndicator,
    isUserOnline,
    onMessageReceived,
    onTypingIndicator,
    onReadReceipt,
  ]);

  return (
    <SocketContext.Provider value={value}> 
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SocketProvider;