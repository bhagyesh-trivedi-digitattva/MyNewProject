// HomeScreen.js
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  Platform,
} from "react-native";

import { ThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { setTestValue } from "../slices/authSlice";

import MapView, { Marker } from "react-native-maps";
import { useIsFocused } from "@react-navigation/native";

import { requestLocationPermission } from "../utils/permissions";
import { getCurrentLocation } from "../utils/locationService";

const { width } = Dimensions.get("window");
const GOOGLE_KEY = "AIzaSyBfCZH394cXpNT31aC7Tt4a0TQqHjbqAe4";
const reverseGeocode = async (lat, lng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    
    if (json.results?.length > 0) {
      return json.results[0].formatted_address;
    }
    return "Unknown Location";
  } catch (err) {
    console.log("Reverse Geocode Error:", err);
    return "Unknown Location";
  }
};

const HomeScreen = ({ navigation, route }) => {
  const { appTheme, toggleTheme } = useContext(ThemeContext);
const [loading, setLoading] = useState(false);
  const [myLocation, setMyLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [userData, setUserData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isFocused = useIsFocused();
  const drawerAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const testValue = useSelector((state) => state.auth.testValue);
  const dispatch = useDispatch();

  /* Load user data */
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) setUserData(JSON.parse(data));
    } catch (e) {
      console.log("User Load Error", e);
    }
  };

  /* Receive location from MapScreen */
  useEffect(() => {
    if (route?.params?.selectedLocation) {
      setMyLocation(route.params.selectedLocation);
      setAddress(route.params?.address || "");
    }
  }, [route.params]);
const mapRef = useRef(null);
  /* Use current device location */
