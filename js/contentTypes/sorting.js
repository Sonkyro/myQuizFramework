export const sorting = {
  render(q, container) {
    container.innerHTML = "";

    const list = document.createElement("ul");
    list.className = "flex flex-col gap-2"; // vertikale Liste mit Abstand

    // Items mischen
    let items = []
    do {
      items = [...q.items].sort(() => Math.random() - 0.5);
    } while (JSON.stringify(items) === JSON.stringify(q.items)); 
    // Wir bauen feste Slots (Dropzones). Jeder Slot kann ein Item enthalten.
    // const slots = []; // not neded?
    for (let i = 0; i < items.length; i++) {
      const slot = document.createElement("li");
      slot.className = "relative"; // Slot-Container
      slot.dataset.slot = String(i);

      // Dropzone-Verhalten: tauschen beim Drop
      slot.ondragover = e => {
        e.preventDefault();
        slot.classList.add("bg-gray-50");
      };
      slot.ondragleave = () => slot.classList.remove("bg-gray-50");
      slot.ondrop = e => {
        e.preventDefault();
        slot.classList.remove("bg-gray-50");
        const draggedSlotKey = e.dataTransfer.getData("text/plain");
        const draggedSlot = list.querySelector(`[data-slot=\"${draggedSlotKey}\"]`);
        const targetSlot = slot;
        if (!draggedSlot || !targetSlot || draggedSlot === targetSlot) return;

        const draggedItem = draggedSlot.querySelector(".sorting-item");
        const targetItem = targetSlot.querySelector(".sorting-item");

        // tausche die Items: entferne und füge jeweils wieder ein
        if (targetItem) targetSlot.removeChild(targetItem);
        if (draggedItem) {
          draggedSlot.removeChild(draggedItem);
          draggedItem.dataset.slot = targetSlot.dataset.slot;
          targetSlot.appendChild(draggedItem);
        }

        if (targetItem) {
          targetItem.dataset.slot = draggedSlot.dataset.slot;
          draggedSlot.appendChild(targetItem);
        }
      };

      // falls ein Item initial vorhanden ist, setze es in den Slot
      const item = items[i];
      if (item !== undefined) {
        const el = document.createElement("div");
        el.textContent = item;
        el.draggable = true;
        el.className = "sorting-item border px-4 py-3 rounded bg-gray-100 cursor-move hover:bg-gray-200 select-none";
        el.dataset.slot = String(i);
        el.ondragstart = e => e.dataTransfer.setData("text/plain", el.dataset.slot);
        el.ondragend = () => {};
        slot.appendChild(el);
      }

      // füge Slot zur Liste hinzu
      list.appendChild(slot);

      // Pfeil zwischen Einträgen (nicht beim letzten)
      if (i < items.length - 1) {
        const arrow = document.createElement("div");
        arrow.className = "flex items-center justify-center text-gray-500 py-1 select-none";
        arrow.setAttribute("role", "presentation");
        arrow.style.pointerEvents = "none"; // soll Drag/Drop nicht stören
        arrow.innerHTML = `
          <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" />
          </svg>
        `;
        list.appendChild(arrow);
      }
    }

    container.appendChild(list);
  },

  getUserAnswer(container) {
    // Liefere die Reihenfolge der sichtbaren Items in den Slots
    const slots = Array.from(container.querySelectorAll('li[data-slot]'));
    return slots.map(slot => {
      const item = slot.querySelector('.sorting-item');
      return item ? item.textContent.trim() : "";
    });
  },

  isCorrect(q, userAnswer) {
    return JSON.stringify(userAnswer) === JSON.stringify(q.items);
  },

  formatAnswer(q, userAnswer) {
    return { user: userAnswer, correct: q.items };
  },
  setOrder(container, orderedItems) {
    const slots = Array.from(container.querySelectorAll('li[data-slot]'));
    const itemsMap = {};

    // Alle vorhandenen Items aus Slots sammeln
    slots.forEach(slot => {
      const itemEl = slot.querySelector('.sorting-item');
      if (itemEl) {
        itemsMap[itemEl.textContent.trim()] = itemEl;
        slot.removeChild(itemEl);
      }
    });

    // Items gemäß der übergebenen Reihenfolge in Slots setzen
    orderedItems.forEach((value, index) => {
      const slot = slots[index];
      if (!slot) return;

      let itemEl = itemsMap[value];

      itemEl.dataset.slot = String(index);
      slot.appendChild(itemEl);
    });
  }
};
