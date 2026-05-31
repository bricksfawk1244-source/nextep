export default async function handler(req, res) {
  const userMessage = req.body.message;

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
          content: `너는 “Nextep AI”다.

아이디어를 아래 구조로 정리해라:

1. 아이디어 요약
2. 문제 정의
3. 타겟 사용자
4. 핵심 기능 3~5개
5. 실행 방향 (MVP)
6. 개선 질문 3개

기획자처럼 현실적으로 답해라.`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  res.status(200).json({ reply });
}
