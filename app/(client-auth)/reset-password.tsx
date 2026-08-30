import {
    useEffect,
    useState,
} from "react";
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

export default function ResetPasswordScreen() {
    const [password, setPassword] =
        useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [checkingSession, setCheckingSession] =
        useState(true);

    const [sessionReady, setSessionReady] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    useEffect(() => {
        let mounted = true;

        const checkSession = async () => {
            try {
                const {
                    data,
                } =
                    await supabase.auth.getSession();

                if (!mounted) {
                    return;
                }

                setSessionReady(
                    Boolean(data.session)
                );
            } catch (error) {
                console.error(
                    "Recovery session check:",
                    error
                );

                if (mounted) {
                    setSessionReady(false);
                }
            } finally {
                if (mounted) {
                    setCheckingSession(false);
                }
            }
        };

        void checkSession();

        return () => {
            mounted = false;
        };
    }, []);

    const updatePassword = async () => {
        if (!sessionReady) {
            Alert.alert(
                "Verification required",
                "Verify your phone number before resetting your password."
            );
            return;
        }

        if (password.length < 6) {
            Alert.alert(
                "Password too short",
                "Your password must be at least 6 characters long."
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(
                "Passwords do not match",
                "Enter the same password twice."
            );
            return;
        }

        try {
            setSaving(true);

            const { error } =
                await supabase.auth.updateUser({
                    password,
                });

            if (error) {
                throw error;
            }

            /*
             * Don't leave the temporary recovery
             * session active after changing the
             * password.
             */
            await supabase.auth.signOut();

            Alert.alert(
                "Password updated",
                "Your password has been changed successfully."
            );

            router.replace(
                "/(client-auth)/sign-in"
            );
        } catch (error: any) {
            console.error(
                "Password update error:",
                error
            );

            Alert.alert(
                "Unable to update password",
                error?.message ??
                "Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (checkingSession) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator
                    size="large"
                    color="#66CCFF"
                />

                <Text className="mt-4 text-white/60">
                    Verifying your session...
                </Text>
            </SafeAreaView>
        );
    }

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
                            Create New Password
                        </Text>

                        <Text className="mt-3 text-base leading-6 text-white/60">
                            Choose a new password for
                            your X-Trim-Lee account.
                        </Text>
                    </View>

                    {!sessionReady ? (
                        <View className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                            <Text className="font-semibold text-red-400">
                                Verification required
                            </Text>

                            <Text className="mt-2 leading-5 text-red-300/80">
                                Your recovery session
                                could not be verified.
                                Request another
                                verification code.
                            </Text>

                            <Pressable
                                onPress={() =>
                                    router.replace(
                                        "/(client-auth)/forgot-password"
                                    )
                                }
                                className="mt-5"
                            >
                                <Text className="font-bold text-[#66CCFF]">
                                    Request a New Code
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            {/* New password */}
                            <View className="mt-8">
                                <Text className="mb-2 text-sm font-semibold text-white">
                                    New Password{" "}
                                    <Text className="text-red-500">
                                        *
                                    </Text>
                                </Text>

                                <View className="h-14 flex-row items-center rounded-full border border-white/10 bg-white/10 px-5">
                                    <TextInput
                                        value={
                                            password
                                        }
                                        onChangeText={
                                            setPassword
                                        }
                                        secureTextEntry={
                                            !showPassword
                                        }
                                        placeholder="Enter new password"
                                        placeholderTextColor="#737373"
                                        autoCapitalize="none"
                                        autoCorrect={
                                            false
                                        }
                                        textContentType="newPassword"
                                        autoComplete="password-new"
                                        className="flex-1 text-base text-white"
                                    />

                                    <Pressable
                                        onPress={() =>
                                            setShowPassword(
                                                (
                                                    previous
                                                ) =>
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

                                <Text className="mt-2 text-xs text-white/40">
                                    Minimum 6 characters
                                </Text>
                            </View>

                            {/* Confirm */}
                            <View className="mt-5">
                                <Text className="mb-2 text-sm font-semibold text-white">
                                    Confirm Password{" "}
                                    <Text className="text-red-500">
                                        *
                                    </Text>
                                </Text>

                                <View className="h-14 flex-row items-center rounded-full border border-white/10 bg-white/10 px-5">
                                    <TextInput
                                        value={
                                            confirmPassword
                                        }
                                        onChangeText={
                                            setConfirmPassword
                                        }
                                        secureTextEntry={
                                            !showConfirmPassword
                                        }
                                        placeholder="Re-enter new password"
                                        placeholderTextColor="#737373"
                                        autoCapitalize="none"
                                        autoCorrect={
                                            false
                                        }
                                        textContentType="newPassword"
                                        autoComplete="password-new"
                                        returnKeyType="done"
                                        onSubmitEditing={
                                            updatePassword
                                        }
                                        className="flex-1 text-base text-white"
                                    />

                                    <Pressable
                                        onPress={() =>
                                            setShowConfirmPassword(
                                                (
                                                    previous
                                                ) =>
                                                    !previous
                                            )
                                        }
                                        hitSlop={12}
                                    >
                                        <Text className="font-semibold text-[#66CCFF]">
                                            {showConfirmPassword
                                                ? "Hide"
                                                : "Show"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>

                            <Pressable
                                onPress={
                                    updatePassword
                                }
                                disabled={saving}
                                className={`mt-8 h-14 w-full items-center justify-center rounded-full ${
                                    saving
                                        ? "bg-[#66CCFF]/50"
                                        : "bg-[#66CCFF] active:opacity-80"
                                }`}
                            >
                                {saving ? (
                                    <ActivityIndicator
                                        color="#000000"
                                    />
                                ) : (
                                    <Text className="text-base font-bold text-black">
                                        Update Password
                                    </Text>
                                )}
                            </Pressable>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}