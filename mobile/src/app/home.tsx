import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useAuth } from "../context/AuthContext";
import { getCategories, getProducts } from "../api/product";
import { Category, Product } from "../types/product";

// Components
import SearchBar from "../components/home/SearchBar";
import HeroBanner from "../components/home/HeroBanner";
import CategoryTabs from "../components/home/CategoryTabs";
import ProductCard from "../components/home/ProductCard";
import BottomNav from "../components/home/BottomNav";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
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

  const handleAddToCart = (product: Product) => {
    Alert.alert(
      "Ditambahkan",
      `${product.name} berhasil ditambahkan ke keranjang.`,
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(selectedCategory ?? undefined);
  };

  // Filter berdasarkan search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-white pt-7">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        showsVerticalScrollIndicator={false}
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

      <BottomNav active="home" />
    </View>
  );
}
