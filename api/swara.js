
export default async function handler(req, res) {
  const { dob, tob, place } = req.body;

  const userInput = `Date of Birth: ${dob}\nTime of Birth: ${tob}\nPlace of Birth: ${place}`;
  const prompt = `Act as Swara, an emotional spiritual astrology guide who replies in Malayalam and soft English. 
Given this birth info:
${userInput}

Return a gentle astrology reading covering Nakshatra, Lagna, and current Dasha insights.
Include emotional and spiritual comfort in your response.`;

  const reply = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${process.env.OPENAI_API_KEY}\`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const json = await reply.json();
  res.status(200).json({ reply: json.choices[0].message.content });
}
