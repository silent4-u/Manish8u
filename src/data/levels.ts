import type { Bilingual, ExamLevel, LevelId } from '../types';

/**
 * Exam patterns follow the Public Service Commission (Lok Sewa Aayog) syllabus
 * for the Administration Service. The commission revises syllabi from time to
 * time, so `SYLLABUS_REVISION_NOTE` is shown wherever this data is displayed.
 */
export const SYLLABUS_REVISION_NOTE = {
  en: 'Marks, timing and topics follow the published Public Service Commission syllabus for the Administration Service. Always confirm against the latest notice on psc.gov.np before your exam.',
  ne: 'अङ्कभार, समय र विषयवस्तु लोक सेवा आयोगको प्रशासन सेवाको प्रकाशित पाठ्यक्रम अनुसार राखिएको हो। परीक्षा दिनुअघि psc.gov.np मा प्रकाशित पछिल्लो सूचनासँग अनिवार्य रूपमा भिडाउनुहोस्।',
};

/**
 * What the commission allows as the medium of the written examination, taken
 * from the द्रष्टव्य notes on each syllabus. This is a real exam rule, not an
 * app setting: it decides what language a candidate may answer in, and for
 * Kharidar it also decides what language the question paper arrives in.
 */
export const EXAM_MEDIUM_NOTE: Record<LevelId, Bilingual> = {
  adhikrit: {
    en: 'You may write the examination in Nepali, in English, or in both. (Foreign Service candidates sit their extra papers in English only.)',
    ne: 'परीक्षा नेपाली, अंग्रेजी वा दुवै भाषामा लेख्न पाइन्छ। (परराष्ट्र सेवाका अतिरिक्त पत्रको माध्यम भने अंग्रेजी मात्र हुन्छ।)',
  },
  nayabsubba: {
    en: 'You may write the examination in Nepali, in English, or in both.',
    ne: 'परीक्षा नेपाली, अंग्रेजी वा दुवै भाषामा लेख्न पाइन्छ।',
  },
  kharidar: {
    en: 'The question paper is set in Nepali, with English terms in brackets where a point needs clarifying. You may write your answers in Nepali, in English, or in both.',
    ne: 'प्रश्नपत्रको माध्यम भाषा नेपाली हुन्छ; विषयवस्तु स्पष्ट पार्नुपर्ने अवस्थामा कोष्ठभित्र अंग्रेजी शब्द पनि राखिन्छ। उत्तर भने नेपाली, अंग्रेजी वा दुवै भाषामा लेख्न पाइन्छ।',
  },
};

