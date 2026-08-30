import { router } from "expo-router";
import {
    Image,
    ImageBackground,
    Pressable,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClientWelcomeScreen() {
    return (
        <ImageBackground
            source={require("../../assets/images/welcome-photo.jpeg")}
            resizeMode="cover"
            className="flex-1"
        >
            <View className="absolute inset-0 bg-black/40" />

            <SafeAreaView className="flex-1 px-6">
                <View className="flex-1 items-center justify-center">

                    <Text className="mt-5 text-center text-3xl font-bold text-white">
                        X-Trim-Lee
                    </Text>

                    <Text className="mt-2 text-center text-base text-white/80">
                        Fresh Cuts
                    </Text>
                </View>

                <View className="pb-8">
                    <Pressable
                        onPress={() => router.push("/(client-auth)/sign-in")}
                        className="w-full items-center justify-center rounded-full bg-[#66CCFF] py-4 active:opacity-80"
                    >
                        <Text className="text-lg font-semibold text-black">
                            Continue
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}