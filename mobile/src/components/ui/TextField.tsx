import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TextFieldProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  showToggle?: boolean;
}

export default function TextField({
  label,
  icon,
  showToggle = false,
  className,
  ...rest
}: TextFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className="mt-3">
      <Text className="text-sm font-semibold mb-1 text-brand">{label}</Text>
      <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
        <Ionicons name={icon} size={18} color="#9ca3af" />
        <TextInput
          className={`flex-1 p-3 text-base ${className ?? ""}`}
          placeholderTextColor="#9ca3af"
          secureTextEntry={showToggle ? !isVisible : rest.secureTextEntry}
          {...rest}
        />
        {showToggle && (
          <TouchableOpacity onPress={() => setIsVisible((v) => !v)}>
            <Ionicons
              name={isVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}