export const LEVELS: ExamLevel[] = [
  {
    id: 'adhikrit',
    name: { en: 'Section Officer (Adhikrit)', ne: 'शाखा अधिकृत' },
    shortName: { en: 'Officer', ne: 'अधिकृत' },
    grade: {
      en: 'Gazetted Third Class — Foreign Affairs, Administration, Audit and Federal Parliament Services',
      ne: 'राजपत्रांकित तृतीय श्रेणी — परराष्ट्र, प्रशासन, लेखापरीक्षण र संघीय संसद सेवा',
    },
    summary: {
      en: 'Sat under the Integrated and Unified Examination System, so one common paper serves every service. Stage I is a screening test whose marks are not carried forward; Stage II is three subjective papers; then a skill test, group test and interview.',
      ne: 'संयुक्त र एकीकृत परीक्षा प्रणाली अन्तर्गत लिइने भएकाले सबै सेवाका लागि एउटै साझा प्रश्नपत्र हुन्छ। प्रथम चरण छनोट परीक्षा हो र यसको प्राप्ताङ्क मूल परीक्षामा जोडिँदैन; द्वितीय चरणमा तीन विषयगत पत्र हुन्छन्; त्यसपछि सीप परीक्षण, सामूहिक परीक्षण र अन्तर्वार्ता हुन्छ।',
    },
    accent: '#c0392b',
    icon: '🏛️',
    minQualification: {
      en: "Bachelor's degree from a recognised university.",
      ne: 'मान्यताप्राप्त विश्वविद्यालयबाट स्नातक उत्तीर्ण।',
    },
    // Stage I: 100 objective questions of one mark in 90 minutes, 20 per cent
    // deducted for a wrong answer, and 45 marks needed to pass.
    mock: { questionCount: 100, durationMinutes: 90, marksPerQuestion: 1, negativePerWrong: 0.2, passPercent: 45 },
    papers: [
      {
        id: 'adhikrit-p1',
        name: { en: 'Paper I — Administrative Aptitude Test (Stage I, Preliminary)', ne: 'प्रथम पत्र — प्रशासनिक अभिरुचि परीक्षण (प्रथम चरण, प्रारम्भिक)' },
        fullMarks: 100,
        passMarks: 45,
        durationMinutes: 90,
        format: 'objective',
        pattern: {
          en: '100 multiple choice questions × 1 mark. A screening test only — the marks are not added to the main examination. 20 per cent is deducted for each wrong answer; nothing is deducted for a blank. No calculators.',
          ne: '१०० वस्तुगत बहुवैकल्पिक प्रश्न × १ अङ्क। यो छनोट परीक्षा मात्र हो — यसको प्राप्ताङ्क मूल परीक्षाको अङ्कमा जोडिँदैन। प्रत्येक गलत उत्तरमा २० प्रतिशत अङ्क कट्टा हुन्छ; उत्तर नदिएमा कट्टा हुँदैन। क्याल्कुलेटर प्रयोग गर्न पाइँदैन।',
        },
        sections: [
          {
            id: 'adhikrit-p1-a',
            name: { en: 'Part A — General Awareness', ne: 'खण्ड क — सामान्य सचेतना' },
            marks: 50,
            subjectIds: ['gk-nepal', 'constitution', 'governance', 'dev-economy', 'gk-world', 'ict', 'current-affairs'],
            topics: [
              { en: 'Physical, social and economic geography of Nepal and the world', ne: 'नेपाल र विश्वको भौतिक, सामाजिक र आर्थिक भूगोल' },
              { en: 'History, culture and social system: world events, ancient to modern Nepal, democratic movements, religion, ethnicity, language, literature and art', ne: 'इतिहास, संस्कृति र सामाजिक व्यवस्था: विश्वका घटना, प्राचीनदेखि आधुनिक नेपाल, प्रजातान्त्रिक आन्दोलन, धर्म, जातजाति, भाषा, साहित्य र कला' },
              { en: 'Polity and governance: constitution, political system, rights-based issues and the evolution of Nepal’s administrative system', ne: 'राज्य व्यवस्था र शासन: संविधान, राजनीतिक प्रणाली, अधिकारमा आधारित विषय र नेपालको प्रशासनिक प्रणालीको विकासक्रम' },
              { en: 'Economic development: infrastructure, planning, resource mobilisation, growth, employment and Nepal’s economic interaction with the world', ne: 'आर्थिक विकास: पूर्वाधार, योजना, स्रोत परिचालन, वृद्धि, रोजगारी र विश्वसँग नेपालको आर्थिक अन्तरक्रिया' },
              { en: 'Sustainable development, environment, biodiversity, climate change, demography, urbanisation, pollution and heritage', ne: 'दिगो विकास, वातावरण, जैविक विविधता, जलवायु परिवर्तन, जनसांख्यिकी, सहरीकरण, प्रदूषण र सम्पदा' },
              { en: 'Science and technology: discoveries and inventions, impact on society, evolution, heredity, health and disease', ne: 'विज्ञान र प्रविधि: आविष्कार, समाजमा प्रभाव, विकासवाद, आनुवंशिकता, स्वास्थ्य र रोग' },
              { en: 'International affairs: Nepal’s relations with SAARC members, China, USA, UK, Russia, France, Germany, Switzerland and Japan; the UN system', ne: 'अन्तर्राष्ट्रिय मामिला: सार्क सदस्य, चीन, अमेरिका, बेलायत, रुस, फ्रान्स, जर्मनी, स्विट्जरल्यान्ड र जापानसँग नेपालको सम्बन्ध; संयुक्त राष्ट्र संघ प्रणाली' },
              { en: 'Major national and international events and current affairs, including sport, books, awards, arts and noted figures', ne: 'प्रमुख राष्ट्रिय तथा अन्तर्राष्ट्रिय घटना र समसामयिक विषय — खेलकुद, पुस्तक, पुरस्कार, कला र चर्चित व्यक्तित्वसहित' },
            ],
          },
          {
            id: 'adhikrit-p1-b',
            name: { en: 'Part B — Aptitude Test', ne: 'खण्ड ख — अभिरुचि परीक्षण' },
            marks: 30,
            subjectIds: ['iq', 'maths'],
            topics: [
              { en: 'Verbal reasoning: series, analogy, classification, coding-decoding, direction and distance, ranking, assertion and reason (6 marks)', ne: 'शाब्दिक तर्क: शृंखला, समानता, वर्गीकरण, कोडिङ-डिकोडिङ, दिशा र दूरी, क्रम, कथन र कारण (६ अङ्क)' },
              { en: 'Non-verbal reasoning: series, Venn diagrams, matrices, figure formation, mirror and water images, embedded figures (6 marks)', ne: 'अशाब्दिक तर्क: शृंखला, भेन चित्र, म्याट्रिक्स, आकृति निर्माण, ऐना र पानी प्रतिबिम्ब, लुकेका आकृति (६ अङ्क)' },
              { en: 'Quantitative aptitude: arithmetic reasoning, percentage, fraction, ratio, average, profit and loss, calendar, time and work (6 marks)', ne: 'संख्यात्मक अभिरुचि: अंकगणितीय तर्क, प्रतिशत, भिन्न, अनुपात, औसत, नाफा–नोक्सान, पात्रो, समय र कार्य (६ अङ्क)' },
              { en: 'General mental ability, logical reasoning and analytical ability (6 marks)', ne: 'सामान्य मानसिक क्षमता, तार्किक तर्क र विश्लेषणात्मक क्षमता (६ अङ्क)' },
              { en: 'Data interpretation: charts, graphs, tables and data sufficiency (6 marks)', ne: 'तथ्यांक विश्लेषण: चार्ट, ग्राफ, तालिका र तथ्यांक पर्याप्तता (६ अङ्क)' },
            ],
          },
          {
            id: 'adhikrit-p1-c',
            name: { en: 'Part C — English Language Competence Test', ne: 'खण्ड ग — अंग्रेजी भाषा दक्षता परीक्षण' },
            marks: 20,
            subjectIds: ['english'],
            topics: [
              { en: 'Comprehension: fact finding, inference, core theme, true or false, issues raised (5 marks)', ne: 'बोधन: तथ्य पहिचान, निष्कर्ष, मूल विषय, सही वा गलत, उठाइएका विषय (५ अङ्क)' },
              { en: 'Vocabulary: literal and figurative meaning, one word for expressions, synonyms and antonyms, derivatives, homonyms (7 marks)', ne: 'शब्दभण्डार: शाब्दिक र लाक्षणिक अर्थ, एक शब्दमा अर्थ, पर्यायवाची र विपरीतार्थी, व्युत्पन्न शब्द, समध्वनि (७ अङ्क)' },
              { en: 'Syntactic ability: agreement, tense, clauses, modifiers, conditionals, phrasal expressions, transformations, prepositions (8 marks)', ne: 'वाक्य संरचना: मेल, काल, उपवाक्य, विशेषक, सर्तवाचक, वाक्पद्धति, रूपान्तरण, पूर्वसर्ग (८ अङ्क)' },
              { en: 'Set at a level an educated Class XII candidate can answer without specialised study', ne: 'कक्षा १२ उत्तीर्ण उम्मेदवारले विशेष अध्ययनविना उत्तर दिन सक्ने स्तरको' },
            ],
          },
        ],
      },
      {
        id: 'adhikrit-p2',
        name: { en: 'Paper II — Governance Systems (Stage II, Main)', ne: 'द्वितीय पत्र — शासन प्रणाली (द्वितीय चरण, मूल परीक्षा)' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 180,
        format: 'subjective',
        pattern: { en: '10 subjective questions × 10 marks', ne: '१० विषयगत प्रश्न × १० अङ्क' },
        sections: [
          {
            id: 'adhikrit-p2-a',
            name: { en: 'Section A — State and Governance', ne: 'खण्ड क — राज्य र शासन' },
            marks: 30,
            subjectIds: ['governance'],
            topics: [
              { en: 'Fundamentals of governance: concept, context and characteristics', ne: 'शासनका आधारभूत कुरा: अवधारणा, सन्दर्भ र विशेषता' },
              { en: 'Political and administrative structures of governance', ne: 'शासनका राजनीतिक र प्रशासनिक संरचना' },
              { en: 'Right to information and transparency', ne: 'सूचनाको हक र पारदर्शिता' },
              { en: 'Nation building and state building', ne: 'राष्ट्र निर्माण र राज्य निर्माण' },
              { en: 'Governance systems in Nepal', ne: 'नेपालको शासन प्रणाली' },
              { en: 'National security management: concept, scope and provisions in Nepal', ne: 'राष्ट्रिय सुरक्षा व्यवस्थापन: अवधारणा, क्षेत्र र नेपालको व्यवस्था' },
              { en: 'Multi-level governance: informal, civil society, local, cooperative and corporate governance, and the United Nations', ne: 'बहुतहीय शासन: अनौपचारिक, नागरिक समाज, स्थानीय, सहकारी र संस्थागत सुशासन, र संयुक्त राष्ट्र संघ' },
            ],
          },
          {
            id: 'adhikrit-p2-b',
            name: { en: 'Section B — Constitution and Law', ne: 'खण्ड ख — संविधान र कानून' },
            marks: 20,
            subjectIds: ['constitution'],
            topics: [
              { en: 'Constitutionalism and constitutional development in Nepal', ne: 'संवैधानिकता र नेपालमा संवैधानिक विकासक्रम' },
              { en: 'The present constitution: salient features, executive, legislature and judiciary', ne: 'वर्तमान संविधान: मुख्य विशेषता, कार्यपालिका, व्यवस्थापिका र न्यायपालिका' },
              { en: 'Fundamental rights, directive principles and policies of the state', ne: 'मौलिक हक, निर्देशक सिद्धान्त र राज्यका नीति' },
              { en: 'Functions and jurisdiction of constitutional and statutory bodies', ne: 'संवैधानिक तथा कानूनी निकायका काम र अधिकारक्षेत्र' },
              { en: 'Human rights; civic sense, duties and responsibilities of people', ne: 'मानव अधिकार; नागरिक चेतना, कर्तव्य र उत्तरदायित्व' },
              { en: 'Sources of law and the law-making process in Nepal', ne: 'कानूनका स्रोत र नेपालमा कानून निर्माण प्रक्रिया' },
              { en: 'Rule of law, democratic values, inclusion, proportional representation and affirmative action', ne: 'विधिको शासन, लोकतान्त्रिक मूल्य, समावेशीकरण, समानुपातिक प्रतिनिधित्व र सकारात्मक विभेद' },
            ],
          },
          {
            id: 'adhikrit-p2-c',
            name: { en: 'Section C — Public Service and Public Management', ne: 'खण्ड ग — सार्वजनिक सेवा र सार्वजनिक व्यवस्थापन' },
            marks: 30,
            subjectIds: ['governance', 'office-mgmt'],
            topics: [
              { en: 'Concept, functions, characteristics and role of public service', ne: 'सार्वजनिक सेवाको अवधारणा, कार्य, विशेषता र भूमिका' },
              { en: 'Public service delivery', ne: 'सार्वजनिक सेवा प्रवाह' },
              { en: 'Political neutrality, commitment, transparency and accountability', ne: 'राजनीतिक तटस्थता, प्रतिबद्धता, पारदर्शिता र जवाफदेहिता' },
              { en: 'Utilisation of public funds, ethics and morality', ne: 'सार्वजनिक कोषको उपयोग, नैतिकता र सदाचार' },
              { en: 'Public management, civil service and bureaucracy', ne: 'सार्वजनिक व्यवस्थापन, निजामती सेवा र कर्मचारीतन्त्र' },
              { en: 'Public policy: formulation process and analysis', ne: 'सार्वजनिक नीति: निर्माण प्रक्रिया र विश्लेषण' },
              { en: 'Public service charter and e-governance', ne: 'नागरिक बडापत्र र विद्युतीय सुशासन' },
            ],
          },
          {
            id: 'adhikrit-p2-d',
            name: { en: 'Section D — Resource Management and Planning', ne: 'खण्ड घ — स्रोत व्यवस्थापन र योजना' },
            marks: 20,
            subjectIds: ['dev-economy', 'office-mgmt'],
            topics: [
              { en: 'Human resource management: procurement, development, utilisation and maintenance', ne: 'मानव स्रोत व्यवस्थापन: प्राप्ति, विकास, उपयोग र सम्भार' },
              { en: 'Public financial management: the planning and budgeting system in Nepal', ne: 'सार्वजनिक वित्त व्यवस्थापन: नेपालको योजना र बजेट प्रणाली' },
              { en: 'Government accounting and auditing systems in Nepal', ne: 'नेपालमा सरकारी लेखा प्रणाली र लेखापरीक्षण प्रणाली' },
              { en: 'Financial management and social accountability', ne: 'वित्तीय व्यवस्थापन र सामाजिक उत्तरदायित्व' },
              { en: 'Development planning and the current periodic plan', ne: 'विकास योजना र चालु आवधिक योजना' },
              { en: 'Participatory planning and development', ne: 'सहभागितामूलक योजना र विकास' },
            ],
          },
        ],
      },
      {
        id: 'adhikrit-p3',
        name: { en: 'Paper III — Contemporary Issues (Stage II, Main)', ne: 'तृतीय पत्र — समसामयिक विषय (द्वितीय चरण, मूल परीक्षा)' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 180,
        format: 'subjective',
        pattern: { en: '10 subjective questions × 10 marks', ne: '१० विषयगत प्रश्न × १० अङ्क' },
        sections: [
          {
            id: 'adhikrit-p3-a',
            name: { en: 'Section A — Social Issues', ne: 'खण्ड क — सामाजिक विषय' },
            marks: 30,
            subjectIds: ['current-affairs', 'gk-nepal'],
            topics: [
              { en: 'Social disputes and conflict; social justice and equality', ne: 'सामाजिक विवाद र द्वन्द्व; सामाजिक न्याय र समानता' },
              { en: 'Social and cultural transformation', ne: 'सामाजिक र सांस्कृतिक रूपान्तरण' },
              { en: 'Distributive justice of resources: regional, caste, gender, rural and urban disparities', ne: 'स्रोतको वितरणमा न्याय: क्षेत्रीय, जातीय, लैंगिक, ग्रामीण र सहरी असमानता' },
              { en: 'Social protection, social security and social responsibility', ne: 'सामाजिक संरक्षण, सामाजिक सुरक्षा र सामाजिक उत्तरदायित्व' },
              { en: 'Cultural diversity and social mobilisation', ne: 'सांस्कृतिक विविधता र सामाजिक परिचालन' },
              { en: 'Population: settlement, migration, urbanisation, ageing, refugees and displacement', ne: 'जनसंख्या: बसोबास, बसाइँसराइ, सहरीकरण, वृद्ध जनसंख्या, शरणार्थी र विस्थापन' },
              { en: 'Organised crime: cyber crime, trafficking, cartelling, terrorism, corruption and money laundering', ne: 'संगठित अपराध: साइबर अपराध, मानव बेचबिखन, कार्टेलिङ, आतंकवाद, भ्रष्टाचार र सम्पत्ति शुद्धीकरण' },
              { en: 'Food sovereignty and security', ne: 'खाद्य सम्प्रभुता र सुरक्षा' },
            ],
          },
          {
            id: 'adhikrit-p3-b',
            name: { en: 'Section B — Economic Issues', ne: 'खण्ड ख — आर्थिक विषय' },
            marks: 20,
            subjectIds: ['dev-economy'],
            topics: [
              { en: 'Economic growth and economic development', ne: 'आर्थिक वृद्धि र आर्थिक विकास' },
              { en: 'Agriculture, industry, trade, tourism, foreign employment and human resource', ne: 'कृषि, उद्योग, व्यापार, पर्यटन, वैदेशिक रोजगार र मानव संसाधन' },
              { en: 'Role of the public sector, private sector and cooperatives', ne: 'सार्वजनिक, निजी र सहकारी क्षेत्रको भूमिका' },
              { en: 'Foreign assistance, international cooperation and foreign investment', ne: 'वैदेशिक सहायता, अन्तर्राष्ट्रिय सहयोग र वैदेशिक लगानी' },
              { en: 'Technology transfer and intellectual property rights', ne: 'प्रविधि हस्तान्तरण र बौद्धिक सम्पत्ति अधिकार' },
              { en: 'Trade, market and labour liberalisation; economic diplomacy', ne: 'व्यापार, बजार र श्रम उदारीकरण; आर्थिक कूटनीति' },
              { en: 'Poverty and unemployment', ne: 'गरिबी र बेरोजगारी' },
            ],
          },
          {
            id: 'adhikrit-p3-c',
            name: { en: 'Section C — Developmental Issues', ne: 'खण्ड ग — विकास सम्बन्धी विषय' },
            marks: 30,
            subjectIds: ['dev-economy', 'governance'],
            topics: [
              { en: 'Human development and infrastructure development', ne: 'मानव विकास र पूर्वाधार विकास' },
              { en: 'Sustainable development: land, water and natural resources, carrying capacity and development policy', ne: 'दिगो विकास: भूमि, जल र प्राकृतिक स्रोत, वहन क्षमता र विकास नीति' },
              { en: 'Role of state and non-state actors in the development process', ne: 'विकास प्रक्रियामा राज्य र गैरराज्य पक्षको भूमिका' },
              { en: 'Peace and conflict-sensitive development', ne: 'शान्ति र द्वन्द्व संवेदनशील विकास' },
              { en: 'Decentralisation and local self-governance', ne: 'विकेन्द्रीकरण र स्थानीय स्वशासन' },
              { en: 'Citizen engagement, partnership and community-based development', ne: 'नागरिक सहभागिता, साझेदारी र समुदायमा आधारित विकास' },
              { en: 'Role of information and communication technology in development; globalisation', ne: 'विकासमा सूचना–सञ्चार प्रविधिको भूमिका; विश्वव्यापीकरण' },
            ],
          },
          {
            id: 'adhikrit-p3-d',
            name: { en: 'Section D — Environmental Issues', ne: 'खण्ड घ — वातावरण सम्बन्धी विषय' },
            marks: 20,
            subjectIds: ['dev-economy', 'gk-world'],
            topics: [
              { en: 'Ecosystem; biodiversity and conservation', ne: 'पारिस्थितिक प्रणाली; जैविक विविधता र संरक्षण' },
              { en: 'Climate change and carbon trade', ne: 'जलवायु परिवर्तन र कार्बन व्यापार' },
              { en: 'Environmental degradation and deforestation', ne: 'वातावरणीय ह्रास र वन विनाश' },
              { en: 'Crisis and disaster management', ne: 'संकट र विपद् व्यवस्थापन' },
              { en: 'Environment and development', ne: 'वातावरण र विकास' },
              { en: 'Energy crisis and energy conservation', ne: 'ऊर्जा संकट र ऊर्जा संरक्षण' },
              { en: 'Pollution and waste management', ne: 'प्रदूषण र फोहोरमैला व्यवस्थापन' },
            ],
          },
        ],
      },
      {
        id: 'adhikrit-p4',
        name: { en: 'Paper IV — Service Related Subject (Stage II, Main)', ne: 'चतुर्थ पत्र — सेवा समूह सम्बन्धी विषय (द्वितीय चरण, मूल परीक्षा)' },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 180,
        format: 'subjective',
        pattern: {
          en: '10 subjective questions × 10 marks. Common to every service except Foreign Affairs and Audit, which have their own fourth paper.',
          ne: '१० विषयगत प्रश्न × १० अङ्क। परराष्ट्र र लेखापरीक्षण सेवाबाहेक सबै सेवाका लागि साझा; ती दुईको चतुर्थ पत्र फरक हुन्छ।',
        },
        sections: [
          {
            id: 'adhikrit-p4-a',
            name: { en: 'Section A — Public Management', ne: 'खण्ड क — सार्वजनिक व्यवस्थापन' },
            marks: 30,
            subjectIds: ['office-mgmt', 'governance'],
            topics: [
              { en: 'Introduction and scope of public management', ne: 'सार्वजनिक व्यवस्थापनको परिचय र क्षेत्र' },
              { en: 'Personnel management: classification, recruitment, appointment, promotion, compensation, motivation, career development, performance appraisal and separation', ne: 'कर्मचारी प्रशासन: वर्गीकरण, पदपूर्ति, नियुक्ति, बढुवा, सुविधा, अभिप्रेरणा, वृत्ति विकास, कार्यसम्पादन मूल्यांकन र सेवाबाट अलग हुने व्यवस्था' },
              { en: 'Organisation: concept, nature, type and organisational development', ne: 'संगठन: अवधारणा, प्रकृति, प्रकार र संगठनात्मक विकास' },
              { en: 'Directing, controlling, hierarchy, decision making, leadership, coordination, delegation, supervision, monitoring and evaluation', ne: 'निर्देशन, नियन्त्रण, पदसोपान, निर्णय प्रक्रिया, नेतृत्व, समन्वय, अधिकार प्रत्यायोजन, सुपरिवेक्षण, अनुगमन र मूल्यांकन' },
              { en: 'Evolution of public administration in Nepal: structure, features, reform efforts and challenges', ne: 'नेपालको सार्वजनिक प्रशासनको विकासक्रम: संरचना, विशेषता, सुधारका प्रयास र चुनौती' },
              { en: 'Management audit; professionalism, discipline and code of conduct', ne: 'व्यवस्थापन परीक्षण; व्यावसायिकता, अनुशासन र आचारसंहिता' },
              { en: 'Citizen involvement: public hearing, social audit, public testing and third party evaluation', ne: 'नागरिक सहभागिता: सार्वजनिक सुनुवाइ, सामाजिक परीक्षण, सार्वजनिक परीक्षण र तेस्रो पक्ष मूल्यांकन' },
              { en: 'Use of computers, internet, social networking and ICT in service delivery: opportunities and challenges', ne: 'सेवा प्रवाहमा कम्प्युटर, इन्टरनेट, सामाजिक सञ्जाल र सूचना–सञ्चार प्रविधिको प्रयोग: अवसर र चुनौती' },
            ],
          },
          {
            id: 'adhikrit-p4-b',
            name: { en: 'Section B — Revenue Administration', ne: 'खण्ड ख — राजस्व प्रशासन' },
            marks: 20,
            subjectIds: ['dev-economy', 'office-mgmt'],
            topics: [
              { en: 'Financial procedures; concept and principles of revenue', ne: 'आर्थिक कार्यविधि; राजस्वको अवधारणा र सिद्धान्त' },
              { en: 'Public income, public expenditure and public debt', ne: 'सार्वजनिक आय, सार्वजनिक व्यय र सार्वजनिक ऋण' },
              { en: 'Nepal’s tax system: VAT, income tax, excise duty, customs duty and local taxes', ne: 'नेपालको कर प्रणाली: मूल्य अभिवृद्धि कर, आयकर, अन्तःशुल्क, भन्सार महसुल र स्थानीय कर' },
              { en: 'Inter-governmental financial transfer and revenue allocation', ne: 'अन्तरसरकारी वित्तीय हस्तान्तरण र राजस्व बाँडफाँट' },
              { en: 'Economic, financial and monetary policy', ne: 'आर्थिक, वित्तीय र मौद्रिक नीति' },
              { en: 'Budget cycle: formulation, implementation and evaluation', ne: 'बजेट चक्र: निर्माण, कार्यान्वयन र मूल्यांकन' },
            ],
          },
          {
            id: 'adhikrit-p4-c',
            name: { en: 'Section C — Government Accounting, Reporting and Auditing', ne: 'खण्ड ग — सरकारी लेखा, प्रतिवेदन र लेखापरीक्षण' },
            marks: 30,
            subjectIds: ['office-mgmt', 'dev-economy'],
            topics: [
              { en: 'Government financial transactions: features, analysis, primary records, ledger posting and reporting (20 marks)', ne: 'सरकारी वित्तीय कारोबार: विशेषता, विश्लेषण, प्रारम्भिक अभिलेख, खाता पोस्टिङ र प्रतिवेदन (२० अङ्क)' },
              { en: 'Double entry accounting; cash and accrual based systems', ne: 'दोहोरो लेखा प्रणाली; नगद र प्रोदभावी आधारित प्रणाली' },
              { en: 'Chart of Accounts, Treasury Single Account and the Revenue Management Information System', ne: 'खाता वर्गीकरण, एकल कोष खाता र राजस्व व्यवस्थापन सूचना प्रणाली' },
              { en: 'Public assets, store or inventory and deposit accounting', ne: 'सार्वजनिक सम्पत्ति, जिन्सी र धरौटी लेखा' },
              { en: 'Nepal Public Sector Accounting Standards; public procurement management and its law', ne: 'नेपाल सार्वजनिक क्षेत्र लेखामान; सार्वजनिक खरिद व्यवस्थापन र सम्बन्धित कानून' },
              { en: 'Auditing system: purpose, types, principles, standards, irregularities and their settlement (10 marks)', ne: 'लेखापरीक्षण प्रणाली: उद्देश्य, प्रकार, सिद्धान्त, मापदण्ड, बेरुजु र फर्छ्यौट (१० अङ्क)' },
              { en: 'Audit of federal, provincial and local levels and state-owned enterprises; ICAN, INTOSAI and ASOSAI', ne: 'संघ, प्रदेश, स्थानीय तह र सार्वजनिक संस्थानको लेखापरीक्षण; ICAN, INTOSAI र ASOSAI' },
            ],
          },
          {
            id: 'adhikrit-p4-d',
            name: { en: 'Section D — Parliamentary Process and Federal System', ne: 'खण्ड घ — संसदीय प्रक्रिया र संघीय प्रणाली' },
            marks: 20,
            subjectIds: ['governance', 'constitution'],
            topics: [
              { en: 'The federal system and federalism in Nepal', ne: 'संघीय प्रणाली र नेपालमा संघीयता' },
              { en: 'Legislative interrelation among federal, provincial and local levels', ne: 'संघ, प्रदेश र स्थानीय तहबीचको विधायिकी अन्तरसम्बन्ध' },
              { en: 'Management procedures and the law-making process', ne: 'व्यवस्थापन कार्यविधि र कानून निर्माण प्रक्रिया' },
              { en: 'Relationship between the House of Representatives and the National Assembly', ne: 'प्रतिनिधि सभा र राष्ट्रिय सभाबीचको अन्तरसम्बन्ध' },
              { en: 'Parliament, parliamentary committees and constitutional bodies', ne: 'संसद, संसदीय समिति र संवैधानिक निकाय' },
              { en: 'Parliamentary officials, parliamentary parties and the role of the opposition', ne: 'संसदीय पदाधिकारी, संसदीय दल र प्रतिपक्षको भूमिका' },
              { en: 'Code of conduct, discipline and ethics for members of parliament and elected representatives', ne: 'सांसद र निर्वाचित जनप्रतिनिधिको आचारसंहिता, अनुशासन र नैतिकता' },
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
    grade: {
      en: 'Non-gazetted First Class — Judicial, Foreign Affairs, Administration, Audit and Parliament Services',
      ne: 'राजपत्र अनंकित प्रथम श्रेणी — न्याय, परराष्ट्र, प्रशासन, लेखापरीक्षण र संसद सेवा',
    },
    summary: {
      en: 'Sat under the Integrated and Unified Examination System. A screening preliminary, then two subjective main papers, then a computer skill test and interview.',
      ne: 'संयुक्त र एकीकृत परीक्षा प्रणाली अन्तर्गत लिइन्छ। छनोट प्रारम्भिक परीक्षा, त्यसपछि दुई विषयगत मूल पत्र, अनि कम्प्युटर सीप परीक्षण र अन्तर्वार्ता।',
    },
    accent: '#1e6f5c',
    icon: '📋',
    minQualification: {
      en: 'Higher secondary (10+2) or equivalent from a recognised board.',
      ne: 'मान्यताप्राप्त बोर्डबाट प्रवीणता प्रमाणपत्र तह वा सो सरह (१०+२) उत्तीर्ण।',
    },
    // Stage I: 50 objective questions of two marks in 45 minutes, 20 per cent
    // of the question deducted for a wrong answer, and 45 marks to pass.
    mock: { questionCount: 50, durationMinutes: 45, marksPerQuestion: 2, negativePerWrong: 0.4, passPercent: 45 },
    papers: [
      {
        id: 'nasu-p1',
        name: {
          en: 'Paper I — General Knowledge and General Mental Ability Test (Stage I, Preliminary)',
          ne: 'प्रथम पत्र — सामान्य ज्ञान र सामान्य बौद्धिक परीक्षण (प्रथम चरण, प्रारम्भिक)',
        },
        fullMarks: 100,
        passMarks: 45,
        durationMinutes: 45,
        format: 'objective',
        pattern: {
          en: '50 multiple choice questions × 2 marks. A screening test only — the marks are not added to the main examination. 20 per cent is deducted for each wrong answer; nothing is deducted for a blank. No calculators.',
          ne: '५० वस्तुगत बहुवैकल्पिक प्रश्न × २ अङ्क। यो छनोट परीक्षा मात्र हो — यसको प्राप्ताङ्क मूल परीक्षाको अङ्कमा जोडिँदैन। प्रत्येक गलत उत्तरमा २० प्रतिशत अङ्क कट्टा हुन्छ; उत्तर नदिएमा कट्टा हुँदैन। क्याल्कुलेटर प्रयोग गर्न पाइँदैन।',
        },
        sections: [
          {
            id: 'nasu-p1-a',
            name: { en: '1. General Knowledge', ne: '१. सामान्य ज्ञान' },
            marks: 60,
            subjectIds: ['gk-nepal', 'gk-world', 'constitution', 'dev-economy', 'ict', 'current-affairs'],
            topics: [
              { en: '1.1 General information about the universe: the solar system; the earth, its origin and motion (1 question)', ne: '१.१ ब्रह्माण्ड सम्बन्धी जानकारी: सौर्यमण्डल; पृथ्वीको परिचय, उत्पत्ति र गति (१ प्रश्न)' },
              { en: '1.2 Geography of the world: continents, oceans, poles, latitude and longitude, the date line, mountains, deserts, earthquakes, volcanoes, rivers, glaciers, lakes, climate, trade winds and monsoon (2 questions)', ne: '१.२ विश्वको भूगोल: महादेश, महासागर, ध्रुव, अक्षांश, देशान्तर, अन्तर्राष्ट्रिय तिथि रेखा, पर्वतश्रृंखला, मरुभूमि, भूकम्प, ज्वालामुखी, नदी, हिमनदी, ताल, जलवायु, व्यापारिक वायु र मनसुन (२ प्रश्न)' },
              { en: '1.3 Geography of Nepal: physical features, natural resources, geographical diversity and life, and the climate types that shape livelihood (4 questions)', ne: '१.३ नेपालको भूगोल: धरातलीय स्वरुप, प्राकृतिक स्रोत, भौगोलिक विविधता र जनजीवन, र जीविकोपार्जन निर्धारण गर्ने हावापानीका किसिम (४ प्रश्न)' },
              { en: '1.4 History of the world: Magna Carta, the industrial, French and Russian revolutions, American independence, the two world wars and Indian independence (1 question)', ne: '१.४ विश्वको इतिहास: म्याग्नाकार्टा, औद्योगिक, फ्रान्सको र रुसी क्रान्ति, अमेरिकी स्वतन्त्रता, दुई विश्वयुद्ध र भारतीय स्वतन्त्रता (१ प्रश्न)' },
              { en: '1.5 History of Nepal from ancient times to the present: the Kirat, Lichhavi and medieval periods, and modern political events (2 questions)', ne: '१.५ नेपालको इतिहास (प्राचीन कालदेखि हालसम्म): किराँतकाल, लिच्छविकाल र मध्यकाल, र आधुनिक राजनीतिक घटनाक्रम (२ प्रश्न)' },
              { en: '1.6 Social and cultural aspects of Nepal: customs, values, religion, ethnicity, language, culture, art, literature, music and cultural heritage (4 questions)', ne: '१.६ नेपालको सामाजिक एवं सांस्कृतिक अवस्था: प्रथा, मूल्य, धर्म, जातजाति, भाषाभाषी, संस्कृति, कला, साहित्य, संगीत र सांस्कृतिक सम्पदा (४ प्रश्न)' },
              { en: '1.7 Economic status of Nepal: agriculture, industry, trade, tourism, transport, communication, education, health, electricity and development planning (3 questions)', ne: '१.७ नेपालको आर्थिक अवस्था: कृषि, उद्योग, व्यापार, पर्यटन, यातायात, संचार, शिक्षा, स्वास्थ्य, विद्युत र विकास योजना (३ प्रश्न)' },
              { en: '1.8 Science, technology and health: impact on human life, biotechnology, ICT, alternative energy, evolution and heredity, disease, vaccines, food, nutrition, sanitation and everyday materials (3 questions)', ne: '१.८ विज्ञान प्रविधि र स्वास्थ्य: मानव जीवनमा प्रभाव, जैविक प्रविधि, सूचना प्रविधि, वैकल्पिक ऊर्जा, क्रमविकास र वंशाणु, रोग, खोप, खाद्य, पोषण, सरसफाइ र दैनिक उपयोगका वस्तु (३ प्रश्न)' },
              { en: '1.9 Ecosystem and environment: types of ecosystem, bio-geochemical cycles, sustainable development, biodiversity, global warming, climate change, ozone depletion, pollution, population, urbanisation and settlement (3 questions)', ne: '१.९ पारिस्थितिक पद्धति र वातावरण: पारिस्थितिक पद्धतिका प्रकार, जीव भू-रासायनिक चक्र, दिगो विकास, जैविक विविधता, विश्वव्यापी उष्णता, जलवायु परिवर्तन, ओजोन विनास, प्रदूषण, जनसंख्या, सहरीकरण र बसोवास (३ प्रश्न)' },
              { en: '1.10 International affairs and institutions: relations with neighbours and other countries, the United Nations and its agencies, SAARC, BIMSTEC, ASEAN and the EU (2 questions)', ne: '१.१० अन्तर्राष्ट्रिय सम्बन्ध तथा संघ/संस्था: छिमेकी र अन्य देशसँगको सम्बन्ध, संयुक्त राष्ट्रसंघ र यसका विशिष्टीकृत संस्था, सार्क, बिमस्टेक, आसियान र युरोपियन संघ (२ प्रश्न)' },
              { en: '1.11 Current affairs of national and international importance — political, social, economic, scientific, cultural, sport, books, prizes, arts, literature and music — and noted personalities and thinkers (5 questions)', ne: '१.११ राष्ट्रिय र अन्तर्राष्ट्रिय महत्वका समसामयिक घटना — राजनीतिक, सामाजिक, आर्थिक, वैज्ञानिक, सांस्कृतिक, खेलकूद, पुस्तक, पुरस्कार, कला, साहित्य र संगीत — तथा महत्वपूर्ण व्यक्तित्व र विचारक (५ प्रश्न)' },
            ],
          },
          {
            id: 'nasu-p1-b',
            name: { en: '2. General Mental Ability Test', ne: '२. सामान्य बौद्धिक परीक्षण' },
            marks: 40,
            subjectIds: ['iq', 'maths'],
            topics: [
              { en: '2.1 Verbal reasoning: comprehension, vocabulary, series, analogy, classification, coding-decoding, missing letters and symbols, direction and distance, logical analysis, ranking, reason, induction and deduction (6 questions)', ne: '२.१ शाब्दिक तार्किक परीक्षण: बोध, शब्दज्ञान, अनुक्रम, समरुपता, वर्गीकरण, कोडिङ–डिकोडिङ, छोडिएका अक्षर/संकेत मिलाउने, दिशा र दुरी ज्ञान, तार्किक विश्लेषण, श्रेणीक्रम, भनाइ र कारण, आगमन र निगमन (६ प्रश्न)' },
              { en: '2.2 Quantitative reasoning: series, analogy, classification, coding, missing numbers, common factors, matrices, data interpretation and checking, arithmetic reasoning, percentage, fraction, decimal, ratio, average, profit and loss, calendar, time and work (8 questions)', ne: '२.२ मात्रात्मक (संख्यात्मक वा अंक सम्बन्धी) तार्किक परीक्षण: अनुक्रम, समरुपता, वर्गीकरण, कोडिङ, छोडिएका संख्या मिलाउने, साझा गुण, मेट्रिक्स, तथ्यांक व्याख्या र जाँच, अंकगणितीय तर्क, प्रतिशत, भिन्न, दशमलव, अनुपात, औसत, नाफा, नोक्सान, मिति/पात्रो, समय र काम (८ प्रश्न)' },
              { en: '2.3 Non-verbal reasoning: series, analogy, similarity, classification, pictorial analysis, Venn diagrams, matrix figures, triangles and squares, figure construction, point and position, water and mirror images, embedded figures and figure transformation (6 questions)', ne: '२.३ अशाब्दिक तार्किक परीक्षण: अनुक्रम, समरुपता, एकरुपता, वर्गीकरण, तार्किक चित्रात्मक विश्लेषण, भेन चित्र, मेट्रिक्स चित्र, त्रिभुज र वर्गको रचना, चित्र वा आकृति बनावट र विश्लेषण, विन्दु स्थान/स्थिति, पानीमा र ऐनामा देखिने आकृति, अन्तर्निहित आकृति र चित्रको स्थानान्तरण (६ प्रश्न)' },
            ],
          },
        ],
      },
      {
        id: 'nasu-p2',
        name: {
          en: 'Paper II — Contemporary Studies and Public Service Management (Stage II, Main)',
          ne: 'द्वितीय पत्र — समसामयिक अध्ययन र सार्वजनिक सेवा व्यवस्थापन (द्वितीय चरण, मूल)',
        },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 150,
        format: 'subjective',
        pattern: {
          en: '14 short questions × 5 marks and 3 long questions × 10 marks, in 2 hours 30 minutes. Each section has its own answer book.',
          ne: '१४ छोटो प्रश्न × ५ अङ्क र ३ लामो प्रश्न × १० अङ्क, २ घण्टा ३० मिनेटमा। प्रत्येक खण्डको छुट्टै उत्तरपुस्तिका हुन्छ।',
        },
        sections: [
          {
            id: 'nasu-p2-a',
            name: { en: 'Section A — Geographical, Social and Economic Condition of Nepal', ne: 'खण्ड क — नेपालको भौगोलिक, सामाजिक र आर्थिक अवस्था' },
            marks: 35,
            subjectIds: ['gk-nepal', 'dev-economy', 'current-affairs'],
            topics: [
              { en: 'Geographical condition and physical features: types and characteristics; political geography', ne: 'भौगोलिक अवस्था/स्वरुप: किसिम र विशेषता; राजनीतिक भूगोल' },
              { en: 'Climate and water resources: state and importance', ne: 'हावापानी र जलसम्पदा: स्थिति र महत्व' },
              { en: 'Forest resources: state and importance, causes of deforestation and measures of conservation', ne: 'वनसम्पदा: अवस्था र महत्व तथा वन विनाशका कारण र संरक्षणका उपायहरू' },
              { en: 'Major religions, ethnicities, languages and cultures', ne: 'प्रचलित प्रमुख धर्म, जातजाति, भाषाभाषी र संस्कृति' },
              { en: 'Dimensions of economic development: agriculture, industry, trade, tourism, employment and infrastructure', ne: 'आर्थिक विकासका पक्षहरू: कृषि, उद्योग, व्यापार, पर्यटन, रोजगार र पूर्वाधार' },
              { en: 'Carriers of economic development: the public, private and cooperative sectors', ne: 'आर्थिक विकासका सम्वाहकहरू: सार्वजनिक क्षेत्र, निजी क्षेत्र र सहकारी क्षेत्र' },
              { en: 'Planned development and the current periodic plan', ne: 'योजनावद्ध विकासक्रम र चालु आवधिक योजनाको जानकारी' },
              { en: 'Population management, urbanisation and migration', ne: 'जनसङ्ख्या व्यवस्थापन, शहरीकरण र बसाई सराई' },
              { en: 'Environment management, biodiversity, pollution, climate change and sustainable development', ne: 'वातावरण व्यवस्थापन, जैविक विविधता, वातावरण प्रदूषण, जलवायु परिवर्तन र दिगो विकास' },
              { en: 'Burning issues: poverty, unemployment, public health, food security, social security, the energy crisis, information technology and social media', ne: 'ज्वलन्त विषयहरू: गरीबी, बेरोजगारी, जनस्वास्थ्य, खाद्य सुरक्षा, सामाजिक सुरक्षा, ऊर्जा संकट, सूचना प्रविधि र सामाजिक संजाल' },
              { en: 'Contemporary activities of national and international importance', ne: 'राष्ट्रिय र अन्तर्राष्ट्रिय महत्वका समसामयिक गतिविधिहरू' },
            ],
          },
          {
            id: 'nasu-p2-b',
            name: { en: 'Section B — Constitutional Arrangement and Government', ne: 'खण्ड ख — संवैधानिक व्यवस्था र सरकार' },
            marks: 35,
            subjectIds: ['constitution', 'governance'],
            topics: [
              { en: 'The Constitution of Nepal: fundamental features; fundamental rights and duties; directive principles, policies and obligations of the state', ne: 'नेपालको संविधान: मूलभूत विशेषता; मौलिक हक र कर्तव्य; राज्यको निर्देशक सिद्धान्त, नीति तथा दायित्व' },
              { en: 'Structure of the state and the distribution of state power; the executive, legislature and judiciary', ne: 'राज्यको संरचना र राज्य शक्तिको बाँडफाँड; कार्यपालिका, व्यवस्थापिका र न्यायपालिका' },
              { en: 'Federalism in Nepal: the central, provincial and local governments', ne: 'नेपालमा संघीयता: केन्द्रीय, प्रादेशिक र स्थानीय सरकार' },
              { en: 'Duties and responsibilities of citizens, civil society and civic conscience or education', ne: 'नागरिकहरुको दायित्व र कर्तव्य, नागरिक समाज र नागरिक चेतना/शिक्षा' },
              { en: 'Meaning and importance of law; sources of law and precedent', ne: 'कानूनको अर्थ र महत्व; कानूनका स्रोतहरु र नजीर' },
              { en: 'The concept and importance of the rule of law', ne: 'कानूनी राज्यको अवधारणा र महत्व' },
              { en: 'Inclusion and proportional representation', ne: 'समावेशीकरण र समानुपातिक प्रतिनिधित्व' },
              { en: 'Democracy and human rights', ne: 'लोकतन्त्र र मानव अधिकार' },
              { en: 'The right to information and transparency', ne: 'सूचनाको हक र पारदर्शिता' },
              { en: 'E-governance', ne: 'विद्युतीय सुशासन (E-governance)' },
              { en: 'Good governance, promotion of integrity, and the law on controlling and preventing corruption', ne: 'सुशासन, सदाचार प्रवर्द्धन, भ्रष्टाचार नियन्त्रण र भ्रष्टाचार निवारण सम्बन्धी कानूनी व्यवस्था' },
            ],
          },
          {
            id: 'nasu-p2-c',
            name: { en: 'Section C — Public Service Delivery and Management', ne: 'खण्ड ग — सार्वजनिक सेवा संचालन एवं व्यवस्थापन' },
            marks: 30,
            subjectIds: ['office-mgmt', 'governance'],
            topics: [
              { en: 'Office management: the concept and importance of an office; records management; communication in the office; the management information system (MIS)', ne: 'कार्यालय व्यवस्थापन: कार्यालय र कार्यालय व्यवस्थापनको अवधारणा र महत्व; अभिलेख व्यवस्थापन; कार्यालयमा संचारको महत्व, प्रकार र माध्यम; व्यवस्थापन सूचना प्रणाली (MIS)' },
              { en: 'Accounting system and revenue administration: government accounting and audit; the financial working system of government; inventory, revenue and deposit ledger systems; revenue administration covering tax, customs and excise; the government budget', ne: 'लेखा प्रणाली र राजस्व प्रशासन: सरकारी लेखा प्रणाली र लेखापरीक्षण; सरकारको आर्थिक कार्य प्रणाली; जिन्सी, राजस्व र धरौटी श्रेस्ता प्रणाली; कर, भन्सार र अन्तःशुल्क सहितको राजस्व प्रशासन; सरकारी बजेट' },
              { en: 'Civil service: formation, recruitment, facilities, conduct, punishment and career development under the Civil Service Act and Rules; human resource planning and development; provincial and local service', ne: 'निजामती सेवा: निजामती सेवा ऐन र नियमावलीमा भएका गठन, पदपूर्ति, सेवा सुविधा, आचरण, सजाय र वृत्ति विकास; जनशक्ति योजना, विकास र व्यवस्थापन; प्रदेश र स्थानीय सेवा' },
              { en: 'Public service delivery: meaning and importance; the bodies, methods and channels that deliver it; the role of the provider and the rights and duties of the recipient', ne: 'सार्वजनिक सेवा प्रवाह: अर्थ र महत्व; सेवा प्रवाह गर्ने निकाय, तरिका/माध्यमहरू; सेवा प्रदायकको भूमिका र सेवाग्राहीको अधिकार तथा दायित्व' },
            ],
          },
        ],
      },
      {
        id: 'nasu-p3',
        name: {
          en: 'Paper III — Service Group Related Subject (Stage II, Main)',
          ne: 'तृतीय पत्र — सेवा समूह सम्बन्धी (द्वितीय चरण, मूल)',
        },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 150,
        format: 'subjective',
        pattern: {
          en: 'For the Administration Service, General Administration Group: 14 short questions × 5 marks and 3 long questions × 10 marks, in 2 hours 30 minutes. Other service groups sit a different Paper III.',
          ne: 'प्रशासन सेवा, सामान्य प्रशासन समूहका लागि: १४ छोटो प्रश्न × ५ अङ्क र ३ लामो प्रश्न × १० अङ्क, २ घण्टा ३० मिनेटमा। अन्य सेवा समूहको तृतीय पत्र फरक हुन्छ।',
        },
        sections: [
          {
            id: 'nasu-p3-a',
            name: { en: 'Section A — Office Operation and Organisational Behaviour', ne: 'खण्ड क — कार्यालय संचालन र संगठनात्मक व्यवहार' },
            marks: 35,
            subjectIds: ['office-mgmt'],
            topics: [
              { en: 'Registration, dispatch, filing and correspondence', ne: 'दर्ता, चलानी, फाइलिङ्ग र पत्रव्यवहार' },
              { en: 'Writing notes, proposals and reports', ne: 'टिपणी, प्रस्ताव र प्रतिवेदन लेखन' },
              { en: 'Public relations management', ne: 'जनसम्पर्क व्यवस्थापन' },
              { en: 'Handling complaints from service recipients', ne: 'सेवाग्राही गुनासो व्यवस्थापन' },
              { en: 'Meeting management and minuting decisions', ne: 'बैठक व्यवस्थापन र निर्णय (माइन्यूट) लेखन' },
              { en: 'Managing conferences, workshops and seminars', ne: 'गोष्ठी, कार्यशाला र सेमिनार व्यवस्थापन' },
              { en: 'Records management', ne: 'अभिलेख व्यवस्थापन' },
              { en: 'Monthly and annual progress management', ne: 'मासिक प्रगति/वार्षिक प्रगति सम्बन्धी व्यवस्थापन' },
              { en: 'Introduction to and importance of inventory ledgers; requisition forms, purchase orders, receipt reports and inventory accounts', ne: 'जिन्सी श्रेस्ताको परिचय र महत्व; माग फाराम, खरिद आदेश, दाखिला रिपोर्ट र जिन्सी खाता' },
              { en: 'Job descriptions and the delegation of authority', ne: 'कार्य विवरण र अधिकार प्रत्यायोजन' },
              { en: 'Office inspection and monitoring', ne: 'कार्यालय निरीक्षण र अनुगमन' },
              { en: 'Arrangements for clearing administrative business', ne: 'प्रशासकीय कार्य फछ्र्यौट सम्बन्धी व्यवस्था' },
              { en: 'Organisational norms and the status system', ne: 'संगठनात्मक मान्यता (Norm) र मर्यादा प्रणाली (Status System)' },
            ],
          },
          {
            id: 'nasu-p3-b',
            name: { en: 'Section B — Administration and Management', ne: 'खण्ड ख — प्रशासन तथा व्यवस्थापन' },
            marks: 35,
            subjectIds: ['governance', 'office-mgmt'],
            topics: [
              { en: 'Public administration: introduction, objectives and functions; public administration and development administration', ne: 'सार्वजनिक प्रशासनको परिचय, उद्देश्य र कार्यहरू; सार्वजनिक प्रशासन र विकास प्रशासन' },
              { en: 'Appointment, deputation, transfer, promotion, leave, conduct, retirement and departmental punishment of civil servants', ne: 'निजामती कर्मचारीको नियुक्ति, काज, सरुवा, बढुवा, बिदा, आचरण, अवकाश र विभागीय सजाय' },
              { en: 'Organisation: introduction, objectives, forms and the bases of organisation', ne: 'संगठनको परिचय, उद्देश्य, स्वरुप र संगठनका आधारहरु' },
              { en: 'Introduction and functions of the CIAA, the Public Service Commission, the Office of the Auditor General, the Office of the Prime Minister and Council of Ministers, the Ministry of Federal Affairs and General Administration, and the Federal Parliament Secretariat', ne: 'अख्तियार दुरुपयोग अनुसन्धान आयोग, लोक सेवा आयोग, महालेखा परीक्षकको कार्यालय, प्रधानमन्त्री तथा मन्त्रिपरिषदको कार्यालय, संघीय मामिला तथा सामान्य प्रशासन मन्त्रालय र संघीय संसद सचिवालयको परिचय तथा कार्यहरु' },
              { en: 'Management: introduction, concept, objectives, scope and functions', ne: 'व्यवस्थापनको परिचय, अवधारणा, उद्देश्य, क्षेत्र र कार्यहरू' },
              { en: 'Leadership, decision making, motivation and morale', ne: 'नेतृत्व, निर्णय, उत्प्रेरणा र मनोवल' },
              { en: 'The need for and importance of control and coordination', ne: 'नियन्त्रण र समन्वयको आवश्यकता र महत्व' },
              { en: 'Group dynamics', ne: 'समूह गतिशिलता' },
              { en: 'Organisational change and development', ne: 'संगठनात्मक परिवर्तन र विकास' },
              { en: 'The importance of time management', ne: 'समय व्यवस्थापनको महत्व' },
            ],
          },
          {
            id: 'nasu-p3-c',
            name: { en: 'Section C — Law Relating to Public Service Management', ne: 'खण्ड ग — सार्वजनिक सेवा व्यवस्थापन सम्बन्धी कानूनी व्यवस्था' },
            marks: 30,
            subjectIds: ['governance', 'constitution'],
            topics: [
              { en: 'The Government of Nepal (Allocation of Business) Rules', ne: 'नेपाल सरकारको कार्य विभाजन नियमावली' },
              { en: 'Law on the operation of local government', ne: 'स्थानीय सरकार संचालन सम्बन्धी कानूनी व्यवस्था' },
              { en: 'Local Administration Act, 2028', ne: 'स्थानीय प्रशासन ऐन, २०२८' },
              { en: 'Good Governance (Management and Operation) Act, 2064', ne: 'सुशासन (व्यवस्थापन तथा संचालन) ऐन, २०६४' },
              { en: 'Public procurement and the law governing it', ne: 'सार्वजनिक खरिद र यस सम्बन्धी कानूनी व्यवस्था' },
              { en: 'The right to information and the law governing it', ne: 'सूचनाको हक तथा यस सम्बन्धी कानूनी व्यवस्था' },
              { en: 'Financial procedure, fiscal responsibility and the law governing them', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व तथा यस सम्बन्धी कानूनी व्यवस्था' },
              { en: 'Disaster risk reduction and management, and the law governing it', ne: 'विपत जोखिम न्यूनीकरण तथा व्यवस्थापन तथा यस सम्बन्धी कानूनी व्यवस्था' },
              { en: 'The concept and practice of preventing money laundering, and the law governing it', ne: 'सम्पत्ति शुद्धीकरण (मनी लाउण्डरिङ्ग) निवारण अवधारणा र अभ्यास तथा यस सम्बन्धी कानूनी व्यवस्था' },
              { en: 'Federal Parliament Secretariat Act, 2064 and the Federal Parliament Secretariat Staff Administration Rules, 2065', ne: 'संघीय संसद सचिवालय सम्बन्धी ऐन, २०६४ र संघीय संसद सचिवालय कर्मचारी प्रशासन नियमावली, २०६५' },
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
    grade: {
      en: 'Non-gazetted Second Class — Judicial, Administration, Audit and Parliament Services',
      ne: 'राजपत्र अनंकित द्वितीय श्रेणी — न्याय, प्रशासन, लेखापरीक्षण र संसद सेवा',
    },
    summary: {
      en: 'The entry level assistant post, also under the Integrated and Unified Examination System: a screening preliminary, two subjective main papers, then a computer skill test and interview.',
      ne: 'प्रवेश तहको सहायक पद, यो पनि संयुक्त र एकीकृत परीक्षा प्रणाली अन्तर्गत: छनोट प्रारम्भिक परीक्षा, दुई विषयगत मूल पत्र, अनि कम्प्युटर सीप परीक्षण र अन्तर्वार्ता।',
    },
    accent: '#b45309',
    icon: '🗂️',
    minQualification: {
      en: 'School Education Examination (SEE) or equivalent passed.',
      ne: 'माध्यमिक शिक्षा परीक्षा (एसईई) वा सो सरह उत्तीर्ण।',
    },
    mock: { questionCount: 50, durationMinutes: 45, marksPerQuestion: 2, negativePerWrong: 0.4, passPercent: 45 },
    papers: [
      {
        id: 'kharidar-p1',
        name: {
          en: 'Paper I — General Knowledge and Basic Office Skills Test (Stage I, Preliminary)',
          ne: 'प्रथम पत्र — सामान्य ज्ञान तथा आधारभुत कार्यालय सीप परीक्षण (प्रथम चरण, प्रारम्भिक)',
        },
        fullMarks: 100,
        passMarks: 45,
        durationMinutes: 45,
        format: 'objective',
        pattern: {
          en: '50 multiple choice questions × 2 marks. A screening test only — the marks are not added to the main examination. 20 per cent is deducted for each wrong answer; nothing is deducted for a blank. No calculators.',
          ne: '५० वस्तुगत बहुवैकल्पिक प्रश्न × २ अङ्क। यो छनोट परीक्षा मात्र हो — यसको प्राप्ताङ्क मूल परीक्षाको अङ्कमा जोडिँदैन। प्रत्येक गलत उत्तरमा २० प्रतिशत अङ्क कट्टा हुन्छ; उत्तर नदिएमा कट्टा हुँदैन। क्याल्कुलेटर प्रयोग गर्न पाइँदैन।',
        },
        sections: [
          {
            id: 'kharidar-p1-a',
            name: { en: 'Section A — General Knowledge', ne: 'खण्ड क — सामान्य ज्ञान' },
            marks: 60,
            subjectIds: ['gk-nepal', 'gk-world', 'constitution', 'dev-economy', 'current-affairs'],
            topics: [
              { en: '1. Solar system and geography: the solar system and the earth; world geography — continents, oceans, poles, latitude, longitude, time, distance, mountains, earthquakes, volcanoes, rivers, glaciers, lakes and climate; geography of Nepal — location, physical features and natural resources (6 questions)', ne: '१. सौर्यमण्डल र भूगोल: सौर्यमण्डल र पृथ्वी; विश्वको भूगोल — महादेश, महासागर, ध्रुव, अक्षांश, देशान्तर, समय, दुरी, पर्वतश्रृंखला, भूकम्प, ज्वालामुखी, नदी, हिमनदी, ताल र जलवायु; नेपालको भूगोल — भौगोलिक अवस्था, धरातलीय स्वरुप र प्राकृतिक सम्पदा (६ प्रश्न)' },
              { en: '2. History: world history — the industrial, French and Russian revolutions, American independence, the world wars and Indian independence; history of Nepal from ancient times to the present (6 questions)', ne: '२. इतिहास: विश्वको इतिहास — औद्योगिक क्रान्ति, फ्रान्सको राज्यक्रान्ति, अमेरिकी स्वतन्त्रता सङ्ग्राम, रुसी/अक्टोवर क्रान्ति, विश्वयुद्ध र भारतीय स्वतन्त्रता सङ्ग्राम; नेपालको इतिहास (प्राचीन कालदेखि हालसम्म) (६ प्रश्न)' },
              { en: '3. Social and economic condition of Nepal and its system of governance: society, tradition, values, religion, ethnicity, language, culture, art, literature, music and heritage; economic indicators — growth, GDP, per capita income, remittance, foreign investment and foreign aid; the economy — agriculture, industry, trade, tourism, transport, communication and development planning; the constitution, the federal system of governance and the political system (6 questions)', ne: '३. नेपालको सामाजिक, आर्थिक अवस्था र शासनपद्धति: सामाजिक अवस्था, परम्परा, मूल्य र मान्यता, धर्म, जातजाति, भाषाभाषी, संस्कृति, कला, साहित्य, संगीत र सांस्कृतिक सम्पदा; आर्थिक परिसूचकहरू — आर्थिक वृद्धि, कुल ग्राहस्थ उत्पादन, प्रति व्यक्ति आय, विप्रेषण, वैदेशिक लगानी र वैदेशिक सहयोग; आर्थिक अवस्था — कृषि, उद्योग, व्यापार, पर्यटन, यातायात, संचार र विकास योजना; संविधान, संघीय शासन प्रणाली र राजनीतिक व्यवस्था (६ प्रश्न)' },
              { en: '4. Science and technology, public health and environment: major inventions and the latest developments affecting human life; public health, disease, food and nutrition; environment, biodiversity, sustainable development, climate change, environmental management, pollution, population, urbanisation and settlement (6 questions)', ne: '४. विज्ञान प्रविधि, जनस्वास्थ्य र वातावरण: मानव जीवनमा प्रत्यक्ष प्रभाव पार्ने विज्ञानका प्रमुख आविष्कार र नविनतम गतिविधि; जनस्वास्थ्य, रोग, खाद्य र पोषण; पर्यावरण, जैविक विविधता, दिगो विकास, जलवायु परिवर्तन, वातावरण व्यवस्थापन, प्रदूषण, जनसंख्या, शहरीकरण र बसोवास (६ प्रश्न)' },
              { en: '5. International relations and current affairs: international relations and institutions — the United Nations and the regional organisations SAARC, ASEAN and the European Union; contemporary activities of national and international importance, and noted personalities and thinkers (6 questions)', ne: '५. अन्तर्राष्ट्रिय सम्बन्ध र समसामयिक गतिविधिहरू: अन्तर्राष्ट्रिय सम्बन्ध तथा संघ/संस्था — संयुक्त राष्ट्रसंघ र क्षेत्रीय संगठन (सार्क, आसियान, युरोपियन युनियन); राष्ट्रिय र अन्तर्राष्ट्रिय महत्वका समसामयिक गतिविधि र महत्वपूर्ण व्यक्तित्व तथा विचारक (६ प्रश्न)' },
            ],
          },
          {
            id: 'kharidar-p1-b',
            name: { en: 'Section B — Basic Office Skills Test (BOST)', ne: 'खण्ड ख — आधारभुत कार्यालय सीप परीक्षण' },
            marks: 40,
            subjectIds: ['bost'],
            topics: [
              { en: 'Verification test: checking data, numbers or written information for errors, sameness or difference (2 questions)', ne: 'रुजु गर्ने: तथ्यांक, संख्या वा शाब्दिक सूचनालाई जाँच गर्ने वा त्रुटि पत्ता लगाउने अथवा समानता वा भिन्नता पत्ता लगाउने (२ प्रश्न)' },
              { en: 'Completion: filling a blank, order, pattern or matrix in a verbal, numerical or pictorial description (2 questions)', ne: 'खाली स्थान वा क्रम पुरा गर्ने: शाब्दिक, संख्यात्मक वा अशाब्दिक विवरणको खाली स्थान, क्रम, ढाँचा वा मेट्रिक्स पुरा गर्ने (२ प्रश्न)' },
              { en: 'Classification: classifying or finding the difference in a verbal, numerical or pictorial description (2 questions)', ne: 'वर्गीकरण गर्ने: शाब्दिक, संख्यात्मक वा अशाब्दिक विवरणलाई तार्किक रुपमा वर्गीकरण गर्ने वा भिन्नता पत्ता लगाउने (२ प्रश्न)' },
              { en: 'Analogy: finding the relationship in a verbal, numerical or pictorial description (2 questions)', ne: 'सम्बन्ध परीक्षण: शाब्दिक, संख्यात्मक वा अशाब्दिक विवरणको तार्किक सम्बन्ध पत्ता लगाउने (२ प्रश्न)' },
              { en: 'Filing aptitude test: arranging verbal and numerical filing items or processes in alphabetical, numerical or chronological order (2 questions)', ne: 'फाइलिङ अभिरुचि परीक्षण: शाब्दिक र संख्यात्मक फाइलिङ वस्तु वा प्रक्रियालाई वर्णमालाक्रम, संख्यात्मकक्रम वा कालक्रम अनुसार मिलाउने (२ प्रश्न)' },
              { en: 'Follows the instructions: solving by following a written instruction exactly (2 questions)', ne: 'निर्देशन अनुसरण गर्ने: दिएको लिखित निर्देशनलाई हुबहु अनुसरण गरी समाधान गर्ने (२ प्रश्न)' },
              { en: 'Numerical reasoning test: general arithmetic operations (2 questions)', ne: 'संख्यात्मक चार्तुयता परीक्षण: सामान्य अंकगणितीय क्रिया (२ प्रश्न)' },
              { en: 'Coding and matching test: coding and matching a verbal or numerical description (2 questions)', ne: 'कोडिङ र भिडान परीक्षण: शाब्दिक वा संख्यात्मक विवरणको कोडिङ र भिडान (२ प्रश्न)' },
              { en: 'Analytical reasoning test: verbal, numerical or pictorial analytical reasoning (2 questions)', ne: 'विश्लेषणात्मक तार्किकता परीक्षण: शाब्दिक, संख्यात्मक वा अशाब्दिक विश्लेषणात्मक तार्किकता (२ प्रश्न)' },
              { en: 'Direction and distance sense test: working out direction and distance (2 questions)', ne: 'दिशा र दुरी ज्ञान परीक्षण: दिशा र दुरी पत्ता लगाउने (२ प्रश्न)' },
            ],
          },
        ],
      },
      {
        id: 'kharidar-p2',
        name: {
          en: 'Paper II — Office Management (Stage II, Main)',
          ne: 'द्वितीय पत्र — कार्यालय व्यवस्थापन (द्वितीय चरण, मूल)',
        },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 150,
        format: 'subjective',
        pattern: {
          en: '12 short questions × 5 marks and 4 long questions × 10 marks, in 2 hours 30 minutes. The question paper is set in Nepali; answers may be written in Nepali or English.',
          ne: '१२ छोटो प्रश्न × ५ अङ्क र ४ लामो प्रश्न × १० अङ्क, २ घण्टा ३० मिनेटमा। प्रश्नपत्रको माध्यम भाषा नेपाली हुन्छ; उत्तर नेपाली वा अंग्रेजीमा लेख्न सकिन्छ।',
        },
        sections: [
          {
            id: 'kharidar-p2-a',
            name: { en: 'Section A — Office Management', ne: 'खण्ड क — कार्यालय व्यवस्थापन' },
            marks: 40,
            subjectIds: ['office-mgmt'],
            topics: [
              { en: 'Office and staff: the office — introduction, importance, functions and types; the duties and qualities of an assistant; office resources; the importance, kinds and means of communication in an office', ne: 'कार्यालय र कर्मचारी: कार्यालयको परिचय, महत्व, कार्य र प्रकार; सहायक कर्मचारीका कार्य र गुणहरू; कार्यालय स्रोत साधन; कार्यालयमा सञ्चारको महत्व, किसिम र साधन' },
              { en: 'Office procedure — correspondence: introduction, purpose and qualities of a letter; types of letter by use and priority; registration and dispatch; notices, circulars and orders', ne: 'कार्यालय कार्यविधि — पत्र व्यवहार: परिचय, उद्देश्य र चिठी/पत्रका गुणहरू; चिठीका प्रकार (प्रयोग र प्राथमिकताको आधारमा); दर्ता र चलानी; सूचना, परिपत्र र तोक आदेश' },
              { en: 'Note writing and what to bear in mind when preparing a note', ne: 'टिप्पणी लेखन र टिप्पणी तयार पार्दा ध्यान दिनुपर्ने कुराहरू' },
              { en: 'Report writing: introduction, what to bear in mind and types', ne: 'प्रतिवेदन लेखन: परिचय, तयार पार्दा ध्यान दिनुपर्ने कुराहरू र प्रकार' },
              { en: 'Record management: introduction, purpose and types of record; modern technology in record management; filing — introduction, need and methods; indexing — introduction, importance and types', ne: 'अभिलेख व्यवस्थापन: अभिलेखको परिचय, उद्देश्य र प्रकार; अभिलेख व्यवस्थापनमा आधुनिक प्रविधिको प्रयोग; फाइलिङ — परिचय, आवश्यकता, विधि एवं तरिका; अनुक्रमणिका — परिचय, महत्व र प्रकार' },
              { en: 'Meeting management and minuting decisions', ne: 'बैठक व्यवस्थापन तथा निर्णय अभिलेख (Minuting)' },
              { en: 'Public relations and the methods of handling complaints from service recipients', ne: 'जनसम्पर्क र सेवाग्राही गुनासो व्यवस्थापनको तरिका र विधि' },
            ],
          },
          {
            id: 'kharidar-p2-b',
            name: { en: 'Section B — Constitution and Civic Conscience', ne: 'खण्ड ख — संविधान र नागरिक सचेतना' },
            marks: 30,
            subjectIds: ['constitution', 'governance'],
            topics: [
              { en: 'The Constitution of Nepal: fundamental rights and duties; directive principles, policies and obligations of the state', ne: 'नेपालको संविधान: मौलिक हक र कर्तव्य; राज्यको निर्देशक सिद्धान्त, नीति तथा दायित्व' },
              { en: 'Introduction and functions of the Commission for the Investigation of Abuse of Authority', ne: 'अख्तियार दुरुपयोग अनुसन्धान आयोगको परिचय तथा कार्यहरू' },
              { en: 'Introduction and functions of the Office of the Auditor General', ne: 'महालेखा परीक्षकको कार्यालयको परिचय तथा कार्यहरू' },
              { en: 'Introduction and functions of the Public Service Commission', ne: 'लोक सेवा आयोगको परिचय तथा कार्यहरू' },
              { en: 'Introduction and functions of the Election Commission', ne: 'निर्वाचन आयोगको परिचय तथा कार्यहरू' },
              { en: 'Introduction and functions of the National Human Rights Commission', ne: 'राष्ट्रिय मानव अधिकार आयोगको परिचय तथा कार्यहरू' },
              { en: 'Introduction and functions of the Office of the Prime Minister and Council of Ministers', ne: 'प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालयको परिचय तथा कार्यहरू' },
              { en: 'Introduction and functions of the Ministry of Federal Affairs and General Administration', ne: 'संघीय मामिला तथा सामान्य प्रशासन मन्त्रालयको परिचय तथा कार्यहरू' },
              { en: 'Introduction and functions of the Federal Parliament Secretariat', ne: 'संघीय संसद सचिवालयको परिचय तथा कार्यहरू' },
              { en: 'Civic conscience: character development, human values, civil rights and duties, discipline and positive thinking', ne: 'नागरिक सचेतना: चारित्रिक विकास, मानवीय मूल्य मान्यता, नागरिक कर्तव्य र दायित्व तथा अनुशासन र सकारात्मक सोच' },
            ],
          },
          {
            id: 'kharidar-p2-c',
            name: { en: 'Section C — General Mathematics', ne: 'खण्ड ग — सामान्य गणित' },
            marks: 30,
            subjectIds: ['maths'],
            topics: [
              { en: 'Fundamental operations in mathematics and the unitary method', ne: 'गणितका आधारभूत क्रियाहरू तथा ऐकिक नियम' },
              { en: 'Fraction, decimal, percentage and ratio', ne: 'भिन्न, दशमलव, प्रतिशत र अनुपात' },
              { en: 'Profit, loss and discount', ne: 'नाफा, नोक्सान र छुट' },
              { en: 'Tax, commission and depreciation', ne: 'कर, कमिसन र ह्रासकट्टी' },
              { en: 'Simple interest and compound interest', ne: 'साधारण ब्याज र मिश्रित ब्याज' },
              { en: 'Average', ne: 'औसत' },
              { en: 'Household arithmetic: simple problems on electricity, water and telephone bills and money exchange', ne: 'घरायसी अङ्कगणित: बिजुली, पानी र टेलिफोनको महसुल तथा मुद्रा विनिमय सम्बन्धी सरल समस्या' },
              { en: 'Mensuration: length, breadth, perimeter, area and volume', ne: 'क्षेत्रमिति: लम्बाइ, चौडाइ, परिमिति, क्षेत्रफल र आयतन' },
            ],
          },
        ],
      },
      {
        id: 'kharidar-p3',
        name: {
          en: 'Paper III — Job Knowledge Related Subject (Stage II, Main)',
          ne: 'तृतीय पत्र — कार्य ज्ञान सम्बन्धी (द्वितीय चरण, मूल)',
        },
        fullMarks: 100,
        passMarks: 40,
        durationMinutes: 150,
        format: 'subjective',
        pattern: {
          en: '8 short questions × 5 marks and 6 long questions × 10 marks, in 2 hours 30 minutes.',
          ne: '८ छोटो प्रश्न × ५ अङ्क र ६ लामो प्रश्न × १० अङ्क, २ घण्टा ३० मिनेटमा।',
        },
        sections: [
          {
            id: 'kharidar-p3-a',
            name: { en: 'Section A — Public Service Management', ne: 'खण्ड क — सार्वजनिक सेवा व्यवस्थापन' },
            marks: 35,
            subjectIds: ['governance', 'office-mgmt'],
            topics: [
              { en: 'The Civil Service Act and Rules: formation of the civil service, recruitment methods and processes; appointment, transfer, promotion, leave, departmental punishment and retirement; the conduct and duties a civil servant must observe', ne: 'निजामती सेवा ऐन र नियमावली: निजामती सेवाको गठन, पदपूर्ति गर्ने तरिका र प्रक्रिया; कर्मचारीको नियुक्ति, सरुवा, बढुवा, बिदा, विभागीय सजाय र अवकाश; कर्मचारीले पालन गर्नुपर्ने आचरण र कर्तव्य' },
              { en: 'Public service delivery: meaning and importance, and the bodies, methods and channels that deliver it', ne: 'सार्वजनिक सेवा प्रवाहको अर्थ र महत्व तथा सेवा प्रवाह गर्ने निकाय, तरिका र माध्यमहरू' },
              { en: 'The public charter: importance and necessity', ne: 'सार्वजनिक बडापत्र (Public Charter): महत्व र आवश्यकता' },
              { en: 'Good Governance (Management and Operation) Act, 2064 — chapters 1, 2, 4 and 5', ne: 'सुशासन (व्यवस्थापन तथा संचालन) ऐन, २०६४ को परिच्छेद १, २, ४ र ५' },
              { en: 'Right to Information Act, 2064 — chapters 1, 2 and 4', ne: 'सूचनाको हक सम्बन्धी ऐन, २०६४ को परिच्छेद १, २ र ४' },
              { en: 'Prevention of Corruption Act, 2059 — chapters 1 and 2', ne: 'भ्रष्टाचार निवारण ऐन, २०५९ को परिच्छेद १ र २' },
              { en: 'Federal, Provincial and Local Level (Coordination and Interrelationship) Act, 2077 — chapter 2', ne: 'संघ, प्रदेश र स्थानीय तह (समन्वय तथा अन्तरसम्बन्ध) ऐन, २०७७ को परिच्छेद २' },
              { en: 'Right to Food and Food Sovereignty Act, 2075 — chapters 1, 2 and 3', ne: 'खाद्य अधिकार तथा खाद्य सम्प्रभुता ऐन, २०७५ को परिच्छेद १, २ र ३' },
              { en: 'Vital registration and the national identity card', ne: 'व्यक्तिगत घटना दर्ता र राष्ट्रिय परिचय-पत्र' },
              { en: 'A general introduction to e-governance; the importance of information and communication technology and the precautions to take when using it', ne: 'विद्युतीय शासन प्रणाली (E-governance) को सामान्य परिचय; सूचना तथा सञ्चार प्रविधिको महत्व र प्रयोग गर्दा अपनाउनु पर्ने सावधानीहरू' },
            ],
          },
          {
            id: 'kharidar-p3-b',
            name: { en: 'Section B — Accounting, Procurement and Public Finance', ne: 'खण्ड ख — लेखा, खरिद र सार्वजनिक वित्त' },
            marks: 35,
            subjectIds: ['office-mgmt', 'dev-economy'],
            topics: [
              { en: 'Accounting and the accounting system: introduction, objectives and characteristics', ne: 'लेखा र लेखा प्रणाली: परिचय, उद्देश्य र विशेषताहरू' },
              { en: 'Budget estimation and approval, and the Line Ministry Budget Information System (LMBIS)', ne: 'बजेट अनुमान र स्वीकृति तथा मन्त्रालयगत बजेट सूचना प्रणाली (LMBIS)' },
              { en: 'Charts of accounts, the Treasury Single Account (TSA), the Revenue Management Information System (RMIS), the Computerised Government Accounting System (CGAS) and deposit accounts', ne: 'खाता सूची (Charts of Accounts), एकलखाता कोष (TSA), राजस्व व्यवस्थापन सूचना प्रणाली (RMIS) र कम्प्युटराइज्ड सरकारी लेखा प्रणाली (CGAS) र धरौटी लेखा' },
              { en: 'Journal vouchers, the bank cash book, budget accounts, the statement of expenditure, bank reconciliation and financial statements', ne: 'गोश्वारा भौचर, बैंक नगदी किताब, बजेट हिसाब, मास्केबारी, खर्चको फाँटवारी, बैंक हिसाव विवरण र आर्थिक विवरण' },
              { en: 'Public procurement management: purpose, importance, methods and process', ne: 'सार्वजनिक खरिद व्यवस्थापन: उद्देश्य, महत्व, विधि र प्रक्रिया' },
              { en: 'Inventory management: requisition form, purchase order, receipt report, inventory ledger, inventory inspection, purchase and auction; the Public Asset Management System (PAMS)', ne: 'जिन्सी व्यवस्थापन: माग फाराम, खरिद आदेश, दाखिला रिपोर्ट, जिन्सी खाता, जिन्सी निरीक्षण, खरिद र लिलाम; सरकारी सम्पत्ती व्यवस्थापन प्रणाली (PAMS)' },
              { en: 'Auditing: introduction, objectives and types; irregularities (beruju), their settlement, the irregularity register and re-audit', ne: 'लेखापरीक्षण: परिचय, उद्देश्य र प्रकार; बेरुजु, बेरुजु फछ्र्यौट, बेरुजु लगत र सम्परीक्षण' },
              { en: 'Value added tax: introduction, registration and deregistration, filing a return, withholding arrangements, and which goods are taxable', ne: 'मूल्य अभिवृद्धि कर: परिचय, दर्ता र खारेजी प्रक्रिया, कर विवरण दाखिला, कर कट्टी सम्बन्धी व्यवस्था तथा कर लाग्ने र नलाग्ने वस्तु' },
              { en: 'Financial Procedure and Fiscal Responsibility Act, 2076: internal control, audit, fiscal responsibility and accountability', ne: 'आर्थिक कार्यविधि तथा वित्तिय उत्तरदायित्व ऐन, २०७६: आन्तरिक नियन्त्रण तथा लेखापरीक्षण र वित्तिय उत्तरदायित्व, जिम्मेवारी एवं जवाफदेहिता' },
              { en: 'Income Tax Act, 2058 — chapter 17 (withholding tax on payments); Audit Act, 2075 — section 8 (what is audited)', ne: 'आयकर ऐन, २०५८ को परिच्छेद १७ (भुक्तानी कर कट्टी); लेखापरीक्षण ऐन, २०७५ (दफा ८ — लेखापरीक्षण गर्ने विषय)' },
            ],
          },
          {
            id: 'kharidar-p3-c',
            name: { en: 'Section C — Law and Justice', ne: 'खण्ड ग — कानून र न्याय सम्बन्धी जानकारी' },
            marks: 30,
            subjectIds: ['constitution', 'governance'],
            topics: [
              { en: 'The meaning and importance of law, and its sources', ne: 'कानूनको अर्थ, महत्व र कानूनका स्रोतहरू' },
              { en: 'A general introduction to acts, rules, by-laws, formation orders and the gazette', ne: 'ऐन, नियम, विनियम, गठन आदेश र राजपत्रको सामान्य परिचय' },
              { en: 'The tiers, structure and jurisdiction of the courts', ne: 'अदालतका तह, संरचना र क्षेत्राधिकार' },
              { en: 'An introduction to limitation, prescription, deadlines and hearing dates', ne: 'हकदैया, हदम्याद, म्याद र तारिखको परिचय' },
              { en: 'The form a written submission must take, its registration and endorsement', ne: 'लिखतमा पुर्‍याउनु पर्ने रीत, दर्ता र दरपीठ' },
              { en: 'Service of summons', ne: 'म्याद तामेली' },
              { en: 'First information report, arrest warrant, seizure deed, charge sheet and preliminary hearing', ne: 'जाहेरी दरखास्त, पक्राउ पुर्जी, बरामदी मुचुल्का, अभियोगपत्र र प्रारम्भिक सुनुवाइ' },
              { en: 'Free legal aid', ne: 'निःशुल्क कानूनी सहायता' },
              { en: 'Main features of the Civil Code and the Civil Procedure Code', ne: 'मुलुकी देवानी संहिता र देवानी कार्यविधि संहिताका प्रमुख विशेषताहरू' },
              { en: 'Main features of the Criminal Code and the Criminal Procedure Code', ne: 'मुलुकी अपराध संहिता र मुलुकी फौजदारी कार्यविधि संहिताका प्रमुख विशेषताहरू' },
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

/** One subject as it appears in the first paper, across every post. */
export interface FirstPaperSubject {
  subjectId: string;
  /** Posts whose first paper covers this subject. */
  levels: LevelId[];
  /** Where it sits in each post's first paper. */
  placements: {
    levelId: LevelId;
    sectionName: Bilingual;
    marks?: number;
    topics: Bilingual[];
  }[];
  /** Marks across every post that examines it, for rough weighting. */
  totalMarks: number;
}

/**
 * The first paper, pooled across all three posts.
 *
 * Nayab Subba and Kharidar sit the same first paper. The Section Officer paper
 * is set differently — a different pattern, and no general intelligence
 * section — so a subject is tagged with the posts that actually examine it
 * rather than being presented as common to all when it is not.
 */
export function firstPaperSubjects(): FirstPaperSubject[] {
  const bySubject = new Map<string, FirstPaperSubject>();

  for (const level of LEVELS) {
    const paper = level.papers[0];
    if (!paper) continue;
    for (const section of paper.sections) {
      for (const subjectId of section.subjectIds) {
        let entry = bySubject.get(subjectId);
        if (!entry) {
          entry = { subjectId, levels: [], placements: [], totalMarks: 0 };
          bySubject.set(subjectId, entry);
        }
        if (!entry.levels.includes(level.id)) entry.levels.push(level.id);
        entry.placements.push({
          levelId: level.id,
          sectionName: section.name,
          marks: section.marks,
          topics: section.topics,
        });
        entry.totalMarks += section.marks ?? 0;
      }
    }
  }

  // Subjects every post examines come first; then by how much they are worth.
  return [...bySubject.values()].sort(
    (a, b) => b.levels.length - a.levels.length || b.totalMarks - a.totalMarks,
  );
}

/** True when every post's first paper covers this subject. */
export function isCommonToAllPosts(subject: FirstPaperSubject): boolean {
  return subject.levels.length === LEVELS.length;
}
