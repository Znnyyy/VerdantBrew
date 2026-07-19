import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OrderModeOptionProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function OrderModeOption({ icon, title, subtitle, onPress }: OrderModeOptionProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white p-[18px] border border-gray-100"
      style={{
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View className="w-12 h-12 rounded-full bg-[#f0fdf4] items-center justify-center mr-4">
        <Ionicons name={icon as any} size={24} color="#004D40" />
      </View>
      <View className="flex-1">
        <Text
          className="text-gray-800 mb-0.5"
          style={{ fontFamily: "JakartaSansBold", fontSize: 16 }}
        >
          {title}
        </Text>
        <Text
          className="text-gray-500"
          style={{ fontFamily: "JakartaSans", fontSize: 13 }}
        >
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}
