import type { Bilingual, Lang } from '../types';

export const UI = {
  appName: { en: 'Lok Sewa Sathi', ne: 'लोक सेवा साथी' },
  tagline: {
    en: 'Nepal civil service preparation for Adhikrit, Nayab Subba and Kharidar',
    ne: 'शाखा अधिकृत, नायब सुब्बा र खरिदारका लागि लोक सेवा तयारी',
  },
  // Navigation
  navHome: { en: 'Home', ne: 'गृहपृष्ठ' },
  navSyllabus: { en: 'Syllabus', ne: 'पाठ्यक्रम' },
  navStudy: { en: 'Study', ne: 'अध्ययन' },
  navPractice: { en: 'Practice', ne: 'अभ्यास' },
  navMock: { en: 'Mock Test', ne: 'मोडेल परीक्षा' },
  navProgress: { en: 'Progress', ne: 'प्रगति' },
  navSaved: { en: 'Saved', ne: 'सुरक्षित' },
  navAffairs: { en: 'Current Affairs', ne: 'समसामयिक' },
  // Common
  chooseLevel: { en: 'Choose your exam', ne: 'आफ्नो परीक्षा छान्नुहोस्' },
  changeLevel: { en: 'Change exam', ne: 'परीक्षा बदल्नुहोस्' },
  language: { en: 'Language', ne: 'भाषा' },
  start: { en: 'Start', ne: 'सुरु गर्नुहोस्' },
  continue: { en: 'Continue', ne: 'जारी राख्नुहोस्' },
  back: { en: 'Back', ne: 'पछाडि' },
  next: { en: 'Next', ne: 'अर्को' },
  previous: { en: 'Previous', ne: 'अघिल्लो' },
  finish: { en: 'Finish', ne: 'समाप्त' },
  submit: { en: 'Submit', ne: 'बुझाउनुहोस्' },
  cancel: { en: 'Cancel', ne: 'रद्द' },
  retry: { en: 'Try again', ne: 'फेरि प्रयास' },
  save: { en: 'Save', ne: 'सुरक्षित' },
  saved: { en: 'Saved', ne: 'सुरक्षित भयो' },
  remove: { en: 'Remove', ne: 'हटाउनुहोस्' },
  search: { en: 'Search', ne: 'खोज्नुहोस्' },
  noResults: { en: 'Nothing found.', ne: 'केही भेटिएन।' },
  minutes: { en: 'min', ne: 'मिनेट' },
  marks: { en: 'marks', ne: 'अङ्क' },
  questions: { en: 'questions', ne: 'प्रश्न' },
  lessons: { en: 'lessons', ne: 'पाठ' },
  all: { en: 'All', ne: 'सबै' },
  // Home
  welcomeBack: { en: 'Welcome back', ne: 'फेरि स्वागत छ' },
  preparingFor: { en: 'Preparing for', ne: 'तयारी गर्दै' },
  quickActions: { en: 'Quick actions', ne: 'द्रुत कार्य' },
  todaysFocus: { en: 'Today’s focus', ne: 'आजको केन्द्रबिन्दु' },
  studyNotes: { en: 'Study notes', ne: 'अध्ययन सामग्री' },
  practiceQuiz: { en: 'Practice quiz', ne: 'अभ्यास प्रश्नोत्तर' },
  fullMockTest: { en: 'Full mock test', ne: 'पूर्ण मोडेल परीक्षा' },
  examPattern: { en: 'Exam pattern', ne: 'परीक्षा ढाँचा' },
  // Syllabus
  paper: { en: 'Paper', ne: 'पत्र' },
  papers: { en: 'papers', ne: 'पत्र' },
  fullMarks: { en: 'Full marks', ne: 'पूर्णाङ्क' },
  passMarks: { en: 'Pass marks', ne: 'उत्तीर्णाङ्क' },
  duration: { en: 'Duration', ne: 'अवधि' },
  format: { en: 'Format', ne: 'किसिम' },
  objective: { en: 'Objective', ne: 'वस्तुगत' },
  subjective: { en: 'Subjective', ne: 'विषयगत' },
  mixed: { en: 'Mixed', ne: 'मिश्रित' },
  pattern: { en: 'Question pattern', ne: 'प्रश्न ढाँचा' },
  topicsCovered: { en: 'Topics', ne: 'विषयवस्तु' },
  studyThis: { en: 'Study this section', ne: 'यो खण्ड पढ्नुहोस्' },
  minQualification: { en: 'Minimum qualification', ne: 'न्यूनतम योग्यता' },
  // Study
  subjects: { en: 'Subjects', ne: 'विषयहरू' },
  readTime: { en: 'read', ne: 'पढ्न लाग्ने समय' },
  keyPoint: { en: 'Key point', ne: 'मुख्य बुँदा' },
  tip: { en: 'Tip', ne: 'सुझाव' },
  watchOut: { en: 'Watch out', ne: 'होसियार' },
  practiceThisSubject: { en: 'Practice this subject', ne: 'यो विषय अभ्यास गर्नुहोस्' },
  noLessonsYet: { en: 'No notes for this subject at your level yet.', ne: 'तपाईंको तहमा यस विषयका पाठ अहिलेसम्म छैनन्।' },
  // Quiz
  question: { en: 'Question', ne: 'प्रश्न' },
  of: { en: 'of', ne: '/' },
  correct: { en: 'Correct', ne: 'सही' },
  wrong: { en: 'Wrong', ne: 'गलत' },
  skipped: { en: 'Skipped', ne: 'छाडिएको' },
  explanation: { en: 'Explanation', ne: 'व्याख्या' },
  yourAnswer: { en: 'Your answer', ne: 'तपाईंको उत्तर' },
  correctAnswer: { en: 'Correct answer', ne: 'सही उत्तर' },
  skipQuestion: { en: 'Skip', ne: 'छाड्नुहोस्' },
  selectSubject: { en: 'Select a subject', ne: 'विषय छान्नुहोस्' },
  mixedPractice: { en: 'Mixed practice', ne: 'मिश्रित अभ्यास' },
  noQuestions: { en: 'No questions available for this selection.', ne: 'यो छनोटका लागि प्रश्न उपलब्ध छैन।' },
  // Mock
  mockIntro: { en: 'Timed test in the real exam pattern', ne: 'वास्तविक परीक्षा ढाँचामा समयबद्ध परीक्षा' },
  negativeMarking: { en: 'Negative marking', ne: 'ऋणात्मक अङ्क' },
  perWrongAnswer: { en: 'per wrong answer', ne: 'प्रति गलत उत्तर' },
  timeLeft: { en: 'Time left', ne: 'बाँकी समय' },
  timeUp: { en: 'Time is up.', ne: 'समय सकियो।' },
  submitTest: { en: 'Submit test', ne: 'परीक्षा बुझाउनुहोस्' },
  confirmSubmit: { en: 'Submit the test now?', ne: 'अहिले नै परीक्षा बुझाउने?' },
  reviewAnswers: { en: 'Review answers', ne: 'उत्तर समीक्षा' },
  // Result
  result: { en: 'Result', ne: 'नतिजा' },
  score: { en: 'Score', ne: 'प्राप्ताङ्क' },
  accuracy: { en: 'Accuracy', ne: 'शुद्धता' },
  passed: { en: 'Passed', ne: 'उत्तीर्ण' },
  failed: { en: 'Not passed', ne: 'अनुत्तीर्ण' },
  timeTaken: { en: 'Time taken', ne: 'लागेको समय' },
  backToHome: { en: 'Back to home', ne: 'गृहपृष्ठमा फर्कनुहोस्' },
  // Progress
  overview: { en: 'Overview', ne: 'सिंहावलोकन' },
  totalAttempts: { en: 'Attempts', ne: 'प्रयास' },
  questionsAttempted: { en: 'Questions attempted', ne: 'प्रयास गरिएका प्रश्न' },
  overallAccuracy: { en: 'Overall accuracy', ne: 'समग्र शुद्धता' },
  bySubject: { en: 'By subject', ne: 'विषयगत' },
  recentAttempts: { en: 'Recent attempts', ne: 'हालका प्रयास' },
  noAttempts: { en: 'No attempts yet. Start a practice quiz to see your progress here.', ne: 'अहिलेसम्म कुनै प्रयास छैन। प्रगति हेर्न अभ्यास प्रश्नोत्तर सुरु गर्नुहोस्।' },
  clearProgress: { en: 'Clear all progress', ne: 'सबै प्रगति मेटाउनुहोस्' },
  confirmClear: { en: 'This will delete all your attempts and bookmarks on this device. Continue?', ne: 'यसले यस यन्त्रमा भएका सबै प्रयास र सुरक्षित सामग्री मेटाउँछ। जारी राख्ने?' },
  // Bookmarks
  savedQuestions: { en: 'Saved questions', ne: 'सुरक्षित प्रश्न' },
  savedLessons: { en: 'Saved notes', ne: 'सुरक्षित पाठ' },
  savedItems: { en: 'items saved', ne: 'सामग्री सुरक्षित' },
  nothingSaved: { en: 'Nothing saved yet. Use the bookmark button on a note or a question.', ne: 'अहिलेसम्म केही सुरक्षित छैन। पाठ वा प्रश्नमा रहेको बुकमार्क बटन प्रयोग गर्नुहोस्।' },
  // Notices
  syllabusNotice: { en: 'About this syllabus', ne: 'यो पाठ्यक्रमबारे' },
  offlineReady: { en: 'Works offline once loaded', ne: 'एकपटक खुलेपछि अफलाइन चल्छ' },
} satisfies Record<string, Bilingual>;

export type UiKey = keyof typeof UI;

export function t(key: UiKey, lang: Lang): string {
  return UI[key][lang];
}

export function pick(value: Bilingual, lang: Lang): string {
  return value[lang];
}

/** Convert ASCII digits in a string to Devanagari digits for Nepali display. */
const NE_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function localiseNumber(value: number | string, lang: Lang): string {
  const text = String(value);
  if (lang !== 'ne') return text;
  return text.replace(/[0-9]/g, (d) => NE_DIGITS[Number(d)]);
}
