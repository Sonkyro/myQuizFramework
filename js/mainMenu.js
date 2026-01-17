const quizList = document.getElementById("quiz-list");
const preview = document.getElementById("preview");
const titleEl = document.getElementById("preview-title");
const descEl = document.getElementById("preview-desc");
const playBtn = document.getElementById("play-btn");

let selectedQuiz = null;
titleEl.textContent = "Wähle ein Quiz";
descEl.textContent = "oder lade dein eigenes Quiz im JSON-Format.";
// Helper to manage Play button state
function disablePlayButton() {
  playBtn.disabled = true;
  playBtn.classList.add("opacity-50");
}

function enablePlayButton() {
  playBtn.disabled = false;
  playBtn.classList.remove("opacity-50", "cursor-not-allowed");
  playBtn.removeAttribute("aria-disabled");
}

// start disabled
disablePlayButton();
async function loadExamples() {
  const files = ["demo.json", "relationaleDatenbanken.json"]; // Quizzes hier einfügen

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

document.getElementById("load-custom").onclick = () => {
  const txt = document.getElementById("custom-json").value;
  try {
    const quiz = JSON.parse(txt);
    selectQuiz(quiz);
  } catch {
    alert("Ungültiges JSON");
  }
};

document.getElementById("unselect").onclick = () => {
  selectedQuiz = null;
  titleEl.textContent = "Wähle ein Quiz";
  descEl.textContent = "oder lade dein eigenes Quiz im JSON-Format.";
  disablePlayButton();
};

loadExamples();
