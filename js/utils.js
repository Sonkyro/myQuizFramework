export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
export const questionTypes = [
  { label: "Text", value: "text" },
  { label: "True / False", value: "trueFalse" },
  { label: "Multiple Choice", value: "multipleChoice" },
  { label: "Lückentext", value: "fillInBlank" },
  { label: "Sortieren", value: "sorting" },
  { label: "Zuordnung", value: "matching" },
];

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
const menuUi = {
  "general": ["rounded", "shadow", "text-white", "px-4", "py-2"],

  "light-grey": "bg-gray-400",
  "dark-gray": "bg-gray-600",
  "green": "bg-green-600",
  "red": "bg-red-600",
  "blue": "bg-blue-600",
  "purple": "bg-purple-600",
}
const menuAni = {
  "movement": {
    "hover-up": ["transition-all", "duration-300", "transform", "hover:-translate-y-0.5"],
    "pressed": ["transition-all", "active:translate-y-0.5", "active:shadow-inner"],
    "diabled": ["opacity-50", "hover-wiggle"],
  },
  "hoverColor": {
    "light-grey": "hover:bg-gray-500",
    "dark-gray": "hover:bg-gray-500",
    "green": "hover:bg-green-500",
    "red": "hover:bg-red-500",
    "blue": "hover:bg-blue-500",
    "purple": "hover:bg-purple-500"
  }
}


export function initStyle(el, type, color = "default", animationType = null, ) {
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
      el.classList.add("w-36", "h-8", qUiColor["bg-default"], "rounded", "flex", "items-center", "justify-center", "cursor-move", "select-none", "text-center")
      break;
    case "menuBtn":
      el.classList.add(...menuUi["general"], menuUi[color]);
      if (animationType != null) setAnimation(el, animationType, color);
      break;
  }
}

// define style bundles for seting color
const allBgC = [qUiColor["bg-default"], qUiColor["bg-selected"], qUiColor["bg-correct"], qUiColor["bg-wrong"]];
const allBorderC = [qUiColor["border-default"], qUiColor["border-selected"], qUiColor["border-correct"], qUiColor["border-wrong"]];


export function setColor(el, type, color = "default") {
  switch (type){
    case "questionBtn": 
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


export function setAnimation(el, type, color) {
  const allAnimation = [...Object.values(menuAni.movement).flat(), ...Object.values(menuAni.hoverColor)];
  switch (type){
    case "hover": 
      el.classList.remove(...allAnimation);
      el.classList.add(menuAni.hoverColor[color]);
      break
    case "hover-up":
      el.classList.remove(...allAnimation); 
      el.classList.add(...menuAni.movement["hover-up"],menuAni.hoverColor[color]);
      break
    case "disabled":
      el.classList.remove(...allAnimation);
      el.classList.add(...menuAni.movement["diabled"]);
      break;
    }
}