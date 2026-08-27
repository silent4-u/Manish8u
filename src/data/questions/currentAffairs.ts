import { buildQuestions, type QSpec } from './build';

const specs: QSpec[] = [
  {
    id: 'ca-q01', s: 'current-affairs', lv: 'ank', d: 'medium',
    q: ['Which body is the focal agency for monitoring the Sustainable Development Goals in Nepal?', 'नेपालमा दिगो विकास लक्ष्यको अनुगमन गर्ने केन्द्रबिन्दु निकाय कुन हो?'],
    o: [['Ministry of Finance', 'अर्थ मन्त्रालय'], ['National Planning Commission', 'राष्ट्रिय योजना आयोग'], ['Nepal Rastra Bank', 'नेपाल राष्ट्र बैंक'], ['Office of the Prime Minister', 'प्रधानमन्त्री कार्यालय']],
    a: 1,
    e: ['The National Planning Commission coordinates SDG mainstreaming, coding and progress reporting.', 'राष्ट्रिय योजना आयोगले दिगो विकास लक्ष्यको मूलप्रवाहीकरण, कोडिङ र प्रगति प्रतिवेदनको समन्वय गर्छ।'],
  },
  {
    id: 'ca-q02', s: 'current-affairs', lv: 'ank', d: 'medium',
    q: ['According to the 2078 BS census, the annual population growth rate of Nepal was approximately:', 'जनगणना २०७८ अनुसार नेपालको वार्षिक जनसंख्या वृद्धिदर करिब कति थियो?'],
    o: [['0.92 per cent', '०.९२ प्रतिशत'], ['1.35 per cent', '१.३५ प्रतिशत'], ['1.85 per cent', '१.८५ प्रतिशत'], ['2.25 per cent', '२.२५ प्रतिशत']],
    a: 0,
    e: ['About 0.92 per cent — the lowest growth rate recorded in Nepal’s census history.', 'करिब ०.९२ प्रतिशत — नेपालको जनगणना इतिहासमै अभिलेख भएको सबैभन्दा कम वृद्धिदर।'],
  },
  {
    id: 'ca-q03', s: 'current-affairs', lv: 'an', d: 'medium',
    q: ['Which framework sets out Nepal’s sectors for digital transformation?', 'नेपालको डिजिटल रूपान्तरणका क्षेत्र तोक्ने रूपरेखा कुन हो?'],
    o: [['Digital Nepal Framework', 'डिजिटल नेपाल फ्रेमवर्क'], ['E-Governance Master Plan only', 'विद्युतीय सुशासन गुरुयोजना मात्र'], ['Nepal Vision 2100', 'नेपाल सोच २१००'], ['ICT Policy 2059', 'सूचना प्रविधि नीति २०५९']],
    a: 0,
    e: ['The Digital Nepal Framework covers the digital foundation plus sectors such as agriculture, health, education, energy, tourism, finance and urban infrastructure.', 'डिजिटल नेपाल फ्रेमवर्कले डिजिटल आधारसहित कृषि, स्वास्थ्य, शिक्षा, ऊर्जा, पर्यटन, वित्त र सहरी पूर्वाधार जस्ता क्षेत्र समेट्छ।'],
  },
  {
    id: 'ca-q04', s: 'current-affairs', lv: 'an', d: 'hard',
    q: ['Which of the following is NOT one of the three criteria used for graduation from Least Developed Country status?', 'अतिकम विकसित मुलुकबाट स्तरोन्नतिका लागि प्रयोग हुने तीन मापदण्डमध्ये निम्नमध्ये कुन होइन?'],
    o: [['Gross national income per capita', 'प्रतिव्यक्ति कुल राष्ट्रिय आय'], ['Human assets index', 'मानव सम्पत्ति सूचकांक'], ['Economic and environmental vulnerability index', 'आर्थिक तथा वातावरणीय जोखिम सूचकांक'], ['Total foreign exchange reserve', 'कुल विदेशी विनिमय सञ्चिति']],
    a: 3,
    e: ['The three criteria are income per capita, the human assets index and the economic and environmental vulnerability index.', 'तीन मापदण्ड हुन्: प्रतिव्यक्ति आय, मानव सम्पत्ति सूचकांक र आर्थिक तथा वातावरणीय जोखिम सूचकांक।'],
  },
  {
    id: 'ca-q05', s: 'current-affairs', lv: 'an', d: 'medium',
    q: ['The Sixteenth Periodic Plan of Nepal covers which period?', 'नेपालको सोह्रौं आवधिक योजनाले कुन अवधि समेट्छ?'],
    o: [['2076/77–2080/81', '२०७६/७७–२०८०/८१'], ['2081/82–2085/86', '२०८१/८२–२०८५/८६'], ['2079/80–2083/84', '२०७९/८०–२०८३/८४'], ['2080/81–2084/85', '२०८०/८१–२०८४/८५']],
    a: 1,
    e: ['The Sixteenth Plan runs from 2081/82 to 2085/86; the Fifteenth ran from 2076/77 to 2080/81.', 'सोह्रौं योजना २०८१/८२ देखि २०८५/८६ सम्म चल्छ; पन्ध्रौं योजना २०७६/७७ देखि २०८०/८१ सम्म थियो।'],
  },
  {
    id: 'ca-q06', s: 'current-affairs', lv: 'ank', d: 'easy',
    q: ['In which year did Nepal and China jointly announce the revised height of Mount Everest?', 'नेपाल र चीनले सगरमाथाको संशोधित उचाइ संयुक्त रूपमा कुन सालमा घोषणा गरे?'],
    o: [['2018', 'सन् २०१८'], ['2019', 'सन् २०१९'], ['2020', 'सन् २०२०'], ['2021', 'सन् २०२१']],
    a: 2,
    e: ['The joint announcement of 8,848.86 metres was made in December 2020.', '८,८४८.८६ मिटरको संयुक्त घोषणा डिसेम्बर २०२० मा भएको हो।'],
  },
];

export const currentAffairsQuestions = buildQuestions(specs);
