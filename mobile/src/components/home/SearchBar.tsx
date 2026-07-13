import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="flex-row mx-4 mt-2 mb-1 items-center gap-x-2">
      <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5">
        <Ionicons name="search-outline" size={18} color="#9ca3af" />
        <TextInput
          className="flex-1 ml-2 text-sm text-gray-700"
          placeholder="Find your brew..."
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      <TouchableOpacity className="bg-brand rounded-xl px-4 py-3 flex-row items-center gap-x-1">
        <Ionicons name="restaurant-outline" size={16} color="white" />
        <Text className="text-white text-sm font-semibold">Cari</Text>
      </TouchableOpacity>
    </View>
  );
}
