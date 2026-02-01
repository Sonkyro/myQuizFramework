import { createWrapper, inputQuestion, delElBtn, addRemove } from "./common.js";

export function renderSorting(question, index, onDelete) {
  const div = createWrapper("Sortieren");

  const qInput = inputQuestion("Frage", question.question, v => question.question = v);

  const listDiv = document.createElement("div");

  function renderItems() {
    listDiv.innerHTML = "";

    question.items.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2 mb-4";
      const cCol = document.createElement("div");
      cCol.className = "flex gap-1 flex-1 border rounded p-3 bg-gray-100";

      const inp = inputQuestion("Element" + (i + 1), item, e => {question.items[i] = e});
      cCol.append(inp);

      const delCol = delElBtn(() => {
        const removed = question.options.splice(i, 1)[0];
        question.answer = question.answer.filter(a => a !== removed);
        renderOptions();
      });
      
      row.append(cCol, delCol);
      listDiv.appendChild(row);
    });
  }

  const addRemoveDiv = addRemove(() => {
    question.options.push("");
    renderOptions();
  }, index, onDelete, "Option hinzufügen");

  div.append(qInput, listDiv, addRemoveDiv);
  renderItems();
  return div;
}
