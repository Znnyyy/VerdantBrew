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
      <View className="flex-1 flex-row items-center bg-[#E4E6E5] border border-gray-200 rounded-xl px-3 py-1.5">
        <Ionicons name="search-outline" size={22} color="#9ca3af" />
        <TextInput
          className="flex-1 ml-2 text-md text-gray-700"
          placeholder="Find your brew..."
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {/* <TouchableOpacity className="bg-[#004D40] rounded-xl px-5 py-4 flex-row items-center gap-x-1">
        <Ionicons name="restaurant-outline" size={22} color="white" />
        <Text className="text-white text-md font-semibold">Cari</Text>
      </TouchableOpacity> */}
    </View>
  );
}
