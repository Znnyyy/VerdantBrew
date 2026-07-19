import React from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QrScannerViewfinderProps {
  translateY: Animated.Value | Animated.AnimatedInterpolation<number>;
}

export default function QrScannerViewfinder({ translateY }: QrScannerViewfinderProps) {
  return (
    <View
      className="w-[250px] h-[250px] justify-center items-center relative"
      style={{
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Mock QR Code */}
      <View className="w-[180px] h-[180px] bg-stone-200 p-3 relative items-center justify-center" style={{ borderRadius: 16 }}>
        {/* QR Corners */}
        <View
          className="absolute"
          style={{ top: 12, left: 12, width: 36, height: 36, borderWidth: 8, borderColor: "#004D40", borderRadius: 4 }}
        />
        <View
          className="absolute"
          style={{ top: 12, right: 12, width: 36, height: 36, borderWidth: 8, borderColor: "#004D40", borderRadius: 4 }}
        />
        <View
          className="absolute"
          style={{ bottom: 12, left: 12, width: 36, height: 36, borderWidth: 8, borderColor: "#004D40", borderRadius: 4 }}
        />

        {/* Center Logo */}
        <View className="w-11 h-11 rounded-full bg-white border-2 border-[#004D40] items-center justify-center z-[2]">
          <Ionicons name="cafe-outline" size={24} color="#004D40" />
        </View>
        <Text
          className="text-[#004D40] mt-2.5"
          style={{ fontFamily: "JakartaSansBold", fontSize: 16 }}
        >
          TABLE 12
        </Text>
        <Text
          className="text-gray-600 mt-1"
          style={{ fontFamily: "JakartaSans", fontSize: 10 }}
        >
          SCAN TO ORDER
        </Text>
      </View>

      {/* Viewfinder Corners */}
      <View
        className="absolute"
        style={{
          top: -2, left: -2, width: 30, height: 30,
          borderTopWidth: 4, borderLeftWidth: 4,
          borderColor: "#ffffff", borderTopLeftRadius: 18,
        }}
      />
      <View
        className="absolute"
        style={{
          top: -2, right: -2, width: 30, height: 30,
          borderTopWidth: 4, borderRightWidth: 4,
          borderColor: "#ffffff", borderTopRightRadius: 18,
        }}
      />
      <View
        className="absolute"
        style={{
          bottom: -2, left: -2, width: 30, height: 30,
          borderBottomWidth: 4, borderLeftWidth: 4,
          borderColor: "#ffffff", borderBottomLeftRadius: 18,
        }}
      />
      <View
        className="absolute"
        style={{
          bottom: -2, right: -2, width: 30, height: 30,
          borderBottomWidth: 4, borderRightWidth: 4,
          borderColor: "#ffffff", borderBottomRightRadius: 18,
        }}
      />

      {/* Laser Line */}
      <Animated.View
        className="absolute h-1 bg-red-500"
        style={{
          top: 15, left: 15, right: 15,
          borderRadius: 2,
          shadowColor: "#ef4444",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
          elevation: 6,
          transform: [{ translateY }],
        }}
      />
    </View>
  );
}
