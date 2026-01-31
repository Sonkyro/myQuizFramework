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
  i.className = "border rounded p-1 flex-1 resize-none w-full";
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
  b.textContent = content || "Element Hinzufügen";
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

export function checkBtn(initial = false, onChange) {
  const b = document.createElement("button");
  
  const icon = document.createElement("span");
  icon.textContent = "+";
  icon.classList.add("inline-block", "transform", "transition-transform", "duration-300", "ease-in-out", "h-full", "w-full");

  b.appendChild(icon);

 function applyBaseStyle(color) {
    b.className = "";
    initStyle(b, "menuBtn", color, "hover");
    b.classList.remove("px-4", "py-2");
    b.classList.add("px-2", "mr-2", "m-1");
  }

  let checked = initial;

  function updateStyle() {
    if (checked) {
      applyBaseStyle("green");
      icon.classList.add("rotate-45", "text-base");
    } else {
      applyBaseStyle("light-grey");
      icon.classList.remove("rotate-45", "text-base");
    }
  }

  b.onclick = () => {
    checked = !checked;
    updateStyle();
    if (onChange) onChange(checked);
  };

  updateStyle();

  return {
    el: b,
    isChecked: () => checked,
    setChecked: v => {
      checked = v;
      updateStyle();
    }
  };
}

export function inputSelect(options, value, onChange) {
  const sDiv = document.createElement("div");
  sDiv.className = "justify-center h-full";
  sDiv.style.width = "10%";
  sDiv.style.minWidth = "100px";

  const selectStyle = ["h-full", "w-full", "text-center", "cursor-pointer", "outline-none"];
  const select = document.createElement("select");
  initStyle(select, "menuBtn", "green", "hover");
  select.classList.add(...selectStyle);

  function render(currentValue) {
    select.innerHTML = "";
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Keine";
    select.appendChild(empty);

    options.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;

      if (String(opt.value) === String(currentValue)) {
        o.selected = true;
      }

      select.appendChild(o);
    });
  }
  select.onchange = e => onChange(e.target.value);

  render(value);
  sDiv.append(select)

  return {
    el: sDiv,
    updateOptions: (newOptions, newValue) => {
      options = newOptions;
      render(newValue);
    },
    setValue: v => render(v)
  };
}

export function deleteButton(index, onDelete) {
  const b = document.createElement("button");
  b.textContent = "Frage löschen";
  initStyle(b, "menuBtn", "red", "hover");
  b.onclick = () => onDelete(index);
  return b;
}

export function addRemove(fn, index, onDelete, btnText) {
  const addRemove = document.createElement("div");
  addRemove.className = "mt-2 flex justify-between"
  const addBtn = addElBtn(fn, btnText);

  const delQ = deleteButton(index, onDelete);

  addRemove.append(delQ, addBtn)
  return addRemove;
}
