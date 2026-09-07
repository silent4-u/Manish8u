import type { Lesson } from '../../types';

/**
 * Paper IV of the Section Officer main examination — the service related
 * subject for the Administration and Federal Parliament Services. A hundred
 * marks of written answers across four sections, ten questions of ten marks
 * in three hours, so these notes are written to be reproduced in an answer:
 * definitions that can be opened with, structures that can be listed, and the
 * legal instrument named wherever one governs the point.
 */
export const paperFourLessons: Lesson[] = [
  {
    id: 'p4-01',
    sections: ['adhikrit-p4-a'],
    subjectId: 'governance',
    levels: ['adhikrit'],
    title: { en: 'Public Management — Section A of Paper IV', ne: 'सार्वजनिक व्यवस्थापन — चतुर्थ पत्रको खण्ड क' },
    summary: {
      en: 'Thirty marks: the scope of public management, the personnel cycle from recruitment to separation, organisation, and how citizens hold the public sector to account.',
      ne: 'तीस अङ्क: सार्वजनिक व्यवस्थापनको कार्यक्षेत्र, भर्नादेखि अवकाशसम्मको कर्मचारी चक्र, संगठन, र नागरिकले सार्वजनिक क्षेत्रलाई कसरी जवाफदेही बनाउँछन्।',
    },
    readMinutes: 11,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Public management is the application of management to the machinery of the state: the planning, organising, staffing, directing, coordinating, reporting and budgeting through which public policy becomes public service. It differs from private management in what it is answerable to — public management pursues public purpose under law, is financed by the public purse, is bound by equality and due process, and is answerable to Parliament, the auditor and the citizen rather than to a shareholder.',
          ne: 'सार्वजनिक व्यवस्थापन भनेको राज्यसंयन्त्रमा व्यवस्थापनको प्रयोग हो: योजना, संगठन, कर्मचारी व्यवस्था, निर्देशन, समन्वय, प्रतिवेदन र बजेट — जसमार्फत सार्वजनिक नीति सार्वजनिक सेवामा परिणत हुन्छ। यो निजी व्यवस्थापनभन्दा जवाफदेहिताको हिसाबले फरक छ — सार्वजनिक व्यवस्थापन कानूनअन्तर्गत सार्वजनिक हितका लागि चल्छ, सार्वजनिक कोषबाट खर्च गर्छ, समानता र उचित प्रक्रियाले बाँधिएको हुन्छ, र सेयरधनीलाई होइन संसद, लेखापरीक्षक र नागरिकलाई जवाफदेही हुन्छ।',
        },
      },
      { type: 'heading', text: { en: 'The personnel management cycle', ne: 'कर्मचारी व्यवस्थापन चक्र' } },
      {
        type: 'para',
        text: {
          en: 'The syllabus lists this cycle in order, and an answer that follows the same order is easy to mark. Classification of the service comes first — service, group and sub-group, and the class or level within it — because everything after it depends on the post being defined. Recruitment then opens the post; selection tests merit through the Public Service Commission; appointment and placement put a person in it; promotion, compensation and motivation keep them in it; career development and performance appraisal shape what they become; and separation — retirement, resignation, removal or dismissal — closes the cycle.',
          ne: 'पाठ्यक्रमले यो चक्र क्रमैसँग तोकेको छ, र त्यही क्रम पछ्याउने उत्तर जाँच्न सजिलो हुन्छ। पहिले सेवाको वर्गीकरण आउँछ — सेवा, समूह र उपसमूह, र त्यसभित्रको श्रेणी वा तह — किनभने त्यसपछिका सबै कुरा पद परिभाषित भएपछि मात्र सम्भव हुन्छन्। त्यसपछि भर्नाले पद खोल्छ; छनोटले लोक सेवा आयोगमार्फत योग्यता जाँच्छ; नियुक्ति र पदस्थापनले व्यक्तिलाई पदमा पुर्‍याउँछ; बढुवा, तलब सुविधा र उत्प्रेरणाले टिकाइराख्छ; वृत्ति विकास र कार्यसम्पादन मूल्यांकनले उसलाई बनाउँछ; र अवकाश — निवृत्तिभरण, राजीनामा, हटाइने वा बर्खास्त — ले चक्र पूरा गर्छ।',
        },
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Merit and inclusion sit together, not against each other. Recruitment is by open competition through the Public Service Commission, and a share of the posts filled through open competition is reserved for inclusive groups. An answer that treats inclusion as an exception to merit misreads the design: the reservation operates within the competitive examination, not outside it.',
          ne: 'योग्यता र समावेशिता एकअर्काको विरुद्धमा होइन, सँगै रहन्छन्। भर्ना लोक सेवा आयोगमार्फत खुला प्रतिस्पर्धाबाट हुन्छ, र खुला प्रतिस्पर्धाबाट पूर्ति हुने पदको एक हिस्सा समावेशी समूहका लागि छुट्याइएको हुन्छ। समावेशितालाई योग्यताको अपवाद ठान्ने उत्तरले बनोट नै गलत बुझेको हुन्छ: आरक्षण प्रतिस्पर्धात्मक परीक्षाभित्रै लागू हुन्छ, बाहिर होइन।',
        },
      },
      { type: 'heading', text: { en: 'Organisation and the directing functions', ne: 'संगठन र निर्देशनका कार्यहरू' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Hierarchy', ne: 'पदसोपान' }, value: { en: 'Graded authority with a defined chain of command and span of control', ne: 'तोकिएको आदेश शृंखला र नियन्त्रण विस्तार भएको श्रेणीबद्ध अधिकार' } },
          { label: { en: 'Delegation', ne: 'अधिकार प्रत्यायोजन' }, value: { en: 'Passing authority down while responsibility stays with the delegator', ne: 'अधिकार तल पठाउने, तर उत्तरदायित्व प्रत्यायोजन गर्नेसँगै रहने' } },
          { label: { en: 'Devolution', ne: 'निक्षेपण' }, value: { en: 'Transferring authority and responsibility together to another level', ne: 'अधिकार र उत्तरदायित्व दुवै अर्को तहमा सार्ने' } },
          { label: { en: 'Coordination', ne: 'समन्वय' }, value: { en: 'Aligning separate units so effort is not duplicated or lost', ne: 'छुट्टाछुट्टै इकाइलाई मिलाउने, ताकि प्रयास दोहोरिन वा हराउन नपाओस्' } },
          { label: { en: 'Supervision', ne: 'सुपरीवेक्षण' }, value: { en: 'Watching work as it happens, to correct it as it happens', ne: 'काम हुँदाहुँदै हेर्ने, ताकि हुँदाहुँदै सुधार होस्' } },
          { label: { en: 'Monitoring and evaluation', ne: 'अनुगमन र मूल्यांकन' }, value: { en: 'Monitoring tracks progress against plan; evaluation judges result against purpose', ne: 'अनुगमनले योजनासँग प्रगति नाप्छ; मूल्यांकनले उद्देश्यसँग नतिजा जाँच्छ' } },
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'Delegation and devolution are the pair most often confused. In delegation the superior remains answerable and can take the authority back; in devolution the authority genuinely moves, which is what the transfer of functions to provinces and local levels under the Constitution amounts to.',
          ne: 'प्रत्यायोजन र निक्षेपण सबैभन्दा बढी अलमल्याउने जोडी हो। प्रत्यायोजनमा माथिल्लो अधिकारी नै जवाफदेही रहन्छ र अधिकार फिर्ता लिन सक्छ; निक्षेपणमा अधिकार साँच्चै सर्छ, र संविधानअनुसार प्रदेश तथा स्थानीय तहमा भएको कार्य हस्तान्तरण त्यही हो।',
        },
      },
      { type: 'heading', text: { en: 'Management audit', ne: 'व्यवस्थापन परीक्षण' } },
      {
        type: 'para',
        text: {
          en: 'A management audit examines how well an organisation is being run rather than whether its accounts add up. It looks at objectives, structure, systems, staffing, decision processes and results, and reports on economy, efficiency and effectiveness — the three Es. Financial audit asks whether the money was spent lawfully; management audit asks whether it was worth spending that way.',
          ne: 'व्यवस्थापन परीक्षणले हिसाब मिल्यो कि मिलेन भन्दा पनि संगठन कति राम्ररी चलिरहेको छ भन्ने जाँच्छ। यसले उद्देश्य, संरचना, प्रणाली, जनशक्ति, निर्णय प्रक्रिया र नतिजा हेर्छ, र मितव्ययिता, कुशलता र प्रभावकारिता — तीन "ई" — मा प्रतिवेदन दिन्छ। वित्तीय लेखापरीक्षणले पैसा कानूनसम्मत खर्च भयो कि भनी सोध्छ; व्यवस्थापन परीक्षणले त्यसरी खर्च गर्नु उचित थियो कि भनी सोध्छ।',
        },
      },
      { type: 'heading', text: { en: 'Citizens in the evaluation of public performance', ne: 'सार्वजनिक कार्यको मूल्यांकनमा नागरिक' } },
      {
        type: 'table',
        headers: [
          { en: 'Tool', ne: 'साधन' },
          { en: 'What it is', ne: 'के हो' },
        ],
        rows: [
          [{ en: 'Public hearing', ne: 'सार्वजनिक सुनुवाइ' }, { en: 'An open meeting where an office answers service recipients directly about its work and decisions', ne: 'कार्यालयले आफ्नो काम र निर्णयबारे सेवाग्राहीलाई सिधै जवाफ दिने खुला भेला' }],
          [{ en: 'Social audit', ne: 'सामाजिक परीक्षण' }, { en: 'Beneficiaries verify against the record what a programme actually delivered', ne: 'कार्यक्रमले वास्तवमा के दियो भन्ने लाभग्राहीले अभिलेखसँग भिडाएर जाँच्ने' }],
          [{ en: 'Public testing', ne: 'सार्वजनिक परीक्षण' }, { en: 'Completed work is opened to public inspection against its specification', ne: 'सम्पन्न काम स्पेसिफिकेसनसँग भिडाउन सार्वजनिक निरीक्षणका लागि खोलिने' }],
          [{ en: 'Third party evaluation', ne: 'तेस्रो पक्ष मूल्यांकन' }, { en: 'An independent party outside both provider and recipient assesses the result', ne: 'सेवा दिने र लिने दुवैभन्दा बाहिरको स्वतन्त्र पक्षले नतिजा मूल्यांकन गर्ने' }],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'A ten-mark answer on any of these is stronger if it names the accountability it serves. Public hearing and social audit are downward accountability, to the citizen. Audit and parliamentary committees are upward accountability, to the state. The code of conduct and professionalism are inward accountability, to the service itself. Saying which one the tool belongs to shows you understand why it exists.',
          ne: 'यीमध्ये कुनैमा दस अङ्कको उत्तर लेख्दा त्यसले कुन जवाफदेहिता पूरा गर्छ भन्ने नाम लिए बलियो हुन्छ। सार्वजनिक सुनुवाइ र सामाजिक परीक्षण तलतिरको जवाफदेहिता हो, नागरिकप्रति। लेखापरीक्षण र संसदीय समिति माथितिरको जवाफदेहिता हो, राज्यप्रति। आचारसंहिता र व्यावसायिकता भित्रीतर्फको जवाफदेहिता हो, सेवाप्रति नै। साधन कुनमा पर्छ भन्नुले त्यो किन छ भन्ने बुझेको देखाउँछ।',
        },
      },
    ],
  },
  {
    id: 'p4-02',
    sections: ['adhikrit-p4-b'],
    subjectId: 'dev-economy',
    levels: ['adhikrit'],
    title: { en: 'Revenue Administration — Section B of Paper IV', ne: 'राजस्व प्रशासन — चतुर्थ पत्रको खण्ड ख' },
    summary: {
      en: 'Twenty marks: public income, expenditure and debt, Nepal’s tax structure, how money moves between the three levels of government, and the budget cycle.',
      ne: 'बीस अङ्क: सार्वजनिक आय, खर्च र ऋण, नेपालको कर संरचना, सरकारका तीन तहबीच पैसा कसरी सर्छ, र बजेट चक्र।',
    },
    readMinutes: 10,
    blocks: [
      { type: 'heading', text: { en: 'Public income, expenditure and debt', ne: 'सार्वजनिक आय, खर्च र ऋण' } },
      {
        type: 'para',
        text: {
          en: 'Public income divides into tax revenue and non-tax revenue. Tax revenue is compulsory and carries no direct return to the payer; non-tax revenue — fees, charges, fines, dividends, royalties, sale of goods and services — is paid for something identifiable. Grants received are income but are not revenue in the strict sense, because they are neither compelled nor earned. Public debt fills the gap between expenditure and revenue, and is internal or external by source of borrowing.',
          ne: 'सार्वजनिक आय कर राजस्व र गैरकर राजस्वमा बाँडिन्छ। कर अनिवार्य हुन्छ र तिर्नेलाई सिधा प्रतिफल दिँदैन; गैरकर राजस्व — शुल्क, दस्तुर, जरिवाना, लाभांश, रोयल्टी, वस्तु तथा सेवाको बिक्री — केही निश्चित कुराबापत तिरिन्छ। प्राप्त अनुदान आय हो तर कडा अर्थमा राजस्व होइन, किनभने त्यो न अनिवार्य हो न कमाइएको। सार्वजनिक ऋणले खर्च र राजस्वबीचको खाडल पुर्छ, र ऋणको स्रोतअनुसार आन्तरिक वा बाह्य हुन्छ।',
        },
      },
      {
        type: 'facts',
        items: [
          { label: { en: 'Recurrent expenditure', ne: 'चालु खर्च' }, value: { en: 'Salaries, operation, grants and interest — spending that recurs each year', ne: 'तलब, सञ्चालन, अनुदान र ब्याज — हरेक वर्ष दोहोरिने खर्च' } },
          { label: { en: 'Capital expenditure', ne: 'पुँजीगत खर्च' }, value: { en: 'Spending that creates an asset with a life beyond the year', ne: 'वर्षभन्दा लामो आयु भएको सम्पत्ति सिर्जना गर्ने खर्च' } },
          { label: { en: 'Financing', ne: 'वित्तीय व्यवस्था' }, value: { en: 'Principal repayment, lending and investment', ne: 'साँवा भुक्तानी, ऋण लगानी र शेयर लगानी' } },
          { label: { en: 'Direct tax', ne: 'प्रत्यक्ष कर' }, value: { en: 'Borne by the person taxed — income tax', ne: 'कर लाग्ने व्यक्तिले नै बेहोर्ने — आयकर' } },
          { label: { en: 'Indirect tax', ne: 'अप्रत्यक्ष कर' }, value: { en: 'Collected from one and borne by another — VAT, excise, customs', ne: 'एउटाबाट उठाइने र अर्कोले बेहोर्ने — मूल्य अभिवृद्धि कर, अन्तःशुल्क, भन्सार' } },
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Four canons of taxation, from Adam Smith, still frame most answers on tax principle: equality — a tax should fall according to ability to pay; certainty — the taxpayer should know what, when and how much; convenience — collected at the time and in the manner easiest for the payer; and economy — the cost of collection should be small against the yield. Modern writing adds productivity, elasticity, simplicity and diversity.',
          ne: 'एडम स्मिथका चार करसिद्धान्तले अझै करसम्बन्धी उत्तरको ढाँचा दिन्छन्: समानता — कर तिर्न सक्ने क्षमताअनुसार लाग्नुपर्छ; निश्चितता — करदातालाई के, कहिले र कति भन्ने थाहा हुनुपर्छ; सुविधा — तिर्नेलाई सबैभन्दा सजिलो समय र तरिकामा उठाइनुपर्छ; र मितव्ययिता — उठाउने लागत प्राप्तिको तुलनामा थोरै हुनुपर्छ। आधुनिक लेखनले उत्पादकत्व, लोच, सरलता र विविधता थप्छ।',
        },
      },
      { type: 'heading', text: { en: 'The tax system in Nepal', ne: 'नेपालमा कर प्रणाली' } },
      {
        type: 'para',
        text: {
          en: 'Value added tax is the largest single source, charged on the value added at each stage of supply and borne finally by the consumer, with registered businesses crediting the tax paid on their inputs. Income tax falls on the income of persons and entities. Excise duty is levied on selected goods and services, customs duty on imports and exports. Local taxes — property tax, land and building registration fee, vehicle tax, business tax, advertisement tax, entertainment tax — belong to local levels under the Constitution. Because rates and thresholds are set by the annual Finance Act, an answer should state the structure and name the current rate only if you are sure of it.',
          ne: 'मूल्य अभिवृद्धि कर सबैभन्दा ठूलो एकल स्रोत हो, जुन आपूर्तिको प्रत्येक चरणमा थपिएको मूल्यमा लाग्छ र अन्ततः उपभोक्ताले बेहोर्छ, दर्ता भएका व्यवसायले आफ्नो निवेशमा तिरेको कर कट्टी पाउँछन्। आयकर व्यक्ति र निकायको आयमा लाग्छ। अन्तःशुल्क छानिएका वस्तु तथा सेवामा, भन्सार महसूल आयात–निर्यातमा लाग्छ। स्थानीय कर — सम्पत्ति कर, घरजग्गा रजिस्ट्रेसन शुल्क, सवारी साधन कर, व्यवसाय कर, विज्ञापन कर, मनोरञ्जन कर — संविधानअनुसार स्थानीय तहका हुन्। दर र सीमा वार्षिक आर्थिक ऐनले तोक्ने भएकाले उत्तरमा संरचना लेख्नुहोस् र निश्चित भएमा मात्र चालु दर उल्लेख गर्नुहोस्।',
        },
      },
      { type: 'heading', text: { en: 'Intergovernmental fiscal transfer', ne: 'अन्तरसरकारी वित्तीय हस्तान्तरण' } },
      {
        type: 'table',
        headers: [
          { en: 'Grant', ne: 'अनुदान' },
          { en: 'Basis', ne: 'आधार' },
        ],
        rows: [
          [{ en: 'Fiscal equalisation grant', ne: 'वित्तीय समानीकरण अनुदान' }, { en: 'The gap between a level’s expenditure need and its revenue capacity', ne: 'तहको खर्च आवश्यकता र राजस्व क्षमताबीचको अन्तर' }],
          [{ en: 'Conditional grant', ne: 'ससर्त अनुदान' }, { en: 'Given for a named programme or project, on the conditions attached to it', ne: 'तोकिएको कार्यक्रम वा आयोजनाका लागि, सँगै राखिएका सर्तमा' }],
          [{ en: 'Complementary grant', ne: 'समपूरक अनुदान' }, { en: 'Matches the receiving level’s own contribution to an infrastructure project', ne: 'पूर्वाधार आयोजनामा प्राप्त गर्ने तहको आफ्नै लगानीसँग मिलाएर दिइने' }],
          [{ en: 'Special grant', ne: 'विशेष अनुदान' }, { en: 'For a specific purpose such as equity, service delivery or balanced development', ne: 'समानता, सेवा प्रवाह वा सन्तुलित विकासजस्ता विशेष प्रयोजनका लागि' }],
        ],
      },
      {
        type: 'para',
        text: {
          en: 'The National Natural Resources and Fiscal Commission recommends the basis on which federal revenue is divided among the three levels and how the equalisation grant is distributed. Revenue sharing runs through the federal divisible fund, and royalties from natural resources are shared on the Commission’s recommendation.',
          ne: 'राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोगले संघीय राजस्व तीन तहबीच बाँड्ने आधार र समानीकरण अनुदान वितरणको आधार सिफारिस गर्छ। राजस्व बाँडफाँट संघीय विभाज्य कोषमार्फत हुन्छ, र प्राकृतिक स्रोतको रोयल्टी आयोगकै सिफारिसमा बाँडिन्छ।',
        },
      },
      { type: 'heading', text: { en: 'The budget cycle', ne: 'बजेट चक्र' } },
      {
        type: 'list',
        ordered: true,
        items: [
          { en: 'Formulation — the ceiling and guidelines go to ministries, which prepare estimates against them', ne: 'निर्माण — सीमा र मार्गदर्शन मन्त्रालयमा जान्छ, र मन्त्रालयले सोहीअनुसार अनुमान तयार पार्छन्' },
          { en: 'Approval — the estimates are presented to the legislature and passed as an appropriation', ne: 'स्वीकृति — अनुमान व्यवस्थापिकामा पेस भई विनियोजनका रूपमा पारित हुन्छ' },
          { en: 'Implementation — authority is released, spending is made and recorded through the treasury system', ne: 'कार्यान्वयन — अख्तियारी निकासा हुन्छ, खर्च हुन्छ र कोष प्रणालीमार्फत अभिलेख हुन्छ' },
          { en: 'Accounting and reporting — transactions are booked and reported up the chain', ne: 'लेखाङ्कन र प्रतिवेदन — कारोवार खातामा चढ्छ र माथिसम्म प्रतिवेदन जान्छ' },
          { en: 'Audit and evaluation — internal and final audit, then the Auditor General’s report to Parliament', ne: 'लेखापरीक्षण र मूल्यांकन — आन्तरिक र अन्तिम लेखापरीक्षण, अनि महालेखा परीक्षकको प्रतिवेदन संसदमा' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'The cycle closes rather than ends: the audit findings of one year are supposed to shape the estimates of the next. A ten-mark answer that says so, and names the Public Accounts Committee as the place where the Auditor General’s report is examined, does more than list five stages.',
          ne: 'चक्र सकिँदैन, घुम्छ: एक वर्षको लेखापरीक्षण निष्कर्षले अर्को वर्षको अनुमानलाई असर गर्नुपर्ने हो। यो कुरा लेख्ने र महालेखा परीक्षकको प्रतिवेदन जाँचिने ठाउँका रूपमा सार्वजनिक लेखा समितिको नाम लिने दस अङ्कको उत्तरले पाँच चरण गन्नुभन्दा धेरै गर्छ।',
        },
      },
    ],
  },
  {
    id: 'p4-03',
    sections: ['adhikrit-p4-c'],
    subjectId: 'office-mgmt',
    levels: ['adhikrit'],
    title: { en: 'Government Accounting and Reporting — Section C of Paper IV', ne: 'सरकारी लेखाङ्कन र प्रतिवेदन — चतुर्थ पत्रको खण्ड ग' },
    summary: {
      en: 'Twenty of Section C’s thirty marks: how a government transaction becomes a record, the systems it passes through, and the standards and procurement law that govern it.',
      ne: 'खण्ड ग का तीस अङ्कमध्ये बीस: सरकारी कारोवार कसरी अभिलेख बन्छ, कुन प्रणालीबाट जान्छ, र यसलाई कुन लेखामान तथा खरिद कानूनले नियमन गर्छ।',
    },
    readMinutes: 10,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'A government financial transaction is any receipt, payment or obligation that changes public funds. It is analysed for which head it falls under, recorded first in a primary record such as the journal voucher, posted to the ledger and then reported upward — the office to the treasury office, the treasury to the centre, and the centre in the consolidated financial statement. Every step is prescribed, which is why the answer to "how is a transaction recorded" is a sequence rather than a definition.',
          ne: 'सरकारी आर्थिक कारोवार भनेको सार्वजनिक कोषमा परिवर्तन ल्याउने कुनै पनि आम्दानी, भुक्तानी वा दायित्व हो। यो कुन शीर्षकमा पर्छ भनी विश्लेषण गरिन्छ, पहिले गोश्वारा भौचरजस्तो प्रारम्भिक अभिलेखमा चढ्छ, खातामा सारिन्छ र त्यसपछि माथि प्रतिवेदन जान्छ — कार्यालयबाट कोष कार्यालय, कोषबाट केन्द्र, र केन्द्रबाट एकीकृत वित्तीय विवरणमा। हरेक चरण तोकिएको हुन्छ, त्यसैले "कारोवार कसरी अभिलेख हुन्छ" भन्ने प्रश्नको उत्तर परिभाषा होइन, क्रम हो।',
        },
      },
      {
        type: 'table',
        headers: [
          { en: 'Basis', ne: 'आधार' },
          { en: 'Recognises a transaction when', ne: 'कारोवार कहिले गनिन्छ' },
          { en: 'Shows', ne: 'के देखाउँछ' },
        ],
        rows: [
          [{ en: 'Cash basis', ne: 'नगदमा आधारित' }, { en: 'Cash is actually received or paid', ne: 'नगद साँच्चै प्राप्त वा भुक्तानी हुँदा' }, { en: 'Liquidity and budget compliance; misses what is owed', ne: 'तरलता र बजेट पालना; तिर्न बाँकी देखाउँदैन' }],
          [{ en: 'Accrual basis', ne: 'प्रोदभावी आधार' }, { en: 'The obligation arises, whenever cash moves', ne: 'दायित्व सिर्जना हुँदा, नगद जहिले सरे पनि' }, { en: 'The full financial position, including assets and liabilities', ne: 'सम्पत्ति र दायित्वसहित पूर्ण वित्तीय स्थिति' }],
          [{ en: 'Modified basis', ne: 'संशोधित आधार' }, { en: 'Cash, with some accruals recognised', ne: 'नगद, तर केही प्रोदभावी समेत गनिने' }, { en: 'A staged move from one to the other', ne: 'एउटाबाट अर्कोमा जाने चरणबद्ध बाटो' }],
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Double entry is the discipline underneath all of it: every transaction has two aspects, a debit and an equal credit, so the books must balance and an error announces itself. Nepal Public Sector Accounting Standards set out what a public entity must present and disclose, and the Financial Procedure and Fiscal Responsibility Act with its Regulation carries the legal duty to keep the accounts that way.',
          ne: 'यी सबैको जग दोहोरो लेखा प्रणाली हो: हरेक कारोवारका दुई पक्ष हुन्छन्, डेबिट र बराबरको क्रेडिट, त्यसैले खाता मिल्नैपर्छ र त्रुटि आफैँ देखिन्छ। नेपाल सार्वजनिक क्षेत्र लेखामानले सार्वजनिक निकायले के प्रस्तुत र खुलासा गर्नुपर्छ भन्ने तोक्छ, र आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन र नियमावलीले त्यसरी खाता राख्ने कानूनी दायित्व बोक्छ।',
        },
      },
      { type: 'heading', text: { en: 'The systems a transaction passes through', ne: 'कारोवार गुज्रने प्रणालीहरू' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Chart of Accounts', ne: 'खाता सूची' }, value: { en: 'The coded classification every transaction is booked against, so like is added to like across government', ne: 'हरेक कारोवार चढाइने सांकेतिक वर्गीकरण, जसले सिंगो सरकारभरि उस्तै कुरा उस्तैसँग जोड्न दिन्छ' } },
          { label: { en: 'Treasury Single Account', ne: 'एकल खाता कोष' }, value: { en: 'One account through which government receipts and payments pass, instead of idle balances in many accounts', ne: 'सरकारी आम्दानी र भुक्तानी गुज्रने एउटै खाता, धेरै खातामा थन्किएको मौज्दातको साटो' } },
          { label: { en: 'RMIS', ne: 'राजस्व व्यवस्थापन सूचना प्रणाली' }, value: { en: 'Records and reports revenue collection', ne: 'राजस्व संकलनको अभिलेख र प्रतिवेदन' } },
          { label: { en: 'Deposit account', ne: 'धरौटी लेखा' }, value: { en: 'Money held on behalf of another and repayable — not government revenue', ne: 'अर्काको तर्फबाट राखिएको र फिर्ता गर्नुपर्ने रकम — सरकारी राजस्व होइन' } },
          { label: { en: 'Store or inventory account', ne: 'जिन्सी लेखा' }, value: { en: 'The record of goods held, from requisition and receipt through inspection to auction or write-off', ne: 'माग र दाखिलादेखि निरीक्षण हुँदै लिलाम वा मिन्हासम्मको सामानको अभिलेख' } },
        ],
      },
      { type: 'heading', text: { en: 'Public procurement', ne: 'सार्वजनिक खरिद' } },
      {
        type: 'para',
        text: {
          en: 'Procurement is governed by the Public Procurement Act and its Regulation, and turns on a small set of principles that an answer should open with: open competition, transparency, equal treatment of bidders, value for money, and accountability for the decision. The method follows the threshold and the nature of the work — open bidding, sealed quotation, direct purchase, the user committee, or the framework agreement — and the entity must have a procurement plan and a master procurement plan before it starts.',
          ne: 'खरिद सार्वजनिक खरिद ऐन र नियमावलीले नियमन गर्छ, र उत्तर सुरु गर्न मिल्ने केही सिद्धान्तमा अडेको छ: खुला प्रतिस्पर्धा, पारदर्शिता, बोलपत्रदातालाई समान व्यवहार, रकमको सदुपयोग, र निर्णयको जवाफदेहिता। विधि रकमको सीमा र कामको प्रकृतिअनुसार हुन्छ — खुला बोलपत्र, सिलबन्दी दरभाउपत्र, सोझै खरिद, उपभोक्ता समिति, वा खरिद सम्झौता — र निकायले सुरु गर्नुअघि खरिद योजना र गुरु खरिद योजना बनाएको हुनुपर्छ।',
        },
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'Splitting a procurement to bring it under a threshold and avoid competition is the irregularity the law is written against, and the one an auditor looks for first. Any answer on procurement method should say that the threshold decides the method, not the other way round.',
          ne: 'सीमाभित्र पार्न र प्रतिस्पर्धा छल्न खरिदलाई टुक्र्याउनु नै कानून जसविरुद्ध लेखिएको हो त्यो अनियमितता हो, र लेखापरीक्षकले सबैभन्दा पहिले खोज्ने पनि त्यही हो। खरिद विधिबारे लेख्ने उत्तरले सीमाले विधि तोक्छ, विधिले सीमा होइन भन्नुपर्छ।',
        },
      },
    ],
  },
  {
    id: 'p4-04',
    sections: ['adhikrit-p4-c'],
    subjectId: 'office-mgmt',
    levels: ['adhikrit'],
    title: { en: 'The Auditing System — Section C of Paper IV', ne: 'लेखापरीक्षण प्रणाली — चतुर्थ पत्रको खण्ड ग' },
    summary: {
      en: 'The remaining ten marks of Section C: types of audit, irregularities and their settlement, who audits the three levels, and the institutions that set the standards.',
      ne: 'खण्ड ग का बाँकी दस अङ्क: लेखापरीक्षणका प्रकार, बेरुजु र त्यसको फछ्र्यौट, तीन तहको लेखापरीक्षण कसले गर्छ, र मान तोक्ने संस्थाहरू।',
    },
    readMinutes: 9,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Auditing is the independent examination of financial statements, records and operations to form an opinion on whether they present a true and fair view and whether the transactions comply with the law. Its purpose is assurance and accountability, not fault-finding, and its authority rests on the auditor being independent of the body being audited.',
          ne: 'लेखापरीक्षण भनेको वित्तीय विवरण, अभिलेख र कारोवारको स्वतन्त्र जाँच हो — तिनले सत्य र यथार्थ चित्र दिन्छन् कि दिँदैनन् र कारोवार कानूनसम्मत छ कि छैन भन्ने राय बनाउन। यसको उद्देश्य आश्वस्तता र जवाफदेहिता हो, दोष खोज्नु होइन, र यसको अधिकार लेखापरीक्षक जाँचिने निकायबाट स्वतन्त्र हुनुमा अडेको छ।',
        },
      },
      {
        type: 'table',
        headers: [
          { en: 'Type', ne: 'प्रकार' },
          { en: 'What it asks', ne: 'के सोध्छ' },
        ],
        rows: [
          [{ en: 'Financial audit', ne: 'वित्तीय लेखापरीक्षण' }, { en: 'Do the statements present the position truly and fairly?', ne: 'विवरणले स्थिति सत्य र यथार्थ रूपमा देखाएको छ?' }],
          [{ en: 'Compliance audit', ne: 'परिपालना लेखापरीक्षण' }, { en: 'Were the transactions made under the law and the authority given?', ne: 'कारोवार कानून र दिइएको अख्तियारीअनुसार भएको छ?' }],
          [{ en: 'Performance audit', ne: 'कार्यमूलक लेखापरीक्षण' }, { en: 'Was there economy, efficiency and effectiveness?', ne: 'मितव्ययिता, कुशलता र प्रभावकारिता थियो?' }],
          [{ en: 'Internal audit', ne: 'आन्तरिक लेखापरीक्षण' }, { en: 'Ongoing, by the entity’s own arrangement, before the final audit', ne: 'निरन्तर, निकायकै व्यवस्थाबाट, अन्तिम लेखापरीक्षणअघि' }],
          [{ en: 'Final audit', ne: 'अन्तिम लेखापरीक्षण' }, { en: 'By the Auditor General, after the year closes', ne: 'वर्ष सकिएपछि महालेखा परीक्षकबाट' }],
        ],
      },
      { type: 'heading', text: { en: 'Irregularities and their settlement', ne: 'बेरुजु र फछ्र्यौट' } },
      {
        type: 'para',
        text: {
          en: 'An irregularity — beruju — is a transaction the audit finds not to have been carried out in accordance with the law, or for which the evidence is missing. Settlement is the process of clearing it: producing the missing evidence, regularising the act where the law allows, recovering the amount where it must be recovered, or writing it off through the authority competent to do so. What is not settled is carried forward as an outstanding balance, and re-audit is the check on whether the settlement was proper.',
          ne: 'बेरुजु भनेको लेखापरीक्षणले कानूनअनुसार नभएको ठहर्‍याएको वा प्रमाण नपुगेको कारोवार हो। फछ्र्यौट भनेको त्यसलाई सफा गर्ने प्रक्रिया हो: नपुगेको प्रमाण पेस गर्ने, कानूनले दिएमा नियमित गर्ने, असुल गर्नुपर्ने भए असुल गर्ने, वा सक्षम अधिकारीबाट मिन्हा गराउने। फछ्र्यौट नभएको रकम बाँकी बेरुजुका रूपमा जिम्मेवारी सर्छ, र फछ्र्यौट ठीक भयो कि भएन भनी जाँच्ने काम सम्परीक्षणले गर्छ।',
        },
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'The Auditor General audits the accounts of the federal, provincial and local levels and of the offices and bodies fully or majority owned by government, and reports to the President, who causes it to be laid before Parliament. The Public Accounts Committee then examines the report — which is what makes audit an instrument of parliamentary control rather than an internal exercise.',
          ne: 'महालेखा परीक्षकले संघ, प्रदेश र स्थानीय तह तथा सरकारको पूर्ण वा बहुल स्वामित्व भएका कार्यालय र निकायको लेखापरीक्षण गर्छ, र राष्ट्रपतिसमक्ष प्रतिवेदन पेस गर्छ, जसले त्यो संसदमा पेस गराउँछन्। त्यसपछि सार्वजनिक लेखा समितिले प्रतिवेदन जाँच्छ — यसैले लेखापरीक्षणलाई आन्तरिक अभ्यास नभई संसदीय नियन्त्रणको साधन बनाउँछ।',
        },
      },
      { type: 'heading', text: { en: 'The standard-setting institutions', ne: 'मान तोक्ने संस्थाहरू' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'ICAN', ne: 'आइक्यान' }, value: { en: 'The Institute of Chartered Accountants of Nepal — the national professional body for accountants and auditors', ne: 'नेपाल चार्टर्ड एकाउन्टेन्ट्स संस्था — लेखा र लेखापरीक्षण पेसाको राष्ट्रिय निकाय' } },
          { label: { en: 'INTOSAI', ne: 'इन्टोसाई' }, value: { en: 'The international organisation of supreme audit institutions, which issues the ISSAI standards', ne: 'सर्वोच्च लेखापरीक्षण संस्थाहरूको अन्तर्राष्ट्रिय संगठन, जसले ISSAI मान जारी गर्छ' } },
          { label: { en: 'ASOSAI', ne: 'असोसाई' }, value: { en: 'Its Asian regional organisation', ne: 'यसकै एसियाली क्षेत्रीय संगठन' } },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'A ten-mark answer on auditing gains most from distinguishing internal from final audit properly. Internal audit belongs to management and runs during the year to correct as it goes; final audit belongs to the Auditor General, is external and independent, and reports outward. Confusing the two is the commonest way this question is lost.',
          ne: 'लेखापरीक्षणबारे दस अङ्कको उत्तरलाई आन्तरिक र अन्तिम लेखापरीक्षण ठीकसँग छुट्याउनुले सबैभन्दा बल दिन्छ। आन्तरिक लेखापरीक्षण व्यवस्थापनको हो र वर्षभरि चल्दै सुधार गर्दै जान्छ; अन्तिम लेखापरीक्षण महालेखा परीक्षकको हो, बाह्य र स्वतन्त्र हुन्छ, र बाहिर प्रतिवेदन दिन्छ। यी दुई मिसाउनु नै यो प्रश्न गुमाउने सबैभन्दा सामान्य तरिका हो।',
        },
      },
    ],
  },
  {
    id: 'p4-05',
    sections: ['adhikrit-p4-d'],
    subjectId: 'constitution',
    levels: ['adhikrit'],
    title: { en: 'Parliamentary Process and the Federal System — Section D of Paper IV', ne: 'संसदीय प्रक्रिया र संघीय प्रणाली — चतुर्थ पत्रको खण्ड घ' },
    summary: {
      en: 'Twenty marks: how the three levels divide power, how a bill becomes law, how the two houses and the committees relate, and the conduct expected of representatives.',
      ne: 'बीस अङ्क: तीन तहले अधिकार कसरी बाँड्छन्, विधेयक कसरी कानून बन्छ, दुई सदन र समितिको सम्बन्ध कस्तो हुन्छ, र जनप्रतिनिधिबाट कस्तो आचरणको अपेक्षा गरिन्छ।',
    },
    readMinutes: 10,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Nepal is a federal democratic republic with three levels of government — federal, provincial and local — each with its own legislature, executive and, at the federal and provincial level, its own courts or judicial bodies. The Constitution divides power through schedules: exclusive powers of the federation, of the provinces and of the local levels, and then lists of powers held concurrently by the federation and provinces, and by all three. Where a concurrent law conflicts, the federal law prevails to the extent of the inconsistency.',
          ne: 'नेपाल संघीय लोकतान्त्रिक गणतन्त्र हो, जसमा सरकारका तीन तह छन् — संघ, प्रदेश र स्थानीय — र प्रत्येकको आफ्नै व्यवस्थापिका, कार्यपालिका र संघ तथा प्रदेश तहमा आफ्नै अदालत वा न्यायिक निकाय हुन्छ। संविधानले अनुसूचीमार्फत अधिकार बाँड्छ: संघ, प्रदेश र स्थानीय तहका एकल अधिकार, अनि संघ र प्रदेशले तथा तीनै तहले साझा रूपमा प्रयोग गर्ने अधिकारका सूची। साझा अधिकारमा बनेको कानून बाझिएमा बाझिएको हदसम्म संघीय कानून मान्य हुन्छ।',
        },
      },
      {
        type: 'facts',
        items: [
          { label: { en: 'Federal Parliament', ne: 'संघीय संसद' }, value: { en: 'Bicameral: the House of Representatives and the National Assembly', ne: 'द्विसदनात्मक: प्रतिनिधि सभा र राष्ट्रिय सभा' } },
          { label: { en: 'House of Representatives', ne: 'प्रतिनिधि सभा' }, value: { en: '275 members — 165 by first past the post and 110 by proportional representation; a five-year term', ne: '२७५ सदस्य — १६५ पहिलो हुने निर्वाचित हुने र ११० समानुपातिक; पाँच वर्षे कार्यकाल' } },
          { label: { en: 'National Assembly', ne: 'राष्ट्रिय सभा' }, value: { en: '59 members — 56 elected by an electoral college from the provinces and 3 nominated; a permanent house with members serving six years, a third retiring every two', ne: '५९ सदस्य — प्रदेशबाट निर्वाचक मण्डलद्वारा ५६ निर्वाचित र ३ मनोनीत; स्थायी सदन, सदस्यको कार्यकाल छ वर्ष, हरेक दुई वर्षमा एक तिहाइ अवकाश' } },
          { label: { en: 'Provincial Assembly', ne: 'प्रदेश सभा' }, value: { en: 'Unicameral, one in each province', ne: 'एकसदनात्मक, प्रत्येक प्रदेशमा एक' } },
        ],
      },
      { type: 'heading', text: { en: 'How a bill becomes law', ne: 'विधेयक कसरी कानून बन्छ' } },
      {
        type: 'list',
        ordered: true,
        items: [
          { en: 'Introduction — a bill is tabled in either house, except a money bill, which is introduced only in the House of Representatives', ne: 'दर्ता — विधेयक कुनै पनि सदनमा पेस गर्न सकिन्छ, तर अर्थ विधेयक प्रतिनिधि सभामा मात्र' },
          { en: 'General discussion on the principle of the bill', ne: 'विधेयकको सिद्धान्तमाथि सामान्य छलफल' },
          { en: 'Committee stage — clause by clause consideration, and amendments', ne: 'समिति चरण — दफावार विचार र संशोधन' },
          { en: 'Passage in the originating house, then transmission to the other house', ne: 'पेस भएको सदनमा पारित, अनि अर्को सदनमा प्रेषण' },
          { en: 'Consideration and passage by the second house; disagreement is resolved through the prescribed procedure', ne: 'दोस्रो सदनमा विचार र पारित; मतभेद भएमा तोकिएको प्रक्रियाबाट टुंगो' },
          { en: 'Authentication by the President, after which the bill becomes an Act', ne: 'राष्ट्रपतिबाट प्रमाणीकरण, त्यसपछि विधेयक ऐन बन्छ' },
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'The two houses are not equal on money. A money bill originates only in the House of Representatives, and the National Assembly may return it with suggestions but cannot reject it — the settled principle that control of the purse belongs to the directly elected house.',
          ne: 'अर्थका विषयमा दुई सदन बराबर छैनन्। अर्थ विधेयक प्रतिनिधि सभामा मात्र पेस हुन्छ, र राष्ट्रिय सभाले सुझावसहित फिर्ता पठाउन सक्छ तर अस्वीकार गर्न सक्दैन — कोषको नियन्त्रण प्रत्यक्ष निर्वाचित सदनकै हुने स्थापित सिद्धान्त।',
        },
      },
      { type: 'heading', text: { en: 'Committees, the opposition and the secretariat', ne: 'समिति, प्रतिपक्ष र सचिवालय' } },
      {
        type: 'para',
        text: {
          en: 'Parliament works through committees because the whole house cannot examine everything. Thematic committees oversee the ministries in their field; the Public Accounts Committee examines the Auditor General’s report; and committees summon officials, call for papers and report back to the house. The opposition’s role is to scrutinise, to offer an alternative and to hold the government to account without obstructing the house — its function is constitutional, not merely political. The Parliament Secretariat serves the house itself: it keeps the record, runs the business, supports the committees and is staffed by the Federal Parliament Service.',
          ne: 'सिंगो सदनले सबै कुरा जाँच्न नसक्ने भएकाले संसद समितिमार्फत काम गर्छ। विषयगत समितिले आफ्नो क्षेत्रका मन्त्रालयको निगरानी गर्छन्; सार्वजनिक लेखा समितिले महालेखा परीक्षकको प्रतिवेदन जाँच्छ; र समितिहरूले पदाधिकारी झिकाउने, कागजात माग्ने र सदनमा प्रतिवेदन दिने गर्छन्। प्रतिपक्षको भूमिका छानबिन गर्ने, विकल्प दिने र सदन नरोकी सरकारलाई जवाफदेही बनाउने हो — यसको काम राजनीतिक मात्र होइन, संवैधानिक हो। संसद सचिवालयले सदनकै सेवा गर्छ: अभिलेख राख्छ, कार्यसूची चलाउँछ, समितिलाई सहयोग गर्छ, र यसमा संघीय संसद सेवाका कर्मचारी रहन्छन्।',
        },
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Section D is where Paper IV overlaps most with Paper II. The distinction to hold is that Paper II asks about governance systems in general, while Paper IV asks about them as the work of the service you are joining — so answer with process and jurisdiction, and name the committee, the schedule or the secretariat function rather than describing federalism in the abstract.',
          ne: 'खण्ड घ मै चतुर्थ पत्र द्वितीय पत्रसँग सबैभन्दा बढी जोडिन्छ। फरक यति हो: द्वितीय पत्रले शासन प्रणालीबारे सामान्य रूपमा सोध्छ, चतुर्थ पत्रले तिनलाई तपाईं प्रवेश गर्न लागेको सेवाको कामका रूपमा सोध्छ — त्यसैले संघीयतालाई अमूर्त रूपमा वर्णन गर्नुभन्दा प्रक्रिया र क्षेत्राधिकार लेख्नुहोस्, र समिति, अनुसूची वा सचिवालयको कामको नाम लिनुहोस्।',
        },
      },
    ],
  },
];
