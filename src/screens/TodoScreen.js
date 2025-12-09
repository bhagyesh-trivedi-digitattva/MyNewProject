import React, { useState,useEffect } from "react";
import { View, Text, Button } from "react-native";
import TodoList from "../screens/TodoList";
import { usePrefetch } from "../slices/ApiSlice";

export default function TodoScreen() {
  const prefetchTodos = usePrefetch("getAllTodos");

  useEffect(() => {
    console.log("🔥 Prefetching INSIDE Provider...");
    prefetchTodos(undefined, { ifOlderThan: 10 }); 
  }, []);

  const [show, setShow] = useState(false);

  const handleToggle = () => {
    console.log("Toggling TodoList component");
    setShow((prev) => !prev);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text
        style={{
          fontSize: 20,
          marginBottom: 10,
          color: "red",
          marginTop: 15,
        }}
      >
        Todo List
      </Text>

      {/* Toggle TodoList */}
      {show && <TodoList />}

      <Button
        title={show ? "Hide TodoList" : "Show TodoList"}
        onPress={handleToggle}
      />
    </View>
  );
}
