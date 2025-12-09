import crashlytics from '@react-native-firebase/crashlytics';

export const initCrashlytics = () => {
  crashlytics().setCrashlyticsCollectionEnabled(true);
};

export const logCrash = (message) => {
  crashlytics().log(message);
};

export const recordError = (error, context = '') => {
  crashlytics().recordError(error, context);
};
