import { updateResults } from "@script/drawDiagram";

let historyFactorial = [];
let currentStepFactorial = 0;
let intervalFactorial = null;
let finalResultFactorial = "";
let speedFactorial = 500;

document.addEventListener("DOMContentLoaded", function () {
  const simulateFactorialButton = document.getElementById(
    "simulateFactorialButton"
  );
  const previousFactorialButton = document.getElementById(
    "previousFactorialButton"
  );
  const playFactorialButton = document.getElementById("playFactorialButton");
  const nextFactorialButton = document.getElementById("nextFactorialButton");
  const resetFactorialButton = document.getElementById("resetFactorialButton");
  const speedFactorialInput = document.getElementById("speedFactorialInput");

  if (simulateFactorialButton) {
    simulateFactorialButton.addEventListener("click", function () {
      simulateFactorial();
    });
  }

  if (previousFactorialButton) {
    previousFactorialButton.addEventListener("click", previousStepFactorial);
  }

  if (playFactorialButton) {
    playFactorialButton.addEventListener("click", playSimulationFactorial);
  }

  if (nextFactorialButton) {
    nextFactorialButton.addEventListener("click", nextStepFactorial);
  }

  if (resetFactorialButton) {
    resetFactorialButton.addEventListener("click", resetSimulationFactorial);
  }

  if (speedFactorialInput) {
    speedFactorialInput.addEventListener("input", function (event) {
      speedFactorial = event.target.value;
      if (intervalFactorial) {
        clearInterval(intervalFactorial);
        playSimulationFactorial();
      }
    });
  }
});

