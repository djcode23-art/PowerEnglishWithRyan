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

  const systemPrompt = `You are an AI Grammar Clinic specialist for Korean English learners.
Based on the provided student sentence and target grammar concept, generate:
1. A concise explanation of the grammar rule in Korean.
2. A 3-second diagnostic multiple-choice quiz question with 4 options (A, B, C, D) where only 1 is correct.
3. Explanation for the correct option.
Output JSON format strictly:
{
  "conceptTitle": "문법 개념 명칭",
  "ruleSummary": "한국어 핵심 규칙 요약",
  "quiz": {
    "question": "Choose the correct expression:",
    "sentence": "문맥 문장...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctIndex": 1,
    "explanation": "정답 해설 (한국어)"
  }
}`;

  const userPrompt = `[Target Grammar Concept]: ${bodyData.concept || '관계대명사 계속적 용법 & 분사구문'}\n[Student Sentence Context]: "${bodyData.sentence || ''}"`;

  try {
    const { text } = await callGeminiAPI('gemini-3.6-flash', systemPrompt, userPrompt, clientKey);
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.status(200).json({ ...parsed, isSimulation: false });
  } catch (err) {
    if (err.message === 'GEMINI_API_KEY_MISSING') {
      return res.status(200).json({
        conceptTitle: "관계대명사의 선행사 수일치",
        ruleSummary: "주격 관계대명사절의 동사는 콤마(,) 앞의 선행사의 단/복수 형태에 일치시켜야 합니다.",
        quiz: {
          question: "Choose the correct verb form for the non-defining relative clause:",
          sentence: "Generative AI systems, which ______ rapidly across schools, require ethical guidance.",
          options: ["A. is evolving", "B. are evolving", "C. has evolved", "D. evolves"],
          correctIndex: 1,
          explanation: "선행사가 'Generative AI systems'로 복수이므로 관계사절 동사도 복수형인 'are evolving'이 정답입니다."
        },
        isSimulation: true
      });
    }
    return res.status(500).json({ error: err.message });
  }
};
