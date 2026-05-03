import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roomReducer from './slices/roomSlice';
import reservationReducer from './slices/reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
    reservations: reservationReducer,
  },
});
