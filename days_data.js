/**
 * Data store for future multi-day scaling
 */
const DAYS_METADATA = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'מה הם "חיים"?',
    date: '3.9.2026 • כ״א אלול תשפ״ו',
    source: 'שמעתי קכ"ב — "להבין מה שמבואר בשולחן ערוך"',
    sourceUrl: 'https://kabbalah.academy/he/library/sources/articles/386/',
    isAvailable: true
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: '„אני לדודי” — מה אני מביא אל הקשר?',
    date: '4.9.2026 • כ״ב אלול תשפ״ו',
    source: 'שמעתי מ״ב — "מהו, שראשי תיבות אלול ‘אני לדודי ודודי לי’ מרמזת בעבודה"',
    sourceUrl: 'https://kabbalahmedia.info/he/sources/cDko5YMK',
    isAvailable: true
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'לבנות חיסרון אמיתי',
    date: '5.9.2026 • כ״ג אלול תשפ״ו',
    source: 'שמעתי קי״ז — "יגעת ולא מצאת אל תאמין"',
    sourceUrl: 'https://kabbalah.academy/he/library/sources/articles/381/',
    isAvailable: true
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'לברר איזה חיסרון צריך להיות היסוד',
    date: '6.9.2026 • כ״ד אלול תשפ״ו',
    source: 'שמעתי רי״ג — "עניין גילוי החיסרון"',
    sourceUrl: 'https://kabbalahmedia.info/he/sources/QpHrSYsP',
    isAvailable: true
  },
  {
    id: 'day-5',
    dayNumber: 5,
    title: 'לא להשאיר את המקום ריק',
    date: '7.9.2026 • כ״ה אלול תשפ״ו',
    source: 'שמעתי רכ״א — "רשות הכל"',
    sourceUrl: 'https://kabbalahmedia.info/he/sources/1Grgyqyp',
    isAvailable: true
  },
  {
    id: 'day-6',
    dayNumber: 6,
    title: 'לא לברוח מן הדחייה',
    date: '8.9.2026 • כ״ו אלול תשפ״ו',
    source: 'שמעתי א׳ — "אין עוד מלבדו"',
    sourceUrl: 'https://kabbalahmedia.info/he/sources/H8QG6GzN',
    isAvailable: true
  },
  {
    id: 'day-7',
    dayNumber: 7,
    title: 'להחזיק את המטה',
    date: '9.9.2026 • כ״ז אלול תשפ״ו',
    source: 'שמעתי נ״ט — "עניין מטה ונחש"',
    sourceUrl: 'https://kabbalahmedia.info/he/sources/8jddbZDS',
    isAvailable: true
  },
  {
    id: 'day-8',
    dayNumber: 8,
    title: 'מה אני באמת רוצה להיות?',
    date: '10.9.2026 • כ״ח אלול תשפ״ו',
    source: 'שמעתי מ״ב — "מהו, שראשי תיבות אלול ‘אני לדודי ודודי לי’ מרמזת בעבודה"',
    sourceUrl: 'https://kabbalahmedia.info/he/sources/cDko5YMK',
    isAvailable: true
  },
  {
    id: 'day-9',
    dayNumber: 9,
    title: 'באיזה ספר אני מבקש להיכתב?',
    date: '11.9.2026 • כ״ט אלול תשפ״ו',
    source: 'שמעתי מ״ב — "מהו, שראשי תיבות אלול ‘אני לדודי ודודי לי’ מרמזת בעבודה"',
    sourceUrl: 'https://kabbalahmedia.info/he/sources/cDko5YMK',
    isAvailable: true
  }
];

