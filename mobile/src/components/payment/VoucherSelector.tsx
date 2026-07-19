import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VoucherSelectorProps {
  applied: boolean;
  onToggle: () => void;
}

export default function VoucherSelector({ applied, onToggle }: VoucherSelectorProps) {
  return (
    <TouchableOpacity
      className="bg-white mx-5 mt-4 p-[18px] flex-row items-center border border-gray-300"
      style={{
        borderRadius: 20
      }}
      activeOpacity={0.85}
      onPress={onToggle}
    >
      <Ionicons name="pricetag-outline" size={20} color="#004D40" className="mr-3" />
      <Text
        className="flex-1"
        style={{ fontFamily: "JakartaSansSemiBold", fontSize: 14, color: "#374151" }}
      >
        {applied ? "Voucher: DISKON10 (Aktif)" : "Gunakan Voucher Diskon"}
      </Text>
      <Ionicons
        name={applied ? "checkmark-circle" : "chevron-forward-outline"}
        size={18}
        color={applied ? "#10b981" : "#9ca3af"}
      />
    </TouchableOpacity>
  );
}
