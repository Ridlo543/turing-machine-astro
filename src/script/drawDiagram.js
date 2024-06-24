import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: true });

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  function setActiveTab(activeTab) {
    tabs.forEach((tab) => {
      tab.classList.remove(
        "bg-violet-700",
        "text-white",
        "border-violet-500",
        "hover:bg-violet-600"
      );
      tab.classList.add(
        "bg-white",
        "text-gray-800",
        "border-gray-200",
        "hover:bg-gray-100"
      );
    });
    activeTab.classList.remove(
      "bg-white",
      "text-gray-800",
      "border-gray-200",
      "hover:bg-gray-100"
    );
    activeTab.classList.add(
      "bg-violet-700",
      "text-white",
      "border-violet-500",
      "hover:bg-violet-600"
    );

    contents.forEach((content) => content.classList.add("hidden"));
    const contentId = activeTab.id.replace("tab-", "content-");
    document.getElementById(contentId).classList.remove("hidden");

    // Draw Mermaid diagram when the tab is active
    if (activeTab.id === "tab-division") {
      drawDivisionDiagram();
    } else if (activeTab.id === "tab-factorial") {
      drawFactorialDiagram();
    } else if (activeTab.id === "tab-subtraction") {
      drawSubtractionDiagram();
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      setActiveTab(tab);
    });
  });

  // Set default active tab
  setActiveTab(document.getElementById("tab-division"));
});

let lastResult = "";

export function updateResults(currentResult) {
  document.getElementById("result-current").innerText =
    "Current Result: " + currentResult;
  if (currentResult !== lastResult) {
    document.getElementById("result-last").innerText =
      "Last Result: " + lastResult;
    lastResult = currentResult;
  }
}

function drawDivisionDiagram() {
  const graphDefinition = `
      flowchart TD
          start(( )) --> |start| q0
          q0(("q0")) --> |1BB/1BB, RLS| q3
          q0 --> |0BB/00B, RRS| q0
          q0 --> |1BB/1BB, RLS| q1
    
          q1(("q1")) --> |00B/00B, RLS| q1
          q1 --> |0BB/0BB, SSS
                BBB/BB0, SSS| q3
          q1 --> |B0B/B00, LSR| q2
          q1 --> |B0B/B0B, SSS| q_reject
    
          q2(("q2")) --> |00B/00B, LLS| q2
          q2 --> |10B/100, RSR| q1
          q2 --> |1BB/1B0, SSS
                BBB/BB0, SSS
                0BB/0BB, SSS| q3
    
          q3((("q3")))
          q_reject(("q_reject"))
    `;

  drawMermaidDiagram("diagram-division", graphDefinition);
}

function drawFactorialDiagram() {
  const graphDefinition = `
      flowchart TD
          start(( )) --> |start| q0
          q0(("q0")) --> |0BB/00B, RRS| q0
          q0 --> |1BB/BBB, LLS| q1
    
          q1(("q1"))
          q1 --> |00B/0BB,SLS<br>BBB/0BB,SSS| q2
    
          q2(("q2")) --> |00B/000,LSR<br>000/000, LSR| q2
          q2 --> |B0B/B0B, RLS| q3
          q2 --> |0BB/0BB, SRS| q7
    
          q3(("q3")) --> |00B/000, RSR<br>000/000, RSR| q3
          q3 --> |B0B/B0B, LLS| q2
          q3 --> |0BB/0BB, SRS| q4

          q4(("q4")) --> |00B/0BB, SRL| q5

          q5(("q5")) --> |000/000, RSL<br>B00/000, RSL| q5
          q5 --> |B0B/B0B, LRS| q6
          q5 --> |0B0/0B0, SSS| q7
          
          q6(("q6")) --> |00B/00B, SRS| q6
          q6 --> |0BB/0BB, SLR| q2

          q7(("q7")) --> |00B/0BB, SRL| q8

          q8(("q8")) --> |000/000, LSL<br>B00/000, LSL| q8
          q8 --> |B0B/B0B, RRS| q9
          q8 --> |0B0/0B0, SSS| q10

          q9(("q9")) --> |00B/00B, SRS| q9
          q9 --> |00B/00B, SRS| q3

          q10((("q10")))
    `;

  drawMermaidDiagram("diagram-factorial", graphDefinition);
}

function drawSubtractionDiagram() {
  const graphDefinition = `
      flowchart LR
        start(( )) --> |start| q0
        q0(("q0")) --> |0BB/0BP, SSR| q1
        q0 --> |1BB/11N, RRR| q5
        q0 --> |cBB/cBB, RSS| q9
        q1(("q1")) --> |0BB/00B, RRS| q1
        q1 --> |cBB/cBB, RSL| q2
        q2(("q2")) --> |0BP/0BP, SLR| q3
        q2 --> |BBP/BBP, SSS| q4
        q2 --> |1BP/1BP, RSR| q10
        q10(("q10")) --> |0BB/00B, RRS| q10
        q10 --> |BBB/BBB, SSS| q4
        q3(("q3")) --> |00B/0BB, RLS<br>0BB/00B, RLS| q3
        q3 --> |B0B/B0B, SSS<br>BBB/B1B, SSS| q4
        q5(("q5")) --> |0BB/00B, RRS| q5
        q5 --> |BBB/BBB, SSS| q4
        q5 --> |cBB/cBB, RSL| q6
        q6(("q6")) --> |BBN/BBN, SSS| q4
        q6 --> |1BN/1BN, RLR| q7
        q6 --> |0BN/0BN, SSR| q8
        q7(("q7")) --> |BBB/BBB, SSS<br>B0B/B0B, SSS<br>B1B/B1B, SSS| q4
        q7 --> |0BB/00B, RLS<br>00B/0BB, RLS<br>01B/00B, RLS| q7
        q8(("q8")) --> |BBB/BBB, SSS| q4
        q8 --> |0BB/00B, RRS| q8
        q9(("q9")) --> |0BB/01N, SRR<br>1BB/1BP, RSR| q5
        q9 --> |BBB/BBB, SSS| q4
        q4((("q4")))
    `;

  drawMermaidDiagram("diagram-subtraction", graphDefinition);
}

function drawMermaidDiagram(diagramId, graphDefinition) {
  try {
    const graphDiv = document.getElementById(diagramId);
    const graphContainer = document.createElement("div");
    graphContainer.className = "mermaid";
    graphContainer.textContent = graphDefinition;
    graphDiv.innerHTML = "";
    graphDiv.appendChild(graphContainer);
    mermaid.init(undefined, graphContainer);
  } catch (error) {
    console.error("Error drawing the graph:", error.message);
  }
}
