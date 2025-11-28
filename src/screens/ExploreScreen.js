import React, { useEffect, useState, useContext } from "react";
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
import { ThemeContext } from "../context/ThemeContext";

const PAGE_SIZE = 10;

const ExploreScreen = () => {
  const { appTheme } = useContext(ThemeContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchApiData(1, false);
  }, []);

  const fetchApiData = async (pageNumber = 1, isRefreshing = false) => {
    if (!isRefreshing && pageNumber === 1) setLoading(true);
    try {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}&_limit=${PAGE_SIZE}`
      );

      const newData = res.data;

      if (pageNumber === 1) {
        setData(newData);
      } else {
        setData((prev) => [...prev, ...newData]);
      }

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
    <View
      style={[
        styles.card,
        {
          backgroundColor: appTheme.colors.card,
          borderColor: appTheme.colors.gray,
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: appTheme.colors.primary }]}>
        {item.title}
      </Text>
      <Text style={[styles.cardBody, { color: appTheme.colors.text }]}>
        {item.body}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={appTheme.colors.primary} />
        <Text style={[styles.loadingMoreText, { color: appTheme.colors.gray }]}>
          Loading more...
        </Text>
      </View>
    );
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

      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: appTheme.colors.primary }]}>
          Explore
        </Text>
        <Text style={[styles.subtitle, { color: appTheme.colors.gray }]}>
          Discover amazing content
        </Text>
      </View>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={appTheme.colors.primary} />
          <Text style={[styles.loadingText, { color: appTheme.colors.gray }]}>
            Loading posts...
          </Text>
        </View>
      )}

      {!loading && error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: appTheme.colors.danger }]}>
            {error}
          </Text>
          <Text
            style={[styles.retryText, { color: appTheme.colors.primary }]}
            onPress={() => fetchApiData(1, false)}
          >
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
              colors={[appTheme.colors.primary]}
              tintColor={appTheme.colors.primary}
            />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: appTheme.colors.gray }]}>
              No posts available right now.
            </Text>
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
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? 10 : StatusBar.currentHeight || 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
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
    marginBottom: 10,
    textAlign: "center",
  },
  retryText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
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
    marginTop: 6,
  },
});
