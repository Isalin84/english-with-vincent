const images = {
  teacher: "public/assets/vincent-teacher.webp",
  thinking: "public/assets/vincent-thinking.webp",
  celebrate: "public/assets/vincent-celebrate.webp",
};

const voiceTracks = {
  intro: "public/audio/vincent-intro.mp3",
  rule: "public/audio/vincent-rule.mp3",
  simpleExample: "public/audio/simple-example.mp3",
  continuousExample: "public/audio/continuous-example.mp3",
  choiceInstruction: "public/audio/choice-instruction.mp3",
  choice1: "public/audio/choice-1.mp3",
  choice2: "public/audio/choice-2.mp3",
  choice3: "public/audio/choice-3.mp3",
  choice4: "public/audio/choice-4.mp3",
  sortInstruction: "public/audio/sort-instruction.mp3",
  finalIntro: "public/audio/final-intro.mp3",
  final1: "public/audio/final-1.mp3",
  final2: "public/audio/final-2.mp3",
  final3: "public/audio/final-3.mp3",
  final4: "public/audio/final-4.mp3",
  final5: "public/audio/final-5.mp3",
  final6: "public/audio/final-6.mp3",
  complete: "public/audio/vincent-complete.mp3",
};

const choiceQuestions = [
  {
    text: "Varya usually ___ her homework after school.",
    clue: "usually",
    options: ["does", "is doing"],
    answer: "does",
    tip: "Usually — это привычка. Нужен Present Simple: does.",
    track: "choice1",
  },
  {
    text: "Look! Vincent ___ after a butterfly.",
    clue: "Look!",
    options: ["runs", "is running"],
    answer: "is running",
    tip: "Look! — действие происходит прямо сейчас: is running.",
    track: "choice2",
  },
  {
    text: "My dad ___ tea every morning.",
    clue: "every morning",
    options: ["drinks", "is drinking"],
    answer: "drinks",
    tip: "Every morning — повторяющееся действие. Present Simple: drinks.",
    track: "choice3",
  },
  {
    text: "Listen! The baby ___ right now.",
    clue: "right now",
    options: ["cries", "is crying"],
    answer: "is crying",
    tip: "Right now — прямо сейчас. Нужен Present Continuous: is crying.",
    track: "choice4",
  },
];

const sortCards = [
  { label: "every Saturday", zone: "simple" },
  { label: "right now", zone: "continuous" },
  { label: "usually", zone: "simple" },
  { label: "at the moment", zone: "continuous" },
  { label: "often", zone: "simple" },
  { label: "Look!", zone: "continuous" },
];

const finalQuestions = [
  {
    text: "I ___ my teeth every day.",
    clue: "every day",
    options: ["brush", "am brushing"],
    answer: "brush",
    track: "final1",
  },
  {
    text: "Vincent ___ on the sofa now.",
    clue: "now",
    options: ["sleeps", "is sleeping"],
    answer: "is sleeping",
    track: "final2",
  },
  {
    text: "She usually ___ to school at eight.",
    clue: "usually",
    options: ["goes", "is going"],
    answer: "goes",
    track: "final3",
  },
  {
    text: "We ___ English at the moment.",
    clue: "at the moment",
    options: ["learn", "are learning"],
    answer: "are learning",
    track: "final4",
  },
  {
    text: "They ___ football on Sundays.",
    clue: "on Sundays",
    options: ["play", "are playing"],
    answer: "play",
    track: "final5",
  },
  {
    text: "Listen! Mum ___ on the phone.",
    clue: "Listen!",
    options: ["talks", "is talking"],
    answer: "is talking",
    track: "final6",
  },
];

const state = {
  screen: 0,
  score: 0,
  streak: 0,
  soundOn: true,
  choiceIndex: 0,
  choiceSolved: new Set(),
  sortIndex: 0,
  sorted: { simple: [], continuous: [] },
  finalIndex: 0,
  finalSolved: new Set(),
};

const panel = document.querySelector("#activity-panel");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const soundButton = document.querySelector("#sound-toggle");
const speechText = document.querySelector("#speech-text");
const vincentImage = document.querySelector("#vincent-image");
const trailSteps = [...document.querySelectorAll("#trail-steps li")];

let currentTrack = "intro";
let activeVoiceAudio;
let audioContext;

function storedBest() {
  return Number(localStorage.getItem("vincent-best-score") || 0);
}

