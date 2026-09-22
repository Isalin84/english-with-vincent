#!/bin/sh
# Конвертирует png-иллюстрации (мастера от ChatGPT, в .gitignore) в webp для сайта.
# Запуск из корня: sh tools/convert-illustrations.sh
# Нужен cwebp (brew install webp). Уже сконвертированные и не изменившиеся файлы пропускаются.
set -e
dir="public/assets/illustrations"
for png in "$dir"/*.png; do
  [ -e "$png" ] || continue
  webp="${png%.png}.webp"
  if [ -e "$webp" ] && [ ! "$png" -nt "$webp" ]; then continue; fi
  cwebp -quiet -q 82 -resize 800 0 -alpha_q 90 -metadata none "$png" -o "$webp"
  printf '%s → %s (%s KB)\n' "$(basename "$png")" "$(basename "$webp")" "$(( $(stat -f%z "$webp") / 1024 ))"
done
