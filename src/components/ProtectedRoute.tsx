"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#057642]/30 border-t-[#057642] rounded-full animate-spin" />
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Loading LaunchMate</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
