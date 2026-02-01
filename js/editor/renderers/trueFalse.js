import {
  createWrapper,
  inputQuestion,
  deleteButton
} from "./common.js";
import { initStyle } from "../../utils.js";

export function renderTrueFalse(question, index, onDelete) {
  const div = createWrapper("True / False");

  const hrow = document.createElement("div")
  hrow.className = "flex gap-2 px-1 justify-between" 
  const h1 = document.createElement("h3");
  const h2 = document.createElement("h3");
  h1.className = "font-semibold";
  h1.textContent = "Frage";
  h2.className = "font-semibold";
  h2.textContent = "Antwort"
  hrow.append(h1, h2);


  const row = document.createElement("div");
  row.className = "flex gap-2 mb-4 p-1";
  const cCol = document.createElement("div");
  cCol.className = "flex gap-1 flex-1 border rounded p-3 bg-gray-100";
  const qInput = inputQuestion("Frage", question.question, v => question.question = v);

  const dCol = document.createElement("div");
  dCol.className = "justify-center";
  dCol.style.width = "10%";
  dCol.style.minWidth = "80px";

  const selectStyle = ["h-full", "w-full", "text-center", "cursor-pointer", "outline-none"];
  const select = document.createElement("select");
  initStyle(select, "menuBtn", "green", "hover");
  select.classList.add(...selectStyle);

  const optTrue = new Option("wahr", "wahr");
  const optFalse = new Option("falsch", "falsch");
  select.append(optTrue, optFalse);

  select.value = question.answer || "wahr";

  select.onchange = e => question.answer = e.target.value;

  function updateSelectColor(isCorrect) {
    if (isCorrect === "wahr") {
        initStyle(select, "menuBtn", "green", "hover");
    } else if (isCorrect === "falsch") {
        initStyle(select, "menuBtn", "red", "hover");
    } else {
        initStyle(select, "menuBtn", "light-gray", "hover");
    }
     select.classList.add(...selectStyle);
  }

  select.onchange = e => {
    const value = e.target.value;
    question.userAnswer = value;
    updateSelectColor(value);
  };

  cCol.append(qInput);
  dCol.append(select);
  row.append(cCol, dCol);

  const deleteDiv = document.createElement("div");
  deleteDiv.className = "mt-2 ml-1 flex justify-start";
  deleteDiv.append(deleteButton(index, onDelete))

  div.append(
    hrow,
    row,
    deleteDiv
  );

  return div;
}
