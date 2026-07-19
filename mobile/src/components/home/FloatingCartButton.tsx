import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";
import { useFonts } from "expo-font";

export default function FloatingCartButton() {
  const { cartCount, totalPrice } = useCart();

  const [loaded] = useFonts({
    JakartaSansBold: require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  if (cartCount === 0 || !loaded) return null;

  return (
    <TouchableOpacity
      onPress={() => router.push("/order-mode" as any)}
      style={{
        position: "absolute",
        bottom: 90,
        left: 20,
        right: 20,
        backgroundColor: "#004D40",
        borderRadius: 100,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#004D40",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
      }}
      activeOpacity={0.85}
    >
      {/* Kiri: ikon tas + jumlah item */}
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 12,
          paddingVertical: 4,
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Ionicons name="bag-handle-outline" size={18} color="white" />
        <Text
          style={{
            fontFamily: "JakartaSansBold",
            fontSize: 14,
            color: "#ffffff",
          }}
        >
          {cartCount} item
        </Text>
      </View>

      {/* Tengah: label */}
      <Text
        style={{
          fontFamily: "JakartaSansBold",
          fontSize: 15,
          color: "#ffffff",
        }}
      >
        Lihat Keranjang
      </Text>

      {/* Kanan: total harga */}
      <Text
        style={{
          fontFamily: "JakartaSansBold",
          fontSize: 14,
          color: "#ffffff",
        }}
      >
        Rp {totalPrice.toLocaleString("id-ID")}
      </Text>
    </TouchableOpacity>
  );
}
