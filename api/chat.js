export default async function handler(req, res) {
  try {
    console.log("METHOD:", req.method);
    console.log("BODY RAW:", req.body);

    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const userMessage = body?.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "NO_MESSAGE",
        receivedBody: req.body
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
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      debug: true,
      openai: data
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
