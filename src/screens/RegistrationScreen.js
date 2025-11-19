import React, { useState, useRef } from "react";
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
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: new Date(),
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);

  // ---------------- VALIDATION ----------------
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (ph) => /^[0-9]{10}$/.test(ph);
  const validateName = (n) => n.trim().length >= 6;
  const validateAddress = (a) => a.trim().length >= 10;

  const validateForm = () => {
    const e = {};

    if (!formData.name.trim()) e.name = "Name is required";
    else if (!validateName(formData.name)) e.name = "Minimum 6 characters";

    if (!formData.email.trim()) e.email = "Email required";
    else if (!validateEmail(formData.email)) e.email = "Invalid email";

    if (!formData.phoneNumber.trim()) e.phoneNumber = "Phone required";
    else if (!validatePhone(formData.phoneNumber)) e.phoneNumber = "10 digits required";

    if (!formData.gender) e.gender = "Select gender";

    if (!formData.address.trim()) e.address = "Address required";
    else if (!validateAddress(formData.address)) e.address = "Minimum 10 characters";

    // DOB Rules
    const today = new Date();
    const min = new Date();
    min.setFullYear(today.getFullYear() - 100);

    const max = new Date();
    max.setFullYear(today.getFullYear() - 18);

    if (formData.dateOfBirth > max) e.dateOfBirth = "You must be 18+";
    if (formData.dateOfBirth < min) e.dateOfBirth = "Invalid birth date";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // update field
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  // ---------------- submit ----------------
  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please correct the form.");
      return;
    }

    const otp = formData.phoneNumber.slice(-4);

    const userObj = {
      ...formData,
      otp,
      dateOfBirth: formData.dateOfBirth.toISOString().split("T")[0],
    };

    await AsyncStorage.setItem("userData", JSON.stringify(userObj));

    Alert.alert("Success", `Your OTP is: ${otp}`, [
      { text: "OK", onPress: () => navigation.navigate("Login") },
    ]);
  };

  // ------------------------------------------------------
  // ---------------- UI START ----------------------------
  // ------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor={colors.primary} barStyle="light-content" />

      <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
>
  <ScrollView
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.scrollContainer}
  >

    {/* ONLY wrap the top blank area */}
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setShowDatePicker(false);
      }}
    >
      <View>
        <Text style={styles.title}>Create Account</Text>
      </View>
    </TouchableWithoutFeedback>

    {/* NOW ALL INPUTS BELOW ARE SAFE FOR SCROLLING */}
    {/* NAME */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder="Enter full name"
        placeholderTextColor={colors.gray}
        value={formData.name}
        onChangeText={(t) => updateFormData("name", t)}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
    </View>

    {/* EMAIL */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Enter email"
        placeholderTextColor={colors.gray}
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(t) => updateFormData("email", t)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
    </View>

    {/* PHONE */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Phone *</Text>
      <TextInput
        style={[styles.input, errors.phoneNumber && styles.inputError]}
        placeholder="Enter phone number"
        placeholderTextColor={colors.gray}
        keyboardType="phone-pad"
        maxLength={10}
        value={formData.phoneNumber}
        onChangeText={(t) => updateFormData("phoneNumber", t)}
      />
      {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
    </View>

    {/* GENDER */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Gender *</Text>
      <View style={styles.genderRow}>
        {["Male", "Female", "Other"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genderBox,
              formData.gender === g && styles.genderSelected,
            ]}
            onPress={() => updateFormData("gender", g)}
          >
            <Text
              style={[
                styles.genderText,
                formData.gender === g && { color: "#fff" },
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
    </View>

    {/* DATE */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Date of Birth *</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => {
          Keyboard.dismiss();
          setShowDatePicker(true);
        }}
      >
        <Text style={styles.dateText}>
          {formData.dateOfBirth.toDateString()}
        </Text>
      </TouchableOpacity>
      {errors.dateOfBirth && (
        <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
      )}
    </View>

    {/* ADDRESS */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Address *</Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          errors.address && styles.inputError,
        ]}
        placeholder="Enter your address"
        placeholderTextColor={colors.gray}
        multiline
        value={formData.address}
        onChangeText={(t) => updateFormData("address", t)}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
    </View>

    {/* REGISTER */}
    <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
      <Text style={styles.registerText}>Register</Text>
    </TouchableOpacity>

    {/* 👉 DIRECT LOGIN LINK */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>
              Already have an account?{" "}
              <Text style={styles.loginBold}>Login</Text>
            </Text>
          </TouchableOpacity>
  </ScrollView>
</KeyboardAvoidingView>

      {/* ---------------- DATE PICKER ---------------- */}
      {showDatePicker && (
        Platform.OS === "ios" ? (
          // ---------- iOS Custom Modal ----------
          <Modal transparent animationType="fade">
            <View style={styles.modalOverlay} />

            <View style={styles.modalCenter}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Date of Birth</Text>

                <DateTimePicker
                  value={formData.dateOfBirth}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) updateFormData("dateOfBirth", selectedDate);
                  }}
                  style={{ width: "100%" }}
                />

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.cancelBtn]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, styles.confirmBtn]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          // ---------- ANDROID NATIVE POPUP ----------
          <DateTimePicker
            value={formData.dateOfBirth}
            mode="date"
            display="calendar"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) updateFormData("dateOfBirth", selectedDate);
            }}
          />
        )
      )}
    </SafeAreaView>
  );
};

export default RegistrationScreen;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
    marginBottom: 20,
  },

  inputContainer: { marginBottom: 18 },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1.5,
    borderColor: colors.light,
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    backgroundColor: colors.white,
  },

  inputError: { borderColor: colors.danger, backgroundColor: "#FFF4F4" },
  errorText: { color: colors.danger, marginTop: 5 },

  genderRow: { flexDirection: "row", gap: 10 },

  genderBox: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.light,
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: { fontSize: 15, fontWeight: "600" },

  dateInput: {
    borderWidth: 1.5,
    borderColor: colors.light,
    padding: 14,
    borderRadius: 10,
  },
  dateText: { fontSize: 15, color: colors.dark },

  textArea: { height: 100, textAlignVertical: "top" },

  registerBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
   loginLink: {
  textAlign: "center",
  marginTop: 25,
  fontSize: 20,
  color: colors.dark,
},

loginBold: {
  color: colors.primary,
  fontWeight: "bold",
},

  // ---- Modal ----
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },

  modalBtnRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    justifyContent: "space-between",
  },

  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelBtn: { backgroundColor: "#EEE", marginRight: 10 },
  confirmBtn: { backgroundColor: colors.primary, marginLeft: 10 },

  cancelText: { fontSize: 16, color: colors.dark },
  confirmText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});
