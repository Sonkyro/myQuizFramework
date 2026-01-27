export function createWrapper(title) {
  const div = document.createElement("div");
  div.className = "border p-3 rounded bg-gray-50 space-y-2";

  const h = document.createElement("h3");
  h.className = "font-semibold";
  h.textContent = title;

  div.appendChild(h);
  return div;
}

export function input(placeholder, value, onChange) {
  const i = document.createElement("input");
  i.className = "border p-1 w-full";
  i.placeholder = placeholder;
  i.value = value || "";
  i.oninput = e => onChange(e.target.value);
  return i;
}

export function addButton(fn) {
  const b = document.createElement("button");
  b.textContent = "+ Hinzufügen";
  b.className = "text-blue-600";
  b.onclick = fn;
  return b;
}

export function delBtn(fn) {
  const b = document.createElement("button");
  b.textContent = "✕";
  b.className = "text-red-500";
  b.onclick = fn;
  return b;
}

export function deleteButton(index, onDelete) {
  const b = document.createElement("button");
  b.textContent = "Frage löschen";
  b.className = "text-red-600 mt-2";
  b.onclick = () => onDelete(index);
  return b;
}
