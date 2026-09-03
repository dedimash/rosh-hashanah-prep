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
  { id: 'stepA-input', statusId: 'stepA-status' },
  { id: 'stepB-input', statusId: 'stepB-status' },
  { id: 'night-q1', statusId: 'night-status' },
  { id: 'night-q2', statusId: 'night-status' },
  { id: 'night-q3', statusId: 'night-status' },
  { id: 'desire-1', statusId: 'desires-status' },
  { id: 'desire-2', statusId: 'desires-status' },
  { id: 'desire-3', statusId: 'desires-status' },
  { id: 'desire-4', statusId: 'desires-status' },
  { id: 'desire-5', statusId: 'desires-status' }
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

function openJournalModal() {
  const modal = document.getElementById('journal-modal');
  if (modal) {
    renderJournalContent();
    modal.classList.add('open');
  }
}

function renderJournalContent() {
  const contentEl = document.getElementById('modal-journal-content');
  if (!contentEl) return;

  const getVal = (id) => localStorage.getItem(`rh_prep_${id}`) || '(טרם נרשמה תשובה)';

  const html = `
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

  contentEl.innerHTML = html;
}

function generateFormattedJournalText() {
  const getVal = (id) => localStorage.getItem(`rh_prep_${id}`) || '(לא נרשמה תשובה)';
  const dateStr = new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'numeric', day: 'numeric' });

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

function downloadJournalAsText() {
  const content = generateFormattedJournalText();
  const dateSuffix = new Date().toISOString().slice(0, 10);
  const filename = `הכנת_הכלי_יום_1_תשובות_${dateSuffix}.txt`;

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

  showToast('הקובץ עם כל השאלות והתשובות הורד בהצלחה! 📥');
}

function copyJournalToClipboard() {
  const text = generateFormattedJournalText();

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
