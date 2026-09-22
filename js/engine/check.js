// Проверка текстовых ответов: точное совпадение, «почти совпадение» и подсветка разницы.

export function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prevRow = new Array(n + 1);
  const row = new Array(n + 1);
  for (let j = 0; j <= n; j += 1) prevRow[j] = j;
  for (let i = 1; i <= m; i += 1) {
    row[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j - 1] + 1, prevRow[j] + 1, prevRow[j - 1] + cost);
    }
    for (let j = 0; j <= n; j += 1) prevRow[j] = row[j];
  }
  return prevRow[n];
}

// Простое посимвольное сравнение: подсвечивает в ожидаемом ответе те буквы,
// которых нет на той же позиции в том, что ввёл ребёнок.
function buildDiffHtml(expected, typedNormalized) {
  let html = "";
  for (let i = 0; i < expected.length; i += 1) {
    const expectedChar = expected[i];
    const typedChar = typedNormalized[i];
    const same = typedChar !== undefined && typedChar.toLowerCase() === expectedChar.toLowerCase();
    html += same ? expectedChar : `<mark>${expectedChar}</mark>`;
  }
  return html;
}

export function checkAnswer(input, item) {
  const typedNorm = normalize(input);
  const answerNorm = normalize(item.answer);
  const altNorms = (item.alt || []).map(normalize);

  if (typedNorm === answerNorm || altNorms.includes(typedNorm)) {
    return { status: "correct" };
  }

  const strip = (s) => s.replace(/['\s]/g, "");
  const onlySpacingOrApostropheDiff = strip(typedNorm) === strip(answerNorm) && typedNorm !== answerNorm;
  const distance = levenshtein(typedNorm, answerNorm);
  const closeEnough = answerNorm.length >= 3 && distance <= 2;

  if (onlySpacingOrApostropheDiff || closeEnough) {
    return { status: "near", diffHtml: buildDiffHtml(item.answer, typedNorm) };
  }

  return { status: "wrong" };
}
