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
  needsChecking: { en: 'needs checking', ne: 'जाँच बाँकी' },
  beforeYouTrustThis: { en: 'Before you rely on this:', ne: 'भर पर्नुअघि:' },
  reportedBy: { en: 'Reported by', ne: 'स्रोत' },
  firstPaperTitle: { en: 'The First Paper', ne: 'प्रथम पत्र' },
  firstPaperLede: {
    en: 'Pick a topic and study it. The first paper is the objective paper every post sits.',
    ne: 'विषय छान्नुहोस् र अध्ययन गर्नुहोस्। प्रथम पत्र सबै पदमा हुने वस्तुगत पत्र हो।',
  },
  firstPaperNote: {
    en: 'Nayab Subba and Kharidar sit the same first paper: 50 questions of two marks in 45 minutes. The Section Officer preliminary is set differently — 100 questions of one mark in 90 minutes, it adds an English language section, and it is a screening test whose marks are not carried into the main examination. Each topic below shows which posts examine it.',
    ne: 'नायब सुब्बा र खरिदारको प्रथम पत्र एउटै हो: ४५ मिनेटमा ५० प्रश्न, प्रत्येक २ अङ्कको। शाखा अधिकृतको प्रारम्भिक परीक्षा फरक छ — ९० मिनेटमा १०० प्रश्न, प्रत्येक १ अङ्कको, अंग्रेजी भाषाको खण्ड थपिएको, र यो छनोट परीक्षा भएकाले यसको अङ्क मूल परीक्षामा जोडिँदैन। तलका प्रत्येक विषयमा कुन पदमा सोधिन्छ भन्ने देखाइएको छ।',
  },
  pickATopic: { en: 'Pick a topic and study it', ne: 'विषय छानेर अध्ययन गर्नुहोस्' },
  aboutTitle: { en: 'About this app', ne: 'यो एपबारे' },
  version: { en: 'Version', ne: 'संस्करण' },
  examsCovered: { en: 'exams covered', ne: 'परीक्षा समेटिएका' },
  aboutContentTitle: { en: 'About the content', ne: 'सामग्रीबारे' },
  notAffiliated: {
    en: 'This app is study material, not the official syllabus. It is not affiliated with or endorsed by the Public Service Commission.',
    ne: 'यो एप अध्ययन सामग्री हो, आधिकारिक पाठ्यक्रम होइन। यो लोक सेवा आयोगसँग सम्बद्ध वा त्यसबाट अनुमोदित होइन।',
  },
  aboutPrivacyTitle: { en: 'Your data', ne: 'तपाईंको डाटा' },
  aboutPrivacyBody: {
    en: 'Everything stays on this device. Uninstalling the app deletes it.',
    ne: 'सबै कुरा यही यन्त्रमा रहन्छ। एप हटाएपछि मेटिन्छ।',
  },
  privacyNoAccount: { en: 'No account and no sign-up', ne: 'खाता र दर्ता चाहिँदैन' },
  privacyNoTracking: { en: 'No analytics and no advertising', ne: 'एनालिटिक्स र विज्ञापन छैन' },
  privacyLocalOnly: { en: 'Progress is stored only on your phone', ne: 'प्रगति तपाईंकै फोनमा मात्र राखिन्छ' },
  privacyPolicy: { en: 'Privacy policy', ne: 'गोपनीयता नीति' },
  aboutContactTitle: { en: 'Get in touch', ne: 'सम्पर्क' },
  aboutContactBody: {
    en: 'Found a mistake in the material? Tell us — corrections are welcome.',
    ne: 'सामग्रीमा त्रुटि भेट्नुभयो? हामीलाई बताउनुहोस् — सुधारको सुझाव स्वागत छ।',
  },
  examinedUnder: { en: 'Examined under', ne: 'कुन खण्डमा सोधिन्छ' },
  allPosts: { en: 'All posts', ne: 'सबै पद' },
  onlyMyPaper: { en: 'Only my paper', ne: 'मेरो पत्र मात्र' },
  onYourPaper: { en: 'On your paper', ne: 'तपाईंको पत्रमा' },
  allThreePosts: { en: 'All three posts', ne: 'तीनै पद' },
  oneEntry: { en: 'entry', ne: 'सामग्री' },
  manyEntries: { en: 'entries', ne: 'सामग्री' },
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
