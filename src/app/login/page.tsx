"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
    const { user, login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-12 px-4 relative">
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <div className="mb-8 px-4">
                    <Logo />
                </div>

                <div className="bg-white p-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#e0e0e0]">
                    <h1 className="text-2xl font-semibold mb-2 text-gray-900">Sign in</h1>
                    <p className="text-sm text-gray-600 mb-6">Stay updated on your professional world</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50/10 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-900/70 rounded px-3 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#057642] focus:border-[#057642]"
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-900/70 rounded px-3 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#057642] focus:border-[#057642]"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#057642] hover:bg-[#046237] text-white font-semibold py-3 rounded-full transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                        <span className="text-xs text-xs text-gray-400 font-bold uppercase tracking-wider">or</span>
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <button
                            onClick={() => login("google", "") /* This is handled inside AuthProvider but let's call signIn directly for better control */}
                            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-400 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            New to LaunchMate?{" "}
                            <Link href="/signup" className="text-[#057642] hover:underline font-semibold">
                                Join now
                            </Link>
                        </p>
                    </div>

                    {/* Demo Account */}
                    <div className="mt-6 pt-5 border-t border-gray-200">
                        <button
                            onClick={() => {
                                setEmail("rahul@demo.com");
                                setPassword("password123");
                            }}
                            className="w-full text-sm text-gray-600 font-semibold border border-gray-600 rounded-full py-2 hover:bg-gray-50 bg-white transition-all"
                        >
                            Use Demo Credentials
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