function updateScore(points = 0) {
  state.score += points;
  scoreElement.textContent = state.score;
  if (state.score > storedBest()) {
    localStorage.setItem("vincent-best-score", String(state.score));
  }
  bestScoreElement.textContent = storedBest();
}

function setVincent(mode, message, track = currentTrack) {
  currentTrack = track;
  speechText.textContent = message;
  const next = images[mode];
  if (vincentImage.getAttribute("src") === next) return;
  vincentImage.classList.add("is-changing");
  window.setTimeout(() => {
    vincentImage.src = next;
    vincentImage.classList.remove("is-changing");
  }, 170);
}

function setTrail(step) {
  trailSteps.forEach((item, index) => {
    item.classList.toggle("is-active", index === step);
    item.classList.toggle("is-done", index < step);
    const marker = item.querySelector("span");
    marker.textContent = index < step ? "✓" : String(index + 1);
  });
}

function tone(kind = "click") {
  if (!state.soundOn) return;
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const now = audioContext.currentTime;
  const notes = kind === "good" ? [523.25, 659.25, 783.99] : kind === "bad" ? [180, 145] : [420];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = kind === "bad" ? "sawtooth" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.08 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.14);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now + index * 0.08);
    oscillator.stop(now + index * 0.08 + 0.15);
  });
}

function speak(track = currentTrack) {
  if (!state.soundOn || !voiceTracks[track]) return;
  if (activeVoiceAudio) {
    activeVoiceAudio.pause();
    activeVoiceAudio.currentTime = 0;
  }
  activeVoiceAudio = new Audio(voiceTracks[track]);
  activeVoiceAudio.play().catch(() => {});
}

function highlightClue(text, clue) {
  return text.replace(clue, `<span class="clue">${clue}</span>`);
}

function burstConfetti(amount = 24) {
  const layer = document.querySelector("#confetti");
  const colors = ["#ffd85a", "#ff7058", "#46cfa2", "#1747d1", "#8f63e9"];
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--drift", `${Math.random() * 240 - 120}px`);
    piece.style.animationDelay = `${Math.random() * 0.22}s`;
    layer.append(piece);
    window.setTimeout(() => piece.remove(), 2300);
  }
}

function renderIntro() {
  state.screen = 0;
  setTrail(0);
  setVincent(
    "teacher",
    "Привет, Варя! Сегодня мы приручим два английских времени. Дальше я буду говорить по-английски — слушай внимательно и повторяй за мной!",
    "intro",
  );
  panel.innerHTML = `
    <div class="kicker"><span aria-hidden="true">⏱️</span> 12 минут · 3 игровых этапа</div>
    <h1>Как отличить «обычно» от «прямо сейчас»?</h1>
    <p class="lead">Освой <b>Present Simple</b> и <b>Present Continuous</b>, собери звёзды и получи медаль от Винни.</p>
    <div class="mini-features" aria-label="Что будет в уроке">
      <span>🔊 живые примеры</span>
      <span>🎯 16 заданий</span>
      <span>⭐ 190 баллов</span>
    </div>
    <button class="primary-button" type="button" data-action="start">Начать приключение</button>
  `;
}

function renderRules() {
  state.screen = 1;
  setTrail(1);
  setVincent("teacher", "Секрет простой: ищи слово-подсказку и спроси себя — это привычное действие или что-то, что происходит прямо сейчас?", "rule");
  panel.innerHTML = `
    <div class="kicker"><span aria-hidden="true">🔎</span> Винни объясняет</div>
    <h2>Два времени — две суперсилы</h2>
    <div class="rule-grid">
      <article class="rule-sheet">
        <h3>🔁 Present Simple</h3>
        <p>Привычки и то, что повторяется.</p>
        <div class="formula">I play · She plays</div>
        <div class="signal-words">usually · often · every day</div>
        <div class="example-line"><button class="tiny-audio" type="button" data-track="simpleExample" aria-label="Послушать пример">▶</button> I walk to school every day.</div>
      </article>
      <article class="rule-sheet is-now">
        <h3>⚡ Present Continuous</h3>
        <p>То, что происходит прямо сейчас.</p>
        <div class="formula">am / is / are + ing</div>
        <div class="signal-words">now · Look! · at the moment</div>
        <div class="example-line"><button class="tiny-audio" type="button" data-track="continuousExample" aria-label="Послушать пример">▶</button> I am walking to school now.</div>
      </article>
    </div>
    <button class="primary-button" type="button" data-action="choice">Проверить суперсилу</button>
  `;
}

