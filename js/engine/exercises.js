// Движок пяти типов заданий: choice, type, sort, build, story.
// Рендерит текущий экран этапа в панель и обрабатывает клики/Enter внутри неё.

import { checkAnswer } from "./check.js";
import { illustration } from "./illustrations.js";
import { speak, sfx } from "./audio.js";
import { setVincent, cheer } from "./vincent.js";

let panelEl = null;
let session = null;
let hooks = null; // { onPoints(delta), onStageComplete(earnedForStage) }

export function initExercises(panel) {
  panelEl = panel;
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function itemsLength(stage) {
  if (stage.kind === "sort") return stage.cards.length;
  if (stage.kind === "story") return stage.gaps.length;
  return stage.items.length;
}

function setWrongVincent(stage, extra = {}) {
  if (stage.wrongBubble) {
    setVincent("thinking", stage.wrongBubble, stage.track, extra);
  } else {
    const c = cheer();
    setVincent("thinking", c.text, c.track);
  }
}

function shuffledWords(answer, extra) {
  const words = answer.split(" ");
  const pool = [...words, ...(extra || [])];
  const original = pool.join("|");
  let attempt = pool;
  for (let tries = 0; tries < 8; tries += 1) {
    attempt = [...pool];
    for (let i = attempt.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [attempt[i], attempt[j]] = [attempt[j], attempt[i]];
    }
    if (attempt.join("|") !== original) break;
  }
  return attempt;
}

function setupBuildItem() {
  const stage = session.stage;
  const item = stage.items[session.index];
  if (!item) return;
  session.buildBank = shuffledWords(item.answer, item.extra);
  session.buildRow = [];
}

// ---------- lifecycle ----------

export function beginStage(stage, lesson, stageHooks) {
  hooks = stageHooks;
  session = {
    stage,
    lesson,
    index: 0,
    attempts: 0,
    streak: 0,
    earned: 0,
    answered: false,
    revealed: false,
    wrongOptions: new Set(),
    feedbackHtml: null,
    feedbackClass: null,
    typedValue: null,
  };
  if (stage.kind === "sort") {
    session.sorted = {};
    stage.zones.forEach((zone) => { session.sorted[zone.id] = []; });
  }
  if (stage.kind === "build") {
    setupBuildItem();
  }
  if (stage.kind === "story") {
    session.gapStatus = stage.gaps.map(() => null);
    session.gapValue = stage.gaps.map(() => "");
  }
  render();
  focusTypeInputIfDesktop();
}

function render() {
  if (!panelEl || !session) return;
  panelEl.innerHTML = buildHtml();
}

function buildHtml() {
  const stage = session.stage;
  switch (stage.kind) {
    case "choice":
      return renderChoice();
    case "type":
      return renderType();
    case "sort":
      return renderSort();
    case "build":
      return renderBuild();
    case "story":
      return renderStory();
    default:
      return "";
  }
}

function metaLine(index, total) {
  return `<div class="question-meta"><span>Вопрос ${index + 1} из ${total}</span><span class="streak">🔥 Серия: ${session.streak}</span></div>`;
}

function itemImageHtml(item) {
  return item && item.image ? illustration(item.image, "item-image") : "";
}

function translationLine(item) {
  if (!session.answered || !item || !item.ru) return "";
  return `<p class="translation">${item.ru}</p>`;
}

function highlightClue(text, clue) {
  if (!clue) return text;
  return text.replace(clue, `<span class="clue">${clue}</span>`);
}

function nextButton() {
  return `<button class="secondary-button" type="button" data-action="next-item">Дальше</button>`;
}

// ---------- choice ----------

function renderChoice() {
  const stage = session.stage;
  const item = stage.items[session.index];
  const clueHtml = stage.showClue && item.clue
    ? `<p class="clue-hint">💡 ${item.clue} — ${(session.lesson.clueTranslations && session.lesson.clueTranslations[item.clue]) || ""}</p>`
    : "";
  const feedback = session.feedbackHtml || "Выбери один ответ.";
  const optionsHtml = item.options
    .map((option) => {
      let cls = "answer-button";
      let disabled = "";
      const isAnswer = option === item.answer;
      const wasPicked = session.wrongOptions.has(option);
      if (session.answered) {
        disabled = "disabled";
        if (isAnswer) cls += " is-correct";
        else if (wasPicked) cls += " is-wrong";
      } else if (wasPicked) {
        cls += " is-wrong";
        disabled = "disabled";
      }
      return `<button class="${cls}" type="button" data-answer="${escapeAttr(option)}" ${disabled}>${option}</button>`;
    })
    .join("");

  return `
    <div class="kicker">${stage.kicker}</div>
    <h2>${stage.title}</h2>
    ${metaLine(session.index, stage.items.length)}
    <div class="question-card">
      ${itemImageHtml(item)}
      <p>${highlightClue(item.text, item.clue)}</p>
      ${clueHtml}
      ${translationLine(item)}
      <div class="answer-grid">${optionsHtml}</div>
      <p class="feedback ${session.feedbackClass || ""}" id="feedback">${feedback}</p>
      ${session.revealed ? nextButton() : ""}
    </div>
  `;
}

function onChoiceAnswer(value) {
  if (session.answered) return;
  const stage = session.stage;
  const item = stage.items[session.index];
  if (value === item.answer) {
    resolveCorrect(item);
    return;
  }
  session.wrongOptions.add(value);
  session.attempts += 1;
  session.streak = 0;
  sfx("wrong");
  if (session.attempts >= 2) {
    session.answered = true;
    session.revealed = true;
    session.feedbackClass = "bad";
    session.feedbackHtml = `Правильный ответ: ${item.answer}`;
  } else {
    session.feedbackClass = "bad";
    session.feedbackHtml = item.tip || "Попробуй ещё раз.";
  }
  setWrongVincent(stage, { clue: item.clue });
  render();
}

// ---------- type ----------

function renderType() {
  const stage = session.stage;
  const item = stage.items[session.index];
  const blankText = item.text.replace("___", "＿＿＿");
  const hintHtml = item.hint ? `<p class="clue-hint">💡 ${item.hint}</p>` : "";
  const feedback = session.feedbackHtml || "Напиши ответ и нажми «Проверить».";
  const value = session.typedValue != null ? session.typedValue : "";
  const disabled = session.answered ? "disabled" : "";

  return `
    <div class="kicker">${stage.kicker}</div>
    <h2>${stage.title}</h2>
    ${metaLine(session.index, stage.items.length)}
    <div class="question-card">
      ${itemImageHtml(item)}
      <p>${blankText}</p>
      ${hintHtml}
      ${translationLine(item)}
      <div class="type-form">
        <input class="type-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
          placeholder="${escapeAttr(stage.placeholder || "")}" value="${escapeAttr(value)}" data-role="type-input" ${disabled} />
        <button class="primary-button" type="button" data-action="check-type" ${disabled}>Проверить</button>
      </div>
      <p class="feedback ${session.feedbackClass || ""}" id="feedback">${feedback}</p>
      ${session.revealed ? nextButton() : ""}
    </div>
  `;
}

function readTypeInputValue() {
  const input = panelEl.querySelector('[data-role="type-input"]');
  return input ? input.value : "";
}

function focusTypeInputIfDesktop() {
  if (!session || session.stage.kind !== "type") return;
  if (window.innerWidth <= 880) return;
  window.requestAnimationFrame(() => {
    const input = panelEl.querySelector('[data-role="type-input"]');
    if (input) input.focus();
  });
}

function selectTypeInput() {
  window.requestAnimationFrame(() => {
    const input = panelEl.querySelector('[data-role="type-input"]');
    if (input) {
      input.focus();
      input.select();
    }
  });
}

function onCheckType() {
  if (session.answered) return;
  const stage = session.stage;
  const item = stage.items[session.index];
  const value = readTypeInputValue();
  session.typedValue = value;
  const result = checkAnswer(value, item);

  if (result.status === "correct") {
    resolveCorrect(item);
    return;
  }

  session.attempts += 1;
  session.streak = 0;
  sfx("wrong");

  if (session.attempts >= 2) {
    session.answered = true;
    session.revealed = true;
    session.typedValue = item.answer;
    session.feedbackClass = "bad";
    session.feedbackHtml = `Правильный ответ: ${item.answer}`;
    setWrongVincent(stage, { clue: item.clue });
    render();
    return;
  }

  if (result.status === "near") {
    session.feedbackClass = "bad";
    session.feedbackHtml = `Почти! Проверь написание: ${result.diffHtml}`;
  } else {
    session.feedbackClass = "bad";
    session.feedbackHtml = item.tip || "Попробуй ещё раз.";
  }
  setWrongVincent(stage, { clue: item.clue });
  render();
  selectTypeInput();
}

// ---------- sort ----------

function zoneTitle(stage, zoneId) {
  const zone = stage.zones.find((z) => z.id === zoneId);
  return zone ? zone.title : zoneId;
}

function renderSort() {
  const stage = session.stage;
  const card = stage.cards[session.index];
  const zonesHtml = stage.zones
    .map((zone) => `
      <button class="sort-zone" type="button" data-zone="${escapeAttr(zone.id)}">
        <b>${zone.title}</b><span>${zone.sub}</span>
        <div class="sorted-list">${(session.sorted[zone.id] || []).map((label) => `<i class="sorted-chip">${label}</i>`).join("")}</div>
      </button>`)
    .join("");
  const feedback = session.feedbackHtml || (session.index === 0 ? "Нажми на домик для этой карточки." : "Отлично! Продолжай.");

  return `
    <div class="kicker">${stage.kicker}</div>
    <h2>${stage.title}</h2>
    <p class="sort-instruction">Карточка ${Math.min(session.index + 1, stage.cards.length)} из ${stage.cards.length}.</p>
    ${card ? `<div class="sort-card is-selected">${card.label}<small>${card.sub || ""}</small></div>` : ""}
    <div class="sort-zones" data-count="${stage.zones.length}">${zonesHtml}</div>
    <p class="feedback ${session.feedbackClass || ""}" id="feedback">${feedback}</p>
  `;
}

function onSortZone(zoneId) {
  const stage = session.stage;
  const card = stage.cards[session.index];
  if (!card) return;

  if (zoneId === card.zone) {
    const points = session.attempts === 0 ? stage.points : Math.ceil(stage.points / 2);
    session.sorted[zoneId].push(card.label);
    session.earned += points;
    session.streak += 1;
    session.attempts = 0;
    hooks.onPoints(points);
    sfx("correct");
    session.feedbackClass = "good";
    session.feedbackHtml = `Верно! +${points} баллов`;
    session.index += 1;
    render();
    if (session.index >= stage.cards.length) {
      later(() => finishStage(), 500);
    }
    return;
  }

  session.attempts += 1;
  session.streak = 0;
  sfx("wrong");

  if (session.attempts >= 2) {
    session.sorted[card.zone].push(card.label);
    session.feedbackClass = "bad";
    session.feedbackHtml = `Отправляем в домик «${zoneTitle(stage, card.zone)}» — так правильно.`;
    session.attempts = 0;
    session.index += 1;
    render();
    if (session.index >= stage.cards.length) {
      later(() => finishStage(), 900);
    }
    return;
  }

  session.feedbackClass = "bad";
  session.feedbackHtml = stage.wrongTip || "Подумай ещё раз.";
  setWrongVincent(stage, { clue: card.label });
  render();
}

// ---------- build ----------

function renderBuild() {
  const stage = session.stage;
  const item = stage.items[session.index];
  const feedback = session.feedbackHtml || "Собери предложение из слов.";
  const rowHtml = session.buildRow
    .map((word, i) => `<button class="tile" type="button" data-row-index="${i}" ${session.answered ? "disabled" : ""}>${word}</button>`)
    .join("");
  const bankHtml = session.buildBank
    .map((word, i) => `<button class="tile" type="button" data-bank-index="${i}" ${session.answered ? "disabled" : ""}>${word}</button>`)
    .join("");

  return `
    <div class="kicker">${stage.kicker}</div>
    <h2>${stage.title}</h2>
    ${metaLine(session.index, stage.items.length)}
    <div class="question-card">
      ${itemImageHtml(item)}
      <p class="build-row-label">Собери здесь</p>
      <div class="build-row">${rowHtml}</div>
      <div class="build-bank">${bankHtml}</div>
      ${translationLine(item)}
      <p class="feedback ${session.feedbackClass || ""}" id="feedback">${feedback}</p>
      <div class="result-actions">
        <button class="primary-button" type="button" data-action="check-build" ${session.answered ? "disabled" : ""}>Проверить</button>
        ${session.revealed ? nextButton() : ""}
      </div>
    </div>
  `;
}

function onBankTile(index) {
  if (session.answered) return;
  const word = session.buildBank[index];
  if (word === undefined) return;
  session.buildBank.splice(index, 1);
  session.buildRow.push(word);
  sfx("click");
  render();
}

function onRowTile(index) {
  if (session.answered) return;
  const word = session.buildRow[index];
  if (word === undefined) return;
  session.buildRow.splice(index, 1);
  session.buildBank.push(word);
  sfx("click");
  render();
}

function onCheckBuild() {
  if (session.answered) return;
  const stage = session.stage;
  const item = stage.items[session.index];
  const sentence = session.buildRow.join(" ");

  if (sentence === item.answer) {
    resolveCorrect(item);
    return;
  }

  session.attempts += 1;
  session.streak = 0;
  sfx("wrong");

  if (session.attempts >= 2) {
    session.answered = true;
    session.revealed = true;
    session.buildRow = item.answer.split(" ");
    session.buildBank = [];
    session.feedbackClass = "bad";
    session.feedbackHtml = "Вот правильный порядок слов.";
  } else {
    session.feedbackClass = "bad";
    session.feedbackHtml = "Не совсем. Порядок слов другой.";
  }
  setWrongVincent(stage, {});
  render();
}

// ---------- story ----------

function currentGapIndex() {
  return session.gapStatus.findIndex((status) => status === null);
}

function renderStory() {
  const stage = session.stage;
  const activeGap = currentGapIndex();
  const allDone = activeGap === -1;

  const textHtml = stage.text.replace(/\{\{(\d+)\}\}/g, (match, num) => {
    const idx = Number(num) - 1;
    const status = session.gapStatus[idx];
    const isCurrent = idx === activeGap;
    let cls = "gap";
    let label = "…";
    if (status) {
      cls += " is-done";
      label = session.gapValue[idx] === "—" ? "∅" : session.gapValue[idx];
    } else if (isCurrent) {
      cls += " is-current";
    }
    return `<button class="${cls}" type="button" data-gap-index="${idx}" ${status ? "disabled" : ""}>${label}</button>`;
  });

  const optionsHtml = !allDone
    ? stage.options
        .map((option) => {
          const label = option === "—" ? `<span class="gap-none">без слова</span>` : option;
          return `<button class="answer-button" type="button" data-gap-option="${escapeAttr(option)}">${label}</button>`;
        })
        .join("")
    : "";

  const feedback = session.feedbackHtml || (allDone ? "Рассказ завершён!" : "Выбери слово для пропуска.");

  return `
    <div class="kicker">${stage.kicker}</div>
    <h2>${stage.title}</h2>
    <div class="question-card story-card">
      ${stage.image ? illustration(stage.image, "item-image") : ""}
      <p class="story-text">${textHtml}</p>
      ${!allDone ? `<div class="answer-grid">${optionsHtml}</div>` : ""}
      <p class="feedback ${session.feedbackClass || ""}" id="feedback">${feedback}</p>
      ${allDone && stage.ru ? `<p class="translation">${stage.ru}</p>` : ""}
    </div>
  `;
}

function onStoryOption(value) {
  const stage = session.stage;
  const idx = currentGapIndex();
  if (idx === -1) return;
  const gap = stage.gaps[idx];

  if (value === gap.answer) {
    const points = session.attempts === 0 ? stage.points : Math.ceil(stage.points / 2);
    session.earned += points;
    session.gapStatus[idx] = "correct";
    session.gapValue[idx] = value;
    session.streak += 1;
    session.attempts = 0;
    hooks.onPoints(points);
    sfx("correct");
    session.feedbackClass = "good";
    session.feedbackHtml = `Верно! +${points} баллов`;
    finishGapOrRender(stage);
    return;
  }

  session.attempts += 1;
  session.streak = 0;
  sfx("wrong");

  if (session.attempts >= 2) {
    session.gapStatus[idx] = "revealed";
    session.gapValue[idx] = gap.answer;
    session.attempts = 0;
    session.feedbackClass = "bad";
    session.feedbackHtml = `Правильный ответ: ${gap.answer === "—" ? "без слова" : gap.answer}`;
    finishGapOrRender(stage);
    return;
  }

  session.feedbackClass = "bad";
  session.feedbackHtml = gap.tip || "Подумай ещё раз.";
  setWrongVincent(stage, {});
  render();
}

function finishGapOrRender(stage) {
  render();
  if (currentGapIndex() === -1) {
    if (stage.readTrack) speak(stage.readTrack);
    later(() => finishStage(), 1200);
  }
}

// ---------- shared: correct-answer resolution & advancing ----------

function resolveCorrect(item) {
  const stage = session.stage;
  const points = session.attempts === 0 ? stage.points : Math.ceil(stage.points / 2);
  session.earned += points;
  session.answered = true;
  session.streak += 1;
  session.feedbackClass = "good";
  session.feedbackHtml = `Верно! +${points} баллов`;
  sfx("correct");
  if (item.track) speak(item.track);
  hooks.onPoints(points);
  render();
  later(() => advanceItem(), 950);
}

function advanceItem() {
  if (!session) return;
  session.index += 1;
  session.attempts = 0;
  session.answered = false;
  session.revealed = false;
  session.wrongOptions = new Set();
  session.feedbackHtml = null;
  session.feedbackClass = null;
  session.typedValue = null;

  if (session.index >= itemsLength(session.stage)) {
    finishStage();
    return;
  }
  if (session.stage.kind === "build") setupBuildItem();
  render();
  focusTypeInputIfDesktop();
}

function finishStage() {
  if (!session) return; // этап уже прерван (ученик ушёл на карту) или завершён
  const earned = session.earned;
  const doneHooks = hooks;
  session = null;
  hooks = null;
  if (doneHooks && doneHooks.onStageComplete) doneHooks.onStageComplete(earned);
}

// Прервать этап при уходе с экрана: отложенные таймеры проверяют, что сессия та же.
export function abortStage() {
  session = null;
  hooks = null;
}

// Таймер, который срабатывает только если этап за это время не сменился.
function later(fn, delay) {
  const current = session;
  window.setTimeout(() => {
    if (session && session === current) fn();
  }, delay);
}

// ---------- input dispatch ----------

export function handleClick(event) {
  if (!session) return false;
  const target = event.target.closest("button");
  if (!target) return false;
  const stage = session.stage;

  if (target.dataset.track) {
    sfx("click");
    speak(target.dataset.track);
    return true;
  }
  if (target.dataset.action === "next-item") {
    sfx("click");
    advanceItem();
    return true;
  }
  if (stage.kind === "choice" && target.dataset.answer !== undefined) {
    onChoiceAnswer(target.dataset.answer);
    return true;
  }
  if (stage.kind === "type" && target.dataset.action === "check-type") {
    onCheckType();
    return true;
  }
  if (stage.kind === "sort" && target.dataset.zone !== undefined) {
    onSortZone(target.dataset.zone);
    return true;
  }
  if (stage.kind === "build") {
    if (target.dataset.bankIndex !== undefined) {
      onBankTile(Number(target.dataset.bankIndex));
      return true;
    }
    if (target.dataset.rowIndex !== undefined) {
      onRowTile(Number(target.dataset.rowIndex));
      return true;
    }
    if (target.dataset.action === "check-build") {
      onCheckBuild();
      return true;
    }
  }
  if (stage.kind === "story" && target.dataset.gapOption !== undefined) {
    onStoryOption(target.dataset.gapOption);
    return true;
  }
  return false;
}

export function handleKeydown(event) {
  if (!session || session.stage.kind !== "type") return false;
  if (event.key !== "Enter") return false;
  const target = event.target;
  if (!target || target.dataset?.role !== "type-input") return false;
  event.preventDefault();
  onCheckType();
  return true;
}

export function isStageActive() {
  return Boolean(session);
}
