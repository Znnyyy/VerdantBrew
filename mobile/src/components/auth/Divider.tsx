import React from "react";
import { View, Text } from "react-native";

export default function Divider() {
  return (
    <View className="flex-row items-center my-5">
      <View className="flex-1 h-px bg-gray-200" />
      <Text className="mx-3 text-xs text-gray-400">OR</Text>
      <View className="flex-1 h-px bg-gray-200" />
    </View>
  );
}
