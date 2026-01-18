import api from './api';

export const adminService = {
  getUsers: async (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  getEvents: async (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get(`/admin/events?${params}`);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/admin/comments/${commentId}`);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/admin/events/${eventId}`);
    return response.data;
  },
};
