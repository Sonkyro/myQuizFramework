import {
  createWrapper,
  input,
  deleteButton
} from "./common.js";

export function renderTrueFalse(question, index, onDelete) {
  const div = createWrapper("True / False");

  const qInput = input("Frage", question.question, v => question.question = v);

  const select = document.createElement("select");
  select.className = "border p-1";

  const optTrue = new Option("wahr", "wahr");
  const optFalse = new Option("falsch", "falsch");

  select.append(optTrue, optFalse);
  select.value = question.answer || "wahr";

  select.onchange = e => question.answer = e.target.value;

  div.append(
    qInput,
    select,
    deleteButton(index, onDelete)
  );

  return div;
}
