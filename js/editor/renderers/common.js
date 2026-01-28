import { initStyle } from "../../utils.js";

export function createWrapper(title) {
  const div = document.createElement("div");
  div.className = "border p-3 rounded bg-gray-50 space-y-2";

  const h = document.createElement("h3");
  h.className = "font-semibold";
  h.textContent = title;

  div.appendChild(h);
  return div;
}

export function inputQuestion(placeholder, value, onChange) {
  const i = document.createElement("input");
  i.className = "border rounded p-1 w-full";
  i.placeholder = placeholder;
  i.value = value || "";
  i.oninput = e => onChange(e.target.value);
  return i;
}

export function inputTitle(placeholder, value, onChange) {
  const i = document.createElement("input");
  i.className = "border rounded p-1 w-full text-l font-bold mb-1";
  i.placeholder = placeholder;
  i.value = value || "";
  i.oninput = e => onChange(e.target.value);
  return i;
}

export function inputLine(placeholder, value, onChange) {
  const i = document.createElement("input");
  i.className = "border rounded px-1 flex-1";
  i.placeholder = placeholder;
  i.style.minWidth = "40%";
  i.style.width = "60%";
  i.style.maxWidth = "80%"; 
  i.value = value || "";
  i.oninput = e => onChange(e.target.value);
  return i;
}

export function inputText(placeholder, value, onChange) {
  const i = document.createElement("textarea");
  i.className = "border rounded p-1 flex-1 resize-none";
  i.placeholder = placeholder;
  i.style.height = "9em";
  i.style.minHeight = "9em";  
  i.style.overflowY = "auto";
  i.value = value || "";
  i.oninput = e => onChange(e.target.value);
  return i;
}

export function addElBtn (fn, content = null) {
  const b = document.createElement("button");
  b.textContent = content || "Hinzufügen";
  initStyle(b, "menuBtn", "blue", "hover");
  b.onclick = fn;
  return b;
}

export function delElBtn(fn) {
  const b = document.createElement("button");
  b.textContent = "✕";
  initStyle(b, "menuBtn", "red", "hover");
  b.classList.remove("px-4", "py-2");
  b.classList.add("px-2", "mr-2", "m-1")
  b.onclick = fn;
  const delCol = document.createElement("div");
  delCol.className = "flex flex-col justify-center";
  delCol.append(b);
  return delCol;
}

export function deleteButton(index, onDelete) {
  const b = document.createElement("button");
  b.textContent = "Frage löschen";
  initStyle(b, "menuBtn", "red", "hover");
  b.onclick = () => onDelete(index);
  return b;
}

export function addRemove(fn, index, onDelete) {
  const addRemove = document.createElement("div");
  addRemove.className = "mt-2 flex justify-between"
  const addBtn = addElBtn(fn, "Absatz Hinzufügen");

  const delQ = deleteButton(index, onDelete);

  addRemove.append(addBtn, delQ)
  return addRemove;
}
