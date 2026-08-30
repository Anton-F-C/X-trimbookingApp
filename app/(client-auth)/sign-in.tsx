import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function ClientSignInScreen() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = () => {
        // Front-end only for now.
        console.log("Sign in:", {
            phone,
            password,
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingBottom: 40,
                    }}
                >
                    {/* Logo / return to welcome */}
                    <Pressable
                        onPress={() =>
                            router.replace(
                                "/(client-auth)/welcome"
                            )
                        }
                        className="items-center"
                    >
                        <Image
                            source={require(
                                "../../assets/logos/logo.png"
                            )}
                            className="h-40 w-40"
                            resizeMode="contain"
                        />
                    </Pressable>

                    {/* Header */}
                    <View className="mt-4">
                        <Text className="text-3xl font-bold text-white">
                            Welcome Back
                        </Text>

                        <Text className="mt-3 text-base leading-6 text-white/60">
                            Sign in to manage your
                            bookings and appointments.
                        </Text>
                    </View>

                    {/* Phone */}
                    <View className="mt-8">
                        <Text className="mb-2 text-sm font-semibold text-white">
                            Phone Number{" "}
                            <Text className="text-red-500">
                                *
                            </Text>
                        </Text>

                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            placeholderTextColor="#737373"
                            keyboardType="phone-pad"
                            autoComplete="tel"
                            textContentType="telephoneNumber"
                            autoCorrect={false}
                            className="h-14 w-full rounded-full border border-white/10 bg-white/10 px-5 text-base text-white"
                        />
                    </View>

                    {/* Password */}
                    <View className="mt-5">
                        <Text className="mb-2 text-sm font-semibold text-white">
                            Password{" "}
                            <Text className="text-red-500">
                                *
                            </Text>
                        </Text>

                        <View className="h-14 flex-row items-center rounded-full border border-white/10 bg-white/10 px-5">
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                placeholderTextColor="#737373"
                                secureTextEntry={
                                    !showPassword
                                }
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                autoComplete="password"
                                returnKeyType="done"
                                onSubmitEditing={
                                    handleSignIn
                                }
                                className="flex-1 text-base text-white"
                            />

                            <Pressable
                                onPress={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                hitSlop={12}
                            >
                                <Text className="font-semibold text-[#66CCFF]">
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Forgot password */}
                    <Pressable
                        onPress={() =>
                            router.push(
                                "/(client-auth)/forgot-password"
                            )
                        }
                        className="mt-4 self-end py-2"
                    >
                        <Text className="font-semibold text-[#66CCFF]">
                            Forgot Password?
                        </Text>
                    </Pressable>

                    {/* Sign in button */}
                    <Pressable
                        onPress={handleSignIn}
                        className="mt-5 h-14 w-full items-center justify-center rounded-full bg-[#66CCFF] active:opacity-80"
                    >
                        <Text className="text-base font-bold text-black">
                            Sign In
                        </Text>
                    </Pressable>

                    {/* Sign up */}
                    <Pressable
                        onPress={() =>
                            router.push(
                                "/(client-auth)/sign-up"
                            )
                        }
                        className="mt-6 items-center py-3"
                    >
                        <Text className="text-base text-white/60">
                            Don&apos;t have an account?{" "}
                            <Text className="font-semibold text-[#66CCFF]">
                                Sign Up
                            </Text>
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}