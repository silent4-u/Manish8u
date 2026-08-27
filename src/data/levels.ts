import type { ExamLevel } from '../types';

/**
 * Exam patterns follow the Public Service Commission (Lok Sewa Aayog) syllabus
 * for the Administration Service. The commission revises syllabi from time to
 * time, so `SYLLABUS_REVISION_NOTE` is shown wherever this data is displayed.
 */
export const SYLLABUS_REVISION_NOTE = {
  en: 'Marks, timing and topics follow the published Public Service Commission syllabus for the Administration Service. Always confirm against the latest notice on psc.gov.np before your exam.',
  ne: 'अङ्कभार, समय र विषयवस्तु लोक सेवा आयोगको प्रशासन सेवाको प्रकाशित पाठ्यक्रम अनुसार राखिएको हो। परीक्षा दिनुअघि psc.gov.np मा प्रकाशित पछिल्लो सूचनासँग अनिवार्य रूपमा भिडाउनुहोस्।',
};

export const LEVELS: ExamLevel[] = [
  {
    id: 'adhikrit',
    name: { en: 'Section Officer (Adhikrit)', ne: 'शाखा अधिकृत' },
    shortName: { en: 'Officer', ne: 'अधिकृत' },
    grade: { en: 'Gazetted Third Class, Administration Service', ne: 'राजपत्रांकित तृतीय श्रेणी, प्रशासन सेवा' },
    summary: {
      en: 'The entry level officer post. Three written papers covering general awareness and contemporary issues, the governance system, and service related subjects, followed by an interview.',
      ne: 'अधिकृतस्तरको प्रवेश तह। सामान्य जानकारी तथा समसामयिक विषय, शासन प्रणाली र सेवा सम्बन्धी गरी तीन लिखित पत्र र त्यसपछि अन्तर्वार्ता हुन्छ।',
    },
    accent: '#c0392b',
    icon: '🏛️',
    minQualification: {
      en: "Bachelor's degree from a recognised university.",
      ne: 'मान्यताप्राप्त विश्वविद्यालयबाट स्नातक उत्तीर्ण।',
    },
    mock: { questionCount: 40, durationMinutes: 30, marksPerQuestion: 1, negativePerWrong: 0.2, passPercent: 40 },
    papers: [
      {
        id: 'adhikrit-p1',
        name: { en: 'Paper I — General Awareness and Contemporary Issues', ne: 'प्रथम पत्र — सामान्य जानकारी तथा समसामयिक विषय' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 45,
        format: 'objective',
        pattern: { en: '100 multiple choice questions × 1 mark', ne: '१०० वस्तुगत बहुवैकल्पिक प्रश्न × १ अङ्क' },
        sections: [
          {
            id: 'adhikrit-p1-s1',
            name: { en: 'Geography, History, Culture and Society of Nepal', ne: 'नेपालको भूगोल, इतिहास, संस्कृति र समाज' },
            marks: 25,
            subjectIds: ['gk-nepal'],
            topics: [
              { en: 'Physical, climatic and natural regions of Nepal; rivers, lakes and protected areas', ne: 'नेपालको भौतिक, हावापानी तथा प्राकृतिक क्षेत्र; नदी, ताल र संरक्षित क्षेत्र' },
              { en: 'Unification, Rana rule, democratic movements and the republic', ne: 'एकीकरण, राणाकाल, प्रजातान्त्रिक आन्दोलन र गणतन्त्र' },
              { en: 'Caste, ethnicity, language, religion and social inclusion', ne: 'जात, जाति, भाषा, धर्म र सामाजिक समावेशीकरण' },
              { en: 'World heritage, festivals and cultural property of Nepal', ne: 'नेपालको विश्व सम्पदा, चाडपर्व र सांस्कृतिक सम्पदा' },
            ],
          },
          {
            id: 'adhikrit-p1-s2',
            name: { en: 'Constitution, Governance and Public Administration', ne: 'संविधान, शासन व्यवस्था र सार्वजनिक प्रशासन' },
            marks: 25,
            subjectIds: ['constitution', 'governance'],
            topics: [
              { en: 'Constitution of Nepal: preamble, fundamental rights and duties, directive principles', ne: 'नेपालको संविधान: प्रस्तावना, मौलिक हक तथा कर्तव्य, निर्देशक सिद्धान्त' },
              { en: 'Federal, provincial and local structures and their powers', ne: 'संघीय, प्रादेशिक र स्थानीय संरचना र तिनका अधिकार' },
              { en: 'Constitutional bodies, judiciary and the legislature', ne: 'संवैधानिक निकाय, न्यायपालिका र व्यवस्थापिका' },
              { en: 'Good governance, accountability, transparency and the civil service', ne: 'सुशासन, जवाफदेहिता, पारदर्शिता र निजामती सेवा' },
            ],
          },
          {
            id: 'adhikrit-p1-s3',
            name: { en: 'Economy, Development and Environment', ne: 'अर्थतन्त्र, विकास र वातावरण' },
            marks: 25,
            subjectIds: ['dev-economy'],
            topics: [
              { en: 'Structure of the Nepali economy, budget and fiscal system', ne: 'नेपाली अर्थतन्त्रको संरचना, बजेट र वित्तीय प्रणाली' },
              { en: 'Periodic plans, poverty reduction and the Sustainable Development Goals', ne: 'आवधिक योजना, गरिबी निवारण र दिगो विकास लक्ष्य' },
              { en: 'Climate change, disaster risk reduction and environmental management', ne: 'जलवायु परिवर्तन, विपद् जोखिम न्यूनीकरण र वातावरण व्यवस्थापन' },
              { en: 'Population, migration, remittance and human development', ne: 'जनसंख्या, बसाइँसराइ, विप्रेषण र मानव विकास' },
            ],
          },
          {
            id: 'adhikrit-p1-s4',
            name: { en: 'International Affairs, Science, ICT and Contemporary Issues', ne: 'अन्तर्राष्ट्रिय मामिला, विज्ञान, सूचना प्रविधि र समसामयिक विषय' },
            marks: 25,
            subjectIds: ['gk-world', 'ict', 'current-affairs'],
            topics: [
              { en: 'United Nations, SAARC, BIMSTEC and Nepal’s foreign policy', ne: 'संयुक्त राष्ट्र संघ, सार्क, बिमस्टेक र नेपालको परराष्ट्र नीति' },
              { en: 'General science, health and everyday technology', ne: 'सामान्य विज्ञान, स्वास्थ्य र दैनिक प्रविधि' },
              { en: 'Digital governance, cyber security and e-services', ne: 'डिजिटल सुशासन, साइबर सुरक्षा र विद्युतीय सेवा' },
              { en: 'National and international events of the last twelve months', ne: 'पछिल्लो एक वर्षका राष्ट्रिय तथा अन्तर्राष्ट्रिय घटना' },
            ],
          },
        ],
      },
      {
        id: 'adhikrit-p2',
        name: { en: 'Paper II — Governance System, Management and Public Administration', ne: 'द्वितीय पत्र — शासन प्रणाली, व्यवस्थापन र सार्वजनिक प्रशासन' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 180,
        format: 'subjective',
        pattern: { en: 'Short and long answer questions', ne: 'छोटो र लामो उत्तर आउने प्रश्न' },
        sections: [
          {
            id: 'adhikrit-p2-s1',
            name: { en: 'Governance System of Nepal', ne: 'नेपालको शासन प्रणाली' },
            marks: 50,
            subjectIds: ['governance', 'constitution'],
            topics: [
              { en: 'Federalism: concept, models and practice in Nepal', ne: 'संघीयता: अवधारणा, नमुना र नेपालको अभ्यास' },
              { en: 'Inter-governmental relations and fiscal federalism', ne: 'अन्तरसरकारी सम्बन्ध र वित्तीय संघीयता' },
              { en: 'Rule of law, separation of powers and checks and balances', ne: 'विधिको शासन, शक्ति पृथकीकरण र नियन्त्रण तथा सन्तुलन' },
              { en: 'Political parties, elections and the electoral system', ne: 'राजनीतिक दल, निर्वाचन र निर्वाचन प्रणाली' },
            ],
          },
          {
            id: 'adhikrit-p2-s2',
            name: { en: 'Management and Public Administration', ne: 'व्यवस्थापन र सार्वजनिक प्रशासन' },
            marks: 50,
            subjectIds: ['governance', 'office-mgmt'],
            topics: [
              { en: 'Planning, organising, leadership, motivation and control', ne: 'योजना, संगठन, नेतृत्व, अभिप्रेरणा र नियन्त्रण' },
              { en: 'Human resource management in the civil service', ne: 'निजामती सेवामा मानव संसाधन व्यवस्थापन' },
              { en: 'Public finance, procurement and audit', ne: 'सार्वजनिक वित्त, खरिद र लेखापरीक्षण' },
              { en: 'Service delivery, citizen charter and grievance handling', ne: 'सेवा प्रवाह, नागरिक बडापत्र र गुनासो व्यवस्थापन' },
            ],
          },
        ],
      },
      {
        id: 'adhikrit-p3',
        name: { en: 'Paper III — Service Related (Administration)', ne: 'तृतीय पत्र — सेवा सम्बन्धी (प्रशासन)' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 180,
        format: 'subjective',
        pattern: { en: 'Two sections of short and long answer questions', ne: 'दुई खण्डमा छोटो र लामो उत्तर आउने प्रश्न' },
        sections: [
          {
            id: 'adhikrit-p3-s1',
            name: { en: 'Section A — Office Management and Service Law', ne: 'खण्ड क — कार्यालय व्यवस्थापन र सेवा सम्बन्धी कानून' },
            marks: 50,
            subjectIds: ['office-mgmt'],
            topics: [
              { en: 'Civil Service Act and Rules: appointment, promotion, conduct and punishment', ne: 'निजामती सेवा ऐन तथा नियमावली: नियुक्ति, बढुवा, आचरण र सजाय' },
              { en: 'Office procedure, records management and correspondence', ne: 'कार्यालय कार्यविधि, अभिलेख व्यवस्थापन र पत्राचार' },
              { en: 'Note writing (tippani), decision making and report writing', ne: 'टिप्पणी लेखन, निर्णय प्रक्रिया र प्रतिवेदन लेखन' },
              { en: 'Right to information, code of conduct and integrity', ne: 'सूचनाको हक, आचारसंहिता र इमानदारिता' },
            ],
          },
          {
            id: 'adhikrit-p3-s2',
            name: { en: 'Section B — Contemporary Policy and Problem Solving', ne: 'खण्ड ख — समसामयिक नीति र समस्या समाधान' },
            marks: 50,
            subjectIds: ['governance', 'current-affairs', 'dev-economy'],
            topics: [
              { en: 'Policy analysis, sectoral policies and reform agendas', ne: 'नीति विश्लेषण, क्षेत्रगत नीति र सुधारका एजेन्डा' },
              { en: 'Case study and problem solving in an office setting', ne: 'कार्यालयजन्य केस स्टडी र समस्या समाधान' },
              { en: 'Coordination between three tiers of government', ne: 'सरकारका तीन तहबीच समन्वय' },
              { en: 'Ethics, professionalism and public service motivation', ne: 'नैतिकता, व्यावसायिकता र सार्वजनिक सेवा अभिप्रेरणा' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'nayabsubba',
    name: { en: 'Nayab Subba', ne: 'नायब सुब्बा' },
    shortName: { en: 'Na. Su.', ne: 'ना.सु.' },
    grade: { en: 'Non-gazetted First Class, Administration Service', ne: 'राजपत्र अनंकित प्रथम श्रेणी, प्रशासन सेवा' },
    summary: {
      en: 'The senior assistant level post. One objective paper on general knowledge and intelligence, one subjective service related paper, and an interview.',
      ne: 'सहायकस्तरको माथिल्लो पद। सामान्य ज्ञान तथा बौद्धिकताको एक वस्तुगत पत्र, सेवा सम्बन्धी एक विषयगत पत्र र अन्तर्वार्ता हुन्छ।',
    },
    accent: '#1e6f5c',
    icon: '📋',
    minQualification: {
      en: 'Higher secondary (10+2) or equivalent from a recognised board.',
      ne: 'मान्यताप्राप्त बोर्डबाट प्रवीणता प्रमाणपत्र तह वा सो सरह (१०+२) उत्तीर्ण।',
    },
    mock: { questionCount: 30, durationMinutes: 25, marksPerQuestion: 2, negativePerWrong: 0.4, passPercent: 40 },
    papers: [
      {
        id: 'nasu-p1',
        name: { en: 'Paper I — General Knowledge and General Intelligence Test', ne: 'प्रथम पत्र — सामान्य ज्ञान र सामान्य बौद्धिकता परीक्षण' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 45,
        format: 'objective',
        pattern: { en: '50 multiple choice questions × 2 marks', ne: '५० वस्तुगत बहुवैकल्पिक प्रश्न × २ अङ्क' },
        sections: [
          {
            id: 'nasu-p1-s1',
            name: { en: 'General Knowledge — Nepal', ne: 'सामान्य ज्ञान — नेपाल' },
            marks: 40,
            subjectIds: ['gk-nepal', 'constitution'],
            topics: [
              { en: 'Geography, natural resources and protected areas of Nepal', ne: 'नेपालको भूगोल, प्राकृतिक स्रोत र संरक्षित क्षेत्र' },
              { en: 'History, unification, movements and major political changes', ne: 'इतिहास, एकीकरण, आन्दोलन र प्रमुख राजनीतिक परिवर्तन' },
              { en: 'Constitution of Nepal and the federal structure', ne: 'नेपालको संविधान र संघीय संरचना' },
              { en: 'Society, culture, festivals, language and social inclusion', ne: 'समाज, संस्कृति, चाडपर्व, भाषा र सामाजिक समावेशीकरण' },
            ],
          },
          {
            id: 'nasu-p1-s2',
            name: { en: 'General Knowledge — International and Contemporary', ne: 'सामान्य ज्ञान — अन्तर्राष्ट्रिय तथा समसामयिक' },
            marks: 25,
            subjectIds: ['gk-world', 'current-affairs', 'ict'],
            topics: [
              { en: 'International organisations and Nepal’s membership', ne: 'अन्तर्राष्ट्रिय संघसंस्था र नेपालको सदस्यता' },
              { en: 'General science, health and environment', ne: 'सामान्य विज्ञान, स्वास्थ्य र वातावरण' },
              { en: 'Information technology and e-governance basics', ne: 'सूचना प्रविधि र विद्युतीय सुशासनको आधारभूत ज्ञान' },
              { en: 'Current national and international affairs', ne: 'चालु राष्ट्रिय तथा अन्तर्राष्ट्रिय समसामयिक विषय' },
            ],
          },
          {
            id: 'nasu-p1-s3',
            name: { en: 'General Intelligence Test', ne: 'सामान्य बौद्धिकता परीक्षण' },
            marks: 35,
            subjectIds: ['iq'],
            topics: [
              { en: 'Number, letter and figure series', ne: 'संख्या, अक्षर र आकृति शृंखला' },
              { en: 'Coding-decoding, analogy and classification', ne: 'कोडिङ-डिकोडिङ, समानता र वर्गीकरण' },
              { en: 'Blood relations, direction sense and ranking', ne: 'नाता सम्बन्ध, दिशा ज्ञान र क्रम निर्धारण' },
              { en: 'Arithmetic reasoning: percentage, ratio, average, time and work', ne: 'अंकगणितीय तर्क: प्रतिशत, अनुपात, औसत, समय र कार्य' },
            ],
          },
        ],
      },
      {
        id: 'nasu-p2',
        name: { en: 'Paper II — Service Related (Administration)', ne: 'द्वितीय पत्र — सेवा सम्बन्धी (प्रशासन)' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 180,
        format: 'subjective',
        pattern: { en: 'Short and long answer questions in two sections', ne: 'दुई खण्डमा छोटो र लामो उत्तर आउने प्रश्न' },
        sections: [
          {
            id: 'nasu-p2-s1',
            name: { en: 'Section A — Governance, Constitution and Contemporary Issues', ne: 'खण्ड क — शासन व्यवस्था, संविधान र समसामयिक विषय' },
            marks: 50,
            subjectIds: ['governance', 'constitution', 'dev-economy'],
            topics: [
              { en: 'Federal governance structure and inter-governmental coordination', ne: 'संघीय शासन संरचना र अन्तरसरकारी समन्वय' },
              { en: 'Good governance, service delivery and citizen charter', ne: 'सुशासन, सेवा प्रवाह र नागरिक बडापत्र' },
              { en: 'Periodic plan, budget and development administration', ne: 'आवधिक योजना, बजेट र विकास प्रशासन' },
              { en: 'Social security, inclusion and contemporary policy debates', ne: 'सामाजिक सुरक्षा, समावेशीकरण र समसामयिक नीतिगत बहस' },
            ],
          },
          {
            id: 'nasu-p2-s2',
            name: { en: 'Section B — Office Management and Service Conditions', ne: 'खण्ड ख — कार्यालय व्यवस्थापन र सेवा सर्त' },
            marks: 50,
            subjectIds: ['office-mgmt', 'nepali'],
            topics: [
              { en: 'Office procedure: registration, dispatch, filing and records', ne: 'कार्यालय कार्यविधि: दर्ता, चलानी, फाइलिङ र अभिलेख' },
              { en: 'Note writing, letter writing and minute preparation', ne: 'टिप्पणी लेखन, पत्र लेखन र माइन्युट तयारी' },
              { en: 'Civil Service Act: conduct, leave, promotion and punishment', ne: 'निजामती सेवा ऐन: आचरण, बिदा, बढुवा र सजाय' },
              { en: 'Financial administration and store management basics', ne: 'आर्थिक प्रशासन र जिन्सी व्यवस्थापनको आधारभूत ज्ञान' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'kharidar',
    name: { en: 'Kharidar', ne: 'खरिदार' },
    shortName: { en: 'Kharidar', ne: 'खरिदार' },
    grade: { en: 'Non-gazetted Second Class, Administration Service', ne: 'राजपत्र अनंकित द्वितीय श्रेणी, प्रशासन सेवा' },
    summary: {
      en: 'The assistant level entry post. One objective paper on general knowledge and intelligence, one subjective service related paper, and an interview.',
      ne: 'सहायकस्तरको प्रवेश पद। सामान्य ज्ञान तथा बौद्धिकताको एक वस्तुगत पत्र, सेवा सम्बन्धी एक विषयगत पत्र र अन्तर्वार्ता हुन्छ।',
    },
    accent: '#2c5aa0',
    icon: '📝',
    minQualification: {
      en: 'School Leaving Certificate / SEE or equivalent as prescribed in the vacancy notice.',
      ne: 'विज्ञापनमा तोकिए बमोजिम एसएलसी/एसईई वा सो सरह उत्तीर्ण।',
    },
    mock: { questionCount: 30, durationMinutes: 25, marksPerQuestion: 2, negativePerWrong: 0.4, passPercent: 40 },
    papers: [
      {
        id: 'kharidar-p1',
        name: { en: 'Paper I — General Knowledge and General Intelligence Test', ne: 'प्रथम पत्र — सामान्य ज्ञान र सामान्य बौद्धिकता परीक्षण' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 45,
        format: 'objective',
        pattern: { en: '50 multiple choice questions × 2 marks', ne: '५० वस्तुगत बहुवैकल्पिक प्रश्न × २ अङ्क' },
        sections: [
          {
            id: 'kharidar-p1-s1',
            name: { en: 'General Knowledge — Nepal', ne: 'सामान्य ज्ञान — नेपाल' },
            marks: 40,
            subjectIds: ['gk-nepal', 'constitution'],
            topics: [
              { en: 'Geography: provinces, districts, rivers, mountains and climate', ne: 'भूगोल: प्रदेश, जिल्ला, नदी, हिमाल र हावापानी' },
              { en: 'History: unification, Rana rule, movements and the republic', ne: 'इतिहास: एकीकरण, राणाकाल, आन्दोलन र गणतन्त्र' },
              { en: 'Basics of the Constitution of Nepal and the three tiers of government', ne: 'नेपालको संविधान र सरकारका तीन तहको आधारभूत ज्ञान' },
              { en: 'Culture, festivals, heritage and social life', ne: 'संस्कृति, चाडपर्व, सम्पदा र सामाजिक जीवन' },
            ],
          },
          {
            id: 'kharidar-p1-s2',
            name: { en: 'General Knowledge — International, Science and Current Affairs', ne: 'सामान्य ज्ञान — अन्तर्राष्ट्रिय, विज्ञान र समसामयिक' },
            marks: 25,
            subjectIds: ['gk-world', 'current-affairs', 'ict'],
            topics: [
              { en: 'World geography basics and international organisations', ne: 'विश्व भूगोलको आधारभूत ज्ञान र अन्तर्राष्ट्रिय संघसंस्था' },
              { en: 'General science and health in daily life', ne: 'दैनिक जीवनमा सामान्य विज्ञान र स्वास्थ्य' },
              { en: 'Computer and internet fundamentals', ne: 'कम्प्युटर र इन्टरनेटको आधारभूत ज्ञान' },
              { en: 'Current national and international affairs', ne: 'चालु राष्ट्रिय तथा अन्तर्राष्ट्रिय समसामयिक विषय' },
            ],
          },
          {
            id: 'kharidar-p1-s3',
            name: { en: 'General Intelligence Test', ne: 'सामान्य बौद्धिकता परीक्षण' },
            marks: 35,
            subjectIds: ['iq'],
            topics: [
              { en: 'Series, analogy, odd one out and classification', ne: 'शृंखला, समानता, फरक पत्ता लगाउने र वर्गीकरण' },
              { en: 'Coding-decoding and alphabet reasoning', ne: 'कोडिङ-डिकोडिङ र वर्णमाला तर्क' },
              { en: 'Blood relations, direction and calendar', ne: 'नाता सम्बन्ध, दिशा र पात्रो' },
              { en: 'Simple arithmetic: percentage, ratio, average, profit and loss', ne: 'सरल अंकगणित: प्रतिशत, अनुपात, औसत, नाफा र नोक्सान' },
            ],
          },
        ],
      },
      {
        id: 'kharidar-p2',
        name: { en: 'Paper II — Service Related (Administration)', ne: 'द्वितीय पत्र — सेवा सम्बन्धी (प्रशासन)' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 150,
        format: 'subjective',
        pattern: { en: 'Short answer and practical writing questions', ne: 'छोटो उत्तर र व्यावहारिक लेखनका प्रश्न' },
        sections: [
          {
            id: 'kharidar-p2-s1',
            name: { en: 'Section A — Office Management and Correspondence', ne: 'खण्ड क — कार्यालय व्यवस्थापन र पत्राचार' },
            marks: 50,
            subjectIds: ['office-mgmt', 'nepali', 'english'],
            topics: [
              { en: 'Meaning, types and functions of an office', ne: 'कार्यालयको अर्थ, प्रकार र कार्य' },
              { en: 'Registration, dispatch, filing and record keeping', ne: 'दर्ता, चलानी, फाइलिङ र अभिलेख राख्ने कार्य' },
              { en: 'Letter writing, note writing and application drafting', ne: 'पत्र लेखन, टिप्पणी लेखन र निवेदन मस्यौदा' },
              { en: 'Office equipment, communication and public dealing', ne: 'कार्यालय उपकरण, सञ्चार र सेवाग्राहीसँगको व्यवहार' },
            ],
          },
          {
            id: 'kharidar-p2-s2',
            name: { en: 'Section B — Governance, Service Rules and Contemporary Issues', ne: 'खण्ड ख — शासन व्यवस्था, सेवा सर्त र समसामयिक विषय' },
            marks: 50,
            subjectIds: ['governance', 'constitution', 'current-affairs'],
            topics: [
              { en: 'Structure and duties of federal, provincial and local government', ne: 'संघीय, प्रादेशिक र स्थानीय सरकारको संरचना र कार्य' },
              { en: 'Civil Service Act basics: conduct, leave and discipline', ne: 'निजामती सेवा ऐनको आधार: आचरण, बिदा र अनुशासन' },
              { en: 'Good governance, citizen charter and right to information', ne: 'सुशासन, नागरिक बडापत्र र सूचनाको हक' },
              { en: 'Contemporary national issues and public service', ne: 'समसामयिक राष्ट्रिय विषय र सार्वजनिक सेवा' },
            ],
          },
        ],
      },
    ],
  },
];

export const LEVEL_BY_ID: Record<string, ExamLevel> = Object.fromEntries(
  LEVELS.map((level) => [level.id, level]),
);
