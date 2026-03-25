import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const conversations = await prisma.chatConversation.findMany({
            where: {
                participants: {
                    some: { userId: authUser.userId }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                headline: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: {
                        sender: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return success(conversations);
    } catch (err) {
        console.error("Chat conversations GET error:", err);
        return error("Internal server error", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { receiverId } = body;

        if (!receiverId) return error("Receiver ID is required", 400);

        // Check if connection exists and is accepted
        const connection = await prisma.connection.findFirst({
            where: {
                OR: [
                    { senderId: authUser.userId, receiverId, status: "accepted" },
                    { senderId: receiverId, receiverId: authUser.userId, status: "accepted" },
                ],
            },
        });

        if (!connection) {
            return error("You can only message users you are connected with", 403);
        }

        // Check if conversation already exists between these two users
        const existingConversation = await prisma.chatConversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: authUser.userId } } },
                    { participants: { some: { userId: receiverId } } }
                ]
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                headline: true
                            }
                        }
                    }
                }
            }
        });

        if (existingConversation) {
            return success(existingConversation);
        }

        // Create new conversation
        const conversation = await prisma.chatConversation.create({
            data: {
                participants: {
                    create: [
                        { userId: authUser.userId },
                        { userId: receiverId }
                    ]
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                headline: true
                            }
                        }
                    }
                }
            }
        });

        return success(conversation, 201);
    } catch (err) {
        console.error("Chat conversations POST error:", err);
        return error("Internal server error", 500);
    }
}
