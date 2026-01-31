import { createWrapper, inputQuestion, inputText, addRemove, delElBtn, inputSelect } from "./common.js";

export function renderFillInBlank(question, index, onDelete) {
  const div = createWrapper("Lückentext");

  if (!question.options) question.options = [""];
  if (!question.answers) question.answers = [];

  const qInput = inputQuestion("Frage", question.question, v => question.question = v);

  const textInput = inputText("Text mit ___ als Lücken", question.text, v => {
    question.text = v;
    renderPreview();
    renderOptions();
  });

  const preview = document.createElement("div");
  preview.className = "p-3 border rounded bg-gradient-to-r from-gray-50 to-gray-100 text-sm flex flex-wrap gap-2 items-center";

  const optionsDiv = document.createElement("div");

  function getBlankCount() {
    return (question.text.match(/___/g) || []).length;
  }

  function renderPreview() {
    preview.innerHTML = "";

    const parts = question.text.split("___");

    parts.forEach((part, i) => {
      const span = document.createElement("span");
      span.textContent = part;
      preview.appendChild(span);

      if (i < parts.length - 1) {
        const badge = document.createElement("span");
        badge.className = "px-2 py-1 bg-gray-300 text-gray-800 rounded font-semibold text-xs";

        badge.textContent = question.answers[i] || "___"

        preview.appendChild(badge);
      }
    });
  }

  function buildSlotOptions() {
    const blanks = getBlankCount();

    const arr = [];
    for (let i = 0; i <= blanks-1; i++) {
      if (!question.answers[i]) question.answers[i] = "";
      if (true) {
        arr.push({ value: String(i), label: `Lücke ${i+1}` });
      }
    }
    return arr;
  }

  function renderOptions() {
    optionsDiv.innerHTML = "";

    question.options.forEach((opt, i) => {
      const row = document.createElement("div");
      row.className = "flex gap-2 mb-4";

      const cCol = document.createElement("div");
      cCol.className = "flex gap-2 items-center flex-1 border rounded p-3 bg-gray-100";

      const inp = inputQuestion("Option", opt, v => {
        if (question.answers.includes(question.options[i])) {question.answers[question.answers.indexOf(question.options[i])] = v}
        question.options[i] = v;
        renderPreview();
      });
      
      const answerIndex = question.answers.includes(String(opt)) ? String(question.answers.indexOf(String(opt))) : "";
      const select = inputSelect(
        buildSlotOptions(i),
        answerIndex || "",
        v => {
          const vInt = parseInt(v);
          question.answers.forEach((a, j) => {if(a === question.options[i]) question.answers[j] = "";});
          if (v != "") {question.answers[vInt] = question.options[i]} else {question.answers[vInt] = ""};
          renderOptions();
          renderPreview();
        }
      );

      cCol.append(inp, select.el);

      const delCol = delElBtn(() => {
        question.options.splice(i, 1);
        renderOptions();
        renderPreview();
      });

      row.append(cCol, delCol);
      optionsDiv.appendChild(row);
    });
  }

  const addRemoveDiv = addRemove(() => {
    question.options.push("");
    renderOptions();
  }, index, onDelete, "Option hinzufügen");

  div.append(qInput, textInput, preview, optionsDiv, addRemoveDiv);

  renderOptions();
  renderPreview();

  return div;
}
