import { useLocalSearchParams, Stack, router } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getProductDetail } from "../../api/product";
import { ProductDetail as ProductDetailType } from "../../types/product";
import { useFonts } from "expo-font";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { id, name } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  // Selection states
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<number, boolean>>({});
  const [quantity, setQuantity] = useState(1);

  const [loaded] = useFonts({
    JakartaSansBold: require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    JakartaSansSemiBold: require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    JakartaSans: require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  useEffect(() => {
    if (id) {
      getProductDetail(Number(id))
        .then((data) => {
          setProduct(data);
          
          // Pre-select default values for single-select options (Sugar Level, Temperature)
          const initialSelected: Record<number, number> = {};
          data.option_groups?.forEach((group) => {
            if (group.selection_type === "single" && group.values && group.values.length > 0) {
              initialSelected[group.id] = group.values[0].id;
            }
          });
          setSelectedOptions(initialSelected);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal mengambil detail produk:", err);
          setLoading(false);
        });
    }
  }, [id]);

  const showPlaceholder = !product?.image_url || imgError;

  // Helper to map option group names to icons
  const getGroupIcon = (groupName: string) => {
    const nameLower = groupName.toLowerCase();
    if (nameLower.includes("sugar")) return "cog-outline";
    if (nameLower.includes("temp")) return "thermometer-outline";
    if (nameLower.includes("addon") || nameLower.includes("extra")) return "leaf-outline";
    return "cafe-outline";
  };

  // Helper to map option value names to icons (for addons)
  const getValueIcon = (valueLabel: string) => {
    const labelLower = valueLabel.toLowerCase();
    if (labelLower.includes("espresso") || labelLower.includes("shot")) return "add-circle-outline";
    if (labelLower.includes("caramel") || labelLower.includes("syrup")) return "water-outline";
    return "add-outline";
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Construct SelectedOptions structure
    const options: Record<number, number> = {};
    const addons: Record<number, boolean> = {};

    product.option_groups.forEach((group) => {
      if (group.selection_type === "single") {
        const valId = selectedOptions[group.id];
        if (valId !== undefined) {
          options[group.id] = valId;
        }
      } else {
        group.values.forEach((val) => {
          if (selectedAddons[val.id]) {
            addons[val.id] = true;
          }
        });
      }
    });

    addToCart(product, quantity, { options, addons });

    Alert.alert(
      "Berhasil",
      `${quantity}x ${product.name} telah dimasukkan ke keranjang!`
    );
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: 28 }}>
      <Stack.Screen
        options={{
          title: (name as string) || product?.name || "Detail Produk",
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back-outline" size={28} color="#1a4d3e" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons name="ellipsis-vertical" size={24} color="#1a4d3e" />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#1a4d3e" />
        </View>
      ) : product ? (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Product Image */}
            <View className="w-full aspect-square overflow-hidden bg-gray-100 mb-4">
              <Image
                source={
                  showPlaceholder
                    ? require("../../../assets/images/placeholder.jpg")
                    : { uri: product.image_url }
                }
                className="w-full h-full"
                resizeMode="cover"
                onError={() => setImgError(true)}
              />
            </View>

            <View className="px-5">
              {/* Product Name and Price */}
              <View className="flex flex-row items-center justify-between">
                <View style={{ flex: 1, maxWidth: "70%" }}>
                  <Text
                    className="text-[#00342B]"
                    style={{
                      fontFamily: "JakartaSansBold",
                      fontSize: 26,
                    }}
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>
                </View>
                <View style={{ flexShrink: 0 }}>
                  <Text
                    className="text-green-800"
                    style={{
                      fontFamily: "JakartaSansBold",
                      fontSize: 22,
                    }}
                  >
                    Rp {product.price.toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>

              {/* Product Description */}
              <View className="flex-row items-center">
                {product.description ? (
                  <Text
                    className="text-gray-600 mt-4 leading-6"
                    style={{
                      fontFamily: "JakartaSans",
                      fontSize: 16,
                    }}
                  >
                    {product.description}
                  </Text>
                ) : null}
              </View>

              {/* Dynamic Option Groups */}
              {product.option_groups?.map((group) => (
                <View key={group.id} style={{ marginTop: 24 }}>
                  {/* Group Header */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Ionicons
                      name={getGroupIcon(group.name)}
                      size={18}
                      color="#004D40"
                    />
                    <Text
                      style={{
                        fontFamily: "JakartaSansBold",
                        fontSize: 14,
                        color: "#9ca3af",
                        letterSpacing: 0.8,
                      }}
                    >
                      {group.name.toUpperCase()}
                    </Text>
                  </View>

                  {/* Group Values */}
                  {group.selection_type === "single" ? (
                    // Single Selection Buttons (Horizontal)
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      {group.values.map((val) => {
                        const isSelected = selectedOptions[group.id] === val.id;
                        const isHot = val.label.toLowerCase() === "hot";
                        const isIced = val.label.toLowerCase() === "iced";

                        return (
                          <TouchableOpacity
                            key={val.id}
                            onPress={() =>
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [group.id]: val.id,
                              }))
                            }
                            style={{
                              flex: 1,
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              borderRadius: 12,
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 8,
                              borderWidth: 1,
                              borderColor: isSelected ? "#004D40" : "transparent",
                              backgroundColor: isSelected ? "#004D40" : "#F5F5F5",
                            }}
                          >
                            {isHot && (
                              <Ionicons
                                name="flame"
                                size={18}
                                color={isSelected ? "#ffffff" : "#1a4d3e"}
                              />
                            )}
                            {isIced && (
                              <Ionicons
                                name="snow"
                                size={18}
                                color={isSelected ? "#ffffff" : "#1a4d3e"}
                              />
                            )}
                            <Text
                              style={{
                                fontFamily: isSelected
                                  ? "JakartaSansBold"
                                  : "JakartaSans",
                                fontSize: 15,
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
                    // Multiple Selection (Checkboxes)
                    <View style={{ flexDirection: "column", gap: 12 }}>
                      {group.values.map((val) => {
                        const isChecked = !!selectedAddons[val.id];

                        return (
                          <TouchableOpacity
                            key={val.id}
                            onPress={() =>
                              setSelectedAddons((prev) => ({
                                ...prev,
                                [val.id]: !prev[val.id],
                              }))
                            }
                            style={{
                              borderWidth: 1,
                              borderColor: isChecked ? "#004D40" : "#f3f4f6",
                              borderRadius: 16,
                              padding: 16,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              backgroundColor: isChecked ? "rgba(0, 77, 64, 0.05)" : "#ffffff",
                            }}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                              <Ionicons
                                name={getValueIcon(val.label)}
                                size={22}
                                color="#1a4d3e"
                              />
                              <Text
                                style={{
                                  fontFamily: "JakartaSans",
                                  fontSize: 15,
                                  color: "#1f2937",
                                }}
                              >
                                {val.label}
                              </Text>
                              {val.extra_price > 0 && (
                                <Text
                                  style={{
                                    fontFamily: "JakartaSans",
                                    fontSize: 13,
                                    color: "#9ca3af",
                                    marginLeft: 4,
                                  }}
                                >
                                  +Rp {val.extra_price.toLocaleString("id-ID")}
                                </Text>
                              )}
                            </View>
                            {isChecked ? (
                              <View style={{ backgroundColor: "#004D40", borderRadius: 8, width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                  name="checkmark"
                                  size={16}
                                  color="white"
                                />
                              </View>
                            ) : (
                              <View style={{ borderWidth: 2, borderColor: "#d1d5db", borderRadius: 8, width: 24, height: 24 }} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Sticky Bottom Bar (Positioned as sibling below ScrollView) */}
          <View
            style={{
              backgroundColor: "#ffffff",
              borderTopWidth: 1,
              borderTopColor: "#f3f4f6",
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 32,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Quantity Selector */}
            <View
              style={{
                backgroundColor: "#F5F5F5",
                borderRadius: 9999,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: "#f3f4f6",
                gap: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove-outline" size={20} color="#1a4d3e" />
              </TouchableOpacity>
              <Text
                style={{ fontFamily: "JakartaSansBold", fontSize: 16 }}
                className="text-gray-800 min-w-[20px] text-center"
              >
                {quantity}
              </Text>
              <TouchableOpacity onPress={() => setQuantity((q) => q + 1)}>
                <Ionicons name="add-outline" size={20} color="#1a4d3e" />
              </TouchableOpacity>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              onPress={handleAddToCart}
              style={{
                backgroundColor: "#004D40",
                flex: 1,
                marginLeft: 20,
                borderRadius: 9999,
                paddingVertical: 16,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="bag-handle-outline" size={20} color="white" />
              <Text
                style={{ fontFamily: "JakartaSansBold", fontSize: 16 }}
                className="text-white"
              >
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text className="text-gray-500">Produk tidak ditemukan</Text>
        </View>
      )}
    </View>
  );
}

