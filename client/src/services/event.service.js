import api from './api';

export const eventService = {
  getEvents: async (filters = {}, page = 1, limit = 20) => {
    // Filter out empty/undefined/null values and convert to strings
    const cleanFilters = Object.fromEntries(
      Object.entries(filters)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    );
    
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...cleanFilters,
    });
    
    try {
      const response = await api.get(`/events?${params}`);
      // Backend returns { status: "success", data: { events, pagination } }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  searchEvents: async (query, filters = {}, page = 1, limit = 20) => {
    // Filter out empty/undefined/null values and convert to strings
    const cleanFilters = Object.fromEntries(
      Object.entries(filters)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    );
    
    const params = new URLSearchParams({
      q: String(query),
      page: String(page),
      limit: String(limit),
      ...cleanFilters,
    });
    
    try {
      const response = await api.get(`/events/search?${params}`);
      // Backend returns { status: "success", data: { events, pagination } }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
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

  getLocationSuggestions: async (q = '', limit = 8) => {
    const params = new URLSearchParams({
      q,
      limit: limit.toString(),
    });
    const response = await api.get(`/locations/suggest?${params}`);
    return response.data;
  },
};
