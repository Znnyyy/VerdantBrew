import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyCartProps {
  onStartShopping: () => void;
}

export default function EmptyCart({ onStartShopping }: EmptyCartProps) {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View className="w-[100px] h-[100px] rounded-full bg-[#f0fdf4] items-center justify-center mb-5">
        <Ionicons name="bag-outline" size={48} color="#004D40" />
      </View>
      <Text
        className="text-gray-800 mb-2"
        style={{ fontFamily: "JakartaSansBold", fontSize: 20 }}
      >
        Keranjang Kosong
      </Text>
      <Text
        className="text-gray-400 text-center"
        style={{ fontFamily: "JakartaSans", fontSize: 15, lineHeight: 22 }}
      >
        Yuk tambahkan minuman favoritmu ke keranjang!
      </Text>
      <TouchableOpacity
        onPress={onStartShopping}
        className="mt-7 bg-[#004D40] py-3.5 px-8"
        style={{ borderRadius: 16 }}
      >
        <Text
          style={{ fontFamily: "JakartaSansBold", fontSize: 15, color: "#ffffff" }}
        >
          Mulai Belanja
        </Text>
      </TouchableOpacity>
    </View>
  );
}
