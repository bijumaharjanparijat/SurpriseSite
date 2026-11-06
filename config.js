/* ============================================================
   CONFIG — Deepa: The Forever Duo
   All text and asset mapping live here.
   To change the site's voice, edit this file only.
   ============================================================ */

const CONFIG = {
  /* ----------------------------------------------------------
     META
     ---------------------------------------------------------- */
  meta: {
    owner: "Biju Maharjan",
    recipient: "Deepa Chaudhary Magar",
    occasion: "Happy Birthday, my love",
    version: "1.1 — for November 11",
    borrows:
      "Some BTS references, some MLBB inside jokes, some borrowed courage.",
  },

  /* ----------------------------------------------------------
     PIN GATE
     ---------------------------------------------------------- */
  pin: "1111",
  pinEasterEgg: {
    "0420": "Close. That's a rank, not a date. Try again, my carry.",
    "0000": "That's the respawn timer, not the answer.",
    "1234": "I love you, but no. That's every default password on Earth.",
    "1110": "Off by one. Story of our ping.",
    "1314": "One three one four. Cute. But our date is the one that actually matters, my love.",
    "2020": "That's the year the world stopped. We started later. Try again, my carry.",
    "1122": "So close in spirit. Try the day the world got luckier, two digits, twice.",
    "12345": "That's five digits. You type faster than you read. Retry, my love."
  },

  /* ----------------------------------------------------------
     LOADING
     ---------------------------------------------------------- */
  loading: {
    minDurationMs: 30000,
    skipAfterMs: 4000,
    skipLabel: "Skip the spell, my love →",
    loadingMessages: [
      "Tuning the Pied Piper frequency…",
      "Warming up the heart (and your buffs)…",
      "Loading our memories. Please do not steal this progress bar.",
      "Summoning Aamon to carry this loading screen…",
      "Buffing the love stats. Please do not steal these either.",
      "Polishing the certificate. It has to look official.",
      "Almost there. I promise this isn't a 404.",
      "Ready when you are, my carry.",
    ],
  },

  /* ----------------------------------------------------------
     DATES
     ---------------------------------------------------------- */
  dates: {
    met: {
      question: "When did we first meet?",
      hint: "The month we started talking. Think May, and think of the day I got lucky without knowing it.",
      answer: "May 5",
      accepted: [
        "5",
        "05",
        "may 5",
        "5 may",
        "may 5th",
        "5th may",
        "may fifth",
        "fifth may",
        "5/5",
        "05/05",
        "may 05",
      ],
      correctMsg:
        "Yes. May 5. The day the universe quietly queued us into the same lobby.",
      wrongMsg:
        "Not quite. It was May 5. Don't worry, I'll remember it for both of us. And I'll still let you take my buff.",
      easterEgg:
        "Fun fact: I didn't know it yet, but that was the day I stopped being a solo player.",
    },
    relationship: {
      question: "When did we become us?",
      hint: "Twenty days after that. Also the day I stopped pretending.",
      answer: "May 25",
      accepted: [
        "25",
        "may 25",
        "25 may",
        "may 25th",
        "25th may",
        "may twenty-five",
        "twenty-five may",
        "25/5",
        "25/05",
        "5/25",
        "05/25",
      ],
      correctMsg:
        "Exactly. May 25. The day I stopped pretending I wasn't falling.",
      wrongMsg:
        "Close. May 25. The day I stopped pretending. I'll remember both dates forever. You just have to remember to show up.",
      easterEgg:
        "The gap between May 5 and May 25 is the shortest twenty days of my life.",
    },
  },

  /* ----------------------------------------------------------
     HERO
     ---------------------------------------------------------- */
  hero: {
    name: "Deepa",
    typewriter: "You are the best thing that happened to my Nepal chapter.",
    beginButton: "Press to begin",
    eyebrow: "Happy Birthday",
    birthdayMark: "assets/bts/trimmed/19.png",
    cakeImage: "assets/photos/birthdayCake.png",
    clouds: [
      { src: "assets/photos/clouds/cloud1.png", className: "hero-cloud--1" },
      { src: "assets/photos/clouds/cloud2.png", className: "hero-cloud--2" },
      { src: "assets/photos/clouds/cloud3.png", className: "hero-cloud--3" },
      { src: "assets/photos/clouds/cloud4.png", className: "hero-cloud--4" },
      { src: "assets/photos/clouds/cloud5.png", className: "hero-cloud--5" },
    ],
    scrollTarget: "btsSection",
    floatingFacts: [
      "Currently: the best Aamon in my lobby.",
      "Status: officially the love of my life.",
      "Ping: 0. Feelings: 1000.",
      "Buffs stolen: an undisclosed amount. Never pressing charges.",
      "Currently: Pied Piper on repeat and your name in every verse.",
      "Mood: waiting for your next 'good morning' text like it's a buff.",
    ],
  },

  /* ----------------------------------------------------------
     BTS ASSETS — THE PNG SYSTEM
     Nineteen images, each with a stable .bts-png-NN class.
     Each placement can include layout: { width, height, top, right,
     bottom, left, rotation }. Values are CSS lengths/angles.
     Example: { src: "1.png", corner: "tl", layout: {
       width: "120px", height: "120px", top: "2rem",
       left: "1rem", rotation: "-8deg" } }
     For responsive differences, edit that image's class in style.css.
     basePath + filename combine at runtime.
     ---------------------------------------------------------- */
  btsAssets: {
    // Transparent padding was trimmed from the rendered copies so each cutout
    // fills its CSS box consistently. The original files remain in assets/bts/.
    basePath: "assets/bts/trimmed/",
    preload: true,
    mobile: {
      reduceAnimations: true,
      staticOnly: false,
      hideSides: false,
      hideCorners: false,
    },
    loading: {
      corners: [
        { src: "1.png",  corner: "tl", animation: "bob" },
        { src: "2.png",  corner: "tr", animation: "sway" },
        { src: "3.png",  corner: "bl", animation: "pulse" },
        { src: "4.png",  corner: "br", animation: "drift" },
      ],
    },
    pin: {
      corners: [
        { src: "5.png",  corner: "tl", animation: "heartbeat" },
        { src: "6.png",  corner: "tr", animation: "tilt" },
        { src: "7.png",  corner: "bl", animation: "orbit" },
        { src: "8.png",  corner: "br", animation: "wave" },
      ],
    },
    dates: {
      corners: [
        { src: "9.png",  corner: "tl", animation: "glow" },
        { src: "10.png", corner: "tr", animation: "bob" },
        { src: "11.png", corner: "bl", animation: "sway" },
        { src: "12.png", corner: "br", animation: "pulse" },
      ],
    },
    hero: {
      sides: [
        { src: "13.png", side: "left",  animation: "drift" },
        { src: "14.png", side: "right", animation: "heartbeat" },
      ],
    },
    btsLounge: {
      sides: [
        { src: "15.png", side: "left",  animation: "sway" },
        { src: "16.png", side: "right", animation: "glow" },
      ],
    },
    quiz: {
      sides: [
        { src: "17.png", side: "left",  animation: "orbit" },
        { src: "18.png", side: "right", animation: "tilt" },
      ],
    },
    finalOverlay: {
      negative: {
        src: "19.png",
        corners: ["tl", "tr", "bl", "br"],
        animation: "pulse",
      },
      afterYes: {
        src: "logo.png",
        basePath: "assets/bts/",
        animation: "heartbeat",
      },
    },
  },

  /* ----------------------------------------------------------
     BTS / PIED PIPER LOUNGE
     ---------------------------------------------------------- */
  btsLounge: {
    title: "The Pied Piper Lounge",
    subtitle: "For the songs we share, and the ones we will.",
    intro:
      "You told me Pied Piper is your song. I looked it up. Then I looked it up again. Now every time it plays I see you leaning on your desk with that little smile you get when the bass drops. This section is for that smile.",
    piedPiperLines: [
      "You're my Pied Piper. I'd follow the melody anywhere. Even to a time zone seven hours ahead.",
      "The song says 'I'm taking over you.' You already did. On May 5. Rude, but I respect it.",
      "Some pipes you don't resist. Some people you don't pretend to be fine without.",
      "Busan is Jimin's hometown. You love Busan. I love you. The math is done.",
    ],
    borahae: {
      label: "One thing Army says that I mean too",
      text: "'I purple you.' You are the purple in my otherwise very blue life.",
    },
    busanNote:
      "Busan is on the map below. Not just because Jimin is from there. Because you told me it's your favorite. That makes it mine too.",
    armyPurpleNote:
      "They call it the ARMY purple. I call it the color I see when I think of you on a good day.",
  },

  /* ----------------------------------------------------------
     TIMELINE
     ---------------------------------------------------------- */
  timeline: [
    {
      date: "May 5",
      title: "The day we met",
      text: "You were just a voice in a game. I had no idea I was about to meet the person I'd fight for.",
      icon: "✦",
    },
    {
      date: "May 25",
      title: "The day we became us",
      text: "The day I stopped pretending. The day you became mine, and I became yours.",
      icon: "♡",
    },
    {
      date: "Six months in Nepal",
      title: "Our chapter together",
      text: "We played. We argued over buffs. You carried me as Aamon. I fell harder every match.",
      icon: "❀",
    },
    {
      date: "The UK distance",
      title: "You went back",
      text: "The timezone changed. My feelings didn't. I got good at counting the hours.",
      icon: "✈",
    },
    {
      date: "November 11",
      title: "Your birthday",
      text: "The day the world got luckier. The day I get to celebrate the person who makes my ordinary days feel like a victory screen.",
      icon: "★",
    },
  ],

  /* ----------------------------------------------------------
     MLBB HEROES
     ---------------------------------------------------------- */
  heroes: {
    title: "Our Battlefield",
    subtitle:
      "You carry me as Aamon. I let you take my buff. We both die anyway.",
    cards: [
      {
        name: "Aamon",
        image: "assets/mlbbhero/aamon.png",
        role: "Jungler",
        caption:
          "Your Aamon carried me through ranks I had no business being in. You're not just my duo. You're my carry.",
        color: "#7B4B9E",
        mvp: true,
      },
      {
        name: "Angela",
        image: "assets/mlbbhero/angela.png",
        role: "Support",
        caption:
          "You babysit me when I play marksman. We both die anyway. I'd die a hundred times with you.",
        color: "#E8A0BF",
      },
      {
        name: "Aurora",
        image: "assets/mlbbhero/aurora.png",
        role: "Mid",
        caption: "Your Aurora freezes the enemy. You thaw me.",
        color: "#7FB3D5",
      },
      {
        name: "Zetian",
        image: "assets/mlbbhero/zetian.png",
        role: "Mid",
        caption: "The Empress. Fitting.",
        color: "#C9A0DC",
      },
      {
        name: "Lesley",
        image: "assets/mlbbhero/lesley.png",
        role: "Gold",
        caption: "You snipe from a distance. I still feel it from here.",
        color: "#8B6F9E",
      },
      {
        name: "Hanabi",
        image: "assets/mlbbhero/hanabi.png",
        role: "Gold",
        caption:
          "The one you pick when you want to win. The one I pick when I want to watch you win.",
        color: "#E88BA0",
      },
      {
        name: "Floryn",
        image: "assets/mlbbhero/floryn.png",
        role: "Roam",
        caption: "You heal the whole team. You healed me without even trying.",
        color: "#A8D8B9",
      },
      {
        name: "Carmilla",
        image: "assets/mlbbhero/carmilla.png",
        role: "Roam",
        caption: "You link to me. I link to you. Same thing.",
        color: "#D4A5A5",
      },
      {
        name: "Esmeralda",
        image: "assets/mlbbhero/esmeralda.png",
        role: "Exp",
        caption:
          "You hold the exp lane alone. You never have to hold anything alone again.",
        color: "#E5C890",
      },
      {
        name: "Alpha",
        image: "assets/mlbbhero/alpha.png",
        role: "Jungler",
        caption: "You go in first. I'll always follow.",
        color: "#A0A0C0",
      },
    ],
    buff: {
      buttonLabel: "Steal My Buff",
      waitingLabel: "Buff in transit…",
      doneLabel: "You got it, my carry.",
      messages: [
        "You can take my buff. You can take my kills. You can take my heart. I'm yours either way, in the good and the bad. Love you.",
        "I could get annoyed. I could ask for it back. I could not. You're my carry. The buff was always yours.",
        "Every time you take my buff a small piece of me whispers 'worth it.' I've stopped arguing with the small piece.",
        "You could take my whole account and I'd thank you. Please don't actually take my whole account.",
      ],
      extraJokes: [
        "I have decided to file a formal complaint. The complaint is a love letter.",
        "Buff stolen. Again. I'm keeping a list. The list is also a love letter.",
        "Our KDA is terrible. Our memories are undefeated.",
      ],
    },
  },

  /* ----------------------------------------------------------
     FAKE GAMING STATS
     ---------------------------------------------------------- */
  gamingStats: {
    title: "Our Unofficial Stats",
    subtitle: "Not audited. Not sorry.",
    stats: [
      { label: "Matches won together", value: "Every single one" },
      { label: "Buffs you stole", value: "An undisclosed amount" },
      { label: "Times we both died", value: "Yes" },
      { label: "Times I let you take the kill", value: "Also yes" },
      { label: "Reasons I'd queue again", value: "You. Only you." },
      { label: "Carry rating", value: "You: 10. Me: emotional support." },
    ],
  },

  /* ----------------------------------------------------------
     REASSURANCE ROOM
     ---------------------------------------------------------- */
  reassurance: {
    title: "The Enough Room",
    subtitle: "For the days when the thought comes back.",
    buttonLabel: "When you feel like you're not enough, press this",
    resetButtonLabel: "Start again",
    messages: [
      "You are not a burden. You are the best part of my day.",
      "Your anger doesn't scare me. It tells me you trust me enough to show it.",
      "You are not 'too much.' You are exactly enough, and I will keep saying it until you believe it.",
      "I didn't fall for you because you were perfect. I fell for you because you were real.",
      "You don't have to earn my love. It's already yours. It was yours on May 5.",
      "You are not a maybe. You are the plan.",
      "I would choose you in every timeline, every rank, every country.",
      "You are not hard to love. You are worth the effort, and the effort is a privilege.",
      "I am not going anywhere. Not because I have to. Because I want to.",
      "You are my partner. Not just my girlfriend. My partner for life.",
    ],
    finalMessage:
      "You are enough. You have always been enough, exactly as you are. You never need to be quieter, easier, happier, or more perfect to deserve love. On the hard days, when you cannot see your own light, I will remind you: you are loved, you belong, and I choose you every time. I am honored to be yours.",
    victoryLabel: "VICTORY",
    victorySubtext: "You are enough. Always were.",
  },

  /* ----------------------------------------------------------
     MOOD CHECK
     ---------------------------------------------------------- */
  moodCheck: {
    title: "How are you feeling right now?",
    subtitle:
      "Pick one. I have a message for each. I always have a message for each.",
    moods: [
      {
        key: "happy",
        label: "Happy",
        icon: "😆",
        color: "#ffd166",
        message:
          "Good. Stay there. I'm saving a screenshot of this mood for the days I miss you.",
      },
      {
        key: "sad",
        label: "Sad",
        icon: "😔",
        color: "#8bb8ff",
        message:
          "I'm sorry. You don't have to explain it to me. Just sit here a second. I'm sitting with you.",
      },
      {
        key: "tired",
        label: "Tired",
        icon: "🫩",
        color: "#b7a1e8",
        message:
          "You don't have to earn rest. Close your eyes. I'll be here when you open them.",
      },
      {
        key: "angry",
        label: "Angry",
        icon: "🤬",
        color: "#ff6b6b",
        message:
          "Okay. I'm listening. You can be as loud as you need. I'm not going anywhere.",
      },
      {
        key: "missing",
        label: "Missing you",
        icon: "🥹",
        color: "#f39ac7",
        message:
          "Same. Since the second you got on that plane. The timezone is a rumor. My feelings did not get the memo.",
      },
      {
        key: "inlove",
        label: "In love",
        icon: "🥰",
        color: "#ff86b7",
        message:
          "Convenient. Because the feeling is mutual and slightly embarrassing in public.",
      },
      {
        key: "hungry",
        label: "Hungry",
        icon: "🤤",
        color: "#ffad5c",
        message:
          "Go eat something. Momo. Boba. Not brinjal. Never brinjal. I'll fight every brinjal in Nepal for you.",
      },
    ],
  },

  /* ----------------------------------------------------------
     REASON SPINNER
     ---------------------------------------------------------- */
  reasonsSpinner: {
    title: "Spin for a reason",
    subtitle:
      "One tap, one reason I love you. The wheel is rigged. Every answer is sincere.",
    cooldownHours: 0,
    buttonLabel: "Spin the wheel",
    cooldownLabel:
      "Come back in a few hours. I ran out of reasons (I did not).",
    reasons: [
      "The way your voice sounds when you laugh at your own jokes before you finish them.",
      "The way you carry a whole team and still ask if everyone else is okay.",
      "The way you get angry at the game and then instantly apologize to me.",
      "The way you light up when you talk about starting your own company.",
      "The way you lean into the screen when you're focused on your Aamon.",
      "The way you say 'Biju' when you want something and think I can't tell.",
      "The way you eat momo like it owes you money.",
      "The way you make a bad day feel like a detour, not a dead end.",
      "The way you trust me with the loud, messy parts of you.",
      "The way you still say goodnight even when you're upset with me.",
      "The way you look when you talk about Busan.",
      "The way you listen. Actually listen. Like my words are worth something.",
      "The way you carry the weight of wanting to be enough, even though you already are.",
      "The way you play Angela and then still save me despite everything.",
      "The way you say 'obviously' when the answer was never obvious.",
      "The way you fight for us even when you're tired.",
      "The way you make me want to be someone who deserves you.",
      "The way your voice goes quiet when you're about to say something real.",
      "The way you still get shy when I compliment you.",
      "The way you exist. That's it. That's the reason.",
      "The way you hum along to Dynamite and pretend you didn't notice you were doing it.",
      "The way you defend Spring Day like it's a person. Honestly, it kind of is.",
      "The way you look when Pied Piper comes on. Like the song was written for us.",
      "The way you keep going, even when the whole day has been a mess. Especially then.",
    ],
  },

  /* ----------------------------------------------------------
     HUG BUTTON
     ---------------------------------------------------------- */
  hugButton: {
    title: "A hug, on demand",
    subtitle: "Press when you need one. Infinite stock.",
    buttonLabel: "Send me a hug",
    hugs: [
      "Hug sent. Delivery time: instant. Refund policy: never.",
      "Hug sent. It's the kind where I hold you a little longer than necessary.",
      "Hug sent. The kind where I don't say anything and just stay.",
      "Hug sent. Tight. Unhurried. Yours.",
      "Hug sent. For the days the world is loud. This one is quiet.",
      "Hug sent. You don't have to ask twice. You never have to ask at all.",
    ],
  },

  /* ----------------------------------------------------------
     FEAR FAIRY
     ---------------------------------------------------------- */
  fearFairy: {
    title: "The things that scare you",
    subtitle: "I know about them. I have decided to take them personally.",
    fears: [
      {
        key: "heights",
        label: "Heights",
        message:
          "I'll stand between you and the edge. You don't have to look down. You can look at me instead.",
      },
      {
        key: "ghosts",
        label: "Ghosts",
        message:
          "I have no ghost-repellent skills. I do have a very loud voice and a lot of free time. Ghosts don't stand a chance.",
      },
      {
        key: "loudnoise",
        label: "Loud noises",
        message:
          "When it gets loud, find my hand. Nothing loud ever lasts. My hand will.",
      },
      {
        key: "scaryanimals",
        label: "Scary animals",
        message:
          "I will bravely stand in front of any scary animal. Then I will scream. Then we will run. We will be fine.",
      },
    ],
  },

  /* ----------------------------------------------------------
     HER DREAM JOB
     ---------------------------------------------------------- */
  dreamJob: {
    title: "Your company",
    subtitle: "A reminder I want you to read on the days it feels far away.",
    message:
      "You told me you want to build your own company and do something new. I want you to know I already believe in it. I don't need to see the pitch deck. I don't need a five year plan. I just need you to keep going, and to let me be the person holding the door open while you walk through it. When it happens, I want the first invite to the launch. When it doesn't happen the way you planned, I want to be the first to tell you the plan was never the point. You are.",
  },

  /* ----------------------------------------------------------
     HER FAVORITES (shrine)
     ---------------------------------------------------------- */
  herFavorites: {
    title: "A small shrine to your favorites",
    subtitle: "Because they are part of you, and I love the whole thing.",
    items: [
      {
        key: "boba",
        label: "Boba tea",
        icon: "🧋",
        note: "The only rival I have. I've accepted it. Mostly.",
      },
      {
        key: "momo",
        label: "Momo",
        icon: "🥟",
        note: "The way to your heart is steamed and served with achar.",
      },
      {
        key: "busan",
        label: "Busan",
        icon: "🌊",
        note: "Jimin's hometown. Your favorite. Fine, I'll share.",
      },
      {
        key: "paris",
        label: "Paris",
        icon: "🗼",
        note: "Your dream place. I want to be standing next to you when you see it.",
      },
      {
        key: "blue",
        label: "Blue",
        icon: "💙",
        note: "The color of your favorite things. And, currently, the color of my sky when I miss you.",
      },
      {
        key: "park",
        label: "Park dates",
        icon: "🌳",
        note: "Hand in hand. That's the whole plan. That's the whole plan for life.",
      },
      {
        key: "train",
        label: "Train to Busan",
        icon: "🚆",
        note: "You love a movie that scares you and makes you cry. I love that about you.",
      },
      {
        key: "books",
        label: "Books",
        icon: "📚",
        note: "One day I want to be the reason you look up from one and smile.",
      },
      {
        key: "latin",
        label: "Latin music",
        icon: "🎶",
        note: "Your favorite genre. I'm learning the rhythm. I'll meet you there.",
      },
      {
        key: "v",
        label: "V (Taehyung / THV)",
        icon: "🐻",
        note: "Your favorite BTS member. One more reason I know your taste is impeccable.",
      },
    ],
  },

  /* ----------------------------------------------------------
     VOICE APPRECIATION
     ---------------------------------------------------------- */
  voiceNote: {
    title: "A note about your voice",
    text: "I love your voice. Not in the polite, 'you sound nice' way. In the way where I hear it in my head on the drive home. In the way where a bad day gets shorter the moment you start talking. I love the version of it when you're excited, and the version when you're tired, and the version when you say my name like it's a small, private thing. All of them. I love all of them.",
  },

  /* ----------------------------------------------------------
     GALLERY
     ---------------------------------------------------------- */
  gallery: [
    {
      caption: "The first time I saw you on May 5th",
      image: "assets/photos/sawfirst.jpg",
    },
    {
      caption: "The first time we added each other.",
      image: "assets/photos/added.jpg",
    },
    {
      caption: "The first you invited me to Play Together.",
      image: "assets/photos/invite.jpg",
    },
    {
      caption: "The first time you complimented playing my main hero <3",
      image: "assets/photos/firstcompliment.jpg",
    },
    {
      caption: "The first time I heard your voice.",
      image: "assets/photos/voice.jpg",
    },
    {
      caption: "The match where you carried me.",
      image: "assets/photos/carry.jpg",
    },
    {
      caption: "The time when you stalked me and i was blushing crazy.",
      image: "assets/photos/likes.jpg",
    },
    {
      caption: "The time when you stalked me and i was blushing crazy.",
      image: "assets/photos/firstcall.jpg",
    },
    {
      caption: "The time when we twinned each other.",
      image: "assets/photos/twin.jpg",
    },
    {
      caption: "The time when you got mad at me.",
      image: "assets/photos/firstfight.jpg",
    },
    {
      caption:
        "The time when we yapped and finally confessed like 3 hours ? thats a lot.",
      image: "assets/photos/longestongoingcall.jpg",
    },
    {
      caption: "Finally Calling you my baby",
      image: "assets/photos/callingbaby.jpg",
    },
  ],

  /* ----------------------------------------------------------
     DREAM MAP
     ---------------------------------------------------------- */
  dreamMap: {
    title: "Our Dream Map",
    subtitle: "Tap each pin. They all lead to you.",
    pins: [
      {
        place: "Busan",
        text: "Your favorite place. I want to see it with you.",
        x: 78,
        y: 42,
      },
      {
        place: "Paris",
        text: "Your dream place. I want to be the person standing next to you when you see it.",
        x: 50,
        y: 30,
      },
      {
        place: "Wherever you are",
        text: "My favorite place is wherever you're standing. That's the whole map.",
        x: 22,
        y: 58,
      },
    ],
  },

  /* ----------------------------------------------------------
     LOVE LETTER
     ---------------------------------------------------------- */
  loveLetter: {
    heading: "A letter for you",
    text: "My Deepa,\n\nI noticed you long before you noticed yourself. I saw the way you light up when you talk about your dreams, the way you care for everyone around you, the way you play with your whole heart. And I thought, how is she real?\n\nYou have this quiet fear that you're not enough. I see it in the way you apologize for things you don't need to apologize for. In the way you second-guess yourself. In the way you sometimes pull away when I get close.\n\nHere is what I need you to know, and I will spend the rest of my life proving it. You are not 'too much.' You are not 'not enough.' You are exactly, completely, impossibly enough. Every single version of you.\n\nYou can be angry with me. You can cry. You can be quiet. You can be loud. You can steal my buff and my kills and my heart. You can be every single thing you are, and I will still be standing here, choosing you.\n\nThe distance is real. The time zones are annoying. The days between us are long. But so is my patience, and so is my love, and so is my plan. And the plan is you.\n\nThis is not a phase. This is not a season. This is for life. I want you as my girlfriend, yes. But more than that, I want you as my partner. In every rank, every country, every timeline, every fight, every win, every quiet morning.\n\nHappy birthday, my love. You are not a maybe. You are the plan.\n\nYours, always,\nBiju",
    signature: "Yours, always, Biju",
    continueButton: "Continue →",
  },

  /* ----------------------------------------------------------
     QUIZ
     ---------------------------------------------------------- */
  quiz: {
    title: "How Well Do You Know Us?",
    questions: [
      {
        q: "Where did we meet?",
        options: ["Online, playing MLBB", "At a party", "Through friends"],
        funny:
          "I would have remembered a party. You would have been the only reason I went.",
      },
      {
        q: "What's my favorite thing about you?",
        options: [
          "The way you carry me as Aamon",
          "Your voice",
          "Everything, honestly",
        ],
        funny:
          "Correct answer is 'all of the above and also the way you eat momo.' I'll allow it.",
      },
      {
        q: "What do I do when you steal my buff?",
        options: [
          "Get annoyed",
          "Let you take it. Every time.",
          "Ask for it back",
        ],
        funny:
          "I have considered asking for it back. I have never followed through. This is a pattern.",
      },
      {
        q: "What's the one thing I'd never do?",
        options: ["Stop believing in you", "Stop playing with you", "Leave"],
        funny:
          "I have to be honest. I'd still queue with you even if you picked a tank and fed. Every time.",
      },
      {
        q: "What am I most afraid of?",
        options: [
          "That you'll forget how much you mean to me",
          "Losing a rank match",
          "Heights",
        ],
        funny:
          "I'm not afraid of heights. I'm afraid of a day you wake up and don't feel loved. So I make sure that doesn't happen.",
      },
    ],
    resultMessage: "You are the love of my life.",
    resultSubtext:
      "Accuracy: 100%. Replay value: forever. Co-op mode: always on.",
    wrongAnswerMessage: "Incorrect. But you're cute, so I'll allow it.",
  },

  /* ----------------------------------------------------------
     FINAL SURPRISE
     ---------------------------------------------------------- */
  finalSurprise: {
    intro: "One last thing.",
    message:
      "I have spent every day since May 5 learning you. Your laugh, your voice, your anger, your softness, the way you carry the world on your shoulders and still find room for me.\n\nYou are not a maybe. You are the plan. I want you not just as my girlfriend, but as my partner. In every rank, every country, and every timeline.\n\nSo, Deepa. Will you let me be your partner? Not just today. For life.",
    buttons: [
      "Yes",
      "Obviously yes",
      "Wait, let me re-read the letter first (also yes)",
    ],
    certificateTitle: "Official Duo Partner Certificate",
    certificateNames: "Biju Maharjan   ✦   Deepa Chaudhary Magar",
    certificateLine: "Valid in every rank, every country, and every timeline.",
    certificateDate: "November 11, 2026",
    afterAcceptMessage:
      "Thank you for choosing us, my love. From now on, every ordinary day is one I get to share with my favorite person.",
    afterAcceptExtra:
      "I choose you in every rank, every country, and every timeline. Today, tomorrow, and all the ordinary mornings in between.",
    certificateDedication:
      "I choose you in every timeline. Today, tomorrow, and every ordinary day in between.",
    certificateSignature: "With all my love, Biju",
    certificateDownloadMessage:
      "Saved with all my love, Deepa. Keep our little piece of forever close. 💜",
    certificateShareMessage:
      "Our forever promise is ready to share. Sending you all my love. 💜",
    shareLine:
      "Send this to anyone who doubts us. Send it to yourself on a bad day. It doesn't expire.",
  },

  /* ----------------------------------------------------------
     EASTER EGGS
     ---------------------------------------------------------- */
  easterEggs: {
    konami: {
      message:
        "You found it. Of course you did. You're my carry. Here is the secret: I have loved you since May 5. I will love you on every May 5 after this one. That's the whole trick.",
      label: "Secret unlocked",
    },
    secretCorner: {
      message:
        "You found the corner. There is nothing here. Except this: you are loved. Okay, maybe that is something.",
      label: "Corner found",
    },
    png13Tap: {
      message:
        "You found me. I'd follow you anywhere. Even to Busan. Even to Paris. Even into the next lobby.",
      label: "Portrait tapped",
      taps: 5,
    },
    wrongPin:
      "Nice try. But my heart only opens for one person. She knows who she is.",
    notFound: {
      code: "404",
      title: "Page not found. Love found.",
      text: "There's nothing here. But since you're here, I'll tell you a secret: I would build you a thousand pages if you asked. You never have to ask.",
    },
  },

  /* ----------------------------------------------------------
     MUSIC — AUTOPLAY + TRACK PICKER
     ---------------------------------------------------------- */
  music: {
    autoplayAfterPin: true,
    repeatMode: "all",
    defaultTrack: "pied-piper",
    volume: 0.55,
    label: "Pied Piper mode",
    hint: "Tap a track to set the mood.",
    mobileLabel: "Music",
    panelTitle: "Our playlist",
    panelSubtitle: "BTS on repeat. As it should be.",
    placeholder:
      "Add your MP3s to assets/music/ and they will appear here.",
    autoplayFallbackMessage:
      "Tap the music button to start our soundtrack. Browsers won't let me do it for you.",
    nowPlayingPrefix: "Now playing: ",
    tracks: [
      {
        id: "pied-piper",
        coverLabel: "PP",
        cover: "assets/music/covers/pied piper.jpg",
        title: "Pied Piper",
        artist: "BTS",
        src: "assets/music/pied-piper.mp3",
        note: "The song we chose. It plays first for a reason.",
      },
      {
        id: "dynamite",
        coverLabel: "DY",
        cover: "assets/music/covers/dynamite.jpg",
        title: "Dynamite",
        artist: "BTS",
        src: "assets/music/dynamite.mp3",
        note: "For the days that need a little light.",
      },
      {
        id: "spring-day",
        coverLabel: "SD",
        cover: "assets/music/covers/spring-day.jpg",
        title: "Spring Day",
        artist: "BTS",
        src: "assets/music/spring-day.mp3",
        note: "For the days I miss you a little too much.",
      },
      {
        id: "butter",
        coverLabel: "BT",
        cover: "assets/music/covers/butter.jpg",
        title: "Butter",
        artist: "BTS",
        src: "assets/music/butter.mp3",
        note: "Smooth. Like the way you said yes.",
      },
    ],
  },

  /* ----------------------------------------------------------
     UI TEXT
     ---------------------------------------------------------- */
  ui: {
    welcome: "Welcome, my love.",
    wrongPin:
      "Nice try. But my heart only opens for one person. She knows who she is.",
    tellAnyway: "Tell me anyway →",
    answerWas: "The answer was",
    buffButton: "Steal My Buff",
    buffWaiting: "Buff in transit…",
    buffDone: "You got it, my carry.",
    thanks: "You just made me the luckiest man alive.",
    replayLabel: "See our certificate again",
    nudge: "Something new just appeared at the bottom.",
    finalTrigger: "Click here for a Surprise 🎁",
    heroEyebrow: "Happy Birthday",
    certIntro: "This certifies that",
    certBound: "are bound together as",
    certRole: "Forever Duo Partners",
    pinEyebrow: "For Deepa only",
    pinTitle: "This site is protected.",
    pinSubtitle: "Only one person on Earth has the key.",
    pinHint:
      "The day the world got luckier. Two digits, twice. Get it wrong and I'm telling Aamon.",
    musicLabel: "Pied Piper mode",
    musicHint:
      "Tap to play our playlist. Warning: may cause spontaneous smiling.",
    musicAutoplayBlocked:
      "Tap the music button to start our soundtrack. Browsers won't let me do it for you.",
    musicTrackPicked: "Playing: ",
    png13Secret: "You tapped the portrait. Of course you did.",
    moodPrompt: "Pick the one that fits.",
    spinnerPrompt: "Tap to spin.",
    hugPrompt: "How many do you need? Take as many as you want.",
    fearPrompt: "Pick the one that's bugging you.",
    favoritesPrompt: "A small shrine.",
    statsPrompt: "Not audited. Not sorry.",
    voicePrompt: "About your voice.",
    dreamJobPrompt: "Read on the days it feels far away.",
  },

  /* ----------------------------------------------------------
     SECTIONS (heading text + side art assignments)
     ---------------------------------------------------------- */
  sections: {
    timelineSection: { title: "Our Story", subtitle: "Every moment led here." },
    heroesSection: {
      title: "Our Battlefield",
      subtitle:
        "You carry me as Aamon. I let you take my buff. We both die anyway.",
    },
    gamingStatsSection: {
      title: "Our Unofficial Stats",
      subtitle: "Not audited. Not sorry.",
    },
    btsLoungeSection: {
      title: "The Pied Piper Lounge",
      subtitle: "For the songs we share, and the ones we will.",
    },
    enoughSection: {
      title: "The Enough Room",
      subtitle: "For the days when the thought comes back.",
    },
    moodSection: {
      title: "How are you feeling right now?",
      subtitle: "Pick one. I have a message for each.",
    },
    spinnerSection: {
      title: "Spin for a reason",
      subtitle: "One tap, one reason I love you. The wheel is rigged.",
    },
    hugSection: {
      title: "A hug, on demand",
      subtitle: "Press when you need one. Infinite stock.",
    },
    fearSection: {
      title: "The things that scare you",
      subtitle: "I know about them. I have decided to take them personally.",
    },
    favoritesSection: {
      title: "A small shrine to your favorites",
      subtitle: "Because they are part of you, and I love the whole thing.",
    },
    voiceSection: {
      title: "A note about your voice",
      subtitle: "Because I love it. That's the whole reason.",
    },
    dreamJobSection: {
      title: "Your company",
      subtitle: "A reminder I want you to read on the days it feels far away.",
    },
    gallerySection: {
      title: "Proof of Us",
      subtitle: "A few moments I keep close.",
    },
    dreamSection: {
      title: "Our Dream Map",
      subtitle: "Tap each pin. They all lead to you.",
    },
    quizSection: { title: "How Well Do You Know Us?", subtitle: "" },
    letterSection: { title: "A letter for you", subtitle: "" },
    sideArt: {
      heroSection:       { mode: "explicit", source: "hero" },
      btsLoungeSection:  { mode: "explicit", source: "btsLounge" },
      quizSection:       { mode: "explicit", source: "quiz" },
      timelineSection:   { mode: "fixed", src: "5.png", side: "left",  className: "bts-art-timeline" },
      heroesSection:     { mode: "fixed", src: "9.png", side: "right", className: "bts-art-heroes" },
      gamingStatsSection:{ mode: "fixed", src: "14.png", side: "left", className: "bts-art-gaming-stats" },
      enoughSection:     { mode: "fixed", src: "12.png", side: "left",  className: "bts-art-enough" },
      moodSection:       { mode: "fixed", src: "11.png", side: "right", className: "bts-art-mood" },
      spinnerSection:    { mode: "fixed", src: "3.png", side: "left",  className: "bts-art-spinner" },
      hugSection:        { mode: "fixed", src: "10.png", side: "right", className: "bts-art-hug" },
      fearSection:       { mode: "fixed", src: "6.png", side: "left",  className: "bts-art-fear" },
      favoritesSection:  { mode: "fixed", src: "7.png", side: "right", className: "bts-art-favorites" },
      voiceSection:      { mode: "fixed", src: "4.png", side: "left",  className: "bts-art-voice" },
      dreamJobSection:   { mode: "fixed", src: "8.png", side: "right", className: "bts-art-dream-job" },
      gallerySection:    { mode: "fixed", src: "1.png", side: "left",  className: "bts-art-gallery" },
      dreamSection:      { mode: "fixed", src: "2.png", side: "right", className: "bts-art-dream-map" },
      letterSection:     { mode: "fixed", src: "5.png", side: "left",  className: "bts-art-letter" },
    },
  },
};
