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
  { id: 'day3_night_q3', statusId: 'day3_night-status' },

  // Day 4
  { id: 'day4_stepA-input', statusId: 'day4_stepA-status' },
  { id: 'day4_stepB_moments', statusId: 'day4_stepB-status' },
  { id: 'day4_stepC-input', statusId: 'day4_stepC-status' },
  { id: 'day4_deep_question', statusId: 'day4_deep-status' },
  { id: 'day4_night_q1', statusId: 'day4_night-status' },
  { id: 'day4_night_q2', statusId: 'day4_night-status' },
  { id: 'day4_night_q3', statusId: 'day4_night-status' },

  // Day 5
  { id: 'day5_stepA-input', statusId: 'day5_stepA-status' },
  { id: 'day5_stepB-input', statusId: 'day5_stepB-status' },
  { id: 'day5_stepC-input', statusId: 'day5_stepC-status' },
  { id: 'day5_deep_question', statusId: 'day5_deep-status' },
  { id: 'day5_night_q1', statusId: 'day5_night-status' },
  { id: 'day5_night_q2', statusId: 'day5_night-status' },
  { id: 'day5_night_q3', statusId: 'day5_night-status' },

  // Day 6
  { id: 'day6_stepA-input', statusId: 'day6_stepA-status' },
  { id: 'day6_stepB-input', statusId: 'day6_stepB-status' },
  { id: 'day6_stepC-input', statusId: 'day6_stepC-status' },
  { id: 'day6_stepD-input', statusId: 'day6_stepD-status' },
  { id: 'day6_checkpoint-input', statusId: 'day6_checkpoint-status' },
  { id: 'day6_deep_question', statusId: 'day6_deep-status' },
  { id: 'day6_night_q1', statusId: 'day6_night-status' },
  { id: 'day6_night_q2', statusId: 'day6_night-status' },
  { id: 'day6_night_q3', statusId: 'day6_night-status' }
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
    if (activeSection.id === 'day-6') return 'day-6';
    if (activeSection.id === 'day-5') return 'day-5';
    if (activeSection.id === 'day-4') return 'day-4';
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
    if (targetDay === 'day-6') {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 6';
    } else if (targetDay === 'day-5') {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 5';
    } else if (targetDay === 'day-4') {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 4';
    } else if (targetDay === 'day-3') {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 3';
    } else if (targetDay === 'day-2') {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 2';
    } else {
      modalHeaderTitle.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> סיכום השאלות והתשובות שלך — יום 1';
    }
  }

  if (targetDay === 'day-6') {
    contentEl.innerHTML = `
      <div class="journal-summary">
        <h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--accent-gold); margin-bottom: 0.5rem;">
          סיכום יום 6: לא לברוח מן הדחייה (שמעתי א׳)
        </h4>
        
        <div style="margin-top: 1.25rem;">
          <strong>שלב א' — בירור פנימי: מה בחיים שלי מרגיש כרגע כמו דחייה, תקיעות או חוסר ודאות?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day6_stepA-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ב' — אל תדלג על החיסרון הראשון: אם המצב היה מסתדר בדיוק כפי שאני רוצה — מה הייתי רוצה שיקרה בפועל?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day6_stepB-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ג' — לרדת שכבה אחת מתחת לתוצאה: מעבר לכך שאני רוצה שהמצב יסתדר — איזה חיסרון המצב הזה מגלה בי?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day6_stepC-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ד' — התרגול המעשי של היום (רגע אחד של דחייה): מה קרה, מה גיליתי, ומה ביקשתי?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day6_stepD-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>התבוננות במהלך היום (Daily Checkpoint):</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day6_checkpoint-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שאלת העומק של יום 6: כאשר דבר אינו מסתדר — האם אני מסוגל לראות איזה חיסרון עמוק יותר הדחייה מגלה בי?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day6_deep_question')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>סגירת ערב — שלוש שורות לפני השינה:</strong>
          <ul style="list-style: none; padding: 0; margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0.3rem;">
            <li><strong>א. הדחייה / חוסר הוודאות שבחרתי היום הייתה:</strong> ${getVal('day6_night_q1')}</li>
            <li><strong>ב. מתחת לרצון שהמצב יסתדר, גיליתי שחסר לי גם:</strong> ${getVal('day6_night_q2')}</li>
            <li><strong>ג. הבקשה הכנה שלי מהבורא בעקבות מה שגיליתי היא:</strong> ${getVal('day6_night_q3')}</li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  if (targetDay === 'day-5') {
    contentEl.innerHTML = `
      <div class="journal-summary">
        <h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--accent-gold); margin-bottom: 0.5rem;">
          סיכום יום 5: לא להשאיר את המקום ריק (שמעתי רכ״א)
        </h4>
        
        <div style="margin-top: 1.25rem;">
          <strong>שלב א' — בירור פנימי: אם הייתי מפסיק לעסוק ב"מה אני אקבל מזה" — במה הייתי רוצה שהמקום יתמלא:</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day5_stepA-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ב' — התרגול המעשי: פעולה אחת של נתינה שאין לה רווח ישיר:</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day5_stepB-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ג' — התבוננות במהלך היום (Daily Checkpoint):</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day5_stepC-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שאלת העומק של יום 5: באיזה תחום אני מוכן להכניס נתינה ואהבה ממשית שתמלא את המקום?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day5_deep_question')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>סגירת ערב — שלוש שורות לפני השינה:</strong>
          <ul style="list-style: none; padding: 0; margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0.3rem;">
            <li><strong>א. היום זיהיתי מקום שבו ה"אני" תפס הרבה שטח:</strong> ${getVal('day5_night_q1')}</li>
            <li><strong>ב. הפעולה או המחשבה שבה ניסיתי למלא את המקום הזה בנתינה:</strong> ${getVal('day5_night_q2')}</li>
            <li><strong>ג. הבקשה שלי מהבורא ביחס למקום הזה היא:</strong> ${getVal('day5_night_q3')}</li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  if (targetDay === 'day-4') {
    contentEl.innerHTML = `
      <div class="journal-summary">
        <h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--accent-gold); margin-bottom: 0.5rem;">
          סיכום יום 4: לברר איזה חיסרון צריך להיות היסוד (שמעתי רי״ג)
        </h4>
        
        <div style="margin-top: 1.25rem;">
          <strong>שלב א' — בירור פנימי: אם הדבר שהכי מעסיק אותך היה מסתדר:</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day4_stepA-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ב' — התרגול המעשי: 3 רגעים רגילים של החזקת המטרה:</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day4_stepB_moments')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שלב ג' — התבוננות במהלך היום (Daily Checkpoint):</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day4_stepC-input')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>שאלת העומק של יום 4: עד כמה חסר לי שהבורא יהיה 'נגד עיניי', כאילו אני עומד בפני המלך?</strong>
          <p style="background: var(--bg-secondary); padding: 0.75rem; border-radius: 6px; margin-top: 0.35rem; white-space: pre-wrap;">${getVal('day4_deep_question')}</p>
        </div>

        <div style="margin-top: 1.25rem;">
          <strong>סגירת ערב — שלוש שורות לפני השינה:</strong>
          <ul style="list-style: none; padding: 0; margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0.3rem;">
            <li><strong>א. היום זיהיתי שהחיסרון העיקרי שהניע אותי בפועל הוא:</strong> ${getVal('day4_night_q1')}</li>
            <li><strong>ב. הרגע שבו הצלחתי להחזיק את המטרה מול העיניים היה:</strong> ${getVal('day4_night_q2')}</li>
            <li><strong>ג. הבקשה שלי מהבורא להגדלת החיסרון הנכון:</strong> ${getVal('day4_night_q3')}</li>
          </ul>
        </div>
      </div>
    `;
    return;
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

  if (targetDay === 'day-6') {
    return `=====================================================
הכנת הכלי לראש השנה — יומן עבודה אישי
יום 6: לא לברוח מן הדחייה (בעל הסולם — שמעתי א׳)
תאריך שמירה: ${dateStr}
=====================================================

【 שלב א' — בירור פנימי: מה מרגיש לי כרגע כמו דחייה? 】
שאלה: "מה בחיים שלי מרגיש כרגע כמו דחייה, תקיעות או חוסר ודאות?"
תשובתך:
${getVal('day6_stepA-input')}

-----------------------------------------------------
【 שלב ב' — אל תדלג על החיסרון הראשון 】
שאלה: "אם המצב הזה היה יכול להסתדר עכשיו בדיוק כפי שאני רוצה — מה הייתי רוצה שיקרה בפועל?"
תשובתך:
${getVal('day6_stepB-input')}

-----------------------------------------------------
【 שלב ג' — לרדת שכבה אחת מתחת לתוצאה 】
שאלה: "מעבר לכך שאני רוצה שהמצב יסתדר — איזה חיסרון המצב הזה מגלה בי?"
תשובתך:
${getVal('day6_stepC-input')}

-----------------------------------------------------
【 שלב ד' — התרגול המעשי של היום 】
שאלה: "מה קרה, מה גיליתי, ומה ביקשתי?"
תשובתך:
${getVal('day6_stepD-input')}

-----------------------------------------------------
【 התבוננות במהלך היום (Daily Checkpoint) 】
שאלה: מה המצב הזה מגלה שחסר לי מעבר לתוצאה עצמה, והאם נפתח מקום לבקשת עזרת הבורא?
תשובתך:
${getVal('day6_checkpoint-input')}

-----------------------------------------------------
【 שאלת העומק של יום 6 】
שאלה: "כאשר דבר חשוב לי אינו מסתדר כפי שאני רוצה — האם אני מסוגל לא רק לבקש שהדחייה תיעלם, אלא גם לראות איזה חיסרון עמוק יותר היא מגלה בי?"
תשובתך:
${getVal('day6_deep_question')}

-----------------------------------------------------
【 סגירת ערב — שלוש שורות לפני השינה 】
א. הדחייה / חוסר הוודאות שבחרתי היום הייתה:
   ${getVal('day6_night_q1')}

ב. מתחת לרצון שהמצב יסתדר, גיליתי שחסר לי גם:
   ${getVal('day6_night_q2')}

ג. הבקשה הכנה שלי מהבורא בעקבות מה שגיליתי היא:
   ${getVal('day6_night_q3')}

=====================================================
"וזהו בחינת תיקון, הנקרא 'שמאל דוחה וימין מקרבת'. כלומר, מה שהשמאל דוחה, זה נכנס בגדר של תיקון. והתועלת מהדחיות הוא, שעל ידם האדם מקבל צורך ורצון שלם, שהקב״ה יעזור לו, כי אחרת הוא רואה שהוא אבוד."
— בעל הסולם, שמעתי א׳, „אין עוד מלבדו”
=====================================================`;
  }

  if (targetDay === 'day-5') {
    return `=====================================================
הכנת הכלי לראש השנה — יומן עבודה אישי
יום 5: לא להשאיר את המקום ריק (בעל הסולם — שמעתי רכ״א)
תאריך שמירה: ${dateStr}
=====================================================

【 שלב א' — בירור פנימי: במה הייתי רוצה שהמקום יתמלא 】
שאלה: "אם הייתי מפסיק לרגע לעסוק בשאלה 'מה אני אקבל מזה?' — במה הייתי רוצה שהמקום הזה יתמלא?"
תשובתך:
${getVal('day5_stepA-input')}

-----------------------------------------------------
【 שלב ב' — התרגול המעשי: פעולה אחת של נתינה ללא רווח ישיר 】
שאלה: איזו פעולה של נתינה בחרת ומה חווית כשאמרת "אני מנסה למלא את המקום במשהו אחר"?
תשובתך:
${getVal('day5_stepB-input')}

-----------------------------------------------------
【 שלב ג' — התבוננות במהלך היום 】
שאלה: 1. מה ממלא כרגע את המקום הזה? 2. איזו פעולה או אכפתיות יכולה למלא אותו בתוכן של השפעה?
תשובתך:
${getVal('day5_stepC-input')}

-----------------------------------------------------
【 שאלת העומק של יום 5 】
שאלה: "באיזה תחום בחיי אני מוכן להפסיק להסתפק רק בהתרחקות מאהבה עצמית — ולהתחיל להכניס לתוכו נתינה, דאגה לזולת ואהבה ממשית שתמלא את המקום?"
תשובתך:
${getVal('day5_deep_question')}

-----------------------------------------------------
【 סגירת ערב — שלוש שורות לפני השינה 】
א. היום זיהיתי מקום שבו ה"אני" תפס הרבה שטח, והוא:
   ${getVal('day5_night_q1')}

ב. הפעולה או המחשבה שבה ניסיתי למלא את המקום הזה בנתינה במקום להשאירו ריק:
   ${getVal('day5_night_q2')}

ג. הבקשה שלי מהבורא ביחס למקום הזה היא:
   ${getVal('day5_night_q3')}

=====================================================
"אין כלי יוצא מרשותו, אלא כשממלאים אותה בדבר אחר. אבל בריקנות אי אפשר לה להיות. לכן ההכרח הוא שימלאנה באהבה, ואז ימשוך אחריה מאהבת עצמו."
— בעל הסולם, שמעתי רכ״א
=====================================================`;
  }

  if (targetDay === 'day-4') {
    return `=====================================================
הכנת הכלי לראש השנה — יומן עבודה אישי
יום 4: לברר איזה חיסרון צריך להיות היסוד (בעל הסולם — שמעתי רי״ג)
תאריך שמירה: ${dateStr}
=====================================================

【 שלב א' — בירור פנימי: אם הדבר שהכי מעסיק אותך היה מסתדר 】
שאלה: "אם הדבר הזה היה מסתדר היום בדיוק כמו שאני רוצה — מה עדיין הייתי רוצה שיחסר לי ביחס שלי לבורא?"
תשובתך:
${getVal('day4_stepA-input')}

-----------------------------------------------------
【 שלב ב' — התרגול המעשי: 3 רגעים רגילים של החזקת המטרה 】
שאלה: אילו 3 רגעים בחרת ומה גילית כששאלת "מה המטרה שלי ברגע הזה?"
תשובתך:
${getVal('day4_stepB_moments')}

-----------------------------------------------------
【 שלב ג' — התבוננות במהלך היום 】
שאלה: 1. איזה חיסרון מניע אותי כרגע? 2. האם המטרה נמצאת נגד עיניי?
תשובתך:
${getVal('day4_stepC-input')}

-----------------------------------------------------
【 שאלת העומק של יום 4 】
שאלה: "בתוך כל החסרונות שמניעים אותי — כסף, שקט, הצלחה, ודאות והערכה — עד כמה חסר לי שהבורא יהיה ממש ‘נגד עיניי’, כאילו אני עומד בפני המלך?"
תשובתך:
${getVal('day4_deep_question')}

-----------------------------------------------------
【 סגירת ערב — שלוש שורות לפני השינה 】
א. היום זיהיתי שהחיסרון העיקרי שהניע אותי בפועל הוא:
   ${getVal('day4_night_q1')}

ב. הרגע שבו הצלחתי להחזיק את המטרה מול העיניים היה:
   ${getVal('day4_night_q2')}

ג. הבקשה שלי מהבורא להגדלת החיסרון הנכון:
   ${getVal('day4_night_q3')}

=====================================================
"דבר העיקרי והיסוד הוא להגדיל את החסרון... שהמטרה יהיה תמיד נגד עיניו."
— בעל הסולם, שמעתי רי״ג
=====================================================`;
  }

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
  if (targetDay === 'day-4') dayNum = '4';
  if (targetDay === 'day-5') dayNum = '5';
  if (targetDay === 'day-6') dayNum = '6';
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

function toggleAiChavrutaDay4() {
  const panel = document.getElementById('ai-chavruta-panel-day4');
  const btn = document.getElementById('ai-chavruta-btn-day4');
  const arrow = document.getElementById('ai-arrow-icon-day4');

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

function copyAiPromptDay4() {
  const promptEl = document.getElementById('ai-prompt-content-day4');
  const copyBtn = document.getElementById('copy-prompt-btn-day4');
  const copyText = document.getElementById('copy-prompt-text-day4');
  const copyIcon = document.getElementById('copy-prompt-icon-day4');

  if (!promptEl) return;
  const textToCopy = promptEl.textContent || promptEl.innerText;

  const handleSuccess = () => {
    if (copyBtn) copyBtn.classList.add('copied');
    if (copyText) copyText.textContent = 'הפרומפט הועתק ✓';
    if (copyIcon) {
      copyIcon.className = 'fa-solid fa-check';
    }
    showToast('הפרומפט ליום 4 הועתק ללוח בהצלחה! ✓');

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

function toggleAiChavrutaDay5() {
  const panel = document.getElementById('ai-chavruta-panel-day5');
  const btn = document.getElementById('ai-chavruta-btn-day5');
  const arrow = document.getElementById('ai-arrow-icon-day5');

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

function copyAiPromptDay5() {
  const promptEl = document.getElementById('ai-prompt-content-day5');
  const copyBtn = document.getElementById('copy-prompt-btn-day5');
  const copyText = document.getElementById('copy-prompt-text-day5');
  const copyIcon = document.getElementById('copy-prompt-icon-day5');

  if (!promptEl) return;
  const textToCopy = promptEl.textContent || promptEl.innerText;

  const handleSuccess = () => {
    if (copyBtn) copyBtn.classList.add('copied');
    if (copyText) copyText.textContent = 'הפרומפט הועתק ✓';
    if (copyIcon) {
      copyIcon.className = 'fa-solid fa-check';
    }
    showToast('הפרומפט ליום 5 הועתק ללוח בהצלחה! ✓');

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

function toggleAiChavrutaDay6() {
  const panel = document.getElementById('ai-chavruta-panel-day6');
  const btn = document.getElementById('ai-chavruta-btn-day6');
  const arrow = document.getElementById('ai-arrow-icon-day6');

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

function copyAiPromptDay6() {
  const promptEl = document.getElementById('ai-prompt-content-day6');
  const copyBtn = document.getElementById('copy-prompt-btn-day6');
  const copyText = document.getElementById('copy-prompt-text-day6');
  const copyIcon = document.getElementById('copy-prompt-icon-day6');

  if (!promptEl) return;
  const textToCopy = promptEl.textContent || promptEl.innerText;

  const handleSuccess = () => {
    if (copyBtn) copyBtn.classList.add('copied');
    if (copyText) copyText.textContent = 'הפרומפט הועתק ✓';
    if (copyIcon) {
      copyIcon.className = 'fa-solid fa-check';
    }
    showToast('הפרומפט ליום 6 הועתק ללוח בהצלחה! ✓');

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

