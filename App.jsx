import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';

import { OneSignal, LogLevel } from 'react-native-onesignal';
import { requestCameraPermission,requestLocationPermission,requestStoragePermission,requestMicrophonePermission,requestGalleryPermission } from './src/utils/permissions';
export default function App() {
  useEffect(() => {
  requestCameraPermission();
  requestLocationPermission();
  requestMicrophonePermission();
  requestGalleryPermission();
  requestStoragePermission();
}, []);

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('f3fdc9f5-58d5-45ba-9e10-12da2bf45f48');
    OneSignal.Notifications.requestPermission(true);

    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('Notification clicked:', event);
    });
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
}
