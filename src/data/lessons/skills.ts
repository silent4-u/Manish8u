import type { Lesson } from '../../types';

export const skillLessons: Lesson[] = [
  {
    id: 'iq-01',
    subjectId: 'iq',
    levels: ['nayabsubba', 'kharidar'],
    title: { en: 'Cracking the General Intelligence Test', ne: 'सामान्य बौद्धिकता परीक्षण जित्ने तरिका' },
    summary: {
      en: 'The recurring question types and a worked method for each.',
      ne: 'बारम्बार आउने प्रश्नका प्रकार र प्रत्येकका लागि समाधानको विधि।',
    },
    readMinutes: 9,
    blocks: [
      { type: 'heading', text: { en: 'Number and letter series', ne: 'संख्या र अक्षर शृंखला' } },
      {
        type: 'para',
        text: {
          en: 'Find the difference between consecutive terms first. If differences are constant it is arithmetic; if the ratio is constant it is geometric; if the differences themselves form a pattern, work one level deeper. Example: 2, 6, 12, 20, 30, ? — differences are 4, 6, 8, 10, so the next difference is 12 and the answer is 42.',
          ne: 'पहिले लगातार पदबीचको अन्तर निकाल्नुहोस्। अन्तर स्थिर छ भने समान्तर, अनुपात स्थिर छ भने गुणोत्तर हो; अन्तर आफैँले ढाँचा बनाउँछ भने एक तह गहिरो जानुहोस्। उदाहरण: २, ६, १२, २०, ३०, ? — अन्तर ४, ६, ८, १० छन्, त्यसैले अर्को अन्तर १२ र उत्तर ४२ हुन्छ।',
        },
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'For letter series, write the position numbers (A=1 … Z=26) under the letters. Almost every letter puzzle becomes a number puzzle once you do this.',
          ne: 'अक्षर शृंखलामा अक्षरमुनि स्थान संख्या (A=१ … Z=२६) लेख्नुहोस्। यसो गरेपछि अक्षरका लगभग सबै प्रश्न संख्याको प्रश्नमा बदलिन्छन्।',
        },
      },
      { type: 'heading', text: { en: 'Coding and decoding', ne: 'कोडिङ र डिकोडिङ' } },
      {
        type: 'list',
        items: [
          { en: 'Letter shifting: each letter moves a fixed number of places forward or backward', ne: 'अक्षर सार्ने: प्रत्येक अक्षर निश्चित स्थान अगाडि वा पछाडि सर्छ' },
          { en: 'Reverse coding: the word is written backwards, sometimes with a shift', ne: 'उल्टो कोडिङ: शब्द उल्टो लेखिन्छ, कहिलेकाहीँ सार्नेसहित' },
          { en: 'Number coding: each letter is replaced by its position or a function of it', ne: 'संख्या कोडिङ: प्रत्येक अक्षर आफ्नो स्थान वा त्यसको कुनै सूत्रले प्रतिस्थापित हुन्छ' },
          { en: 'Substitution coding: whole words are swapped, e.g. "sky is called water"', ne: 'प्रतिस्थापन कोडिङ: पूरै शब्द साटिन्छ, जस्तै "आकाशलाई पानी भनिन्छ"' },
        ],
      },
      { type: 'heading', text: { en: 'Blood relations', ne: 'नाता सम्बन्ध' } },
      {
        type: 'para',
        text: {
          en: 'Draw a family tree. Use a horizontal line for a married couple, a vertical line for parent to child, and mark gender with + and −. Read the statement from the end backwards: in "pointing to a man, she said he is the son of my grandfather’s only son", the grandfather’s only son is her father, so the man is her brother.',
          ne: 'वंशवृक्ष कोर्नुहोस्। विवाहित जोडीका लागि तेर्सो रेखा, आमाबुबादेखि सन्तानसम्म ठाडो रेखा प्रयोग गर्नुहोस् र लिंग + तथा − ले चिनाउनुहोस्। वाक्यलाई अन्त्यबाट पछाडि पढ्नुहोस्: "एक पुरुषतर्फ देखाउँदै उनले भनिन्, उहाँ मेरा हजुरबुबाका एक मात्र छोराका छोरा हुन्" भन्दा हजुरबुबाका एक मात्र छोरा उनका बुबा भए, त्यसैले ती पुरुष उनका दाजु/भाइ हुन्।',
        },
      },
      { type: 'heading', text: { en: 'Quick arithmetic formulas', ne: 'द्रुत अंकगणितीय सूत्र' } },
      {
        type: 'table',
        headers: [
          { en: 'Topic', ne: 'विषय' },
          { en: 'Formula', ne: 'सूत्र' },
        ],
        rows: [
          [{ en: 'Percentage change', ne: 'प्रतिशत परिवर्तन' }, { en: '(new − old) ÷ old × 100', ne: '(नयाँ − पुरानो) ÷ पुरानो × १००' }],
          [{ en: 'Profit percent', ne: 'नाफा प्रतिशत' }, { en: 'Profit ÷ cost price × 100', ne: 'नाफा ÷ क्रय मूल्य × १००' }],
          [{ en: 'Simple interest', ne: 'साधारण ब्याज' }, { en: 'P × T × R ÷ 100', ne: 'साँवा × समय × दर ÷ १००' }],
          [{ en: 'Average', ne: 'औसत' }, { en: 'Sum of terms ÷ number of terms', ne: 'पदहरूको योग ÷ पदको संख्या' }],
          [{ en: 'Time and work', ne: 'समय र कार्य' }, { en: 'If A takes a days, A’s one-day work is 1/a', ne: 'A लाई a दिन लाग्छ भने A को एक दिनको काम १/a' }],
          [{ en: 'Speed', ne: 'गति' }, { en: 'Distance ÷ time; km/h to m/s multiply by 5/18', ne: 'दूरी ÷ समय; कि.मि./घण्टालाई मि./सेकेन्ड बनाउन ५/१८ ले गुणन' }],
        ],
      },
    ],
  },
  {
    id: 'nep-01',
    subjectId: 'nepali',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Nepali Grammar for the Exam', ne: 'परीक्षाका लागि नेपाली व्याकरण' },
    summary: {
      en: 'Sandhi, samas, karak, spelling rules and the idioms that repeat every year.',
      ne: 'सन्धि, समास, कारक, हिज्जेका नियम र प्रत्येक वर्ष दोहोरिने उखान–टुक्का।',
    },
    readMinutes: 8,
    blocks: [
      { type: 'heading', text: { en: 'Sandhi (सन्धि)', ne: 'सन्धि' } },
      {
        type: 'table',
        headers: [
          { en: 'Type', ne: 'प्रकार' },
          { en: 'Example', ne: 'उदाहरण' },
        ],
        rows: [
          [{ en: 'Swar sandhi', ne: 'स्वर सन्धि' }, { en: 'विद्या + आलय = विद्यालय', ne: 'विद्या + आलय = विद्यालय' }],
          [{ en: 'Vyanjan sandhi', ne: 'व्यञ्जन सन्धि' }, { en: 'सत् + जन = सज्जन', ne: 'सत् + जन = सज्जन' }],
          [{ en: 'Visarga sandhi', ne: 'विसर्ग सन्धि' }, { en: 'निः + चय = निश्चय', ne: 'निः + चय = निश्चय' }],
        ],
      },
      { type: 'heading', text: { en: 'Karak (कारक) — the six relations', ne: 'कारक — छ सम्बन्ध' } },
      {
        type: 'list',
        items: [
          { en: 'Karta (subject) — le / ले', ne: 'कर्ता — ले' },
          { en: 'Karma (object) — lai / लाई', ne: 'कर्म — लाई' },
          { en: 'Karan (instrument) — le, dwara / ले, द्वारा', ne: 'करण — ले, द्वारा' },
          { en: 'Sampradan (recipient) — lai, ko lagi / लाई, को लागि', ne: 'सम्प्रदान — लाई, को लागि' },
          { en: 'Apadan (separation) — bata, dekhi / बाट, देखि', ne: 'अपादान — बाट, देखि' },
          { en: 'Adhikaran (location) — ma, mathi / मा, माथि', ne: 'अधिकरण — मा, माथि' },
        ],
      },
      { type: 'heading', text: { en: 'Frequently asked idioms and proverbs', ne: 'बारम्बार सोधिने उखान र टुक्का' } },
      {
        type: 'table',
        headers: [
          { en: 'Idiom / proverb', ne: 'उखान / टुक्का' },
          { en: 'Meaning', ne: 'अर्थ' },
        ],
        rows: [
          [{ en: 'हात धुनु', ne: 'हात धुनु' }, { en: 'To lose or give up something', ne: 'गुमाउनु वा छोड्नु' }],
          [{ en: 'नाक काट्नु', ne: 'नाक काट्नु' }, { en: 'To bring disgrace', ne: 'इज्जत गुमाउनु' }],
          [{ en: 'आँखा चिम्लनु', ne: 'आँखा चिम्लनु' }, { en: 'To ignore deliberately, or to die', ne: 'जानीजानी बेवास्ता गर्नु, वा मर्नु' }],
          [{ en: 'हुरीले उडाएको खरजस्तो', ne: 'हुरीले उडाएको खरजस्तो' }, { en: 'Completely scattered and helpless', ne: 'पूर्ण रूपमा छरपष्ट र असहाय' }],
          [{ en: 'कान भर्नु', ne: 'कान भर्नु' }, { en: 'To poison someone’s mind against another', ne: 'अर्कोविरुद्ध कसैको मन बिगार्नु' }],
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'Spelling questions almost always test the same confusions: सम्बन्ध not सम्बन्ध्, प्रज्ञा not प्रग्या, अन्तर्राष्ट्रिय not अन्तराष्ट्रिय, उत्तरदायित्व not उत्तरदायीत्व. Write the correct forms out by hand until they feel automatic.',
          ne: 'हिज्जेका प्रश्नमा प्रायः उही अन्योल परीक्षण हुन्छ: प्रज्ञा (प्रग्या होइन), अन्तर्राष्ट्रिय (अन्तराष्ट्रिय होइन), उत्तरदायित्व (उत्तरदायीत्व होइन)। सही रूप स्वतःस्फूर्त नहुन्जेल हातले लेख्ने अभ्यास गर्नुहोस्।',
        },
      },
    ],
  },
  {
    id: 'eng-01',
    subjectId: 'english',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'English Grammar and Usage', ne: 'अंग्रेजी व्याकरण र प्रयोग' },
    summary: {
      en: 'Tense, voice, prepositions, subject-verb agreement and one-word substitutions.',
      ne: 'काल, वाच्य, पूर्वसर्ग, कर्ता–क्रिया मेल र एक शब्दमा अर्थ।',
    },
    readMinutes: 8,
    blocks: [
      { type: 'heading', text: { en: 'Subject–verb agreement traps', ne: 'कर्ता–क्रिया मेलका पासो' } },
      {
        type: 'list',
        items: [
          { en: 'Each, every, either, neither, everyone take a singular verb: "Each of the officers has signed."', ne: 'Each, every, either, neither, everyone सँग एकवचन क्रिया आउँछ: "Each of the officers has signed."' },
          { en: 'Words joined by "with", "along with", "as well as" do not change the number of the subject: "The Secretary, along with the officers, was present."', ne: '"with", "along with", "as well as" ले जोडिएका शब्दले कर्ताको वचन बदल्दैनन्: "The Secretary, along with the officers, was present."' },
          { en: 'A collective noun takes a singular verb when acting as one body: "The committee has decided."', ne: 'समूहवाचक नाम एउटै निकायका रूपमा काम गर्दा एकवचन क्रिया लिन्छ: "The committee has decided."' },
        ],
      },
      { type: 'heading', text: { en: 'Active and passive voice', ne: 'कर्तृवाच्य र कर्मवाच्य' } },
      {
        type: 'table',
        headers: [
          { en: 'Active', ne: 'कर्तृवाच्य' },
          { en: 'Passive', ne: 'कर्मवाच्य' },
        ],
        rows: [
          [{ en: 'The office issues the licence.', ne: 'The office issues the licence.' }, { en: 'The licence is issued by the office.', ne: 'The licence is issued by the office.' }],
          [{ en: 'The committee has approved the plan.', ne: 'The committee has approved the plan.' }, { en: 'The plan has been approved by the committee.', ne: 'The plan has been approved by the committee.' }],
          [{ en: 'Submit the application today.', ne: 'Submit the application today.' }, { en: 'Let the application be submitted today.', ne: 'Let the application be submitted today.' }],
        ],
      },
      { type: 'heading', text: { en: 'One-word substitutions that recur', ne: 'बारम्बार आउने एक शब्दमा अर्थ' } },
      {
        type: 'table',
        headers: [
          { en: 'Phrase', ne: 'वाक्यांश' },
          { en: 'One word', ne: 'एक शब्द' },
        ],
        rows: [
          [{ en: 'Government by officials', ne: 'कर्मचारीतन्त्रद्वारा शासन' }, { en: 'Bureaucracy', ne: 'Bureaucracy' }],
          [{ en: 'Rule by the people', ne: 'जनताद्वारा शासन' }, { en: 'Democracy', ne: 'Democracy' }],
          [{ en: 'One who is present everywhere', ne: 'सर्वत्र उपस्थित हुने' }, { en: 'Omnipresent', ne: 'Omnipresent' }],
          [{ en: 'A person appointed to settle a dispute', ne: 'विवाद मिलाउन नियुक्त व्यक्ति' }, { en: 'Arbitrator', ne: 'Arbitrator' }],
          [{ en: 'Fear of foreigners', ne: 'विदेशीप्रतिको डर' }, { en: 'Xenophobia', ne: 'Xenophobia' }],
          [{ en: 'A statement open to more than one meaning', ne: 'एकभन्दा बढी अर्थ लाग्ने कथन' }, { en: 'Ambiguous', ne: 'Ambiguous' }],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'For the writing section, keep three formats ready: a formal application, an official letter, and a short report with heading, background, findings and recommendation.',
          ne: 'लेखन खण्डका लागि तीन ढाँचा तयार राख्नुहोस्: औपचारिक निवेदन, सरकारी पत्र, र शीर्षक, पृष्ठभूमि, निष्कर्ष र सिफारिससहितको छोटो प्रतिवेदन।',
        },
      },
    ],
  },
];
