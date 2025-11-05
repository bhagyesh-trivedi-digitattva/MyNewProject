import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '../constants/colors';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
// import GalleryScreen from '../screens/GalleryScreen';
import ExploreScreen from '../screens/ExploreScreen';
import NotificationScreen from '../screens/NotificationScreen';
import GalleryScreen from '../screens/GalleryScreen';

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.gray,
                tabBarLabelStyle: { fontSize: 12 },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Text style={{
                            color,
                            fontSize: focused ? 22 : 20,
                            fontWeight: focused ? 'bold' : 'normal'
                        }}>
                            🏠
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Text style={{
                            color,
                            fontSize: focused ? 22 : 20,
                            fontWeight: focused ? 'bold' : 'normal'
                        }}>
                            🔍
                        </Text>
                    ),
                }}
            />
             <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Text style={{
                            color,
                            fontSize: focused ? 22 : 20,
                            fontWeight: focused ? 'bold' : 'normal'
                        }}>
                            🖼️
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Text style={{
                            color,
                            fontSize: focused ? 22 : 20,
                            fontWeight: focused ? 'bold' : 'normal'
                        }}>
                            🔔
                        </Text>
                    ),
                    tabBarBadge: 3,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Text style={{
                            color,
                            fontSize: focused ? 22 : 20,
                            fontWeight: focused ? 'bold' : 'normal'
                        }}>
                            👤
                        </Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
export default BottomTabNavigator;