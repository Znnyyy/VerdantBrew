import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PaymentFooterProps {
  totalPrice: number;
  discountAmount: number;
  cartCount: number;
  isPaying: boolean;
  onPay: () => void;
}

export default function PaymentFooter({
  totalPrice,
  discountAmount,
  cartCount,
  isPaying,
  onPay,
}: PaymentFooterProps) {
  const finalPrice = totalPrice - discountAmount;

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 border-t border-gray-300"
      style={{ paddingBottom: 32 }}
    >
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text
            className="text-gray-500 mb-0.5"
            style={{ fontFamily: "JakartaSans", fontSize: 12 }}
          >
            Total Pembayaran
          </Text>
          <Text
            className="text-[#004D40]"
            style={{ fontFamily: "JakartaSansBold", fontSize: 22 }}
          >
            Rp {finalPrice.toLocaleString("id-ID")}
          </Text>
          {discountAmount > 0 && (
            <Text
              className="text-[#10b981] mt-0.5"
              style={{ fontFamily: "JakartaSans", fontSize: 11 }}
            >
              Hemat: Rp {discountAmount.toLocaleString("id-ID")}
            </Text>
          )}
        </View>
        <View className="bg-[#a7f3d0] px-3 py-1.5 rounded-full">
          <Text
            className="text-[#004D40]"
            style={{ fontFamily: "JakartaSansBold", fontSize: 12 }}
          >
            {cartCount} Items
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className={`bg-[#004D40] rounded-full flex-row items-center justify-center ${isPaying ? "opacity-80" : ""}`}
        style={{ paddingVertical: 18 }}
        activeOpacity={0.85}
        onPress={onPay}
        disabled={isPaying}
      >
        {isPaying ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <>
            <Text
              style={{ fontFamily: "JakartaSansBold", fontSize: 16, color: "#ffffff" }}
            >
              Bayar Sekarang
            </Text>
            <Ionicons name="arrow-forward-outline" size={20} color="#ffffff" className="ml-2" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
