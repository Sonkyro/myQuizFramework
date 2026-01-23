export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function setColor(el, type, color = "default") {
  switch (type){
    case "btnInit":
      el.classList.add("px-4", "py-3", "bg-gray-100", "rounded", "border-2", "border-gray-300", "hover:bg-gray-200", "focus:outline-none", "select-none");
      break;
    case "btnState": 
      el.classList.remove(
        "bg-gray-100","bg-gray-200","bg-green-200","bg-red-200",
        "border-gray-300","border-gray-400","border-green-500","border-red-500"
      );
      switch (color) {
        case "selected":
          el.classList.add("bg-gray-200", "border-gray-300");
          break;
        case "correct":
          el.classList.add("bg-green-200","border-green-400");
          break;
        case "wrong":
          el.classList.add("bg-red-200","border-red-400");
          break;
        case "default":
          el.classList.add("bg-gray-100", "border-gray-300");
      }
      break;
    case "pairElInit":
        el.classList.add("border-2", "border-gray-300", "px-4", "py-3", "rounded", "bg-gray-100", "cursor-pointer", "hover:bg-gray-200", "select-none")
      break;
    case "sortingInit":
      el.classList.add("sorting-item", "border", "px-4", "py-3", "rounded", "bg-gray-100", "cursor-move", "hover:bg-gray-200", "select-none", "text-align-center")
      break;
  }
}