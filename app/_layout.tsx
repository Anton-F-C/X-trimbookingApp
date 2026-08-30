import "../global.css";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="(client-auth)" />
                <Stack.Screen name="(owner-auth)" />
                <Stack.Screen name="+not-found" />
            </Stack>
        </GestureHandlerRootView>
    );
}