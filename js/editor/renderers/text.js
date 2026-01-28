import { createWrapper, inputLine, inputText, delElBtn, addRemove, inputTitle } from "./common.js";

export function renderText(question, index, onDelete) {
  const div = createWrapper("Text Block");

  const titlInput = inputTitle("Titel", question.title, e => question.title = e);

  const paragraphsDiv = document.createElement("div");

  function renderParagraphs() {
    paragraphsDiv.innerHTML = "";

    question.paragraphs.forEach((p, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2 mb-4 ";
      const cCol = document.createElement("div");
      cCol.className = "flex flex-col gap-1 flex-1 border rounded p-4";

      const sub = inputLine("Subtitle", p.subtitle, e => p.subtitle = e);
      const txt = inputText("Text", p.text, e => p.text = e);

      cCol.append(sub, txt);

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
