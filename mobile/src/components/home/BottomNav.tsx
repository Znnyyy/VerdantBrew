import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomNavProps {
  active: "home" | "orders" | "profile";
}

export default function BottomNav({ active }: BottomNavProps) {
  const tabs = [
    { key: "home", label: "Home", icon: "home" as const },
    { key: "orders", label: "Orders", icon: "receipt-outline" as const },
    { key: "profile", label: "Profile", icon: "person-outline" as const },
  ] as const;

  return (
    <View className="flex-row border-t border-gray-100 bg-white pt-2 pb-4 px-4">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 items-center gap-y-0.5"
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? "#1a4d3e" : "#9ca3af"}
            />
            <Text
              className={`text-[11px] font-semibold ${
                isActive ? "text-brand" : "text-gray-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
