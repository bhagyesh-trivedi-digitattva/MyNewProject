import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import { colors } from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: new Date(),
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const addressInputRef = useRef(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validateName = (name) => name.trim().length >= 6;
  const validateAddress = (address) => address.trim().length >= 10;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (!validateName(formData.name)) newErrors.name = 'Name must be at least 6 characters long';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!validatePhone(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';

    if (!formData.gender) newErrors.gender = 'Please select your gender';

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    else if (!validateAddress(formData.address)) newErrors.address = 'Address must be at least 10 characters long';

    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);

    if (formData.dateOfBirth > maxDate) newErrors.dateOfBirth = 'You must be at least 18 years old';
    else if (formData.dateOfBirth < minDate) newErrors.dateOfBirth = 'Please enter a valid date of birth';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOTP = (phoneNumber) => phoneNumber.slice(-4);

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all fields correctly.');
      return;
    }

    const otp = generateOTP(formData.phoneNumber);
    const userData = {
      ...formData,
      otp,
      dateOfBirth: formData.dateOfBirth.toISOString().split('T')[0],
    };

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      Alert.alert(
        'Registration Successful',
        `Your OTP is: ${otp}. You'll need this for login.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFieldFocus = (field, ref) => {
    setFocusedField(field);
    if (ref && ref.current) ref.current.focus();
  };

  const getInputStyle = (field) => {
    const style = [styles.input];
    if (errors[field]) style.push(styles.inputError);
    if (focusedField === field) style.push(styles.inputFocused);
    return style;
  };

  const getContainerStyle = (field) => {
    const style = [styles.inputContainer];
    if (focusedField === field) style.push(styles.containerFocused);
    return style;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent={Platform.OS === 'ios'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : 'transparent'}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Account</Text>

        {/* Name */}
        <TouchableOpacity
          style={getContainerStyle('name')}
          onPress={() => handleFieldFocus('name', nameInputRef)}
          activeOpacity={1}
        >
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            ref={nameInputRef}
            style={getInputStyle('name')}
            placeholder="Enter your full name"
            placeholderTextColor={colors.gray}
            value={formData.name}
            onChangeText={(text) => updateFormData('name', text)}
            onBlur={() => setFocusedField(null)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity
          style={getContainerStyle('email')}
          onPress={() => handleFieldFocus('email', emailInputRef)}
          activeOpacity={1}
        >
          <Text style={styles.label}>Email *</Text>
          <TextInput
            ref={emailInputRef}
            style={getInputStyle('email')}
            placeholder="Enter your email"
            placeholderTextColor={colors.gray}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            onBlur={() => setFocusedField(null)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity
          style={getContainerStyle('phoneNumber')}
          onPress={() => handleFieldFocus('phoneNumber', phoneInputRef)}
          activeOpacity={1}
        >
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            ref={phoneInputRef}
            style={getInputStyle('phoneNumber')}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.gray}
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.phoneNumber}
            onChangeText={(text) => updateFormData('phoneNumber', text)}
            onBlur={() => setFocusedField(null)}
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
        </TouchableOpacity>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender *</Text>
          <View style={styles.genderContainer}>
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.radioButton,
                  formData.gender === gender && styles.radioButtonSelected,
                ]}
                onPress={() => updateFormData('gender', gender)}
              >
                <Text
                  style={[
                    styles.radioText,
                    formData.gender === gender && styles.radioTextSelected,
                  ]}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </View>

        {/* Date of Birth */}
        <TouchableOpacity
          style={[styles.inputContainer, focusedField === 'dateOfBirth' && styles.containerFocused]}
          onPress={() => {
            setFocusedField('dateOfBirth');
            setShowDatePicker(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.label}>Date of Birth *</Text>
          <View
            style={[
              styles.dateInput,
              errors.dateOfBirth && styles.inputError,
              focusedField === 'dateOfBirth' && styles.inputFocused,
            ]}
          >
            <Text style={styles.dateText}>{formData.dateOfBirth.toDateString()}</Text>
          </View>
          {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

          <DatePicker
            modal
            open={showDatePicker}
            date={formData.dateOfBirth}
            mode="date"
            maximumDate={new Date()}
            onConfirm={(date) => {
              setShowDatePicker(false);
              updateFormData('dateOfBirth', date);
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        </TouchableOpacity>

        {/* Address */}
        <TouchableOpacity
          style={getContainerStyle('address')}
          onPress={() => handleFieldFocus('address', addressInputRef)}
          activeOpacity={1}
        >
          <Text style={styles.label}>Address *</Text>
          <TextInput
            ref={addressInputRef}
            style={[getInputStyle('address'), styles.textArea]}
            placeholder="Enter your full address"
            placeholderTextColor={colors.gray}
            multiline
            value={formData.address}
            onChangeText={(text) => updateFormData('address', text)}
            onBlur={() => setFocusedField(null)}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLinkText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  scrollContainer: { flexGrow: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  inputContainer: { marginBottom: 20, padding: 8, borderRadius: 12 },
  containerFocused: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  label: { fontSize: 16, fontWeight: '600', color: colors.dark, marginBottom: 8, marginLeft: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.dark,
  },
  inputFocused: {
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  inputError: { borderColor: colors.danger, backgroundColor: '#FFF5F5' },
  errorText: { color: colors.danger, fontSize: 14, marginTop: 5, marginLeft: 8 },
  textArea: { height: 100, textAlignVertical: 'top' },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  radioButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.light,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  radioButtonSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  radioText: { fontSize: 16, color: colors.gray, fontWeight: '500' },
  radioTextSelected: { color: colors.white },
  dateInput: {
    borderWidth: 1.5,
    borderColor: colors.light,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
  },
  dateText: { fontSize: 16, color: colors.dark },
  registerButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  registerButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  loginLink: { alignItems: 'center', marginBottom: 30, padding: 10 },
  loginText: { fontSize: 16, color: colors.gray },
  loginLinkText: { color: colors.primary, fontWeight: 'bold' },
});
