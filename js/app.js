// Точка входа: профиль, экраны (Знакомство → Карта → Урок → Правило → Этапы → Итог),
// один делегированный обработчик кликов на #activity-panel и общий header/footer.

import { lessons, lessonMaxScore, lessonTaskCount } from "./lessons/index.js";
import { stickers } from "./lessons/images.js";
import { illustration, initIllustrations } from "./engine/illustrations.js";
import {
  loadProfile,
  setName,
  setSoundPreference,
  recordLessonResult,
  totalScore,
} from "./engine/state.js";
import { initVincent, setVincent, setPlayerName, getCurrentTrack, praise } from "./engine/vincent.js";
import { setSoundOn, isSoundOn, speak, sfx, tone } from "./engine/audio.js";
import {
  initExercises,
  beginStage,
  handleClick as exercisesHandleClick,
  handleKeydown as exercisesHandleKeydown,
  isStageActive,
  abortStage,
} from "./engine/exercises.js";

const profile = loadProfile();

const panel = document.querySelector("#activity-panel");
const scoreEl = document.querySelector("#score");
const totalScoreEl = document.querySelector("#total-score");
const soundButton = document.querySelector("#sound-toggle");
const playerNameButton = document.querySelector("#player-name-button");
const playerNameEl = document.querySelector("#player-name");
const trailEl = document.querySelector("#trail");
const confettiLayer = document.querySelector("#confetti");
const resetButton = document.querySelector("#reset-button");
const brandLink = document.querySelector(".brand");
const speakButton = document.querySelector("#speak-button");

let screen = "welcome"; // welcome | map | intro | rule | stage | complete
let lesson = null;
let stageIndex = 0;
let lessonScore = 0;
let stickerTimer = null;

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function updateHeader() {
  scoreEl.textContent = String(lessonScore);
  totalScoreEl.textContent = String(totalScore(profile));
  playerNameEl.textContent = profile.name || "друг";
}

function burstConfetti(amount = 24) {
  const colors = ["#ffd85a", "#ff7058", "#46cfa2", "#1747d1", "#8f63e9"];
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--drift", `${Math.random() * 240 - 120}px`);
    piece.style.animationDelay = `${Math.random() * 0.22}s`;
    confettiLayer.append(piece);
    window.setTimeout(() => piece.remove(), 2300);
  }
}

// ---------- trail ----------

function buildTrailLabels(l) {
  const seen = new Set();
  const middle = [];
  l.stages.forEach((s) => {
    if (!seen.has(s.trail)) {
      seen.add(s.trail);
      middle.push(s.trail);
    }
  });
  return ["Старт", "Правило", ...middle, "Итог"];
}

function activeTrailIndex(l) {
  if (screen === "intro") return 0;
  if (screen === "rule") return 1;
  if (screen === "stage") {
    const labels = buildTrailLabels(l);
    return labels.indexOf(l.stages[stageIndex].trail);
  }
  if (screen === "complete") return buildTrailLabels(l).length - 1;
  return 0;
}

function renderTrail() {
  if (!lesson) {
    renderMapTrail();
    return;
  }
  const labels = buildTrailLabels(lesson);
  const active = activeTrailIndex(lesson);
  const best = (profile.lessons[lesson.id] && profile.lessons[lesson.id].best) || 0;
  trailEl.innerHTML = `
    <span class="trail-title">Урок ${lesson.number}</span>
    <ol id="trail-steps">
      ${labels
        .map((label, i) => {
          const cls = i === active ? "is-active" : i < active ? "is-done" : "";
          return `<li class="${cls}"><span>${i < active ? "✓" : i + 1}</span><b>${label}</b></li>`;
        })
        .join("")}
    </ol>
    <div class="best-score">Лучший результат: <b>${best}</b> ⭐</div>
  `;
}

function renderMapTrail() {
  const items = lessons
    .map((l) => {
      const done = Boolean(profile.lessons[l.id] && profile.lessons[l.id].best > 0);
      return `<li class="${done ? "is-done" : ""}"><span>${done ? "✓" : l.number}</span><b>Урок ${l.number}</b></li>`;
    })
    .join("");
  trailEl.innerHTML = `
    <span class="trail-title">Карта</span>
    <ol id="trail-steps">${items}</ol>
    <div class="best-score">Всего: <b>${totalScore(profile)}</b> ⭐</div>
  `;
}

