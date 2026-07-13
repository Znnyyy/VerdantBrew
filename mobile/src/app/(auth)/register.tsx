import React, { useState } from "react";
import { ScrollView, Alert, View, Text, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import axios from "axios";
import { MotiView } from "moti";
import { registerUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Divider from "../../components/auth/Divider";
import SocialButtons from "../../components/auth/SocialButtons";
import { useFonts } from "expo-font";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const [loaded] = useFonts({
    JakartaSansSemiBold: require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    JakartaSans: require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Nama, email, dan password wajib diisi");
      return;
    }
    if (!agreedToTerms) {
      Alert.alert(
        "Error",
        "Kamu harus menyetujui Terms of Service dan Privacy Policy",
      );
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        full_name: fullName,
        email,
        phone,
        password,
      });
      await signIn(result);
      router.replace("/home");
    } catch (error) {
      let message = "Registrasi gagal, coba lagi";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        message = error.response.data.error;
      }
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      className="bg-white"
      showsVerticalScrollIndicator={false}
    >
      <View className="p-6 justify-center py-12">
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 100 }}
        >
          <Text
            style={{ fontFamily: "JakartaSansSemiBold", fontSize: 28 }}
            className="text-[#003D33] mb-2 font-bold"
          >
            Create an Account
          </Text>
          <Text
            style={{ fontFamily: "JakartaSans", fontSize: 16, lineHeight: 24 }}
            className="text-[#8E6F4C] mb-8"
          >
            Start your journey with curated beans and exclusive tea blends.
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 150 }}
        >
          <TextField
            label="Full Name"
            icon="person-outline"
            placeholder="Enter your name"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextField
            label="Email Address"
            icon="mail-outline"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextField
            label="Phone Number"
            icon="call-outline"
            placeholder="+62 XXX-XXXX-XXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextField
            label="Password"
            icon="lock-closed-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            showToggle
          />

          <View className="mt-2 mb-6">
            <Checkbox
              checked={agreedToTerms}
              onToggle={() => setAgreedToTerms(!agreedToTerms)}
              label={
                <Text
                  style={{ fontFamily: "JakartaSans" }}
                  className="text-gray-600 text-[14px]"
                >
                  I agree to the{" "}
                  <Text className="font-bold text-[#003D33]">
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text className="font-bold text-[#003D33]">
                    Privacy Policy
                  </Text>
                </Text>
              }
            />
          </View>

          <Button
            title="Sign Up"
            onPress={handleRegister}
            loading={loading}
            className="bg-[#004D40] py-4 rounded-xl"
          />

          <Divider />

          <SocialButtons />
        </MotiView>

        <Link href="/login" asChild>
          <TouchableOpacity className="mt-8">
            <Text className="text-center text-gray-600 text-[15px]">
              Already a member?{" "}
              <Text className="font-bold text-[#003D33]">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
