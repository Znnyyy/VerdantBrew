import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between px-5 pt-12 pb-3 bg-gray-50">
      <TouchableOpacity>
        <Ionicons name="menu-outline" size={28} color="#1a4d3e" />
      </TouchableOpacity>

      <Text
        style={{ fontFamily: "JakartaSansBold", fontSize: 22 }}
        className="text-brand"
      >
        Verdant Brew
      </Text>

      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={26} color="#1a4d3e" />
      </TouchableOpacity>
    </View>
  );
}
