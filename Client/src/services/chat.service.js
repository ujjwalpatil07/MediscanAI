import api from "../api/api";

/**
 * Get all conversations for the current user
 * The server returns a list of users with their last message and unread count
 */
export const getConversations = () => {
  return api.get("/chat/conversations");
};

/**
 * Get messages between current user and another user
 * @param {string} userId - The ID of the other user
 * @param {number} page - Page number for pagination
 * @param {number} limit - Messages per page
 */
export const getMessages = (userId, page = 1, limit = 50) => {
  return api.get(`/chat/messages/${userId}`, {
    params: { page, limit },
  });
};

/**
 * Get total unread message count
 */
export const getUnreadCount = () => {
  return api.get("/chat/unread-count");
};

/**
 * Mark all messages from a specific user as read
 * @param {string} userId - The ID of the other user
 */
export const markConversationRead = (userId) => {
  return api.put(`/chat/conversation/${userId}/read`);
};

/**
 * Delete a specific message
 * @param {string} messageId - The ID of the message to delete
 */
export const deleteMessage = (messageId) => {
  return api.delete(`/chat/messages/${messageId}`);
};