import { Stack } from "expo-router";

export default function OwnerAuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}