import type { Lesson } from '../../types';

export const constitutionLessons: Lesson[] = [
  {
    id: 'con-01',
    subjectId: 'constitution',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Constitution of Nepal 2072 — At a Glance', ne: 'नेपालको संविधान २०७२ — एक नजरमा' },
    summary: {
      en: 'Promulgation, structure, guiding character of the state and the numbers you must be able to recall instantly.',
      ne: 'जारी मिति, संरचना, राज्यको मार्गनिर्देशक चरित्र र तुरुन्तै सम्झनुपर्ने अंकहरू।',
    },
    readMinutes: 7,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'The Constitution of Nepal was promulgated by the second Constituent Assembly on 3 Ashoj 2072 BS (20 September 2015). It replaced the Interim Constitution of Nepal 2063 and made Nepal a federal democratic republic in constitutional text as well as in practice.',
          ne: 'नेपालको संविधान दोस्रो संविधान सभाबाट २०७२ साल असोज ३ गते (२० सेप्टेम्बर २०१५) जारी भएको हो। यसले नेपालको अन्तरिम संविधान २०६३ लाई प्रतिस्थापन गर्दै नेपाललाई संवैधानिक पाठमा र व्यवहारमा समेत संघीय लोकतान्त्रिक गणतन्त्र बनायो।',
        },
      },
      {
        type: 'facts',
        items: [
          { label: { en: 'Promulgated on', ne: 'जारी मिति' }, value: { en: '3 Ashoj 2072 BS (20 Sept 2015)', ne: '२०७२ असोज ३ गते' } },
          { label: { en: 'Made by', ne: 'निर्माणकर्ता' }, value: { en: 'Second Constituent Assembly', ne: 'दोस्रो संविधान सभा' } },
          { label: { en: 'Parts', ne: 'भाग' }, value: { en: '35', ne: '३५' } },
          { label: { en: 'Articles', ne: 'धारा' }, value: { en: '308', ne: '३०८' } },
          { label: { en: 'Schedules', ne: 'अनुसूची' }, value: { en: '9', ne: '९' } },
          { label: { en: 'Constitution number for Nepal', ne: 'नेपालको कैौं संविधान' }, value: { en: 'Seventh', ne: 'सातौं' } },
        ],
      },
      { type: 'heading', text: { en: 'Character of the State (Article 4)', ne: 'राज्यको स्वरूप (धारा ४)' } },
      {
        type: 'para',
        text: {
          en: 'Nepal is an independent, indivisible, sovereign, secular, inclusive, democracy-loving, socialism-oriented, federal democratic republican state. "Secular" is explained in the constitution as religious and cultural freedom, including protection of religion and culture handed down from ancient times.',
          ne: 'नेपाल स्वतन्त्र, अविभाज्य, सार्वभौमसत्तासम्पन्न, धर्मनिरपेक्ष, समावेशी, लोकतन्त्रमा आधारित, समाजवाद उन्मुख, संघीय लोकतान्त्रिक गणतन्त्रात्मक राज्य हो। "धर्मनिरपेक्ष" भन्नाले सनातनदेखि चलिआएको धर्म–संस्कृतिको संरक्षण लगायत धार्मिक तथा सांस्कृतिक स्वतन्त्रता सम्झनुपर्छ भनी संविधानमै स्पष्ट पारिएको छ।',
        },
      },
      { type: 'heading', text: { en: 'The seven constitutions of Nepal', ne: 'नेपालका सात संविधान' } },
      {
        type: 'list',
        ordered: true,
        items: [
          { en: 'Government of Nepal Act, 2004 BS — first written constitution', ne: 'नेपाल सरकार वैधानिक कानून, २००४ — पहिलो लिखित संविधान' },
          { en: 'Interim Government of Nepal Act, 2007 BS', ne: 'नेपाल अन्तरिम शासन विधान, २००७' },
          { en: 'Constitution of the Kingdom of Nepal, 2015 BS', ne: 'नेपाल अधिराज्यको संविधान, २०१५' },
          { en: 'Constitution of Nepal, 2019 BS — Panchayat system', ne: 'नेपालको संविधान, २०१९ — पञ्चायती व्यवस्था' },
          { en: 'Constitution of the Kingdom of Nepal, 2047 BS — constitutional monarchy', ne: 'नेपाल अधिराज्यको संविधान, २०४७ — संवैधानिक राजतन्त्र' },
          { en: 'Interim Constitution of Nepal, 2063 BS', ne: 'नेपालको अन्तरिम संविधान, २०६३' },
          { en: 'Constitution of Nepal, 2072 BS — in force today', ne: 'नेपालको संविधान, २०७२ — हाल कार्यान्वयनमा' },
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Examiners love the counting facts: 35 parts, 308 articles, 9 schedules, 31 fundamental rights, 7 provinces, 753 local levels, 13 constitutional bodies.',
          ne: 'परीक्षामा गणनासम्बन्धी तथ्य बारम्बार सोधिन्छ: ३५ भाग, ३०८ धारा, ९ अनुसूची, ३१ मौलिक हक, ७ प्रदेश, ७५३ स्थानीय तह, १३ संवैधानिक निकाय।',
        },
      },
    ],
  },
  {
    id: 'con-02',
    subjectId: 'constitution',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Fundamental Rights and Duties', ne: 'मौलिक हक तथा कर्तव्य' },
    summary: {
      en: 'The 31 fundamental rights of Part 3, the duties of citizens, and how rights are enforced.',
      ne: 'भाग ३ का ३१ मौलिक हक, नागरिकका कर्तव्य र हक कार्यान्वयनको बाटो।',
    },
    readMinutes: 8,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Part 3 of the constitution (Articles 16 to 46) guarantees 31 fundamental rights. Article 46 gives the right to constitutional remedy: any citizen may petition the Supreme Court under Article 133 or a High Court under Article 144 when a fundamental right is violated.',
          ne: 'संविधानको भाग ३ (धारा १६ देखि ४६) ले ३१ वटा मौलिक हकको प्रत्याभूति गरेको छ। धारा ४६ ले संवैधानिक उपचारको हक दिन्छ — मौलिक हक हनन भएमा नागरिकले धारा १३३ अन्तर्गत सर्वोच्च अदालत वा धारा १४४ अन्तर्गत उच्च अदालतमा निवेदन दिन सक्छन्।',
        },
      },
      { type: 'heading', text: { en: 'Rights you should be able to name', ne: 'नाम लिनसक्नुपर्ने प्रमुख हकहरू' } },
      {
        type: 'table',
        headers: [
          { en: 'Article', ne: 'धारा' },
          { en: 'Right', ne: 'हक' },
        ],
        rows: [
          [{ en: '16', ne: '१६' }, { en: 'Right to live with dignity', ne: 'सम्मानपूर्वक बाँच्न पाउने हक' }],
          [{ en: '17', ne: '१७' }, { en: 'Right to freedom', ne: 'स्वतन्त्रताको हक' }],
          [{ en: '18', ne: '१८' }, { en: 'Right to equality', ne: 'समानताको हक' }],
          [{ en: '19', ne: '१९' }, { en: 'Right to communication', ne: 'सञ्चारको हक' }],
          [{ en: '20', ne: '२०' }, { en: 'Rights relating to justice', ne: 'न्याय सम्बन्धी हक' }],
          [{ en: '25', ne: '२५' }, { en: 'Right to property', ne: 'सम्पत्तिको हक' }],
          [{ en: '27', ne: '२७' }, { en: 'Right to information', ne: 'सूचनाको हक' }],
          [{ en: '31', ne: '३१' }, { en: 'Right relating to education', ne: 'शिक्षा सम्बन्धी हक' }],
          [{ en: '35', ne: '३५' }, { en: 'Right relating to health care', ne: 'स्वास्थ्य सम्बन्धी हक' }],
          [{ en: '36', ne: '३६' }, { en: 'Right relating to food', ne: 'खाद्य सम्बन्धी हक' }],
          [{ en: '38', ne: '३८' }, { en: 'Right of women', ne: 'महिलाको हक' }],
          [{ en: '40', ne: '४०' }, { en: 'Right of Dalit', ne: 'दलितको हक' }],
          [{ en: '46', ne: '४६' }, { en: 'Right to constitutional remedy', ne: 'संवैधानिक उपचारको हक' }],
        ],
      },
      { type: 'heading', text: { en: 'Duties of citizens (Article 48)', ne: 'नागरिकका कर्तव्य (धारा ४८)' } },
      {
        type: 'list',
        items: [
          { en: 'Safeguard the nationality, sovereignty and integrity of Nepal while being loyal to the nation', ne: 'राष्ट्रप्रति निष्ठावान् रही नेपालको राष्ट्रियता, सार्वभौमसत्ता र अखण्डताको रक्षा गर्ने' },
          { en: 'Abide by the constitution and law', ne: 'संविधान र कानूनको पालना गर्ने' },
          { en: 'Render compulsory service when the state so requires', ne: 'राज्यले चाहेको बखत अनिवार्य सेवा गर्ने' },
          { en: 'Protect public property', ne: 'सार्वजनिक सम्पत्तिको संरक्षण गर्ने' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Part 4 (Articles 49–55) contains directive principles, policies and obligations of the state. These are not enforceable in court, unlike fundamental rights — a very common one-mark trap.',
          ne: 'भाग ४ (धारा ४९–५५) मा राज्यका निर्देशक सिद्धान्त, नीति तथा दायित्व छन्। मौलिक हक जस्तो यी अदालतबाट कार्यान्वयन गराउन सकिँदैन — यो एक अंकको प्रश्नमा बारम्बार आउने पासो हो।',
        },
      },
    ],
  },
  {
    id: 'con-03',
    subjectId: 'constitution',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Federal Structure and Distribution of Powers', ne: 'संघीय संरचना र अधिकारको बाँडफाँट' },
    summary: {
      en: 'Three tiers of government, the seven provinces, 753 local levels and what the nine schedules assign to whom.',
      ne: 'सरकारका तीन तह, सात प्रदेश, ७५३ स्थानीय तह र नौ अनुसूचीले कसलाई के अधिकार दिएका छन्।',
    },
    readMinutes: 9,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Article 56 establishes three levels of state structure: federation, province and local level. Article 57 distributes powers through the schedules. Article 232 states that the relation between the three tiers is based on cooperation, coexistence and coordination.',
          ne: 'धारा ५६ ले संघ, प्रदेश र स्थानीय तह गरी तीन तहको राज्य संरचना स्थापित गर्छ। धारा ५७ ले अनुसूचीमार्फत अधिकार बाँडफाँट गर्छ। धारा २३२ अनुसार तीन तहबीचको सम्बन्ध सहकारिता, सहअस्तित्व र समन्वयको सिद्धान्तमा आधारित हुन्छ।',
        },
      },
      { type: 'heading', text: { en: 'What each schedule contains', ne: 'कुन अनुसूचीमा के छ' } },
      {
        type: 'table',
        headers: [
          { en: 'Schedule', ne: 'अनुसूची' },
          { en: 'Powers of', ne: 'कसको अधिकार' },
        ],
        rows: [
          [{ en: 'Schedule 5', ne: 'अनुसूची ५' }, { en: 'Federation (exclusive)', ne: 'संघको एकल अधिकार' }],
          [{ en: 'Schedule 6', ne: 'अनुसूची ६' }, { en: 'Province (exclusive)', ne: 'प्रदेशको एकल अधिकार' }],
          [{ en: 'Schedule 7', ne: 'अनुसूची ७' }, { en: 'Concurrent — federation and province', ne: 'संघ र प्रदेशको साझा अधिकार' }],
          [{ en: 'Schedule 8', ne: 'अनुसूची ८' }, { en: 'Local level (exclusive)', ne: 'स्थानीय तहको एकल अधिकार' }],
          [{ en: 'Schedule 9', ne: 'अनुसूची ९' }, { en: 'Concurrent — federation, province and local level', ne: 'संघ, प्रदेश र स्थानीय तहको साझा अधिकार' }],
        ],
      },
      { type: 'heading', text: { en: 'The seven provinces and their capitals', ne: 'सात प्रदेश र तिनका राजधानी' } },
      {
        type: 'table',
        headers: [
          { en: 'Province', ne: 'प्रदेश' },
          { en: 'Capital', ne: 'राजधानी' },
          { en: 'Districts', ne: 'जिल्ला' },
        ],
        rows: [
          [{ en: 'Koshi', ne: 'कोशी' }, { en: 'Biratnagar', ne: 'विराटनगर' }, { en: '14', ne: '१४' }],
          [{ en: 'Madhesh', ne: 'मधेश' }, { en: 'Janakpur', ne: 'जनकपुर' }, { en: '8', ne: '८' }],
          [{ en: 'Bagmati', ne: 'बागमती' }, { en: 'Hetauda', ne: 'हेटौंडा' }, { en: '13', ne: '१३' }],
          [{ en: 'Gandaki', ne: 'गण्डकी' }, { en: 'Pokhara', ne: 'पोखरा' }, { en: '11', ne: '११' }],
          [{ en: 'Lumbini', ne: 'लुम्बिनी' }, { en: 'Deukhuri (Dang)', ne: 'देउखुरी (दाङ)' }, { en: '12', ne: '१२' }],
          [{ en: 'Karnali', ne: 'कर्णाली' }, { en: 'Birendranagar (Surkhet)', ne: 'वीरेन्द्रनगर (सुर्खेत)' }, { en: '10', ne: '१०' }],
          [{ en: 'Sudurpashchim', ne: 'सुदूरपश्चिम' }, { en: 'Godawari (Kailali)', ne: 'गोदावरी (कैलाली)' }, { en: '9', ne: '९' }],
        ],
      },
      { type: 'heading', text: { en: 'The 753 local levels', ne: '७५३ स्थानीय तह' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Metropolitan cities', ne: 'महानगरपालिका' }, value: { en: '6', ne: '६' } },
          { label: { en: 'Sub-metropolitan cities', ne: 'उपमहानगरपालिका' }, value: { en: '11', ne: '११' } },
          { label: { en: 'Municipalities', ne: 'नगरपालिका' }, value: { en: '276', ne: '२७६' } },
          { label: { en: 'Rural municipalities', ne: 'गाउँपालिका' }, value: { en: '460', ne: '४६०' } },
          { label: { en: 'Total', ne: 'जम्मा' }, value: { en: '753', ne: '७५३' } },
          { label: { en: 'District coordination committees', ne: 'जिल्ला समन्वय समिति' }, value: { en: '77', ne: '७७' } },
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Residual powers — anything not listed in any schedule — rest with the federation (Article 58).',
          ne: 'अवशिष्ट अधिकार — कुनै पनि अनुसूचीमा उल्लेख नभएका विषय — संघमा रहन्छ (धारा ५८)।',
        },
      },
    ],
  },
  {
    id: 'con-04',
    subjectId: 'constitution',
    levels: ['adhikrit', 'nayabsubba'],
    title: { en: 'Organs of the State: Legislature, Executive and Judiciary', ne: 'राज्यका अंग: व्यवस्थापिका, कार्यपालिका र न्यायपालिका' },
    summary: {
      en: 'Composition of the Federal Parliament, the executive under the President and Prime Minister, and the court hierarchy.',
      ne: 'संघीय संसद्को गठन, राष्ट्रपति र प्रधानमन्त्री अन्तर्गतको कार्यपालिका र अदालतको संरचना।',
    },
    readMinutes: 9,
    blocks: [
      { type: 'heading', text: { en: 'Federal Parliament (Article 83)', ne: 'संघीय संसद् (धारा ८३)' } },
      {
        type: 'para',
        text: {
          en: 'The Federal Parliament is bicameral: the House of Representatives and the National Assembly.',
          ne: 'संघीय संसद् द्विसदनात्मक छ: प्रतिनिधि सभा र राष्ट्रिय सभा।',
        },
      },
      {
        type: 'table',
        headers: [
          { en: 'Feature', ne: 'विशेषता' },
          { en: 'House of Representatives', ne: 'प्रतिनिधि सभा' },
          { en: 'National Assembly', ne: 'राष्ट्रिय सभा' },
        ],
        rows: [
          [
            { en: 'Members', ne: 'सदस्य' },
            { en: '275 (165 first-past-the-post + 110 proportional)', ne: '२७५ (१६५ प्रत्यक्ष + ११० समानुपातिक)' },
            { en: '59 (56 elected by electoral college, 3 nominated by President)', ne: '५९ (५६ निर्वाचक मण्डलबाट निर्वाचित, ३ राष्ट्रपतिबाट मनोनीत)' },
          ],
          [
            { en: 'Term', ne: 'कार्यकाल' },
            { en: '5 years', ne: '५ वर्ष' },
            { en: 'Permanent house; 6-year term, one third retire every 2 years', ne: 'स्थायी सदन; ६ वर्षे कार्यकाल, हरेक २ वर्षमा एक तिहाइ अवकाश' },
          ],
          [
            { en: 'Presiding officer', ne: 'सभाध्यक्ष' },
            { en: 'Speaker and Deputy Speaker', ne: 'सभामुख र उपसभामुख' },
            { en: 'Chairperson and Vice-Chairperson', ne: 'अध्यक्ष र उपाध्यक्ष' },
          ],
        ],
      },
      { type: 'heading', text: { en: 'Executive', ne: 'कार्यपालिका' } },
      {
        type: 'list',
        items: [
          { en: 'The President is the head of state and symbol of national unity; elected by an electoral college of federal parliament members and provincial assembly members, for a five-year term, maximum two terms.', ne: 'राष्ट्रपति राष्ट्राध्यक्ष एवं राष्ट्रिय एकताको प्रतीक हो; संघीय संसद् र प्रदेश सभा सदस्यहरूको निर्वाचक मण्डलबाट पाँच वर्षका लागि निर्वाचित, बढीमा दुई कार्यकाल।' },
          { en: 'Executive power of Nepal is vested in the Council of Ministers (Article 75), headed by the Prime Minister, with a maximum of 25 ministers.', ne: 'नेपालको कार्यकारिणी अधिकार मन्त्रिपरिषद्मा निहित छ (धारा ७५), प्रधानमन्त्री अध्यक्ष हुने र बढीमा २५ जना मन्त्री रहने।' },
          { en: 'The Council of Ministers is collectively responsible to the House of Representatives; ministers are individually responsible for their ministry.', ne: 'मन्त्रिपरिषद् सामूहिक रूपमा प्रतिनिधि सभाप्रति उत्तरदायी हुन्छ; मन्त्री आफ्नो मन्त्रालयका लागि व्यक्तिगत रूपमा उत्तरदायी हुन्छन्।' },
        ],
      },
      { type: 'heading', text: { en: 'Judiciary (Part 11)', ne: 'न्यायपालिका (भाग ११)' } },
      {
        type: 'facts',
        items: [
          { label: { en: 'Supreme Court', ne: 'सर्वोच्च अदालत' }, value: { en: 'Chief Justice + up to 20 justices', ne: 'प्रधान न्यायाधीश + बढीमा २० न्यायाधीश' } },
          { label: { en: 'High Courts', ne: 'उच्च अदालत' }, value: { en: '7 — one per province', ne: '७ — प्रत्येक प्रदेशमा एक' } },
          { label: { en: 'District Courts', ne: 'जिल्ला अदालत' }, value: { en: '77 — one per district', ne: '७७ — प्रत्येक जिल्लामा एक' } },
          { label: { en: 'Constitutional Bench', ne: 'संवैधानिक इजलास' }, value: { en: 'Chief Justice + 4 justices', ne: 'प्रधान न्यायाधीश + ४ न्यायाधीश' } },
          { label: { en: 'Chief Justice tenure', ne: 'प्रधान न्यायाधीशको कार्यकाल' }, value: { en: '6 years, or until the age of 65', ne: '६ वर्ष, वा ६५ वर्ष उमेर पुगेसम्म' } },
          { label: { en: 'Judicial Council', ne: 'न्याय परिषद्' }, value: { en: '5 members, chaired by the Chief Justice', ne: '५ सदस्य, प्रधान न्यायाधीशको अध्यक्षतामा' } },
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Judicial review of laws inconsistent with the constitution goes to the Constitutional Bench under Article 133(1); other extraordinary jurisdiction petitions go to the Supreme Court under Article 133(2) and (3).',
          ne: 'संविधानसँग बाझिने कानूनको न्यायिक पुनरावलोकन धारा १३३(१) अनुसार संवैधानिक इजलासमा जान्छ; अन्य असाधारण अधिकारक्षेत्रका निवेदन धारा १३३(२) र (३) अनुसार सर्वोच्च अदालतमा जान्छन्।',
        },
      },
    ],
  },
  {
    id: 'con-05',
    subjectId: 'constitution',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'The Thirteen Constitutional Bodies', ne: 'तेह्र संवैधानिक निकाय' },
    summary: {
      en: 'Every constitutional commission, the article that creates it and what it does.',
      ne: 'प्रत्येक संवैधानिक आयोग, तिनलाई स्थापना गर्ने धारा र तिनको काम।',
    },
    readMinutes: 6,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'Part 21 to Part 27 of the constitution create thirteen constitutional bodies. Their office holders are appointed by the President on the recommendation of the Constitutional Council, and can be removed only through a parliamentary impeachment motion.',
          ne: 'संविधानको भाग २१ देखि भाग २७ सम्म तेह्र वटा संवैधानिक निकायको व्यवस्था छ। यिनका पदाधिकारी संवैधानिक परिषद्को सिफारिसमा राष्ट्रपतिबाट नियुक्त हुन्छन् र संसदीय महाभियोग प्रस्तावबाट मात्र हटाउन सकिन्छ।',
        },
      },
      {
        type: 'table',
        headers: [
          { en: 'Body', ne: 'निकाय' },
          { en: 'Article', ne: 'धारा' },
          { en: 'Core mandate', ne: 'मुख्य कार्यादेश' },
        ],
        rows: [
          [{ en: 'Commission for the Investigation of Abuse of Authority (CIAA)', ne: 'अख्तियार दुरुपयोग अनुसन्धान आयोग' }, { en: '238', ne: '२३८' }, { en: 'Investigate improper conduct and corruption by public office holders', ne: 'सार्वजनिक पद धारण गरेकाको अनुचित कार्य र भ्रष्टाचारको अनुसन्धान' }],
          [{ en: 'Auditor General', ne: 'महालेखा परीक्षक' }, { en: '241', ne: '२४१' }, { en: 'Final audit of federal, provincial and local public accounts', ne: 'संघ, प्रदेश र स्थानीय सार्वजनिक लेखाको अन्तिम लेखापरीक्षण' }],
          [{ en: 'Public Service Commission', ne: 'लोक सेवा आयोग' }, { en: '242', ne: '२४२' }, { en: 'Select candidates for the civil service and advise on service conditions', ne: 'निजामती सेवाका लागि उम्मेदवार छनोट र सेवा सर्तसम्बन्धी परामर्श' }],
          [{ en: 'Election Commission', ne: 'निर्वाचन आयोग' }, { en: '245', ne: '२४५' }, { en: 'Conduct and supervise all elections and the voter roll', ne: 'सबै निर्वाचन र मतदाता नामावलीको सञ्चालन तथा सुपरिवेक्षण' }],
          [{ en: 'National Human Rights Commission', ne: 'राष्ट्रिय मानव अधिकार आयोग' }, { en: '248', ne: '२४८' }, { en: 'Respect, protection and promotion of human rights', ne: 'मानव अधिकारको सम्मान, संरक्षण र सम्वर्धन' }],
          [{ en: 'National Natural Resources and Fiscal Commission', ne: 'राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोग' }, { en: '250', ne: '२५०' }, { en: 'Recommend revenue sharing and fiscal transfers between tiers', ne: 'तहबीच राजस्व बाँडफाँट र वित्तीय हस्तान्तरणको सिफारिस' }],
          [{ en: 'National Women Commission', ne: 'राष्ट्रिय महिला आयोग' }, { en: '252', ne: '२५२' }, { en: 'Rights and interests of women', ne: 'महिलाको हक र हित' }],
          [{ en: 'National Dalit Commission', ne: 'राष्ट्रिय दलित आयोग' }, { en: '255', ne: '२५५' }, { en: 'Rights and interests of the Dalit community', ne: 'दलित समुदायको हक र हित' }],
          [{ en: 'National Inclusion Commission', ne: 'राष्ट्रिय समावेशी आयोग' }, { en: '258', ne: '२५८' }, { en: 'Inclusion of communities not covered by other commissions', ne: 'अन्य आयोगले नसमेटेका समुदायको समावेशीकरण' }],
          [{ en: 'Indigenous Nationalities Commission', ne: 'आदिवासी जनजाति आयोग' }, { en: '261', ne: '२६१' }, { en: 'Rights of indigenous nationalities', ne: 'आदिवासी जनजातिको हक' }],
          [{ en: 'Madhesi Commission', ne: 'मधेशी आयोग' }, { en: '262', ne: '२६२' }, { en: 'Rights of the Madhesi community', ne: 'मधेशी समुदायको हक' }],
          [{ en: 'Tharu Commission', ne: 'थारू आयोग' }, { en: '263', ne: '२६३' }, { en: 'Rights of the Tharu community', ne: 'थारू समुदायको हक' }],
          [{ en: 'Muslim Commission', ne: 'मुस्लिम आयोग' }, { en: '264', ne: '२६४' }, { en: 'Rights of the Muslim community', ne: 'मुस्लिम समुदायको हक' }],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'The last seven commissions (women through Muslim) are given a ten-year existence from the commencement of the constitution, subject to review by the Federal Parliament (Article 265).',
          ne: 'अन्तिम सात आयोग (महिलादेखि मुस्लिमसम्म) संविधान प्रारम्भ भएको मितिले दश वर्षसम्मका लागि रहने र संघीय संसद्ले पुनरावलोकन गर्ने व्यवस्था छ (धारा २६५)।',
        },
      },
      {
        type: 'para',
        text: {
          en: 'The Constitutional Council (Article 284) is chaired by the Prime Minister and includes the Chief Justice, Speaker, Chairperson of the National Assembly, Leader of the Opposition and Deputy Speaker.',
          ne: 'संवैधानिक परिषद् (धारा २८४) को अध्यक्ष प्रधानमन्त्री हुन्छन् र सदस्यमा प्रधान न्यायाधीश, सभामुख, राष्ट्रिय सभाका अध्यक्ष, विपक्षी दलका नेता र उपसभामुख रहन्छन्।',
        },
      },
    ],
  },
];
