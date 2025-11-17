import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null,

    // 🔥 Add this for testing Redux
    testValue: "Redux is NOT working",
  },

  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },

    // 🔥 Add this reducer
    setTestValue: (state, action) => {
      state.testValue = action.payload;
    },
  },
});

// 🔥 Make sure you export setTestValue
export const { login, logout, setTestValue } = authSlice.actions;
export default authSlice.reducer;
