import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    console.log("REQ BODY:", req.body);

    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(400).json({ error: "No message received" });
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

    console.log("OPENAI RESPONSE:", data);

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "No reply from OpenAI",
        raw: data
      });
    }

    // Supabase 저장 (에러 무시)
    await supabase.from("ideas").insert([
      {
        message: userMessage,
        reply: reply
      }
    ]);

    return res.status(200).json({ reply });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    return res.status(500).json({
      error: err.message
    });
  }
}
