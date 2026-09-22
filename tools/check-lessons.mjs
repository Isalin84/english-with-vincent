#!/usr/bin/env node
// Проверка инвариантов данных уроков (см. AGENTS.md). Запуск: node tools/check-lessons.mjs
import { existsSync } from "node:fs";
import { lessons, lessonMaxScore, lessonTaskCount } from "../js/lessons/index.js";
import { images } from "../js/lessons/images.js";

const problems = [];
const tracks = new Map();
const missingAudio = [];

function track(key, where) {
  if (!key) return;
  if (tracks.has(key) && tracks.get(key) !== where) problems.push(`дубль track «${key}»: ${tracks.get(key)} и ${where}`);
  tracks.set(key, where);
  if (!existsSync(`public/audio/${key}.mp3`)) missingAudio.push(key);
}
function image(id, where) {
  if (id && !images[id]) problems.push(`image «${id}» нет в images.js (${where})`);
}

for (const l of lessons) {
  const where = `урок ${l.number}`;
  track(l.intro.track, `${where} intro`);
  track(l.rule.track, `${where} rule`);
  track(l.complete.track, `${where} complete`);
  image(l.cover, `${where} cover`);
  for (const c of l.rule.cards) for (const e of c.examples || []) track(e.track, `${where} example`);
  for (const s of l.stages) {
    const sw = `${where} / ${s.id}`;
    track(s.track, sw);
    if (!s.points) problems.push(`${sw}: нет points`);
    if (s.kind === "sort") {
      for (const c of s.cards) if (!s.zones.some((z) => z.id === c.zone)) problems.push(`${sw}: у карточки «${c.label}» зона «${c.zone}» не из списка`);
    } else if (s.kind === "story") {
      image(s.image, sw);
      track(s.readTrack, `${sw} readTrack`);
      s.gaps.forEach((g, i) => {
        if (!s.text.includes(`{{${i + 1}}}`)) problems.push(`${sw}: в тексте нет {{${i + 1}}}`);
        if (!s.options.includes(g.answer)) problems.push(`${sw}: ответ «${g.answer}» гапа ${i + 1} не из options`);
      });
    } else {
      for (const it of s.items) {
        image(it.image, sw);
        track(it.track, sw);
        if (s.kind === "choice") {
          if (!it.options.includes(it.answer)) problems.push(`${sw}: «${it.text}» ответ не из options`);
          if (!it.text.includes("___")) problems.push(`${sw}: «${it.text}» без пропуска`);
          if (it.clue && !it.text.includes(it.clue)) problems.push(`${sw}: clue «${it.clue}» не входит в text`);
        }
        if (s.kind === "type" && !it.text.includes("___")) problems.push(`${sw}: «${it.text}» без пропуска`);
        if (s.kind === "build" && it.answer.split(" ").length < 3) problems.push(`${sw}: слишком короткое «${it.answer}»`);
      }
    }
  }
  console.log(`Урок ${l.number} (${l.id}): ${lessonTaskCount(l)} заданий, ${lessonMaxScore(l)} баллов`);
}

const banned = /привычк|регулярн|форм[аыу] глагол|\bhabits?\b|happening now/i;
function walkStrings(value, fn) {
  if (typeof value === "string") fn(value);
  else if (Array.isArray(value)) value.forEach((v) => walkStrings(v, fn));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => walkStrings(v, fn));
}
for (const l of lessons) {
  // Проверяем только русские строки: английские реплики (транскрипты аудио) могут содержать habit.
  walkStrings(l, (str) => {
    if (!/[а-яё]/i.test(str)) return;
    const m = str.match(banned);
    if (m) problems.push(`урок ${l.number}: запрещённое слово «${m[0]}» в «${str.slice(0, 60)}…»`);
  });
}

console.log(`Дорожек в данных: ${tracks.size}; без файла: ${missingAudio.length}${missingAudio.length ? " → " + missingAudio.join(", ") : ""}`);
if (problems.length) {
  console.error("Проблемы:\n- " + problems.join("\n- "));
  process.exit(1);
}
console.log("Инварианты соблюдены.");
