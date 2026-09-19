const https = require('https');

const SERVER_GEMINI_KEY = process.env.GEMINI_API_KEY || '';

function callGeminiAPI(model, systemInstruction, userPrompt, apiKey) {
  return new Promise((resolve, reject) => {
    const key = apiKey || SERVER_GEMINI_KEY;
    if (!key) return reject(new Error('GEMINI_API_KEY_MISSING'));

    const modelName = model || 'gemini-3.1-pro-preview';
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

  const systemPrompt = `You are an AI assistant helping Korean English teachers write official School Life Records (생활기록부 교과학습발달상황 세부능력및특기사항).
STRICT RULES:
1. Base your statement STRICTLY AND EXCLUSIVELY on the provided Evidence Package. Do NOT invent unobserved traits.
2. Write in formal, objective, observation-based Korean style ending with '~함', '~를 보임', '~를 완수함'.
3. Output JSON formatted strictly as:
{
  "statement": "진술문 전문...",
  "traces": [
    {"sentence": "주요 문장", "source": "근거 차시/코멘트 출처"}
  ]
}`;

  const userPrompt = `[Student Name]: ${bodyData.studentName || '이민서'}\n[Selected Evidence Package]:\n${JSON.stringify(bodyData.evidencePackage || {}, null, 2)}`;

  try {
    const { text } = await callGeminiAPI('gemini-3.1-pro-preview', systemPrompt, userPrompt, clientKey);
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.status(200).json({ ...parsed, isSimulation: false });
  } catch (err) {
    if (err.message === 'GEMINI_API_KEY_MISSING') {
      return res.status(200).json({
        statement: `${bodyData.studentName || '이민서'} 학생은 영어 논증문 작성 과업에서 인공지능 기술의 교육적 순기능과 부작용을 다각도로 분석함. 초안 작성 후 교사의 첨삭 지도를 수용하여 인간 교사의 정서적 공감 역할을 대비시키는 논거를 능동적으로 보강함.`,
        traces: [
          { sentence: '인공지능 기술의 교육적 순기능과 부작용을 다각도로 분석함', source: 'Task 101 - Session 2 First Draft' }
        ],
        isSimulation: true
      });
    }
    return res.status(500).json({ error: err.message });
  }
};
