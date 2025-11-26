// MapScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getCurrentLocation } from "../utils/locationService";

const GOOGLE_KEY = "AIzaSyBfCZH394cXpNT31aC7Tt4a0TQqHjbqAe4";

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);

  /* -------------------------------
     🔥 LOAD CURRENT LOCATION
     ------------------------------- */
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const loc = await getCurrentLocation();

        const newRegion = {
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setMarker({ latitude: loc.latitude, longitude: loc.longitude });

        setTimeout(() => {
          mapRef.current?.animateToRegion(newRegion, 800);
        }, 300);

      } catch (err) {
        console.log("MapScreen Location Error:", err);
      }

      setLoading(false);
    };

    loadLocation();
  }, []);

  /* -------------------------------
     🔍 GOOGLE AUTOCOMPLETE SEARCH
     ------------------------------- */
  const searchPlaces = async (t) => {
    setQuery(t);

    if (t.length < 3) {
      setPlaces([]);
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${t}&key=${GOOGLE_KEY}&components=country:in`;
    const res = await fetch(url);
    const json = await res.json();
    setPlaces(json.predictions || []);
  };

  /* -------------------------------
     📌 SELECT PLACE
     ------------------------------- */
  const selectPlace = async (placeId, description) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    const location = json.result.geometry.location;

    const newRegion = {
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(newRegion);
    setMarker(newRegion);
    setQuery(description);
    setPlaces([]);

    mapRef.current.animateToRegion(newRegion, 800);
  };

  /* -------------------------------
     🔄 REVERSE GEOCODING
     ------------------------------- */
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_KEY}`
      );
      const json = await res.json();
      if (json.results?.length > 0) return json.results[0].formatted_address;
      return "Unknown Location";
    } catch (err) {
      console.log("Reverse Geocode Error:", err);
      return "Unknown Location";
    }
  };

  /* -------------------------------
     ✔ CONFIRM LOCATION
     ------------------------------- */
  const confirmLocation = () => {
    if (!marker) return;

    navigation.navigate("MainTabs", {
      screen: "Home",
      params: { selectedLocation: marker, address: query },
    });
  };

  /* -------------------------------
     ❌ CANCEL SEARCH
     ------------------------------- */
  const cancelSearch = async () => {
    setQuery("");
    setPlaces([]);

    const loc = await getCurrentLocation();

    const newRegion = {
      latitude: loc.latitude,
      longitude: loc.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(newRegion);
    setMarker({ latitude: loc.latitude, longitude: loc.longitude });

    mapRef.current.animateToRegion(newRegion, 800);
  };

  /* -------------------------------
     ⏳ LOADING SCREEN
     ------------------------------- */
  if (loading || !region) {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loaderText}>Getting your current location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnIcon}>←</Text>
      </TouchableOpacity>

      {/* CANCEL BUTTON */}
      {query.length > 0 && (
        <TouchableOpacity style={styles.cancelBtn} onPress={cancelSearch}>
          <Text style={styles.btnIcon}>×</Text>
        </TouchableOpacity>
      )}

      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search location..."
          value={query}
          onChangeText={searchPlaces}
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {/* SUGGESTIONS */}
      {places.length > 0 && (
        <View style={styles.suggestionWrapper}>
          {places.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.suggestionItem}
              onPress={() => selectPlace(item.place_id, item.description)}
            >
              <Text style={styles.suggestionText}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* MAP VIEW */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={MapView.PROVIDER_GOOGLE}
        region={region}
        onPress={async (e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setMarker({ latitude, longitude });
          setQuery(await reverseGeocode(latitude, longitude));
        }}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      {/* CONFIRM BUTTON */}
      <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
        <Text style={styles.confirmText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;

/*************** STYLES ***************/
const styles = StyleSheet.create({
  /** LOADER **/
  loaderWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: { marginTop: 10, fontSize: 16, color: "#555" },

  /** UNIVERSAL FLOATING BUTTON DESIGN **/
  floatingBtn: {
    position: "absolute",
    zIndex: 2000,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 6 },
    }),
  },
  btnIcon: {
    fontSize: 22,
    color: "#222",
    fontWeight: "600",
    marginTop: -2,
  },

  /** BACK BUTTON **/
  backBtn: {
    top: Platform.OS === "ios" ? 55 : 30,
    left: 20,
  },

  /** CANCEL BUTTON **/
  cancelBtn: {
    top: Platform.OS === "ios" ? 55 : 30,
    right: 20,
    ...Platform.select({
      ios: { paddingHorizontal: 12, paddingVertical: 10 },
      android: {},
    }),
  },

  /** SEARCH BOX **/
  searchBox: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 75,
    width: "88%",
    alignSelf: "center",
    zIndex: 1500,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 5 },
    }),
  },

  /** SUGGESTIONS **/
  suggestionWrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 150 : 125,
    width: "88%",
    alignSelf: "center",
    maxHeight: 240,
    backgroundColor: "#fff",
    borderRadius: 12,
    zIndex: 1400,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 0.7,
    borderColor: "#eee",
  },
  suggestionText: {
    fontSize: 15,
    color: "#333",
  },

  /** CONFIRM BUTTON **/
  confirmBtn: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 8 },
    }),
  },
  confirmText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
