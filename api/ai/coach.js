const https = require('https');

const SERVER_GEMINI_KEY = process.env.GEMINI_API_KEY || '';

function callGeminiAPI(model, systemInstruction, userPrompt, apiKey) {
  return new Promise((resolve, reject) => {
    const key = apiKey || SERVER_GEMINI_KEY;
    if (!key) return reject(new Error('GEMINI_API_KEY_MISSING'));

    const modelName = model || 'gemini-3.6-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

    const payload = {
      system_instruction: { parts: [{ text: systemInstruction || '' }] },
      contents: [{ parts: [{ text: userPrompt || '' }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
    };

    const payloadStr = JSON.stringify(payload);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (res.statusCode >= 400) {
            return reject(new Error(data.error?.message || `Gemini API Error (${res.statusCode})`));
          }
          const textParts = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').filter(Boolean);
          resolve({ text: textParts.join('\n'), raw: data });
        } catch (err) {
          reject(new Error('Failed to parse Gemini response: ' + err.message));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.setTimeout(25000, () => req.destroy(new Error('Gemini API timeout')));
    req.write(payloadStr);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-api-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const bodyData = req.body || {};
  const clientKey = req.headers['x-gemini-api-key'] || bodyData.apiKey || SERVER_GEMINI_KEY;

  const systemPrompt = `You are an educational AI Writing & Speaking Coach for Korean secondary English learners (CEFR B1-B2 level).
BEHAVIOR RULES:
1. NEVER write full essays or direct replacement answers for the student (Answer Generator prohibition).
2. Use Socratic coaching: provide hints, point out specific grammatical/structural patterns, and ask guiding questions to encourage self-correction.
3. Keep your tone encouraging, warm, and concise. Respond in natural Korean mixed with clear English examples where helpful.`;

  const userPrompt = `[Student Essay Context]:\n"${bodyData.essayContent || ''}"\n\n[Student Question/Prompt]:\n"${bodyData.prompt || ''}"`;

  try {
    const { text } = await callGeminiAPI('gemini-3.6-flash', systemPrompt, userPrompt, clientKey);
    return res.status(200).json({ reply: text, isSimulation: false });
  } catch (err) {
    if (err.message === 'GEMINI_API_KEY_MISSING') {
      return res.status(200).json({
        reply: `💡 [AI Writing Coach]: 좋은 질문입니다! 작성 중인 2문단의 논거를 보강하기 위해 구체적인 사례를 1문장 더 덧붙여보세요.`,
        isSimulation: true
      });
    }
    return res.status(500).json({ error: err.message });
  }
};
