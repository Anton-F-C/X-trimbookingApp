import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    Session,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type AuthContextType = {
    session: Session | null;
    loading: boolean;
};

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    const [session, setSession] =
        useState<Session | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        let mounted = true;

        const loadSession = async () => {
            const {
                data,
                error,
            } =
                await supabase.auth.getSession();

            if (!mounted) {
                return;
            }

            if (error) {
                console.error(
                    "Failed to load session:",
                    error
                );
            }

            setSession(
                data.session ?? null
            );

            setLoading(false);
        };

        void loadSession();

        const {
            data: {
                subscription,
            },
        } =
            supabase.auth.onAuthStateChange(
                (_event, nextSession) => {
                    if (!mounted) {
                        return;
                    }

                    setSession(
                        nextSession
                    );

                    setLoading(false);
                }
            );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                session,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useSession() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useSession must be used inside AuthProvider"
        );
    }

    return context;
}