import lesson1 from "./lesson1.js";
import lesson2 from "./lesson2.js";
import lesson3 from "./lesson3.js";
import lesson4 from "./lesson4.js";

export const lessons = [lesson1, lesson2, lesson3, lesson4];

// Максимум баллов за урок считается из данных: у каждого этапа points за задание.
export function lessonMaxScore(lesson) {
  return lesson.stages.reduce((sum, stage) => sum + stage.points * stageItemCount(stage), 0);
}

export function stageItemCount(stage) {
  if (stage.kind === "sort") return stage.cards.length;
  if (stage.kind === "story") return stage.gaps.length;
  return stage.items.length;
}

export function lessonTaskCount(lesson) {
  return lesson.stages.reduce((sum, stage) => sum + stageItemCount(stage), 0);
}
