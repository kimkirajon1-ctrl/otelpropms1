import api from './api';

const reservation.service = {
  getReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/reservations', data);
    return response.data;
  },
  checkIn: async (id) => {
    const response = await api.post(`/reservations/${id}/check-in`);
    return response.data;
  },
  checkOut: async (id) => {
    const response = await api.post(`/reservations/${id}/check-out`);
    return response.data;
  }
};

export default reservation.service;
