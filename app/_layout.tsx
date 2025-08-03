import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" options={{ title: "Home" }} />
        <Stack.Screen name="(auth)/First" options={{ title: "Welcome" }} />
        <Stack.Screen name="(auth)/Second" options={{ title: "Second" }} />
        <Stack.Screen name="(auth)/Register" options={{ title: "Register" }} />
        <Stack.Screen name="(auth)/PhoneRegister" options={{ title: "Phone Register" }} />
        <Stack.Screen name="(auth)/EmailRegister" options={{ title: "Email Register" }} />
        <Stack.Screen name="(auth)/LoginPage" options={{ title: "Login" }} />
        <Stack.Screen name="(auth)/LoginSuccess" options={{ title: "Login Success" }} />
        <Stack.Screen name="OrderDetails" options={{ headerShown: false }} />
        <Stack.Screen name="AddOrder" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
