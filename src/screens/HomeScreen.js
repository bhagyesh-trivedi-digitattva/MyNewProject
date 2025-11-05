import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

const HomeScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (userDataString) {
                setUserData(JSON.parse(userDataString));
            }
        } catch (error) {
            console.log('Error loading user data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('currentUser');
            navigation.replace('Auth', { screen: 'Login' });
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        {userData ? `Welcome ${userData.name}! ` : "Welcome! 🎉"}
                    </Text>
                    <Text style={styles.subtitle}>
                        You have successfully logged in to your account
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => alert('Explore more features!')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Explore App Features</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Profile')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryButtonText}>View Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Info */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Thank you for using our app! 🚀
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray,
        textAlign: 'center',
        lineHeight: 24,
    },
    actionsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: colors.secondary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 18,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.danger,
        borderRadius: 12,
        backgroundColor: colors.white,
        marginTop: 8,
    },
    logoutButtonText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default HomeScreen;
