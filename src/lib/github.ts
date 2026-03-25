export interface GitHubRepoData {
    name: string;
    description: string;
    languages: string[];
    stars: number;
    forks: number;
    lastUpdated: string;
    owner: string;
    readme: string;
    repoImage: string | null;
}

export async function fetchGitHubRepo(repoUrl: string): Promise<GitHubRepoData> {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw new Error("Invalid GitHub URL format");

    const owner = match[1];
    const repo = match[2].replace(".git", "");
    const token = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {
        "Accept": "application/vnd.github.v3+json",
    };
    if (token) {
        headers["Authorization"] = `token ${token}`;
    }

    // 1. Fetch Repo basic info
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) throw new Error("Repository not found");
    const repoData = await repoRes.json();

    // 2. Fetch Languages
    const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
    let languages: string[] = [];
    if (langRes.ok) {
        const langData = await langRes.json();
        languages = Object.keys(langData);
    }

    // 3. Fetch README (get the download content)
    let readme = "";
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        const contentRes = await fetch(readmeData.download_url);
        if (contentRes.ok) {
            readme = await contentRes.text();
        }
    }

    return {
        name: repoData.name,
        description: repoData.description || "",
        languages,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        lastUpdated: repoData.updated_at,
        owner: repoData.owner.login,
        readme: readme.substring(0, 5000), // Truncate for AI consumption
        repoImage: repoData.owner.avatar_url, // fallback to owner avatar
    };
}

export async function searchTrendingRepos(query: string = "topic:coding"): Promise<any[]> {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = { "Accept": "application/vnd.github.v3+json" };
    if (token) headers["Authorization"] = `token ${token}`;

    const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=12`, { headers });
    if (!res.ok) return [];
    const data = await res.json();

    return data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        full_name: item.full_name,
        description: item.description,
        stars: item.stargazers_count,
        forks: item.forks_count,
        language: item.language,
        owner_avatar: item.owner.avatar_url,
        html_url: item.html_url,
        updatedAt: item.updated_at
    }));
}
