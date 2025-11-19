import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';

// OneSignal import
import { OneSignal, LogLevel } from 'react-native-onesignal';

export default function App() {

  useEffect(() => {
    // Enable logs (remove in production)
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // Initialize OneSignal
    OneSignal.initialize('f3fdc9f5-58d5-45ba-9e10-12da2bf45f48');

    // -------- ANDROID ONLY NOTIFICATION PERMISSION --------
    if (Platform.OS === 'android') {
      OneSignal.Notifications.requestPermission(true);
    }

    // Optional: handle notification events
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('Notification clicked:', event);
    });

  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
