export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export const uiColor = {
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

// defining style bundles 
const deafultBtnStyle = [uiColor["bg-default"], uiColor["border-default"], uiColor["bg-hover"], "rounded", "border-2", "px-4", "py-3", "select-none"]
const allBgC = [uiColor["bg-default"], uiColor["bg-selected"], uiColor["bg-correct"], uiColor["bg-wrong"]];
const allBorderC = [uiColor["border-default"], uiColor["border-selected"], uiColor["border-correct"], uiColor["border-wrong"]];


export function setColor(el, type, color = "default") {
  switch (type){
    case "btnInit":
      el.classList.add(...deafultBtnStyle, );
      break;
      case "sortingInit":
        el.classList.add("sorting-item", ...deafultBtnStyle, "cursor-move", "text-align-center")
        break;
    case "pairElInit":
        el.classList.add(...deafultBtnStyle, "cursor-pointer")
      break;
    case "btnState": 
      switch (color) {
        case "default":
          el.classList.remove(...allBgC, ...allBorderC);
          el.classList.add(uiColor["bg-default"], uiColor["border-default"]);
          break;
        case "selected":
          el.classList.remove(...allBgC, ...allBorderC);
          el.classList.add(uiColor["bg-selected"], uiColor["border-selected"]);
          break;
        case "correctBg":
          el.classList.remove(...allBgC);
          el.classList.add(uiColor["bg-correct"]);
          break;
        case "correctBorder":
          el.classList.remove(...allBorderC)
          el.classList.add(uiColor["border-correct"]);
          break;
          case "correctAll":
          el.classList.remove(...allBgC, ...allBorderC);
          el.classList.add(uiColor["bg-correct"], uiColor["border-correct"]);
          break;
        case "wrongBg":
          el.classList.remove(...allBgC);
          el.classList.add(uiColor["bg-wrong"]);
          break;
        case "wrongBorder":
          el.classList.remove(...allBorderC)
          el.classList.add(uiColor["border-wrong"]);
          break;
        case "wrongAll":
          el.classList.remove(...allBgC, ...allBorderC);
          el.classList.add(uiColor["bg-wrong"], uiColor["border-wrong"]);
          break;
      }
      break;
    case "init":
      
      break;
    case "menuBtn":
      switch (color) {
        case "green":


      }
      break;
  }
}