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
  const questions = quiz.questions || [];

  const head = document.createElement("div");
  head.className = "mb-4";
  head.innerHTML = `
    <h2 class="text-2xl font-bold">Auswertung</h2>
    <p>Du hast ${summary.correct} von ${summary.total} Fragen richtig beantwortet! Das sind ${summary.percent}% Richtig</p>
  `;
  container.appendChild(head);

  results.forEach((r, i) => {
    const q = questions[i] || {};

    const card = document.createElement("div");
    card.className = "border-2 mt-3 p-3 rounded";

    const status = r.correct ? "Richtig Beantwortet" : "Falsch Beantwortet";
    // Tailwind-Farben mit ~60% Deckkraft (JIT: use e.g. bg-green-300/60)
    if (r.correct) {
      card.classList.add("bg-green-300", "border-green-500");
    } else {
      card.classList.add("bg-red-300", "border-red-500");
    }
    const title = document.createElement("h3");
    title.className = "font-semibold text-lg";
    title.textContent = `Frage ${i + 1} - ${status}`;
    card.appendChild(title);

    const qText = document.createElement("p");
    qText.className = "italic mb-2";
    qText.textContent = q.question || q.text || "(Keine Frage)";
    card.appendChild(qText);

    const details = document.createElement("div");
    details.className = "text-sm";

    // Typabhängige Darstellung
    switch (q.type) {
      case "multipleChoice": {
        const user = Array.isArray(r.userAnswer) ? r.userAnswer : (r.userAnswer ? [r.userAnswer] : []);
        const correct = Array.isArray(r.correctAnswer) ? r.correctAnswer : (r.correctAnswer ? [r.correctAnswer] : []);

        if (r.correct) {
          details.innerHTML = `Richtige Antwort(en): ${joinComma(correct)}<br>Deine Antwort: ${joinComma(user)} war korrekt!`;
        } else {
          details.innerHTML = `Deine Antwort: ${joinComma(user)} war leider falsch.<br>Richtig wäre gewesen: ${joinComma(correct)}`;
        }
        break;
      }

      case "trueFalse": {
        const corr = r.correctAnswer || q.answer || "";
        const normalized = (corr + "").toLowerCase();
        const display = normalized === "wahr" || normalized === "true" ? "Wahr" : "Falsch";
        details.innerHTML = `Lösung: ${display}`;
        break;
      }

      case "fillInBlank": {
        const userArr = Array.isArray(r.userAnswer) ? r.userAnswer : [];
        const corrArr = Array.isArray(r.correctAnswer) ? r.correctAnswer : r.correctAnswer ? [r.correctAnswer] : [];

        if (r.correct) {
          details.innerHTML = `Lösung: ${buildSentence(q.text, corrArr)}`;
        } else {
          details.innerHTML = `Deine Lösung: ${buildSentence(q.text, userArr)} war leider nicht korrekt.<br>Richtig wäre gewesen: ${buildSentence(q.text, corrArr)}`;
        }
        break;
      }

      case "matching": {
        const corrPairs = Array.isArray(r.correctAnswer) ? r.correctAnswer : (q.pairs || []);
        const userMap = r.userAnswer || {};

        if (r.correct) {
          details.innerHTML = `Lösung:<br>${formatPairsArray(corrPairs)}`;
        } else {
          const userList = formatUserPairs(corrPairs, userMap);
          details.innerHTML = `Deine Lösung:<br>${userList}<br><br>Richtig wäre gewesen:<br>${formatPairsArray(corrPairs)}`;
        }
        break;
      }

      case "sorting": {
        const userArr = Array.isArray(r.userAnswer) ? r.userAnswer : [];
        const corrArr = Array.isArray(r.correctAnswer) ? r.correctAnswer : [];

        const userChain = userArr.join(" → ") || "(keine Antwort)";
        const corrChain = corrArr.join(" → ") || "(keine Angabe)";

        if (r.correct) {
          details.innerHTML = `Lösung: ${corrChain}`;
        } else {
          details.innerHTML = `Deine Lösung: ${userChain} war leider nicht korrekt.<br>Richtig wäre gewesen: ${corrChain}`;
        }
        break;
      }

      default: {
        // Fallback: generische Anzeige
        details.innerHTML = `Deine Antwort: ${JSON.stringify(r.userAnswer)}<br>Korrekt: ${JSON.stringify(r.correctAnswer)}`;
      }
    }

    card.appendChild(details);
    container.appendChild(card);
  });

}
