import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExploreScreen from '../screens/ExploreScreen';
import NotificationScreen from '../screens/NotificationScreen';
import GalleryScreen from '../screens/GalleryScreen';
import { ThemeContext } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const { appTheme } = useContext(ThemeContext);

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: appTheme.colors.primary,
                tabBarInactiveTintColor: appTheme.colors.gray,
                tabBarStyle: {
                    backgroundColor: appTheme.colors.card,
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Text style={{ color, fontSize: focused ? 22 : 20 }}>🏠</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Text style={{ color, fontSize: focused ? 22 : 20 }}>🔍</Text>
                    ),
                }}
            />

            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Text style={{ color, fontSize: focused ? 22 : 20 }}>🖼️</Text>
                    ),
                }}
            />

            <Tab.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Text style={{ color, fontSize: focused ? 22 : 20 }}>🔔</Text>
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Text style={{ color, fontSize: focused ? 22 : 20 }}>👤</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
export default BottomTabNavigator;