// ---------- screens ----------

function clearConfetti() {
  confettiLayer.innerHTML = "";
}

function leaveLesson() {
  window.clearTimeout(stickerTimer);
  abortStage();
  clearConfetti();
}

function goWelcome() {
  leaveLesson();
  screen = "welcome";
  lesson = null;
  lessonScore = 0;
  renderWelcome();
  renderTrail();
  updateHeader();
}

function renderWelcome() {
  setVincent("teacher", { en: "Hi! I'm Vincent. What's your name?", ru: "Привет! Я Винни. Как тебя зовут?" }, "");
  panel.innerHTML = `
    <div class="kicker">👋 Знакомство</div>
    <h1>Как тебя зовут?</h1>
    <p class="lead">Винни хочет познакомиться с тобой, прежде чем начать урок.</p>
    <div class="welcome-form">
      <input type="text" id="name-input" maxlength="20" placeholder="Твоё имя" autocomplete="off" value="${escapeAttr(profile.name)}" />
      <button class="primary-button" type="button" data-action="welcome-submit">Поехали!</button>
    </div>
    <a href="#" class="welcome-skip" data-action="welcome-skip">Пропустить</a>
  `;
  const input = panel.querySelector("#name-input");
  if (input) input.focus();
}

function submitWelcomeName() {
  const input = panel.querySelector("#name-input");
  const value = input ? input.value : "";
  setName(profile, value || "друг");
  setPlayerName(profile.name);
  sfx("click");
  goMap();
}

function goMap() {
  leaveLesson();
  screen = "map";
  lesson = null;
  lessonScore = 0;
  renderMap();
  renderTrail();
  updateHeader();
  speak("map-hello", { queue: true });
}

function renderMap() {
  setVincent(
    "wave",
    { en: "Hello! I am Vincent. Choose a lesson and let us play!", ru: "Привет, {name}! Выбирай урок, и начнём играть!" },
    "map-hello",
  );
  const finishedCount = lessons.filter((l) => profile.lessons[l.id] && profile.lessons[l.id].best > 0).length;
  const cardsHtml = lessons
    .map((l) => {
      const progress = profile.lessons[l.id];
      const stars = progress ? progress.stars : 0;
      const starsHtml = "★".repeat(stars) + "☆".repeat(3 - stars);
      const max = lessonMaxScore(l);
      const tasks = lessonTaskCount(l);
      const played = Boolean(progress && progress.plays > 0);
      return `
        <article class="lesson-card">
          ${illustration(l.cover, "cover")}
          <div class="lesson-card-body">
            <div class="lesson-card-kicker">Урок ${l.number}</div>
            <h3>${l.title}</h3>
            <p class="lesson-card-grammar">${l.grammar}</p>
            <p class="lesson-card-meta">⏱ ${l.minutes} мин · 🎯 ${tasks} заданий · ⭐ ${max} баллов</p>
            <p class="stars" aria-hidden="true">${starsHtml}</p>
            <p class="lesson-card-best">Лучший результат: ${progress ? progress.best : 0}</p>
            <button class="primary-button" type="button" data-action="lesson-start" data-lesson="${escapeAttr(l.id)}">${played ? "Повторить" : "Начать"}</button>
          </div>
        </article>
      `;
    })
    .join("");
  panel.innerHTML = `
    <div class="kicker">🗺️ Карта уроков</div>
    <h1>Карта уроков</h1>
    <div class="map-score-strip">
      <span>⭐ Всего: ${totalScore(profile)}</span>
      <span>Пройдено уроков: ${finishedCount} из ${lessons.length}</span>
    </div>
    <div class="lesson-map">${cardsHtml}</div>
  `;
}

function goIntro(l) {
  leaveLesson();
  screen = "intro";
  lesson = l;
  stageIndex = 0;
  lessonScore = 0;
  renderIntro();
  renderTrail();
  updateHeader();
  speak(l.intro.track);
}

