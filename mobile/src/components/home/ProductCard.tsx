import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Product } from "../../types/product";
import { useFonts } from "expo-font";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter();

  const [isFav, setIsFav] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number) => "Rp " + price.toLocaleString("id-ID");

  const showPlaceholder = !product.image_url || imgError;

  const [loaded] = useFonts({
    JakartaSansBold: require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    JakartaSans: require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  return (
    <Pressable
      className="flex-1 mx-1.5 mb-4"
      onPress={() => router.push(`/product/${product.id}?name=${encodeURIComponent(product.name)}`)}
    >
      <View className="rounded-2xl overflow-hidden">
        <View className="relative w-full aspect-square">
          <Image
            source={
              showPlaceholder
                ? require("../../../assets/images/placeholder.jpg")
                : { uri: product.image_url }
            }
            className="absolute inset-0 w-full h-full rounded-2xl"
            resizeMode="cover"
            onError={() => setImgError(true)}
          />

          <TouchableOpacity
            onPress={() => setIsFav((v) => !v)}
            className="absolute top-2 right-2 backdrop-blur-sm rounded-full px-3.5 py-3 bg-white/50"
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={20}
              color={isFav ? "#004D40" : "white"}
            />
          </TouchableOpacity>
        </View>

        <View className="p-3">
          <Text
            className="text-gray-800"
            style={{
              fontFamily: "JakartaSansBold",
              fontSize: 16,
            }}
            numberOfLines={1}
          >
            {product.name}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text
              className="text-[#004D40]"
              style={{
                fontFamily: "JakartaSansBold",
                fontSize: 15,
              }}
            >
              {formatPrice(product.price)}
            </Text>

            <TouchableOpacity
              onPress={() => onAddToCart(product)}
              className="bg-[#004D40]/10 rounded-2xl w-10 h-10 items-center justify-center"
            >
              <Ionicons name="add" size={24} color="#004D40" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
