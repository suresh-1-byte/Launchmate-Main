"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/ui/Logo";

export default function SignupPage() {
    const { signup } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [skills, setSkills] = useState("");
    const [bio, setBio] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signup({
                name,
                email,
                password,
                skills: skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                bio: bio || undefined,
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4 pb-12 relative">
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <div className="mb-6 px-4">
                    <Logo />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#e0e0e0]">
                    <h1 className="text-2xl font-semibold mb-1 text-gray-900">Sign up</h1>
                    <p className="text-sm text-gray-600 mb-6">Make the most of your professional life</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-600 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#057642] focus:border-[#057642]"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-600 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#057642] focus:border-[#057642]"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Password (6+ characters)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-600 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#057642] focus:border-[#057642]"
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Skills (comma separated)</label>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full border border-gray-600 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#057642] focus:border-[#057642]"
                                placeholder="React, Python, AWS..."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full border border-gray-600 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#057642] focus:border-[#057642] resize-none"
                                rows={2}
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <p className="text-[10px] text-gray-500 text-center px-4">
                            By clicking Agree & Join, you agree to the LaunchMate User Agreement, Privacy Policy, and Cookie Policy.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#057642] hover:bg-[#046237] text-white font-semibold py-2.5 rounded-full transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? "Joining..." : "Agree & Join"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already on LaunchMate?{" "}
                            <Link href="/login" className="text-[#057642] hover:underline font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
