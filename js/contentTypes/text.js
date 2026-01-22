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
            paragraphText.className = "mb-2";

            textContainer.appendChild(paragraphTitle);
            textContainer.appendChild(paragraphText);
        });
    }
};
