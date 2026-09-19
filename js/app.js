/**
 * Main Application Router & Entry Point
 * Complete Multi-View Dispatcher supporting Student & Teacher Workflows
 */
import { store } from './store.js';
import { aiService } from './services/aiService.js';
import { renderAuthModal, attachAuthModalEvents } from './views/authView.js';
import { renderApiSettingsModal, attachApiSettingsModalEvents } from './views/apiSettingsModal.js';
import { renderDashboardView, attachDashboardEvents } from './views/dashboardView.js';
import { renderEditorView, attachEditorEvents } from './views/editorView.js';
import { renderGrammarView, attachGrammarEvents } from './views/grammarView.js';
import { renderReportView, attachReportEvents } from './views/reportView.js';
import { renderTeacherView, attachTeacherEvents } from './views/teacherView.js';
import { renderSheetsArchiveView, attachSheetsArchiveEvents } from './views/sheetsArchiveView.js';
import { renderSchoolRecordView, attachSchoolRecordEvents } from './views/schoolRecordView.js';

class App {
  constructor() {
    this.appContainer = document.getElementById('app-main-content');
    this.headerNav = document.getElementById('header-nav-tabs');
    this.mobileNav = document.getElementById('mobile-nav-tabs');
    this.userBadge = document.getElementById('header-user-badge');
    this.roleToggleBtn = document.getElementById('btn-toggle-role');
    this.authModalBtn = document.getElementById('btn-open-auth-modal');
    this.apiModalBtn = document.getElementById('btn-open-api-modal');
    this.apiStatusDot = document.getElementById('api-status-dot');

    this.init();
  }

  init() {
    this.setupNavigation();
    this.updateApiStatusDot();

    this.authModalBtn?.addEventListener('click', () => {
      this.openAuthModal();
    });

    this.apiModalBtn?.addEventListener('click', () => {
      this.openApiModal();
    });

    this.roleToggleBtn?.addEventListener('click', () => {
      const state = store.getState();
      const nextRole = state.currentUser.role === 'student' ? 'teacher' : 'student';
      store.switchRole(nextRole);
    });

    store.subscribe(() => {
      this.render();
    });

    this.render();
  }

  updateApiStatusDot() {
    if (!this.apiStatusDot) return;
    const hasKey = aiService.hasApiKey();
    if (hasKey) {
      this.apiStatusDot.className = 'w-2 h-2 rounded-full bg-secondary animate-pulse';
      this.apiStatusDot.title = 'Gemini API 키 연결 활성화';
    } else {
      this.apiStatusDot.className = 'w-2 h-2 rounded-full bg-tertiary animate-pulse';
      this.apiStatusDot.title = '시뮬레이션 모드 활성화 (키 입력 가능)';
    }
  }

  openApiModal() {
    const modalContainer = document.getElementById('modal-overlay-container');
    if (!modalContainer) return;
    modalContainer.innerHTML = renderApiSettingsModal();
    attachApiSettingsModalEvents(modalContainer, () => {
      this.updateApiStatusDot();
    });
  }

  setupNavigation() {
    document.querySelectorAll('[data-nav-tab]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = tab.getAttribute('data-nav-tab');
        store.switchTab(targetTab);
      });
    });
  }

  openAuthModal() {
    const modalContainer = document.getElementById('modal-overlay-container');
    if (!modalContainer) return;
    modalContainer.innerHTML = renderAuthModal();
    attachAuthModalEvents(modalContainer);
  }

  render() {
    const state = store.getState();
    const currentTab = state.currentTab;
    const user = state.currentUser;

    // Update Nav Tab Styles
    document.querySelectorAll('[data-nav-tab]').forEach(tab => {
      const tabName = tab.getAttribute('data-nav-tab');
      if (tabName === currentTab) {
        tab.className = 'px-3.5 py-1.5 rounded-full transition-all bg-primary-container text-on-primary-container font-label-lg shadow-xs inline-flex items-center gap-1.5 font-bold';
      } else {
        tab.className = 'px-3.5 py-1.5 rounded-full text-on-surface-variant font-label-lg transition-all hover:text-on-surface inline-flex items-center gap-1.5';
      }
    });

    // Update Role Switcher
    if (this.roleToggleBtn) {
      this.roleToggleBtn.innerHTML = `
        <span class="material-symbols-outlined text-[16px]">${user.role === 'student' ? 'swap_horiz' : 'school'}</span>
        <span>${user.role === 'student' ? '교사 모드 전환' : '학생 모드 전환'}</span>
      `;
    }

    // Update User Profile Badge
    if (this.userBadge) {
      if (user.role === 'student') {
        this.userBadge.innerHTML = `
          <div class="hidden sm:flex flex-col text-right shrink-0">
            <div class="flex items-center justify-end gap-1.5">
              <span class="font-label-lg font-bold text-on-surface">${user.gradeClass} ${user.name}</span>
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-surface-container-high text-primary font-label-sm text-[10px] font-semibold border border-primary/20">
                <span class="material-symbols-outlined text-[12px] text-primary">verified_user</span>Google Edu
              </span>
            </div>
            <div class="flex items-center justify-end gap-1">
              <span class="font-label-sm text-[11px] text-on-surface-variant font-mono truncate max-w-[170px]">${user.email}</span>
              <span class="text-outline-variant font-label-sm text-[10px]">•</span>
              <span class="font-label-sm text-[11px] text-secondary font-bold">${user.cefr}</span>
            </div>
          </div>
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-sm">
            <span>${user.name.charAt(0)}</span>
          </div>
        `;
      } else {
        this.userBadge.innerHTML = `
          <div class="hidden sm:flex flex-col text-right shrink-0">
            <div class="flex items-center justify-end gap-1.5">
              <span class="font-label-lg font-bold text-tertiary">Mr. Ryan 선생님</span>
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-semibold">
                <span class="material-symbols-outlined text-[12px]">admin_panel_settings</span>교사 권한
              </span>
            </div>
            <div class="flex items-center justify-end gap-1">
              <span class="font-label-sm text-[11px] text-on-surface-variant font-mono">ryan.teacher@seoul-hb.ms.kr</span>
            </div>
          </div>
          <div class="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary font-bold text-xs shadow-sm">
            <span>R</span>
          </div>
        `;
      }
    }

    // Dynamic View Rendering
    if (!this.appContainer) return;

    if (currentTab === 'dashboard') {
      this.appContainer.innerHTML = renderDashboardView();
      attachDashboardEvents(this.appContainer);
    } else if (currentTab === 'writing') {
      this.appContainer.innerHTML = renderEditorView();
      attachEditorEvents(this.appContainer);
    } else if (currentTab === 'grammar') {
      this.appContainer.innerHTML = renderGrammarView();
      attachGrammarEvents(this.appContainer);
    } else if (currentTab === 'report') {
      this.appContainer.innerHTML = renderReportView();
      attachReportEvents(this.appContainer);
    } else if (currentTab === 'teacher') {
      this.appContainer.innerHTML = renderTeacherView();
      attachTeacherEvents(this.appContainer);
    } else if (currentTab === 'sheets') {
      this.appContainer.innerHTML = renderSheetsArchiveView();
      attachSheetsArchiveEvents(this.appContainer);
    } else if (currentTab === 'school-record') {
      this.appContainer.innerHTML = renderSchoolRecordView();
      attachSchoolRecordEvents(this.appContainer);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new App();
});
