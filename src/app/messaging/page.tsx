"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams, useRouter } from "next/navigation";

interface Participant {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
        avatar: string | null;
        headline: string | null;
    };
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
        avatar: string | null;
    };
}

interface Conversation {
    id: string;
    updatedAt: string;
    participants: Participant[];
    messages: Message[];
}

export default function MessagingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeConvIdFromQuery = searchParams.get("convId");

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/chat/conversations");
            const data = await res.json();
            if (data.success) {
                setConversations(data.data);

                // If there's an activeConvId in query, set it
                if (activeConvIdFromQuery) {
                    const conv = data.data.find((c: Conversation) => c.id === activeConvIdFromQuery);
                    if (conv) {
                        setActiveConversation(conv);
                        fetchMessages(conv.id);
                    }
                } else if (data.data.length > 0 && !activeConversation) {
                    // Default to first conversation
                    setActiveConversation(data.data[0]);
                    fetchMessages(data.data[0].id);
                }
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (convId: string) => {
        try {
            const res = await fetch(`/api/chat/messages?conversationId=${convId}`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.data);
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || sending) return;

        setSending(true);
        try {
            const res = await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: activeConversation.id,
                    content: newMessage.trim()
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages((prev) => [...prev, data.data]);
                setNewMessage("");
                setTimeout(scrollToBottom, 100);
                // Refresh conversations to update the last message/timestamp
                fetchConversations();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [activeConvIdFromQuery]);

    // Cleanup interval for polling messages
    useEffect(() => {
        if (!activeConversation) return;
        const interval = setInterval(() => {
            fetchMessages(activeConversation.id);
        }, 5000); // Poll every 5 seconds for "real-time" feel without WebSockets
        return () => clearInterval(interval);
    }, [activeConversation?.id]);

    const getOtherParticipant = (conv: Conversation) => {
        return conv.participants.find(p => p.userId !== user?.id)?.user;
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen bg-[#f3f2ef] pt-20 pb-4 h-screen flex flex-col">
                <div className="max-w-6xl mx-auto px-4 flex-1 w-full flex overflow-hidden">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-1 w-full overflow-hidden">

                        {/* Conversations Sidebar */}
                        <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <h1 className="text-lg font-bold text-gray-900">Messaging</h1>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {loading && conversations.length === 0 ? (
                                    <div className="p-4 text-center">
                                        <div className="w-6 h-6 border-2 border-[#057642] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Loading chats...</p>
                                    </div>
                                ) : conversations.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-gray-500">No conversations yet.</p>
                                        <p className="text-xs text-gray-400 mt-2">Connect with people to start chatting!</p>
                                    </div>
                                ) : (
                                    conversations.map((conv) => {
                                        const other = getOtherParticipant(conv);
                                        const isActive = activeConversation?.id === conv.id;
                                        return (
                                            <button
                                                key={conv.id}
                                                onClick={() => {
                                                    setActiveConversation(conv);
                                                    fetchMessages(conv.id);
                                                    router.push(`/messaging?convId=${conv.id}`, { scroll: false });
                                                }}
                                                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-l-4 ${isActive ? "border-[#057642] bg-green-50/30" : "border-transparent"}`}
                                            >
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[#057642] font-bold text-lg border border-gray-100 overflow-hidden">
                                                    {other?.avatar ? <img src={other.avatar} className="w-full h-full object-cover" /> : other?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-sm font-bold text-gray-900 truncate">{other?.name}</h3>
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                        {conv.messages[0]?.content || "Start a conversation"}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Chat Window */}
                        <div className="flex-1 flex flex-col bg-white">
                            {activeConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[#057642] font-bold border border-gray-100 overflow-hidden">
                                                {getOtherParticipant(activeConversation)?.avatar ?
                                                    <img src={getOtherParticipant(activeConversation)?.avatar!} className="w-full h-full object-cover" /> :
                                                    getOtherParticipant(activeConversation)?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-gray-900">{getOtherParticipant(activeConversation)?.name}</h2>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[200px]">
                                                    {getOtherParticipant(activeConversation)?.headline || "Member @ LaunchMate"}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                        </button>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                        {messages.map((msg, idx) => {
                                            const isMe = msg.senderId === user?.id;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                    <div className={`flex gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                                        {!isMe && (
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-[#057642] mt-1 overflow-hidden">
                                                                {msg.sender.avatar ? <img src={msg.sender.avatar} className="w-full h-full object-cover" /> : msg.sender.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                                                                    ? "bg-[#057642] text-white rounded-tr-none"
                                                                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                                                }`}>
                                                                {msg.content}
                                                            </div>
                                                            <div className={`text-[10px] mt-1 text-gray-400 ${isMe ? "text-right" : "text-left"}`}>
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                                        <div className="relative flex items-end gap-2">
                                            <textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        sendMessage(e as any);
                                                    }
                                                }}
                                                placeholder="Write a message..."
                                                className="w-full text-sm py-3 px-4 bg-gray-100 border-none rounded-xl focus:ring-1 focus:ring-[#057642] focus:bg-white transition-all resize-none max-h-32"
                                                rows={1}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim() || sending}
                                                className="bg-[#057642] text-white p-3 rounded-full hover:bg-green-700 transition-all disabled:opacity-50 disabled:hover:bg-[#057642] shadow-md"
                                            >
                                                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 px-1">
                                            <div className="flex gap-4">
                                                <button type="button" className="text-gray-400 hover:text-[#057642] transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
                                                <button type="button" className="text-gray-400 hover:text-[#057642] transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" /></svg></button>
                                            </div>
                                            <span className="text-[10px] text-gray-400">Press Enter to send</span>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/30">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#057642] mb-4">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Select a message</h2>
                                    <p className="text-sm text-gray-500 mt-2 max-w-sm">Choose from your existing conversations, start a new one, or just keep networking to find more people to chat with.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
