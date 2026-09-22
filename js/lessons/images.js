// Реестр иллюстраций. На сайте используются public/assets/illustrations/<id>.webp,
// которые получаются из png-мастеров ChatGPT скриптом tools/convert-illustrations.sh (png в .gitignore).
// Пока файла нет, движок показывает emoji. Поле alt идёт в атрибут alt картинки.

export const ILLUSTRATIONS_DIR = "public/assets/illustrations";

export const images = {
  // --- Винни, позы (персонаж без фона) ---
  "vincent-wave": { emoji: "🐩", alt: "Винни машет лапой" },
  "vincent-point": { emoji: "🐩", alt: "Винни показывает на доску" },
  "vincent-jump": { emoji: "🐩", alt: "Винни прыгает от радости" },
  "vincent-ball": { emoji: "🐩", alt: "Винни с мячом" },
  "vincent-sleep": { emoji: "😴", alt: "Винни спит на скамейке" },
  "vincent-book": { emoji: "📖", alt: "Винни читает книгу" },

  // --- Парк: сцены и предметы для упражнений ---
  "park-tree": { emoji: "🌳", alt: "Большое дерево" },
  "park-flowers": { emoji: "🌸", alt: "Много цветов" },
  "park-bench": { emoji: "🪑", alt: "Скамейка под деревом" },
  "park-pond-ducks": { emoji: "🦆", alt: "Пруд с тремя утками" },
  "park-swings": { emoji: "🎠", alt: "Две качели" },
  "park-slide": { emoji: "🛝", alt: "Горка" },
  "park-bikes": { emoji: "🚲", alt: "Два велосипеда" },
  "park-kite": { emoji: "🪁", alt: "Воздушный змей в небе" },
  "park-ice-cream": { emoji: "🍦", alt: "Мороженое" },
  "park-fountain": { emoji: "⛲", alt: "Фонтан" },
  "park-squirrel": { emoji: "🐿️", alt: "Белка на дереве" },
  "park-cat-tree": { emoji: "🐈", alt: "Кот на дереве" },
  "park-ball": { emoji: "⚽", alt: "Мяч" },
  "park-football": { emoji: "⚽", alt: "Дети играют в футбол" },
  "park-playground": { emoji: "🛝", alt: "Детская площадка" },
  "park-friends": { emoji: "👧👧🐩", alt: "Варя с подругами и Винни в парке" },
  "park-varya-vincent": { emoji: "👧🐩", alt: "Варя ведёт Винни на поводке" },
  "park-dog": { emoji: "🐕", alt: "Собака" },
  "park-owl": { emoji: "🦉", alt: "Сова на дереве" },
  "park-egg": { emoji: "🥚", alt: "Яйцо в утином гнезде" },
  "park-apple": { emoji: "🍎", alt: "Яблоко" },
  "park-orange": { emoji: "🍊", alt: "Апельсин" },
  "park-umbrella": { emoji: "☂️", alt: "Синий зонт" },
  "park-picnic": { emoji: "🧺", alt: "Пикник на траве" },
  "sky-sun": { emoji: "☀️", alt: "Солнце" },
  "sky-moon": { emoji: "🌙", alt: "Луна" },

  // --- Наклейки-награды ---
  "sticker-star-paw": { emoji: "⭐", alt: "Звезда с отпечатком лапы" },
  "sticker-medal": { emoji: "🏅", alt: "Медаль" },
  "sticker-cup": { emoji: "🏆", alt: "Кубок" },
  "sticker-high-paw": { emoji: "🐾", alt: "High paw!" },
  "sticker-rainbow": { emoji: "🌈", alt: "Радуга" },
  "sticker-paw": { emoji: "🐾", alt: "Отпечаток лапы" },

  // --- Обложки уроков ---
  "cover-lesson-1": { emoji: "⏰", alt: "Урок 1: два времени" },
  "cover-lesson-2": { emoji: "🌳", alt: "Урок 2: что есть в парке" },
  "cover-lesson-3": { emoji: "🔤", alt: "Урок 3: a, an, the" },
  "cover-lesson-4": { emoji: "📸", alt: "Урок 4: вчера в парке" },
};

export const stickers = [
  "sticker-star-paw",
  "sticker-medal",
  "sticker-cup",
  "sticker-high-paw",
  "sticker-rainbow",
  "sticker-paw",
];

export function imagePath(id) {
  return `${ILLUSTRATIONS_DIR}/${id}.webp`;
}
