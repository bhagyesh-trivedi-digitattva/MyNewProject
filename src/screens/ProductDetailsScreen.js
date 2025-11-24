import React from "react";
import { View, Text } from "react-native";

export default function ProductDetailsScreen({ route }) {
  return (
    <View>
      <Text>Product ID: {route.params?.id}</Text>
    </View>
  );
}
