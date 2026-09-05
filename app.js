/**
 * Application Logic: Navigation, Local Storage Autosave, Theme Toggle, Font Scaling, Journal Exporter
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFontSize();
  initNavigation();
  initAutosave();
  initJournalModal();
});

// --------------------------------------------------------------------------
// Navigation (Intro & Days Tabs)
// --------------------------------------------------------------------------
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-item[data-target]');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        switchTab(targetId);
      }
    });
  });

  // Check URL hash (e.g., #day-1 or #intro-view)
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    switchTab(hash);
  } else {
    switchTab('intro-view');
  }
}

function switchTab(targetId) {
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-target') === targetId) {
      item.classList.add('active');
    }
  });

  // Update content viewport
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// --------------------------------------------------------------------------
// Autosave Inputs to LocalStorage
// --------------------------------------------------------------------------
const INPUT_FIELDS = [
  // Day 1
  { id: 'stepA-input', statusId: 'stepA-status' },
  { id: 'stepB-input', statusId: 'stepB-status' },
  { id: 'night-q1', statusId: 'night-status' },
  { id: 'night-q2', statusId: 'night-status' },
  { id: 'night-q3', statusId: 'night-status' },
  { id: 'desire-1', statusId: 'desires-status' },
  { id: 'desire-2', statusId: 'desires-status' },
  { id: 'desire-3', statusId: 'desires-status' },
  { id: 'desire-4', statusId: 'desires-status' },
  { id: 'desire-5', statusId: 'desires-status' },

  // Day 2
  { id: 'day2_stepA-input', statusId: 'day2_stepA-status' },
  { id: 'day2_stepB-input', statusId: 'day2_stepB-status' },
  { id: 'day2_stepC-input', statusId: 'day2_stepC-status' },
  { id: 'day2_deep_question', statusId: 'day2_deep-status' },
  { id: 'day2_night_q1', statusId: 'day2_night-status' },
  { id: 'day2_night_q2', statusId: 'day2_night-status' },
  { id: 'day2_night_q3', statusId: 'day2_night-status' },

  // Day 3
  { id: 'day3_stepA-input', statusId: 'day3_stepA-status' },
  { id: 'day3_stepB-input', statusId: 'day3_stepB-status' },
  { id: 'day3_stepC-input', statusId: 'day3_stepC-status' },
  { id: 'day3_deep_question', statusId: 'day3_deep-status' },
  { id: 'day3_night_q1', statusId: 'day3_night-status' },
  { id: 'day3_night_q2', statusId: 'day3_night-status' },
  { id: 'day3_night_q3', statusId: 'day3_night-status' }
];

function initAutosave() {
  INPUT_FIELDS.forEach(field => {
    const el = document.getElementById(field.id);
    if (!el) return;

    // Load saved value
    const savedVal = localStorage.getItem(`rh_prep_${field.id}`);
    if (savedVal !== null) {
      el.value = savedVal;
    }

    // Attach input event with debounce
    let timeout;
    el.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.setItem(`rh_prep_${field.id}`, el.value);
        showSaveStatus(field.statusId);
      }, 500);
    });
  });
}

function showSaveStatus(statusId) {
  const statusEl = document.getElementById(statusId);
  if (!statusEl) return;
  statusEl.classList.add('visible');
  setTimeout(() => {
    statusEl.classList.remove('visible');
  }, 2200);
}

// --------------------------------------------------------------------------
// Theme Toggle (Warm / Dark / Light)
// --------------------------------------------------------------------------
const THEME_NAMES = {
  'theme-warm': 'מצב לימוד חם (קלף)',
  'theme-dark': 'מצב לילה',
  'theme-light': 'מצב יום בהיר'
};

function initTheme() {
  const themeButtons = document.querySelectorAll('.theme-seg-btn');
  let currentTheme = localStorage.getItem('rh_prep_theme') || 'theme-warm';
  
  applyTheme(currentTheme, false);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme');
      if (selectedTheme) {
        applyTheme(selectedTheme, true);
      }
    });
  });
}

function applyTheme(theme, notify = true) {
  document.body.className = theme;
  localStorage.setItem('rh_prep_theme', theme);

  // Update active state in segmented buttons
  document.querySelectorAll('.theme-seg-btn').forEach(btn => {
    if (btn.getAttribute('data-theme') === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (notify) {
    showToast(`עברת ל-${THEME_NAMES[theme] || theme}`);
  }
}

// --------------------------------------------------------------------------
// Font Size Adjuster
// --------------------------------------------------------------------------
let currentFontSize = 17;

function initFontSize() {
  const savedSize = localStorage.getItem('rh_prep_font_size');
  if (savedSize) {
    currentFontSize = parseInt(savedSize, 10);
    document.documentElement.style.setProperty('--font-base-size', `${currentFontSize}px`);
  }

  const decBtn = document.getElementById('btn-font-dec');
  const incBtn = document.getElementById('btn-font-inc');

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      if (currentFontSize > 14) {
        currentFontSize -= 1;
        applyFontSize();
      }
    });
  }

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      if (currentFontSize < 24) {
        currentFontSize += 1;
        applyFontSize();
      }
    });
  }
}

function applyFontSize() {
  document.documentElement.style.setProperty('--font-base-size', `${currentFontSize}px`);
  localStorage.setItem('rh_prep_font_size', currentFontSize);
}

// --------------------------------------------------------------------------
// Journal Modal & Export
// --------------------------------------------------------------------------
function initJournalModal() {
  const openBtn = document.getElementById('btn-export-journal');
  const modal = document.getElementById('journal-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      renderJournalContent();
      modal.classList.add('open');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }
}

function getActiveDayId() {
  const activeSection = document.querySelector('.content-section.active');
  if (activeSection) {
    if (activeSection.id === 'day-3') return 'day-3';
    if (activeSection.id === 'day-2') return 'day-2';
  }
  return 'day-1';
}

function openJournalModal(dayId) {
  const targetDay = dayId || getActiveDayId();
  const modal = document.getElementById('journal-modal');
  if (modal) {
    renderJournalContent(targetDay);
    modal.classList.add('open');
  }
}

function renderJournalContent(dayId) {
  const contentEl = document.getElementById('modal-journal-content');
  if (!contentEl) return;

  const targetDay = dayId || getActiveDayId();
  const getVal = (id) => localStorage.getItem(`rh_prep_${id}`) || '(טרם נרשמה תשובה)';

  const modalHeaderTitle = document.querySelector('.modal-header h3');
  if (modalHeaderTitle) {
    if (targetDay === 'day-3') {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 3';
    } else if (targetDay === 'day-2') {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 2';
    } else {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 1';
    }
  }

  if (targetDay === 'day-3') {
    contentEl.innerHTML = `
      <div class="journal-summary">
        <h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--accent-gold); margin-bottom: 0.5rem;">
          סיכום יום 3: לבנות חיסרון אמיתי (שמעתי קי״ז)
        </h4>
        
        <div style="margin-top: 1.25rem;">
          <strong>שלב א' — בירור פנימי: מדידת הצמא (בקשה אחת בלבד):</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day3_stepA-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ב' — התרגול המעשי: זיהוי החיסרון הקיים ובניית חיסרון נוסף מעליו:</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day3_stepB-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ג' — התבוננות במהלך היום ("מה שכבר מנהל אותי" מול "מה שהייתי רוצה שינהל אותי"):</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day3_stepC-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שאלת העומק של יום 3: כמה חסרה לי הדבקות ב'חיי החיים' מול הדברים הגשמיים?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day3_deep_question')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>סגירת ערב — שלוש שורות לפני השינה:</strong>
          <ul style="list-style: none; padding: 0; margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0.3rem;">
            <li><strong>א. היום גיליתי שהדבר שהכי חסר לי בפועל הוא:</strong> ${getVal('day3_night_q1')}</li>
            <li><strong>ב. החיסרון הנוסף שהייתי רוצה שייבנה בתוכי הוא:</strong> ${getVal('day3_night_q2')}</li>
            <li><strong>ג. הבקשה שלי מהבורא בנוגע לצמא הפנימי שלי:</strong> ${getVal('day3_night_q3')}</li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  if (targetDay === 'day-2') {
    contentEl.innerHTML = `
      <div class="journal-summary">
        <h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--accent-gold); margin-bottom: 0.5rem;">
          סיכום יום 2: „אני לדודי” — מה אני מביא אל הקשר? (שמעתי מ״ב)
        </h4>
        
        <div style="margin-top: 1.25rem;">
          <strong>שלב א' — בירור פנימי: מה מתוך ה"אני" שלי אני מוכן לתת?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day2_stepA-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ב' — התרגול המעשי: פעולה שלא תסתיים רק בי:</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day2_stepB-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ג' — התבוננות לאורך היום ("מה הייתי רוצה כאן אם 'אני לדודי' היה קודם?"):</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day2_stepC-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שאלת העומק של יום 2: האם הייתי רוצה להיות 'לדודי' גם ללא שום אור, קרבה או שכר?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day2_deep_question')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>סגירת ערב — שלוש שורות לפני השינה:</strong>
          <ul style="list-style: none; padding: 0; margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0.3rem;">
            <li><strong>א. היום גיליתי שה"אני" שלי נאחז במיוחד ב־:</strong> ${getVal('day2_night_q1')}</li>
            <li><strong>ב. היה רגע אחד שבו הצלחתי לחשוב גם מחוץ לעצמי כש־:</strong> ${getVal('day2_night_q2')}</li>
            <li><strong>ג. אם "אני לדודי" הוא עבודה אמיתית, הייתי רוצה שהבורא יעזור לי:</strong> ${getVal('day2_night_q3')}</li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  // Default: Day 1
  contentEl.innerHTML = `
    <div class="journal-summary">
      <h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--accent-gold); margin-bottom: 0.5rem;">
        סיכום יום 1: מה הם "חיים"? (שמעתי קכ"ב)
      </h4>
      
      <div style="margin-top: 1.25rem;">
        <strong>שלב א' — רשימת הרצונות הגולמיים לשנה המושלמת:</strong>
        <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('stepA-input')}</p>
      </div>

      <div style="margin-top: 1.25rem;">
        <strong>שלב ב' — בירור שורש הרצונות ("בשביל מה?"):</strong>
        <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('stepB-input')}</p>
      </div>

      <div style="margin-top: 1.25rem;">
        <strong>שלוש שורות לפני השינה:</strong>
        <ul style="list-style: none; padding: 0; margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0.3rem;">
          <li><strong>א. היום גיליתי שאני באמת רוצה:</strong> ${getVal('night-q1')}</li>
          <li><strong>ב. מתחת לרצון זה מסתתר:</strong> ${getVal('night-q2')}</li>
          <li><strong>ג. הבקשה שלי מהבורא באמת:</strong> ${getVal('night-q3')}</li>
        </ul>
      </div>

      <div style="margin-top: 1.25rem;">
        <strong>חמשת הרצונות האמיתיים לשנה הקרובה (החברותא):</strong>
        <ol style="padding-right: 1.25rem; margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0.3rem;">
          <li>${getVal('desire-1')}</li>
          <li>${getVal('desire-2')}</li>
          <li>${getVal('desire-3')}</li>
          <li>${getVal('desire-4')}</li>
          <li>${getVal('desire-5')}</li>
        </ol>
      </div>
    </div>
  `;
}

function generateFormattedJournalText(dayId) {
  const targetDay = dayId || getActiveDayId();
  const getVal = (id) => localStorage.getItem(`rh_prep_${id}`) || '(לא נרשמה תשובה)';
  const dateStr = new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'numeric', day: 'numeric' });

  if (targetDay === 'day-3') {
    return `=====================================================
הכנת הכלי לראש השנה — יומן עבודה אישי
יום 3: לבנות חיסרון אמיתי (בעל הסולם — שמעתי קי״ז)
תאריך שמירה: ${dateStr}
=====================================================

【 שלב א' — בירור פנימי: מדידת הצמא (בקשה אחת בלבד) 】
שאלה: "אם הייתי יכול לבקש היום מהבורא דבר אחד בלבד — מה באמת הייתי מבקש? ולמה דווקא זה?"
תשובתך:
${getVal('day3_stepA-input')}

-----------------------------------------------------
【 שלב ב' — התרגול המעשי: לזהות את החיסרון הקיים ולבנות מעליו חיסרון נוסף 】
שאלה: מה היה החיסרון הקיים, ואיזה חיסרון נוסף גילית שאתה רוצה שייבנה מעליו?
תשובתך:
${getVal('day3_stepB-input')}

-----------------------------------------------------
【 שלב ג' — התבוננות במהלך היום 】
שאלה: "1. זה חסר לי עכשיו. 2. ומה הייתי רוצה שיחסר לי יותר?"
תשובתך:
${getVal('day3_stepC-input')}

-----------------------------------------------------
【 שאלת העומק של יום 3 】
שאלה: "כמה בכלל חסרה לי הדבקות ב'חיי החיים' — מול הדברים הגשמיים שמטרידים אותי ביומיום?"
תשובתך:
${getVal('day3_deep_question')}

-----------------------------------------------------
【 סגירת ערב — שלוש שורות לפני השינה 】
א. היום גיליתי שהדבר שהכי חסר לי בפועל הוא:
   ${getVal('day3_night_q1')}

ב. החיסרון הנוסף שהייתי רוצה שייבנה בתוכי הוא:
   ${getVal('day3_night_q2')}

ג. הבקשה שלי מהבורא בנוגע לצמא הפנימי שלי:
   ${getVal('day3_night_q3')}

=====================================================
"אין האדם מרגיש שום חשיבות באיזה דבר, אם לא היה לו צורך להדבר."
— בעל הסולם, שמעתי קי״ז
=====================================================`;
  }

  if (targetDay === 'day-2') {
    return `=====================================================
הכנת הכלי לראש השנה — יומן עבודה אישי
יום 2: „אני לדודי” — מה אני מביא אל הקשר? (בעל הסולם — שמעתי מ״ב)
תאריך שמירה: ${dateStr}
=====================================================

【 שלב א' — בירור פנימי: מה מתוך ה"אני" שלי אני מוכן לתת? 】
שאלה: "אם הבורא לא ישנה היום שום דבר בחיים החיצוניים שלי — מה מתוך ה'אני' שלי אני בכל זאת מוכן לתת לו?"
תשובתך:
${getVal('day2_stepA-input')}

-----------------------------------------------------
【 שלב ב' — התרגול המעשי: פעולה שלא תסתיים רק בי 】
שאלה: איזו פעולה בחרת ומה גילית כשניסית לכוון אותה החוצה?
תשובתך:
${getVal('day2_stepB-input')}

-----------------------------------------------------
【 שלב ג' — התבוננות לאורך היום 】
שאלה: "מה הייתי רוצה כאן אם 'אני לדודי' היה קודם ל'ודודי לי'?"
תשובתך:
${getVal('day2_stepC-input')}

-----------------------------------------------------
【 שאלת העומק של יום 2 】
שאלה: "אם הבורא לא היה נותן לי שום הרגשת אור, קרבה, הצלחה או שכר — האם עדיין הייתי רוצה להיות 'לדודי'?"
תשובתך:
${getVal('day2_deep_question')}

-----------------------------------------------------
【 סגירת ערב — שלוש שורות לפני השינה 】
א. היום גיליתי שה"אני" שלי נאחז במיוחד ב־:
   ${getVal('day2_night_q1')}

ב. היה רגע אחד שבו הצלחתי לחשוב גם מחוץ לעצמי כש־:
   ${getVal('day2_night_q2')}

ג. אם "אני לדודי" הוא עבודה אמיתית, הייתי רוצה שהבורא יעזור לי:
   ${getVal('day2_night_q3')}

=====================================================
"בזה שה־אני מבטל את הרצון לקבל שלי לה', בבחינת כולו להשפיע, אז הוא זוכה ‘ודודי לי’."
— בעל הסולם, שמעתי מ״ב
=====================================================`;
  }

  // Day 1
  return `=====================================================
הכנת הכלי לראש השנה — יומן עבודה אישי
יום 1: מה הם "חיים"? (בעל הסולם — שמעתי קכ"ב)
תאריך שמירה: ${dateStr}
=====================================================

【 שלב א' — רשימת הרצונות הגולמיים לשנה המושלמת 】
שאלה: "אם הייתי יכול להזמין היום את השנה המושלמת עבורי — מה הייתי מבקש?" (ללא שיפוט וללא תיקון)
תשובתך:
${getVal('stepA-input')}

-----------------------------------------------------
【 שלב ב' — בירור שורש הרצונות ("בשביל מה?") 】
שאלה: מה המניע והשורש העמוק יותר מאחורי הרצונות שביקשת?
תשובתך:
${getVal('stepB-input')}

-----------------------------------------------------
【 שלב ג' — שאלת בעל הסולם 】
שאלה: "אם בעל הסולם אומר ש'חיים' הם דבקות בחיי החיים — האם אני באמת רוצה את החיים האלה?"
(בירור כנות הלב מול הבורא)

-----------------------------------------------------
【 סעיף 5 — התבוננות לאורך היום 】
1. "מי אמור ליהנות עכשיו?"
2. "האם יש דרך שבה אותו רצון עצמו יכול לשרת גם משהו מחוץ לי?"

-----------------------------------------------------
【 סעיף 6 — פעולת השפעה נסתרת 】
פעולה אחת טובה בלי שאף אחד יידע, מתוך שמחה בעצם העובדה שהזולת קיבל.

-----------------------------------------------------
【 סעיף 7 — שלוש שורות לפני השינה 】
א. היום גיליתי שאני באמת רוצה:
   ${getVal('night-q1')}

ב. גיליתי שמתחת לרצון הזה מסתתר:
   ${getVal('night-q2')}

ג. אילו הייתי מבקש היום "כתבנו לחיים" באמת, הייתי רוצה שהבורא יעזור לי:
   ${getVal('night-q3')}

-----------------------------------------------------
【 החברותא — חמשת הרצונות האמיתיים לשנה הקרובה 】
שאלה: כשאתה אומר לעצמך: "אני רוצה שנה טובה" — מהם חמשת הדברים שאתה באמת, באמת רוצה שיקרו לך?

1. ${getVal('desire-1')}
2. ${getVal('desire-2')}
3. ${getVal('desire-3')}
4. ${getVal('desire-4')}
5. ${getVal('desire-5')}

=====================================================
"תפילה צריך להיות בלב, שהלב יסכים למה שהאדם מדבר בפה."
— בעל הסולם, שמעתי קכ"ב
=====================================================`;
}

function downloadJournalAsText(dayId) {
  const targetDay = dayId || getActiveDayId();
  const content = generateFormattedJournalText(targetDay);
  const dateSuffix = new Date().toISOString().slice(0, 10);
  let dayNum = '1';
  if (targetDay === 'day-2') dayNum = '2';
  if (targetDay === 'day-3') dayNum = '3';
  const filename = `הכנת_הכלי_יום_${dayNum}_תשובות_${dateSuffix}.txt`;

  // Create a Blob with UTF-8 BOM so Hebrew characters open properly in Windows Notepad
  const blob = new Blob(["\uFEFF" + content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`הקובץ עם תשובות יום ${dayNum} הורד בהצלחה! 📥`);
}

function copyJournalToClipboard(dayId) {
  const targetDay = dayId || getActiveDayId();
  const text = generateFormattedJournalText(targetDay);

  navigator.clipboard.writeText(text).then(() => {
    showToast('כל השאלות והתשובות הועתקו ללוח בהצלחה! 📋');
  }).catch(() => {
    showToast('שגיאה בהעתקה ללוח');
  });
}

function printJournal() {
  window.print();
}

// --------------------------------------------------------------------------
// Deep Dive Toggle (הסבר מעמיק של המשפט)
// --------------------------------------------------------------------------
function toggleDeepDive() {
  const panel = document.getElementById('deep-dive-panel');
  const btn = document.getElementById('deep-dive-btn');
  const arrow = document.getElementById('deep-dive-arrow');

  if (!panel) return;

  const isOpen = panel.classList.toggle('open');
  if (btn) {
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.classList.toggle('active', isOpen);
  }
  if (arrow) {
    arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  if (isOpen) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// --------------------------------------------------------------------------
// AI Chavruta Panel & Prompt Copy Logic (Day 1 & Day 2)
// --------------------------------------------------------------------------
function toggleAiChavruta() {
  const panel = document.getElementById('ai-chavruta-panel');
  const btn = document.getElementById('ai-chavruta-btn');
  const arrow = document.getElementById('ai-arrow-icon');

  if (!panel) return;

  const isOpen = panel.classList.toggle('open');
  if (btn) {
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.classList.toggle('active', isOpen);
  }
  if (arrow) {
    arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  if (isOpen) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function copyAiPrompt() {
  const promptEl = document.getElementById('ai-prompt-content');
  const copyBtn = document.getElementById('copy-prompt-btn');
  const copyText = document.getElementById('copy-prompt-text');
  const copyIcon = document.getElementById('copy-prompt-icon');

  if (!promptEl) return;
  const textToCopy = promptEl.textContent || promptEl.innerText;

  const handleSuccess = () => {
    if (copyBtn) copyBtn.classList.add('copied');
    if (copyText) copyText.textContent = 'הפרומפט הועתק ✓';
    if (copyIcon) {
      copyIcon.className = 'fa-solid fa-check';
    }
    showToast('הפרומפט ליום 1 הועתק ללוח בהצלחה! ✓');

    setTimeout(() => {
      if (copyBtn) copyBtn.classList.remove('copied');
      if (copyText) copyText.textContent = 'העתק את הפרומפט';
      if (copyIcon) {
        copyIcon.className = 'fa-regular fa-copy';
      }
    }, 3000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy)
      .then(handleSuccess)
      .catch(() => {
        fallbackCopyText(textToCopy, handleSuccess);
      });
  } else {
    fallbackCopyText(textToCopy, handleSuccess);
  }
}

function toggleAiChavrutaDay2() {
  const panel = document.getElementById('ai-chavruta-panel-day2');
  const btn = document.getElementById('ai-chavruta-btn-day2');
  const arrow = document.getElementById('ai-arrow-icon-day2');

  if (!panel) return;

  const isOpen = panel.classList.toggle('open');
  if (btn) {
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.classList.toggle('active', isOpen);
  }
  if (arrow) {
    arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  if (isOpen) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function copyAiPromptDay2() {
  const promptEl = document.getElementById('ai-prompt-content-day2');
  const copyBtn = document.getElementById('copy-prompt-btn-day2');
  const copyText = document.getElementById('copy-prompt-text-day2');
  const copyIcon = document.getElementById('copy-prompt-icon-day2');

  if (!promptEl) return;
  const textToCopy = promptEl.textContent || promptEl.innerText;

  const handleSuccess = () => {
    if (copyBtn) copyBtn.classList.add('copied');
    if (copyText) copyText.textContent = 'הפרומפט הועתק ✓';
    if (copyIcon) {
      copyIcon.className = 'fa-solid fa-check';
    }
    showToast('הפרומפט ליום 2 הועתק ללוח בהצלחה! ✓');

    setTimeout(() => {
      if (copyBtn) copyBtn.classList.remove('copied');
      if (copyText) copyText.textContent = 'העתק את הפרומפט';
      if (copyIcon) {
        copyIcon.className = 'fa-regular fa-copy';
      }
    }, 3000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy)
      .then(handleSuccess)
      .catch(() => {
        fallbackCopyText(textToCopy, handleSuccess);
      });
  } else {
    fallbackCopyText(textToCopy, handleSuccess);
  }
}

function toggleAiChavrutaDay3() {
  const panel = document.getElementById('ai-chavruta-panel-day3');
  const btn = document.getElementById('ai-chavruta-btn-day3');
  const arrow = document.getElementById('ai-arrow-icon-day3');

  if (!panel) return;

  const isOpen = panel.classList.toggle('open');
  if (btn) {
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.classList.toggle('active', isOpen);
  }
  if (arrow) {
    arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  if (isOpen) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function copyAiPromptDay3() {
  const promptEl = document.getElementById('ai-prompt-content-day3');
  const copyBtn = document.getElementById('copy-prompt-btn-day3');
  const copyText = document.getElementById('copy-prompt-text-day3');
  const copyIcon = document.getElementById('copy-prompt-icon-day3');

  if (!promptEl) return;
  const textToCopy = promptEl.textContent || promptEl.innerText;

  const handleSuccess = () => {
    if (copyBtn) copyBtn.classList.add('copied');
    if (copyText) copyText.textContent = 'הפרומפט הועתק ✓';
    if (copyIcon) {
      copyIcon.className = 'fa-solid fa-check';
    }
    showToast('הפרומפט ליום 3 הועתק ללוח בהצלחה! ✓');

    setTimeout(() => {
      if (copyBtn) copyBtn.classList.remove('copied');
      if (copyText) copyText.textContent = 'העתק את הפרומפט';
      if (copyIcon) {
        copyIcon.className = 'fa-regular fa-copy';
      }
    }, 3000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy)
      .then(handleSuccess)
      .catch(() => {
        fallbackCopyText(textToCopy, handleSuccess);
      });
  } else {
    fallbackCopyText(textToCopy, handleSuccess);
  }
}

function fallbackCopyText(text, onSuccess) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful && onSuccess) {
      onSuccess();
    } else {
      showToast('אנא סמן את הטקסט והעתק ידנית (Ctrl+C)');
    }
  } catch (err) {
    showToast('אנא סמן את הטקסט והעתק ידנית (Ctrl+C)');
  }
}

// --------------------------------------------------------------------------
// Toast Notification
// --------------------------------------------------------------------------
function showToast(msg) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

