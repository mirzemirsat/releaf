import { PRODUCTS } from "@/lib/products";
import { FLOWERS } from "@/lib/flowers";

/**
 * Every editable string, icon and image on the public site lives here.
 * The admin panel saves overrides to `data/content.json`, which are
 * deep-merged over these defaults at render time — so deleting the
 * JSON file (or resetting a section) always restores this copy.
 *
 * Conventions the admin editor understands:
 *  - keys matching /icon|emoji/      → emoji picker
 *  - keys matching /image|gallery/   → image picker (media library + upload)
 *  - keys named `slug` or `species`  → read-only identifiers
 */
export const DEFAULT_CONTENT = {
  global: {
    brandName: "Releaf",
    /** one of: leaf | sprout | flower | sun */
    logoIcon: "leaf",
    nav: [
      { label: "Shop", href: "/shop" },
      { label: "The Collection", href: "/collection" },
      { label: "Try it", href: "/#try-it" },
      { label: "Pomodoro Guide", href: "/guide" },
      { label: "Our Story", href: "/about" },
    ],
    footer: {
      blurb:
        "A plush desk companion that stands tall while you focus and bends forward when it is time to rest.",
      sloganLine: "Focus. Rest. Releaf.",
      newsletterTitle: "Get rare-bloom reveal alerts",
      newsletterThanks: "🌻 You're on the list — talk soon!",
      bottomNote:
        "© 2026 Releaf. Ages 14+. Blind box pull rates are printed on every box and disclosed on the collection page.",
      bottomNote2: "Demo storefront built for the Releaf launch concept — payments are simulated.",
    },
  },

  home: {
    hero: {
      badge: "🌱 New — the 7-bloom launch collection",
      titleLead: "The little flower that",
      titleStand: "stands",
      titleMid: "while you focus — and",
      titleBend: "bends",
      titleTail: "when it's time to rest.",
      body: "Releaf is a plush Pomodoro companion with a real timer in its pot. It keeps you company through every focus session, then physically droops to remind you to take the break your brain actually needs. No apps. No notifications. Just a flower with opinions about your wellbeing.",
      primaryCta: "Open a Blind Box · ₺1.099",
      secondaryCta: "Watch it bend ↓",
      trustLine:
        "★★★★★ Loved by early-access students · 7 blooms to collect · Free shipping over ₺1.500",
      chipFocus: "⏱ 25:00 · deep focus",
      chipRest: "🍃 Break time — stretch!",
      chipFloat: "🌼 1 of 7 mystery blooms",
    },
    trustStrip: [
      "⏱ Screen-free Pomodoro timer",
      "🌸 7 blooms to collect",
      "🔋 8+ weeks per charge",
      "🚚 Free shipping over ₺1.500",
      "🛡 2-year mechanism warranty",
      "🎓 Student code: STUDENT15",
    ],
    howItWorks: {
      eyebrow: "The mechanism",
      titleA: "A timer measures time.",
      titleB: "Releaf performs it.",
      body: "The Pomodoro technique works — until you swipe the break reminder away. Releaf turns the reminder into a physical, slightly endearing event on your desk.",
      steps: [
        {
          icon: "⏱",
          title: "Plant it. Press focus.",
          body: "Set the timer in the pot — 25, 50, or your own rhythm. Your Releaf stands tall beside you for the whole session, off-screen and unbothered by notifications.",
        },
        {
          icon: "🍃",
          title: "It bends. You breathe.",
          body: "When the timer ends, the motor in the pot slowly bends the stem forward, like a flower that's tired. A reminder you can ignore on a phone — but not on your desk.",
        },
        {
          icon: "🌼",
          title: "Rest. It rises again.",
          body: "Take your break, tap reset, and your companion straightens up — recovered, just like you. Stack sessions, build the habit, grow the garden.",
        },
      ],
    },
    scrollBend: {
      eyebrow: "The mechanism, live",
      title: "Scroll down. Watch it rest.",
      body: "No video, no trick — the same flexible stem the real Releaf uses. As you scroll, it bends from focus into rest, exactly like the flower on your desk when the timer ends.",
      scrollHint: "Keep scrolling",
      focusLabel: "Focusing",
      restLabel: "Resting",
    },
    demo: {
      eyebrow: "Try it right here",
      title: "Run a real session with digital Sunny",
      body: "This is the exact behavior of the physical product — a working Pomodoro timer wired to the bend. Try the 10-second demo to see the magic moment.",
    },
    collectionPreview: {
      eyebrow: "Collect them all",
      titleLead: "7 to collect.",
      titleHighlight: "One mystery left.",
      ctaLabel: "Meet the whole garden →",
      rarityLabel: "Rarity",
      pullChanceSuffix: "pull chance",
      detailsLabel: "View details",
      oddsNote: "Pull rates printed on every box ·",
      oddsLinkLabel: "full odds & fairness policy",
    },
    differences: {
      eyebrow: "Why a flower?",
      titleLine1: "You already know breaks matter.",
      titleLine2: "You need a cue that's harder to dismiss.",
      items: [
        {
          icon: "📱",
          title: "Phone timers get swiped away",
          body: "A notification is a question — and 'ignore' is always an answer. A flower physically drooping on your desk is a different kind of argument. You can't scroll past it.",
        },
        {
          icon: "🌧",
          title: "Focus apps live on the distraction",
          body: "Forest, Pomofocus, Focus To-Do — great tools, wrong neighborhood. They make you check the exact device you're trying to escape. Releaf lives on the desk, off the screen.",
        },
        {
          icon: "🧸",
          title: "Plush toys are cute but idle",
          body: "Releaf has the soft, deskmate charm of a plush — plus a job. It works your hours, takes your breaks, and quietly models the habit you're trying to build.",
        },
      ],
    },
    shopTeaser: {
      eyebrow: "The shop",
      title: "Three ways to start your garden",
      linkLabel: "See all options →",
    },
    testimonials: {
      title: "From desks like yours",
      items: [
        {
          quote:
            "I bought it as a joke before finals. Then it bent over in the middle of my third hour of cramming and I genuinely went and made tea. It works because you feel bad ignoring it.",
          name: "Elif, 21",
          role: "Medical student, İstanbul",
        },
        {
          quote:
            "My team gifted me the lavender one for my home office. My screen time is down, my plant is thriving, and it can't even photosynthesize.",
          name: "Mert, 27",
          role: "Frontend developer, remote",
        },
        {
          quote:
            "Three boxes in and I pulled Lili. The unboxing was half the fun — now I'm two blooms from the full windowsill and unreasonably proud of it.",
          name: "Zeynep, 19",
          role: "Engineering student, Ankara",
        },
      ],
    },
    faq: {
      eyebrow: "Good questions",
      title: "Everything else you'd ask",
      items: [
        {
          q: "What exactly does Releaf do?",
          a: "It's a 25 cm plush flower in a pot with a built-in Pomodoro timer and a small motor. You start a focus session and the flower stands upright. When the session ends, the stem slowly bends forward — your physical, impossible-to-swipe-away cue to take a break. Tap reset after your break and it stands tall again.",
        },
        {
          q: "Is this another app I have to install?",
          a: "The opposite. Releaf was designed because break reminders on your phone live on the same screen that distracts you. The timer is in the pot; the reminder is the movement. No app, no account, no notifications. (A companion app for streaks is on the roadmap — strictly optional.)",
        },
        {
          q: "How do blind box odds work?",
          a: "Every box contains one of seven blooms. Pull rates are printed on the box and published on our collection page: the three Commons at 18% each, two Uncommons at 13% each, Lili the Lily at 12%, and the ultra-rare Exotic at 8%. The Full Garden set is the no-luck option — all six standard blooms, guaranteed.",
        },
        {
          q: "How does it charge, and how long does a charge last?",
          a: "USB-C, with the port hidden under the pot. A full charge runs 8+ weeks of daily sessions because the motor only moves twice per Pomodoro. The plush cover is removable and hand-washable; the pot just needs a wipe.",
        },
        {
          q: "Shipping, returns and warranty?",
          a: "Free shipping in Turkey on orders over ₺1.500 (flat ₺89,90 below that), delivered in 1–3 business days to İstanbul, Ankara and İzmir. Unopened boxes can be returned within 14 days. The bending mechanism carries a 2-year warranty — if it stops bending, we fix or replace it.",
        },
        {
          q: "Is there a student discount?",
          a: "Always. Use code STUDENT15 at checkout for 15% off — no verification hoops during launch season, we trust you. Keep an eye on campus pop-ups for exam-week extras.",
        },
      ],
    },
    cta: {
      title: "Your focus deserves a companion.",
      body: "One mystery bloom, a real Pomodoro timer, and a reminder to rest that you'll actually obey. Which of the seven will land on your desk?",
      primaryCta: "Open a Blind Box · ₺1.099",
      secondaryCta: "Meet the blooms",
      slogan: "Focus. Rest. Releaf.",
    },
  },

  shopPage: {
    eyebrow: "The shop",
    titleA: "Start with one.",
    titleB: "Stay for seven.",
    sub: "Every option below ships with the full Releaf experience — plush companion, in-pot Pomodoro timer, the famous bend, and a collector card.",
    bannerTitle: "🎓 Studying?",
    bannerBody: "Use code STUDENT15 at checkout for 15% off — exam season is hard enough.",
    perks: [
      {
        icon: "🚚",
        title: "Fast, careful shipping",
        body: "1–3 business days to İstanbul, Ankara & İzmir. Free over ₺1.500, flat ₺89,90 below.",
      },
      {
        icon: "🛡",
        title: "2-year bend warranty",
        body: "The mechanism is the heart of the product. If it stops bending, we repair or replace it.",
      },
      {
        icon: "🔁",
        title: "14-day returns",
        body: "Unopened boxes return free. Mystery stays mysterious — odds on the collection page.",
      },
    ],
  },

  collectionPage: {
    eyebrow: "The launch collection",
    titleLine1: "Seven personalities.",
    titleLine2: "One desk at a time.",
    sub: "Every blind box hides one of these seven companions. Same timer, same bend, very different vibes. Collect them all — or let one perfect stranger choose you.",
    luckyTitle: "Feeling lucky?",
    luckyBody: "Every box is a fair pull from this exact table. The Exotic is out there — 8 in every 100 boxes.",
    luckyCta: "Open a Blind Box · ₺1.099",
    luckyLink: "or skip the luck — get the Full Garden",
    oddsTitle: "Pull rates, in plain sight",
    oddsBody:
      "Blind boxes are only fun when they're fair. These exact odds are printed on every box, every listing, and this page — and they always sum to 100%. No gacha tricks, no “dynamic” rates, no pity-timer fine print. Just seven flowers and honest math.",
  },

  guidePage: {
    eyebrow: "The Pomodoro guide",
    titleA: "You don't have a focus problem.",
    titleB: "You have a stopping problem.",
    intro:
      "The Pomodoro technique is simple: work in focused sprints, rest in between. The science is solid — attention is a muscle that recovers with rest. The catch? Nobody actually takes the breaks. That's the part Releaf was built to fix.",
    stepsTitle: "The rhythm, in four moves",
    steps: [
      {
        title: "Pick one task",
        body: "Not your to-do list — one task. 'Read chapter 4', not 'study'. Releaf can't choose for you, but it will judge you kindly.",
      },
      {
        title: "Focus for 25 minutes",
        body: "Start the timer in the pot. Phone face-down, ideally in another postal code. Your companion stands at attention the whole time.",
      },
      {
        title: "When it bends, you stop",
        body: "This is the rule that makes everything work. The bend is not a suggestion. Stand up, stretch, water a real plant, look at something further than 50 cm away.",
      },
      {
        title: "Rest 5, then reset",
        body: "After your break, tap reset — the flower rises and so do you. Every four sessions, take a longer 15–30 minute break. You've earned it.",
      },
    ],
    whyTitle: "Why a bending flower beats a beeping phone",
    whyP1: "Between 38% and 60% of university students report burnout, and the leading drivers are long unbroken study hours and digital distraction. Everyone already knows breaks matter — the knowledge isn't the problem. A phone reminder is easy to swipe away and easier to ignore; it lives on the very device that eats your focus.",
    whyP2: "A physical object that visibly changes state is different. When something on your desk slumps over like it's tired, ignoring it costs you a little guilt — and that tiny emotional pull is exactly enough to get you out of your chair. We didn't invent the break. We just made it impossible to miss and slightly adorable.",
    tipsTitle: "Field notes from heavy users",
    tips: [
      {
        icon: "📵",
        title: "Distance beats discipline",
        body: "Willpower is a battery, not a personality trait. Putting your phone out of arm's reach saves more focus than any technique.",
      },
      {
        icon: "✍️",
        title: "Keep a 'later list'",
        body: "When an intrusive thought arrives mid-session ('I should check…'), write it on paper and return to work. Process the list during breaks.",
      },
      {
        icon: "🧃",
        title: "Breaks are for bodies",
        body: "Scrolling is not a break — it's the same posture with worse content. Move, hydrate, stare out a window like a Victorian poet.",
      },
      {
        icon: "🌙",
        title: "Stop while it's good",
        body: "End your last session at a natural high point. Tomorrow's start is easier when yesterday didn't end in burnout.",
      },
    ],
    ctaTitle: "Ready to practice with a partner?",
    ctaBody: "Try the rhythm with the interactive demo, or get the real thing on your desk.",
    ctaButton: "Open a Blind Box · ₺1.099",
  },

  aboutPage: {
    eyebrow: "Our story",
    title: "Relief, spelled with a leaf.",
    p1: "Releaf started in an İstanbul library during finals week, watching an entire reading room push through hour six without a single break. Everyone knew better. Nobody stopped. The phones that could have reminded them were the reason they needed reminding.",
    p2: "So we asked a strange question: what if the reminder wasn't a sound, but a posture? Something on your desk that gets visibly tired when you should be — and recovers when you do. A timer measures time. A companion performs it.",
    missionEyebrow: "Our mission",
    missionQuote:
      "“Releaf exists to make healthy work and study habits feel natural — by turning the moment of rest into something visible, friendly, and easy to act on.”",
    valuesTitle: "What we won't compromise",
    values: [
      {
        icon: "🍵",
        title: "Rest is productive",
        body: "Most productivity tools push you to do more. We're built on the opposite belief: sustainable focus depends on rest, and the hardest part of resting is noticing when to start.",
      },
      {
        icon: "🤝",
        title: "Fair pulls, always",
        body: "Blind boxes are joy, not gambling. Our odds are printed on every box, published online, and never change quietly. The thrill should come from the reveal — not the fine print.",
      },
      {
        icon: "🌍",
        title: "Soft on desks, soft on the planet",
        body: "Recycled-fiber plush, washable covers, replaceable mechanisms and recyclable packaging. A companion that's built to stay, not to be thrown away.",
      },
      {
        icon: "🫂",
        title: "Community over hype",
        body: "From campus pop-ups in İstanbul, Ankara and İzmir to trade threads for collectors — Releaf grows desk by desk, not drop by drop.",
      },
    ],
    contactTitle: "Say hi 🌻",
    contactBody:
      "Questions, wholesale, campus pop-up requests, or photos of your bloom's new desk — we read everything.",
    contactEmail: "hello@releaf.com.tr",
    contactSocial: "@releaf.desk on Instagram & TikTok",
  },

  /** Marketing fields only — slugs and prices are fixed in code for checkout integrity. */
  products: PRODUCTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    badge: p.badge ?? "",
    description: p.description,
    highlight: p.highlight,
    image: p.image,
    gallery: p.gallery,
    contents: p.contents,
  })),

  /** Marketing fields only — species, rarity and odds are fixed in code. */
  flowers: FLOWERS.map((f) => ({
    species: f.species,
    name: f.name,
    scientificName: f.scientificName,
    mood: f.mood,
    bio: f.bio,
    image: f.image,
  })),
};

export type SiteContent = typeof DEFAULT_CONTENT;
export type SectionKey = keyof SiteContent;

export const SECTION_META: Record<SectionKey, { title: string; description: string }> = {
  global: { title: "Brand & Chrome", description: "Logo icon, navigation labels, footer" },
  home: { title: "Homepage", description: "Hero, how-it-works, demo, testimonials, FAQ, CTA" },
  shopPage: { title: "Shop Page", description: "Headings, student banner, perks" },
  collectionPage: { title: "Collection Page", description: "Headings, lucky card, odds copy" },
  guidePage: { title: "Pomodoro Guide", description: "Guide steps, tips, deep-dive copy" },
  aboutPage: { title: "About Page", description: "Story, mission, values, contact" },
  products: { title: "Products", description: "Names, descriptions, photos, box contents" },
  flowers: { title: "The 7 Blooms", description: "Names, personalities, photos" },
};
