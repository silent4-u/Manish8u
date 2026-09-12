import type { WrittenQuestion } from '../../types';

/**
 * Section Officer, Paper IV — Service Related Subject.
 *
 * The version set for the Administration and Federal Parliament Services. The
 * Audit Service sits a different Paper IV, and its sections carry their own
 * ids, so a question written for one never shows up under the other.
 */
export const OFFICER_PAPER_4: WrittenQuestion[] = [
  {
    id: 'w-adhikrit-p4-a-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p4',
    sectionId: 'adhikrit-p4-a',
    subjectId: 'office-mgmt',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'What is delegation of authority? State its principles, and explain why delegation fails in Nepalese public offices and how it can be made effective.',
      ne: 'अधिकार प्रत्यायोजन भन्नाले के बुझिन्छ? यसका सिद्धान्त उल्लेख गर्दै नेपालका सार्वजनिक कार्यालयमा प्रत्यायोजन असफल हुनुका कारण र प्रभावकारी बनाउने उपाय व्याख्या गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Definition: entrusting a subordinate with the authority to decide, while responsibility stays with the delegator', ne: 'परिभाषा: निर्णय गर्ने अधिकार अधीनस्थलाई सुम्पिनु, उत्तरदायित्व प्रत्यायोजकमै रहनु' },
      { en: 'Three elements: assignment of duty, grant of authority, creation of accountability', ne: 'तीन तत्त्व: कर्तव्यको जिम्मेवारी, अधिकारको प्रदान, उत्तरदायित्वको सिर्जना' },
      { en: 'Principles: parity of authority and responsibility, unity of command, scalar chain, exception, absoluteness of responsibility', ne: 'सिद्धान्त: अधिकार र उत्तरदायित्वको सन्तुलन, आदेशको एकता, सोपानक्रम, अपवाद, उत्तरदायित्वको निरपेक्षता' },
      { en: 'Legal basis: Good Governance Act 2064 requires delegation and reasoned decisions; Civil Service Act 2049 on duties', ne: 'कानुनी आधार: सुशासन ऐन, २०६४ ले प्रत्यायोजन र कारणसहितको निर्णय अनिवार्य गरेको; निजामती सेवा ऐन, २०४९ मा कर्तव्यसम्बन्धी व्यवस्था' },
      { en: 'Why it fails: centralising habit, fear of accountability, distrust of subordinate capacity, unclear financial limits', ne: 'असफलताका कारण: केन्द्रीकरणको बानी, उत्तरदायित्वको डर, अधीनस्थको क्षमतामाथि अविश्वास, वित्तीय सीमा अस्पष्ट' },
      { en: 'Effectiveness: written delegation order, clear financial ceiling, training, reporting, no upward referral of a delegated matter', ne: 'प्रभावकारिता: लिखित प्रत्यायोजन आदेश, स्पष्ट वित्तीय सीमा, तालिम, प्रतिवेदन, प्रत्यायोजित विषय माथि नपठाउने' },
    ],
    intro: {
      en: 'Delegation of authority is the act by which a superior entrusts a subordinate with the power to take a decision within a defined field, while retaining responsibility for the result. It is not an abdication: authority moves down, responsibility does not. Without it an organisation can grow no larger than the working day of the person at its head.',
      ne: 'अधिकार प्रत्यायोजन भन्नाले माथिल्लो पदाधिकारीले तोकिएको क्षेत्रभित्र निर्णय गर्ने अधिकार अधीनस्थलाई सुम्पिने कार्य बुझिन्छ, तर नतिजाको उत्तरदायित्व आफैंमा राख्छ। यो अधिकार त्याग होइन: अधिकार तल जान्छ, उत्तरदायित्व जाँदैन। यसविना सङ्गठन आफ्नो प्रमुखको कार्यदिनभन्दा ठूलो हुन सक्दैन।',
    },
    parts: [
      {
        heading: { en: 'Elements of delegation', ne: 'प्रत्यायोजनका तत्त्व' },
        points: [
          { en: 'Assignment of duty — the task is stated, not implied.', ne: 'कर्तव्यको जिम्मेवारी — कार्य स्पष्ट तोकिनु, अनुमानमा छोड्नु हुँदैन।' },
          { en: 'Grant of authority — the powers and the financial ceiling needed to perform it are given in writing.', ne: 'अधिकारको प्रदान — त्यो कार्य सम्पन्न गर्न आवश्यक अधिकार र वित्तीय सीमा लिखित रूपमा दिनु।' },
          { en: 'Creation of accountability — the subordinate answers to the delegator for how the authority was used.', ne: 'उत्तरदायित्वको सिर्जना — अधीनस्थले अधिकारको प्रयोगबारे प्रत्यायोजकप्रति जवाफ दिनु।' },
        ],
      },
      {
        heading: { en: 'Principles', ne: 'सिद्धान्त' },
        points: [
          { en: 'Parity of authority and responsibility — an officer held answerable for a result must hold the power to produce it.', ne: 'अधिकार र उत्तरदायित्वको सन्तुलन — नतिजाको जवाफ दिनुपर्ने कर्मचारीसँग त्यो नतिजा निकाल्ने अधिकार हुनुपर्छ।' },
          { en: 'Absoluteness of responsibility — responsibility cannot be delegated; the superior remains answerable.', ne: 'उत्तरदायित्वको निरपेक्षता — उत्तरदायित्व प्रत्यायोजन गर्न सकिँदैन; माथिल्लो पदाधिकारी जवाफदेही रहन्छ।' },
          { en: 'Unity of command — a subordinate receives delegation from, and reports to, one superior.', ne: 'आदेशको एकता — अधीनस्थले एक जना माथिल्लो पदाधिकारीबाट प्रत्यायोजन पाउने र उसैलाई प्रतिवेदन दिने।' },
          { en: 'Scalar chain — delegation follows the line of authority, so it is clear at every step who may decide what.', ne: 'सोपानक्रम — प्रत्यायोजन अधिकारको शृंखला अनुसरण गर्ने, जसले प्रत्येक तहमा कसले के निर्णय गर्न पाउँछ स्पष्ट पार्छ।' },
          { en: 'Principle of exception — routine matters are settled below; only the exceptional reaches the top.', ne: 'अपवादको सिद्धान्त — नियमित विषय तलै टुङ्गिने; असामान्य विषय मात्र माथि पुग्ने।' },
          { en: 'Limits by result, not by process — delegate the decision and check the outcome, rather than clearing each step.', ne: 'प्रक्रियाको नभई नतिजाको सीमा — प्रत्येक चरण स्वीकृत गर्नुभन्दा निर्णय प्रत्यायोजन गरी नतिजा जाँच्ने।' },
        ],
      },
      {
        heading: { en: 'Why delegation fails in Nepalese offices', ne: 'नेपालका कार्यालयमा प्रत्यायोजन असफल हुनुका कारण' },
        points: [
          { en: 'Authority is given without the financial ceiling to use it, so the file still travels up for money even when the decision is delegated.', ne: 'अधिकार दिँदा त्यसको प्रयोगका लागि वित्तीय सीमा नदिने हुँदा निर्णय प्रत्यायोजित भए पनि रकमका लागि फाइल माथि जान्छ।' },
          { en: 'Fear of accountability: with audit, the CIAA and the press all looking at the same decision, an officer prefers a superior’s signature over their own authority.', ne: 'उत्तरदायित्वको डर: लेखापरीक्षण, अख्तियार र सञ्चारमाध्यम सबै एउटै निर्णय हेरिरहेको अवस्थामा कर्मचारीलाई आफ्नो अधिकारभन्दा माथिल्लोको हस्ताक्षर सुरक्षित लाग्छ।' },
          { en: 'Distrust of subordinate capacity, often justified where staff have not been trained for the decision delegated to them.', ne: 'अधीनस्थको क्षमतामाथि अविश्वास, जो प्रत्यायोजित निर्णयका लागि कर्मचारीलाई तालिम दिइएको छैन भने प्रायः जायज पनि हुन्छ।' },
          { en: 'A centralising habit inherited from a unitary administration, where status was measured by the number of files one signed.', ne: 'एकात्मक प्रशासनबाट सरेको केन्द्रीकरणको बानी, जहाँ हैसियत हस्ताक्षर गर्ने फाइलको संख्याबाट मापन हुन्थ्यो।' },
          { en: 'Frequent transfer: a delegation order is personal in practice, and lapses when either officer moves.', ne: 'बारम्बार सरुवा: व्यवहारमा प्रत्यायोजन आदेश व्यक्तिकेन्द्रित हुने र दुईमध्ये कुनै कर्मचारी सरुवा हुँदा निष्क्रिय बन्ने।' },
          { en: 'No penalty for upward referral: nothing happens to an officer who sends up a matter that was theirs to decide, so the incentive runs one way.', ne: 'माथि पठाउने कार्यमा कुनै दायित्व नहुनु: आफैंले निर्णय गर्नुपर्ने विषय माथि पठाउने कर्मचारीलाई कुनै असर नपर्ने हुँदा प्रोत्साहन एकतर्फी हुन्छ।' },
        ],
      },
      {
        heading: { en: 'Making it effective', ne: 'प्रभावकारी बनाउने उपाय' },
        points: [
          { en: 'Delegate in writing by post rather than by person, so the order survives a transfer, and publish it inside the office.', ne: 'व्यक्तिको नाममा नभई पदको नाममा लिखित प्रत्यायोजन गर्ने, जसले सरुवा भएपछि पनि आदेश कायम रहन्छ, र त्यसलाई कार्यालयभित्र सार्वजनिक गर्ने।' },
          { en: 'Attach a financial ceiling and a time limit to every delegated function, as the Good Governance Act 2064 contemplates for each service.', ne: 'सुशासन ऐन, २०६४ ले प्रत्येक सेवाका लागि परिकल्पना गरेअनुसार प्रत्येक प्रत्यायोजित कार्यमा वित्तीय सीमा र समयसीमा तोक्ने।' },
          { en: 'Train before delegating: a short, specific orientation on the decision being handed down, not a general course.', ne: 'प्रत्यायोजनअघि तालिम: सामान्य पाठ्यक्रम नभई सुम्पिने निर्णयबारे छोटो र निश्चित अभिमुखीकरण।' },
          { en: 'Report by exception — a monthly return of decisions taken under delegation, with only the unusual escalated, which gives the superior control without taking the authority back.', ne: 'अपवादको आधारमा प्रतिवेदन — प्रत्यायोजनअन्तर्गत भएका निर्णयको मासिक विवरण, असामान्य विषय मात्र माथि पठाउने; यसले अधिकार फिर्ता नलिई माथिल्लो पदाधिकारीलाई नियन्त्रण दिन्छ।' },
          { en: 'Protect the honest decision: departmental action should follow bad faith or gross negligence, not an error of judgement made on record within delegated authority.', ne: 'इमानदार निर्णयको संरक्षण: विभागीय कारबाही खराब नियत वा घोर लापरवाहीमा हुनुपर्ने, प्रत्यायोजित अधिकारभित्र अभिलेखसहित गरिएको निर्णयको त्रुटिमा होइन।' },
          { en: 'Refuse the upward file: a matter that falls within a delegated power should be returned to the officer who holds it, and the citizen’s time limit should run against that officer.', ne: 'माथि आएको फाइल फिर्ता गर्ने: प्रत्यायोजित अधिकारभित्र पर्ने विषय त्यो अधिकार भएको कर्मचारीलाई फिर्ता पठाउने र सेवाग्राहीको समयसीमा उसैविरुद्ध गणना गर्ने।' },
        ],
      },
    ],
    conclusion: {
      en: 'Delegation fails in Nepal less from a defect in the rules than from the incentives around them: an officer who signs nothing is never blamed. Written delegation by post, with a financial ceiling, a time limit and protection for a good-faith decision, changes those incentives — and unless they change, a citizen’s file will keep travelling to a desk that did not need to see it.',
      ne: 'नेपालमा प्रत्यायोजन नियमको त्रुटिभन्दा त्यसवरिपरिका प्रोत्साहनका कारण असफल हुन्छ: कुनै हस्ताक्षर नगर्ने कर्मचारीलाई कहिल्यै दोष लाग्दैन। वित्तीय सीमा, समयसीमा र सद्भावपूर्ण निर्णयको संरक्षणसहित पदको नाममा गरिएको लिखित प्रत्यायोजनले त्यो प्रोत्साहन बदल्छ — र त्यो नबदलिएसम्म सेवाग्राहीको फाइल हेर्नै नपर्ने टेबलसम्म पुगिरहनेछ।',
    },
    authorities: [
      { en: 'Good Governance (Management and Operation) Act 2064', ne: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४' },
      { en: 'Civil Service Act 2049 and Civil Service Rules 2050', ne: 'निजामती सेवा ऐन, २०४९ र निजामती सेवा नियमावली, २०५०' },
    ],
  },
  {
    id: 'w-adhikrit-p4-b-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p4',
    sectionId: 'adhikrit-p4-b',
    subjectId: 'dev-economy',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Describe the structure of Nepal’s tax system, and suggest measures to widen the tax base and reduce revenue leakage.',
      ne: 'नेपालको कर प्रणालीको संरचनाको वर्णन गर्नुहोस् र करको दायरा विस्तार गर्ने तथा राजस्व चुहावट घटाउने उपाय सुझाउनुहोस्।',
    },
    keyPoints: [
      { en: 'Direct taxes: income tax on persons and entities; indirect: VAT, excise, customs', ne: 'प्रत्यक्ष कर: व्यक्ति र निकायमाथिको आयकर; अप्रत्यक्ष: मूल्य अभिवृद्धि कर, अन्तःशुल्क, भन्सार' },
      { en: 'Revenue assignment across tiers: Article 60 and Schedules 5, 6, 8 and 9', ne: 'तहगत राजस्व बाँडफाँट: धारा ६० र अनुसूची ५, ६, ८ तथा ९' },
      { en: 'Administration: Inland Revenue Department, Department of Customs, Revenue Tribunal', ne: 'प्रशासन: आन्तरिक राजस्व विभाग, भन्सार विभाग, राजस्व न्यायाधिकरण' },
      { en: 'Legal basis: Income Tax Act 2058, VAT Act 2052, Excise Act 2058, Customs Act 2064', ne: 'कानुनी आधार: आयकर ऐन, २०५८, मूल्य अभिवृद्धि कर ऐन, २०५२, अन्तःशुल्क ऐन, २०५८, भन्सार ऐन, २०६४' },
      { en: 'Problems: heavy dependence on import-based revenue, narrow income tax net, informal economy, under-invoicing', ne: 'समस्या: आयातमा आधारित राजस्वमा अत्यधिक निर्भरता, आयकरको साँघुरो दायरा, अनौपचारिक अर्थतन्त्र, न्यून बिजकीकरण' },
      { en: 'Measures: PAN coverage, digital payment trail, presumptive tax for small business, property valuation, transfer pricing rules', ne: 'उपाय: स्थायी लेखा नम्बरको विस्तार, विद्युतीय भुक्तानीको अभिलेख, साना व्यवसायमा अनुमानित कर, सम्पत्ति मूल्याङ्कन, हस्तान्तरण मूल्य नियम' },
    ],
    intro: {
      en: 'Nepal’s tax system rests on a conventional division between direct taxes, which fall on income and profit, and indirect taxes, which fall on transactions and imports. Its distinguishing feature is the weight of the indirect side: a large share of revenue is collected at the customs point, which makes the exchequer sensitive to the import bill and therefore to remittance.',
      ne: 'नेपालको कर प्रणाली आय र नाफामा लाग्ने प्रत्यक्ष कर तथा कारोबार र आयातमा लाग्ने अप्रत्यक्ष करबीचको परम्परागत विभाजनमा आधारित छ। यसको विशिष्ट पक्ष अप्रत्यक्ष तर्फको भार हो: राजस्वको ठूलो हिस्सा भन्सार विन्दुमा उठ्ने हुँदा राज्यकोष आयात र त्यसमार्फत विप्रेषणप्रति संवेदनशील बन्छ।',
    },
    parts: [
      {
        heading: { en: 'Structure by type of tax', ne: 'करको प्रकारअनुसार संरचना' },
        points: [
          { en: 'Income tax under the Income Tax Act 2058: on natural persons at slab rates, on entities at a flat rate with concessional rates for specified sectors, plus withholding at source.', ne: 'आयकर ऐन, २०५८ अन्तर्गतको आयकर: प्राकृतिक व्यक्तिमा दरबन्दीअनुसार, निकायमा एकल दरमा र तोकिएका क्षेत्रमा छुटको दरमा, तथा स्रोतमा कर कट्टीसहित।' },
          { en: 'Value added tax under the VAT Act 2052: a single rate on the value added at each stage, with credit for input tax, and a registration threshold below which a business may stay out.', ne: 'मूल्य अभिवृद्धि कर ऐन, २०५२ अन्तर्गतको कर: प्रत्येक चरणमा थपिएको मूल्यमा एकल दर, आगत करको कट्टी सुविधा, र दर्ता सीमा जसभन्दा तल व्यवसाय बाहिर रहन सक्ने।' },
          { en: 'Excise under the Excise Act 2058 on specified goods such as liquor, tobacco and vehicles, collected at production or import.', ne: 'अन्तःशुल्क ऐन, २०५८ अन्तर्गत मदिरा, सुर्तीजन्य पदार्थ र सवारी साधन जस्ता तोकिएका वस्तुमा उत्पादन वा आयात विन्दुमा उठ्ने अन्तःशुल्क।' },
          { en: 'Customs under the Customs Act 2064 on imports and exports, on a transaction value, classified under the harmonised system.', ne: 'भन्सार ऐन, २०६४ अन्तर्गत आयात–निर्यातमा, कारोबार मूल्यमा, समनुरूप प्रणालीअनुसार वर्गीकृत भन्सार महसुल।' },
          { en: 'Non-tax revenue: fees, charges, royalty, dividend and fines, which the same offices collect.', ne: 'गैरकर राजस्व: शुल्क, दस्तुर, रोयल्टी, लाभांश र जरिवाना, जो सोही कार्यालयले उठाउँछन्।' },
        ],
      },
      {
        heading: { en: 'Structure across the three tiers', ne: 'तीन तहमा संरचना' },
        points: [
          { en: 'The federation levies customs, excise, VAT and income tax under Schedule 5.', ne: 'अनुसूची ५ अनुसार सङ्घले भन्सार, अन्तःशुल्क, मूल्य अभिवृद्धि कर र आयकर लगाउँछ।' },
          { en: 'Provinces levy house and land registration fee, vehicle tax, entertainment tax, agricultural income tax and tourism fee under Schedule 6.', ne: 'अनुसूची ६ अनुसार प्रदेशले घरजग्गा रजिस्ट्रेशन शुल्क, सवारी साधन कर, मनोरञ्जन कर, कृषि आयमा कर र पर्यटन शुल्क लगाउँछन्।' },
          { en: 'Local levels levy property tax, house rent tax, business tax, land revenue and various service charges under Schedule 8.', ne: 'अनुसूची ८ अनुसार स्थानीय तहले सम्पत्ति कर, घरबहाल कर, व्यवसाय कर, मालपोत र विविध सेवा शुल्क लगाउँछन्।' },
          { en: 'Some bases are concurrent under Schedule 9, and divisible revenue is shared through the Federal Divisible Fund on the recommendation of the National Natural Resources and Fiscal Commission under Article 250.', ne: 'अनुसूची ९ अनुसार केही आधार साझा छन्, र बाँडफाँट हुने राजस्व धारा २५० अन्तर्गत राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोगको सिफारिसमा सङ्घीय विभाज्य कोषमार्फत बाँडिन्छ।' },
          { en: 'Administration sits with the Inland Revenue Department and the Department of Customs; a taxpayer aggrieved by an assessment appeals to the Revenue Tribunal.', ne: 'प्रशासन आन्तरिक राजस्व विभाग र भन्सार विभागमा रहेको; कर निर्धारणबाट चित्त नबुझेको करदाताले राजस्व न्यायाधिकरणमा पुनरावेदन गर्छ।' },
        ],
      },
      {
        heading: { en: 'Why the base is narrow and where revenue leaks', ne: 'दायरा साँघुरो हुनु र चुहावट हुने ठाउँ' },
        points: [
          { en: 'Dependence on import-based revenue means a fall in imports cuts revenue without any fall in expenditure obligation.', ne: 'आयातमा आधारित राजस्वको निर्भरताले आयात घट्दा खर्चको दायित्व नघटी राजस्व घट्छ।' },
          { en: 'A large informal economy: retail, transport, construction labour and rental income sit largely outside the net.', ne: 'ठूलो अनौपचारिक अर्थतन्त्र: खुद्रा व्यापार, यातायात, निर्माण श्रम र बहाल आय प्रायः दायराबाहिर।' },
          { en: 'Under-invoicing and mis-declaration at the customs point, and mis-classification into a lower duty heading.', ne: 'भन्सार विन्दुमा न्यून बिजकीकरण र झुटो घोषणा, तथा कम महसुल लाग्ने शीर्षकमा गलत वर्गीकरण।' },
          { en: 'VAT chain broken by unregistered intermediaries and by bill-less transaction, so input credit is claimed against purchases that were never taxed.', ne: 'दर्ता नभएका मध्यस्थ र बिलविनाको कारोबारले मूल्य अभिवृद्धि करको शृंखला टुटाउने, फलस्वरूप कर नतिरेको खरिदमा आगत कर कट्टी दाबी हुने।' },
          { en: 'Property transactions recorded below market value, which erodes registration fee, capital gains and local property tax at once.', ne: 'घरजग्गा कारोबार बजार मूल्यभन्दा कम देखाई अभिलेख हुने, जसले रजिस्ट्रेशन शुल्क, पुँजीगत लाभकर र स्थानीय सम्पत्ति कर एकैसाथ घटाउँछ।' },
          { en: 'Exemptions granted sector by sector accumulate into a large and rarely reviewed revenue forgone.', ne: 'क्षेत्रगत रूपमा दिइएका छुट थुप्रिँदै जाँदा ठूलो र विरलै पुनरावलोकन हुने राजस्व त्याग बन्छ।' },
        ],
      },
      {
        heading: { en: 'Measures to widen the base and stop leakage', ne: 'दायरा फराकिलो बनाउने र चुहावट रोक्ने उपाय' },
        points: [
          { en: 'Extend PAN and registration to every business premise, and link it to the electricity connection, the rental agreement and the bank account so registration is not voluntary in practice.', ne: 'प्रत्येक व्यवसाय स्थलमा स्थायी लेखा नम्बर र दर्ता विस्तार गर्ने, र त्यसलाई विद्युत् जडान, बहाल सम्झौता र बैङ्क खातासँग जोड्ने, जसले व्यवहारमा दर्ता स्वैच्छिक नरहोस्।' },
          { en: 'Push transactions onto a digital trail: mandatory electronic billing for businesses above a threshold, and incentives for digital payment, which makes the VAT chain self-documenting.', ne: 'कारोबारलाई विद्युतीय अभिलेखमा ल्याउने: तोकिएको सीमाभन्दा माथिका व्यवसायमा विद्युतीय बिल अनिवार्य र विद्युतीय भुक्तानीमा प्रोत्साहन, जसले मूल्य अभिवृद्धि करको शृंखलालाई स्वतः अभिलेखित बनाउँछ।' },
          { en: 'A simple presumptive or turnover tax for small business, set low enough that compliance is cheaper than evasion, which brings the informal sector into the record even before it yields much revenue.', ne: 'साना व्यवसायका लागि सरल अनुमानित वा कारोबारमा आधारित कर, पालना छल्नुभन्दा सस्तो पर्ने दरमा, जसले अनौपचारिक क्षेत्रलाई धेरै राजस्व नआउँदै अभिलेखमा ल्याउँछ।' },
          { en: 'Build and publish a property valuation roll at the local level, updated periodically, so registration fee, capital gains and property tax all rest on one credible number.', ne: 'स्थानीय तहमा आवधिक रूपमा अद्यावधिक हुने सम्पत्ति मूल्याङ्कन अभिलेख बनाई सार्वजनिक गर्ने, जसले रजिस्ट्रेशन शुल्क, पुँजीगत लाभकर र सम्पत्ति कर सबै एउटै विश्वसनीय आधारमा उभिन्।' },
          { en: 'Risk-based customs: post-clearance audit, valuation database and non-intrusive inspection targeted by risk, rather than physical checking of everything and effectively of nothing.', ne: 'जोखिममा आधारित भन्सार: भन्सारपछिको लेखापरीक्षण, मूल्याङ्कन तथ्याङ्क भण्डार र जोखिमको आधारमा लक्षित गैरआक्रमक जाँच — सबै वस्तुको भौतिक जाँच गर्दा व्यवहारमा कुनैको नहुने अवस्थाको विकल्प।' },
          { en: 'Review exemptions on a published schedule with a sunset date, and report revenue forgone in the budget so the cost of a concession is visible alongside its purpose.', ne: 'छुटको प्रकाशित तालिकासहित अन्त्य मिति तोकी पुनरावलोकन गर्ने र बजेटमा राजस्व त्यागको विवरण प्रस्तुत गर्ने, जसले छुटको उद्देश्यसँगै त्यसको लागत देखिन्छ।' },
          { en: 'Transfer pricing and thin capitalisation rules with the capacity to apply them, since a growing share of large turnover is cross-border.', ne: 'हस्तान्तरण मूल्य र पातलो पुँजीकरणसम्बन्धी नियम र त्यो लागू गर्ने क्षमता, किनकि ठूलो कारोबारको बढ्दो हिस्सा सीमापार भइरहेको छ।' },
        ],
      },
    ],
    conclusion: {
      en: 'The structural weakness is that too much of Nepal’s revenue is collected at the border and too little from domestic income and property. Widening the base is less about raising rates than about record: a registered premise, a digital bill and a credible valuation roll would bring in revenue that rate increases on existing taxpayers cannot, and would spread the burden more fairly while doing it.',
      ne: 'संरचनागत कमजोरी यो हो कि नेपालको राजस्वको धेरै हिस्सा सीमानामा उठ्छ र आन्तरिक आय तथा सम्पत्तिबाट थोरै। दायरा फराकिलो बनाउनु दर बढाउनुभन्दा अभिलेखको विषय हो: दर्ता भएको व्यवसाय स्थल, विद्युतीय बिल र विश्वसनीय मूल्याङ्कन अभिलेखले वर्तमान करदातामाथि दर बढाएर नउठ्ने राजस्व उठाउँछन् र त्यसै क्रममा भार अझ न्यायोचित रूपमा बाँड्छन्।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Article 60 and Article 250; Schedules 5, 6, 8 and 9', ne: 'नेपालको संविधान, धारा ६० र धारा २५०; अनुसूची ५, ६, ८ र ९' },
      { en: 'Income Tax Act 2058; Value Added Tax Act 2052; Excise Act 2058; Customs Act 2064', ne: 'आयकर ऐन, २०५८; मूल्य अभिवृद्धि कर ऐन, २०५२; अन्तःशुल्क ऐन, २०५८; भन्सार ऐन, २०६४' },
    ],
    freshnessNote: {
      en: 'Rates, slabs, the VAT registration threshold and the revenue-to-GDP ratio change with each Finance Act, so take them from the current year’s budget speech and Economic Survey rather than quoting from memory.',
      ne: 'दर, दरबन्दी, मूल्य अभिवृद्धि करको दर्ता सीमा र कुल गार्हस्थ्य उत्पादनमा राजस्वको अनुपात प्रत्येक आर्थिक ऐनसँगै फेरिन्छन्, त्यसैले स्मरणबाट उद्धृत नगरी चालू वर्षको बजेट वक्तव्य र आर्थिक सर्वेक्षणबाट लिनुहोस्।',
    },
  },
  {
    id: 'w-adhikrit-p4-c-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p4',
    sectionId: 'adhikrit-p4-c',
    subjectId: 'office-mgmt',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'What is beruju (audit irregularity)? Classify its types, explain why it accumulates in Nepal, and state the process for settling it.',
      ne: 'बेरुजु भन्नाले के बुझिन्छ? यसका प्रकारको वर्गीकरण गर्दै नेपालमा बेरुजु थुप्रिनुका कारण र फर्स्योटको प्रक्रिया उल्लेख गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Definition: an amount that audit finds not to have been spent or accounted for in accordance with law', ne: 'परिभाषा: कानुनबमोजिम खर्च वा लेखाङ्कन नभएको भनी लेखापरीक्षणले औंल्याएको रकम' },
      { en: 'Types: to be regularised, to be recovered, and advances outstanding; also dear-recoverable and un-cleared', ne: 'प्रकार: नियमित गर्नुपर्ने, असुल गर्नुपर्ने, र पेस्की बाँकी; तथा असुल उपर गर्नुपर्ने र फर्स्योट हुन बाँकी' },
      { en: 'Legal basis: Audit Act 2075, Financial Procedure and Fiscal Responsibility Act 2076, Article 241', ne: 'कानुनी आधार: लेखापरीक्षण ऐन, २०७५, आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६, धारा २४१' },
      { en: 'Causes: weak internal control, procurement non-compliance, advances not cleared, capacity at local level', ne: 'कारण: कमजोर आन्तरिक नियन्त्रण, खरिदको पालना नहुनु, पेस्की फर्स्योट नहुनु, स्थानीय तहको क्षमता' },
      { en: 'Settlement: response to the preliminary report, the Beruju Settlement Committee, Public Accounts Committee, and the Office of the Auditor General', ne: 'फर्स्योट: प्रारम्भिक प्रतिवेदनमा प्रतिक्रिया, बेरुजु फर्स्योट समिति, सार्वजनिक लेखा समिति, र महालेखा परीक्षकको कार्यालय' },
      { en: 'Accountable officer is personally liable for an amount to be recovered', ne: 'असुल गर्नुपर्ने रकममा जिम्मेवार व्यक्ति व्यक्तिगत रूपमा दायी हुने' },
    ],
    intro: {
      en: 'Beruju is an amount which, on audit, is found not to have been received, spent, recorded or retained in accordance with the law. It is not a synonym for corruption: a great deal of it is a documentary or procedural failure. But it is a measure of financial discipline, and the fact that it accumulates faster in Nepal than it is settled is the plainest evidence that internal control is weak.',
      ne: 'बेरुजु भन्नाले लेखापरीक्षणमा कानुनबमोजिम आय, खर्च, अभिलेख वा जिम्मेवारी नभएको भनी देखिएको रकम बुझिन्छ। यो भ्रष्टाचारको पर्यायवाची होइन: यसको ठूलो हिस्सा कागजात वा प्रक्रियागत त्रुटि हुन्छ। तर यो वित्तीय अनुशासनको सूचक हो, र नेपालमा फर्स्योट हुनेभन्दा छिटो बेरुजु थुप्रिनु आन्तरिक नियन्त्रण कमजोर भएको सबैभन्दा स्पष्ट प्रमाण हो।',
    },
    parts: [
      {
        heading: { en: 'Classification', ne: 'वर्गीकरण' },
        points: [
          { en: 'To be regularised — the expenditure was for a public purpose but a procedural requirement was not met, so it needs the competent authority’s sanction on record.', ne: 'नियमित गर्नुपर्ने — खर्च सार्वजनिक प्रयोजनका लागि भएको तर प्रक्रियागत सर्त पुरा नभएको, त्यसैले सक्षम अधिकारीको स्वीकृति अभिलेखमा आवश्यक।' },
          { en: 'To be recovered — the amount was paid to someone not entitled to it, or paid in excess, so it must be recovered from the recipient or from the officer who authorised it.', ne: 'असुल गर्नुपर्ने — पाउन नपर्ने व्यक्तिलाई वा बढी भुक्तानी भएको रकम, जो प्राप्तकर्ता वा भुक्तानी स्वीकृत गर्ने कर्मचारीबाट असुल गर्नुपर्ने।' },
          { en: 'Advance outstanding — money issued as an advance for a purpose and not yet cleared with bills, which is the largest single component in many offices.', ne: 'पेस्की बाँकी — कुनै प्रयोजनका लागि पेस्की दिइएको र बिलसहित फर्स्योट नभएको रकम, जो धेरै कार्यालयमा सबैभन्दा ठूलो एकल अंश हो।' },
          { en: 'By subject: expenditure without budget, procurement without competition, payment without measurement, revenue not deposited, and stores not recorded.', ne: 'विषयअनुसार: बजेटविना खर्च, प्रतिस्पर्धाविना खरिद, नापजाँचविना भुक्तानी, राजस्व दाखिला नभएको, र जिन्सी अभिलेख नभएको।' },
        ],
      },
      {
        heading: { en: 'Why it accumulates', ne: 'थुप्रिनुका कारण' },
        points: [
          { en: 'Internal control is treated as a formality: the bill is certified without the measurement book, the store ledger or the completion report behind it.', ne: 'आन्तरिक नियन्त्रणलाई औपचारिकता मानिने: नापी किताब, जिन्सी खाता वा कार्यसम्पन्न प्रतिवेदनविना बिल प्रमाणित हुने।' },
          { en: 'Procurement steps are skipped under year-end pressure, and the irregularity is created at the moment the work is hurried.', ne: 'वर्षान्तको दबाबमा खरिदका चरण छुटाइने र काम हतार गर्दा त्यही क्षणमा अनियमितता सिर्जना हुने।' },
          { en: 'Advances are issued freely and not pursued, because no consequence attaches to an officer who leaves one outstanding.', ne: 'पेस्की सहजै दिइने र पछ्याइने नहुने, किनभने पेस्की बाँकी राख्ने कर्मचारीलाई कुनै परिणाम भोग्नु पर्दैन।' },
          { en: 'Federalism has multiplied the number of spending units without a matching number of trained accountants, so many local levels are audited for the first time on systems they are still learning.', ne: 'सङ्घीयताले खर्च गर्ने इकाइको संख्या बढाए पनि तालिमप्राप्त लेखापालको संख्या सोअनुसार नबढेको हुँदा धेरै स्थानीय तह अझै सिकिरहेको प्रणालीमा पहिलोपटक लेखापरीक्षण भइरहेका छन्।' },
          { en: 'Transfers move the accountable officer before the file is settled, and the successor has no personal stake in clearing a predecessor’s beruju.', ne: 'सरुवाले फाइल फर्स्योट हुनुअघि जिम्मेवार कर्मचारी हटाउने र उत्तराधिकारीलाई पूर्ववर्तीको बेरुजु फर्स्योट गर्नमा व्यक्तिगत सरोकार नहुने।' },
          { en: 'Settlement capacity is smaller than the inflow: the committees meet irregularly, so the outstanding stock grows even in a year when new irregularity falls.', ne: 'फर्स्योट क्षमता आगमनभन्दा सानो: समितिको बैठक अनियमित हुने हुँदा नयाँ अनियमितता घटेको वर्षमा पनि बाँकी रकम बढ्ने।' },
        ],
      },
      {
        heading: { en: 'The settlement process', ne: 'फर्स्योट प्रक्रिया' },
        points: [
          { en: 'The audit team issues a preliminary report; the office may respond with the missing evidence, and much beruju is settled at this stage before it is ever reported.', ne: 'लेखापरीक्षण टोलीले प्रारम्भिक प्रतिवेदन दिने; कार्यालयले छुटेका प्रमाण पेस गरी प्रतिक्रिया दिन सक्ने, र प्रतिवेदनमा जानुअघि यही चरणमा धेरै बेरुजु फर्स्योट हुने।' },
          { en: 'What remains appears in the Auditor General’s annual report, presented to the President under Article 241 and laid before Parliament.', ne: 'बाँकी रहेको बेरुजु महालेखा परीक्षकको वार्षिक प्रतिवेदनमा देखिने, जो धारा २४१ अनुसार राष्ट्रपतिसमक्ष पेस गरी संसदमा राखिने।' },
          { en: 'The accountable officer of the office must respond; the Beruju Settlement Committee at the ministry level considers regularisation where the expenditure was proper in substance.', ne: 'कार्यालयको जिम्मेवार व्यक्तिले जवाफ दिनुपर्ने; खर्च सारमा उचित भएको अवस्थामा मन्त्रालय स्तरको बेरुजु फर्स्योट समितिले नियमित गर्नेबारे विचार गर्ने।' },
          { en: 'An amount to be recovered is recovered from the person liable; where recovery fails it may be enforced as a government due, and departmental action may follow under the Civil Service Act.', ne: 'असुल गर्नुपर्ने रकम दायी व्यक्तिबाट असुल गरिने; असुली नभएमा सरकारी बाँकीसरह असुल उपर गर्न सकिने र निजामती सेवा ऐनअन्तर्गत विभागीय कारबाही हुन सक्ने।' },
          { en: 'The Public Accounts Committee of the federal Parliament examines the report, takes evidence from secretaries and accountable officers, and directs settlement.', ne: 'सङ्घीय संसदको सार्वजनिक लेखा समितिले प्रतिवेदनको परीक्षण गर्ने, सचिव र जिम्मेवार व्यक्तिबाट प्रमाण लिने र फर्स्योटका लागि निर्देशन दिने।' },
          { en: 'Where the irregularity discloses corruption rather than a procedural lapse, the matter goes to the CIAA and to the Special Court, which is a separate track from settlement.', ne: 'अनियमितताले प्रक्रियागत त्रुटि नभई भ्रष्टाचार देखाएको अवस्थामा विषय अख्तियार दुरुपयोग अनुसन्धान आयोग र विशेष अदालतमा जाने, जो फर्स्योटबाट भिन्न प्रक्रिया हो।' },
        ],
      },
      {
        heading: { en: 'Reducing it', ne: 'न्यूनीकरणका उपाय' },
        points: [
          { en: 'Strengthen internal audit so an irregularity is caught in the same year it is created, when the evidence still exists.', ne: 'आन्तरिक लेखापरीक्षण सुदृढ बनाउने, जसले प्रमाण उपलब्ध रहँदै सिर्जना भएको वर्षमै अनियमितता पक्रन्छ।' },
          { en: 'No new advance until the previous one is cleared, applied to the officer rather than to the office.', ne: 'अघिल्लो पेस्की फर्स्योट नभएसम्म नयाँ नदिने, र यो नियम कार्यालयमा नभई कर्मचारीमा लागू गर्ने।' },
          { en: 'Carry the beruju position in the accountable officer’s performance evaluation and in the handover at transfer.', ne: 'बेरुजुको अवस्थालाई जिम्मेवार व्यक्तिको कार्यसम्पादन मूल्याङ्कन र सरुवाको बरबुझारथमा समेट्ने।' },
          { en: 'Place trained accountants within reach of small local levels, through a shared provincial pool where one per unit is not possible.', ne: 'साना स्थानीय तहको पहुँचमा तालिमप्राप्त लेखापाल पुर्‍याउने — प्रत्येक इकाइमा सम्भव नभए प्रादेशिक साझा समूहमार्फत।' },
          { en: 'Publish the settlement position by office, so an office with a growing stock is visible without waiting for the next annual report.', ne: 'कार्यालयगत फर्स्योटको अवस्था सार्वजनिक गर्ने, जसले बेरुजु बढ्दै गएको कार्यालय अर्को वार्षिक प्रतिवेदन कुर्नु नपर्ने गरी देखियोस्।' },
        ],
      },
    ],
    conclusion: {
      en: 'Beruju is best read as a diagnostic rather than a verdict: most of it is procedural, but its growth tells you that control is applied after the money is spent instead of while it is being spent. Clearing advances, carrying the position into performance evaluation and putting a trained accountant within reach of every spending unit would cut the inflow faster than any increase in settlement capacity could cut the stock.',
      ne: 'बेरुजुलाई निर्णय नभई निदानको रूपमा पढ्नु उपयुक्त हुन्छ: यसको धेरै हिस्सा प्रक्रियागत हो, तर यसको वृद्धिले नियन्त्रण खर्च हुँदाको बखत नभई खर्च भइसकेपछि लागू भएको देखाउँछ। पेस्की फर्स्योट गर्नु, यो अवस्थालाई कार्यसम्पादन मूल्याङ्कनमा समेट्नु र प्रत्येक खर्च इकाइको पहुँचमा तालिमप्राप्त लेखापाल पुर्‍याउनुले फर्स्योट क्षमता बढाएर बाँकी घटाउनुभन्दा छिटो नयाँ बेरुजुको आगमन घटाउनेछ।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Article 241', ne: 'नेपालको संविधान, धारा २४१' },
      { en: 'Audit Act 2075', ne: 'लेखापरीक्षण ऐन, २०७५' },
      { en: 'Financial Procedure and Fiscal Responsibility Act 2076', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६' },
    ],
    freshnessNote: {
      en: 'The outstanding beruju amount and the settlement rate come from the Auditor General’s latest annual report — quote that year’s figure, not a remembered one.',
      ne: 'बेरुजुको बाँकी रकम र फर्स्योट दर महालेखा परीक्षकको पछिल्लो वार्षिक प्रतिवेदनबाट लिनुहोस् — स्मरणको नभई त्यही वर्षको तथ्याङ्क उद्धृत गर्नुहोस्।',
    },
  },
  {
    id: 'w-adhikrit-p4-d-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p4',
    sectionId: 'adhikrit-p4-d',
    subjectId: 'constitution',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Describe the process by which a bill becomes an Act in the Federal Parliament of Nepal, and explain the role of parliamentary committees in that process.',
      ne: 'नेपालको सङ्घीय संसदमा विधेयक ऐन बन्ने प्रक्रियाको वर्णन गर्नुहोस् र त्यस प्रक्रियामा संसदीय समितिको भूमिका व्याख्या गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Bicameral Federal Parliament: House of Representatives and National Assembly (Article 83)', ne: 'द्विसदनात्मक सङ्घीय संसद्: प्रतिनिधि सभा र राष्ट्रिय सभा (धारा ८३)' },
      { en: 'Government and private member bills; a money bill originates only in the House of Representatives (Article 109)', ne: 'सरकारी र गैरसरकारी विधेयक; अर्थ विधेयक प्रतिनिधि सभामा मात्र प्रस्तुत हुने (धारा १०९)' },
      { en: 'Stages: introduction, general discussion, committee, clause-by-clause, passage, the other House, authentication', ne: 'चरण: प्रस्तुति, सामान्य छलफल, समिति, दफावार छलफल, पारित, अर्को सदन, प्रमाणीकरण' },
      { en: 'Article 111 on the passage of bills; Article 113 on authentication by the President', ne: 'धारा १११ विधेयक पारितसम्बन्धी; धारा ११३ राष्ट्रपतिबाट प्रमाणीकरणसम्बन्धी' },
      { en: 'Disagreement between the Houses resolved by a joint committee', ne: 'दुई सदनबीच मतभेद भएमा संयुक्त समितिबाट समाधान' },
      { en: 'Committees: thematic committees, Public Accounts Committee, and their oversight role', ne: 'समिति: विषयगत समिति, सार्वजनिक लेखा समिति, र त्यसको निगरानी भूमिका' },
    ],
    intro: {
      en: 'A bill is a proposal for law; it becomes an Act only when both Houses of the Federal Parliament have passed it in the same terms and the President has authenticated it. The Federal Parliament under Article 83 is bicameral, so the ordinary route runs twice through the same sequence of stages — which is the point, since the second reading in the other House is a check on the first.',
      ne: 'विधेयक कानुनको प्रस्ताव हो; सङ्घीय संसदका दुवै सदनले एउटै रूपमा पारित गरी राष्ट्रपतिबाट प्रमाणीकरण भएपछि मात्र यो ऐन बन्छ। धारा ८३ अनुसार सङ्घीय संसद् द्विसदनात्मक भएकाले साधारण विधेयकको बाटो उही चरणबाट दुईपटक गुज्रिन्छ — र यही यसको मर्म हो, किनभने अर्को सदनको दोस्रो अध्ययन पहिलोमाथिको नियन्त्रण हो।',
    },
    parts: [
      {
        heading: { en: 'Kinds of bill', ne: 'विधेयकका प्रकार' },
        points: [
          { en: 'A government bill is introduced by the minister concerned after Cabinet approval; a private member bill is introduced by a member.', ne: 'सरकारी विधेयक मन्त्रिपरिषद्को स्वीकृतिपछि सम्बन्धित मन्त्रीले प्रस्तुत गर्ने; गैरसरकारी विधेयक सदस्यले प्रस्तुत गर्ने।' },
          { en: 'A money bill under Article 109 — one dealing with taxation, borrowing, the Consolidated Fund or appropriation — may be introduced only in the House of Representatives, and the National Assembly may only send back its opinion.', ne: 'धारा १०९ अनुसारको अर्थ विधेयक — कर, ऋण, सञ्चित कोष वा विनियोजनसम्बन्धी — प्रतिनिधि सभामा मात्र प्रस्तुत हुने, र राष्ट्रिय सभाले सुझाव मात्र पठाउन सक्ने।' },
          { en: 'A bill on a matter in the concurrent list must respect the federal framework, and a bill affecting a province may require consultation.', ne: 'साझा सूचीको विषयमा आउने विधेयकले सङ्घीय आधारभूत कानुनको सम्मान गर्नुपर्ने, र प्रदेशलाई असर पर्ने विधेयकमा परामर्श आवश्यक हुन सक्ने।' },
        ],
      },
      {
        heading: { en: 'Stages in the originating House', ne: 'प्रस्तुत भएको सदनमा चरण' },
        points: [
          { en: 'Introduction and first reading: the bill is registered with the Secretariat, printed and distributed, and a motion for leave to introduce is taken where required.', ne: 'प्रस्तुति र पहिलो पाठ: विधेयक सचिवालयमा दर्ता, मुद्रण र वितरण हुने र आवश्यक अवस्थामा प्रस्तुत गर्न अनुमतिको प्रस्ताव लिइने।' },
          { en: 'General discussion on the principle of the bill, at the end of which the House decides whether to send it to a committee or to consider it directly.', ne: 'विधेयकको सिद्धान्तमाथि सामान्य छलफल, जसको अन्त्यमा सदनले समितिमा पठाउने वा सदनमै विचार गर्ने निर्णय गर्छ।' },
          { en: 'Committee stage: the relevant thematic committee takes evidence, hears stakeholders and experts, and reports the bill with amendments.', ne: 'समिति चरण: सम्बन्धित विषयगत समितिले प्रमाण सङ्कलन गर्ने, सरोकारवाला र विज्ञको राय सुन्ने र संशोधनसहित विधेयक प्रतिवेदन गर्ने।' },
          { en: 'Clause-by-clause consideration of the committee’s report, where members move amendments and the House votes on each.', ne: 'समितिको प्रतिवेदनमाथि दफावार विचार, जहाँ सदस्यले संशोधन प्रस्तुत गर्ने र सदनले प्रत्येकमा मतदान गर्ने।' },
          { en: 'Passage by a majority of those present and voting, and transmission to the other House.', ne: 'उपस्थित र मतदानमा भाग लिने सदस्यको बहुमतबाट पारित र अर्को सदनमा पठाइने।' },
        ],
      },
      {
        heading: { en: 'The other House, and disagreement', ne: 'अर्को सदन र मतभेद' },
        points: [
          { en: 'The second House considers the bill through the same stages and may pass it, pass it with amendment, or reject it.', ne: 'दोस्रो सदनले उही चरणबाट विधेयक विचार गरी पारित गर्न, संशोधनसहित पारित गर्न वा अस्वीकृत गर्न सक्छ।' },
          { en: 'If it returns with amendments, the originating House considers them; where the two Houses do not agree, a joint committee of both is formed to resolve the difference.', ne: 'संशोधनसहित फर्किएमा प्रस्तुत भएको सदनले त्यसमाथि विचार गर्ने; दुई सदनबीच सहमति नभएमा मतभेद समाधानका लागि दुवै सदनको संयुक्त समिति गठन हुने।' },
          { en: 'For a money bill the National Assembly’s role is advisory, and the House of Representatives may proceed whether or not the opinion is accepted.', ne: 'अर्थ विधेयकमा राष्ट्रिय सभाको भूमिका परामर्शात्मक हुने र सुझाव स्वीकार भए वा नभएपनि प्रतिनिधि सभा अगाडि बढ्न सक्ने।' },
        ],
      },
      {
        heading: { en: 'Authentication and commencement', ne: 'प्रमाणीकरण र प्रारम्भ' },
        points: [
          { en: 'A bill passed by both Houses is presented to the President, who authenticates it within fifteen days under Article 113.', ne: 'दुवै सदनबाट पारित विधेयक राष्ट्रपतिसमक्ष पेस हुने र धारा ११३ अनुसार पन्ध्र दिनभित्र प्रमाणीकरण हुने।' },
          { en: 'The President may return a bill other than a money bill once with a message; if both Houses pass it again, the President must authenticate it within fifteen days.', ne: 'अर्थ विधेयकबाहेकको विधेयक राष्ट्रपतिले सन्देशसहित एकपटक फर्काउन सक्ने; दुवै सदनले पुनः पारित गरेमा पन्ध्र दिनभित्र प्रमाणीकरण गर्नुपर्ने।' },
          { en: 'On authentication the bill becomes an Act, published in the Nepal Gazette, and commences on the date it or the Gazette notice specifies.', ne: 'प्रमाणीकरणपछि विधेयक ऐन बन्ने, नेपाल राजपत्रमा प्रकाशित हुने र ऐन वा राजपत्रको सूचनाले तोकेको मितिदेखि प्रारम्भ हुने।' },
          { en: 'An ordinance under Article 114 may be issued when Parliament is not in session, but it must be tabled and ceases if not passed within sixty days of the next session.', ne: 'संसद्को अधिवेशन नभएको अवस्थामा धारा ११४ अनुसार अध्यादेश जारी गर्न सकिने, तर त्यो पेस गर्नुपर्ने र अर्को अधिवेशन सुरु भएको साठी दिनभित्र पारित नभएमा निष्क्रिय हुने।' },
        ],
      },
      {
        heading: { en: 'The role of committees', ne: 'समितिको भूमिका' },
        points: [
          { en: 'Legislative scrutiny: the thematic committee is where a bill is examined line by line, where drafting errors are caught, and where those affected are heard — which the floor of a busy House cannot do.', ne: 'विधायिकी परीक्षण: विषयगत समिति नै विधेयक हरफैपिच्छे जाँचिने, मस्यौदाका त्रुटि पक्राउ पर्ने र प्रभावित पक्षको राय सुनिने ठाउँ हो — जो व्यस्त सदनको बैठकले गर्न सक्दैन।' },
          { en: 'Oversight of the executive: committees call ministers and secretaries, examine policy and demand documents between sessions.', ne: 'कार्यपालिकामाथि निगरानी: समितिले मन्त्री र सचिवलाई बोलाउने, नीतिको परीक्षण गर्ने र अधिवेशनबीचमा कागजात माग गर्ने।' },
          { en: 'Financial oversight: the Public Accounts Committee examines the Auditor General’s report, takes evidence from accountable officers and directs the settlement of irregularity — the main route by which Parliament follows the money after it is spent.', ne: 'वित्तीय निगरानी: सार्वजनिक लेखा समितिले महालेखा परीक्षकको प्रतिवेदन परीक्षण गर्ने, जिम्मेवार व्यक्तिबाट प्रमाण लिने र अनियमितता फर्स्योटको निर्देशन दिने — खर्च भइसकेको रकम संसदले पछ्याउने प्रमुख बाटो।' },
          { en: 'Delegated legislation: committees examine whether rules made under an Act stay within the power the Act gave.', ne: 'प्रत्यायोजित विधायन: ऐनअन्तर्गत बनेको नियम ऐनले दिएको अधिकारभित्र छ कि छैन समितिले जाँच्ने।' },
          { en: 'Committees work across party lines more than the floor does, which is why a bill improved in committee is often passed without further contest.', ne: 'समिति सदनको बैठकभन्दा बढी दलगत सीमा नाघी काम गर्ने हुँदा समितिमा सुधारिएको विधेयक प्रायः थप विवादविना पारित हुन्छ।' },
        ],
      },
    ],
    conclusion: {
      en: 'The legislative process is deliberately slow because each stage is a filter: committee scrutiny catches what general debate cannot, and the second House catches what the first missed. The practical weakness in Nepal is not the design but the use of it — bills passed under time pressure with the committee stage compressed, and ordinances used where an Act was wanted, both of which spend the very safeguard the process exists to provide.',
      ne: 'विधायिकी प्रक्रिया जानाजान ढिलो छ किनभने प्रत्येक चरण एउटा छानो हो: सामान्य बहसले पक्रन नसकेको समिति परीक्षणले पक्रन्छ र पहिलो सदनले छुटाएको दोस्रो सदनले पक्रन्छ। नेपालमा व्यावहारिक कमजोरी संरचनाको नभई प्रयोगको हो — समिति चरण खुम्चाई समयको दबाबमा पारित हुने विधेयक र ऐन आवश्यक हुँदा प्रयोग हुने अध्यादेश, दुवैले प्रक्रिया रहनुको कारण बनेको रक्षाकवच खर्चिन्छन्।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 83, 109, 111, 113 and 114', ne: 'नेपालको संविधान, धारा ८३, १०९, १११, ११३ र ११४' },
      { en: 'Rules of Procedure of the House of Representatives and of the National Assembly', ne: 'प्रतिनिधि सभा नियमावली र राष्ट्रिय सभा नियमावली' },
    ],
  },
];
