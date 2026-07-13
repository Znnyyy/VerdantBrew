import React, { useState } from "react";
import { View, Alert, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import axios from "axios";
import { MotiView } from "moti";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Divider from "../../components/auth/Divider";
import SocialButtons from "../../components/auth/SocialButtons";
import { useFonts } from "expo-font";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const [loaded] = useFonts({
    JakartaSansSemiBold: require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    JakartaSans: require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      await signIn(result);
      router.replace("/home");
    } catch (error) {
      let message = "Login gagal, coba lagi";
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
            style={{
              fontFamily: "JakartaSansSemiBold",
              fontSize: 28,
            }}
            className="text-[#003D33] mb-2 font-bold"
          >
            Welcome Back!
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 150 }}
        >
          <Text
            style={{
              fontFamily: "JakartaSans",
              fontSize: 16,
              lineHeight: 24,
            }}
            className="text-[#8E6F4C] mb-8"
          >
            Brew your favorite cup and pick up right where you left off.
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 200 }}
        >
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
            label="Password"
            icon="lock-closed-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            showToggle
          />

          <View className="mt-2 mb-6">
            <Checkbox
              checked={rememberMe}
              onToggle={() => setRememberMe(!rememberMe)}
              label="Remember me"
            />
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            className="bg-[#004D40] py-4 rounded-xl"
          />

          <Divider />

          <SocialButtons />
        </MotiView>

        <Link href="/register" asChild>
          <TouchableOpacity className="mt-8">
            <Text className="text-center text-gray-600 text-[15px]">
              Don't have an account?{" "}
              <Text className="font-bold text-[#003D33]">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
