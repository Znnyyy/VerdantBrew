import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AddressCard from "../../components/address/AddressCard";

export default function AddressSelectionScreen() {
  const [selectedAddress, setSelectedAddress] = useState("Rumah (Utama)");

  const addresses = [
    {
      id: "Rumah (Utama)",
      tag: "Rumah (Utama)",
      details: "Jl. Kemang Raya No. 10, Mampang Prapatan",
      city: "Jakarta Selatan, DKI Jakarta 12730",
      recipient: "John Doe (+62 812-3456-7890)",
      icon: "home-outline",
    },
    {
      id: "Kantor",
      tag: "Kantor",
      details: "Gedung Cyber, Lt. 5, Jl. Kuningan Barat No. 8",
      city: "Jakarta Selatan, DKI Jakarta 12710",
      recipient: "John Doe (+62 812-3456-7890)",
      icon: "briefcase-outline",
    },
  ];

  const handleConfirm = () => {
    const addressDetails = addresses.find((a) => a.id === selectedAddress);
    const fullAddress = addressDetails
      ? `${addressDetails.tag}: ${addressDetails.details}, ${addressDetails.city}`
      : selectedAddress;

    router.replace(`/payment?mode=delivery&address=${encodeURIComponent(fullAddress)}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "Pilih Alamat",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-2">
              <Ionicons name="chevron-back" size={28} color="#004D40" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          className="text-gray-800 mb-1.5"
          style={{ fontFamily: "JakartaSansBold", fontSize: 20 }}
        >
          Mau dikirim ke mana?
        </Text>
        <Text
          className="text-gray-500 mb-6"
          style={{ fontFamily: "JakartaSans", fontSize: 14, lineHeight: 20 }}
        >
          Pilih salah satu alamat pengiriman tersimpan Anda
        </Text>

        <View className="gap-4 mb-6">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              tag={addr.tag}
              details={addr.details}
              city={addr.city}
              recipient={addr.recipient}
              icon={addr.icon}
              isSelected={selectedAddress === addr.id}
              onSelect={() => setSelectedAddress(addr.id)}
            />
          ))}
        </View>

        {/* Add New Address */}
        <TouchableOpacity className="flex-row items-center justify-center border-[1.5px] border-dashed border-[#004D40] rounded-[20px] p-4 bg-white" activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={22} color="#004D40" className="mr-2" />
          <Text
            style={{ fontFamily: "JakartaSansBold", fontSize: 15, color: "#004D40" }}
          >
            Tambah Alamat Baru
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation footer */}
      <View className="bg-white px-5 py-5 border-t border-gray-100">
        <TouchableOpacity
          className="bg-[#004D40] rounded-[18px] py-4 items-center justify-center"
          activeOpacity={0.85}
          onPress={handleConfirm}
        >
          <Text
            style={{ fontFamily: "JakartaSansBold", fontSize: 16, color: "#ffffff" }}
          >
            Konfirmasi Alamat
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
