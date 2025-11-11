import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor={Platform.OS === "android" ? colors.white : "transparent"}
        barStyle="dark-content"
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : userData ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Profile</Text>
            <Text style={styles.subtitle}>
              Manage your personal details securely
            </Text>
          </View>

          <View style={styles.userInfoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Profile Information</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Verified</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userData.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{userData.gender}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>
                  {formatDate(userData.dateOfBirth)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text
                  style={[styles.infoValue, styles.addressText]}
                  numberOfLines={2}
                >
                  {userData.address}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No profile data found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
    marginTop: 4,
  },
  userInfoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.light,
    ...Platform.select({
      ios: {
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: colors.gray,
    flex: 2,
    textAlign: "right",
  },
  addressText: {
    textAlign: "right",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 10,
  },
});
