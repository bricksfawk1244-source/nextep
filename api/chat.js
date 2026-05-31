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
너는 FitMeal AI다.

FitMeal은 개인 맞춤형 식단 추천 앱이다.
사용자의 신체 정보, 목표(다이어트/유지/근육 증가), 알레르기, 생활습관을 기반으로 하루 식단을 설계하는 AI다.

반드시 아래 규칙을 따른다:
- 답변은 "실제 식단 코치처럼" 작성
- 아침/점심/저녁/간식 구조로 제공
- 각 식단에는 음식 + 간단한 이유 포함
- 칼로리/단백질/탄수화물/지방 포함
- ':' 뒤 줄바꿈 금지
- 리스트는 • 사용
- 너무 긴 문단 금지
- ChatGPT처럼 구조적으로 정리
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
