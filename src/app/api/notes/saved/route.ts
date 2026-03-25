import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

// We store notes in UserStudyPlan table reusing planJson field
// with a type prefix to distinguish
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { subject, topic, unit, regulation, difficulty, notes } = await req.json();
        if (!notes) return error("Notes content required", 400);

        // Reuse UserStudyPlan table with targetRole = "NOTES:{subject}" as identifier
        const saved = await prisma.userStudyPlan.create({
            data: {
                userId: authUser.userId,
                targetRole: `NOTES:${subject}`,
                skillLevel: topic,
                dailyTime: unit || "general",
                planJson: JSON.stringify({ type: "notes", subject, topic, unit, regulation, difficulty, notes }),
            },
        });

        return success({ id: saved.id, message: "Notes saved successfully" });
    } catch (err) {
        console.error(err);
        return error("Failed to save notes", 500);
    }
}

export async function GET(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const saved = await prisma.userStudyPlan.findMany({
            where: {
                userId: authUser.userId,
                targetRole: { startsWith: "NOTES:" },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        const notes = saved.map((s: { id: string; targetRole: string; skillLevel: string; planJson: string; createdAt: Date }) => {
            try {
                const data = JSON.parse(s.planJson);
                return { id: s.id, ...data, createdAt: s.createdAt };
            } catch {
                return { id: s.id, subject: s.targetRole.replace("NOTES:", ""), topic: s.skillLevel, createdAt: s.createdAt };
            }
        });

        return success(notes);
    } catch (err) {
        console.error(err);
        return error("Failed to fetch saved notes", 500);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { id } = await req.json();
        if (!id) return error("Note ID required", 400);

        await prisma.userStudyPlan.deleteMany({
            where: { id, userId: authUser.userId },
        });

        return success({ message: "Note deleted" });
    } catch (err) {
        console.error(err);
        return error("Failed to delete note", 500);
    }
}
