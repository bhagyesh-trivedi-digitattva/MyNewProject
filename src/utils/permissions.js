import { 
  PERMISSIONS,
  request,
  check,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import { Platform } from 'react-native';

/**
 * Generic permission handler with auto "Open Settings"
 */
export const handlePermission = async (permission) => {
  const result = await check(permission);

  switch (result) {
    case RESULTS.GRANTED:
      return true;

    case RESULTS.DENIED:
      // Ask user again
      const newResult = await request(permission);
      return newResult === RESULTS.GRANTED;

    case RESULTS.BLOCKED:
      // User permanently denied → open settings
      openSettings();
      return false;

    default:
      return false;
  }
};

/**
 * Camera Permission
 */
export const requestCameraPermission = async () => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;

  return handlePermission(permission);
};

/**
 * Location Permission
 */
export const requestLocationPermission = async () => {
  if (Platform.OS === "ios") {
    return handlePermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  }

  // ANDROID 12+ → Needs precise + approximate
  if (Platform.Version >= 31) {
    const preciseGranted = await handlePermission(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );

    const approxGranted = await handlePermission(
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
    );

    return preciseGranted || approxGranted;
  }

  // Older Android (Android 10, 11)
  return handlePermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
};

/**
 * Microphone / Recording Permission
 */
export const requestMicrophonePermission = async () => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;

  return handlePermission(permission);
};

/**
 * Gallery / Photos Permission
 * Android 13+ (Tiramisu) uses READ_MEDIA_IMAGES
 * Below Android 13 uses READ_EXTERNAL_STORAGE
 */
export const requestGalleryPermission = async () => {
  let permission;

  if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  } else {
    permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  }

  return handlePermission(permission);
};

/**
 * Storage Permission (For older Android)
 */
export const requestStoragePermission = async () => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      : null;

  if (!permission) return true; 

  return handlePermission(permission);
};
