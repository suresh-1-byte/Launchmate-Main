import { NextRequest } from "next/server";
import { success, error } from "@/lib/api";
import { searchTrendingRepos } from "@/lib/github";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { searchParams } = new URL(request.url);
        const tech = searchParams.get("tech") || "";
        const difficulty = searchParams.get("difficulty") || "";
        const domain = searchParams.get("domain") || "";

        let query = "stars:>100";
        if (tech) query += ` language:${tech}`;
        if (domain) query += ` ${domain}`;

        // Add difficulty keywords to query if provided
        if (difficulty === "Beginner") query += " help-wanted-issues:>0";
        if (difficulty === "Advanced") query += " stars:>5000";

        const repos = await searchTrendingRepos(query);

        // Add some helper tags for discovery
        const taggedRepos = repos.map(repo => {
            const tags = [];
            if (repo.stars > 1000) tags.push("🔥 Trending");
            if (repo.stars < 500) tags.push("🌱 Beginner Friendly");
            if (repo.description?.toLowerCase().includes("final") || repo.description?.toLowerCase().includes("project")) tags.push("🎓 Great for Final Year");
            if (repo.forks > 100) tags.push("🤝 Active Contribs");

            return {
                ...repo,
                discoveryTags: tags,
                difficulty: repo.stars > 2000 ? "Advanced" : repo.stars > 500 ? "Intermediate" : "Beginner"
            };
        });

        return success(taggedRepos);
    } catch (err) {
        console.error("Discovery error:", err);
        return error("Internal server error", 500);
    }
}
