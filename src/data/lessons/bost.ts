import type { Lesson } from '../../types';

/**
 * The Basic Office Skills Test is the second half of the Kharidar
 * preliminary — forty of its hundred marks. The commission describes it as
 * measuring whether a candidate can do office work quickly and accurately,
 * and says explicitly that it is pitched at someone who has passed class ten
 * rather than studied any particular subject, and that it rewards reasoning
 * over memorisation. These notes work each named question type.
 */
export const bostLessons: Lesson[] = [
  {
    id: 'bost-01',
    subjectId: 'bost',
    levels: ['kharidar'],
    title: { en: 'The Basic Office Skills Test — the ten question types', ne: 'आधारभुत कार्यालय सीप परीक्षण — दस किसिमका प्रश्न' },
    summary: {
      en: 'What the commission asks in Section B of the Kharidar preliminary, two questions of each type, and what each one is really testing.',
      ne: 'खरिदार प्रारम्भिक परीक्षाको खण्ड ख मा आयोगले के सोध्छ, प्रत्येक किसिमका दुई प्रश्न, र हरेकले वास्तवमा के जाँच्छ।',
    },
    readMinutes: 8,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Section B of the first paper is worth 40 marks: twenty questions of two marks each, two from each of ten named question types. Because the split is fixed, no type can be skipped — leaving one out costs four marks whatever else you get right.',
          ne: 'प्रथम पत्रको खण्ड ख ४० अङ्कको हुन्छ: २ अङ्कका बीस प्रश्न, तोकिएका दस किसिममध्ये प्रत्येकबाट दुई। बाँडफाँड तोकिएकै हुने भएकाले कुनै किसिम छाड्न मिल्दैन — एउटा छाड्दा अरू जति सही भए पनि ४ अङ्क जान्छ।',
        },
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'The commission states the purpose plainly: the test measures whether you can read quickly, check verbal and numerical information for accuracy, compare information, follow a written instruction exactly, understand and interpret written material, and take an ordinary decision. It says the test reflects analytical ability rather than memorisation.',
          ne: 'आयोगले उद्देश्य स्पष्ट लेखेको छ: छिटो पढ्न सक्ने, शाब्दिक र संख्यात्मक जानकारीको शुद्धता जाँच्न सक्ने, सूचना तुलना गर्न सक्ने, लिखित निर्देशनको राम्ररी पालना गर्न सक्ने, लिखित सामग्री बुझ्ने र व्याख्या गर्न सक्ने तथा सामान्य निर्णय लिन सक्ने क्षमता जाँच्ने। यसले घोक्ने भन्दा विश्लेषण क्षमतालाई प्रतिबिम्बित गर्छ।',
        },
      },
      { type: 'heading', text: { en: 'The ten types at a glance', ne: 'दस किसिम एक नजरमा' } },
      {
        type: 'table',
        headers: [
          { en: 'Type', ne: 'किसिम' },
          { en: 'What you are given', ne: 'के दिइन्छ' },
          { en: 'Marks', ne: 'अङ्क' },
        ],
        rows: [
          [{ en: 'Verification (रुजु)', ne: 'रुजु गर्ने' }, { en: 'Two lists, records or figures to check for a mistake or a difference', ne: 'त्रुटि वा भिन्नता जाँच्नुपर्ने दुई सूची, अभिलेख वा अङ्क' }, { en: '4', ne: '४' }],
          [{ en: 'Completion (क्रम पुरा)', ne: 'खाली स्थान वा क्रम पुरा गर्ने' }, { en: 'A series, pattern or matrix with a gap in it', ne: 'खाली ठाउँ भएको शृंखला, ढाँचा वा मेट्रिक्स' }, { en: '4', ne: '४' }],
          [{ en: 'Classification (वर्गीकरण)', ne: 'वर्गीकरण गर्ने' }, { en: 'A group where one item does not belong', ne: 'एउटा वस्तु नमिल्ने समूह' }, { en: '4', ne: '४' }],
          [{ en: 'Analogy (सम्बन्ध)', ne: 'सम्बन्ध परीक्षण' }, { en: 'A pair, and a second pair with one half missing', ne: 'एक जोडी, र आधा छुटेको अर्को जोडी' }, { en: '4', ne: '४' }],
          [{ en: 'Filing aptitude (फाइलिङ)', ne: 'फाइलिङ अभिरुचि परीक्षण' }, { en: 'Files to place in alphabetical, numerical or date order', ne: 'वर्णमाला, संख्या वा मिति क्रममा राख्नुपर्ने फाइल' }, { en: '4', ne: '४' }],
          [{ en: 'Following instructions (निर्देशन)', ne: 'निर्देशन अनुसरण गर्ने' }, { en: 'A written instruction to carry out exactly', ne: 'हुबहु पालना गर्नुपर्ने लिखित निर्देशन' }, { en: '4', ne: '४' }],
          [{ en: 'Numerical reasoning (संख्यात्मक)', ne: 'संख्यात्मक चातुर्य परीक्षण' }, { en: 'An ordinary arithmetic calculation', ne: 'सामान्य अंकगणितीय क्रिया' }, { en: '4', ne: '४' }],
          [{ en: 'Coding and matching (कोडिङ)', ne: 'कोडिङ र भिडान परीक्षण' }, { en: 'A rule turning letters or numbers into a code', ne: 'अक्षर वा संख्यालाई कोडमा बदल्ने नियम' }, { en: '4', ne: '४' }],
          [{ en: 'Analytical reasoning (विश्लेषणात्मक)', ne: 'विश्लेषणात्मक तार्किकता परीक्षण' }, { en: 'A short set of conditions to work out', ne: 'निष्कर्ष निकाल्नुपर्ने केही सर्त' }, { en: '4', ne: '४' }],
          [{ en: 'Direction and distance (दिशा र दुरी)', ne: 'दिशा र दुरी ज्ञान परीक्षण' }, { en: 'A route described in turns and distances', ne: 'मोड र दुरीमा वर्णन गरिएको बाटो' }, { en: '4', ne: '४' }],
        ],
      },
      { type: 'heading', text: { en: 'Verification', ne: 'रुजु गर्ने' } },
      {
        type: 'para',
        text: {
          en: 'You are shown two versions of the same information and asked how many entries differ, or which pair matches exactly. The work is comparison, not calculation. Read in fixed chunks — three or four characters at a time — rather than trying to take a whole line in at once, and check digits right to left, because a transposed pair such as 4826 against 4862 is the mistake this question is built around.',
          ne: 'एउटै सूचनाका दुई प्रति देखाएर कति फरक छन् वा कुन जोडी बिल्कुल मिल्छ भनी सोधिन्छ। यहाँ गणना होइन, तुलना गर्नुपर्छ। पूरै हरफ एकैचोटि हेर्ने प्रयास नगरी तीन–चार अक्षरको टुक्रा बनाएर पढ्नुहोस्, र अङ्क दायाँबाट बायाँ मिलाउनुहोस् — किनभने ४८२६ र ४८६२ जस्तो ठाउँ साटिएको त्रुटि नै यस्ता प्रश्नको मूल जाल हो।',
        },
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Worked example. Which pair is identical? (a) 5074216 / 5074216 (b) 5074216 / 5074126. In (b) the last three digits read 126 against 216, so the answer is (a). Note that both options begin with the same four digits: the difference is always planted late in the string.',
          ne: 'उदाहरण। कुन जोडी उस्तै छ? (क) ५०७४२१६ / ५०७४२१६ (ख) ५०७४२१६ / ५०७४१२६। (ख) मा अन्तिम तीन अङ्क १२६ र २१६ छन्, त्यसैले उत्तर (क)। दुवै विकल्प एउटै चार अङ्कबाट सुरु हुन्छन् भन्ने ध्यान दिनुहोस्: भिन्नता सधैँ पछाडि लुकाइएको हुन्छ।',
        },
      },
      { type: 'heading', text: { en: 'Filing aptitude', ne: 'फाइलिङ अभिरुचि परीक्षण' } },
      {
        type: 'para',
        text: {
          en: 'This is the type most specific to the post and the one candidates practise least. You are given file names, numbers or dates and asked where a new one belongs. Alphabetical filing compares letter by letter, and a shorter name that is otherwise identical files first — Rai before Raika. Numerical filing compares digit by digit after padding to the same length, so 07 files before 100. Date filing runs year, then month, then day.',
          ne: 'यो पदसँग सबैभन्दा नजिकको र उम्मेदवारले सबैभन्दा कम अभ्यास गर्ने किसिम हो। फाइलको नाम, नम्बर वा मिति दिएर नयाँ फाइल कहाँ पर्छ भनी सोधिन्छ। वर्णमाला क्रममा अक्षर–अक्षर मिलाइन्छ, र बाँकी उस्तै भए छोटो नाम पहिले पर्छ — राई अनि राईका। संख्या क्रममा उही लम्बाइ पुर्‍याएर अङ्क–अङ्क मिलाइन्छ, त्यसैले ०७ पहिले र १०० पछि। मिति क्रममा पहिले साल, अनि महिना, अनि गते।',
        },
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'A number written as text does not sort like a number. As text, "100" comes before "07" because 1 comes before 0 is false — 0 comes before 1, so "07" leads; but "9" would come after "100" because the first character 9 beats 1. Filing questions rely on you padding first: 007, 009, 100.',
          ne: 'पाठका रूपमा लेखिएको संख्या संख्याजस्तै क्रममा पर्दैन। "९" लाई "१००" सँग तुलना गर्दा पहिलो अक्षर ९ ले १ लाई जित्ने भएकाले "९" पछि पर्छ। त्यसैले पहिले शून्य थपेर लम्बाइ बराबर बनाउनुहोस्: ००७, ००९, १००।',
        },
      },
      { type: 'heading', text: { en: 'Following instructions', ne: 'निर्देशन अनुसरण गर्ने' } },
      {
        type: 'para',
        text: {
          en: 'A short written instruction is given and must be carried out exactly — mark the third letter of the second word, or add the numbers in column two but only the even ones. Nothing here is difficult; the marks are lost by reading the instruction once and starting work. Read it twice, underline the constraint, and do only what it says.',
          ne: 'छोटो लिखित निर्देशन दिइन्छ र त्यसलाई हुबहु पालना गर्नुपर्छ — दोस्रो शब्दको तेस्रो अक्षरमा चिन्ह लगाउनुहोस्, वा दोस्रो स्तम्भका संख्या जोड्नुहोस् तर जोर संख्या मात्र। यहाँ कठिन केही छैन; निर्देशन एकपटक पढेर काम सुरु गर्दा अङ्क जान्छ। दुईपटक पढ्नुहोस्, सर्तमा रेखा तान्नुहोस्, र भनिएको मात्र गर्नुहोस्।',
        },
      },
      { type: 'heading', text: { en: 'Direction and distance', ne: 'दिशा र दुरी ज्ञान परीक्षण' } },
      {
        type: 'para',
        text: {
          en: 'Draw it. A route given in turns is almost impossible to hold in the head and almost trivial on paper. Mark north at the top of your rough sheet, put the starting point in the middle, and take one turn at a time. A left turn moves you anticlockwise — north becomes west, west becomes south — and a right turn moves you clockwise. When the question asks for the distance back to the start rather than the distance walked, look for the right-angled triangle: legs of 3 and 4 give 5, and 6 and 8 give 10.',
          ne: 'चित्र बनाउनुहोस्। मोडमा दिइएको बाटो दिमागमा राख्न झन्डै असम्भव हुन्छ, कागजमा झन्डै सजिलो। रफ पानाको माथि उत्तर लेख्नुहोस्, सुरुको बिन्दु बीचमा राख्नुहोस्, र एकपटकमा एउटा मोड लिनुहोस्। बायाँ मोड्दा घडीको विपरीत दिशा — उत्तरबाट पश्चिम, पश्चिमबाट दक्षिण — र दायाँ मोड्दा घडीकै दिशा हुन्छ। हिँडेको दुरी होइन, सुरुको बिन्दुसम्मको सीधा दुरी सोधिएको छ भने समकोण त्रिभुज खोज्नुहोस्: ३ र ४ को कर्ण ५, ६ र ८ को १०।',
        },
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Across all ten types the arithmetic never goes beyond class ten. What is being tested is speed and accuracy under a 45-minute clock covering fifty questions — a little over 50 seconds each, including the thirty general knowledge questions. Practise for the clock, not for the difficulty.',
          ne: 'दसै किसिममा गणित कक्षा दसभन्दा माथि जाँदैन। जाँचिने कुरा ४५ मिनेटमा पचास प्रश्नको गतिमा शुद्धता हो — प्रतिप्रश्न ५० सेकेन्डभन्दा केही बढी, त्यसमा तीस सामान्य ज्ञानका प्रश्न पनि पर्छन्। कठिनाइका लागि होइन, घडीका लागि अभ्यास गर्नुहोस्।',
        },
      },
    ],
  },
];
