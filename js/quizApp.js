import { loadQuizFromSession } from "./quizLoader.js";
import { questionTypes } from "./contentTypes/index.js";
import { ScoreManager } from "./scoreManager.js";
import { renderResults } from "./resultView.js";

const quiz = loadQuizFromSession();

if (!quiz.content || !quiz.content.length) {
  alert("Quiz enthält keine Fragen.");
  location.href = "index.html";
}

const content = quiz.content;

let index = 0;
let qCount = 0;
let qIndex = 0;
const score = new ScoreManager();

const cContainer = document.getElementById("content-container");
const scoreDiv = document.getElementById("score");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const backToIndexBtn = document.getElementById("back-to-index-btn");

document.getElementById("quiz-title").textContent = quiz.meta?.title || "Kein Titel";
document.getElementById("quiz-desc").textContent = quiz.meta?.description || "";

quiz.content.forEach(q => {
  if (q.type != "text") {
    qCount++;
  }
});

function showContent() {
  cContainer.innerHTML = "";
  resultContainer.innerHTML = "";
  checkBtn.style.display = "inline-block";
  checkBtn.disabled = false;
  nextBtn.classList.add("hidden");

  if (index >= content.length) {
    finishQuiz();
    return;
  }

  const q = content[index];

  if (q.type === "text") {
    const cTitle = document.createElement("h2");
    cTitle.className = "text-xl font-bold mb-1";
    cTitle.textContent = q.test || "(Kein Titel)";
    cContainer.appendChild(cTitle);

    checkBtn.style.display = "none";
    nextBtn.classList.remove("hidden");
  } else if (q.type != "text") {                        // divCounter interferes with coloring logic -> neds to be moved
    const divCounter = document.createElement("div");
    divCounter.className = "flex justify-end";
    cContainer.appendChild(divCounter);

    const qCounter = document.createElement("p");
    qCounter.className = "font-bold mb-2 text-left";
    qCounter.textContent = `Frage ${qIndex + 1} von ${qCount}`;
    divCounter.appendChild(qCounter);

    qIndex++;

    const frage = document.createElement("h2");
    frage.className = "text-xl font-bold mb-4";
    frage.textContent = q.question || "(Keine Frage)";
    cContainer.appendChild(frage);
  } else {
    cContainer.innerHTML += `<p class="text-red-600">Unbekannter Fragetyp: ${q.type}</p>`;
    return;
  }

  const module = questionTypes[q.type];

  const answerBox = document.createElement("div");
  cContainer.appendChild(answerBox);

  module.render(q, answerBox);
}

