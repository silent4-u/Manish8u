import type { Lesson } from '../../types';

export const gkNepalLessons: Lesson[] = [
  {
    id: 'gkn-01',
    subjectId: 'gk-nepal',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Geography of Nepal — Position, Size and Relief', ne: 'नेपालको भूगोल — अवस्थिति, आकार र धरातल' },
    summary: {
      en: 'Latitude and longitude, borders, physiographic belts, highest and lowest points.',
      ne: 'अक्षांश र देशान्तर, सिमाना, भौगोलिक क्षेत्र, अग्लो र होचो बिन्दु।',
    },
    readMinutes: 8,
    blocks: [
      {
        type: 'facts',
        items: [
          { label: { en: 'Area', ne: 'क्षेत्रफल' }, value: { en: '147,516 sq km', ne: '१,४७,५१६ वर्ग कि.मि.' } },
          { label: { en: 'Latitude', ne: 'अक्षांश' }, value: { en: "26°22'N to 30°27'N", ne: "२६°२२' उत्तर देखि ३०°२७' उत्तर" } },
          { label: { en: 'Longitude', ne: 'देशान्तर' }, value: { en: "80°04'E to 88°12'E", ne: "८०°०४' पूर्व देखि ८८°१२' पूर्व" } },
          { label: { en: 'Length (east–west)', ne: 'लम्बाइ (पूर्व–पश्चिम)' }, value: { en: 'About 885 km', ne: 'करिब ८८५ कि.मि.' } },
          { label: { en: 'Breadth (north–south)', ne: 'चौडाइ (उत्तर–दक्षिण)' }, value: { en: '145–241 km, mean about 193 km', ne: '१४५–२४१ कि.मि., औसत करिब १९३ कि.मि.' } },
          { label: { en: 'Standard time', ne: 'मानक समय' }, value: { en: "GMT + 5:45, based on 86°15'E (Gaurishankar)", ne: "जि.एम.टी. + ५:४५, ८६°१५' पूर्व (गौरीशंकर) का आधारमा" } },
        ],
      },
      { type: 'heading', text: { en: 'Borders', ne: 'सिमाना' } },
      {
        type: 'list',
        items: [
          { en: 'North: the Tibet Autonomous Region of China, boundary about 1,439 km', ne: 'उत्तर: चीनको तिब्बत स्वायत्त क्षेत्र, सिमाना करिब १,४३९ कि.मि.' },
          { en: 'East, south and west: India, boundary about 1,880 km', ne: 'पूर्व, दक्षिण र पश्चिम: भारत, सिमाना करिब १,८८० कि.मि.' },
          { en: 'Nepal is a landlocked country; the nearest sea access is through the Bay of Bengal', ne: 'नेपाल भूपरिवेष्टित मुलुक हो; नजिकको समुद्री पहुँच बंगालको खाडीबाट हुन्छ' },
        ],
      },
      { type: 'heading', text: { en: 'Physiographic regions', ne: 'भौगोलिक क्षेत्रहरू' } },
      {
        type: 'table',
        headers: [
          { en: 'Region', ne: 'क्षेत्र' },
          { en: 'Share of area', ne: 'क्षेत्रफलको हिस्सा' },
          { en: 'Character', ne: 'विशेषता' },
        ],
        rows: [
          [{ en: 'Himalayan (Himal)', ne: 'हिमाली (हिमाल)' }, { en: 'About 15%', ne: 'करिब १५%' }, { en: 'Above 4,877 m; snow, glaciers, sparse settlement', ne: '४,८७७ मि. भन्दा माथि; हिउँ, हिमनदी, पातलो बस्ती' }],
          [{ en: 'Hill (Pahad)', ne: 'पहाडी (पहाड)' }, { en: 'About 68%', ne: 'करिब ६८%' }, { en: 'Mahabharat and Chure ranges, valleys, terraced farming', ne: 'महाभारत र चुरे शृंखला, उपत्यका, तटिय खेती' }],
          [{ en: 'Terai', ne: 'तराई' }, { en: 'About 17%', ne: 'करिब १७%' }, { en: 'Flat, fertile, densest population, granary of Nepal', ne: 'समथर, उर्वर, सबैभन्दा घना जनसंख्या, नेपालको अन्नभण्डार' }],
        ],
      },
      {
        type: 'facts',
        items: [
          { label: { en: 'Highest point', ne: 'सबैभन्दा अग्लो बिन्दु' }, value: { en: 'Mt. Everest (Sagarmatha), 8,848.86 m', ne: 'सगरमाथा, ८,८४८.८६ मि.' } },
          { label: { en: 'Lowest point', ne: 'सबैभन्दा होचो बिन्दु' }, value: { en: 'Kechana Kalan, Jhapa (about 60–70 m)', ne: 'केचना कलन, झापा (करिब ६०–७० मि.)' } },
          { label: { en: 'Largest district by area', ne: 'क्षेत्रफलमा सबैभन्दा ठूलो जिल्ला' }, value: { en: 'Dolpa', ne: 'डोल्पा' } },
          { label: { en: 'Smallest district by area', ne: 'क्षेत्रफलमा सबैभन्दा सानो जिल्ला' }, value: { en: 'Bhaktapur', ne: 'भक्तपुर' } },
          { label: { en: 'Peaks above 8,000 m in Nepal', ne: 'नेपालमा ८,००० मि. माथिका हिमाल' }, value: { en: '8', ne: '८' } },
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'The eight-thousanders in Nepal, tallest first: Everest, Kanchenjunga, Lhotse, Makalu, Cho Oyu, Dhaulagiri, Manaslu, Annapurna I. Annapurna I is the only one entirely inside Nepal along with Manaslu and Dhaulagiri.',
          ne: 'नेपालका आठ हजारी हिमाल, अग्लोदेखि क्रमशः: सगरमाथा, कञ्चनजंघा, ल्होत्से, मकालु, चोयु, धौलागिरी, मनास्लु, अन्नपूर्ण प्रथम। धौलागिरी, मनास्लु र अन्नपूर्ण प्रथम पूर्ण रूपमा नेपालभित्र पर्छन्।',
        },
      },
    ],
  },
  {
    id: 'gkn-02',
    subjectId: 'gk-nepal',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Rivers, Lakes and Protected Areas', ne: 'नदी, ताल र संरक्षित क्षेत्र' },
    summary: {
      en: 'The four river systems, notable lakes and Nepal’s twenty protected areas.',
      ne: 'चार नदी प्रणाली, प्रमुख तालहरू र नेपालका बीस संरक्षित क्षेत्र।',
    },
    readMinutes: 7,
    blocks: [
      { type: 'heading', text: { en: 'River systems', ne: 'नदी प्रणाली' } },
      {
        type: 'list',
        items: [
          { en: 'Koshi system (Saptakoshi) — east Nepal, seven tributaries including Sunkoshi, Tamakoshi, Dudhkoshi, Arun and Tamor. Largest by drainage area in Nepal.', ne: 'कोशी प्रणाली (सप्तकोशी) — पूर्वी नेपाल, सुनकोशी, तामाकोशी, दूधकोशी, अरुण र तमोर सहित सात सहायक नदी। नेपालमा जलाधार क्षेत्रका हिसाबले सबैभन्दा ठूलो।' },
          { en: 'Gandaki system (Saptagandaki) — central Nepal, includes Kaligandaki, Trishuli, Marsyangdi, Budhigandaki, Seti and Madi.', ne: 'गण्डकी प्रणाली (सप्तगण्डकी) — मध्य नेपाल, कालीगण्डकी, त्रिशूली, मर्स्याङ्दी, बूढीगण्डकी, सेती र मादी समावेश।' },
          { en: 'Karnali system — west Nepal, the longest river of Nepal at about 507 km within the country.', ne: 'कर्णाली प्रणाली — पश्चिम नेपाल, देशभित्र करिब ५०७ कि.मि. लामो, नेपालको सबैभन्दा लामो नदी।' },
          { en: 'Mahakali — forms the western boundary with India.', ne: 'महाकाली — भारतसँगको पश्चिमी सिमाना बनाउँछ।' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Rivers are classified by source: himalayan-origin (perennial, snow fed — Koshi, Gandaki, Karnali, Mahakali), mahabharat-origin (Bagmati, Kankai, Rapti, Babai) and chure-origin (seasonal).',
          ne: 'उद्गमका आधारमा नदी वर्गीकरण: हिमालबाट निस्किएका (वर्षैभरि बग्ने — कोशी, गण्डकी, कर्णाली, महाकाली), महाभारतबाट निस्किएका (बागमती, कन्काई, राप्ती, बबई) र चुरेबाट निस्किएका (मौसमी)।',
        },
      },
      { type: 'heading', text: { en: 'Lakes', ne: 'तालहरू' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Largest lake', ne: 'सबैभन्दा ठूलो ताल' }, value: { en: 'Rara, Mugu', ne: 'रारा, मुगु' } },
          { label: { en: 'Deepest lake', ne: 'सबैभन्दा गहिरो ताल' }, value: { en: 'Shey Phoksundo, Dolpa', ne: 'शे-फोक्सुन्डो, डोल्पा' } },
          { label: { en: 'Highest lake (among the world’s highest)', ne: 'सबैभन्दा अग्लो ताल' }, value: { en: 'Tilicho, Manang', ne: 'तिलिचो, मनाङ' } },
          { label: { en: 'Ramsar sites', ne: 'रामसार क्षेत्र' }, value: { en: '10', ne: '१०' } },
          { label: { en: 'First Ramsar site', ne: 'पहिलो रामसार क्षेत्र' }, value: { en: 'Koshi Tappu (1987)', ne: 'कोशी टप्पु (१९८७)' } },
        ],
      },
      { type: 'heading', text: { en: 'Protected areas — 20 in total', ne: 'संरक्षित क्षेत्र — जम्मा २०' } },
      {
        type: 'table',
        headers: [
          { en: 'Category', ne: 'वर्ग' },
          { en: 'Number', ne: 'संख्या' },
          { en: 'Examples', ne: 'उदाहरण' },
        ],
        rows: [
          [{ en: 'National parks', ne: 'राष्ट्रिय निकुञ्ज' }, { en: '12', ne: '१२' }, { en: 'Chitwan, Sagarmatha, Langtang, Bardiya, Rara', ne: 'चितवन, सगरमाथा, लाङटाङ, बर्दिया, रारा' }],
          [{ en: 'Wildlife reserves', ne: 'वन्यजन्तु आरक्ष' }, { en: '1', ne: '१' }, { en: 'Koshi Tappu', ne: 'कोशी टप्पु' }],
          [{ en: 'Hunting reserve', ne: 'शिकार आरक्ष' }, { en: '1', ne: '१' }, { en: 'Dhorpatan', ne: 'ढोरपाटन' }],
          [{ en: 'Conservation areas', ne: 'संरक्षण क्षेत्र' }, { en: '6', ne: '६' }, { en: 'Annapurna, Manaslu, Kanchenjunga, Api Nampa', ne: 'अन्नपूर्ण, मनास्लु, कञ्चनजंघा, अपि नाम्पा' }],
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Chitwan National Park (2030 BS / 1973) is Nepal’s first national park and its first natural World Heritage listing came in 1984. Annapurna Conservation Area is the largest protected area of Nepal.',
          ne: 'चितवन राष्ट्रिय निकुञ्ज (२०३० साल / सन् १९७३) नेपालको पहिलो राष्ट्रिय निकुञ्ज हो र सन् १९८४ मा विश्व सम्पदा सूचीमा पर्‍यो। अन्नपूर्ण संरक्षण क्षेत्र नेपालको सबैभन्दा ठूलो संरक्षित क्षेत्र हो।',
        },
      },
    ],
  },
  {
    id: 'gkn-03',
    subjectId: 'gk-nepal',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'History of Nepal — Unification to Republic', ne: 'नेपालको इतिहास — एकीकरणदेखि गणतन्त्रसम्म' },
    summary: {
      en: 'A dated timeline from Prithvi Narayan Shah to the promulgation of the 2072 constitution.',
      ne: 'पृथ्वीनारायण शाहदेखि संविधान २०७२ जारी हुँदासम्मको मिति सहितको कालक्रम।',
    },
    readMinutes: 9,
    blocks: [
      {
        type: 'table',
        headers: [
          { en: 'Year (BS / AD)', ne: 'साल (वि.सं. / ई.सं.)' },
          { en: 'Event', ne: 'घटना' },
        ],
        rows: [
          [{ en: '1825 BS / 1768 AD', ne: '१८२५ / १७६८' }, { en: 'Prithvi Narayan Shah captures Kantipur on Indra Jatra day; unification campaign gathers pace', ne: 'पृथ्वीनारायण शाहले इन्द्रजात्राको दिन कान्तिपुर विजय गरे; एकीकरण अभियान तीव्र' }],
          [{ en: '1871–72 BS / 1814–16 AD', ne: '१८७१–७२ / १८१४–१६' }, { en: 'Anglo-Nepal War, ended by the Treaty of Sugauli', ne: 'नेपाल–अंग्रेज युद्ध, सुगौली सन्धिबाट अन्त्य' }],
          [{ en: '1903 BS / 1846 AD', ne: '१९०३ / १८४६' }, { en: 'Kot Massacre; Jung Bahadur Rana begins 104 years of Rana rule', ne: 'कोत पर्व; जंगबहादुर राणाबाट १०४ वर्षे राणा शासन सुरु' }],
          [{ en: '2007 BS / 1951 AD', ne: '२००७ / १९५१' }, { en: 'Revolution ends Rana rule; democracy established', ne: 'क्रान्तिबाट राणा शासनको अन्त्य; प्रजातन्त्रको स्थापना' }],
          [{ en: '2015 BS / 1959 AD', ne: '२०१५ / १९५९' }, { en: 'First general election; B. P. Koirala becomes the first elected Prime Minister', ne: 'पहिलो आम निर्वाचन; बी.पी. कोइराला पहिलो निर्वाचित प्रधानमन्त्री' }],
          [{ en: '2017 BS / 1960 AD', ne: '२०१७ / १९६०' }, { en: 'King Mahendra dissolves parliament and starts the Panchayat system', ne: 'राजा महेन्द्रबाट संसद् विघटन र पञ्चायती व्यवस्था सुरु' }],
          [{ en: '2046 BS / 1990 AD', ne: '२०४६ / १९९०' }, { en: 'People’s Movement I restores multiparty democracy; Constitution 2047 promulgated', ne: 'जनआन्दोलन–१ बाट बहुदलीय व्यवस्था पुनःस्थापना; संविधान २०४७ जारी' }],
          [{ en: '2052 BS / 1996 AD', ne: '२०५२ / १९९६' }, { en: 'Armed conflict begins', ne: 'सशस्त्र द्वन्द्व सुरु' }],
          [{ en: '2062/63 BS / 2006 AD', ne: '२०६२/६३ / २००६' }, { en: 'People’s Movement II; Comprehensive Peace Accord signed on 5 Mangsir 2063 (21 Nov 2006)', ne: 'जनआन्दोलन–२; २०६३ मंसिर ५ गते विस्तृत शान्ति सम्झौता' }],
          [{ en: '2065 BS / 2008 AD', ne: '२०६५ / २००८' }, { en: 'First Constituent Assembly declares Nepal a federal democratic republic on 15 Jestha 2065 (28 May 2008)', ne: 'पहिलो संविधान सभाले २०६५ जेठ १५ गते नेपाललाई संघीय लोकतान्त्रिक गणतन्त्र घोषणा गर्‍यो' }],
          [{ en: '2072 BS / 2015 AD', ne: '२०७२ / २०१५' }, { en: 'Constitution of Nepal promulgated on 3 Ashoj 2072', ne: '२०७२ असोज ३ गते नेपालको संविधान जारी' }],
          [{ en: '2074 BS / 2017 AD', ne: '२०७४ / २०१७' }, { en: 'First elections to all three tiers under the new constitution', ne: 'नयाँ संविधान अनुसार तीनै तहको पहिलो निर्वाचन' }],
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Sugauli Treaty (1816): Nepal lost territory east of the Mechi, west of the Mahakali and part of the Terai; a British resident was stationed in Kathmandu. Some Terai land was returned in 1860 as a reward for Nepali help in the 1857 revolt.',
          ne: 'सुगौली सन्धि (१८१६): नेपालले मेचीभन्दा पूर्व, महाकालीभन्दा पश्चिम र तराईको केही भूभाग गुमायो; काठमाडौंमा ब्रिटिश रेजिडेन्ट राखियो। सन् १८५७ को विद्रोहमा गरेको सहयोगबापत सन् १८६० मा तराईको केही भूभाग फिर्ता भयो।',
        },
      },
    ],
  },
  {
    id: 'gkn-04',
    subjectId: 'gk-nepal',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Population, Society and Culture', ne: 'जनसंख्या, समाज र संस्कृति' },
    summary: {
      en: 'Census facts, languages and religions, national symbols and world heritage sites.',
      ne: 'जनगणनाका तथ्य, भाषा र धर्म, राष्ट्रिय प्रतीक र विश्व सम्पदा स्थल।',
    },
    readMinutes: 7,
    blocks: [
      { type: 'heading', text: { en: 'National Census 2078 BS (2021) headline figures', ne: 'राष्ट्रिय जनगणना २०७८ का मुख्य तथ्यांक' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Total population', ne: 'कुल जनसंख्या' }, value: { en: 'About 29.16 million', ne: 'करिब २ करोड ९१ लाख' } },
          { label: { en: 'Annual growth rate', ne: 'वार्षिक वृद्धिदर' }, value: { en: 'About 0.92%', ne: 'करिब ०.९२%' } },
          { label: { en: 'Sex ratio', ne: 'लैंगिक अनुपात' }, value: { en: 'About 95 males per 100 females', ne: 'प्रति १०० महिलामा करिब ९५ पुरुष' } },
          { label: { en: 'Most populous district', ne: 'सबैभन्दा बढी जनसंख्या भएको जिल्ला' }, value: { en: 'Kathmandu', ne: 'काठमाडौं' } },
          { label: { en: 'Least populous district', ne: 'सबैभन्दा कम जनसंख्या भएको जिल्ला' }, value: { en: 'Manang', ne: 'मनाङ' } },
          { label: { en: 'First modern census', ne: 'पहिलो आधुनिक जनगणना' }, value: { en: '2011 BS (1952/54)', ne: '२०११ साल' } },
        ],
      },
      {
        type: 'para',
        text: {
          en: 'Nepali, written in Devanagari script, is the official language of business at the federal level (Article 7). All languages spoken as mother tongues in Nepal are national languages. A province may adopt one or more additional official languages by law.',
          ne: 'देवनागरी लिपिमा लेखिने नेपाली भाषा संघीय तहको सरकारी कामकाजको भाषा हो (धारा ७)। नेपालमा बोलिने सबै मातृभाषा राष्ट्रभाषा हुन्। प्रदेशले कानून बनाई थप एक वा बढी सरकारी कामकाजको भाषा तोक्न सक्छ।',
        },
      },
      { type: 'heading', text: { en: 'National symbols', ne: 'राष्ट्रिय प्रतीक' } },
      {
        type: 'table',
        headers: [
          { en: 'Symbol', ne: 'प्रतीक' },
          { en: 'Nepal', ne: 'नेपाल' },
        ],
        rows: [
          [{ en: 'National flower', ne: 'राष्ट्रिय फूल' }, { en: 'Rhododendron (Lali Gurans)', ne: 'लालीगुराँस' }],
          [{ en: 'National bird', ne: 'राष्ट्रिय पन्छी' }, { en: 'Himalayan Monal (Danphe)', ne: 'डाँफे' }],
          [{ en: 'National animal', ne: 'राष्ट्रिय जनावर' }, { en: 'Cow', ne: 'गाई' }],
          [{ en: 'National colour', ne: 'राष्ट्रिय रङ' }, { en: 'Crimson', ne: 'सिम्रिक' }],
          [{ en: 'National anthem', ne: 'राष्ट्रिय गान' }, { en: '"Sayaun Thunga Phulka" — lyrics by Byakul Maila, music by Amber Gurung', ne: '"सयौं थुँगा फूलका" — शब्द: व्याकुल माइला, संगीत: अम्बर गुरुङ' }],
          [{ en: 'Flag', ne: 'झण्डा' }, { en: 'The only non-quadrilateral national flag in the world', ne: 'विश्वको एक मात्र चतुर्भुज नभएको राष्ट्रिय झण्डा' }],
        ],
      },
      { type: 'heading', text: { en: 'World Heritage Sites in Nepal', ne: 'नेपालका विश्व सम्पदा स्थल' } },
      {
        type: 'list',
        items: [
          { en: 'Kathmandu Valley — cultural, inscribed 1979', ne: 'काठमाडौं उपत्यका — सांस्कृतिक, सन् १९७९' },
          { en: 'Sagarmatha National Park — natural, inscribed 1979', ne: 'सगरमाथा राष्ट्रिय निकुञ्ज — प्राकृतिक, सन् १९७९' },
          { en: 'Chitwan National Park — natural, inscribed 1984', ne: 'चितवन राष्ट्रिय निकुञ्ज — प्राकृतिक, सन् १९८४' },
          { en: 'Lumbini, the birthplace of Lord Buddha — cultural, inscribed 1997', ne: 'लुम्बिनी, भगवान् बुद्धको जन्मस्थल — सांस्कृतिक, सन् १९९७' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'The Kathmandu Valley listing bundles seven monument zones: Hanuman Dhoka, Patan and Bhaktapur Durbar Squares, Swayambhu, Bauddhanath, Pashupatinath and Changu Narayan.',
          ne: 'काठमाडौं उपत्यकाको सूचीमा सात स्मारक क्षेत्र पर्छन्: हनुमानढोका, पाटन र भक्तपुर दरबार क्षेत्र, स्वयम्भू, बौद्धनाथ, पशुपतिनाथ र चाँगुनारायण।',
        },
      },
    ],
  },
];
