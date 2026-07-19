import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { CartItemResponse } from "../../api/cart";
import { getProductDetail } from "../../api/product";
import { ProductDetail as ProductDetailType } from "../../types/product";

// Components
import EmptyCart from "../../components/payment/EmptyCart";
import PaymentItemRow from "../../components/payment/PaymentItemRow";
import FulfillmentBanner from "../../components/payment/FulfillmentBanner";
import PaymentMethods from "../../components/payment/PaymentMethods";
import VoucherSelector from "../../components/payment/VoucherSelector";
import PaymentFooter from "../../components/payment/PaymentFooter";
import OptionEditModal from "../../components/payment/OptionEditModal";

export default function PaymentScreen() {
  const { cartItems, cartCount, totalPrice, updateQuantity, removeFromCart, updateItemOptions, isLoading } = useCart();
  const params = useLocalSearchParams();
  const mode = (params.mode as string) || "takeaway";
  const table = (params.table as string) || "";
  const address = (params.address as string) || "";

  const [isEditing, setIsEditing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash">("qris");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Option Editing states
  const [editingItem, setEditingItem] = useState<CartItemResponse | null>(null);
  const [editingProductDetail, setEditingProductDetail] = useState<ProductDetailType | null>(null);
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<number, boolean>>({});

  const openEditOptionsModal = async (item: CartItemResponse) => {
    setIsFetchingOptions(true);
    setEditingItem(item);
    try {
      const data = await getProductDetail(item.product_id);
      setEditingProductDetail(data);

      const initialSelected: Record<number, number> = {};
      const initialAddons: Record<number, boolean> = {};

      data.option_groups?.forEach((group) => {
        const groupId = Number(group.id);
        if (group.selection_type === "single") {
          const matchedVal = item.options.find((itemOpt) =>
            group.values.some((groupVal) => Number(groupVal.id) === Number(itemOpt.id))
          );
          if (matchedVal) {
            initialSelected[groupId] = Number(matchedVal.id);
          } else if (group.values && group.values.length > 0) {
            initialSelected[groupId] = Number(group.values[0].id);
          }
        } else {
          group.values.forEach((groupVal) => {
            const groupValId = Number(groupVal.id);
            const matchedVal = item.options.some((itemOpt) => Number(itemOpt.id) === groupValId);
            if (matchedVal) {
              initialAddons[groupValId] = true;
            }
          });
        }
      });

      setSelectedOptions(initialSelected);
      setSelectedAddons(initialAddons);
    } catch (err) {
      Alert.alert("Gagal", "Tidak dapat memuat varian produk.");
      setEditingItem(null);
    } finally {
      setIsFetchingOptions(false);
    }
  };

  const handleSaveOptions = async () => {
    if (!editingItem || !editingProductDetail) return;
    setUpdatingId(editingItem.id);
    setEditingItem(null);
    try {
      await updateItemOptions(
        editingItem.id,
        editingProductDetail,
        editingItem.quantity,
        {
          options: selectedOptions,
          addons: selectedAddons,
        }
      );
      Alert.alert("Berhasil", "Varian pesanan berhasil diubah!");
    } catch {
      Alert.alert("Gagal", "Tidak bisa mengubah varian pesanan.");
    } finally {
      setUpdatingId(null);
      setEditingProductDetail(null);
    }
  };

  const discountAmount = voucherApplied ? totalPrice * 0.1 : 0;

  const handleQuantityChange = async (item: CartItemResponse, delta: number) => {
    const newQty = item.quantity + delta;
    setUpdatingId(item.id);
    try {
      if (newQty <= 0) {
        await removeFromCart(item.id);
      } else {
        await updateQuantity(item.id, newQty);
      }
    } catch {
      Alert.alert("Gagal", "Tidak bisa mengubah jumlah item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = (item: CartItemResponse) => {
    Alert.alert(
      "Hapus Item",
      `Yakin ingin menghapus ${item.product_name} dari keranjang?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            setUpdatingId(item.id);
            try {
              await removeFromCart(item.id);
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ]
    );
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      // Simulate payment processing
      setTimeout(async () => {
        try {
          await Promise.all(cartItems.map((item) => removeFromCart(item.id)));
        } catch (e) {
          console.log("Error clearing cart: ", e);
        }

        setIsPaying(false);
        Alert.alert(
          "Pesanan Berhasil!",
          `Terima kasih! Pesanan Anda sedang diproses.\n\nMode: ${
            mode === "dine-in"
              ? "Dine-in (Meja " + table + ")"
              : mode === "delivery"
              ? "Delivery"
              : "Takeaway"
          }\nNomor antrean: #042`,
          [
            {
              text: "Kembali ke Menu",
              onPress: () => router.replace("/home"),
            },
          ]
        );
      }, 1500);
    } catch {
      setIsPaying(false);
      Alert.alert("Error", "Pembayaran gagal. Silakan coba lagi.");
    }
  };

  if (cartItems.length === 0 && !isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen
          options={{
            title: "Selesaikan Pesanan",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.replace("/home")} className="ml-4">
                <Ionicons name="chevron-back" size={28} color="#004D40" />
              </TouchableOpacity>
            ),
          }}
        />
        <EmptyCart onStartShopping={() => router.replace("/home")} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Verdant Brew",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="chevron-back" size={28} color="#004D40" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity className="mr-4">
              <Ionicons name="ellipsis-vertical" size={20} color="#004D40" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Title area */}
        <View className="px-5 mt-5 mb-[18px]">
          <Text
            className="text-[#0d1b2a] mb-1.5"
            style={{ fontFamily: "JakartaSansBold", fontSize: 26, letterSpacing: -0.5 }}
          >
            Selesaikan Pesanan
          </Text>
          <Text
            className="text-gray-500"
            style={{ fontFamily: "JakartaSans", fontSize: 14, lineHeight: 20 }}
          >
            Hanya selangkah lagi menuju kopi terbaikmu.
          </Text>
        </View>

        {/* Fulfillment Banner */}
        <FulfillmentBanner mode={mode} table={table} address={address} />

        {/* Order Summary Section */}
        <View className="flex-row justify-between items-center px-5 mb-2.5">
          <Text
            className="text-gray-400"
            style={{ fontFamily: "JakartaSansBold", fontSize: 11, letterSpacing: 1.2 }}
          >
            RINGKASAN PESANAN
          </Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text
              className="text-[#004D40] bg-[#004D40]/[0.08] overflow-hidden"
              style={{ fontFamily: "JakartaSansBold", fontSize: 13, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 }}
            >
              {isEditing ? "Selesai" : "Ubah"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          className="bg-white mx-5 overflow-hidden border border-gray-300"
          style={{
            borderRadius: 20,
          }}
        >
          {cartItems.map((item) => (
            <PaymentItemRow
              key={item.id}
              item={item}
              isEditing={isEditing}
              isUpdating={updatingId === item.id}
              onQuantityChange={handleQuantityChange}
              onDelete={handleDelete}
              onEditOptions={openEditOptionsModal}
            />
          ))}
        </View>

        {/* Payment Method Section */}
        <Text
          className="text-gray-400 px-5 mt-7 mb-3"
          style={{ fontFamily: "JakartaSansBold", fontSize: 11, letterSpacing: 1.2 }}
        >
          METODE PEMBAYARAN
        </Text>
        <PaymentMethods selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

        {/* Discount Voucher Section */}
        <VoucherSelector
          applied={voucherApplied}
          onToggle={() => {
            setVoucherApplied(!voucherApplied);
            Alert.alert(
              voucherApplied ? "Voucher Dilepas" : "Voucher Dipasang",
              voucherApplied ? "Diskon dibatalkan." : "Diskon hemat 10% berhasil diterapkan!"
            );
          }}
        />
      </ScrollView>

      {/* Sticky Checkout Footer */}
      <PaymentFooter
        totalPrice={totalPrice}
        discountAmount={discountAmount}
        cartCount={cartCount}
        isPaying={isPaying}
        onPay={handlePayNow}
      />

      {/* Option Editor Modal */}
      <OptionEditModal
        visible={editingItem !== null || isFetchingOptions}
        editingItem={editingItem}
        editingProductDetail={editingProductDetail}
        isFetchingOptions={isFetchingOptions}
        selectedOptions={selectedOptions}
        selectedAddons={selectedAddons}
        onClose={() => {
          setEditingItem(null);
          setEditingProductDetail(null);
        }}
        onSave={handleSaveOptions}
        onSelectOption={(groupId, valueId) =>
          setSelectedOptions((prev) => ({ ...prev, [groupId]: valueId }))
        }
        onToggleAddon={(valueId) =>
          setSelectedAddons((prev) => ({ ...prev, [valueId]: !prev[valueId] }))
        }
      />
    </SafeAreaView>
  );
}
