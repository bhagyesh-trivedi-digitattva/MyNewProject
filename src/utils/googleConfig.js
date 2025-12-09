import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: "751923275426-a24pa959ddfj02c6v357c9aq6ovbgh5s.apps.googleusercontent.com", // from Firebase
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};
