import { Article, QuoteOfTheDay } from './types';

export const CATEGORIES = [
  { id: 'all', ps: 'ټول مباجث', en: 'All Topics' },
  { id: 'intro', ps: 'پېژندنه او عمومي', en: 'Introduction & General' },
  { id: 'rights', ps: 'حقوق او ټولنه', en: 'Rights & Society' },
  { id: 'ethics', ps: 'اخلاق او سوله', en: 'Morals & Peace' },
  { id: 'nature', ps: 'علم او طبیعت', en: 'Knowledge & Nature' }
];

export const QUOTES: QuoteOfTheDay[] = [
  {
    textAr: "لا إِكْرَاهَ فِي الدِّينِ",
    textPs: "په دین کې هیڅ جبر او زور نشته.",
    textEn: "There is no compulsion in religion.",
    source: "سورة البقرة: ۲۵۶"
  },
  {
    textAr: "يَا أَيُّهَا النَّاسُ أَلَا إِنَّ رَبَّكُمْ وَاحِدٌ وَإِنَّ أَبَاكُمْ وَاحِدٌ، أَلَا لَا فَضْلَ لِعَرَبِيٍّ عَلَى أَعْجَمِيٍّ وَلَا لِعَجَمِيٍّ عَلَى عَرَبِيٍّ وَلَا لِأَحْمَرَ عَلَى أَسْوَدَ وَلَا أَسْوَدَ عَلَى أَحْمَرَ إِلَّا بِالتَّقْوَى",
    textPs: "اې خلکو! خبر اوسئ چې ستاسو رب یو دی او پلار مو یو دی. پوه شئ چې هیڅ عرب پر عجم او هیڅ عجم پر عرب، او هیڅ سور پر تور او هیڅ تور پر سور باندې لوړوالی نلري مګر په تقوی سره.",
    textEn: "O people, indeed your Lord is One and your father is one. Indeed, there is no superiority of an Arab over a non-Arab, nor of a non-Arab over an Arab, nor of a white over a black, nor of a black over a white, except by piety.",
    source: "د رسول الله (ص) وروستۍ خطبه - مسند أحمد"
  },
  {
    textAr: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ",
    textPs: "زه یوازې ددې لپاره رالیږل شوی یم ترڅو د غوره اخلاقو ښیګڼې بشپړې کړم.",
    textEn: "Indeed, I was sent only to perfect noble character.",
    source: "الحدیث الشریف - السنن الکبرى"
  },
  {
    textAr: "الْمُسْلِمُ مَنْ سَلِمَ النَّاسُ مِنْ لِسَانِهِ وَيَدِهِ",
    textPs: "رښتینی مسلمان هغه څوک دی چې نور خلک یې له ژبې او لاس څخه په امن وي.",
    textEn: "A true Muslim is the one from whose tongue and hand people are safe.",
    source: "الحدیث الشریف - صحيح البخاري"
  },
  {
    textAr: "وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
    textPs: "او نېکي وکړئ! بېشکه چې الله نېکي کوونکي خوښوي.",
    textEn: "And do good; indeed, Allah loves the doers of good.",
    source: "سورة البقرة: ۱۹۵"
  },
  {
    textAr: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    textPs: "د علم زده کړه پر هر مسلمان (نارینه او ښځینه) فرض ده.",
    textEn: "Seeking knowledge is an obligation upon every Muslim.",
    source: "الحدیث الشریف - سنن ابن ماجه"
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'true-face-of-islam',
    titlePs: '۱. د اسلام حقیقي څېره او پیغام',
    titleEn: '1. The True Face and Message of Islam',
    categoryPs: 'پېژندنه او عمومي',
    categoryEn: 'Introduction & General',
    summaryPs: 'دا مبحث د اسلام رښتیني پیغام، اعتدال او سوله ییز ماهیت ته کتنه کوي او له افراطیت سره یې توپیر روښانه کوي.',
    summaryEn: 'This topic explores the true message, moderation, and peaceful nature of Islam, clarifying its distinction from extremism.',
    readTime: 6,
    paragraphs: [
      {
        id: 'tf-1',
        type: 'heading',
        textPs: 'سریزه: د اسلام معنی او د سوله ییز پیغام ریښه',
        textEn: 'Introduction: The Meaning of Islam and the Root of its Peaceful Message'
      },
      {
        id: 'tf-2',
        type: 'standard',
        textPs: 'په معاصره نړۍ کې ډیری وختونه اسلام د ځینو ناسمو تبلیغاتو یا د موندل شویو ناسم فهمیو له امله غلط تعبیر کیږي. په داسې حال کې چې د "اسلام" لغوي ریښه له "سلم" څخه اخیستل شوې چې معنی یې سوله، سلامتیا او غاړه ایښودل دي. د اسلام دین خلکو ته د باطني او ظاهري سولې لاره ښیي او هڅه کوي چې په انساني ټولنه کې مینه او ورورولي رامنځته کړي.',
        textEn: 'In the modern world, Islam is often misinterpreted due to misinformation or widespread misconceptions. However, the linguistic root of the word "Islam" is derived from "Salm", which means peace, safety, and submission. Islam guides people towards inner and outer peace, seeking to establish love and brotherhood in human society.'
      },
      {
        id: 'tf-3',
        type: 'quran',
        textAr: "يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ إِنَّهُ لَكُمْ عَدُوٌّ مُبِينٌ",
        textPs: "اې هغو کسانو چې ايمان مو راوړی دی! په سوله (اسلام) کې پوره ننوځئ او د شیطان پر پښو مه ځئ؛ بېشکه هغه ستاسو ښکاره دښمن دی.",
        textEn: "O you who have believed, enter into peace completely and do not follow the footsteps of Satan. Indeed, he is to you a clear enemy.",
        reference: "سورة البقرة: ۲۰۸"
      },
      {
        id: 'tf-4',
        type: 'heading',
        textPs: 'د اسلام اساسي ستنې او اعتدال',
        textEn: 'The Core Pillars of Islam and Moderation'
      },
      {
        id: 'tf-5',
        type: 'standard',
        textPs: 'اسلام پر اعتدال (منځلاريتوب) ولاړ دین دی. د ژوند په ټولو چارو کې اسلام له حد څخه تېرېدل یا کم راوستل نه خوښوي. ددې دین عقیدتي اساس پر توحید (د یوه واحد خدای بندګۍ) او اخلاقي اساس پر عادلانه چلند باندې ولاړ دی. یو مسلمان ددې عقیدې لرونکی وي چې هر انسان د الله تعالی مخلوق دی او د درناوي وړ دی.',
        textEn: 'Islam is a religion based on moderation (Wasatiyyah). In all aspects of life, Islam rejects transgression and negligence. The theological foundation of this religion is Monotheism (worshipping the One God) and its ethical foundation is based on just conduct. A Muslim believes that every human is a creation of Allah and is worthy of respect.'
      },
      {
        id: 'tf-6',
        type: 'hadith',
        textAr: "إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا",
        textPs: "بېشکه دین اسانتیا ده، او هیڅکله به هیڅ څوک له دین سره سختي ونه کړي مګر دا چې دین به ورباندې برلاسی شي؛ نو منځلاري اوسئ، سمې لارې ته نږدې شئ او زیری ورکړئ.",
        textEn: "Indeed, the religion is easy, and no one ever makes the religion difficult except that it overcomes him. So be moderate, strive for perfection, and receive glad tidings.",
        reference: "صحيح البخاري"
      },
      {
        id: 'tf-7',
        type: 'heading',
        textPs: 'رحمت او عامه ګټه',
        textEn: 'Mercy and Public Well-being'
      },
      {
        id: 'tf-8',
        type: 'standard',
        textPs: 'د اسلام د پیغمبر حضرت محمد (صلی الله علیه وسلم) ترټولو لویه ځانګړنه دا ده چې هغه یوازې د مسلمانانو لپاره نه، بلکې د ټولې نړۍ او کایناتو لپاره رحمت بلل شوی. د اسلام پیغام دا دی چې په مځکه کې د ټولو ژوندیو موجوداتو سره د زړه سوي او رحمت چلند وشي.',
        textEn: 'The greatest quality of the Prophet of Islam, Muhammad (peace be upon him), is that he is described as a mercy not just for Muslims, but for the entire universe. The message of Islam is to treat all living creatures on Earth with compassion and mercy.'
      },
      {
        id: 'tf-9',
        type: 'quran',
        textAr: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
        textPs: "او (اې پیغمبره!) موږ ته نه یې لېږلی مګر د ټولې نړۍ لپاره رحمت.",
        textEn: "And We have not sent you except as a mercy to the worlds.",
        reference: "سورة الأنبياء: ۱۰۷"
      }
    ]
  },
  {
    id: 'human-rights-in-islam',
    titlePs: '۲. په اسلام کې د انسان مقام او حقوق',
    titleEn: '2. Human Status and Rights in Islam',
    categoryPs: 'حقوق او ټولنه',
    categoryEn: 'Rights & Society',
    summaryPs: 'په دې مبحث کې د انسان هغه لوړ مقام او بنسټیز حقوق څیړل کیږي چې اسلام نږدې ۱۴۰۰ کاله وړاندې بشریت ته ډالۍ کړي دي.',
    summaryEn: 'This topic examines the high status and fundamental rights of human beings which Islam bestowed upon humanity nearly 1400 years ago.',
    readTime: 8,
    paragraphs: [
      {
        id: 'hr-1',
        type: 'heading',
        textPs: 'د بشري کرامت اصل او د انسان لوړتیا',
        textEn: 'The Principle of Human Dignity and the Elevation of Mankind'
      },
      {
        id: 'hr-2',
        type: 'standard',
        textPs: 'اسلام انسان د خدای د خلیفه او د ځمکې تر ټولو غوره مخلوق په توګه معرفي کړی دی. هر انسان ته پرته له دې چې د هغه نژاد، رنګ، ژبې، ملت او یا مذهب ته وکتل شي، د ذاتي درناوي حق ورکړل شوی دی. په اسلامي حکومتونو کې غیر مسلمانان هم د بشپړو بشري حقوقو او د خپلو مذهبي ازادیو خاوندان دي.',
        textEn: 'Islam has introduced the human being as the vicegerent of God and the noblest of creations on Earth. Every individual, regardless of their race, color, language, nation, or religion, is granted the right to inherent dignity. In Islamic governance, non-Muslims also enjoy complete human rights and their religious freedoms.'
      },
      {
        id: 'hr-3',
        type: 'quran',
        textAr: "وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ وَحَمَلْنَاهُمْ فِي الْبَرِّ وَالْبَحْرِ وَرَزَقْنَاهُم مِّنَ الطَّيِّبَاتِ وَفَضَّلْنَاهُمْ عَلَى كَثِيرٍ مِّمَّنْ خَلَقْنَا تَفْضِيلًا",
        textPs: "او بېشکه موږ د آدم اولادې ته عزت ورکړی او هغوی ته مو په وچه او سمندر کې د تګ وسیلې برابرې کړې او هغوی ته مو له پاکو شیانو رزق ورکړ او پر خپلو ډیرو پیدا شویو مخلوقاتو مو لوړوالی ورکړ.",
        textEn: "And We have certainly honored the children of Adam and carried them on land and sea and provided for them of the good things and preferred them over much of what We have created, with [definite] preference.",
        reference: "سورة الإسراء: ۷۰"
      },
      {
        id: 'hr-4',
        type: 'heading',
        textPs: 'بنسټیز انساني حقوق په اسلام کې',
        textEn: 'Fundamental Human Rights in Islam'
      },
      {
        id: 'hr-5',
        type: 'standard',
        textPs: 'اسلام د ژوند حق، د ازادۍ حق، د ملکیت حق او د عدالت حق د هر چا لپاره تضمینوي. د یوه بې ګناه انسان وژل د ټول بشریت د وژلو په څېر لوی جرم بلل شوی دی. هیڅ څوک نه شي کولی د بل چا حق له پامه وغورځوي یا په ناقانونه توګه د هغه پر مال او ځان تېری وکړي.',
        textEn: 'Islam guarantees the right to life, liberty, property, and justice for everyone. The killing of an innocent human being is considered a crime as massive as killing all of humanity. No one is permitted to ignore another person\'s rights or unlawfully violate their wealth and body.'
      },
      {
        id: 'hr-6',
        type: 'quran',
        textAr: "مَن قَتَلَ نَفْسًا بِغَيْرِ نَفْسٍ أَوْ فَسَادٍ فِي الْأَرْضِ فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا",
        textPs: "هر چا چې یو تن د بل چا له بدلو پرته یا په مځکه کې له فساد خپرولو پرته ووژاه، نو لکه ټول خلک یې چې وژلي وي، او چا چې هغه ژوندی وساته (له مرګه یې وژغوره) نو لکه ټول خلک یې چې ژوندي کړي وي.",
        textEn: "Whoever kills a soul unless for a soul or for corruption [done] in the land - it is as if he had slain mankind entirely. And whoever saves one - it is as if he had saved mankind entirely.",
        reference: "سورة المائدة: ۳۲"
      },
      {
        id: 'hr-7',
        type: 'heading',
        textPs: 'د مساوات او برابرۍ بې ساري نمونه',
        textEn: 'An Unparalleled Model of Equality'
      },
      {
        id: 'hr-8',
        type: 'standard',
        textPs: 'په ټولنیز قانون کې اسلام داسې مساوات رامنځته کړی چې په هغه کې هیڅ امپراتور، بډای یا واکمن په حقوقي محکمه کې پر عام بې وزله کس باندې برتري نه لري. په اسلام کې یوازینی د لوړوالي او درناوي معیار تقوی او پاک اوسیږل دي.',
        textEn: 'In social law, Islam has established an equality where no emperor, rich person, or ruler has superiority over a common poor person in a court of justice. In Islam, the only criterion for elevation and honor is piety and pure living.'
      },
      {
        id: 'hr-9',
        type: 'quran',
        textAr: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَى وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ",
        textPs: "اې خلکو! موږ تاسو له یوه نارینه او یوې ښځې پیدا کړي یو، او تاسو مو په قومونو او قبیلو وویشلئ ترڅو یو بل وپېژنئ؛ بېشکه د الله پر وړاندې ستاسو تر ټولو معزز هغه دی چې تقوا لرونکی وي؛ بېشکه الله پوه او خبردار دی.",
        textEn: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted.",
        reference: "سورة الحجرات: ۱۳"
      }
    ]
  },
  {
    id: 'women-rights-in-islam',
    titlePs: '۳. په اسلام کې د ښځې مقام او حقوق',
    titleEn: '3. Status and Rights of Women in Islam',
    categoryPs: 'حقوق او ټولنه',
    categoryEn: 'Rights & Society',
    summaryPs: 'دا فصل د جاهلیت په پیر کې د ښځو حالت، د اسلام د راتګ انقلابي بدلونونه او هغو درناوي او ازادیو ته کتنه کوي چې ښځو ته په اسلام کې ورکړل شوي دي.',
    summaryEn: 'This chapter examines the state of women during the pre-Islamic era, the revolutionary changes brought by Islam, and the respect and freedoms granted to women in Islam.',
    readTime: 7,
    paragraphs: [
      {
        id: 'wr-1',
        type: 'heading',
        textPs: 'تاریخي مخینه او د ښځې د کرامت اعاده',
        textEn: 'Historical Context and Restoration of Women\'s Dignity'
      },
      {
        id: 'wr-2',
        type: 'standard',
        textPs: 'له اسلام څخه وړاندې په ډیرو تمدنونو او مذهبونو کې ښځه د یو شی په څیر ګڼل کیدله چې د میراث او ملکیت هیڅ حق یې نه درلود، او حتی د نجلۍ پیدا کیدل شرم بلل کیده. اسلام راغی او دغه جاهلانه رواجونه یې په کلکه مات کړل او ښځه یې د سړي په څیر د کامل بشري ارزښت لرونکې او د انساني حقوقو مستحقه اعلان کړه.',
        textEn: 'Before Islam, in many civilizations and religions, a woman was treated like a possession with no rights of inheritance or ownership, and the birth of a girl was even deemed a shame. Islam arrived and firmly broke these ignorant traditions, declaring the woman as possessing complete human value and rights, equal to man.'
      },
      {
        id: 'wr-3',
        type: 'hadith',
        textAr: "إِنَّمَا النِّسَاءُ شَقَائِقُ الرِّجَالِ",
        textPs: "بېشکه ښځې د نارینه وو غبرګې (او له نارینه وو سره په حقوقو کې برابرې) دي.",
        textEn: "Indeed, women are the twin halves of men (and equal to men in rights).",
        reference: "الحدیث الشریف - سنن أبي داود"
      },
      {
        id: 'wr-4',
        type: 'heading',
        textPs: 'بنسټیز حقوق: میراث، ملکیت او تعلیم',
        textEn: 'Fundamental Rights: Inheritance, Property, and Education'
      },
      {
        id: 'wr-5',
        type: 'standard',
        textPs: 'اسلام ښځې ته د خپلواک اقتصادي فعالیت حق ورکړی. هغه کولی شي مال واخلي، وپلوري، تجارت وکړي او د خپلو پیسو او ملکیت بشپړ واک ولري، پرته له دې چې پر میړه یا بل چا تکیه وکړي. ددې تر څنګ، اسلام ښځې ته د میراث حق د قانون له مخې ورکړی او د علم زده کړه یې ورباندې فرض کړې ده.',
        textEn: 'Islam granted women the right to independent economic activity. She can buy, sell, trade, and have full authority over her money and property, without depending on her husband or anyone else. Additionally, Islam legally granted women the right to inheritance and made the pursuit of knowledge an obligation upon them.'
      },
      {
        id: 'wr-6',
        type: 'quran',
        textAr: "لِّلرِّجَالِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ وَلِلنِّسَاءِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ مِمَّا قَلَّ مِنْهُ أَوْ كَثُرَ نَصِيبًا مَّفْرُوضًا",
        textPs: "د سړیو لپاره برخه ده له هغه مال څخه چې مور او پلار او نږدې خپلوانو پریښی وي، او د ښځو لپاره هم برخه ده له هغه مال څخه چې مور او پلار او نږدې خپلوانو پریښی وي، که هغه مال لږ وي که ډیر؛ دا برخه له لوري ټاکل شوې ده.",
        textEn: "For men is a share of what the parents and close relatives leave, and for women is a share of what the parents and close relatives leave, be it little or much - an obligatory share.",
        reference: "سورة النساء: ۷"
      },
      {
        id: 'wr-7',
        type: 'heading',
        textPs: 'د مور او لور په توګه د ښځې لوړ مقام',
        textEn: 'The High Status of Woman as a Mother and Daughter'
      },
      {
        id: 'wr-8',
        type: 'standard',
        textPs: 'په کورني چوکاټ کې، اسلام د مور خدمت او اطاعت تر ټولو لوی معنوي عمل ګرځولی او جنت یې د هغې تر پښو لاندې بللی دی. د لور روزنه او له هغې سره مینه ددې لامل ګرځي چې انسان له اور څخه وژغورل شي او جنت ته ننوځي. پیغمبر (ص) تل له ښځو سره پر نرمښت او نېکۍ کولو امر کړی دی.',
        textEn: 'Within the family structure, Islam has made serving and obeying the mother the greatest spiritual deed, placing Paradise beneath her feet. Raising daughters with love and care protects a person from the Fire and leads to Paradise. The Prophet (pbuh) consistently ordered kindness and gentleness towards women.'
      },
      {
        id: 'wr-9',
        type: 'hadith',
        textAr: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي",
        textPs: "ستاسو په منځ کې غوره ستاسو هغه څوک دی چې د خپلې کورنۍ (ښځې) لپاره غوره وي، او زه ستاسو په منځ کې د خپلې کورنۍ لپاره تر ټولو غوره یم.",
        textEn: "The best of you are those who are best to their families, and I am the best of you to my family.",
        reference: "الحدیث الشریف - سنن الترمذي"
      }
    ]
  },
  {
    id: 'islam-and-peace',
    titlePs: '۴. اسلام او د سولې غوښتنه',
    titleEn: '4. Islam and the Pursuit of Peace',
    categoryPs: 'اخلاق او سوله',
    categoryEn: 'Morals & Peace',
    summaryPs: 'دا مبحث روښانه کوي چې څنګه سوله د اسلام اصل او د ژوند اساس دی، او د جهاد حقیقي مفاهیم د ناسم پوهاوي پر وړاندې وړاندې کوي.',
    summaryEn: 'This topic clarifies how peace is the primary principle and foundation of life in Islam, while explaining the true concepts of Jihad to counter misunderstandings.',
    readTime: 6,
    paragraphs: [
      {
        id: 'ip-1',
        type: 'heading',
        textPs: 'سوله: د اسلام اصلي حالت',
        textEn: 'Peace: The Default State in Islam'
      },
      {
        id: 'ip-2',
        type: 'standard',
        textPs: 'سوله او امن په اسلام کې اصلي حالت دی، او جګړه د یوې لنډمهالې حل لارې په توګه یوازې د مځکنۍ دفاع او له ظلم څخه د مظلوم د ژغورلو لپاره روا ګڼل شوې ده. د اسلام د سلام راکولو کلتور (السلام علیکم) پخپله دا ثابتوي چې د مسلمانانو ترمنځ هر لیدنه په بشپړ ډول د سولې او سلامتۍ پر دعا پیل کیږي.',
        textEn: 'Peace and security represent the default state in Islam, while war is permitted only as a temporary defensive measure to repel aggression and protect the oppressed. The Islamic greeting of peace (Assalamu Alaikum) proves that every interaction between Muslims begins with a prayer of absolute peace and well-being.'
      },
      {
        id: 'ip-3',
        type: 'quran',
        textAr: "وَإِن جَنَحُوا لِلسَّلْمِ فَاجْنَحْ لَهَا وَتَوَكَّلْ عَلَى اللَّهِ إِنَّهُ هُوَ السَّمِيعُ الْعَلِيمُ",
        textPs: "او که هغوی (مخالفین) سولې ته مایل شول، نو ته هم ورته مایل شه او پر الله توکل وکړه؛ بېشکه چې هغه اوریدونکی او پوه دی.",
        textEn: "And if they incline to peace, then incline to it [also] and rely upon Allah. Indeed, it is He who is the Hearing, the Knowing.",
        reference: "سورة الأنفال: ۶۱"
      },
      {
        id: 'ip-4',
        type: 'heading',
        textPs: 'په جګړه کې د بشري اصولو مراعات کول',
        textEn: 'Observing Humanitarian Principles in Warfare'
      },
      {
        id: 'ip-5',
        type: 'standard',
        textPs: 'حتی د دفاعي جګړې په جریان کې هم اسلام خپلو عسکرو ته کلک بشري اصول ټاکلي دي. په جګړه کې د ښځو، ماشومانو، زړو کسانو، او عبادت کوونکو وژل په کلکه منع دي. همدارنګه د ونو وهل، د زراعت له منځه وړل، د اوبو د سرچینو خرابول او د معبدونو ورانول هم حرام ګڼل شوي دي.',
        textEn: 'Even during defensive warfare, Islam has established strict humanitarian rules for its soldiers. Killing women, children, the elderly, and non-combatants/worshippers is strictly forbidden. Similarly, cutting down trees, destroying agriculture, contaminating water sources, and demolishing temples are prohibited.'
      },
      {
        id: 'ip-6',
        type: 'hadith',
        textAr: "لا تَقْتُلُوا شَيْخًا فَانِيًا، وَلا طِفْلا صَغِيرًا، وَلا امْرَأَةً، وَلا تَقْطَعُوا شَجَرًا إِلا أَنْ تَضْطَرُّوا إِلَيْهَا",
        textPs: "هیڅ زوړ د کار لوېدلی سړی مه وژنئ، او هیڅ کوچنی ماشوم مه وژنئ، او هیڅ ښځه مه وژنئ... او هیڅ د مېوې ونه مه پرې کوئ مګر دا چې مجبوره شئ.",
        textEn: "Do not kill an elderly person, nor a young child, nor a woman... and do not cut down trees unless you are forced to.",
        reference: "الحدیث الشریف - سنن البيهقي"
      },
      {
        id: 'ip-7',
        type: 'heading',
        textPs: 'د مذهب د ازادۍ تضمین',
        textEn: 'Guaranteeing Freedom of Belief'
      },
      {
        id: 'ip-8',
        type: 'standard',
        textPs: 'اسلام مذهبي ازادۍ ته بشپړ درناوی لري. قرآن کریم په صراحت سره ویلي چې د عقیدې او مذهب په انتخاب کې باید هیڅ ډول فشار یا جبر نه وي؛ ځکه چې رښتینې عقیده له زړه او شعور څخه سرچینه اخلي او د فشار په واسطه نه رامینځته کیږي.',
        textEn: 'Islam fully respects religious freedom. The Quran explicitly states that there must be no pressure or compulsion in choosing one\'s faith and religion; because genuine belief springs from the heart and consciousness, and cannot be manufactured through coercion.'
      },
      {
        id: 'ip-9',
        type: 'quran',
        textAr: "لَا إِكْرَاهَ فِي الدِّينِ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
        textPs: "په دین کې هیڅ ډول زور زیاتی نشته؛ بېشکه چې سمه لاره له بې لارۍ څخه جلا او روښانه شوې ده.",
        textEn: "There is no compulsion in religion. The right direction has become distinct from the wrong.",
        reference: "سورة البقرة: ۲۵۶"
      }
    ]
  },
  {
    id: 'importance-of-knowledge',
    titlePs: '۵. په اسلام کې د علم او پوهې ارزښت',
    titleEn: '5. The Value of Knowledge and Learning in Islam',
    categoryPs: 'علم او طبیعت',
    categoryEn: 'Knowledge & Nature',
    summaryPs: 'دا لوست څرګندوي چې څنګه اسلام په لومړي وحې کې په "لوستلو" امر کړی او د علم لاسته راوړل یې پر هر فرد لازمي کړي دي.',
    summaryEn: 'This lesson reveals how Islam commanded "reading" in its very first revelation and made seeking knowledge an obligation for every individual.',
    readTime: 5,
    paragraphs: [
      {
        id: 'kn-1',
        type: 'heading',
        textPs: 'لومړی امر: ولوله!',
        textEn: 'The First Command: Read!'
      },
      {
        id: 'kn-2',
        type: 'standard',
        textPs: 'د اسلام د دین پیل او د قرآن کریم تر ټولو لومړی وحې شوی لفظ "اقرأ" (ولوله!) و. دا په دې دلالت کوي چې اسلام د علم، تحقیق او تفکر علمبردار دی. اسلام هغه قوم ته چې په تیارو او ناپوهۍ کې ډوب و، د رڼا او پوهې لاره وښودله او علم یې تر ټولو لوړ عبادت وګرځاوه.',
        textEn: 'The beginning of the Islamic religion and the very first word of the Quran revealed was "Iqra" (Read!). This demonstrates that Islam is the champion of knowledge, investigation, and contemplation. Islam guided a nation drowned in darkness and ignorance towards the path of light and learning, deeming seeking knowledge the highest form of devotion.'
      },
      {
        id: 'kn-3',
        type: 'quran',
        textAr: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ (۱) خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ (۲) اقْرَأْ وَرَبُّكَ الْأَكْرَمُ (۳) الَّذِي عَلَّمَ بِالْقَلَمِ (۴)",
        textPs: "ولوله د خپل هغه رب په نوم چې (هر څه یې) پیدا کړي دي (۱) انسان یې له پرې شوې وینې پیدا کړی (۲) ولوله او ستاسو رب تر ټولو مهربان دی (۳) هغه ذات چې په قلم یې علم ښودلی دی (۴).",
        textEn: "Recite in the name of your Lord who created (1) Created man from a clinging substance (2) Recite, and your Lord is the most Generous (3) Who taught by the pen (4).",
        reference: "سورة العلق: ۱-۴"
      },
      {
        id: 'kn-4',
        type: 'heading',
        textPs: 'د عالم او ناپوه ترمنځ تفاوت',
        textEn: 'The Distinction Between the Knower and the Ignorant'
      },
      {
        id: 'kn-5',
        type: 'standard',
        textPs: 'قرآن کریم په پرله پسې توګه انسان تفکر، تدبر، او پر کایناتو کې څیړنې ته هڅوي. اسلام هغه کسان چې پوهیږي او هغه کسان چې ناپوه دي، په هیڅ صورت د برابرۍ وړ نه بولي او عالمانو ته یې لوړې معنوي درجې ځانګړې کړې دي.',
        textEn: 'The Quran constantly encourages humans to contemplate, reflect, and investigate the wonders of the universe. Islam rejects any equality between those who possess knowledge and those who do not, promising scholars exalted spiritual ranks.'
      },
      {
        id: 'kn-6',
        type: 'quran',
        textAr: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ إِنَّمَا يَتَذَكَّرُ أُولُو الْأَلْبَابِ",
        textPs: "ووایه: ایا هغه کسان چې پوهیږي او هغه کسان چې نه پوهیږي یو شان دي؟ بېشکه یوازې د عقل خاوندان پند اخلي.",
        textEn: "Say, 'Are those who know equal to those who do not know?' Only they will remember [who are] people of understanding.",
        reference: "سورة الزمر: ۹"
      },
      {
        id: 'kn-7',
        type: 'heading',
        textPs: 'د علم هر اړخیزوالی په اسلام کې',
        textEn: 'The Comprehensiveness of Knowledge in Islam'
      },
      {
        id: 'kn-8',
        type: 'standard',
        textPs: 'په اسلام کې علم یوازې په مذهبي علومو پورې محدود نه دی، بلکې هر هغه علم چې د بشریت لپاره ګټور وي (لکه طب، انجنیري، ساینس، ریاضي او ستورپېژندنه) هم په معنوي لحاظ د ډېر ثواب لرونکی او د فرض کفایي په کچه مهم ګڼل کیږي. د اسلام په طلایي دوره کې د ساینس او علومو بې سارې وده د همدې پیغام پایله وه.',
        textEn: 'In Islam, knowledge is not restricted to religious sciences, but rather any discipline that benefits humanity (such as medicine, engineering, physical sciences, mathematics, and astronomy) is spiritually rewarding and designated as a communal obligation (Fard Kifayah). The historic rise of sciences during the Islamic Golden Age was the direct fruit of this message.'
      }
    ]
  },
  {
    id: 'economic-justice',
    titlePs: '۶. د اسلام اقتصادي او ټولنیز عدالت',
    titleEn: '6. Islamic Economic and Social Justice',
    categoryPs: 'علم او طبیعت',
    categoryEn: 'Knowledge & Nature',
    summaryPs: 'زکات، صدقه، د ربا (سود) ممانعت او د بې وسو لاسنیوی هغه اساسات دي چې اسلامي اقتصادي نظام ترې رامنځته شوی ترڅو په ټولنه کې غني او غریب نږدې کړي.',
    summaryEn: 'Zakat, charity, the prohibition of usury (interest), and helping the poor are the foundations of the Islamic economic system designed to bridge the gap between the rich and the needy.',
    readTime: 7,
    paragraphs: [
      {
        id: 'ec-1',
        type: 'heading',
        textPs: 'زکات او ټولنیز تضمین',
        textEn: 'Zakat and Social Security'
      },
      {
        id: 'ec-2',
        type: 'standard',
        textPs: 'د اسلام د دریمې ستنې په توګه زکات یوازې یو خیریه عمل نه دی، بلکې دا د غریبانو یو شرعي او قانوني حق دی چې د بډایه کسانو پر مال فرض شوی دی. زکات مرسته کوي ترڅو د ثروت او پیسو د انحصار مخه ونیول شي او په ټولنه کې د بې وسو او اړمنو کسانو د ژوند اساسي اړتیاوې پوره شي.',
        textEn: 'As the third pillar of Islam, Zakat is not merely a voluntary charity, but a legal, religious right of the poor established upon the wealth of the wealthy. Zakat prevents the hoarding of wealth and ensures the fulfillment of the basic life necessities of the underprivileged and needy members of society.'
      },
      {
        id: 'ec-3',
        type: 'quran',
        textAr: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ إِنَّ اللَّهَ بِمَا تَعْمَلُونَ بَصِيرٌ",
        textPs: "او لمونځ قایم کړئ او زکات ورکړئ، او هر نېک کار چې تاسو د خپلو ځانونو لپاره مخکې ولیږئ، هغه به د الله په وړاندې ومومئ؛ بېشکه چې الله ستاسو پر کړنو ښه لیدونکی دی.",
        textEn: "And establish prayer and give Zakat, and whatever good you put forward for yourselves - you will find it with Allah. Indeed, Allah of what you do is Seeing.",
        reference: "سورة البقرة: ۱۱۰"
      },
      {
        id: 'ec-4',
        type: 'heading',
        textPs: 'د سود ممانعت او عادلانه معامله',
        textEn: 'Prohibition of Usury and Fair Commerce'
      },
      {
        id: 'ec-5',
        type: 'standard',
        textPs: 'اسلام هر ډول اقتصادي استثمار او بې عدالتي ردوي. د سود یا ربا په حراموالي سره اسلام د هغه ظالمانه چلند لاره بنده کړه چې بډایه خلک یې له محتاجو کسانو څخه د پیسو پر پور ورکولو ګټه اخلي. د سود په ځای، اسلام پر شراکت، حلال تجارت او بې سوده پور ورکولو (قرض الحسنه) ټینګار کوي.',
        textEn: 'Islam rejects all forms of economic exploitation and injustice. By prohibiting usury (Riba), Islam blocked the oppressive practice where the wealthy profit off the desperation of those in need. Instead of interest, Islam stresses business partnerships, fair trade, and interest-free loans (Qard al-Hasan).'
      },
      {
        id: 'ec-6',
        type: 'quran',
        textAr: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
        textPs: "او الله تجارت حلال کړی او سود یې حرام کړی دی.",
        textEn: "And Allah has permitted trade and has forbidden interest.",
        reference: "سورة البقرة: ۲۷۵"
      },
      {
        id: 'ec-7',
        type: 'heading',
        textPs: 'د ګاونډیانو او یتیمانو پالنه',
        textEn: 'Care for Neighbors and Orphans'
      },
      {
        id: 'ec-8',
        type: 'standard',
        textPs: 'اسلامي اخلاق امر کوي چې هیڅ مسلمان د خپل مړښت او هوساینې حق نلري په داسې حال کې چې د هغه ګاونډی وږی وي. د یتیمانو او بې کسه خلکو د مال ساتنه او په سمه توګه د هغوی لاسنیوی د اسلام له خورا اساسي ارزښتونو څخه دی چې په ټولنه کې سوله، مینه او د تود زړه کلتور خپروي.',
        textEn: 'Islamic ethics dictate that no Muslim has the right to fully satisfy their hunger while their neighbor remains hungry. Safeguarding the wealth and well-being of orphans and vulnerable members of society is an essential Islamic value that spreads peace, love, and a culture of warmth in society.'
      }
    ]
  },
  {
    id: 'nature-and-environment',
    titlePs: '۷. اسلام او د چاپیریال ساتنه',
    titleEn: '7. Islam and Environmental Stewardship',
    categoryPs: 'علم او طبیعت',
    categoryEn: 'Knowledge & Nature',
    summaryPs: 'طبیعت او د چاپیریال ژوندي موجودات د الله تعالی نښې دي او انسان د ځمکې پر مخ د امانتدار په توګه د هغوی ساتنې او پاکوالي ته مسوول دی.',
    summaryEn: 'Nature and the living organisms of the environment are signs of Allah, and humanity, as a trustee on Earth, is responsible for their preservation and purity.',
    readTime: 5,
    paragraphs: [
      {
        id: 'ne-1',
        type: 'heading',
        textPs: 'ځمکه د امانت په توګه',
        textEn: 'The Earth as a Trust'
      },
      {
        id: 'ne-2',
        type: 'standard',
        textPs: 'په اسلام کې ځمکه او د هغې ټول ایکوسیستم د الله تعالی لخوا انسان ته یو لوی الهي امانت (امانة) دی. انسان ته ددې اجازه نشته چې په ځمکه کې له حده زیات زیان ورسوي، منابع تخریب کړي یا اوبه او هوا ککړه کړي. د چاپیریال ساتنه د ایمان برخه ګڼل کیږي او د چاپیریال پاک ساتلو او د ونو د کښت لپاره معنوي ثوابونه شته دی.',
        textEn: 'In Islam, the Earth and its entire ecosystem represent a great divine trust (Amanah) given to humanity by Allah. Humans are not allowed to cause excessive damage, deplete resources, or pollute air and water. Protecting the environment is considered a branch of faith, and there are spiritual rewards for tree planting and cleanliness.'
      },
      {
        id: 'ne-3',
        type: 'quran',
        textAr: "وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا وَادْعُوهُ خَوْفًا وَطَمَعًا إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ",
        textPs: "او په مځکه کې له اصلاح وروسته فساد (او تباهي) مه خپروئ، او هغه (خدای) ته په ویرې او هیلې سره دعا وکړئ؛ بېشکه د الله رحمت نېکي کوونکو ته نږدې دی.",
        textEn: "And cause not corruption upon the earth after its reformation, and invoke Him in fear and aspiration. Indeed, the mercy of Allah is near to the doers of good.",
        reference: "سورة الأعراف: ۵۶"
      },
      {
        id: 'ne-4',
        type: 'heading',
        textPs: 'له حیواناتو او نباتاتو سره نرم چلند',
        textEn: 'Kindness to Animals and Plants'
      },
      {
        id: 'ne-5',
        type: 'standard',
        textPs: 'د اسلام د پیغمبر په احادیثو کې د اوبو د بې ځایه مصرفولو څخه مخنیوی د فرضو غوندې ارزښت لري حتی که څوک د روان سیند په غاړه اودس هم کوي. همدارنګه د حیواناتو د حقونو ساتل، هغوی ته ډوډۍ او اوبه ورکول د ګناهونو د بخښلو لامل ګرځي، په داسې حال کې چې هغوی ته ضرر رسول د جهنم د عذاب سبب ګرځي.',
        textEn: 'In the traditions of the Prophet of Islam, preventing water waste is of paramount importance, even if one is performing ablution on the bank of a flowing river. Likewise, observing animal rights, feeding, and watering them lead to the forgiveness of sins, while harming them leads to severe retribution.'
      },
      {
        id: 'ne-6',
        type: 'hadith',
        textAr: "مَا مِنْ مُسْلِمٍ يَغْرِسُ غَرْسًا، أَوْ يَزْرَعُ زَرْعًا، فَيَأْكُلُ مِنْهُ طَيْرٌ أَوْ إِنْسَانٌ أَوْ بَهِيمَةٌ، إِلَّا كَانَ لَهُ بِهِ صَدَقَةٌ",
        textPs: "هر هغه مسلمان چې کومه ونه کښینوي، یا کوم زراعت وکړي، بیا ترې کوم مرغه، انسان او یا حیوان وخوري، نو دا د هغه لپاره یوه صدقه ده.",
        textEn: "There is no Muslim who plants a tree or sows a seed, and then a bird, or a person, or an animal eats from it, except that it is a charity for him.",
        reference: "الحدیث الشریف - صحيح البخاري"
      },
      {
        id: 'ne-7',
        type: 'heading',
        textPs: 'پاکوالی او سلامتیا',
        textEn: 'Cleanliness and Well-being'
      },
      {
        id: 'ne-8',
        type: 'standard',
        textPs: 'اسلام په ورځ کې پنځه ځله مسلمانان د اودس او د بدن د مینځلو په واسطه د جسمي او روحي پاکوالي او روغتیا ساتلو ته هڅوي. د خلکو له تګ راتګ لارې څخه د کثافاتو یا ازار ورکوونکي شي لیرې کول د ایمان له درجو څخه یوه درجه ګرځول شوې ده.',
        textEn: 'Islam encourages physical and spiritual cleanliness by requiring Muslims to perform ablution and wash their bodies five times a day. Removing garbage or any harmful obstacle from the paths of people is declared as a branch of faith.'
      },
      {
        id: 'ne-9',
        type: 'hadith',
        textAr: "الطُّهُورُ شَطْرُ الإِيمَانِ",
        textPs: "پاکوالی (او اودس کول) د ایمان نیمایي برخه ده.",
        textEn: "Cleanliness is half of faith.",
        reference: "الحدیث الشریف - صحيح مسلم"
      }
    ]
  }
];
