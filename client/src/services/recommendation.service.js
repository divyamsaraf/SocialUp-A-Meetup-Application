import api from './api';

export const recommendationService = {
  getRecommendations: async (limit = 10) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    const response = await api.get(`/recommendations?${params}`);
    return response.data;
  },

  getTrendingEvents: async (limit = 10) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    const response = await api.get(`/recommendations/trending?${params}`);
    return response.data;
  },
};
