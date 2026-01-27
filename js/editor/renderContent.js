import { quiz, removeQuestion } from "./quizState.js";

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
    container.appendChild(el);
  });
}

function removeAndRefresh(container) {
  return (index) => {
    removeQuestion(index);
    render(container);
  };
}