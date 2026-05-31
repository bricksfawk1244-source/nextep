import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
            content: `너는 Nextep AI다. 아이디어를 구조화해라:
1. 요약
2. 문제
3. 타겟
4. 기능
5. MVP
6. 질문`
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

    // 🔥 Supabase 저장
    await supabase.from("ideas").insert([
      {
        message: userMessage,
        reply: reply
      }
    ]);

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
