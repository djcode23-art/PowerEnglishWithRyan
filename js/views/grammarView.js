/**
 * Grammar Mini Lab & Micro Challenge View (Screen 2 - 100% Stitch Fidelity)
 */
import { store } from '../store.js';

export function renderGrammarView() {
  const state = store.getState();
  const lab = state.grammarLab;
  const user = state.currentUser;

  return `
    <div class="flex flex-col w-full pb-12">
      <!-- Top Metacognitive Diagnostic Banner -->
      <section class="w-full mb-space-lg">
        <div class="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm border border-outline-variant/30">
          <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
          <div class="absolute right-36 bottom-0 w-48 h-48 rounded-full bg-secondary-fixed/20 blur-2xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div class="space-y-space-xs max-w-3xl">
              <div class="flex flex-wrap items-center gap-space-xs">
                <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm font-semibold">
                  <span class="material-symbols-outlined text-[15px]">target</span>
                  맞춤 진단 처방
                </span>
                <span class="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md">
                  30215 이민서 학생
                </span>
                <span class="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold">
                  <span class="material-symbols-outlined text-[16px]">bolt</span>
                  3분 마이크로 챌린지
                </span>
              </div>
              <h2 class="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                관계대명사 계속적 용법의 수일치 & 분사구문 능동/수동 전환 정밀 교정
              </h2>
              <p class="font-body-sm text-body-sm text-on-surface-variant">
                방금 작성 중인 러닝로그 에세이 본문에서 선행사 수일치 불일치 1건이 탐지되었습니다. 2단계 집중 훈련 후 에세이 원문에 1-클릭으로 동기화됩니다.
              </p>
              <!-- Progress Bar Row -->
              <div class="pt-space-xs flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-md text-label-md">
                <div class="flex items-center gap-space-xs min-w-[220px]">
                  <span class="text-on-surface font-semibold">추천 진도</span>
                  <div class="w-32 h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: 66.6%;"></div>
                  </div>
                  <span class="font-semibold text-primary">2 / 3 완료 (66%)</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                  <span>총 예상 소요: <strong class="text-on-surface font-semibold">3분 30초</strong></span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px] text-secondary">psychology</span>
                  <span>메타인지 획득 점수: <strong class="text-secondary font-semibold">+28 XP</strong></span>
                </div>
              </div>
            </div>
            <!-- Action Back Button -->
            <div class="flex flex-col sm:flex-row lg:flex-col gap-space-xs shrink-0 self-start lg:self-center">
              <button id="btn-return-to-writing-studio" class="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all active:scale-[0.98] shadow-md cursor-pointer font-bold">
                <span class="material-symbols-outlined text-[20px]">edit_document</span>
                <span>러닝로그 글쓰기 스튜디오 복귀</span>
              </button>
              <span class="font-label-sm text-label-sm text-outline text-center">에세이 자동 임시저장 활성화 중</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-Column Split View (5 Cols vs 7 Cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-md lg:gap-space-lg items-start">
        
        <!-- LEFT PANEL (5 Cols): Skill Tree Roadmap & Error Inspection -->
        <div class="lg:col-span-5 flex flex-col gap-space-md">
          
          <!-- Skill Tree Card -->
          <div class="rounded-xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm border border-outline-variant/30">
            <div class="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/30">
              <div class="flex items-center gap-space-xs">
                <span class="material-symbols-outlined text-primary text-[22px]">account_tree</span>
                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">문법 역량 트리 (Skill Tree)</h3>
              </div>
              <span class="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                CEFR-J B1+ Track
              </span>
            </div>

            <!-- Visual Node Tree Path -->
            <div class="relative pl-6 space-y-space-md my-space-sm before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-high">
              <!-- Node 1: Completed -->
              <div class="relative flex items-start gap-space-sm">
                <div class="absolute -left-6 top-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                  <span class="material-symbols-outlined text-on-secondary text-[16px]">check</span>
                </div>
                <div class="bg-surface-container-low rounded-lg p-space-sm w-full">
                  <div class="flex items-center justify-between">
                    <span class="font-label-md text-label-md text-secondary font-bold">LEVEL 1 · 기초 통달</span>
                    <span class="font-label-sm text-label-sm text-secondary font-semibold">100% 완료</span>
                  </div>
                  <p class="font-body-sm text-body-sm text-on-surface font-medium">주어-동사 기본 수일치 & 시제 일치</p>
                  <span class="font-label-sm text-label-sm text-on-surface-variant">오류율 0건 (에세이 1~2문단 검증됨)</span>
                </div>
              </div>

              <!-- Node 2: In Progress -->
              <div class="relative flex items-start gap-space-sm">
                <div class="absolute -left-6 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md animate-pulse">
                  <span class="w-2.5 h-2.5 rounded-full bg-surface-container-lowest"></span>
                </div>
                <div class="bg-primary-fixed/30 rounded-lg p-space-sm w-full shadow-sm border border-primary/40">
                  <div class="flex items-center justify-between">
                    <span class="font-label-md text-label-md text-primary font-bold">LEVEL 2 · 실시간 챌린지</span>
                    <span class="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-primary text-on-primary font-bold">진행 중</span>
                  </div>
                  <p class="font-body-sm text-body-sm text-on-surface font-semibold">관계대명사절 수일치 & 계속적 용법</p>
                  <p class="font-label-sm text-label-sm text-on-surface-variant">현재 30215 학생의 에세이에서 오답 감지됨</p>
                </div>
              </div>

              <!-- Node 3: Up Next -->
              <div class="relative flex items-start gap-space-sm opacity-90">
                <div class="absolute -left-6 top-1 w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
                  <span class="material-symbols-outlined text-outline text-[14px]">lock_clock</span>
                </div>
                <div class="bg-surface-container-low rounded-lg p-space-sm w-full">
                  <div class="flex items-center justify-between">
                    <span class="font-label-md text-label-md text-on-surface-variant font-bold">LEVEL 3 · 다음 잠금 해제</span>
                    <span class="font-label-sm text-label-sm text-outline">대기</span>
                  </div>
                  <p class="font-body-sm text-body-sm text-on-surface font-medium">분사구문 능동/수동 축약 & 부대상황</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Real-Time Essay Error Extraction Card -->
          <div class="rounded-xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm border border-outline-variant/30">
            <div class="flex items-center gap-space-xs pb-space-xs">
              <span class="material-symbols-outlined text-error text-[22px]">find_in_page</span>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">내 에세이 실시간 오류 문장</h3>
            </div>
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-space-sm">
              Draft 1의 3번째 문단에서 추출된 구문
            </p>
            
            <div class="rounded-lg bg-error-container/40 p-space-sm text-on-surface space-y-space-xs border border-error/30">
              <div class="flex items-center gap-1 font-label-sm text-label-sm text-error font-semibold">
                <span class="material-symbols-outlined text-[16px]">priority_high</span>
                수일치 불일치 감지 (Subject-Verb Discord)
              </div>
              <p class="font-body-md text-body-md leading-relaxed font-mono text-xs">
                “...AI tools, <span class="bg-error/20 text-error font-bold px-1 rounded">which was</span> considered mere calculators in the past, now create art...”
              </p>
            </div>

            <!-- AI Metacognitive Note -->
            <div class="mt-space-sm p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm border border-outline-variant/30">
              <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm font-bold text-xs">
                <span class="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div class="space-y-0.5 text-xs">
                <h4 class="font-label-md text-label-md text-primary font-bold">AI 메타인지 튜터 코칭</h4>
                <p class="font-body-sm text-on-surface-variant leading-normal">
                  쉼표 뒤 계속적 용법의 관계대명사 <code class="font-mono text-primary font-semibold">which</code>는 복수 명사구 <strong class="text-on-surface font-semibold">‘AI tools’</strong>를 가리킵니다. 따라서 단수 동사 <code class="font-mono text-error">was</code> 대신 복수 과거동사 <strong class="text-secondary font-semibold">‘were’</strong>를 사용해야 합니다.
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT PANEL (7 Cols): Interactive Practice Lab -->
        <div class="lg:col-span-7 flex flex-col gap-space-md">
          <div class="rounded-xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm border border-outline-variant/30 space-y-6">
            <div class="flex items-center justify-between pb-space-md border-b border-outline-variant/30">
              <div class="flex items-center gap-space-xs">
                <span class="w-2.5 h-6 rounded-full bg-primary"></span>
                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">인터랙티브 클리닉 랩 (Practice Lab)</h3>
              </div>
              <div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-full text-xs">
                <span class="px-space-sm py-0.5 rounded-full bg-primary text-on-primary font-label-sm font-bold shadow-xs">Step 1: 퀵 퀴즈</span>
                <span class="px-space-sm py-0.5 rounded-full text-on-surface-variant font-label-sm">Step 2: 1-Click 동기화</span>
              </div>
            </div>

            <!-- STEP 1: Quick Fill-in-the-Blank Quiz -->
            <div class="space-y-space-md">
              <div class="flex items-center justify-between">
                <span class="font-label-lg text-label-lg text-primary font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[18px]">quiz</span>
                  Step 1 · 3초 직관 문맥 빈칸 채우기
                </span>
                <span class="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-bold flex items-center gap-1" id="quiz-status-badge">
                  <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
                  채점 준비완료
                </span>
              </div>

              <div class="p-space-md rounded-xl bg-surface-container-low space-y-space-sm border border-outline-variant/40">
                <p class="font-body-md text-body-md text-on-surface leading-relaxed text-sm">
                  “Smartphone algorithms, which 
                  <span class="inline-block px-3 py-1 mx-1 rounded-md bg-surface-container-highest text-primary font-mono font-bold min-w-[70px] text-center" id="quiz-blank-display">
                    [ ? ]
                  </span> 
                  designed to maximize user engagement, frequently alter teenage study habits.”
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-xs">
                  <button class="quiz-btn w-full py-2.5 px-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-xs font-semibold text-center transition-all border border-outline-variant/40 shadow-xs" data-correct="false">
                    A. was
                  </button>
                  <button class="quiz-btn w-full py-2.5 px-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-xs font-semibold text-center transition-all border border-outline-variant/40 shadow-xs" data-correct="true">
                    B. were
                  </button>
                  <button class="quiz-btn w-full py-2.5 px-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-xs font-semibold text-center transition-all border border-outline-variant/40 shadow-xs" data-correct="false">
                    C. is
                  </button>
                </div>

                <!-- Instant Feedback Box -->
                <div class="hidden p-space-sm rounded-lg bg-secondary-container/40 text-on-secondary-fixed flex items-start gap-space-xs border border-secondary/30" id="quiz-feedback-box">
                  <span class="material-symbols-outlined text-secondary text-[20px] shrink-0">check_circle</span>
                  <div class="text-xs">
                    <strong class="font-semibold text-secondary">정답입니다! 🎉 (+10 XP 획득)</strong>
                    <p class="text-on-surface-variant mt-0.5">
                      선행사인 <code class="font-mono text-on-surface font-semibold">Smartphone algorithms</code>(복수)와 계속적 용법 관계사절의 과거시제 수동태가 올바르게 결합하여 <code class="font-mono text-secondary font-bold">were</code>가 정확합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 2: 1-Click Sync to Essay -->
            <div class="pt-4 border-t border-outline-variant/30 space-y-3">
              <span class="font-label-lg text-label-lg text-primary font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px]">sync_saved_locally</span>
                Step 2 · 에세이 본문 1-Click 자동 교정 동기화
              </span>
              <p class="text-xs text-on-surface-variant">
                학습한 규칙을 바탕으로 에세이 원문의 <code class="text-error font-mono">which was</code>를 <code class="text-secondary font-mono">which were</code>로 즉시 동기화합니다.
              </p>
              <button id="btn-sync-grammar-to-essay" class="w-full py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold shadow-md transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[18px]">auto_fix_high</span>
                <span>교정된 문장 에세이 본문에 1-클릭 반영하기</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;
}

export function attachGrammarEvents(container) {
  container.querySelector('#btn-return-to-writing-studio')?.addEventListener('click', () => {
    store.switchTab('writing');
  });

  const feedbackBox = container.querySelector('#quiz-feedback-box');
  const blankDisplay = container.querySelector('#quiz-blank-display');

  container.querySelectorAll('.quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';
      if (isCorrect) {
        btn.className = 'quiz-btn w-full py-2.5 px-space-sm rounded-lg bg-secondary-container text-on-secondary-container font-bold text-xs border-2 border-secondary shadow-xs';
        if (blankDisplay) blankDisplay.textContent = 'were';
        if (feedbackBox) feedbackBox.classList.remove('hidden');
      } else {
        btn.className = 'quiz-btn w-full py-2.5 px-space-sm rounded-lg bg-error-container text-on-error-container font-bold text-xs border border-error shadow-xs';
      }
    });
  });

  container.querySelector('#btn-sync-grammar-to-essay')?.addEventListener('click', () => {
    alert('✅ 에세이 본문의 문법 오류가 성공적으로 교정되었습니다. 글쓰기 스튜디오로 복귀합니다.');
    store.switchTab('writing');
  });
}
