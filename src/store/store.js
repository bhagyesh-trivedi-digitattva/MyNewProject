import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import notificationReducer from '../slices/notificationSlice';
import galleryReducer from '../slices/gallerySlice';
import  ApiSlice  from '../slices/ApiSlice';
export const store = configureStore({
  reducer: {
    [ApiSlice.reducerPath]: ApiSlice.reducer,
    auth: authReducer,
    notifications: notificationReducer,
    gallery: galleryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ApiSlice.middleware),
});
