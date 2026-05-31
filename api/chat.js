export default async function handler(req, res) {
  // 🔥 CORS (아임웹 필수 대응)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // 🔥 body 안전 파싱 (아임웹 대비)
    let body = req.body;

    if (!body) body = {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const userMessage = body.message || body.text || body || "";

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({
        error: "NO_MESSAGE",
        received: req.body
      });
    }

    // 🔥 OpenAI 호출
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
            content: "너는 Nextep AI다. 아이디어를 구조화해서 현실적인 MVP 형태로 정리해라."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    // 🔥 안전 체크
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "OPENAI_FAILED",
        raw: data
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (err) {
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: err.message
    });
  }
}
