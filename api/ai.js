export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, location } = req.body;

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: `
너는 Nextep AI다.

절대 추상적으로 말하지 마라.

항상:
- 사용자의 현재 상황
- 위치 (${location})
- 현실적인 행동

기반으로

"오늘 바로 할 행동 3개"
만 출력해라.
            `
          },
          {
            role: "user",
            content: input
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const result = data.choices?.[0]?.message?.content || "응답 없음";

    res.status(200).json({ result });

  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
}
