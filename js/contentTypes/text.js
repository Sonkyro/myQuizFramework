export const text = {
    render(q, container) {
        container.innerHTML = "";

        const textContainer = document.createElement("div");
        // textContainer.className = "";
        container.appendChild(textContainer);

        q.paragraphs.forEach(p => {
            const paragraphTitle = document.createElement("p");
            paragraphTitle.textContent = p.subtitle;
            paragraphTitle.className = "font-bold";

            const paragraphText = document.createElement("p");
            paragraphText.textContent = p.text;
            paragraphText.className = "mb-3";

            textContainer.appendChild(paragraphTitle);
            textContainer.appendChild(paragraphText);
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
