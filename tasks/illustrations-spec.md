# tasks/illustrations-spec.md — ТЗ на иллюстрации для ChatGPT

Этот файл целиком отдаётся агенту ChatGPT (генерация картинок). Вместе с ним в чат нужно приложить два референса:

1. `public/assets/vincent-teacher.png` — как уже нарисован Винни (стиль, который надо повторить).
2. `IMG_6841.jpeg` — фото Вари для мультяшного персонажа (файл в `.gitignore`, в репозиторий не попадает).

Готовые файлы класть в `public/assets/illustrations/` с именами из таблицы. Приложение само подхватит их: пока файла нет, на его месте показывается эмодзи.

## Общие требования ко всем картинкам

- **Формат:** PNG, прозрачный фон (без белой подложки, без теней на «полу», кроме мягкой тени под персонажем).
- **Размер:** 1024×1024 px. Объект занимает 80–90 % кадра, по центру.
- **Стиль:** мягкий объёмный «мультяшный 3D», как у референса Винни: тёплый свет, чистые формы, крупные детали, без мелкого текста. Дружелюбно, для ребёнка 9–10 лет. Без надписей на картинках (кроме наклейки `sticker-high-paw`).
- **Винни (Vincent):** абрикосовый той-пудель, кудрявая шерсть, тёмные глаза и нос, синяя бандана на шее. Всегда один и тот же персонаж.
- **Варя (Varya):** девочка 9–10 лет, светлые волосы до плеч с пробором посередине, светлая кожа, серо-голубые глаза, розовая рубашка с воротником. Мультяшная версия по фото, без портретного сходства «как на паспорт»: важны узнаваемые детали (волосы, рубашка), а не точная копия лица.
- **Друзья Вари:** две девочки того же возраста, разные причёски (тёмные кудри; рыжий хвост), яркая одежда.
- **Парк:** летний, солнечный, зелёный. Одна и та же палитра во всех сценах: зелёный, голубое небо, жёлтое солнце, синяя бандана Винни.

Базовый промпт (English), к нему добавляется описание из таблицы:

```
Soft 3D cartoon illustration for a children's English learning app, style of a Pixar-like render: rounded shapes, warm lighting, clean edges, no text. Transparent background, PNG, 1024x1024, subject centered and filling most of the frame. [OBJECT DESCRIPTION]
```

Для Винни добавлять: `Vincent, an apricot toy poodle with curly fur, dark eyes and nose, wearing a blue bandana around his neck — the same character as in the reference image.`

Для Вари добавлять: `Varya, a 9-year-old girl with shoulder-length blond hair parted in the middle, light skin, grey-blue eyes, wearing a pink collared shirt — cartoon version of the reference photo.`

## 1. Винни: позы (персонаж без фона)

| Файл | Описание для промпта | Где используется |
|---|---|---|
| `vincent-wave.png` | Vincent sitting and waving one front paw, big friendly smile | карта уроков, приветствие |
| `vincent-point.png` | Vincent standing on hind legs, pointing with a paw to the side like a teacher at a board | экраны «Правило» |
| `vincent-jump.png` | Vincent jumping in the air with joy, ears flying, all four paws off the ground | завершение этапа |
| `vincent-ball.png` | Vincent running with a yellow ball in his mouth | упражнения про мяч, урок 4 |
| `vincent-sleep.png` | Vincent curled up asleep on a green park bench, little "z" bubbles | примеры, отдых |
| `vincent-book.png` | Vincent sitting with an open book, reading glasses on his nose | обложка урока 3, правило |

## 2. Парк: сцены и предметы для упражнений

