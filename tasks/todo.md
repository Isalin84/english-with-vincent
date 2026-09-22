# tasks/todo.md

## 2026-09-22 — Многоурочная тетрадь: уроки 2–4, ввод с клавиатуры, звуки, иллюстрации (Claude Code)

План: `~/.claude/plans/glittery-swimming-hollerith.md` (утверждён пользователем).

### Шаг 0 — документы
- [x] `tasks/illustrations-spec.md` — ТЗ для ChatGPT (стиль, список png, промпты)
- [x] `tasks/audio-spec.md` — фразы Винни для ElevenLabs + звуки с Pixabay
- [x] `AGENTS.md` — новые роли (ChatGPT: картинки), схема урока, таблица аудио

### Шаг 1 — контент (Claude)
- [x] `js/lessons/images.js` — реестр иллюстраций с эмодзи-заглушками
- [x] `js/lessons/lesson1.js` — миграция урока 1 без изменения содержания (190 баллов)
- [x] `js/lessons/lesson2.js` — There is / There are
- [x] `js/lessons/lesson3.js` — a / an / the
- [x] `js/lessons/lesson4.js` — was / were, there was / were, could
- [x] Русские объяснения выверены по humanizer-ru

### Шаг 2 — движок (Sonnet)
- [x] `js/engine/*`, `js/app.js`, `index.html`, `styles.css`: карта уроков, профиль, 5 типов упражнений, очки, наклейки
- [x] `node --check` для всех модулей

### Шаг 3 — верификация (Sonnet, Playwright)
- [x] Прохождение 4 уроков, суммы очков, ввод с опечаткой, перезагрузка не теряет счёт, консоль чистая
- [x] Скриншоты 1000 px и 390 px

### Шаг 4–5 — медиа (Sonnet через Chrome)
- [x] ElevenLabs: все дорожки из `audio-spec.md` → `public/audio/`
- [ ] Pixabay: 7 эффектов → `public/sfx/`
- [x] Сверка ключей и файлов, длительности

### Шаг 6 — ревью и публикация (Claude)
- [x] Ревью кода и текстов, выборочное прослушивание
- [ ] Коммиты по фазам, push, проверка GitHub Pages
- [ ] `git status`: `IMG_*.jpeg` не в индексе

### Шаг 7 — иллюстрации (ChatGPT → пользователь → Claude)
- [ ] png в `public/assets/illustrations/`, коммит «Add illustrations»

## Ревью
(заполняется по завершении)
