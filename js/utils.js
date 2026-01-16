export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function setAnswerState(el, state) {
  el.classList.remove(
    "bg-gray-100","bg-gray-200","bg-green-200","bg-red-200",
    "border-gray-300","border-gray-400","border-green-500","border-red-500"
  );

  el.classList.add("border");

  switch (state) {
    case "selected":
      el.classList.add("bg-gray-200","border-gray-400");
      break;
    case "correct":
      el.classList.add("bg-green-200","border-green-400");
      break;
    case "wrong":
      el.classList.add("bg-red-200","border-red-400");
      break;
    default:
      el.classList.add("bg-gray-100","border-gray-300");
  }
}