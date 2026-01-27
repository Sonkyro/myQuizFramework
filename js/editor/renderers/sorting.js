import { createWrapper, input, addButton, delBtn, deleteButton } from "./common.js";

export function renderSorting(question, index, onDelete) {
  const div = createWrapper("Sortieren");

  const qInput = input("Frage", question.question, v => question.question = v);

  const listDiv = document.createElement("div");

  function renderItems() {
    listDiv.innerHTML = "";

    question.items.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2";

      const inp = document.createElement("input");
      inp.className = "border p-1 flex-1";
      inp.value = item;
      inp.oninput = e => question.items[i] = e.target.value;

      const del = delBtn(() => {
        question.items.splice(i, 1);
        renderItems();
      });

      row.append(inp, del);
      listDiv.appendChild(row);
    });
  }

  const addBtn = addButton(() => {
    question.items.push("");
    renderItems();
  });

  div.append(qInput, listDiv, addBtn, deleteButton(index, onDelete));
  renderItems();
  return div;
}
