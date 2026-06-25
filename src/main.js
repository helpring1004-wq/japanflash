const HIRAGANA_ANSWERS = {
  'あ': '아', 'い': '이', 'う': '우', 'え': '에', 'お': '오',
  'か': '카', 'き': '키', 'く': '쿠', 'け': '케', 'こ': '코',
  'さ': '사', 'し': '시', 'す': '스', 'せ': '세', 'そ': '소',
  'た': '타', 'ち': '치', 'つ': '츠', 'て': '테', 'と': '토',
  'な': '나', 'に': '니', 'ぬ': '누', 'ね': '네', 'の': '노',
  'は': '하', 'ひ': '히', 'ふ': '후', 'へ': '헤', 'ほ': '호',
  'ま': '마', 'み': '미', 'む': '무', 'め': 'メ', 'も': '모',
  'や': '야', 'ゆ': '유', 'よ': '요',
  'ら': '라', 'り': '리', 'る': '루', 'れ': '레', 'ろ': '로',
  'わ': '와', 'を': '오', 'ん': '응'
};

const KATAKANA_ANSWERS = {
  'ア': '아', 'イ': '이', 'ウ': '우', 'エ': '에', 'オ': '오',
  'カ': '카', 'キ': '키', 'ク': '쿠', 'ケ': '케', 'コ': 'コ',
  'サ': '사', 'シ': '시', 'ス': '스', 'セ': 'セ', 'ソ': '소',
  'タ': '타', 'チ': '치', 'ツ': '츠', 'テ': '테', 'ト': '토',
  'ナ': '나', 'ニ': '니', 'ヌ': '누', 'ネ': 'ネ', 'ノ': '노',
  'ハ': '하', 'ヒ': '히', 'フ': '후', 'ヘ': 'ヘ', 'ホ': 'ホ',
  'マ': '마', 'ミ': '미', 'ム': '무', 'メ': 'メ', 'モ': '모',
  'ヤ': '야', 'ユ': '유', 'ヨ': '요',
  'ラ': '라', 'リ': '리', 'ル': '루', 'レ': 'レ', 'ロ': '로',
  'ワ': '와', 'ヲ': 'オ', 'ン': '응'
};

const HIRAGANA_GROUPS = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', 'ゆ', 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', 'を', 'ん']
];

const KATAKANA_GROUPS = [
  ['ア', 'イ', 'ウ', 'エ', 'オ'],
  ['カ', 'キ', 'ク', 'ケ', 'コ'],
  ['サ', 'シ', 'ス', 'セ', 'ソ'],
  ['タ', 'チ', 'ツ', 'テ', 'ト'],
  ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
  ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
  ['マ', 'ミ', 'ム', 'メ', 'モ'],
  ['ヤ', 'ユ', 'ヨ'],
  ['ラ', 'リ', 'ル', 'レ', 'ロ'],
  ['ワ', 'ヲ', 'ン']
];

const state = {
  mode: 'hiragana',
  playMode: 'random',
  score: 0,
  total: 0,
  currentChar: '',
  isAnswered: false,
  groupIndex: 0,
  groupQueue: [],
  groupCorrectCount: 0
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
  document.getElementById('startStudy').addEventListener('click', () => startStudyMode());
  document.getElementById('nextBtn').addEventListener('click', handleNext);
  document.getElementById('studyStartQuizBtn').addEventListener('click', () => startGroupQuiz());
  document.getElementById('studyNextGroupBtn').addEventListener('click', () => moveToNextGroup());
  document.getElementById('restartBtn').addEventListener('click', () => showScreen('startScreen'));
}

function setActiveMode(mode) {
  state.mode = mode;
  document.getElementById('hiraganaBtn').classList.toggle('active', mode === 'hiragana');
  document.getElementById('katakanaBtn').classList.toggle('active', mode === 'katakana');
}

function startGame(mode) {
  state.playMode = 'random';
  state.mode = mode;
  state.score = 0;
  state.total = 0;
  state.isAnswered = false;
  updateStats();
  setActiveMode(mode);
  showScreen('gameArea');
  nextQuestion();
}

function startStudyMode() {
  state.playMode = 'study';
  state.score = 0;
  state.total = 0;
  state.groupIndex = 0;
  state.groupCorrectCount = 0;
  state.groupQueue = [];
  updateStats();
  showScreen('studyArea');
  renderStudyGroup();
}

function getCurrentMap() {
  return state.mode === 'hiragana' ? HIRAGANA_ANSWERS : KATAKANA_ANSWERS;
}

