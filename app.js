/* تراثنا أول وتالي - App Logic */

// ========== Favorites (localStorage) ==========
const FAV_KEY = 'turathuna_favorites';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

function toggleFavorite(id, type, text) {
  let favs = getFavorites();
  const exists = favs.findIndex(f => f.id === id);
  if (exists > -1) {
    favs.splice(exists, 1);
  } else {
    favs.push({ id, type, text, date: new Date().toISOString() });
  }
  saveFavorites(favs);
  updateFavButtons();
  return exists === -1;
}

function isFavorite(id) {
  return getFavorites().some(f => f.id === id);
}

function updateFavButtons() {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (isFavorite(id)) {
      btn.classList.add('active');
      btn.textContent = '❤️';
    } else {
      btn.classList.remove('active');
      btn.textContent = '🤍';
    }
  });
}

// ========== Dark Mode ==========
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('turathuna_dark', document.body.classList.contains('dark') ? '1' : '0');
}

function initDarkMode() {
  if (localStorage.getItem('turathuna_dark') === '1') {
    document.body.classList.add('dark');
  }
}

// ========== Search ==========
function initSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    // Simple page filter if on content pages
    document.querySelectorAll('.content-card, .card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? '' : 'none';
    });
  });
}

// ========== Random Discover ==========
const DISCOVER_ITEMS = [
  { type: 'مثل', text: 'اللي ما يعرف الصقر يشويه', note: 'يُقال لمن لا يعرف قيمة الشيء أو يقوم بعمل يجهله. (متداول في الإمارات والخليج)' },
  { type: 'مثل', text: 'اللي ما عنده عمل يكاري له جمل واللي ما عنده حيلة يلعب التيلة', note: 'يدعو للعمل والابتعاد عن الفراغ. موثق في مصادر تراثية إماراتية.' },
  { type: 'كلمة', text: 'النوخذة', note: 'ربان السفينة وقائدها في التراث البحري الخليجي والإماراتي.' },
  { type: 'كلمة', text: 'النهّام', note: 'المغني الذي يردد الأهازيج والنهمات على متن السفينة لتشجيع البحارة.' },
  { type: 'مفهوم', text: 'السنع', note: 'مجموعة العادات والآداب الإماراتية المتوارثة في التعامل والضيافة واحترام الكبير.' },
  { type: 'معلومة', text: 'الغوص على اللؤلؤ', note: 'كان مصدر رزق أساسي لأهل الساحل الإماراتي قبل اكتشاف النفط.' },
  { type: 'قيمة', text: 'الفزعة', note: 'النخوة والمساعدة السريعة للآخرين عند الحاجة، من قيم المجتمع الإماراتي.' },
  { type: 'أكلة', text: 'الهريس', note: 'أكلة تراثية إماراتية تُقدم خاصة في المناسبات والأعياد.' },
];

function surpriseMe() {
  const item = DISCOVER_ITEMS[Math.floor(Math.random() * DISCOVER_ITEMS.length)];
  const box = document.getElementById('discoverResult');
  if (box) {
    box.innerHTML = `
      <div style="font-size:0.9rem;opacity:0.85;margin-bottom:0.5rem;">${item.type}</div>
      <div style="font-size:1.4rem;font-weight:700;color:var(--gold-light);margin-bottom:0.8rem;">${item.text}</div>
      <div style="font-size:0.95rem;opacity:0.9;">${item.note}</div>
    `;
    box.classList.remove('hidden');
  }
}

// ========== Quiz ==========
const QUIZ_DATA = [
  {
    q: 'من هو قائد السفينة في التراث البحري الإماراتي؟',
    options: ['النهّام', 'النوخذة', 'الطواش', 'القلاف'],
    correct: 1
  },
  {
    q: 'ماذا يعني «السنع» في الثقافة الإماراتية؟',
    options: ['نوع من الأكل', 'آداب وسلوكيات متوارثة', 'اسم سفينة', 'نوع من الشعر'],
    correct: 1
  },
  {
    q: 'ما هي مهنة «النهّام»؟',
    options: ['صانع السفن', 'مغني الأهازيج على السفينة', 'تاجر اللؤلؤ', 'غواص'],
    correct: 1
  },
  {
    q: 'أي من هذه الأكلات تراثية إماراتية معروفة؟',
    options: ['الهريس', 'البيتزا', 'السوشي', 'البرغر'],
    correct: 0
  },
  {
    q: 'كتاب «المتوصف» يوثق بشكل أساسي:',
    options: ['الشعر النبطي', 'الأمثال الشعبية الإماراتية', 'الحرف اليدوية', 'الأزياء'],
    correct: 1
  }
];

let quizIndex = 0;
let quizScore = 0;

function startQuiz() {
  quizIndex = 0;
  quizScore = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quizArea');
  if (!container) return;
  if (quizIndex >= QUIZ_DATA.length) {
    const msg = quizScore >= 4 
      ? '🇦🇪 أنت تعرف تراثنا زين!' 
      : 'بعدك تحتاج تتعرف على تراثنا أكثر ❤️';
    container.innerHTML = `
      <div class="quiz-result">
        <div style="font-size:2rem;margin-bottom:0.5rem;">النتيجة: ${quizScore} / ${QUIZ_DATA.length}</div>
        <div>${msg}</div>
        <button class="btn btn-primary mt-2" onclick="startQuiz()">أعد الاختبار</button>
      </div>
    `;
    return;
  }
  const item = QUIZ_DATA[quizIndex];
  container.innerHTML = `
    <div class="quiz-question">${quizIndex + 1}. ${item.q}</div>
    <div class="quiz-options">
      ${item.options.map((opt, i) => `
        <button class="quiz-option" onclick="answerQuiz(${i})">${opt}</button>
      `).join('')}
    </div>
  `;
}

function answerQuiz(selected) {
  const item = QUIZ_DATA[quizIndex];
  const options = document.querySelectorAll('.quiz-option');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === item.correct) btn.classList.add('correct');
    else if (i === selected) btn.classList.add('wrong');
  });
  if (selected === item.correct) quizScore++;
  setTimeout(() => {
    quizIndex++;
    renderQuizQuestion();
  }, 900);
}

// ========== Filters ==========
function filterByCategory(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.content-card').forEach(card => {
    if (cat === 'all' || card.dataset.category === cat) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ========== Copy ==========
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('تم نسخ المعلومة ✓');
  }).catch(() => {});
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initSearch();
  updateFavButtons();
  
  // Fav buttons
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const type = btn.dataset.type || 'item';
      const text = btn.dataset.text || '';
      toggleFavorite(id, type, text);
    });
  });
});

// Make functions global for onclick
window.surpriseMe = surpriseMe;
window.startQuiz = startQuiz;
window.answerQuiz = answerQuiz;
window.filterByCategory = filterByCategory;
window.toggleDarkMode = toggleDarkMode;
window.copyText = copyText;