import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    count: 0,
  },
  reducers: {
    setNotificationCount(state, action) {
      state.count = action.payload;
    },
    increment(state) {
      state.count += 1;
    },
    clearNotifications(state) {
      state.count = 0;
    },
  },
});

export const { setNotificationCount, increment, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
