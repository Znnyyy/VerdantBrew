import React from "react";
import { View, Text, Image } from "react-native";

export default function OrderModeHero() {
  return (
    <View
      className="h-[180px] overflow-hidden relative mb-7"
      style={{
        borderRadius: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <Image
        source={require("../../../assets/images/logo-glow.png")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-[#004D40] opacity-75 rounded-[28px]" />
      <View className="flex-1 justify-end p-6">
        <Text
          className="text-white mb-1.5"
          style={{ fontFamily: "JakartaSansBold", fontSize: 24, lineHeight: 30 }}
        >
          How would you like to order?
        </Text>
        <Text
          className="text-white opacity-90"
          style={{ fontFamily: "JakartaSans", fontSize: 14 }}
        >
          Pilih cara pemesanan yang sesuai untukmu
        </Text>
      </View>
    </View>
  );
}
