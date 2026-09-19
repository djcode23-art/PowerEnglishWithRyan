/**
 * 5-Core Competency & Longitudinal Portfolio Report View (Screen 6)
 * High Stitch Fidelity + Claim-Evidence-NextStep Summative Feedback
 */
import { store } from '../store.js';

export function renderReportView() {
  const state = store.getState();
  const stats = state.competencyStats;
  const user = state.currentUser;
  const summative = stats.summativeFeedback;

  // Radar points calculation
  const angles = [-90, -18, 54, 126, 198].map(deg => (deg * Math.PI) / 180);
  const values = [
    stats.vocabulary / 100,
    stats.grammar / 100,
    stats.cohesion / 100,
    stats.fluency / 100,
    stats.taskCompletion / 100
  ];

  const points = values.map((val, i) => {
    const r = 150 * val;
    const x = Math.round(200 + r * Math.cos(angles[i]));
    const y = Math.round(200 + r * Math.sin(angles[i]));
    return `${x},${y}`;
  }).join(' ');

  return `
    <div class="flex flex-col w-full pb-12 space-y-6">
      
      <!-- Top Student Profile & Google Workspace Header -->
      <section class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
          <div class="relative shrink-0">
            <div class="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md">
              <span class="material-symbols-outlined text-[36px]">school</span>
            </div>
            <span class="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-on-secondary text-[12px] shadow-sm">
              <span class="material-symbols-outlined text-[14px]">check</span>
            </span>
          </div>

          <div class="flex flex-col min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-semibold">2025학년도 1학기</span>
              <span class="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-semibold">${user.cefr} 진행</span>
              <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm">성찰 포트폴리오 4회 완결</span>
            </div>
            <div class="flex flex-wrap items-baseline gap-2">
              <h1 class="font-headline-lg font-bold text-on-surface tracking-tight">${user.name}</h1>
              <span class="font-body-md text-on-surface-variant">${user.gradeClass} • ${user.school}</span>
            </div>
            <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant">
              <span class="material-symbols-outlined text-primary text-[16px]">alternate_email</span>
              <span class="font-medium text-primary font-mono">${user.email}</span>
              <span class="text-outline-variant">•</span>
              <span class="text-secondary font-semibold">Google Workspace for Education 연동됨</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button id="btn-re-evaluate-rubric" class="px-4 py-3 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-md font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95" title="Gemini 1.5 Flash를 통해 현재 에세이 5대 역량 실시간 재평가">
            <span class="material-symbols-outlined text-[18px]">psychology</span>
            <span>AI 실시간 루브릭 재평가</span>
          </button>
          <button id="btn-trigger-email" class="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95">
            <span class="material-symbols-outlined text-[20px]">outgoing_mail</span>
            <span>활동자료 PDF 구글메일 발송</span>
          </button>
          <button id="btn-download-pdf" class="px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md font-semibold transition-all flex items-center gap-1.5 shadow-xs">
            <span class="material-symbols-outlined text-[18px] text-primary">picture_as_pdf</span>
            <span>전과정 통합 PDF</span>
          </button>
        </div>
      </section>

      <!-- Section 2: 5-Core Competency Radar & Progress Bars (2-Cols) -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Radar Pentagon Card (7 Cols) -->
        <div class="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span class="font-label-sm uppercase tracking-wider text-primary font-bold">5-Core Competency Radar</span>
                </div>
                <h2 class="font-headline-md font-bold text-on-surface">언어사용 역량 5대 구성요소 정밀 분석</h2>
              </div>
              <div class="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md font-bold shadow-xs">
                <span class="material-symbols-outlined text-[16px]">trending_up</span>
                <span>${stats.trend}</span>
              </div>
            </div>
            <p class="font-body-sm text-xs text-on-surface-variant mb-4">
              CEFR-J 학술 작문 루브릭 및 실시간 AI 자가성찰 지표 기반 5대 핵심 지표 정밀 측정 결과
            </p>
          </div>

          <div class="relative w-full flex flex-col items-center justify-center py-2">
            <div class="w-full max-w-[380px] aspect-square relative">
              <svg class="w-full h-full overflow-visible" viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="radarFill" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stop-color="#004ac6" stop-opacity="0.38"></stop>
                    <stop offset="100%" stop-color="#006c49" stop-opacity="0.22"></stop>
                  </linearGradient>
                </defs>

                <!-- Grid Pentagons -->
                <polygon points="200,50 342,153 288,322 112,322 58,153" fill="none" stroke="#dae2fd" stroke-width="1.2" stroke-dasharray="3 3"></polygon>
                <polygon points="200,80 314,162 270,298 130,298 86,162" fill="none" stroke="#eaedff" stroke-width="1.2"></polygon>
                <polygon points="200,110 286,172 253,273 147,273 114,172" fill="none" stroke="#dae2fd" stroke-width="1" stroke-dasharray="2 2"></polygon>
                <polygon points="200,140 257,181 235,249 165,249 143,181" fill="none" stroke="#eaedff" stroke-width="1"></polygon>

                <!-- Axis Lines -->
                <line x1="200" y1="200" x2="200" y2="50" stroke="#c3c6d7" stroke-width="1"></line>
                <line x1="200" y1="200" x2="342" y2="153" stroke="#c3c6d7" stroke-width="1"></line>
                <line x1="200" y1="200" x2="288" y2="322" stroke="#c3c6d7" stroke-width="1"></line>
                <line x1="200" y1="200" x2="112" y2="322" stroke="#c3c6d7" stroke-width="1"></line>
                <line x1="200" y1="200" x2="58" y2="153" stroke="#c3c6d7" stroke-width="1"></line>

                <!-- Score Polygon -->
                <polygon points="${points}" fill="url(#radarFill)" stroke="#004ac6" stroke-width="3" class="radar-polygon"></polygon>

                <!-- Labels -->
                <text x="200" y="32" text-anchor="middle" fill="#004ac6" font-size="12" font-weight="700">어휘 구사력 (${stats.vocabulary}점)</text>
                <text x="360" y="155" text-anchor="start" fill="#004ac6" font-size="12" font-weight="700">문법 정확도 (${stats.grammar}점)</text>
                <text x="300" y="345" text-anchor="middle" fill="#004ac6" font-size="12" font-weight="700">텍스트 응집성 (${stats.cohesion}점)</text>
                <text x="100" y="345" text-anchor="middle" fill="#004ac6" font-size="12" font-weight="700">발화 유창성 (${stats.fluency}점)</text>
                <text x="40" y="155" text-anchor="end" fill="#004ac6" font-size="12" font-weight="700">과업 완성도 (${stats.taskCompletion}점)</text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Metric Breakdown & Overall Index (5 Cols) -->
        <div class="lg:col-span-5 flex flex-col gap-4">
          <div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-4">
            <h3 class="font-headline-sm font-bold text-on-surface">영역별 세부 지표</h3>

            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-on-surface">어휘 구사력 (B2 학술 어휘 활용)</span>
                  <span class="text-primary">${stats.vocabulary} / 100</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full" style="width: ${stats.vocabulary}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-on-surface">문법 정확도 (구문 복합성)</span>
                  <span class="text-primary">${stats.grammar} / 100</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full" style="width: ${stats.grammar}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-on-surface">텍스트 응집성 & 전환 어구</span>
                  <span class="text-secondary">${stats.cohesion} / 100</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-2">
                  <div class="bg-secondary h-2 rounded-full" style="width: ${stats.cohesion}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-on-surface">발화 유창성 & 발음 명료도</span>
                  <span class="text-primary">${stats.fluency} / 100</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full" style="width: ${stats.fluency}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-on-surface">자가 성찰 & 과업 완성도</span>
                  <span class="text-secondary">${stats.taskCompletion} / 100</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-2">
                  <div class="bg-secondary h-2 rounded-full" style="width: ${stats.taskCompletion}%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-primary text-on-primary shadow-md flex items-center justify-between">
            <div>
              <span class="text-xs uppercase tracking-wider text-primary-fixed block">종합 역량 지수</span>
              <div class="text-3xl font-extrabold">${stats.overallScore} <span class="text-sm font-normal">/ 100점</span></div>
              <span class="text-xs text-primary-fixed mt-1 block">국제 공인 CEFR ${stats.cefrTrack} 등급</span>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-on-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-[32px] text-primary-fixed">verified</span>
            </div>
          </div>
        </div>

      </section>

      <!-- Section 3: Longitudinal Summative Feedback (Claim + Evidence + Next Step) -->
      <section class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30 space-y-4">
        <div class="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
            <span class="material-symbols-outlined text-[18px]">psychology</span>
          </div>
          <div>
            <h3 class="font-headline-sm font-bold text-on-surface">학생 누적 총괄평가 (Learning Records AI Analysis)</h3>
            <span class="text-xs text-on-surface-variant">다회차 학습 이력 기반 성장 중심 피드백</span>
          </div>
        </div>

        <!-- 1. Claim -->
        <div class="p-4 rounded-xl bg-primary-fixed/20 border border-primary/30 space-y-1">
          <strong class="text-xs font-bold text-primary block">📌 종합 역량 진단 (Claim):</strong>
          <p class="text-xs text-on-surface leading-relaxed">${summative.claim}</p>
        </div>

        <!-- 2. Evidences -->
        <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
          <strong class="text-xs font-bold text-on-surface block">🔍 누적 학습 근거 (Evidences):</strong>
          <ul class="space-y-1.5 text-xs text-on-surface-variant">
            ${summative.evidences.map(ev => `
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">check_circle</span>
                <span>${ev}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- 3. Next Step -->
        <div class="p-4 rounded-xl bg-secondary-container/20 border border-secondary/40 space-y-1">
          <strong class="text-xs font-bold text-secondary block">🚀 다음 학습 목표 제안 (Next Step):</strong>
          <p class="text-xs text-on-surface leading-relaxed">${summative.nextStep}</p>
        </div>
      </section>

    </div>
  `;
}

import { aiService } from '../services/aiService.js';

export function attachReportEvents(container) {
  const reEvalBtn = container.querySelector('#btn-re-evaluate-rubric');
  reEvalBtn?.addEventListener('click', async () => {
    const state = store.getState();
    const currentEssay = state.currentTask?.essayContent || '';
    
    reEvalBtn.disabled = true;
    reEvalBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> <span>루브릭 평가 분석 중...</span>`;

    try {
      const result = await aiService.evaluateRubric(state.currentUser.name, currentEssay, {
        revisions: state.currentTask?.revisions?.length || 2,
        sessions: [1, 2, 3, 4]
      });

      if (result.scores) {
        state.competencyStats.vocabulary = result.scores.vocabulary || state.competencyStats.vocabulary;
        state.competencyStats.grammar = result.scores.grammar || state.competencyStats.grammar;
        state.competencyStats.cohesion = result.scores.cohesion || state.competencyStats.cohesion;
        state.competencyStats.fluency = result.scores.fluency || state.competencyStats.fluency;
        state.competencyStats.taskCompletion = result.scores.taskCompletion || state.competencyStats.taskCompletion;
      }
      if (result.summativeFeedback) {
        state.competencyStats.summativeFeedback.claim = result.summativeFeedback.claim;
        state.competencyStats.summativeFeedback.nextStep = result.summativeFeedback.nextStep;
      }

      alert('✨ [Gemini AI 루브릭 평가 완료]\n5대 핵심 역량 지표와 Claim-Evidence-NextStep 분석이 최신화되었습니다.');
      store.notify();
    } catch (e) {
      alert(`루브릭 평가 실패: ${e.message}`);
      reEvalBtn.disabled = false;
      reEvalBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">psychology</span> <span>AI 실시간 루브릭 재평가</span>`;
    }
  });

  container.querySelector('#btn-trigger-email')?.addEventListener('click', () => {
    alert('📧 [30215 이민서 학생]의 종합 성찰 포트폴리오 PDF가 학교 공식 구글 계정으로 발송되었습니다.');
  });
  container.querySelector('#btn-download-pdf')?.addEventListener('click', () => {
    alert('📥 [30215_이민서_성찰포트폴리오_통합본.pdf] 다운로드가 시작되었습니다.');
  });
}
