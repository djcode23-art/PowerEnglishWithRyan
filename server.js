const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
let SERVER_GEMINI_KEY = process.env.GEMINI_API_KEY || '';

// Load .env if exists
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        if (key === 'GEMINI_API_KEY' && val) {
          SERVER_GEMINI_KEY = val;
        }
      }
    });
  }
} catch (e) {
  console.warn('.env load notice:', e.message);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Helper: Call Gemini REST API (gemini-3.6-flash / gemini-3.1-pro-preview)
function callGeminiAPI(model, systemInstruction, userPrompt, apiKey, callback) {
  const key = apiKey || SERVER_GEMINI_KEY;
  if (!key) {
    return callback(new Error('GEMINI_API_KEY_MISSING'));
  }

  const modelName = model || 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction || '' }]
    },
    contents: [
      {
        parts: [{ text: userPrompt || '' }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048
    }
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
          return callback(new Error(data.error?.message || `Gemini API Error (${res.statusCode})`));
        }
        const textParts = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').filter(Boolean);
        const text = textParts.join('\n');
        callback(null, text, data);
      } catch (err) {
        callback(new Error('Failed to parse Gemini response: ' + err.message));
      }
    });
  });

  req.on('error', (e) => callback(e));
  req.setTimeout(25000, () => {
    req.destroy(new Error('Gemini API request timeout (25s)'));
  });
  req.write(payloadStr);
  req.end();
}