const handleLocation = async () => {
  setLoading(true);

  setTimeout(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setLoading(false);
      return;
    }

    try {
      const loc = await getCurrentLocation();
      setMyLocation(loc);
      fetchAddress(loc.latitude, loc.longitude);

      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: loc.latitude,
            longitude: loc.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }, 200);

    } catch (err) {
      console.log("Location Error:", err);
    }

    setLoading(false);
  }, 3000);  // 3 seconds delay
};


  /* Reverse geocode */
  const fetchAddress = async (lat, lng) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_KEY}`;
      console.log("fetch Address :", url);
      const res = await fetch(url);
      const json = await res.json();

      if (json.results?.length > 0) {
        setAddress(json.results[0].formatted_address);
      } else {
        setAddress("Unknown Location");
      }
    } catch (err) {
      console.log("Reverse Geocode Error:", err);
    }
  };

  /* Drawer */
  const toggleDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: drawerOpen ? -width * 0.7 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setDrawerOpen(!drawerOpen);
  };

  /* Logout */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    navigation.replace("Auth");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appTheme.colors.bg }]}>

      <StatusBar
        translucent
        backgroundColor={Platform.OS === "android" ? appTheme.colors.bg : "transparent"}
        barStyle={appTheme.dark ? "light-content" : "dark-content"}
      />

      {/* MENU */}
      <View style={styles.menuBtn}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Image
            source={require("../assets/menu.png")}
            style={[styles.menuIcon, { tintColor: appTheme.colors.primary }]}
          />
        </TouchableOpacity>
      </View>

      {/* THEME TOGGLE */}
      <View style={styles.themeToggleContainer}>
        <TouchableOpacity onPress={toggleTheme}>
          <Animated.View
            style={[
              styles.toggleSwitch,
              { backgroundColor: appTheme.dark ? appTheme.colors.primary : appTheme.colors.gray },
            ]}
          >
            <View style={styles.iconWrapper}>
              <Text style={styles.iconSun}>☀️</Text>
              <Text style={styles.iconMoon}>🌙</Text>
            </View>

            <Animated.View
              style={[
                styles.toggleCircle,
                { transform: [{ translateX: appTheme.dark ? 27 : 0 }] },
              ]}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* SCROLL CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: appTheme.colors.primary }]}>
            {userData ? `Welcome, ${userData.name}!` : "Welcome 🎉"}
          </Text>
        </View>

        {/* REDUX TEST */}
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: appTheme.colors.primary }]}
          onPress={() => dispatch(setTestValue("Redux IS WORKING 🎉"))}
        >
          <Text style={[styles.primaryButtonText, { color: appTheme.colors.white }]}>TEST REDUX</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 10, color: appTheme.colors.primary }}>{testValue}</Text>

        {/* MAP */}
        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "bold" }}>Your Location</Text>

        <View style={styles.mapWrapper}>
          {myLocation ? (
            <MapView
             ref={mapRef} 
              style={StyleSheet.absoluteFillObject}
               provider={MapView.PROVIDER_GOOGLE}
              region={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={myLocation} />
            </MapView>
          ) : (
            <View style={styles.noLocation}>
              <Text>No location selected</Text>
            </View>
          )}
        </View>

        {myLocation && (
          <>
            <Text style={{ marginTop: 10, color: appTheme.colors.text }}>📍 {address}</Text>
            <Text>
              Lat: {myLocation.latitude} | Lng: {myLocation.longitude}
            </Text>
          </>
        )}  

        {/* BUTTONS */}
        <TouchableOpacity style={styles.blueBtn} onPress={handleLocation}>
          <Text style={styles.blueBtnText}>Use My Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.greenBtn}   onPress={() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("MapScreen");
    }, 3000);
  }}
>
          <Text style={styles.blueBtnText}>Select Location From Map</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: appTheme.colors.danger }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutButtonText, { color: appTheme.colors.danger }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* DRAWER OVERLAY */}
      {drawerOpen && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />}

      {/* DRAWER */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: drawerAnim }], backgroundColor: appTheme.colors.card },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Image
            source={require("../assets/user.png")}
            style={[styles.userIcon, { tintColor: appTheme.colors.primary }]}
          />
          <Text style={[styles.userName, { color: appTheme.colors.text }]}>{userData?.name}</Text>
          <Text style={[styles.userEmail, { color: appTheme.colors.gray }]}>{userData?.email}</Text>
        </View>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("Profile");
          }}
        >
          <Image source={require("../assets/profile.png")} style={[styles.drawerIcon]} />
          <Text style={[styles.drawerText, { color: appTheme.colors.primary }]}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
          <Image source={require("../assets/logout.png")} style={[styles.drawerIcon]} />
          <Text style={[styles.drawerText, { color: appTheme.colors.danger }]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
      {loading && (
  <View style={styles.loaderWrapper}>
    <View style={styles.loaderBox}>
      <Text style={{ color: "#fff", fontSize: 16 }}>Loading...</Text>
    </View>
  </View>
)}

    </SafeAreaView>
  );
};

export default HomeScreen;

/************* STYLES *************/
const styles = StyleSheet.create({
  container: { flex: 1 },

  menuBtn: { paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 10 : 20 },
  menuIcon: { width: 28, height: 28 },

  scrollContainer: { padding: 24 },
  header: { alignItems: "center", marginBottom: 20 },
  welcomeText: { fontSize: 30, fontWeight: "bold" },

  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: { fontSize: 16, fontWeight: "bold" },

  mapWrapper: {
    width: "100%",
    height: 250,
    backgroundColor: "#eee",
    borderRadius: 12,
    marginTop: 10,
    overflow: "hidden",
  },
loaderWrapper: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

loaderBox: {
  backgroundColor: "#000",
  paddingVertical: 20,
  paddingHorizontal: 30,
  borderRadius: 12,
},

  noLocation: { flex: 1, justifyContent: "center", alignItems: "center" },

  blueBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  greenBtn: {
    backgroundColor: "#34A853",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  blueBtnText: { color: "#fff", textAlign: "center", fontWeight: "600" },

  logoutButton: {
    borderWidth: 1.5,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  logoutButtonText: { fontSize: 16, fontWeight: "bold" },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 999,
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: width * 0.7,
    bottom: 0,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingLeft: 15,
    zIndex: 1000,
  },

  drawerHeader: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 12,
    marginBottom: 20,
  },

  userIcon: { width: 60, height: 60 },
  userName: { fontSize: 18, fontWeight: "bold", marginTop: 6 },
  userEmail: { fontSize: 14 },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  drawerIcon: { width: 24, height: 24, marginRight: 10 },
  drawerText: { fontSize: 16 },

  themeToggleContainer: {
    position: "absolute",
    right: 20,
    top: Platform.OS === "ios" ? 45 : 15,
    zIndex: 2000,
  },
  toggleSwitch: {
    width: 60,
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    position: "absolute",
    left: 2,
    top: 2,
  },
  iconWrapper: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 6 },
  iconSun: { fontSize: 14 },
  iconMoon: { fontSize: 14 },
});
