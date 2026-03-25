import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { fetchGitHubRepo } from "@/lib/github";

export async function POST(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { title, description, githubLink } = body;

        if (!title || !description) {
            return error("Title and description are required", 400);
        }

        let githubData = {};
        if (githubLink) {
            try {
                const data = await fetchGitHubRepo(githubLink);
                githubData = {
                    stars: data.stars,
                    forks: data.forks,
                    languages: data.languages.join(", "),
                    lastUpdated: new Date(data.lastUpdated),
                    owner: data.owner,
                    repoName: data.name,
                    repoImage: data.repoImage,
                    readme: data.readme,
                };
            } catch (err) {
                console.error("GitHub fetch error:", err);
                // Continue without github data if fetch fails but link was provided? 
                // Better to alert user if link is invalid.
                return error("Could not fetch repository data. Please check the URL.", 400);
            }
        }

        const project = await prisma.project.create({
            data: {
                userId: authUser.userId,
                title,
                description,
                githubLink: githubLink || null,
                ...githubData,
            },
        });

        return success(project, 201);
    } catch (err) {
        console.error("Project POST error:", err);
        return error("Internal server error", 500);
    }
}

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { searchParams } = new URL(request.url);
        const targetUserId = searchParams.get("userId") || authUser.userId;

        const projects = await prisma.project.findMany({
            where: { userId: targetUserId },
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, email: true, avatar: true } },
            },
        });

        return success(projects);
    } catch (err) {
        console.error("Projects GET error:", err);
        return error("Internal server error", 500);
    }
}
