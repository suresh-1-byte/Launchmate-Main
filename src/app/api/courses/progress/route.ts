import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function PATCH(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { enrollmentId, progress } = body;

        if (!enrollmentId || progress === undefined) {
            return error("Enrollment ID and progress are required", 400);
        }

        const enrollment = await prisma.enrollment.findFirst({
            where: { id: enrollmentId, userId: authUser.userId },
        });

        if (!enrollment) return error("Enrollment not found", 404);

        const updated = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { progress: Math.min(100, Math.max(0, progress)) },
            include: { course: true },
        });

        return success(updated);
    } catch (err) {
        console.error("Progress update error:", err);
        return error("Internal server error", 500);
    }
}
