import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";

const GalleryScreen = () => {
  const { appTheme } = useContext(ThemeContext);

  const images = [
    require("../assets/pic1.jpg"),
    require("../assets/pic2.jpg"),
    require("../assets/pic3.jpg"),
    { uri: "https://picsum.photos/600/600?random=1" },
    { uri: "https://picsum.photos/600/600?random=2" },
    { uri: "https://picsum.photos/600/600?random=3" },
    { uri: "https://picsum.photos/600/600?random=4" },
    { uri: "https://picsum.photos/600/600?random=5" },
    { uri: "https://picsum.photos/600/600?random=6" },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.imageWrapper,
        { backgroundColor: appTheme.colors.card },
      ]}
      activeOpacity={0.8}
      onPress={() => setSelectedImage(item)}
    >
      <Image source={item} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );

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

      <Text style={[styles.header, { color: appTheme.colors.primary }]}>
        📸 Gallery
      </Text>

      <Text style={[styles.subHeader, { color: appTheme.colors.gray }]}>
        Local + Network Images
      </Text>

      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.galleryContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* FULLSCREEN PREVIEW MODAL */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={[
              styles.closeBtn,
              { backgroundColor: appTheme.colors.white },
            ]}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={[styles.closeText, { color: appTheme.colors.primary }]}>
              ✕
            </Text>
          </TouchableOpacity>

          <Image
            source={selectedImage}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: Platform.OS === "ios" ? 20 : 10,
  },

  subHeader: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },

  galleryContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },

  imageWrapper: {
    flex: 1 / 3,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  image: {
    width: "100%",
    height: 120,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  fullImage: {
    width: "100%",
    height: "80%",
    borderRadius: 12,
  },

  closeBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  closeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
