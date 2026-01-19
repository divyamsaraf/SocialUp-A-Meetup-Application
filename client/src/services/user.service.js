import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    // Backend returns { status: "success", data: { user } }
    return response.data.data || response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    // Backend returns { status: "success", data: { user } }
    return response.data.data || response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Backend returns { status: "success", data: { user } }
    return response.data.data || response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    // Backend returns { status: "success", data: { user } }
    return response.data.data || response.data;
  },

  getUserByUsername: async (username) => {
    const response = await api.get(`/users/username/${username}`);
    // Backend returns { status: "success", data: { user } }
    return response.data.data || response.data;
  },

  getUserEvents: async (identifier) => {
    // Supports both ID and username
    const response = await api.get(`/users/${identifier}/events`);
    // Backend returns { status: "success", data: { events } }
    return response.data.data || response.data;
  },

  searchUsers: async (query, limit = 20) => {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });
    const response = await api.get(`/users/search?${params}`);
    return response.data;
  },
};
