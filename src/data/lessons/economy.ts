import type { Lesson } from '../../types';

export const economyLessons: Lesson[] = [
  {
    id: 'eco-01',
    subjectId: 'dev-economy',
    levels: ['adhikrit', 'nayabsubba'],
    title: { en: 'Nepali Economy and Public Finance', ne: 'नेपाली अर्थतन्त्र र सार्वजनिक वित्त' },
    summary: {
      en: 'Structure of the economy, the fiscal year, budget process and the institutions that run public finance.',
      ne: 'अर्थतन्त्रको संरचना, आर्थिक वर्ष, बजेट प्रक्रिया र सार्वजनिक वित्त सञ्चालन गर्ने निकाय।',
    },
    readMinutes: 8,
    blocks: [
      {
        type: 'facts',
        items: [
          { label: { en: 'Fiscal year', ne: 'आर्थिक वर्ष' }, value: { en: '1 Shrawan to the end of Ashad (mid-July to mid-July)', ne: 'साउन १ देखि असार मसान्तसम्म' } },
          { label: { en: 'Budget presented on', ne: 'बजेट प्रस्तुत हुने मिति' }, value: { en: '15 Jestha every year (Article 119)', ne: 'प्रत्येक वर्ष जेठ १५ गते (धारा ११९)' } },
          { label: { en: 'Central bank', ne: 'केन्द्रीय बैंक' }, value: { en: 'Nepal Rastra Bank, established 2013 BS (1956)', ne: 'नेपाल राष्ट्र बैंक, स्थापना २०१३ साल' } },
          { label: { en: 'Planning body', ne: 'योजना निकाय' }, value: { en: 'National Planning Commission, chaired by the Prime Minister', ne: 'राष्ट्रिय योजना आयोग, प्रधानमन्त्री अध्यक्ष' } },
          { label: { en: 'Final auditor', ne: 'अन्तिम लेखापरीक्षक' }, value: { en: 'Auditor General (Article 241)', ne: 'महालेखा परीक्षक (धारा २४१)' } },
          { label: { en: 'Currency', ne: 'मुद्रा' }, value: { en: 'Nepalese Rupee; notes issued by Nepal Rastra Bank', ne: 'नेपाली रुपैयाँ; नोट नेपाल राष्ट्र बैंकबाट जारी' } },
        ],
      },
      { type: 'heading', text: { en: 'Three government funds under the constitution', ne: 'संविधान अन्तर्गतका तीन सरकारी कोष' } },
      {
        type: 'list',
        items: [
          { en: 'Federal Consolidated Fund (Article 116) — all revenue and loans go in; money leaves only under law', ne: 'संघीय सञ्चित कोष (धारा ११६) — सबै राजस्व र ऋण जम्मा हुने; कानून बमोजिम मात्र खर्च हुने' },
          { en: 'Federal Contingency Fund (Article 124) — for urgent unforeseen expenditure', ne: 'संघीय आकस्मिक कोष (धारा १२४) — अत्यावश्यक अप्रत्याशित खर्चका लागि' },
          { en: 'Other government funds established by federal law', ne: 'संघीय कानून बमोजिम स्थापित अन्य सरकारी कोष' },
        ],
      },
      { type: 'heading', text: { en: 'Sources of government revenue', ne: 'सरकारी राजस्वका स्रोत' } },
      {
        type: 'table',
        headers: [
          { en: 'Type', ne: 'प्रकार' },
          { en: 'Examples', ne: 'उदाहरण' },
        ],
        rows: [
          [{ en: 'Tax revenue — direct', ne: 'कर राजस्व — प्रत्यक्ष' }, { en: 'Income tax, property tax', ne: 'आयकर, सम्पत्ति कर' }],
          [{ en: 'Tax revenue — indirect', ne: 'कर राजस्व — अप्रत्यक्ष' }, { en: 'VAT, customs duty, excise duty', ne: 'मूल्य अभिवृद्धि कर, भन्सार महसुल, अन्तःशुल्क' }],
          [{ en: 'Non-tax revenue', ne: 'गैर कर राजस्व' }, { en: 'Fees, fines, dividends, royalties', ne: 'दस्तुर, जरिवाना, लाभांश, रोयल्टी' }],
          [{ en: 'Grants and loans', ne: 'अनुदान र ऋण' }, { en: 'Foreign grants, internal and external borrowing', ne: 'वैदेशिक अनुदान, आन्तरिक तथा बाह्य ऋण' }],
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Value Added Tax was introduced in Nepal in 2054 BS (1997) replacing sales tax, hotel tax, contract tax and entertainment tax. Income tax is governed by the Income Tax Act, 2058.',
          ne: 'नेपालमा मूल्य अभिवृद्धि कर २०५४ सालमा बिक्री कर, होटल कर, ठेक्का कर र मनोरञ्जन कर हटाएर लागू भयो। आयकर आयकर ऐन, २०५८ ले नियमन गर्छ।',
        },
      },
    ],
  },
  {
    id: 'eco-02',
    subjectId: 'dev-economy',
    levels: ['adhikrit', 'nayabsubba'],
    title: { en: 'Periodic Plans and the Sustainable Development Goals', ne: 'आवधिक योजना र दिगो विकास लक्ष्य' },
    summary: {
      en: 'Nepal’s planning history, the current periodic plan and how the SDGs are localised.',
      ne: 'नेपालको योजना इतिहास, हालको आवधिक योजना र दिगो विकास लक्ष्यको स्थानीयकरण।',
    },
    readMinutes: 7,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Nepal began planned development with the First Five Year Plan in 2013 BS (1956), prepared under the then Planning Board. Plans are now prepared by the National Planning Commission and approved by the Council of Ministers.',
          ne: 'नेपालले २०१३ सालमा तत्कालीन योजना बोर्ड अन्तर्गत तयार पहिलो पञ्चवर्षीय योजनाबाट योजनाबद्ध विकास सुरु गर्‍यो। अहिले योजना राष्ट्रिय योजना आयोगले तयार गर्छ र मन्त्रिपरिषद्ले स्वीकृत गर्छ।',
        },
      },
      {
        type: 'facts',
        items: [
          { label: { en: 'First plan', ne: 'पहिलो योजना' }, value: { en: '2013–2018 BS, five years', ne: '२०१३–२०१८, पाँच वर्ष' } },
          { label: { en: '15th Plan', ne: 'पन्ध्रौं योजना' }, value: { en: '2076/77–2080/81, vision "Prosperous Nepal, Happy Nepali"', ne: '२०७६/७७–२०८०/८१, सोच "समृद्ध नेपाल, सुखी नेपाली"' } },
          { label: { en: '16th Plan', ne: 'सोह्रौं योजना' }, value: { en: '2081/82–2085/86', ne: '२०८१/८२–२०८५/८६' } },
          { label: { en: 'Long-term aspiration', ne: 'दीर्घकालीन आकांक्षा' }, value: { en: 'High income country status by 2100 BS', ne: '२१०० सालसम्म उच्च आय भएको मुलुक' } },
          { label: { en: 'LDC graduation', ne: 'अतिकम विकसित मुलुकबाट स्तरोन्नति' }, value: { en: 'Approved by the UN General Assembly, effective November 2026', ne: 'संयुक्त राष्ट्र संघीय महासभाबाट स्वीकृत, नोभेम्बर २०२६ देखि लागू' } },
        ],
      },
      { type: 'heading', text: { en: 'Sustainable Development Goals', ne: 'दिगो विकास लक्ष्य' } },
      {
        type: 'list',
        items: [
          { en: 'Adopted by the UN in 2015 for the period 2016 to 2030', ne: 'सन् २०१५ मा संयुक्त राष्ट्र संघबाट सन् २०१६ देखि २०३० का लागि पारित' },
          { en: '17 goals and 169 targets, replacing the Millennium Development Goals', ne: '१७ लक्ष्य र १६९ गन्तव्य, सहस्राब्दी विकास लक्ष्यको स्थानमा' },
          { en: 'Nepal has mainstreamed SDGs into periodic plans and annual budgets, with SDG coding of budget lines', ne: 'नेपालले आवधिक योजना र वार्षिक बजेटमा दिगो विकास लक्ष्यलाई मूलप्रवाहीकरण गर्दै बजेट शीर्षकमा एसडीजी कोडिङ गरेको छ' },
          { en: 'The National Planning Commission is the focal agency for SDG monitoring', ne: 'दिगो विकास लक्ष्य अनुगमनको केन्द्रबिन्दु निकाय राष्ट्रिय योजना आयोग हो' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Remember the trio that examiners mix up: MDGs ran 2000–2015 with 8 goals; SDGs run 2016–2030 with 17 goals; the Paris Agreement on climate was adopted in 2015 and Nepal ratified it in 2016.',
          ne: 'परीक्षामा झुक्किने त्रिकोण सम्झनुहोस्: सहस्राब्दी विकास लक्ष्य सन् २०००–२०१५, ८ लक्ष्य; दिगो विकास लक्ष्य सन् २०१६–२०३०, १७ लक्ष्य; जलवायुसम्बन्धी पेरिस सम्झौता सन् २०१५ मा पारित र नेपालले सन् २०१६ मा अनुमोदन गर्‍यो।',
        },
      },
    ],
  },
];
