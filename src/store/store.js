import { configureStore ,} from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import notificationReducer from '../slices/notificationSlice';
import galleryReducer from '../slices/gallerySlice';
import cartReducer from '../slices/cartSlice';
import  ApiSlice  from '../slices/ApiSlice';
import { createLogger } from 'redux-logger';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer,persistStore} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from 'redux';

const logger = createLogger({
    collapsed: true,   // make logs clean
    duration: true,    // show action duration
    timestamp: true,   // show timestamp
});

const rootReducer = combineReducers({
  [ApiSlice.reducerPath]: ApiSlice.reducer,
  auth: authReducer,
  cart: cartReducer,
  notifications: notificationReducer,
  gallery: galleryReducer,
});

const persistConfig = { 
  key: 'root',
  storage: AsyncStorage,
  whitelist: ["auth","cart","notification","gallery"], // only auth will be persisted
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(
      {
        serializableCheck: false,
      }
    ).concat(ApiSlice.middleware, logger),
});
setupListeners(store.dispatch);

export const persistor = persistStore(store);