import React, { useState, useContext } from "react";
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
import { ThemeContext } from "../context/ThemeContext";

const NotificationScreen = () => {
  const { appTheme } = useContext(ThemeContext);

  const [notifications] = useState([
    {
      id: "1",
      title: "Welcome to the App 🎉",
      message:
        "We’re glad to have you onboard. Explore features and get started!",
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
      message:
        "Don’t forget to complete your profile for better personalization.",
      time: "3h ago",
    },
    {
      id: "4",
      title: "App Update Available ⚙️",
      message:
        "A new version of the app is now live with performance improvements.",
      time: "Yesterday",
    },
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          backgroundColor: appTheme.colors.card,
          borderColor: appTheme.colors.gray,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: appTheme.colors.primary }]}>
          {item.title}
        </Text>

        <Text style={[styles.time, { color: appTheme.colors.gray }]}>
          {item.time}
        </Text>
      </View>

      <Text style={[styles.cardMessage, { color: appTheme.colors.text }]}>
        {item.message}
      </Text>
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

      <View
        style={[
          styles.headerContainer,
          { backgroundColor: appTheme.colors.card, borderColor: appTheme.colors.gray },
        ]}
      >
        <Text style={[styles.title, { color: appTheme.colors.primary }]}>
          🔔 Notifications
        </Text>

        <Text style={[styles.subtitle, { color: appTheme.colors.gray }]}>
          Stay updated with the latest alerts
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: appTheme.colors.gray }]}>
            No new notifications 🎉
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
      },
      android: { elevation: 3 },
    }),
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 15,
  },

  listContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
      },
      android: { elevation: 3 },
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
    flex: 1,
    paddingRight: 10,
  },

  cardMessage: {
    fontSize: 14,
    lineHeight: 20,
  },

  time: {
    fontSize: 12,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 30,
  },
});
