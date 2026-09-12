import type { WrittenQuestion } from '../../types';

/**
 * Nayab Subba, Papers II and III.
 *
 * Both papers mix short and long questions, so the set carries both: a
 * five-mark answer is a tight four or five points, a ten-mark answer takes
 * the fuller shape. At roughly a minute and a half a mark, that is seven or
 * eight minutes against fifteen — a difference of kind, not only of length.
 */
export const NAYAB_SUBBA_WRITTEN: WrittenQuestion[] = [
  {
    id: 'w-nasu-p2-a-1',
    levels: ['nayabsubba'],
    paperId: 'nasu-p2',
    sectionId: 'nasu-p2-a',
    subjectId: 'gk-nepal',
    marks: 10,
    minutes: 15,
    prompt: {
      en: 'Nepal’s geographical diversity shapes the livelihood of its people. Explain the three ecological belts and the economic activity characteristic of each, with the development problems of each belt.',
      ne: 'नेपालको भौगोलिक विविधताले जनताको जीविकोपार्जन निर्धारण गर्छ। तीन पारिस्थितिक क्षेत्र र प्रत्येकको विशिष्ट आर्थिक क्रियाकलाप, तथा प्रत्येक क्षेत्रका विकास समस्या व्याख्या गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Three belts: Mountain (Himal), Hill (Pahad) and Tarai, running east to west', ne: 'तीन क्षेत्र: हिमाल, पहाड र तराई, पूर्व–पश्चिम फैलिएका' },
      { en: 'Share of area and of population differs sharply: Mountain largest in area terms among the sparsely settled, Tarai smallest in area with the largest population share', ne: 'क्षेत्रफल र जनसंख्याको हिस्सा निकै भिन्न: हिमाल पातलो बस्ती, तराई क्षेत्रफलमा सानो तर जनसंख्यामा सबैभन्दा ठूलो हिस्सा' },
      { en: 'Mountain: livestock, herbs, tourism, limited agriculture, transhumance', ne: 'हिमाल: पशुपालन, जडीबुटी, पर्यटन, सीमित कृषि, चरन प्रणाली' },
      { en: 'Hill: terraced farming, horticulture, cash crops, remittance dependence', ne: 'पहाड: तारी खेती, बागवानी, नगदे बाली, विप्रेषणमा निर्भरता' },
      { en: 'Tarai: grain production, industry, trade with India, the granary of Nepal', ne: 'तराई: अन्न उत्पादन, उद्योग, भारतसँग व्यापार, नेपालको अन्नभण्डार' },
      { en: 'Problems: access and food security in the mountains, out-migration and landslide in the hills, flood, land fragmentation and groundwater in the Tarai', ne: 'समस्या: हिमालमा पहुँच र खाद्य सुरक्षा, पहाडमा बहिर्गमन र पहिरो, तराईमा बाढी, जग्गा विखण्डन र भूमिगत जल' },
    ],
    intro: {
      en: 'Nepal is divided into three ecological belts that run east to west and rise from below a hundred metres in the Tarai to above eight thousand in the Mountain belt. Because altitude determines climate, soil and access, it also determines what a household can grow, sell and earn — which is why development problems in Nepal are regional before they are sectoral.',
      ne: 'नेपाल पूर्व–पश्चिम फैलिएका तीन पारिस्थितिक क्षेत्रमा विभाजित छ, जो तराईमा सय मिटरभन्दा तलदेखि हिमाली क्षेत्रमा आठ हजार मिटरभन्दा माथिसम्म उक्लिन्छन्। उचाइले हावापानी, माटो र पहुँच निर्धारण गर्ने हुँदा त्यसैले घरपरिवारले के उत्पादन गर्न, बेच्न र कमाउन सक्छ पनि निर्धारण गर्छ — यसैले नेपालका विकास समस्या क्षेत्रगत हुनुअघि भौगोलिक हुन्छन्।',
    },
    parts: [
      {
        heading: { en: 'The Mountain belt', ne: 'हिमाली क्षेत्र' },
        points: [
          { en: 'Highest altitude, thin soil, a short growing season and the smallest share of the population.', ne: 'सबैभन्दा उच्च उचाइ, पातलो माटो, छोटो खेती अवधि र जनसंख्याको सबैभन्दा सानो हिस्सा।' },
          { en: 'Livelihood: yak, chauri and sheep herding with seasonal movement, potato and barley, high-value herbs such as yarsagumba, and trade across the passes.', ne: 'जीविकोपार्जन: मौसमी सर्दै गर्ने चौंरी, याक र भेडा पालन, आलु र जौ, यार्सागुम्बा जस्ता उच्च मूल्यका जडीबुटी, र भञ्ज्याङपारिको व्यापार।' },
          { en: 'Tourism is the main cash earner — trekking and mountaineering in the Everest, Annapurna and Langtang areas.', ne: 'पर्यटन मुख्य नगद आर्जनको स्रोत — सगरमाथा, अन्नपूर्ण र लाङटाङ क्षेत्रमा पदयात्रा र पर्वतारोहण।' },
          { en: 'Problems: no road access to many settlements, food has to be carried in, health and secondary schooling are days away, and the belt is exposed to glacial lake outburst flood and avalanche.', ne: 'समस्या: धेरै बस्तीमा सडक पहुँच नहुनु, खाद्यान्न बोकेर पुर्‍याउनुपर्ने, स्वास्थ्य र माध्यमिक शिक्षा दिनको यात्रा दूरीमा, र हिमताल विस्फोट तथा हिमपहिरोको जोखिम।' },
        ],
      },
      {
        heading: { en: 'The Hill belt', ne: 'पहाडी क्षेत्र' },
        points: [
          { en: 'Middle altitude, temperate climate, the most varied belt, and historically the seat of political and administrative power.', ne: 'मध्यम उचाइ, समशीतोष्ण हावापानी, सबैभन्दा विविध क्षेत्र, र ऐतिहासिक रूपमा राजनीतिक तथा प्रशासनिक शक्तिको केन्द्र।' },
          { en: 'Livelihood: terraced maize, millet and paddy on small holdings, citrus and apple horticulture, vegetables for the valley markets, cardamom and tea in the east, and ginger.', ne: 'जीविकोपार्जन: साना जोतमा तारी खेतीको मकै, कोदो र धान, सुन्तला तथा स्याउको बागवानी, उपत्यकाको बजारका लागि तरकारी, पूर्वमा अलैँची र चिया, र अदुवा।' },
          { en: 'Kathmandu, Pokhara and the hill bazaars concentrate services, education and administration.', ne: 'काठमाडौँ, पोखरा र पहाडी बजारमा सेवा, शिक्षा र प्रशासन केन्द्रित।' },
          { en: 'Problems: holdings too small and steep to be commercially viable, heavy out-migration leaving land fallow and villages without working-age adults, landslide and drying springs, and a road network that is built faster than it is stabilised.', ne: 'समस्या: व्यावसायिक हुनै नसक्ने साना र भिरालो जोत, ठूलो परिमाणमा बहिर्गमन — जग्गा बाँझो र गाउँ कामकाजी उमेरका मानिसविहीन, पहिरो र सुक्दै गएका मुहान, र स्थिरीकरणभन्दा छिटो बन्ने सडक सञ्जाल।' },
        ],
      },
      {
        heading: { en: 'The Tarai belt', ne: 'तराई क्षेत्र' },
        points: [
          { en: 'The lowest and flattest belt, with the deepest soil, the best irrigation potential and the largest share of the population.', ne: 'सबैभन्दा होचो र सम्म क्षेत्र, गहिरो माटो, उत्तम सिँचाइ सम्भावना र जनसंख्याको सबैभन्दा ठूलो हिस्सा।' },
          { en: 'Livelihood: paddy, wheat, maize, sugarcane, jute and oilseed — the granary that supplies the rest of the country.', ne: 'जीविकोपार्जन: धान, गहुँ, मकै, उखु, जुट र तेलहन — देशभरलाई आपूर्ति गर्ने अन्नभण्डार।' },
          { en: 'Industry and trade concentrate here because of flat land, the road corridor and the customs points with India.', ne: 'सम्म जमिन, सडक करिडोर र भारतसँगका भन्सार विन्दुका कारण उद्योग र व्यापार यहीँ केन्द्रित।' },
          { en: 'Problems: monsoon flood and inundation aggravated by embankment across the border, land fragmentation and landlessness, falling groundwater where tube wells are unregulated, and loss of farmland to unplanned settlement along the highway.', ne: 'समस्या: सीमापारिको बाँधले बढाएको मनसुनी बाढी र डुबान, जग्गा विखण्डन र भूमिहीनता, ट्युबवेल नियमन नहुँदा भूमिगत जलसतह घट्दै, र राजमार्गछेउको अव्यवस्थित बस्तीले खेतीयोग्य जमिन गुम्दै।' },
        ],
      },
      {
        heading: { en: 'What follows for policy', ne: 'नीतिगत निष्कर्ष' },
        points: [
          { en: 'One national programme cannot fit three belts: an irrigation scheme suited to the Tarai has no application above the hills, and a mule track matters more than a highway in the Mountain belt.', ne: 'एकै राष्ट्रिय कार्यक्रम तीन क्षेत्रमा मिल्दैन: तराईलाई सुहाउँदो सिँचाइ योजना पहाडमाथि लागू हुँदैन, र हिमाली क्षेत्रमा राजमार्गभन्दा खच्चड बाटो महत्त्वपूर्ण हुन्छ।' },
          { en: 'North–south road and transmission links tie the belts together and let a hill or mountain product reach a Tarai market before it perishes.', ne: 'उत्तर–दक्षिण सडक र प्रसारण सम्बन्धले क्षेत्रलाई जोड्छन् र पहाड वा हिमालको उत्पादन कुहिनुअघि तराईको बजार पुग्न दिन्छन्।' },
          { en: 'Comparative advantage differs: herbs and tourism in the Mountain, high-value horticulture in the Hill, grain and agro-industry in the Tarai — a specialisation worth planning for rather than resisting.', ne: 'तुलनात्मक लाभ भिन्न छ: हिमालमा जडीबुटी र पर्यटन, पहाडमा उच्च मूल्यको बागवानी, तराईमा अन्न र कृषि उद्योग — यो विशिष्टीकरणको विरोध नगरी योजना बनाउनु उपयुक्त।' },
          { en: 'Fiscal equalisation should reflect the cost of delivery, not only the size of the population, since serving a mountain settlement costs several times what serving a Tarai ward does.', ne: 'वित्तीय समानीकरणले जनसंख्याको आकार मात्र नभई सेवा प्रवाहको लागत पनि प्रतिबिम्बित गर्नुपर्छ, किनकि हिमाली बस्तीमा सेवा पुर्‍याउन तराईको वडाभन्दा कैयौं गुणा खर्च लाग्छ।' },
        ],
      },
    ],
    conclusion: {
      en: 'The three belts are not simply three landscapes but three different development problems: access in the Mountain, out-migration and slope stability in the Hill, and water and land pressure in the Tarai. A plan that recognises the comparative advantage of each and connects them north to south will do more than a uniform programme applied from Mechi to Mahakali.',
      ne: 'तीन क्षेत्र केवल तीन भूदृश्य नभई तीन भिन्न विकास समस्या हुन्: हिमालमा पहुँच, पहाडमा बहिर्गमन र भिरालो जमिनको स्थिरता, र तराईमा पानी तथा जमिनको दबाब। प्रत्येकको तुलनात्मक लाभ पहिचान गरी उत्तर–दक्षिण जोड्ने योजनाले मेचीदेखि महाकालीसम्म एकै रूपमा लागू हुने कार्यक्रमभन्दा धेरै प्रतिफल दिनेछ।',
    },
    freshnessNote: {
      en: 'Population shares by belt and the number of local levels in each come from the National Census 2078 — quote that source rather than an older figure.',
      ne: 'क्षेत्रअनुसार जनसंख्याको हिस्सा र प्रत्येकमा रहेका स्थानीय तहको संख्या राष्ट्रिय जनगणना २०७८ बाट लिनुहोस् — पुरानो तथ्याङ्क नभई त्यही स्रोत उद्धृत गर्नुहोस्।',
    },
  },
  {
    id: 'w-nasu-p2-b-1',
    levels: ['nayabsubba'],
    paperId: 'nasu-p2',
    sectionId: 'nasu-p2-b',
    subjectId: 'constitution',
    marks: 5,
    minutes: 8,
    prompt: {
      en: 'State the salient features of the Constitution of Nepal.',
      ne: 'नेपालको संविधानका प्रमुख विशेषता उल्लेख गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Promulgated by the Constituent Assembly on 3 Asoj 2072', ne: 'संविधान सभाबाट २०७२ असोज ३ गते जारी' },
      { en: 'Federal democratic republic; three tiers of government', ne: 'सङ्घीय लोकतान्त्रिक गणतन्त्र; सरकारका तीन तह' },
      { en: 'Secular state, inclusive and proportional representation', ne: 'धर्मनिरपेक्ष राज्य, समावेशी र समानुपातिक प्रतिनिधित्व' },
      { en: 'Thirty-one fundamental rights with a right to constitutional remedy', ne: 'संवैधानिक उपचारको हकसहित एकतीस मौलिक हक' },
      { en: 'Written, rigid and the fundamental law of the land', ne: 'लिखित, कठोर र देशको मूल कानुन' },
    ],
    intro: {
      en: 'The Constitution of Nepal was promulgated by the second Constituent Assembly on 3 Asoj 2072 and is the first constitution of Nepal written by an elected assembly and brought into force. It declares itself the fundamental law of the land, and any law inconsistent with it is void to the extent of the inconsistency.',
      ne: 'नेपालको संविधान दोस्रो संविधान सभाबाट २०७२ असोज ३ गते जारी भएको हो र निर्वाचित सभाले लेखी लागू भएको नेपालको पहिलो संविधान हो। यसले आफैंलाई देशको मूल कानुन घोषित गर्छ र यससँग बाझिने कानुन बाझिएको हदसम्म अमान्य हुन्छ।',
    },
    parts: [
      {
        heading: { en: 'Salient features', ne: 'प्रमुख विशेषता' },
        points: [
          { en: 'Written, lengthy and rigid: it has thirty-five parts, over three hundred articles and nine schedules, and can be amended only by a two-thirds majority of each House.', ne: 'लिखित, विस्तृत र कठोर: पैंतीस भाग, तीन सयभन्दा बढी धारा र नौ अनुसूची रहेको, र प्रत्येक सदनको दुई तिहाइ बहुमतले मात्र संशोधन हुन सक्ने।' },
          { en: 'Sovereignty and state authority vest in the people (Article 2), and Nepal is an independent, indivisible, secular, inclusive, democratic, socialism-oriented federal democratic republic (Article 4).', ne: 'सार्वभौमसत्ता र राजकीयसत्ता जनतामा निहित (धारा २), र नेपाल स्वतन्त्र, अविभाज्य, धर्मनिरपेक्ष, समावेशी, लोकतन्त्रात्मक, समाजवादउन्मुख सङ्घीय लोकतान्त्रिक गणतन्त्रात्मक राज्य (धारा ४)।' },
          { en: 'Federal structure with three tiers — federation, seven provinces and seven hundred fifty-three local levels — and powers divided by Schedules 5 to 9.', ne: 'तीन तहको सङ्घीय संरचना — सङ्घ, सात प्रदेश र सात सय त्रिपन्न स्थानीय तह — र अनुसूची ५ देखि ९ द्वारा अधिकारको बाँडफाँट।' },
          { en: 'Thirty-one fundamental rights in Part 3, with the right to constitutional remedy under Article 46, and directive principles and policies of the State in Part 4.', ne: 'भाग ३ मा एकतीस मौलिक हक, धारा ४६ मा संवैधानिक उपचारको हक, र भाग ४ मा राज्यका निर्देशक सिद्धान्त तथा नीति।' },
          { en: 'Inclusion is structural: proportional representation in the electoral system, reserved seats, and thirteen constitutional bodies including commissions for women, Dalit, inclusion and indigenous nationalities.', ne: 'समावेशिता संरचनागत: निर्वाचन प्रणालीमा समानुपातिक प्रतिनिधित्व, आरक्षित स्थान, र महिला, दलित, समावेशी तथा आदिवासी जनजाति आयोगसहित तेर संवैधानिक निकाय।' },
          { en: 'Parliamentary system with a ceremonial President, an independent judiciary headed by the Supreme Court with the power of judicial review, and a bicameral federal legislature.', ne: 'संसदीय शासन प्रणाली, औपचारिक राष्ट्रपति, न्यायिक पुनरावलोकनको अधिकार सहित सर्वोच्च अदालतको नेतृत्वमा स्वतन्त्र न्यायपालिका, र द्विसदनात्मक सङ्घीय व्यवस्थापिका।' },
        ],
      },
    ],
    conclusion: {
      en: 'Its distinguishing achievements are the federal structure, secularism, republicanism and a level of structural inclusion no earlier Nepali constitution attempted — which is also why its implementation depends on laws and institutions still being built at the provincial and local level.',
      ne: 'यसका विशिष्ट उपलब्धि सङ्घीय संरचना, धर्मनिरपेक्षता, गणतन्त्र र नेपालको कुनै पनि पुरानो संविधानले प्रयास नगरेको स्तरको संरचनागत समावेशिता हुन् — यसैले यसको कार्यान्वयन प्रदेश र स्थानीय तहमा अझै बन्दै गरेका कानुन तथा संस्थामा निर्भर छ।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 1, 2, 4, 46, 56 and Schedules 5–9', ne: 'नेपालको संविधान, धारा १, २, ४, ४६, ५६ र अनुसूची ५–९' },
    ],
  },
  {
    id: 'w-nasu-p2-c-1',
    levels: ['nayabsubba'],
    paperId: 'nasu-p2',
    sectionId: 'nasu-p2-c',
    subjectId: 'office-mgmt',
    marks: 10,
    minutes: 15,
    prompt: {
      en: 'What is a citizen charter? Explain its contents and its importance, and state what should be done when the service is not delivered within the time it promises.',
      ne: 'नागरिक बडापत्र भन्नाले के बुझिन्छ? यसका विषयवस्तु र महत्त्व व्याख्या गर्दै बडापत्रले तोकेको समयभित्र सेवा प्रवाह नभएमा के गर्नुपर्छ, उल्लेख गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Definition: a public declaration by an office of the service it gives, on what terms and in what time', ne: 'परिभाषा: कार्यालयले दिने सेवा, त्यसका सर्त र समयको सार्वजनिक घोषणा' },
      { en: 'Required by the Good Governance Act 2064 and displayed at the entrance', ne: 'सुशासन ऐन, २०६४ ले अनिवार्य गरेको र प्रवेशद्वारमा राख्नुपर्ने' },
      { en: 'Contents: the service, documents required, fee, time limit, responsible officer, the officer to complain to', ne: 'विषयवस्तु: सेवा, आवश्यक कागजात, दस्तुर, समयसीमा, जिम्मेवार कर्मचारी, गुनासो सुन्ने अधिकारी' },
      { en: 'Importance: predictability, reduced discretion, a defence against informal payment, a measurable standard', ne: 'महत्त्व: पूर्वानुमानयोग्यता, स्वविवेकमा कमी, अनौपचारिक भुक्तानीविरुद्धको रक्षा, मापनयोग्य मापदण्ड' },
      { en: 'Remedy: grievance officer in the office, then the chief, then the department, then the Commission or the court', ne: 'उपचार: कार्यालयको गुनासो सुन्ने अधिकारी, त्यसपछि कार्यालय प्रमुख, विभाग, र आयोग वा अदालत' },
      { en: 'Weakness: displayed but not enforced, and no consequence for missing the time limit', ne: 'कमजोरी: टाँसिएको तर कार्यान्वयन नभएको, र समयसीमा नाघ्दा कुनै परिणाम नहुने' },
    ],
    intro: {
      en: 'A citizen charter is a public declaration by an office of what service it provides, to whom, on what documents, at what fee and within what time. It converts a favour into an entitlement: once the time limit is published, a service delivered late is a failure the office must answer for rather than a delay the citizen must accept.',
      ne: 'नागरिक बडापत्र भन्नाले कार्यालयले कुन सेवा, कसलाई, कुन कागजातमा, कति दस्तुरमा र कति समयभित्र दिन्छ भन्ने सार्वजनिक घोषणा बुझिन्छ। यसले कृपालाई अधिकारमा बदल्छ: समयसीमा सार्वजनिक भएपछि ढिलो दिइएको सेवा नागरिकले स्वीकार्नुपर्ने ढिलाइ नभई कार्यालयले जवाफ दिनुपर्ने त्रुटि बन्छ।',
    },
    parts: [
      {
        heading: { en: 'Contents', ne: 'विषयवस्तु' },
        points: [
          { en: 'The list of services the office actually provides, in plain Nepali, without reference to internal file numbers.', ne: 'कार्यालयले वास्तवमै दिने सेवाको सूची, सरल नेपालीमा, आन्तरिक फाइल नम्बरको उल्लेखविना।' },
          { en: 'The documents required for each, so a citizen is not sent home twice for a paper nobody mentioned.', ne: 'प्रत्येक सेवाका लागि आवश्यक कागजात, जसले कसैले नभनेको कागजका लागि सेवाग्राही दोहोरो फर्किनु नपरोस्।' },
          { en: 'The fee or revenue stamp, with the head it is deposited under, so an informal payment has nowhere to hide.', ne: 'दस्तुर वा टिकट, र दाखिला हुने शीर्षकसहित, जसले अनौपचारिक भुक्तानीलाई लुक्ने ठाउँ नरहोस्।' },
          { en: 'The time limit for each service, stated in hours or days from the moment the complete application is registered.', ne: 'प्रत्येक सेवाको समयसीमा, पूर्ण निवेदन दर्ता भएको क्षणदेखि घण्टा वा दिनमा उल्लिखित।' },
          { en: 'The officer and the desk responsible, by post, and the officer designated to hear a grievance.', ne: 'जिम्मेवार कर्मचारी र फाँट, पदको नामसहित, र गुनासो सुन्न तोकिएको अधिकारी।' },
          { en: 'Any concession or priority — for a senior citizen, a person with disability, a pregnant woman — so it is claimed rather than granted as a favour.', ne: 'कुनै सहुलियत वा प्राथमिकता — ज्येष्ठ नागरिक, अपाङ्गता भएका व्यक्ति, गर्भवती महिलाका लागि — जसले त्यो कृपा नभई दाबी गर्ने विषय बनोस्।' },
        ],
      },
      {
        heading: { en: 'Importance', ne: 'महत्त्व' },
        points: [
          { en: 'Predictability: the citizen knows before entering what is needed and how long it will take, which is worth more than speed alone.', ne: 'पूर्वानुमानयोग्यता: सेवाग्राहीलाई भित्र पस्नुअघि के चाहिन्छ र कति समय लाग्छ थाहा हुने, जो गति मात्रभन्दा मूल्यवान् छ।' },
          { en: 'It narrows discretion, and discretion is where both delay and informal payment live.', ne: 'यसले स्वविवेक साँघुरो बनाउँछ, र ढिलाइ तथा अनौपचारिक भुक्तानी स्वविवेकमै बास बस्छन्।' },
          { en: 'It gives a measurable standard: an office can be assessed against its own published promise rather than against an impression.', ne: 'यसले मापनयोग्य मापदण्ड दिन्छ: कार्यालयको मूल्याङ्कन प्रभावको आधारमा नभई उसैले प्रकाशित गरेको प्रतिज्ञाविरुद्ध गर्न सकिन्छ।' },
          { en: 'It shifts the burden of information from the citizen to the office, which is where it belongs.', ne: 'यसले सूचनाको भार सेवाग्राहीबाट कार्यालयमा सार्छ, जहाँ त्यो रहनुपर्ने हो।' },
          { en: 'It supports the right to information under Article 27 and the duty of an office under the Good Governance Act 2064.', ne: 'यसले धारा २७ को सूचनाको हक र सुशासन ऐन, २०६४ अन्तर्गत कार्यालयको कर्तव्यलाई टेवा दिन्छ।' },
        ],
      },
      {
        heading: { en: 'When the time limit is missed', ne: 'समयसीमा नाघेमा' },
        points: [
          { en: 'First, ask for the decision in writing with its reason: the Good Governance Act requires a decision to state its ground, and a refusal in writing can be appealed while a verbal refusal cannot.', ne: 'पहिले, कारणसहित लिखित निर्णय माग्ने: सुशासन ऐनले निर्णयमा आधार उल्लेख गर्नुपर्ने व्यवस्था गरेको छ, र लिखित अस्वीकृतिमा पुनरावेदन लाग्छ, मौखिकमा लाग्दैन।' },
          { en: 'Complain to the grievance officer named on the charter; the office must register the complaint and respond.', ne: 'बडापत्रमा तोकिएको गुनासो सुन्ने अधिकारीसमक्ष उजुरी दिने; कार्यालयले उजुरी दर्ता गरी जवाफ दिनुपर्छ।' },
          { en: 'If unanswered, take it to the office chief, and then to the department or ministry above it, in writing and with the registration number.', ne: 'जवाफ नआएमा कार्यालय प्रमुखसमक्ष, र त्यसपछि माथिल्लो विभाग वा मन्त्रालयसमक्ष, दर्ता नम्बरसहित लिखित रूपमा लैजाने।' },
          { en: 'Where information is being withheld, appeal under the Right to Information Act 2064 and, if needed, to the National Information Commission.', ne: 'सूचना नदिइएको अवस्थामा सूचनाको हक सम्बन्धी ऐन, २०६४ अन्तर्गत पुनरावेदन गर्ने र आवश्यक भएमा राष्ट्रिय सूचना आयोगसमक्ष जाने।' },
          { en: 'Where the delay is a demand for improper payment, complain to the CIAA; where a right is denied outright, the remedy is a writ under Article 46 read with Article 133 or 144.', ne: 'ढिलाइ अनुचित भुक्तानीको मागका कारण भएको भए अख्तियार दुरुपयोग अनुसन्धान आयोगमा उजुरी; हक सरासर अस्वीकृत भएमा धारा ४६ सँगै धारा १३३ वा १४४ अन्तर्गत रिट उपचार।' },
          { en: 'From the office’s side: the honest response is to record the delay, tell the applicant why, and fix the cause — not to treat the charter as a display board.', ne: 'कार्यालयको तर्फबाट: इमानदार प्रतिक्रिया ढिलाइ अभिलेख गर्नु, निवेदकलाई कारण बताउनु र कारण सच्याउनु हो — बडापत्रलाई सूचना पाटी मान्नु होइन।' },
        ],
      },
    ],
    conclusion: {
      en: 'A citizen charter is only as good as its enforcement: displayed on a wall it is decoration, but tied to a named officer, a registered grievance and a consequence for delay it becomes the most practical instrument of good governance an ordinary office has. Publishing compliance against the charter would do more for service delivery than rewriting the charter itself.',
      ne: 'नागरिक बडापत्रको मूल्य त्यसको कार्यान्वयनमै निहित छ: भित्तामा टाँसिएको बडापत्र सजावट हो, तर तोकिएको कर्मचारी, दर्ता भएको गुनासो र ढिलाइको परिणामसँग जोडिएको बडापत्र साधारण कार्यालयसँग रहेको सुशासनको सबैभन्दा व्यावहारिक साधन बन्छ। बडापत्र पुनर्लेखन गर्नुभन्दा बडापत्रविरुद्धको पालनाको विवरण सार्वजनिक गर्नुले सेवा प्रवाहमा धेरै योगदान दिनेछ।',
    },
    authorities: [
      { en: 'Good Governance (Management and Operation) Act 2064', ne: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४' },
      { en: 'Right to Information Act 2064; Constitution of Nepal, Articles 27 and 46', ne: 'सूचनाको हक सम्बन्धी ऐन, २०६४; नेपालको संविधान, धारा २७ र ४६' },
    ],
  },
  {
    id: 'w-nasu-p3-a-1',
    levels: ['nayabsubba'],
    paperId: 'nasu-p3',
    sectionId: 'nasu-p3-a',
    subjectId: 'office-mgmt',
    marks: 10,
    minutes: 15,
    prompt: {
      en: 'Explain what motivation is in an organisation, describe Maslow’s hierarchy of needs, and state the practical ways a Nepali government office can motivate its staff.',
      ne: 'सङ्गठनमा अभिप्रेरणा भन्नाले के बुझिन्छ व्याख्या गर्दै मास्लोको आवश्यकताको सोपानक्रम वर्णन गर्नुहोस् र नेपालको सरकारी कार्यालयले कर्मचारीलाई अभिप्रेरित गर्ने व्यावहारिक उपाय उल्लेख गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Motivation: the internal drive that makes a person willing to put effort into the work', ne: 'अभिप्रेरणा: काममा प्रयास लगाउन तत्पर बनाउने आन्तरिक प्रेरक शक्ति' },
      { en: 'Maslow: physiological, safety, social, esteem, self-actualisation — lower needs first', ne: 'मास्लो: शारीरिक, सुरक्षा, सामाजिक, सम्मान, आत्म–साक्षात्कार — पहिले तल्लो आवश्यकता' },
      { en: 'Herzberg’s hygiene factors versus motivators, briefly', ne: 'हर्जबर्गका स्वास्थ्यकर तत्त्व र अभिप्रेरक तत्त्व, संक्षेपमा' },
      { en: 'Financial and non-financial incentives', ne: 'वित्तीय र गैरवित्तीय प्रोत्साहन' },
      { en: 'Nepali reality: pay, transfer, promotion prospects, training, recognition, working conditions', ne: 'नेपाली यथार्थ: तलब, सरुवा, बढुवाको सम्भावना, तालिम, कदर, कार्य वातावरण' },
      { en: 'Legal hooks: Civil Service Act 2049 on performance evaluation, reward and training', ne: 'कानुनी आधार: कार्यसम्पादन मूल्याङ्कन, पुरस्कार र तालिमसम्बन्धी निजामती सेवा ऐन, २०४९' },
    ],
    intro: {
      en: 'Motivation is the internal state that makes a person willing to direct effort towards the work, and to keep directing it when nobody is watching. In a government office it matters more than in most workplaces, because tenure is secure and output is hard to measure — so what an official does on an ordinary day depends far more on willingness than on supervision.',
      ne: 'अभिप्रेरणा भन्नाले व्यक्तिलाई कामतर्फ प्रयास लगाउन र कोही नहेरेको बेला पनि लगाइरहन तत्पर बनाउने आन्तरिक अवस्था बुझिन्छ। सरकारी कार्यालयमा यसको महत्त्व अन्य कार्यस्थलभन्दा बढी छ, किनभने सेवा सुरक्षित हुन्छ र उत्पादन मापन गर्न कठिन हुन्छ — त्यसैले कर्मचारीले साधारण दिनमा गर्ने काम निगरानीभन्दा तत्परतामा धेरै निर्भर हुन्छ।',
    },
    parts: [
      {
        heading: { en: 'Maslow’s hierarchy of needs', ne: 'मास्लोको आवश्यकताको सोपानक्रम' },
        points: [
          { en: 'Physiological — food, shelter, clothing: met through salary, allowance and the basic pay scale.', ne: 'शारीरिक — खाना, बास, कपडा: तलब, भत्ता र आधारभूत तलबमानबाट पूरा हुने।' },
          { en: 'Safety — security of job, income and person: met through tenure under the Civil Service Act, pension, insurance and a safe workplace.', ne: 'सुरक्षा — जागिर, आय र व्यक्तिको सुरक्षा: निजामती सेवा ऐनअन्तर्गतको सेवा सुरक्षा, निवृत्तिभरण, बिमा र सुरक्षित कार्यस्थलबाट पूरा हुने।' },
          { en: 'Social — belonging and acceptance: met through the work group, the staff union and a workplace where a person is not isolated.', ne: 'सामाजिक — अपनत्व र स्वीकृति: कार्य समूह, कर्मचारी सङ्गठन र व्यक्ति एक्लो नपर्ने कार्यस्थलबाट पूरा हुने।' },
          { en: 'Esteem — recognition, status and respect: met through appreciation, a letter on the personal file, responsibility and a say in decisions.', ne: 'सम्मान — कदर, हैसियत र इज्जत: प्रशंसा, व्यक्तिगत फाइलमा राखिने पत्र, जिम्मेवारी र निर्णयमा भूमिकाबाट पूरा हुने।' },
          { en: 'Self-actualisation — doing work worth doing and growing in it: met through challenging assignment, training and career development.', ne: 'आत्म–साक्षात्कार — गर्नलायक काम गर्नु र त्यसमा बढ्नु: चुनौतीपूर्ण जिम्मेवारी, तालिम र वृत्ति विकासबाट पूरा हुने।' },
          { en: 'Maslow’s claim is that a lower need must be reasonably met before a higher one motivates — which is why appreciation does not compensate for an unpaid allowance.', ne: 'मास्लोको दाबी यो हो कि तल्लो आवश्यकता उचित रूपमा पूरा नभएसम्म माथिल्लोले अभिप्रेरित गर्दैन — यसैले भत्ता नपाएको अवस्थामा प्रशंसाले क्षतिपूर्ति गर्दैन।' },
        ],
      },
      {
        heading: { en: 'Herzberg, in short', ne: 'हर्जबर्ग, संक्षेपमा' },
        points: [
          { en: 'Hygiene factors — pay, working conditions, supervision, job security — do not motivate when present, but cause dissatisfaction when absent.', ne: 'स्वास्थ्यकर तत्त्व — तलब, कार्य वातावरण, निरीक्षण, जागिरको सुरक्षा — उपस्थित हुँदा अभिप्रेरित गर्दैनन्, तर अनुपस्थित हुँदा असन्तुष्टि जन्माउँछन्।' },
          { en: 'Motivators — achievement, recognition, the work itself, responsibility, advancement — are what actually raise effort.', ne: 'अभिप्रेरक तत्त्व — उपलब्धि, कदर, काम आफैं, जिम्मेवारी, प्रगति — वास्तवमा प्रयास बढाउने तत्त्व हुन्।' },
          { en: 'The practical lesson: fixing the office toilet stops complaint, but giving an officer a decision to make raises performance.', ne: 'व्यावहारिक पाठ: कार्यालयको शौचालय सुधार्दा गुनासो रोकिन्छ, तर कर्मचारीलाई निर्णय गर्ने अधिकार दिँदा कार्यसम्पादन बढ्छ।' },
        ],
      },
      {
        heading: { en: 'Practical measures for a Nepali office', ne: 'नेपाली कार्यालयका लागि व्यावहारिक उपाय' },
        points: [
          { en: 'Pay and allowance on time, and the entitlements — travel, field, overtime — settled without a personal request each month.', ne: 'तलब र भत्ता समयमा, र भ्रमण, फिल्ड, अतिरिक्त समय जस्ता सुविधा हरेक महिना व्यक्तिगत अनुरोधविना फर्स्योट।' },
          { en: 'Make performance evaluation mean something: a forced distribution, written feedback, and a visible link to promotion and to training opportunity.', ne: 'कार्यसम्पादन मूल्याङ्कनलाई अर्थपूर्ण बनाउने: बाध्यकारी वितरण, लिखित प्रतिक्रिया, र बढुवा तथा तालिमको अवसरसँग देखिने सम्बन्ध।' },
          { en: 'Delegate real decisions with a financial ceiling, which is the cheapest motivator available to an office chief.', ne: 'वित्तीय सीमासहित वास्तविक निर्णय प्रत्यायोजन गर्ने, जो कार्यालय प्रमुखसँग उपलब्ध सबैभन्दा सस्तो अभिप्रेरक हो।' },
          { en: 'Recognise good work in writing and on the record — a letter of appreciation on the personal file counts at promotion, so it is not merely symbolic.', ne: 'राम्रो कामको कदर लिखित र अभिलेखमा गर्ने — व्यक्तिगत फाइलमा रहेको प्रशंसा पत्र बढुवामा गणना हुने हुँदा यो प्रतीकात्मक मात्र हुँदैन।' },
          { en: 'Training and study opportunity distributed by a published rule rather than by proximity to the chief.', ne: 'तालिम र अध्ययनको अवसर प्रमुखको नजिक हुनुको आधारमा नभई प्रकाशित नियमबमोजिम वितरण गर्ने।' },
          { en: 'Predictable transfer and posting with a minimum tenure, since an officer who expects to be moved has no reason to start anything.', ne: 'न्यूनतम कार्यकालसहितको पूर्वानुमानयोग्य सरुवा र पदस्थापन, किनभने सरुवा हुने अपेक्षा राख्ने कर्मचारीसँग कुनै काम सुरु गर्ने कारण रहँदैन।' },
          { en: 'Working conditions that remove the daily friction: a working computer, a printed form in stock, and a desk a citizen can reach.', ne: 'दैनिक अवरोध हटाउने कार्य वातावरण: चल्ने कम्प्युटर, मौज्दातमा छापिएको फाराम, र सेवाग्राही पुग्न सक्ने टेबल।' },
          { en: 'Fair treatment within the office: no favouritism in leave, duty roster or field assignment, since a single visible exception undoes a year of goodwill.', ne: 'कार्यालयभित्र निष्पक्ष व्यवहार: बिदा, ड्युटी तालिका वा फिल्ड जिम्मेवारीमा पक्षपात नगर्ने, किनकि एउटै देखिने अपवादले वर्षभरको सद्भाव नष्ट गर्छ।' },
        ],
      },
    ],
    conclusion: {
      en: 'Maslow explains why a motivation problem in a Nepali office is rarely solved by exhortation: where pay, allowance and posting are uncertain, the higher needs do not yet operate. Settle the hygiene factors first, then motivate through delegated responsibility, honest evaluation and recognition on the record — in that order, because the sequence is the theory’s main practical claim.',
      ne: 'नेपाली कार्यालयमा अभिप्रेरणाको समस्या उपदेशले विरलै समाधान हुने कारण मास्लोले स्पष्ट पार्छ: तलब, भत्ता र पदस्थापन अनिश्चित रहेको ठाउँमा माथिल्ला आवश्यकता सक्रिय हुँदैनन्। पहिले स्वास्थ्यकर तत्त्व टुङ्गो लगाउने, त्यसपछि प्रत्यायोजित जिम्मेवारी, इमानदार मूल्याङ्कन र अभिलेखमा कदरमार्फत अभिप्रेरित गर्ने — यही क्रममा, किनभने क्रम आफैं यो सिद्धान्तको मुख्य व्यावहारिक दाबी हो।',
    },
    authorities: [
      { en: 'Civil Service Act 2049 and Civil Service Rules 2050, on performance evaluation, reward and training', ne: 'कार्यसम्पादन मूल्याङ्कन, पुरस्कार र तालिमसम्बन्धी निजामती सेवा ऐन, २०४९ र निजामती सेवा नियमावली, २०५०' },
    ],
  },
  {
    id: 'w-nasu-p3-b-1',
    levels: ['nayabsubba'],
    paperId: 'nasu-p3',
    sectionId: 'nasu-p3-b',
    subjectId: 'governance',
    marks: 10,
    minutes: 15,
    prompt: {
      en: 'Distinguish between public administration and development administration, and explain the functions of public administration in the context of Nepal’s federal structure.',
      ne: 'सार्वजनिक प्रशासन र विकास प्रशासनबीचको भिन्नता छुट्याउनुहोस् र नेपालको सङ्घीय संरचनाको सन्दर्भमा सार्वजनिक प्रशासनका कार्य व्याख्या गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Public administration: the machinery that carries out the policy and law of the State', ne: 'सार्वजनिक प्रशासन: राज्यको नीति र कानुन कार्यान्वयन गर्ने संयन्त्र' },
      { en: 'Development administration: administration directed at planned socio-economic change, not only at order', ne: 'विकास प्रशासन: व्यवस्था कायम राख्नमा मात्र नभई योजनाबद्ध सामाजिक–आर्थिक परिवर्तनमा लक्षित प्रशासन' },
      { en: 'Differences in objective, orientation, attitude to risk, and relationship with the citizen', ne: 'उद्देश्य, दृष्टिकोण, जोखिमप्रतिको धारणा र नागरिकसँगको सम्बन्धमा भिन्नता' },
      { en: 'Functions: POSDCORB — planning, organising, staffing, directing, coordinating, reporting, budgeting', ne: 'कार्य: POSDCORB — योजना, सङ्गठन, कर्मचारी व्यवस्था, निर्देशन, समन्वय, प्रतिवेदन, बजेट' },
      { en: 'Nepal after federalism: three administrative tiers, service delivery at the local level, coordination as the central task', ne: 'सङ्घीयतापछिको नेपाल: तीन प्रशासनिक तह, स्थानीय तहमा सेवा प्रवाह, समन्वय केन्द्रीय कार्य' },
      { en: 'Constitutional and legal basis: Articles 56 and 285, Civil Service Act 2049, Local Government Operation Act 2074', ne: 'संवैधानिक र कानुनी आधार: धारा ५६ र २८५, निजामती सेवा ऐन, २०४९, स्थानीय सरकार सञ्चालन ऐन, २०७४' },
    ],
    intro: {
      en: 'Public administration is the organised machinery through which the State carries out its policy and its law — the ministries, departments, offices and officials who turn a decision into a service. Development administration is not a separate machinery but a purpose given to that machinery: administration directed at planned social and economic change rather than only at maintaining order and collecting revenue.',
      ne: 'सार्वजनिक प्रशासन भन्नाले राज्यले आफ्नो नीति र कानुन कार्यान्वयन गर्ने सङ्गठित संयन्त्र बुझिन्छ — निर्णयलाई सेवामा बदल्ने मन्त्रालय, विभाग, कार्यालय र कर्मचारी। विकास प्रशासन छुट्टै संयन्त्र होइन, त्यही संयन्त्रलाई दिइएको प्रयोजन हो: व्यवस्था कायम राख्ने र राजस्व उठाउनेमा मात्र सीमित नभई योजनाबद्ध सामाजिक–आर्थिक परिवर्तनमा लक्षित प्रशासन।',
    },
    parts: [
      {
        heading: { en: 'How they differ', ne: 'भिन्नता' },
        points: [
          { en: 'Objective: public administration is concerned with running the State lawfully and continuously; development administration is concerned with changing a measured condition — literacy, income, access to water.', ne: 'उद्देश्य: सार्वजनिक प्रशासन राज्यलाई कानुनसम्मत र निरन्तर चलाउनमा केन्द्रित; विकास प्रशासन मापन गरिएको अवस्था — साक्षरता, आय, पानीको पहुँच — बदल्नमा केन्द्रित।' },
          { en: 'Orientation: the first is rule oriented and looks backwards to precedent; the second is goal oriented and looks forward to a target.', ne: 'दृष्टिकोण: पहिलो नियममुखी र नजिरतर्फ फर्केको; दोस्रो लक्ष्यमुखी र प्राप्त गर्नुपर्ने उद्देश्यतर्फ उन्मुख।' },
          { en: 'Attitude to risk: routine administration avoids deviation, while development work requires an officer to take a considered risk and answer for the result.', ne: 'जोखिमप्रतिको धारणा: नियमित प्रशासन विचलनबाट जोगिन खोज्छ, विकासको कामले कर्मचारीलाई सोचविचारसहित जोखिम लिन र नतिजाको जवाफ दिन माग गर्छ।' },
          { en: 'Relationship with the citizen: in the first the citizen is an applicant; in the second the citizen is a participant whose priority shapes the plan.', ne: 'नागरिकसँगको सम्बन्ध: पहिलोमा नागरिक निवेदक; दोस्रोमा नागरिक सहभागी, जसको प्राथमिकताले योजनाको स्वरूप निर्धारण गर्छ।' },
          { en: 'Measurement: the first is judged by regularity and procedure, the second by outcome — which is why development administration needs monitoring and evaluation the routine machinery does not.', ne: 'मापन: पहिलोको मूल्याङ्कन नियमितता र प्रक्रियाबाट, दोस्रोको नतिजाबाट — यसैले विकास प्रशासनलाई नियमित संयन्त्रलाई नचाहिने अनुगमन र मूल्याङ्कन आवश्यक पर्छ।' },
          { en: 'They are not opposed: development administration without regularity becomes irregular expenditure, and regularity without development purpose becomes a well-kept file and nothing built.', ne: 'यी विपरीत होइनन्: नियमितताविनाको विकास प्रशासन अनियमित खर्च बन्छ, र विकासको प्रयोजनविनाको नियमितता राम्ररी राखिएको फाइल बन्छ, निर्माण हुँदैन।' },
        ],
      },
      {
        heading: { en: 'Functions of public administration', ne: 'सार्वजनिक प्रशासनका कार्य' },
        points: [
          { en: 'Planning — setting out what is to be done, in what order and with what resource, within the periodic plan and the annual budget.', ne: 'योजना — आवधिक योजना र वार्षिक बजेटभित्र के, कुन क्रममा र कति स्रोतबाट गर्ने निर्धारण।' },
          { en: 'Organising — arranging the structure, the sections and the division of work so authority and duty match.', ne: 'सङ्गठन — अधिकार र कर्तव्य मिल्ने गरी संरचना, फाँट र कार्य विभाजनको व्यवस्था।' },
          { en: 'Staffing — recruitment through the Public Service Commission, placement, training, promotion and discipline under the Civil Service Act 2049.', ne: 'कर्मचारी व्यवस्था — निजामती सेवा ऐन, २०४९ बमोजिम लोक सेवा आयोगमार्फत भर्ना, पदस्थापन, तालिम, बढुवा र अनुशासन।' },
          { en: 'Directing — issuing lawful instruction, delegating authority, and supervising work.', ne: 'निर्देशन — कानुनसम्मत आदेश जारी गर्ने, अधिकार प्रत्यायोजन गर्ने र कामको निरीक्षण गर्ने।' },
          { en: 'Coordinating — aligning the work of sections, offices and now of three tiers so effort is not duplicated.', ne: 'समन्वय — फाँट, कार्यालय र अब तीन तहको काम मिलाउने, जसले प्रयास दोहोरिन नपाओस्।' },
          { en: 'Reporting — recording and reporting progress, physical and financial, to the authority above and to the public.', ne: 'प्रतिवेदन — भौतिक र वित्तीय प्रगति अभिलेख गरी माथिल्लो निकाय र सार्वजनिक रूपमा प्रतिवेदन गर्ने।' },
          { en: 'Budgeting — estimating, obtaining appropriation, spending within authority and accounting for it.', ne: 'बजेट — अनुमान, विनियोजन प्राप्ति, अधिकारभित्र खर्च र त्यसको लेखाङ्कन।' },
          { en: 'Beyond POSDCORB: service delivery at the counter, regulation and enforcement, and maintenance of records — the parts a citizen actually meets.', ne: 'POSDCORB भन्दा बाहिर: काउन्टरमा सेवा प्रवाह, नियमन र कार्यान्वयन, र अभिलेख व्यवस्थापन — नागरिकले वास्तवमै भेट्ने पक्ष।' },
        ],
      },
      {
        heading: { en: 'In Nepal’s federal structure', ne: 'नेपालको सङ्घीय संरचनामा' },
        points: [
          { en: 'Article 56 places administration at three levels, so the same function now has a federal, a provincial and a local administration to perform part of it.', ne: 'धारा ५६ ले प्रशासनलाई तीन तहमा राखेको हुँदा एउटै कार्यको अंश अब सङ्घीय, प्रादेशिक र स्थानीय प्रशासनले सम्पादन गर्छ।' },
          { en: 'Article 285 provides for the federal civil service and for provinces and local levels to maintain their own services under law.', ne: 'धारा २८५ ले सङ्घीय निजामती सेवा र प्रदेश तथा स्थानीय तहले कानुनबमोजिम आफ्नै सेवा सञ्चालन गर्ने व्यवस्था गरेको।' },
          { en: 'The Local Government Operation Act 2074 gives the local level the services a citizen uses most — registration, basic health, basic education, local roads and water — so the front line of public administration has moved.', ne: 'स्थानीय सरकार सञ्चालन ऐन, २०७४ ले नागरिकले सर्वाधिक प्रयोग गर्ने सेवा — दर्ता, आधारभूत स्वास्थ्य, आधारभूत शिक्षा, स्थानीय सडक र खानेपानी — स्थानीय तहलाई दिएको, त्यसैले सार्वजनिक प्रशासनको अग्रपङ्क्ति सर्‍यो।' },
          { en: 'Coordination has become the central administrative task rather than a secondary one, exercised through the Inter-Provincial Council, the fiscal council and the provincial coordination council.', ne: 'समन्वय गौण नभई केन्द्रीय प्रशासनिक कार्य बनेको, जो अन्तरप्रदेश परिषद्, वित्त परिषद् र प्रदेश समन्वय परिषद्मार्फत सम्पादन हुने।' },
          { en: 'The practical challenge is capacity at the tier that now holds the mandate: authority moved faster than trained staff did, which is why staff adjustment, training and a shared technical pool matter more than any structural change.', ne: 'व्यावहारिक चुनौती अब जिम्मेवारी बोक्ने तहको क्षमता हो: अधिकार तालिमप्राप्त कर्मचारीभन्दा छिटो सर्‍यो, यसैले कुनै संरचनागत परिवर्तनभन्दा कर्मचारी समायोजन, तालिम र साझा प्राविधिक समूह महत्त्वपूर्ण छन्।' },
        ],
      },
    ],
    conclusion: {
      en: 'Public administration is the machinery and development administration is a purpose set for it; Nepal needs both at once, because a local level that spends irregularly fails audit and a local level that files perfectly without building anything fails the citizen. After federalism the decisive administrative question is no longer structure but capacity and coordination at the tier where the service is actually delivered.',
      ne: 'सार्वजनिक प्रशासन संयन्त्र हो र विकास प्रशासन त्यसलाई दिइएको प्रयोजन; नेपाललाई दुवै एकैसाथ आवश्यक छ, किनभने अनियमित खर्च गर्ने स्थानीय तह लेखापरीक्षणमा असफल हुन्छ र केही निर्माण नगरी उत्तम फाइलिङ गर्ने स्थानीय तह नागरिकप्रति असफल हुन्छ। सङ्घीयतापछि निर्णायक प्रशासनिक प्रश्न संरचना नभई सेवा वास्तवमै प्रवाह हुने तहको क्षमता र समन्वय हो।',
    },
    authorities: [
      { en: 'Constitution of Nepal, Articles 56 and 285', ne: 'नेपालको संविधान, धारा ५६ र २८५' },
      { en: 'Civil Service Act 2049; Local Government Operation Act 2074', ne: 'निजामती सेवा ऐन, २०४९; स्थानीय सरकार सञ्चालन ऐन, २०७४' },
    ],
  },
  {
    id: 'w-nasu-p3-c-1',
    levels: ['nayabsubba'],
    paperId: 'nasu-p3',
    sectionId: 'nasu-p3-c',
    subjectId: 'governance',
    marks: 5,
    minutes: 8,
    prompt: {
      en: 'State the code of conduct prescribed for a civil servant under the Civil Service Act 2049.',
      ne: 'निजामती सेवा ऐन, २०४९ ले निजामती कर्मचारीका लागि तोकेको आचरण उल्लेख गर्नुहोस्।',
    },
    keyPoints: [
      { en: 'Duty to be disciplined, punctual and obedient to a lawful order', ne: 'अनुशासित, समयनिष्ठ र कानुनसम्मत आदेशप्रति आज्ञाकारी हुने कर्तव्य' },
      { en: 'Political neutrality: no membership of or participation in a political party', ne: 'राजनीतिक तटस्थता: राजनीतिक दलको सदस्यता वा गतिविधिमा सहभागिता निषेध' },
      { en: 'No engagement in other business or profession without permission', ne: 'स्वीकृतिविना अन्य व्यापार वा पेसामा संलग्न नहुने' },
      { en: 'No gift, donation or gratuity, and no improper use of office property or information', ne: 'उपहार, चन्दा वा सुविधा नलिने, र कार्यालयको सम्पत्ति वा सूचनाको अनुचित प्रयोग नगर्ने' },
      { en: 'Confidentiality of official information, and no unauthorised publication or press statement', ne: 'सरकारी सूचनाको गोपनीयता, र अनुमतिविना प्रकाशन वा वक्तव्य नदिने' },
      { en: 'Property declaration within the prescribed period each year', ne: 'प्रत्येक वर्ष तोकिएको अवधिभित्र सम्पत्ति विवरण पेस गर्ने' },
      { en: 'Breach attracts departmental action — warning, withholding of promotion, or removal or dismissal', ne: 'उल्लङ्घनमा विभागीय कारबाही — नसिहत, बढुवा रोक्का, वा सेवाबाट हटाउने वा बर्खास्त गर्ने' },
    ],
    intro: {
      en: 'The Civil Service Act 2049 and its Rules prescribe a code of conduct because a civil servant exercises public authority: the restrictions are the price of that authority, and their purpose is to keep the service impartial and to keep its decisions free of private interest.',
      ne: 'निजामती सेवा ऐन, २०४९ र नियमावलीले आचरण तोकेका छन् किनभने निजामती कर्मचारी सार्वजनिक अधिकारको प्रयोग गर्छ: यी बन्देज त्यो अधिकारको मूल्य हुन्, र यसको उद्देश्य सेवालाई निष्पक्ष राख्नु र निर्णयलाई निजी स्वार्थमुक्त राख्नु हो।',
    },
    parts: [
      {
        heading: { en: 'Principal duties and restrictions', ne: 'प्रमुख कर्तव्य र बन्देज' },
        points: [
          { en: 'Discipline and obedience: follow a lawful order of a superior, attend on time, and remain at the place of posting.', ne: 'अनुशासन र आज्ञापालन: माथिल्लो अधिकारीको कानुनसम्मत आदेश पालना गर्ने, समयमा उपस्थित हुने र पदस्थापन भएको स्थानमा रहने।' },
          { en: 'Political neutrality: a civil servant may not be a member of a political party, take part in party activity, or campaign in an election.', ne: 'राजनीतिक तटस्थता: निजामती कर्मचारी राजनीतिक दलको सदस्य हुन, दलीय गतिविधिमा भाग लिन वा निर्वाचनमा प्रचार गर्न पाउँदैन।' },
          { en: 'No other employment, business or profession without the approval of the competent authority.', ne: 'सक्षम अधिकारीको स्वीकृतिविना अन्य जागिर, व्यापार वा पेसा गर्न नपाउने।' },
          { en: 'No gift, donation, gratuity or hospitality connected with official duty, and no borrowing from a person having dealings with the office.', ne: 'सरकारी कामसँग सम्बन्धित उपहार, चन्दा, सुविधा वा आतिथ्य नलिने, र कार्यालयसँग कारोबार गर्ने व्यक्तिबाट ऋण नलिने।' },
          { en: 'Confidentiality: official information may not be disclosed, nor a press statement or publication made, without authorisation.', ne: 'गोपनीयता: अनुमतिविना सरकारी सूचना प्रकट गर्न, वक्तव्य दिन वा प्रकाशन गर्न नपाउने।' },
          { en: 'Property declaration: the prescribed statement of property must be filed within the period fixed each year.', ne: 'सम्पत्ति विवरण: तोकिएको ढाँचामा सम्पत्तिको विवरण प्रत्येक वर्ष तोकिएको अवधिभित्र पेस गर्नुपर्ने।' },
          { en: 'Conduct towards the public: courteous and impartial service, without discrimination and without demanding anything beyond the prescribed fee.', ne: 'सेवाग्राहीप्रति आचरण: शिष्ट र निष्पक्ष सेवा, भेदभावविना र तोकिएको दस्तुरबाहेक कुनै माग नगरी।' },
          { en: 'No strike or obstruction of service, and no act unbecoming of the dignity of the service.', ne: 'हड्ताल वा सेवामा अवरोध नगर्ने, र सेवाको मर्यादाविपरीत आचरण नगर्ने।' },
        ],
      },
      {
        heading: { en: 'Consequence of breach', ne: 'उल्लङ्घनको परिणाम' },
        points: [
          { en: 'Ordinary punishment: warning, withholding of promotion or of a salary increment for a stated period.', ne: 'सामान्य सजाय: नसिहत, तोकिएको अवधिसम्म बढुवा वा तलब वृद्धि रोक्का।' },
          { en: 'Special punishment: removal from service with eligibility for future appointment, or dismissal without such eligibility.', ne: 'विशेष सजाय: भविष्यमा नियुक्तिका लागि अयोग्य नहुने गरी सेवाबाट हटाउने, वा अयोग्य हुने गरी बर्खास्त गर्ने।' },
          { en: 'Departmental action follows an inquiry with a charge sheet and an opportunity to defend, and an appeal lies to the Administrative Court.', ne: 'विभागीय कारबाही आरोपपत्र र सफाई पेस गर्ने मौकासहितको जाँचबुझपछि हुने, र प्रशासकीय अदालतमा पुनरावेदन लाग्ने।' },
          { en: 'Where the conduct also amounts to corruption, proceedings under the Prevention of Corruption Act 2059 run separately before the Special Court.', ne: 'आचरणले भ्रष्टाचार पनि जनाएको अवस्थामा भ्रष्टाचार निवारण ऐन, २०५९ अन्तर्गत विशेष अदालतमा छुट्टै कारबाही चल्ने।' },
        ],
      },
    ],
    conclusion: {
      en: 'The code is not a list of prohibitions for its own sake: political neutrality protects the citizen from a partisan administration, the bar on gifts protects the decision from purchase, and property declaration makes unexplained wealth visible. Its weakness in practice is uneven enforcement, which is why declaration and disciplinary action matter more than the wording of the rules.',
      ne: 'आचरण आफैंका लागि बनाइएको निषेधको सूची होइन: राजनीतिक तटस्थताले नागरिकलाई दलीय प्रशासनबाट जोगाउँछ, उपहारको बन्देजले निर्णयलाई खरिदबाट जोगाउँछ, र सम्पत्ति विवरणले कारणविनाको सम्पत्ति देखाउँछ। व्यवहारमा यसको कमजोरी असमान कार्यान्वयन हो, यसैले नियमको शब्दावलीभन्दा विवरण पेस गर्नु र विभागीय कारबाही महत्त्वपूर्ण हुन्छ।',
    },
    authorities: [
      { en: 'Civil Service Act 2049, Chapter on conduct; Civil Service Rules 2050', ne: 'निजामती सेवा ऐन, २०४९, आचरणसम्बन्धी परिच्छेद; निजामती सेवा नियमावली, २०५०' },
      { en: 'Prevention of Corruption Act 2059', ne: 'भ्रष्टाचार निवारण ऐन, २०५९' },
    ],
  },
];
