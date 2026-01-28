import { createWrapper, inputQuestion, addRemove, delElBtn, checkBtn} from "./common.js";

export function renderMultipleChoice(question, index, onDelete) {
  const div = createWrapper("Multiple Choice");

  const qInput = inputQuestion("Frage", question.question, v => question.question = v);

  const optionsDiv = document.createElement("div");

  function renderOptions() {
    optionsDiv.innerHTML = "";
    //if (question.options) question.options.push("");

    question.options.forEach((opt, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2 mb-4";
      const cCol = document.createElement("div");
      cCol.className = "flex gap-1 flex-1 border rounded p-3 bg-gray-100";

      const inp = inputQuestion("Antwortmöglichkeit " + (i + 1), opt, e => question.options[i] = e);

      const chk = checkBtn(
        question.answer.includes(opt),
        (checked) => {
          if (checked) {
            if (!question.answer.includes(opt)) question.answer.push(opt);
          } else {
            question.answer = question.answer.filter(a => a !== opt);
          }
        }
      );

      cCol.append(chk.el, inp);

      const delCol = delElBtn(() => {
        const removed = question.options.splice(i, 1)[0];
        question.answer = question.answer.filter(a => a !== removed);
        renderOptions();
      });

      row.append(cCol, delCol);
      optionsDiv.appendChild(row);
    });
  }

  const addRemoveDiv = addRemove(() => {
    question.options.push("");
    renderOptions();
  }, index, onDelete);

  div.append(qInput, optionsDiv, addRemoveDiv);
  renderOptions();
  return div;
}
