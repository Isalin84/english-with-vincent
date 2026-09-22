// Управление персонажем Винни: поза, речевой пузырь, поздравления.

const IMAGES = {
  teacher: "public/assets/vincent-teacher.webp",
  thinking: "public/assets/vincent-thinking.webp",
  celebrate: "public/assets/vincent-celebrate.webp",
  // Новые позы (иллюстрации от ChatGPT, см. tasks/illustrations-spec.md)
  wave: "public/assets/illustrations/vincent-wave.webp",
  point: "public/assets/illustrations/vincent-point.webp",
  jump: "public/assets/illustrations/vincent-jump.webp",
};

let vincentImage = null;
let speechText = null;
let playerName = "друг";
let currentTrack = "";

export function initVincent() {
  vincentImage = document.querySelector("#vincent-image");
  speechText = document.querySelector("#speech-text");
}

export function setPlayerName(name) {
  const trimmed = String(name || "").trim();
  playerName = trimmed || "друг";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fillTemplate(text, extra) {
  return text.replace(/\{name\}/g, escapeHtml(playerName)).replace(/\{clue\}/g, extra.clue != null ? escapeHtml(extra.clue) : "");
}

export function getCurrentTrack() {
  return currentTrack;
}

// bubble: строка (только RU) или { en, ru }. extra: { clue } для подстановки в шаблон.
export function setVincent(mode, bubble, track, extra = {}) {
  currentTrack = track || "";
  if (speechText) {
    const parts = typeof bubble === "string" ? { ru: bubble } : bubble || {};
    const en = parts.en ? fillTemplate(parts.en, extra) : "";
    const ru = parts.ru ? fillTemplate(parts.ru, extra) : "";
    speechText.innerHTML = en
      ? `<span class="speech-en">${en}</span><span class="speech-ru">${ru}</span>`
      : `<span class="speech-ru">${ru}</span>`;
  }
  if (vincentImage) {
    const next = IMAGES[mode] || IMAGES.teacher;
    if (vincentImage.getAttribute("src") !== next) {
      vincentImage.classList.add("is-changing");
      window.setTimeout(() => {
        vincentImage.src = next;
        vincentImage.classList.remove("is-changing");
      }, 170);
    }
  }
}

const PRAISE_EN = [
  { track: "praise-en-1", text: "Great job!" },
  { track: "praise-en-2", text: "High paw! Well done!" },
  { track: "praise-en-3", text: "Excellent! You are a star!" },
];
const PRAISE_RU = [
  { track: "praise-ru-1", text: "Молодец!" },
  { track: "praise-ru-2", text: "Отлично!" },
  { track: "praise-ru-3", text: "Супер! Так держать!" },
  { track: "praise-ru-4", text: "Ура! Правильно!" },
];

let praiseCount = 0;
export function praise() {
  const useEn = praiseCount % 2 === 0;
  const langIndex = Math.floor(praiseCount / 2);
  praiseCount += 1;
  const list = useEn ? PRAISE_EN : PRAISE_RU;
  return list[langIndex % list.length];
}

const CHEER = [
  { track: "cheer-en-1", text: "Almost! Try again." },
  { track: "cheer-ru-1", text: "Почти! Попробуй ещё раз." },
  { track: "cheer-ru-2", text: "Ничего страшного. Давай ещё разок!" },
];

let cheerCount = 0;
export function cheer() {
  const item = CHEER[cheerCount % CHEER.length];
  cheerCount += 1;
  return item;
}
