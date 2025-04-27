// js/algorithms/bellman-ford.js

const bellmanFordConfig = {
    name: 'Bellman-Ford',
    type: 'graph', // Use graph type
    // Allow negative weights, but the generator avoids negative cycles for simplicity
    code: `<span class="code-keyword">function</span> <span class="code-function">bellmanFord</span>(graph, nodes, startNode) {
  <span class="code-keyword">const</span> distances = {};
  <span class="code-keyword">const</span> predecessors = {};
  <span class="code-keyword">const</span> numNodes = nodes.length;

  <span class="code-comment">// 1. Initialize distances: 0 for start, Infinity for others</span>
  nodes.<span class="code-function">forEach</span>(node => {
    distances[node.id] = Infinity;
    predecessors[node.id] = null;
  });
  distances[startNode] = <span class="code-number">0</span>;
  <span class="code-comment">// Visualize initial state</span>

  <span class="code-comment">// 2. Relax edges repeatedly (|V| - 1 times)</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">1</span>; i < numNodes; i++) {
    <span class="code-comment">// Visualize start of iteration i</span>
    <span class="code-keyword">let</span> relaxedThisIteration = <span class="code-keyword">false</span>;
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> u <span class="code-keyword">in</span> graph) {
      <span class="code-keyword">for</span> (<span class="code-keyword">const</span> edge <span class="code-keyword">of</span> graph[u]) { <span class="code-comment">// edge = { node: v, weight: w }</span>
        <span class="code-keyword">const</span> v = edge.node;
        <span class="code-keyword">const</span> weight = edge.weight;
        <span class="code-comment">// Visualize checking edge (u, v)</span>

        <span class="code-keyword">if</span> (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
          <span class="code-comment">// Relaxation</span>
          distances[v] = distances[u] + weight;
          predecessors[v] = u;
          relaxedThisIteration = <span class="code-keyword">true</span>;
          <span class="code-comment">// Visualize relaxation: update distance[v] and predecessor[v]</span>
        }
      }
    }
     <span class="code-comment">// Optimization: If no relaxation in an iteration, stop early</span>
     <span class="code-keyword">if</span> (!relaxedThisIteration) <span class="code-keyword">break</span>;
  }

  <span class="code-comment">// 3. Check for negative weight cycles</span>
  <span class="code-comment">// Visualize start of negative cycle check</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">const</span> u <span class="code-keyword">in</span> graph) {
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> edge <span class="code-keyword">of</span> graph[u]) {
      <span class="code-keyword">const</span> v = edge.node;
      <span class="code-keyword">const</span> weight = edge.weight;
      <span class="code-keyword">if</span> (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        <span class="code-comment">// Visualize negative cycle detected</span>
        <span class="code-keyword">return</span> { error: <span class="code-string">"Graph contains a negative weight cycle"</span>, distances, predecessors };
      }
    }
  }

  <span class="code-comment">// Visualize completion</span>
  <span class="code-keyword">return</span> { distances, predecessors };
}`,
    pseudocode: `BellmanFord(graph, nodes, startNode):
  Create Map, distances
  Create Map, predecessors

  // 1. Initialization
  for each node in nodes:
    distances[node.id] = Infinity
    predecessors[node.id] = null
  distances[startNode] = 0
  // Visualize: Initialize distances (start=0, others=∞)

  // 2. Relaxation Rounds (|V| - 1 iterations)
  repeat |V| - 1 times:
    // Visualize: Start Iteration k
    relaxed_in_iteration = false
    for each edge (u, v) with weight w in graph:
      // Visualize: Check edge (u, v)
      if distances[u] is not Infinity and distances[u] + w < distances[v]:
        // Relax edge
        distances[v] = distances[u] + w
        predecessors[v] = u
        relaxed_in_iteration = true
        // Visualize: Update distance[v], mark edge/node as updated

    // Optimization: If no distances updated in this iteration, can stop early
    if not relaxed_in_iteration:
       break // Visualize: Early exit

  // 3. Negative Cycle Detection
  // Visualize: Start Negative Cycle Check
  for each edge (u, v) with weight w in graph:
    // Visualize: Check edge (u, v) again
    if distances[u] is not Infinity and distances[u] + w < distances[v]:
      // Negative cycle detected!
      // Visualize: Highlight edge/nodes involved in negative cycle
      return Error("Graph contains a negative weight cycle")

  // Visualize: Algorithm Complete
  return {distances, predecessors}`,

    setup: function(data) { // Data ignored
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = '';
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        const numNodes = 7; // Fewer nodes for better visualization
        const edgeProbability = 0.5; // Denser graph
        const minWeight = -3; // Allow negative weights
        const maxWeight = 10;
        const allowNegativeCycles = false; // Set to true to test cycle detection (more complex generation)

        // --- 1. Generate Random Directed Weighted Graph ---
        const adj = {};
        const nodes = [];
        const edges = []; // Store edges explicitly: { u, v, weight, id }
        for (let i = 0; i < numNodes; i++) {
            adj[i] = [];
            nodes.push({ id: i, x: 0, y: 0 });
        }

        let edgeCounter = 0;
        for (let i = 0; i < numNodes; i++) {
            for (let j = 0; j < numNodes; j++) {
                if (i === j) continue; // No self-loops
                if (Math.random() < edgeProbability) {
                    let weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
                    // Avoid weight 0 for clarity unless specifically needed
                    if (weight === 0) weight = Math.random() < 0.5 ? 1 : -1;

                    const edgeData = { node: j, weight: weight };
                    adj[i].push(edgeData);
                    edges.push({ u: i, v: j, weight: weight, id: `edge-${i}-${j}-${edgeCounter++}` });
                }
            }
        }

        // TODO: Add logic to detect and optionally remove negative cycles if allowNegativeCycles is false.
        // This is non-trivial. For now, we rely on random generation likely not creating one.
        // A simple check could run Bellman-Ford internally here, but that's complex.

        // Ensure start node (0) can reach others (simple approach)
         let reachable = new Set([0]);
         let queue = [0];
         let head = 0;
         while(head < queue.length){
             const u = queue[head++];
             (adj[u] || []).forEach(edge => {
                 if(!reachable.has(edge.node)){
                     reachable.add(edge.node);
                     queue.push(edge.node);
                 }
             });
         }
         for(let i=1; i<numNodes; ++i){
             if(!reachable.has(i)){
                 console.log(`Node ${i} not reachable from 0, adding edge.`);
                 const weight = Math.floor(Math.random() * 5) + 1; // Add positive edge
                 adj[0].push({ node: i, weight: weight });
                 edges.push({ u: 0, v: i, weight: weight, id: `edge-0-${i}-${edgeCounter++}` });
             }
         }
        // --- End Graph Generation ---

        // --- 2. Setup SVG Container ---
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const containerWidth = extraVisualizationArea.clientWidth || 600;
        const containerHeight = 400;
        svgContainer.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
        svgContainer.setAttribute("width", "100%"); svgContainer.setAttribute("height", containerHeight);
        svgContainer.id = "graph-svg-container"; extraVisualizationArea.appendChild(svgContainer);

        // Define marker for arrowhead
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10"); marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "9"); marker.setAttribute("refY", "3.5"); // Adjust refX for distance from node
        marker.setAttribute("orient", "auto");
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "0 0, 10 3.5, 0 7"); // Arrow shape
        polygon.setAttribute("class", "graph-arrowhead"); // Class for styling
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svgContainer.appendChild(defs);


        // --- 3. Calculate Node Positions (Circular Layout) ---
        const radius = containerHeight * 0.4; const centerX = containerWidth / 2; const centerY = containerHeight / 2;
        nodes.forEach((node, index) => { const angle = (index / numNodes) * 2 * Math.PI; node.x = centerX + radius * Math.cos(angle); node.y = centerY + radius * Math.sin(angle); });

        // --- 4. Create SVG Elements ---
        const nodeRadius = 18;
        const svgElements = { nodes: {}, edges: {} };
        // Edges & Weights
        edges.forEach(edge => {
            const u = edge.u; const v = edge.v; const weight = edge.weight; const edgeId = edge.id;
            const edgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            edgeGroup.id = edgeId; edgeGroup.setAttribute("class", "graph-edge-group");

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            // Adjust start/end points slightly for arrowhead visibility
            const angle = Math.atan2(nodes[v].y - nodes[u].y, nodes[v].x - nodes[u].x);
            const startX = nodes[u].x + nodeRadius * 0.0 * Math.cos(angle); // Start at node center
            const startY = nodes[u].y + nodeRadius * 0.0 * Math.sin(angle);
            const endX = nodes[v].x - nodeRadius * 1.0 * Math.cos(angle); // End just before target node radius
            const endY = nodes[v].y - nodeRadius * 1.0 * Math.sin(angle);

            line.setAttribute("x1", startX); line.setAttribute("y1", startY);
            line.setAttribute("x2", endX); line.setAttribute("y2", endY);
            line.setAttribute("class", "graph-edge directed");
            line.setAttribute("marker-end", "url(#arrowhead)"); // Add arrowhead
            edgeGroup.appendChild(line);

            const midX = (nodes[u].x + nodes[v].x) / 2; const midY = (nodes[u].y + nodes[v].y) / 2;
            const offsetX = 10 * Math.sin(angle); const offsetY = -10 * Math.cos(angle); // Increased offset

            const weightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            weightText.setAttribute("x", midX + offsetX); weightText.setAttribute("y", midY + offsetY);
            weightText.setAttribute("text-anchor", "middle"); weightText.setAttribute("dy", ".3em");
            weightText.setAttribute("class", `graph-edge-weight ${weight < 0 ? 'negative-weight' : ''}`);
            weightText.textContent = weight;
            edgeGroup.appendChild(weightText);

            svgContainer.appendChild(edgeGroup);
            svgElements.edges[edgeId] = edgeGroup;
        });
        // Nodes & Distance Labels
        nodes.forEach(node => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", `translate(${node.x}, ${node.y})`); group.id = `node-${node.id}`;
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", nodeRadius); circle.setAttribute("class", "graph-node"); group.appendChild(circle);
            const idText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            idText.setAttribute("text-anchor", "middle"); idText.setAttribute("dy", "-0.2em");
            idText.setAttribute("class", "graph-node-label"); idText.textContent = node.id; group.appendChild(idText);
            const distText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            distText.setAttribute("text-anchor", "middle"); distText.setAttribute("dy", "1.0em");
            distText.setAttribute("class", "graph-node-distance"); distText.textContent = "∞";
            distText.id = `dist-${node.id}`; group.appendChild(distText);
            svgContainer.appendChild(group); svgElements.nodes[node.id] = group;
        });

        // --- 5. Add Iteration and Distance Table Display ---
         const displayContainer = document.createElement('div');
         displayContainer.className = 'flex flex-col lg:flex-row gap-4 mt-4';

         const iterationContainer = document.createElement('div');
         iterationContainer.id = 'bf-iteration-container';
         iterationContainer.className = 'bf-iteration-container'; // New class
         iterationContainer.innerHTML = '<span>Iteration: -</span>';
         displayContainer.appendChild(iterationContainer);

         const distTableContainer = document.createElement('div');
         distTableContainer.id = 'bf-dist-table'; // Use different ID than Dijkstra
         distTableContainer.className = 'bf-dist-table'; // New class
         distTableContainer.innerHTML = '<span>Distances:</span>';
         displayContainer.appendChild(distTableContainer);

         extraVisualizationArea.appendChild(displayContainer);

        // --- 6. Generate Bellman-Ford Steps ---
        let steps = [];
        let nodeStates = {}; // 'initial', 'updated', 'final' (maybe 'negative-cycle')
        let edgeStates = {}; // 'idle', 'checking', 'relaxed', 'negative-cycle'
        let currentDistances = {};
        let currentPredecessors = {}; // Track predecessors for path highlighting

        nodes.forEach(node => {
            nodeStates[node.id] = 'initial';
            currentDistances[node.id] = Infinity;
            currentPredecessors[node.id] = null;
        });
        edges.forEach(edge => edgeStates[edge.id] = 'idle');

        const startNode = 0;
        currentDistances[startNode] = 0;

        steps.push({
            type: 'start', iteration: 0,
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            distances: { ...currentDistances },
            message: `Starting Bellman-Ford from node ${startNode}. Initialize distances.`
        });

        let negativeCycleDetected = false;
        let nodesInNegativeCycle = new Set(); // To highlight nodes in cycle

        // Relaxation Rounds
        for (let i = 1; i < numNodes; i++) {
            steps.push({
                type: 'start-iteration', iteration: i,
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                distances: { ...currentDistances },
                message: `Start Relaxation Iteration ${i}`
            });
            let relaxedThisIteration = false;
            // Reset 'relaxed' edge state from previous iteration
             edges.forEach(edge => { if(edgeStates[edge.id] === 'relaxed') edgeStates[edge.id] = 'idle'; });

            for (const edge of edges) {
                const u = edge.u; const v = edge.v; const weight = edge.weight; const edgeId = edge.id;

                edgeStates[edgeId] = 'checking';
                steps.push({
                    type: 'check-edge', iteration: i, edge: edge,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    distances: { ...currentDistances },
                    message: `Iteration ${i}: Checking edge (${u} -> ${v}), weight ${weight}`
                });

                if (currentDistances[u] !== Infinity && currentDistances[u] + weight < currentDistances[v]) {
                    const oldDist = currentDistances[v];
                    currentDistances[v] = currentDistances[u] + weight;
                    currentPredecessors[v] = u;
                    relaxedThisIteration = true;
                    edgeStates[edgeId] = 'relaxed'; // Mark edge as relaxed in this step
                    nodeStates[v] = 'updated'; // Mark node as updated

                    steps.push({
                        type: 'relax-edge', iteration: i, edge: edge, newDist: currentDistances[v], oldDist: oldDist,
                        nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                        distances: { ...currentDistances },
                        message: `Iteration ${i}: Relax edge (${u} -> ${v}). Dist(${v}) = ${currentDistances[v]}`
                    });
                    nodeStates[v] = 'initial'; // Reset node state for next check
                } else {
                     edgeStates[edgeId] = 'idle'; // Reset if not relaxed
                     steps.push({
                        type: 'no-relax', iteration: i, edge: edge,
                        nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                        distances: { ...currentDistances },
                        message: `Iteration ${i}: Edge (${u} -> ${v}) not relaxed.`
                    });
                }
            }
             steps.push({
                type: 'end-iteration', iteration: i, relaxed: relaxedThisIteration,
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                distances: { ...currentDistances },
                message: `End Relaxation Iteration ${i}. ${relaxedThisIteration ? 'Relaxations occurred.' : 'No relaxations (can stop early).'}`
            });
            if (!relaxedThisIteration && i < numNodes -1) { // Add early exit step if applicable before the final check
                 steps.push({ type: 'early-exit', iteration: i, message: 'No relaxations occurred. Exiting relaxation phase early.'});
                 break;
            }
        }

        // Negative Cycle Check
        steps.push({
            type: 'start-neg-cycle-check', iteration: numNodes,
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            distances: { ...currentDistances },
            message: `Start Negative Cycle Check (Iteration ${numNodes})`
        });
        let cycleEdge = null;
        for (const edge of edges) {
             const u = edge.u; const v = edge.v; const weight = edge.weight; const edgeId = edge.id;
             edgeStates[edgeId] = 'checking'; // Highlight edge being checked
             steps.push({
                 type: 'check-neg-cycle-edge', iteration: numNodes, edge: edge,
                 nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                 distances: { ...currentDistances },
                 message: `Neg Cycle Check: Checking edge (${u} -> ${v})`
             });

            if (currentDistances[u] !== Infinity && currentDistances[u] + weight < currentDistances[v]) {
                negativeCycleDetected = true;
                cycleEdge = edge; // Store the edge that triggered detection
                edgeStates[edgeId] = 'negative-cycle'; // Mark this edge
                nodeStates[u] = 'negative-cycle'; // Mark nodes involved
                nodeStates[v] = 'negative-cycle';

                // Trace back predecessors to find more nodes in the cycle (simplified)
                let curr = u;
                for(let k=0; k<numNodes && curr !== null; ++k){ // Limit traceback depth
                    nodesInNegativeCycle.add(curr);
                    nodeStates[curr] = 'negative-cycle';
                    const prev = currentPredecessors[curr];
                    if(prev !== null){
                         const prevEdgeId = edges.find(e => e.u === prev && e.v === curr)?.id;
                         if(prevEdgeId) edgeStates[prevEdgeId] = 'negative-cycle';
                    }
                    curr = prev;
                    if(curr === v) break; // Found the cycle start
                }
                 nodesInNegativeCycle.add(v); // Ensure v is included

                steps.push({
                    type: 'neg-cycle-detected', iteration: numNodes, edge: edge,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    distances: { ...currentDistances }, // Show distances at detection point
                    message: `Negative Cycle Detected involving edge (${u} -> ${v})!`
                });
                break; // Stop checking once one cycle is found
            } else {
                 edgeStates[edgeId] = 'idle'; // Reset if not part of cycle detection trigger
            }
        }

        if (!negativeCycleDetected) {
             steps.push({ type: 'no-neg-cycle', iteration: numNodes, message: 'No negative cycles detected.' });
        }

        // Final state
        Object.keys(nodeStates).forEach(id => {
             if (nodeStates[id] !== 'negative-cycle') nodeStates[id] = 'final';
        });
         if(!negativeCycleDetected){ // Highlight final path edges only if no cycle
             Object.keys(edgeStates).forEach(id => edgeStates[id] = 'idle');
             nodes.forEach(node => {
                 const prev = currentPredecessors[node.id];
                 if(prev !== null){
                     const finalEdge = edges.find(e => e.u === prev && e.v === node.id);
                     if(finalEdge) edgeStates[finalEdge.id] = 'path';
                 }
             });
         }


        steps.push({
            type: 'finish',
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            distances: { ...currentDistances }, negativeCycle: negativeCycleDetected,
            message: negativeCycleDetected ? 'Algorithm finished. Negative cycle detected.' : 'Algorithm finished. Shortest paths found.'
        });

        return { steps, elements: svgElements };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.nodes || !elements.edges || !step.nodeStates || !step.edgeStates || !step.distances) {
            console.error("Bellman-Ford RenderStep: Missing data", step);
            return;
        }

        // Update Iteration Display
        const iterationContainer = document.getElementById('bf-iteration-container');
        if(iterationContainer) {
            let iterText = "-";
            if(step.iteration !== undefined){
                if(step.type.includes('neg-cycle')) iterText = `Neg Cycle Check`;
                else if (step.iteration > 0) iterText = step.iteration;
                else iterText = "Init";
            }
             iterationContainer.innerHTML = `<span>Iteration: ${iterText}</span>`;
        }


        // Apply node states and update distance text
        Object.keys(elements.nodes).forEach(nodeId => {
            const nodeGroup = elements.nodes[nodeId];
            const circle = nodeGroup.querySelector('circle');
            const distText = nodeGroup.querySelector('.graph-node-distance');
            if (!circle || !distText) return;

            const state = step.nodeStates[nodeId];
            const distance = step.distances[nodeId];

            // Update distance text
            distText.textContent = distance === Infinity ? "∞" : distance;

            // Apply node style based on state
            circle.classList.remove('initial', 'updated', 'final', 'negative-cycle'); // Reset states
            if (state === 'updated') {
                circle.classList.add('updated'); // Highlight node being updated
            } else if (state === 'negative-cycle') {
                circle.classList.add('negative-cycle');
            } else if (state === 'final') {
                circle.classList.add('final'); // Use a final state style
            } else {
                circle.classList.add('initial');
            }
        });

        // Apply edge states
        Object.keys(elements.edges).forEach(edgeId => {
             const edgeGroup = elements.edges[edgeId];
             const line = edgeGroup.querySelector('line');
             const weightText = edgeGroup.querySelector('.graph-edge-weight');
             if (!line) return;
             const state = step.edgeStates[edgeId];

             line.classList.remove('checking', 'relaxed', 'path', 'negative-cycle'); // Reset specific states
             weightText?.classList.remove('checking', 'relaxed', 'path', 'negative-cycle'); // Style weight too

             if (state === 'checking') {
                 line.classList.add('checking');
                 weightText?.classList.add('checking');
             } else if (state === 'relaxed') {
                 line.classList.add('relaxed'); // Style for edge that caused relaxation
                 weightText?.classList.add('relaxed');
             } else if (state === 'path') {
                 line.classList.add('path'); // Style for final shortest path tree
                 weightText?.classList.add('path');
             } else if (state === 'negative-cycle') {
                 line.classList.add('negative-cycle');
                 weightText?.classList.add('negative-cycle');
             }
         });

         // Update Distances Table Display
         const distTableContainer = document.getElementById('bf-dist-table');
         if (distTableContainer) {
             distTableContainer.innerHTML = '<span>Distances:</span>';
             const table = document.createElement('div');
             table.className = 'dist-table-grid'; // Reuse class from Dijkstra
             Object.keys(step.distances).sort((a,b) => a-b).forEach(nodeId => {
                 const dist = step.distances[nodeId];
                 const cell = document.createElement('span');
                 cell.className = 'dist-table-cell'; // Reuse class
                 cell.innerHTML = `<b>${nodeId}:</b> ${dist === Infinity ? '∞' : dist}`;
                 table.appendChild(cell);
             });
             distTableContainer.appendChild(table);
         }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    } // End of renderStep
}; // End of bellmanFordConfig
