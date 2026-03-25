import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { conversationId, content } = body;

        if (!conversationId || !content) {
            return error("Conversation ID and content are required", 400);
        }

        // Verify user is a participant
        const participant = await prisma.chatParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId: authUser.userId,
                    conversationId
                }
            }
        });

        if (!participant) {
            return error("You are not a participant in this conversation", 403);
        }

        const message = await prisma.chatMessage.create({
            data: {
                conversationId,
                senderId: authUser.userId,
                content
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        // Update conversation's updatedAt timestamp
        await prisma.chatConversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        return success(message, 201);
    } catch (err) {
        console.error("Chat messages POST error:", err);
        return error("Internal server error", 500);
    }
}

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) return error("Conversation ID is required", 400);

        // Verify user is a participant
        const participant = await prisma.chatParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId: authUser.userId,
                    conversationId
                }
            }
        });

        if (!participant) {
            return error("You are not a participant in this conversation", 403);
        }

        const messages = await prisma.chatMessage.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return success(messages);
    } catch (err) {
        console.error("Chat messages GET error:", err);
        return error("Internal server error", 500);
    }
}
