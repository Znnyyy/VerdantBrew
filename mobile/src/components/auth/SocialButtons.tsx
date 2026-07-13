import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

export default function SocialButtons() {
  const handleComingSoon = (provider: string) => {
    Alert.alert(
      "Segera Hadir",
      `Login dengan ${provider} belum tersedia saat ini.`,
    );
  };

  return (
    <View className="flex-row mt-2" style={{ gap: 16 }}>
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl py-3.5 bg-white"
        onPress={() => handleComingSoon("Google")}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <AntDesign name="google" size={18} color="#4285F4" />
        <Text
          className="ml-2.5 text-black font-medium text-[15px]"
          style={{ fontFamily: "JakartaSansSemiBold" }}
        >
          Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl py-3.5 bg-white"
        onPress={() => handleComingSoon("Apple")}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <FontAwesome5 name="apple" size={20} color="#000" />
        <Text
          className="ml-2.5 text-black font-medium text-[15px]"
          style={{ fontFamily: "JakartaSansSemiBold" }}
        >
          Apple
        </Text>
      </TouchableOpacity>
    </View>
  );
}
