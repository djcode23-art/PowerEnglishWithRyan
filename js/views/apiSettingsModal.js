/**
 * API & External Services Integration Modal View
 * Allows configuring and live-testing Google Gemini API, Google Sheets Webhook, Vision OCR, and STT.
 */
import { aiService } from '../services/aiService.js';

export function renderApiSettingsModal() {
  const currentKey = aiService.getApiKey();
  const sheetsUrl = aiService.getSheetsWebhookUrl();
  const isKeyPresent = Boolean(currentKey);

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-inverse-surface/60 backdrop-blur-md animate-in fade-in duration-200">
      <div class="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Modal Header -->
        <div class="px-6 py-5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span class="material-symbols-outlined text-[24px]">hub</span>
            </div>
            <div>
              <h2 class="font-headline-sm font-bold text-on-surface">API & 외부 서비스 연동 설정</h2>
              <p class="font-body-xs text-on-surface-variant text-xs">Google Gemini AI, Google Sheets, Cloud Vision & STT 실시간 연동</p>
            </div>
          </div>
          <button id="btn-close-api-modal" class="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 overflow-y-auto space-y-6">
          
          <!-- 1. Google Gemini API Key Section -->
          <div class="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[22px]">smart_toy</span>
                <span class="font-title-md font-bold text-on-surface">Google Gemini API 연동</span>
              </div>
              <span id="gemini-status-badge" class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${isKeyPresent ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'}">
                ${isKeyPresent ? '● API 키 설정됨 (실시간 연동 가능)' : '○ 시뮬레이션 모드 활성화'}
              </span>
            </div>

            <p class="text-xs text-on-surface-variant leading-relaxed">
              Google AI Studio (<a href="https://aistudio.google.com/" target="_blank" class="text-primary underline font-medium">aistudio.google.com</a>)에서 발급받은 API 키를 입력하면 <strong>Gemini 1.5 Flash</strong>(소크라테스 튜터, 문법 클리닉, 루브릭 분석) 및 <strong>Gemini 1.5 Pro</strong>(생기부 초안 생성)를 실시간으로 직접 호출합니다.
            </p>

            <div class="space-y-1.5">
              <label class="font-label-sm font-semibold text-on-surface">Gemini API Key</label>
              <div class="relative flex items-center">
                <input type="password" id="input-gemini-api-key" value="${currentKey}" placeholder="AIzaSy..." class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:outline-none focus:border-primary font-mono text-xs text-on-surface pr-20" />
                <button type="button" id="btn-toggle-key-visibility" class="absolute right-2 px-2.5 py-1 text-xs text-on-surface-variant hover:text-on-surface font-medium">
                  보기
                </button>
              </div>
              <p class="text-[11px] text-outline">※ 입력된 키는 브라우저 로컬 저장소(localStorage)에 안전하게 보관되며 서버 외부로 무단 유출되지 않습니다.</p>
            </div>

            <!-- Action buttons for Gemini -->
            <div class="flex items-center gap-2 pt-1">
              <button id="btn-test-gemini-connection" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs">
                <span class="material-symbols-outlined text-[16px]">sensors</span>
                <span>연결 테스트 (Ping Test)</span>
              </button>
              <button id="btn-clear-gemini-key" class="px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant text-xs font-semibold transition-all">
                키 초기화
              </button>
            </div>

            <!-- Test Result Banner -->
            <div id="gemini-test-result" class="hidden rounded-lg p-3 text-xs flex items-center gap-2"></div>
          </div>

          <!-- 2. Google Sheets Live Sync Section -->
          <div class="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary text-[22px]">table_chart</span>
                <span class="font-title-md font-bold text-on-surface">Google Sheets 라이브 동기화</span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
                ● 단방향 아카이브 활성화
              </span>
            </div>

            <p class="text-xs text-on-surface-variant leading-relaxed">
              학생들의 차시별 에세이, Before/After 성찰, 문법 클리닉 퀴즈 이력, 교사 첨삭 코멘트가 Google Sheets 4개 탭(<code>Summary</code>, <code>Tasks</code>, <code>Reflections</code>, <code>SchoolRecords</code>)으로 실시간 자동 전송됩니다.
            </p>

            <div class="space-y-1.5">
              <label class="font-label-sm font-semibold text-on-surface">Google Apps Script Webhook / Spreadsheet URL (선택사항)</label>
              <input type="text" id="input-sheets-webhook-url" value="${sheetsUrl}" placeholder="https://script.google.com/macros/s/.../exec" class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:outline-none focus:border-secondary font-mono text-xs text-on-surface" />
              <p class="text-[11px] text-outline">※ 기본 내장된 Google Sheets 아카이브 스키마를 통해 즉시 뷰어에서 확인 및 CSV/스프레드시트 내보내기가 지원됩니다.</p>
            </div>

            <div class="flex items-center gap-2">
              <button id="btn-test-sheets-sync" class="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs">
                <span class="material-symbols-outlined text-[16px]">sync</span>
                <span>스프레드시트 동기화 테스트</span>
              </button>
            </div>
            <div id="sheets-test-result" class="hidden rounded-lg p-3 text-xs flex items-center gap-2"></div>
          </div>

          <!-- 3. Multimodal OCR & STT Status -->
          <div class="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 space-y-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-tertiary text-[22px]">record_voice_over</span>
              <span class="font-title-md font-bold text-on-surface">음성(STT) & 손글씨(OCR) 멀티모달 상태</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-2.5">
                <span class="material-symbols-outlined text-secondary text-[20px]">mic</span>
                <div>
                  <div class="font-semibold text-on-surface">Web Speech STT API</div>
                  <div class="text-secondary font-medium">● 브라우저 네이티브 지원 (정상)</div>
                </div>
              </div>
              <div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-2.5">
                <span class="material-symbols-outlined text-primary text-[20px]">document_scanner</span>
                <div>
                  <div class="font-semibold text-on-surface">Gemini Multimodal OCR</div>
                  <div class="text-primary font-medium">● 이미지 텍스트 추출 준비됨</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
          <span class="text-xs text-on-surface-variant font-medium">Power English V2.0 Integration System</span>
          <div class="flex items-center gap-2">
            <button id="btn-save-api-settings" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-xs font-bold transition-all shadow-md active:scale-95">
              설정 저장 및 적용
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function attachApiSettingsModalEvents(container, onSaveCallback) {
  const closeBtn = container.querySelector('#btn-close-api-modal');
  const toggleKeyBtn = container.querySelector('#btn-toggle-key-visibility');
  const keyInput = container.querySelector('#input-gemini-api-key');
  const sheetsInput = container.querySelector('#input-sheets-webhook-url');
  const testGeminiBtn = container.querySelector('#btn-test-gemini-connection');
  const clearKeyBtn = container.querySelector('#btn-clear-gemini-key');
  const testSheetsBtn = container.querySelector('#btn-test-sheets-sync');
  const saveBtn = container.querySelector('#btn-save-api-settings');

  const geminiResultBox = container.querySelector('#gemini-test-result');
  const sheetsResultBox = container.querySelector('#sheets-test-result');
  const statusBadge = container.querySelector('#gemini-status-badge');

  const closeModal = () => {
    container.innerHTML = '';
  };

  closeBtn?.addEventListener('click', closeModal);

  // Toggle Password Visibility
  toggleKeyBtn?.addEventListener('click', () => {
    if (keyInput.type === 'password') {
      keyInput.type = 'text';
      toggleKeyBtn.textContent = '숨기기';
    } else {
      keyInput.type = 'password';
      toggleKeyBtn.textContent = '보기';
    }
  });

  // Clear Key
  clearKeyBtn?.addEventListener('click', () => {
    keyInput.value = '';
    aiService.setApiKey('');
    statusBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed';
    statusBadge.textContent = '○ 시뮬레이션 모드 활성화';
    geminiResultBox.className = 'rounded-lg p-3 text-xs flex items-center gap-2 bg-surface-container-highest text-on-surface';
    geminiResultBox.innerHTML = '<span class="material-symbols-outlined text-[16px]">info</span> API 키가 제거되었습니다. 시뮬레이션 모드로 동작합니다.';
    geminiResultBox.classList.remove('hidden');
  });

  // Test Gemini Connection
  testGeminiBtn?.addEventListener('click', async () => {
    const keyToTest = keyInput.value.trim();
    testGeminiBtn.disabled = true;
    testGeminiBtn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span> <span>연결 확인 중...</span>`;

    const res = await aiService.testApiKey(keyToTest);
    testGeminiBtn.disabled = false;
    testGeminiBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">sensors</span> <span>연결 테스트 (Ping Test)</span>`;

    geminiResultBox.classList.remove('hidden');
    if (res.valid) {
      geminiResultBox.className = 'rounded-lg p-3 text-xs flex items-center gap-2 bg-secondary-container text-on-secondary-container';
      geminiResultBox.innerHTML = `<span class="material-symbols-outlined text-[16px] text-secondary">check_circle</span> <strong>${res.message}</strong> (정상 응답)`;
      statusBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container';
      statusBadge.textContent = '● Gemini 1.5 Flash/Pro 실시간 활성화';
    } else {
      geminiResultBox.className = 'rounded-lg p-3 text-xs flex items-center gap-2 bg-error-container text-on-error-container';
      geminiResultBox.innerHTML = `<span class="material-symbols-outlined text-[16px] text-error">error</span> ${res.message}`;
    }
  });

  // Test Sheets Sync
  testSheetsBtn?.addEventListener('click', async () => {
    testSheetsBtn.disabled = true;
    testSheetsBtn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span> <span>동기화 중...</span>`;

    try {
      const res = await aiService.syncToSheets({ records: [1, 2, 3] });
      testSheetsBtn.disabled = false;
      testSheetsBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">sync</span> <span>스프레드시트 동기화 테스트</span>`;

      sheetsResultBox.classList.remove('hidden');
      sheetsResultBox.className = 'rounded-lg p-3 text-xs flex items-center gap-2 bg-secondary-container text-on-secondary-container';
      sheetsResultBox.innerHTML = `<span class="material-symbols-outlined text-[16px] text-secondary">check_circle</span> <strong>${res.message}</strong> (${res.timestamp.slice(11, 19)})`;
    } catch (e) {
      testSheetsBtn.disabled = false;
      testSheetsBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">sync</span> <span>스프레드시트 동기화 테스트</span>`;
      sheetsResultBox.classList.remove('hidden');
      sheetsResultBox.className = 'rounded-lg p-3 text-xs flex items-center gap-2 bg-error-container text-on-error-container';
      sheetsResultBox.innerHTML = `<span class="material-symbols-outlined text-[16px] text-error">error</span> 동기화 실패: ${e.message}`;
    }
  });

  // Save Settings
  saveBtn?.addEventListener('click', () => {
    const key = keyInput.value.trim();
    const sheetsUrl = sheetsInput.value.trim();

    aiService.setApiKey(key);
    aiService.setSheetsWebhookUrl(sheetsUrl);

    closeModal();
    if (typeof onSaveCallback === 'function') {
      onSaveCallback();
    }
  });
}
