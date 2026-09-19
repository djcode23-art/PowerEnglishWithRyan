/**
 * Google Sheets Live Archive View (New Design)
 * High Fidelity Monitoring & One-Way Continuous Archiving Layer
 */
import { store } from '../store.js';

export function renderSheetsArchiveView() {
  const state = store.getState();
  const sheets = state.sheetsArchive;
  const roster = state.classRoster;

  return `
    <div class="flex flex-col w-full pb-12 space-y-6">
      
      <!-- Top Google Sheets Connect Banner -->
      <section class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-md">
            <span class="material-symbols-outlined text-[32px]">table_chart</span>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-semibold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span>실시간 클라우드 연결됨</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm">단방향 아카이브 Layer</span>
            </div>
            <h1 class="font-headline-lg font-bold text-on-surface">${sheets.spreadsheetTitle}</h1>
            <p class="text-xs text-on-surface-variant mt-1 font-mono">${sheets.lastSyncTime}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button id="btn-manual-sync-sheets" class="px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold transition-all shadow-md flex items-center gap-2 active:scale-95">
            <span class="material-symbols-outlined text-[18px]">sync</span>
            <span>지금 즉시 수동 동기화 (Manual Sync)</span>
          </button>
          <button id="btn-export-csv" class="px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md font-semibold transition-all flex items-center gap-1.5 shadow-xs" title="전체 학생 학습데이터 CSV 다운로드">
            <span class="material-symbols-outlined text-[18px] text-primary">download</span>
            <span>CSV 내보내기</span>
          </button>
          <a href="${sheets.spreadsheetUrl}" target="_blank" class="px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md font-semibold transition-all flex items-center gap-1.5 shadow-xs">
            <span class="material-symbols-outlined text-[18px] text-secondary">open_in_new</span>
            <span>Google Sheets에서 직접 열기</span>
          </a>
        </div>
      </section>

      <!-- Multi-Sheet Tabs Bar -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1">
        ${sheets.sheets.map((sheetName, idx) => `
          <button class="px-4 py-2 rounded-xl font-label-md font-bold transition-all flex items-center gap-2 ${idx === 0 ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'}">
            <span class="material-symbols-outlined text-[16px]">grid_on</span>
            <span>${sheetName}</span>
          </button>
        `).join('')}
      </div>

      <!-- Synchronized Data Preview Table -->
      <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div class="p-6 border-b border-outline-variant/30 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 class="font-headline-sm font-bold text-on-surface">동기화 데이터 실시간 미리보기 (Live Stream Preview)</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">웹앱 PostgreSQL 데이터베이스에서 구글 시트로 자동 전송된 28건의 레코드 상태입니다.</p>
          </div>
          <span class="px-3 py-1 rounded-full bg-surface-container text-xs font-mono font-bold text-secondary">
            Total Synced: ${sheets.totalSyncedRows} Rows
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-surface-container-low text-on-surface-variant font-label-md border-b border-outline-variant/40">
                <th class="py-3 px-4">Row</th>
                <th class="py-3 px-4">학번</th>
                <th class="py-3 px-4">성명</th>
                <th class="py-3 px-4">과업명 (Task)</th>
                <th class="py-3 px-4">상태</th>
                <th class="py-3 px-4">단어수</th>
                <th class="py-3 px-4">CEFR</th>
                <th class="py-3 px-4">성찰 이행</th>
                <th class="py-3 px-4">최근 동기화 시각</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20 font-mono">
              ${roster.map((st, idx) => `
                <tr class="hover:bg-surface-container-low/40 transition-colors">
                  <td class="py-3 px-4 text-on-surface-variant">${idx + 2}</td>
                  <td class="py-3 px-4 font-bold text-on-surface">${st.id}</td>
                  <td class="py-3 px-4 font-sans font-bold text-on-surface">${st.name}</td>
                  <td class="py-3 px-4 font-sans">인공지능 윤리와 교육적 활용 (Session 2)</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${st.status === 'submitted' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed'}">
                      ${st.status === 'submitted' ? '제출 완료' : '작성 중'}
                    </span>
                  </td>
                  <td class="py-3 px-4">${st.words}</td>
                  <td class="py-3 px-4 font-bold text-primary">${st.cefr}</td>
                  <td class="py-3 px-4 font-sans font-semibold ${st.reflectionDone ? 'text-secondary' : 'text-outline'}">
                    ${st.reflectionDone ? '✓ 성찰완료' : '미완료'}
                  </td>
                  <td class="py-3 px-4 text-on-surface-variant text-[11px]">${st.time}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Sync Architecture Safeguard Notice -->
      <div class="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2 text-xs">
        <div class="flex items-center gap-2 font-bold text-on-surface">
          <span class="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          <span>Google Sheets 단방향 아카이브 보안 및 충돌 방지 원칙</span>
        </div>
        <p class="text-on-surface-variant leading-relaxed">
          웹 애플리케이션의 자체 PostgreSQL DB가 <strong>Single Source of Truth</strong>로 작동합니다. Google Sheets는 교사용 열람 및 아카이브 전용으로 단방향 동기화되며, 스프레드시트의 임의 수정이 원본 학습 데이터를 훼손하지 않도록 안전하게 보호됩니다.
        </p>
      </div>

    </div>
  `;
}

import { aiService } from '../services/aiService.js';

export function attachSheetsArchiveEvents(container) {
  const syncBtn = container.querySelector('#btn-manual-sync-sheets');
  const csvBtn = container.querySelector('#btn-export-csv');

  syncBtn?.addEventListener('click', async () => {
    syncBtn.disabled = true;
    syncBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> <span>Google Sheets 동기화 중...</span>`;

    try {
      const state = store.getState();
      const res = await aiService.syncToSheets({ records: state.classRoster });
      store.syncGoogleSheets();
      alert(`🔄 [Google Sheets 동기화 완료]\n총 ${res.syncedCount}명의 학생 과정중심 기록이 성공적으로 클라우드 스프레드시트에 동기화되었습니다.`);
    } catch (e) {
      alert(`동기화 중 오류: ${e.message}`);
    } finally {
      syncBtn.disabled = false;
      syncBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">sync</span> <span>지금 즉시 수동 동기화 (Manual Sync)</span>`;
    }
  });

  csvBtn?.addEventListener('click', () => {
    const state = store.getState();
    const rows = [
      ['순번', '학번', '성명', '과업명', '제출상태', '단어수', 'CEFR레벨', '성찰일지완료', '동기화시각']
    ];
    state.classRoster.forEach((st, i) => {
      rows.push([
        i + 1,
        st.id,
        st.name,
        '인공지능 윤리와 교육적 활용 (Session 2)',
        st.status === 'submitted' ? '제출 완료' : '작성 중',
        st.words,
        st.cefr,
        st.reflectionDone ? '완료' : '미완료',
        st.time
      ]);
    });

    const csvContent = '\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PowerEnglish_학습기록_아카이브_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
