import type { Lesson } from '../../types';

export const officeMgmtLessons: Lesson[] = [
  {
    id: 'off-01',
    subjectId: 'office-mgmt',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'The Office — Meaning, Types and Functions', ne: 'कार्यालय — अर्थ, प्रकार र कार्य' },
    summary: {
      en: 'What an office is, how offices are classified, and the resources every office manages.',
      ne: 'कार्यालय के हो, कसरी वर्गीकरण हुन्छ र हरेक कार्यालयले व्यवस्थापन गर्ने साधनहरू।',
    },
    readMinutes: 6,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'An office is the place where the work of planning, recording, communicating and delivering services of an organisation is carried out. It is often called the "brain and nerve centre" of an organisation because information is received, processed, stored and issued from it.',
          ne: 'कार्यालय भनेको कुनै संगठनको योजना, अभिलेख, सञ्चार र सेवा प्रवाहसम्बन्धी काम हुने ठाउँ हो। सूचना यहीँ प्राप्त, प्रशोधन, संरक्षण र जारी हुने भएकाले यसलाई संगठनको "मस्तिष्क तथा स्नायु केन्द्र" भनिन्छ।',
        },
      },
      { type: 'heading', text: { en: 'Classification of offices', ne: 'कार्यालयको वर्गीकरण' } },
      {
        type: 'table',
        headers: [
          { en: 'Basis', ne: 'आधार' },
          { en: 'Types', ne: 'प्रकार' },
        ],
        rows: [
          [{ en: 'Ownership', ne: 'स्वामित्व' }, { en: 'Government, private, non-governmental, international', ne: 'सरकारी, निजी, गैरसरकारी, अन्तर्राष्ट्रिय' }],
          [{ en: 'Level in hierarchy', ne: 'पदसोपानको तह' }, { en: 'Central / head office, regional or provincial, district, local', ne: 'केन्द्रीय / प्रधान कार्यालय, प्रादेशिक, जिल्ला, स्थानीय' }],
          [{ en: 'Function', ne: 'कार्य' }, { en: 'Policy making, implementing, service delivering, regulatory', ne: 'नीति निर्माण, कार्यान्वयन, सेवा प्रवाह, नियमनकारी' }],
          [{ en: 'Duration', ne: 'अवधि' }, { en: 'Permanent and temporary (project) offices', ne: 'स्थायी र अस्थायी (आयोजना) कार्यालय' }],
        ],
      },
      { type: 'heading', text: { en: 'Core functions', ne: 'मुख्य कार्य' } },
      {
        type: 'list',
        items: [
          { en: 'Receiving, recording and distributing information', ne: 'सूचना प्राप्ति, अभिलेखीकरण र वितरण' },
          { en: 'Correspondence and communication', ne: 'पत्राचार र सञ्चार' },
          { en: 'Planning, budgeting and financial administration', ne: 'योजना, बजेट र आर्थिक प्रशासन' },
          { en: 'Human resource and store (jinsi) management', ne: 'मानव संसाधन र जिन्सी व्यवस्थापन' },
          { en: 'Service delivery to citizens and handling grievances', ne: 'नागरिकलाई सेवा प्रवाह र गुनासो व्यवस्थापन' },
          { en: 'Protection and preservation of records', ne: 'अभिलेखको सुरक्षा र संरक्षण' },
        ],
      },
      {
        type: 'callout',
        tone: 'key',
        text: {
          en: 'Resources of an office are often remembered as the five Ms: Men, Money, Materials, Machines and Methods — with Information and Time added in modern texts.',
          ne: 'कार्यालयका साधनलाई प्रायः पाँच M ले सम्झिन्छ: Men (जनशक्ति), Money (रकम), Materials (सामग्री), Machines (मेसिन) र Methods (विधि) — आधुनिक पुस्तकहरूमा सूचना र समय पनि थपिन्छ।',
        },
      },
    ],
  },
  {
    id: 'off-02',
    subjectId: 'office-mgmt',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Registration, Dispatch and Filing (Darta, Chalani, Filing)', ne: 'दर्ता, चलानी र फाइलिङ' },
    summary: {
      en: 'How a letter travels through a government office and how records are filed and preserved.',
      ne: 'सरकारी कार्यालयमा पत्र कसरी प्रवाह हुन्छ र अभिलेख कसरी फाइल तथा संरक्षण गरिन्छ।',
    },
    readMinutes: 8,
    blocks: [
      { type: 'heading', text: { en: 'Darta — registration of incoming mail', ne: 'दर्ता — प्राप्त पत्रको अभिलेख' } },
      {
        type: 'list',
        ordered: true,
        items: [
          { en: 'Receive the letter and check the envelope, enclosures and addressee', ne: 'पत्र प्राप्त गरी खाम, संलग्न कागजात र पाउने पक्ष जाँच्ने' },
          { en: 'Enter it in the darta register with date, registration number, sender, subject and enclosures', ne: 'दर्ता किताबमा मिति, दर्ता नम्बर, पठाउने, विषय र संलग्न कागजात उल्लेख गरी दर्ता गर्ने' },
          { en: 'Put the darta seal and number on the letter itself', ne: 'पत्रमै दर्ता छाप र नम्बर लगाउने' },
          { en: 'Send it to the concerned section against the movement record', ne: 'चलन अभिलेखसहित सम्बन्धित शाखामा पठाउने' },
        ],
      },
      { type: 'heading', text: { en: 'Chalani — dispatch of outgoing mail', ne: 'चलानी — पठाइने पत्रको अभिलेख' } },
      {
        type: 'list',
        ordered: true,
        items: [
          { en: 'The approved draft is fair-copied and signed by the competent authority', ne: 'स्वीकृत मस्यौदा सफा प्रति तयार गरी अधिकारप्राप्त अधिकारीबाट हस्ताक्षर गराउने' },
          { en: 'It is entered in the chalani register with date, chalani number, recipient and subject', ne: 'चलानी किताबमा मिति, चलानी नम्बर, पाउने र विषय उल्लेख गरी दर्ता गर्ने' },
          { en: 'One office copy is filed; the original is despatched by post, courier or electronic means', ne: 'एक प्रति कार्यालय प्रति फाइल गर्ने; सक्कल हुलाक, कुरियर वा विद्युतीय माध्यमबाट पठाउने' },
          { en: 'Acknowledgement of receipt is obtained and kept', ne: 'प्राप्ति भरपाई लिई राख्ने' },
        ],
      },
      { type: 'heading', text: { en: 'Filing systems', ne: 'फाइलिङ प्रणाली' } },
      {
        type: 'table',
        headers: [
          { en: 'System', ne: 'प्रणाली' },
          { en: 'Arranged by', ne: 'क्रम मिलाउने आधार' },
        ],
        rows: [
          [{ en: 'Alphabetical', ne: 'वर्णानुक्रम' }, { en: 'Name of person, office or subject', ne: 'व्यक्ति, कार्यालय वा विषयको नाम' }],
          [{ en: 'Numerical', ne: 'अंक क्रम' }, { en: 'File or registration number', ne: 'फाइल वा दर्ता नम्बर' }],
          [{ en: 'Subject-wise', ne: 'विषयगत' }, { en: 'Subject of the correspondence', ne: 'पत्राचारको विषय' }],
          [{ en: 'Geographical', ne: 'भौगोलिक' }, { en: 'District, province or region', ne: 'जिल्ला, प्रदेश वा क्षेत्र' }],
          [{ en: 'Chronological', ne: 'मिति क्रम' }, { en: 'Date of receipt or dispatch', ne: 'प्राप्ति वा प्रेषण मिति' }],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: {
          en: 'Good filing is judged by five tests: simplicity, economy, flexibility, safety and quick retrieval. If a paper cannot be found in a minute, the system has failed.',
          ne: 'राम्रो फाइलिङको कसी पाँच हुन्: सरलता, मितव्ययिता, लचिलोपन, सुरक्षा र छिटो खोज्न सकिने गुण। कुनै कागज एक मिनेटमा भेटिँदैन भने प्रणाली असफल हो।',
        },
      },
    ],
  },
  {
    id: 'off-03',
    subjectId: 'office-mgmt',
    levels: ['adhikrit', 'nayabsubba', 'kharidar'],
    title: { en: 'Note Writing (Tippani) and Official Correspondence', ne: 'टिप्पणी लेखन र सरकारी पत्राचार' },
    summary: {
      en: 'The structure of a tippani, how decisions are recorded, and the standard parts of a government letter.',
      ne: 'टिप्पणीको संरचना, निर्णय कसरी अभिलेख हुन्छ र सरकारी पत्रका मानक भागहरू।',
    },
    readMinutes: 8,
    blocks: [
      {
        type: 'para',
        text: {
          en: 'A tippani is the internal note that carries a matter from the dealing assistant up to the deciding authority. It presents the facts, the legal basis, the options and a recommendation so that the officer can decide with a signature.',
          ne: 'टिप्पणी भनेको फाँटवालादेखि निर्णय गर्ने अधिकारीसम्म विषय पुर्‍याउने आन्तरिक लेखोट हो। यसले तथ्य, कानूनी आधार, विकल्प र राय प्रस्तुत गर्छ ताकि अधिकारीले हस्ताक्षरसहित निर्णय गर्न सकून्।',
        },
      },
      { type: 'heading', text: { en: 'Three parts of a tippani', ne: 'टिप्पणीका तीन भाग' } },
      {
        type: 'list',
        ordered: true,
        items: [
          { en: 'Subject and background — what came in, from whom, on what date, with what request', ne: 'विषय र पृष्ठभूमि — के, कसबाट, कुन मितिमा, के अनुरोधसहित आयो' },
          { en: 'Analysis — the relevant law, rule, precedent, budget position and consequences of each option', ne: 'विश्लेषण — सम्बन्धित कानून, नियम, नजिर, बजेट अवस्था र प्रत्येक विकल्पको परिणाम' },
          { en: 'Opinion and proposal — a clear recommendation for the decision maker to approve or reject', ne: 'राय र प्रस्ताव — निर्णयकर्ताले स्वीकृत वा अस्वीकृत गर्न सक्ने स्पष्ट सिफारिस' },
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: {
          en: 'A tippani should never hide the inconvenient option. Under the Good Governance Act every decision must be reasoned, so the note is the written record that will be audited or examined by the CIAA years later.',
          ne: 'टिप्पणीले असहज विकल्प लुकाउनु हुँदैन। सुशासन ऐन अनुसार प्रत्येक निर्णय कारणसहित हुनुपर्ने भएकाले वर्षौंपछि लेखापरीक्षण वा अख्तियारले हेर्ने लिखित प्रमाण यही टिप्पणी हो।',
        },
      },
      { type: 'heading', text: { en: 'Parts of a government letter', ne: 'सरकारी पत्रका भाग' } },
      {
        type: 'list',
        items: [
          { en: 'Letterhead with the emblem, office name and address', ne: 'निशान छाप, कार्यालयको नाम र ठेगानासहितको लेटरहेड' },
          { en: 'Patra sankhya (letter number) and chalani number', ne: 'पत्र संख्या र चलानी नम्बर' },
          { en: 'Date in Bikram Sambat', ne: 'विक्रम सम्बत्‌मा मिति' },
          { en: 'Name and address of the recipient office', ne: 'पाउने कार्यालयको नाम र ठेगाना' },
          { en: 'Subject line (bishaya)', ne: 'विषय' },
          { en: 'Body — reference, matter, request or direction', ne: 'मुख्य भाग — सन्दर्भ, विषयवस्तु, अनुरोध वा निर्देशन' },
          { en: 'Signature, name, post of the signing authority', ne: 'हस्ताक्षर, नाम, हस्ताक्षरकर्ताको पद' },
          { en: 'Boddharthaa (copy to) list and enclosures', ne: 'बोधार्थ सूची र संलग्न कागजात' },
        ],
      },
      {
        type: 'table',
        headers: [
          { en: 'Type of writing', ne: 'लेखनको प्रकार' },
          { en: 'Used for', ne: 'प्रयोग' },
        ],
        rows: [
          [{ en: 'Tippani', ne: 'टिप्पणी' }, { en: 'Internal note seeking a decision', ne: 'निर्णयका लागि आन्तरिक लेखोट' }],
          [{ en: 'Patra', ne: 'पत्र' }, { en: 'Formal communication between offices', ne: 'कार्यालयबीचको औपचारिक सञ्चार' }],
          [{ en: 'Paripatra / circular', ne: 'परिपत्र' }, { en: 'One instruction sent to many offices', ne: 'धेरै कार्यालयलाई एउटै निर्देशन' }],
          [{ en: 'Suchana', ne: 'सूचना' }, { en: 'Public notice, e.g. a vacancy or tender', ne: 'सार्वजनिक सूचना, जस्तै विज्ञापन वा बोलपत्र' }],
          [{ en: 'Pratibedan', ne: 'प्रतिवेदन' }, { en: 'Report of an inquiry, inspection or programme', ne: 'छानबिन, अनुगमन वा कार्यक्रमको प्रतिवेदन' }],
          [{ en: 'Manutting / minute', ne: 'माइन्युट' }, { en: 'Record of a meeting and its decisions', ne: 'बैठक र निर्णयको अभिलेख' }],
        ],
      },
    ],
  },
];
