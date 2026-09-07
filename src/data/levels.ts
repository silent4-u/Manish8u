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
            subjectIds: ['iq'],
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
