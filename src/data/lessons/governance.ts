import type { Lesson } from '../../types';

export const governanceLessons: Lesson[] = [
  {
    id: 'gov-01',
    subjectId: 'governance',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Good Governance — Concept, Principles and Law', ne: 'सुशासन — अवधारणा, सिद्धान्त र कानून' },
    summary: {
      en: 'The eight characteristics of good governance, the 2064 Act and the tools that operationalise it.',
      ne: 'सुशासनका आठ विशेषता, सुशासन ऐन २०६४ र यसलाई कार्यान्वयन गर्ने औजारहरू।',
    },
    readMinutes: 8,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Good governance means the exercise of state authority in a way that is lawful, transparent, accountable, inclusive and responsive to citizens. In Nepal it is given statutory shape by the Good Governance (Management and Operation) Act, 2064 BS and its Rules, 2065.',
          ne: 'सुशासन भन्नाले राज्य शक्तिको प्रयोग कानूनसम्मत, पारदर्शी, जवाफदेही, समावेशी र नागरिकप्रति उत्तरदायी ढंगले गर्नु हो। नेपालमा यसलाई सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ र नियमावली, २०६५ ले कानूनी रूप दिएका छन्।',
        },
      },
      { type: 'heading', text: { en: 'Eight characteristics of good governance', ne: 'सुशासनका आठ विशेषता' } },
      {
        type: 'list',
        items: [
          { en: 'Rule of law', ne: 'विधिको शासन' },
          { en: 'Transparency', ne: 'पारदर्शिता' },
          { en: 'Accountability', ne: 'जवाफदेहिता' },
          { en: 'Participation', ne: 'सहभागिता' },
          { en: 'Responsiveness', ne: 'उत्तरदायित्व / जवाफदेही प्रतिक्रिया' },
          { en: 'Consensus orientation', ne: 'सहमति उन्मुखता' },
          { en: 'Equity and inclusiveness', ne: 'समता र समावेशीकरण' },
          { en: 'Effectiveness and efficiency', ne: 'प्रभावकारिता र दक्षता' },
        ],
      },
      { type: 'heading', text: { en: 'Key provisions of the Good Governance Act 2064', ne: 'सुशासन ऐन २०६४ का मुख्य व्यवस्था' } },
      {
        type: 'list',
        items: [
          { en: 'Every office must publish a citizen charter showing services, fees, time limits and the responsible officer', ne: 'प्रत्येक कार्यालयले सेवा, दस्तुर, समयसीमा र जिम्मेवार कर्मचारी देखिने नागरिक बडापत्र प्रकाशित गर्नुपर्ने' },
          { en: 'Decisions must be reasoned; a decision affecting a person must state its grounds', ne: 'निर्णय कारणसहित हुनुपर्ने; कुनै व्यक्तिलाई असर पर्ने निर्णयमा आधार उल्लेख गर्नुपर्ने' },
          { en: 'Grievance handling officer and a complaint box in every office', ne: 'प्रत्येक कार्यालयमा गुनासो सुन्ने अधिकारी र गुनासो पेटिका' },
          { en: 'Provision for hearing before a decision that affects rights', ne: 'हक असर पर्ने निर्णय गर्नुअघि सुनुवाइको व्यवस्था' },
          { en: 'Performance agreement and work plan for officials', ne: 'पदाधिकारीका लागि कार्यसम्पादन सम्झौता र कार्ययोजना' },
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Learn the paired law-and-tool list: Good Governance Act 2064 → citizen charter; Right to Information Act 2064 → information officer; Prevention of Corruption Act 2059 → CIAA prosecution; Public Procurement Act 2063 → e-bidding.',
          ne: 'कानून र औजार जोडा बनाएर सम्झनुहोस्: सुशासन ऐन २०६४ → नागरिक बडापत्र; सूचनाको हक ऐन २०६४ → सूचना अधिकारी; भ्रष्टाचार निवारण ऐन २०५९ → अख्तियारबाट अभियोजन; सार्वजनिक खरिद ऐन २०६३ → विद्युतीय बोलपत्र।',
        },
      },
    ],
  },
  {
    id: 'gov-02',
    subjectId: 'governance',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'The Civil Service of Nepal', ne: 'नेपालको निजामती सेवा' },
    summary: {
      en: 'Service classification, the hierarchy of posts, recruitment through the Public Service Commission and conduct rules.',
      ne: 'सेवाको वर्गीकरण, पदको तह, लोक सेवा आयोगमार्फत पदपूर्ति र आचरणसम्बन्धी नियम।',
    },
    readMinutes: 8,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'The Civil Service Act, 2049 BS and the Civil Service Rules, 2050 govern the conditions of service of civil servants. Following federalisation, federal, provincial and local service laws now sit alongside them, and the federal civil service law has been under revision to match the federal structure.',
          ne: 'निजामती सेवा ऐन, २०४९ र निजामती सेवा नियमावली, २०५० ले निजामती कर्मचारीको सेवा सर्त निर्धारण गर्छन्। संघीयता कार्यान्वयनपछि संघ, प्रदेश र स्थानीय सेवासम्बन्धी कानून सँगसँगै रहेका छन्, र संघीय निजामती सेवासम्बन्धी कानून संघीय संरचना अनुरूप परिमार्जनको प्रक्रियामा रहँदै आएको छ।',
        },
      },
      { type: 'heading', text: { en: 'Hierarchy of posts', ne: 'पदको तह' } },
      {
        type: 'table',
        headers: [
          { en: 'Category', ne: 'वर्ग' },
          { en: 'Class', ne: 'श्रेणी' },
          { en: 'Typical post', ne: 'सामान्य पद' },
        ],
        rows: [
          [{ en: 'Gazetted (Rajpatrankit)', ne: 'राजपत्रांकित' }, { en: 'Special class', ne: 'विशिष्ट श्रेणी' }, { en: 'Secretary', ne: 'सचिव' }],
          [{ en: 'Gazetted', ne: 'राजपत्रांकित' }, { en: 'First class', ne: 'प्रथम श्रेणी' }, { en: 'Joint Secretary', ne: 'सहसचिव' }],
          [{ en: 'Gazetted', ne: 'राजपत्रांकित' }, { en: 'Second class', ne: 'द्वितीय श्रेणी' }, { en: 'Under Secretary', ne: 'उपसचिव' }],
          [{ en: 'Gazetted', ne: 'राजपत्रांकित' }, { en: 'Third class', ne: 'तृतीय श्रेणी' }, { en: 'Section Officer (Adhikrit)', ne: 'शाखा अधिकृत' }],
          [{ en: 'Non-gazetted (Rajpatra Anankit)', ne: 'राजपत्र अनंकित' }, { en: 'First class', ne: 'प्रथम श्रेणी' }, { en: 'Nayab Subba', ne: 'नायब सुब्बा' }],
          [{ en: 'Non-gazetted', ne: 'राजपत्र अनंकित' }, { en: 'Second class', ne: 'द्वितीय श्रेणी' }, { en: 'Kharidar', ne: 'खरिदार' }],
        ],
      },
      { type: 'heading', text: { en: 'Public Service Commission', ne: 'लोक सेवा आयोग' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Established', ne: 'स्थापना' }, value: { en: '1 Ashad 2008 BS (15 June 1951)', ne: '२००८ असार १ गते' } },
          { label: { en: 'Constitutional basis', ne: 'संवैधानिक आधार' }, value: { en: 'Article 242 of the Constitution of Nepal', ne: 'नेपालको संविधानको धारा २४२' } },
          { label: { en: 'Head office', ne: 'केन्द्रीय कार्यालय' }, value: { en: 'Anamnagar, Kathmandu', ne: 'अनामनगर, काठमाडौं' } },
          { label: { en: 'Tenure of Chairperson and members', ne: 'अध्यक्ष र सदस्यको कार्यकाल' }, value: { en: 'Six years or until the age of 65', ne: 'छ वर्ष वा ६५ वर्ष उमेर पुगेसम्म' } },
          { label: { en: 'Civil Service Day', ne: 'निजामती सेवा दिवस' }, value: { en: '22 Bhadra', ne: 'भदौ २२ गते' } },
        ],
      },
      { type: 'heading', text: { en: 'Inclusive reservation in vacancies', ne: 'पदपूर्तिमा समावेशी आरक्षण' } },
      {
        type: 'para',
        text: {
          en: 'Forty-five per cent of the posts announced for open competition are set aside for inclusive groups and are distributed among women, indigenous nationalities, Madhesi, Dalit, persons with disability and people from backward areas. Learn the distribution percentages exactly as the Act states them.',
          ne: 'खुला प्रतिस्पर्धाबाट पूर्ति हुने पदमध्ये ४५ प्रतिशत पद समावेशी समूहका लागि छुट्याइन्छ र यो महिला, आदिवासी जनजाति, मधेशी, दलित, अपांगता भएका व्यक्ति र पिछडिएको क्षेत्रबीच बाँडिन्छ। ऐनमा तोकिएको प्रतिशत जस्ताको तस्तै सम्झनुहोस्।',
        },
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'Conduct rules examiners return to: a civil servant may not criticise government policy publicly, may not take part in politics, may not accept gifts or donations connected to duty, and may not engage in trade or another job without approval.',
          ne: 'परीक्षामा बारम्बार आउने आचरणसम्बन्धी व्यवस्था: निजामती कर्मचारीले सार्वजनिक रूपमा सरकारी नीतिको आलोचना गर्न, राजनीतिमा भाग लिन, कर्तव्यसँग सम्बन्धित उपहार वा चन्दा लिन र स्वीकृति नलिई व्यापार वा अन्य जागिर गर्न पाउँदैन।',
        },
      },
    ],
  },
  {
    id: 'gov-03',
    subjectId: 'governance',
    levels: ['adhikrit', 'nayabsubba'],
    title: { en: 'Federalism in Practice and Inter-governmental Relations', ne: 'व्यवहारमा संघीयता र अन्तरसरकारी सम्बन्ध' },
    summary: {
      en: 'How the three tiers coordinate, share revenue, and resolve disputes.',
      ne: 'तीन तहबीच समन्वय, राजस्व बाँडफाँट र विवाद समाधान कसरी हुन्छ।',
    },
    readMinutes: 8,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Nepal follows a cooperative model of federalism. Article 232 places relations between the federation, provinces and local levels on the principles of cooperation, coexistence and coordination — not on a strict hierarchy.',
          ne: 'नेपालले सहकारितामूलक संघीयताको नमुना अपनाएको छ। धारा २३२ ले संघ, प्रदेश र स्थानीय तहबीचको सम्बन्ध कडा पदसोपानमा होइन, सहकारिता, सहअस्तित्व र समन्वयको सिद्धान्तमा आधारित हुने भनेको छ।',
        },
      },
      { type: 'heading', text: { en: 'Coordination mechanisms', ne: 'समन्वयका संयन्त्र' } },
      {
        type: 'table',
        headers: [
          { en: 'Mechanism', ne: 'संयन्त्र' },
          { en: 'Chaired by', ne: 'अध्यक्ष' },
          { en: 'Purpose', ne: 'उद्देश्य' },
        ],
        rows: [
          [{ en: 'Inter-Province Council (Art. 234)', ne: 'अन्तर प्रदेश परिषद् (धारा २३४)' }, { en: 'Prime Minister', ne: 'प्रधानमन्त्री' }, { en: 'Settle political disputes between the federation and a province, or between provinces', ne: 'संघ र प्रदेश वा प्रदेशहरूबीचको राजनीतिक विवाद समाधान' }],
          [{ en: 'National Coordination Council', ne: 'राष्ट्रिय समन्वय परिषद्' }, { en: 'Prime Minister', ne: 'प्रधानमन्त्री' }, { en: 'Policy and administrative coordination across all three tiers', ne: 'तीनै तहबीच नीतिगत र प्रशासनिक समन्वय' }],
          [{ en: 'Provincial Coordination Council', ne: 'प्रदेश समन्वय परिषद्' }, { en: 'Chief Minister', ne: 'मुख्यमन्त्री' }, { en: 'Coordination between the province and local levels', ne: 'प्रदेश र स्थानीय तहबीच समन्वय' }],
          [{ en: 'National Natural Resources and Fiscal Commission', ne: 'राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोग' }, { en: 'Its own chairperson', ne: 'आफ्नै अध्यक्ष' }, { en: 'Recommend revenue sharing and grant formulas', ne: 'राजस्व बाँडफाँट र अनुदानको सूत्र सिफारिस' }],
        ],
      },
      { type: 'heading', text: { en: 'Four fiscal transfers to provinces and local levels', ne: 'प्रदेश र स्थानीय तहमा जाने चार प्रकारका वित्तीय हस्तान्तरण' } },
      {
        type: 'list',
        ordered: true,
        items: [
          { en: 'Fiscal equalisation grant — based on expenditure need and revenue capacity', ne: 'वित्तीय समानीकरण अनुदान — खर्चको आवश्यकता र राजस्व क्षमताका आधारमा' },
          { en: 'Conditional grant — for a specified project or programme', ne: 'सशर्त अनुदान — तोकिएको आयोजना वा कार्यक्रमका लागि' },
          { en: 'Complementary grant — matching support for infrastructure', ne: 'समपूरक अनुदान — पूर्वाधारका लागि साझेदारी सहयोग' },
          { en: 'Special grant — for equity, quality of service or a special objective', ne: 'विशेष अनुदान — समता, सेवाको गुणस्तर वा विशेष उद्देश्यका लागि' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Disputes on the *constitutionality* of a law made by any tier go to the Constitutional Bench; *political* disputes between tiers go to the Inter-Province Council. That distinction is a classic exam question.',
          ne: 'कुनै पनि तहले बनाएको कानूनको *संवैधानिकता* सम्बन्धी विवाद संवैधानिक इजलासमा जान्छ; तहहरूबीचको *राजनीतिक* विवाद अन्तर प्रदेश परिषद्मा जान्छ। यो भिन्नता परीक्षामा बारम्बार सोधिन्छ।',
        },
      },
    ],
  },
];
