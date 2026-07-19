import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartItemResponse } from "../../api/cart";

interface PaymentItemRowProps {
  item: CartItemResponse;
  isEditing: boolean;
  isUpdating: boolean;
  onQuantityChange: (item: CartItemResponse, delta: number) => void;
  onDelete: (item: CartItemResponse) => void;
  onEditOptions?: (item: CartItemResponse) => void;
}

export default function PaymentItemRow({
  item,
  isEditing,
  isUpdating,
  onQuantityChange,
  onDelete,
  onEditOptions,
}: PaymentItemRowProps) {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !item.image_url || imgError;

  return (
    <View className="flex-row items-start py-3.5 px-3.5 border-b border-gray-50">
      {/* Product Thumbnail */}
      <View className="mr-3.5 self-start mt-0.5" style={{ borderRadius: 14 }}>
        <Image
          source={
            showPlaceholder
              ? require("../../../assets/images/placeholder.jpg")
              : { uri: item.image_url }
          }
          className="w-[72px] h-[72px] bg-gray-100"
          style={{ borderRadius: 14 }}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      </View>

      {/* Product Description */}
      <View className="flex-1 justify-start mt-2">
        <Text
          className="text-gray-900 mb-1.5"
          style={{ fontFamily: "JakartaSansBold", fontSize: 14, lineHeight: 20 }}
          numberOfLines={2}
        >
          {item.product_name}
        </Text>

        {/* Option pills */}
        {item.options && item.options.length > 0 ? (
          <View className="flex-row flex-wrap gap-1 mb-1.5">
            {item.options.slice(0, 3).map((o) => (
              <View key={o.id} className="bg-[#f0fdf4] rounded-2xl px-2 py-0.5 border border-[#bbf7d0]">
                <Text
                  className="text-[#16a34a]"
                  style={{ fontFamily: "JakartaSansSemiBold", fontSize: 10 }}
                  numberOfLines={1}
                >
                  {o.label}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-1 mb-1.5">
            <View className="bg-gray-100 rounded-2xl px-2 py-0.5 border border-gray-200">
              <Text
                className="text-gray-400"
                style={{ fontFamily: "JakartaSansSemiBold", fontSize: 10 }}
              >
                Standard
              </Text>
            </View>
          </View>
        )}

        {/* Edit variant button */}
        {isEditing && onEditOptions && (
          <TouchableOpacity
            className="flex-row items-center bg-[#004D40]/[0.07] rounded-lg self-start gap-1 border border-[#004D40]/[0.12]"
            style={{ paddingHorizontal: 9, paddingVertical: 5 }}
            onPress={() => onEditOptions(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={11} color="#004D40" />
            <Text
              className="text-[#004D40]"
              style={{ fontFamily: "JakartaSansBold", fontSize: 10 }}
            >
              Ubah Varian
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Price and quantity stepper OR static quantity */}
      <View className="items-end justify-start gap-1.5 pt-2">
        <Text
          className="text-gray-900"
          style={{ fontFamily: "JakartaSansBold", fontSize: 14 }}
        >
          Rp {item.item_total.toLocaleString("id-ID")}
        </Text>

        {isEditing ? (
          <View className="h-[30px] justify-center mt-0.5">
            {isUpdating ? (
              <ActivityIndicator size="small" color="#004D40" style={{ width: 80 }} />
            ) : (
              <View className="flex-row items-center">
                <TouchableOpacity
                  className={`w-[26px] h-[26px] rounded-lg items-center justify-center ${
                    item.quantity === 1 ? "bg-red-50" : "bg-gray-100"
                  }`}
                  onPress={() =>
                    item.quantity === 1 ? onDelete(item) : onQuantityChange(item, -1)
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.quantity === 1 ? "trash-outline" : "remove"}
                    size={13}
                    color={item.quantity === 1 ? "#ef4444" : "#374151"}
                  />
                </TouchableOpacity>
                <Text
                  className="text-gray-900 mx-2.5"
                  style={{ fontFamily: "JakartaSansBold", fontSize: 14, minWidth: 14, textAlign: "center" }}
                >
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  className="w-[26px] h-[26px] rounded-lg items-center justify-center bg-[#004D40]"
                  onPress={() => onQuantityChange(item, 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={13} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View className="bg-gray-100 rounded-lg px-2 py-0.5">
            <Text
              className="text-gray-500"
              style={{ fontFamily: "JakartaSansBold", fontSize: 12 }}
            >
              x{item.quantity}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
