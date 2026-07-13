import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFav, setIsFav] = useState(false);

  const formatPrice = (price: number) =>
    "Rp " + price.toLocaleString("id-ID");

  return (
    <View className="flex-1 mx-1.5 mb-4">
      <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* Image */}
        <View className="relative">
          <Image
            source={
              product.image_url
                ? { uri: product.image_url }
                : require("../../../assets/images/placeholder.png")
            }
            className="w-full h-36"
            resizeMode="cover"
          />
          {/* Fav button */}
          <TouchableOpacity
            onPress={() => setIsFav((v) => !v)}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow"
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={16}
              color={isFav ? "#e74c3c" : "#9ca3af"}
            />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View className="p-3">
          <Text
            className="text-gray-800 font-semibold text-[13px] mb-1"
            numberOfLines={1}
          >
            {product.name}
          </Text>
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-brand font-bold text-[13px]">
              {formatPrice(product.price)}
            </Text>
            <TouchableOpacity
              onPress={() => onAddToCart(product)}
              className="bg-white border border-brand rounded-full w-7 h-7 items-center justify-center"
            >
              <Ionicons name="add" size={18} color="#1a4d3e" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
