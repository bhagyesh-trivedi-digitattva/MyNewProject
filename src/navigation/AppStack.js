    import React from 'react';
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import BottomTabNavigator from './BottomTabNavigator';
import MapScreen from '../screens/MapScreen';
import TodoScreen from '../screens/TodoScreen';
    const Stack = createNativeStackNavigator();

    const AppStack = () => {
        return (
            <Stack.Navigator

                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen name="TodoScreen" component={TodoScreen} />
            </Stack.Navigator>
        );
    };
    export default AppStack;