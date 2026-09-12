import type { WrittenQuestion } from '../../types';

/**
 * Section Officer, Paper II — Governance Systems.
 *
 * Ten questions of ten marks in three hours, so eighteen minutes and roughly
 * three hundred words each. The model answers are built the way a marker
 * reads: a definition that fixes the scope, numbered substance under
 * headings, the Nepali legal basis named by article or section, and a
 * conclusion that answers the question actually asked.
 */
export const OFFICER_PAPER_2: WrittenQuestion[] = [
  {
    id: 'w-adhikrit-p2-a-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p2',
    sectionId: 'adhikrit-p2-a',
    subjectId: 'governance',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Define good governance. Explain its main attributes, and evaluate the legal and institutional arrangements Nepal has made to secure it.',
      ne: 'सुशासनको परिभाषा दिनुहोस्। यसका प्रमुख विशेषताहरू उल्लेख गर्दै सुशासन प्रत्याभूत गर्न नेपालले गरेका कानुनी तथा संस्थागत व्यवस्थाको मूल्याङ्कन गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Definition: the exercise of public authority with participation, transparency, accountability, rule of law and responsiveness', ne: 'परिभाषा: सहभागिता, पारदर्शिता, उत्तरदायित्व, विधिको शासन र संवेदनशीलतासहित सार्वजनिक अधिकारको प्रयोग' },
      { en: 'Eight attributes commonly listed by UNESCAP', ne: 'युनेस्केपले उल्लेख गर्ने आठ विशेषता' },
      { en: 'Constitutional basis: Article 51 directive policies; Article 27 right to information', ne: 'संवैधानिक आधार: धारा ५१ राज्यको नीति; धारा २७ सूचनाको हक' },
      { en: 'Good Governance (Management and Operation) Act 2064 and its Rules', ne: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ र सम्बन्धित नियमावली' },
      { en: 'Institutions: CIAA, Auditor General, National Vigilance Centre, Public Service Commission, National Information Commission', ne: 'संस्था: अख्तियार दुरुपयोग अनुसन्धान आयोग, महालेखा परीक्षक, राष्ट्रिय सतर्कता केन्द्र, लोक सेवा आयोग, राष्ट्रिय सूचना आयोग' },
      { en: 'Gap between the statute book and the citizen’s experience of service', ne: 'कानुनी व्यवस्था र सेवाग्राहीको अनुभवबीचको अन्तर' },
    ],
    intro: {
      en: 'Good governance is the exercise of public authority in a manner that is lawful, transparent, participatory and accountable to those it affects. It is not a separate programme but a quality of administration: the same decision taken openly, on record, by a competent authority and within a known time limit is good governance, while the same decision taken arbitrarily is not.',
      ne: 'सुशासन भन्नाले सार्वजनिक अधिकारको प्रयोग कानुनसम्मत, पारदर्शी, सहभागितामूलक र प्रभावित पक्षप्रति उत्तरदायी ढङ्गले गर्ने पद्धति बुझिन्छ। यो छुट्टै कार्यक्रम होइन, प्रशासनको गुण हो: एउटै निर्णय सक्षम अधिकारीले खुला रूपमा, अभिलेखसहित र तोकिएको समयभित्र गर्दा सुशासन हुन्छ, स्वेच्छाचारी ढङ्गले गर्दा हुँदैन।',
    },
    parts: [
      {
        heading: { en: 'Main attributes', ne: 'प्रमुख विशेषता' },
        points: [
          { en: 'Participation — those affected by a decision have a say in it, directly or through elected representatives.', ne: 'सहभागिता — निर्णयबाट प्रभावित पक्षको प्रत्यक्ष वा निर्वाचित प्रतिनिधिमार्फत सहभागिता।' },
          { en: 'Rule of law — authority is exercised under law, and the same law binds the official as the citizen.', ne: 'विधिको शासन — अधिकारको प्रयोग कानुनअन्तर्गत हुने र सोही कानुन कर्मचारी र नागरिक दुवैलाई लाग्ने।' },
          { en: 'Transparency — decisions, their grounds and their records are open, subject only to lawful exceptions.', ne: 'पारदर्शिता — निर्णय, त्यसका आधार र अभिलेख कानुनी अपवादबाहेक खुला रहने।' },
          { en: 'Accountability — every officer answers for the decision they took, administratively, financially and before the law.', ne: 'उत्तरदायित्व — प्रत्येक पदाधिकारी आफ्नो निर्णयप्रति प्रशासनिक, वित्तीय र कानुनी रूपमा जवाफदेही हुने।' },
          { en: 'Responsiveness, effectiveness and efficiency — service within a published time limit, at reasonable cost.', ne: 'संवेदनशीलता, प्रभावकारिता र कार्यकुशलता — प्रकाशित समयसीमाभित्र उचित लागतमा सेवा।' },
          { en: 'Equity and inclusion — access to service does not depend on who the citizen is.', ne: 'समता र समावेशिता — सेवाको पहुँच नागरिकको पहिचानमा निर्भर नहुने।' },
          { en: 'Consensus orientation — competing interests are mediated towards a decision the community can live with.', ne: 'सहमति उन्मुखता — प्रतिस्पर्धी स्वार्थबीच मध्यस्थता गरी समुदायले स्वीकार्न सक्ने निर्णयमा पुग्ने।' },
        ],
      },
      {
        heading: { en: 'Constitutional and legal arrangements in Nepal', ne: 'नेपालमा संवैधानिक तथा कानुनी व्यवस्था' },
        points: [
          { en: 'The Constitution of Nepal makes good governance a directive policy of the State under Article 51, and guarantees the right to information under Article 27 and the right to constitutional remedy under Article 46.', ne: 'नेपालको संविधानले धारा ५१ अन्तर्गत सुशासनलाई राज्यको नीतिको रूपमा राखेको, धारा २७ मा सूचनाको हक र धारा ४६ मा संवैधानिक उपचारको हक प्रत्याभूत गरेको।' },
          { en: 'The Good Governance (Management and Operation) Act 2064 codifies the duties of an office: a citizen charter, a decided time limit for each service, reasoned decisions, delegation, and a hearing of grievances.', ne: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ ले कार्यालयको कर्तव्य निर्धारण गरेको: नागरिक बडापत्र, प्रत्येक सेवाको तोकिएको समयसीमा, कारणसहितको निर्णय, अधिकार प्रत्यायोजन र गुनासो सुनुवाई।' },
          { en: 'The Right to Information Act 2064 makes disclosure the rule and secrecy the exception, and requires every public body to publish its holdings periodically.', ne: 'सूचनाको हक सम्बन्धी ऐन, २०६४ ले सूचना प्रवाहलाई नियम र गोपनीयतालाई अपवाद बनाएको र प्रत्येक सार्वजनिक निकायलाई आवधिक रूपमा सूचना प्रकाशित गर्न बाध्य गरेको।' },
          { en: 'The Public Procurement Act 2063 and the Financial Procedure and Fiscal Responsibility Act 2076 govern how public money is committed and accounted for.', ne: 'सार्वजनिक खरिद ऐन, २०६३ र आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ ले सार्वजनिक रकमको प्रतिबद्धता र लेखाङ्कन नियमन गर्ने।' },
          { en: 'The Civil Service Act 2049 ties the individual official to a code of conduct and a disciplinary process.', ne: 'निजामती सेवा ऐन, २०४९ ले कर्मचारीलाई आचरण र विभागीय कारबाहीको प्रक्रियासँग बाँध्ने।' },
        ],
      },
      {
        heading: { en: 'Institutional arrangements', ne: 'संस्थागत व्यवस्था' },
        points: [
          { en: 'The Commission for the Investigation of Abuse of Authority investigates improper conduct and corruption by public officials.', ne: 'अख्तियार दुरुपयोग अनुसन्धान आयोगले सार्वजनिक पदाधिकारीको अनुचित कार्य र भ्रष्टाचारको अनुसन्धान गर्ने।' },
          { en: 'The Auditor General audits the accounts of every federal, provincial and local body and reports to the President.', ne: 'महालेखा परीक्षकले सङ्घ, प्रदेश र स्थानीय तहका सबै निकायको लेखापरीक्षण गरी राष्ट्रपतिसमक्ष प्रतिवेदन पेस गर्ने।' },
          { en: 'The National Vigilance Centre carries out technical audit and preventive surveillance of public works.', ne: 'राष्ट्रिय सतर्कता केन्द्रले सार्वजनिक निर्माणको प्राविधिक परीक्षण र निवारक निगरानी गर्ने।' },
          { en: 'The Public Service Commission secures merit in entry and promotion, which is the first defence against patronage.', ne: 'लोक सेवा आयोगले प्रवेश र बढुवामा योग्यता प्रणाली कायम राख्ने, जो भनसुनविरुद्धको पहिलो रक्षा हो।' },
          { en: 'The National Information Commission hears appeals where information is withheld.', ne: 'राष्ट्रिय सूचना आयोगले सूचना नदिएको अवस्थामा पुनरावेदन सुन्ने।' },
        ],
      },
      {
        heading: { en: 'Evaluation', ne: 'मूल्याङ्कन' },
        points: [
          { en: 'On paper the framework is complete; the weakness is in implementation. Citizen charters are displayed but time limits are not enforced, so the remedy for delay exists without being used.', ne: 'कागजमा संरचना पूर्ण छ; कमजोरी कार्यान्वयनमा छ। नागरिक बडापत्र टाँसिएको हुन्छ तर समयसीमा कार्यान्वयन हुँदैन, फलस्वरूप ढिलाइको उपचार प्रयोगविहीन रहन्छ।' },
          { en: 'Accountability is largely procedural rather than result based: an officer is asked whether the process was followed, rarely whether the service was delivered.', ne: 'उत्तरदायित्व नतिजामूलक हुनुभन्दा प्रक्रियामुखी छ: प्रक्रिया पुरा भयो कि भनी सोधिन्छ, सेवा प्राप्त भयो कि भनी विरलै सोधिन्छ।' },
          { en: 'Federalism has multiplied the number of bodies without matching the capacity: many local levels still lack the staff and systems to run their own procurement and internal control.', ne: 'सङ्घीयताले निकायको संख्या बढाए पनि क्षमता सोअनुसार बढेको छैन: धेरै स्थानीय तहमा आफ्नै खरिद र आन्तरिक नियन्त्रण चलाउने कर्मचारी र प्रणाली अझै छैन।' },
          { en: 'Remedies that would bite: enforce the decided time limits with a named officer, publish compliance, digitise records so a file cannot go missing, and act on audit observations rather than letting arrears accumulate.', ne: 'प्रभावकारी उपाय: तोकिएको समयसीमा जिम्मेवार अधिकारी तोकी कार्यान्वयन गर्ने, पालनाको विवरण सार्वजनिक गर्ने, अभिलेख डिजिटल बनाई फाइल हराउन नदिने, र बेरुजु थुप्रिन नदिई लेखापरीक्षणका कैफियतमा कारबाही गर्ने।' },
        ],
      },
    ],
    conclusion: {
      en: 'Nepal’s difficulty is not an absence of law but a shortfall in enforcement. Good governance will be felt by a citizen when the service arrives within the time the charter promises and the officer who misses it is answerable — which makes capacity building at the local level, and action on audit findings, the practical priorities.',
      ne: 'नेपालको कठिनाइ कानुनको अभाव होइन, कार्यान्वयनको कमजोरी हो। बडापत्रले तोकेको समयभित्र सेवा प्राप्त हुँदा र समयसीमा नाघ्ने कर्मचारी जवाफदेही बन्दा नागरिकले सुशासन अनुभव गर्नेछन् — यसैले स्थानीय तहको क्षमता विकास र लेखापरीक्षणका कैफियतमा कारबाही व्यावहारिक प्राथमिकता हुन्।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 27, 46 and 51', ne: 'नेपालको संविधान, धारा २७, ४६ र ५१' },
      { en: 'Good Governance (Management and Operation) Act 2064', ne: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४' },
      { en: 'Right to Information Act 2064', ne: 'सूचनाको हक सम्बन्धी ऐन, २०६४' },
    ],
  },
  {
    id: 'w-adhikrit-p2-b-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p2',
    sectionId: 'adhikrit-p2-b',
    subjectId: 'constitution',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Explain the fundamental rights guaranteed by the Constitution of Nepal, and discuss the remedies available to a citizen whose fundamental right has been infringed.',
      ne: 'नेपालको संविधानले प्रत्याभूत गरेका मौलिक हकहरू व्याख्या गर्नुहोस् र मौलिक हक हनन भएको नागरिकलाई उपलब्ध उपचारको चर्चा गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Part 3 of the Constitution, Articles 16 to 46: thirty-one fundamental rights', ne: 'संविधानको भाग ३, धारा १६ देखि ४६: एकतीस मौलिक हक' },
      { en: 'Grouped as rights of the person, of equality, of justice, of groups, and social and economic rights', ne: 'वर्गीकरण: व्यक्तिका हक, समानताका हक, न्यायसम्बन्धी हक, समूहगत हक, र सामाजिक तथा आर्थिक हक' },
      { en: 'Article 46 — right to constitutional remedy', ne: 'धारा ४६ — संवैधानिक उपचारको हक' },
      { en: 'Article 133 — Supreme Court’s extraordinary jurisdiction; Article 144 — High Court', ne: 'धारा १३३ — सर्वोच्च अदालतको असाधारण अधिकारक्षेत्र; धारा १४४ — उच्च अदालत' },
      { en: 'Five writs: habeas corpus, mandamus, certiorari, prohibition, quo warranto', ne: 'पाँच आदेश: बन्दीप्रत्यक्षीकरण, परमादेश, उत्प्रेषण, प्रतिषेध, अधिकारपृच्छा' },
      { en: 'Non-judicial remedies: National Human Rights Commission, the several inclusion commissions, administrative grievance hearing', ne: 'गैरन्यायिक उपचार: राष्ट्रिय मानव अधिकार आयोग, विभिन्न समावेशी आयोग, प्रशासनिक गुनासो सुनुवाई' },
      { en: 'Limits: reasonable restriction by law, and suspension during a state of emergency except for named rights', ne: 'सीमा: कानुनद्वारा मनासिब प्रतिबन्ध, र सङ्कटकालमा तोकिएका हकबाहेक निलम्बन' },
    ],
    intro: {
      en: 'Fundamental rights are the claims a citizen holds against the State itself, placed in the Constitution so that an ordinary law cannot take them away. Part 3 of the Constitution of Nepal, Articles 16 to 46, guarantees thirty-one such rights, and Article 46 makes the guarantee real by giving the holder a route to court.',
      ne: 'मौलिक हक भन्नाले नागरिकले राज्यविरुद्ध दाबी गर्न सक्ने त्यस्ता अधिकार बुझिन्छ, जसलाई साधारण कानुनले खोस्न नसक्ने गरी संविधानमा राखिएको हुन्छ। नेपालको संविधानको भाग ३, धारा १६ देखि ४६ सम्म एकतीस मौलिक हक प्रत्याभूत गरिएको छ र धारा ४६ ले हकवालालाई अदालतसम्मको बाटो दिई यो प्रत्याभूतिलाई सार्थक बनाएको छ।',
    },
    parts: [
      {
        heading: { en: 'Rights of the person', ne: 'व्यक्तिसम्बन्धी हक' },
        points: [
          { en: 'Right to live with dignity, and the abolition of the death penalty (Article 16).', ne: 'सम्मानपूर्वक बाँच्न पाउने हक र मृत्युदण्डको अन्त्य (धारा १६)।' },
          { en: 'Freedoms of opinion and expression, assembly, association, movement, profession and property (Article 17), each subject to restriction only by law on stated grounds.', ne: 'विचार र अभिव्यक्ति, भेला, सङ्घ–संस्था, आवागमन, पेसा र सम्पत्तिको स्वतन्त्रता (धारा १७), प्रत्येकमा उल्लिखित आधारमा कानुनद्वारा मात्र प्रतिबन्ध लाग्ने।' },
          { en: 'Right against preventive detention beyond the limits of law, and against torture (Articles 22 and 23).', ne: 'कानुनी सीमाबाहिर निवारक नजरबन्दविरुद्ध र यातनाविरुद्धको हक (धारा २२ र २३)।' },
          { en: 'Right to privacy (Article 28) and against exploitation, including trafficking and bonded labour (Article 29).', ne: 'गोपनीयताको हक (धारा २८) र मानव बेचबिखन तथा बँधुवा श्रमसहितको शोषणविरुद्धको हक (धारा २९)।' },
        ],
      },
      {
        heading: { en: 'Equality, justice and group rights', ne: 'समानता, न्याय र समूहगत हक' },
        points: [
          { en: 'Right to equality before the law, with positive discrimination permitted for the socially or economically backward (Article 18).', ne: 'कानुनको दृष्टिमा समान हुने हक, सामाजिक वा आर्थिक रूपमा पछाडि परेकाका लागि सकारात्मक विभेदको अनुमतिसहित (धारा १८)।' },
          { en: 'Right against untouchability and discrimination, which is both a fundamental right and a punishable offence (Article 24).', ne: 'छुवाछूत तथा भेदभावविरुद्धको हक, जो मौलिक हक र दण्डनीय अपराध दुवै हो (धारा २४)।' },
          { en: 'Rights relating to justice (Article 20): to be informed of the ground of arrest, to consult a legal practitioner, against double jeopardy and self-incrimination, and to a fair hearing.', ne: 'न्यायसम्बन्धी हक (धारा २०): पक्राउको कारण जानकारी पाउने, कानुन व्यवसायीसँग परामर्श गर्ने, एकै अभियोगमा दोहोरो सजाय र आत्म–अभियोगविरुद्ध, र निष्पक्ष सुनुवाईको हक।' },
          { en: 'Rights of women (Article 38), Dalit (Article 40), children (Article 39), senior citizens (Article 41) and the right to social justice (Article 42), which carry proportional inclusion into State bodies.', ne: 'महिलाको हक (धारा ३८), दलितको हक (धारा ४०), बालबालिकाको हक (धारा ३९), ज्येष्ठ नागरिकको हक (धारा ४१) र सामाजिक न्यायको हक (धारा ४२), जसले राज्यका निकायमा समानुपातिक समावेशिता ल्याउँछन्।' },
        ],
      },
      {
        heading: { en: 'Social and economic rights', ne: 'सामाजिक तथा आर्थिक हक' },
        points: [
          { en: 'Education (Article 31) — free and compulsory to the basic level, free to the secondary level.', ne: 'शिक्षा (धारा ३१) — आधारभूत तहसम्म निःशुल्क र अनिवार्य, माध्यमिक तहसम्म निःशुल्क।' },
          { en: 'Health (Article 35), food (Article 36), housing (Article 37), clean environment (Article 30), employment (Article 33) and labour (Article 34).', ne: 'स्वास्थ्य (धारा ३५), खाद्य (धारा ३६), आवास (धारा ३७), स्वच्छ वातावरण (धारा ३०), रोजगारी (धारा ३३) र श्रम (धारा ३४)।' },
          { en: 'Language and culture (Articles 32), and the right of the consumer to quality goods and to compensation (Article 44).', ne: 'भाषा र संस्कृति (धारा ३२), र गुणस्तरीय वस्तु तथा क्षतिपूर्ति पाउने उपभोक्ताको हक (धारा ४४)।' },
          { en: 'These required implementing legislation within three years of commencement, which was enacted in 2075 — so the remedy now runs through those Acts as well as the Constitution.', ne: 'यी हकका लागि संविधान प्रारम्भ भएको तीन वर्षभित्र कानुन बनाउनुपर्ने व्यवस्था थियो, जो २०७५ मा बनेको — त्यसैले उपचार अब संविधानसँगै त्यस्ता ऐनमार्फत पनि चल्छ।' },
        ],
      },
      {
        heading: { en: 'Remedies', ne: 'उपचार' },
        points: [
          { en: 'Article 46 gives the right to constitutional remedy, exercised under Article 133 in the Supreme Court and Article 144 in the High Court.', ne: 'धारा ४६ ले संवैधानिक उपचारको हक दिन्छ, जो धारा १३३ अन्तर्गत सर्वोच्च अदालत र धारा १४४ अन्तर्गत उच्च अदालतमा प्रयोग हुन्छ।' },
          { en: 'The Supreme Court may issue habeas corpus, mandamus, certiorari, prohibition and quo warranto, and may also declare a law void for inconsistency with the Constitution.', ne: 'सर्वोच्च अदालतले बन्दीप्रत्यक्षीकरण, परमादेश, उत्प्रेषण, प्रतिषेध र अधिकारपृच्छाको आदेश जारी गर्न सक्छ र संविधानसँग बाझिने कानुनलाई अमान्य घोषित गर्न सक्छ।' },
          { en: 'Public interest litigation is admitted where the question concerns a right of the public, so a person need not show personal injury.', ne: 'सार्वजनिक हकको प्रश्न भएका विषयमा सार्वजनिक सरोकारको निवेदन ग्रहण हुने हुँदा निवेदकले व्यक्तिगत हानि देखाउनु नपर्ने।' },
          { en: 'Non-judicial routes: complaint to the National Human Rights Commission, to the inclusion commissions for group rights, to the National Information Commission for information, and grievance hearing inside the office under the Good Governance Act.', ne: 'गैरन्यायिक बाटो: राष्ट्रिय मानव अधिकार आयोगमा उजुरी, समूहगत हकका लागि समावेशी आयोगमा, सूचनाका लागि राष्ट्रिय सूचना आयोगमा, र सुशासन ऐनअन्तर्गत कार्यालयभित्रै गुनासो सुनुवाई।' },
          { en: 'Limits on the remedy: rights are subject to reasonable restriction by law, and under Article 273 several may be suspended in a state of emergency — but not habeas corpus itself, nor the right against torture or to be free from untouchability.', ne: 'उपचारका सीमा: हकमा कानुनद्वारा मनासिब प्रतिबन्ध लाग्न सक्ने र धारा २७३ अनुसार सङ्कटकालमा केही हक निलम्बन हुन सक्ने — तर बन्दीप्रत्यक्षीकरण, यातनाविरुद्धको हक र छुवाछूतविरुद्धको हक निलम्बन हुँदैन।' },
        ],
      },
    ],
    conclusion: {
      en: 'A right without a remedy is an aspiration, which is why Article 46 sits at the end of Part 3. Nepal’s framework is strong in both respects; the practical question is access — the cost and distance of reaching a High Court, and the need to make the administrative grievance route work so that the writ is the last resort rather than the first.',
      ne: 'उपचारविहीन हक आकाङ्क्षा मात्र हुन्छ, यसैले धारा ४६ भाग ३ को अन्तिममा राखिएको छ। नेपालको संरचना दुवै दृष्टिले सबल छ; व्यावहारिक प्रश्न पहुँचको हो — उच्च अदालत पुग्ने खर्च र दूरी, र प्रशासनिक गुनासोको बाटो प्रभावकारी बनाउनुपर्ने आवश्यकता, जसले रिटलाई पहिलो नभई अन्तिम उपाय बनाउँछ।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Part 3 (Articles 16–46), and Articles 133, 144 and 273', ne: 'नेपालको संविधान, भाग ३ (धारा १६–४६), र धारा १३३, १४४ तथा २७३' },
    ],
  },
  {
    id: 'w-adhikrit-p2-c-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p2',
    sectionId: 'adhikrit-p2-c',
    subjectId: 'governance',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'What is meant by a merit system in the civil service? Examine how far Nepal’s civil service secures merit while also meeting its constitutional duty of inclusion.',
      ne: 'निजामती सेवामा योग्यता प्रणाली भन्नाले के बुझिन्छ? समावेशिताको संवैधानिक दायित्व पूरा गर्दै नेपालको निजामती सेवाले योग्यता प्रणाली कति सुनिश्चित गरेको छ, परीक्षण गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Merit system: entry, promotion and reward by demonstrated competence, through open competition', ne: 'योग्यता प्रणाली: खुला प्रतिस्पर्धामार्फत प्रमाणित क्षमताको आधारमा प्रवेश, बढुवा र पुरस्कार' },
      { en: 'Opposed to the spoils system, where office follows political loyalty', ne: 'भागबन्डा प्रणालीको विपरीत, जहाँ पद राजनीतिक निष्ठाअनुसार बाँडिन्छ' },
      { en: 'Article 243 — Public Service Commission; Article 285 — federal civil service', ne: 'धारा २४३ — लोक सेवा आयोग; धारा २८५ — सङ्घीय निजामती सेवा' },
      { en: 'Civil Service Act 2049: open competition, performance evaluation, seniority, internal competition', ne: 'निजामती सेवा ऐन, २०४९: खुला प्रतिस्पर्धा, कार्यसम्पादन मूल्याङ्कन, ज्येष्ठता, आन्तरिक प्रतिस्पर्धा' },
      { en: 'Article 42 and the 2064 reservation amendment: 45 per cent of open posts reserved across six clusters', ne: 'धारा ४२ र २०६४ को आरक्षण संशोधन: खुला पदको ४५ प्रतिशत छ समूहमा आरक्षित' },
      { en: 'Tension: reservation as a correction to unequal starting points, not a departure from merit', ne: 'तनाव: आरक्षण असमान प्रारम्भिक अवस्थाको सुधार हो, योग्यताबाट विचलन होइन' },
    ],
    intro: {
      en: 'A merit system fills public office on demonstrated competence, established by open competition and judged against published criteria, rather than on political loyalty, kinship or purchase. Its purpose is not fairness to the applicant alone but competence in the service: the citizen is entitled to be served by the ablest candidate available.',
      ne: 'योग्यता प्रणालीले सार्वजनिक पद राजनीतिक निष्ठा, नातावाद वा खरिदको आधारमा नभई खुला प्रतिस्पर्धाबाट स्थापित र प्रकाशित मापदण्डबमोजिम मूल्याङ्कन गरिएको प्रमाणित क्षमताको आधारमा पूर्ति गर्छ। यसको उद्देश्य आवेदकप्रतिको निष्पक्षता मात्र होइन, सेवाको सक्षमता हो: नागरिकलाई उपलब्ध उत्कृष्ट उम्मेदवारबाट सेवा पाउने अधिकार छ।',
    },
    parts: [
      {
        heading: { en: 'Elements of a merit system', ne: 'योग्यता प्रणालीका तत्त्व' },
        points: [
          { en: 'Open, advertised competition conducted by a body independent of the appointing authority.', ne: 'नियुक्ति गर्ने अधिकारीबाट स्वतन्त्र निकायले सञ्चालन गर्ने खुला र विज्ञापित प्रतिस्पर्धा।' },
          { en: 'Selection against a published syllabus and marking scheme, so the result can be defended.', ne: 'प्रकाशित पाठ्यक्रम र अङ्क विभाजनबमोजिम छनोट, जसले नतिजाको प्रतिरक्षा सम्भव बनाउँछ।' },
          { en: 'Security of tenure, so an official can apply the law without fear of removal for doing so.', ne: 'सेवाको सुरक्षा, जसले कर्मचारीलाई कानुन लागू गरेबापत हटाइने डरविना काम गर्न दिन्छ।' },
          { en: 'Promotion on a declared mix of performance, seniority, qualification and internal competition.', ne: 'कार्यसम्पादन, ज्येष्ठता, योग्यता र आन्तरिक प्रतिस्पर्धाको घोषित मिश्रणमा आधारित बढुवा।' },
          { en: 'Political neutrality in service, with conduct rules that bar partisan activity.', ne: 'सेवामा राजनीतिक तटस्थता, र दलगत क्रियाकलाप निषेध गर्ने आचरणसम्बन्धी नियम।' },
        ],
      },
      {
        heading: { en: 'Nepal’s arrangements', ne: 'नेपालको व्यवस्था' },
        points: [
          { en: 'Article 243 constitutes the Public Service Commission as a constitutional body, and Article 285 requires appointment to the federal civil service to be made under federal law through the Commission.', ne: 'धारा २४३ ले लोक सेवा आयोगलाई संवैधानिक निकायको रूपमा गठन गर्छ र धारा २८५ ले सङ्घीय निजामती सेवाको नियुक्ति सङ्घीय कानुनबमोजिम आयोगमार्फत गर्नुपर्ने व्यवस्था गर्छ।' },
          { en: 'The Commission’s written examination and interview are conducted on a published syllabus, and results are open, which is the strongest part of the system.', ne: 'आयोगको लिखित परीक्षा र अन्तर्वार्ता प्रकाशित पाठ्यक्रममा सञ्चालित हुने र नतिजा खुला हुने — यो प्रणालीको सबल पक्ष हो।' },
          { en: 'The Civil Service Act 2049 and its Rules govern promotion, transfer, performance evaluation and discipline; the Act’s code of conduct and the departmental action process supply accountability.', ne: 'निजामती सेवा ऐन, २०४९ र नियमावलीले बढुवा, सरुवा, कार्यसम्पादन मूल्याङ्कन र अनुशासन नियमन गर्छन्; ऐनको आचरण र विभागीय कारबाहीको प्रक्रियाले उत्तरदायित्व सुनिश्चित गर्छ।' },
          { en: 'Provinces and local levels now maintain their own services, which makes a federal civil service law and a uniform standard of entry more, not less, important.', ne: 'प्रदेश र स्थानीय तहले आफ्नै सेवा सञ्चालन गर्ने भएकाले सङ्घीय निजामती सेवा कानुन र प्रवेशको एकरूप मापदण्ड झन् आवश्यक भएको छ।' },
        ],
      },
      {
        heading: { en: 'Inclusion alongside merit', ne: 'योग्यतासँगै समावेशिता' },
        points: [
          { en: 'Article 42 makes proportional inclusion in State bodies a fundamental right of women, Dalit, Adivasi Janajati, Madhesi, Tharu, Muslim, backward classes, minorities, persons with disability and citizens of backward regions.', ne: 'धारा ४२ ले महिला, दलित, आदिवासी जनजाति, मधेसी, थारू, मुस्लिम, पिछडिएको वर्ग, अल्पसंख्यक, अपाङ्गता भएका व्यक्ति र पिछडिएको क्षेत्रका नागरिकलाई राज्यका निकायमा समानुपातिक समावेशिताको मौलिक हक दिएको।' },
          { en: 'Since the 2064 amendment to the Civil Service Act, forty-five per cent of posts filled by open competition are reserved and distributed among six clusters.', ne: 'निजामती सेवा ऐनमा २०६४ मा भएको संशोधनपछि खुला प्रतिस्पर्धाबाट पूर्ति हुने पदको पैंतालीस प्रतिशत आरक्षित गरी छ समूहमा विभाजन गरिएको।' },
          { en: 'Reservation operates inside the competition, not outside it: a reserved candidate sits the same examination and must reach the same pass standard, so the correction is to the starting line rather than to the finishing post.', ne: 'आरक्षण प्रतिस्पर्धाभित्रै लागू हुन्छ, बाहिर होइन: आरक्षित उम्मेदवारले सोही परीक्षा दिनुपर्ने र सोही उत्तीर्णाङ्क प्राप्त गर्नुपर्ने हुँदा सुधार प्रारम्भ रेखामा हुन्छ, लक्ष्य रेखामा होइन।' },
          { en: 'Criticisms worth stating fairly: the benefit tends to reach the better-off within each cluster, the clusters are treated as homogeneous when they are not, and there is no periodic review tied to measured representation.', ne: 'निष्पक्ष रूपमा उल्लेख गर्नुपर्ने आलोचना: लाभ प्रत्येक समूहभित्रका सम्पन्न वर्गसम्म पुग्ने प्रवृत्ति, समूहलाई एकरूप मानिने तर वास्तवमा नभएको, र मापन गरिएको प्रतिनिधित्वसँग जोडिएको आवधिक पुनरावलोकनको अभाव।' },
        ],
      },
      {
        heading: { en: 'Where merit is under strain', ne: 'योग्यता प्रणालीमाथिको दबाब' },
        points: [
          { en: 'Transfer and posting remain the weak point: entry is competitive, but where an officer is sent, and how soon they are moved, is far less rule bound.', ne: 'सरुवा र पदस्थापन कमजोर पक्ष हो: प्रवेश प्रतिस्पर्धात्मक छ, तर कर्मचारी कहाँ पठाइन्छ र कति छिटो हटाइन्छ, त्यो निकै कम नियमबद्ध छ।' },
          { en: 'Performance evaluation carries little discriminating power when nearly everyone is rated highly, which pushes promotion back onto seniority.', ne: 'प्रायः सबैलाई उच्च अङ्क दिइने अवस्थामा कार्यसम्पादन मूल्याङ्कनले छुट्याउने क्षमता गुमाउँछ, फलस्वरूप बढुवा ज्येष्ठतामा फर्किन्छ।' },
          { en: 'Ad hoc and contract appointments outside the Commission’s route, where they grow, hollow out the system from the side.', ne: 'आयोगको बाटो बाहिरका अस्थायी र करार नियुक्ति बढ्दा प्रणाली छेउबाट खोक्रो हुन्छ।' },
          { en: 'Reforms to argue for: rule-based transfer with a minimum tenure, a forced distribution in performance evaluation, competency-based promotion for senior posts, and publication of cluster-wise representation so inclusion can be measured rather than asserted.', ne: 'सुधारका प्रस्ताव: न्यूनतम कार्यकालसहितको नियमबद्ध सरुवा, कार्यसम्पादन मूल्याङ्कनमा बाध्यकारी वितरण, उच्च पदमा दक्षतामा आधारित बढुवा, र समूहगत प्रतिनिधित्वको विवरण प्रकाशन, जसले समावेशिता दाबी नभई मापन योग्य बनाउँछ।' },
        ],
      },
    ],
    conclusion: {
      en: 'Merit and inclusion are not competing principles in Nepal’s scheme: reservation selects among candidates who have already met the standard, so it widens the pool from which competence is drawn. The real threat to merit lies elsewhere — in postings, in undifferentiated performance evaluation, and in appointments that bypass the Commission altogether.',
      ne: 'नेपालको व्यवस्थामा योग्यता र समावेशिता प्रतिस्पर्धी सिद्धान्त होइनन्: आरक्षणले मापदण्ड पुरा गरिसकेका उम्मेदवारमध्येबाट छनोट गर्ने हुँदा यसले सक्षमता खोज्ने दायरा फराकिलो बनाउँछ। योग्यता प्रणालीमाथिको वास्तविक खतरा अन्यत्र छ — पदस्थापनमा, छुट्याउन नसक्ने कार्यसम्पादन मूल्याङ्कनमा, र आयोगलाई छल्ने नियुक्तिमा।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 42, 243 and 285', ne: 'नेपालको संविधान, धारा ४२, २४३ र २८५' },
      { en: 'Civil Service Act 2049 and Civil Service Rules 2050', ne: 'निजामती सेवा ऐन, २०४९ र निजामती सेवा नियमावली, २०५०' },
    ],
  },
  {
    id: 'w-adhikrit-p2-d-1',
    levels: ['adhikrit'],
    paperId: 'adhikrit-p2',
    sectionId: 'adhikrit-p2-d',
    subjectId: 'dev-economy',
    marks: 10,
    minutes: 18,
    prompt: {
      en: 'Describe the stages of Nepal’s federal budget cycle and the legal controls over public expenditure at each stage.',
      ne: 'नेपालको सङ्घीय बजेट चक्रका चरणहरू र प्रत्येक चरणमा सार्वजनिक खर्चमाथि रहेका कानुनी नियन्त्रणको वर्णन गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Four stages: formulation, authorisation, execution, audit and reporting', ne: 'चार चरण: निर्माण, स्वीकृति, कार्यान्वयन, लेखापरीक्षण तथा प्रतिवेदन' },
      { en: 'Article 119 — budget presented by 15 Jestha; Articles 115 to 118 on funds and appropriation', ne: 'धारा ११९ — जेठ १५ मा बजेट पेस; धारा ११५ देखि ११८ कोष र विनियोजनसम्बन्धी' },
      { en: 'Consolidated Fund (Article 116), Contingency Fund (Article 124)', ne: 'सञ्चित कोष (धारा ११६), आकस्मिक कोष (धारा १२४)' },
      { en: 'Financial Procedure and Fiscal Responsibility Act 2076; Public Procurement Act 2063', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६; सार्वजनिक खरिद ऐन, २०६३' },
      { en: 'Medium Term Expenditure Framework and the National Planning Commission’s ceiling', ne: 'मध्यमकालीन खर्च संरचना र राष्ट्रिय योजना आयोगको सीमा' },
      { en: 'Auditor General (Article 241), Public Accounts Committee, internal audit by the Comptroller General’s Office', ne: 'महालेखा परीक्षक (धारा २४१), सार्वजनिक लेखा समिति, महालेखा नियन्त्रक कार्यालयको आन्तरिक लेखापरीक्षण' },
    ],
    intro: {
      en: 'The budget cycle is the yearly sequence by which public money is planned, authorised, spent and accounted for. Its point is that no rupee leaves the Consolidated Fund except on the authority of Parliament and for the purpose Parliament named, and that the spending is later examined by someone the spender does not control.',
      ne: 'बजेट चक्र भन्नाले सार्वजनिक रकमको योजना, स्वीकृति, खर्च र लेखाङ्कन गर्ने वार्षिक क्रम बुझिन्छ। यसको मर्म यो हो कि संसदको अधिकार र संसदले तोकेको प्रयोजनबाहेक सञ्चित कोषबाट एक रुपैयाँ पनि बाहिरिँदैन र खर्च गर्नेको नियन्त्रणमा नरहेको निकायले पछि त्यसको परीक्षण गर्छ।',
    },
    parts: [
      {
        heading: { en: 'Stage 1 — Formulation', ne: 'चरण १ — बजेट निर्माण' },
        points: [
          { en: 'The National Planning Commission issues a budget ceiling and guidelines consistent with the periodic plan and the Medium Term Expenditure Framework.', ne: 'राष्ट्रिय योजना आयोगले आवधिक योजना र मध्यमकालीन खर्च संरचनासँग सङ्गत हुने गरी बजेट सीमा र मार्गदर्शन जारी गर्छ।' },
          { en: 'Ministries prepare programme and project estimates within that ceiling; the Ministry of Finance consolidates revenue and expenditure.', ne: 'मन्त्रालयहरूले त्यो सीमाभित्र कार्यक्रम र आयोजनाको अनुमान तयार गर्छन्; अर्थ मन्त्रालयले राजस्व र खर्चको एकीकरण गर्छ।' },
          { en: 'The Financial Procedure and Fiscal Responsibility Act 2076 requires a project to be in the project bank and appraised before it can carry an allocation — a control against distributing money to unprepared projects.', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ ले विनियोजन पाउनुअघि आयोजना आयोजना बैङ्कमा रहेको र मूल्याङ्कन भएको हुनुपर्ने व्यवस्था गरेको — तयारीविनाका आयोजनामा रकम बाँड्नेविरुद्धको नियन्त्रण।' },
          { en: 'Pre-budget discussion in the federal Parliament, and the constitutional deadline of 15 Jestha under Article 119, discipline the timetable.', ne: 'सङ्घीय संसदमा हुने पूर्व–बजेट छलफल र धारा ११९ को जेठ १५ को संवैधानिक समयसीमाले कार्यतालिकामा अनुशासन कायम गर्छन्।' },
        ],
      },
      {
        heading: { en: 'Stage 2 — Authorisation', ne: 'चरण २ — स्वीकृति' },
        points: [
          { en: 'The Finance Minister presents the Appropriation Bill with the estimates of revenue and expenditure; the Finance Bill carries the tax proposals.', ne: 'अर्थमन्त्रीले राजस्व र व्ययको अनुमानसहित विनियोजन विधेयक पेस गर्छन्; वित्त विधेयकले कर प्रस्ताव बोक्छ।' },
          { en: 'Expenditure charged on the Consolidated Fund under Article 117 is not put to the vote; the rest requires an Appropriation Act under Article 118.', ne: 'धारा ११७ बमोजिम सञ्चित कोषमाथि व्ययभार हुने खर्च मतदानमा राखिँदैन; बाँकीका लागि धारा ११८ अनुसार विनियोजन ऐन आवश्यक हुन्छ।' },
          { en: 'Where the Appropriation Act is not in force in time, a Vote on Account may be taken; a supplementary estimate covers a shortfall arising later.', ne: 'समयमा विनियोजन ऐन लागू नभएमा पेस्की खर्च स्वीकृत गराउन सकिने; पछि देखिने न्यूनता पूरक अनुमानले पूर्ति गर्ने।' },
          { en: 'The Contingency Fund under Article 124 meets an urgent and unforeseen need, and the expenditure is later regularised.', ne: 'धारा १२४ को आकस्मिक कोषले अत्यावश्यक र अप्रत्याशित आवश्यकता पूर्ति गर्छ र त्यो खर्च पछि नियमित गरिन्छ।' },
        ],
      },
      {
        heading: { en: 'Stage 3 — Execution', ne: 'चरण ३ — कार्यान्वयन' },
        points: [
          { en: 'Authority is released by the Ministry of Finance and the Comptroller General’s Office; payment runs through the Treasury Single Account, which keeps idle balances out of scattered bank accounts.', ne: 'अर्थ मन्त्रालय र महालेखा नियन्त्रक कार्यालयले खर्च अधिकार निकासा दिन्छन्; भुक्तानी एकल कोष खाता प्रणालीबाट हुन्छ, जसले छरिएका बैङ्क खातामा निष्क्रिय मौज्दात रहन दिँदैन।' },
          { en: 'Money may be spent only on the purpose appropriated; a transfer between heads is possible only to the extent and by the authority the Appropriation Act allows.', ne: 'रकम विनियोजित प्रयोजनमा मात्र खर्च गर्न पाइने; शीर्षकबीच रकमान्तर विनियोजन ऐनले तोकेको हद र अधिकारीबाट मात्र सम्भव।' },
          { en: 'Procurement of goods, works and services follows the Public Procurement Act 2063 and its Regulations, which fix the method by threshold and require a cost estimate and a written contract.', ne: 'मालसामान, निर्माण कार्य र सेवाको खरिद सार्वजनिक खरिद ऐन, २०६३ र नियमावलीबमोजिम हुन्छ, जसले सीमाअनुसार खरिद विधि तोक्ने र लागत अनुमान तथा लिखित सम्झौता अनिवार्य गर्ने।' },
          { en: 'Internal control operates continuously: the responsible officer certifies the bill, internal audit examines it, and an advance must be cleared before another is drawn.', ne: 'आन्तरिक नियन्त्रण निरन्तर चल्छ: जिम्मेवार अधिकारीले बिल प्रमाणित गर्ने, आन्तरिक लेखापरीक्षणले जाँच्ने, र एक पेस्की फर्स्योट नभएसम्म अर्को नदिइने।' },
        ],
      },
      {
        heading: { en: 'Stage 4 — Audit and reporting', ne: 'चरण ४ — लेखापरीक्षण तथा प्रतिवेदन' },
        points: [
          { en: 'The Comptroller General’s Office prepares the annual consolidated financial statement.', ne: 'महालेखा नियन्त्रक कार्यालयले वार्षिक एकीकृत वित्तीय विवरण तयार गर्छ।' },
          { en: 'Under Article 241 the Auditor General audits every federal, provincial and local body with regard to regularity, economy, efficiency, effectiveness and propriety.', ne: 'धारा २४१ अनुसार महालेखा परीक्षकले सङ्घ, प्रदेश र स्थानीय तहका सबै निकायको नियमितता, मितव्ययिता, कार्यदक्षता, प्रभावकारिता र औचित्यको आधारमा लेखापरीक्षण गर्छन्।' },
          { en: 'The annual report goes to the President and is laid before Parliament, where the Public Accounts Committee examines it and takes evidence from accountable officers.', ne: 'वार्षिक प्रतिवेदन राष्ट्रपतिसमक्ष पेस भई संसदमा राखिन्छ, जहाँ सार्वजनिक लेखा समितिले त्यसको परीक्षण गरी जिम्मेवार अधिकारीबाट प्रमाण लिन्छ।' },
          { en: 'Irregularity that is not settled becomes arrears (beruju), to be cleared, regularised or recovered — and the persistent growth of arrears is the clearest measure of weak execution.', ne: 'फर्स्योट नभएको अनियमितता बेरुजु बन्छ, जो फर्स्योट, नियमित वा असुल गर्नुपर्छ — र बेरुजुको निरन्तर वृद्धि कमजोर कार्यान्वयनको सबैभन्दा स्पष्ट सूचक हो।' },
        ],
      },
    ],
    conclusion: {
      en: 'The cycle is designed so that authority, spending and examination lie in different hands, and Nepal’s law supplies each link. Its practical weaknesses are concentrated at the execution stage — capital spending bunched into the last quarter, procurement delay, and arrears that accumulate faster than they are settled — which is where reform effort earns the most.',
      ne: 'यो चक्र स्वीकृति, खर्च र परीक्षण भिन्न हातमा रहने गरी बनाइएको छ र नेपालको कानुनले प्रत्येक कडी उपलब्ध गराएको छ। यसका व्यावहारिक कमजोरी कार्यान्वयन चरणमा केन्द्रित छन् — पुँजीगत खर्च अन्तिम त्रैमासिकमा थुप्रिने, खरिदमा ढिलाइ, र फर्स्योट हुनेभन्दा छिटो बढ्ने बेरुजु — र सुधारको प्रयास यहीँ सबैभन्दा फलदायी हुन्छ।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 115–119, 124 and 241', ne: 'नेपालको संविधान, धारा ११५–११९, १२४ र २४१' },
      { en: 'Financial Procedure and Fiscal Responsibility Act 2076', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६' },
      { en: 'Public Procurement Act 2063', ne: 'सार्वजनिक खरिद ऐन, २०६३' },
    ],
    freshnessNote: {
      en: 'Quote the current year’s figures for total budget, capital spending and outstanding arrears from the Economic Survey and the Auditor General’s latest annual report — they change every year.',
      ne: 'कुल बजेट, पुँजीगत खर्च र बेरुजुको चालू वर्षको तथ्याङ्क आर्थिक सर्वेक्षण र महालेखा परीक्षकको पछिल्लो वार्षिक प्रतिवेदनबाट उद्धृत गर्नुहोस् — यी हरेक वर्ष फेरिन्छन्।',
    },
  },
];
