import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: React.ReactNode;
}

export default function Checkbox({ checked, onToggle, label }: CheckboxProps) {
  return (
    <TouchableOpacity
      className="flex-row items-start mt-3"
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View
        className={`w-5 h-5 rounded border items-center justify-center mr-2 mt-0.5 ${
          checked ? "bg-brand border-brand" : "border-gray-300 bg-white"
        }`}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      <Text className="flex-1 text-gray-600 text-sm">{label}</Text>
    </TouchableOpacity>
  );
}