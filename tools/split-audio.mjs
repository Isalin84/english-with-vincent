#!/usr/bin/env node
// Режет один mp3 (пакет фраз из ElevenLabs) на N файлов по паузам.
// Использование: node tools/split-audio.mjs input.mp3 key1 key2 ... keyN
// Результат: public/audio/<key>.mp3. Если пауз найдено не N-1, ничего не пишет.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";

const [input, ...keys] = process.argv.slice(2);
if (!input || keys.length < 2) {
  console.error("usage: node tools/split-audio.mjs input.mp3 key1 key2 ... keyN");
  process.exit(2);
}
const outDir = path.resolve("public/audio");
mkdirSync(outDir, { recursive: true });

const NOISE = process.env.SPLIT_NOISE || "-35dB";
const MIN_SILENCE = Number(process.env.SPLIT_MIN || 0.35);

function detect(noise, minSilence) {
  // silencedetect пишет в stderr
  const run = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", input, "-af", `silencedetect=noise=${noise}:d=${minSilence}`, "-f", "null", "-"],
    { encoding: "utf8" },
  );
  const log = `${run.stdout}\n${run.stderr}`;
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const duration = Number((log.match(/Duration: (\d+):(\d+):([\d.]+)/) || []).slice(1).reduce((a, v, i) => a + Number(v) * [3600, 60, 1][i], 0));
  // Внутренние паузы: без ведущей (start≈0) и хвостовой (end≈duration)
  const gaps = [];
  for (let i = 0; i < starts.length; i += 1) {
    const s = starts[i];
    const e = ends[i] ?? duration;
    if (s < 0.05) continue;
    if (e >= duration - 0.05) continue;
    gaps.push({ s, e, mid: (s + e) / 2, len: e - s });
  }
  return { gaps, duration };
}

// Пробуем несколько порогов: берём первый, который даёт ровно N-1 пауз;
// если пауз больше, оставляем N-1 самых длинных.
const want = keys.length - 1;
let chosen = null;
for (const minSilence of [MIN_SILENCE, 0.45, 0.55, 0.3, 0.25]) {
  const { gaps, duration } = detect(NOISE, minSilence);
  if (gaps.length === want) { chosen = { gaps, duration }; break; }
  if (gaps.length > want && !chosen) {
    const top = [...gaps].sort((a, b) => b.len - a.len).slice(0, want).sort((a, b) => a.mid - b.mid);
    chosen = { gaps: top, duration, note: `взяты ${want} самых длинных пауз из ${gaps.length} (min=${minSilence})` };
  }
}
if (!chosen) {
  const { gaps } = detect(NOISE, MIN_SILENCE);
  console.error(`Найдено пауз: ${gaps.length}, нужно ${want}. Файлы не записаны. Запишите фразы пакета по одной.`);
  process.exit(1);
}
if (chosen.note) console.log(chosen.note);

// Режем не по середине паузы, а вплотную к речи: небольшой хвост тишины остаётся с обеих сторон.
const TAIL = 0.15;
keys.forEach((key, i) => {
  const out = path.join(outDir, `${key}.mp3`);
  const start = i === 0 ? 0 : Math.max(0, chosen.gaps[i - 1].e - TAIL);
  const end = i === keys.length - 1 ? chosen.duration : Math.min(chosen.duration, chosen.gaps[i].s + TAIL);
  // ffmpeg 8.x падает при фильтрах прямо в libmp3lame («inadequate AVFrame plane padding»), поэтому через wav.
  const wav = out.replace(/\.mp3$/, ".tmp.wav");
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", input, "-ss", String(start), "-to", String(end), "-ar", "44100", "-ac", "1", wav]);
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", wav, "-c:a", "libmp3lame", "-b:a", "128k", out]);
  unlinkSync(wav);
  console.log(`${key}.mp3  ${start.toFixed(2)}–${end.toFixed(2)} s`);
});
console.log(existsSync(path.join(outDir, `${keys[0]}.mp3`)) ? "ok" : "ошибка записи");
