const HIRAGANA_ANSWERS = {
  'あ': '아', 'い': '이', 'う': '우', 'え': '에', 'お': '오',
  'か': '카', 'き': '키', 'く': '쿠', 'け': '케', 'こ': '코',
  'さ': '사', 'し': '시', 'す': '스', 'せ': '세', 'そ': '소',
  'た': '타', 'ち': '치', 'つ': '츠', 'て': '테', 'と': '토',
  'な': '나', 'に': '니', 'ぬ': '누', 'ね': '네', 'の': '노',
  'は': '하', 'ひ': '히', 'ふ': '후', 'へ': '헤', 'ほ': '호',
  'ま': '마', 'み': '미', 'む': '무', 'め': '메', 'も': '모',
  'や': '야', 'ゆ': '유', 'よ': '요',
  'ら': '라', 'り': '리', 'る': '루', 'れ': '레', 'ろ': '로',
  'わ': '와', 'を': '오', 'ん': '응'
};

const KATAKANA_ANSWERS = {
  'ア': '아', 'イ': '이', 'ウ': '우', 'エ': '에', 'オ': '오',
  'カ': '카', 'キ': '키', 'ク': '쿠', 'ケ': '케', 'コ': '코',
  'サ': '사', 'シ': '시', 'ス': '스', 'セ': '세', 'ソ': '소',
  'タ': '타', 'チ': '치', 'ツ': '츠', 'テ': '테', 'ト': '토',
  'ナ': '나', 'ニ': '니', 'ヌ': '누', 'ネ': '네', 'ノ': '노',
  'ハ': '하', 'ヒ': '히', 'フ': '후', 'ヘ': '헤', 'ホ': '호',
  'マ': '마', 'ミ': '미', 'ム': '무', 'メ': '메', 'モ': '모',
  'ヤ': '야', 'ユ': '유', 'ヨ': '요',
  'ラ': '라', 'リ': '리', 'ル': '루', 'レ': '레', 'ロ': '로',
  'ワ': '와', 'ヲ': '오', 'ン': '응'
};

const state = {
  mode: 'hiragana',
  score: 0,
  total: 0,
  currentChar: '',
  isAnswered: false
};

function $(sel) { return document.querySelector(sel); }
const CHOICE_COUNT = 10;

function init() {
  bindEvents();
  setActiveMode('hiragana');
}

function bindEvents() {
  document.getElementById('hiraganaBtn').addEventListener('click', () => setActiveMode('hiragana'));
  document.getElementById('katakanaBtn').addEventListener('click', () => setActiveMode('katakana'));
  document.getElementById('startHiragana').addEventListener('click', () => startGame('hiragana'));
  document.getElementById('startKatakana').addEventListener('click', () => startGame('katakana'));
  document.getElementById('nextBtn').addEventListener('click', nextQuestion);
  document.getElementById('restartBtn').addEventListener('click', () => showScreen('startScreen'));
}

function setActiveMode(mode) {
  state.mode = mode;
  document.getElementById('hiraganaBtn').classList.toggle('active', mode === 'hiragana');
  document.getElementById('katakanaBtn').classList.toggle('active', mode === 'katakana');
}

function startGame(mode) {
  state.mode = mode;
  state.score = 0;
  state.total = 0;
  state.isAnswered = false;
  updateStats();
  setActiveMode(mode);
  showScreen('gameArea');
  nextQuestion();
}

function getCurrentMap() {
  return state.mode === 'hiragana' ? HIRAGANA_ANSWERS : KATAKANA_ANSWERS;
}

function getRandomChar() {
  const map = getCurrentMap();
  const keys = Object.keys(map);
  return keys[Math.floor(Math.random() * keys.length)];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildChoices(correctAnswer) {
  const pool = [...new Set(Object.values(getCurrentMap()))];
  const pickCount = Math.min(CHOICE_COUNT, pool.length);
  const choices = [correctAnswer];

  while (choices.length < pickCount) {
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (!choices.includes(candidate)) choices.push(candidate);
  }
  return shuffle(choices);
}

function renderChoices(correctAnswer) {
  const box = $('#choices');
  box.innerHTML = '';
  const choices = buildChoices(correctAnswer);

  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.addEventListener('click', () => submitChoice(btn, choice, correctAnswer));
    box.appendChild(btn);
  });
}

function nextQuestion() {
  const map = getCurrentMap();
  state.currentChar = getRandomChar();
  state.isAnswered = false;
  $('#charDisplay').textContent = state.currentChar;
  renderChoices(map[state.currentChar]);
  const fb = $('#feedback');
  fb.classList.add('hidden');
  fb.classList.remove('correct', 'wrong');
  $('#nextBtn').classList.add('hidden');
}

function submitChoice(clickedBtn, picked, correct) {
  if (state.isAnswered) return;

  state.isAnswered = true;
  state.total++;

  const fb = $('#feedback');
  fb.classList.remove('hidden');

  if (picked === correct) {
    state.score++;
    fb.textContent = '정답입니다!';
    fb.classList.add('correct');
    fb.classList.remove('wrong');
    clickedBtn.classList.add('correct');
  } else {
    fb.textContent = `오답입니다. 정답은 "${correct}"입니다.`;
    fb.classList.add('wrong');
    fb.classList.remove('correct');
    clickedBtn.classList.add('wrong');
  }

  document.querySelectorAll('.choice-btn').forEach((btn) => {
    if (btn.textContent === correct) btn.classList.add('correct');
    btn.disabled = true;
  });

  updateStats();
  $('#nextBtn').classList.remove('hidden');
  $('#nextBtn').focus();
}

function updateStats() {
  $('#score').textContent = state.score;
  $('#total').textContent = state.total;
}

function showScreen(id) {
  ['startScreen', 'gameArea', 'resultScreen'].forEach((s) => {
    $(`#${s}`).classList.toggle('hidden', s !== id);
  });
}

init();
