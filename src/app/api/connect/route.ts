import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { receiverId } = body;

        if (!receiverId) return error("Receiver ID is required", 400);
        if (receiverId === authUser.userId) return error("Cannot connect with yourself", 400);

        // Check if connection already exists in either direction
        const existing = await prisma.connection.findFirst({
            where: {
                OR: [
                    { senderId: authUser.userId, receiverId },
                    { senderId: receiverId, receiverId: authUser.userId },
                ],
            },
        });

        if (existing) return error("Connection already exists", 409);

        const connection = await prisma.connection.create({
            data: { senderId: authUser.userId, receiverId },
            include: {
                receiver: { select: { name: true, email: true } },
            },
        });

        return success(connection, 201);
    } catch (err) {
        console.error("Connect error:", err);
        return error("Internal server error", 500);
    }
}

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "all";

        const where: Record<string, unknown> = {
            OR: [
                { senderId: authUser.userId },
                { receiverId: authUser.userId },
            ],
        };

        if (status !== "all") {
            where.status = status;
        }

        const connections = await prisma.connection.findMany({
            where,
            include: {
                sender: { select: { id: true, name: true, email: true, skills: true, avatar: true, headline: true } },
                receiver: { select: { id: true, name: true, email: true, skills: true, avatar: true, headline: true } },
            } as any,
            orderBy: { createdAt: "desc" },
        });

        const formattedConnections = (connections as any[]).map((c) => ({
            ...c,
            sender: {
                ...c.sender,
                skills: typeof c.sender.skills === "string" ? c.sender.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
            },
            receiver: {
                ...c.receiver,
                skills: typeof c.receiver.skills === "string" ? c.receiver.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
            },
        }));

        return success(formattedConnections);
    } catch (err) {
        console.error("Connections GET error:", err);
        return error("Internal server error", 500);
    }
}
