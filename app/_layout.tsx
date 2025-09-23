import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  // Load fonts here once for the entire app
  const [fontsLoaded] = useFonts({
    ManropeRegular: require("../assets/fonts/Manrope-Regular.ttf"),
    ManropeSemiBold: require("../assets/fonts/Manrope-SemiBold.ttf"),
    ManropeBold: require("../assets/fonts/Manrope-Bold.ttf"),
  });

  // While fonts load, prevent flicker
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#37B9C5" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" options={{ title: "Home" }} />
        <Stack.Screen name="(auth)/First" options={{ title: "Welcome" }} />
        <Stack.Screen name="(auth)/Register" options={{ title: "Register" }} />
        <Stack.Screen name="(auth)/LoginPage" options={{ title: "Login" }} />
        <Stack.Screen name="(auth)/SignUp" options={{ title: "Login" }} />
        <Stack.Screen name="OrderDetails" options={{ headerShown: false }} />
        <Stack.Screen name="AddOrder" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
