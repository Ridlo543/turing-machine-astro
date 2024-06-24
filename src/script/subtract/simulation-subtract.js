import { updateResults } from "@script/drawDiagram";

let historySubtraction = [];
let currentStepSubtraction = 0;
let intervalSubtraction = null;
let finalResultSubtraction = "";

document.addEventListener("DOMContentLoaded", function () {
  const simulateButton = document.getElementById("simulateSubtractionButton");
  const previousButton = document.getElementById("previousSubtractionButton");
  const playButton = document.getElementById("playSubtractionButton");
  const nextButton = document.getElementById("nextSubtractionButton");
  const resetButton = document.getElementById("resetSubtractionButton");

  if (simulateButton) {
    simulateButton.addEventListener("click", function () {
      simulateSubtraction();
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", previousStepSubtraction);
  }

  if (playButton) {
    playButton.addEventListener("click", playSimulationSubtraction);
  }

  if (nextButton) {
    nextButton.addEventListener("click", nextStepSubtraction);
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetSimulationSubtraction);
  }
});

function simulateSubtraction() {
  let m = parseInt(document.getElementById("input-m-subtraction").value);
  let n = parseInt(document.getElementById("input-n-subtraction").value);

  if (isNaN(m) || isNaN(n)) {
    document.getElementById("result-subtraction").innerText =
      "Invalid input! Please enter valid numbers.";
    return;
  }

  let binaryM = m !== 0 ? (m < 0 ? "1" : "") + "0".repeat(Math.abs(m)) : "";
  let binaryN = n !== 0 ? (n < 0 ? "1" : "") + "0".repeat(Math.abs(n)) : "";

  const input = "B" + binaryM + "c" + binaryN + "B";
  const tapes = [input, "B".repeat(input.length), "B".repeat(input.length)];
  const transitions = [
    {
      q: "q0",
      read: ["0", "B", "B"],
      write: ["0", "B", "P"],
      move: ["S", "S", "R"],
      nextState: "q1",
    },
    {
      q: "q0",
      read: ["1", "B", "B"],
      write: ["1", "1", "N"],
      move: ["R", "R", "R"],
      nextState: "q5",
    },
    {
      q: "q0",
      read: ["c", "B", "B"],
      write: ["c", "B", "B"],
      move: ["R", "S", "S"],
      nextState: "q9",
    },
    {
      q: "q1",
      read: ["0", "B", "B"],
      write: ["0", "0", "B"],
      move: ["R", "R", "S"],
      nextState: "q1",
    },
    {
      q: "q1",
      read: ["c", "B", "B"],
      write: ["c", "B", "B"],
      move: ["R", "S", "L"],
      nextState: "q2",
    },
    {
      q: "q2",
      read: ["0", "B", "P"],
      write: ["0", "B", "P"],
      move: ["S", "L", "R"],
      nextState: "q3",
    },
    {
      q: "q2",
      read: ["1", "B", "P"],
      write: ["1", "B", "P"],
      move: ["R", "S", "R"],
      nextState: "q10",
    },
    {
      q: "q10",
      read: ["B", "B", "B"],
      write: ["B", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q10",
      read: ["0", "B", "B"],
      write: ["0", "0", "B"],
      move: ["R", "R", "S"],
      nextState: "q10",
    },
    {
      q: "q2",
      read: ["B", "B", "P"],
      write: ["B", "B", "P"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q3",
      read: ["0", "0", "B"],
      write: ["0", "B", "B"],
      move: ["R", "L", "S"],
      nextState: "q3",
    },
    {
      q: "q3",
      read: ["0", "B", "B"],
      write: ["0", "0", "B"],
      move: ["R", "R", "S"],
      nextState: "q3",
    },
    {
      q: "q3",
      read: ["B", "0", "B"],
      write: ["B", "0", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q3",
      read: ["B", "B", "B"],
      write: ["B", "1", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q5",
      read: ["0", "B", "B"],
      write: ["0", "0", "B"],
      move: ["R", "R", "S"],
      nextState: "q5",
    },
    {
      q: "q5",
      read: ["B", "B", "B"],
      write: ["B", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q5",
      read: ["c", "B", "B"],
      write: ["c", "B", "B"],
      move: ["R", "S", "L"],
      nextState: "q6",
    },
    {
      q: "q6",
      read: ["B", "B", "N"],
      write: ["B", "B", "N"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q6",
      read: ["1", "B", "N"],
      write: ["1", "B", "N"],
      move: ["R", "L", "R"],
      nextState: "q7",
    },
    {
      q: "q6",
      read: ["0", "B", "N"],
      write: ["0", "B", "N"],
      move: ["S", "S", "R"],
      nextState: "q8",
    },
    {
      q: "q7",
      read: ["B", "B", "B"],
      write: ["B", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q7",
      read: ["B", "0", "B"],
      write: ["B", "0", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q7",
      read: ["B", "1", "B"],
      write: ["B", "1", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q7",
      read: ["0", "0", "B"],
      write: ["0", "B", "B"],
      move: ["R", "L", "S"],
      nextState: "q7",
    },
    {
      q: "q7",
      read: ["0", "1", "B"],
      write: ["0", "0", "B"],
      move: ["R", "L", "S"],
      nextState: "q7",
    },
    {
      q: "q7",
      read: ["0", "B", "B"],
      write: ["0", "0", "B"],
      move: ["R", "L", "S"],
      nextState: "q7",
    },
    {
      q: "q8",
      read: ["0", "B", "B"],
      write: ["0", "0", "B"],
      move: ["R", "R", "S"],
      nextState: "q8",
    },
    {
      q: "q8",
      read: ["B", "B", "B"],
      write: ["B", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
    {
      q: "q9",
      read: ["0", "B", "B"],
      write: ["0", "1", "N"],
      move: ["S", "R", "R"],
      nextState: "q5",
    },
    {
      q: "q9",
      read: ["1", "B", "B"],
      write: ["1", "B", "P"],
      move: ["R", "S", "R"],
      nextState: "q5",
    },
    {
      q: "q9",
      read: ["B", "B", "B"],
      write: ["B", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q4",
    },
  ];

  let state = "q0";
  let finalState = "q4";
  let head = [1, 1, 1];
  historySubtraction = [];

  while (state !== finalState) {
    const currentSymbols = tapes.map((tape, index) => tape[head[index]] || "B");
    const transition = transitions.find(
      (t) =>
        t.q === state &&
        t.read.every((symbol, index) => symbol === currentSymbols[index])
    );

    if (!transition) {
      state = "q_reject";
      break;
    }

    historySubtraction.push({
      state,
      head: [...head],
      tapes: [...tapes],
      transition,
    });

    state = transition.nextState;
    transition.write.forEach((symbol, index) => {
      tapes[index] =
        tapes[index].substring(0, head[index]) +
        symbol +
        tapes[index].substring(head[index] + 1);
    });
    transition.move.forEach((direction, index) => {
      if (direction === "R") head[index]++;
      else if (direction === "L") head[index]--;
    });

    // Perpanjang tape jika head keluar dari batas
    tapes.forEach((tape, index) => {
      if (head[index] >= tape.length) {
        tapes[index] += "B";
      }
      if (head[index] < 0) {
        tapes[index] = "B" + tapes[index];
        head[index] = 0;
      }
    });
  }

  historySubtraction.push({
    state,
    head: [...head],
    tapes: [...tapes],
    transition: null,
  });

  // Menghitung final result berdasarkan tape 2
  const tape2 = tapes[1].replace(/B/g, "");
  if (tape2.includes("1")) {
    finalResultSubtraction = tape2 === "1" ? 0 : "-" + (tape2.length - 1);
  } else {
    finalResultSubtraction = tape2.length;
  }

  document.getElementById("result-subtraction").innerText =
    finalResultSubtraction;

  updateResults(finalResultSubtraction);
  displayCurrentStepSubtraction();
}

function displayCurrentStepSubtraction() {
  if (
    currentStepSubtraction < 0 ||
    currentStepSubtraction >= historySubtraction.length
  )
    return;
  const h = historySubtraction[currentStepSubtraction];
  let tapesHtml = h.tapes
    .map((tape, i) => {
      let tapeHtml = tape
        .split("")
        .map((char, j) => {
          let classes =
            j === h.head[i] ? "border-2 border-red-500 text-red-500" : "border";
          return `<td class="${classes} p-2">${char}</td>`;
        })
        .join("");
      return `<tr>${tapeHtml}</tr>`;
    })
    .join("");

  document.getElementById("transitions-subtraction").innerHTML = `
      <div><strong>State:</strong> ${h.state}</div>
      ${
        h.transition
          ? `<div><strong>Transisi:</strong> ${
              h.transition.q
            },${h.transition.read.join("")}/${h.transition.write.join(
              ""
            )},${h.transition.move.join("")} -> ${h.transition.nextState}</div>`
          : ""
      }
      <div><strong>Tapes:</strong></div>
      <table class="table-auto border-collapse border border-gray-400">${tapesHtml}</table>
      <div><strong>Heads:</strong> [${h.head.join(", ")}]</div>
      ${
        currentStepSubtraction === historySubtraction.length - 1
          ? `<div><strong>Final Result:</strong> ${finalResultSubtraction}</div>`
          : ""
      }
    `;
}

function resetSimulationSubtraction() {
  currentStepSubtraction = 0;
  displayCurrentStepSubtraction();
}

function previousStepSubtraction() {
  if (currentStepSubtraction > 0) {
    currentStepSubtraction--;
    displayCurrentStepSubtraction();
  }
}

function nextStepSubtraction() {
  if (currentStepSubtraction < historySubtraction.length - 1) {
    currentStepSubtraction++;
    displayCurrentStepSubtraction();
  }
}

function playSimulationSubtraction() {
  if (intervalSubtraction) {
    clearInterval(intervalSubtraction);
    intervalSubtraction = null;
  } else {
    intervalSubtraction = setInterval(() => {
      if (currentStepSubtraction < historySubtraction.length - 1) {
        currentStepSubtraction++;
        displayCurrentStepSubtraction();
      } else {
        clearInterval(intervalSubtraction);
        intervalSubtraction = null;
      }
    }, 500);
  }
}
