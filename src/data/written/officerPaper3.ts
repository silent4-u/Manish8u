import type { WrittenQuestion } from '../../types';

/**
 * Section Officer, Paper III — Contemporary Issues.
 *
 * This paper rewards a candidate who can state a problem, give its cause,
 * name what the State has already done about it, and propose something
 * specific. The model answers below follow that shape rather than listing
 * facts, because the marks are for the argument.
 */
export const OFFICER_PAPER_3: WrittenQuestion[] = [
  {
    id: 'w-adhikrit-p3-a-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p3',
    sectionId: 'adhikrit-p3-a',
    subjectId: 'governance',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Foreign labour migration has become central to Nepali society. Analyse its social consequences and suggest measures to reduce the costs while keeping the benefits.',
      ne: 'वैदेशिक रोजगारी नेपाली समाजको केन्द्रीय विषय बनेको छ। यसका सामाजिक परिणामको विश्लेषण गर्दै लाभ कायम राख्दै लागत घटाउने उपाय सुझाउनुहोस्।',
    },
    keyPoints: [
      { en: 'Scale: remittance is the largest single source of foreign exchange and a major share of GDP', ne: 'परिमाण: विप्रेषण विदेशी मुद्राको सबैभन्दा ठूलो एकल स्रोत र कुल गार्हस्थ्य उत्पादनको महत्त्वपूर्ण अंश' },
      { en: 'Benefits: household consumption, poverty reduction, schooling, and a fall in absolute poverty', ne: 'लाभ: घरायसी उपभोग, गरिबी न्यूनीकरण, शिक्षा, र निरपेक्ष गरिबीमा कमी' },
      { en: 'Costs: split families, care deficit for children and the elderly, feminisation of agriculture, skills drain', ne: 'लागत: विभाजित परिवार, बालबालिका र ज्येष्ठ नागरिकको स्याहारमा कमी, कृषिको महिलाकरण, सीप पलायन' },
      { en: 'Protection gaps: recruitment cost, contract substitution, occupational death and injury', ne: 'संरक्षणमा अन्तर: भर्ना लागत, सम्झौता फेरबदल, कामको सिलसिलामा हुने मृत्यु र चोटपटक' },
      { en: 'Legal basis: Foreign Employment Act 2064, Foreign Employment Board, bilateral labour agreements', ne: 'कानुनी आधार: वैदेशिक रोजगार ऐन, २०६४, वैदेशिक रोजगार बोर्ड, द्विपक्षीय श्रम सम्झौता' },
      { en: 'Article 33 right to employment; Article 51(i) policy on labour and employment', ne: 'धारा ३३ रोजगारीको हक; धारा ५१(झ) श्रम र रोजगारीसम्बन्धी नीति' },
      { en: 'Remedies: free-visa free-ticket enforcement, skills certification, reintegration, productive use of remittance', ne: 'उपाय: निःशुल्क भिसा–निःशुल्क टिकटको कार्यान्वयन, सीप प्रमाणीकरण, पुनरेकीकरण, विप्रेषणको उत्पादनशील उपयोग' },
    ],
    intro: {
      en: 'Foreign labour migration is no longer a coping strategy of a few households but a structural feature of the Nepali economy and family. Remittance sustains consumption across most of the country, while the absence of the working-age member reorganises the household that receives it. Any policy judgement therefore has to weigh a real income gain against a real social cost, rather than treating migration as simply good or bad.',
      ne: 'वैदेशिक रोजगारी अब केही घरपरिवारको बाध्यता मात्र नभई नेपाली अर्थतन्त्र र परिवारको संरचनागत विशेषता बनेको छ। विप्रेषणले देशभरका उपभोगलाई टेवा दिइरहेको छ, तर कामकाजी उमेरका सदस्यको अनुपस्थितिले त्यो रकम पाउने घरपरिवारको संरचना बदलिदिन्छ। त्यसैले नीतिगत निष्कर्ष निकाल्दा वास्तविक आय लाभ र वास्तविक सामाजिक लागत दुवैको तुलना गर्नुपर्छ, आप्रवासनलाई राम्रो वा नराम्रो मात्र भन्न मिल्दैन।',
    },
    parts: [
      {
        heading: { en: 'Benefits actually observed', ne: 'देखिएका वास्तविक लाभ' },
        points: [
          { en: 'Remittance is the largest source of foreign exchange, financing imports and holding up the balance of payments.', ne: 'विप्रेषण विदेशी मुद्राको सबैभन्दा ठूलो स्रोत हो, जसले आयात धान्ने र शोधनान्तर स्थिति कायम राख्ने काम गर्छ।' },
          { en: 'Household level: absolute poverty has fallen sharply over the remittance decades, and school enrolment and health spending rise in receiving households.', ne: 'घरपरिवार स्तर: विप्रेषणको दशकमा निरपेक्ष गरिबी उल्लेख्य रूपमा घटेको र विप्रेषण पाउने घरपरिवारमा विद्यालय भर्ना तथा स्वास्थ्य खर्च बढेको।' },
          { en: 'Returnees bring skills, work discipline and small capital, which show up in trades such as construction, hospitality and transport.', ne: 'फर्किएकाहरूले सीप, कामप्रतिको अनुशासन र सानो पुँजी ल्याउँछन्, जो निर्माण, आतिथ्य र यातायात जस्ता व्यवसायमा देखिन्छ।' },
          { en: 'It absorbs an unemployment the domestic economy has not been able to, which is why restricting migration without creating work would shift the cost onto the poorest.', ne: 'यसले आन्तरिक अर्थतन्त्रले सोहोर्न नसकेको बेरोजगारी सोहोरेको छ, यसैले रोजगारी सिर्जना नगरी आप्रवासन रोक्दा त्यसको भार सबैभन्दा गरिबमा पर्छ।' },
        ],
      },
      {
        heading: { en: 'Social consequences', ne: 'सामाजिक परिणाम' },
        points: [
          { en: 'Split families: long separation strains marriages, and children grow up with one parent or with grandparents, which shows in schooling and in mental health.', ne: 'विभाजित परिवार: लामो छुट्टिनुले दाम्पत्य सम्बन्धमा तनाव ल्याउने र बालबालिका एक अभिभावक वा हजुरबा–हजुरआमासँग हुर्किने, जसको असर पढाई र मानसिक स्वास्थ्यमा देखिने।' },
          { en: 'A care deficit at both ends of life — the elderly left without their adult children, and young children without daily parenting.', ne: 'जीवनको दुवै छेउमा स्याहारको अभाव — ज्येष्ठ नागरिक आफ्ना वयस्क सन्तानविना र साना बालबालिका दैनिक अभिभावकत्वविना।' },
          { en: 'Feminisation of agriculture and of household decision making: women take on farm work and negotiation with the State, which brings both burden and agency.', ne: 'कृषि र घरायसी निर्णयको महिलाकरण: महिलाले खेतीपाती र राज्यसँगको संवाद सम्हाल्ने, जसले भार र सशक्तीकरण दुवै ल्याउँछ।' },
          { en: 'Labour shortage and land left fallow in the hills, alongside rising wage rates in the villages the migrants left.', ne: 'पहाडमा श्रमको अभाव र बाँझो जमिन, सँगसँगै आप्रवासी गएका गाउँमा ज्यालादरमा वृद्धि।' },
          { en: 'Social cost of the journey itself: recruitment debt, contract substitution on arrival, occupational injury, and deaths repatriated each year.', ne: 'यात्रा आफैंको सामाजिक लागत: भर्नाको ऋण, गन्तव्यमा पुगेपछि सम्झौता फेरबदल, कामको सिलसिलामा चोटपटक, र वर्षेनि फर्काइने शव।' },
          { en: 'Consumption rather than investment: much of the inflow goes to daily needs, loan repayment, land and housing, so it raises living standards without building productive capacity.', ne: 'लगानी नभई उपभोग: भित्रिने रकमको ठूलो हिस्सा दैनिक आवश्यकता, ऋण भुक्तानी, जग्गा र घरमा जाने हुँदा जीवनस्तर बढ्ने तर उत्पादनशील क्षमता नबन्ने।' },
        ],
      },
      {
        heading: { en: 'What the State has already done', ne: 'राज्यले गरिसकेका काम' },
        points: [
          { en: 'The Foreign Employment Act 2064 and its Rules license recruitment agencies, cap service charges and require a contract approved before departure.', ne: 'वैदेशिक रोजगार ऐन, २०६४ र नियमावलीले भर्ना गर्ने संस्थालाई इजाजत दिने, सेवा शुल्कको सीमा तोक्ने र प्रस्थानअघि स्वीकृत सम्झौता अनिवार्य गर्ने व्यवस्था गरेको।' },
          { en: 'The Foreign Employment Board runs the welfare fund that meets repatriation, treatment and compensation from the contribution each worker makes.', ne: 'वैदेशिक रोजगार बोर्डले प्रत्येक कामदारको योगदानबाट उठेको कल्याणकारी कोषमार्फत शव ढुवानी, उपचार र क्षतिपूर्ति व्यवस्था गर्छ।' },
          { en: 'The free-visa free-ticket decision shifts the cost of visa and air ticket to the employer for major destinations.', ne: 'निःशुल्क भिसा–निःशुल्क टिकटको निर्णयले प्रमुख गन्तव्यका लागि भिसा र हवाई टिकटको लागत रोजगारदातामा सारेको।' },
          { en: 'Bilateral labour agreements and memoranda with destination countries set minimum wage and conditions; pre-departure orientation and skills testing are mandatory.', ne: 'गन्तव्य मुलुकसँगका द्विपक्षीय श्रम सम्झौता र समझदारीले न्यूनतम ज्याला र सेवा सुविधा तोक्छन्; प्रस्थानपूर्व अभिमुखीकरण र सीप परीक्षण अनिवार्य छ।' },
          { en: 'Article 33 makes employment a fundamental right and Article 51 directs the State to regulate foreign employment and make it safe and dignified.', ne: 'धारा ३३ ले रोजगारीलाई मौलिक हक बनाएको र धारा ५१ ले राज्यलाई वैदेशिक रोजगारीको नियमन गरी सुरक्षित तथा मर्यादित बनाउन निर्देश गरेको।' },
        ],
      },
      {
        heading: { en: 'Measures to reduce the cost', ne: 'लागत घटाउने उपाय' },
        points: [
          { en: 'Enforce the recruitment cost ceiling where it is broken — publish the licensed rate, prosecute overcharging, and settle claims through the welfare fund within a fixed time.', ne: 'भर्ना लागतको सीमा उल्लङ्घन हुने ठाउँमा कार्यान्वयन गर्ने — इजाजतप्राप्त दर सार्वजनिक गर्ने, बढी शुल्क लिनेमाथि कारबाही गर्ने, र कल्याणकारी कोषबाट दाबी तोकिएको समयभित्र फर्स्योट गर्ने।' },
          { en: 'Certify skills before departure so a worker enters at a skilled wage rather than as unskilled labour, and recognise the skills of returnees so they count at home.', ne: 'प्रस्थानअघि सीप प्रमाणीकरण गर्ने, जसले कामदारलाई अदक्ष नभई दक्ष ज्यालामा प्रवेश दिलाउँछ, र फर्केकाको सीपलाई स्वदेशमा मान्यता दिने।' },
          { en: 'Government-to-government recruitment for large destinations, which removes the layer where most of the debt is created.', ne: 'ठूला गन्तव्यका लागि सरकार–सरकार भर्ना, जसले ऋण सिर्जना हुने मुख्य तह हटाउँछ।' },
          { en: 'Reintegration: a single window for returnees covering skills recognition, enterprise credit and psychosocial support, delivered at the local level where they actually return to.', ne: 'पुनरेकीकरण: फर्केकाहरूका लागि सीप मान्यता, उद्यम कर्जा र मनोसामाजिक परामर्श समेटिएको एकद्वार सेवा, जो उनीहरू फर्किने स्थानीय तहमै उपलब्ध हुनुपर्ने।' },
          { en: 'Channel remittance into production: formalise transfer so it enters the banking system, and offer instruments that beat the return on land — savings bonds, cooperative equity, and credit tied to a returnee enterprise.', ne: 'विप्रेषणलाई उत्पादनमा लगाउने: औपचारिक माध्यमबाट बैङ्किङ प्रणालीमा भित्र्याउने र जग्गाको प्रतिफलभन्दा राम्रो साधन उपलब्ध गराउने — बचतपत्र, सहकारी सेयर, र फर्केकाको उद्यमसँग जोडिएको कर्जा।' },
          { en: 'Support the family left behind: childcare and early education at the local level, elderly day care, and school counselling, since the social cost falls on people who never migrated.', ne: 'पछाडि रहेको परिवारलाई सहयोग: स्थानीय तहमा बालस्याहार र प्रारम्भिक शिक्षा, ज्येष्ठ नागरिक दिवा सेवा, र विद्यालयमा परामर्श, किनकि सामाजिक लागत आप्रवासन नगरेकाले भोग्छन्।' },
        ],
      },
    ],
    conclusion: {
      en: 'Migration cannot be reversed by restriction while the domestic economy creates too few jobs; the realistic objective is to make it cheaper, safer and more skilled at departure, and to make return worth something. The measure of success is not a fall in the number leaving but a fall in what each one pays to go and a rise in what they bring back.',
      ne: 'आन्तरिक अर्थतन्त्रले पर्याप्त रोजगारी सिर्जना नगरुन्जेल प्रतिबन्धले आप्रवासन रोक्न सकिँदैन; व्यावहारिक उद्देश्य प्रस्थानलाई सस्तो, सुरक्षित र दक्ष बनाउनु र फिर्तीलाई अर्थपूर्ण बनाउनु हो। सफलताको मापन बाहिरिनेको संख्या घट्नु होइन, प्रत्येकले जानका लागि तिर्ने रकम घट्नु र फर्कँदा ल्याउने कुरा बढ्नु हो।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 33, 34 and 51(i)', ne: 'नेपालको संविधान, धारा ३३, ३४ र ५१(झ)' },
      { en: 'Foreign Employment Act 2064 and Foreign Employment Rules 2064', ne: 'वैदेशिक रोजगार ऐन, २०६४ र वैदेशिक रोजगार नियमावली, २०६४' },
    ],
    freshnessNote: {
      en: 'Take the current remittance share of GDP, the number of labour approvals, and the poverty rate from the latest Economic Survey and the Nepal Living Standards / Census figures before quoting a number.',
      ne: 'विप्रेषणको कुल गार्हस्थ्य उत्पादनमा हिस्सा, श्रम स्वीकृतिको संख्या र गरिबीदरको चालू तथ्याङ्क पछिल्लो आर्थिक सर्वेक्षण र जीवनस्तर सर्वेक्षण/जनगणनाबाट लिएर मात्र उद्धृत गर्नुहोस्।',
    },
  },
  {
    id: 'w-adhikrit-p3-b-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p3',
    sectionId: 'adhikrit-p3-b',
    subjectId: 'dev-economy',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Nepal’s capital expenditure is consistently under-spent and concentrated in the last quarter of the fiscal year. Examine the causes and recommend corrective measures.',
      ne: 'नेपालको पुँजीगत खर्च निरन्तर लक्ष्यभन्दा कम र आर्थिक वर्षको अन्तिम त्रैमासिकमा केन्द्रित हुने गरेको छ। यसका कारणको परीक्षण गर्दै सुधारका उपाय सिफारिस गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Symptom: low absorption of the capital budget, with a surge of spending in Asar', ne: 'लक्षण: पुँजीगत बजेटको न्यून उपयोग, असारमा खर्चको उछाल' },
      { en: 'Cause 1 — project readiness: allocation before survey, design, land and environmental clearance', ne: 'कारण १ — आयोजना तयारी: सर्वेक्षण, डिजाइन, जग्गा र वातावरणीय स्वीकृतिअघि विनियोजन' },
      { en: 'Cause 2 — procurement cycle: late tendering, disputes, contractor capacity', ne: 'कारण २ — खरिद चक्र: ढिलो बोलपत्र, विवाद, निर्माण व्यवसायीको क्षमता' },
      { en: 'Cause 3 — fragmentation: too many small projects, thinly spread', ne: 'कारण ३ — विखण्डन: धेरै साना आयोजना, पातलो वितरण' },
      { en: 'Cause 4 — institutional: transfers of project chiefs, weak authority, coordination across three tiers', ne: 'कारण ४ — संस्थागत: आयोजना प्रमुखको सरुवा, कमजोर अधिकार, तीन तहबीच समन्वय' },
      { en: 'Legal levers: Financial Procedure and Fiscal Responsibility Act 2076, project bank, Public Procurement Act 2063, MTEF', ne: 'कानुनी आधार: आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६, आयोजना बैङ्क, सार्वजनिक खरिद ऐन, २०६३, मध्यमकालीन खर्च संरचना' },
      { en: 'Consequence: poor quality of hurried work, arrears, and a development gap despite an allocated budget', ne: 'परिणाम: हतारमा भएको कामको न्यून गुणस्तर, बेरुजु, र बजेट विनियोजन भएर पनि विकासमा अन्तर' },
    ],
    intro: {
      en: 'Under-spending of the capital budget is not a shortage of money but a failure to convert an appropriation into an asset. The pattern is familiar: a slow first half, a rush in Asar, and work certified in haste at the year’s end. Because capital spending is what builds the road, the school and the irrigation canal, the loss is not accounting but developmental.',
      ne: 'पुँजीगत बजेटको न्यून खर्च रकमको अभाव होइन, विनियोजनलाई सम्पत्तिमा रूपान्तरण गर्न नसकेको अवस्था हो। ढाँचा परिचित छ: पहिलो अर्धवार्षिक सुस्त, असारमा हतार, र वर्षान्तमा हतारमा प्रमाणित काम। पुँजीगत खर्चले सडक, विद्यालय र सिँचाइ नहर बनाउने हुँदा यो नोक्सान लेखाको नभई विकासको हुन्छ।',
    },
    parts: [
      {
        heading: { en: 'Project readiness', ne: 'आयोजनाको तयारी' },
        points: [
          { en: 'Budget is still allocated to projects that have no completed survey, detailed design, cost estimate or land acquisition, so the first months go on preparation that should have preceded the allocation.', ne: 'सर्वेक्षण, विस्तृत डिजाइन, लागत अनुमान वा जग्गा प्राप्ति पुरा नभएका आयोजनामा अझै बजेट विनियोजन हुने हुँदा विनियोजनअघि सकिनुपर्ने तयारीमा सुरुका महिना बित्छन्।' },
          { en: 'The Financial Procedure and Fiscal Responsibility Act 2076 requires appraisal and entry in the project bank before allocation; compliance is uneven, and the exception has become common.', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ ले विनियोजनअघि मूल्याङ्कन र आयोजना बैङ्कमा प्रवेश अनिवार्य गरेको; पालना असमान छ र अपवाद सामान्य बनेको छ।' },
          { en: 'Environmental clearance, forest land approval and utility shifting run in sequence rather than in parallel, adding seasons rather than weeks.', ne: 'वातावरणीय स्वीकृति, वन क्षेत्रको स्वीकृति र सेवा संरचना स्थानान्तरण समानान्तर नभई क्रमैसँग चल्ने हुँदा हप्ता नभई मौसम थपिन्छ।' },
        ],
      },
      {
        heading: { en: 'Procurement and contract management', ne: 'खरिद र ठेक्का व्यवस्थापन' },
        points: [
          { en: 'Tendering often begins after the budget is released rather than before the fiscal year starts, although advance procurement action is permitted.', ne: 'अग्रिम खरिद कारबाहीको अनुमति भए पनि बोलपत्र प्रक्रिया आर्थिक वर्ष सुरु हुनुअघि नभई बजेट निकासा भएपछि सुरु हुने।' },
          { en: 'Complaint, review and litigation stall award; variation orders and time extensions are then negotiated under pressure at year end.', ne: 'उजुरी, पुनरावलोकन र मुद्दाले ठेक्का स्वीकृतिमा अवरोध ल्याउने; त्यसपछि वर्षान्तको दबाबमा परिमाण परिवर्तन र म्याद थपको सम्झौता हुने।' },
          { en: 'Contractor capacity is spread thin: the same firms hold many contracts, and mobilisation follows the money rather than the schedule.', ne: 'निर्माण व्यवसायीको क्षमता पातलो हुने: एउटै फर्मले धेरै ठेक्का लिने र परिचालन कार्यतालिका नभई रकम पछ्याउने।' },
          { en: 'Payment against physical progress is verified late, so the bill and the work both arrive in the final weeks.', ne: 'भौतिक प्रगतिको आधारमा भुक्तानीको जाँच ढिलो हुने हुँदा बिल र काम दुवै अन्तिम हप्तामा आउने।' },
        ],
      },
      {
        heading: { en: 'Fragmentation and institutional weakness', ne: 'विखण्डन र संस्थागत कमजोरी' },
        points: [
          { en: 'The budget is spread across a very large number of small allocations, many too small to complete anything, which suits distribution but not construction.', ne: 'बजेट धेरै साना विनियोजनमा छरिने, जसमध्ये धेरै कुनै काम सम्पन्न गर्नै नसक्ने सानो आकारका हुन्छन् — यो वितरणका लागि उपयुक्त छ, निर्माणका लागि होइन।' },
          { en: 'Project chiefs are transferred within the year, so nobody carries a project from tender to completion or answers for its delay.', ne: 'आयोजना प्रमुखको वर्षभित्रै सरुवा हुने हुँदा कोही पनि आयोजनालाई बोलपत्रदेखि सम्पन्नसम्म लैजाने वा ढिलाइको जवाफ दिने रहँदैन।' },
          { en: 'Authority and money sit at different levels: a local level may own the road while the design capacity and the clearance sit federally.', ne: 'अधिकार र रकम भिन्न तहमा रहने: सडक स्थानीय तहको हुने तर डिजाइन क्षमता र स्वीकृति सङ्घमा रहने।' },
          { en: 'Weak monitoring: progress is reported as financial spend, which rewards paying out rather than building.', ne: 'कमजोर अनुगमन: प्रगति वित्तीय खर्चको रूपमा प्रतिवेदन हुने, जसले निर्माण नभई भुक्तानीलाई पुरस्कृत गर्छ।' },
        ],
      },
      {
        heading: { en: 'Corrective measures', ne: 'सुधारका उपाय' },
        points: [
          { en: 'No allocation without readiness: enforce the project bank rule strictly, so design, land and clearance precede the budget rather than follow it.', ne: 'तयारीविना विनियोजन नगर्ने: आयोजना बैङ्कको व्यवस्था कडाइका साथ लागू गरी डिजाइन, जग्गा र स्वीकृति बजेटपछि नभई अघि पुरा गर्ने।' },
          { en: 'Start procurement before the year does — use advance procurement so the contract is signed in Shrawan, not Chaitra.', ne: 'आर्थिक वर्ष सुरु हुनुअघि खरिद प्रक्रिया सुरु गर्ने — अग्रिम खरिद कारबाही प्रयोग गरी सम्झौता चैतमा नभई साउनमा गर्ने।' },
          { en: 'Consolidate: fewer, larger, multi-year projects with committed funding under the Medium Term Expenditure Framework, and a ceiling on the number of new starts.', ne: 'एकीकरण: मध्यमकालीन खर्च संरचनाअन्तर्गत प्रतिबद्ध स्रोतसहितका कम संख्याका, ठूला र बहुवर्षीय आयोजना, र नयाँ आयोजना सुरु गर्ने संख्यामा सीमा।' },
          { en: 'Fix a minimum tenure for a project chief and tie their performance evaluation to physical progress on that project.', ne: 'आयोजना प्रमुखको न्यूनतम कार्यकाल तोक्ने र उनको कार्यसम्पादन मूल्याङ्कन त्यही आयोजनाको भौतिक प्रगतिसँग जोड्ने।' },
          { en: 'Report and publish physical progress quarterly alongside financial progress, so a project that has paid out without building is visible.', ne: 'वित्तीय प्रगतिसँगै भौतिक प्रगति त्रैमासिक रूपमा प्रतिवेदन र प्रकाशन गर्ने, जसले काम नगरी भुक्तानी भएको आयोजना देखियोस्।' },
          { en: 'Discourage the Asar rush directly: require certification of work by an independent technical check before year-end payment, and carry unspent capital forward for a ready project rather than surrendering it.', ne: 'असारको हतारलाई सीधै निरुत्साहित गर्ने: वर्षान्त भुक्तानीअघि स्वतन्त्र प्राविधिक जाँचबाट कामको प्रमाणीकरण अनिवार्य गर्ने र खर्च नभएको पुँजीगत रकम फ्रिज नगरी तयार आयोजनामा जिम्मेवारी सारी लैजाने।' },
        ],
      },
    ],
    conclusion: {
      en: 'The binding constraint is readiness, not resources: a project that is designed, cleared and tendered before the year begins spends evenly and builds properly. Enforcing the project bank rule, starting procurement early and holding a project chief in place long enough to finish the work would do more than any increase in allocation.',
      ne: 'बाधक तत्त्व स्रोत नभई तयारी हो: वर्ष सुरु हुनुअघि डिजाइन, स्वीकृति र बोलपत्र सम्पन्न भएको आयोजनाले समान रूपमा खर्च गर्छ र गुणस्तरीय निर्माण गर्छ। आयोजना बैङ्कको व्यवस्था कार्यान्वयन गर्नु, खरिद प्रक्रिया चाँडो सुरु गर्नु र आयोजना प्रमुखलाई काम सक्नेसम्म एकै ठाउँमा राख्नुले विनियोजन बढाउनुभन्दा धेरै प्रतिफल दिनेछ।',
    },
    authorities: [
      { en: 'Financial Procedure and Fiscal Responsibility Act 2076', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६' },
      { en: 'Public Procurement Act 2063 and Public Procurement Regulations 2064', ne: 'सार्वजनिक खरिद ऐन, २०६३ र सार्वजनिक खरिद नियमावली, २०६४' },
    ],
    freshnessNote: {
      en: 'Capital expenditure as a percentage of the allocation, and the Asar share of it, must come from the current Economic Survey or the Comptroller General’s annual statement.',
      ne: 'विनियोजनको तुलनामा पुँजीगत खर्चको प्रतिशत र त्यसमा असारको हिस्सा चालू आर्थिक सर्वेक्षण वा महालेखा नियन्त्रक कार्यालयको वार्षिक विवरणबाट लिनुपर्छ।',
    },
  },
  {
    id: 'w-adhikrit-p3-c-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p3',
    sectionId: 'adhikrit-p3-c',
    subjectId: 'dev-economy',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Explain the role of federalism in Nepal’s development, and identify the problems of inter-governmental coordination with their solutions.',
      ne: 'नेपालको विकासमा सङ्घीयताको भूमिका व्याख्या गर्नुहोस् र अन्तर–सरकारी समन्वयका समस्या तथा त्यसका समाधान पहिचान गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Three tiers: federal, 7 provinces, 753 local levels; Article 56', ne: 'तीन तह: सङ्घ, ७ प्रदेश, ७५३ स्थानीय तह; धारा ५६' },
      { en: 'Schedules 5 to 9 divide exclusive and concurrent powers', ne: 'अनुसूची ५ देखि ९ ले एकल र साझा अधिकारको बाँडफाँट गर्छन्' },
      { en: 'Fiscal transfers: equalisation, conditional, complementary, special grants; Article 60', ne: 'वित्तीय हस्तान्तरण: समानीकरण, सशर्त, समपूरक, विशेष अनुदान; धारा ६०' },
      { en: 'National Natural Resources and Fiscal Commission (Article 250)', ne: 'राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोग (धारा २५०)' },
      { en: 'Coordination bodies: Inter-Provincial Council (Article 234), Inter-Governmental Fiscal Council, provincial coordination council', ne: 'समन्वय निकाय: अन्तरप्रदेश परिषद् (धारा २३४), अन्तर–सरकारी वित्त परिषद्, प्रदेश समन्वय परिषद्' },
      { en: 'Problems: overlapping concurrent lists, unfinished laws, staff adjustment, own-source revenue gap, capacity', ne: 'समस्या: साझा सूचीमा दोहोरोपन, अपूरा कानुन, कर्मचारी समायोजन, आन्तरिक राजस्वको अन्तर, क्षमता' },
      { en: 'Solutions: clarify functions by unbundling, complete framework laws, build local capacity, use the coordination councils', ne: 'समाधान: कार्य विस्तृतीकरणबाट स्पष्टता, आधारभूत कानुन पुरा गर्ने, स्थानीय क्षमता विकास, समन्वय परिषद्को प्रयोग' },
    ],
    intro: {
      en: 'Federalism in Nepal was adopted to bring the State closer to the citizen and to give historically excluded regions and groups a share of decision making. Under Article 56 the State exercises power at three levels, and Schedules 5 to 9 divide that power into exclusive and concurrent lists. Its developmental value lies in proximity; its developmental risk lies in coordination.',
      ne: 'नेपालमा सङ्घीयता राज्यलाई नागरिकको नजिक पुर्‍याउन र ऐतिहासिक रूपमा बहिष्कृत क्षेत्र तथा समुदायलाई निर्णय प्रक्रियामा हिस्सा दिलाउन अवलम्बन गरिएको हो। धारा ५६ अनुसार राज्यशक्तिको प्रयोग तीन तहबाट हुन्छ र अनुसूची ५ देखि ९ ले त्यो अधिकारलाई एकल र साझा सूचीमा बाँडेका छन्। यसको विकासजन्य मूल्य निकटतामा छ; विकासजन्य जोखिम समन्वयमा छ।',
    },
    parts: [
      {
        heading: { en: 'How federalism helps development', ne: 'सङ्घीयताले विकासमा गर्ने सहयोग' },
        points: [
          { en: 'Decisions are taken where the need is known: a local level can prioritise the trail, the tap and the health post better than a central ministry can.', ne: 'आवश्यकता थाहा भएको ठाउँमा निर्णय हुने: गोरेटो, धारा र स्वास्थ्य चौकीको प्राथमिकता केन्द्रीय मन्त्रालयभन्दा स्थानीय तहले राम्रो निर्धारण गर्न सक्छ।' },
          { en: 'Service delivery is closer: registration of births, deaths and land, basic health and basic education now sit at the local level under Schedule 8.', ne: 'सेवा प्रवाह नजिक: जन्म, मृत्यु र जग्गाको दर्ता, आधारभूत स्वास्थ्य र आधारभूत शिक्षा अनुसूची ८ अनुसार अब स्थानीय तहमा।' },
          { en: 'Inclusion is structural rather than promised: reserved seats, and local executives elected from the ward, put women and Dalit women in office in numbers no central quota achieved.', ne: 'समावेशिता प्रतिज्ञा नभई संरचनागत: आरक्षित स्थान र वडाबाट निर्वाचित स्थानीय कार्यपालिकाले केन्द्रीय आरक्षणले नपुर्‍याएको संख्यामा महिला र दलित महिलालाई पदमा पुर्‍याएको।' },
          { en: 'Fiscal equalisation directs more per head to a poorer and more remote unit, through the Commission’s formula under Article 60.', ne: 'वित्तीय समानीकरणले धारा ६० अन्तर्गत आयोगको सूत्रमार्फत गरिब र दुर्गम इकाइमा प्रतिव्यक्ति बढी रकम पुर्‍याउँछ।' },
          { en: 'Competition and demonstration between units spreads a working practice faster than a circular does.', ne: 'इकाइबीचको प्रतिस्पर्धा र उदाहरणले परिपत्रभन्दा छिटो सफल अभ्यास फैलाउँछ।' },
        ],
      },
      {
        heading: { en: 'Problems of inter-governmental coordination', ne: 'अन्तर–सरकारी समन्वयका समस्या' },
        points: [
          { en: 'Overlap in the concurrent lists: Schedules 7 and 9 leave education, health, agriculture and disaster management shared, and without unbundled functions two tiers plan the same road.', ne: 'साझा सूचीमा दोहोरोपन: अनुसूची ७ र ९ ले शिक्षा, स्वास्थ्य, कृषि र विपद् व्यवस्थापनलाई साझा राखेका छन्, र कार्य विस्तृतीकरणविना दुई तहले एउटै सडकको योजना बनाउँछन्।' },
          { en: 'Framework laws that the concurrent list depends on came late or are still awaited, so provinces legislate into uncertainty.', ne: 'साझा सूची निर्भर रहने आधारभूत कानुन ढिलो आए वा अझै प्रतीक्षामा छन्, फलस्वरूप प्रदेशले अनिश्चयमा कानुन बनाउनुपर्छ।' },
          { en: 'Staff adjustment left many local levels short of technical staff — engineers, accountants, health workers — so authority exists without the hands to use it.', ne: 'कर्मचारी समायोजनपछि धेरै स्थानीय तहमा प्राविधिक कर्मचारी — इन्जिनियर, लेखापाल, स्वास्थ्यकर्मी — अभाव रह्यो, अधिकार भए पनि प्रयोग गर्ने हात भएन।' },
          { en: 'Own-source revenue is small and unevenly distributed, so most units depend on transfers and on conditional grants that reduce their discretion.', ne: 'आन्तरिक राजस्व सानो र असमान वितरणमा भएकाले धेरै इकाइ हस्तान्तरण र स्वविवेक घटाउने सशर्त अनुदानमा निर्भर छन्।' },
          { en: 'Duplication of tax and fee at different tiers raises the cost to a business and invites dispute.', ne: 'भिन्न तहमा कर र शुल्कको दोहोरोपनले व्यवसायको लागत बढाउने र विवाद निम्त्याउने।' },
          { en: 'Coordination bodies meet irregularly, and disputes end up before the Supreme Court rather than being settled politically.', ne: 'समन्वय निकायको बैठक अनियमित हुने र विवाद राजनीतिक रूपमा समाधान नभई सर्वोच्च अदालतसमक्ष पुग्ने।' },
        ],
      },
      {
        heading: { en: 'Solutions', ne: 'समाधान' },
        points: [
          { en: 'Unbundle the concurrent lists into named functions at each tier, publish the result, and make a budget line follow the function rather than the tier that asks for it.', ne: 'साझा सूचीलाई प्रत्येक तहमा तोकिएका कार्यमा विस्तृतीकरण गर्ने, त्यसलाई सार्वजनिक गर्ने, र बजेट शीर्षक माग गर्ने तहको नभई कार्यको पछि लाग्ने बनाउने।' },
          { en: 'Complete the federal framework laws that the concurrent list waits on, so provincial and local legislation has something to sit under.', ne: 'साझा सूची प्रतीक्षा गरिरहेका सङ्घीय आधारभूत कानुन पुरा गर्ने, जसले प्रदेश र स्थानीय कानुनलाई आधार दिन्छ।' },
          { en: 'Use the Inter-Provincial Council under Article 234 and the Inter-Governmental Fiscal Council on a fixed calendar, with published minutes, so coordination is a routine rather than a crisis response.', ne: 'धारा २३४ को अन्तरप्रदेश परिषद् र अन्तर–सरकारी वित्त परिषद्लाई निर्धारित पात्रोअनुसार, निर्णय सार्वजनिक गर्दै चलाउने, जसले समन्वयलाई सङ्कटको प्रतिक्रिया नभई नियमित कार्य बनाउँछ।' },
          { en: 'Build local capacity deliberately: a shared technical pool at the district or provincial level that small units can draw on, and a provincial training institute for accounting, procurement and engineering.', ne: 'स्थानीय क्षमता सचेत रूपमा विकास गर्ने: साना इकाइले उपयोग गर्न सक्ने जिल्ला वा प्रदेश स्तरको साझा प्राविधिक समूह, र लेखा, खरिद तथा इन्जिनियरिङका लागि प्रादेशिक तालिम प्रतिष्ठान।' },
          { en: 'Widen own-source revenue where it belongs — property tax on a proper valuation roll at the local level — and reduce conditional grants as capacity grows.', ne: 'आन्तरिक राजस्वको दायरा उपयुक्त ठाउँमा फराकिलो बनाउने — स्थानीय तहमा उचित मूल्याङ्कन अभिलेखमा आधारित सम्पत्ति कर — र क्षमता बढ्दै जाँदा सशर्त अनुदान घटाउने।' },
          { en: 'Publish a single fiscal and physical report per tier on a common format, so overlap is visible before the money is spent rather than after audit.', ne: 'प्रत्येक तहको एक साझा ढाँचामा वित्तीय र भौतिक प्रतिवेदन प्रकाशन गर्ने, जसले दोहोरोपन लेखापरीक्षणपछि नभई खर्च हुनुअघि देखिन्छ।' },
        ],
      },
    ],
    conclusion: {
      en: 'Federalism has already moved services and representation closer to the citizen; what it has not yet done is settle who does what where the Constitution left the function shared. Unbundling those functions, completing the framework laws and putting technical capacity within reach of a small local level are the three steps that would turn constitutional design into delivered development.',
      ne: 'सङ्घीयताले सेवा र प्रतिनिधित्व नागरिकको नजिक पुर्‍याइसकेको छ; संविधानले साझा छोडेका कार्यमा कसले के गर्ने भन्ने टुङ्गो लगाउन बाँकी छ। त्यस्ता कार्यको विस्तृतीकरण, आधारभूत कानुनको पूर्णता र सानो स्थानीय तहको पहुँचमा प्राविधिक क्षमता पुर्‍याउनु — यी तीन कदमले संवैधानिक संरचनालाई प्राप्त विकासमा रूपान्तरण गर्नेछन्।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 56, 57, 60, 234 and 250; Schedules 5–9', ne: 'नेपालको संविधान, धारा ५६, ५७, ६०, २३४ र २५०; अनुसूची ५–९' },
      { en: 'Local Government Operation Act 2074', ne: 'स्थानीय सरकार सञ्चालन ऐन, २०७४' },
      { en: 'Inter-Governmental Fiscal Arrangement Act 2074', ne: 'अन्तर–सरकारी वित्त व्यवस्थापन ऐन, २०७४' },
    ],
  },
  {
    id: 'w-adhikrit-p3-d-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p3',
    sectionId: 'adhikrit-p3-d',
    subjectId: 'dev-economy',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Nepal is highly vulnerable to climate change. Describe its principal impacts on Nepal and evaluate the adequacy of the country’s adaptation and mitigation response.',
      ne: 'नेपाल जलवायु परिवर्तनप्रति अत्यधिक संवेदनशील छ। नेपालमा यसका प्रमुख प्रभावको वर्णन गर्दै देशको अनुकूलन तथा न्यूनीकरण प्रतिकार्यको पर्याप्तताको मूल्याङ्कन गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Nepal contributes a negligible share of global emissions but ranks among the most vulnerable countries', ne: 'नेपालको विश्वव्यापी उत्सर्जनमा हिस्सा नगण्य छ तर संवेदनशीलताको दृष्टिले अग्रपङ्क्तिमा पर्छ' },
      { en: 'Impacts: glacier retreat and GLOF risk, erratic monsoon, drying springs, landslides and floods, shifting agro-ecological belts, vector-borne disease moving uphill', ne: 'प्रभाव: हिमनदी पछि हट्ने र हिमताल विस्फोटको जोखिम, अनियमित मनसुन, मुहान सुक्ने, पहिरो र बाढी, कृषि–पारिस्थितिक क्षेत्र सर्ने, किटजन्य रोग उच्च भूभागमा फैलिने' },
      { en: 'Constitutional basis: Article 30 right to a clean environment, with compensation for the victim of pollution', ne: 'संवैधानिक आधार: धारा ३० स्वच्छ वातावरणको हक, प्रदूषणपीडितलाई क्षतिपूर्तिसहित' },
      { en: 'Policy: Environment Protection Act 2076, National Climate Change Policy 2076, NDC, NAP, LAPA', ne: 'नीति: वातावरण संरक्षण ऐन, २०७६, राष्ट्रिय जलवायु परिवर्तन नीति, २०७६, राष्ट्रिय निर्धारित योगदान, राष्ट्रिय अनुकूलन योजना, स्थानीय अनुकूलन कार्ययोजना' },
      { en: 'Commitments: net zero by 2045, share of renewable energy, forest cover maintained above 45 per cent', ne: 'प्रतिबद्धता: २०४५ सम्म खुद शून्य उत्सर्जन, नवीकरणीय ऊर्जाको हिस्सा, वन क्षेत्र ४५ प्रतिशतभन्दा माथि कायम' },
      { en: 'Strengths: community forestry, hydro-based electricity, disaster authority and local adaptation planning', ne: 'सबल पक्ष: सामुदायिक वन, जलविद्युतमा आधारित विद्युत्, विपद् प्राधिकरण र स्थानीय अनुकूलन योजना' },
      { en: 'Gaps: finance, local capacity, data and early warning, transport emissions, implementation of EIA conditions', ne: 'कमजोरी: वित्त, स्थानीय क्षमता, तथ्याङ्क र पूर्वसूचना, यातायातको उत्सर्जन, वातावरणीय प्रभाव मूल्याङ्कनका सर्तको कार्यान्वयन' },
    ],
    intro: {
      en: 'Nepal contributes a negligible share of global greenhouse gas emissions yet sits among the countries most exposed to their effects, because its hazards are concentrated in a young and steep mountain system and its population depends heavily on rain-fed agriculture. The policy question is therefore mostly one of adaptation, with mitigation pursued for its own co-benefits and for Nepal’s standing in climate negotiation.',
      ne: 'नेपालको विश्वव्यापी हरितगृह गियास उत्सर्जनमा हिस्सा नगण्य छ, तथापि त्यसको असरप्रति सर्वाधिक जोखिममा रहेका मुलुकमा पर्छ — किनभने यसका प्रकोप नवीन र भिरालो पर्वतीय प्रणालीमा केन्द्रित छन् र जनसंख्या आकाशे पानीमा निर्भर कृषिमा अत्यधिक आश्रित छ। त्यसैले नीतिगत प्रश्न मुख्यतः अनुकूलनको हो, र न्यूनीकरण यसका सहलाभ तथा जलवायु वार्तामा नेपालको हैसियतका लागि अगाडि बढाइन्छ।',
    },
    parts: [
      {
        heading: { en: 'Principal impacts', ne: 'प्रमुख प्रभाव' },
        points: [
          { en: 'Cryosphere: glaciers are retreating and glacial lakes expanding, raising the risk of glacial lake outburst floods on settlements and hydropower downstream.', ne: 'हिमक्षेत्र: हिमनदी पछि हट्दै र हिमताल फैलिँदै गएका छन्, जसले तल्लो तटीय बस्ती र जलविद्युतमा हिमताल विस्फोट बाढीको जोखिम बढाउँछ।' },
          { en: 'Water: springs and small streams in the mid-hills are drying or becoming seasonal, which is the most immediate water-security problem for hill settlements.', ne: 'पानी: मध्यपहाडका मुहान र साना खोला सुक्दै वा मौसमी बन्दै गएका छन्, जो पहाडी बस्तीको सबैभन्दा तत्कालको खानेपानी सुरक्षा समस्या हो।' },
          { en: 'Monsoon behaviour: the same annual total arriving in fewer, heavier events, which produces flood and landslide in the same season as drought.', ne: 'मनसुनको व्यवहार: वार्षिक कुल वर्षा उस्तै रहँदा पनि कम तर बढी तीव्रताका घटनामा खस्ने, जसले एउटै मौसममा बाढी–पहिरो र खडेरी दुवै ल्याउँछ।' },
          { en: 'Agriculture: agro-ecological belts shifting upslope, changed sowing dates, new pests, and loss of production in a sector that employs most of the workforce.', ne: 'कृषि: कृषि–पारिस्थितिक क्षेत्र उच्च भूभागतर्फ सर्दै, रोपाइँको समय बदलिँदै, नयाँ शत्रुजीव देखिँदै, र अधिकांश श्रमशक्ति संलग्न क्षेत्रमा उत्पादन ह्रास।' },
          { en: 'Health: dengue and other vector-borne diseases have appeared at altitudes that were previously free of them, and heat stress is rising in the Tarai.', ne: 'स्वास्थ्य: डेङ्गुसहित किटजन्य रोग पहिले नदेखिने उचाइमा देखा परेका र तराईमा गर्मीजन्य तनाव बढ्दै।' },
          { en: 'Distribution of the burden: the loss falls hardest on subsistence farmers, on women who manage water and fodder, and on remote districts with the least fiscal capacity.', ne: 'भारको वितरण: नोक्सान निर्वाहमुखी किसान, पानी र घाँसपात व्यवस्थापन गर्ने महिला, र न्यूनतम वित्तीय क्षमता भएका दुर्गम जिल्लामा सबैभन्दा बढी पर्छ।' },
        ],
      },
      {
        heading: { en: 'Nepal’s response — what is in place', ne: 'नेपालको प्रतिकार्य — भएका व्यवस्था' },
        points: [
          { en: 'Article 30 makes a clean and healthy environment a fundamental right and entitles the victim of pollution to compensation from the polluter.', ne: 'धारा ३० ले स्वच्छ र स्वस्थ वातावरणलाई मौलिक हक बनाएको र प्रदूषणपीडितलाई प्रदूषकबाट क्षतिपूर्ति पाउने हक दिएको।' },
          { en: 'The Environment Protection Act 2076 requires brief environmental study, initial environmental examination or environmental impact assessment by the scale of the project, and creates a climate change fund.', ne: 'वातावरण संरक्षण ऐन, २०७६ ले आयोजनाको आकारअनुसार संक्षिप्त वातावरणीय अध्ययन, प्रारम्भिक वातावरणीय परीक्षण वा वातावरणीय प्रभाव मूल्याङ्कन अनिवार्य गरेको र जलवायु परिवर्तन कोषको व्यवस्था गरेको।' },
          { en: 'The National Climate Change Policy 2076 and the National Adaptation Plan set the framework; Local Adaptation Plans of Action put it at ward and municipal level.', ne: 'राष्ट्रिय जलवायु परिवर्तन नीति, २०७६ र राष्ट्रिय अनुकूलन योजनाले संरचना तय गर्छन्; स्थानीय अनुकूलन कार्ययोजनाले त्यसलाई वडा र नगर तहमा पुर्‍याउँछ।' },
          { en: 'Nepal’s Nationally Determined Contribution and its long-term strategy commit to net zero by 2045, a large renewable share of energy, and forest cover held above forty-five per cent.', ne: 'नेपालको राष्ट्रिय निर्धारित योगदान र दीर्घकालीन रणनीतिले २०४५ सम्म खुद शून्य उत्सर्जन, ऊर्जामा नवीकरणीयको ठूलो हिस्सा र वन क्षेत्र पैंतालीस प्रतिशतभन्दा माथि कायम राख्ने प्रतिबद्धता जनाएका छन्।' },
          { en: 'Community forestry is a genuine Nepali success: user groups have restored hill forest at scale, which is simultaneously a carbon sink, a landslide control and a livelihood.', ne: 'सामुदायिक वन नेपालको वास्तविक सफलता हो: उपभोक्ता समूहले ठूलो परिमाणमा पहाडी वन पुनर्स्थापित गरेका छन्, जो एकैसाथ कार्बन सञ्चिति, पहिरो नियन्त्रण र जीविकोपार्जन हो।' },
          { en: 'Electricity is overwhelmingly hydro, and the Disaster Risk Reduction and Management Act 2074 with the National Disaster Authority provides the response machinery.', ne: 'विद्युत् मुख्यतः जलविद्युतमा आधारित छ, र विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन, २०७४ तथा राष्ट्रिय विपद् प्राधिकरणले प्रतिकार्यको संरचना दिएका छन्।' },
        ],
      },
      {
        heading: { en: 'Evaluation — where the response falls short', ne: 'मूल्याङ्कन — प्रतिकार्य कमजोर रहेका पक्ष' },
        points: [
          { en: 'Finance: adaptation needs far exceed domestic allocation, and access to international climate finance is slow because proposals need technical preparation Nepal is short of.', ne: 'वित्त: अनुकूलनको आवश्यकता आन्तरिक विनियोजनभन्दा निकै धेरै छ, र प्रस्ताव तयारीको प्राविधिक क्षमता अपर्याप्त भएकाले अन्तर्राष्ट्रिय जलवायु वित्तमा पहुँच सुस्त छ।' },
          { en: 'Local capacity: a local level holds the adaptation mandate but often has no environment or disaster technical officer, so a plan is written and not implemented.', ne: 'स्थानीय क्षमता: अनुकूलनको जिम्मेवारी स्थानीय तहमा भए पनि प्रायः वातावरण वा विपद् प्राविधिक कर्मचारी नहुने हुँदा योजना लेखिन्छ, कार्यान्वयन हुँदैन।' },
          { en: 'Data and early warning: hydro-meteorological station density is thin in the high mountains, so the warning lead time for a flood is shorter than it needs to be.', ne: 'तथ्याङ्क र पूर्वसूचना: उच्च हिमाली भेगमा जलमौसमी केन्द्रको घनत्व पातलो भएकाले बाढीको पूर्वसूचनाको समय आवश्यकभन्दा छोटो हुन्छ।' },
          { en: 'EIA quality and enforcement: assessments are often prepared to clear a project rather than to shape it, and the conditions attached are rarely monitored after approval.', ne: 'वातावरणीय प्रभाव मूल्याङ्कनको गुणस्तर र कार्यान्वयन: मूल्याङ्कन आयोजनालाई आकार दिनका लागि नभई स्वीकृति दिलाउनका लागि तयार हुने र स्वीकृतिपछि राखिएका सर्तको अनुगमन विरलै हुने।' },
          { en: 'Mitigation is weakest in transport and in cooking fuel, where imported petroleum still dominates despite an electricity surplus in the wet season.', ne: 'न्यूनीकरण यातायात र खाना पकाउने इन्धनमा सबैभन्दा कमजोर छ, जहाँ वर्षायाममा विद्युत् बचत भए पनि आयातित पेट्रोलियमको प्रभुत्व कायम छ।' },
          { en: 'Loss and damage: there is no domestic mechanism that compensates a household whose land is taken by a landslide, so the cost stays with the victim.', ne: 'क्षति र नोक्सानी: पहिरोले जमिन लिएको घरपरिवारलाई क्षतिपूर्ति दिने आन्तरिक प्रणाली नहुँदा भार पीडितमै रहन्छ।' },
        ],
      },
      {
        heading: { en: 'What would strengthen it', ne: 'सुदृढ बनाउने उपाय' },
        points: [
          { en: 'Put a technical officer for environment and disaster within reach of every local level, through a shared provincial pool if not one per unit.', ne: 'प्रत्येक स्थानीय तहको पहुँचमा वातावरण र विपद्का प्राविधिक कर्मचारी पुर्‍याउने — प्रत्येक इकाइमा सम्भव नभए प्रादेशिक साझा समूहमार्फत।' },
          { en: 'Build a project pipeline fit for international climate finance, so the constraint moves from proposal writing to implementation.', ne: 'अन्तर्राष्ट्रिय जलवायु वित्तका लागि उपयुक्त आयोजनाको शृंखला तयार गर्ने, जसले बाधक तत्त्वलाई प्रस्ताव लेखनबाट कार्यान्वयनमा सार्छ।' },
          { en: 'Expand the monitoring network and community early warning in the flood-prone river basins, where lead time saves lives cheaply.', ne: 'बाढी जोखिमयुक्त नदी बेसिनमा अनुगमन सञ्जाल र समुदायमा आधारित पूर्वसूचना विस्तार गर्ने, जहाँ पूर्वसूचनाको समयले सस्तोमा ज्यान बचाउँछ।' },
          { en: 'Electrify cooking and public transport to convert the hydro surplus into an emission reduction and an import saving at once.', ne: 'खाना पकाउने र सार्वजनिक यातायातको विद्युतीकरण गर्ने, जसले जलविद्युत्को बचतलाई एकैसाथ उत्सर्जन कटौती र आयात बचतमा बदल्छ।' },
          { en: 'Make EIA conditions enforceable: name the monitoring authority, publish compliance, and tie the release of the next instalment to it.', ne: 'वातावरणीय प्रभाव मूल्याङ्कनका सर्त कार्यान्वयनयोग्य बनाउने: अनुगमन निकाय तोक्ने, पालनाको विवरण सार्वजनिक गर्ने र अर्को किस्ता निकासा त्यसमा भर पार्ने।' },
          { en: 'Index-based crop and livestock insurance, and a resettlement fund for households displaced by landslide, so loss does not fall entirely on the poorest.', ne: 'सूचकाङ्कमा आधारित बाली तथा पशु बिमा, र पहिरोले विस्थापित घरपरिवारका लागि पुनर्वास कोष, जसले नोक्सान पूरै सबैभन्दा गरिबमा नपरोस्।' },
        ],
      },
    ],
    conclusion: {
      en: 'Nepal’s policy framework on climate change is reasonably complete and its community forestry record is genuinely strong, so the shortfall is not one of intent. It is finance, technical capacity at the tier that now holds the mandate, and enforcement of conditions already written — and since Nepal’s emissions are negligible, adaptation with a hard claim on international finance, not mitigation, is where the argument should be pressed.',
      ne: 'जलवायु परिवर्तनसम्बन्धी नेपालको नीतिगत संरचना उल्लेख्य रूपमा पूर्ण छ र सामुदायिक वनको उपलब्धि वास्तवमै सबल छ, त्यसैले कमजोरी नियतको होइन। कमजोरी वित्तको, अब जिम्मेवारी बोक्ने तहको प्राविधिक क्षमताको, र लेखिसकिएका सर्तको कार्यान्वयनको हो — र नेपालको उत्सर्जन नगण्य भएकाले बहस न्यूनीकरणमा नभई अन्तर्राष्ट्रिय वित्तमाथि दृढ दाबीसहितको अनुकूलनमा केन्द्रित हुनुपर्छ।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 30 and 51(g)', ne: 'नेपालको संविधान, धारा ३० र ५१(ग)' },
      { en: 'Environment Protection Act 2076', ne: 'वातावरण संरक्षण ऐन, २०७६' },
      { en: 'National Climate Change Policy 2076; Disaster Risk Reduction and Management Act 2074', ne: 'राष्ट्रिय जलवायु परिवर्तन नीति, २०७६; विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन, २०७४' },
    ],
  },
];
