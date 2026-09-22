// Звук: голосовые дорожки (speak) и короткие эффекты (sfx), с запасным синтезатором tone().

let soundOn = true;
let activeVoiceAudio;
let audioContext;
const sfxFailed = new Set();

export function setSoundOn(value) {
  soundOn = Boolean(value);
  if (!soundOn && activeVoiceAudio) {
    activeVoiceAudio.pause();
    activeVoiceAudio.currentTime = 0;
  }
}

export function isSoundOn() {
  return soundOn;
}

export function tone(kind = "click") {
  if (!soundOn) return;
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

// speak(track): сразу, обрывая текущую реплику. speak(track, { queue: true }): после того,
// как договорит текущая (например, похвала после прочитанного предложения).
export function speak(track, { queue = false } = {}) {
  if (!soundOn || !track) return;
  const playing = activeVoiceAudio && !activeVoiceAudio.paused && !activeVoiceAudio.ended;
  if (queue && playing) {
    const current = activeVoiceAudio;
    const start = () => {
      if (activeVoiceAudio === current) speak(track);
    };
    current.addEventListener("ended", start, { once: true });
    current.addEventListener("error", start, { once: true });
    return;
  }
  if (activeVoiceAudio) {
    activeVoiceAudio.pause();
    activeVoiceAudio.currentTime = 0;
  }
  activeVoiceAudio = new Audio(`public/audio/${track}.mp3`);
  activeVoiceAudio.play().catch(() => {});
}

const SFX_TONE_MAP = {
  correct: "good",
  points: "good",
  "stage-done": "good",
  "lesson-done": "good",
  wrong: "bad",
  click: "click",
  sticker: "click",
};

export function sfx(name) {
  if (!soundOn) return;
  if (sfxFailed.has(name)) {
    tone(SFX_TONE_MAP[name] || "click");
    return;
  }
  const audio = new Audio(`public/sfx/${name}.mp3`);
  audio.preload = "auto";
  audio.play().catch(() => {
    sfxFailed.add(name);
    tone(SFX_TONE_MAP[name] || "click");
  });
}
