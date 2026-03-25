async function testWithFullModelPathV1Beta() {
    const key = "AIzaSyA0ZfaLUIOmVPCLO2N3c3vk5CzQQfILbAU";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`;

    console.log("Testing with gemini-1.5-flash-latest...");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

testWithFullModelPathV1Beta();
