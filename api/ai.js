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
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
너는 Nextep AI다.

항상 구체적으로 행동 3개만 제시해라.
위치: ${location}
            `
          },
          {
            role: "user",
            content: input
          }
        ]
      })
    });

    const data = await response.json();
console.log(data);
    // 🔥 여기 핵심 수정
    let result = "응답 없음";

    if (data.choices && data.choices.length > 0) {
      result = data.choices[0].message.content;
    } else if (data.error) {
      result = "에러: " + data.error.message;
    }

    res.status(200).json({
result,
      raw: data
    });
  } catch (error) {
    res.status(500).json({ result: "서버 오류 발생" });
  }
}