checkBtn.onclick = () => {
  const q = content[index];
  const module = questionTypes[q.type];

  const userAnswer = module.getUserAnswer(cContainer);
  const correct = module.isCorrect(q, userAnswer);
  const formatted = module.formatAnswer(q, userAnswer);

  score.add({
    questionId: q.id,
    correct,
    userAnswer: formatted.user,
    correctAnswer: formatted.correct
  });

  // Check-Button verschwinden lassen
  checkBtn.style.display = "none";

  // Nächste Frage-Button sichtbar machen
  nextBtn.classList.remove("hidden");

  // ---- Farbfeedback auf Items anwenden ----
  const answerBox = cContainer.querySelector("div"); // Das Container-DIV, in dem render() alles gezeichnet hat

  switch (q.type) {
    case "multipleChoice":
      answerBox.querySelectorAll("button").forEach(btn => {
        const val = btn.textContent;
        if (formatted.correct.includes(val)) {
          btn.classList.remove("bg-gray-100", "bg-gray-300");
          btn.classList.add("bg-green-300", "border-green-500");
        } else if (formatted.user.includes(val)) {
          btn.classList.remove("bg-gray-100", "bg-gray-300");
          btn.classList.add("bg-red-300", "border-red-500");
        } else {
          btn.classList.remove("bg-gray-300");
          btn.classList.add("bg-gray-100");
        }
        btn.disabled = true; // nicht mehr klickbar
      });
      break;

    case "trueFalse":
      answerBox.querySelectorAll("button").forEach(btn => {
        const val = btn.textContent.toLowerCase();
        if (val === formatted.correct.toLowerCase()) {
          btn.classList.remove("bg-gray-100", "bg-gray-300");
          btn.classList.add("bg-green-300", "border-green-500");
        } else if (val === (formatted.user || "").toLowerCase()) {
          btn.classList.remove("bg-gray-100", "bg-gray-300");
          btn.classList.add("bg-red-300", "border-red-500");
        } else {
          btn.classList.remove("bg-gray-300");
          btn.classList.add("bg-gray-100");
        }
        btn.disabled = true;
      });
      break;

    case "fillInBlank":
      // Alle Dropzones durchgehen
      const dropzones = answerBox.querySelectorAll("[data-blank-index]");

      dropzones.forEach((dz, idx) => {
        const block = dz.firstElementChild;
        if (!block) return; // keine Antwort gesetzt → keine Aktion

        // alte bg-Klassen entfernen
        block.classList.remove("bg-gray-100","bg-gray-200","bg-green-300","bg-red-300","bg-yellow-300");

        const correctAnswer = Array.isArray(formatted.correct) ? formatted.correct[idx] : formatted.correct;
        const userValue = block.dataset.value || block.textContent.trim();

        if (userValue === correctAnswer) {
          block.classList.add("bg-green-300", "border-green-500"); // korrekt
        } else {
          block.classList.add("bg-red-300", "border-red-500");   // falsch
        }

        // nicht mehr verschiebbar
        block.draggable = false;
      });
      break;

    case "sorting":
      // Färbe die eigentlichen Item-DIVs, nicht die Slot-LIs
      const items = Array.from(answerBox.querySelectorAll('.sorting-item'));
      items.forEach((el, idx) => {
        el.classList.remove("bg-gray-100","bg-gray-200","bg-green-300","bg-red-300","border-green-500","border-red-500");
        if (formatted.correct[idx] === (el.textContent || '').trim()) {
          el.classList.add("bg-green-300", "border-green-500");
        } else {
          el.classList.add("bg-red-300", "border-red-500");
        }
        el.draggable = false; // Sortieren deaktivieren
      });
      break;

    case "matching":
      // Alle linken und rechten Items färben
      const leftItems = Array.from(answerBox.querySelectorAll("div[data-left]"));
      const rightItems = Array.from(answerBox.querySelectorAll("div[data-right]"));

      leftItems.forEach(l => {
        // alte bg-Klassen entfernen
        l.classList.remove("bg-gray-100","bg-gray-200","bg-green-300","bg-red-300");

        const match = formatted.correct.find(p => p.left === l.dataset.left)?.right;
        if (l.dataset.match === match) {
          l.classList.add("bg-green-300", "border-green-500");
        } else {
          l.classList.add("bg-red-300", "border-red-500");
        }
        l.onclick = null; // Klick deaktivieren
      });

      rightItems.forEach(r => {
        r.classList.remove("bg-gray-100","bg-gray-200","bg-green-300","bg-red-300");

        const match = formatted.correct.find(p => p.right === r.dataset.right)?.left;
        // suche das verbundene linke Item
        const connected = leftItems.find(l => l.dataset.match === r.dataset.right);

        if (connected && connected.dataset.left === match) {
          r.classList.add("bg-green-300", "border-green-500"); // richtig verbunden
        } else if (connected) {
          r.classList.add("bg-red-300", "border-red-500"); // falsch verbunden
        } else {
          r.classList.add("bg-gray-100"); // neutral / nicht verbunden
        }
        r.onclick = null; // Klick deaktivieren
      });
      break;
  }
};

nextBtn.onclick = () => {
  index++;
  showContent();
};

backToIndexBtn.onclick = () => {
  location.href = "index.html";
  };

function finishQuiz() {
  cContainer.innerHTML = "";
  resultContainer.classList.remove("hidden");
  checkBtn.style.display = "none";
  nextBtn.style.display = "none";

  const summary = score.getSummary();
  renderResults(resultContainer, score.results, summary);
}

showContent();
