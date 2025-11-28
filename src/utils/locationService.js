import { Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.log("Location Error:", error);
        reject(error);
      },
      {
        enableHighAccuracy: Platform.OS === "ios",
        timeout: 15000,
        maximumAge: 0,
        forceRequestLocation: true,
        distanceFilter: 0,
        showLocationDialog: Platform.OS === "android",
      }
    );
  });
};
