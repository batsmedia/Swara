export default async function handler(req, res) {
  try {
    const { dob, tob, place } = req.body;

    const userInput = `Date of Birth: ${dob}\nTime of Birth: ${tob}\nPlace of Birth: ${place}`;
    const prompt = `Act as Swara, an emotional spiritual astrology guide who replies in Malayalam and soft English. 
Given this birth info:
${userInput}

Return a gentle astrology reading covering Nakshatra, Lagna, and current Dasha insights.
Include emotional and spiritual comfort in your response.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid response from OpenAI");
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Swara API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
