export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "POST만 허용됨" });
  }

  const { message } = req.body;

  res.status(200).json({
    reply: "테스트 응답: " + message
  });
}
