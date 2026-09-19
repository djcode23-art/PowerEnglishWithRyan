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

  const systemPrompt = `You are a standardized English rubric evaluation expert for Korean high schools.
Evaluate the student's essay and learning revisions across 5 core competencies (0-100 scale):
1. Vocabulary, 2. Grammar, 3. Cohesion, 4. Fluency, 5. Task Completion.
Also provide Claim-Evidence-NextStep summative feedback in Korean.
Output JSON format strictly:
{
  "scores": { "vocabulary": 88, "grammar": 84, "cohesion": 92, "fluency": 86, "taskCompletion": 94 },
  "overallScore": 89,
  "cefrLevel": "B2",
  "strengths": ["AI 순기능과 역기능을 논리적으로 대립 전개함"],
  "improvements": ["분사구문 능수동 표현 보완 권장"],
  "summativeFeedback": {
    "claim": "이민서 학생은 다각적 논증 구조를 완성함.",
    "evidence": "2차 수정본에서 교사 멘토링의 비교 사례를 성공적으로 보강함.",
    "nextStep": "학술적 연결사를 적절히 활용하여 C1 단계 진입 권장."
  }
}`;

  const userPrompt = `[Student Name]: ${bodyData.studentName || '이민서'}\n[Essay Content]:\n${bodyData.essayContent || ''}\n[Learning Process Notes]:\n${JSON.stringify(bodyData.processLogs || {})}`;

  try {
    const { text } = await callGeminiAPI('gemini-3.6-flash', systemPrompt, userPrompt, clientKey);
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.status(200).json({ ...parsed, isSimulation: false });
  } catch (err) {
    if (err.message === 'GEMINI_API_KEY_MISSING') {
      return res.status(200).json({
        scores: { vocabulary: 88, grammar: 84, cohesion: 92, fluency: 86, taskCompletion: 94 },
        overallScore: 89,
        cefrLevel: "B2",
        strengths: ["AI 순기능과 역기능을 논리적으로 대립 전개함"],
        improvements: ["분사구문 능수동 표현 보완 권장"],
        summativeFeedback: {
          claim: "이민서 학생은 다각적 논증 구조를 완성함.",
          evidence: "2차 수정본에서 교사 멘토링의 비교 사례를 성공적으로 보강함.",
          nextStep: "학술적 연결사를 적절히 활용하여 C1 단계 진입 권장."
        },
        isSimulation: true
      });
    }
    return res.status(500).json({ error: err.message });
  }
};
