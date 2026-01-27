import { createWrapper, input, addButton, delBtn, deleteButton } from "./common.js";

export function renderMatching(question, index, onDelete) {
  const div = createWrapper("Zuordnung");

  const qInput = input("Frage", question.question, v => question.question = v);

  const pairsDiv = document.createElement("div");

  function renderPairs() {
    pairsDiv.innerHTML = "";

    question.pairs.forEach((pair, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2";

      const left = document.createElement("input");
      left.className = "border p-1 flex-1";
      left.value = pair.left;
      left.oninput = e => pair.left = e.target.value;

      const right = document.createElement("input");
      right.className = "border p-1 flex-1";
      right.value = pair.right;
      right.oninput = e => pair.right = e.target.value;

      const del = delBtn(() => {
        question.pairs.splice(i, 1);
        renderPairs();
      });

      row.append(left, right, del);
      pairsDiv.appendChild(row);
    });
  }

  const addBtn = addButton(() => {
    question.pairs.push({ left: "", right: "" });
    renderPairs();
  });

  div.append(qInput, pairsDiv, addBtn, deleteButton(index, onDelete));
  renderPairs();
  return div;
}
