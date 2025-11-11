import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

const NotificationScreen = () => {
  const [notifications] = useState([
    {
      id: "1",
      title: "Welcome to the App 🎉",
      message: "We’re glad to have you onboard. Explore features and get started!",
      time: "2m ago",
    },
    {
      id: "2",
      title: "New Feature Alert 🚀",
      message: "Check out the new gallery feature in the Explore section!",
      time: "1h ago",
    },
    {
      id: "3",
      title: "Reminder 🔔",
      message: "Don’t forget to complete your profile for better personalization.",
      time: "3h ago",
    },
    {
      id: "4",
      title: "App Update Available ⚙️",
      message: "A new version of the app is now live with performance improvements.",
      time: "Yesterday",
    },
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.cardMessage}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor={Platform.OS === "android" ? colors.white : "transparent"}
        barStyle="dark-content"
      />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>🔔 Notifications</Text>
        <Text style={styles.subtitle}>Stay updated with the latest alerts</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No new notifications 🎉</Text>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    flex: 1,
    paddingRight: 10,
  },
  cardMessage: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: colors.gray,
  },
  emptyText: {
    textAlign: "center",
    color: colors.gray,
    fontSize: 16,
    marginTop: 30,
  },
});
