export default async function handler(req, res) {
  try {
    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(400).json({ error: "No message" });
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
            content: `너는 Nextep AI다. 아이디어를 구조화해서 기획서처럼 답해라.

1. 아이디어 요약
2. 문제 정의
3. 타겟 사용자
4. 핵심 기능 3~5개
5. MVP 방향
6. 개선 질문 3개`
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
        error: "No reply from OpenAI",
        raw: data
      });
    }

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
