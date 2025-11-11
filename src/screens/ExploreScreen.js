import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { colors } from "../constants/colors";

const ExploreScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      setData(res.data.slice(0, 10)); // Limit for clarity
      setError("");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchApiData(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardBody}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor={Platform.OS === "android" ? colors.white : "transparent"}
        barStyle="dark-content"
      />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover amazing content</Text>
      </View>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      )}

      {!loading && error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={() => fetchApiData()}>
            Tap to retry
          </Text>
        </View>
      ) : null}

      {!loading && !error && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts available right now.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? 10 : 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: "center",
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    color: colors.gray,
  },
  emptyText: {
    textAlign: "center",
    color: colors.gray,
    fontSize: 16,
    marginTop: 20,
  },
});
