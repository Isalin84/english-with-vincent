// Урок 1. Present Simple vs Present Continuous.
// Содержание перенесено из старого app.js без изменений (4 + 6 + 6 заданий, 190 баллов).
// Изменены только обращения: имя ученика подставляется через {name}, род не используется.
// track = имя файла в public/audio/ без .mp3. Что реально записано, см. AGENTS.md.

const t = {
  usually: "обычно",
  often: "часто",
  "every day": "каждый день",
  "every morning": "каждое утро",
  "every Saturday": "каждую субботу",
  "on Sundays": "по воскресеньям",
  now: "сейчас",
  "right now": "прямо сейчас",
  "at the moment": "в эту минуту",
  "Look!": "Смотри!",
  "Listen!": "Слушай!",
};

const signal = (clues) => clues.map((c) => `<span>${c} — ${t[c]}</span>`).join("");

export default {
  id: "tenses",
  number: 1,
  title: "«Обычно» или «прямо сейчас»?",
  grammar: "Present Simple и Present Continuous",
  emoji: "⏰",
  cover: "cover-lesson-1",
  minutes: 12,
  badge: { name: "Time Tamer", emoji: "🏅" },
  clueTranslations: t,

  intro: {
    bubble: {
      ru: "Привет, {name}! Сегодня мы приручим два английских времени. Дальше я буду говорить по-английски. Слушай внимательно и повторяй за мной!",
    },
    track: "vincent-intro",
    heading: "Как отличить «обычно» от «прямо сейчас»?",
    lead: "Освой <b>Present Simple</b> и <b>Present Continuous</b>, собери звёзды и получи медаль от Винни.",
  },

  rule: {
    bubble: {
      en: "Here's the trick: find the clue. Is it a habit, or is it happening right now?",
      ru: "Секрет простой: найди слово-подсказку и спроси себя: это обычное, повторяющееся действие или оно происходит прямо сейчас?",
    },
    track: "vincent-rule",
    kicker: "🔎 Винни объясняет",
    heading: "Два времени — «обычно» и «прямо сейчас»",
    cards: [
      {
        title: "🔁 Present Simple",
        tone: "simple",
        html: "Обычное, повторяющееся действие: то, что ты делаешь каждый день, часто, по субботам.",
        formula: "I play · she play<b>s</b><small>он, она, оно → +s</small>",
        signal: signal(["usually", "often", "every day"]),
        examples: [{ en: "I walk to school every day.", ru: "Я хожу в школу каждый день.", track: "simple-example" }],
      },
      {
        title: "⚡ Present Continuous",
        tone: "now",
        html: "Действие, которое происходит прямо сейчас, в эту самую минуту.",
        formula: "I am play<b>ing</b> · she is play<b>ing</b><small>am / is / are + …ing</small>",
        signal: signal(["now", "Look!", "at the moment"]),
        examples: [{ en: "I am walking to school now.", ru: "Я иду в школу сейчас.", track: "continuous-example" }],
      },
    ],
    button: "Попробовать!",
  },

  stages: [
    {
      id: "choice",
      kind: "choice",
      kicker: "🎯 Быстрый выбор",
      title: "Что подходит?",
      trail: "Практика",
      bubble: {
        en: "Spot the clue, then choose the form that sounds right.",
        ru: "Найди слово-подсказку и выбери, как правильно сказать.",
      },
      track: "choice-instruction",
      wrongBubble: "Почти! Слово «{clue}» подскажет ответ: так бывает обычно или прямо сейчас?",
      points: 10,
      showClue: true,
      items: [
        {
          text: "Varya usually ___ her homework after school.",
          ru: "Варя обычно делает уроки после школы.",
          clue: "usually",
          options: ["does", "is doing"],
          answer: "does",
          tip: "«Usually» значит «обычно». Действие повторяется, значит Present Simple: does.",
          track: "choice-1",
        },
        {
          text: "Look! Vincent ___ after a butterfly.",
          ru: "Смотри! Винни бежит за бабочкой.",
          clue: "Look!",
          options: ["runs", "is running"],
          answer: "is running",
          tip: "«Look!» значит «Смотри!». Действие происходит прямо сейчас, значит Present Continuous: is running.",
          track: "choice-2",
        },
        {
          text: "My dad ___ tea every morning.",
          ru: "Мой папа пьёт чай каждое утро.",
          clue: "every morning",
          options: ["drinks", "is drinking"],
          answer: "drinks",
          tip: "«Every morning» значит «каждое утро». Действие повторяется, значит Present Simple: drinks.",
          track: "choice-3",
        },
        {
          text: "Listen! The baby ___ right now.",
          ru: "Слушай! Малыш плачет прямо сейчас.",
          clue: "right now",
          options: ["cries", "is crying"],
          answer: "is crying",
          tip: "«Right now» значит «прямо сейчас». Действие происходит сейчас, значит Present Continuous: is crying.",
          track: "choice-4",
        },
      ],
    },
    {
      id: "sort",
      kind: "sort",
      kicker: "🧺 Сортировка подсказок",
      title: "В какой домик отправить подсказку?",
      trail: "Практика",
      bubble: {
        en: "Sort the clues. Tap a card, then send it to its tense.",
        ru: "Рассортируй слова-подсказки. Нажми на карточку, затем на правильный домик.",
      },
      track: "sort-instruction",
      points: 10,
      zones: [
        { id: "simple", title: "🔁 Present Simple", sub: "обычно, всегда" },
        { id: "continuous", title: "⚡ Present Continuous", sub: "прямо сейчас" },
      ],
      cards: [
        { label: "every Saturday", sub: t["every Saturday"], zone: "simple" },
        { label: "right now", sub: t["right now"], zone: "continuous" },
        { label: "usually", sub: t.usually, zone: "simple" },
        { label: "at the moment", sub: t["at the moment"], zone: "continuous" },
        { label: "often", sub: t.often, zone: "simple" },
        { label: "Look!", sub: t["Look!"], zone: "continuous" },
      ],
      wrongTip: "Подумай: так бывает обычно или это происходит прямо сейчас?",
    },
    {
      id: "final",
      kind: "choice",
      kicker: "🏁 Финальное испытание",
      title: "Собери идеальную серию",
      trail: "Финал",
      bubble: {
        en: "Final round! Every answer is worth fifteen points. Let's go!",
        ru: "Финал! За каждый ответ здесь ты получишь целых 15 звёздных баллов.",
      },
      track: "final-intro",
      wrongBubble: "Почти! Слово «{clue}» подскажет ответ: так бывает обычно или прямо сейчас?",
      points: 15,
      showClue: false,
      items: [
        {
          text: "I ___ my teeth every day.",
          ru: "Я чищу зубы каждый день.",
          clue: "every day",
          options: ["brush", "am brushing"],
          answer: "brush",
          tip: "Ещё попытка! «every day» значит «каждый день». Обычно или прямо сейчас?",
          track: "final-1",
        },
        {
          text: "Vincent ___ on the sofa now.",
          ru: "Винни спит на диване сейчас.",
          clue: "now",
          options: ["sleeps", "is sleeping"],
          answer: "is sleeping",
          tip: "Ещё попытка! «now» значит «сейчас». Обычно или прямо сейчас?",
          track: "final-2",
        },
        {
          text: "She usually ___ to school at eight.",
          ru: "Она обычно идёт в школу в восемь.",
          clue: "usually",
          options: ["goes", "is going"],
          answer: "goes",
          tip: "Ещё попытка! «usually» значит «обычно». Обычно или прямо сейчас?",
          track: "final-3",
        },
        {
          text: "We ___ English at the moment.",
          ru: "Мы учим английский в эту минуту.",
          clue: "at the moment",
          options: ["learn", "are learning"],
          answer: "are learning",
          tip: "Ещё попытка! «at the moment» значит «в эту минуту». Обычно или прямо сейчас?",
          track: "final-4",
        },
        {
          text: "They ___ football on Sundays.",
          ru: "Они играют в футбол по воскресеньям.",
          clue: "on Sundays",
          options: ["play", "are playing"],
          answer: "play",
          tip: "Ещё попытка! «on Sundays» значит «по воскресеньям». Обычно или прямо сейчас?",
          track: "final-5",
        },
        {
          text: "Listen! Mum ___ on the phone.",
          ru: "Слушай! Мама говорит по телефону.",
          clue: "Listen!",
          options: ["talks", "is talking"],
          answer: "is talking",
          tip: "Ещё попытка! «Listen!» значит «Слушай!». Обычно или прямо сейчас?",
          track: "final-6",
        },
      ],
    },
  ],

  complete: {
    bubble: {
      en: "Amazing work! You've tamed Present Simple and Present Continuous. High paw!",
      ru: "Отличная работа, {name}! Present Simple и Present Continuous приручены. Дай лапу!",
    },
    track: "vincent-complete",
    heading: "Времена приручены!",
    lead: "Запомни главное: обычное, повторяющееся действие — Present Simple, действие прямо сейчас — Present Continuous.",
    chips: ["🔁 обычно", "⚡ прямо сейчас", "🏆 новая медаль"],
  },
};
