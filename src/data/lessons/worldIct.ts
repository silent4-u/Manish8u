import type { Lesson } from '../../types';

export const worldIctLessons: Lesson[] = [
  {
    id: 'wor-01',
    subjectId: 'gk-world',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'International Organisations and Nepal', ne: 'अन्तर्राष्ट्रिय संघसंस्था र नेपाल' },
    summary: {
      en: 'Membership dates, headquarters and what each organisation does.',
      ne: 'सदस्यता मिति, मुख्यालय र प्रत्येक संस्थाको काम।',
    },
    readMinutes: 7,
    blocks: [
      {
        type: 'table',
        headers: [
          { en: 'Organisation', ne: 'संस्था' },
          { en: 'Headquarters', ne: 'मुख्यालय' },
          { en: 'Nepal joined', ne: 'नेपाल सदस्य भएको' },
        ],
        rows: [
          [{ en: 'United Nations', ne: 'संयुक्त राष्ट्र संघ' }, { en: 'New York', ne: 'न्युयोर्क' }, { en: '14 December 1955', ne: '१४ डिसेम्बर १९५५' }],
          [{ en: 'Colombo Plan', ne: 'कोलम्बो योजना' }, { en: 'Colombo', ne: 'कोलम्बो' }, { en: '1952', ne: 'सन् १९५२' }],
          [{ en: 'Non-Aligned Movement', ne: 'असंलग्न आन्दोलन' }, { en: 'No permanent secretariat', ne: 'स्थायी सचिवालय नभएको' }, { en: '1961 (founding participant)', ne: 'सन् १९६१ (संस्थापक सहभागी)' }],
          [{ en: 'World Bank and IMF', ne: 'विश्व बैंक र अन्तर्राष्ट्रिय मुद्रा कोष' }, { en: 'Washington DC', ne: 'वासिङ्टन डीसी' }, { en: '1961', ne: 'सन् १९६१' }],
          [{ en: 'Asian Development Bank', ne: 'एसियाली विकास बैंक' }, { en: 'Manila', ne: 'मनिला' }, { en: '1966 (founding member)', ne: 'सन् १९६६ (संस्थापक सदस्य)' }],
          [{ en: 'SAARC', ne: 'सार्क' }, { en: 'Kathmandu', ne: 'काठमाडौं' }, { en: '8 December 1985 (founding member)', ne: '८ डिसेम्बर १९८५ (संस्थापक सदस्य)' }],
          [{ en: 'BIMSTEC', ne: 'बिमस्टेक' }, { en: 'Dhaka', ne: 'ढाका' }, { en: '2004', ne: 'सन् २००४' }],
          [{ en: 'World Trade Organization', ne: 'विश्व व्यापार संगठन' }, { en: 'Geneva', ne: 'जेनेभा' }, { en: '23 April 2004', ne: '२३ अप्रिल २००४' }],
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'SAARC has eight members — Nepal, India, Pakistan, Bangladesh, Sri Lanka, Bhutan, the Maldives and Afghanistan. Afghanistan joined in 2007; the other seven founded it in 1985. The secretariat was established in Kathmandu on 16 January 1987.',
          ne: 'सार्कका आठ सदस्य छन् — नेपाल, भारत, पाकिस्तान, बंगलादेश, श्रीलंका, भुटान, माल्दिभ्स र अफगानिस्तान। अफगानिस्तान सन् २००७ मा सामेल भयो; अन्य सात संस्थापक हुन्। सचिवालय १६ जनवरी १९८७ मा काठमाडौंमा स्थापना भयो।',
        },
      },
      { type: 'heading', text: { en: 'The United Nations in brief', ne: 'संयुक्त राष्ट्र संघ संक्षेपमा' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Founded', ne: 'स्थापना' }, value: { en: '24 October 1945', ne: '२४ अक्टोबर १९४५' } },
          { label: { en: 'Principal organs', ne: 'मुख्य अंग' }, value: { en: 'Six — General Assembly, Security Council, ECOSOC, Trusteeship Council, ICJ, Secretariat', ne: 'छ — महासभा, सुरक्षा परिषद्, आर्थिक तथा सामाजिक परिषद्, संरक्षण परिषद्, अन्तर्राष्ट्रिय न्यायालय, सचिवालय' } },
          { label: { en: 'Security Council', ne: 'सुरक्षा परिषद्' }, value: { en: '15 members — 5 permanent with veto, 10 elected for two years', ne: '१५ सदस्य — ५ स्थायी (भिटो अधिकारसहित), १० दुई वर्षका लागि निर्वाचित' } },
          { label: { en: 'International Court of Justice', ne: 'अन्तर्राष्ट्रिय न्यायालय' }, value: { en: 'The Hague, Netherlands', ne: 'हेग, नेदरल्यान्ड्स' } },
          { label: { en: 'Official languages', ne: 'आधिकारिक भाषा' }, value: { en: 'Six — Arabic, Chinese, English, French, Russian, Spanish', ne: 'छ — अरबी, चिनियाँ, अंग्रेजी, फ्रान्सेली, रुसी, स्पेनिस' } },
        ],
      },
    ],
  },
  {
    id: 'ict-01',
    subjectId: 'ict',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Computer Fundamentals for the Office', ne: 'कार्यालयका लागि कम्प्युटरको आधारभूत ज्ञान' },
    summary: {
      en: 'Hardware and software basics, common office software, and the units you must know.',
      ne: 'हार्डवेयर र सफ्टवेयरको आधार, प्रचलित कार्यालय सफ्टवेयर र जान्नैपर्ने एकाइहरू।',
    },
    readMinutes: 7,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'A computer processes data through the input–process–output cycle. Hardware is the physical part; software is the set of instructions. System software (operating system, utilities) runs the machine; application software (word processor, spreadsheet) does the user’s work.',
          ne: 'कम्प्युटरले इनपुट–प्रोसेस–आउटपुट चक्रबाट डाटा प्रशोधन गर्छ। हार्डवेयर भौतिक भाग हो; सफ्टवेयर निर्देशनको समूह हो। सिस्टम सफ्टवेयर (अपरेटिङ सिस्टम, युटिलिटी) ले मेसिन चलाउँछ; एप्लिकेसन सफ्टवेयर (वर्ड प्रोसेसर, स्प्रेडसिट) ले प्रयोगकर्ताको काम गर्छ।',
        },
      },
      {
        type: 'table',
        headers: [
          { en: 'Term', ne: 'शब्द' },
          { en: 'Meaning', ne: 'अर्थ' },
        ],
        rows: [
          [{ en: 'CPU', ne: 'सीपीयू' }, { en: 'Central Processing Unit — control unit plus arithmetic logic unit', ne: 'केन्द्रीय प्रशोधन एकाइ — नियन्त्रण एकाइ र अंकगणितीय तार्किक एकाइ' }],
          [{ en: 'RAM', ne: 'र्‍याम' }, { en: 'Volatile working memory; contents lost when power goes off', ne: 'अस्थायी कार्य स्मृति; बिजुली गएपछि सामग्री हराउँछ' }],
          [{ en: 'ROM', ne: 'रोम' }, { en: 'Non-volatile memory that keeps start-up instructions', ne: 'स्थायी स्मृति जसले सुरुवाती निर्देशन राख्छ' }],
          [{ en: '1 Byte', ne: '१ बाइट' }, { en: '8 bits', ne: '८ बिट' }],
          [{ en: '1 KB / MB / GB / TB', ne: '१ केबी / एमबी / जीबी / टीबी' }, { en: 'Each step is 1024 of the previous unit', ne: 'प्रत्येक चरण अघिल्लो एकाइको १०२४ गुणा' }],
          [{ en: 'Operating system', ne: 'अपरेटिङ सिस्टम' }, { en: 'Windows, Linux, macOS — manages hardware and programs', ne: 'विन्डोज, लिनक्स, म्याकओएस — हार्डवेयर र प्रोग्राम व्यवस्थापन' }],
        ],
      },
      { type: 'heading', text: { en: 'E-governance in Nepal', ne: 'नेपालमा विद्युतीय सुशासन' } },
      {
        type: 'list',
        items: [
          { en: 'Electronic Transaction Act, 2063 gives legal recognition to electronic records and digital signatures', ne: 'विद्युतीय कारोबार ऐन, २०६३ ले विद्युतीय अभिलेख र डिजिटल हस्ताक्षरलाई कानूनी मान्यता दिन्छ' },
          { en: 'Nagarik App, online passport, PAN registration and e-procurement are common citizen-facing services', ne: 'नागरिक एप, अनलाइन राहदानी, स्थायी लेखा नम्बर दर्ता र विद्युतीय खरिद प्रचलित नागरिकमुखी सेवा हुन्' },
          { en: 'Four models of e-governance: G2C, G2B, G2G and G2E', ne: 'विद्युतीय सुशासनका चार नमुना: G2C, G2B, G2G र G2E' },
          { en: 'Cyber security basics: strong passwords, updates, backup, and not sharing credentials', ne: 'साइबर सुरक्षाको आधार: बलियो पासवर्ड, अद्यावधिक, ब्याकअप र प्रयोगकर्ता विवरण साझा नगर्ने' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Nepali typing questions usually contrast Preeti, a legacy font-based encoding, with Unicode, the standard encoding that works everywhere including email and government portals.',
          ne: 'नेपाली टाइपिङका प्रश्नमा प्रायः प्रीति (पुरानो फन्टमा आधारित एन्कोडिङ) र युनिकोड (इमेल तथा सरकारी पोर्टल सबैतिर चल्ने मानक एन्कोडिङ) बीचको भिन्नता सोधिन्छ।',
        },
      },
    ],
  },
];
