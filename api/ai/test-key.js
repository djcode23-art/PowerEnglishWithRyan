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

  if (!clientKey) {
    return res.status(200).json({ valid: false, message: 'API 키가 설정되지 않았습니다.', isSimulation: true });
  }

  const startTime = Date.now();
  try {
    await callGeminiAPI('gemini-3.6-flash', 'Reply OK', 'Test', clientKey);
    const latency = Date.now() - startTime;
    return res.status(200).json({ valid: true, latencyMs: latency, model: 'gemini-3.6-flash', message: `Gemini 3.6 Flash 연결 성공 (${latency}ms)!` });
  } catch (err) {
    return res.status(200).json({ valid: false, message: `연결 실패: ${err.message}`, error: err.message });
  }
};