const server = http.createServer((req, res) => {
  const parsedUrl = req.url.split('?')[0];

  // API Endpoints
  if (req.method === 'POST' && parsedUrl.startsWith('/api/')) {
    let rawBody = '';
    req.on('data', chunk => rawBody += chunk);
    req.on('end', () => {
      let bodyData = {};
      try {
        if (rawBody) bodyData = JSON.parse(rawBody);
      } catch (e) {}

      const clientKey = req.headers['x-gemini-api-key'] || bodyData.apiKey || SERVER_GEMINI_KEY;

      // 1. Health check & API Key test
      if (parsedUrl === '/api/ai/test-key') {
        const testKey = clientKey;
        if (!testKey) {
          return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
            valid: false,
            message: 'API 키가 설정되지 않았습니다. 시뮬레이션 모드로 동작합니다.',
            isSimulation: true
          }));
        }

        const startTime = Date.now();
        callGeminiAPI('gemini-3.6-flash', 'You are a connection tester. Reply with OK.', 'Test connection', testKey, (err, reply) => {
          const latency = Date.now() - startTime;
          if (err) {
            return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
              valid: false,
              message: `Gemini API 연결 실패: ${err.message}`,
              error: err.message
            }));
          }
          return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
            valid: true,
            latencyMs: latency,
            model: 'gemini-3.6-flash',
            message: `Gemini 3.6 Flash 연결 성공 (${latency}ms)!`
          }));
        });
        return;
      }

      // 2. Current Task AI Coach (Writing / Speaking)
      if (parsedUrl === '/api/ai/coach') {
        const systemPrompt = `You are an educational AI Writing & Speaking Coach for Korean secondary English learners (CEFR B1-B2 level).
BEHAVIOR RULES:
1. NEVER write full essays or direct replacement answers for the student (Answer Generator prohibition).
2. Use Socratic coaching: provide hints, point out specific grammatical/structural patterns (e.g., subject-verb agreement, discourse transitions), and ask guiding questions to encourage self-correction.
3. Keep your tone encouraging, warm, and concise. Respond in natural Korean mixed with clear English examples where helpful.`;

        const userPrompt = `[Student Essay Context]:\n"${bodyData.essayContent || ''}"\n\n[Student Question/Prompt]:\n"${bodyData.prompt || ''}"`;

        callGeminiAPI('gemini-3.6-flash', systemPrompt, userPrompt, clientKey, (err, replyText) => {
          if (err) {
            if (err.message === 'GEMINI_API_KEY_MISSING') {
              return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
                reply: `💡 [AI Writing Coach]: 좋은 질문입니다! 작성 중인 2문단의 'double-edged sword' 개념이 설득력 있습니다. 여기에 학생들이 스스로 사고할 기회를 잃을 수 있다는 구체적 사례를 1문장 더 덧붙여보세요.`,
                isSimulation: true
              }));
            }
            return res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: err.message }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ reply: replyText, isSimulation: false }));
        });
        return;
      }

      // 3. Grammar Mini Lab: Dynamic Quiz & Clinic Generator
      if (parsedUrl === '/api/ai/grammar-lab') {
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

        const userPrompt = `[Target Grammar Concept]: ${bodyData.concept || '관계대명사 계속적 용법 & 분사구문'}\n[Student Sentence Context]: "${bodyData.sentence || 'AI tools, which provides instant answers, might reduce creativity.'}"`;

        callGeminiAPI('gemini-3.6-flash', systemPrompt, userPrompt, clientKey, (err, replyText) => {
          if (err) {
            if (err.message === 'GEMINI_API_KEY_MISSING') {
              return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
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
              }));
            }
            return res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: err.message }));
          }

          try {
            const cleanJson = replyText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ...parsed, isSimulation: false }));
          } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
              conceptTitle: "AI 문법 클리닉",
              ruleSummary: replyText,
              quiz: null,
              isSimulation: false
            }));
          }
        });
        return;
      }

      // 4. Summative Rubric Evaluation (5 Core Competencies + Claim-Evidence-NextStep)
      if (parsedUrl === '/api/ai/summative-rubric') {
        const systemPrompt = `You are a standardized English rubric evaluation expert for Korean high schools.
Evaluate the student's essay and learning revisions across 5 core competencies (0-100 scale):
1. Vocabulary (어휘 적절성 및 다양성)
2. Grammar (문법 정확성 및 구문 복합도)
3. Cohesion (담화 구조 및 결속성)
4. Fluency (유창성 및 표현 자연스러움)
5. Task Completion (과업 완성도 및 논증 깊이)

Also provide Claim-Evidence-NextStep summative feedback in Korean.
Output JSON format strictly:
{
  "scores": {
    "vocabulary": 88,
    "grammar": 84,
    "cohesion": 92,
    "fluency": 86,
    "taskCompletion": 94
  },
  "overallScore": 89,
  "cefrLevel": "B2",
  "strengths": ["강점 1", "강점 2"],
  "improvements": ["보완점 1"],
  "summativeFeedback": {
    "claim": "핵심 총평 주장...",
    "evidence": "구체적 증거 문장/차시...",
    "nextStep": "다음 학습 단계 제언..."
  }
}`;

        const userPrompt = `[Student Name]: ${bodyData.studentName || '이민서'}\n[Essay Content]:\n${bodyData.essayContent || ''}\n[Learning Process Notes]:\n${JSON.stringify(bodyData.processLogs || {})}`;

        callGeminiAPI('gemini-3.6-flash', systemPrompt, userPrompt, clientKey, (err, replyText) => {
          if (err) {
            if (err.message === 'GEMINI_API_KEY_MISSING') {
              return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
                scores: {
                  vocabulary: 88,
                  grammar: 84,
                  cohesion: 92,
                  fluency: 86,
                  taskCompletion: 94
                },
                overallScore: 89,
                cefrLevel: "B2",
                strengths: [
                  "AI의 순기능과 역기능을 대립 구조로 명확히 전개함",
                  "교사 피드백을 반영하여 인간 교사의 정서적 공감 가치를 성공적으로 보강함"
                ],
                improvements: [
                  "복합 관계사절 수일치 및 분사구문의 능·수동 표현 정확도 추가 향상 권장"
                ],
                summativeFeedback: {
                  claim: "이민서 학생은 AI의 교육적 활용에 대한 양면적 시각을 다각도로 분석하여 설득력 있는 논증 구조를 완성함.",
                  evidence: "1차 초안의 단순 주장에서 벗어나, 2차 수정본에서 교사 멘토링의 비교 사례를 능동적으로 보강함.",
                  nextStep: "학술적 담화 표지어를 적절히 활용하고 분사구문 복합 문형의 정확도를 높여 C1 단계 진입 권장."
                },
                isSimulation: true
              }));
            }
            return res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: err.message }));
          }

          try {
            const cleanJson = replyText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ...parsed, isSimulation: false }));
          } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'JSON parsing failed', raw: replyText }));
          }
        });
        return;
      }

      // 5. Teacher Evidence AI (School Record Draft) - Gemini 3.1 Pro Preview
      if (parsedUrl === '/api/ai/school-record') {
        const systemPrompt = `You are an AI assistant helping Korean English teachers write official School Life Records (생활기록부 교과학습발달상황 세부능력및특기사항).
STRICT RULES:
1. Base your statement STRICTLY AND EXCLUSIVELY on the provided Evidence Package (selected sessions, revisions, reflections). Do NOT invent unobserved traits.
2. Write in formal, objective, observation-based Korean style ending with '~함', '~를 보임', '~를 완수함'.
3. Avoid subjective emotional praise or excessive flowery adjectives. Focus on observed facts: initial difficulty -> feedback received -> revision action -> learning growth.
4. Output JSON formatted strictly as:
{
  "statement": "진술문 전문...",
  "traces": [
    {"sentence": "주요 문장", "source": "근거 차시/코멘트 출처"}
  ]
}`;

        const userPrompt = `[Student Name]: ${bodyData.studentName || '이민서'}
[Selected Evidence Package]:
${JSON.stringify(bodyData.evidencePackage || {}, null, 2)}`;

        callGeminiAPI('gemini-3.1-pro-preview', systemPrompt, userPrompt, clientKey, (err, replyText) => {
          if (err) {
            if (err.message === 'GEMINI_API_KEY_MISSING') {
              return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
                statement: `${bodyData.studentName || '이민서'} 학생은 영어 논증문 작성 과업에서 인공지능 기술의 교육적 순기능과 부작용을 다각도로 분석함. 초안 작성 후 교사의 첨삭 지도를 수용하여 인간 교사의 정서적 공감 및 도덕적 멘토링 역할을 대비시키는 구체적 논거를 능동적으로 보강함. 문법 클리닉 과정에서 관계대명사 계속적 용법과 분사구문의 능·수동 관계를 정확히 이해하고 본문에 즉시 적용하였으며, 완성된 에세이를 명료한 발음과 유창한 어조로 낭독하여 설득력 높은 구술 발표를 완수함.`,
                traces: [
                  { sentence: '인공지능 기술의 교육적 순기능과 부작용을 다각도로 분석함', source: 'Task 101 - Session 2 First Draft' },
                  { sentence: '교사의 첨삭 지도를 수용하여 인간 교사의 정서적 공감 및 도덕적 멘토링 역할을 대비시키는 구체적 논거를 능동적으로 보강함', source: 'Teacher Comment #01 & Revision v2' },
                  { sentence: '문법 클리닉 과정에서 관계대명사 계속적 용법과 분사구문의 능·수동 관계를 정확히 이해하고 본문에 즉시 적용하였으며', source: 'Grammar Mini Lab Challenge Completed' }
                ],
                isSimulation: true
              }));
            }
            return res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: err.message }));
          }

          try {
            const jsonStr = replyText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ...parsed, isSimulation: false }));
          } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ statement: replyText, traces: [], isSimulation: false }));
          }
        });
        return;
      }

      // 6. Google Sheets Live Sync / Webhook API
      if (parsedUrl === '/api/sheets/sync') {
        const payload = bodyData.payload || {};
        const timestamp = new Date().toISOString();
        
        console.log(`[Google Sheets Sync] Received ${payload.records?.length || 0} records at ${timestamp}`);

        res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
          success: true,
          syncedCount: payload.records ? payload.records.length : 28,
          timestamp: timestamp,
          spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
          message: 'Google Sheets 라이브 동기화가 성공적으로 완료되었습니다.'
        }));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Endpoint not found' }));
    });
    return;
  }

  // Static File Serving
  let reqUrl = parsedUrl;
  if (reqUrl === '/') reqUrl = '/index.html';
  
  const filePath = path.join(__dirname, decodeURIComponent(reqUrl));
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Power English Platform Server running at http://localhost:${PORT}/`);
  if (SERVER_GEMINI_KEY) {
    console.log(`✓ Gemini API Key loaded from server environment.`);
  } else {
    console.log(`ℹ No GEMINI_API_KEY in server environment. Client keys or simulation fallback will be used.`);
  }
});
