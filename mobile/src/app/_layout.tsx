import "../../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [loaded] = useFonts({
    JakartaSansBold: require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Stack
          screenOptions={{
            headerShown: true,
            headerTitle: "Verdant Brew",
            headerTitleAlign: "center",
            headerTintColor: "#00342B",
            headerShadowVisible: false,
            headerTitleStyle: {
              fontSize: 24,
              fontFamily: "JakartaSansBold",
            },
            headerBackVisible: false,
            animation: "none",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
