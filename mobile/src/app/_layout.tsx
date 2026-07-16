import "../../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { useFonts } from "expo-font";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const [loaded] = useFonts({
    JakartaSansBold: require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          title: "Verdant Brew",
          headerTitleAlign: "center",
          headerTintColor: "#00342B",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 24,
            fontFamily: "JakartaSansBold",
          },
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 16 }}>
              <Ionicons name="menu-outline" size={28} color="#1a4d3e" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#1a4d3e"
              />
            </TouchableOpacity>
          ),
          animation: "none",
        }}
      />
    </AuthProvider>
  );
}
