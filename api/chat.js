export default async function handler(req, res) {
  try {
    let body = req.body;

    // 🔥 아임웹 대비 필수
    if (typeof body === "string") {
      body = JSON.parse(body || "{}");
    }

    if (!body) body = {};

    const userMessage = body.message || body.text || body;

    if (!userMessage) {
      return res.status(400).json({
        error: "NO_MESSAGE",
        received: req.body
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content;

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
