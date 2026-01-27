import { loadQuizFromSession } from "../quizLoader.js";

export let quiz = loadQuizFromSession() != null ? loadQuizFromSession() : createEmptyQuiz();

export function createEmptyQuiz() {
  return {
    meta: { title: "", description: "" },
    content: []
  };
}

export function addQuestion(q) {
  quiz.content.push(q);
}

export function removeQuestion(index) {
  quiz.content.splice(index, 1);
}
