export function loadQuizFromSession() {
  const data = sessionStorage.getItem("quizData");

  if (!data) {
    alert("Kein Quiz geladen – bitte über das Menü starten.");
    location.href = "index.html";
    throw new Error("Kein Quiz");
  }

  return JSON.parse(data);
}
