/**
 * Auth & OCR Gateway Modal View (Screen 3)
 */
import { store } from '../store.js';

export function renderAuthModal() {
  const state = store.getState();
  const user = state.currentUser;

  return `
    <div id="auth-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-outline-variant/30 space-y-6 relative overflow-hidden animate-slide-down">
        
        <!-- Header Glow -->
        <div class="absolute -top-12 -right-12 w-40 h-40 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
              <span class="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h2 class="font-headline-md text-headline-md font-bold text-on-surface">학생 계정 등록 & 인증 게이트웨이</h2>
              <p class="font-body-sm text-body-sm text-on-surface-variant">Google Workspace for Education & 디지털 필기 OCR 연동</p>
            </div>
          </div>
          <button id="btn-close-auth-modal" class="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Google Edu Login Card -->
        <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-xs">
              <svg class="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"></path>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"></path>
              </svg>
            </div>
            <div>
              <div class="font-label-lg text-label-lg font-bold text-on-surface">${user.name} (${user.gradeClass})</div>
              <div class="font-label-sm text-label-sm text-primary font-mono">${user.email}</div>
            </div>
          </div>
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold self-start sm:self-center">
            <span class="material-symbols-outlined text-[14px]">check_circle</span>인증 완료됨
          </span>
        </div>

        <!-- OCR Handwriting Upload Simulation Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
              <span class="material-symbols-outlined text-secondary text-[20px]">stylus_note</span>
              손글씨 노트 사진 OCR 자동 텍스트 추출 가이드
            </span>
            <span class="text-secondary font-label-sm text-label-sm font-medium">S-Pen / Apple Pencil 지원</span>
          </div>

          <div class="border-2 border-dashed border-primary/40 hover:border-primary rounded-xl p-6 bg-primary-fixed/10 transition-colors text-center cursor-pointer group" id="ocr-dropzone">
            <input type="file" id="ocr-file-input" accept="image/*" class="hidden" />
            <div class="flex flex-col items-center gap-2">
              <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[28px]">document_scanner</span>
              </div>
              <p class="font-label-lg text-label-lg text-on-surface font-semibold">
                클릭하거나 손글씨 학습지 사진을 끌어다 놓으세요
              </p>
              <p class="font-body-sm text-body-sm text-on-surface-variant">
                PNG, JPG, HEIC 지원 • AI가 영어 필기를 실시간 인식하여 에디터로 자동 삽입합니다
              </p>
            </div>
          </div>

          <!-- Sample OCR Load Button -->
          <div class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low text-xs">
            <span class="text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-tertiary">lightbulb</span>
              샘플 손글씨 과제 텍스트로 즉시 체험해보기:
            </span>
            <button id="btn-load-sample-ocr" class="px-3 py-1 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all">
              샘플 OCR 텍스트 불러오기
            </button>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/30">
          <button id="btn-cancel-auth" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-label-lg">
            닫기
          </button>
          <button id="btn-confirm-auth" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg font-bold shadow-md">
            에디터 스튜디오로 이동
          </button>
        </div>

      </div>
    </div>
  `;
}

export function attachAuthModalEvents(container) {
  const modal = container.querySelector('#auth-modal');
  if (!modal) return;

  const closeModal = () => modal.remove();

  modal.querySelector('#btn-close-auth-modal')?.addEventListener('click', closeModal);
  modal.querySelector('#btn-cancel-auth')?.addEventListener('click', closeModal);
  modal.querySelector('#btn-confirm-auth')?.addEventListener('click', () => {
    closeModal();
    store.switchTab('writing');
  });

  const dropzone = modal.querySelector('#ocr-dropzone');
  const fileInput = modal.querySelector('#ocr-file-input');

  dropzone?.addEventListener('click', () => fileInput?.click());

  modal.querySelector('#btn-load-sample-ocr')?.addEventListener('click', () => {
    const sampleText = `Artificial intelligence has rapidly entered our classrooms, fundamentally transforming the traditional educational landscape. Supporters highlight that AI tutors can provide personalized, on-demand explanations tailored to each learner’s specific pace.

However, this transformative technology must be recognized as a double-edged sword. When students excessively depend on automated generators to formulate critical essays, they risk diminishing their own original cognitive reasoning and analytical faculties.

Therefore, we should not blindly reject AI nor unconditionally succumb to it. Instead, learners must approach it as an analytical thought companion while maintaining active ownership over their ethical judgment and expressive voice.`;
    store.updateEssay(sampleText);
    closeModal();
    store.switchTab('writing');
  });
}
