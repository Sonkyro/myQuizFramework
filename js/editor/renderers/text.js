import { createWrapper, inputLine, inputText, delElBtn, addRemove, inputTitle } from "./common.js";

export function renderText(question, index, onDelete) {
  const div = createWrapper("Text Block");

  const titlInput = inputTitle("Titel", question.title, e => question.title = e);

  const paragraphsDiv = document.createElement("div");

  function renderParagraphs() {
    paragraphsDiv.innerHTML = "";
    if (!question.paragraphs[0]) question.paragraphs.push({ subtitle: "", text: "" });

    question.paragraphs.forEach((p, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2 mb-4";
      const cCol = document.createElement("div");
      cCol.className = "flex flex-col gap-1 flex-1 border rounded p-3 bg-gray-100";
      const h = document.createElement("h3");
      h.className = "font-semibold";
      h.textContent = "Absatz - " + (i+1);

      const sub = inputLine("Subtitle", p.subtitle, e => p.subtitle = e);
      const txt = inputText("Text", p.text, e => p.text = e);

      cCol.append(h, sub, txt);

      const delCol = delElBtn(() => {
        question.paragraphs.splice(i, 1);
        renderParagraphs();
      });

      row.append(cCol, delCol);
      paragraphsDiv.appendChild(row);
    });
  }

  const addRemoveDiv = addRemove(() => {
      question.paragraphs.push({ subtitle: "", text: "" });
      renderParagraphs();
    }, index, onDelete);
  div.append(titlInput, paragraphsDiv, addRemoveDiv);
  renderParagraphs();

  return div;
}
