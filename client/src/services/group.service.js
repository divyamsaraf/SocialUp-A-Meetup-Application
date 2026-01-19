import api from './api';

export const groupService = {
  getGroups: async (filters = {}, page = 1, limit = 20) => {
    // Clean filters - remove empty values
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        cleanFilters[key] = String(filters[key]);
      }
    });
    
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...cleanFilters,
    });
    const response = await api.get(`/groups?${params}`);
    // Backend returns { status: "success", data: { groups, pagination } }
    return response.data.data || response.data;
  },

  getGroupById: async (id) => {
    const response = await api.get(`/groups/${id}`);
    // Backend returns { status: "success", data: { group } }
    return response.data.data || response.data;
  },

  createGroup: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  updateGroup: async (id, groupData) => {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },

  deleteGroup: async (id) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  },

  joinGroup: async (id) => {
    const response = await api.post(`/groups/${id}/join`);
    return response.data;
  },

  leaveGroup: async (id) => {
    const response = await api.post(`/groups/${id}/leave`);
    return response.data;
  },

  getGroupEvents: async (id, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get(`/groups/${id}/events?${params}`);
    return response.data;
  },
};
