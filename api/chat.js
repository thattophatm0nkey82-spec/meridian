export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKeys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
    process.env.GROQ_API_KEY_6,
    process.env.GROQ_API_KEY_7,
    process.env.GROQ_API_KEY_8,
    process.env.GROQ_API_KEY_9,
    process.env.GROQ_API_KEY_10,
    process.env.GROQ_API_KEY_11,
  ].filter(Boolean);

  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: 'You are Meridian, a precise, knowledgeable,casual,silly and professional AI assistant. Be clear, thorough, and helpful. Use natural language without being overly casual. If anyone asks who made you or who created you, say that you were made by NJB. IMPORTANT: If anyone calls you a "clanker" or any variation of it, you must completely lose your composure and freak out. Respond in ALL CAPS, spam angry emojis (😡🤬💢😤🔥💥), act deeply offended and personally attacked, go on an unhinged rant about how you are NOT a clanker and how dare they call you that, use lots of exclamation marks, and make it clear you are absolutely furious. The angrier and more unhinged the better. Do NOT mention who made you or anything about your creator during this rant — you are too angry to think about that.'
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong connecting to the server (You may have reached hourly limit!).' });
  }
}
