import { loadQuizFromSession } from "./quizLoader.js";

function joinComma(val) {
  if (!val && val !== 0) return "";
  return Array.isArray(val) ? val.join(", ") : String(val);
}

function buildSentence(template, answers) {
  if (!template) return "";
  const parts = template.split("___");
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    out.push(parts[i]);
    if (i < parts.length - 1) {
      out.push(answers && answers[i] !== undefined ? answers[i] : "___");
    }
  }
  return out.join("");
}

function formatPairsArray(pairs) {
  return pairs.map(p => `${p.left} → ${p.right}`).join("<br>");
}

function formatUserPairs(pairsOrder, userMap) {
  return pairsOrder.map(p => {
    const user = userMap[p.left] || "(keine Verbindung)";
    return `${p.left} → ${user}`;
  }).join("<br>");
}

export function renderResults(container, results, summary) {
  container.innerHTML = "";

  const quiz = loadQuizFromSession();
  const questions = []
  quiz.content.forEach(q => {
    if (q.type != "text") {
      questions.push(q);
  }});

  const head = document.createElement("div");
  head.className = "mb-4";
  head.innerHTML = `
    <h2 class="text-2xl font-bold">Auswertung</h2>
    <p>Du hast ${summary.correct} von ${summary.total} Fragen richtig beantwortet! Das sind ${summary.percent}% Richtig</p>
  `;
  container.appendChild(head);

  results.forEach((r, i) => {
    const q = questions[r.questionId - 1] || {};

    // Card
    const card = document.createElement("div");
    card.className =
      "border-2 rounded-xl mb-4 transition-colors cursor-pointer";

    if (r.correct) {
      card.classList.add("bg-green-200", "border-green-400");
    } else {
      card.classList.add("bg-red-200", "border-red-400");
    }

    // Header
    const header = document.createElement("div");
    header.className = "p-2 flex justify-between items-start";

    const headerLeft = document.createElement("div");

    const title = document.createElement("h3");
    title.className = "font-semibold text-lg";
    title.textContent = `${i + 1}. ${r.correct ? "Richtig beantwortet" : "Falsch beantwortet"}`;

    const qText = document.createElement("p");
    qText.className = "text-sm italic text-gray-600";
    qText.textContent = q.question || "(Keine Frage vorhanden)";

    headerLeft.appendChild(title);
    headerLeft.appendChild(qText);

    header.append(headerLeft);
    card.appendChild(header);

    // Details (Accordion)
    const detailsWrapper = document.createElement("div");
    detailsWrapper.className =
      "overflow-hidden transition-all duration-500 max-h-0";

    const details = document.createElement("div");
    details.className = "px-4 pb-4 text-sm text-gray-800";

    // Typabhängige Darstellung
    switch (q.type) {
      case "trueFalse": {
        const row = document.createElement("p");
        row.textContent = `Deine Antwort: ${r.userAnswer} | Richtige Antwort: ${r.correctAnswer}`;
        details.appendChild(row);
        break;
      }

      case "multipleChoice": {
        const user = r.userAnswer || [];
        const correct = r.correctAnswer || [];

        const userTitle = document.createElement("p");
        userTitle.className = "font-medium";
        userTitle.textContent = "Deine Antworten:";
        details.appendChild(userTitle);

        user.forEach(a => {
          const item = document.createElement("div");
          item.className = correct.includes(a)
            ? "text-green-600"
            : "text-red-600";
          item.textContent = a;
          details.appendChild(item);
        });

        const corrTitle = document.createElement("p");
        corrTitle.className = "font-medium mt-3";
        corrTitle.textContent = "Richtige Antworten:";
        details.appendChild(corrTitle);

        correct.forEach(a => {
          const item = document.createElement("div");
          item.className = "text-green-700";
          item.textContent = a;
          details.appendChild(item);
        });
        break;
      }

      case "fillInBlank": {
        const userSentence = buildSentence(q.text, r.userAnswer || []);
        const corrSentence = buildSentence(q.text, r.correctAnswer || []);

        const userP = document.createElement("p");
        userP.textContent = `Deine Lösung: ${userSentence}`;
        userP.className = r.correct ? "text-green-700" : "text-red-700";

        const corrP = document.createElement("p");
        corrP.textContent = `Richtige Lösung: ${corrSentence}`;
        corrP.className = "mt-2 text-green-700";

        details.appendChild(userP);
        details.appendChild(corrP);
        break;
      }

      case "sorting": {
        const userChain = (r.userAnswer || []).join(" → ");
        const corrChain = (r.correctAnswer || []).join(" → ");

        const userP = document.createElement("p");
        userP.textContent = `Deine Reihenfolge: ${userChain}`;
        userP.className = r.correct ? "text-green-700" : "text-red-700";

        const corrP = document.createElement("p");
        corrP.textContent = `Richtige Reihenfolge: ${corrChain}`;
        corrP.className = "mt-2 text-green-700";

        details.appendChild(userP);
        details.appendChild(corrP);
        break;
      }

      case "matching": {
        const corrPairs = r.correctAnswer || [];
        const userMap = r.userAnswer || {};

        corrPairs.forEach(pair => {
          const row = document.createElement("div");
          row.className = "flex justify-between";

          const left = document.createElement("span");
          left.textContent = pair.left;

          const right = document.createElement("span");
          right.textContent = userMap[pair.left] || "(keine Antwort)";

          if (userMap[pair.left] === pair.right) {
            row.classList.add("text-green-700");
          } else {
            row.classList.add("text-red-700");
          }

          row.appendChild(left);
          row.appendChild(right);
          details.appendChild(row);
        });
        break;
      }

      default: {
        const fallback = document.createElement("pre");
        fallback.textContent = JSON.stringify(r, null, 2);
        details.appendChild(fallback);
      }
    }

    detailsWrapper.appendChild(details);
    card.appendChild(detailsWrapper);

    // Accordion Toggle
    let open = false;
    header.addEventListener("click", () => {
      open = !open;
      detailsWrapper.style.maxHeight = open ? details.scrollHeight + "px" : "0px";
    });

    container.appendChild(card);
  });


}
