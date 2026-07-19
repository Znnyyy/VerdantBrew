import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartItemResponse } from "../../api/cart";
import { ProductDetail as ProductDetailType } from "../../types/product";

const getGroupIcon = (groupName: string) => {
  const nameLower = groupName.toLowerCase();
  if (nameLower.includes("sugar")) return "cog-outline";
  if (nameLower.includes("temp")) return "thermometer-outline";
  if (nameLower.includes("addon") || nameLower.includes("extra")) return "leaf-outline";
  return "cafe-outline";
};

const getValueIcon = (valueLabel: string) => {
  const labelLower = valueLabel.toLowerCase();
  if (labelLower.includes("espresso") || labelLower.includes("shot")) return "add-circle-outline";
  if (labelLower.includes("caramel") || labelLower.includes("syrup")) return "water-outline";
  return "add-outline";
};

interface OptionEditModalProps {
  visible: boolean;
  editingItem: CartItemResponse | null;
  editingProductDetail: ProductDetailType | null;
  isFetchingOptions: boolean;
  selectedOptions: Record<number, number>;
  selectedAddons: Record<number, boolean>;
  onClose: () => void;
  onSave: () => void;
  onSelectOption: (groupId: number, valueId: number) => void;
  onToggleAddon: (valueId: number) => void;
}

export default function OptionEditModal({
  visible,
  editingItem,
  editingProductDetail,
  isFetchingOptions,
  selectedOptions,
  selectedAddons,
  onClose,
  onSave,
  onSelectOption,
  onToggleAddon,
}: OptionEditModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/55 justify-end">
        <View
          className="bg-white pt-2"
          style={{
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            height: "70%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 24,
          }}
        >
          {isFetchingOptions ? (
            <View className="flex-1 p-10 items-center justify-center">
              <ActivityIndicator size="large" color="#004D40" />
              <Text
                className="text-gray-500 mt-3.5"
                style={{ fontFamily: "JakartaSansSemiBold", fontSize: 15 }}
              >
                Memuat varian...
              </Text>
            </View>
          ) : editingProductDetail ? (
            <View className="flex-1">
              {/* Drag Handle */}
              <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-4 mt-1" />

              {/* Modal Header */}
              <View className="flex-row items-center px-5 pb-4 border-b border-gray-100 gap-3">
                {editingItem?.image_url ? (
                  <Image
                    source={{ uri: editingItem.image_url }}
                    className="w-14 h-14 rounded-xl bg-gray-100"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-14 h-14 rounded-xl bg-gray-100 items-center justify-center">
                    <Ionicons name="image-outline" size={24} color="#9ca3af" />
                  </View>
                )}
                <View className="flex-1">
                  <Text
                    className="text-gray-400 mb-0.5"
                    style={{ fontFamily: "JakartaSansSemiBold", fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase" }}
                  >
                    Ubah Varian
                  </Text>
                  <Text
                    className="text-gray-900"
                    style={{ fontFamily: "JakartaSansBold", fontSize: 16, lineHeight: 22 }}
                    numberOfLines={2}
                  >
                    {editingProductDetail.name}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                  onPress={onClose}
                >
                  <Ionicons name="close" size={18} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Scroll Content */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="px-5 pt-2"
                contentContainerStyle={{ paddingBottom: 32 }}
              >
                {!editingProductDetail.option_groups || editingProductDetail.option_groups.length === 0 ? (
                  <View className="items-center mt-12">
                    <Ionicons name="cafe-outline" size={48} color="#9ca3af" />
                    <Text
                      className="text-gray-500 mt-3 text-center px-5"
                      style={{ fontFamily: "JakartaSansSemiBold", fontSize: 15, lineHeight: 22 }}
                    >
                      Produk ini tidak memiliki pilihan varian (Standard).
                    </Text>
                  </View>
                ) : (
                  editingProductDetail.option_groups.map((group) => (
                    <View key={group.id} className="mt-5">
                      {/* Group Header */}
                      <View className="flex-row items-center gap-1.5 mb-2.5">
                        <Ionicons name={getGroupIcon(group.name)} size={16} color="#004D40" />
                        <Text
                          className="text-gray-400"
                          style={{ fontFamily: "JakartaSansBold", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}
                        >
                          {group.name.toUpperCase()}
                        </Text>
                      </View>

                      {/* Group Values */}
                      {group.selection_type === "single" ? (
                        <View className="flex-row gap-2.5">
                          {group.values.map((val) => {
                            const isSelected = Number(selectedOptions[Number(group.id)]) === Number(val.id);
                            const isHot = val.label.toLowerCase() === "hot";
                            const isIced = val.label.toLowerCase() === "iced";

                            return (
                              <TouchableOpacity
                                key={val.id}
                                onPress={() => onSelectOption(Number(group.id), Number(val.id))}
                                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] ${
                                  isSelected
                                    ? "border-[#004D40] bg-[#004D40]"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                                style={{ paddingVertical: 13, paddingHorizontal: 14 }}
                              >
                                {isHot && (
                                  <Ionicons name="flame" size={16} color={isSelected ? "#ffffff" : "#004D40"} />
                                )}
                                {isIced && (
                                  <Ionicons name="snow" size={16} color={isSelected ? "#ffffff" : "#004D40"} />
                                )}
                                <Text
                                  style={{
                                    fontFamily: isSelected ? "JakartaSansBold" : "JakartaSansSemiBold",
                                    fontSize: 14,
                                    color: isSelected ? "#ffffff" : "#374151",
                                  }}
                                >
                                  {val.label}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      ) : (
                        <View className="flex-col gap-2.5">
                          {group.values.map((val) => {
                            const isChecked = !!selectedAddons[Number(val.id)];

                            return (
                              <TouchableOpacity
                                key={val.id}
                                onPress={() => onToggleAddon(Number(val.id))}
                                className={`flex-row items-center justify-between rounded-2xl border-[1.5px] ${
                                  isChecked
                                    ? "border-[#004D40] bg-[#004D40]/[0.03]"
                                    : "border-gray-100 bg-white"
                                }`}
                                style={{ paddingVertical: 14, paddingHorizontal: 16 }}
                              >
                                <View className="flex-row items-center gap-2.5">
                                  <Ionicons name={getValueIcon(val.label)} size={18} color={isChecked ? "#004D40" : "#6b7280"} />
                                  <Text
                                    style={{ fontFamily: "JakartaSansSemiBold", fontSize: 14, color: "#374151" }}
                                  >
                                    {val.label}
                                  </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                  <Text
                                    style={{ fontFamily: "JakartaSansBold", fontSize: 13, color: "#059669", marginRight: 4 }}
                                  >
                                    +Rp {val.extra_price.toLocaleString("id-ID")}
                                  </Text>
                                  <Ionicons
                                    name={isChecked ? "checkbox" : "square-outline"}
                                    size={20}
                                    color={isChecked ? "#004D40" : "#d1d5db"}
                                  />
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Save Button */}
              <View className="px-5 py-4 bg-white">
                <TouchableOpacity
                  className="bg-[#004D40] rounded-full py-4 items-center justify-center"
                  onPress={onSave}
                  activeOpacity={0.85}
                >
                  <Text
                    style={{ fontFamily: "JakartaSansBold", fontSize: 16, color: "#ffffff", letterSpacing: 0.3 }}
                  >
                    Simpan Perubahan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
