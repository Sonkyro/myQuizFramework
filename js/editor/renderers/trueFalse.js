import {
  createWrapper,
  inputQuestion,
  inputSelect,
  deleteButton
} from "./common.js";
import { initStyle } from "../../utils.js";

export function renderTrueFalse(question, index, onDelete) {
  const div = createWrapper("True / False");

  function updateSelectColor(isCorrect, el) {
    const select = el.querySelector("select");
    if (isCorrect === "wahr") {
        initStyle(select, "menuBtn", "green", "hover");
    } else if (isCorrect === "falsch") {
        initStyle(select, "menuBtn", "red", "hover");
    } else {
        initStyle(select, "menuBtn", "light-gray", "hover");
    }
    const selectStyle = ["h-full", "w-full", "text-center", "cursor-pointer", "outline-none"];
    select.classList.add(...selectStyle);
  }

  function render() {
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
    row.className = "flex flex-col gap-1 flex-1 border rounded p-3 bg-gray-100 mb-4";
    const cCol = document.createElement("div");
    cCol.className = "flex gap-1 flex-1";
    const qInput = inputQuestion("Frage", question.question, v => question.question = v);

    const options = [{ value: "wahr", label: "wahr" }, { value: "falsch", label: "falsch" }];
    const select = inputSelect(
      options,
      question.answer || "wahr",
      v => {
        const value = v;
        question.userAnswer = value;
        updateSelectColor(value, select.el);
    });
    select.el.classList.remove("h-full");
    updateSelectColor(question.answer, select.el);

    cCol.append(qInput, select.el);
    row.append(hrow, cCol);

    const deleteDiv = document.createElement("div");
    deleteDiv.className = "mt-2 ml-1 flex justify-start";
    deleteDiv.append(deleteButton(index, onDelete))

    div.append(
      row,
      deleteDiv
    );
    return div;
  }

  return render();
}
