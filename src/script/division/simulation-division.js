import { updateResults } from "@script/drawDiagram";

let historyDivision = [];
let currentStepDivision = 0;
let intervalDivision = null;
let finalResultDivision = "";
let speedDivision = 500;

document.addEventListener("DOMContentLoaded", function () {
  const simulateButton = document.getElementById("simulateDivisionButton");
  const previousButton = document.getElementById("previousDivisionButton");
  const playButton = document.getElementById("playDivisionButton");
  const nextButton = document.getElementById("nextDivisionButton");
  const resetButton = document.getElementById("resetDivisionButton");
  const speedInput = document.getElementById("speedDivisionInput");

  if (simulateButton) {
    simulateButton.addEventListener("click", function () {
      simulateDivision();
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", previousStepDivision);
  }

  if (playButton) {
    playButton.addEventListener("click", playSimulationDivision);
  }

  if (nextButton) {
    nextButton.addEventListener("click", nextStepDivision);
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetSimulationDivision);
  }

  if (speedInput) {
    speedInput.addEventListener("input", function (event) {
      speedDivision = event.target.value;
      if (intervalDivision) {
        clearInterval(intervalDivision);
        playSimulationDivision();
      }
    });
  }
});

export function simulateDivision() {
  let m = parseInt(document.getElementById("input-m-division").value);
  let n = parseInt(document.getElementById("input-n-division").value);

  if (isNaN(m) || isNaN(n)) {
    document.getElementById("result-division").innerText =
      "Invalid input! Please enter valid numbers.";
    document.getElementById("expected-result-division").innerText = "";
    return;
  }

  // Calculate expected result
  if (n !== 0) {
    let expectedResult = Math.floor(m / n);
    document.getElementById("expected-result-division").innerText =
      expectedResult;
  } else {
    document.getElementById("expected-result-division").innerText =
      "Undefined (division by zero).";
    finalResultDivision = "q_reject";
    document.getElementById("result-division").innerText = finalResultDivision;
    return;
  }

  let isNegativeResult = false;
  if (m < 0 && n < 0) {
    m = Math.abs(m);
    n = Math.abs(n);
  } else if (m < 0 || n < 0) {
    isNegativeResult = true;
    m = Math.abs(m);
    n = Math.abs(n);
  }

  const input = "B" + "0".repeat(m) + "1" + "0".repeat(n) + "B";
  const tapes = [input, "B".repeat(input.length), "B".repeat(input.length)];
  const transitions = [
    {
      q: "q0",
      read: ["0", "B", "B"],
      write: ["0", "0", "B"],
      move: ["R", "R", "S"],
      nextState: "q0",
    },
    {
      q: "q0",
      read: ["1", "B", "B"],
      write: ["1", "B", "B"],
      move: ["R", "L", "S"],
      nextState: "q1",
    },
    {
      q: "q0",
      read: ["B", "0", "0"],
      write: ["B", "0", "0"],
      move: ["S", "S", "S"],
      nextState: "q3",
    },
    {
      q: "q1",
      read: ["0", "0", "B"],
      write: ["0", "0", "B"],
      move: ["R", "L", "S"],
      nextState: "q1",
    },
    {
      q: "q1",
      read: ["B", "0", "B"],
      write: ["B", "0", "0"],
      move: ["L", "S", "R"],
      nextState: "q2",
    },
    {
      q: "q1",
      read: ["0", "B", "B"],
      write: ["0", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q3",
    },
    {
      q: "q1",
      read: ["B", "B", "B"],
      write: ["B", "B", "0"],
      move: ["S", "S", "S"],
      nextState: "q3",
    },
    {
      q: "q1",
      read: ["B", "B", "B"],
      write: ["B", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q_reject",
    },
    {
      q: "q2",
      read: ["0", "0", "B"],
      write: ["0", "0", "B"],
      move: ["L", "L", "S"],
      nextState: "q2",
    },
    {
      q: "q2",
      read: ["1", "0", "B"],
      write: ["1", "0", "0"],
      move: ["R", "S", "R"],
      nextState: "q1",
    },
    {
      q: "q2",
      read: ["1", "B", "B"],
      write: ["1", "B", "0"],
      move: ["S", "S", "S"],
      nextState: "q3",
    },
    {
      q: "q2",
      read: ["B", "B", "B"],
      write: ["B", "B", "0"],
      move: ["S", "S", "S"],
      nextState: "q3",
    },
    {
      q: "q2",
      read: ["0", "B", "B"],
      write: ["0", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q3",
    },
  ];
  let state = "q0";
  let finalState = "q3";
  let head = [1, 1, 1];
  historyDivision = [];

  while (state !== finalState && state !== "q_reject") {
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

    historyDivision.push({
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

    // Extend tape if head goes out of bounds
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

  historyDivision.push({
    state,
    head: [...head],
    tapes: [...tapes],
    transition: null,
  });

  currentStepDivision = 0;
  finalResultDivision =
    state === finalState
      ? (isNegativeResult ? "-" : "") + tapes[2].replace(/B/g, "").length
      : "Undefined (rejected)";

  document.getElementById("result-division").innerText = finalResultDivision;

  updateResults(finalResultDivision);
  displayCurrentStepDivision();
}

function displayCurrentStepDivision() {
  if (currentStepDivision < 0 || currentStepDivision >= historyDivision.length)
    return;
  const h = historyDivision[currentStepDivision];
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

  document.getElementById("transitions-division").innerHTML = `
    <div><strong>State:</strong> ${h.state}</div>
    ${
      h.transition
        ? `<div><strong>Transisi:</strong> ${h.transition.q} -> ${
            h.transition.nextState
          },${h.transition.read.join("")}/${h.transition.write.join(
            ""
          )},${h.transition.move.join("")}</div>`
        : ""
    }
    <div><strong>Tapes:</strong></div>
    <table class="table-auto border-collapse border border-gray-400">${tapesHtml}</table>
    <div><strong>Heads:</strong> [${h.head.join(", ")}]</div>
    ${
      currentStepDivision === historyDivision.length - 1
        ? `<div><strong>Final Result:</strong> ${finalResultDivision}</div>`
        : ""
    }
  `;
}

export function resetSimulationDivision() {
  if (intervalDivision) {
    clearInterval(intervalDivision);
    intervalDivision = null;
  }
  currentStepDivision = 0;
  displayCurrentStepDivision();
}

export function previousStepDivision() {
  currentStepDivision--;
  displayCurrentStepDivision();
}

export function nextStepDivision() {
  if (currentStepDivision < historyDivision.length - 1) {
    currentStepDivision++;
    displayCurrentStepDivision();
  }
}

export function playSimulationDivision() {
  if (intervalDivision) {
    clearInterval(intervalDivision);
    intervalDivision = null;
  } else {
    intervalDivision = setInterval(() => {
      if (currentStepDivision < historyDivision.length - 1) {
        currentStepDivision++;
        displayCurrentStepDivision();
      } else {
        clearInterval(intervalDivision);
        intervalDivision = null;
      }
    }, speedDivision);
  }
}
