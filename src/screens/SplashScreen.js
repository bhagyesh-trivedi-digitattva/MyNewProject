import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    Animated,
    Image
} from 'react-native';
import { colors } from '../constants/colors'; // Import your colors

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        // Animate the progress bar over 4 seconds
        Animated.timing(progressAnim, {
            toValue: width * 0.7,
            duration: 4000,
            useNativeDriver: false,
        }).start();

        // Update percentage counter
        const interval = setInterval(() => {
            setPercentage(prev => {
                const newPercentage = prev + (100 / 40); // 40 intervals of 100ms = 4000ms
                return newPercentage >= 100 ? 100 : Math.round(newPercentage);
            });
        }, 100);

        // Navigate to Register after 4 seconds
        const timer = setTimeout(() => {
            clearInterval(interval);
            navigation.replace('Auth', { screen: 'Register' });
        }, 4000);

        // Clean up
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [navigation, progressAnim]);

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.appName}>My Awesome App</Text>
            <Text style={styles.tagline}>Getting everything ready for you</Text>

            {/* Progress Bar with Percentage */}
            <View style={styles.progressContainer}>
                <View style={styles.progressInfo}>
                    <Text style={styles.percentageText}>{percentage}%</Text>
                    <Text style={styles.loadingText}>Loading</Text>
                </View>

                <View style={styles.progressBackground}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                width: progressAnim
                            }
                        ]}
                    />
                </View>

                <View style={styles.progressDots}>
                    <View style={[styles.dot, percentage >= 25 && styles.dotActive]} />
                    <View style={[styles.dot, percentage >= 50 && styles.dotActive]} />
                    <View style={[styles.dot, percentage >= 75 && styles.dotActive]} />
                    <View style={[styles.dot, percentage >= 100 && styles.dotActive]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.light,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 12,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 80,
        textAlign: 'center',
    },
    progressContainer: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
        width: '100%',
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.7,
        marginBottom: 15,
    },
    percentageText: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 16,
        color: colors.gray,
        fontWeight: '500',
    },
    progressBackground: {
        width: width * 0.7,
        height: 10,
        backgroundColor: colors.light,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 5,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 4,
    },
    progressDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.light,
        marginHorizontal: 5,
    },
    dotActive: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 2,
    },
});

export default SplashScreen;