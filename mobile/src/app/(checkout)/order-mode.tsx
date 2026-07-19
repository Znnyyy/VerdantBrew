import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OrderModeHero from "../../components/order-mode/OrderModeHero";
import OrderModeOption from "../../components/order-mode/OrderModeOption";

export default function OrderModeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Verdant Brew",
          headerTitleAlign: "center",
          headerTintColor: "#00342B",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTitleStyle: {
            fontSize: 40,
            fontFamily: "JakartaSansBold",
          },
          headerBackVisible: false,
        }}
      />

      <View className="flex-1 pt-7">
        {/* Hero Banner Card */}
        <OrderModeHero />

        {/* Options List */}
        <View className="gap-4">
          <OrderModeOption
            icon="restaurant-outline"
            title="Dine-in"
            subtitle="Dine-in or quick pick-up"
            onPress={() => router.push("/scan-qr")}
          />
          <OrderModeOption
            icon="bag-handle-outline"
            title="Takeaway"
            subtitle="Order now, pick up later"
            onPress={() => router.push("/payment?mode=takeaway")}
          />
          <OrderModeOption
            icon="bicycle-outline"
            title="Delivery"
            subtitle="Premium delivery service"
            onPress={() => router.push("/address-selection")}
          />
        </View>

        {/* Back Button at Bottom */}
        <View className="flex-1 justify-end items-center mb-8">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-[#004D40] rounded-full py-4 px-10"
            activeOpacity={0.85}
            onPress={() => router.back()}
            style={{
              shadowColor: "#004D40",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="arrow-back-outline" size={20} color="#ffffff" className="mr-2" />
            <Text
              style={{ fontFamily: "JakartaSansBold", fontSize: 16, color: "#ffffff" }}
            >
              Kembali
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
