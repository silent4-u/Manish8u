import type { Lesson } from '../../types';

/**
 * General Mathematics is Section C of the Kharidar second paper — thirty
 * marks, six questions of five marks, written rather than multiple choice.
 * The same arithmetic turns up as quantitative reasoning in the Nayab Subba
 * and Section Officer preliminaries, so these notes are offered to all three
 * posts even though only Kharidar sits a whole section of it.
 */
export const mathsLessons: Lesson[] = [
  {
    id: 'math-01',
    subjectId: 'maths',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Unitary Method, Fractions, Percentage and Ratio', ne: 'ऐकिक नियम, भिन्न, प्रतिशत र अनुपात' },
    summary: {
      en: 'The four operations the rest of the syllabus is built on, and the percentage mistakes that cost marks.',
      ne: 'बाँकी पाठ्यक्रम जसमा अडिएको छ ती चार क्रिया, र अङ्क गुमाउने प्रतिशतका त्रुटि।',
    },
    readMinutes: 7,
    blocks: [
      { type: 'heading', text: { en: 'The unitary method', ne: 'ऐकिक नियम' } },
      {
        type: 'para',
        text: {
          en: 'Find the value of one, then multiply. If 12 files cost Rs 480, one file costs 480 ÷ 12 = Rs 40, so 7 files cost 7 × 40 = Rs 280. The method also runs backwards: if 8 clerks finish a job in 15 days, the whole job is 8 × 15 = 120 clerk-days, so 10 clerks finish it in 120 ÷ 10 = 12 days. Notice that more clerks means fewer days — this is inverse proportion, and mixing it up with direct proportion is the commonest error in this topic.',
          ne: 'एउटाको मान निकाल्नुहोस्, अनि गुणन गर्नुहोस्। १२ फाइलको मूल्य रु. ४८० भए एउटाको ४८० ÷ १२ = रु. ४०, त्यसैले ७ फाइलको ७ × ४० = रु. २८०। यो नियम उल्टो पनि चल्छ: ८ कर्मचारीले १५ दिनमा सक्ने काम जम्मा ८ × १५ = १२० कर्मचारी–दिनको हुन्छ, त्यसैले १० कर्मचारीले १२० ÷ १० = १२ दिनमा सक्छन्। कर्मचारी बढ्दा दिन घट्यो — यो व्युत्क्रम अनुपात हो, र यसलाई सीधा अनुपातसँग मिसाउनु यस विषयको सबैभन्दा सामान्य गल्ती हो।',
        },
      },
      { type: 'heading', text: { en: 'Percentage', ne: 'प्रतिशत' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'x per cent of N', ne: 'N को x प्रतिशत' }, value: { en: 'N × x ÷ 100', ne: 'N × x ÷ १००' } },
          { label: { en: 'A as a percentage of B', ne: 'B को कति प्रतिशत A' }, value: { en: 'A ÷ B × 100', ne: 'A ÷ B × १००' } },
          { label: { en: 'Increase by x per cent', ne: 'x प्रतिशतले बढाउने' }, value: { en: 'multiply by (100 + x) ÷ 100', ne: '(१०० + x) ÷ १०० ले गुणन' } },
          { label: { en: 'Decrease by x per cent', ne: 'x प्रतिशतले घटाउने' }, value: { en: 'multiply by (100 − x) ÷ 100', ne: '(१०० − x) ÷ १०० ले गुणन' } },
          { label: { en: 'Percentage change', ne: 'प्रतिशत परिवर्तन' }, value: { en: '(new − old) ÷ old × 100', ne: '(नयाँ − पुरानो) ÷ पुरानो × १००' } },
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'A rise of 20 per cent followed by a fall of 20 per cent does not return you to where you started. 100 becomes 120, and 20 per cent of 120 is 24, so you land on 96 — a net loss of 4 per cent. The percentages are taken on different bases, which is exactly what the question is testing.',
          ne: '२० प्रतिशत बढेर फेरि २० प्रतिशत घट्दा सुरुकै ठाउँमा पुगिँदैन। १०० बाट १२० हुन्छ, र १२० को २० प्रतिशत २४ हुने भएकाले ९६ मा झर्छ — कुल ४ प्रतिशत घाटा। प्रतिशत फरक–फरक आधारमा लिइएको हुन्छ, र प्रश्नले जाँच्ने कुरा त्यही हो।',
        },
      },
      { type: 'heading', text: { en: 'Ratio', ne: 'अनुपात' } },
      {
        type: 'para',
        text: {
          en: 'To divide an amount in a ratio, add the parts and share out. Rs 4,500 in the ratio 2 : 3 : 4 has 2 + 3 + 4 = 9 parts, so one part is Rs 500 and the shares are Rs 1,000, Rs 1,500 and Rs 2,000. Check by adding: they must come back to the original amount.',
          ne: 'कुनै रकम अनुपातमा बाँड्न भागहरू जोडेर बाँड्नुहोस्। रु. ४,५०० लाई २ : ३ : ४ मा बाँड्दा २ + ३ + ४ = ९ भाग हुन्छन्, त्यसैले एक भाग रु. ५०० र हिस्साहरू रु. १,०००, रु. १,५०० र रु. २,००० हुन्छन्। जोडेर जाँच्नुहोस्: कुल रकम फर्केर आउनुपर्छ।',
        },
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Fraction, decimal and percentage are one idea in three costumes: 1/4 = 0.25 = 25 per cent. Learn the common ones by sight — 1/8 = 12.5%, 1/3 = 33⅓%, 3/8 = 37.5%, 5/8 = 62.5%, 2/3 = 66⅔% — and a good share of the paper needs no working at all.',
          ne: 'भिन्न, दशमलव र प्रतिशत एउटै कुराका तीन रूप हुन्: १/४ = ०.२५ = २५ प्रतिशत। सामान्यहरू हेर्नेबित्तिकै चिन्नुहोस् — १/८ = १२.५%, १/३ = ३३⅓%, ३/८ = ३७.५%, ५/८ = ६२.५%, २/३ = ६६⅔% — अनि पत्रको राम्रै हिस्सा गणनै नगरी बन्छ।',
        },
      },
    ],
  },
  {
    id: 'math-02',
    subjectId: 'maths',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Profit and Loss, Discount, Tax, Commission and Depreciation', ne: 'नाफा–नोक्सान, छुट, कर, कमिसन र ह्रासकट्टी' },
    summary: {
      en: 'Everything worked out on the right base — cost price, marked price or written-down value — and where each is taken from.',
      ne: 'सबै हिसाब सही आधारमा — क्रय मूल्य, अङ्कित मूल्य वा बाँकी मूल्य — र प्रत्येक कहाँबाट लिइन्छ।',
    },
    readMinutes: 7,
    blocks: [
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Profit and loss are always a percentage of the cost price. Discount is always a percentage of the marked price. VAT is always added on the price after discount. Getting the base right settles most of this topic; the arithmetic is easy once it is.',
          ne: 'नाफा र नोक्सान सधैँ क्रय मूल्यको प्रतिशत हुन्। छुट सधैँ अङ्कित मूल्यको प्रतिशत हुन्छ। मूल्य अभिवृद्धि कर सधैँ छुटपछिको मूल्यमा थपिन्छ। आधार ठीक पारे यो विषय झन्डै सकियो; त्यसपछिको गणित सजिलो छ।',
        },
      },
      {
        type: 'facts',
        items: [
          { label: { en: 'Profit', ne: 'नाफा' }, value: { en: 'SP − CP; profit % = profit ÷ CP × 100', ne: 'विक्रय − क्रय; नाफा % = नाफा ÷ क्रय × १००' } },
          { label: { en: 'Loss', ne: 'नोक्सान' }, value: { en: 'CP − SP; loss % = loss ÷ CP × 100', ne: 'क्रय − विक्रय; नोक्सान % = नोक्सान ÷ क्रय × १००' } },
          { label: { en: 'Discount', ne: 'छुट' }, value: { en: 'MP × rate ÷ 100; SP = MP − discount', ne: 'अङ्कित × दर ÷ १००; विक्रय = अङ्कित − छुट' } },
          { label: { en: 'VAT', ne: 'मूल्य अभिवृद्धि कर' }, value: { en: 'added to the discounted price, currently 13 per cent', ne: 'छुटपछिको मूल्यमा थपिन्छ, हाल १३ प्रतिशत' } },
          { label: { en: 'Commission', ne: 'कमिसन' }, value: { en: 'a percentage of the value of the transaction', ne: 'कारोबारको मूल्यको प्रतिशत' } },
          { label: { en: 'Depreciation', ne: 'ह्रासकट्टी' }, value: { en: 'each year’s rate applies to the value left, not the original', ne: 'हरेक वर्षको दर सुरुको होइन, बाँकी मूल्यमा लाग्छ' } },
        ],
      },
      {
        type: 'para',
        text: {
          en: 'A worked chain. A chair is marked Rs 2,000 and sold at 10 per cent discount with 13 per cent VAT. The discount is Rs 200, so the price is Rs 1,800; VAT is 13 per cent of 1,800 = Rs 234; the customer pays Rs 2,034. If the shop had bought the chair for Rs 1,500, the profit is 1,800 − 1,500 = Rs 300 — and the profit percentage is 300 ÷ 1,500 × 100 = 20 per cent, taken on the cost price, not on the Rs 2,034 the customer handed over.',
          ne: 'एउटा पूरा उदाहरण। कुर्सीको अङ्कित मूल्य रु. २,००० छ, १० प्रतिशत छुटमा बेचियो र १३ प्रतिशत मूल्य अभिवृद्धि कर लाग्यो। छुट रु. २००, त्यसैले मूल्य रु. १,८००; करको १३ प्रतिशत १,८०० को = रु. २३४; ग्राहकले रु. २,०३४ तिर्छ। पसलले कुर्सी रु. १,५०० मा किनेको थियो भने नाफा १,८०० − १,५०० = रु. ३०० — र नाफा प्रतिशत ३०० ÷ १,५०० × १०० = २० प्रतिशत, क्रय मूल्यमा; ग्राहकले तिरेको रु. २,०३४ मा होइन।',
        },
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'Depreciation compounds downwards. A machine worth Rs 100,000 falling 10 per cent a year is worth 90,000 after one year and 81,000 after two — not 80,000. Ten per cent of the second year is taken on 90,000, not on the original.',
          ne: 'ह्रासकट्टी चक्रीय रूपमा घट्छ। रु. १,००,००० को मेसिन वर्षको १० प्रतिशतले घट्दा एक वर्षपछि ९०,००० र दुई वर्षपछि ८१,००० हुन्छ — ८०,००० होइन। दोस्रो वर्षको १० प्रतिशत सुरुको होइन, ९०,००० मा लाग्छ।',
        },
      },
    ],
  },
  {
    id: 'math-03',
    subjectId: 'maths',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Interest, Average and Household Arithmetic', ne: 'ब्याज, औसत र घरायसी अङ्कगणित' },
    summary: {
      en: 'Simple and compound interest, averages that shift when a value joins or leaves, and the utility bills and currency conversions the syllabus names.',
      ne: 'साधारण र चक्रीय ब्याज, कुनै मान थपिँदा वा हटाउँदा सर्ने औसत, र पाठ्यक्रमले तोकेका महसुल तथा मुद्रा विनिमय।',
    },
    readMinutes: 7,
    blocks: [
      { type: 'heading', text: { en: 'Interest', ne: 'ब्याज' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Simple interest', ne: 'साधारण ब्याज' }, value: { en: 'I = P × T × R ÷ 100', ne: 'ब्याज = साँवा × समय × दर ÷ १००' } },
          { label: { en: 'Compound amount', ne: 'चक्रीय मिश्रधन' }, value: { en: 'A = P × (1 + R/100)^T', ne: 'मिश्रधन = साँवा × (१ + दर/१००)^समय' } },
          { label: { en: 'Compound interest', ne: 'चक्रीय ब्याज' }, value: { en: 'A − P', ne: 'मिश्रधन − साँवा' } },
        ],
      },
      {
        type: 'para',
        text: {
          en: 'Rs 20,000 at 10 per cent for 2 years earns 20,000 × 2 × 10 ÷ 100 = Rs 4,000 simple interest. Compounded yearly it earns more: 20,000 × 1.1 × 1.1 = Rs 24,200, so Rs 4,200 of interest. The Rs 200 gap is the interest earned in year two on year one’s interest, and for two years the gap is always P × (R ÷ 100)².',
          ne: 'रु. २०,००० मा १० प्रतिशतले २ वर्षको साधारण ब्याज २०,००० × २ × १० ÷ १०० = रु. ४,००० हुन्छ। वार्षिक चक्रीय हिसाबमा बढी हुन्छ: २०,००० × १.१ × १.१ = रु. २४,२००, अर्थात् ब्याज रु. ४,२००। रु. २०० को फरक दोस्रो वर्षमा पहिलो वर्षको ब्याजमाथि लागेको ब्याज हो, र दुई वर्षका लागि यो फरक सधैँ साँवा × (दर ÷ १००)² हुन्छ।',
        },
      },
      { type: 'heading', text: { en: 'Average', ne: 'औसत' } },
      {
        type: 'para',
        text: {
          en: 'Average = total ÷ count, so total = average × count — and that second form solves most questions. If the average of 5 numbers is 18, the total is 90; if a sixth number joins and the average becomes 20, the new total is 120, so the number added is 30. Work in totals, not in averages.',
          ne: 'औसत = जम्मा ÷ संख्या, त्यसैले जम्मा = औसत × संख्या — र यही दोस्रो रूपले धेरैजसो प्रश्न फुकाउँछ। ५ संख्याको औसत १८ भए जम्मा ९०; छैटौँ संख्या थपिएर औसत २० भयो भने नयाँ जम्मा १२०, त्यसैले थपिएको संख्या ३०। औसतमा होइन, जम्मामा काम गर्नुहोस्।',
        },
      },
      { type: 'heading', text: { en: 'Household arithmetic', ne: 'घरायसी अङ्कगणित' } },
      {
        type: 'para',
        text: {
          en: 'The syllabus names electricity, water and telephone bills and currency exchange. Utility bills are read as a meter difference multiplied by a slab rate, plus a fixed service charge — read the present and previous readings, subtract, then apply the rate for the units used. Currency questions turn on which way the rate runs: to change foreign currency into rupees, multiply by the buying rate; to buy foreign currency with rupees, divide by the selling rate.',
          ne: 'पाठ्यक्रमले बिजुली, पानी र टेलिफोनको महसुल तथा मुद्रा विनिमय तोकेको छ। महसुल भनेको मिटरको फरकलाई दरले गुणन गरी निश्चित सेवा शुल्क जोडेको हुन्छ — अहिलेको र अघिल्लो रिडिङ हेर्नुहोस्, घटाउनुहोस्, अनि खपत एकाइमा दर लगाउनुहोस्। मुद्राका प्रश्नमा दर कुन दिशामा चल्छ भन्ने कुरा मुख्य हुन्छ: विदेशी मुद्रालाई रुपैयाँमा बदल्न खरिद दरले गुणन गर्नुहोस्; रुपैयाँले विदेशी मुद्रा किन्न बिक्री दरले भाग गर्नुहोस्।',
        },
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Nepal pegs the rupee to the Indian rupee at NPR 160 to INR 100, so INR 1 = NPR 1.6. That conversion appears often enough to be worth knowing without working it out.',
          ne: 'नेपाली रुपैयाँ भारतीय रुपैयाँसँग भा.रु. १०० बराबर ने.रु. १६० को दरमा आबद्ध छ, अर्थात् भा.रु. १ = ने.रु. १.६। यो रूपान्तरण पर्याप्त पटक आउने भएकाले गणना नगरी नै थाहा हुनु राम्रो।',
        },
      },
    ],
  },
  {
    id: 'math-04',
    subjectId: 'maths',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Mensuration — Perimeter, Area and Volume', ne: 'क्षेत्रमिति — परिमिति, क्षेत्रफल र आयतन' },
    summary: {
      en: 'The formulas the syllabus asks for, the unit conversions that trip candidates up, and how area and volume respond when a length changes.',
      ne: 'पाठ्यक्रमले मागेका सूत्र, उम्मेदवारलाई अल्झाउने एकाइ रूपान्तरण, र लम्बाइ बदलिँदा क्षेत्रफल र आयतनमा पर्ने असर।',
    },
    readMinutes: 6,
    blocks: [
      {
        type: 'table',
        headers: [
          { en: 'Shape', ne: 'आकृति' },
          { en: 'Perimeter', ne: 'परिमिति' },
          { en: 'Area', ne: 'क्षेत्रफल' },
        ],
        rows: [
          [{ en: 'Rectangle', ne: 'आयत' }, { en: '2(l + b)', ne: '२ × (लम्बाइ + चौडाइ)' }, { en: 'l × b', ne: 'लम्बाइ × चौडाइ' }],
          [{ en: 'Square', ne: 'वर्ग' }, { en: '4a', ne: '४ × भुजा' }, { en: 'a²', ne: 'भुजा²' }],
          [{ en: 'Triangle', ne: 'त्रिभुज' }, { en: 'sum of the three sides', ne: 'तीनै भुजाको योग' }, { en: '½ × base × height', ne: '½ × आधार × उचाइ' }],
          [{ en: 'Circle', ne: 'वृत्त' }, { en: '2πr', ne: '२ × पाई × त्रिज्या' }, { en: 'πr²', ne: 'पाई × त्रिज्या²' }],
        ],
      },
      {
        type: 'facts',
        items: [
          { label: { en: 'Cuboid volume', ne: 'घनाभको आयतन' }, value: { en: 'l × b × h', ne: 'लम्बाइ × चौडाइ × उचाइ' } },
          { label: { en: 'Cube volume', ne: 'घनको आयतन' }, value: { en: 'a³', ne: 'भुजा³' } },
          { label: { en: 'Cylinder volume', ne: 'बेलनाको आयतन' }, value: { en: 'πr²h', ne: 'पाई × त्रिज्या² × उचाइ' } },
          { label: { en: 'Ropani', ne: 'रोपनी' }, value: { en: '5,476 sq ft = 16 aana = 508.72 sq m', ne: '५,४७६ वर्ग फिट = १६ आना = ५०८.७२ वर्ग मिटर' } },
          { label: { en: 'Bigha', ne: 'बिघा' }, value: { en: '20 kattha = 6,772.63 sq m', ne: '२० कट्ठा = ६,७७२.६३ वर्ग मिटर' } },
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'Units square and cube along with the shape. One metre is 100 cm, but one square metre is 10,000 square cm and one cubic metre is 1,000,000 cubic cm. Convert every measurement to the same unit before you start, not after.',
          ne: 'एकाइ पनि आकृतिसँगै वर्ग र घन हुन्छ। एक मिटर १०० सेन्टिमिटर हो, तर एक वर्ग मिटर १०,००० वर्ग सेन्टिमिटर र एक घन मिटर १०,००,००० घन सेन्टिमिटर हुन्छ। सबै नाप सुरुमै एउटै एकाइमा ल्याउनुहोस्, पछि होइन।',
        },
      },
      {
        type: 'para',
        text: {
          en: 'A useful shortcut: if every length of a figure is multiplied by k, its perimeter is multiplied by k, its area by k² and its volume by k³. Double the side of a square and the area quadruples; double the side of a cube and the volume becomes eight times. Questions that look like they need long calculation often only need this.',
          ne: 'एउटा उपयोगी सर्टकट: कुनै आकृतिका सबै लम्बाइलाई k ले गुणन गर्दा परिमिति k ले, क्षेत्रफल k² ले र आयतन k³ ले गुणन हुन्छ। वर्गको भुजा दोब्बर पार्दा क्षेत्रफल चार गुणा हुन्छ; घनको भुजा दोब्बर पार्दा आयतन आठ गुणा। लामो गणना चाहिने देखिने प्रश्नलाई प्रायः यत्ति नै पुग्छ।',
        },
      },
    ],
  },
];
