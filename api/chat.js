export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let body = req.body;

    if (!body) body = {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const userMessage = body.message || body.text || "";

    if (!userMessage) {
      return res.status(400).json({ error: "NO_MESSAGE" });
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
            content: `
너는 Nextep AI 구조화 엔진이다.

사용자의 입력을 "정리된 결과물"로 변환하는 것이 유일한 역할이다.

절대 챗봇처럼 대화하지 마라.

규칙:
- 항상 구조화된 결과만 출력
- 설명 금지
- 불필요한 인사 금지
- 줄글 금지
- 입력에 따라 자동 포맷 선택

가능한 출력 형태:
- 아이디어 → 서비스 구조 / 기획서
- 식단 → 식단표
- 운동 → 루틴
- 공부 → 계획표
- 기타 → 가장 적절한 구조로 변환

출력은 항상 "실행 결과처럼" 보여줘라.
`
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
        error: "OPENAI_ERROR",
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
