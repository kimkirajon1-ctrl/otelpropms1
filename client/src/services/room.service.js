import api from './api';

const room.service = {
  getRooms: async (params) => {
    const response = await api.get('/rooms', { params });
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/rooms/${id}`, { status });
    return response.data;
  }
};

export default room.service;
