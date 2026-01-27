
export let quiz = loadQuizFromSession() != null ? loadQuizFromSession() : createEmptyQuiz();

function createEmptyQuiz() {
  return {
    meta: { title: "", description: "" },
    content: []
  };
}

function loadQuizFromSession() {
  const data = sessionStorage.getItem("quizData");
  if (!data) return null;
  return JSON.parse(data);
}

export function addQuestion(q) {
  quiz.content.push(q);
}

export function removeQuestion(index) {
  quiz.content.splice(index, 1);
}
