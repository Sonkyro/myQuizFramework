export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export const qUiColor = {
  "bg-default": "bg-gray-100",
  "bg-selected": "bg-gray-200",
  "bg-correct": "bg-green-200",
  "bg-wrong": "bg-red-200",
  "bg-hover": "hover:bg-gray-200",
  "border-default": "border-gray-300",
  "border-selected": "border-gray-300",
  "border-correct": "border-green-400",
  "border-wrong": "border-red-400",
  // "border-hover": "hover:border-gray-300" // currently not in use 
}

export const dzStyle = {
  "minWith": "w-36",
  "hight": "h-8"
}

export function initStyle(el, type, color = "default") {
  // define style bundles for init
  const deafultBtnStyle = [qUiColor["bg-default"], qUiColor["border-default"], qUiColor["bg-hover"], "rounded", "border-2", "px-4", "py-3", "select-none"]
  switch (type) {
    case "answerBtn":
      el.classList.add(...deafultBtnStyle);
      break;
    case "sortEl":
      el.classList.add("sorting-item", ...deafultBtnStyle, "cursor-move", "text-align-center", "text-center");
      break;
    case "pairEl":
      el.classList.add(...deafultBtnStyle, "cursor-pointer", "text-center");
      break;
    case "dropzone":
      el.classList.add("w-36", "h-8", "border-2", "border-gray-400", "rounded", qUiColor["bg-default"], "flex", "items-center", "justify-center", "text-center")
      break;
    case "dropEl":
      el.classList.add("w-36", "h-7", qUiColor["bg-default"], "rounded", "flex", "items-center", "justify-center", "cursor-move", "select-none", "text-center")
      break;
    case "menuMainBtn":

      switch (color) {
        case "green":


      }
      break;
  }
}

// define style bundles for seting color
const allBgC = [qUiColor["bg-default"], qUiColor["bg-selected"], qUiColor["bg-correct"], qUiColor["bg-wrong"]];
const allBorderC = [qUiColor["border-default"], qUiColor["border-selected"], qUiColor["border-correct"], qUiColor["border-wrong"]];


export function setColor(el, type, color = "default") {
  switch (type){
    case "btnState": 
      switch (color) {
        case "default":
          el.classList.remove(...allBgC, ...allBorderC);
          el.classList.add(qUiColor["bg-default"], qUiColor["border-default"]);
          break;
        case "selected":
          el.classList.remove(...allBgC, ...allBorderC);
          el.classList.add(qUiColor["bg-selected"], qUiColor["border-selected"]);
          break;
        case "correctBg":
          el.classList.remove(...allBgC);
          el.classList.add(qUiColor["bg-correct"]);
          break;
        case "correctBorder":
          el.classList.remove(...allBorderC)
          el.classList.add(qUiColor["border-correct"]);
          break;
          case "correctAll":
          el.classList.remove(...allBgC, ...allBorderC);
          el.classList.add(qUiColor["bg-correct"], qUiColor["border-correct"]);
          break;
        case "wrongBg":
          el.classList.remove(...allBgC);
          el.classList.add(qUiColor["bg-wrong"]);
          break;
        case "wrongBorder":
          el.classList.remove(...allBorderC)
          el.classList.add(qUiColor["border-wrong"]);
          break;
        case "wrongAll":
          el.classList.remove(...allBgC, ...allBorderC);
          el.classList.add(qUiColor["bg-wrong"], qUiColor["border-wrong"]);
          break;
      }
      break;
  }
}