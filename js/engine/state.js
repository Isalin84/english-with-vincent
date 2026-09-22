// Профиль ученика в localStorage: имя, звук, лучшие результаты по урокам.

const STORAGE_KEY = "vincent-profile";
const LEGACY_BEST_SCORE_KEY = "vincent-best-score";
const LEGACY_LESSON_ID = "tenses";
const LEGACY_LESSON_MAX = 190;

function defaultProfile() {
  return { name: "", soundOn: true, lessons: {} };
}

function starsFor(score, max) {
  if (!max || max <= 0) return score > 0 ? 1 : 0;
  const ratio = score / max;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  return score > 0 ? 1 : 0;
}

function migrateLegacyScore(profile) {
  let legacyBest = 0;
  try {
    legacyBest = Number(localStorage.getItem(LEGACY_BEST_SCORE_KEY) || 0);
  } catch {
    legacyBest = 0;
  }
  if (legacyBest > 0 && !profile.lessons[LEGACY_LESSON_ID]) {
    profile.lessons[LEGACY_LESSON_ID] = {
      best: legacyBest,
      max: LEGACY_LESSON_MAX,
      stars: starsFor(legacyBest, LEGACY_LESSON_MAX),
      plays: 1,
    };
  }
  return profile;
}

export function loadProfile() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }

  if (raw) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    const profile = { ...defaultProfile(), ...(parsed || {}) };
    profile.lessons = profile.lessons || {};
    return profile;
  }

  // Первый запуск нового профиля: один раз перенесём старый рекорд урока 1.
  const profile = migrateLegacyScore(defaultProfile());
  saveProfile(profile);
  return profile;
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage недоступен (приватный режим и т.п.) — молча игнорируем.
  }
}

export function setName(profile, name) {
  profile.name = String(name || "").trim().slice(0, 20);
  saveProfile(profile);
  return profile;
}

export function setSoundPreference(profile, soundOn) {
  profile.soundOn = Boolean(soundOn);
  saveProfile(profile);
  return profile;
}

export function recordLessonResult(profile, lessonId, score, max) {
  const existing = profile.lessons[lessonId] || { best: 0, max, stars: 0, plays: 0 };
  const best = Math.max(existing.best, score);
  const entry = {
    best,
    max,
    stars: Math.max(existing.stars || 0, starsFor(best, max)),
    plays: (existing.plays || 0) + 1,
  };
  profile.lessons[lessonId] = entry;
  saveProfile(profile);
  return entry;
}

export function totalScore(profile) {
  return Object.values(profile.lessons || {}).reduce((sum, entry) => sum + (entry.best || 0), 0);
}
