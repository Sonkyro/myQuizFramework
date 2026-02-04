import { initStyle, setColor } from "../utils.js";

export const fillInBlank = {
  render(q, container) {
    container.innerHTML = "";

    // Satzcontainer
    const sentence = document.createElement("div");
    sentence.className = "mb-4 flex flex-wrap items-center gap-2";

    // Optionencontainer
    const optionsBox = document.createElement("div");
    optionsBox.className = "flex flex-wrap gap-2 mt-4";

    let focusedDropzone = null; // für Klicks
    let focusedOption = null;

    // Satz aufteilen und Dropzones einfügen
    q.text.split("___").forEach((part, i, arr) => {
      const span = document.createElement("span");
      span.textContent = part;
      sentence.appendChild(span);

      if (i < arr.length - 1) {
        const dz = document.createElement("div");
        initStyle(dz, "dropzone");
        dz.dataset.blankIndex = i;

        dz.ondragover = e => e.preventDefault();

        dz.ondrop = e => {
          e.preventDefault();
          const id = e.dataTransfer.getData("text/id");
          const dragged = document.getElementById(id);
          setColor(dz, "btnState", "default");
          if (!dragged) return;

          // vorhandenes Element zurück
          if (dz.firstChild) optionsBox.appendChild(dz.firstChild);

          dz.appendChild(dragged);
        };

        dz.onclick = () => {
          // wen option focusirt obj verschiben und altes zurück
          if (focusedOption) {
            if (dz.firstChild) optionsBox.appendChild(dz.firstChild);
            dz.appendChild(focusedOption);
            setColor(focusedOption, "btnState", "default")
            focusedOption = null;
            return;
          }
          if (dz.childElementCount != 0) {
            return;
          }

          if (focusedDropzone != dz) {
            focusedDropzone = dz; 
            sentence.querySelectorAll("div").forEach(el => setColor(el,"btnState", "default")); 
            setColor(dz, "btnState", "selected");
          } else {focusedDropzone = null; setColor(dz, "btnState", "default"); };
        };

        sentence.appendChild(dz);
      }
    });

    container.appendChild(sentence);

    // Optionen erstellen
    q.options.forEach(opt => {
      const div = document.createElement("div");
      div.textContent = opt;
      div.id = `fib-${Math.random()}`;
      div.draggable = true;
      div.dataset.value = opt;
      initStyle(div, "dropEl");

      div.ondragstart = e => {
        e.dataTransfer.setData("text/id", div.id);
      };

      // Klick auf Dropzone
      div.onclick = () => {
        // wenn dz focus dann altes vesrchiben neues dran
        if (focusedDropzone) {
          if (focusedDropzone.firstChild) optionsBox.appendChild(focusedDropzone.firstChild);
          focusedDropzone.appendChild(div);
          focusedDropzone = null;
          return;
        }
        // wen nicht focused und in dz dan zurück nach Opt Box
        if (!focusedDropzone && !optionsBox.contains(div)) {
          optionsBox.appendChild(div);
          return;};
        
        // wenn in opt box focus auf Opt
        if (!focusedDropzone && optionsBox.contains(div)) {
          if (focusedOption != div) {
            focusedOption = div; 
            optionsBox.querySelectorAll("div").forEach(el => setColor(el,"btnState", "default")); 
            setColor(div, "btnState", "selected");
          } else {focusedOption = null; setColor(div, "btnState", "default");};
        }
        //fallback
        if (!focusedDropzone) return;
      };
      optionsBox.appendChild(div)
    });

    container.appendChild(optionsBox);
  },

  getUserAnswer(container) {
    return [...container.querySelectorAll("[data-blank-index]")].map(dz => {
      const el = dz.firstElementChild; // firstChild kann TextNode sein → firstElementChild besser
      return el ? el.dataset.value || el.textContent.trim() : "";
    });
  },

  isCorrect(q, userAnswer) {
    return q.answers.every((ans, i) => ans === userAnswer[i]);
  },

  formatAnswer(q, userAnswer) {
    return { user: userAnswer, correct: q.answers };
  },

  placeAnswer(container, index, value) {
    
    const optionsBox = container.querySelector("div.flex.flex-wrap.gap-2.mt-4");
    const dropzone = container.querySelector(`[data-blank-index='${index}']`);

    if (!dropzone) return; // Index existiert nicht
    // Prüfen, ob der Wert als Option existiert
    if (!([...optionsBox.children].some(el => el.dataset.value === value))) return; // value exisirt nicht
    let option = [...optionsBox.children].find(
      el => el.dataset.value === value
    );

    // Existierendes Element in Dropzone verschieben
    if (dropzone.firstChild) optionsBox.appendChild(dropzone.firstChild);
    dropzone.appendChild(option);
  }
};


