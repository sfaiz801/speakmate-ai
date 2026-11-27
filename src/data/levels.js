export const ENGLISH_LEVELS = [
  {
    id: 'A1',
    name: 'Beginner (A1)',
    shortName: 'A1 Beginner',
    description: 'Starting from scratch. Simple words, basic greetings, and short daily sentences.',
    hindiDesc: 'बिल्कुल शुरुआत से: आसान शब्द, अभिवादन और छोटे वाक्य।',
  },
  {
    id: 'A2',
    name: 'Elementary (A2)',
    shortName: 'A2 Elementary',
    description: 'Can handle simple daily conversations, shopping, and basic questions.',
    hindiDesc: 'रोज़मर्रा की आसान बातचीत और सामान्य सवाल-जवाब।',
  },
  {
    id: 'B1',
    name: 'Intermediate (B1)',
    shortName: 'B1 Intermediate',
    description: 'Comfortable expressing opinions, talking about work, travel, and past events.',
    hindiDesc: 'अपने विचार, काम और यात्रा के बारे में बात करने में सक्षम।',
  },
  {
    id: 'B2',
    name: 'Upper Intermediate (B2)',
    shortName: 'B2 Upper Int.',
    description: 'Fluent in most discussions, professional meetings, and nuanced topics.',
    hindiDesc: 'ऑफिस मीटिंग और गहन विषयों पर आत्मविश्वास से बातचीत।',
  },
  {
    id: 'C1',
    name: 'Advanced (C1)',
    shortName: 'C1 Advanced',
    description: 'Polished, natural, idiomatic English for leadership and complex interviews.',
    hindiDesc: 'प्रभावी, स्वाभाविक और प्रोफेशनल स्तर की अंग्रेजी।',
  },
];

export const EXPLANATION_LANGUAGES = [
  { id: 'Hindi', label: 'Hindi (हिन्दी)', description: 'Mistakes and tips explained in clear Hindi + English' },
  { id: 'Hinglish', label: 'Hinglish (Hindi in Roman script)', description: 'Easy Hindi explanations written in English letters' },
  { id: 'English', label: 'Simple English', description: 'All explanations in easy-to-read English' },
];

export const DAILY_GOALS = [
  { minutes: 10, label: '10 mins / day', badge: 'Casual', description: 'Light daily habit' },
  { minutes: 15, label: '15 mins / day', badge: 'Regular', description: 'Steady speaking growth' },
  { minutes: 30, label: '30 mins / day', badge: 'Serious', description: 'Fast fluency builder' },
  { minutes: 45, label: '45 mins / day', badge: 'Intensive', description: 'Maximum confidence boost' },
];

export const LEARNING_PURPOSES = [
  { id: 'daily', label: 'Daily Conversation', icon: 'MessageCircle', desc: 'Speak naturally with friends, neighbors & family' },
  { id: 'career', label: 'Job & Career Growth', icon: 'Briefcase', desc: 'Excel in interviews, meetings & emails' },
  { id: 'confidence', label: 'Confidence Building', icon: 'Sparkles', desc: 'Overcome hesitation and fear of mistakes' },
  { id: 'travel', label: 'Travel & Global Living', icon: 'Plane', desc: 'Navigate airports, hotels & restaurants easily' },
  { id: 'students', label: 'College & Exams', icon: 'GraduationCap', desc: 'Presentations, group discussions & viva' },
];

export const TUTOR_MODES = [
  {
    id: 'daily_conversation',
    title: 'Daily Conversation',
    subtitle: 'Everyday life & routines',
    hindiHint: 'रोज़मर्रा की बातचीत का अभ्यास',
    starterPrompt: 'Namaste! Let us practice simple daily conversation today. How was your morning so far?',
    badge: 'Popular',
  },
  {
    id: 'beginner_english',
    title: 'Beginner English',
    subtitle: 'Ultra-simple & slow pace',
    hindiHint: 'बिल्कुल आसान शब्दों में शुरुआत',
    starterPrompt: 'Welcome! Do not worry about mistakes. Let us start easy: What is your favorite food, and why do you like it?',
    badge: 'A1 Friendly',
  },
  {
    id: 'free_talk',
    title: 'Free Talk',
    subtitle: 'Talk about any topic you like',
    hindiHint: 'किसी भी विषय पर खुलकर बोलें',
    starterPrompt: 'Hi! Today you choose the topic. Tell me one interesting thing that happened this week, or a topic you want to discuss!',
    badge: 'Flexible',
  },
  {
    id: 'job_interview',
    title: 'Job Interview',
    subtitle: 'Professional answers & polish',
    hindiHint: 'नौकरी के इंटरव्यू की तैयारी',
    starterPrompt: 'Hello! I will be your friendly interview coach today. Let us start with a classic question: Can you tell me a little about yourself?',
    badge: 'Career',
  },
  {
    id: 'office_english',
    title: 'Office English',
    subtitle: 'Meetings, updates & teamwork',
    hindiHint: 'ऑफिस और मीटिंग की अंग्रेजी',
    starterPrompt: 'Good morning! Imagine we are in a quick team stand-up meeting. What task are you working on today?',
    badge: 'Workplace',
  },
  {
    id: 'travel_english',
    title: 'Travel English',
    subtitle: 'Airports, hotels & directions',
    hindiHint: 'यात्रा और होटल से जुड़े संवाद',
    starterPrompt: 'Welcome aboard! Let us practice travel English. Imagine you just arrived at a hotel reception—how would you ask to check in?',
    badge: 'Practical',
  },
  {
    id: 'grammar_practice',
    title: 'Grammar Practice',
    subtitle: 'Speak with accurate sentences',
    hindiHint: 'बोलते समय सही ग्रामर का अभ्यास',
    starterPrompt: 'Let us practice speaking with clean grammar! Tell me two things you did yesterday using past tense.',
    badge: 'Accuracy',
  },
  {
    id: 'confidence_building',
    title: 'Confidence Building',
    subtitle: 'Zero-judgment encouragement',
    hindiHint: 'बिना झिझक के आत्मविश्वास बढ़ाएं',
    starterPrompt: 'You are doing great just by showing up today! Take a deep breath and tell me one goal you are excited about this month.',
    badge: 'Supportive',
  },
];