| Файл | Описание для промпта |
|---|---|
| `park-tree.png` | One big old oak tree with a wide green crown, grass at the base |
| `park-flowers.png` | A bunch of many colourful wild flowers (red, yellow, purple) growing in grass |
| `park-bench.png` | A wooden park bench under a small tree |
| `park-pond-ducks.png` | A small round pond with three yellow ducks swimming |
| `park-swings.png` | Two playground swings on a metal frame |
| `park-slide.png` | A red playground slide with a ladder |
| `park-bikes.png` | Two children's bicycles (one red, one blue) leaning on each other |
| `park-kite.png` | A colourful diamond kite with a long tail flying in the sky, a small cloud |
| `park-ice-cream.png` | One ice cream cone with two scoops (strawberry and vanilla) |
| `park-fountain.png` | A round stone park fountain with water splashing |
| `park-squirrel.png` | A red squirrel sitting on a tree branch holding a nut |
| `park-cat-tree.png` | A grey cat sitting on a tree branch, looking down |
| `park-ball.png` | One red-and-white football (soccer ball) |
| `park-football.png` | Three children playing football on green grass, one kicking the ball |
| `park-playground.png` | A small playground: swings, a slide and a sandbox together |
| `park-friends.png` | Varya with her two friends and Vincent the poodle walking together in a sunny park, all smiling (use both reference descriptions) |
| `park-varya-vincent.png` | Varya walking Vincent on a blue leash, Vincent looking up at her happily |
| `park-dog.png` | A friendly brown dog (not a poodle, e.g. a beagle) sitting on grass |
| `park-owl.png` | A small brown owl with big round eyes sitting in a tree hollow |
| `park-egg.png` | One white egg lying in a small nest of straw by the pond |
| `park-apple.png` | One shiny red apple |
| `park-orange.png` | One orange with a green leaf |
| `park-umbrella.png` | One open blue umbrella |
| `park-picnic.png` | A picnic blanket on grass with a basket, apples and sandwiches |
| `sky-sun.png` | A smiling cartoon sun with soft rays |
| `sky-moon.png` | A crescent moon with a small star, night-blue glow |

## 3. Наклейки-награды (появляются после правильного ответа)

Круглые или в форме объекта, яркие, с белой обводкой как у настоящей наклейки.

| Файл | Описание для промпта |
|---|---|
| `sticker-star-paw.png` | A gold star sticker with a small dog paw print in the middle, white outline |
| `sticker-medal.png` | A round gold medal on a blue ribbon, white sticker outline |
| `sticker-cup.png` | A small gold trophy cup, white sticker outline |
| `sticker-high-paw.png` | Vincent's raised paw giving a high five, the words "HIGH PAW!" in a playful font, white sticker outline |
| `sticker-rainbow.png` | A bright rainbow arc with two small clouds, white sticker outline |
| `sticker-paw.png` | A single blue dog paw print, white sticker outline |

## 4. Обложки уроков (карточки на карте)

| Файл | Описание для промпта |
|---|---|
| `cover-lesson-1.png` | Vincent sitting between a big alarm clock and a calendar page, "now vs every day" mood, no text |
| `cover-lesson-2.png` | Vincent standing at a park entrance gate with a tree, a bench and a pond behind him |
| `cover-lesson-3.png` | Vincent holding up three wooden letter blocks: A, AN, THE (these three words are allowed as the only text) |
| `cover-lesson-4.png` | Vincent looking at a photo album with a snapshot of a sunny park day, a small clock turned back |

## Чек-лист перед передачей файлов

- [ ] Все 42 файла названы точно как в таблицах (строчные буквы, дефисы, `.png`).
- [ ] Фон прозрачный (проверить на тёмной подложке).
- [ ] Винни одинаковый на всех картинках (бандана синяя, шерсть абрикосовая).
- [ ] Нет текста, кроме `sticker-high-paw.png` и `cover-lesson-3.png`.

## Что происходит с файлами дальше (для Claude Code)

PNG-мастера лежат в `public/assets/illustrations/` и не коммитятся (`.gitignore`). Сайт использует webp: `sh tools/convert-illustrations.sh` конвертирует новые или изменившиеся png (800 px, q 82) и результат коммитится. Реестр id — `js/lessons/images.js`.
