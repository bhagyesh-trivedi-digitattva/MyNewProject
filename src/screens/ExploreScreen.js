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

const PAGE_SIZE = 10; 

const ExploreScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchApiData(1, false); // Initial load
  }, []);

  const fetchApiData = async (pageNumber = 1, isRefreshing = false) => {
    if (!isRefreshing && pageNumber === 1) setLoading(true);
    try {
      // ✅ Fetch only limited data using API pagination
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}&_limit=${PAGE_SIZE}`
      );

      const newData = res.data;
      if (pageNumber === 1) {
        // First page (initial or refresh)
        setData(newData);
      } else {
        // Append new page data
        setData((prev) => [...prev, ...newData]);
      }

      // Stop if fewer than PAGE_SIZE items returned
      setHasMore(newData.length === PAGE_SIZE);
      setPage(pageNumber);
      setError("");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchApiData(1, true);
  };

  const loadMoreData = async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchApiData(nextPage, false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardBody}>{item.body}</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor={
          Platform.OS === "android" ? colors.white : "transparent"
        }
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
          <Text style={styles.retryText} onPress={() => fetchApiData(1, false)}>
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
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListFooterComponent={renderFooter}
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
    marginTop: Platform.OS === "ios" ? 10 : StatusBar.currentHeight || 20,
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
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMoreText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 6,
  },
});
