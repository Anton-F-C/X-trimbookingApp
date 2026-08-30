import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-black px-6">
            <Text className="text-2xl font-bold text-white">
                This screen doesn't exist.
            </Text>

            <Link
                href="/"
                className="mt-6 text-lg font-semibold text-[#66CCFF]"
            >
                Go back
            </Link>
        </View>
    );
}