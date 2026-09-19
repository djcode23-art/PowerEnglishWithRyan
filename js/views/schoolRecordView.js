/**
 * School Record Generator View (생활기록부 진술 지원 콘솔 - Real Gemini Integration)
 */
import { store } from '../store.js';
import { aiService } from '../services/aiService.js';

export function renderSchoolRecordView() {
  const state = store.getState();
  const roster = state.classRoster;
  const currentTask = state.tasks[0];
  const srState = state.schoolRecordState;
  const currentStudent = roster.find(st => st.id === srState.selectedStudentId) || roster[0];
  const latestDraft = srState.generatedDrafts[0];

  return `
    <div class="flex flex-col w-full pb-12 space-y-6">
      
      <!-- Top Title & Principles Banner -->
      <section class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-md">
            <span class="material-symbols-outlined text-[32px]">history_edu</span>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-semibold">Teacher Evidence AI (Gemini 1.5 Pro)</span>
              <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm">Human-in-the-Loop 검증</span>
            </div>
            <h1 class="font-headline-lg font-bold text-on-surface">학교생활기록부 교과학습발달상황 진술 지원 콘솔</h1>
            <p class="text-xs text-on-surface-variant mt-0.5">교사가 직접 선택한 차시(Evidence)에만 근거하여 관찰 사실 중심 진술 초안을 생성하고 근거를 추적(Traceability)합니다.</p>
          </div>
        </div>

        <!-- Student Selector Dropdown -->
        <div class="flex items-center gap-2 bg-surface-container-low p-2 rounded-xl border border-outline-variant/50">
          <span class="text-xs font-bold text-on-surface-variant pl-2">대상 학생:</span>
          <select id="sr-student-select" class="px-3 py-2 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary">
            ${roster.map(st => `
              <option value="${st.id}" ${st.id === currentStudent.id ? 'selected' : ''}>
                ${st.id} ${st.name} (${st.cefr} · ${st.status === 'submitted' ? '제출완료' : '작성중'})
              </option>
            `).join('')}
          </select>
        </div>
      </section>

      <!-- 2-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- LEFT 5-COLS: Task & Session Evidence Selection -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
            <div class="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[22px]">checklist</span>
                <h3 class="font-headline-sm font-bold text-on-surface">1. 생기부 반영 차시 선택</h3>
              </div>
              <span class="text-xs text-on-surface-variant">교사 직접 선별</span>
            </div>

            <p class="text-xs text-on-surface-variant leading-relaxed">
              선택된 차시의 산출물, 수정 이력, 문법 미니랩 결과, 성찰 노트만 AI 진술 근거로 전달됩니다.
            </p>

            <div class="space-y-3 pt-2">
              <div class="font-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[18px] text-primary">auto_stories</span>
                <span>${currentTask.title}</span>
              </div>

              <div class="space-y-2 pl-2">
                ${currentTask.sessions.map((sess, idx) => {
                  const isChecked = srState.selectedSessionIds.includes(sess.id);
                  return `
                    <label class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-primary-fixed/20 border-primary shadow-xs' : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'}">
                      <input type="checkbox" class="sess-evidence-check mt-0.5 w-4 h-4 text-primary" data-sess-id="${sess.id}" ${isChecked ? 'checked' : ''} />
                      <div class="space-y-0.5">
                        <div class="flex items-center gap-1.5">
                          <span class="font-label-md font-bold text-on-surface">${sess.title}</span>
                          ${sess.isCandidate ? '<span class="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">★ 추천 근거</span>' : ''}
                        </div>
                        <p class="text-[11px] text-on-surface-variant">유형: ${sess.type} • 상태: ${sess.status === 'completed' ? '완료' : '진행 중'}</p>
                      </div>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Structured Evidence Package Preview -->
            <div class="pt-4 border-t border-outline-variant/30 space-y-2">
              <span class="text-xs font-bold text-on-surface block">2. 추출된 정형화 Evidence Package</span>
              <div class="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-[11px] text-on-surface-variant font-mono space-y-1">
                <div>• 학생 대상: ${currentStudent.name} (${currentStudent.id})</div>
                <div>• 초안/수정본: 논증 3단 구조 (139단어)</div>
                <div>• 교사 코멘트: 정서적 공감/멘토링 논거 보강 완료</div>
                <div>• 문법 미니랩: 관계사 수일치·분사구문 통과 (+28XP)</div>
                <div>• 말하기: WPM 128 · 발화 유창성 B2 달성</div>
                <div>• 성찰 일지: 메타인지 3문항 100% 이행</div>
              </div>
            </div>

            <!-- Trigger Button -->
            <button id="btn-generate-sr-draft" class="w-full py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95">
              <span class="material-symbols-outlined text-[20px]" id="sr-gen-icon">auto_fix_high</span>
              <span id="sr-gen-text">선택 근거 기반 Gemini 생기부 초안 생성</span>
            </button>
          </div>

        </div>

        <!-- RIGHT 7-COLS: Traceable AI Draft & Editor -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          
          <!-- Draft Card -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30 space-y-6">
            <div class="flex items-center justify-between border-b border-outline-variant/30 pb-4 flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                  AI
                </span>
                <div>
                  <h3 class="font-headline-sm font-bold text-on-surface">3. 생활기록부 진술 초안 및 교사 수정</h3>
                  <span class="text-xs text-on-surface-variant font-mono">버전 ${latestDraft.version} • ${latestDraft.time}</span>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">
                사실 중심 서술형
              </span>
            </div>

            <!-- Statement Editor -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs font-semibold">
                <span class="text-on-surface">생활기록부 교과세특 진술문 (교사 검토 및 수정 가능):</span>
                <span class="text-primary font-mono" id="sr-char-count">${latestDraft.statement.length}자 (한글 약 ${Math.round(latestDraft.statement.length * 2.5)} Byte)</span>
              </div>
              <textarea id="sr-statement-editor" class="w-full p-4 rounded-xl bg-surface-container-low text-body-md text-on-surface leading-relaxed border border-outline-variant/60 focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all custom-scrollbar" rows="7">${latestDraft.statement}</textarea>
            </div>

            <!-- Interactive Evidence Traceability Box -->
            <div class="p-4 rounded-xl bg-primary-fixed/15 border border-primary/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-label-md font-bold text-primary flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[18px]">verified</span>
                  <span>Evidence Traceability (문장별 근거 추적)</span>
                </span>
                <span class="text-[11px] text-on-surface-variant">문장을 클릭하면 원본 근거를 확인합니다</span>
              </div>

              <div class="space-y-2" id="sr-trace-list">
                ${latestDraft.traces.map((tr, idx) => `
                  <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs space-y-1 hover:border-primary transition-colors cursor-pointer" title="클릭하여 원문 대조">
                    <p class="font-semibold text-on-surface">"${tr.sentence}"</p>
                    <div class="flex items-center gap-1 text-[11px] text-primary font-mono">
                      <span class="material-symbols-outlined text-[14px]">link</span>
                      <span>근거 출처: ${tr.source}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-outline-variant/30 flex-wrap gap-3">
              <button id="btn-copy-sr-statement" class="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md font-semibold transition-all flex items-center gap-1.5 shadow-xs">
                <span class="material-symbols-outlined text-[18px]">content_copy</span>
                <span>진술문 텍스트 복사</span>
              </button>

              <div class="flex items-center gap-2">
                <button id="btn-save-sr-version" class="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md font-semibold hover:bg-surface-container shadow-xs">
                  수정본 버전 저장
                </button>
                <button id="btn-approve-sr-final" class="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-fixed-variant font-label-md font-bold shadow-md transition-all flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>교사 최종 확정 및 아카이브</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  `;
}

export function attachSchoolRecordEvents(container) {
  // Student Select
  container.querySelector('#sr-student-select')?.addEventListener('change', (e) => {
    store.setState(s => ({
      ...s,
      schoolRecordState: {
        ...s.schoolRecordState,
        selectedStudentId: e.target.value
      }
    }));
  });

  // Checkbox toggles
  container.querySelectorAll('.sess-evidence-check').forEach(chk => {
    chk.addEventListener('change', () => {
      const selected = Array.from(container.querySelectorAll('.sess-evidence-check:checked')).map(el => el.getAttribute('data-sess-id'));
      store.setState(s => ({
        ...s,
        schoolRecordState: {
          ...s.schoolRecordState,
          selectedSessionIds: selected
        }
      }));
    });
  });

  // Real Gemini Generate Draft Call
  const genBtn = container.querySelector('#btn-generate-sr-draft');
  const genIcon = container.querySelector('#sr-gen-icon');
  const genText = container.querySelector('#sr-gen-text');
  const editorTextarea = container.querySelector('#sr-statement-editor');
  const traceList = container.querySelector('#sr-trace-list');

  genBtn?.addEventListener('click', async () => {
    const state = store.getState();
    const student = state.classRoster.find(st => st.id === state.schoolRecordState.selectedStudentId) || { name: '이민서' };

    if (genIcon) genIcon.className = 'material-symbols-outlined text-[20px] animate-spin';
    if (genText) genText.textContent = 'Gemini 1.5 Pro가 근거를 분석하여 진술문 작성 중...';
    genBtn.disabled = true;

    try {
      const evidenceData = {
        studentName: student.name,
        selectedSessions: state.schoolRecordState.selectedSessionIds,
        task: '인공지능 윤리와 교육적 활용 논증문',
        comments: '정서적 공감 및 인간 교사 멘토링 역할 보강',
        miniLabScore: '+28 XP 관계사 수일치 완료',
        reflection: '반론 인정 후 재반박 전략 메타인지 이행 완료'
      };

      const res = await aiService.generateSchoolRecord(student.name, evidenceData);

      if (editorTextarea) editorTextarea.value = res.statement;
      if (traceList && res.traces) {
        traceList.innerHTML = res.traces.map(tr => `
          <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs space-y-1 hover:border-primary transition-colors cursor-pointer">
            <p class="font-semibold text-on-surface">"${tr.sentence}"</p>
            <div class="flex items-center gap-1 text-[11px] text-primary font-mono">
              <span class="material-symbols-outlined text-[14px]">link</span>
              <span>근거 출처: ${tr.source}</span>
            </div>
          </div>
        `).join('');
      }

      alert('✨ 선택된 근거 차시를 바탕으로 생활기록부 진술 초안이 성공적으로 생성되었습니다.');
    } catch (e) {
      alert('생기부 초안 생성 중 오류: ' + e.message);
    } finally {
      if (genIcon) genIcon.className = 'material-symbols-outlined text-[20px]';
      if (genText) genText.textContent = '선택 근거 기반 Gemini 생기부 초안 생성';
      genBtn.disabled = false;
    }
  });

  // Copy text
  container.querySelector('#btn-copy-sr-statement')?.addEventListener('click', () => {
    const text = editorTextarea?.value;
    if (text) {
      navigator.clipboard.writeText(text);
      alert('📋 생활기록부 진술문이 클립보드에 복사되었습니다.');
    }
  });

  // Final Approve
  container.querySelector('#btn-approve-sr-final')?.addEventListener('click', () => {
    store.syncGoogleSheets();
    alert('✅ Mr. Ryan 선생님의 최종 확인을 거쳐 생활기록부 진술이 아카이브 및 Google Sheets에 반영되었습니다.');
  });
}
