import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  TextInput,
  Button,TouchableOpacity
} from "react-native";
import { useGetAllTodosQuery, useAddTodoMutation } from "../slices/ApiSlice";
import TodoRow from "../screens/TodoRow";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
export default function TodoList() {
    const navigation = useNavigation();
    const cartCount = useSelector((state) => state.cart.items.length);

    const LIMIT = 10;
    const [skip, setSkip] = useState(0);

    console.log("🔄 TodoList Component Rendered");

    const { data, error, isLoading, refetch ,isFetching} = useGetAllTodosQuery({limit:LIMIT, skip});
    
    const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
    const [newTodo, setNewTodo] = useState("");

    // const handleAddTodo = async () => {
    //     const text = newTodo.trim();
    //     if (!text) {
    //         alert("Please enter todo text");
    //         return;
    //     }

    //     try {
    //         console.log("➕ Adding Todo:", text);
    //         const added = await addTodo(text).unwrap();
    //         refetch();
    //         console.log("✅ Added todo response:", added);
    //         setNewTodo("");
    //         console.log("🔁 Todo added - cache will be invalidated (or call refetch)");
    //     } catch (err) {
    //         console.error("❌ Failed to add todo:", err);
    //         alert("Failed to add todo. See console for details.");
    //     }
    // };

    const handleAddTodo = async () => {
        const text = newTodo.trim();
        if (!text) {
            alert("Please enter todo text");
            return;
        }
        await addTodo(newTodo).unwrap();
        setNewTodo("");
        refetch();
    };

    const handleLoadMore = () => {
        if (isFetching) return;
        setSkip((prevSkip) => prevSkip + LIMIT);

        console.log("Attempting to load more todos...",skip);    
    };

    console.log("API Status:", {
        isLoading,
        hasData: !!data,
        error,
        isAdding,
    });

    if (isLoading && skip === 0) {
        console.log("Loading todos...");
        return (
            <View style={{ marginTop: 20 }}>
                <ActivityIndicator size="large" />
                <Text>Loading Todos...</Text>
            </View>
        );
    }

    if (error) {
        console.log("API ERROR:", error);
        return <Text style={{ color: "red" }}>Error fetching todos</Text>;
    }

    console.log("API Data Received:", data?.todos);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CartScreen")}
            style={{
              backgroundColor: "#0066FF",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              View Cart ({cartCount})
            </Text>
          </TouchableOpacity>
        </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 15,
                    gap: 10,
                }}
            >
                <TextInput
                    placeholder="Enter new todo"
                    value={newTodo}
                    onChangeText={setNewTodo}
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: "gray",
                        borderRadius: 8,
                        padding: 10,
                        color: "blue",
                    }}
                    onSubmitEditing={handleAddTodo}
                    returnKeyType="done"
                />

                <Button
                    title={isAdding ? "Adding..." : "ADD"}
                    onPress={handleAddTodo}
                    disabled={isAdding}
                />
            </View>

            <FlatList
                data={data?.todos || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <TodoRow todo={item} />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isFetching ? (
                        <View style={{ padding: 15 }}>
                            <ActivityIndicator size="small" />
                            <Text style={{ textAlign: "center" }}>Loading more todos...</Text>
                        </View>
                    ): null
                }
            />
        </View>
    );
}
