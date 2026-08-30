import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
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

import { supabase } from "@/lib/supabase";

export default function ForgotPasswordScreen() {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const sendRecoveryCode = async () => {
        const cleanPhone = phone.trim();

        if (!cleanPhone) {
            Alert.alert(
                "Phone number required",
                "Enter the phone number associated with your account."
            );
            return;
        }

        try {
            setLoading(true);

            const { error } =
                await supabase.auth.signInWithOtp({
                    phone: cleanPhone,
                    options: {
                        shouldCreateUser: false,
                    },
                });

            if (error) {
                throw error;
            }

            router.push({
                pathname:
                    "/(client-auth)/verify-recovery",
                params: {
                    phone: cleanPhone,
                },
            });
        } catch (error: any) {
            console.error(
                "Password recovery error:",
                error
            );

            Alert.alert(
                "Unable to send code",
                error?.message ??
                "Please check the phone number and try again."
            );
        } finally {
            setLoading(false);
        }
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

                    <View className="mt-4">
                        <Text className="text-3xl font-bold text-white">
                            Forgot Password?
                        </Text>

                        <Text className="mt-3 text-base leading-6 text-white/60">
                            Enter the phone number
                            associated with your account.
                            We&apos;ll send you a
                            verification code.
                        </Text>
                    </View>

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
                            placeholder="+1 758 555 1234"
                            placeholderTextColor="#737373"
                            keyboardType="phone-pad"
                            autoComplete="tel"
                            textContentType="telephoneNumber"
                            returnKeyType="send"
                            onSubmitEditing={
                                sendRecoveryCode
                            }
                            className="h-14 w-full rounded-full border border-white/10 bg-white/10 px-5 text-base text-white"
                        />

                        <Text className="mt-2 text-xs leading-5 text-white/40">
                            Include your country code.
                        </Text>
                    </View>

                    <Pressable
                        onPress={sendRecoveryCode}
                        disabled={loading}
                        className={`mt-7 h-14 w-full items-center justify-center rounded-full ${
                            loading
                                ? "bg-[#66CCFF]/50"
                                : "bg-[#66CCFF] active:opacity-80"
                        }`}
                    >
                        {loading ? (
                            <ActivityIndicator
                                color="#000000"
                            />
                        ) : (
                            <Text className="text-base font-bold text-black">
                                Send Verification Code
                            </Text>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            router.replace(
                                "/(client-auth)/sign-in"
                            )
                        }
                        className="mt-6 items-center py-3"
                    >
                        <Text className="font-semibold text-[#66CCFF]">
                            Back to Sign In
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}