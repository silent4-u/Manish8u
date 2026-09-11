import type { Bilingual, LevelId } from '../types';

/**
 * Primary sources — the documents a syllabus answer should be built on.
 *
 * The app does not carry these files. Two reasons, and the second is the one
 * that matters: they are large and revised on their own schedule, so a copy
 * bundled today is wrong within a year; and their contents are thousands of
 * exact figures that must come from the publisher rather than from anyone's
 * recollection of them. So each entry says what the document is, which parts
 * of which syllabus it answers, and where the publisher puts it. Downloaded,
 * it files itself on the Materials shelf under the paper it belongs to.
 *
 * Only the publisher and the site are named here — never a deep link to a
 * particular file, which rots the moment the publisher reorganises.
 */
export interface ReferenceDoc {
  id: string;
  title: Bilingual;
  publisher: Bilingual;
  /** What the document is and what a candidate uses it for. */
  what: Bilingual;
  /** The publisher's own site. */
  site: string;
  /** Syllabus section ids this document is a primary source for. */
  covers: string[];
  /** Posts whose syllabus cites it. */
  levels: LevelId[];
  /** Revised on a schedule, so a downloaded copy goes stale. */
  cadence: Bilingual;
}

export const REFERENCES: ReferenceDoc[] = [
  {
    id: 'constitution-2072',
    title: { en: 'The Constitution of Nepal', ne: 'नेपालको संविधान' },
    publisher: { en: 'Nepal Law Commission', ne: 'नेपाल कानून आयोग' },
    what: {
      en: 'The primary text for every question on fundamental rights, the directive principles, the structure of the state, the organs of state, the constitutional bodies and the schedules that divide powers between the three levels. Read the article, not a summary of it — the syllabus asks for provisions by name.',
      ne: 'मौलिक हक, निर्देशक सिद्धान्त, राज्यको संरचना, राज्यका अंग, संवैधानिक निकाय र तीन तहबीच अधिकार बाँड्ने अनुसूचीसम्बन्धी हरेक प्रश्नको मूल स्रोत। सारांश होइन, धारा नै पढ्नुहोस् — पाठ्यक्रमले व्यवस्था नामै किटेर सोध्छ।',
    },
    site: 'lawcommission.gov.np',
    covers: ['adhikrit-p2-b', 'adhikrit-p4-d', 'nasu-p2-b', 'kharidar-p2-b'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Amended from time to time', ne: 'समय–समयमा संशोधन हुने' },
  },
  {
    id: 'periodic-plan',
    title: { en: 'The current periodic plan', ne: 'चालु आवधिक योजना' },
    publisher: { en: 'National Planning Commission', ne: 'राष्ट्रिय योजना आयोग' },
    what: {
      en: 'The syllabus asks for "the current periodic plan" by that phrase, so the plan in force on your exam date is the one examined — its vision, objectives, strategies, targets and sectoral programmes. Check which plan is current before you revise; a candidate who prepares the previous plan answers the wrong question.',
      ne: 'पाठ्यक्रमले "चालु आवधिक योजना" भनी सोध्छ, त्यसैले परीक्षाको मितिमा लागू रहेको योजना नै जाँचिन्छ — यसको सोच, उद्देश्य, रणनीति, लक्ष्य र क्षेत्रगत कार्यक्रम। तयारी गर्नुअघि कुन योजना चालु छ भनी जाँच्नुहोस्; अघिल्लो योजना पढ्नेले गलत प्रश्नको उत्तर दिन्छ।',
    },
    site: 'npc.gov.np',
    covers: ['adhikrit-p2-d', 'adhikrit-p3-c', 'nasu-p2-a', 'kharidar-p1-a'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'A new plan every five years', ne: 'हरेक पाँच वर्षमा नयाँ योजना' },
  },
  {
    id: 'economic-survey',
    title: { en: 'Economic Survey', ne: 'आर्थिक सर्वेक्षण' },
    publisher: { en: 'Ministry of Finance', ne: 'अर्थ मन्त्रालय' },
    what: {
      en: 'Published with the budget each year, and the source for the economic figures a paper expects: growth, gross domestic product, per capita income, inflation, remittance, trade, revenue and expenditure, and the sectoral position of agriculture, industry, tourism and energy. Because it is annual, quote the edition and the fiscal year with any figure you use.',
      ne: 'हरेक वर्ष बजेटसँगै प्रकाशित हुन्छ, र पत्रले खोज्ने आर्थिक तथ्याङ्कको स्रोत यही हो: आर्थिक वृद्धि, कुल गार्हस्थ्य उत्पादन, प्रतिव्यक्ति आय, मुद्रास्फीति, विप्रेषण, व्यापार, राजस्व र खर्च, तथा कृषि, उद्योग, पर्यटन र ऊर्जाको क्षेत्रगत अवस्था। वार्षिक हुने भएकाले कुनै अङ्क प्रयोग गर्दा संस्करण र आर्थिक वर्ष उल्लेख गर्नुहोस्।',
    },
    site: 'mof.gov.np',
    covers: ['adhikrit-p3-b', 'adhikrit-p4-b', 'nasu-p2-a', 'kharidar-p1-a'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Annual, with the budget', ne: 'वार्षिक, बजेटसँगै' },
  },
  {
    id: 'census-2078',
    title: { en: 'National Population and Housing Census 2078', ne: 'राष्ट्रिय जनगणना २०७८' },
    publisher: { en: 'National Statistics Office', ne: 'राष्ट्रिय तथ्याङ्क कार्यालय' },
    what: {
      en: 'The authority for every population figure the syllabus touches: total population, growth rate, density, sex ratio, the distribution across provinces and districts, urban and rural settlement, migration, literacy, language, religion and caste or ethnicity. Take these from the census volumes rather than from a coaching handout, where the digits drift.',
      ne: 'पाठ्यक्रमले छुने हरेक जनसंख्या अङ्कको आधिकारिक स्रोत: कुल जनसंख्या, वृद्धिदर, घनत्व, लैङ्गिक अनुपात, प्रदेश र जिल्लागत वितरण, सहरी–ग्रामीण बसोबास, बसाइँसराइ, साक्षरता, भाषा, धर्म र जातजाति। यी अङ्क कोचिङको नोटबाट होइन, जनगणनाका खण्डबाटै लिनुहोस् — नोटमा अङ्क फेरिँदै जान्छन्।',
    },
    site: 'censusnepal.cbs.gov.np',
    covers: ['adhikrit-p1-a', 'adhikrit-p3-a', 'nasu-p1-a', 'nasu-p2-a', 'kharidar-p1-a'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Every ten years; 2078 is the current one', ne: 'हरेक दस वर्षमा; हाल २०७८ को नै चालु' },
  },
  {
    id: 'nepal-parichaya',
    title: { en: 'Nepal at a glance', ne: 'नेपाल परिचय' },
    publisher: { en: 'No single publisher — see below', ne: 'एउटै प्रकाशक छैन — तल हेर्नुहोस्' },
    what: {
      en: 'This is a category rather than one book: the standing facts about Nepal — area, borders, physical divisions, provinces and districts, rivers, peaks, climate, heritage sites, national symbols, languages and festivals. There is no single official volume, so take each figure from the body that owns it: area and boundaries from the Survey Department, population from the census, heritage from the Department of Archaeology, and the statistical pocket book from the National Statistics Office. Where two sources disagree, say which one you followed.',
      ne: 'यो एउटै पुस्तक नभई एउटा वर्ग हो: नेपालबारे स्थिर तथ्यहरू — क्षेत्रफल, सिमाना, भौगोलिक विभाजन, प्रदेश र जिल्ला, नदी, हिमशिखर, हावापानी, सम्पदा क्षेत्र, राष्ट्रिय प्रतीक, भाषा र पर्व। एउटै आधिकारिक ग्रन्थ नभएकाले हरेक अङ्क सम्बन्धित निकायबाटै लिनुहोस्: क्षेत्रफल र सिमाना नापी विभागबाट, जनसंख्या जनगणनाबाट, सम्पदा पुरातत्त्व विभागबाट, र तथ्याङ्क पुस्तिका राष्ट्रिय तथ्याङ्क कार्यालयबाट। दुई स्रोत बाझिए कुन मान्नुभयो सो लेख्नुहोस्।',
    },
    site: 'cbs.gov.np',
    covers: ['adhikrit-p1-a', 'nasu-p1-a', 'kharidar-p1-a'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Each figure changes on its own publisher’s schedule', ne: 'हरेक अङ्क आ–आफ्नो प्रकाशकको तालिकामा बदलिन्छ' },
  },
  {
    id: 'civil-service-act',
    title: { en: 'Civil Service Act and Rules', ne: 'निजामती सेवा ऐन र नियमावली' },
    publisher: { en: 'Nepal Law Commission', ne: 'नेपाल कानून आयोग' },
    what: {
      en: 'Named directly by all three syllabi: the formation of the service, recruitment, appointment, transfer, promotion, leave, conduct, departmental punishment, retirement and career development. Questions here quote provisions, so read the sections rather than a summary.',
      ne: 'तीनै पाठ्यक्रमले सिधै नाम किटेको: सेवाको गठन, भर्ना, नियुक्ति, सरुवा, बढुवा, बिदा, आचरण, विभागीय सजाय, अवकाश र वृत्ति विकास। यहाँका प्रश्नले व्यवस्था उद्धृत गर्ने भएकाले सारांश होइन, दफा नै पढ्नुहोस्।',
    },
    site: 'lawcommission.gov.np',
    covers: ['adhikrit-p4-a', 'nasu-p2-c', 'nasu-p3-b', 'kharidar-p3-a'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Amended from time to time', ne: 'समय–समयमा संशोधन हुने' },
  },
  {
    id: 'good-governance-act',
    title: { en: 'Good Governance (Management and Operation) Act, 2064', ne: 'सुशासन (व्यवस्थापन तथा संचालन) ऐन, २०६४' },
    publisher: { en: 'Nepal Law Commission', ne: 'नेपाल कानून आयोग' },
    what: {
      en: 'The Kharidar syllabus names chapters 1, 2, 4 and 5 of this Act specifically, and it underpins good governance answers at the other two levels.',
      ne: 'खरिदारको पाठ्यक्रमले यस ऐनका परिच्छेद १, २, ४ र ५ नै किटेको छ, र अन्य दुई तहमा सुशासनसम्बन्धी उत्तरको आधार पनि यही हो।',
    },
    site: 'lawcommission.gov.np',
    covers: ['kharidar-p3-a', 'nasu-p3-c', 'adhikrit-p2-c'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Amended from time to time', ne: 'समय–समयमा संशोधन हुने' },
  },
  {
    id: 'rti-act',
    title: { en: 'Right to Information Act, 2064', ne: 'सूचनाको हक सम्बन्धी ऐन, २०६४' },
    publisher: { en: 'Nepal Law Commission', ne: 'नेपाल कानून आयोग' },
    what: {
      en: 'Chapters 1, 2 and 4 are named in the Kharidar syllabus; transparency and the right to information are examined in every post’s main papers.',
      ne: 'खरिदारको पाठ्यक्रमले परिच्छेद १, २ र ४ किटेको छ; पारदर्शिता र सूचनाको हक तीनै पदका मूल पत्रमा जाँचिन्छ।',
    },
    site: 'lawcommission.gov.np',
    covers: ['kharidar-p3-a', 'nasu-p2-b', 'adhikrit-p2-a', 'nasu-p3-c'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Amended from time to time', ne: 'समय–समयमा संशोधन हुने' },
  },
  {
    id: 'procurement-act',
    title: { en: 'Public Procurement Act and Regulation', ne: 'सार्वजनिक खरिद ऐन र नियमावली' },
    publisher: { en: 'Nepal Law Commission', ne: 'नेपाल कानून आयोग' },
    what: {
      en: 'The source for procurement method, threshold, bidding, the user committee and the conduct required of a procuring entity — examined in the service related papers of all three posts.',
      ne: 'खरिद विधि, सीमा, बोलपत्र, उपभोक्ता समिति र खरिद गर्ने निकायको आचरणको स्रोत — तीनै पदका सेवासम्बन्धी पत्रमा जाँचिन्छ।',
    },
    site: 'lawcommission.gov.np',
    covers: ['adhikrit-p4-c', 'nasu-p3-c', 'kharidar-p3-b'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Amended from time to time', ne: 'समय–समयमा संशोधन हुने' },
  },
  {
    id: 'financial-procedure-act',
    title: { en: 'Financial Procedure and Fiscal Responsibility Act, 2076', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६' },
    publisher: { en: 'Nepal Law Commission', ne: 'नेपाल कानून आयोग' },
    what: {
      en: 'Budget formulation and implementation, internal control, internal and final audit, irregularities and their settlement — the legal spine of the accounting and auditing sections.',
      ne: 'बजेट तर्जुमा र कार्यान्वयन, आन्तरिक नियन्त्रण, आन्तरिक र अन्तिम लेखापरीक्षण, बेरुजु र सोको फस्र्यौट — लेखा र लेखापरीक्षण खण्डको कानूनी मेरुदण्ड।',
    },
    site: 'lawcommission.gov.np',
    covers: ['adhikrit-p4-c', 'nasu-p3-c', 'kharidar-p3-b'],
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    cadence: { en: 'Amended from time to time', ne: 'समय–समयमा संशोधन हुने' },
  },
  {
    id: 'audit-act',
    title: { en: 'Audit Act, 2075', ne: 'लेखापरीक्षण ऐन, २०७५' },
    publisher: { en: 'Nepal Law Commission', ne: 'नेपाल कानून आयोग' },
    what: {
      en: 'What the Auditor General audits and how, named directly in the officer’s fourth paper and in the Kharidar job knowledge paper.',
      ne: 'महालेखा परीक्षकले के र कसरी लेखापरीक्षण गर्छ — अधिकृतको चतुर्थ पत्र र खरिदारको कार्य ज्ञान पत्रमा सिधै किटिएको।',
    },
    site: 'lawcommission.gov.np',
    covers: ['adhikrit-p4-c', 'kharidar-p3-b'],
    levels: ['adhikrit', 'kharidar'],
    cadence: { en: 'Amended from time to time', ne: 'समय–समयमा संशोधन हुने' },
  },
  {
    id: 'local-government-act',
    title: { en: 'Local Government Operation Act, 2074', ne: 'स्थानीय सरकार सञ्चालन ऐन, २०७४' },
    publisher: { en: 'Nepal Law Commission', ne: 'नेपाल कानून आयोग' },
    what: {
      en: 'How the 753 local levels are run and what they may do — the working detail behind every federalism answer, and named in the Nayab Subba third paper.',
      ne: '७५३ स्थानीय तह कसरी चल्छन् र के गर्न पाउँछन् — हरेक संघीयतासम्बन्धी उत्तरको व्यावहारिक आधार, र नायब सुब्बाको तृतीय पत्रमा किटिएको।',
    },
    site: 'lawcommission.gov.np',
    covers: ['nasu-p3-c', 'adhikrit-p4-d', 'nasu-p2-b'],
    levels: ['adhikrit', 'nayabsubba'],
    cadence: { en: 'Amended from time to time', ne: 'समय–समयमा संशोधन हुने' },
  },
];
