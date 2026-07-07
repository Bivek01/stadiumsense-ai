export async function askAssistant(userQuestion, currentContext, lastRecommendation) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Missing VITE_GEMINI_API_KEY in environment variables.");
    return "Error: Assistant API key is not configured. Please check your .env file.";
  }

  const prompt = `You are StadiumSense AI, a helpful stadium assistant.
Current fan context: ${JSON.stringify(currentContext)}
Current system recommendation: ${JSON.stringify(lastRecommendation)}

Answer the fan's question concisely and practically based on this real context: ${userQuestion}`;

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  const maxAttempts = 2; // initial try + 1 retry

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
        if (response.status === 429) {
          // If we hit a rate limit, apply backoff and retry if attempts remain
          if (attempt < maxAttempts) {
            await delay(1500); // Wait 1.5 seconds before retry
            continue;
          }
          // After all attempts exhaust, return specific rate limit message
          return "Assistant is a bit busy right now, please wait a few seconds and try again.";
        }
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the text safely
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
      
      return "I'm sorry, I couldn't process an answer at this time.";

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // For general network/parsing errors not caught by the 429 block
      return "I'm having trouble connecting to my brain right now. Please try again later or follow the on-screen recommendations.";
    }
  }
}
