import api from './api';

export const categoryService = {
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      // Backend returns { status: "success", data: { categories } }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return empty array on error - component will use fallback
      return { categories: [] };
    }
  },
  
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
