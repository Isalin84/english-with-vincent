// Картинки заданий и обложек. Пока png нет, показывается крупный emoji-фолбэк.

import { images, imagePath } from "../lessons/images.js";

export function illustration(id, className = "") {
  const meta = images[id] || { emoji: "❓", alt: id || "" };
  const cls = className ? `illus ${className}` : "illus";
  return `<span class="${cls}" data-emoji="${meta.emoji}"><img src="${imagePath(id)}" alt="${meta.alt}" loading="lazy"></span>`;
}

let attached = false;

// Один capturing-слушатель "error" на document: у <img> ошибка загрузки не всплывает,
// поэтому ловим её на фазе погружения и подменяем содержимое ближайшей обёртки .illus.
export function initIllustrations() {
  if (attached) return;
  attached = true;
  document.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (!target || target.tagName !== "IMG") return;
      const wrapper = target.closest(".illus");
      if (!wrapper || wrapper.dataset.fallback === "1") return;
      wrapper.dataset.fallback = "1";
      const emoji = wrapper.dataset.emoji || "❓";
      wrapper.innerHTML = `<i class="illus-emoji">${emoji}</i>`;
    },
    true,
  );
}
