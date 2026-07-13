import React from "react";
import { View, Image } from "react-native";
import { Text } from "react-native";

export default function HeroBanner() {
  return (
    <View className="mx-4 mt-4 rounded-2xl overflow-hidden h-44">
      <Image
        source={require("../../../assets/images/logo-glow.png")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      {/* Overlay gelap */}
      <View className="absolute inset-0 bg-brand opacity-60 rounded-2xl" />

      <View className="flex-1 justify-end p-4">
        <Text className="text-white text-[11px] font-semibold tracking-widest mb-0.5 opacity-90">
          TODAY'S SPECIAL
        </Text>
        <Text className="text-white text-xl font-bold">
          Golden Crust Croissants
        </Text>
        <Text className="text-white text-[12px] opacity-80 mt-0.5">
          Fresh from the oven at 7:00 AM
        </Text>
      </View>
    </View>
  );
}
