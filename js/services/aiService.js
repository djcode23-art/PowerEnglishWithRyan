/**
 * Client-Side AI Service for Gemini API calls & Integrations
 */

const API_KEY_STORAGE = 'lingua_gemini_api_key';
const SHEETS_WEBHOOK_STORAGE = 'lingua_sheets_webhook_url';

export const aiService = {
  getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  },

  setApiKey(key) {
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  },

  hasApiKey() {
    return !!this.getApiKey();
  },

  getSheetsWebhookUrl() {
    return localStorage.getItem(SHEETS_WEBHOOK_STORAGE) || '';
  },

  setSheetsWebhookUrl(url) {
    if (url) {
      localStorage.setItem(SHEETS_WEBHOOK_STORAGE, url.trim());
    } else {
      localStorage.removeItem(SHEETS_WEBHOOK_STORAGE);
    }
  },

  // 0. Test Gemini API Key Connectivity
  async testApiKey(keyToTest) {
    const key = keyToTest !== undefined ? keyToTest : this.getApiKey();
    try {
      const res = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': key
        },
        body: JSON.stringify({ apiKey: key })
      });
      return await res.json();
    } catch (e) {
      return { valid: false, message: `네트워크 오류: ${e.message}` };
    }
  },

  // 1. Current Task AI Coach (Writing / Speaking Socratic Coach)
  async askCoach(prompt, essayContent) {
    const apiKey = this.getApiKey();
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey
        },
        body: JSON.stringify({ prompt, essayContent, apiKey })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI 응답 생성 실패');
      }
      return data;
    } catch (e) {
      console.error('AI Coach Error:', e);
      return {
        reply: `💡 [AI Writing Coach]: 연결 중 오류가 발생했습니다 (${e.message}). 잠시 후 다시 시도해 주세요.`,
        isError: true
      };
    }
  },

  // 2. Grammar Mini Lab: Dynamic Quiz & Clinic Generator
  async generateGrammarQuiz(concept, sentence) {
    const apiKey = this.getApiKey();
    try {
      const res = await fetch('/api/ai/grammar-lab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey
        },
        body: JSON.stringify({ concept, sentence, apiKey })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '문법 클리닉 퀴즈 생성 실패');
      return data;
    } catch (e) {
      console.error('Grammar Lab AI Error:', e);
      throw e;
    }
  },

  // 3. Summative Rubric Evaluation (5 Core Competencies & Claim-Evidence-NextStep)
  async evaluateRubric(studentName, essayContent, processLogs) {
    const apiKey = this.getApiKey();
    try {
      const res = await fetch('/api/ai/summative-rubric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey
        },
        body: JSON.stringify({ studentName, essayContent, processLogs, apiKey })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '루브릭 역량 평가 실패');
      return data;
    } catch (e) {
      console.error('Rubric AI Error:', e);
      throw e;
    }
  },

  // 4. Teacher Evidence AI: School Life Record Draft Generator
  async generateSchoolRecord(studentName, evidencePackage) {
    const apiKey = this.getApiKey();
    try {
      const res = await fetch('/api/ai/school-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey
        },
        body: JSON.stringify({ studentName, evidencePackage, apiKey })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '생활기록부 초안 생성 실패');
      }
      return data;
    } catch (e) {
      console.error('School Record AI Error:', e);
      throw e;
    }
  },

  // 5. Google Sheets Live Sync
  async syncToSheets(payload) {
    try {
      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload })
      });
      return await res.json();
    } catch (e) {
      console.error('Sheets Sync Error:', e);
      throw e;
    }
  }
};
