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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";

const ProfileScreen = () => {
  const { appTheme } = useContext(ThemeContext);

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
            {/* CARD HEADER */}
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

              <View
                style={[
                  styles.infoRow,
                  { borderBottomColor: appTheme.colors.light },
                ]}
              >
                <View style={{ alignItems: "center", marginBottom: 20 }}>
  <Image
    source={
      userData?.profileImage
        ? { uri: userData.profileImage }
        : require("../assets/user.png")
    }
    style={{
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 2,
      borderColor: appTheme.colors.primary,
    }}
  />
</View>

                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Full Name
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {userData.name}
                </Text>
              </View>

              <View
                style={[
                  styles.infoRow,
                  { borderBottomColor: appTheme.colors.light },
                ]}
              >
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Email Address
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {userData.email}
                </Text>
              </View>

              <View
                style={[
                  styles.infoRow,
                  { borderBottomColor: appTheme.colors.light },
                ]}
              >
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Phone Number
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {userData.phoneNumber}
                </Text>
              </View>

              <View
                style={[
                  styles.infoRow,
                  { borderBottomColor: appTheme.colors.light },
                ]}
              >
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Gender
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {userData.gender}
                </Text>
              </View>

              <View
                style={[
                  styles.infoRow,
                  { borderBottomColor: appTheme.colors.light },
                ]}
              >
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Date of Birth
                </Text>
                <Text style={[styles.infoValue, { color: appTheme.colors.gray }]}>
                  {formatDate(userData.dateOfBirth)}
                </Text>
              </View>

              <View
                style={[
                  styles.infoRow,
                  { borderBottomColor: appTheme.colors.light },
                ]}
              >
                <Text style={[styles.infoLabel, { color: appTheme.colors.text }]}>
                  Address
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    styles.addressText,
                    { color: appTheme.colors.gray },
                  ]}
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
  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
userIcon: { 
  width: 70, 
  height: 70, 
  borderRadius: 35, 
  marginBottom: 6 
},

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
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
      android: { elevation: 8 },
    }),
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
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
  },

  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },

  infoValue: {
    fontSize: 16,
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
    marginTop: 10,
  },
});
