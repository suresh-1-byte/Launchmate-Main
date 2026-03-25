import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { connectionId, action } = body;

        if (!connectionId || !action) {
            return error("Connection ID and action are required", 400);
        }

        if (!["accepted", "rejected"].includes(action)) {
            return error("Action must be 'accepted' or 'rejected'", 400);
        }

        const connection = await prisma.connection.findFirst({
            where: { id: connectionId, receiverId: authUser.userId, status: "pending" },
        });

        if (!connection) return error("Connection request not found", 404);

        const updated = await prisma.connection.update({
            where: { id: connectionId },
            data: { status: action },
            include: {
                sender: { select: { name: true, email: true } },
                receiver: { select: { name: true, email: true } },
            },
        });

        return success(updated);
    } catch (err) {
        console.error("Accept/Reject error:", err);
        return error("Internal server error", 500);
    }
}
