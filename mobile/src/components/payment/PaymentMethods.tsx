import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PaymentMethodsProps {
  selectedMethod: "qris" | "cash";
  onSelect: (method: "qris" | "cash") => void;
}

export default function PaymentMethods({ selectedMethod, onSelect }: PaymentMethodsProps) {
  return (
    <View
      className="bg-white mx-5 p-4 border border-gray-300"
      style={{
        borderRadius: 24
      }}
    >
      {/* QRIS / Digital Payment Option */}
      <TouchableOpacity
        className="flex-row items-center py-1.5"
        activeOpacity={0.8}
        onPress={() => onSelect("qris")}
      >
        <View className="w-9 h-9 rounded-[10px] bg-[#004D40] items-center justify-center mr-3.5">
          <Ionicons name="qr-code-outline" size={20} color="#ffffff" />
        </View>
        <Text
          className="flex-1"
          style={{ fontFamily: "JakartaSansBold", fontSize: 14, color: "#374151" }}
        >
          QRIS / Digital Payment
        </Text>
        <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
          selectedMethod === "qris" ? "border-[#004D40]" : "border-gray-300"
        }`}>
          {selectedMethod === "qris" && (
            <View className="w-2.5 h-2.5 rounded-full bg-[#004D40]" />
          )}
        </View>
      </TouchableOpacity>

      <View className="h-px bg-gray-100 my-3" />

      {/* Cash Option */}
      <TouchableOpacity
        className="flex-row items-center py-1.5"
        activeOpacity={0.8}
        onPress={() => onSelect("cash")}
      >
        <View className="w-9 h-9 rounded-[10px] bg-gray-100 items-center justify-center mr-3.5">
          <Ionicons name="cash-outline" size={20} color="#4b5563" />
        </View>
        <Text
          className="flex-1"
          style={{ fontFamily: "JakartaSansBold", fontSize: 14, color: "#374151" }}
        >
          Bayar Tunai di Kasir
        </Text>
        <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
          selectedMethod === "cash" ? "border-[#004D40]" : "border-gray-300"
        }`}>
          {selectedMethod === "cash" && (
            <View className="w-2.5 h-2.5 rounded-full bg-[#004D40]" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
