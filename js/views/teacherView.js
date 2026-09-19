/**
 * Teacher Management Console View (Screen 4)
 * High Stitch Fidelity + Multi-Session & Archive / School Record Links
 */
import { store } from '../store.js';

export function renderTeacherView() {
  const state = store.getState();
  const roster = state.classRoster;
  const task = state.tasks[0];

  const submittedCount = roster.filter(s => s.status === 'submitted').length;
  const writingCount = roster.filter(s => s.status === 'writing').length;
  const totalCount = roster.length;
  const submissionRate = Math.round((submittedCount / totalCount) * 100);

  return `
    <div class="flex flex-col w-full pb-12 space-y-6">
      
      <!-- Top Title & Action Bar -->
      <section class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-md">
            <span class="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-semibold">Mr. Ryan 선생님 콘솔</span>
              <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm">3학년 2반 영어집중반</span>
            </div>
            <h1 class="font-headline-lg font-bold text-on-surface">교사 관리 콘솔 & 학급 학습 아카이브</h1>
          </div>
        </div>

        <!-- Quick Access to Advanced Tools -->
        <div class="flex flex-wrap items-center gap-3">
          <button id="btn-open-task-builder" class="px-4 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold transition-all shadow-md flex items-center gap-2 active:scale-95">
            <span class="material-symbols-outlined text-[18px]">add_task</span>
            <span>새 과업·차시 개설 (Task Builder)</span>
          </button>
          <button id="btn-go-to-sheets" class="px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md font-semibold transition-all flex items-center gap-2 shadow-xs">
            <span class="material-symbols-outlined text-[18px] text-secondary">table_chart</span>
            <span>Google Sheets 아카이브</span>
          </button>
          <button id="btn-go-to-school-record" class="px-4 py-3 rounded-xl bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md font-bold transition-all flex items-center gap-2 shadow-xs">
            <span class="material-symbols-outlined text-[18px]">history_edu</span>
            <span>생활기록부 지원 콘솔</span>
          </button>
        </div>
      </section>

      <!-- KPI 4-Bento Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <!-- KPI 1 -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-on-surface-variant mb-2">
            <span class="font-label-md font-bold">과업 진행 현황</span>
            <span class="material-symbols-outlined text-[20px] text-primary">assignment_turned_in</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-3xl font-extrabold text-on-surface">${submittedCount}</span>
            <span class="text-sm font-medium text-on-surface-variant">/ ${totalCount}명</span>
            <span class="ml-auto font-label-sm px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">${submissionRate}%</span>
          </div>
          <div class="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-primary h-1.5 rounded-full" style="width: ${submissionRate}%;"></div>
          </div>
          <span class="text-xs text-on-surface-variant mt-2">작성 중 ${writingCount}명 • 실시간 동기화 중</span>
        </div>

        <!-- KPI 2 -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-on-surface-variant mb-2">
            <span class="font-label-md font-bold">학급 평균 CEFR 성취</span>
            <span class="material-symbols-outlined text-[20px] text-secondary">trending_up</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-3xl font-extrabold text-on-surface">88.4</span>
            <span class="text-xs text-on-surface-variant">점</span>
            <span class="ml-auto font-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">CEFR B1+ ~ B2</span>
          </div>
          <div class="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-secondary h-1.5 rounded-full" style="width: 78%;"></div>
          </div>
          <span class="text-xs text-secondary font-medium mt-2">전차시 대비 +3.8점 상승 곡선</span>
        </div>

        <!-- KPI 3 -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-on-surface-variant mb-2">
            <span class="font-label-md font-bold">자가 성찰 완성도</span>
            <span class="material-symbols-outlined text-[20px] text-tertiary">psychology</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-3xl font-extrabold text-on-surface">92.5</span>
            <span class="text-xs text-on-surface-variant">%</span>
            <span class="ml-auto font-label-sm px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">우수</span>
          </div>
          <div class="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-tertiary h-1.5 rounded-full" style="width: 92.5%;"></div>
          </div>
          <span class="text-xs text-on-surface-variant mt-2">메타인지 체크리스트 3문항 이행률</span>
        </div>

        <!-- KPI 4 -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-on-surface-variant mb-2">
            <span class="font-label-md font-bold">교사 첨삭 대기</span>
            <span class="material-symbols-outlined text-[20px] text-error">rate_review</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-3xl font-extrabold text-error">2</span>
            <span class="text-xs text-on-surface-variant">건</span>
            <span class="ml-auto font-label-sm px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">피드백 필요</span>
          </div>
          <div class="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-error h-1.5 rounded-full" style="width: 20%;"></div>
          </div>
          <span class="text-xs text-error font-medium mt-2">이민서, 김하은 학생 신규 제출</span>
        </div>
      </section>

      <!-- Student Progress Table Card -->
      <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div class="p-6 border-b border-outline-variant/30 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 class="font-headline-sm font-bold text-on-surface">학생별 제출 에세이 및 실시간 포트폴리오 명단</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">학생을 클릭하여 초안-수정본 이력과 성찰 기록을 확인하고 인라인 첨삭 코멘트를 등록하세요.</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-surface-container-low text-on-surface-variant font-label-md border-b border-outline-variant/40">
                <th class="py-3.5 px-6">학번 / 이름</th>
                <th class="py-3.5 px-4">진행 상태</th>
                <th class="py-3.5 px-4">작성 단어수</th>
                <th class="py-3.5 px-4">CEFR 등급</th>
                <th class="py-3.5 px-4">성찰 체크</th>
                <th class="py-3.5 px-4">제출 시각</th>
                <th class="py-3.5 px-4">AI 진단</th>
                <th class="py-3.5 px-6 text-right">관리</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20">
              ${roster.map(st => `
                <tr class="hover:bg-surface-container-low/60 transition-colors cursor-pointer student-inspect-row" data-id="${st.id}">
                  <td class="py-4 px-6 font-semibold text-on-surface flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs">
                      ${st.name.charAt(0)}
                    </div>
                    <div>
                      <span class="font-bold text-on-surface block">${st.name}</span>
                      <span class="text-[10px] text-on-surface-variant">${st.id}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.status === 'submitted' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed'}">
                      <span class="w-1.5 h-1.5 rounded-full ${st.status === 'submitted' ? 'bg-secondary' : 'bg-primary animate-pulse'}"></span>
                      ${st.status === 'submitted' ? '제출 완료' : '작성 중'}
                    </span>
                  </td>
                  <td class="py-4 px-4 font-mono font-medium">${st.words} Words</td>
                  <td class="py-4 px-4">
                    <span class="px-2 py-0.5 rounded bg-surface-container font-mono font-bold text-primary">${st.cefr}</span>
                  </td>
                  <td class="py-4 px-4">
                    <span class="inline-flex items-center gap-1 font-semibold ${st.reflectionDone ? 'text-secondary' : 'text-outline'}">
                      <span class="material-symbols-outlined text-[16px]">${st.reflectionDone ? 'check_circle' : 'pending'}</span>
                      ${st.reflectionDone ? '완료' : '미완료'}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-on-surface-variant font-mono">${st.time}</td>
                  <td class="py-4 px-4">
                    <span class="px-2 py-0.5 rounded font-semibold ${st.aiFlag === '우수' || st.aiFlag === '최우수' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'}">
                      ${st.aiFlag}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <button class="px-3 py-1 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-semibold transition-colors text-xs">
                      과제 열람 및 첨삭
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Task Builder Modal (Hidden by default) -->
      <div id="task-builder-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm">
        <div class="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-4 shadow-2xl border border-outline-variant/30 animate-slide-down">
          <div class="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <h3 class="font-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">add_task</span>
              <span>새로운 영어 수업 과업 및 다차시(Session) 개설</span>
            </h3>
            <button id="btn-close-task-builder" class="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-on-surface block mb-1">과업명 (Task Title)</label>
              <input type="text" id="tb-title" value="Exploring Future Space Exploration & Ethics" class="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs text-on-surface focus:border-primary" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-on-surface block mb-1">배포 학급</label>
                <select class="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs text-on-surface">
                  <option>3학년 2반 영어집중반</option>
                  <option>3학년 1반</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold text-on-surface block mb-1">목표 분량</label>
                <input type="number" value="200" class="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs text-on-surface" />
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-on-surface block mb-1">다회차 세션(Sessions) 기본 구성</label>
              <div class="p-3 rounded-xl bg-surface-container-low text-xs space-y-1 text-on-surface-variant font-mono">
                <div>• Session 1: Idea Generation (브레인스토밍)</div>
                <div>• Session 2: First Draft & OCR (초안 및 필기인식)</div>
                <div>• Session 3: Grammar Mini Lab (문법 클리닉)</div>
                <div>• Session 4: Revision & Peer/Teacher Feedback (재수정)</div>
                <div>• Session 5: Speaking & Metacognitive Reflection (낭독 및 성찰)</div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-outline-variant/30">
            <button id="btn-cancel-task-builder" class="px-4 py-2 rounded-xl text-xs text-on-surface-variant hover:bg-surface-container">취소</button>
            <button id="btn-create-task-submit" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container shadow-md">
              과업 개설 및 학급 배포
            </button>
          </div>
        </div>
      </div>

      <!-- Student Detail Inspection Modal -->
      <div id="teacher-inspect-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm">
        <div class="bg-surface-container-lowest rounded-2xl max-w-3xl w-full p-6 md:p-8 space-y-5 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-down">
          <div class="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined">description</span>
              </div>
              <div>
                <h3 class="font-headline-sm font-bold text-on-surface">30215 이민서 학생 에세이 열람</h3>
                <span class="text-xs text-secondary font-semibold">CEFR B2 • 184단어 • 2회차 수정 완료됨</span>
              </div>
            </div>
            <button id="btn-close-inspect-modal" class="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-1.5">
            <h4 class="font-label-md font-bold text-on-surface">학생 제출 본문 (Task 101 - Session 2)</h4>
            <div class="p-4 rounded-xl bg-surface-container-low text-xs leading-relaxed text-on-surface border border-outline-variant/40">
              ${task.sessions[1].content}
            </div>
          </div>

          <div class="space-y-1.5">
            <h4 class="font-label-md font-bold text-on-surface">학생 자가 발전 성찰 노트 (Metacognition Log)</h4>
            <div class="p-3.5 rounded-xl bg-tertiary-fixed/20 border border-tertiary/30 text-xs">
              <p>${task.sessions[1].reflection.comparisonNote}</p>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-outline-variant/30">
            <h4 class="font-label-md font-bold text-on-surface">교사 첨삭 코멘트 추가</h4>
            <div class="flex gap-2">
              <input type="text" id="teacher-new-comment-input" placeholder="학생 에디터에 전달할 첨삭 피드백을 입력하세요..." class="flex-1 p-2.5 rounded-xl bg-surface-container-low text-xs border border-outline-variant/60 focus:border-primary text-on-surface" />
              <button id="btn-submit-teacher-comment" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container shadow-sm">
                첨삭 등록
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function attachTeacherEvents(container) {
  // Navigation to Sheets & School Record
  container.querySelector('#btn-go-to-sheets')?.addEventListener('click', () => {
    store.switchTab('sheets');
  });
  container.querySelector('#btn-go-to-school-record')?.addEventListener('click', () => {
    store.switchTab('school-record');
  });

  // Task Builder Modal
  const tbModal = container.querySelector('#task-builder-modal');
  container.querySelector('#btn-open-task-builder')?.addEventListener('click', () => tbModal?.classList.remove('hidden'));
  container.querySelector('#btn-close-task-builder')?.addEventListener('click', () => tbModal?.classList.add('hidden'));
  container.querySelector('#btn-cancel-task-builder')?.addEventListener('click', () => tbModal?.classList.add('hidden'));
  container.querySelector('#btn-create-task-submit')?.addEventListener('click', () => {
    alert('🚀 새로운 다회차 과업이 성공적으로 개설되어 3학년 2반 학생들에게 배포되었습니다.');
    tbModal?.classList.add('hidden');
  });

  // Inspect Modal
  const inspModal = container.querySelector('#teacher-inspect-modal');
  container.querySelectorAll('.student-inspect-row').forEach(row => {
    row.addEventListener('click', () => inspModal?.classList.remove('hidden'));
  });
  container.querySelector('#btn-close-inspect-modal')?.addEventListener('click', () => inspModal?.classList.add('hidden'));

  // Submit Comment
  container.querySelector('#btn-submit-teacher-comment')?.addEventListener('click', () => {
    const input = container.querySelector('#teacher-new-comment-input');
    if (input && input.value.trim()) {
      alert('✅ 학생 에디터에 첨삭 피드백이 등록되었습니다.');
      input.value = '';
      inspModal?.classList.add('hidden');
    }
  });
}
