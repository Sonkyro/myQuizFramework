export const matching = {
  render(q, container) {
    container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "relative flex justify-between gap-10 p-2";
    container.appendChild(wrapper);

    const leftCol = document.createElement("div");
    const rightCol = document.createElement("div");
    leftCol.className = "flex flex-col gap-2";
    rightCol.className = "flex flex-col gap-2";

    wrapper.append(leftCol, rightCol);

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    wrapper.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const connections = [];

    function resizeCanvas() {
      canvas.width = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;
      drawConnections();
    }

    function drawConnections() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      connections.forEach(c => {
        const l = c.left.getBoundingClientRect();
        const r = c.right.getBoundingClientRect();
        const cw = canvas.getBoundingClientRect();

        ctx.beginPath();
        ctx.moveTo(l.right - cw.left, l.top + l.height / 2 - cw.top);
        ctx.lineTo(r.left - cw.left, r.top + r.height / 2 - cw.top);
        ctx.strokeStyle = "#4b5563"; // Linien dunkelgrau
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    function removeConnection(elem) {
      const idx = connections.findIndex(c => c.left === elem || c.right === elem);
      if (idx > -1) {
        const removed = connections.splice(idx, 1)[0];

        // Farben zurücksetzen auf verbundenes Grau (leicht abgesetzt)
        removed.left.classList.remove("bg-gray-200", "bg-gray-300");
        removed.left.classList.add("bg-gray-100");

        removed.right.classList.remove("bg-gray-200", "bg-gray-300");
        removed.right.classList.add("bg-gray-100");

        delete removed.left.dataset.match;
        delete removed.right.dataset.match;

        drawConnections();
      }
    }

    // Linke Elemente
    q.pairs.forEach(p => {
      const div = document.createElement("div");
      div.textContent = p.left;
      div.className = "border px-4 py-3 rounded bg-gray-100 cursor-pointer hover:bg-gray-200 select-none";
      div.dataset.left = p.left;
      leftCol.appendChild(div);
    });

    // Rechte Elemente
    const rightItems = q.pairs.map(p => p.right).sort(() => Math.random() - 0.5);
    rightItems.forEach(t => {
      const div = document.createElement("div");
      div.textContent = t;
      div.className = "border px-4 py-3 rounded bg-gray-100 cursor-pointer hover:bg-gray-200 select-none";
      div.dataset.right = t;
      rightCol.appendChild(div);
    });

    let selectedLeft = null;

    // Klick linkes Element
    leftCol.querySelectorAll("div").forEach(l => {
      l.onclick = () => {
        if (l.dataset.match) {
          removeConnection(l);
          return;
        }

        selectedLeft = l;

        // alle linken auf neutral
        leftCol.querySelectorAll("div").forEach(x => {
          if (!x.dataset.match) x.classList.remove("bg-gray-300");
        });

        // ausgewählt -> dunkler
        l.classList.add("bg-gray-300");
      };
    });

    // Klick rechtes Element
    rightCol.querySelectorAll("div").forEach(r => {
      r.onclick = () => {
        if (r.dataset.match) {
          removeConnection(r);
          return;
        }
        if (!selectedLeft) return;

        // Alte Verbindung entfernen
        removeConnection(selectedLeft);
        removeConnection(r);

        // Neue Verbindung speichern
        connections.push({ left: selectedLeft, right: r });
        selectedLeft.dataset.match = r.dataset.right;
        r.dataset.match = selectedLeft.dataset.left;

        // Verbunden -> hellgrau 200
        selectedLeft.classList.remove("bg-gray-300");
        selectedLeft.classList.add("bg-gray-200");

        r.classList.add("bg-gray-200");

        selectedLeft = null;
        drawConnections();
      };
    });

    window.addEventListener("resize", resizeCanvas);
    requestAnimationFrame(resizeCanvas);
  },

  getUserAnswer(container) {
    const res = {};
    container.querySelectorAll("[data-left]").forEach(el => {
      res[el.dataset.left] = el.dataset.match || null;
    });
    return res;
  },

  isCorrect(q, userAnswer) {
    return q.pairs.every(p => userAnswer[p.left] === p.right);
  },

  formatAnswer(q, userAnswer) {
    // Korrekte Paare zurückgeben
    return {
      user: userAnswer,
      correct: q.pairs // q.pairs ist Array [{left,right}, ...]
    };
  }
};
