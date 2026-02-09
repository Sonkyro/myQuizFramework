import { initStyle } from "./utils.js";
import { setAnimation } from "./utils.js";

const quizList = document.getElementById("quiz-list");
const preview = document.getElementById("preview");
const titleEl = document.getElementById("preview-title");
const descEl = document.getElementById("preview-desc");
const playBtn = document.getElementById("play-btn");
const loadBtn = document.getElementById("load-custom");
const editorBtn = document.getElementById("editor-btn");
const unselectBtn = document.getElementById("unselect");


initStyle(playBtn, "menuBtn", "green", "hover-up");
initStyle(loadBtn, "menuBtn", "blue", "hover-up");
initStyle(editorBtn, "menuBtn", "purple", "hover-up");
initStyle(unselectBtn, "menuBtn", "red", "hover-up");


let selectedQuiz = null;
titleEl.textContent = "Wähle ein Quiz";
descEl.textContent = "oder lade dein eigenes Quiz im JSON-Format.";
// Helper to manage Play button state
function disablePlayButton() {
  playBtn.disabled = true;
  setAnimation(playBtn, "disabled", "green");
}

function enablePlayButton() {
  playBtn.disabled = false;
  setAnimation(playBtn, "hover", "green");
}

// start disabled
disablePlayButton();
async function loadExamples() {
  const files = ["demo.json", "kongoKrise.json", "relationaleDatenbanken.json"]; // Quizzes hier einfügen

  for (const file of files) {
    const res = await fetch(`quizzes/${file}`);
    const quiz = await res.json();

    const btn = document.createElement("button");
    btn.className = "block bg-gray-200 px-3 py-1 rounded w-full text-left";
    btn.textContent = quiz.meta.title;

    btn.onclick = () => selectQuiz(quiz);

    quizList.appendChild(btn);
  }
}

function selectQuiz(quiz) {
  selectedQuiz = quiz;
  titleEl.textContent = quiz.meta.title;
  descEl.textContent = quiz.meta.description;
  enablePlayButton();
}

playBtn.onclick = () => {
  if (!selectedQuiz) {
    alert("Bitte ein Quiz auswählen oder hochladen.");
    return;
  }
  sessionStorage.setItem("quizData", JSON.stringify(selectedQuiz));
  location.href = "quiz.html";
};

loadBtn.onclick = () => {
  const txt = document.getElementById("custom-json").value;
  try {
    const quiz = JSON.parse(txt);
    selectQuiz(quiz);
  } catch {
    alert("Ungültiges JSON");
  }
};

editorBtn.onclick = () => {
  if (selectedQuiz) {
    sessionStorage.setItem("quizData", JSON.stringify(selectedQuiz));
  }
  location.href = "editor.html";
};


unselectBtn.onclick = () => {
  selectedQuiz = null;
  sessionStorage.setItem("quizData", "");
  titleEl.textContent = "Wähle ein Quiz";
  descEl.textContent = "oder lade dein eigenes Quiz im JSON-Format.";
  disablePlayButton();
};

loadExamples();
