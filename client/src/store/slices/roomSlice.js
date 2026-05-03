import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRooms: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    updateRoomStatus: (state, action) => {
      const index = state.items.findIndex(room => room.id === action.payload.id);
      if (index !== -1) {
        state.items[index].status = action.payload.status;
      }
    },
    setLoading: (state) => {
      state.loading = true;
    }
  },
});

export const { setRooms, updateRoomStatus, setLoading } = roomSlice.actions;
export default roomSlice.reducer;
