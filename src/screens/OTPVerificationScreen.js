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
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const OTPVerificationScreen = ({ navigation }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        loadUserData();
        // Focus first input on mount - EXACTLY LIKE REFERENCE
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const loadUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (userDataString) {
                setUserData(JSON.parse(userDataString));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load user data');
        }
    };

    // Check if input should be visually disabled - EXACTLY LIKE REFERENCE
    const isInputDisabled = (index) => {
        if (index === 0) return false; // First box always enabled
        return otp[index - 1] === ''; // Disabled if previous box is empty
    };

    const handleOtpChange = (text, index) => {
        // Only allow numbers - EXACTLY LIKE REFERENCE
        const numericText = text.replace(/[^0-9]/g, '');

        const newOtp = [...otp];
        newOtp[index] = numericText;
        setOtp(newOtp);

        // Auto focus next input if current input has value - EXACTLY LIKE REFERENCE
        if (numericText !== '' && index < 3) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 10);
        }

        // Auto submit if last input is filled - EXACTLY LIKE REFERENCE
        if (numericText !== '' && index === 3) {
            handleVerifyOtp(newOtp.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        // Handle backspace - EXACTLY LIKE REFERENCE
        if (e.nativeEvent.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                // If current box is empty and backspace is pressed, focus previous box
                setTimeout(() => {
                    inputRefs.current[index - 1]?.focus();
                }, 10);
            } else if (otp[index] !== '') {
                // If current box has value, clear it but stay focused
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };

    const handleInputFocus = (index) => {
        // If trying to focus a disabled box, focus the first empty box instead - EXACTLY LIKE REFERENCE
        if (isInputDisabled(index)) {
            const firstEmptyIndex = otp.findIndex((digit, i) => digit === '' && !isInputDisabled(i));
            if (firstEmptyIndex !== -1) {
                setTimeout(() => {
                    inputRefs.current[firstEmptyIndex]?.focus();
                }, 10);
            }
        }
    };

    const handleVerifyOtp = async (enteredOtp = otp.join('')) => {
        // Validate OTP length
        if (enteredOtp.length !== 4) {
            Alert.alert('Error', 'Please enter complete 4-digit OTP');
            return;
        }

        setIsLoading(true);

        try {
            if (userData && enteredOtp === userData.otp) {
                // OTP matched - navigate to home
                Alert.alert('Success', 'OTP verified successfully!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.replace('App', { screen: 'MainTabs' })
                    }
                ]);
            } else {
                // Invalid OTP
                Alert.alert('Error', 'Invalid OTP. Please try again.');
                // Clear OTP and focus first input - EXACTLY LIKE REFERENCE
                setOtp(['', '', '', '']);
                setTimeout(() => {
                    inputRefs.current[0]?.focus();
                }, 10);
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = () => {
        if (userData) {
            Alert.alert('OTP Reminder', `Your OTP is: ${userData.otp}`);
            setOtp(['', '', '', '']);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 10);
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>
                        Enter the 4-digit OTP sent to your phone
                    </Text>

                    {/* OTP Input Boxes - EXACTLY LIKE REFERENCE CODE */}
                    <View style={styles.otpContainer}>
                        {[0, 1, 2, 3].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    otp[index] && styles.otpInputFilled,
                                    isInputDisabled(index) && styles.otpInputDisabled
                                ]}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={otp[index]}
                                onChangeText={(text) => handleOtpChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                onFocus={() => handleInputFocus(index)}
                                editable={!isLoading}
                                selectTextOnFocus
                                caretHidden={false}
                            />
                        ))}
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={[
                            styles.verifyButton,
                            (!isOtpComplete || isLoading) && styles.disabledButton
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

const styles = StyleSheet.create({
    container: {
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
    infoContainer: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: colors.light,
        borderRadius: 10,
    },
    infoText: {
        fontSize: 14,
        color: colors.dark,
        textAlign: 'center',
        lineHeight: 20,
    },
    verifyButton: {
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
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

export default OTPVerificationScreen;