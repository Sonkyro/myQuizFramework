import { createWrapper, input, addButton, delBtn, deleteButton } from "./common.js";

export function renderMultipleChoice(question, index, onDelete) {
  const div = createWrapper("Multiple Choice");

  const qInput = input("Frage", question.question, v => question.question = v);

  const optionsDiv = document.createElement("div");

  function renderOptions() {
    optionsDiv.innerHTML = "";

    question.options.forEach((opt, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2 items-center";

      const inp = document.createElement("input");
      inp.className = "border p-1 flex-1";
      inp.value = opt;
      inp.oninput = e => question.options[i] = e.target.value;

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = question.answer.includes(opt);

      chk.onchange = () => {
        if (chk.checked) question.answer.push(opt);
        else question.answer = question.answer.filter(a => a !== opt);
      };

      const del = delBtn(() => {
        const removed = question.options.splice(i, 1)[0];
        question.answer = question.answer.filter(a => a !== removed);
        renderOptions();
      });

      row.append(chk, inp, del);
      optionsDiv.appendChild(row);
    });
  }

  const addBtn = addButton(() => {
    question.options.push("");
    renderOptions();
  });

  div.append(qInput, optionsDiv, addBtn, deleteButton(index, onDelete));
  renderOptions();
  return div;
}
