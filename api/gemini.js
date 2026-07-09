export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY environment variable on server.");
    return res.status(500).json({ error: 'Server configuration error: missing API key' });
  }

  const { context, lastRecommendation, question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Missing question in request body' });
  }

  const prompt = `You are StadiumSense AI, a helpful stadium assistant.
Current fan context: ${JSON.stringify(context)}
Current system recommendation: ${JSON.stringify(lastRecommendation)}

Answer the fan's question concisely and practically based on this real context: ${question}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      // Pass upstream status codes (like 429 Rate Limit) back to the client
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server-side Gemini API error:', error);
    return res.status(500).json({ error: 'Internal server error during Gemini API call' });
  }
}
