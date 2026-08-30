import "react-native-url-polyfill/auto";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const isBrowser = () => typeof window !== "undefined";

const storage = {
    async getItem(key: string) {
        // Web
        if (Platform.OS === "web") {
            if (!isBrowser()) return null;
            return window.localStorage.getItem(key);
        }

        // Native
        return SecureStore.getItemAsync(key);
    },

    async setItem(key: string, value: string) {
        if (Platform.OS === "web") {
            if (!isBrowser()) return;
            window.localStorage.setItem(key, value);
            return;
        }

        await SecureStore.setItemAsync(key, value);
    },

    async removeItem(key: string) {
        if (Platform.OS === "web") {
            if (!isBrowser()) return;
            window.localStorage.removeItem(key);
            return;
        }

        await SecureStore.deleteItemAsync(key);
    },
};

export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey,
    {
        auth: {
            storage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: Platform.OS === "web" && isBrowser(),
        },
    }
);