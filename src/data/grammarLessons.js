export const GRAMMAR_LESSONS = [
  {
    id: 'sentence-structure',
    title: 'Basic English Sentence Structure',
    hindiTitle: 'अंग्रेजी वाक्य की बुनियादी संरचना',
    level: 'A1',
    durationMinutes: 8,
    summary: 'Learn the golden Subject + Verb + Object (SVO) order used in everyday English.',
    simpleExplanation:
      'In English, most basic sentences follow a fixed word order: Subject (who does the action) + Verb (the action) + Object (who or what receives the action). Unlike Hindi, where the verb usually comes at the end, English puts the verb right after the subject.',
    hindiExplanation:
      'हिंदी में क्रिया (Verb) वाक्य के अंत में आती है (जैसे: "मैं चाय पीता हूँ"), लेकिन अंग्रेजी में क्रिया Subject के तुरंत बाद आती है: Subject + Verb + Object (जैसे: "I drink tea")। यही नियम याद रखने से 80% आसान वाक्य सही बनने लगते हैं।',
    formula: 'Subject + Verb + Object (+ Place / Time)',
    examples: [
      { en: 'I drink tea every morning.', hi: 'मैं हर सुबह चाय पीता हूँ।' },
      { en: 'She speaks English clearly.', hi: 'वह साफ अंग्रेजी बोलती है।' },
      { en: 'We watched a movie yesterday.', hi: 'हमने कल एक फिल्म देखी।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Arrange into a correct English sentence: "cricket / Rahul / plays / every Sunday"',
        hint: 'Start with the person (Subject), then the action (Verb), then the game (Object).',
        sampleAnswer: 'Rahul plays cricket every Sunday.',
      },
      {
        prompt: 'Translate into SVO order: "मैं रोज़ किताब पढ़ता हूँ।"',
        hint: 'Subject = I, Verb = read, Object = a book, Time = every day.',
        sampleAnswer: 'I read a book every day.',
      },
    ],
    quiz: [
      {
        question: 'Which sentence follows the correct English word order?',
        options: [
          'I water drink every morning.',
          'I drink water every morning.',
          'Drink I water every morning.',
          'Water I every morning drink.',
        ],
        correctIndex: 1,
        feedback: 'Correct! Subject (I) + Verb (drink) + Object (water) + Time (every morning).',
        hindiFeedback: 'सही जवाब! Subject (I) के तुरंत बाद Verb (drink) आता है।',
      },
      {
        question: 'In the sentence "Priya teaches English", what is the Verb?',
        options: ['Priya', 'teaches', 'English', 'None of these'],
        correctIndex: 1,
        feedback: '"Teaches" is the action word (Verb).',
        hindiFeedback: '"Teaches" (सिखाती है) क्रिया है।',
      },
      {
        question: 'Choose the natural English sentence for "वह ऑफिस जाता है":',
        options: [
          'He office goes.',
          'He goes to the office.',
          'Goes he to office.',
          'To office he goes.',
        ],
        correctIndex: 1,
        feedback: 'Great job! "He" (Subject) + "goes" (Verb) + "to the office" (Place).',
        hindiFeedback: 'बिल्कुल सही! Subject + Verb + Place का क्रम सही है।',
      },
    ],
  },
  {
    id: 'nouns-pronouns',
    title: 'Nouns and Pronouns',
    hindiTitle: 'संज्ञा (Nouns) और सर्वनाम (Pronouns)',
    level: 'A1',
    durationMinutes: 7,
    summary: 'Name people, places, and things clearly without repeating names awkwardly.',
    simpleExplanation:
      'A Noun names a person, place, thing, or idea (Rohan, Delhi, phone, happiness). A Pronoun replaces a noun so we do not repeat it again and again (he, she, it, they, we, you, I).',
    hindiExplanation:
      'Noun किसी व्यक्ति, स्थान या वस्तु का नाम है (जैसे: Amit, Jaipur, laptop)। बार-बार नाम दोहराने से बचने के लिए Pronoun का उपयोग होता है—जैसे Amit के लिए "he", Priya के लिए "she", और वस्तुओं के लिए "it" या "they"। ध्यान दें: "He/She" को मिक्स न करें!',
    formula: 'Subject Pronouns: I, You, He, She, It, We, They | Object: me, you, him, her, it, us, them',
    examples: [
      { en: 'Ananya is my colleague. She works in HR.', hi: 'अनन्या मेरी सहकर्मी हैं। वह HR में काम करती हैं।' },
      { en: 'This laptop is fast, and it is lightweight.', hi: 'यह लैपटॉप तेज़ है, और यह हल्का है।' },
      { en: 'Please call me when you reach home.', hi: 'घर पहुँचने पर कृपया मुझे कॉल करें।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Replace the repeated name with a pronoun: "Vikram is tired. Vikram needs rest."',
        hint: 'Use "He" for Vikram in the second sentence.',
        sampleAnswer: 'Vikram is tired. He needs rest.',
      },
    ],
    quiz: [
      {
        question: 'Choose the right pronoun: "Meera is a doctor. ___ helps many patients."',
        options: ['He', 'She', 'It', 'They'],
        correctIndex: 1,
        feedback: '"She" is used for a female person (Meera).',
        hindiFeedback: 'मीरा के लिए "She" का प्रयोग सही है।',
      },
      {
        question: 'Which pronoun replaces "my friends and I"?',
        options: ['They', 'Them', 'We', 'Us'],
        correctIndex: 2,
        feedback: 'When you include yourself in a group as the subject, use "We".',
        hindiFeedback: 'जब आप खुद समूह में शामिल हों, तो Subject के लिए "We" का उपयोग करें।',
      },
      {
        question: 'Choose the correct object pronoun: "Can you help ___ with this email?"',
        options: ['I', 'me', 'my', 'mine'],
        correctIndex: 1,
        feedback: 'After a verb like "help", use the object pronoun "me".',
        hindiFeedback: 'Verb ("help") के बाद Object pronoun "me" आता है, "I" नहीं।',
      },
    ],
  },
  {
    id: 'verbs',
    title: 'Action & State Verbs',
    hindiTitle: 'क्रिया (Verbs) और उनके सही रूप',
    level: 'A1',
    durationMinutes: 9,
    summary: 'Master everyday verbs and third-person singular "-s/-es" agreement.',
    simpleExplanation:
      'Verbs express actions (run, speak, write) or states (know, like, seem). In the simple present tense, add "-s" or "-es" to the verb when the subject is He, She, It, or a singular name.',
    hindiExplanation:
      'Verb काम या स्थिति बताता है। वर्तमान काल (Simple Present) में जब Subject "He, She, It" या एक नाम हो, तो Verb के साथ "-s" या "-es" लगाना ज़रूरी है—जैसे "He speaks", "She goes"। "I, You, We, They" के साथ "-s" नहीं लगता।',
    formula: 'I/You/We/They + Verb (speak) | He/She/It + Verb+s/es (speaks)',
    examples: [
      { en: 'I practice speaking every night.', hi: 'मैं हर रात बोलने का अभ्यास करता हूँ।' },
      { en: 'He practices speaking every night.', hi: 'वह हर रात बोलने का अभ्यास करता है।' },
      { en: 'They understand Hindi and English.', hi: 'वे हिंदी और अंग्रेजी समझते हैं।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Fix the verb: "My brother work in Bengaluru."',
        hint: '"My brother" is singular (like "he").',
        sampleAnswer: 'My brother works in Bengaluru.',
      },
    ],
    quiz: [
      {
        question: 'Fill in the blank: "Neha ___ coffee every morning."',
        options: ['drink', 'drinks', 'drinking', 'to drink'],
        correctIndex: 1,
        feedback: 'Neha is a singular third-person subject, so use "drinks".',
        hindiFeedback: 'नेहा एकवचन (third person singular) है, इसलिए "drinks" सही है।',
      },
      {
        question: 'Which sentence is grammatically correct?',
        options: [
          'They goes to the market.',
          'He go to the gym daily.',
          'She watches English videos.',
          'I speaks slowly.',
        ],
        correctIndex: 2,
        feedback: '"She watches" correctly adds "-es" to "watch".',
        hindiFeedback: '"She watches" बिल्कुल सही है।',
      },
    ],
  },
  {
    id: 'tenses',
    title: 'Core Everyday Tenses',
    hindiTitle: 'ज़रूरी काल: Present, Past और Future',
    level: 'A2',
    durationMinutes: 12,
    summary: 'Talk confidently about what happens daily, happened yesterday, or will happen tomorrow.',
    simpleExplanation:
      'You do not need all 12 tenses to start speaking! Master these 4 first: Simple Present (habits), Present Continuous (happening now: is/am/are + -ing), Simple Past (finished: V2 / did), and Simple Future (will + V1).',
    hindiExplanation:
      'बोलचाल शुरू करने के लिए सभी 12 टेंस रटने की ज़रूरत नहीं है। पहले 4 मुख्य टेंस पक्के करें: 1) रोज़ की आदत (I work), 2) अभी हो रहा काम (I am working), 3) बीता हुआ कल (I worked), और 4) आने वाला कल (I will work)।',
    formula: 'Now: am/is/are + V-ing | Past: V2 (or did + V1) | Future: will + V1',
    examples: [
      { en: 'I am learning English right now.', hi: 'मैं अभी अंग्रेजी सीख रहा हूँ।' },
      { en: 'I called my friend yesterday.', hi: 'मैंने कल अपने दोस्त को फोन किया।' },
      { en: 'I will join the meeting at 4 PM.', hi: 'मैं शाम 4 बजे मीटिंग में शामिल होऊँगा।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Change into Simple Past: "I go to Delhi." (Add "last week")',
        hint: 'Past form of "go" is "went".',
        sampleAnswer: 'I went to Delhi last week.',
      },
    ],
    quiz: [
      {
        question: 'Which sentence describes an action happening right now?',
        options: [
          'I cook dinner every day.',
          'I am cooking dinner right now.',
          'I cooked dinner yesterday.',
          'I will cook dinner tonight.',
        ],
        correctIndex: 1,
        feedback: '"am cooking" shows an action in progress right now.',
        hindiFeedback: '"am cooking" अभी चल रहे काम को दर्शाता है।',
      },
      {
        question: 'Choose the right past sentence: "Yesterday, I ___ a new phone."',
        options: ['buy', 'buys', 'bought', 'buying'],
        correctIndex: 2,
        feedback: '"Bought" is the Simple Past form of "buy".',
        hindiFeedback: '"buy" का Past रूप "bought" होता है।',
      },
      {
        question: 'Complete the future sentence: "Tomorrow we ___ visit the museum."',
        options: ['will', 'did', 'are', 'were'],
        correctIndex: 0,
        feedback: '"will + base verb (visit)" expresses a future plan.',
        hindiFeedback: 'भविष्य की योजना के लिए "will + visit" सही है।',
      },
    ],
  },
  {
    id: 'articles',
    title: 'Articles (A, An, The)',
    hindiTitle: 'आर्टिकल्स: A, An और The का सही इस्तेमाल',
    level: 'A1',
    durationMinutes: 8,
    summary: 'Know when to use a, an, the, or no article at all.',
    simpleExplanation:
      'Use "a" before consonant sounds (a book, a university) and "an" before vowel sounds (an apple, an hour). Use "the" when both speaker and listener know the exact thing (the sun, the email I sent you).',
    hindiExplanation:
      'हिंदी में "a/an/the" जैसा अलग शब्द नहीं होता, इसलिए यहाँ गलती आम है। याद रखें: उच्चारण (sound) देखें, अक्षर नहीं! "Hour" की आवाज़ "आ" (vowel sound) से शुरू होती है इसलिए "an hour", और "University" की आवाज़ "य" से शुरू होती है इसलिए "a university"। किसी खास चीज़ के लिए "the" लगाएँ।',
    formula: 'a + consonant sound | an + vowel sound (a, e, i, o, u sound) | the + specific noun',
    examples: [
      { en: 'I need an umbrella because it is raining.', hi: 'मुझे एक छाता चाहिए क्योंकि बारिश हो रही है।' },
      { en: 'Please wait for an hour.', hi: 'कृपया एक घंटे इंतज़ार करें।' },
      { en: 'The presentation you made was awesome.', hi: 'आपने जो प्रेज़ेंटेशन बनाया वह शानदार था।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Fill with a or an: "She is ___ honest manager and works at ___ university."',
        hint: '"honest" starts with silent h ("ऑनेस्ट"), "university" starts with "य" sound.',
        sampleAnswer: 'She is an honest manager and works at a university.',
      },
    ],
    quiz: [
      {
        question: 'Choose the correct article: "He waited for ___ hour at the station."',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 1,
        feedback: '"hour" starts with a silent h and a vowel sound, so we use "an".',
        hindiFeedback: '"hour" का उच्चारण vowel sound से शुरू होता है, इसलिए "an hour" सही है।',
      },
      {
        question: 'Choose the best option: "Please close ___ door behind you."',
        options: ['a', 'an', 'the', 'many'],
        correctIndex: 2,
        feedback: 'Both speakers know which specific door, so "the door" is natural.',
        hindiFeedback: 'यहाँ एक खास दरवाज़े की बात हो रही है, इसलिए "the door" सही है।',
      },
    ],
  },
  {
    id: 'prepositions',
    title: 'Prepositions of Time & Place',
    hindiTitle: 'Prepositions: In, On और At का अंतर',
    level: 'A2',
    durationMinutes: 9,
    summary: 'Stop confusing in, on, and at for dates, times, and locations.',
    simpleExplanation:
      'For time: AT = exact clock time (at 7 PM), ON = days & dates (on Monday, on 15th August), IN = months, years, seasons, parts of day (in July, in 2026, in the morning). For place: AT = exact point, ON = surface, IN = enclosed space or city/country.',
    hindiExplanation:
      'समय के लिए आसान ट्रिक: घड़ी के समय के साथ AT (at 9 AM), दिन और तारीख के साथ ON (on Sunday), और महीने/साल/सुबह-शाम के साथ IN (in June, in the evening)। जगह के लिए: शहर/देश/कमरे के अंदर IN, सतह के ऊपर ON, और किसी खास बिंदु या पते पर AT।',
    formula: 'AT (exact time/point) | ON (days/dates/surfaces) | IN (months/years/inside)',
    examples: [
      { en: 'The interview is on Friday at 10:30 AM.', hi: 'इंटरव्यू शुक्रवार को सुबह 10:30 बजे है।' },
      { en: 'My phone is on the table in the living room.', hi: 'मेरा फोन लिविंग रूम में मेज़ पर है।' },
      { en: 'I moved to Pune in 2024.', hi: 'मैं 2024 में पुणे आया।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Complete with in, on, or at: "Let us meet ___ Monday ___ 5 PM ___ the cafe."',
        hint: 'Day -> on, Clock time -> at, Specific spot -> at.',
        sampleAnswer: 'Let us meet on Monday at 5 PM at the cafe.',
      },
    ],
    quiz: [
      {
        question: 'Fill in the blank: "We have a team call ___ Tuesday morning."',
        options: ['in', 'on', 'at', 'to'],
        correctIndex: 1,
        feedback: 'Any phrase with a specific day of the week takes "on".',
        hindiFeedback: 'दिन (Tuesday) के साथ हमेशा "on" लगता है।',
      },
      {
        question: 'Fill in the blank: "The train arrives ___ 6:15 PM."',
        options: ['in', 'on', 'at', 'by on'],
        correctIndex: 2,
        feedback: 'Exact clock times take "at".',
        hindiFeedback: 'सटीक समय के साथ "at" आता है।',
      },
    ],
  },
  {
    id: 'helping-verbs',
    title: 'Helping Verbs (Be, Do, Have)',
    hindiTitle: 'सहायक क्रियाएँ: Is/Am/Are, Do/Does, Has/Have',
    level: 'A1',
    durationMinutes: 9,
    summary: 'Build smooth questions, negatives, and continuous sentences using helping verbs.',
    simpleExplanation:
      'Helping verbs support the main verb. "Be" (is/am/are/was/were) builds continuous actions and states. "Do/Does/Did" helps form questions and negatives in simple tenses. "Has/Have/Had" shows possession or completed experiences.',
    hindiExplanation:
      'अंग्रेजी में सवाल पूछने और "नहीं" बोलने के लिए Helping Verbs बहुत ज़रूरी हैं। "I am" (स्थिति/जारी काम), "Do you... / Does he..." (सवाल/नकारात्मक), और "I have / She has" (पास होना या अनुभव) का सही मेल सीखना ज़रूरी है।',
    formula: 'I am / You-We-They are / He-She-It is | I-You-We-They do-have / He-She-It does-has',
    examples: [
      { en: 'Does she live in Lucknow?', hi: 'क्या वह लखनऊ में रहती है?' },
      { en: 'I have finished my homework.', hi: 'मैंने अपना होमवर्क पूरा कर लिया है।' },
      { en: 'They were waiting outside the office.', hi: 'वे ऑफिस के बाहर इंतज़ार कर रहे थे।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Fix the mistake: "Does he likes cricket?"',
        hint: 'Once "Does" is used, the main verb returns to base form without -s.',
        sampleAnswer: 'Does he like cricket?',
      },
    ],
    quiz: [
      {
        question: 'Choose the right helping verb: "___ your parents live in Jaipur?"',
        options: ['Does', 'Do', 'Is', 'Has'],
        correctIndex: 1,
        feedback: '"Your parents" is plural, so use "Do".',
        hindiFeedback: '"Your parents" बहुवचन है, इसलिए "Do" सही है।',
      },
      {
        question: 'Choose the correct sentence:',
        options: [
          'He have two laptops.',
          'She has a meeting at noon.',
          'They has arrived early.',
          'I has a question.',
        ],
        correctIndex: 1,
        feedback: '"She" takes "has", whereas I/You/We/They take "have".',
        hindiFeedback: '"She/He/It" के साथ "has" लगता है।',
      },
    ],
  },
  {
    id: 'modals',
    title: 'Modals for Polite Speaking',
    hindiTitle: 'Modals: Can, Could, May, Should, Must',
    level: 'B1',
    durationMinutes: 10,
    summary: 'Sound polite, professional, and confident in requests, advice, and possibilities.',
    simpleExplanation:
      'Modal verbs add meaning like ability (can), polite request (could/would/may), advice (should), and necessity (must/have to). Always use the base form of the verb after a modal—never add "to" or "-s".',
    hindiExplanation:
      'विनम्र और प्रोफेशनल अंग्रेजी बोलने में Modals सबसे काम आते हैं। "Give me water" की जगह "Could you please give me some water?" बहुत अच्छा लगता है। नियम: Modal के बाद हमेशा Verb का पहला रूप (V1) आता है—जैसे "He can speak" (न कि "He can speaks" या "can to speak")।',
    formula: 'Subject + Modal (can/could/should/must/would) + Base Verb (V1)',
    examples: [
      { en: 'Could you please repeat that slowly?', hi: 'क्या आप कृपया उसे धीरे से दोहरा सकते हैं?' },
      { en: 'You should practice speaking for 15 minutes daily.', hi: 'आपको रोज़ 15 मिनट बोलने का अभ्यास करना चाहिए।' },
      { en: 'I must submit this report before 6 PM.', hi: 'मुझे यह रिपोर्ट शाम 6 बजे से पहले जमा करनी ही होगी।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Make this request polite using Could or Would: "Send me the file."',
        hint: 'Start with "Could you please..."',
        sampleAnswer: 'Could you please send me the file?',
      },
    ],
    quiz: [
      {
        question: 'Which sentence is grammatically correct?',
        options: [
          'She can to drive a car.',
          'She cans drive a car.',
          'She can drive a car.',
          'She can driving a car.',
        ],
        correctIndex: 2,
        feedback: 'Always use the base verb ("drive") directly after a modal ("can").',
        hindiFeedback: 'Modal ("can") के तुरंत बाद क्रिया का पहला रूप ("drive") आता है।',
      },
      {
        question: 'Which phrase is the most polite way to ask a colleague for help?',
        options: [
          'Help me now.',
          'Could you please help me with this?',
          'You must help me.',
          'Can to help me?',
        ],
        correctIndex: 1,
        feedback: '"Could you please..." is polite, natural, and professional.',
        hindiFeedback: '"Could you please..." सबसे विनम्र और प्रोफेशनल तरीका है।',
      },
    ],
  },
  {
    id: 'question-formation',
    title: 'Asking Natural Questions',
    hindiTitle: 'सवाल पूछने का सही तरीका (Yes/No & Wh- Questions)',
    level: 'A2',
    durationMinutes: 9,
    summary: 'Never hesitate when asking questions in daily life, travel, or interviews.',
    simpleExplanation:
      'Put the helping verb BEFORE the subject to ask a question! For Yes/No questions: Helping Verb + Subject + Verb. For open questions: Wh-word (What, Where, When, Why, How) + Helping Verb + Subject + Verb.',
    hindiExplanation:
      'हिंदी में हम आवाज़ उठाकर सवाल पूछ लेते हैं ("तुम आ रहे हो?"), लेकिन अंग्रेजी में Helping Verb को Subject से पहले लाना होता है: "Are you coming?" (न कि "You are coming?"), और "Where do you live?" (न कि "Where you live?")।',
    formula: '(Wh-Word) + Helping Verb (do/does/did/is/are/can) + Subject + Main Verb?',
    examples: [
      { en: 'Where do you work?', hi: 'आप कहाँ काम करते हैं?' },
      { en: 'Did you enjoy the session?', hi: 'क्या आपको सेशन पसंद आया?' },
      { en: 'How can I reach the metro station?', hi: 'मैं मेट्रो स्टेशन कैसे पहुँच सकता हूँ?' },
    ],
    practiceQuestions: [
      {
        prompt: 'Fix the question: "Why you are late today?"',
        hint: 'Move "are" before "you".',
        sampleAnswer: 'Why are you late today?',
      },
    ],
    quiz: [
      {
        question: 'Choose the correct question:',
        options: [
          'What you want to eat?',
          'What do you want to eat?',
          'What does you want to eat?',
          'Do what you want to eat?',
        ],
        correctIndex: 1,
        feedback: 'Wh-word (What) + Helping Verb (do) + Subject (you) + Main Verb (want).',
        hindiFeedback: 'सही क्रम: What + do + you + want to eat?',
      },
      {
        question: 'Fix: "When the train leaves?"',
        options: [
          'When leaves the train?',
          'When does the train leave?',
          'When do the train leaves?',
          'When is the train leave?',
        ],
        correctIndex: 1,
        feedback: '"The train" is singular, so use "does" + base verb "leave".',
        hindiFeedback: '"When does the train leave?" बिल्कुल सही प्रश्न संरचना है।',
      },
    ],
  },
  {
    id: 'negative-sentences',
    title: 'Negative Sentences Made Easy',
    hindiTitle: 'नकारात्मक वाक्य (Negative Sentences) बनाना',
    level: 'A1',
    durationMinutes: 7,
    summary: 'Say "no", "did not", and "do not" cleanly without common translation traps.',
    simpleExplanation:
      'Add "not" after a helping verb (is not, cannot, will not). In Simple Present use "do not / does not + V1", and in Simple Past use "did not + V1" (never use V2 after "did not"!).',
    hindiExplanation:
      'बहुत से सीखने वाले "I no like" या "I did not went" बोल देते हैं—इनसे बचें! हमेशा Helping Verb के बाद "not" लगाएँ: "I do not like" और "I did not go"। ध्यान रहे, "did not" के बाद हमेशा Verb का पहला रूप (go, eat, see) आता है।',
    formula: 'Present: do/does not + V1 | Past: did not + V1 | Be/Modal: is/are/can/will + not',
    examples: [
      { en: 'I do not drink coffee at night.', hi: 'मैं रात में कॉफी नहीं पीता।' },
      { en: 'He did not attend the call yesterday.', hi: 'उसने कल कॉल अटेंड नहीं किया।' },
      { en: 'We cannot finish this without teamwork.', hi: 'हम टीमवर्क के बिना इसे पूरा नहीं कर सकते।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Correct the mistake: "She did not went to college today."',
        hint: 'After "did not", change "went" back to base form "go".',
        sampleAnswer: 'She did not go to college today.',
      },
    ],
    quiz: [
      {
        question: 'Choose the correct negative sentence:',
        options: [
          'I no understand this word.',
          'I am not understand this word.',
          'I do not understand this word.',
          'I does not understand this word.',
        ],
        correctIndex: 2,
        feedback: 'With "understand" (simple present), use "do not" + base verb.',
        hindiFeedback: '"I do not understand" सही नकारात्मक वाक्य है।',
      },
      {
        question: 'Choose the correct past negative sentence:',
        options: [
          'They did not saw the message.',
          'They did not see the message.',
          'They not saw the message.',
          'They do not saw the message.',
        ],
        correctIndex: 1,
        feedback: 'After "did not", always use the base verb ("see").',
        hindiFeedback: '"did not" के बाद हमेशा V1 ("see") का प्रयोग होता है।',
      },
    ],
  },
  {
    id: 'common-mistakes',
    title: 'Common Mistakes by Hindi Speakers',
    hindiTitle: 'हिंदी भाषियों की आम अंग्रेजी गलतियाँ और उनके सुधार',
    level: 'B1',
    durationMinutes: 10,
    summary: 'Eliminate the top 6 Indian-English translation habits immediately.',
    simpleExplanation:
      'Direct word-for-word translation from Hindi causes classic slips like "Myself Rohan", "revert back", "discuss about", or "I am having a car". Learn the natural standard English alternatives.',
    hindiExplanation:
      'हिंदी से सीधा अनुवाद करने पर कुछ आम गलतियाँ हो जाती हैं—जैसे "Myself Priya" बोलना (सही: "I am Priya" या "My name is Priya"), "discuss about" (सही: सिर्फ "discuss"), या "return back" (सही: "return")। इन्हें सुधारते ही आपकी अंग्रेजी तुरंत निखर जाएगी!',
    formula: 'Think in chunks of natural English, not word-by-word Hindi translation.',
    examples: [
      { en: 'Say: "My name is Rohit." (Avoid: "Myself Rohit.")', hi: 'अपना परिचय "My name is..." या "I am..." से दें।' },
      { en: 'Say: "Let us discuss the project." (Avoid: "discuss about")', hi: '"discuss" के साथ "about" नहीं लगता।' },
      { en: 'Say: "I have a question." (Avoid: "I am having a question.")', hi: 'स्थायी अधिकार या सवाल के लिए "I have" बोलें।' },
    ],
    practiceQuestions: [
      {
        prompt: 'Fix both mistakes: "Myself Deepak. Please revert back about the plan."',
        hint: 'Replace "Myself" with "I am / My name is", and "revert back" with "reply".',
        sampleAnswer: 'Hi, I am Deepak. Please reply regarding the plan.',
      },
    ],
    quiz: [
      {
        question: 'Which introduction is best in an interview?',
        options: [
          'Myself Ankit Sharma from Bhopal.',
          'I am Ankit Sharma from Bhopal.',
          'My self is Ankit Sharma.',
          'Me Ankit Sharma.',
        ],
        correctIndex: 1,
        feedback: '"I am Ankit Sharma..." or "My name is Ankit Sharma..." is standard and confident.',
        hindiFeedback: 'इंटरव्यू में हमेशा "I am..." या "My name is..." का प्रयोग करें।',
      },
      {
        question: 'Which sentence is completely natural?',
        options: [
          'We discussed about the budget.',
          'Please return back my book.',
          'I have two sisters.',
          'I am knowing the answer.',
        ],
        correctIndex: 2,
        feedback: '"I have two sisters" is natural; avoid "discussed about", "return back", and "am knowing".',
        hindiFeedback: '"I have two sisters" बिल्कुल स्वाभाविक और सही है।',
      },
    ],
  },
];
