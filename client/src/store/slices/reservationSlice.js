import { createSlice } from '@reduxjs/toolkit';

const reservationSlice = createSlice({
  name: 'reservations',
  initialState: {
    list: [],
    currentReservation: null,
    loading: false,
  },
  reducers: {
    setReservations: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    addReservation: (state, action) => {
      state.list.unshift(action.payload);
    },
    setLoading: (state) => {
      state.loading = true;
    }
  },
});

export const { setReservations, addReservation, setLoading } = reservationSlice.actions;
export default reservationSlice.reducer;
