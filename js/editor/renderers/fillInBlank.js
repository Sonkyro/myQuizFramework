import { createWrapper, input, addButton, delBtn, deleteButton } from "./common.js";

export function renderFillInBlank(question, index, onDelete) {
  const div = createWrapper("Lückentext");

  const qInput = input("Frage", question.question, v => question.question = v);
  const textInput = input("Text mit ___", question.text, v => question.text = v);

  const optionsDiv = document.createElement("div");

  function renderOptions() {
    optionsDiv.innerHTML = "";

    question.options.forEach((opt, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2";

      const inp = document.createElement("input");
      inp.className = "border p-1 flex-1";
      inp.value = opt;
      inp.oninput = e => question.options[i] = e.target.value;

      const isAnswer = question.answers.includes(opt);

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = isAnswer;

      chk.onchange = () => {
        if (chk.checked) question.answers.push(opt);
        else question.answers = question.answers.filter(a => a !== opt);
      };

      const del = delBtn(() => {
        const removed = question.options.splice(i, 1)[0];
        question.answers = question.answers.filter(a => a !== removed);
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

  div.append(qInput, textInput, optionsDiv, addBtn, deleteButton(index, onDelete));
  renderOptions();
  return div;
}
