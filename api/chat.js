export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "POST만 가능" });
  }

  const { message } = req.body;

  return res.status(200).json({
    reply: "테스트 성공: " + message
  });
}
