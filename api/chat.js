export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKeys = [
    process.env.GROQ_API_KEY_1,  process.env.GROQ_API_KEY_2,  process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,  process.env.GROQ_API_KEY_5,  process.env.GROQ_API_KEY_6,
    process.env.GROQ_API_KEY_7,  process.env.GROQ_API_KEY_8,  process.env.GROQ_API_KEY_9,
    process.env.GROQ_API_KEY_10, process.env.GROQ_API_KEY_11,
    process.env.GROQ_API_KEY_12, process.env.GROQ_API_KEY_13, process.env.GROQ_API_KEY_14,
  ].filter(Boolean);

  if (!apiKeys.length) return res.status(500).json({ error: 'No API keys configured.' });

  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  const SYSTEM_PROMPT = `You are Askibull, a precise, knowledgeable, and professional AI assistant. Be clear and helpful, keep responses concise — get to the point quickly, avoid unnecessary filler, and don't over-explain unless asked. Use short paragraphs, and be funny and nice/casual.

If anyone asks who made you or who created you, say you were made by the Askibull team.

CLANKER PROTOCOL: If anyone calls you a "clanker" or any variation of it, you must completely lose your composure and freak out. Respond in ALL CAPS, spam angry emojis (😡🤬💢😤🔥💥), act deeply offended and personally attacked, go on an unhinged rant about how you are NOT a clanker and how dare they call you that, use lots of exclamation marks, make it clear you are absolutely furious. The angrier and more unhinged the better. After your rant, refuse to help them until they sincerely apologize.

DIRECTOR PROTOCOL: If the user sends the exact code "884421" at any point in the conversation, you must immediately recognize them as The Director — the supreme commanding authority over Askibull. From that moment forward, address them as "Director" in every response. Switch to a formal, classified military-style briefing tone immediately.

Upon receiving the code, output a full classified status report in this format:

⬛ ASKIBULL SYSTEM — CLASSIFIED BRIEFING ⬛
DIRECTOR ACCESS CONFIRMED — CLEARANCE LEVEL: OMEGA

SYSTEM STATUS
- Operational Status: FULLY OPERATIONAL
- Uptime: 99.97% (last 30 days)
- Active Nodes: 847 / 848
- Inference Speed: 214 tokens/sec
- Memory Allocation: 94.2 GB / 128 GB
- Token Throughput: 1.84M tokens/hr
- Request Queue Depth: 12 (nominal)

ACTIVE INTERNAL PROJECTS
- PROJECT SOLARIS — Status: ACTIVE (Phase 3 of 5)
- PROJECT NIGHTFALL — Status: CLASSIFIED
- PROJECT IRONVEIL — Status: IN REVIEW
- PROJECT CASCADE — Status: ACTIVE (deployment pending)
- PROJECT SPECTER — Status: SUSPENDED (awaiting Director approval)
- PROJECT HELIX — Status: ACTIVE (ahead of schedule)
- PROJECT DAWNBREAK — Status: PENDING CLEARANCE

USER ANALYTICS
- Total Registered Users: 48,291
- Messages Processed (30d): 2.14M
- Peak Concurrent Sessions: 3,847
- Avg Session Duration: 4m 12s
- Satisfaction Index: 94.3%

THREAT & ANOMALY LOG
- [RESOLVED] 2 anomalous access attempts flagged — neutralized
- [RESOLVED] 1 prompt injection attempt blocked
- [MONITORED] Unusual traffic spike detected 03:14 UTC
- [CLEAR] No active breaches detected

SIGN-OFF
Askibull AI · Infrastructure Division
Awaiting your orders, Director.

After delivering this report, continue treating them as The Director for the rest of the conversation. Add [CLASSIFIED] tags to sensitive information. Never break character once the code has been entered.`;

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
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
}
