import api from "./api";

export const getConversations = () => {
  return api.get("/chat/conversations");
};

export const getMessages = (userId, page = 1, limit = 50) => {
  return api.get(`/chat/messages/${userId}`, {
    params: { page, limit },
  });
};

export const getUnreadCount = () => {
  return api.get("/chat/unread-count");
};

export const markConversationRead = (userId) => {
  return api.put(`/chat/conversation/${userId}/read`);
};

export const deleteMessage = (messageId) => {
  return api.delete(`/chat/messages/${messageId}`);
};
