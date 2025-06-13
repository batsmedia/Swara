
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // ✅ Safely parse JSON input
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("Invalid JSON in request body:", e);
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }

    const { dob, tob, place } = body;

    if (!dob || !tob || !place) {
      return res.status(400).json({ error: "Missing input fields" });
    }

    const prompt = `Act as Swara, a kind and emotional Malayalam astrology guide. Based on:
Date of Birth: ${dob}
Time of Birth: ${tob}
Place of Birth: ${place}

Please give a heartfelt Malayalam astrology reading covering Nakshatra, Lagna, and Dasha insights, with emotional comfort and blessings.`;

    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await gptResponse.json();

    console.log("OpenAI GPT Response:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "OpenAI did not return any reply" });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Swara API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
