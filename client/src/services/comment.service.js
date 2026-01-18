import api from './api';

export const commentService = {
  getEventComments: async (eventId, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get(`/events/${eventId}/comments?${params}`);
    return response.data;
  },

  addComment: async (eventId, text) => {
    const response = await api.post(`/events/${eventId}/comments`, { text });
    return response.data;
  },

  deleteComment: async (eventId, commentId) => {
    const response = await api.delete(`/events/${eventId}/comments/${commentId}`);
    return response.data;
  },
};
