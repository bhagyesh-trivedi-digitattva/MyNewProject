import SplashScreen from "../screens/SplashScreen";
import React, { useContext,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { ThemeContext } from '../context/ThemeContext';
import { initCrashlytics } from '../utils/crashlytics';
import crashlytics from '@react-native-firebase/crashlytics';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    useEffect(() => {
  initCrashlytics();
  crashlytics().log('App started');
}, []);

    const { appTheme } = useContext(ThemeContext);

    return (
        <NavigationContainer
            theme={{
        ...appTheme,            // <-- VERY IMPORTANT
        colors: {
          ...appTheme.colors,   // <-- KEEP ALL YOUR THEME COLORS
          background: appTheme.colors.bg,
          card: appTheme.colors.card,
          text: appTheme.colors.text,
          border: appTheme.colors.gray,
          primary: appTheme.colors.primary,
        },
      }}
        >
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Auth" component={AuthStack} />
                <Stack.Screen name="App" component={AppStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
