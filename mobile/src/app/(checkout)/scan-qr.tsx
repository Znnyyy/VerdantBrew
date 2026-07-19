import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QrScannerViewfinder from "../../components/scan-qr/QrScannerViewfinder";

export default function ScanQrScreen() {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      Alert.alert("Meja Terdeteksi", "Meja 12 terdeteksi. Silakan selesaikan pesanan Anda.", [
        {
          text: "Lanjut",
          onPress: () => {
            router.replace("/payment?mode=dine-in&table=12");
          },
        },
      ]);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 216],
  });

  return (
    <View className="flex-1 bg-stone-900">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 pb-2" style={{ paddingTop: Math.max(insets.top, 16) }}>
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "JakartaSansBold", fontSize: 22, color: "#ffffff" }}
        >
          Verdant Brew
        </Text>
        <TouchableOpacity
          className={`w-11 h-11 rounded-full items-center justify-center ${
            flashlightOn ? "bg-[#004D40]" : "bg-white/15"
          }`}
          onPress={() => setFlashlightOn(!flashlightOn)}
        >
          <Ionicons
            name={flashlightOn ? "flashlight" : "flashlight-outline"}
            size={20}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      {/* Info labels */}
      <View className="items-center mt-6 px-[30px]">
        <Text
          className="text-white mb-2"
          style={{ fontFamily: "JakartaSansBold", fontSize: 22 }}
        >
          Scan QR Code
        </Text>
        <Text
          className="text-gray-300 text-center"
          style={{ fontFamily: "JakartaSans", fontSize: 14, lineHeight: 20 }}
        >
          Arahkan kamera ke QR code yang ada di meja anda
        </Text>
      </View>

      {/* Viewfinder Area */}
      <View className="flex-1 items-center justify-center">
        <QrScannerViewfinder translateY={translateY} />
      </View>

      {/* Manual Trigger */}
      <View className="items-center" style={{ marginBottom: Math.max(insets.bottom, 24) }}>
        <TouchableOpacity
          className="bg-white/10 rounded-full py-3 px-6 border border-white/20"
          onPress={() => router.replace("/payment?mode=dine-in&table=12")}
        >
          <Text
            style={{ fontFamily: "JakartaSansSemiBold", fontSize: 14, color: "#ffffff" }}
          >
            Simulasikan Pemindaian
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