function renderChoice() {
  state.screen = 2;
  setTrail(2);
  const question = choiceQuestions[state.choiceIndex];
  setVincent("thinking", "Найди слово-подсказку и выбери правильную форму.", "choiceInstruction");
  panel.innerHTML = `
    <div class="kicker"><span aria-hidden="true">🎯</span> Быстрый выбор</div>
    <h2>Что подходит?</h2>
    <div class="question-meta"><span>Вопрос ${state.choiceIndex + 1} из ${choiceQuestions.length}</span><span class="streak">🔥 Серия: ${state.streak}</span></div>
    <div class="question-card">
      <p>${highlightClue(question.text, question.clue)}</p>
      <div class="answer-grid">
        ${question.options.map((option) => `<button class="answer-button" type="button" data-answer="${option}">${option}</button>`).join("")}
      </div>
      <p class="feedback" id="feedback">Выбери один ответ.</p>
    </div>
  `;
}

function renderSort() {
  state.screen = 3;
  setTrail(2);
  const card = sortCards[state.sortIndex];
  setVincent("thinking", "Рассортируй слова-подсказки. Нажми на карточку, затем на правильный домик.", "sortInstruction");
  panel.innerHTML = `
    <div class="kicker"><span aria-hidden="true">🧺</span> Сортировка подсказок</div>
    <h2>Куда отправить фразу?</h2>
    <p class="sort-instruction">Карточка ${Math.min(state.sortIndex + 1, sortCards.length)} из ${sortCards.length}. Сначала выдели её, потом выбери время.</p>
    ${card ? `<button class="sort-card" type="button" data-action="select-card">${card.label}</button>` : ""}
    <div class="sort-zones">
      <button class="sort-zone" type="button" data-zone="simple">
        <b>🔁 Present Simple</b><span>обычно, регулярно</span>
        <div class="sorted-list">${state.sorted.simple.map((item) => `<i class="sorted-chip">${item}</i>`).join("")}</div>
      </button>
      <button class="sort-zone" type="button" data-zone="continuous">
        <b>⚡ Present Continuous</b><span>прямо сейчас</span>
        <div class="sorted-list">${state.sorted.continuous.map((item) => `<i class="sorted-chip">${item}</i>`).join("")}</div>
      </button>
    </div>
    <p class="feedback" id="feedback">${state.sortIndex === 0 ? "Выбери карточку." : "Отлично! Продолжай."}</p>
  `;
}

function renderFinal() {
  state.screen = 4;
  setTrail(3);
  const question = finalQuestions[state.finalIndex];
  setVincent("thinking", "Финал! За каждый ответ здесь ты получишь целых 15 звёздных баллов.", "finalIntro");
  panel.innerHTML = `
    <div class="kicker"><span aria-hidden="true">🏁</span> Финальное испытание</div>
    <h2>Собери идеальную серию</h2>
    <div class="final-progress" aria-label="Прогресс финала"><span style="width:${(state.finalIndex / finalQuestions.length) * 100}%"></span></div>
    <div class="question-card">
      <p>${highlightClue(question.text, question.clue)}</p>
      <div class="answer-grid">
        ${question.options.map((option) => `<button class="answer-button" type="button" data-final-answer="${option}">${option}</button>`).join("")}
      </div>
      <p class="feedback" id="feedback">Вопрос ${state.finalIndex + 1} из ${finalQuestions.length}</p>
    </div>
  `;
}

function renderComplete() {
  state.screen = 5;
  setTrail(4);
  setVincent("celebrate", `Ура, Варя! ${state.score} баллов — ты отлично различаешь два времени!`, "complete");
  burstConfetti(70);
  tone("good");
  panel.innerHTML = `
    <div class="result-badge"><div><span>🏅</span><b>Time Tamer</b></div></div>
    <h2>Времена приручены!</h2>
    <p class="lead">Ты заработала <b>${state.score} из 190 баллов</b>. Главное правило: привычка — Present Simple, действие сейчас — Present Continuous.</p>
    <div class="mini-features">
      <span>🔁 habits</span>
      <span>⚡ happening now</span>
      <span>🏆 новая медаль</span>
    </div>
    <div class="result-actions">
      <button class="primary-button" type="button" data-action="replay">Сыграть ещё раз</button>
      <button class="secondary-button" type="button" data-action="hear-praise">Послушать Винни</button>
    </div>
  `;
}

