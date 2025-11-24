import React from 'react';
import { Button, Alert, View } from 'react-native';
import {
  handlePermission,
  requestCameraPermission,
  requestLocationPermission,
  requestMicrophonePermission,
  requestGalleryPermission,
} from '../utils/permissions';

const PermissionScreen = () => {
  const askCamera = async () => {
    const granted = await handlePermission(requestCameraPermission);
    Alert.alert(granted ? "Camera Granted" : "Camera Denied");
  };

  const askLocation = async () => {
    const granted = await handlePermission(requestLocationPermission);
    Alert.alert(granted ? "Location Granted" : "Location Denied");
  };

  const askMicrophone = async () => {
    const granted = await handlePermission(requestMicrophonePermission);
    Alert.alert(granted ? "Microphone Granted" : "Microphone Denied");
  };

  const askGallery = async () => {
    const granted = await handlePermission(requestGalleryPermission);
    Alert.alert(granted ? "Gallery Granted" : "Gallery Denied");
  };

  return (
    <View style={{ margin: 20 }}>
      <Button title="Camera Permission" onPress={askCamera} />
      <Button title="Location Permission" onPress={askLocation} />
      <Button title="Microphone Permission" onPress={askMicrophone} />
      <Button title="Gallery Permission" onPress={askGallery} />
    </View>
  );
};

export default PermissionScreen;
