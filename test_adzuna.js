const ADZUNA_APP_ID = "4e1b4966";
const ADZUNA_APP_KEY = "1285563a3012f8af563012a04ea0ca76";

async function testAdzuna() {
    const params = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: "5",
        what: "software engineer",
    });

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?${params.toString()}`;
    console.log("Fetching URL:", url);

    try {
        const response = await fetch(url);
        console.log("Status:", response.status);
        if (!response.ok) {
            const errBody = await response.text();
            console.error("Error body:", errBody);
            return;
        }
        const data = await response.json();
        console.log("Results count:", data.results?.length);
        if (data.results?.length > 0) {
            console.log("First job title:", data.results[0].title);
            console.log("Full data structure for mapping check:");
            console.log(JSON.stringify(data.results[0], null, 2));
        }
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

testAdzuna();