function resetGame() {
  state.score = 0;
  state.streak = 0;
  state.choiceIndex = 0;
  state.choiceSolved.clear();
  state.sortIndex = 0;
  state.sorted = { simple: [], continuous: [] };
  state.finalIndex = 0;
  state.finalSolved.clear();
  updateScore();
  renderIntro();
}

function resolveChoice(button, isFinal = false) {
  const questions = isFinal ? finalQuestions : choiceQuestions;
  const index = isFinal ? state.finalIndex : state.choiceIndex;
  const question = questions[index];
  const value = button.dataset[isFinal ? "finalAnswer" : "answer"];
  const feedback = document.querySelector("#feedback");
  const solvedSet = isFinal ? state.finalSolved : state.choiceSolved;

  if (value !== question.answer) {
    button.classList.add("is-wrong");
    button.disabled = true;
    state.streak = 0;
    feedback.className = "feedback bad";
    feedback.textContent = isFinal ? `Ещё попытка! Смотри на подсказку «${question.clue}».` : question.tip;
    setVincent("thinking", `Почти! Слово «${question.clue}» подскажет нужное время.`, isFinal ? "finalIntro" : "choiceInstruction");
    tone("bad");
    return;
  }

  button.classList.add("is-correct");
  [...button.parentElement.children].forEach((item) => { item.disabled = true; });
  if (!solvedSet.has(index)) {
    updateScore(isFinal ? 15 : 10);
    solvedSet.add(index);
  }
  state.streak += 1;
  feedback.className = "feedback good";
  feedback.textContent = "Верно! +" + (isFinal ? 15 : 10) + " баллов";
  tone("good");
  speak(question.track);

  window.setTimeout(() => {
    if (index + 1 < questions.length) {
      if (isFinal) state.finalIndex += 1;
      else state.choiceIndex += 1;
      isFinal ? renderFinal() : renderChoice();
    } else if (isFinal) {
      renderComplete();
    } else {
      renderSort();
    }
  }, 950);
}

panel.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.dataset.track) {
    tone();
    speak(target.dataset.track);
    return;
  }

  if (target.dataset.action === "start") {
    tone();
    renderRules();
  } else if (target.dataset.action === "choice") {
    tone();
    renderChoice();
  } else if (target.dataset.answer) {
    resolveChoice(target, false);
  } else if (target.dataset.finalAnswer) {
    resolveChoice(target, true);
  } else if (target.dataset.action === "select-card") {
    target.classList.toggle("is-selected");
    tone();
  } else if (target.dataset.zone) {
    const cardButton = document.querySelector(".sort-card");
    const feedback = document.querySelector("#feedback");
    if (!cardButton?.classList.contains("is-selected")) {
      feedback.className = "feedback bad";
      feedback.textContent = "Сначала нажми на карточку, чтобы её взять.";
      tone("bad");
      return;
    }
    const card = sortCards[state.sortIndex];
    if (target.dataset.zone !== card.zone) {
      feedback.className = "feedback bad";
      feedback.textContent = "Проверь: это привычка или происходит сейчас?";
      tone("bad");
      return;
    }
    state.sorted[card.zone].push(card.label);
    state.sortIndex += 1;
    updateScore(10);
    tone("good");
    if (state.sortIndex >= sortCards.length) {
      window.setTimeout(renderFinal, 600);
    } else {
      renderSort();
    }
  } else if (target.dataset.action === "replay") {
    resetGame();
  } else if (target.dataset.action === "hear-praise") {
    speak("complete");
  }
});

document.querySelector("#speak-button").addEventListener("click", () => speak());

soundButton.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  soundButton.setAttribute("aria-pressed", String(state.soundOn));
  soundButton.setAttribute("aria-label", state.soundOn ? "Выключить звук" : "Включить звук");
  soundButton.querySelector("span").textContent = state.soundOn ? "🔊" : "🔇";
  if (state.soundOn) tone("good");
  else if (activeVoiceAudio) {
    activeVoiceAudio.pause();
    activeVoiceAudio.currentTime = 0;
  }
});

document.querySelector("#reset-button").addEventListener("click", resetGame);
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  resetGame();
});

bestScoreElement.textContent = storedBest();
renderIntro();
