import SplashScreen from "../screens/SplashScreen";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Changed import
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Stack = createNativeStackNavigator(); // Changed to native stack

const AppNavigator = () => {
    return (
        <NavigationContainer>
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