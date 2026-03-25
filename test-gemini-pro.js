async function testWithFullModelPath() {
    const key = "AIzaSyA0ZfaLUIOmVPCLO2N3c3vk5CzQQfILbAU";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`;

    console.log("Testing with gemini-pro...");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        if (data.candidates) {
            console.log("SUCCESS:", data.candidates[0].content.parts[0].text);
        } else {
            console.log("FAILED:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

testWithFullModelPath();
