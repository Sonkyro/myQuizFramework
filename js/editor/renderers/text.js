import { createWrapper, input, addButton, delBtn, deleteButton } from "./common.js";

export function renderText(question, index, onDelete) {
  const div = createWrapper("Text Block");

  const testInput = document.createElement("input");
  testInput.className = "border p-1 w-full";
  testInput.placeholder = "Titel / Test";
  testInput.value = question.test || "";
  testInput.oninput = e => question.test = e.target.value;

  const paragraphsDiv = document.createElement("div");

  function renderParagraphs() {
    paragraphsDiv.innerHTML = "";

    question.paragraphs.forEach((p, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2 mb-1";

      const sub = document.createElement("input");
      sub.className = "border p-1 flex-1";
      sub.placeholder = "Subtitle";
      sub.value = p.subtitle;
      sub.oninput = e => p.subtitle = e.target.value;

      const txt = document.createElement("input");
      txt.className = "border p-1 flex-1";
      txt.placeholder = "Text";
      txt.value = p.text;
      txt.oninput = e => p.text = e.target.value;

      const del = document.createElement("button");
      del.textContent = "✕";
      del.className = "text-red-500";
      del.onclick = () => {
        question.paragraphs.splice(i, 1);
        renderParagraphs();
      };

      row.append(sub, txt, del);
      paragraphsDiv.appendChild(row);
    });
  }

  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Absatz";
  addBtn.className = "text-blue-500";
  addBtn.onclick = () => {
    question.paragraphs.push({ subtitle: "", text: "" });
    renderParagraphs();
  };

  const delQ = deleteButton(index, onDelete);

  div.append(testInput, paragraphsDiv, addBtn, delQ);
  renderParagraphs();

  return div;
}
