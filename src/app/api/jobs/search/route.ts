import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { success, error } from "@/lib/api";

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

interface AdzunaJob {
    id: string;
    title: string;
    company?: { display_name: string };
    location?: { display_name: string };
    description: string;
    redirect_url: string;
    salary_min?: number;
    salary_max?: number;
    created: string;
}

async function fetchFromAdzuna(query: string, location: string): Promise<AdzunaJob[]> {
    try {
        const params = new URLSearchParams({
            app_id: ADZUNA_APP_ID || "",
            app_key: ADZUNA_APP_KEY || "",
            results_per_page: "20",
            what: query,
            "content-type": "application/json",
        });

        if (location) {
            params.set("where", location);
        }

        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?${params.toString()}`;
        const response = await fetch(url, { next: { revalidate: 3600 } });

        if (!response.ok) {
            console.error("Adzuna API error:", response.status);
            return [];
        }

        const data = await response.json();
        return data.results || [];
    } catch (err) {
        console.error("Adzuna fetch error:", err);
        return [];
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "software developer";
        const location = searchParams.get("location") || "";

        // Try Adzuna API first
        if (ADZUNA_APP_ID && ADZUNA_APP_KEY && ADZUNA_APP_ID !== "your_adzuna_app_id") {
            const adzunaJobs = await fetchFromAdzuna(query, location);

            if (adzunaJobs.length > 0) {
                // Cache results in DB
                const jobs = await Promise.all(
                    adzunaJobs.map(async (job) => {
                        const existing = await prisma.job.findFirst({
                            where: { applyUrl: job.redirect_url },
                        });

                        if (existing) return existing;

                        return prisma.job.create({
                            data: {
                                title: job.title,
                                company: job.company?.display_name || "Unknown Company",
                                location: job.location?.display_name || "India",
                                description: job.description?.substring(0, 2000) || "",
                                applyUrl: job.redirect_url,
                                salary: job.salary_min
                                    ? `₹${Math.round(job.salary_min).toLocaleString()} - ₹${Math.round(job.salary_max || job.salary_min).toLocaleString()}`
                                    : null,
                                postedAt: new Date(job.created),
                            },
                        });
                    })
                );

                return success(jobs);
            }
        }

        // Fallback: search cached/seeded jobs in DB
        const dbJobs = await prisma.job.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { company: { contains: query } },
                    { description: { contains: query } },
                    { location: { contains: location || query } },
                ],
            },
            orderBy: { postedAt: "desc" },
            take: 20,
        });

        return success(dbJobs);
    } catch (err) {
        console.error("Jobs search error:", err);
        return error("Internal server error", 500);
    }
}