function getCurrentGroups() {
  return state.mode === 'hiragana' ? HIRAGANA_GROUPS : KATAKANA_GROUPS;
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

function buildChoices(correctAnswer, poolOverride) {
  const pool = poolOverride || [...new Set(Object.values(getCurrentMap()))];
  const pickCount = Math.min(CHOICE_COUNT, pool.length);
  const choices = [correctAnswer];

  while (choices.length < pickCount) {
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (!choices.includes(candidate)) choices.push(candidate);
  }
  return shuffle(choices);
}

function renderChoices(correctAnswer, poolOverride) {
  const box = $('#choices');
  box.innerHTML = '';
  const choices = buildChoices(correctAnswer, poolOverride);

  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.addEventListener('click', () => submitChoice(btn, choice, correctAnswer));
    box.appendChild(btn);
  });
}

function renderStudyGroup() {
  const groups = getCurrentGroups();
  if (state.groupIndex >= groups.length) {
    showResult('모든 그룹을 완료했습니다!');
    return;
  }

  const map = getCurrentMap();
  const group = groups[state.groupIndex];
  const list = $('#studyList');
  list.innerHTML = '';

  group.forEach((char) => {
    const item = document.createElement('div');
    item.className = 'study-item';
    item.innerHTML = `<span class="study-char">${char}</span><span class="study-answer">${map[char]}</span>`;
    list.appendChild(item);
  });

  $('#studyGroupTitle').textContent = `${state.groupIndex + 1}그룹 / 총 ${groups.length}그룹`;
  $('#studyStartQuizBtn').classList.remove('hidden');
  $('#studyNextGroupBtn').classList.add('hidden');
}

function startGroupQuiz() {
  const groups = getCurrentGroups();
  const group = groups[state.groupIndex];
  state.groupQueue = shuffle([...group]);
  state.groupCorrectCount = 0;
  $('#studyStartQuizBtn').classList.add('hidden');
  showScreen('gameArea');
  nextGroupQuestion();
}

function nextGroupQuestion() {
  if (state.groupQueue.length === 0) {
    const groups = getCurrentGroups();
    const group = groups[state.groupIndex];
    const correct = state.groupCorrectCount;
    const total = group.length;
    const fb = $('#feedback');
    fb.classList.remove('hidden', 'correct', 'wrong');
    fb.style.background = '#e2e3f3';
    fb.style.color = '#333';
    fb.textContent = `${state.groupIndex + 1}그룹 완료: ${correct}/${total} 정답`;
    $('#choices').innerHTML = '';
    $('#charDisplay').textContent = '🎉';
    $('#nextBtn').textContent = '다음 그룹 학습하기';
    $('#nextBtn').classList.remove('hidden');
    $('#nextBtn').onclick = () => {
      $('#nextBtn').onclick = null;
      $('#nextBtn').textContent = '다음 문제';
      moveToNextGroup();
    };
    return;
  }

  const map = getCurrentMap();
  const char = state.groupQueue.pop();
  state.currentChar = char;
  state.isAnswered = false;
  $('#charDisplay').textContent = char;
  const groupAnswers = getCurrentGroups()[state.groupIndex].map((c) => map[c]);
  renderChoices(map[char], groupAnswers);
  const fb = $('#feedback');
  fb.classList.add('hidden');
  fb.classList.remove('correct', 'wrong');
  $('#nextBtn').classList.add('hidden');
}

function moveToNextGroup() {
  state.groupIndex += 1;
  showScreen('studyArea');
  renderStudyGroup();
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

function handleNext() {
  if (state.playMode === 'study') {
    nextGroupQuestion();
  } else {
    nextQuestion();
  }
}

function submitChoice(clickedBtn, picked, correct) {
  if (state.isAnswered) return;

  state.isAnswered = true;
  state.total++;

  const fb = $('#feedback');
  fb.classList.remove('hidden');
  fb.style.background = '';
  fb.style.color = '';

  if (picked === correct) {
    state.score++;
    if (state.playMode === 'study') state.groupCorrectCount += 1;
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

function showResult(message) {
  const pct = state.total === 0 ? 0 : Math.round((state.score / state.total) * 100);
  $('#resultPercent').textContent = pct;
  $('#resultCorrect').textContent = state.score;
  $('#resultTotal').textContent = state.total;
  if (message) $('#resultScreen .result-text').textContent = message;
  showScreen('resultScreen');
}

function showScreen(id) {
  ['startScreen', 'studyArea', 'gameArea', 'resultScreen'].forEach((s) => {
    $(`#${s}`).classList.toggle('hidden', s !== id);
  });
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}
