import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AddressCardProps {
  tag: string;
  details: string;
  city: string;
  recipient: string;
  icon: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function AddressCard({
  tag,
  details,
  city,
  recipient,
  icon,
  isSelected,
  onSelect,
}: AddressCardProps) {
  return (
    <TouchableOpacity
      className={`bg-white p-[18px] border-[1.5px] ${
        isSelected ? "border-[#004D40] bg-[#fcfdfd]" : "border-gray-200"
      }`}
      style={{
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}
      activeOpacity={0.8}
      onPress={onSelect}
    >
      {/* Header */}
      <View className="flex-row items-center mb-3.5">
        <View className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
          isSelected ? "bg-[#004D40]" : "bg-gray-100"
        }`}>
          <Ionicons name={icon as any} size={20} color={isSelected ? "#ffffff" : "#6b7280"} />
        </View>
        <Text
          className="flex-1 text-gray-800"
          style={{ fontFamily: "JakartaSansBold", fontSize: 15 }}
        >
          {tag}
        </Text>
        <View className="items-center justify-center">
          <View className={`w-[22px] h-[22px] rounded-full border-2 items-center justify-center ${
            isSelected ? "border-[#004D40]" : "border-gray-300"
          }`}>
            {isSelected && (
              <View className="w-3 h-3 rounded-full bg-[#004D40]" />
            )}
          </View>
        </View>
      </View>

      {/* Body */}
      <View className="pl-12">
        <Text
          className="text-gray-600"
          style={{ fontFamily: "JakartaSansSemiBold", fontSize: 14, lineHeight: 20 }}
        >
          {details}
        </Text>
        <Text
          className="text-gray-500 mt-0.5"
          style={{ fontFamily: "JakartaSans", fontSize: 13 }}
        >
          {city}
        </Text>
        <View className="h-px bg-gray-100 my-3" />
        <Text
          className="text-gray-500"
          style={{ fontFamily: "JakartaSans", fontSize: 13 }}
        >
          Penerima: {recipient}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
