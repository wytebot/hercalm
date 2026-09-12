const buckets = globalThis.__hercalmRateBuckets || (globalThis.__hercalmRateBuckets = new Map());

function clientKey(req) {
  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.socket?.remoteAddress || 'unknown');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'AI is not configured. Add GEMINI_API_KEY on the server.' });

  const now = Date.now();
  const key = clientKey(req);
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;
  const recent = (buckets.get(key) || []).filter(t => now - t < windowMs);
  if (recent.length >= maxRequests) {
    res.setHeader('Retry-After', '600');
    return res.status(429).json({ error: 'Too many CalmPlan requests. Please try again in a few minutes.' });
  }
  recent.push(now);
  buckets.set(key, recent);

  try {
    const body = req.body || {};
    const mood = String(body.mood || '').slice(0, 80);
    const goal = String(body.goal || '').slice(0, 80);
    const time = String(body.time || '5 minutes').slice(0, 40);
    const note = String(body.note || '').slice(0, 400);
    const allowedTimes = new Set(['5 minutes','10 minutes','20 minutes','30 minutes']);
    if (!allowedTimes.has(time)) return res.status(400).json({ error: 'Invalid time selection.' });
    if (!mood || !goal) return res.status(400).json({ error: 'Please choose a mood and goal.' });

    const prompt = `Create a short, practical self-care routine for a wellness app user.
Inputs:
Mood: ${mood}
Goal: ${goal}
Available time: ${time}
Optional note: ${note}

Rules:
- General wellness content only.
- Do NOT diagnose, prescribe, recommend medication or supplements, interpret symptoms, or give medical advice.
- Do not claim an activity treats, cures, prevents, or relieves a disease or medical condition.
- If the note asks for diagnosis, treatment, medication, or emergency guidance, briefly refuse that part and pivot to safe general wellness activities.
- Do not ask the user to provide sensitive personal information.
- Give 3 to 5 numbered actions that fit the selected time.
- Keep it warm, specific, practical, and easy to follow.
- Include one simple “skip or stop if uncomfortable” reminder.
- Maximum 160 words.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let r;
    try {
      r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.35, maxOutputTokens: 240 } })
      });
    } finally { clearTimeout(timeout); }

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(502).json({ error: 'The AI provider could not complete the request.' });
    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
    if (!text) return res.status(502).json({ error: 'No AI response returned.' });
    if (/\b(diagnos(?:e|is|ed)?|prescrib(?:e|ed|ing)|dosage|medication|take\s+(?:ibuprofen|acetaminophen|aspirin)|treat(?:ment|s|ed)?|cure(?:s|d)?|emergency\s+room)\b/i.test(text)) {
      return res.status(502).json({ error: 'The generated response did not pass the wellness safety check. Please try again.' });
    }
    return res.status(200).json({ text });
  } catch (e) {
    if (e?.name === 'AbortError') return res.status(504).json({ error: 'The AI request timed out. Please try again.' });
    return res.status(500).json({ error: 'Unable to create a CalmPlan right now.' });
  }
}
