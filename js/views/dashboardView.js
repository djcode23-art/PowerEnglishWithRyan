/**
 * Student Dashboard View (New Design - High Stitch Fidelity)
 */
import { store } from '../store.js';

export function renderDashboardView() {
  const state = store.getState();
  const user = state.currentUser;
  const tasks = state.tasks;

  const assignedTasks = tasks.filter(t => t.category === 'Assigned');
  const personalTasks = tasks.filter(t => t.category === 'Personal');

  return `
    <div class="flex flex-col w-full pb-12 space-y-6">
      
      <!-- Welcome Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 md:p-8 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-semibold">2025학년도 1학기</span>
            <span class="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-semibold">${user.cefr} 트랙</span>
          </div>
          <h1 class="font-headline-lg font-bold text-on-surface">환영합니다, ${user.name} 학생! 👋</h1>
          <p class="font-body-md text-on-surface-variant text-sm max-w-2xl">
            오늘도 생각하고, 질문하고, 스스로 교정하며 나만의 영어 글쓰기·말하기 러닝 로그를 완성해보세요.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button id="btn-new-personal-task" class="px-5 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg font-bold shadow-md transition-all flex items-center gap-2 active:scale-95">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
            <span>나만의 자율 연습 과업 생성 (New Task)</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
            <span class="material-symbols-outlined">assignment</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant font-medium">진행 중인 과업</span>
            <div class="text-2xl font-extrabold text-on-surface">2 <span class="text-xs text-primary font-normal">건</span></div>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
            <span class="material-symbols-outlined">psychology</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant font-medium">누적 메타인지 점수</span>
            <div class="text-2xl font-extrabold text-secondary">+28 <span class="text-xs font-normal">XP</span></div>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
            <span class="material-symbols-outlined">forum</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant font-medium">선생님 피드백 코멘트</span>
            <div class="text-2xl font-extrabold text-tertiary">1 <span class="text-xs font-normal">건 확인됨</span></div>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-bold">
            <span class="material-symbols-outlined">cloud_sync</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant font-medium">구글 클래스룸 연동</span>
            <div class="text-xs font-bold text-secondary mt-1 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-secondary"></span>실시간 동기화됨
            </div>
          </div>
        </div>
      </div>

      <!-- Section 1: Teacher Assigned Tasks -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-headline-md font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[24px]">school</span>
            <span>선생님 부여 과업 (Teacher Assigned Tasks)</span>
          </h2>
          <span class="text-xs text-on-surface-variant font-medium">총 ${assignedTasks.length}개의 과업</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${assignedTasks.map(task => `
            <div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${task.status === 'completed' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed'}">
                    ${task.status === 'completed' ? '✓ 완료' : '진행 중 (In Progress)'}
                  </span>
                  <span class="text-xs text-on-surface-variant font-mono">기한: ${task.dueDate}</span>
                </div>

                <h3 class="font-headline-sm font-bold text-on-surface leading-snug">${task.title}</h3>
                <p class="font-body-sm text-xs text-on-surface-variant line-clamp-2">${task.description}</p>
                
                <!-- Multi-Session Progress Strip -->
                <div class="pt-2 space-y-1.5">
                  <div class="flex justify-between text-xs font-semibold">
                    <span class="text-on-surface-variant">차시별 진행 단계 (${task.sessions.length}차시)</span>
                    <span class="text-primary font-mono">Session 2 / 5</span>
                  </div>
                  <div class="flex gap-1.5">
                    ${task.sessions.map((s, idx) => `
                      <div class="flex-1 h-2 rounded-full ${s.status === 'completed' ? 'bg-secondary' : idx === 1 ? 'bg-primary animate-pulse' : 'bg-surface-container-high'}" title="${s.title}"></div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Footer CTA -->
              <div class="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span class="material-symbols-outlined text-[16px] text-tertiary">stylus_note</span>
                  <span>태블릿 필기 & STT 지원</span>
                </div>
                <button class="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold transition-all shadow-sm btn-open-task" data-task-id="${task.id}">
                  과업 이어하기 →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Section 2: Personal Tasks -->
      <section class="space-y-4 pt-4">
        <div class="flex items-center justify-between">
          <h2 class="font-headline-md font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[24px]">edit_note</span>
            <span>나만의 자율 연습 과업 (My Personal Tasks)</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${personalTasks.map(task => `
            <div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <span class="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">자율 연습</span>
                <h3 class="font-headline-sm font-bold text-on-surface">${task.title}</h3>
                <p class="font-body-sm text-xs text-on-surface-variant">${task.description}</p>
              </div>
              <div class="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span class="text-xs text-on-surface-variant">목표 분량: ${task.targetWords}단어</span>
                <button class="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md font-semibold transition-all btn-open-task" data-task-id="${task.id}">
                  작성하기 →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

    </div>
  `;
}

export function attachDashboardEvents(container) {
  container.querySelectorAll('.btn-open-task').forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.getAttribute('data-task-id');
      store.selectTask(taskId);
    });
  });

  container.querySelector('#btn-new-personal-task')?.addEventListener('click', () => {
    const title = prompt('새로운 자율 연습 과업의 제목을 입력하세요 (예: Daily Diary / Movie Review):');
    if (title && title.trim()) {
      const newTask = {
        id: 'task-p' + Date.now(),
        title: title.trim(),
        type: 'Personal Writing',
        category: 'Personal',
        assignedClass: '개인 자율',
        dueDate: '자율 기한',
        targetWords: 150,
        description: '자유 주제 자율 영어 쓰기 과업입니다.',
        status: 'in_progress',
        sessions: [
          { id: 'sess-p' + Date.now(), order: 1, title: '차시 1: 본문 작성', status: 'in_progress', content: '', wordCount: 0 }
        ]
      };
      store.setState(s => ({
        ...s,
        tasks: [...s.tasks, newTask]
      }));
      store.selectTask(newTask.id);
    }
  });
}
