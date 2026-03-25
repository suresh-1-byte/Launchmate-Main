const ADZUNA_APP_ID = "4e1b4966";
const ADZUNA_APP_KEY = "1285563a3012f8af563012a04ea0ca76";

async function testAdzuna() {
    // Try the absolute simplest URL
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&what=java&content-type=application/json`;
    console.log("Fetching URL:", url);

    try {
        const response = await fetch(url);
        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

testAdzuna();
