/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { store } from "./src/store/store";
import ApiSlice from "./src/slices/ApiSlice";

console.log("🔥 Prefetching OUTSIDE Provider...");
store.dispatch(
  ApiSlice.endpoints.getAllTodos.initiate(undefined, {
    forceRefetch: true,
  })
);
AppRegistry.registerComponent(appName, () => App);
