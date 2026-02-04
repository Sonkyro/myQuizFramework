import { initStyle } from "../utils.js";
import { setColor } from "../utils.js";
import { qUiColor } from "../utils.js";

export const multipleChoice = {

  render(q, container) {
    container.innerHTML = "";

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "grid grid-cols-2 gap-4"; // max 2 pro Reihe
    container.appendChild(optionsContainer);

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.type = "button";
      initStyle(btn, "answerBtn");
      let selected = false;

      btn.onclick = () => {
        // Toggle Auswahl
        if (selected === true) {
          setColor(btn, "btnState", "default");
          selected = false;
        } else {
          setColor(btn, "btnState", "selected");
          selected = true;
        }
      };

      optionsContainer.appendChild(btn);
    });
  },

  getUserAnswer(container) {
    return Array.from(container.querySelectorAll("button")).filter(b =>
      b.classList.contains(qUiColor["bg-selected"])
    ).map(b => b.textContent);
  },

  isCorrect(q, userAnswer) {
    const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
    return JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswers.sort());
  },

  formatAnswer(q, userAnswer) {
    const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
    return { user: userAnswer, correct: correctAnswers };
  }
};
