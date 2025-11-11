import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [loginData, setLoginData] = useState({ identifier: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateIdentifier = (identifier) => {
    const newErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Please enter your name, email, or phone number';
    } else if (identifier.length < 2) {
      newErrors.identifier = 'Identifier must be at least 2 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateIdentifier(loginData.identifier)) return;
    setIsLoading(true);

    try {
      const userDataString = await AsyncStorage.getItem('userData');

      if (!userDataString) {
        Alert.alert(
          'User Not Found',
          'No registered user found. Please create an account first.',
          [
            { text: 'Register Now', onPress: () => navigation.navigate('Register') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        setIsLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);

      const isMatch =
        userData.name.toLowerCase() === loginData.identifier.toLowerCase() ||
        userData.email.toLowerCase() === loginData.identifier.toLowerCase() ||
        userData.phoneNumber === loginData.identifier;

      if (isMatch) {
        await AsyncStorage.setItem('currentUser', loginData.identifier);
        Alert.alert(
          'User Found!',
          `Welcome back, ${userData.name}! Please verify with OTP.`,
          [{ text: 'Continue', onPress: () => navigation.navigate('OTPVerification') }]
        );
      } else {
        Alert.alert(
          'Invalid Credentials',
          'No user found with these details. Please check your input or register for a new account.',
          [
            { text: 'Try Again', style: 'cancel' },
            { text: 'Register', onPress: () => navigation.navigate('Register') },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Login Error', 'Failed to login. Please try again later.', [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdentifierChange = (text) => {
    setLoginData({ identifier: text });
    if (errors.identifier) setErrors({ identifier: '' });
  };

  const handleIdentifierBlur = () => validateIdentifier(loginData.identifier);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={Platform.OS === 'ios'}
        backgroundColor={Platform.OS === 'android' ? colors.white : 'transparent'}
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          {/* Input Field */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name, Email, or Phone Number *</Text>
              <TextInput
                style={[styles.input, errors.identifier && styles.inputError]}
                placeholder="Enter your name, email, or phone number"
                placeholderTextColor={colors.gray}
                value={loginData.identifier}
                onChangeText={handleIdentifierChange}
                onBlur={handleIdentifierBlur}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
              {errors.identifier && (
                <Text style={styles.errorText}>{errors.identifier}</Text>
              )}
            </View>

            {/* Info Text */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                💡 You can login with any of your registered details
              </Text>
            </View>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Checking...' : 'Continue to OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={styles.registerText}>
                Don’t have an account?{' '}
                <Text style={styles.registerLinkText}>Register Now</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 200,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.dark,
    ...Platform.select({
      ios: {
        shadowColor: colors.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  infoContainer: {
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  actionSection: {
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 20,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center',
    padding: 12,
  },
  registerText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  registerLinkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
