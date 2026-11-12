// Детальная статистика. Источник: скриншоты личной аналитики платформ.
// derived: true означает, что число рассчитано (разность итогов), в интерфейсе показывать со знаком «≈».
// Ссылки на соцсети здесь намеренно отсутствуют.
var STATS_DATE = "2026-11-11";

var STATS_DETAIL = {
  youtube: [
    {
      name: "Eleganthy", since: "2021-12-04", subs: 4186, views: 862025,
      split: { video: 107843, shorts: 692163, streams: { value: 62019, derived: true } },
      topVideos: [32400, 5300, 2600, 2500, 2300],
      topShorts: [19800, 15900, 14600, 12800],
      topStreams: [1100, 758, 693, 672, 546],
      concurrent: { max: 30, avg: 3, note: "Средний онлайн считается с 1 сентября 2022" }
    },
    {
      name: "Eleganty", since: "2021-04-21", subs: 765, views: 81091,
      split: { video: 54091, shorts: 15508, streams: 11384 },
      topVideos: [4300, 4100, 3900, 2800, 2500],
      topShorts: [6200, 5500, 894, 729],
      topStreams: [951, 803, 799, 763, 750],
      concurrent: { max: 18, avg: 3 }
    },
    {
      name: "Young Chef", since: "2024-04-28", subs: 193, views: 423293,
      split: { video: { value: 15244, derived: true }, shorts: 408045, streams: 4 },
      topShorts: [62100, 48700, 40700, 32600],
      concurrent: { max: 3, avg: 1 },
      note: "Стрим «Празднуем 100 подписчиков»"
    },
    {
      name: "EleganthyFIFA", since: "2025-07-30", subs: 128, views: 47325,
      split: { video: 38303, shorts: 8654, streams: 363 },
      topVideos: [9000, 6500, 3500, 3400, 3200],
      topShorts: [2700, 2400, 1800, 1500],
      topStreams: [84, 53, 53, 35, 31],
      concurrent: { max: 10, avg: 4 }
    }
  ],

  tiktok: {
    name: "Сережа Элеганти", subs: 2603, following: 191, likes: 194500,
    year: { period: "11.11.2025 – 10.11.2026", views: 243300, profileViews: 2400, likes: 7300, reposts: 616 },
    topVideos: [384400, 225700, 215000]
  },

  twitch: [
    {
      name: "sa1n1o", followers: 788,
      streams: [
        { date: "2026-10-26", duration: "0:42", avgViewers: 22, peakViewers: 33, unique: 432, chatters: 40, views: 552, newFollowers: 12 },
        { date: "2026-10-20", duration: "2:22", avgViewers: 10, peakViewers: 48, unique: 416, chatters: 21, views: 536, newFollowers: 2 },
        { date: "2026-09-08", duration: "2:23", avgViewers: 5, peakViewers: 12, unique: 37, chatters: 14, views: 111, newFollowers: 2 }
      ]
    },
    {
      name: "saintique898", followers: 153,
      streams: [
        { date: "2026-10-26", duration: "3:18", avgViewers: 113, peakViewers: 698, unique: 4093, chatters: 302, views: 8157, newFollowers: null,
          note: "в аналитике 171 фолловер, в профиле 153: уточнить" }
      ]
    }
  ]
};
