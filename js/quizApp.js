import { loadQuizFromSession } from "./quizLoader.js";
import { contentTypes } from "./contentTypes/index.js";
import { ScoreManager } from "./scoreManager.js";
import { renderResults } from "./resultView.js";
import { setColor } from "./utils.js";
import { qUiColor } from "./utils.js";
import { initStyle } from "./utils.js";

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

const hContainer = document.getElementById("content-head-container");
const cContainer = document.getElementById("content-container");
const scoreDiv = document.getElementById("score");
const navContainer = document.getElementById("nav-container");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const resultContainer = document.getElementById("result-container");
const backToIndexBtn = document.getElementById("back-to-index-btn");

initStyle(nextBtn, "menuBtn", "green", "hover");
initStyle(prevBtn, "menuBtn", "light-grey", "hover");
initStyle(checkBtn, "menuBtn", "blue", "hover");
initStyle(backToIndexBtn, "menuBtn", "dark-gray", "hover");


document.getElementById("quiz-title").textContent = quiz.meta?.title || "Kein Titel";
document.getElementById("quiz-desc").textContent = quiz.meta?.description || "";

quiz.content.forEach(q => {
  if (q.type != "text") {
    qCount++;
  }
});

function colorQuestions(q, container, formatted) {
  // ---- Farbfeedback auf Items anwenden ----
  switch (q.type) {
    case "trueFalse":
      container.querySelectorAll("button").forEach(btn => {
        btn.classList.remove(qUiColor["bg-hover"], "focus:outline-none")
        const val = btn.textContent.toLowerCase() || "";
        // color Border
        if (val === formatted.correct.toLowerCase()) {
           setColor(btn,"btnState", "correctBorder");
          }
        if (formatted.user != null) {   
          if ((val === formatted.user.toLowerCase()) && (val === formatted.correct.toLowerCase())) setColor(btn,"btnState", "correctBg");
          if ((val === formatted.user.toLowerCase()) && (val != formatted.correct.toLowerCase())) {
            setColor(btn,"btnState", "wrongAll");
          }
        }

        btn.disabled = true;
      });
      break;

    case "multipleChoice":
      container.querySelectorAll("button").forEach(btn => {
        btn.classList.remove(qUiColor["bg-hover"], "focus:outline-none")
        const val = btn.textContent;
        if (formatted.correct.includes(val)) {
          setColor(btn,"btnState", "correctBorder");
          if (formatted.user.includes(val)) setColor(btn,"btnState", "correctBg");
        } else if (formatted.user.includes(val)) {
          setColor(btn,"btnState", "wrongAll");
        } else {
          setColor(btn,"btnState", "default");
        }
        btn.disabled = true; // nicht mehr klickbar
      });
      break;

    case "fillInBlank":
      // Alle Dropzones durchgehen
      const dropzones = container.querySelectorAll("[data-blank-index]");
      
      dropzones.forEach((dz, idx) => {
        const block = dz.firstElementChild;
        if (!block) return; // keine Antwort gesetzt → keine Aktion

        const correctAnswer = Array.isArray(formatted.correct) ? formatted.correct[idx] : formatted.correct;
        const userValue = block.dataset.value || block.textContent.trim();

        if (userValue === correctAnswer) {
          setColor(block,"btnState", "correctAll");
        } else {
          setColor(block,"btnState", "wrongAll");
        }

        // nicht mehr verschiebbar
        block.draggable = false;
      });

      const allOptions = container.querySelectorAll("[data-value]");
      allOptions.forEach(opt => {
        opt.draggable = false;
        opt.style.cursor = "default";
      });
      break;

    case "sorting":
      // Färbe die eigentlichen Item-DIVs, nicht die Slot-LIs
      const items = Array.from(container.querySelectorAll('.sorting-item'));
      items.forEach((el, idx) => {
        el.classList.remove(qUiColor["bg-hover"], "focus:outline-none")
        if (formatted.correct[idx] === (el.textContent || '').trim()) {
          setColor(el,"btnState", "correctAll");
        } else {
          setColor(el,"btnState", "wrongAll");
        }
        el.draggable = false;
      });
      break;

    case "matching":
      // Alle linken und rechten Items färben
      const leftItems = Array.from(container.querySelectorAll("div[data-left]"));
      const rightItems = Array.from(container.querySelectorAll("div[data-right]"));

      leftItems.forEach(l => {
        const match = formatted.correct.find(p => p.left === l.dataset.left)?.right;
        if (l.dataset.match === match) {
          setColor(l,"btnState", "correctAll");
        } else {
          setColor(l,"btnState", "wrongAll");
        }
        l.onclick = null;
      });

      rightItems.forEach(r => {
        const match = formatted.correct.find(p => p.right === r.dataset.right)?.left;
        // suche das verbundene linke Item
        const connected = leftItems.find(l => l.dataset.match === r.dataset.right);

        if (connected && connected.dataset.left === match) {
          setColor(r,"btnState", "correctAll");
        } else if (connected && connected.dataset.left != match) {
          setColor(r,"btnState", "wrongAll");
        } else {
          setColor(r,"btnState", "default");
        }
        r.onclick = null;
      });
      break;
  }
}

