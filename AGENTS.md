# AGENTS.md — общий контекст для всех агентов проекта

Этот файл читают и OpenAI Codex, и Claude Code (через `CLAUDE.md`). Перед любой работой прочитай его целиком и `tasks/handoff.md`.

## Что это

**English with Vincent** — статическая игра для изучения английского. Урок 1: Present Simple vs Present Continuous.
Ученица — Варя, 9–10 лет, русскоязычная. Проводник — пудель Винни (Vincent).

- Репозиторий: https://github.com/Isalin84/english-with-vincent (ветка `main`)
- Сайт (GitHub Pages, публикуется из `main` автоматически): https://isalin84.github.io/english-with-vincent/
- Стек: `index.html` + `app.js` + `styles.css`, без сборки. Локально: `python3 -m http.server 4173` из корня.
- Файлы `IMG_*.jpeg`, `public/assets/*.png`, `.playwright-mcp/` в `.gitignore` — не коммитить.

## Кто что делает

| Агент | Зона ответственности | Инструменты |
|---|---|---|
| **OpenAI Codex** (desktop) | Создал проект и опубликовал его. Картинки Винни (генерация изображений, `public/assets/*.webp`). Озвучка через веб-интерфейс ElevenLabs в Chrome пользователя (голос **Archie – Social Media Narrator**, Eleven v3). | Chrome пользователя, ElevenLabs под аккаунтом пользователя |
| **Claude Code** | Методика преподавания, русские тексты объяснений, ревью кода и UX, документация для агентов. Картинки и озвучку генерировать **не может**. | Встроенный браузер для проверки, субагенты |

Рабочий цикл для любого агента:
1. `git pull --ff-only` перед началом (пользователь правит тексты прямо на GitHub).
2. Работать маленькими коммитами, сообщение — короткий императив по-английски (`Clarify sort hints`).
3. После работы дописать запись в `tasks/handoff.md` (кто, что, что не трогал, что ожидается от другого агента).
4. Если задача требует того, чего ты не умеешь (озвучка, картинки, доступ к аккаунтам), оставь в `tasks/handoff.md` конкретное ТЗ для другого агента, а не половинчатое решение.

## Аудио: что реально записано

Русский текст в облачке Винни на экране **не является транскриптом** аудио. Это перевод-пояснение. Записанный текст ниже. Все дорожки, кроме `vincent-intro.mp3`, на английском.

| Ключ в `voiceTracks` | Файл | Язык | Записанный текст |
|---|---|---|---|
| intro | vincent-intro.mp3 | RU | Привет, Варя! Готова к маленькому путешествию во времени? Сегодня мы приручим два английских времени. А дальше я буду говорить с тобой по-английски — слушай внимательно и повторяй за мной, чтобы тренировать произношение. Не волнуйся, я буду помогать! |
| rule | vincent-rule.mp3 | EN | Here's the trick: find the clue. Is it a habit, or is it happening right now? |
| simpleExample | simple-example.mp3 | EN | I walk to school every day. |
| continuousExample | continuous-example.mp3 | EN | I am walking to school now. |
| choiceInstruction | choice-instruction.mp3 | EN | Spot the clue, then choose the form that sounds right. |
| choice1 | choice-1.mp3 | EN | Varya usually does her homework after school. |
| choice2 | choice-2.mp3 | EN | Look! Vincent is running after a butterfly. |
| choice3 | choice-3.mp3 | EN | My dad drinks tea every morning. |
| choice4 | choice-4.mp3 | EN | Listen! The baby is crying right now. |
| sortInstruction | sort-instruction.mp3 | EN | Sort the clues. Tap a card, then send it to its tense. |
| finalIntro | final-intro.mp3 | EN | Final round! Every answer is worth fifteen points. Let's go! |
| final1 | final-1.mp3 | EN | I brush my teeth every day. |
| final2 | final-2.mp3 | EN | Vincent is sleeping on the sofa now. |
| final3 | final-3.mp3 | EN | She usually goes to school at eight. |
| final4 | final-4.mp3 | EN | We are learning English at the moment. |
| final5 | final-5.mp3 | EN | They play football on Sundays. |
| final6 | final-6.mp3 | EN | Listen! Mum is talking on the phone. |
| complete | vincent-complete.mp3 | EN | Amazing work, Varya! You've tamed Present Simple and Present Continuous. High paw! |

Правила:
- Русские строки в `app.js` можно менять свободно, звук от этого не ломается.
- Текст intro в `renderIntro` менять нельзя без перезаписи `vincent-intro.mp3` (только Codex).
- Новый вопрос = новая дорожка тем же голосом Archie, ключ в `voiceTracks`, поле `track` у вопроса. Без дорожки вопрос не добавлять.

## Методика: как объясняем времена ребёнку

Одна идея через весь урок. Два уровня формулировок:

1. **Полное определение** — только там, где ребёнок учит правило и подводит итог (экраны «Правило» и «Итог»):
   - Present Simple = *обычное, повторяющееся действие* (то, что делаешь каждый день, часто, по субботам).
   - Present Continuous = *действие, которое происходит прямо сейчас, в эту самую минуту*.
2. **Короткий якорь** — во всех подсказках, фидбэках, зонах сортировки, чипах: **«обычно»** ↔ Present Simple, **«прямо сейчас»** ↔ Present Continuous. Вопрос ребёнку везде один: «так бывает обычно или это происходит прямо сейчас?». В подсказке после ошибки связка проговаривается: «Действие повторяется, значит Present Simple».

Запрещено в русском тексте: голое слово «привычка», «регулярно», «форма (глагола)», английские `habit(s)`, `happening now`. Слово «время» как грамматический термин допустимо, но в инструкциях к кнопкам используем «домик» (зоны сортировки), чтобы не путать со временем на часах.

Слова-подсказки (usually, every day, Look!…) всегда показываются с переводом на экранах «Правило», «Быстрый выбор» и «Сортировка». В финале перевод появляется только после ошибки. Единственный источник переводов — объект `clueTranslations` в `app.js`; новое слово-подсказка сначала добавляется туда.

## Инварианты игры

- 16 заданий: 4 (выбор) + 6 (сортировка) + 6 (финал). Баллы: 4×10 + 6×10 + 6×15 = 190. Эти числа продублированы текстом на экране intro и итога — при изменении править везде.
- `clue` каждого вопроса должен буквально встречаться в его `text` (так работает подсветка `highlightClue`).
- Обращение к ученице в женском роде («ты заработала»).
