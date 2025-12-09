    import React from 'react';
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import BottomTabNavigator from './BottomTabNavigator';
    import MapScreen from '../screens/MapScreen';
    import TodoScreen from '../screens/TodoScreen';
    import TodoDetailScreen from '../screens/TodoDetailScreen';
    import CartScreen from '../screens/CartScreen';
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
                <Stack.Screen name="TodoDetail" component={TodoDetailScreen} />
                <Stack.Screen name="CartScreen" component={CartScreen} />
            </Stack.Navigator>
        );
    };
    export default AppStack;