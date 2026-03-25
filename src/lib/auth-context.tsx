"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession, SessionProvider } from "next-auth/react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    skills?: string[];
    bio?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
    skills?: string[];
    bio?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            setUser({
                id: (session.user as any).id,
                name: session.user.name || "",
                email: session.user.email || "",
                role: (session.user as any).role || "student",
            });
        } else {
            setUser(null);
        }
    }, [session]);

    const login = async (emailOrProvider: string, password?: string) => {
        if (emailOrProvider === "google") {
            await signIn("google", { callbackUrl: "/dashboard" });
            return;
        }

        const res = await signIn("credentials", {
            email: emailOrProvider,
            password,
            redirect: false,
        });

        if (res?.error) {
            throw new Error(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        }

        router.push("/dashboard");
    };

    const signup = async (signupData: SignupData) => {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");

        // Automatically log in after successful signup
        await login(signupData.email, signupData.password);
    };

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    const refreshUser = async () => {
        // NextAuth handles session refreshing automatically
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: status === "loading",
                login,
                signup,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProviderInner>{children}</AuthProviderInner>
        </SessionProvider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
