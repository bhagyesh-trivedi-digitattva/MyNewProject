import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import axios from "axios";

export default function TodoScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("https://dummyjson.com/todos")
      .then((response) => {
        console.log("Response:", response);
        setTodos(response.data.todos);
      })
      .catch((err) => {
        console.log("Error:", err);
        setError("Error fetching todos");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading Todos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View >
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Todo List</Text>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View >
            <Text style={{color:"blue"}} >
              {item.id}
            </Text>
            <Text style={{color:"orange"}} >
                {item.todo}
            </Text>
            <Text style={{ color: item.completed ? "green" : "red" }}>
              {item.completed ? "Completed" : "Pending"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}


