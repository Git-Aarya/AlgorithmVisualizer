// js/algorithms/floyd-warshall.js

const floydWarshallConfig = {
    name: 'Floyd-Warshall',
    type: 'graph', // Keep type as graph
    code: `<span class="code-keyword">function</span> <span class="code-function">floydWarshall</span>(graph, numNodes) {
  <span class="code-keyword">const</span> dist = <span class="code-keyword">new</span> <span class="code-function">Array</span>(numNodes).<span class="code-function">fill</span>(<span class="code-number">0</span>).<span class="code-function">map</span>(() => <span class="code-keyword">new</span> <span class="code-function">Array</span>(numNodes).<span class="code-function">fill</span>(Infinity));
  <span class="code-comment">// Optional: Predecessor matrix 'next' for path reconstruction</span>

  <span class="code-comment">// 1. Initialize distances based on graph edges</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < numNodes; i++) {
    dist[i][i] = <span class="code-number">0</span>;
    <span class="code-keyword">if</span> (graph[i]) {
      <span class="code-keyword">for</span> (<span class="code-keyword">const</span> edge <span class="code-keyword">of</span> graph[i]) { <span class="code-comment">// edge = { node: v, weight: w }</span>
        <span class="code-keyword">if</span> (edge.weight < dist[i][edge.node]) {
             dist[i][edge.node] = edge.weight;
        }
      }
    }
  }
  <span class="code-comment">// Visualize initial state (matrix and graph)</span>

  <span class="code-comment">// 2. Main loops: Iterate through intermediate nodes k</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> k = <span class="code-number">0</span>; k < numNodes; k++) {
    <span class="code-comment">// Visualize start of iteration k, highlight node k</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < numNodes; i++) {
      <span class="code-keyword">for</span> (<span class="code-keyword">let</span> j = <span class="code-number">0</span>; j < numNodes; j++) {
        <span class="code-comment">// Visualize checking path i -> k -> j</span>
        <span class="code-comment">// Highlight nodes i, j, k and edges (i,k), (k,j), (i,j) if they exist</span>
        <span class="code-keyword">if</span> (dist[i][k] !== Infinity && dist[k][j] !== Infinity &&
            dist[i][k] + dist[k][j] < dist[i][j]) {
          <span class="code-comment">// Update distance if shorter path found via k</span>
          dist[i][j] = dist[i][k] + dist[k][j];
          <span class="code-comment">// Visualize update in distance matrix and potentially on graph edge (i,j)</span>
        }
      }
    }
     <span class="code-comment">// Visualize end of iteration k</span>
  }

  <span class="code-comment">// 3. Check for negative cycles</span>
  <span class="code-comment">// Visualize start of negative cycle check</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < numNodes; i++) {
    <span class="code-comment">// Visualize checking dist[i][i]</span>
    <span class="code-keyword">if</span> (dist[i][i] < <span class="code-number">0</span>) {
      <span class="code-comment">// Visualize negative cycle detected (highlight node i)</span>
      <span class="code-keyword">return</span> { error: <span class="code-string">"Negative cycle detected"</span>, distances: dist };
    }
  }

  <span class="code-comment">// Visualize completion</span>
  <span class="code-keyword">return</span> { distances: dist };
}`, // End of code string
    pseudocode: `FloydWarshall(graph, numNodes):
  Create dist[numNodes][numNodes]

  // 1. Initialization
  for i = 0 to numNodes - 1:
    for j = 0 to numNodes - 1:
      if i == j: dist[i][j] = 0
      else if edge (i, j) exists with weight w: dist[i][j] = w
      else: dist[i][j] = Infinity
  // Visualize: Initial distance matrix and graph

  // 2. Main loops
  for k = 0 to numNodes - 1: // Intermediate node
    // Visualize: Highlight node k
    for i = 0 to numNodes - 1: // Source node
      for j = 0 to numNodes - 1: // Destination node
        // Visualize: Highlight nodes i, j. Highlight paths/edges i->k, k->j, i->j
        if dist[i][k] + dist[k][j] < dist[i][j]:
          dist[i][j] = dist[i][k] + dist[k][j]
          // Visualize: Update cell dist[i][j] in matrix, optionally highlight edge (i,j) on graph

  // 3. Negative Cycle Detection
  // Visualize: Start Negative Cycle Check
  for i = 0 to numNodes - 1:
    // Visualize: Check dist[i][i] in matrix
    if dist[i][i] < 0:
      // Visualize: Negative cycle detected (highlight node i on graph)
      return Error("Negative cycle detected")

  // Visualize: Algorithm Complete
  return dist`, // End of pseudocode string

    setup: function(data) { // Data ignored
        console.log("Running Floyd-Warshall setup (Graph Vis)...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = ''; // Clear previous content
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        const numNodes = 6;
        const edgeProbability = 0.6;
        const minWeight = -2;
        const maxWeight = 10;

        // --- 1. Generate Graph (Adj List + Edge List) ---
        const adj = {}; const nodes = []; const edges = [];
        for (let i = 0; i < numNodes; i++) { adj[i] = []; nodes.push({ id: i, x: 0, y: 0 }); }
        let edgeCounter = 0;
        for (let i = 0; i < numNodes; i++) {
            for (let j = 0; j < numNodes; j++) {
                 if (i === j) continue;
                 if (Math.random() < edgeProbability) {
                    let weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
                    if (weight === 0) weight = Math.random() < 0.5 ? 1 : -1;
                    const existingEdgeIndex = adj[i].findIndex(edge => edge.node === j);
                    if (existingEdgeIndex !== -1) { if (weight < adj[i][existingEdgeIndex].weight) { adj[i][existingEdgeIndex].weight = weight; const edgeToUpdate = edges.find(e => e.u === i && e.v === j); if(edgeToUpdate) edgeToUpdate.weight = weight; } }
                    else { const edgeData = { node: j, weight: weight }; adj[i].push(edgeData); edges.push({ u: i, v: j, weight: weight, id: `edge-${i}-${j}-${edgeCounter++}` }); }
                }
            }
        }
        // Note: Connectivity/Negative cycle generation omitted.
        // --- End Graph Generation ---

        // --- 2. Setup SVG Container for Graph ---
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const containerWidth = extraVisualizationArea.clientWidth || 600;
        const graphHeight = 350; // Allocate space for graph
        svgContainer.setAttribute("viewBox", `0 0 ${containerWidth} ${graphHeight}`);
        svgContainer.setAttribute("width", "100%"); svgContainer.setAttribute("height", graphHeight);
        svgContainer.id = "graph-svg-container"; extraVisualizationArea.appendChild(svgContainer);
        // Arrowhead Definition
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"); const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker"); marker.setAttribute("id", "arrowhead"); marker.setAttribute("markerWidth", "10"); marker.setAttribute("markerHeight", "7"); marker.setAttribute("refX", "9"); marker.setAttribute("refY", "3.5"); marker.setAttribute("orient", "auto"); const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon"); polygon.setAttribute("points", "0 0, 10 3.5, 0 7"); polygon.setAttribute("class", "graph-arrowhead"); marker.appendChild(polygon); defs.appendChild(marker); svgContainer.appendChild(defs);

        // --- 3. Calculate Node Positions ---
        const nodeRadius = 15; // Smaller nodes for graph clarity
        const radius = graphHeight * 0.4; const centerX = containerWidth / 2; const centerY = graphHeight / 2;
        nodes.forEach((node, index) => { const angle = (index / numNodes) * 2 * Math.PI; node.x = centerX + radius * Math.cos(angle); node.y = centerY + radius * Math.sin(angle); });

        // --- 4. Create SVG Elements (Graph) ---
        const svgElements = { nodes: {}, edges: {} };
        edges.forEach(edge => {
            const u = edge.u; const v = edge.v; const weight = edge.weight; const edgeId = edge.id;
            const edgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); edgeGroup.id = edgeId; edgeGroup.setAttribute("class", "graph-edge-group");
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const angle = Math.atan2(nodes[v].y - nodes[u].y, nodes[v].x - nodes[u].x);
            const startX = nodes[u].x; const startY = nodes[u].y;
            const endX = nodes[v].x - nodeRadius * 1.0 * Math.cos(angle); const endY = nodes[v].y - nodeRadius * 1.0 * Math.sin(angle);
            line.setAttribute("x1", startX); line.setAttribute("y1", startY); line.setAttribute("x2", endX); line.setAttribute("y2", endY);
            line.setAttribute("class", "graph-edge directed"); line.setAttribute("marker-end", "url(#arrowhead)"); edgeGroup.appendChild(line);
            const midX = (startX + endX) / 2; const midY = (startY + endY) / 2; // Midpoint of visible line
            const offsetX = 8 * Math.sin(angle); const offsetY = -8 * Math.cos(angle);
            const weightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            weightText.setAttribute("x", midX + offsetX); weightText.setAttribute("y", midY + offsetY);
            weightText.setAttribute("text-anchor", "middle"); weightText.setAttribute("dy", ".3em");
            weightText.setAttribute("class", `graph-edge-weight ${weight < 0 ? 'negative-weight' : ''}`); weightText.textContent = weight; edgeGroup.appendChild(weightText);
            svgContainer.appendChild(edgeGroup); svgElements.edges[edgeId] = edgeGroup;
        });
        nodes.forEach(node => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g"); group.setAttribute("transform", `translate(${node.x}, ${node.y})`); group.id = `node-${node.id}`;
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); circle.setAttribute("r", nodeRadius); circle.setAttribute("class", "graph-node"); group.appendChild(circle);
            const idText = document.createElementNS("http://www.w3.org/2000/svg", "text"); idText.setAttribute("text-anchor", "middle"); idText.setAttribute("dy", ".3em"); // Center vertically
            idText.setAttribute("class", "graph-node-label"); idText.textContent = node.id; group.appendChild(idText);
            svgContainer.appendChild(group); svgElements.nodes[node.id] = group;
        });

        // --- 5. Setup Matrix Display Area (Below Graph) ---
        const matrixContainer = document.createElement('div');
        matrixContainer.id = 'fw-matrix-container';
        matrixContainer.className = 'fw-matrix-container p-2 mt-4 overflow-x-auto bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg';
        extraVisualizationArea.appendChild(matrixContainer);

        // --- 6. Setup Iteration Display ---
         const iterationContainer = document.createElement('div');
         iterationContainer.id = 'fw-iteration-container';
         iterationContainer.className = 'fw-iteration-container mt-2 text-center text-sm text-gray-600 dark:text-gray-400';
         iterationContainer.innerHTML = '<span>Iteration: Initial</span>';
         extraVisualizationArea.appendChild(iterationContainer);

        // --- 7. Initialize Distance Matrix and Generate Steps ---
        let steps = [];
        let dist = Array(numNodes).fill(0).map(() => Array(numNodes).fill(Infinity));
        let matrixElements = Array(numNodes).fill(0).map(() => Array(numNodes).fill(null)); // For matrix cell DOM elements
        let nodeStates = {}; // 'initial', 'intermediate-k', 'source-i', 'dest-j', 'updated', 'negative-cycle'
        let edgeStates = {}; // 'idle', 'path-ik', 'path-kj', 'path-ij', 'updated'

        // Initialize Matrix & States
        nodes.forEach(node => nodeStates[node.id] = 'initial');
        edges.forEach(edge => edgeStates[edge.id] = 'idle');
        for (let i = 0; i < numNodes; i++) {
            dist[i][i] = 0;
            if (adj[i]) { adj[i].forEach(edge => { dist[i][edge.node] = Math.min(dist[i][edge.node], edge.weight); }); }
        }

        // Create Matrix DOM Elements
        const table = document.createElement('table'); table.className = 'fw-matrix';
        const headerRow = table.insertRow(); headerRow.insertCell().className = 'fw-matrix-header';
        for (let j = 0; j < numNodes; j++) { const th = document.createElement('th'); th.className = 'fw-matrix-header'; th.textContent = j; headerRow.appendChild(th); }
        for (let i = 0; i < numNodes; i++) {
            const row = table.insertRow(); const th = document.createElement('th'); th.className = 'fw-matrix-header'; th.textContent = i; row.appendChild(th);
            for (let j = 0; j < numNodes; j++) {
                const cell = row.insertCell(); cell.className = 'fw-matrix-cell'; cell.id = `cell-${i}-${j}`;
                const initialDistValue = dist[i][j]; cell.textContent = initialDistValue === Infinity ? "∞" : initialDistValue;
                matrixElements[i][j] = cell;
            }
        }
        matrixContainer.appendChild(table);

        // Initial Step
        steps.push({
            type: 'init', k: -1, i: -1, j: -1,
            distances: JSON.parse(JSON.stringify(dist)),
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            message: 'Initialized. Matrix shows direct edge weights.'
        });

        // Main Floyd-Warshall Loops - Step Generation
        let negativeCycleDetected = false;
        for (let k = 0; k < numNodes; k++) {
            // Reset node states, mark k
            Object.keys(nodeStates).forEach(id => nodeStates[id] = 'initial');
            nodeStates[k] = 'intermediate-k';
            // Reset edge states
            Object.keys(edgeStates).forEach(id => edgeStates[id] = 'idle');

            steps.push({
                type: 'start-k-iteration', k: k, i: -1, j: -1,
                distances: JSON.parse(JSON.stringify(dist)),
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                message: `Start Iteration k = ${k} (paths through node ${k})`
            });

            for (let i = 0; i < numNodes; i++) {
                 // Reset states for i loop
                 Object.keys(nodeStates).forEach(id => { if(nodeStates[id] !== 'intermediate-k') nodeStates[id] = 'initial'; });
                 Object.keys(edgeStates).forEach(id => edgeStates[id] = 'idle');
                 nodeStates[i] = 'source-i'; // Mark current i

                for (let j = 0; j < numNodes; j++) {
                     // Reset states for j loop (except k and i)
                     Object.keys(nodeStates).forEach(id => { if(nodeStates[id] !== 'intermediate-k' && nodeStates[id] !== 'source-i') nodeStates[id] = 'initial'; });
                     Object.keys(edgeStates).forEach(id => edgeStates[id] = 'idle');
                     nodeStates[j] = 'dest-j'; // Mark current j

                    const dist_ik = dist[i][k]; const dist_kj = dist[k][j]; const dist_ij = dist[i][j];

                    // Find edge IDs (if they exist) - Note: This assumes only one edge i->k etc.
                    // A more robust approach might involve highlighting nodes i, k, j only.
                    const edge_ik = edges.find(e => e.u === i && e.v === k)?.id;
                    const edge_kj = edges.find(e => e.u === k && e.v === j)?.id;
                    const edge_ij = edges.find(e => e.u === i && e.v === j)?.id;

                    if(edge_ik) edgeStates[edge_ik] = 'path-ik';
                    if(edge_kj) edgeStates[edge_kj] = 'path-kj';
                    if(edge_ij) edgeStates[edge_ij] = 'path-ij';


                    steps.push({
                        type: 'check-path', k: k, i: i, j: j,
                        dist_ik: dist_ik, dist_kj: dist_kj, dist_ij: dist_ij,
                        distances: JSON.parse(JSON.stringify(dist)),
                        nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                        message: `k=${k}, i=${i}, j=${j}: Check dist(${i},${j}) vs dist(${i},${k}) + dist(${k},${j})`
                    });

                    // Reset edge states after check before potential update
                    if(edge_ik) edgeStates[edge_ik] = 'idle';
                    if(edge_kj) edgeStates[edge_kj] = 'idle';
                    if(edge_ij) edgeStates[edge_ij] = 'idle';


                    if (dist_ik !== Infinity && dist_kj !== Infinity && dist_ik + dist_kj < dist_ij) {
                        const oldDist = dist[i][j];
                        dist[i][j] = dist_ik + dist_kj;
                        nodeStates[i] = 'source-i'; // Re-assert i, j, k states
                        nodeStates[j] = 'dest-j';
                        nodeStates[k] = 'intermediate-k';
                        if(edge_ij) edgeStates[edge_ij] = 'updated'; // Mark direct edge as updated

                        steps.push({
                            type: 'update-dist', k: k, i: i, j: j,
                            newDist: dist[i][j], oldDist: oldDist,
                            distances: JSON.parse(JSON.stringify(dist)),
                            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                            message: `k=${k}, i=${i}, j=${j}: Update dist(${i},${j}) to ${dist[i][j]} via ${k}`
                        });
                         if(edge_ij) edgeStates[edge_ij] = 'idle'; // Reset edge state after update shown
                    }
                     // Reset j node state if not updated
                     if(nodeStates[j] === 'dest-j') nodeStates[j] = 'initial';
                }
                 // Reset i node state
                 if(nodeStates[i] === 'source-i') nodeStates[i] = 'initial';
            }
             steps.push({ type: 'end-k-iteration', k: k, i: -1, j: -1, distances: JSON.parse(JSON.stringify(dist)), nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates }, message: `End Iteration k = ${k}` });
        }

        // Reset states before cycle check
        Object.keys(nodeStates).forEach(id => nodeStates[id] = 'initial');
        Object.keys(edgeStates).forEach(id => edgeStates[id] = 'idle');

        // Negative Cycle Check (Step Generation)
        steps.push({ type: 'start-neg-cycle-check', k: -1, i: -1, j: -1, distances: JSON.parse(JSON.stringify(dist)), nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates }, message: 'Checking for negative cycles...' });
        for (let i = 0; i < numNodes; i++) {
             nodeStates[i] = 'checking-neg-cycle'; // Highlight node being checked
             steps.push({ type: 'check-neg-cycle-diag', k: -1, i: i, j: i, distances: JSON.parse(JSON.stringify(dist)), nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates }, message: `Checking dist[${i}][${i}] = ${dist[i][i]}` });
            if (dist[i][i] < 0) {
                negativeCycleDetected = true;
                nodeStates[i] = 'negative-cycle'; // Mark node
                steps.push({ type: 'neg-cycle-detected', k: -1, i: i, j: i, distances: JSON.parse(JSON.stringify(dist)), nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates }, message: `Negative cycle detected! dist[${i}][${i}] < 0.` });
                break;
            }
             nodeStates[i] = 'initial'; // Reset state after check
        }
        if (!negativeCycleDetected) { steps.push({ type: 'no-neg-cycle', k: -1, i: -1, j: -1, distances: JSON.parse(JSON.stringify(dist)), nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates }, message: 'No negative cycles found.' }); }

        // Final Step
        Object.keys(nodeStates).forEach(id => nodeStates[id] = 'final'); // Final state for all nodes
        if (negativeCycleDetected) {
             // Keep negative cycle nodes highlighted
             steps[steps.length-1].nodeStates = {...steps[steps.length-2].nodeStates}; // Use states from detection step
             Object.keys(nodeStates).forEach(id => {if(steps[steps.length-1].nodeStates[id] !== 'negative-cycle') steps[steps.length-1].nodeStates[id] = 'final-neg-cycle';}); // Dim others
        }

        steps.push({
            type: 'finish', k: -1, i: -1, j: -1,
            distances: JSON.parse(JSON.stringify(dist)),
            nodeStates: { ...nodeStates }, // Use the potentially modified states
            edgeStates: { ...edgeStates }, // Edges idle in final state
            negativeCycle: negativeCycleDetected,
            message: negativeCycleDetected ? 'Algorithm finished. Negative cycle detected.' : 'Algorithm finished. All-pairs shortest paths calculated.'
        });

        console.log("Floyd-Warshall setup complete. Steps generated:", steps.length);
        // Return both graph and matrix elements
        return { steps, elements: { graph: svgElements, matrix: matrixElements }, numNodes: numNodes };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.graph || !elements.matrix || !step.distances || !step.nodeStates || !step.edgeStates || animationState.numNodes === undefined) {
            console.error("Floyd-Warshall RenderStep: Missing data", { step, elements, animationState });
            return;
        }
        const numNodes = animationState.numNodes;
        const graphElements = elements.graph;
        const matrixElements = elements.matrix;

        // Update Iteration Display
        const iterationContainer = document.getElementById('fw-iteration-container');
        if(iterationContainer) {
            let iterText = "-";
            if(step.k !== undefined && step.k >= 0) iterText = `k = ${step.k}`;
            else if(step.type === 'init') iterText = "Initial";
            else if(step.type.includes('neg-cycle')) iterText = "Neg Cycle Check";
            else if(step.type === 'finish') iterText = "Finished";
             iterationContainer.innerHTML = `<span>Iteration: ${iterText}</span>`;
        }

        // --- Render Graph ---
        // Apply node states
        Object.keys(graphElements.nodes).forEach(nodeId => {
            const nodeGroup = graphElements.nodes[nodeId];
            const circle = nodeGroup.querySelector('circle');
            if (!circle) return;
            const state = step.nodeStates[nodeId];

            circle.classList.remove('initial', 'intermediate-k', 'source-i', 'dest-j', 'updated', 'negative-cycle', 'final', 'final-neg-cycle', 'checking-neg-cycle'); // Reset graph states
            if (state === 'intermediate-k') circle.classList.add('intermediate-k');
            else if (state === 'source-i') circle.classList.add('source-i');
            else if (state === 'dest-j') circle.classList.add('dest-j');
            else if (state === 'negative-cycle') circle.classList.add('negative-cycle');
            else if (state === 'checking-neg-cycle') circle.classList.add('checking-neg-cycle');
            else if (state === 'final') circle.classList.add('final'); // Optional final style
            else if (state === 'final-neg-cycle') circle.classList.add('final-neg-cycle'); // Optional final style when cycle exists
            else circle.classList.add('initial');
        });
        // Apply edge states
        Object.keys(graphElements.edges).forEach(edgeId => {
            const edgeGroup = graphElements.edges[edgeId];
            const line = edgeGroup.querySelector('line');
            if (!line) return;
            const state = step.edgeStates[edgeId];
            line.classList.remove('idle', 'path-ik', 'path-kj', 'path-ij', 'updated'); // Reset graph edge states
            if (state === 'path-ik') line.classList.add('path-ik');
            else if (state === 'path-kj') line.classList.add('path-kj');
            else if (state === 'path-ij') line.classList.add('path-ij');
            else if (state === 'updated') line.classList.add('updated'); // Highlight edge corresponding to matrix update
            else line.classList.add('idle');
        });


        // --- Render Matrix ---
        for (let r = 0; r < numNodes; r++) {
            for (let c = 0; c < numNodes; c++) {
                const cell = matrixElements[r]?.[c];
                if (!cell) continue;
                const distValue = step.distances[r]?.[c];
                if (distValue === undefined) continue;
                cell.textContent = distValue === Infinity ? "∞" : distValue;

                // Reset matrix highlights
                cell.classList.remove('highlight-i', 'highlight-j', 'highlight-k-row', 'highlight-k-col', 'highlight-ik', 'highlight-kj', 'highlight-ij', 'updated', 'negative-cycle');

                // Apply matrix step-specific highlights
                const { k, i, j } = step;
                 if ((step.type === 'check-path' || step.type === 'update-dist') && k >= 0) {
                    if (r === k) cell.classList.add('highlight-k-row');
                    if (c === k) cell.classList.add('highlight-k-col');
                    if (i >= 0 && j >= 0) {
                        if (r === i && c === k) cell.classList.add('highlight-ik');
                        if (r === k && c === j) cell.classList.add('highlight-kj');
                        if (r === i && c === j) cell.classList.add('highlight-ij');
                    }
                    if (step.type === 'update-dist' && r === i && c === j) {
                        cell.classList.add('updated');
                    }
                } else if (step.type === 'check-neg-cycle-diag' && r === i && c === i) {
                     cell.classList.add('highlight-ij');
                } else if (step.type === 'neg-cycle-detected' && r === i && c === i) {
                     cell.classList.add('negative-cycle');
                } else if (step.type === 'finish' && step.negativeCycle && step.distances[r]?.[r] < 0 && r === c){
                     cell.classList.add('negative-cycle');
                }
            }
        }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    } // End of renderStep
}; // End of floydWarshallConfig