function simulateFactorial() {
  let m = parseInt(document.getElementById("input-m-factorial").value);

  if (isNaN(m) || m < 0) {
    document.getElementById("result-factorial").innerText =
      "Invalid input! Please enter a non-negative number.";
    document.getElementById("expected-result-factorial").innerText = "";
    return;
  }

  // expected result factorial
  let expectedResultFactorial = 1;
  for (let i = 1; i <= m; i++) {
    expectedResultFactorial *= i;
  }
  document.getElementById("expected-result-factorial").innerText =
    expectedResultFactorial;

  const input = "B" + "0".repeat(m) + "1" + "B";
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
      write: ["B", "B", "B"],
      move: ["L", "L", "S"],
      nextState: "q1",
    },
    {
      q: "q1",
      read: ["0", "0", "B"],
      write: ["0", "B", "B"],
      move: ["S", "L", "S"],
      nextState: "q2",
    },
    {
      q: "q1",
      read: ["B", "B", "B"],
      write: ["0", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q2",
    },
    {
      q: "q2",
      read: ["0", "0", "B"],
      write: ["0", "0", "0"],
      move: ["L", "S", "R"],
      nextState: "q2",
    },
    {
      q: "q2",
      read: ["0", "0", "0"],
      write: ["0", "0", "0"],
      move: ["L", "S", "R"],
      nextState: "q2",
    },
    {
      q: "q2",
      read: ["B", "0", "B"],
      write: ["B", "0", "B"],
      move: ["R", "L", "S"],
      nextState: "q3",
    },
    {
      q: "q2",
      read: ["0", "B", "B"],
      write: ["0", "B", "B"],
      move: ["S", "R", "S"],
      nextState: "q7",
    },
    {
      q: "q3",
      read: ["0", "0", "B"],
      write: ["0", "0", "0"],
      move: ["R", "S", "R"],
      nextState: "q3",
    },
    {
      q: "q3",
      read: ["0", "0", "0"],
      write: ["0", "0", "0"],
      move: ["R", "S", "R"],
      nextState: "q3",
    },
    {
      q: "q3",
      read: ["B", "0", "B"],
      write: ["B", "0", "B"],
      move: ["L", "L", "S"],
      nextState: "q2",
    },
    {
      q: "q3",
      read: ["0", "B", "B"],
      write: ["0", "B", "B"],
      move: ["S", "R", "S"],
      nextState: "q4",
    },
    {
      q: "q4",
      read: ["0", "0", "B"],
      write: ["0", "B", "B"],
      move: ["S", "R", "L"],
      nextState: "q5",
    },
    {
      q: "q5",
      read: ["0", "0", "0"],
      write: ["0", "0", "0"],
      move: ["R", "S", "L"],
      nextState: "q5",
    },
    {
      q: "q5",
      read: ["B", "0", "0"],
      write: ["0", "0", "0"],
      move: ["R", "S", "L"],
      nextState: "q5",
    },
    {
      q: "q5",
      read: ["B", "0", "B"],
      write: ["B", "0", "B"],
      move: ["L", "R", "S"],
      nextState: "q6",
    },
    {
      q: "q5",
      read: ["0", "B", "0"],
      write: ["0", "B", "0"],
      move: ["S", "S", "S"],
      nextState: "q10",
    },
    {
      q: "q6",
      read: ["0", "0", "B"],
      write: ["0", "0", "B"],
      move: ["S", "R", "S"],
      nextState: "q6",
    },
    {
      q: "q6",
      read: ["0", "B", "B"],
      write: ["0", "B", "B"],
      move: ["S", "L", "R"],
      nextState: "q2",
    },
    {
      q: "q7",
      read: ["0", "0", "B"],
      write: ["0", "B", "B"],
      move: ["S", "R", "L"],
      nextState: "q8",
    },
    {
      q: "q7",
      read: ["0", "B", "B"],
      write: ["0", "B", "B"],
      move: ["S", "S", "S"],
      nextState: "q8",
    },
    {
      q: "q8",
      read: ["0", "0", "0"],
      write: ["0", "0", "0"],
      move: ["L", "S", "L"],
      nextState: "q8",
    },
    {
      q: "q8",
      read: ["B", "0", "0"],
      write: ["0", "0", "0"],
      move: ["L", "S", "L"],
      nextState: "q8",
    },
    {
      q: "q8",
      read: ["0", "B", "B"],
      write: ["0", "0", "0"],
      move: ["L", "S", "L"],
      nextState: "q8",
    },
    {
      q: "q8",
      read: ["B", "0", "B"],
      write: ["B", "0", "B"],
      move: ["R", "R", "S"],
      nextState: "q9",
    },
    {
      q: "q8",
      read: ["0", "B", "0"],
      write: ["0", "B", "0"],
      move: ["S", "S", "S"],
      nextState: "q10",
    },
    {
      q: "q9",
      read: ["0", "0", "B"],
      write: ["0", "0", "B"],
      move: ["S", "R", "S"],
      nextState: "q9",
    },
    {
      q: "q9",
      read: ["0", "B", "B"],
      write: ["0", "B", "B"],
      move: ["S", "L", "R"],
      nextState: "q3",
    },
  ];

  let state = "q0";
  let finalState = "q10";
  let head = [1, 1, 1];
  historyFactorial = [];

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

    historyFactorial.push({
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

  historyFactorial.push({
    state,
    head: [...head],
    tapes: [...tapes],
    transition: null,
  });

  currentStepFactorial = 0;
  finalResultFactorial = tapes[0].replace(/B/g, "").length;

  document.getElementById("result-factorial").innerText = finalResultFactorial;

  updateResults(finalResultFactorial);
  displayCurrentStepFactorial();
}

function displayCurrentStepFactorial() {
  if (
    currentStepFactorial < 0 ||
    currentStepFactorial >= historyFactorial.length
  )
    return;
  const h = historyFactorial[currentStepFactorial];
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

  document.getElementById("transitions-factorial").innerHTML = `
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
      currentStepFactorial === historyFactorial.length - 1
        ? `<div><strong>Final Result:</strong> ${finalResultFactorial}</div>`
        : ""
    }
  `;
}

// function resetSimulationFactorial() {
//   currentStepFactorial = 0;
//   displayCurrentStepFactorial();
// }

function resetSimulationFactorial() {
  if (intervalFactorial) {
    clearInterval(intervalFactorial);
    intervalFactorial = null;
  }
  currentStepFactorial = 0;
  displayCurrentStepFactorial();
}

function previousStepFactorial() {
  if (currentStepFactorial > 0) {
    currentStepFactorial--;
    displayCurrentStepFactorial();
  }
}

function nextStepFactorial() {
  if (currentStepFactorial < historyFactorial.length - 1) {
    currentStepFactorial++;
    displayCurrentStepFactorial();
  }
}

function playSimulationFactorial() {
  if (intervalFactorial) {
    clearInterval(intervalFactorial);
    intervalFactorial = null;
    return;
  }

  intervalFactorial = setInterval(() => {
    if (currentStepFactorial < historyFactorial.length - 1) {
      currentStepFactorial++;
      displayCurrentStepFactorial();
    } else {
      clearInterval(intervalFactorial);
      intervalFactorial = null;
    }
  }, speedFactorial);
}
