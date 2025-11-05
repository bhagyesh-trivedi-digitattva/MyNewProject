import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
const GalleryScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
            <View style={styles.content}>
                <Text style={styles.title}>GalleryScreen</Text>
                <Text style={styles.subtitle}>Discover amazing Image</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.primary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray,
        textAlign: 'center',
    },
});
export default GalleryScreen;