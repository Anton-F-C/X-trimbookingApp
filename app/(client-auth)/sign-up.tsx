import { useState } from "react";
import {
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
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";

export default function ClientSignUpScreen() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        if (
            !cleanFirstName ||
            !cleanPhone ||
            !password
        ) {
            Alert.alert(
                "Missing information",
                "First name, phone number, and password are required."
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

        try {
            setLoading(true);

            const {
                data,
                error,
            } = await supabase.auth.signUp({
                phone: cleanPhone,
                password,
                options: {
                    data: {
                        first_name: cleanFirstName,
                        last_name:
                            cleanLastName || null,
                        email:
                            cleanEmail || null,
                        phone: cleanPhone,
                        role: "client",
                    },
                },
            });

            if (error) {
                Alert.alert(
                    "Unable to create account",
                    error.message
                );

                return;
            }

            if (!data.user) {
                Alert.alert(
                    "Unable to create account",
                    "We could not create your account. Please try again."
                );

                return;
            }

            Alert.alert(
                "Account created",
                "Your account was created successfully."
            );

            router.replace(
                "/(client-auth)/sign-in"
            );
        } catch (error) {
            console.error(
                "Client sign-up error:",
                error
            );

            Alert.alert(
                "Something went wrong",
                "Please try again."
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
                        : undefined
                }
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingTop: 24,
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo / back to welcome */}
                    <Pressable
                        onPress={() =>
                            router.replace(
                                "/(client-auth)/welcome"
                            )
                        }
                        className="mb-6 self-center active:opacity-70"
                    >
                        <Image
                            source={require(
                                "../../assets/logos/logo.png"
                            )}
                            resizeMode="contain"
                            className="h-24 w-24"
                        />
                    </Pressable>

                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-center text-3xl font-bold text-white">
                            Create Account
                        </Text>

                        <Text className="mt-2 text-center text-base text-white/60">
                            Create your account to start
                            booking appointments.
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="gap-5">
                        {/* First name */}
                        <View>
                            <Text className="mb-2 text-sm font-medium text-white">
                                First Name{" "}
                                <Text className="text-red-500">
                                    *
                                </Text>
                            </Text>

                            <TextInput
                                value={firstName}
                                onChangeText={
                                    setFirstName
                                }
                                placeholder="Enter your first name"
                                placeholderTextColor="#737373"
                                autoCapitalize="words"
                                autoCorrect={false}
                                className="rounded-2xl bg-white/10 px-5 py-4 text-base text-white"
                            />
                        </View>

                        {/* Last name */}
                        <View>
                            <Text className="mb-2 text-sm font-medium text-white">
                                Last Name
                            </Text>

                            <TextInput
                                value={lastName}
                                onChangeText={
                                    setLastName
                                }
                                placeholder="Enter your last name"
                                placeholderTextColor="#737373"
                                autoCapitalize="words"
                                autoCorrect={false}
                                className="rounded-2xl bg-white/10 px-5 py-4 text-base text-white"
                            />
                        </View>

                        {/* Email */}
                        <View>
                            <Text className="mb-2 text-sm font-medium text-white">
                                Email
                            </Text>

                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor="#737373"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="rounded-2xl bg-white/10 px-5 py-4 text-base text-white"
                            />

                            <Text className="mt-2 text-xs text-white/40">
                                Optional
                            </Text>
                        </View>

                        {/* Phone */}
                        <View>
                            <Text className="mb-2 text-sm font-medium text-white">
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
                                autoCorrect={false}
                                className="rounded-2xl bg-white/10 px-5 py-4 text-base text-white"
                            />
                        </View>

                        {/* Password */}
                        <View>
                            <Text className="mb-2 text-sm font-medium text-white">
                                Password{" "}
                                <Text className="text-red-500">
                                    *
                                </Text>
                            </Text>

                            <TextInput
                                value={password}
                                onChangeText={
                                    setPassword
                                }
                                placeholder="Create a password"
                                placeholderTextColor="#737373"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="rounded-2xl bg-white/10 px-5 py-4 text-base text-white"
                            />

                            <Text className="mt-2 text-xs text-white/40">
                                Minimum 6 characters
                            </Text>
                        </View>
                    </View>

                    {/* Create account */}
                    <Pressable
                        onPress={handleSignUp}
                        disabled={loading}
                        className={`mt-8 items-center justify-center rounded-full py-4 ${
                            loading
                                ? "bg-[#66CCFF]/50"
                                : "bg-[#66CCFF] active:opacity-80"
                        }`}
                    >
                        <Text className="text-lg font-semibold text-black">
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </Text>
                    </Pressable>

                    {/* Sign in */}
                    <Pressable
                        onPress={() =>
                            router.replace(
                                "/(client-auth)/sign-in"
                            )
                        }
                        className="mt-6 items-center py-2 active:opacity-70"
                    >
                        <Text className="text-base text-white/60">
                            Already have an account?{" "}
                            <Text className="font-semibold text-[#66CCFF]">
                                Sign In
                            </Text>
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}