/**
 * Writing & Metacognition Reflection Studio View (Screen 1 - 100% Stitch Fidelity + Real Gemini Integration)
 */
import { store } from '../store.js';
import { aiService } from '../services/aiService.js';

export function renderEditorView() {
  const state = store.getState();
  const currentTask = state.tasks.find(t => t.id === state.selectedTaskId) || state.tasks[0];
  const currentSession = currentTask.sessions.find(s => s.id === state.selectedSessionId) || currentTask.sessions[1] || currentTask.sessions[0];
  const user = state.currentUser;

  return `
    <div class="flex flex-col w-full pb-12">
      <!-- Top Learning Log Bar & Task Management Zone -->
      <div class="w-full py-space-md">
        <!-- Breadcrumb & Session Meta Strip -->
        <div class="flex items-center justify-between gap-space-sm pb-space-sm overflow-x-auto whitespace-nowrap">
          <div class="flex items-center gap-space-xs shrink-0 whitespace-nowrap">
            <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold shrink-0 whitespace-nowrap">
              <span class="material-symbols-outlined text-[14px] shrink-0">auto_stories</span>${currentTask.title}
            </span>
            <span class="text-on-surface-variant font-label-sm text-label-sm shrink-0 whitespace-nowrap">${currentSession.title}</span>
            <span class="text-outline-variant font-label-sm text-label-sm shrink-0">•</span>
            <span class="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm font-medium shrink-0 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0"></span>${currentSession.lastSaved || '실시간 클라우드 자동 저장됨'}
            </span>
          </div>

          <div class="flex items-center gap-space-xs shrink-0 whitespace-nowrap">
            <button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary hover:bg-primary-container transition-all font-label-md text-label-md shadow-md shrink-0 whitespace-nowrap cursor-pointer border border-primary/20 leading-tight" id="btn-send-email-pdf" type="button" title="활동자료 PDF 구글 계정 발송">
              <span class="material-symbols-outlined text-[16px] shrink-0">mark_email_read</span>
              <span class="font-bold whitespace-nowrap">활동자료 PDF 구글메일 발송</span>
              <span class="px-1.5 py-0.2 rounded-full bg-surface-container-lowest text-primary text-[10px] font-bold shrink-0 whitespace-nowrap">PDF</span>
            </button>
            <div class="w-px h-5 bg-outline-variant/60 mx-0.5 shrink-0"></div>
            <button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md shadow-sm shrink-0 whitespace-nowrap cursor-pointer leading-tight" id="btn-open-teacher-archive-quick" type="button">
              <span class="material-symbols-outlined text-[16px] text-tertiary shrink-0">inventory_2</span>
              <span class="font-medium whitespace-nowrap">포트폴리오 아카이브</span>
              <span class="px-1 rounded-full bg-tertiary text-on-tertiary text-[10px] font-semibold leading-tight shrink-0 whitespace-nowrap">보관함</span>
            </button>
          </div>
        </div>

        <!-- Quick Status Badges Bento -->
        <div class="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm p-4 border border-outline-variant/30 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-space-md overflow-x-auto whitespace-nowrap">
            <div class="flex items-center gap-space-xs shrink-0">
              <span class="material-symbols-outlined text-primary text-[18px]">target</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">목표 분량:</span>
              <span class="font-label-sm text-label-sm text-on-surface font-semibold">${currentTask.targetWords}단어 에세이</span>
            </div>
            <div class="flex items-center gap-space-xs shrink-0">
              <span class="material-symbols-outlined text-secondary text-[18px]">stylus</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">입력 모드:</span>
              <span class="font-label-sm text-label-sm text-secondary font-medium">S-Pen 태블릿 / 키보드 OCR 지원</span>
            </div>
            <div class="flex items-center gap-space-xs shrink-0">
              <span class="material-symbols-outlined text-tertiary text-[18px]">psychology</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">성찰 단계:</span>
              <span class="font-label-sm text-label-sm text-tertiary font-bold" id="reflection-summary-tag">2/3 문항 확인됨</span>
            </div>
          </div>

          <!-- Multi-Session Switcher Strip -->
          <div class="flex items-center gap-1.5 overflow-x-auto">
            <span class="text-xs font-bold text-on-surface-variant mr-1">차시:</span>
            ${currentTask.sessions.map((s, idx) => `
              <button class="sess-picker-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${s.id === currentSession.id ? 'bg-primary-container text-on-primary-container font-bold shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}" data-sess-id="${s.id}">
                ${idx + 1}차시 ${s.isCandidate ? '★' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Main Content Grid: Workspace + Live AI Reflection Validation Pane -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        
        <!-- LEFT/CENTER CANVAS (8 Cols): Google Docs Style Editor & Pre-submission Reflection -->
        <div class="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
          
          <!-- Editor Container Card -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <!-- Google Docs Sticky Toolbar -->
            <div class="px-space-md py-space-xs bg-surface-container-low flex items-center justify-between gap-space-xs overflow-x-auto whitespace-nowrap border-b border-outline-variant/30">
              <div class="flex items-center gap-1 shrink-0 whitespace-nowrap">
                <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors shrink-0" title="되돌리기"><span class="material-symbols-outlined text-[18px]">undo</span></button>
                <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors shrink-0" title="다시실행"><span class="material-symbols-outlined text-[18px]">redo</span></button>
                <div class="w-px h-4 bg-outline-variant mx-1 shrink-0"></div>
                <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-highest text-primary font-bold shadow-xs shrink-0" title="굵게"><span class="material-symbols-outlined text-[18px]">format_bold</span></button>
                <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors shrink-0" title="기울임"><span class="material-symbols-outlined text-[18px]">format_italic</span></button>
                <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors shrink-0" title="형광펜 강조"><span class="material-symbols-outlined text-[18px]">format_ink_highlighter</span></button>
                <div class="w-px h-4 bg-outline-variant mx-1 shrink-0"></div>
                <button class="px-space-xs py-1 rounded-lg text-primary hover:bg-surface-container-high font-label-md text-label-md flex items-center gap-1 shrink-0 font-bold" type="button" id="btn-ask-ai-quick">
                  <span class="material-symbols-outlined text-[16px] shrink-0">psychology</span>
                  <span>AI 코치 실시간 분석</span>
                </button>
              </div>

              <div class="flex items-center gap-space-sm shrink-0 whitespace-nowrap">
                <div class="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm shrink-0 whitespace-nowrap">
                  <span class="font-bold text-primary" id="editor-word-count-val">${currentSession.wordCount || 139}</span>
                  <span class="text-on-surface-variant">/ ${currentTask.targetWords} Words</span>
                </div>
                <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold shrink-0 whitespace-nowrap">
                  <span class="material-symbols-outlined text-[14px] shrink-0">school</span>${currentSession.estimatedCefr || 'CEFR B2'}
                </span>
              </div>
            </div>

            <!-- Document Sheet Area with Inline Comments -->
            <div class="bg-surface-container-lowest font-body-lg text-body-lg text-on-surface leading-relaxed focus:outline-none p-space-md min-h-[480px]">
              <div class="relative flex flex-col xl:flex-row gap-space-lg items-start">
                
                <!-- Main Editor Text Area -->
                <div class="flex-1 w-full xl:w-[75%] pr-space-md space-y-space-md min-w-0">
                  <textarea id="live-doc-editor" class="w-full h-80 p-3 bg-transparent text-body-lg text-on-surface leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-xl resize-y border border-transparent hover:border-outline-variant/40 transition-colors custom-scrollbar" placeholder="이곳에 영어 에세이를 작성하세요...">${currentSession.content || ''}</textarea>

                  <!-- Speaking Audio Bar -->
                  <div class="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2.5">
                      <button id="btn-studio-spk" class="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center shadow-md active:scale-95 transition-all">
                        <span class="material-symbols-outlined text-[20px]" id="studio-spk-icon">mic</span>
                      </button>
                      <div>
                        <strong class="text-on-surface block font-bold">Speaking 낭독 연습 (AI 발음·유창성 코칭)</strong>
                        <span class="text-on-surface-variant text-[11px]">에세이를 소리 내어 낭독하면 실시간 WPM 및 B2 발화 분석을 제공합니다.</span>
                      </div>
                    </div>
                    <span class="font-mono text-xs px-2.5 py-1 rounded bg-surface-container-highest text-on-surface font-semibold" id="studio-spk-timer">00:00</span>
                  </div>
                </div>

                <!-- Right Inline Comments Column -->
                <div class="w-full xl:w-[25%] xl:max-w-[240px] flex flex-col gap-space-xs shrink-0 mt-2 xl:mt-0">
                  <!-- Comment Card 1: Mr. Ryan -->
                  <div class="bg-surface-container-lowest rounded-lg border-2 border-primary/60 shadow-md p-space-xs space-y-space-xs relative text-xs">
                    <div class="flex items-center justify-between gap-1">
                      <div class="flex items-center gap-1 min-w-0">
                        <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-[11px] shrink-0">R</div>
                        <div class="flex flex-col min-w-0">
                          <span class="text-[11px] text-on-surface font-bold truncate leading-tight">Mr. Ryan</span>
                          <span class="text-[10px] text-on-surface-variant leading-none">방금 전</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-0.5 shrink-0">
                        <button class="w-5 h-5 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container" title="해결됨"><span class="material-symbols-outlined text-[15px] text-secondary">check_circle</span></button>
                      </div>
                    </div>
                    <div class="pl-1.5 border-l-2 border-tertiary text-on-surface-variant text-[10px] italic truncate">“cannot replicate...”</div>
                    <p class="text-[11px] text-on-surface leading-snug pt-0.5">민서 학생, <span class="font-semibold text-primary">'emotional empathy'</span> 표현 선정이 아주 좋습니다! 1문장 더 뒷받침해볼 수 있을까요?</p>
                    <div class="pt-1 space-y-1 border-t border-outline-variant/40">
                      <div class="relative">
                        <input class="w-full px-1.5 py-1 text-[11px] rounded bg-surface-container-low text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/60 focus:border-primary" placeholder="답글 작성..." type="text" id="editor-reply-input">
                        <button class="absolute right-1 top-1 px-1.5 py-0.2 rounded bg-primary text-on-primary text-[10px] font-semibold hover:bg-primary-container" type="button" id="editor-reply-btn">답글</button>
                      </div>
                    </div>
                  </div>

                  <!-- Comment Card 2: Lingua AI -->
                  <div class="bg-surface-container-low rounded-lg border border-secondary/40 shadow-xs p-space-xs space-y-1 text-xs">
                    <div class="flex items-center justify-between gap-1">
                      <div class="flex items-center gap-1 min-w-0">
                        <span class="w-5 h-5 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-[10px] shrink-0 font-bold"><span class="material-symbols-outlined text-[12px]">smart_toy</span></span>
                        <span class="text-[11px] text-on-surface font-bold truncate">Gemini 1.5 Flash</span>
                      </div>
                      <span class="px-1 py-0.2 rounded bg-secondary-fixed/40 text-on-secondary-fixed text-[9px] font-medium shrink-0">실시간</span>
                    </div>
                    <p class="text-[10px] text-on-surface-variant leading-tight"><strong class="text-secondary font-semibold">💡 제안:</strong> 결론부 도입 시 <span class="underline font-medium text-on-surface">'On the other hand'</span> 또는 <span class="underline font-medium text-on-surface">'Conversely'</span> 배치 권장</p>
                  </div>
                </div>

              </div>
            </div>

            <!-- Bottom Sheet Vocabulary Bar -->
            <div class="px-space-lg py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/30 text-xs">
              <div class="flex items-center gap-space-xs flex-wrap">
                <span class="font-label-sm text-label-sm text-on-surface-variant">활용된 B2 고급 어휘:</span>
                <span class="px-space-xs py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-medium border border-outline-variant/30">transformative</span>
                <span class="px-space-xs py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-medium border border-outline-variant/30">double-edged</span>
                <span class="px-space-xs py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-medium border border-outline-variant/30">analytical faculties</span>
                <span class="px-space-xs py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-medium border border-outline-variant/30">succumb to</span>
              </div>
              <div class="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                <span class="material-symbols-outlined text-[16px] text-secondary">stylus_note</span>
                <span>디지털 필기 보정 ON</span>
              </div>
            </div>
          </div>

          <!-- MANDATORY PRE-SUBMISSION REFLECTION WORKSPACE -->
          <div class="bg-surface-container-lowest rounded-xl shadow-md p-space-md relative overflow-y-auto space-y-space-sm pr-space-sm border border-outline-variant/30" id="reflection-workspace">
            <!-- Header & Lock Alert Indicator -->
            <div class="space-y-space-xs">
              <div class="flex items-center justify-between gap-space-sm whitespace-nowrap overflow-x-auto">
                <div class="flex items-center gap-space-xs shrink-0 whitespace-nowrap">
                  <span class="material-symbols-outlined text-primary text-[24px] shrink-0">psychology_alt</span>
                  <h2 class="font-headline-md text-headline-md text-on-surface font-bold whitespace-nowrap leading-tight">제출 전 필수 자가 성찰 (Metacognition Log)</h2>
                </div>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold shrink-0 whitespace-nowrap leading-tight" id="reflection-badge">
                  <span class="material-symbols-outlined text-[16px] shrink-0">lock_open</span> 성찰 100% 충족 (제출 가능)
                </span>
              </div>
              
              <div class="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-xs">
                <span class="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
                <p class="font-body-sm text-body-sm text-on-surface">
                  <strong class="font-semibold text-primary">자가 성찰 원칙:</strong> Ryan 선생님의 수업 방침에 따라, 체크리스트 3개 항목과 심층 비교 성찰을 모두 충실히 작성해야 <span class="font-semibold text-primary">[선생님께 최종 제출]</span> 버튼이 활성화됩니다.
                </p>
              </div>
            </div>

            <!-- SECTION A: Checklist -->
            <div class="space-y-space-sm pt-2">
              <div class="flex items-center justify-between">
                <span class="font-label-lg text-label-lg text-on-surface font-bold">SECTION A. 구조 및 어휘 점검 체크리스트</span>
                <span class="font-label-sm text-label-sm text-on-surface-variant">3 / 3 문항 체크 완료</span>
              </div>

              <div class="space-y-space-xs">
                <label class="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                  <input checked class="mt-1 w-4 h-4 rounded text-primary" type="checkbox" id="chk-refl-1">
                  <div class="flex flex-col">
                    <span class="font-body-md text-body-md text-on-surface font-medium">1. 주제문(Topic Sentence)과 뒷받침 근거가 명확히 연결되었는가?</span>
                    <span class="font-label-sm text-label-sm text-secondary font-medium">✓ 문단 1의 AI 튜터 사례와 문단 2의 비판적 사고 저하 논거가 대조적으로 서술됨</span>
                  </div>
                </label>

                <label class="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                  <input checked class="mt-1 w-4 h-4 rounded text-primary" type="checkbox" id="chk-refl-2">
                  <div class="flex flex-col">
                    <span class="font-body-md text-body-md text-on-surface font-medium">2. 구어체 단어를 학술 어휘('diminishing reasoning', 'succumb to')로 적절히 대체하였는가?</span>
                    <span class="font-label-sm text-label-sm text-secondary font-medium">✓ 공식 학술 표현으로 치환 완료</span>
                  </div>
                </label>

                <label class="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                  <input checked class="mt-1 w-4 h-4 rounded text-primary" type="checkbox" id="chk-refl-3">
                  <div class="flex flex-col">
                    <span class="font-body-md text-body-md text-on-surface font-medium">3. 반론(Counter-argument)에 대한 나의 논박이 논리적인가?</span>
                    <span class="font-label-sm text-label-sm text-secondary font-medium">✓ 인간 교사의 정서적 유대(Human Empathy)로 반박 완료</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- SECTION B: Before & After Thinking -->
            <div class="space-y-space-md pt-2">
              <div class="flex items-center justify-between">
                <span class="font-label-lg text-label-lg text-on-surface font-bold">SECTION B. 이전 생각 vs 이후 생각 비교 성찰 (Before & After Thinking)</span>
                <span class="font-label-sm text-label-sm text-secondary font-semibold">사고의 심화 기록됨</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div class="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-space-xs">
                  <div>
                    <div class="flex items-center gap-space-xs pb-space-xs">
                      <span class="material-symbols-outlined text-outline text-[18px]">history</span>
                      <span class="font-label-md text-label-md text-on-surface-variant font-bold uppercase">작성 전 나의 생각 (Initial Thought)</span>
                    </div>
                    <p class="font-body-sm text-body-sm text-on-surface-variant italic">
                      "AI는 선생님의 수업 준비나 번역만 도와주는 단순한 검색 도구일 것이라 생각했다."
                    </p>
                  </div>
                  <span class="font-label-sm text-label-sm text-outline-variant pt-space-xs">초기 진술 기록됨 (오전 10:15)</span>
                </div>

                <div class="p-space-md rounded-xl bg-surface-container-high flex flex-col justify-between space-y-space-xs shadow-xs">
                  <div>
                    <div class="flex items-center gap-space-xs pb-space-xs">
                      <span class="material-symbols-outlined text-primary text-[18px]">trending_up</span>
                      <span class="font-label-md text-label-md text-primary font-bold uppercase">작성 및 피드백 후 나의 생각 (Evolved Thinking)</span>
                    </div>
                    <p class="font-body-sm text-body-sm text-on-surface font-medium">
                      "개별화된 피드백을 주지만 교사와 학생 간의 정서적 교감(Human Empathy)은 결코 대체할 수 없다는 양면성을 깨달았다."
                    </p>
                  </div>
                  <span class="font-label-sm text-label-sm text-secondary font-semibold pt-space-xs">✓ 고차원적 인식 확장 감지됨</span>
                </div>
              </div>

              <!-- Key Learning Takeaway -->
              <div class="space-y-space-xs pt-1">
                <div class="flex items-center justify-between">
                  <label class="font-label-md text-label-md text-on-surface font-bold" for="takeaway-input">
                    배운 점 / 다음 글쓰기 적용점 (Key Learning Takeaway)
                  </label>
                  <span class="font-label-sm text-label-sm text-on-surface-variant" id="char-counter">64 / 150자</span>
                </div>
                <textarea class="w-full p-space-md rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors shadow-sm border border-outline-variant/40" id="takeaway-input" rows="2">논증 에세이에서 반론을 먼저 인정하고 재반박할 때 설득력이 훨씬 높아짐을 배웠다.</textarea>
              </div>

              <!-- Final Submit Button -->
              <div class="pt-4 border-t border-outline-variant/30 flex items-center justify-between flex-wrap gap-3">
                <span class="text-xs text-on-surface-variant">제출 즉시 교사 관리 콘솔 및 Google Sheets 아카이브로 실시간 전송됩니다.</span>
                <button id="btn-final-submit" class="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all font-headline-sm text-headline-sm font-bold flex items-center gap-space-xs shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                  <span class="material-symbols-outlined text-[20px]">send</span>
                  <span>선생님께 최종 제출하기</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT SIDEBAR (4 Cols): AI Reflection Quality Validator & Teacher Rubric -->
        <div class="lg:col-span-4 flex flex-col gap-space-lg min-w-0">
          
          <!-- AI REFLECTION QUALITY VALIDATOR CARD -->
          <div class="bg-surface-container-lowest rounded-xl shadow-md p-space-md flex flex-col gap-space-sm border border-outline-variant/30">
            <div class="flex items-center justify-between pb-space-xs border-b border-outline-variant/30 flex-wrap gap-2">
              <div class="flex items-center gap-space-xs">
                <span class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs shrink-0">
                  <span class="material-symbols-outlined text-[18px]">neurology</span>
                </span>
                <div>
                  <div class="flex items-center gap-1.5">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">AI 성찰 코치 실시간 분석</h3>
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed font-label-sm text-[10px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>Gemini 연동</span>
                  </div>
                  <span class="font-label-sm text-label-sm text-on-surface-variant">Current Task AI Socratic Coach</span>
                </div>
              </div>
              <span class="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">유의미한 성찰 달성</span>
            </div>

            <!-- Rubric Details -->
            <details class="bg-surface-container-low rounded-xl p-space-xs space-y-space-xs cursor-pointer group" open>
              <summary class="flex items-center justify-between px-space-xs py-1 text-on-surface select-none list-none">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="material-symbols-outlined text-primary text-[18px]">insights</span>
                  <span class="font-label-md text-label-md font-bold text-on-surface truncate">성찰 품질 & 채점 루브릭 현황</span>
                  <span class="px-1.5 py-0.2 rounded bg-secondary-fixed/30 text-secondary text-[10px] font-semibold">92점 수준</span>
                </div>
                <span class="material-symbols-outlined text-[18px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div class="px-space-xs pt-1 pb-space-xs space-y-space-xs">
                <div class="p-space-xs rounded-lg bg-secondary-fixed/30 space-y-0.5">
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-secondary text-[16px]">verified</span>
                    <h4 class="font-label-md text-label-md text-on-secondary-fixed font-bold">깊이 있는 메타인지 성찰 감지됨!</h4>
                  </div>
                  <p class="font-body-sm text-[11px] text-on-surface leading-tight">'반론 인정 후 재반박' 담화 전략(Discourse Strategy)이 우수하게 명시되었습니다.</p>
                </div>
                <div class="space-y-1 font-label-sm text-[11px]">
                  <div>
                    <div class="flex justify-between text-on-surface-variant mb-0.5">
                      <span>사고의 변화 (Initial vs Evolved)</span>
                      <span class="font-semibold text-secondary">100% (탁월)</span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-surface-container"><div class="h-1.5 rounded-full bg-secondary w-full"></div></div>
                  </div>
                  <div>
                    <div class="flex justify-between text-on-surface-variant mb-0.5">
                      <span>언어적 개선 구체성 (Vocabulary)</span>
                      <span class="font-semibold text-primary">85% (우수)</span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-surface-container"><div class="h-1.5 rounded-full bg-primary w-[85%]"></div></div>
                  </div>
                </div>
              </div>
            </details>

            <!-- Interactive Chat Stream -->
            <div class="flex flex-col border border-outline-variant/40 rounded-xl bg-surface-container-lowest overflow-hidden shadow-xs">
              <div class="px-space-sm py-1.5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between text-xs">
                <div class="flex items-center gap-1 text-on-surface-variant font-medium">
                  <span class="material-symbols-outlined text-[15px] text-primary">forum</span>
                  <span>실시간 Gemini 코칭 대화</span>
                </div>
              </div>
              
              <div class="p-space-sm space-y-space-sm overflow-y-auto max-h-[220px] text-xs leading-relaxed" id="editor-chat-feed">
                <!-- AI Coach Initial Message -->
                <div class="flex items-start gap-1.5">
                  <div class="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px] shrink-0">
                    <span class="material-symbols-outlined text-[14px]">smart_toy</span>
                  </div>
                  <div class="p-space-xs rounded-xl rounded-tl-none bg-surface-container-low text-on-surface border border-outline-variant/30 shadow-xs">
                    민서 학생, 2문단의 <span class="font-semibold text-primary">'cannot replicate genuine emotional empathy'</span> 표현이 아주 설득력 있어요! 이 문장을 뒷받침할 구체적 사례를 1문장 더 보강해볼까요?
                  </div>
                </div>
              </div>

              <!-- Quick Questions Chips -->
              <div class="px-2 py-1 bg-surface-container-low/60 border-t border-outline-variant/30 flex gap-1 overflow-x-auto text-[10px]">
                <button class="quick-chip px-2 py-0.5 rounded-full bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors shrink-0" data-q="내 주장의 근거가 충분해?">💡 근거 충분성 점검</button>
                <button class="quick-chip px-2 py-0.5 rounded-full bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors shrink-0" data-q="문장 연결이 자연스러워?">✍️ 문장 연결성</button>
                <button class="quick-chip px-2 py-0.5 rounded-full bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors shrink-0" data-q="B2 고급 어휘를 추천해줘">❓ B2 어휘 추천</button>
              </div>

              <!-- Quick Chat Input -->
              <div class="p-2 border-t border-outline-variant/30 flex gap-1.5 bg-surface-container-low">
                <input type="text" id="editor-chat-input" placeholder="AI 코치에게 질문 남기기..." class="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-surface-container-lowest border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface" />
                <button id="btn-editor-chat-send" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container">질문</button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  `;
}

export function attachEditorEvents(container) {
  // Session switching
  container.querySelectorAll('.sess-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sessId = btn.getAttribute('data-sess-id');
      store.selectSession(sessId);
    });
  });

  // Editor Input
  const textarea = container.querySelector('#live-doc-editor');
  textarea?.addEventListener('input', (e) => {
    store.updateCurrentSessionContent(e.target.value);
    const countEl = container.querySelector('#editor-word-count-val');
    const words = e.target.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (countEl) countEl.textContent = words;
  });

  // Reply Button
  container.querySelector('#editor-reply-btn')?.addEventListener('click', () => {
    const input = container.querySelector('#editor-reply-input');
    if (input && input.value.trim()) {
      alert(`💬 선생님께 답글이 전달되었습니다: "${input.value.trim()}"`);
      input.value = '';
    }
  });

  // Final Submit
  container.querySelector('#btn-final-submit')?.addEventListener('click', () => {
    alert('🎉 Mr. Ryan 선생님께 최종 에세이와 성찰 일지가 성공적으로 제출되었습니다!');
  });

  // Quick Archive
  container.querySelector('#btn-open-teacher-archive-quick')?.addEventListener('click', () => {
    store.switchTab('sheets');
  });

  // Send PDF Email
  container.querySelector('#btn-send-email-pdf')?.addEventListener('click', () => {
    store.switchTab('report');
  });

  // Real Gemini AI Chat Call
  const chatInput = container.querySelector('#editor-chat-input');
  const chatSend = container.querySelector('#btn-editor-chat-send');
  const feed = container.querySelector('#editor-chat-feed');

  const sendAIChatPrompt = async (promptText) => {
    const q = promptText || chatInput?.value.trim();
    if (!q) return;

    if (feed) {
      feed.innerHTML += `
        <div class="flex items-start gap-1.5 justify-end">
          <div class="p-space-xs rounded-xl rounded-tr-none bg-primary text-on-primary text-xs shadow-xs max-w-[85%]">
            ${q}
          </div>
        </div>
        <div class="flex items-start gap-1.5 ai-loading-indicator">
          <div class="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px] shrink-0">
            <span class="material-symbols-outlined text-[14px] animate-spin">sync</span>
          </div>
          <div class="p-space-xs rounded-xl rounded-tl-none bg-surface-container-low text-on-surface-variant border border-outline-variant/30 text-xs italic">
            Gemini AI 코치가 학생의 에세이 문맥을 분석 중입니다...
          </div>
        </div>
      `;
      feed.scrollTop = feed.scrollHeight;
    }

    if (chatInput) chatInput.value = '';

    const currentContent = textarea?.value || '';
    const res = await aiService.askCoach(q, currentContent);

    // Remove loading indicator
    const loadingEl = feed?.querySelector('.ai-loading-indicator');
    if (loadingEl) loadingEl.remove();

    if (feed) {
      feed.innerHTML += `
        <div class="flex items-start gap-1.5">
          <div class="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px] shrink-0">
            <span class="material-symbols-outlined text-[14px]">smart_toy</span>
          </div>
          <div class="p-space-xs rounded-xl rounded-tl-none bg-surface-container-low text-on-surface border border-outline-variant/30 text-xs shadow-xs max-w-[88%] leading-relaxed">
            ${res.reply}
          </div>
        </div>
      `;
      feed.scrollTop = feed.scrollHeight;
    }
  };

  chatSend?.addEventListener('click', () => sendAIChatPrompt());
  chatInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendAIChatPrompt(); });

  container.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      sendAIChatPrompt(chip.getAttribute('data-q'));
    });
  });

  container.querySelector('#btn-ask-ai-quick')?.addEventListener('click', () => {
    sendAIChatPrompt('현재 작성 중인 본문의 문맥과 논증 구조에 대해 피드백을 부탁해.');
  });
}
