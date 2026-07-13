import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { Category } from "../../types/product";

interface CategoryTabsProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryTabs({
  categories,
  selectedId,
  onSelect,
}: CategoryTabsProps) {
  const tabs = [
    { id: null, name: "All" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-5 mb-1 pl-4"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {tabs.map((tab) => {
        const isSelected = selectedId === tab.id;
        return (
          <TouchableOpacity
            key={tab.id ?? "all"}
            onPress={() => onSelect(tab.id)}
            className="mr-5"
          >
            <Text
              style={{
                fontFamily: isSelected ? "JakartaSansSemiBold" : "JakartaSans",
                fontSize: 14,
              }}
              className={isSelected ? "text-brand" : "text-gray-400"}
            >
              {tab.name}
            </Text>
            {isSelected && (
              <View className="mt-1 h-0.5 bg-brand rounded-full" />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
