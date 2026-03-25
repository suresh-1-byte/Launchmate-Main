"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface UserResult {
    id: string;
    name: string;
    email: string;
    skills: string[];
    bio: string | null;
    avatar: string | null;
    headline: string | null;
    banner: string | null;
    _count: { sentConnections: number; receivedConnections: number };
}

interface Connection {
    id: string;
    senderId: string;
    receiverId: string;
    status: string;
    sender: { id: string; name: string; email: string; skills: string[]; avatar: string | null; headline: string | null };
    receiver: { id: string; name: string; email: string; skills: string[]; avatar: string | null; headline: string | null };
}

export default function NetworkPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState<"discover" | "connections" | "pending">("discover");
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<UserResult[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);
    const [connecting, setConnecting] = useState<string | null>(null);
    const [responding, setResponding] = useState<string | null>(null);

    const searchUsers = async (q?: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(q || searchQuery)}`);
            const data = await res.json();
            if (data.success) setUsers(data.data);
        } finally {
            setLoading(false);
        }
    };

    const loadConnections = async () => {
        const res = await fetch("/api/connect");
        const data = await res.json();
        if (data.success) setConnections(data.data);
    };

    useEffect(() => {
        searchUsers("");
        loadConnections();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchUsers();
    };

    const sendConnection = async (receiverId: string) => {
        setConnecting(receiverId);
        try {
            await fetch("/api/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId }),
            });
            await loadConnections();
            await searchUsers(searchQuery);
        } finally {
            setConnecting(null);
        }
    };

    const respondConnection = async (connectionId: string, action: string) => {
        setResponding(connectionId);
        try {
            await fetch("/api/connect/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ connectionId, action }),
            });
            await loadConnections();
        } finally {
            setResponding(null);
        }
    };

    const getConnectionStatus = (userId: string): string | null => {
        const conn = connections.find(
            (c) =>
                (c.senderId === user?.id && c.receiverId === userId) ||
                (c.receiverId === user?.id && c.senderId === userId)
        );
        return conn?.status || null;
    };

    const startConversation = async (receiverId: string) => {
        try {
            const res = await fetch("/api/chat/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId }),
            });
            const data = await res.json();
            if (data.success) {
                router.push(`/messaging?convId=${data.data.id}`);
            }
        } catch (error) {
            console.error("Start conversation error:", error);
        }
    };

    const acceptedConnections = connections.filter((c) => c.status === "accepted");
    const pendingReceived = connections.filter(
        (c) => c.status === "pending" && c.receiverId === user?.id
    );

    const getMutualCount = (u: UserResult) => {
        // Simulated mutual connections for premium feel
        return Math.floor(Math.random() * 15) + 1;
    };

    const menuItems = [
        {
            key: "connections",
            label: "Connections",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
            ),
            count: acceptedConnections.length
        },
        {
            key: "pending",
            label: "Invitations",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
            ),
            count: pendingReceived.length
        },
        {
            key: "discover",
            label: "Find People",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
            ),
            count: null
        },
    ];

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen bg-[#f3f2ef] pt-20 pb-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Sidebar - LinkedIn Style */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                                <div className="p-4 border-b border-gray-100">
                                    <h2 className="text-base font-semibold text-gray-900">Manage my network</h2>
                                </div>
                                <div className="py-2">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => setTab(item.key as any)}
                                            className={`w-full flex justify-between items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 ${tab === item.key ? "text-[#057642] font-bold bg-[#057642]/5 border-r-4 border-[#057642]" : "text-gray-600"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={tab === item.key ? "text-[#057642]" : "text-gray-500"}>
                                                    {item.icon}
                                                </span>
                                                {item.label}
                                            </div>
                                            {item.count !== null && <span className="text-xs font-semibold">{item.count}</span>}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-100">
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <p className="text-[10px] uppercase font-bold text-[#057642] tracking-wider mb-1">PRO TIP</p>
                                        <p className="text-xs text-[#057642]">Personalized invites are 3x more likely to be accepted.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-9 space-y-6">
                            {/* Pending Invitations Banner - Prominent like LinkedIn */}
                            {pendingReceived.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                                        <h2 className="text-base font-semibold text-gray-900">Invitations</h2>
                                        <button onClick={() => setTab("pending")} className="text-sm font-bold text-gray-500 hover:text-[#057642]">See all</button>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {pendingReceived.slice(0, 3).map((conn) => (
                                            <div key={conn.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#057642] to-green-700 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                                                    {conn.sender.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-gray-900 hover:underline cursor-pointer truncate">{conn.sender.name}</h3>
                                                    <p className="text-xs text-gray-500 truncate">{conn.sender.headline || "Seeking opportunities @ LaunchMate"}</p>
                                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                                                        {getMutualCount(conn.sender as any)} mutual connections
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => respondConnection(conn.id, "rejected")}
                                                        className="px-4 py-1.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-full transition-all"
                                                    >
                                                        Ignore
                                                    </button>
                                                    <button
                                                        onClick={() => respondConnection(conn.id, "accepted")}
                                                        className="px-6 py-1.5 text-sm font-bold text-[#057642] border-2 border-[#057642] rounded-full hover:bg-green-50 transition-all"
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Discover Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        {tab === "discover" && "People you may know based on your profile"}
                                        {tab === "connections" && "Your Network"}
                                        {tab === "pending" && "All Pending Invitations"}
                                    </h1>

                                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full text-sm py-2 pl-10 pr-4 bg-gray-100 border-none rounded-md focus:ring-2 focus:ring-[#057642]/50 transition-all"
                                            placeholder="Search by name, role or skill..."
                                        />
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </form>
                                </div>

                                {tab === "discover" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {loading ? (
                                            <div className="col-span-full flex justify-center py-20">
                                                <div className="w-10 h-10 border-4 border-[#057642]/30 border-t-[#057642] rounded-full animate-spin" />
                                            </div>
                                        ) : users.length > 0 ? (
                                            users.map((u) => {
                                                const status = getConnectionStatus(u.id);
                                                const mutualCount = getMutualCount(u);
                                                return (
                                                    <div key={u.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 relative group h-full">
                                                        {/* Profile Banner */}
                                                        <div className="h-16 bg-gradient-to-r from-[#057642] to-[#2ecc71] relative">
                                                            {u.banner && <img src={u.banner} className="w-full h-full object-cover" alt="" />}
                                                        </div>

                                                        {/* Avatar overlapping banner */}
                                                        <div className="px-4 -mt-10 flex justify-center">
                                                            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md">
                                                                <div className="w-full h-full rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[#057642] text-3xl font-bold overflow-hidden">
                                                                    {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="px-4 pt-3 pb-4 text-center flex-1 flex flex-col">
                                                            <h3 className="text-sm font-bold text-gray-900 group-hover:underline cursor-pointer line-clamp-1">{u.name}</h3>
                                                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[2rem]">
                                                                {u.headline || "Student @ Anna University | Future Engineer"}
                                                            </p>

                                                            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-gray-400 font-medium">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                                                                {mutualCount} mutual connections
                                                            </div>

                                                            <div className="mt-auto pt-4">
                                                                {status === "accepted" ? (
                                                                    <button
                                                                        onClick={() => startConversation(u.id)}
                                                                        className="w-full text-sm font-bold text-[#057642] border-2 border-[#057642] rounded-full py-1.5 hover:bg-green-50 transition-all font-sans"
                                                                    >
                                                                        Message
                                                                    </button>
                                                                ) : status === "pending" ? (
                                                                    <button className="w-full text-sm font-bold text-gray-400 border border-gray-300 bg-gray-50 rounded-full py-1.5 cursor-default">Pending</button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => sendConnection(u.id)}
                                                                        disabled={connecting === u.id}
                                                                        className="w-full text-sm font-bold text-[#057642] border-2 border-[#057642] rounded-full py-1.5 hover:bg-[#057642] hover:text-white transition-all duration-200 disabled:opacity-50"
                                                                    >
                                                                        {connecting === u.id ? "..." : "Connect"}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full text-center py-20 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                <p className="text-sm font-semibold">No more professional suggestions at the moment.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {tab === "connections" && (
                                    <div className="divide-y divide-gray-100">
                                        {acceptedConnections.length > 0 ? (
                                            acceptedConnections.map((conn) => {
                                                const other = conn.senderId === user?.id ? conn.receiver : conn.sender;
                                                return (
                                                    <div key={conn.id} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-all px-2 rounded-lg group">
                                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-[#057642] text-xl font-bold shadow-sm border-2 border-white">
                                                            {other.avatar ? <img src={other.avatar} className="w-full h-full rounded-full object-cover" /> : other.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-base font-bold text-gray-900 group-hover:underline cursor-pointer truncate">{other.name}</h3>
                                                            <p className="text-sm text-gray-500 truncate">{other.headline || "Connection at LaunchMate"}</p>
                                                            <p className="text-xs text-gray-400 mt-1">Connected {new Date(conn.id.length > 10 ? 0 : 0).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startConversation(other.id)}
                                                                className="text-sm font-bold text-[#057642] border-2 border-[#057642] rounded-full px-6 py-2 hover:bg-green-50 transition-all"
                                                            >
                                                                Message
                                                            </button>
                                                            <button className="text-gray-400 hover:text-red-500 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-24 text-gray-400">
                                                <p className="text-sm font-semibold">You haven't established any professional connections yet.</p>
                                                <button onClick={() => setTab("discover")} className="mt-4 text-[#057642] font-bold underline">Discover People</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {tab === "pending" && (
                                    <div className="divide-y divide-gray-100">
                                        {pendingReceived.length > 0 ? (
                                            pendingReceived.map((conn) => (
                                                <div key={conn.id} className="flex items-center gap-4 py-6 px-2 hover:bg-gray-50 transition-all rounded-lg">
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#057642] to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                                                        {conn.sender.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-base font-bold text-gray-900 underline cursor-pointer">{conn.sender.name}</h3>
                                                        <p className="text-sm text-gray-600 font-medium">{conn.sender.headline || "Prospective Connection"}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{getMutualCount(conn.sender as any)} mutual connections</p>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => respondConnection(conn.id, "rejected")}
                                                            disabled={responding === conn.id}
                                                            className="text-sm font-bold text-gray-500 px-6 py-2 hover:bg-gray-200 rounded-full transition-all disabled:opacity-50"
                                                        >
                                                            Ignore
                                                        </button>
                                                        <button
                                                            onClick={() => respondConnection(conn.id, "accepted")}
                                                            disabled={responding === conn.id}
                                                            className="text-sm font-bold text-[#057642] border-2 border-[#057642] rounded-full px-8 py-2 hover:bg-green-50 transition-all shadow-sm disabled:opacity-50"
                                                        >
                                                            Accept
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-24 text-gray-400">
                                                <p className="text-sm font-semibold">All caught up! No pending invitations.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
