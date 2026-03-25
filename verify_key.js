const ADZUNA_APP_ID = "4e1b4966";
const ADZUNA_APP_KEY = "754d757829c01d65e6ae36ca972c569b";

async function testAdzuna() {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&what=software%20engineer&content-type=application/json`;
    console.log("Fetching URL:", url);

    try {
        const response = await fetch(url);
        console.log("Status:", response.status);
        const data = await response.json();

        if (response.ok) {
            console.log("✅ SUCCESS! Results count:", data.results?.length);
            if (data.results?.length > 0) {
                console.log("Sample Result Topic:", data.results[0].title);
            }
        } else {
            console.log("❌ FAILED:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

testAdzuna();