function renderIntro() {
  setVincent("teacher", lesson.intro.bubble, lesson.intro.track);
  const max = lessonMaxScore(lesson);
  const tasks = lessonTaskCount(lesson);
  panel.innerHTML = `
    <div class="kicker"><span aria-hidden="true">⏱️</span> ${lesson.minutes} минут · ${lesson.stages.length} этапов</div>
    <h1>${lesson.intro.heading}</h1>
    <p class="lead">${lesson.intro.lead}</p>
    <div class="mini-features" aria-label="Что будет в уроке">
      <span>🔊 живые примеры</span>
      <span>🎯 ${tasks} заданий</span>
      <span>⭐ ${max} баллов</span>
    </div>
    <button class="primary-button" type="button" data-action="intro-start">Начать приключение</button>
  `;
}

function goRule() {
  clearConfetti();
  screen = "rule";
  renderRule();
  renderTrail();
  updateHeader();
  speak(lesson.rule.track);
}

function renderRule() {
  setVincent("point", lesson.rule.bubble, lesson.rule.track);
  const noteHtml = lesson.rule.note ? `<div class="rule-note">${lesson.rule.note}</div>` : "";
  const cardsHtml = lesson.rule.cards
    .map((card) => {
      const toneClass = card.tone === "now" ? " is-now" : card.tone === "neutral" ? " is-neutral" : "";
      const examplesHtml = (card.examples || [])
        .map(
          (ex) => `
        <div class="example-line">
          <button class="tiny-audio" type="button" data-track="${escapeAttr(ex.track)}" aria-label="Послушать пример">▶</button>
          ${ex.en}
        </div>`,
        )
        .join("");
      return `
        <article class="rule-sheet${toneClass}">
          <h3>${card.title}</h3>
          <p>${card.html}</p>
          <div class="formula">${card.formula}</div>
          ${card.signal ? `<div class="signal-words">${card.signal}</div>` : ""}
          ${examplesHtml}
        </article>
      `;
    })
    .join("");
  panel.innerHTML = `
    <div class="kicker">${lesson.rule.kicker}</div>
    <h2>${lesson.rule.heading}</h2>
    ${noteHtml}
    <div class="rule-grid">${cardsHtml}</div>
    <button class="primary-button" type="button" data-action="rule-continue">${lesson.rule.button}</button>
  `;
}

function goStage(index) {
  clearConfetti();
  screen = "stage";
  stageIndex = index;
  const stage = lesson.stages[index];
  setVincent("thinking", stage.bubble, stage.track);
  renderTrail();
  updateHeader();
  speak(stage.track, { queue: true });
  beginStage(stage, lesson, {
    onPoints: (delta) => {
      lessonScore += delta;
      updateHeader();
    },
    onStageComplete: (earnedForStage) => onStageDone(earnedForStage),
  });
}

function onStageDone(earnedForStage) {
  sfx("stage-done");
  showStickerOverlay(earnedForStage);
}

function showStickerOverlay(earnedForStage) {
  const stickerId = stickers[Math.floor(Math.random() * stickers.length)];
  const p = praise();
  setVincent("jump", p.text, p.track);
  panel.innerHTML = `
    <div class="sticker-overlay">
      ${illustration(stickerId, "sticker-image")}
      <h2>Этап пройден!</h2>
      <p class="lead">+${earnedForStage} баллов</p>
      <p class="praise-line">${p.text}</p>
      <button class="primary-button" type="button" data-action="stage-continue">Дальше</button>
    </div>
  `;
  sfx("sticker");
  speak(p.track, { queue: true });
  window.clearTimeout(stickerTimer);
  stickerTimer = window.setTimeout(() => continueAfterSticker(), 3500);
}

function continueAfterSticker() {
  window.clearTimeout(stickerTimer);
  if (!lesson || screen !== "stage") return;
  const nextIndex = stageIndex + 1;
  if (nextIndex >= lesson.stages.length) {
    goComplete();
  } else {
    goStage(nextIndex);
  }
}

