const ADZUNA_APP_ID = "4e1b4966";
const ADZUNA_APP_KEY = "1285563a3012f8af563012a04ea0ca76";

async function testAdzuna(region = "in") {
    const params = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: "5",
        what: "javascript",
        content_type: "application/json"
    });

    const url = `https://api.adzuna.com/v1/api/jobs/${region}/search/1?${params.toString()}`;
    console.log(`Testing region: ${region}`);
    console.log("Fetching URL:", url);

    try {
        const response = await fetch(url);
        console.log("Status:", response.status);
        const data = await response.json();

        if (response.ok) {
            console.log("SUCCESS! Results count:", data.results?.length);
        } else {
            console.log("FAILED Error:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

async function run() {
    await testAdzuna("in");
    console.log("---");
    await testAdzuna("gb");
}

run();
