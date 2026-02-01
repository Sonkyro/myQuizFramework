import { createWrapper, inputQuestion, delElBtn, addRemove } from "./common.js";

export function renderMatching(question, index, onDelete) {
  const div = createWrapper("Zuordnung");

  const qInput = inputQuestion("Frage", question.question, v => question.question = v);

  const pairsDiv = document.createElement("div");

  function renderPairs() {
    pairsDiv.innerHTML = "";

    question.pairs.forEach((pair, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-4 mb-2";
      const cCol = document.createElement("div");
      cCol.className = "flex gap-2 flex-1 border rounded p-3 bg-gray-100";

      const left = inputQuestion("Links " + (i + 1), pair.left, e => {pair.left = e});
      const right = inputQuestion("Rechts " + (i + 1), pair.right, e => {pair.right = e});

      const del = delElBtn(() => {
        question.pairs.splice(i, 1);
        renderPairs();
      });
      cCol.append(left, right)

      const delCol = delElBtn(() => {
        question.pairs.splice(i, 1);
        renderPairs();
      });
      
      row.append(cCol, delCol);
      pairsDiv.appendChild(row);
    });
  }

  const addRemoveDiv = addRemove(() => {
    question.pairs.push({ left: "", right: "" });
    renderPairs();
  }, index, onDelete, "Option hinzufügen");

  div.append(qInput, pairsDiv, addRemoveDiv);
  renderPairs();
  return div;
}