function goComplete() {
  screen = "complete";
  renderComplete();
  renderTrail();
  updateHeader();
}

function renderComplete() {
  const max = lessonMaxScore(lesson);
  const entry = recordLessonResult(profile, lesson.id, lessonScore, max);
  updateHeader();
  setVincent("celebrate", lesson.complete.bubble, lesson.complete.track);
  burstConfetti(70);
  sfx("lesson-done");
  speak(lesson.complete.track, { queue: true });
  const starsHtml = "★".repeat(entry.stars) + "☆".repeat(3 - entry.stars);
  const chipsHtml = (lesson.complete.chips || []).map((c) => `<span>${c}</span>`).join("");
  panel.innerHTML = `
    <div class="result-badge"><div><span>${lesson.badge.emoji}</span><b>${lesson.badge.name}</b></div></div>
    <h2>${lesson.complete.heading}</h2>
    <p class="lead">Твой результат: <b>${lessonScore} из ${max} баллов</b> <span class="stars" aria-hidden="true">${starsHtml}</span><br />${lesson.complete.lead}</p>
    <div class="mini-features">${chipsHtml}</div>
    <div class="result-actions">
      <button class="primary-button" type="button" data-action="go-map">На карту</button>
      <button class="secondary-button" type="button" data-action="replay-lesson">Ещё раз</button>
    </div>
  `;
}

// ---------- input ----------

panel.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.dataset.action === "stage-continue") {
    event.preventDefault();
    sfx("click");
    continueAfterSticker();
    return;
  }

  if (screen === "stage" && isStageActive()) {
    if (exercisesHandleClick(event)) return;
  }

  if (target.dataset.track) {
    sfx("click");
    speak(target.dataset.track);
    return;
  }

  switch (target.dataset.action) {
    case "welcome-submit":
      event.preventDefault();
      submitWelcomeName();
      return;
    case "welcome-skip":
      event.preventDefault();
      setName(profile, "друг");
      setPlayerName(profile.name);
      sfx("click");
      goMap();
      return;
    case "lesson-start": {
      const found = lessons.find((l) => l.id === target.dataset.lesson);
      if (found) {
        sfx("click");
        goIntro(found);
      }
      return;
    }
    case "intro-start":
      sfx("click");
      goRule();
      return;
    case "rule-continue":
      sfx("click");
      goStage(0);
      return;
    case "go-map":
      sfx("click");
      goMap();
      return;
    case "replay-lesson":
      sfx("click");
      goIntro(lesson);
      return;
    default:
      return;
  }
});

panel.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  if (screen === "welcome" && event.target && event.target.id === "name-input") {
    event.preventDefault();
    submitWelcomeName();
    return;
  }
  if (screen === "stage" && isStageActive()) {
    exercisesHandleKeydown(event);
  }
});

speakButton?.addEventListener("click", () => {
  speak(getCurrentTrack());
});

soundButton.addEventListener("click", () => {
  const next = !isSoundOn();
  setSoundOn(next);
  setSoundPreference(profile, next);
  applySoundButtonUI();
  if (next) tone("good");
});

function applySoundButtonUI() {
  const on = isSoundOn();
  soundButton.setAttribute("aria-pressed", String(on));
  soundButton.setAttribute("aria-label", on ? "Выключить звук" : "Включить звук");
  soundButton.querySelector("span").textContent = on ? "🔊" : "🔇";
}

resetButton.addEventListener("click", () => {
  sfx("click");
  goMap();
});

brandLink.addEventListener("click", (event) => {
  event.preventDefault();
  sfx("click");
  goMap();
});

playerNameButton?.addEventListener("click", () => {
  sfx("click");
  goWelcome();
});
playerNameButton?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    sfx("click");
    goWelcome();
  }
});

// ---------- boot ----------

function boot() {
  initVincent();
  initExercises(panel);
  initIllustrations();
  setSoundOn(profile.soundOn !== false);
  applySoundButtonUI();
  setPlayerName(profile.name);
  if (!profile.name) {
    goWelcome();
  } else {
    goMap();
  }
}

boot();
