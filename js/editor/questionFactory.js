export function createQuestion(type) {
  switch (type) {
    case "text":
      return { type, text: "", paragraphs: [] };

    case "trueFalse":
      return { type, question: "", answer: "wahr" };

    case "multipleChoice":
      return { type, question: "", options: [], answer: [] };

    case "fillInBlank":
      return { type, question: "", text: "", options: [], answers: [] };

    case "sorting":
      return { type, question: "", items: [] };

    case "matching":
      return { type, question: "", pairs: [] };
  }
}
