import api from './api';

export const eventService = {
  getEvents: async (filters = {}, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await api.get(`/events?${params}`);
    return response.data;
  },

  searchEvents: async (query, filters = {}, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await api.get(`/events/search?${params}`);
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  rsvpEvent: async (id) => {
    const response = await api.post(`/events/${id}/rsvp`);
    return response.data;
  },

  cancelRSVP: async (id) => {
    const response = await api.delete(`/events/${id}/rsvp`);
    return response.data;
  },
};
