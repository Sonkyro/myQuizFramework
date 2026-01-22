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
      btn.className =
        "px-4 py-3 bg-gray-100 rounded border-gray-300 border-2 hover:bg-gray-200 focus:outline-none";

      btn.onclick = () => {
        // Toggle Auswahl
        if (btn.classList.contains("bg-gray-300")) {
          btn.classList.remove("bg-gray-300");
          btn.classList.add("bg-gray-100");
        } else {
          btn.classList.remove("bg-gray-100");
          btn.classList.add("bg-gray-300");
        }
      };

      optionsContainer.appendChild(btn);
    });
  },

  getUserAnswer(container) {
    return Array.from(container.querySelectorAll("button")).filter(b =>
      b.classList.contains("bg-gray-300")
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
