import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import FloatingCartButton from "../components/home/FloatingCartButton";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getCategories, getProducts } from "../api/product";
import { Category, Product } from "../types/product";
import { router, Stack } from "expo-router";

// Components
import SearchBar from "../components/home/SearchBar";
import HeroBanner from "../components/home/HeroBanner";
import CategoryTabs from "../components/home/CategoryTabs";
import ProductCard from "../components/home/ProductCard";
import BottomNav from "../components/home/BottomNav";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { addToCart, cartCount } = useCart();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [loaded] = useFonts({
    JakartaSansBold: require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    JakartaSansSemiBold: require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    JakartaSans: require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  const fetchData = useCallback(async (categoryId?: number) => {
    try {
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProducts(categoryId),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch {
      Alert.alert("Gagal", "Tidak bisa memuat data. Coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategoryPress = (catId: number | null) => {
    setSelectedCategory(catId);
    setLoading(true);
    fetchData(catId ?? undefined);
  };

  /**
   * Smart Add to Cart:
   * - If product has option_groups → navigate to detail page to pick options
   * - If product has no option_groups → add directly to cart (qty 1)
   */
  const handleAddToCart = (product: Product) => {
    const hasOptions = product.option_groups && product.option_groups.length > 0;

    if (hasOptions) {
      router.push(
        `/product/${product.id}?name=${encodeURIComponent(product.name)}`
      );
    } else {
      addToCart(product, 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(selectedCategory ?? undefined);
  };

  const handleBottomNavPress = (tab: "home" | "orders" | "profile") => {
    switch (tab) {
      case "profile":
        Alert.alert("Logout", "Yakin ingin keluar?", [
          { text: "Batal", style: "cancel" },
          {
            text: "Keluar",
            onPress: async () => {
              await signOut();
              router.replace("/login");
            },
          },
        ]);
        break;
      case "orders":
        // TODO: navigate to orders screen
        break;
      case "home":
      default:
        break;
    }
  };

  // Filter berdasarkan search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: 28 }}>
      <Stack.Screen
        options={{
          title: "Verdant Brew",
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 16 }}>
              <Ionicons name="menu-outline" size={28} color="#1a4d3e" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons name="notifications-outline" size={24} color="#1a4d3e" />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: cartCount > 0 ? 120 : 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1a4d3e"
          />
        }
      >
        <SearchBar value={search} onChangeText={setSearch} />

        <HeroBanner />

        <CategoryTabs
          categories={categories}
          selectedId={selectedCategory}
          onSelect={handleCategoryPress}
        />

        <View className="px-2.5 mt-3 pb-4">
          {loading ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator size="large" color="#1a4d3e" />
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="items-center justify-center py-16">
              <Ionicons name="cafe-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-400 mt-3 text-sm">
                Tidak ada produk ditemukan
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap">
              {filteredProducts.map((product) => (
                <View key={product.id} style={{ width: "50%" }}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNav {...({ active: "home", onPress: handleBottomNavPress } as any)} />

      <FloatingCartButton />
    </View>
  );
}
