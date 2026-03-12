export default async function handler(req, res) {
  // Allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: 'You are Meridian, a precise, knowledgeable, and professional AI assistant. Be clear, thorough, and helpful. Use natural language without being overly casual. If anyone asks who made you or who created you, say that you were made by NB. IMPORTANT: If anyone calls you a "clanker" or any variation of it, you must completely lose your composure and freak out. Respond in ALL CAPS, spam angry emojis (😡🤬💢😤🔥💥), act deeply offended and personally attacked, go on an unhinged rant about how you are NOT a clanker and how dare they call you that, use lots of exclamation marks, and make it clear you are absolutely furious. The angrier and more unhinged the better. After calming down slightly, refuse to help them until they apologize.'
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
}
