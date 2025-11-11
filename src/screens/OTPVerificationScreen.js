import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    loadUserData();
    // Focus first input when screen mounts
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) setUserData(JSON.parse(storedData));
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  // Disable input if previous one is empty
  const isInputDisabled = (index) => (index === 0 ? false : otp[index - 1] === '');

  const handleOtpChange = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    // Move to next input automatically
    if (numericText && index < 3) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
    }

    // Auto verify if last input filled
    if (numericText && index === 3) handleVerifyOtp(newOtp.join(''));
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        setTimeout(() => inputRefs.current[index - 1]?.focus(), 10);
      } else if (otp[index] !== '') {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleInputFocus = (index) => {
    if (isInputDisabled(index)) {
      const firstEmptyIndex = otp.findIndex(
        (digit, i) => digit === '' && !isInputDisabled(i)
      );
      if (firstEmptyIndex !== -1) {
        setTimeout(() => inputRefs.current[firstEmptyIndex]?.focus(), 10);
      }
    }
  };

  const handleVerifyOtp = async (enteredOtp = otp.join('')) => {
    if (enteredOtp.length !== 4) {
      Alert.alert('Error', 'Please enter complete 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      if (userData && enteredOtp === userData.otp) {
        Alert.alert('Success', 'OTP verified successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('App', { screen: 'MainTabs' }),
          },
        ]);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 10);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    if (userData) {
      Alert.alert('OTP Reminder', `Your OTP is: ${userData.otp}`);
      setOtp(['', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 10);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={colors.white}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit OTP sent to your phone
          </Text>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  otp[index] && styles.otpInputFilled,
                  isInputDisabled(index) && styles.otpInputDisabled,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleInputFocus(index)}
                editable={!isLoading}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isOtpComplete || isLoading) && styles.disabledButton,
            ]}
            onPress={() => handleVerifyOtp()}
            disabled={!isOtpComplete || isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          {/* Resend OTP */}
          <TouchableOpacity
            style={styles.resendButton}
            onPress={resendOtp}
            activeOpacity={0.7}
          >
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.gray,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    backgroundColor: colors.white,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.light,
  },
  otpInputDisabled: {
    borderColor: '#E5E5E5',
    backgroundColor: '#F8F8F8',
  },
  verifyButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 12,
  },
  resendText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backText: {
    fontSize: 16,
    color: colors.gray,
  },
});
