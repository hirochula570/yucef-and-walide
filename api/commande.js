module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const secretKey = process.env.N8N_SECRET_KEY;

  if (!webhookUrl) {
    return res.status(500).json({ message: "N8N_WEBHOOK_URL non configuré sur Vercel" });
  }

  try {
    const reponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secretKey ? { "x-api-key": secretKey } : {})
      },
      body: JSON.stringify(req.body)
    });

    if (!reponse.ok) {
      return res.status(502).json({ message: "Erreur de réception côté n8n" });
    }

    return res.status(200).json({ succes: true });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur interne" });
  }
};