function displayAnswers(q, a, container) {
  const module = contentTypes[q.type];
  const formattedAnswer = {user: a.userAnswer, correct: a.correctAnswer}
   switch (q.type) {
    case "fillInBlank":
      formattedAnswer.user.forEach((answer, i) =>
        module.placeAnswer(container, i, answer)
      )
      break;
      
    case "sorting":
        module.setOrder(container, formattedAnswer.user);
      break;

    case "matching":
        module.render(q, container, formattedAnswer.user);
      break;

   }
  colorQuestions(q, container, formattedAnswer)
}

function showContent(atIndex) {
  hContainer.innerHTML = "";
  cContainer.innerHTML = "";
  resultContainer.innerHTML = "";
  checkBtn.style.display = "inline-block";
  checkBtn.disabled = false;
  nextBtn.classList.add("hidden");
  if (atIndex >= 1) {
    prevBtn.classList.remove("hidden");
  } else {prevBtn.classList.add("hidden");}

  const q = content[atIndex];

  if (q.type === "text") {
    const hTitle = document.createElement("h2");
    hTitle.className = "text-xl font-bold mb-1";
    hTitle.textContent = q.test || "(Kein Titel)";
    hContainer.appendChild(hTitle);

    checkBtn.style.display = "none";
    nextBtn.classList.remove("hidden");
  } else if (q.type != "text") {                        // divCounter interferes with coloring logic -> neds to be moved
    const divCounter = document.createElement("div");
    divCounter.className = "flex justify-end";
    hContainer.appendChild(divCounter);

    const hCounter = document.createElement("p");
    hCounter.className = "font-bold mb-2 text-left";
    hCounter.textContent = `Frage ${qIndex} von ${qCount}`;
    divCounter.appendChild(hCounter);

    const frage = document.createElement("h2");
    frage.className = "text-xl font-bold mb-4";
    frage.textContent = q.question || "(Keine Frage)";
    hContainer.appendChild(frage);

    if (score.results.some(obj => obj.questionId === qIndex)) {
      checkBtn.style.display = "none";
      nextBtn.classList.remove("hidden");
    }
  } else {
    cContainer.innerHTML += `<p class="text-red-600">Unbekannter Fragetyp: ${q.type}</p>`;
    return;
  }


  const module = contentTypes[q.type];

  const answerBox = document.createElement("div");
  cContainer.appendChild(answerBox);

  module.render(q, answerBox);

  if (score.results.some(obj => obj.questionId === qIndex && (q.type != "text"))) {
    const answer = score.results.find(obj => obj.questionId === qIndex);
    displayAnswers(q, answer, answerBox)
  }
}

checkBtn.onclick = () => {
  const q = content[index];
  const module = contentTypes[q.type];

  const userAnswer = module.getUserAnswer(cContainer);  
  const correct = module.isCorrect(q, userAnswer);      // returns bool
  const formatted = module.formatAnswer(q, userAnswer); // returns string user input and solution
  // console.log(formatted);

  score.add({
    questionId: qIndex,
    correct,
    userAnswer: formatted.user,
    correctAnswer: formatted.correct
  });
/*   console.log(
    {
      questionId: qIndex,
      correct,
      userAnswer: formatted.user,
      correctAnswer: formatted.correct
    }
  ); */

  // Check-Button verschwinden lassen
  checkBtn.style.display = "none";

  // Nächste Frage-Button sichtbar machen
  nextBtn.classList.remove("hidden");

  const answerBox = cContainer.querySelector("div"); // the content container-DIV, drawn by render()
  colorQuestions(q, answerBox, formatted)

};

nextBtn.onclick = () => {
  index++;
  if (index >= content.length) {
    finishQuiz();
    return;
  }
  if (content[index].type != "text") {qIndex++;}
  showContent(index);
};

prevBtn.onclick = () => {
  if (content[index].type != "text") {qIndex--;}
  index--;
  showContent(index);
};

backToIndexBtn.onclick = () => {
  location.href = "index.html";
  };

function finishQuiz() {
  hContainer.innerHTML = "";
  cContainer.innerHTML = "";
  resultContainer.classList.remove("hidden");
  navContainer.classList.add("hidden");
  checkBtn.style.display = "none";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";

  const summary = score.getSummary();
  renderResults(resultContainer, score.results, summary);
}

showContent(index);
