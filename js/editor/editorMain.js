import { quiz, addQuestion } from "./quizState.js";
import { initStyle, questionTypes } from "../utils.js"
import { createQuestion } from "./questionFactory.js";
import { render } from "./renderContent.js";

const titleInput = document.getElementById("quiz-title");
const descInput = document.getElementById("quiz-desc");
const list = document.getElementById("question-list");

titleInput.value = quiz.meta.title;
descInput.value = quiz.meta.description;

titleInput.oninput = e => quiz.meta.title = e.target.value;
descInput.oninput = e => quiz.meta.description = e.target.value;

const addBtn = document.getElementById("add-question");
const exportBtn = document.getElementById("export-btn");
const testBtn = document.getElementById("test-btn");

initStyle(addBtn, "menuBtn", "blue", "hover-up")
initStyle(exportBtn, "menuBtn", "purple", "hover-up");
initStyle(testBtn, "menuBtn", "green", "hover-up");


// build type menue for block creation
const typeMenu = document.createElement("div");
typeMenu.className = "absolute bg-white border rounded shadow p-1 hidden flex flex-col items-center";
typeMenu.style.zIndex = "50";
typeMenu.style.minWidth = "0";
typeMenu.style.whiteSpace = "nowrap";


questionTypes.forEach(q => {
  const btn = document.createElement("button");
  btn.textContent = q.label;
  btn.className = "w-full text-center px-5 py-1 rounded hover:bg-gray-200";
  btn.onclick = () => {
    addQuestion(createQuestion(q.value));
    render(list);
    typeMenu.classList.add("hidden");
  };
  typeMenu.appendChild(btn);
});

document.body.appendChild(typeMenu);

// open menu on btn click
addBtn.onclick = (e) => {
  const rect = addBtn.getBoundingClientRect();
  typeMenu.style.top = `${rect.bottom + window.scrollY + 4}px`;
  typeMenu.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
  typeMenu.style.transform = "translateX(-50%)";

  if (typeMenu.classList.contains("hidden")) {
    typeMenu.classList.remove("hidden");
    typeMenu.classList.add("opacity-0", "scale-95");
    requestAnimationFrame(() => {
      typeMenu.classList.remove("opacity-0", "scale-95");
      typeMenu.classList.add("opacity-100", "scale-100", "transition", "duration-200", "ease-out");
    });
  } else {
    typeMenu.classList.remove("opacity-100", "scale-100");
    typeMenu.classList.add("opacity-0", "scale-95");
    setTimeout(() => typeMenu.classList.add("hidden"), 200);
  }
};
// Click outside of dropdown menu to close it
document.addEventListener("click", (e) => {
  if (!typeMenu.contains(e.target) && e.target !== addBtn) {
    if (!typeMenu.classList.contains("hidden")) {
      typeMenu.classList.remove("opacity-100", "scale-100");
      typeMenu.classList.add("opacity-0", "scale-95");
      setTimeout(() => typeMenu.classList.add("hidden"), 200);
    }
  }
});


exportBtn.onclick = () => {
  const out = document.getElementById("output-json");
  out.classList.remove("hidden");
  out.value = JSON.stringify(quiz, null, 2);
};

testBtn.onclick = () => {
  sessionStorage.setItem("quizData", JSON.stringify(quiz));
  location.href = "quiz.html";
};

render(list);
