# tasks/audio-spec.md — озвучка Винни и звуковые эффекты

Голос: **Archie – Social Media Narrator**, модель **Eleven v3**, страница https://elevenlabs.io/app/speech-synthesis/text-to-speech (голос уже выбран в аккаунте пользователя, Chrome). Скачивание всех файлов из этого списка разрешено пользователем (2026-09-22).

Формат: mp3, как у существующих дорожек (128 kbps, 44,1 кГц, моно допустимо). Все файлы кладём в `public/audio/<key>.mp3`. Ключ = имя файла без расширения = поле `track` в `js/lessons/*.js`.

Русские фразы (RU) произносит тот же английский голос Archie: акцент нужен намеренно, это часть образа Винни. Текст вставлять точно как в таблице, без кавычек.

## A. Одиночные дорожки (40 шт.) — одна генерация = один файл

| # | key | Язык | Текст | Примечание |
|---|---|---|---|---|
| 1 | `map-hello` | EN | Hello! I am Vincent. Choose a lesson and let us play! |  |
| 2 | `praise-en-1` | EN | Great job! |  |
| 3 | `praise-en-2` | EN | High paw! Well done! |  |
| 4 | `praise-en-3` | EN | Excellent! You are a star! |  |
| 5 | `praise-ru-1` | RU | Молодец! |  |
| 6 | `praise-ru-2` | RU | Отлично! |  |
| 7 | `praise-ru-3` | RU | Супер! Так держать! |  |
| 8 | `praise-ru-4` | RU | Ура! Правильно! |  |
| 9 | `cheer-en-1` | EN | Almost! Try again. |  |
| 10 | `cheer-ru-1` | RU | Почти! Попробуй ещё раз. |  |
| 11 | `cheer-ru-2` | RU | Ничего страшного. Давай ещё разок! |  |
| 12 | `stage-done` | EN | Stage complete! Here is a sticker for you! |  |
| 13 | `vincent-intro` | RU | Привет! Готовимся к маленькому путешествию во времени. Сегодня мы приручим два английских времени. Дальше я буду говорить с тобой по-английски. Слушай внимательно и повторяй за мной, чтобы тренировать произношение. Не волнуйся, я буду помогать! | перезапись: без имени «Варя» |
| 14 | `vincent-complete` | EN | Amazing work! You've tamed Present Simple and Present Continuous. High paw! | перезапись: без имени «Varya» |
| 15 | `l2-intro` | EN | Hello, my friend! Today we are going to the park. Let's see what there is in the park! |  |
| 16 | `l2-rule` | EN | Look at the word after 'there is'. One thing or many things? |  |
| 17 | `l2-s1` | EN | Sort the cards. One thing goes to 'there is', many things go to 'there are'. |  |
| 18 | `l2-s2` | EN | Look at the picture and choose: is or are? |  |
| 19 | `l2-s3` | EN | Now type it yourself: there is or there are. Check your spelling! |  |
| 20 | `l2-s4` | EN | Put the words in the right order. Tap a word to add it, tap again to take it back. |  |
| 21 | `l2-s5` | EN | Final round! Questions and answers. Fifteen points for every correct answer. Let's go! |  |
| 22 | `l2-done` | EN | Fantastic! Now you can say what there is in the park. High paw! |  |
| 23 | `l3-intro` | EN | Hello, my friend! Today we meet three tiny words: a, an and the. They are small, but very important! |  |
| 24 | `l3-rule` | EN | Ask yourself: is it the first time, or do we already know it? First time: a or an. We know it: the. |  |
| 25 | `l3-s1` | EN | Type a or an. Listen to the first sound of the word! |  |
| 26 | `l3-s2` | EN | First time we talk about it? Say a. We already know it? Say the. |  |
| 27 | `l3-s3` | EN | Type the right word: a, an or the. Two questions: first time or not? Vowel sound or not? |  |
| 28 | `l3-s4` | EN | Sort the words. Which little word goes with each one: a, an, the, or nothing? |  |
| 29 | `l3-s5` | EN | Final round! Read the story and fill in the gaps. Fifteen points for each one. Let's go! |  |
| 30 | `l3-story` | EN | Last Sunday, Varya and Vincent were in the park near their school. There was a big tree and there were flowers. The tree was near the playground. Varya had an apple and Vincent had a ball. The ball was yellow. The sun was hot, so they sat under the tree. |  |
| 31 | `l3-done` | EN | Brilliant! A, an and the are your friends now. High paw! |  |
| 32 | `l4-intro` | EN | Hello, my friend! Last Sunday we were in the park. Let's remember what there was and what we could do! |  |
| 33 | `l4-rule` | EN | Was is for one: I was, he was. Were is for many: we were, they were. Could never changes! |  |
| 34 | `l4-s1` | EN | Sort the cards. One goes to 'was', many go to 'were'. |  |
| 35 | `l4-s2` | EN | What was there in the park last Sunday? Choose was or were. |  |
| 36 | `l4-s3` | EN | Type was, were or could. Read the sentence carefully! |  |
| 37 | `l4-s4` | EN | Put the words in the right order. Tap a word to add it, tap again to take it back. |  |
| 38 | `l4-s5` | EN | Final round! Answer the questions about our day in the park. Fifteen points for each one! |  |
| 39 | `l4-story` | EN | Who was in the park? My friends were there. Where was the big tree? It was near the playground. What could the children do? They could play football. |  |
| 40 | `l4-done` | EN | Wonderful! Now you can tell everyone about our day in the park. High paw! |  |

