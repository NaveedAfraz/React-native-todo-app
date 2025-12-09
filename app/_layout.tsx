import { ThemeProvider } from "@/context/themeContext";
import { TodoProvider } from "@/context/todoContext";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
  return (
    <TodoProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="index"
              options={{ title: "React Native Todo" }}
            />
            <Stack.Screen name="todos/[id]" options={{ title: "Todo" }} />
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </TodoProvider>
  );
}
