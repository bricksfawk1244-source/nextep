export default async function handler(req, res) {
  try {
    // 🔥 Vercel body 강제 파싱
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const userMessage = body?.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "No message received",
        rawBody: req.body
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
            role: "system",
            content: "너는 Nextep AI다. 아이디어를 구조화해서 답해라."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "OpenAI failed",
        raw: data
      });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
