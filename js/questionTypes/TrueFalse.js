export const trueFalse = {
  render(q, container) {
    container.innerHTML = "";

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "grid grid-cols-2 gap-4";
    container.appendChild(optionsContainer);

    ["Wahr", "Falsch"].forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.type = "button";
      btn.className =
        "px-4 py-3 bg-gray-100 rounded border-gray-300 border-2 hover:bg-gray-200 focus:outline-none";

      btn.onclick = () => {
        // Toggle Auswahl (nur eine Option für TrueFalse)
        optionsContainer.querySelectorAll("button").forEach(b => b.classList.remove("bg-gray-300"));
        btn.classList.add("bg-gray-300");
      };

      optionsContainer.appendChild(btn);
    });
  },

  getUserAnswer(container) {
    const selected = container.querySelector("button.bg-gray-300");
    return selected ? selected.textContent.toLowerCase() : null;
  },

  isCorrect(q, userAnswer) {
    return userAnswer === q.answer.toLowerCase();
  },

  formatAnswer(q, userAnswer) {
    return { user: userAnswer, correct: q.answer };
  }
};
