import type { Subject } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'gk-nepal',
    name: { en: 'Nepal — Geography, History and Society', ne: 'नेपाल — भूगोल, इतिहास र समाज' },
    short: { en: 'Nepal GK', ne: 'नेपाल सामान्य ज्ञान' },
    icon: '🏔️',
    description: {
      en: 'Physical and political geography, unification to republic, demography, culture and heritage.',
      ne: 'भौतिक तथा राजनीतिक भूगोल, एकीकरणदेखि गणतन्त्रसम्म, जनसांख्यिकी, संस्कृति र सम्पदा।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'constitution',
    name: { en: 'Constitution of Nepal', ne: 'नेपालको संविधान' },
    short: { en: 'Constitution', ne: 'संविधान' },
    icon: '⚖️',
    description: {
      en: 'Constitution of Nepal 2072: rights, duties, state structure, organs of state and constitutional bodies.',
      ne: 'नेपालको संविधान २०७२: हक, कर्तव्य, राज्य संरचना, राज्यका अंग र संवैधानिक निकाय।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'governance',
    name: { en: 'Governance and Public Administration', ne: 'शासन व्यवस्था र सार्वजनिक प्रशासन' },
    short: { en: 'Governance', ne: 'शासन व्यवस्था' },
    icon: '🏛️',
    description: {
      en: 'Federalism, good governance, public management, service delivery and administrative reform.',
      ne: 'संघीयता, सुशासन, सार्वजनिक व्यवस्थापन, सेवा प्रवाह र प्रशासनिक सुधार।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'office-mgmt',
    name: { en: 'Office Management and Service Law', ne: 'कार्यालय व्यवस्थापन र सेवा सम्बन्धी कानून' },
    short: { en: 'Office Mgmt', ne: 'कार्यालय व्यवस्थापन' },
    icon: '🗂️',
    description: {
      en: 'Office procedure, registration and dispatch, filing, note writing, correspondence and the Civil Service Act.',
      ne: 'कार्यालय कार्यविधि, दर्ता–चलानी, फाइलिङ, टिप्पणी लेखन, पत्राचार र निजामती सेवा ऐन।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'dev-economy',
    name: { en: 'Economy, Development and Environment', ne: 'अर्थतन्त्र, विकास र वातावरण' },
    short: { en: 'Economy', ne: 'अर्थतन्त्र' },
    icon: '📈',
    description: {
      en: 'Economic structure, budget, periodic plans, SDGs, poverty, climate and disaster management.',
      ne: 'आर्थिक संरचना, बजेट, आवधिक योजना, दिगो विकास लक्ष्य, गरिबी, जलवायु र विपद् व्यवस्थापन।',
    },
    levels: ['adhikrit', 'nayabsubba'],
  },
  {
    id: 'bost',
    name: { en: 'Basic Office Skills Test', ne: 'आधारभुत कार्यालय सीप परीक्षण' },
    short: { en: 'Office Skills', ne: 'कार्यालय सीप' },
    icon: '🗃️',
    description: {
      en: 'The ten question types of the Kharidar preliminary: verification, completion, classification, analogy, filing aptitude, following instructions, numerical reasoning, coding and matching, analytical reasoning, and direction and distance.',
      ne: 'खरिदार प्रारम्भिक परीक्षाका दस किसिमका प्रश्न: रुजु, क्रम पुरा, वर्गीकरण, सम्बन्ध, फाइलिङ अभिरुचि, निर्देशन अनुसरण, संख्यात्मक चातुर्य, कोडिङ र भिडान, विश्लेषणात्मक तार्किकता, र दिशा तथा दुरी।',
    },
    levels: ['kharidar'],
  },
  {
    id: 'maths',
    name: { en: 'General Mathematics', ne: 'सामान्य गणित' },
    short: { en: 'Mathematics', ne: 'गणित' },
    icon: '🧮',
    description: {
      en: 'Unitary method, fractions and percentage, profit and loss, tax and depreciation, interest, average, household bills and currency, and mensuration.',
      ne: 'ऐकिक नियम, भिन्न र प्रतिशत, नाफा–नोक्सान, कर र ह्रासकट्टी, ब्याज, औसत, घरायसी महसुल र मुद्रा, तथा क्षेत्रमिति।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'iq',
    name: { en: 'General Intelligence Test', ne: 'सामान्य बौद्धिकता परीक्षण' },
    short: { en: 'IQ', ne: 'बौद्धिकता' },
    icon: '🧩',
    description: {
      en: 'Series, coding-decoding, analogy, blood relations, direction and quick arithmetic reasoning.',
      ne: 'शृंखला, कोडिङ-डिकोडिङ, समानता, नाता सम्बन्ध, दिशा र द्रुत अंकगणितीय तर्क।',
    },
    levels: ['nayabsubba', 'kharidar'],
  },
  {
    id: 'gk-world',
    name: { en: 'World Affairs and General Science', ne: 'अन्तर्राष्ट्रिय मामिला र सामान्य विज्ञान' },
    short: { en: 'World & Science', ne: 'विश्व र विज्ञान' },
    icon: '🌍',
    description: {
      en: 'International organisations, Nepal’s foreign relations, world geography and everyday science.',
      ne: 'अन्तर्राष्ट्रिय संघसंस्था, नेपालको परराष्ट्र सम्बन्ध, विश्व भूगोल र दैनिक विज्ञान।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'nepali',
    name: { en: 'Nepali Language', ne: 'नेपाली भाषा' },
    short: { en: 'Nepali', ne: 'नेपाली' },
    icon: '📖',
    description: {
      en: 'Grammar, spelling, sandhi and samas, idioms and proverbs, and official Nepali writing.',
      ne: 'व्याकरण, हिज्जे, सन्धि र समास, उखान–टुक्का र कार्यालयी नेपाली लेखन।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'english',
    name: { en: 'English Language', ne: 'अंग्रेजी भाषा' },
    short: { en: 'English', ne: 'अंग्रेजी' },
    icon: '🔤',
    description: {
      en: 'Grammar, vocabulary, comprehension and formal writing used in the civil service.',
      ne: 'निजामती सेवामा प्रयोग हुने व्याकरण, शब्दभण्डार, बोधन र औपचारिक लेखन।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'ict',
    name: { en: 'Computer and Information Technology', ne: 'कम्प्युटर र सूचना प्रविधि' },
    short: { en: 'ICT', ne: 'सूचना प्रविधि' },
    icon: '💻',
    description: {
      en: 'Computer fundamentals, office software, internet, e-governance and cyber security.',
      ne: 'कम्प्युटरको आधारभूत ज्ञान, कार्यालय सफ्टवेयर, इन्टरनेट, विद्युतीय सुशासन र साइबर सुरक्षा।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
  {
    id: 'current-affairs',
    name: { en: 'Contemporary Issues', ne: 'समसामयिक विषय' },
    short: { en: 'Current Affairs', ne: 'समसामयिक' },
    icon: '📰',
    description: {
      en: 'Recent national and international developments that examiners keep returning to.',
      ne: 'परीक्षकले पटक-पटक सोध्ने पछिल्ला राष्ट्रिय तथा अन्तर्राष्ट्रिय घटनाक्रम।',
    },
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
  },
];

export const SUBJECT_BY_ID: Record<string, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
);
