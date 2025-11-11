import React, { useState } from "react";
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
import { colors } from "../constants/colors";

const GalleryScreen = () => {
  const images = [
    // Local Images
    require("../assets/pic1.jpg"),
    require("../assets/pic2.jpg"),
    require("../assets/pic3.jpg"),

    // Network Images
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
      style={styles.imageWrapper}
      activeOpacity={0.8}
      onPress={() => setSelectedImage(item)}
    >
      <Image source={item} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor={Platform.OS === "android" ? colors.white : "transparent"}
        barStyle="dark-content"
      />

      <Text style={styles.header}>📸 Gallery</Text>
      <Text style={styles.subHeader}>Local + Network Images</Text>

      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.galleryContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Fullscreen Preview */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedImage(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>✕</Text>
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
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginTop: Platform.OS === "ios" ? 20 : 10,
  },
  subHeader: {
    fontSize: 14,
    color: colors.gray,
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
    backgroundColor: colors.light,
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
    backgroundColor: "#fff",
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
    color: colors.primary,
  },
});
