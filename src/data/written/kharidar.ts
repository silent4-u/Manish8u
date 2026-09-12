import type { WrittenQuestion } from '../../types';

/**
 * Kharidar, Papers II and III.
 *
 * The Kharidar written papers are the most practical of the three posts: they
 * ask how an office actually runs, so the answers stay concrete — the register
 * that is kept, the form that is filled, the section of the Act that requires
 * it — rather than reaching for theory.
 */
export const KHARIDAR_WRITTEN: WrittenQuestion[] = [
  {
    id: 'w-kharidar-p2-a-1',
    levels: ['kharidar'],
    paperId: 'kharidar-p2',
    sectionId: 'kharidar-p2-a',
    subjectId: 'office-mgmt',
    marks: 10,
    minutes: 15,
    prompt: {
      en: 'What is filing? Explain its objectives, the methods of filing, and the procedure for recording, movement and disposal of a letter in a government office.',
      ne: 'फाइलिङ भन्नाले के बुझिन्छ? यसका उद्देश्य, फाइलिङका विधि, र सरकारी कार्यालयमा पत्रको अभिलेख, चलन तथा फर्स्योटको प्रक्रिया व्याख्या गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Definition: arranging and preserving records so any one of them can be found when needed', ne: 'परिभाषा: आवश्यक पर्दा कुनै पनि अभिलेख भेटाउन सकिने गरी मिलाउने र सुरक्षित राख्ने कार्य' },
      { en: 'Objectives: retrieval, continuity, evidence, accountability, and legal protection', ne: 'उद्देश्य: खोजी, निरन्तरता, प्रमाण, उत्तरदायित्व, र कानुनी संरक्षण' },
      { en: 'Methods: alphabetical, numerical, geographical, subject-wise, chronological, and alpha-numerical', ne: 'विधि: वर्णानुक्रम, संख्यात्मक, भौगोलिक, विषयगत, कालक्रम, र वर्ण–संख्यात्मक' },
      { en: 'Darta (inward register) and chalani (outward register)', ne: 'दर्ता किताब र चलानी किताब' },
      { en: 'Tippani (note sheet), the file cover, and the decision of the competent authority', ne: 'टिप्पणी, फाइलको मुख्य पाना, र सक्षम अधिकारीको निर्णय' },
      { en: 'Disposal and preservation: active, semi-active and dead files; retention period and destruction', ne: 'फर्स्योट र संरक्षण: चालू, अर्धचालू र निष्क्रिय फाइल; राख्नुपर्ने अवधि र नष्ट गर्ने कार्य' },
    ],
    intro: {
      en: 'Filing is the systematic arrangement and safe keeping of an office’s records so that any document can be produced when it is wanted, by someone who did not create it. It is the memory of the office: a decision that cannot be traced to a file is, for practical purposes, a decision the office cannot defend.',
      ne: 'फाइलिङ भन्नाले कार्यालयका अभिलेखलाई व्यवस्थित रूपमा मिलाई सुरक्षित राख्ने कार्य बुझिन्छ, जसले कुनै पनि कागजात आवश्यक परेको बेला त्यो तयार नगर्ने व्यक्तिले पनि निकाल्न सक्छ। यो कार्यालयको स्मृति हो: फाइलमा खोज्न नसकिने निर्णय व्यवहारमा कार्यालयले प्रतिरक्षा गर्न नसक्ने निर्णय हुन्छ।',
    },
    parts: [
      {
        heading: { en: 'Objectives', ne: 'उद्देश्य' },
        points: [
          { en: 'Retrieval — any paper can be found quickly, by anyone, without depending on the memory of one employee.', ne: 'खोजी — कुनै पनि कागज एक कर्मचारीको स्मरणमा भर नपरी कसैले पनि छिटो भेटाउन सक्ने।' },
          { en: 'Continuity — work does not stop when staff are transferred, because the file carries the history.', ne: 'निरन्तरता — कर्मचारी सरुवा हुँदा काम रोकिँदैन, किनभने फाइलले इतिहास बोकेको हुन्छ।' },
          { en: 'Evidence — the file is what is produced before audit, the Public Accounts Committee, the CIAA or a court.', ne: 'प्रमाण — लेखापरीक्षण, सार्वजनिक लेखा समिति, अख्तियार वा अदालतसमक्ष पेस हुने वस्तु फाइल हो।' },
          { en: 'Accountability — it shows who proposed, who recommended and who decided, with the date of each.', ne: 'उत्तरदायित्व — कसले प्रस्ताव गर्‍यो, कसले सिफारिस गर्‍यो र कसले निर्णय गर्‍यो, प्रत्येकको मितिसहित देखाउँछ।' },
          { en: 'Protection of the citizen’s right — a right to information request under the 2064 Act can only be answered from a record that exists.', ne: 'सेवाग्राहीको हकको संरक्षण — २०६४ को ऐनअन्तर्गत सूचनाको माग विद्यमान अभिलेखबाट मात्र पूरा हुन सक्छ।' },
        ],
      },
      {
        heading: { en: 'Methods of filing', ne: 'फाइलिङका विधि' },
        points: [
          { en: 'Alphabetical — by the name of the person or institution; simple and suited to personal files.', ne: 'वर्णानुक्रम — व्यक्ति वा संस्थाको नामअनुसार; सरल र व्यक्तिगत फाइलका लागि उपयुक्त।' },
          { en: 'Numerical — by a serial number given to each file, with an index; suited to a large volume.', ne: 'संख्यात्मक — प्रत्येक फाइललाई दिइएको क्रम संख्याअनुसार, अनुक्रमणिकासहित; ठूलो परिमाणका लागि उपयुक्त।' },
          { en: 'Subject-wise — by the matter dealt with; the usual method in a government office, since work arrives by subject.', ne: 'विषयगत — कारोबारको विषयअनुसार; सरकारी कार्यालयको सामान्य विधि, किनभने काम विषयअनुसार आउँछ।' },
          { en: 'Geographical — by district, province or ward; suited to an office serving a territory.', ne: 'भौगोलिक — जिल्ला, प्रदेश वा वडाअनुसार; क्षेत्र सेवा दिने कार्यालयका लागि उपयुक्त।' },
          { en: 'Chronological — by date; used within a file rather than for the whole system.', ne: 'कालक्रम — मितिअनुसार; पूरै प्रणालीका लागि नभई फाइलभित्र प्रयोग हुने।' },
          { en: 'Alpha-numerical — a combination, for example a subject code with a serial number, which is what most offices use in practice.', ne: 'वर्ण–संख्यात्मक — संयोजन, उदाहरणका लागि विषय सङ्केतसँग क्रम संख्या, जो व्यवहारमा धेरै कार्यालयले प्रयोग गर्छन्।' },
        ],
      },
      {
        heading: { en: 'Procedure — from receipt to decision', ne: 'प्रक्रिया — दर्तादेखि निर्णयसम्म' },
        points: [
          { en: 'Receipt and darta: an incoming letter is received at one point, stamped with the date, and entered in the inward register with a registration number; the number and date are given to the bearer.', ne: 'प्राप्ति र दर्ता: आउने पत्र एकै विन्दुमा प्राप्त गरी मिति छाप लगाई दर्ता किताबमा दर्ता नम्बरसहित अभिलेख गर्ने; नम्बर र मिति बुझाउन आउनेलाई दिने।' },
          { en: 'Marking: the office chief or the section chief marks the letter to the responsible section, with a direction where needed.', ne: 'तोक: कार्यालय प्रमुख वा फाँटवालाले आवश्यक निर्देशनसहित सम्बन्धित फाँटलाई पत्र तोक लगाउने।' },
          { en: 'Filing in the correct file: the letter is placed in the file the subject belongs to, and the file’s page numbering continues so nothing can be inserted later unnoticed.', ne: 'सही फाइलमा राख्ने: विषय पर्ने फाइलमा पत्र राखिने र फाइलको पृष्ठाङ्कन निरन्तर हुने, जसले पछि कुनै कागज थाहै नपाई थप्न नसकियोस्।' },
          { en: 'Tippani: the dealing assistant prepares a note sheet stating the facts, the relevant rule or precedent, the options and a recommendation, and signs and dates it.', ne: 'टिप्पणी: फाँटवालाले तथ्य, सम्बन्धित नियम वा नजिर, विकल्प र सिफारिस उल्लेख गरी टिप्पणी तयार गर्ने र हस्ताक्षर तथा मिति राख्ने।' },
          { en: 'Movement upward: the note goes through the section chief to the competent authority, each adding an opinion on the same sheet rather than on a loose paper.', ne: 'माथि चलन: टिप्पणी फाँट प्रमुखमार्फत सक्षम अधिकारीसमक्ष जाने, प्रत्येकले छुट्टै कागजमा नभई सोही पानामा राय थप्ने।' },
          { en: 'Decision: the competent authority decides within delegated authority, states the ground, and signs with the date — a decision without a reason is defective under the Good Governance Act 2064.', ne: 'निर्णय: सक्षम अधिकारीले प्रत्यायोजित अधिकारभित्र आधार उल्लेख गरी मितिसहित हस्ताक्षर गर्ने — सुशासन ऐन, २०६४ अनुसार कारणविनाको निर्णय त्रुटिपूर्ण हुन्छ।' },
          { en: 'Chalani: the reply is drafted, approved, entered in the outward register with a dispatch number, despatched, and a copy kept on the file.', ne: 'चलानी: जवाफ मस्यौदा गरी स्वीकृत गराउने, चलानी किताबमा चलानी नम्बरसहित अभिलेख गर्ने, पठाउने र प्रतिलिपि फाइलमा राख्ने।' },
        ],
      },
      {
        heading: { en: 'Disposal and preservation', ne: 'फर्स्योट र संरक्षण' },
        points: [
          { en: 'A file on which action is complete is marked as disposed, with the decision and its date recorded on the cover.', ne: 'कारबाही सम्पन्न भएको फाइल निर्णय र मितिसहित मुख्य पानामा अभिलेख गरी फर्स्योट जनाइने।' },
          { en: 'Files are then classified as active, semi-active and dead, and the semi-active and dead moved out of the working cabinet into records.', ne: 'त्यसपछि फाइल चालू, अर्धचालू र निष्क्रियमा वर्गीकृत गरी अर्धचालू र निष्क्रिय फाइल काम गर्ने दराजबाट अभिलेख कक्षमा सारिने।' },
          { en: 'Each class has a retention period; a file may be destroyed only after that period, by a committee, with a list of what was destroyed kept on record.', ne: 'प्रत्येक वर्गको राख्नुपर्ने अवधि हुने; त्यो अवधिपछि मात्र समितिबाट फाइल नष्ट गर्न सकिने र नष्ट गरिएको विवरणको सूची अभिलेखमा राख्नुपर्ने।' },
          { en: 'Permanent records — land, personnel, audit, court cases and agreements — are not destroyed at all.', ne: 'स्थायी अभिलेख — जग्गा, कर्मचारी, लेखापरीक्षण, मुद्दा र सम्झौता — नष्ट गरिँदैनन्।' },
          { en: 'Digital filing does not replace the procedure but records it: scanning a file with the same numbering keeps a copy safe and makes retrieval instant, and a file cannot go missing.', ne: 'विद्युतीय फाइलिङले प्रक्रिया प्रतिस्थापन गर्दैन, अभिलेख गर्छ: उही अङ्कनसहित फाइल स्क्यान गर्दा प्रतिलिपि सुरक्षित रहन्छ, खोजी तुरुन्त हुन्छ र फाइल हराउन सक्दैन।' },
        ],
      },
    ],
    conclusion: {
      en: 'Filing looks clerical and is in fact the foundation of accountability: the darta number proves when a citizen applied, the tippani shows on what ground the decision was taken, and the chalani proves the reply went out. An office that files well can answer audit, the Commission and the citizen from the same record — which is why the register, and not the memory, must be the office’s authority.',
      ne: 'फाइलिङ कार्यालयको सामान्य काम देखिन्छ, वास्तवमा उत्तरदायित्वको जग हो: दर्ता नम्बरले सेवाग्राहीले कहिले निवेदन दिएको थियो प्रमाणित गर्छ, टिप्पणीले कुन आधारमा निर्णय भयो देखाउँछ, र चलानीले जवाफ पठाइएको प्रमाणित गर्छ। राम्रो फाइलिङ गर्ने कार्यालय लेखापरीक्षण, आयोग र सेवाग्राही तीनैलाई एउटै अभिलेखबाट जवाफ दिन सक्छ — यसैले कार्यालयको प्रमाण स्मरण नभई किताब हुनुपर्छ।',
    },
    authorities: [
      { en: 'Good Governance (Management and Operation) Act 2064', ne: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४' },
      { en: 'Right to Information Act 2064', ne: 'सूचनाको हक सम्बन्धी ऐन, २०६४' },
    ],
  },
  {
    id: 'w-kharidar-p2-b-1',
    levels: ['kharidar'],
    paperId: 'kharidar-p2',
    sectionId: 'kharidar-p2-b',
    subjectId: 'constitution',
    marks: 5,
    minutes: 8,
    prompt: {
      en: 'What are the duties of a citizen under the Constitution of Nepal? Explain why civic duty matters alongside fundamental rights.',
      ne: 'नेपालको संविधानअनुसार नागरिकका कर्तव्य के के हुन्? मौलिक हकसँगै नागरिक कर्तव्यको महत्त्व व्याख्या गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Article 48 lists the duties of the citizen', ne: 'धारा ४८ ले नागरिकका कर्तव्य उल्लेख गरेको' },
      { en: 'Safeguard the nationality, sovereignty and integrity of Nepal', ne: 'नेपालको राष्ट्रियता, सार्वभौमसत्ता र अखण्डताको रक्षा गर्नु' },
      { en: 'Abide by the Constitution and the law', ne: 'संविधान र कानुनको पालना गर्नु' },
      { en: 'Render compulsory service when the State so requires', ne: 'राज्यले चाहेको बखत अनिवार्य सेवा गर्नु' },
      { en: 'Protect and preserve public property', ne: 'सार्वजनिक सम्पत्तिको संरक्षण र जगेर्ना गर्नु' },
      { en: 'Rights and duties are reciprocal: a right claimed against the State is sustained by duties owed to it', ne: 'हक र कर्तव्य परस्पर सम्बन्धित: राज्यविरुद्ध दाबी गरिने हक राज्यप्रतिका कर्तव्यले टेवा पाउँछ' },
    ],
    intro: {
      en: 'Part 3 of the Constitution guarantees fundamental rights, and Article 48 sets against them the duties of a citizen. The arrangement is deliberate: the same document that entitles a person to claim against the State states what the State may expect in return.',
      ne: 'संविधानको भाग ३ ले मौलिक हक प्रत्याभूत गर्छ र धारा ४८ ले त्यसकै सामु नागरिकका कर्तव्य राख्छ। यो व्यवस्था जानाजान गरिएको हो: जुन दस्तावेजले व्यक्तिलाई राज्यविरुद्ध दाबी गर्ने अधिकार दिन्छ, त्यही दस्तावेजले राज्यले बदलामा के अपेक्षा गर्न सक्छ पनि उल्लेख गर्छ।',
    },
    parts: [
      {
        heading: { en: 'Duties under Article 48', ne: 'धारा ४८ अन्तर्गतका कर्तव्य' },
        points: [
          { en: 'To safeguard the nationality, sovereignty and integrity of Nepal while being loyal to the nation.', ne: 'राष्ट्रप्रति निष्ठावान् रही नेपालको राष्ट्रियता, सार्वभौमसत्ता र अखण्डताको रक्षा गर्नु।' },
          { en: 'To abide by the Constitution and the law.', ne: 'संविधान र कानुनको पालना गर्नु।' },
          { en: 'To render compulsory service as and when the State so requires.', ne: 'राज्यले आवश्यक ठानेको बखत अनिवार्य सेवा गर्नु।' },
          { en: 'To protect and preserve public property.', ne: 'सार्वजनिक सम्पत्तिको संरक्षण र जगेर्ना गर्नु।' },
        ],
      },
      {
        heading: { en: 'Why duty matters alongside rights', ne: 'हकसँगै कर्तव्यको महत्त्व' },
        points: [
          { en: 'Rights have a cost: free basic education, health care and social security are financed by taxes a citizen has a duty to pay honestly.', ne: 'हकको लागत हुन्छ: निःशुल्क आधारभूत शिक्षा, स्वास्थ्य सेवा र सामाजिक सुरक्षा नागरिकले इमानदारीपूर्वक तिर्नुपर्ने करबाट वित्त पोषित हुन्छन्।' },
          { en: 'One person’s right is bounded by another’s: the freedom of expression under Article 17 does not extend to an act that undermines another’s dignity or public order.', ne: 'एकको हक अर्काको हकले सीमित हुन्छ: धारा १७ को अभिव्यक्ति स्वतन्त्रताले अर्काको मर्यादा वा सार्वजनिक शान्ति भङ्ग गर्ने कार्यसम्म विस्तार पाउँदैन।' },
          { en: 'Public property protected is public service delivered: a damaged school, drinking-water pipe or health post is a right withdrawn from the whole community.', ne: 'सार्वजनिक सम्पत्तिको संरक्षण भनेको सार्वजनिक सेवाको प्रवाह हो: क्षति भएको विद्यालय, खानेपानीको पाइप वा स्वास्थ्य चौकी सिङ्गो समुदायबाट खोसिएको हक हो।' },
          { en: 'Obeying the law is what makes the right enforceable for others too — a court order is worth nothing in a society where compliance is optional.', ne: 'कानुनको पालनाले अरूका लागि पनि हक कार्यान्वयनयोग्य बनाउँछ — पालना स्वैच्छिक भएको समाजमा अदालतको आदेशको कुनै मूल्य रहँदैन।' },
          { en: 'Beyond Article 48, Part 4 sets duties on the State, so the Constitution binds both sides rather than only the citizen.', ne: 'धारा ४८ बाहेक भाग ४ ले राज्यमाथि कर्तव्य तोक्छ, त्यसैले संविधानले नागरिकलाई मात्र नभई दुवै पक्षलाई बाँध्छ।' },
        ],
      },
    ],
    conclusion: {
      en: 'Article 48 is short, but it states the condition on which the rights in Part 3 are actually enjoyed: a constitutional order is a mutual undertaking, and a citizen who pays tax, obeys the law and protects public property is what makes another citizen’s right more than words on paper.',
      ne: 'धारा ४८ छोटो छ, तर भाग ३ का हक वास्तवमा उपभोग हुने सर्त यही धाराले उल्लेख गर्छ: संवैधानिक व्यवस्था पारस्परिक प्रतिबद्धता हो, र कर तिर्ने, कानुन पालना गर्ने र सार्वजनिक सम्पत्तिको संरक्षण गर्ने नागरिकले नै अर्को नागरिकको हकलाई कागजको अक्षरभन्दा बढी बनाउँछ।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Article 48; Part 3 and Part 4', ne: 'नेपालको संविधान, धारा ४८; भाग ३ र भाग ४' },
    ],
  },
  {
    id: 'w-kharidar-p2-c-1',
    levels: ['kharidar'],
    paperId: 'kharidar-p2',
    sectionId: 'kharidar-p2-c',
    subjectId: 'maths',
    marks: 5,
    minutes: 8,
    prompt: {
      en: 'A shopkeeper marks an article 25 per cent above its cost of Rs 2,000 and sells it at a discount of 12 per cent on the marked price. Find the selling price and the profit per cent. If 13 per cent VAT is then charged on the selling price, how much does the customer pay?',
      ne: 'एक पसलेले रु. २,००० लागत पर्ने वस्तुको अङ्कित मूल्य लागतभन्दा २५ प्रतिशत बढी राखी अङ्कित मूल्यमा १२ प्रतिशत छुट दिई बेच्छ। बिक्री मूल्य र नाफा प्रतिशत निकाल्नुहोस्। बिक्री मूल्यमा १३ प्रतिशत मूल्य अभिवृद्धि कर लाग्ने भए ग्राहकले कति तिर्नुपर्छ?',
    },
    keyPoints: [
      { en: 'Marked price = cost + 25 per cent of cost', ne: 'अङ्कित मूल्य = लागत + लागतको २५ प्रतिशत' },
      { en: 'Discount is calculated on the marked price, never on the cost', ne: 'छुट अङ्कित मूल्यमा गणना हुन्छ, लागतमा कहिल्यै होइन' },
      { en: 'Selling price = marked price − discount', ne: 'बिक्री मूल्य = अङ्कित मूल्य − छुट' },
      { en: 'Profit per cent = (profit ÷ cost) × 100, always on the cost price', ne: 'नाफा प्रतिशत = (नाफा ÷ लागत) × १००, सधैं लागत मूल्यमा' },
      { en: 'VAT is added to the selling price, so it is the customer’s cost and not the shopkeeper’s income', ne: 'मूल्य अभिवृद्धि कर बिक्री मूल्यमा थपिन्छ, त्यसैले यो ग्राहकको लागत हो, पसलेको आय होइन' },
    ],
    intro: {
      en: 'Work the problem in the order the transaction happens — cost, then marked price, then discount, then selling price, then VAT — and be careful which base each percentage is taken on. Losing a mark here almost always means taking a percentage on the wrong base.',
      ne: 'कारोबार हुने क्रममै हल गर्नुहोस् — लागत, अङ्कित मूल्य, छुट, बिक्री मूल्य, त्यसपछि मूल्य अभिवृद्धि कर — र प्रत्येक प्रतिशत कुन आधारमा लिइँदैछ ध्यान दिनुहोस्। यहाँ अङ्क गुम्नु प्रायः गलत आधारमा प्रतिशत लिएकै कारण हुन्छ।',
    },
    parts: [
      {
        heading: { en: 'Step 1 — Marked price', ne: 'चरण १ — अङ्कित मूल्य' },
        points: [
          { en: 'Cost price = Rs 2,000.', ne: 'लागत मूल्य = रु. २,०००।' },
          { en: 'Marked price = 2,000 + 25% of 2,000 = 2,000 + 500 = Rs 2,500.', ne: 'अङ्कित मूल्य = २,००० + २,००० को २५% = २,००० + ५०० = रु. २,५००।' },
        ],
      },
      {
        heading: { en: 'Step 2 — Discount and selling price', ne: 'चरण २ — छुट र बिक्री मूल्य' },
        points: [
          { en: 'Discount = 12% of the marked price = 12% of 2,500 = Rs 300.', ne: 'छुट = अङ्कित मूल्यको १२% = २,५०० को १२% = रु. ३००।' },
          { en: 'Selling price = 2,500 − 300 = Rs 2,200.', ne: 'बिक्री मूल्य = २,५०० − ३०० = रु. २,२००।' },
        ],
      },
      {
        heading: { en: 'Step 3 — Profit per cent', ne: 'चरण ३ — नाफा प्रतिशत' },
        points: [
          { en: 'Profit = selling price − cost price = 2,200 − 2,000 = Rs 200.', ne: 'नाफा = बिक्री मूल्य − लागत मूल्य = २,२०० − २,००० = रु. २००।' },
          { en: 'Profit per cent = (200 ÷ 2,000) × 100 = 10 per cent.', ne: 'नाफा प्रतिशत = (२०० ÷ २,०००) × १०० = १० प्रतिशत।' },
        ],
      },
      {
        heading: { en: 'Step 4 — VAT and the amount payable', ne: 'चरण ४ — मूल्य अभिवृद्धि कर र तिर्नुपर्ने रकम' },
        points: [
          { en: 'VAT = 13% of the selling price = 13% of 2,200 = Rs 286.', ne: 'मूल्य अभिवृद्धि कर = बिक्री मूल्यको १३% = २,२०० को १३% = रु. २८६।' },
          { en: 'Amount the customer pays = 2,200 + 286 = Rs 2,486.', ne: 'ग्राहकले तिर्नुपर्ने रकम = २,२०० + २८६ = रु. २,४८६।' },
        ],
      },
      {
        heading: { en: 'Checks worth making', ne: 'जाँच गर्नुपर्ने कुरा' },
        points: [
          { en: 'The discount must be taken on 2,500 and not on 2,000 — that is the commonest error in this type.', ne: 'छुट २,००० मा नभई २,५०० मा लिनुपर्छ — यो प्रकारको सबैभन्दा सामान्य त्रुटि यही हो।' },
          { en: 'Profit per cent is on the cost price, so the divisor is 2,000, not 2,200.', ne: 'नाफा प्रतिशत लागत मूल्यमा हुन्छ, त्यसैले भाजक २,२०० नभई २,००० हो।' },
          { en: 'VAT is not the shopkeeper’s profit: the shop collects Rs 286 and deposits it with the Inland Revenue Office.', ne: 'मूल्य अभिवृद्धि कर पसलेको नाफा होइन: पसलले रु. २८६ सङ्कलन गरी आन्तरिक राजस्व कार्यालयमा दाखिला गर्छ।' },
          { en: 'Show the unit (Rs) and the per cent sign in each step; a correct number without its unit loses marks.', ne: 'प्रत्येक चरणमा इकाई (रु.) र प्रतिशत चिह्न देखाउनुहोस्; इकाईविनाको सही संख्याले अङ्क गुमाउँछ।' },
        ],
      },
    ],
    conclusion: {
      en: 'Selling price Rs 2,200, profit 10 per cent, and the customer pays Rs 2,486 including Rs 286 of VAT. State the three answers separately at the end, because the question asked three things.',
      ne: 'बिक्री मूल्य रु. २,२००, नाफा १० प्रतिशत, र ग्राहकले रु. २८६ मूल्य अभिवृद्धि करसहित रु. २,४८६ तिर्नुपर्छ। प्रश्नले तीन कुरा सोधेको हुँदा अन्त्यमा तीनै उत्तर छुट्टाछुट्टै उल्लेख गर्नुहोस्।',
    },
  },
  {
    id: 'w-kharidar-p3-a-1',
    levels: ['kharidar'],
    paperId: 'kharidar-p3',
    sectionId: 'kharidar-p3-a',
    subjectId: 'governance',
    marks: 10,
    minutes: 15,
    prompt: {
      en: 'Explain the meaning of public service delivery, the problems a service-seeker faces in a Nepali government office, and the measures that would improve delivery at the counter.',
      ne: 'सार्वजनिक सेवा प्रवाहको अर्थ व्याख्या गर्नुहोस्, नेपालको सरकारी कार्यालयमा सेवाग्राहीले भोग्ने समस्या उल्लेख गर्दै काउन्टरमै सेवा प्रवाह सुधार्ने उपाय बताउनुहोस्।',
    },
    keyPoints: [
      { en: 'Definition: the actual handing over of a service the State has undertaken to provide', ne: 'परिभाषा: राज्यले दिने प्रतिबद्धता जनाएको सेवा वास्तवमै हस्तान्तरण हुने कार्य' },
      { en: 'Problems: delay, repeated visits, unclear requirements, informal payment, discretion, inaccessible office', ne: 'समस्या: ढिलाइ, बारम्बार धाउनुपर्ने, अस्पष्ट सर्त, अनौपचारिक भुक्तानी, स्वविवेक, पहुँचविहीन कार्यालय' },
      { en: 'Causes: centralised authority, staff absence, paper-only records, no measurement of the citizen’s wait', ne: 'कारण: केन्द्रीकृत अधिकार, कर्मचारीको अनुपस्थिति, कागजमात्रको अभिलेख, सेवाग्राहीको प्रतीक्षा मापन नहुनु' },
      { en: 'Measures: citizen charter enforced, one-door service, delegation, digitisation, help desk, grievance handling', ne: 'उपाय: बडापत्रको कार्यान्वयन, एकद्वार सेवा, प्रत्यायोजन, डिजिटलीकरण, सहायता कक्ष, गुनासो व्यवस्थापन' },
      { en: 'Legal basis: Good Governance Act 2064, Right to Information Act 2064, Local Government Operation Act 2074', ne: 'कानुनी आधार: सुशासन ऐन, २०६४, सूचनाको हक सम्बन्धी ऐन, २०६४, स्थानीय सरकार सञ्चालन ऐन, २०७४' },
      { en: 'Accessibility: senior citizens, persons with disability, women, and those who cannot read the form', ne: 'पहुँच: ज्येष्ठ नागरिक, अपाङ्गता भएका व्यक्ति, महिला, र फाराम पढ्न नसक्ने सेवाग्राही' },
    ],
    intro: {
      en: 'Public service delivery is the point at which policy becomes real for a citizen: not the Act, the budget or the plan, but the recommendation issued, the certificate handed over, the registration completed. It is measured from the citizen’s side — how long the wait was and how many visits it took — rather than from the office’s.',
      ne: 'सार्वजनिक सेवा प्रवाह नागरिकका लागि नीति साकार बन्ने विन्दु हो: ऐन, बजेट वा योजना नभई जारी भएको सिफारिस, हातमा परेको प्रमाणपत्र, सम्पन्न भएको दर्ता। यसको मापन कार्यालयको तर्फबाट नभई सेवाग्राहीको तर्फबाट हुन्छ — कति प्रतीक्षा गर्नुपर्‍यो र कतिपटक धाउनुपर्‍यो।',
    },
    parts: [
      {
        heading: { en: 'Problems a service-seeker faces', ne: 'सेवाग्राहीले भोग्ने समस्या' },
        points: [
          { en: 'Repeated visits: a requirement not stated at the first visit sends the applicant home for another document, which is the single most common complaint.', ne: 'बारम्बार धाउनु: पहिलो भेटमा नबताइएको सर्तले निवेदकलाई अर्को कागजातका लागि फर्काउने — यो सबैभन्दा सामान्य गुनासो हो।' },
          { en: 'Delay beyond the published time limit, with no explanation and nobody named as responsible for it.', ne: 'प्रकाशित समयसीमाभन्दा ढिलाइ, स्पष्टीकरणविना र त्यसका लागि कोही जिम्मेवार नतोकिएको।' },
          { en: 'Informal payment demanded or implied where the fee is unclear or the discretion is wide.', ne: 'दस्तुर अस्पष्ट वा स्वविवेक फराकिलो भएको ठाउँमा माग गरिने वा सङ्केत गरिने अनौपचारिक भुक्तानी।' },
          { en: 'Staff absence: the one officer who can sign is on leave, in a meeting or in the district headquarters, and the work waits for a person rather than a post.', ne: 'कर्मचारीको अनुपस्थिति: हस्ताक्षर गर्न सक्ने एक जना कर्मचारी बिदामा, बैठकमा वा जिल्ला सदरमुकाममा हुने, र काम पद नभई व्यक्तिको प्रतीक्षामा रहने।' },
          { en: 'Physical inaccessibility: an office on an upper floor without a ramp, a counter at standing height, and no seating for those waiting.', ne: 'भौतिक पहुँचको अभाव: र्‍याम्पविना माथिल्लो तलाको कार्यालय, उभिएर मात्र पुग्ने काउन्टर, र प्रतीक्षा गर्नेका लागि बस्ने व्यवस्था नहुनु।' },
          { en: 'Language and literacy: forms in official register that a first-time applicant cannot complete unaided.', ne: 'भाषा र साक्षरता: पहिलोपटक आउने निवेदकले सहयोगविना भर्न नसक्ने कार्यालयीय भाषाका फाराम।' },
          { en: 'No feedback loop: a grievance either has nowhere to go or goes to the same officer complained about.', ne: 'प्रतिक्रियाको बाटो नहुनु: गुनासो कतै जाने ठाउँ नहुने वा उजुरी परेकै कर्मचारीसमक्ष पुग्ने।' },
        ],
      },
      {
        heading: { en: 'Why it happens', ne: 'यसो हुनुका कारण' },
        points: [
          { en: 'Authority concentrated at the top of the office, so a routine matter travels up and back.', ne: 'अधिकार कार्यालयको शिखरमा केन्द्रित, फलस्वरूप नियमित विषय माथि गई फर्किनुपर्ने।' },
          { en: 'Records kept only on paper, so a lost file means starting again and a duplicate cannot be issued quickly.', ne: 'अभिलेख कागजमा मात्र, त्यसैले फाइल हराउँदा फेरि सुरु गर्नुपर्ने र प्रतिलिपि छिटो जारी हुन नसक्ने।' },
          { en: 'The citizen’s waiting time is never measured, so nobody is accountable for a number nobody records.', ne: 'सेवाग्राहीको प्रतीक्षा समय कहिल्यै मापन नहुने, त्यसैले कसैले अभिलेख नराख्ने सङ्ख्याप्रति कोही जवाफदेही हुँदैन।' },
          { en: 'Staffing does not match the load: a busy counter and a quiet section carry the same number of hands.', ne: 'कर्मचारी व्यवस्था कार्यभारअनुसार नहुनु: व्यस्त काउन्टर र सुस्त फाँटमा उही संख्याको कर्मचारी।' },
          { en: 'Federal transition left some services uncertain as to which tier issues them, and the citizen absorbs the uncertainty.', ne: 'सङ्घीय सङ्क्रमणले केही सेवा कुन तहले दिने हो अनिश्चित बनाएको र त्यो अनिश्चितता सेवाग्राहीले भोग्नुपरेको।' },
        ],
      },
      {
        heading: { en: 'Measures at the counter', ne: 'काउन्टरमै गर्न सकिने उपाय' },
        points: [
          { en: 'Enforce the citizen charter: publish the documents, fee, time limit and responsible post for each service, and record the date of registration on the applicant’s copy so the clock is visible to both sides.', ne: 'नागरिक बडापत्र कार्यान्वयन गर्ने: प्रत्येक सेवाका लागि कागजात, दस्तुर, समयसीमा र जिम्मेवार पद सार्वजनिक गर्ने, र निवेदकको प्रतिलिपिमा दर्ता मिति उल्लेख गर्ने, जसले समय दुवै पक्षलाई देखियोस्।' },
          { en: 'One-door service: a single counter that receives every application, so the applicant does not tour the sections.', ne: 'एकद्वार सेवा: सबै निवेदन लिने एउटै काउन्टर, जसले निवेदकलाई फाँट–फाँट घुम्नु नपरोस्।' },
          { en: 'A help desk with printed checklists and a sample filled form, and a staff member to assist those who cannot read the form.', ne: 'छापिएको कागजात सूची र नमुना भरिएको फाराम राखिएको सहायता कक्ष, र फाराम पढ्न नसक्नेलाई सहयोग गर्ने कर्मचारी।' },
          { en: 'Delegate the routine decision downward with a written financial and functional ceiling, so a signature does not depend on one person being present.', ne: 'लिखित वित्तीय र कार्यगत सीमासहित नियमित निर्णय तल प्रत्यायोजन गर्ने, जसले हस्ताक्षर एक व्यक्तिको उपस्थितिमा भर नपरोस्।' },
          { en: 'Digitise the register and the certificate: an electronic record makes a duplicate immediate, a search instant, and a missing file impossible.', ne: 'किताब र प्रमाणपत्र डिजिटल बनाउने: विद्युतीय अभिलेखले प्रतिलिपि तत्काल, खोजी तुरुन्त र फाइल हराउनु असम्भव बनाउँछ।' },
          { en: 'Make the office physically usable: a ramp, a seated counter, a waiting bench, drinking water, and a separate queue for senior citizens, pregnant women and persons with disability.', ne: 'कार्यालयलाई भौतिक रूपमा उपयोगी बनाउने: र्‍याम्प, बसेर काम गर्न मिल्ने काउन्टर, प्रतीक्षा बेन्च, खानेपानी, र ज्येष्ठ नागरिक, गर्भवती महिला तथा अपाङ्गता भएका व्यक्तिका लागि छुट्टै पालो।' },
          { en: 'Take grievances seriously: a register, a named officer who is not the one complained about, a written reply, and a monthly summary put before the office chief.', ne: 'गुनासोलाई गम्भीरतापूर्वक लिने: गुनासो किताब, उजुरी परेको बाहेकको तोकिएको अधिकारी, लिखित जवाफ, र कार्यालय प्रमुखसमक्ष पेस हुने मासिक सारांश।' },
          { en: 'Measure and publish: count applications received, disposed within the time limit and pending, and display the month’s figures at the entrance.', ne: 'मापन र प्रकाशन: प्राप्त, समयसीमाभित्र फर्स्योट भएका र बाँकी निवेदनको गणना गरी महिनाको तथ्याङ्क प्रवेशद्वारमा राख्ने।' },
        ],
      },
    ],
    conclusion: {
      en: 'Most of what frustrates a service-seeker in Nepal is fixable inside the office and without new money: a complete checklist at the first visit, a signature that does not wait for one person, a register that cannot lose a file, and a recorded date that makes delay visible. Publishing the office’s own performance against its charter is the single change that would make the rest follow.',
      ne: 'नेपालमा सेवाग्राहीलाई दिक्क बनाउने धेरैजसो कुरा कार्यालयभित्रै र नयाँ रकमविना सुधार्न सकिन्छ: पहिलो भेटमै पूर्ण कागजात सूची, एक व्यक्तिको प्रतीक्षा नगर्ने हस्ताक्षर, फाइल हराउन नसक्ने किताब, र ढिलाइ देखाउने अभिलेखित मिति। कार्यालयको आफ्नै बडापत्रविरुद्धको कार्यसम्पादन सार्वजनिक गर्नु त्यो एक परिवर्तन हो, जसले बाँकी सबै पछ्याउन बाध्य बनाउँछ।',
    },
    authorities: [
      { en: 'Good Governance (Management and Operation) Act 2064', ne: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४' },
      { en: 'Local Government Operation Act 2074; Right to Information Act 2064', ne: 'स्थानीय सरकार सञ्चालन ऐन, २०७४; सूचनाको हक सम्बन्धी ऐन, २०६४' },
    ],
  },
  {
    id: 'w-kharidar-p3-b-1',
    levels: ['kharidar'],
    paperId: 'kharidar-p3',
    sectionId: 'kharidar-p3-b',
    subjectId: 'office-mgmt',
    marks: 10,
    minutes: 15,
    prompt: {
      en: 'Explain the methods of public procurement under the Public Procurement Act 2063, and the duties of the procuring office in each.',
      ne: 'सार्वजनिक खरिद ऐन, २०६३ अन्तर्गतका खरिद विधि र प्रत्येकमा खरिद गर्ने कार्यालयको कर्तव्य व्याख्या गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Purpose of the Act: economy, efficiency, competition, transparency and accountability in public purchase', ne: 'ऐनको उद्देश्य: सार्वजनिक खरिदमा मितव्ययिता, कार्यदक्षता, प्रतिस्पर्धा, पारदर्शिता र उत्तरदायित्व' },
      { en: 'Methods: open (national and international) bidding, sealed quotation, direct purchase, force account, participation of users’ committee, and framework agreement', ne: 'विधि: खुला (राष्ट्रिय र अन्तर्राष्ट्रिय) बोलपत्र, सिलबन्दी दरभाउपत्र, सोझै खरिद, अमानत, उपभोक्ता समितिको सहभागिता, र आधारभूत सम्झौता' },
      { en: 'Method is chosen by the threshold in the Regulations, not by convenience', ne: 'विधि सहजताको आधारमा नभई नियमावलीको सीमाअनुसार छनोट हुने' },
      { en: 'Before purchase: annual procurement plan, master procurement plan, cost estimate, specification', ne: 'खरिदअघि: वार्षिक खरिद योजना, गुरुयोजना, लागत अनुमान, स्पेसिफिकेशन' },
      { en: 'During: notice period, bid security, evaluation committee, no splitting to avoid a method', ne: 'खरिदको क्रममा: सूचनाको अवधि, बोलपत्र जमानत, मूल्याङ्कन समिति, विधि छल्न टुक्रा नपार्ने' },
      { en: 'After: written contract, performance security, measurement, quality test, and payment on certified work', ne: 'खरिदपछि: लिखित सम्झौता, कार्यसम्पादन जमानत, नापजाँच, गुणस्तर परीक्षण, र प्रमाणित कामको भुक्तानी' },
    ],
    intro: {
      en: 'Public procurement is the purchase of goods, construction work and consulting or other services with public money. The Public Procurement Act 2063 and its Regulations exist because the buyer is spending someone else’s money: competition, a written record and a fixed method substitute for the self-interest that disciplines a private purchaser.',
      ne: 'सार्वजनिक खरिद भन्नाले सार्वजनिक रकमबाट मालसामान, निर्माण कार्य र परामर्श तथा अन्य सेवाको खरिद बुझिन्छ। सार्वजनिक खरिद ऐन, २०६३ र नियमावली यसकारण छन् कि खरिदकर्ता अर्काको रकम खर्च गर्दैछ: निजी खरिदकर्ताको अनुशासन कायम राख्ने स्वार्थको ठाउँमा यहाँ प्रतिस्पर्धा, लिखित अभिलेख र निर्धारित विधिले काम गर्छन्।',
    },
    parts: [
      {
        heading: { en: 'Before any purchase', ne: 'खरिद गर्नुअघि' },
        points: [
          { en: 'Prepare an annual procurement plan, and a master procurement plan where the value crosses the prescribed threshold.', ne: 'वार्षिक खरिद योजना तयार गर्ने, र मूल्य तोकिएको सीमा नाघेमा खरिद गुरुयोजना पनि बनाउने।' },
          { en: 'Prepare a cost estimate and a specification that describes the requirement without naming a brand, so competition is real.', ne: 'ब्रान्डको नाम नलिई आवश्यकता वर्णन गर्ने लागत अनुमान र स्पेसिफिकेशन तयार गर्ने, जसले प्रतिस्पर्धा वास्तविक बनोस्।' },
          { en: 'Confirm the budget head and the released authority; no procurement may begin against an appropriation that does not exist.', ne: 'बजेट शीर्षक र निकासा भएको अधिकार पुष्टि गर्ने; नभएको विनियोजनविरुद्ध खरिद सुरु गर्न नपाइने।' },
          { en: 'Never split a requirement into smaller packages in order to fall below a threshold and use an easier method — the Act treats that as an avoidance of competition.', ne: 'सजिलो विधि प्रयोग गर्न सीमाभन्दा तल झार्ने उद्देश्यले आवश्यकता साना प्याकेजमा टुक्रा नपार्ने — ऐनले त्यसलाई प्रतिस्पर्धा छल्ने कार्य मान्छ।' },
        ],
      },
      {
        heading: { en: 'The methods', ne: 'खरिद विधि' },
        points: [
          { en: 'Open bidding — the default for a value above the prescribed threshold: a public notice, the full notice period, bid security, a sealed bid opened publicly, and evaluation by a committee against the criteria in the bid document. International bidding where domestic capacity is insufficient.', ne: 'खुला बोलपत्र — तोकिएको सीमाभन्दा माथिको मूल्यमा सामान्य विधि: सार्वजनिक सूचना, पूर्ण सूचना अवधि, बोलपत्र जमानत, सार्वजनिक रूपमा खोलिने सिलबन्दी बोलपत्र, र बोलपत्र कागजातका मापदण्डअनुसार समितिबाट मूल्याङ्कन। स्वदेशी क्षमता अपर्याप्त भएमा अन्तर्राष्ट्रिय बोलपत्र।' },
          { en: 'Sealed quotation — for a middling value: quotations invited from a reasonable number of suppliers, opened together and recorded, with the lowest substantially responsive accepted.', ne: 'सिलबन्दी दरभाउपत्र — मध्यम मूल्यका लागि: उचित संख्याका आपूर्तिकर्ताबाट दरभाउ आह्वान, एकैसाथ खोली अभिलेख, र सारभूत रूपमा योग्य न्यूनतम स्वीकृत।' },
          { en: 'Direct purchase — only for a small value fixed by the Regulations, or for a proprietary item, spare part or a genuine emergency, and the ground must be recorded in writing.', ne: 'सोझै खरिद — नियमावलीले तोकेको सानो मूल्य, एकल स्वामित्वको वस्तु, स्पेयर पार्ट वा वास्तविक आपत्कालका लागि मात्र, र आधार लिखित रूपमा अभिलेख गर्नुपर्ने।' },
          { en: 'Force account (amanat) — work done by the office’s own labour and equipment, where it is more economical or no contractor is available, with the same measurement and record as a contract.', ne: 'अमानत — कार्यालयको आफ्नै श्रम र उपकरणबाट गरिने काम, जहाँ मितव्ययी हुने वा निर्माण व्यवसायी उपलब्ध नहुने; ठेक्कासरहको नापजाँच र अभिलेख अनिवार्य।' },
          { en: 'Participation of a users’ committee — for a community work of limited value, executed by the beneficiary committee rather than a contractor, with no heavy equipment and with the agreement, estimate and public audit on record.', ne: 'उपभोक्ता समितिको सहभागिता — सीमित मूल्यको सामुदायिक कामका लागि, निर्माण व्यवसायी नभई लाभग्राही समितिबाट सञ्चालन, भारी उपकरण प्रयोग नगरी, र सम्झौता, लागत अनुमान तथा सार्वजनिक परीक्षण अभिलेखमा राखी।' },
          { en: 'Framework agreement — where the same item is needed repeatedly: rates are fixed by competition once, and orders are placed against them as required.', ne: 'आधारभूत सम्झौता — एउटै वस्तु बारम्बार आवश्यक पर्ने अवस्थामा: प्रतिस्पर्धाबाट एकपटक दर निर्धारण गरी आवश्यकताअनुसार खरिद आदेश दिने।' },
          { en: 'Consulting services follow their own route — expression of interest, a short list, and evaluation on quality and cost rather than on price alone.', ne: 'परामर्श सेवाको छुट्टै बाटो हुन्छ — आशयपत्र, संक्षिप्त सूची, र मूल्यमात्र नभई गुणस्तर र लागत दुवैको आधारमा मूल्याङ्कन।' },
        ],
      },
      {
        heading: { en: 'Duties during and after selection', ne: 'छनोटको क्रममा र त्यसपछिका कर्तव्य' },
        points: [
          { en: 'Give the full notice period and publish in the prescribed manner, including the procurement portal — a shortened notice is the commonest ground on which an award is set aside.', ne: 'पूर्ण सूचना अवधि दिने र खरिद पोर्टलसहित तोकिएको माध्यममा प्रकाशन गर्ने — छोटो सूचना अवधि ठेक्का बदर हुने सबैभन्दा सामान्य आधार हो।' },
          { en: 'Evaluate through a committee, on the criteria stated in the bid document and nothing else, and record the reason for rejecting a bid.', ne: 'समितिबाट, बोलपत्र कागजातमा उल्लिखित मापदण्डमा मात्र मूल्याङ्कन गर्ने, र बोलपत्र अस्वीकृत गर्नुको कारण अभिलेख गर्ने।' },
          { en: 'Hear a complaint within the period the Act allows, and do not sign the contract while a review is pending.', ne: 'ऐनले तोकेको अवधिभित्र उजुरी सुन्ने, र पुनरावलोकन विचाराधीन रहेको अवस्थामा सम्झौता नगर्ने।' },
          { en: 'Sign a written contract with the scope, price, time, performance security, liquidated damages and defect liability stated.', ne: 'कार्यक्षेत्र, मूल्य, समय, कार्यसम्पादन जमानत, पूर्वनिर्धारित क्षतिपूर्ति र त्रुटि दायित्व उल्लेख गरी लिखित सम्झौता गर्ने।' },
          { en: 'Manage the contract: measure the work in the measurement book, test quality where specified, and pay only against certified quantity — payment ahead of work is the commonest source of beruju.', ne: 'ठेक्का व्यवस्थापन गर्ने: नापी किताबमा काम नाप्ने, तोकिएको अवस्थामा गुणस्तर परीक्षण गर्ने, र प्रमाणित परिमाणविरुद्ध मात्र भुक्तानी गर्ने — काम हुनुअघिको भुक्तानी बेरुजुको सबैभन्दा सामान्य स्रोत हो।' },
          { en: 'Grant a variation or time extension only on the ground the Act permits, by the authority competent to do it, and on record.', ne: 'परिमाण परिवर्तन वा म्याद थप ऐनले अनुमति दिएको आधारमा, त्यसका लागि सक्षम अधिकारीबाट र अभिलेखसहित मात्र दिने।' },
          { en: 'Take over and record the asset: enter the goods or the completed work in the store or fixed asset ledger, since an unrecorded asset is an audit irregularity even if the purchase was proper.', ne: 'सम्पत्ति हस्तान्तरण लिई अभिलेख गर्ने: मालसामान वा सम्पन्न काम जिन्सी वा स्थिर सम्पत्ति खातामा चढाउने, किनभने खरिद ठीक भए पनि अभिलेख नभएको सम्पत्ति लेखापरीक्षणमा अनियमितता हुन्छ।' },
        ],
      },
    ],
    conclusion: {
      en: 'The method is not a matter of the office’s choice: the Regulations fix it by threshold, and the commonest irregularities in Nepal come from evading that — splitting a package, shortening a notice, or paying ahead of measurement. An office that plans its procurement early, chooses the method by value, and pays only against a certified measurement will meet both the Act and the audit.',
      ne: 'खरिद विधि कार्यालयको रोजाइको विषय होइन: नियमावलीले मूल्य सीमाअनुसार तोक्छ, र नेपालमा देखिने सामान्य अनियमितता त्यसलाई छल्नबाटै आउँछन् — प्याकेज टुक्रा पार्नु, सूचना अवधि छोट्याउनु, वा नापजाँचअघि भुक्तानी गर्नु। खरिदको योजना चाँडो बनाउने, मूल्यअनुसार विधि छनोट गर्ने र प्रमाणित नापविरुद्ध मात्र भुक्तानी गर्ने कार्यालयले ऐन र लेखापरीक्षण दुवैको पालना गर्नेछ।',
    },
    authorities: [
      { en: 'Public Procurement Act 2063 and Public Procurement Regulations 2064', ne: 'सार्वजनिक खरिद ऐन, २०६३ र सार्वजनिक खरिद नियमावली, २०६४' },
      { en: 'Financial Procedure and Fiscal Responsibility Act 2076', ne: 'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६' },
    ],
    freshnessNote: {
      en: 'The monetary thresholds that decide the method are revised by amendment to the Regulations — check the current figures before quoting them.',
      ne: 'विधि निर्धारण गर्ने रकम सीमा नियमावलीको संशोधनबाट परिवर्तन हुन्छ — उद्धृत गर्नुअघि चालू सीमा जाँच्नुहोस्।',
    },
  },
  {
    id: 'w-kharidar-p3-c-1',
    levels: ['kharidar'],
    paperId: 'kharidar-p3',
    sectionId: 'kharidar-p3-c',
    subjectId: 'constitution',
    marks: 5,
    minutes: 8,
    prompt: {
      en: 'Describe the structure of the courts in Nepal and the jurisdiction of each.',
      ne: 'नेपालमा अदालतको संरचना र प्रत्येकको अधिकारक्षेत्रको वर्णन गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Three tiers: Supreme Court, High Courts, District Courts (Article 127)', ne: 'तीन तह: सर्वोच्च अदालत, उच्च अदालत, जिल्ला अदालत (धारा १२७)' },
      { en: 'Supreme Court: highest court, extraordinary jurisdiction (Article 133), judicial review, precedent binding on all', ne: 'सर्वोच्च अदालत: सर्वोच्च अदालत, असाधारण अधिकारक्षेत्र (धारा १३३), न्यायिक पुनरावलोकन, नजिर सबैलाई बाध्यकारी' },
      { en: 'High Court: one in each province, appeals from the District Court and writ jurisdiction (Article 144)', ne: 'उच्च अदालत: प्रत्येक प्रदेशमा एक, जिल्ला अदालतबाट पुनरावेदन र रिट अधिकारक्षेत्र (धारा १४४)' },
      { en: 'District Court: court of first instance in each district (Article 148)', ne: 'जिल्ला अदालत: प्रत्येक जिल्लामा सुरु कारबाही गर्ने अदालत (धारा १४८)' },
      { en: 'Specialised bodies: Special Court, Administrative Court, Revenue Tribunal, Labour Court', ne: 'विशिष्टीकृत निकाय: विशेष अदालत, प्रशासकीय अदालत, राजस्व न्यायाधिकरण, श्रम अदालत' },
      { en: 'Judicial committee at the local level for mediation of listed disputes', ne: 'स्थानीय तहमा तोकिएका विवादको मेलमिलापका लागि न्यायिक समिति' },
    ],
    intro: {
      en: 'Article 126 vests the power relating to justice in the courts, and Article 127 establishes three tiers: the Supreme Court, the High Courts and the District Courts. Other judicial bodies may be established by law for a specified kind of case, but they sit within this structure rather than outside it.',
      ne: 'धारा १२६ ले न्यायसम्बन्धी अधिकार अदालतमा निहित गर्छ र धारा १२७ ले तीन तह स्थापना गर्छ: सर्वोच्च अदालत, उच्च अदालत र जिल्ला अदालत। तोकिएको प्रकारका मुद्दाका लागि कानुनबमोजिम अन्य न्यायिक निकाय स्थापना हुन सक्छन्, तर त्यो यही संरचनाभित्र रहन्छन्, बाहिर होइन।',
    },
    parts: [
      {
        heading: { en: 'The three tiers', ne: 'तीन तह' },
        points: [
          { en: 'District Court — one in each of the seventy-seven districts, the court of first instance for most civil and criminal cases, and it hears appeals from a quasi-judicial body where law so provides.', ne: 'जिल्ला अदालत — सत्तरीसात जिल्लामा एक–एक, अधिकांश देवानी र फौजदारी मुद्दाको सुरु कारबाही गर्ने अदालत, र कानुनले व्यवस्था गरेको अवस्थामा अर्धन्यायिक निकायबाट पुनरावेदन सुन्ने।' },
          { en: 'High Court — one in each province, with benches; it hears appeals from the District Court, tries cases the law assigns to it directly, and exercises writ jurisdiction under Article 144 within its territory.', ne: 'उच्च अदालत — प्रत्येक प्रदेशमा एक, इजलाससहित; जिल्ला अदालतबाट पुनरावेदन सुन्ने, कानुनले सोझै तोकेका मुद्दाको कारबाही गर्ने, र धारा १४४ अन्तर्गत आफ्नो क्षेत्रभित्र रिट अधिकारक्षेत्रको प्रयोग गर्ने।' },
          { en: 'Supreme Court — the highest court, with final appellate jurisdiction, the extraordinary jurisdiction under Article 133 to issue the writs, the power to declare a law void for inconsistency with the Constitution, and a precedent binding on all courts and bodies.', ne: 'सर्वोच्च अदालत — सर्वोच्च अदालत, अन्तिम पुनरावेदन अधिकारक्षेत्र, धारा १३३ अन्तर्गत रिट जारी गर्ने असाधारण अधिकारक्षेत्र, संविधानसँग बाझिने कानुन अमान्य घोषित गर्ने अधिकार, र सबै अदालत तथा निकायलाई बाध्यकारी नजिर।' },
          { en: 'The Supreme Court also has the power of review of its own judgement, and supervises and inspects the courts below it.', ne: 'सर्वोच्च अदालतलाई आफ्नै फैसला पुनरावलोकन गर्ने अधिकार पनि छ र मातहतका अदालतको निरीक्षण तथा सुपरिवेक्षण गर्छ।' },
        ],
      },
      {
        heading: { en: 'Other judicial bodies', ne: 'अन्य न्यायिक निकाय' },
        points: [
          { en: 'Special Court — tries corruption cases brought by the CIAA, and such other cases as law assigns.', ne: 'विशेष अदालत — अख्तियार दुरुपयोग अनुसन्धान आयोगबाट दायर भ्रष्टाचारका मुद्दा र कानुनले तोकेका अन्य मुद्दाको कारबाही गर्ने।' },
          { en: 'Administrative Court — hears an appeal by a civil servant against departmental punishment.', ne: 'प्रशासकीय अदालत — विभागीय सजायविरुद्ध निजामती कर्मचारीको पुनरावेदन सुन्ने।' },
          { en: 'Revenue Tribunal — hears an appeal against a tax or customs assessment.', ne: 'राजस्व न्यायाधिकरण — कर वा भन्सार निर्धारणविरुद्धको पुनरावेदन सुन्ने।' },
          { en: 'Labour Court and other tribunals constituted by law for a specified subject.', ne: 'श्रम अदालत र तोकिएको विषयका लागि कानुनबमोजिम गठित अन्य न्यायाधिकरण।' },
          { en: 'At the local level, a judicial committee under the Local Government Operation Act 2074, chaired by the deputy chief or deputy mayor, mediates the disputes listed in that Act — it settles by mediation and does not replace a court.', ne: 'स्थानीय तहमा स्थानीय सरकार सञ्चालन ऐन, २०७४ अन्तर्गत उपाध्यक्ष वा उपप्रमुखको संयोजकत्वमा न्यायिक समिति रहने, जो त्यही ऐनमा तोकिएका विवादमा मेलमिलाप गराउँछ — यो मेलमिलापबाट टुङ्गो लगाउँछ, अदालतको विकल्प होइन।' },
        ],
      },
    ],
    conclusion: {
      en: 'The structure is a pyramid with the Supreme Court at its apex: a case begins in the District Court, is appealed to the High Court and may reach the Supreme Court, whose interpretation then binds everyone. Judicial independence, secured by the appointment and tenure provisions of Part 11, is what makes the whole structure worth having.',
      ne: 'संरचना सर्वोच्च अदालत शिखरमा रहेको पिरामिड हो: मुद्दा जिल्ला अदालतबाट सुरु हुन्छ, उच्च अदालतमा पुनरावेदन हुन्छ र सर्वोच्च अदालतसम्म पुग्न सक्छ, जसको व्याख्या त्यसपछि सबैलाई बाध्यकारी हुन्छ। भाग ११ का नियुक्ति र सेवाको सुरक्षासम्बन्धी व्यवस्थाले प्रत्याभूत गरेको न्यायिक स्वतन्त्रताले नै सिङ्गो संरचनालाई अर्थपूर्ण बनाउँछ।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Part 11: Articles 126, 127, 133, 144 and 148', ne: 'नेपालको संविधान, भाग ११: धारा १२६, १२७, १३३, १४४ र १४८' },
      { en: 'Local Government Operation Act 2074, on the judicial committee', ne: 'न्यायिक समितिसम्बन्धी स्थानीय सरकार सञ्चालन ऐन, २०७४' },
    ],
  },
];
