import { quiz, removeQuestion } from "./quizState.js";
import { initStyle, setAnimation } from "../utils.js";

import { renderText } from "./renderers/text.js";
import { renderTrueFalse } from "./renderers/trueFalse.js";
import { renderMultipleChoice } from "./renderers/multipleChoice.js";
import { renderFillInBlank } from "./renderers/fillInBlank.js";
import { renderSorting } from "./renderers/sorting.js";
import { renderMatching } from "./renderers/matching.js";

export function render(container) {
  container.innerHTML = "";
  const removeFn = removeAndRefresh(container);

  quiz.content.forEach((q, i) => {
    let el;

    switch (q.type) {
        case "text":            el = renderText(q, i, removeFn);                            break;
        case "trueFalse":       el = renderTrueFalse(q, i, removeFn);                       break;
        case "multipleChoice":  el = renderMultipleChoice(q, i, removeFn);                  break;
        case "fillInBlank":     el = renderFillInBlank(q, i, removeFn);                     break;
        case "sorting":         el = renderSorting(q, i, removeFn);                         break;
        case "matching":        el = renderMatching(q, i, removeFn);                        break;
    }
    const wrapped = wrapWithControls(el, i, container);
    container.appendChild(wrapped);
  });

}

function removeAndRefresh(container) {
  return (index) => {
    removeQuestion(index);
    render(container);
  };
}

function swapArray(arr, i, j) {
  if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return false;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return true;
}

// Funktion, die den wrapper mit Buttons erzeugt
function wrapWithControls(el, index, container) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("flex", "items-center", "justify-between", "w-full", "mb-2");

  const left = document.createElement("div");
  left.classList.add("flex-1");
  left.appendChild(el);

  // rechte Seite: Button-Container
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("flex", "flex-col", "items-center", "ml-2");

  function makeButton(text, fn) {
    const b = document.createElement("button");
    b.textContent = text;
    text === "↑" ? initStyle(b, "menuBtn", "light-grey", "hover-up") : initStyle(b, "menuBtn", "light-grey", "hover-down")
    b.classList.remove("px-4", "py-2");
    b.classList.add("px-2", "mr-2", "m-1");
    b.onclick = fn;
    return b;
  }

  const upBtn = makeButton("↑", () => {
    if (index <= 0) return;
    const success = swapArray(quiz.content, index, index - 1);
    if (!success) return;
    render(container);
  });

  // Verschiebe vor (nach hinten in der Liste: index+1)
  const downBtn = makeButton("↓", () => {
    if (index >= quiz.content.length - 1) return;
    const success = swapArray(quiz.content, index, index + 1);
    if (!success) return;
    render(container);
  });

  btnContainer.appendChild(upBtn);
  btnContainer.appendChild(downBtn);

  wrapper.appendChild(left);
  wrapper.appendChild(btnContainer);

  return wrapper;
}