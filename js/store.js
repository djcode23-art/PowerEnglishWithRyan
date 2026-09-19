/**
 * Comprehensive State Store for AI English Writing & Speaking Platform
 * Single Source of Truth for Student Learning Process, Teacher Console, Google Sheets Archive & School Record Generator
 */

const STORAGE_KEY = 'lingua_write_master_store_v2';

const defaultState = {
  currentUser: {
    role: 'student', // 'student' | 'teacher'
    id: '30215',
    name: '이민서',
    email: 'minseo.lee@seoul-hb.ms.kr',
    school: '서울행복중학교',
    gradeClass: '3학년 2반 15번',
    cefr: 'CEFR B2'
  },
  
  currentTab: 'dashboard', // 'dashboard' | 'writing' | 'grammar' | 'report' | 'teacher' | 'sheets' | 'school-record'
  selectedTaskId: 'task-101',
  selectedSessionId: 'sess-02',

  // Tasks & Multi-Session Hierarchies
  tasks: [
    {
      id: 'task-101',
      title: 'Artificial Intelligence in Modern Classrooms (인공지능 윤리와 교육적 활용)',
      type: 'Writing & Speaking',
      category: 'Assigned',
      assignedClass: '3학년 2반 영어집중반',
      dueDate: '2025-03-05',
      targetWords: 200,
      description: 'AI 튜터의 교육적 순기능과 비판적 사고력 약화라는 양날의 검을 비교 대조하고, 학습자 주도성에 대한 자신의 견해를 3단 논증 구조로 서술 및 낭독하시오.',
      learningObjectives: ['B2 학술 연결사 활용', '복합 문맥의 관계대명사 계속적 용법 구사', '발화 유창성 및 정서적 설득력 강화'],
      aiFeedbackCategories: ['Task Achievement', 'Coherence', 'Grammar Accuracy', 'Fluency'],
      status: 'in_progress', // 'in_progress' | 'submitted' | 'completed'
      sessions: [
        {
          id: 'sess-01',
          order: 1,
          title: '차시 1: 브레인스토밍 및 개요 작성 (Idea Generation)',
          type: 'Writing',
          isCandidate: false,
          status: 'completed',
          content: `Main Arguments:
1. Introduction: AI as an emerging educational tool (individualized pace).
2. Body Paragraph: Benefits (personalized feedback) vs Risks (cognitive dependency, lack of genuine empathy).
3. Conclusion: Humans must retain ethical ownership.`,
          wordCount: 35,
          lastSaved: '2025.02.24 10:15'
        },
        {
          id: 'sess-02',
          order: 2,
          title: '차시 2: 본문 초안 작성 및 필기 OCR (First Draft & OCR)',
          type: 'Writing & Handwriting',
          isCandidate: true, // ★ School Record Candidate
          status: 'in_progress',
          content: `Artificial intelligence has rapidly entered our classrooms, fundamentally transforming the traditional educational landscape. Supporters highlight that AI tutors can provide personalized, on-demand explanations tailored to each learner’s specific pace. For example, language learners can immediately receive grammar feedback without feeling intimidated or judged by peers.

However, this transformative technology must be recognized as a double-edged sword. When students excessively depend on automated generators to formulate critical essays, they risk diminishing their own original cognitive reasoning and analytical faculties. Furthermore, algorithmic feedback, no matter how sophisticated, cannot replicate the genuine emotional empathy and moral mentorship provided by human educators.

Therefore, we should not blindly reject AI nor unconditionally succumb to it. Instead, learners must approach it as an analytical thought companion while maintaining active ownership over their ethical judgment and expressive voice.`,
          wordCount: 139,
          estimatedCefr: 'B2',
          lastSaved: '방금 전 자동 저장됨',
          revisions: [
            { version: 1, time: '13:02', note: '초안 작성 (110단어)', words: 110 },
            { version: 2, time: '13:08', note: '교사 코멘트 반영 및 공감 멘토링 논거 추가', words: 139 }
          ],
          aiChat: [
            {
              sender: 'student',
              time: '13:05',
              message: "Mr. Ryan 선생님께서 'emotional empathy' 관련 1문장을 더 뒷받침하라고 하셨는데, 어떤 근거가 효과적일까?"
            },
            {
              sender: 'ai',
              time: '13:05',
              message: "💡 [AI Writing Coach]: 훌륭한 질문입니다! AI 알고리즘은 데이터를 분석할 수는 있지만, 학생의 불안감을 헤아리거나 가치관을 형성해주는 '인간적 교감(human connection)'은 불가능하다는 점을 대조해 보세요. 'cannot replicate...' 구문을 활용해볼 수 있습니다."
            }
          ],
          teacherComments: [
            {
              id: 'tc-01',
              author: 'Mr. Ryan',
              time: '13:04',
              targetText: 'cannot replicate the genuine emotional empathy and moral mentorship provided by human educators',
              comment: "민서 학생, 'emotional empathy' 표현 선정이 아주 훌륭합니다! 인간 교사와의 상호작용 가치를 1문장 더 보강해보세요.",
              replies: [
                { author: '이민서', time: '13:07', text: '네 선생님! 2문단 후반부에 도덕적 멘토링과 공감 능력의 대체 불가능성을 구체화하여 반영했습니다.' }
              ],
              isResolved: true
            }
          ],
          reflection: {
            check1: true,
            check2: true,
            check3: true,
            comparisonNote: '초안에서는 AI의 편리함만 나열했으나, Mr. Ryan 선생님의 피드백을 수용하여 2문단에 AI 과의존에 따른 인지적 추론 능력 저하와 인간 교사의 정서적 멘토링 가치를 대조하는 심층 논거를 추가 보강함.'
          }
        },
        {
          id: 'sess-03',
          order: 3,
          title: '차시 3: 문법 미니랩 & 클리닉 (Grammar Mini Lab)',
          type: 'Grammar',
          isCandidate: true, // ★ Candidate
          status: 'completed',
          grammarTopic: '관계대명사 계속적 용법 & 분사구문 능동/수동',
          score: 28,
          xpEarned: 28
        },
        {
          id: 'sess-04',
          order: 4,
          title: '차시 4: 최종 수정 및 동료/교사 검토 (Final Revision)',
          type: 'Writing',
          isCandidate: true,
          status: 'in_progress',
          content: ''
        },
        {
          id: 'sess-05',
          order: 5,
          title: '차시 5: 낭독 발화 녹음 및 메타인지 총괄 성찰 (Speaking & Reflection)',
          type: 'Speaking & Reflection',
          isCandidate: true,
          status: 'in_progress',
          transcript: `Artificial intelligence has rapidly entered our classrooms fundamentally transforming the traditional educational landscape...`,
          fluencyScore: 92,
          wpm: 128
        }
      ]
    },
    {
      id: 'task-102',
      title: 'Climate Change & Global Youth Action (기후변화와 청소년 행동)',
      type: 'Writing',
      category: 'Assigned',
      assignedClass: '3학년 2반 영어집중반',
      dueDate: '2025-03-12',
      targetWords: 180,
      description: '기후위기에 대응하는 세계 청소년들의 연대 활동을 조사하고, 실천 방안을 제안하는 설명문 작성.',
      status: 'not_started',
      sessions: [
        { id: 'sess-201', order: 1, title: '차시 1: 자료 수집 및 어휘 탐색', status: 'not_started', isCandidate: false }
      ]
    },
    {
      id: 'task-p01',
      title: 'My Favorite Dystopian Novel: 1984 (자율 연습 과업)',
      type: 'Personal Writing',
      category: 'Personal',
      assignedClass: '개인 자율',
      dueDate: '자율 기한',
      targetWords: 150,
      description: '조지 오웰의 소설 1984를 읽고 감상 및 현대 정보사회에 주는 시사점 작성.',
      status: 'in_progress',
      sessions: [
        { id: 'sess-p01', order: 1, title: '차시 1: 독서 감상문 초안', status: 'in_progress', isCandidate: false }
      ]
    }
  ],

  // Grammar Mini-Lab State
  grammarLab: {
    currentChallengeIndex: 0,
    score: 28,
    progress: 2,
    challenges: [
      {
        id: 'g1',
        title: '관계대명사 계속적 용법의 선행사 수일치',
        level: 'LEVEL 1 · 기초 통달',
        description: '다음 문장에서 밑줄 친 주어 절과 콤마 뒤 계속적 용법 관계대명사절의 동사 형태를 올바르게 선택하세요.',
        sentence: 'The new educational software programs, which [ provide / provides ] customized feedback, have proven effective.',
        options: ['provide (복수 선행사 software programs에 일치)', 'provides (단수 취급)'],
        correctIndex: 0,
        explanation: "선행사가 복수명사인 'software programs'이므로 계속적 용법 관계대명사 which 뒤에는 복수동사 provide가 와야 합니다.",
        userAnswer: 0,
        isCompleted: true
      },
      {
        id: 'g2',
        title: '분사구문 능동(현재분사) vs 수동(과거분사) 판별',
        level: 'LEVEL 2 · 집중 훈련',
        description: '주절의 주어(students)와의 의미상 관계를 고려하여 알맞은 분사 형태를 고르세요.',
        sentence: '[ Recognizing / Recognized ] the potential pitfalls of AI, students must maintain critical ownership.',
        options: ['Recognizing (주어인 students가 능동적으로 인식함)', 'Recognized (수동태 피동)'],
        correctIndex: 0,
        explanation: '문장의 주어인 students가 AI의 위험성을 직접 인식(recognize)하는 능동 관계이므로 현재분사 Recognizing이 적절합니다.',
        userAnswer: 0,
        isCompleted: true
      },
      {
        id: 'g3',
        title: '양보 접속사 vs 전치사 구문 (Although vs Despite)',
        level: 'LEVEL 3 · 심화 적용',
        description: '절(Subject + Verb)이 이어지는 문맥에 적합한 연결사를 고르세요.',
        sentence: '[ Although / Despite ] AI algorithms are advancing rapidly, human empathy remains irreplaceable.',
        options: ['Although (접속사 + 절)', 'Despite (전치사 + 명사구)'],
        correctIndex: 0,
        explanation: "'AI algorithms are advancing rapidly'라는 완전한 절이 뒤따르므로 접속사 Although를 사용해야 합니다.",
        userAnswer: null,
        isCompleted: false
      }
    ]
  },

  // 5-Core Competency Radar & Longitudinal Stats
  competencyStats: {
    vocabulary: 88,
    grammar: 85,
    cohesion: 92,
    fluency: 84,
    taskCompletion: 90,
    overallScore: 88.4,
    cefrTrack: 'B2 Proficient',
    trend: '+6.2점 상승',
    summativeFeedback: {
      claim: "어휘 다양성과 논리적 연결 구조(Cohesion)에서 탁월한 성장을 보이고 있으며, 교사 피드백을 수용하여 논거를 구체화하는 메타인지적 자기수정 능력이 우수함.",
      evidences: [
        "Task 101 Session 2: 교사 코멘트 반영 후 감정적 공감 관련 문장 재작성으로 응집성 92점 달성",
        "Grammar Mini Lab: 분사구문 및 관계사 수일치 챌린지 100% 정답률 기록",
        "Speaking Session 5: WPM 128 속도의 안정적 낭독 및 CEFR B2 발화 완성"
      ],
      nextStep: "다음 과업에서는 반대 관점(Counter-argument)에 대한 구체적 반박 논리를 심화하고, 관계대명사 절을 다채롭게 응용해보세요."
    }
  },

  // Class Roster for Teacher Console
  classRoster: [
    { id: '30215', name: '이민서', status: 'submitted', score: 94, cefr: 'B2', words: 184, reflectionDone: true, time: '13:10', aiFlag: '우수', candidateSessions: ['sess-02', 'sess-03', 'sess-05'] },
    { id: '30201', name: '강동원', status: 'submitted', score: 88, cefr: 'B1+', words: 172, reflectionDone: true, time: '13:05', aiFlag: '양호', candidateSessions: ['sess-02'] },
    { id: '30202', name: '김하은', status: 'submitted', score: 91, cefr: 'B2', words: 195, reflectionDone: true, time: '13:08', aiFlag: '우수', candidateSessions: ['sess-02', 'sess-05'] },
    { id: '30203', name: '박준서', status: 'writing', score: 76, cefr: 'B1', words: 120, reflectionDone: false, time: '작성 중', aiFlag: '문법지도 필요', candidateSessions: [] },
    { id: '30204', name: '서유진', status: 'writing', score: 82, cefr: 'B1+', words: 145, reflectionDone: false, time: '작성 중', aiFlag: '양호', candidateSessions: ['sess-02'] },
    { id: '30205', name: '이지훈', status: 'not_started', score: 0, cefr: 'A2', words: 0, reflectionDone: false, time: '미착수', aiFlag: '집중관리', candidateSessions: [] },
    { id: '30206', name: '정예린', status: 'submitted', score: 96, cefr: 'C1', words: 210, reflectionDone: true, time: '12:58', aiFlag: '최우수', candidateSessions: ['sess-02', 'sess-04', 'sess-05'] },
    { id: '30207', name: '최현우', status: 'submitted', score: 85, cefr: 'B1+', words: 168, reflectionDone: true, time: '13:12', aiFlag: '양호', candidateSessions: ['sess-02'] }
  ],

  // Google Sheets Live Archive State
  sheetsArchive: {
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    spreadsheetTitle: '2025학년도_3학년2반_영어쓰기말하기_실시간아카이브',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    lastSyncTime: '방금 전 (자동 실시간 동기화 완료)',
    syncStatus: 'synced', // 'synced' | 'syncing' | 'error'
    totalSyncedRows: 28,
    sheets: ['Summary_학급종합', 'Tasks_과업세부', 'Reflections_성찰일지', 'SchoolRecords_생기부초안']
  },

  // School Record (생활기록부) Generator State
  schoolRecordState: {
    selectedStudentId: '30215',
    selectedSessionIds: ['sess-02', 'sess-03', 'sess-05'],
    generatedDrafts: [
      {
        version: 1,
        time: '2025.02.26 13:20',
        author: 'Mr. Ryan & AI Co-Author',
        selectedSessions: ['sess-02', 'sess-03', 'sess-05'],
        statement: '영어 논증문 작성 활동에서 인공지능 기술의 교육적 순기능과 부작용을 다각도로 분석함. 초안 작성 후 교사의 첨삭 지도를 수용하여 인간 교사의 정서적 공감 및 도덕적 멘토링 역할을 대비시키는 구체적 논거를 능동적으로 보강함. 문법 클리닉 과정에서 관계대명사 계속적 용법과 분사구문의 능·수동 관계를 정확히 이해하고 본문에 즉시 적용하였으며, 완성된 에세이를 명료한 발음과 유창한 어조로 낭독하여 설득력 높은 구술 발표를 완수함.',
        traces: [
          { sentence: '인공지능 기술의 교육적 순기능과 부작용을 다각도로 분석함', source: 'Task 101 - Session 2 First Draft' },
          { sentence: '교사의 첨삭 지도를 수용하여 인간 교사의 정서적 공감 및 도덕적 멘토링 역할을 대비시키는 구체적 논거를 능동적으로 보강함', source: 'Teacher Comment #01 & Revision v2' },
          { sentence: '문법 클리닉 과정에서 관계대명사 계속적 용법과 분사구문의 능·수동 관계를 정확히 이해하고 본문에 즉시 적용하였으며', source: 'Grammar Mini Lab Level 1-2 Pass' },
          { sentence: '완성된 에세이를 명료한 발음과 유창한 어조로 낭독하여 설득력 높은 구술 발표를 완수함', source: 'Speaking Session 5 Transcript & Fluency 92' }
        ]
      }
    ],
    isFinalApproved: false
  }
};

class MasterStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
    this.notify();
  }

  getState() {
    return this.state;
  }

  setState(updater) {
    if (typeof updater === 'function') {
      this.state = updater(this.state);
    } else {
      this.state = { ...this.state, ...updater };
    }
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Navigation
  switchTab(tabName) {
    this.setState(s => ({ ...s, currentTab: tabName }));
  }

  switchRole(role) {
    this.setState(s => ({
      ...s,
      currentUser: { ...s.currentUser, role },
      currentTab: role === 'teacher' ? 'teacher' : 'dashboard'
    }));
  }

  selectTask(taskId, sessionId = null) {
    this.setState(s => {
      const task = s.tasks.find(t => t.id === taskId);
      const targetSessId = sessionId || (task && task.sessions[0] ? task.sessions[0].id : null);
      return {
        ...s,
        selectedTaskId: taskId,
        selectedSessionId: targetSessId,
        currentTab: 'writing'
      };
    });
  }

  selectSession(sessionId) {
    this.setState(s => ({ ...s, selectedSessionId: sessionId }));
  }

  // Writing & Session Update
  updateCurrentSessionContent(newContent) {
    this.setState(s => {
      const words = newContent.trim().split(/\s+/).filter(w => w.length > 0).length;
      let cefr = 'B1';
      if (words > 180) cefr = 'B2+';
      else if (words > 120) cefr = 'B2';
      else if (words > 60) cefr = 'B1';
      else cefr = 'A2';

      const updatedTasks = s.tasks.map(t => {
        if (t.id === s.selectedTaskId) {
          return {
            ...t,
            sessions: t.sessions.map(sess => {
              if (sess.id === s.selectedSessionId) {
                return {
                  ...sess,
                  content: newContent,
                  wordCount: words,
                  estimatedCefr: cefr,
                  lastSaved: '방금 전 자동 저장됨'
                };
              }
              return sess;
            })
          };
        }
        return t;
      });

      return {
        ...s,
        tasks: updatedTasks
      };
    });
  }

  // AI Chat (Current Task Context)
  addAIChatMessage(userMsg, aiReply) {
    this.setState(s => {
      const updatedTasks = s.tasks.map(t => {
        if (t.id === s.selectedTaskId) {
          return {
            ...t,
            sessions: t.sessions.map(sess => {
              if (sess.id === s.selectedSessionId) {
                const prev = sess.aiChat || [];
                return {
                  ...sess,
                  aiChat: [
                    ...prev,
                    { sender: 'student', time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }), message: userMsg },
                    { sender: 'ai', time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }), message: aiReply }
                  ]
                };
              }
              return sess;
            })
          };
        }
        return t;
      });
      return { ...s, tasks: updatedTasks };
    });
  }

  // Teacher Comments
  addCommentReply(commentId, replyText) {
    this.setState(s => {
      const updatedTasks = s.tasks.map(t => {
        if (t.id === s.selectedTaskId) {
          return {
            ...t,
            sessions: t.sessions.map(sess => {
              if (sess.id === s.selectedSessionId && sess.teacherComments) {
                return {
                  ...sess,
                  teacherComments: sess.teacherComments.map(c => {
                    if (c.id === commentId) {
                      return {
                        ...c,
                        replies: [...c.replies, { author: s.currentUser.name, time: '방금 전', text: replyText }]
                      };
                    }
                    return c;
                  })
                };
              }
              return sess;
            })
          };
        }
        return t;
      });
      return { ...s, tasks: updatedTasks };
    });
  }

  // Grammar Lab
  answerGrammarQuiz(challengeIndex, answerIndex) {
    this.setState(s => {
      const challenges = [...s.grammarLab.challenges];
      const target = { ...challenges[challengeIndex] };
      target.userAnswer = answerIndex;
      target.isCompleted = true;
      challenges[challengeIndex] = target;
      const completedCount = challenges.filter(c => c.isCompleted).length;

      return {
        ...s,
        grammarLab: {
          ...s.grammarLab,
          challenges,
          progress: completedCount,
          score: s.grammarLab.score + (answerIndex === target.correctIndex ? 10 : 0)
        }
      };
    });
  }

  // Google Sheets Manual Sync
  syncGoogleSheets() {
    this.setState(s => ({
      ...s,
      sheetsArchive: {
        ...s.sheetsArchive,
        syncStatus: 'syncing'
      }
    }));

    setTimeout(() => {
      this.setState(s => ({
        ...s,
        sheetsArchive: {
          ...s.sheetsArchive,
          syncStatus: 'synced',
          lastSyncTime: '방금 전 (' + new Date().toLocaleTimeString('ko-KR') + ' 수동 동기화 완료)'
        }
      }));
    }, 1200);
  }

  // School Record Generator
  generateSchoolRecordDraft(studentId, selectedSessionIds) {
    const student = this.state.classRoster.find(st => st.id === studentId) || { name: '이민서' };
    const newDraft = {
      version: this.state.schoolRecordState.generatedDrafts.length + 1,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      author: 'Mr. Ryan & AI Co-Author',
      selectedSessions: selectedSessionIds,
      statement: `${student.name} 학생은 영어 논증문 작성 과업에서 AI 튜터의 장단점을 다각도로 탐구하고, 교사의 피드백을 적극 수용하여 인간 교사의 정서적 공감 및 윤리적 멘토링 역할을 대비시키는 논거를 설득력 있게 재구성함. 문법 클리닉을 통해 계속적 용법 관계사와 분사구문 능·수동 규칙을 완벽히 습득하여 본문에 적용하였으며, 메타인지 성찰을 통해 자기주도적 글쓰기 역량을 크게 신장함.`,
      traces: [
        { sentence: '인간 교사의 정서적 공감 및 윤리적 멘토링 역할을 대비시키는 논거를 설득력 있게 재구성함', source: 'Teacher Comment #01 & Revision v2' },
        { sentence: '문법 클리닉을 통해 계속적 용법 관계사와 분사구문 능·수동 규칙을 완벽히 습득하여 본문에 적용하였으며', source: 'Grammar Mini Lab Challenge Completed' },
        { sentence: '메타인지 성찰을 통해 자기주도적 글쓰기 역량을 크게 신장함', source: 'Metacognition Log 100% Completed' }
      ]
    };

    this.setState(s => ({
      ...s,
      schoolRecordState: {
        ...s.schoolRecordState,
        selectedStudentId: studentId,
        selectedSessionIds,
        generatedDrafts: [newDraft, ...s.schoolRecordState.generatedDrafts]
      }
    }));
  }
}

export const store = new MasterStore();
