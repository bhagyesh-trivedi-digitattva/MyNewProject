import React from "react";
import { View, Text, FlatList } from "react-native";
import { useSelector } from "react-redux";

export default function CartScreen() {
  const cart = useSelector((state) => state.cart.items);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>🛒 Your Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, marginVertical: 5, backgroundColor: "#eee", borderRadius: 8 }}>
            <Text style={{ fontSize: 16 }}>{item.todo}</Text>
          </View>
        )}
      />
    </View>
  );
}
