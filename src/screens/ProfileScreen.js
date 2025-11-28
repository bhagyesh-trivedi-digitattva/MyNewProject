import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";

const ProfileScreen = () => {
  const { appTheme } = useContext(ThemeContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingImage, setUpdatingImage] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
    🔥 HANDLE CAMERA OR GALLERY
  ---------------------------------------- */
  const pickImage = () => {
    Alert.alert(
      "Change Profile Picture",
      "Choose an option",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openGallery },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        quality: 0.8,
        saveToPhotos: true,
      },
      handleImageResponse
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
      },
      handleImageResponse
    );
  };

  const handleImageResponse = async (res) => {
    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert("Error", "Image selection failed");
      return;
    }

    const uri = res.assets?.[0]?.uri;
    if (!uri) return;

    setUpdatingImage(true);

    const updatedUser = {
      ...userData,
      profileImage: uri,
    };

    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
    setUserData(updatedUser);

    setTimeout(() => setUpdatingImage(false), 500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: appTheme.colors.bg }]}
    >
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor={
          Platform.OS === "android" ? appTheme.colors.bg : "transparent"
        }
        barStyle={appTheme.dark ? "light-content" : "dark-content"}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appTheme.colors.primary} />
          <Text style={[styles.loadingText, { color: appTheme.colors.gray }]}>
            Loading profile...
          </Text>
        </View>
      ) : userData ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContainer]}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: appTheme.colors.primary }]}>
              Your Profile
            </Text>
            <Text style={[styles.subtitle, { color: appTheme.colors.gray }]}>
              Manage your personal details securely
            </Text>
          </View>

          {/* PROFILE IMAGE WITH EDIT BUTTON */}
          <View style={styles.imageWrapper}>
            <Image
              source={
                userData.profileImage
                  ? { uri: userData.profileImage }
                  : require("../assets/user.png")
              }
              style={styles.profileImage}
            />

            <TouchableOpacity style={styles.editImageBtn} onPress={pickImage}>
              <Text style={styles.editImageText}>✏️</Text>
            </TouchableOpacity>
          </View>

          {updatingImage && (
            <Text style={{ color: appTheme.colors.primary, marginBottom: 10 }}>
              Updating photo...
            </Text>
          )}

          {/* CARD */}
          <View
            style={[
              styles.userInfoCard,
              {
                backgroundColor: appTheme.colors.card,
                borderColor: appTheme.colors.light,
                shadowColor: appTheme.colors.dark,
              },
            ]}
          >
            <View
              style={[
                styles.cardHeader,
                { borderBottomColor: appTheme.colors.light },
              ]}
            >
              <Text style={[styles.cardTitle, { color: appTheme.colors.primary }]}>
                Profile Information
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: appTheme.colors.success },
                ]}
              >
                <Text style={[styles.statusText, { color: appTheme.colors.white }]}>
                  Verified
                </Text>
              </View>
            </View>

            {/* DETAILS */}
            <View style={styles.infoSection}>
              <View style={[styles.infoRow, { borderBottomColor: appTheme.colors.light }]}>
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Full Name
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {userData.name}
                </Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: appTheme.colors.light }]}>
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Email Address
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {userData.email}
                </Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: appTheme.colors.light }]}>
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Phone Number
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {userData.phoneNumber}
                </Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: appTheme.colors.light }]}>
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Gender
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {userData.gender}
                </Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: appTheme.colors.light }]}>
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Date of Birth
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {formatDate(userData.dateOfBirth)}
                </Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: appTheme.colors.light }]}>
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Address
                </Text>
                <Text style={[styles.infoValue, styles.addressText, { color: appTheme.colors.gray }]}>
                  {userData.address}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: appTheme.colors.gray }]}>
            No profile data found
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollContainer: { padding: 24 },

  header: { alignItems: "center", marginBottom: 20 },

  title: { fontSize: 28 },

  subtitle: { fontSize: 15, marginTop: 4 },

  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#007AFF",
  },

  editImageBtn: {
    position: "absolute",
    bottom: 0,
    right: 120,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
  },

  editImageText: {
    color: "#fff",
    fontSize: 14,
  },

  userInfoCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },

  cardTitle: { fontSize: 20 },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: { fontSize: 12 },

  infoSection: { gap: 16 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },

  infoLabel: { flex: 1, fontSize: 16 },

  infoValue: { flex: 2, fontSize: 16, textAlign: "right" },

  addressText: { textAlign: "right" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: { marginTop: 10 },
});

