import { createSlice } from '@reduxjs/toolkit';

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    mediaFiles: [],
  },
  reducers: {
    addMedia(state, action) {
      state.mediaFiles.push(action.payload);
    },
    clearMedia(state) {
      state.mediaFiles = [];
    },
  },
});

export const { addMedia, clearMedia } = gallerySlice.actions;
export default gallerySlice.reducer;
