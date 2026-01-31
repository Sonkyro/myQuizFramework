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

  function getUsedSlots(exceptIndex = null) {
    return question.answers
      .map((a, i) => (i !== exceptIndex ? a : null))
      .filter(v => v);
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
        badge.className =
          "px-2 py-1 bg-gray-300 text-gray-800 rounded font-semibold text-xs";

        const optIndex = question.answers.findIndex(a => a == (i + 1));
        badge.textContent =
          optIndex !== -1 ? question.options[optIndex] || "?" : "___";

        preview.appendChild(badge);
      }
    });
  }

  function buildSlotOptions(currentIndex) {
    const used = getUsedSlots(currentIndex);
    const blanks = getBlankCount();

    const arr = [];
    for (let i = 1; i <= blanks; i++) {
      if (!used.includes(String(i))) {
        arr.push({ value: String(i), label: `Lücke ${i}` });
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
        question.options[i] = v;
        renderPreview();
      });
      
      const answerIndex = question.answers.includes(String(opt)) ? String(question.answers.indexOf(String(opt))) : "";
      const select = inputSelect(
        buildSlotOptions(i),
        answerIndex,
        v => {
          const intV = parseInt(v) - 1;
          question.answers[intV] = question.options[i];  
          renderPreview();
          renderOptions();
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
