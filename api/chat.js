export default function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "POST만 가능" });
    }

    const message = req.body?.message;

    return res.status(200).json({
      reply: "Nextep 응답: " + message
    });

  } catch (err) {
    return res.status(500).json({
      reply: "서버 에러"
    });
  }
}