## B. Пакеты (9 шт.) — одна генерация = несколько файлов

Чтобы не делать 51 отдельных генераций, короткие предложения одного этапа записываются одним куском и режутся по паузам. В поле текста вставить строки пакета **каждую с новой строки, между строками пустая строка**. После скачивания:

```bash
node tools/split-audio.mjs ~/Downloads/<скачанный>.mp3 <key1> <key2> ... <keyN>
```

Скрипт ищет паузы (ffmpeg silencedetect), режет на N кусков и кладёт `public/audio/<key>.mp3`. Если число найденных кусков не равно N, скрипт ничего не пишет и печатает, сколько нашёл. Тогда этот пакет записывается по одной фразе (как в разделе A).

### Пакет `l2-ex` (2 фраз)

Ключи по порядку: `l2-ex-1`, `l2-ex-2`

Текст для вставки:

```
There is a big tree in the park.

There are many flowers near the pond.
```

### Пакет `l2-in-the-park` (8 фраз)

Ключи по порядку: `l2-c-1`, `l2-c-2`, `l2-c-3`, `l2-c-4`, `l2-c-5`, `l2-c-6`, `l2-c-7`, `l2-c-8`

Текст для вставки:

```
There is a pond in the park.

There are three ducks on the pond.

There is a big tree near the playground.

There are many flowers under the tree.

There are two swings on the playground.

There is a slide next to the swings.

There are some children on the football field.

There is a squirrel in the tree.
```

### Пакет `l2-build` (6 фраз)

Ключи по порядку: `l2-b-1`, `l2-b-2`, `l2-b-3`, `l2-b-4`, `l2-b-5`, `l2-b-6`

Текст для вставки:

```
There is a big tree in the park.

There are many flowers near the pond.

There is a dog on the bench.

There are two ducks on the pond.

Is there a cat in the tree?

There aren't any bikes in the park.
```

### Пакет `l2-final` (8 фраз)

Ключи по порядку: `l2-f-1`, `l2-f-2`, `l2-f-3`, `l2-f-4`, `l2-f-5`, `l2-f-6`, `l2-f-7`, `l2-f-8`

Текст для вставки:

