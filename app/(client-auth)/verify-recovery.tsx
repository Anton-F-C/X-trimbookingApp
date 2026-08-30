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
import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { supabase } from "@/lib/supabase";

export default function VerifyRecoveryScreen() {
    const params =
        useLocalSearchParams<{
            phone?: string;
        }>();

    const phone =
        typeof params.phone === "string"
            ? params.phone
            : "";

    const [code, setCode] = useState("");
    const [verifying, setVerifying] =
        useState(false);
    const [resending, setResending] =
        useState(false);

    const verifyCode = async () => {
        const cleanCode = code.trim();

        if (!phone) {
            Alert.alert(
                "Phone number unavailable",
                "Return to the previous screen and request a new verification code."
            );
            return;
        }

        if (!cleanCode) {
            Alert.alert(
                "Code required",
                "Enter the verification code sent to your phone."
            );
            return;
        }

        try {
            setVerifying(true);

            const {
                data,
                error,
            } = await supabase.auth.verifyOtp({
                phone,
                token: cleanCode,
                type: "sms",
            });

            if (error) {
                throw error;
            }

            if (!data.session) {
                Alert.alert(
                    "Verification failed",
                    "We could not verify your recovery session. Please try again."
                );
                return;
            }

            router.replace(
                "/(client-auth)/reset-password"
            );
        } catch (error: any) {
            console.error(
                "Recovery verification error:",
                error
            );

            Alert.alert(
                "Invalid code",
                error?.message ??
                "The verification code is invalid or has expired."
            );
        } finally {
            setVerifying(false);
        }
    };

    const resendCode = async () => {
        if (!phone) {
            return;
        }

        try {
            setResending(true);

            const { error } =
                await supabase.auth.signInWithOtp({
                    phone,
                    options: {
                        shouldCreateUser: false,
                    },
                });

            if (error) {
                throw error;
            }

            Alert.alert(
                "Code sent",
                "A new verification code has been sent."
            );
        } catch (error: any) {
            Alert.alert(
                "Unable to resend code",
                error?.message ??
                "Please try again."
            );
        } finally {
            setResending(false);
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
                            Verify Your Number
                        </Text>

                        <Text className="mt-3 text-base leading-6 text-white/60">
                            Enter the verification
                            code sent to:
                        </Text>

                        <Text className="mt-2 text-base font-semibold text-[#66CCFF]">
                            {phone}
                        </Text>
                    </View>

                    <View className="mt-8">
                        <Text className="mb-2 text-sm font-semibold text-white">
                            Verification Code{" "}
                            <Text className="text-red-500">
                                *
                            </Text>
                        </Text>

                        <TextInput
                            value={code}
                            onChangeText={setCode}
                            placeholder="Enter code"
                            placeholderTextColor="#737373"
                            keyboardType="number-pad"
                            autoComplete="one-time-code"
                            textContentType="oneTimeCode"
                            maxLength={6}
                            returnKeyType="done"
                            onSubmitEditing={
                                verifyCode
                            }
                            className="h-14 w-full rounded-full border border-white/10 bg-white/10 px-5 text-center text-xl tracking-[6px] text-white"
                        />
                    </View>

                    <Pressable
                        onPress={verifyCode}
                        disabled={verifying}
                        className={`mt-7 h-14 w-full items-center justify-center rounded-full ${
                            verifying
                                ? "bg-[#66CCFF]/50"
                                : "bg-[#66CCFF] active:opacity-80"
                        }`}
                    >
                        {verifying ? (
                            <ActivityIndicator
                                color="#000000"
                            />
                        ) : (
                            <Text className="text-base font-bold text-black">
                                Verify Code
                            </Text>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={resendCode}
                        disabled={resending}
                        className="mt-6 items-center py-3"
                    >
                        {resending ? (
                            <ActivityIndicator
                                color="#66CCFF"
                            />
                        ) : (
                            <Text className="font-semibold text-[#66CCFF]">
                                Resend Code
                            </Text>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            router.replace(
                                "/(client-auth)/forgot-password"
                            )
                        }
                        className="items-center py-3"
                    >
                        <Text className="text-white/50">
                            Use a different phone
                            number
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}