import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const [loaded] = useFonts({
    JakartaSansBold: require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Verdant Brew",
        headerTitleAlign: "center",
        headerTintColor: "#00342B",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 40,
          fontFamily: "JakartaSansBold",
        },
        headerBackVisible: false,
        animation: "none",
      }}
    />
  );
}
