import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FulfillmentBannerProps {
  mode: string;
  table: string;
  address: string;
}

export default function FulfillmentBanner({ mode, table, address }: FulfillmentBannerProps) {
  if (mode === "dine-in") {
    return (
      <View className="mx-5 bg-[#e6f4f1] rounded-2xl py-3 px-4 flex-row items-center gap-2 mb-6">
        <Ionicons name="restaurant-outline" size={18} color="#004D40" />
        <Text
          className="text-[#004D40] flex-1"
          style={{ fontFamily: "JakartaSans", fontSize: 14 }}
        >
          Dine-in · <Text style={{ fontFamily: "JakartaSansBold" }}>Meja {table}</Text>
        </Text>
      </View>
    );
  } else if (mode === "delivery") {
    return (
      <View className="mx-5 bg-[#e6f4f1] rounded-2xl py-3 px-4 flex-row items-center gap-2 mb-6">
        <Ionicons name="bicycle-outline" size={18} color="#004D40" />
        <Text
          className="text-[#004D40] flex-1"
          style={{ fontFamily: "JakartaSans", fontSize: 14 }}
          numberOfLines={1}
        >
          Delivery · <Text style={{ fontFamily: "JakartaSansBold" }}>{address.split(":")[0] || "Alamat Utama"}</Text>
        </Text>
      </View>
    );
  } else {
    return (
      <View className="mx-5 bg-[#e6f4f1] rounded-2xl py-3 px-4 flex-row items-center gap-2 mb-6">
        <Ionicons name="bag-handle-outline" size={18} color="#004D40" />
        <Text
          className="text-[#004D40] flex-1"
          style={{ fontFamily: "JakartaSans", fontSize: 14 }}
        >
          Takeaway · <Text style={{ fontFamily: "JakartaSansBold" }}>Ambil di Toko</Text>
        </Text>
      </View>
    );
  }
}
