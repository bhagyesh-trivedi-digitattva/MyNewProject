import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: width * 0.7,
      duration: 4000,
      useNativeDriver: false,
    }).start();

    // Update percentage counter
    const interval = setInterval(() => {
      setPercentage(prev => {
        const next = prev + (100 / 40);
        return next >= 100 ? 100 : Math.round(next);
      });
    }, 100);

    // Navigate to Register after 4s
    const timer = setTimeout(() => {
      clearInterval(interval);
      navigation.replace('Auth', { screen: 'Register' });
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigation, progressAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? colors.primary : 'transparent'}
        barStyle="light-content"
        translucent={Platform.OS === 'ios'}
      />

      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* App Name & Tagline */}
        <Text style={styles.appName}>My Awesome App</Text>
        <Text style={styles.tagline}>Getting everything ready for you</Text>

        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.percentageText}>{percentage}%</Text>
            <Text style={styles.loadingText}>Loading</Text>
          </View>

          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressAnim },
              ]}
            />
          </View>

          <View style={styles.progressDots}>
            {[25, 50, 75, 100].map((val, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  percentage >= val && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