```
Is there a pond in the park? — Yes, there is.

Are there any ducks on the pond? — Yes, there are.

Is there a cat in the tree? — Yes, there is.

Are there any bikes near the bench? — No, there aren't.

There is a slide on the playground, but there isn't a swing.

There aren't any children on the football field today.

Is there a squirrel in the tree? — No, there isn't.

Look! There are Vincent and his friends near the fountain!
```

### Пакет `l3-ex` (2 фраз)

Ключи по порядку: `l3-ex-1`, `l3-ex-2`

Текст для вставки:

```
I see a dog in the park.

The dog is Vincent!
```

### Пакет `l3-first-or-known` (8 фраз)

Ключи по порядку: `l3-c-1`, `l3-c-2`, `l3-c-3`, `l3-c-4`, `l3-c-5`, `l3-c-6`, `l3-c-7`, `l3-c-8`

Текст для вставки:

```
Varya has a ball. The ball is red.

Varya has a ball. The ball is red.

There is a dog on the bench.

Look at the dog! It's Vincent!

I can see a squirrel in the tree.

The squirrel is eating a nut.

The sun is shining today.

We are having a picnic in the park.
```

### Пакет `l4-ex` (3 фраз)

Ключи по порядку: `l4-ex-1`, `l4-ex-2`, `l4-ex-3`

Текст для вставки:

```
Last Sunday, I was in the park with my friends.

There were many flowers in the park.

The children could play football and ride bikes.
```

### Пакет `l4-there-was` (8 фраз)

Ключи по порядку: `l4-c-1`, `l4-c-2`, `l4-c-3`, `l4-c-4`, `l4-c-5`, `l4-c-6`, `l4-c-7`, `l4-c-8`

Текст для вставки:

```
There was a big tree in the park.

There were many flowers under the tree.

There were some children on the playground.

There was a pond with ducks.

There were two bikes near the bench.

There was a kite in the sky.

There were three ducks on the pond.

There was an ice cream for Vincent!
```

### Пакет `l4-build` (6 фраз)

Ключи по порядку: `l4-b-1`, `l4-b-2`, `l4-b-3`, `l4-b-4`, `l4-b-5`, `l4-b-6`

Текст для вставки:

```
Last Sunday I was in the park.

There were many flowers.

The children could play football.

We were happy.

Was the tree near the playground?

Vincent couldn't ride a bike.
```

## C. Звуковые эффекты (Pixabay, https://pixabay.com/sound-effects/, аккаунт пользователя в Chrome)

Лицензия Pixabay Content License (бесплатно, без атрибуции). Скачать mp3, обрезать и нормализовать через ffmpeg, положить в `public/sfx/<name>.mp3`.

| Файл | Что искать | Требования |
|---|---|---|
| `correct.mp3` | "correct answer ding", "success chime" | мягкий, короткий, 0,3–0,8 с |
| `wrong.mp3` | "wrong answer soft", "error buzz gentle" | тихий, не обидный, 0,3–0,6 с |
| `points.mp3` | "coin collect", "coin pickup" | 0,2–0,5 с |
| `stage-done.mp3` | "level up", "short fanfare" | 1–2 с |
| `lesson-done.mp3` | "win fanfare", "victory jingle" | 2–3 с |
| `sticker.mp3` | "pop", "bubble pop" | 0,1–0,3 с |
| `click.mp3` | "ui click", "button click soft" | 0,05–0,2 с |

Обработка (пример):

```bash
ffmpeg -y -i in.mp3 -t 1.5 -af "afade=t=out:st=1.2:d=0.3,loudnorm=I=-18:TP=-2" -ar 44100 -b:a 96k public/sfx/correct.mp3
```

## D. Что уже записано (не трогать)

Существующие 16 дорожек урока 1 (choice-*, final-*, simple-example, continuous-example, choice-instruction, sort-instruction, final-intro, vincent-rule) остаются. Перезаписываются только `vincent-intro` и `vincent-complete` (в них звучит имя «Варя»).
