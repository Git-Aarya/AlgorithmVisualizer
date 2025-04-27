// js/algorithms/dijkstra.js

const dijkstraConfig = {
    name: 'Dijkstra’s Algorithm',
    type: 'graph', // Use graph type
    requiresPositiveInts: true, // Edge weights should be positive
    code: `<span class="code-keyword">function</span> <span class="code-function">dijkstra</span>(graph, startNode) {
  <span class="code-keyword">const</span> distances = {}; <span class="code-comment">// Stores shortest distance from startNode</span>
  <span class="code-keyword">const</span> visited = <span class="code-keyword">new</span> <span class="code-function">Set</span>();
  <span class="code-keyword">const</span> pq = <span class="code-keyword">new</span> <span class="code-function">PriorityQueue</span>(); <span class="code-comment">// Min-priority queue {node, distance}</span>
  <span class="code-keyword">const</span> previous = {}; <span class="code-comment">// Stores previous node in shortest path</span>

  <span class="code-comment">// Initialize distances: Infinity for all, 0 for startNode</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">const</span> node <span class="code-keyword">in</span> graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startNode] = <span class="code-number">0</span>;
  <span class="code-comment">// Visualize initial distances</span>

  pq.<span class="code-function">enqueue</span>(startNode, <span class="code-number">0</span>);
  <span class="code-comment">// Visualize adding start node to PQ</span>

  <span class="code-keyword">while</span> (!pq.<span class="code-function">isEmpty</span>()) {
    <span class="code-keyword">const</span> { element: currentNode, priority: currentDist } = pq.<span class="code-function">dequeue</span>();
    <span class="code-comment">// Visualize extracting min distance node from PQ</span>

    <span class="code-keyword">if</span> (visited.<span class="code-function">has</span>(currentNode) || currentDist > distances[currentNode]) {
      <span class="code-comment">// Skip if already visited with a shorter path or if this path is longer</span>
      <span class="code-keyword">continue</span>;
    }

    visited.<span class="code-function">add</span>(currentNode);
    <span class="code-comment">// Visualize marking node as visited</span>

    <span class="code-keyword">const</span> neighbors = graph[currentNode] || [];
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> neighborData <span class="code-keyword">of</span> neighbors) { <span class="code-comment">// neighborData = { node: neighborNode, weight: edgeWeight }</span>
      <span class="code-keyword">const</span> neighbor = neighborData.node;
      <span class="code-keyword">const</span> weight = neighborData.weight;
      <span class="code-comment">// Visualize checking edge to neighbor</span>

      <span class="code-keyword">if</span> (!visited.<span class="code-function">has</span>(neighbor)) {
        <span class="code-keyword">const</span> distanceThroughU = currentDist + weight;

        <span class="code-comment">// Relaxation step</span>
        <span class="code-keyword">if</span> (distanceThroughU < distances[neighbor]) {
          distances[neighbor] = distanceThroughU;
          previous[neighbor] = currentNode;
          pq.<span class="code-function">enqueue</span>(neighbor, distanceThroughU);
          <span class="code-comment">// Visualize distance update and adding/updating neighbor in PQ</span>
        }
      }
    }
     <span class="code-comment">// Visualize marking node exploration complete</span>
  }

  <span class="code-keyword">return</span> { distances, previous }; <span class="code-comment">// Return shortest distances and paths</span>
}

<span class="code-comment">// Simple Priority Queue Implementation (for demonstration)</span>
<span class="code-keyword">class</span> <span class="code-function">PriorityQueue</span> {
  <span class="code-function">constructor</span>() { <span class="code-keyword">this</span>.items = []; }
  <span class="code-function">enqueue</span>(element, priority) { <span class="code-keyword">this</span>.items.<span class="code-function">push</span>({ element, priority }); <span class="code-keyword">this</span>.<span class="code-function">sort</span>(); }
  <span class="code-function">dequeue</span>() { <span class="code-keyword">return</span> <span class="code-keyword">this</span>.items.<span class="code-function">shift</span>(); } // Simplistic: shift is O(N), real PQ is O(log N)
  <span class="code-function">isEmpty</span>() { <span class="code-keyword">return</span> <span class="code-keyword">this</span>.items.length === <span class="code-number">0</span>; }
  <span class="code-function">sort</span>() { <span class="code-keyword">this</span>.items.<span class="code-function">sort</span>((a, b) => a.priority - b.priority); } // O(N log N) enqueue
  <span class="code-function">getSnapshot</span>() { <span class="code-keyword">return</span> <span class="code-keyword">this</span>.items.<span class="code-function">map</span>(item => \`\${item.element}(\${item.priority})\`); } // For visualization
}`,
    pseudocode: `Dijkstra(graph, startNode):
  Create Map, distances // Store distance from startNode to node
  Create Map, previous // Store previous node in shortest path
  Create Set, visited
  Create MinPriorityQueue, pq // Stores {node, distance} pairs

  // Initialization
  for each node in graph:
    distances[node] = Infinity
    previous[node] = null
  distances[startNode] = 0
  // Visualize: Initialize all distances to ∞, startNode to 0

  pq.enqueue(startNode, 0)
  // Visualize: Add startNode to PQ with distance 0

  while pq is not empty:
    {currentNode, currentDist} = pq.dequeue() // Get node with smallest distance
    // Visualize: Extract min node (currentNode) from PQ (state: processing)

    // Skip if already found a shorter path or already finalized
    if currentNode is in visited or currentDist > distances[currentNode]:
      // Visualize: Skip node (already visited / longer path)
      continue

    Add currentNode to visited
    // Visualize: Mark currentNode as visited (state: visited)

    // Explore neighbors
    for each neighborData {neighbor, weight} in graph[currentNode]:
      // Visualize: Check edge (currentNode -> neighbor) with weight

      if neighbor is not in visited:
        distanceThroughCurrent = distances[currentNode] + weight

        // Relaxation: Found a potentially shorter path?
        if distanceThroughCurrent < distances[neighbor]:
          distances[neighbor] = distanceThroughCurrent
          previous[neighbor] = currentNode
          pq.enqueue(neighbor, distanceThroughCurrent)
          // Visualize: Update distance[neighbor], highlight path, update PQ

      // else: Visualize: Neighbor already visited, skip relaxation

    // Visualize: Finished exploring neighbors of currentNode

  return {distances, previous}`,

    setup: function(data) { // Data ignored
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = '';
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        const numNodes = 8; // Slightly fewer nodes for clarity
        const edgeProbability = 0.4;
        const minWeight = 1;
        const maxWeight = 10;

        // --- 1. Generate Random Weighted Graph ---
        const adj = {};
        const nodes = [];
        for (let i = 0; i < numNodes; i++) {
            adj[i] = []; // Adjacency list stores { node: neighborId, weight: edgeWeight }
            nodes.push({ id: i, x: 0, y: 0 });
        }

        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.random() < edgeProbability) {
                    const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
                    adj[i].push({ node: j, weight: weight });
                    adj[j].push({ node: i, weight: weight }); // Undirected graph
                }
            }
        }
        // Connectivity Check (same as BFS/DFS) - ensures graph isn't split
        const visitedCheck = new Set(); const qCheck = [0]; visitedCheck.add(0); let head = 0;
        while(head < qCheck.length){ const u = qCheck[head++]; (adj[u] || []).forEach(neighborData => { const v = neighborData.node; if(!visitedCheck.has(v)){ visitedCheck.add(v); qCheck.push(v); } }); }
        if(visitedCheck.size < numNodes){
             console.log("Graph not connected, adding edges..."); let lastVisited = 0; qCheck.forEach(n => lastVisited = n);
             for(let i = 0; i < numNodes; i++){ if(!visitedCheck.has(i)){ const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight; adj[lastVisited].push({node: i, weight: weight}); adj[i].push({node: lastVisited, weight: weight}); console.log(`Connecting ${lastVisited} to ${i} with weight ${weight}`); const qCheck2 = [i]; visitedCheck.add(i); let head2 = 0; while(head2 < qCheck2.length){ const u2 = qCheck2[head2++]; (adj[u2] || []).forEach(neighborData => { const v2 = neighborData.node; if(!visitedCheck.has(v2)){ visitedCheck.add(v2); qCheck2.push(v2); } }); } lastVisited = i; } }
        }
        // --- End Graph Generation ---


        // --- 2. Setup SVG Container ---
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const containerWidth = extraVisualizationArea.clientWidth || 600;
        const containerHeight = 400;
        svgContainer.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
        svgContainer.setAttribute("width", "100%"); svgContainer.setAttribute("height", containerHeight);
        svgContainer.id = "graph-svg-container"; extraVisualizationArea.appendChild(svgContainer);

        // --- 3. Calculate Node Positions (Circular Layout) ---
        const radius = containerHeight * 0.4; const centerX = containerWidth / 2; const centerY = containerHeight / 2;
        nodes.forEach((node, index) => { const angle = (index / numNodes) * 2 * Math.PI; node.x = centerX + radius * Math.cos(angle); node.y = centerY + radius * Math.sin(angle); });

        // --- 4. Create SVG Elements ---
        const nodeRadius = 18; // Slightly larger for distance text
        const svgElements = { nodes: {}, edges: {} }; const createdEdges = new Set();
        // Edges & Weights
        for (let u = 0; u < numNodes; u++) {
            (adj[u] || []).forEach(neighborData => {
                const v = neighborData.node; const weight = neighborData.weight;
                const edgeId = `${Math.min(u, v)}-${Math.max(u, v)}`;
                if (!createdEdges.has(edgeId)) {
                    const edgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); // Group for line and text
                    edgeGroup.id = `edge-${edgeId}`;
                    edgeGroup.setAttribute("class", "graph-edge-group");

                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", nodes[u].x); line.setAttribute("y1", nodes[u].y);
                    line.setAttribute("x2", nodes[v].x); line.setAttribute("y2", nodes[v].y);
                    line.setAttribute("class", "graph-edge");
                    edgeGroup.appendChild(line);

                    // Calculate midpoint for weight text
                    const midX = (nodes[u].x + nodes[v].x) / 2;
                    const midY = (nodes[u].y + nodes[v].y) / 2;
                    // Add small offset perpendicular to the edge for clarity
                    const angle = Math.atan2(nodes[v].y - nodes[u].y, nodes[v].x - nodes[u].x);
                    const offsetX = 8 * Math.sin(angle); // Adjust offset distance as needed
                    const offsetY = -8 * Math.cos(angle);

                    const weightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    weightText.setAttribute("x", midX + offsetX);
                    weightText.setAttribute("y", midY + offsetY);
                    weightText.setAttribute("text-anchor", "middle");
                    weightText.setAttribute("dy", ".3em");
                    weightText.setAttribute("class", "graph-edge-weight");
                    weightText.textContent = weight;
                    edgeGroup.appendChild(weightText);

                    svgContainer.appendChild(edgeGroup);
                    svgElements.edges[edgeId] = edgeGroup; // Store the group
                    createdEdges.add(edgeId);
                }
            });
        }
        // Nodes & Distance Labels
        nodes.forEach(node => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
            group.id = `node-${node.id}`;

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", nodeRadius); circle.setAttribute("class", "graph-node");
            group.appendChild(circle);

            const idText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            idText.setAttribute("text-anchor", "middle");
            idText.setAttribute("dy", "-0.2em"); // Position ID text slightly above center
            idText.setAttribute("class", "graph-node-label");
            idText.textContent = node.id;
            group.appendChild(idText);

            // Add text element for distance, initially '∞'
            const distText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            distText.setAttribute("text-anchor", "middle");
            distText.setAttribute("dy", "1.0em"); // Position distance text below center
            distText.setAttribute("class", "graph-node-distance");
            distText.textContent = "∞"; // Infinity symbol
            distText.id = `dist-${node.id}`;
            group.appendChild(distText);

            svgContainer.appendChild(group);
            svgElements.nodes[node.id] = group;
        });

        // --- 5. Add Priority Queue and Distance Table Display ---
         const displayContainer = document.createElement('div');
         displayContainer.className = 'flex flex-col lg:flex-row gap-4 mt-4'; // Responsive layout

         const pqContainer = document.createElement('div');
         pqContainer.id = 'dijkstra-pq-container';
         pqContainer.className = 'dijkstra-pq-container'; // New class
         pqContainer.innerHTML = '<span>Priority Queue:</span>';
         displayContainer.appendChild(pqContainer);

         const distTableContainer = document.createElement('div');
         distTableContainer.id = 'dijkstra-dist-table';
         distTableContainer.className = 'dijkstra-dist-table'; // New class
         distTableContainer.innerHTML = '<span>Distances:</span>';
         displayContainer.appendChild(distTableContainer);

         extraVisualizationArea.appendChild(displayContainer);

        // --- 6. Generate Dijkstra Steps ---
        let steps = [];
        let nodeStates = {}; // 'initial', 'processing', 'visited'
        let edgeStates = {}; // 'idle', 'checking', 'path' (edge part of shortest path found so far)
        let currentDistances = {};
        let currentPrevious = {};

        Object.keys(svgElements.nodes).forEach(id => {
            nodeStates[id] = 'initial';
            currentDistances[id] = Infinity;
            currentPrevious[id] = null;
        });
        Object.keys(svgElements.edges).forEach(id => edgeStates[id] = 'idle');

        const startNode = 0;
        currentDistances[startNode] = 0;

        // Simple Priority Queue Simulation for Visualization
        class VisPriorityQueue {
            constructor() { this.items = []; } // { element, priority }
            enqueue(element, priority) {
                // Remove existing entry if present (important for updates)
                this.items = this.items.filter(item => item.element !== element);
                this.items.push({ element, priority });
                this.sort();
            }
            dequeue() { return this.items.shift(); } // Still O(N) dequeue
            isEmpty() { return this.items.length === 0; }
            sort() { this.items.sort((a, b) => a.priority - b.priority); }
            getSnapshot() { return this.items.map(item => `${item.element}(${item.priority === Infinity ? '∞' : item.priority})`); }
        }
        const pq = new VisPriorityQueue();

        steps.push({
            type: 'start',
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            distances: { ...currentDistances }, pqState: pq.getSnapshot(),
            message: `Starting Dijkstra from node ${startNode}. Initialize distances.`
        });

        pq.enqueue(startNode, 0);
        steps.push({
            type: 'pq-add', nodeId: startNode, distance: 0,
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            distances: { ...currentDistances }, pqState: pq.getSnapshot(),
            message: `Add node ${startNode} to Priority Queue with distance 0.`
        });

        const dijkstraVisited = new Set();

        while (!pq.isEmpty()) {
            const { element: u, priority: distU } = pq.dequeue();

            steps.push({
                type: 'extract-min', nodeId: u, distance: distU,
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                distances: { ...currentDistances }, pqState: pq.getSnapshot(), // Show PQ *after* extraction
                message: `Extract node ${u} with distance ${distU} from PQ.`
            });

            if (dijkstraVisited.has(u) || distU > currentDistances[u]) {
                 steps.push({
                    type: 'skip-node', nodeId: u,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    distances: { ...currentDistances }, pqState: pq.getSnapshot(),
                    message: `Skipping node ${u} (already visited / longer path).`
                });
                continue;
            }

            dijkstraVisited.add(u);
            nodeStates[u] = 'visited'; // Mark as visited (finalized)

             // Update previous edge state if applicable
             if(currentPrevious[u] !== null) {
                 const prevNode = currentPrevious[u];
                 const pathEdgeId = `edge-${Math.min(u, prevNode)}-${Math.max(u, prevNode)}`;
                 if(edgeStates[pathEdgeId] === 'checking') { // Only mark as path if it was the checking edge
                      edgeStates[pathEdgeId] = 'path';
                 }
             }


            steps.push({
                type: 'mark-visited', nodeId: u,
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                distances: { ...currentDistances }, pqState: pq.getSnapshot(),
                message: `Mark node ${u} as visited. Shortest distance finalized: ${distU}.`
            });


            const neighbors = adj[u] || [];
            for (const neighborData of neighbors) {
                const v = neighborData.node;
                const weight = neighborData.weight;
                const edgeId = `edge-${Math.min(u, v)}-${Math.max(u, v)}`;

                if (!dijkstraVisited.has(v)) {
                    edgeStates[edgeId] = 'checking';
                    steps.push({
                        type: 'check-neighbor', u: u, v: v, weight: weight, edgeId: edgeId,
                        nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                        distances: { ...currentDistances }, pqState: pq.getSnapshot(),
                        message: `Checking neighbor ${v} from ${u} (edge weight ${weight}).`
                    });

                    const distanceThroughU = currentDistances[u] + weight;

                    if (distanceThroughU < currentDistances[v]) {
                         const oldDist = currentDistances[v];
                        currentDistances[v] = distanceThroughU;
                        currentPrevious[v] = u;
                        pq.enqueue(v, distanceThroughU);
                        // Highlight the node being updated
                        nodeStates[v] = 'processing'; // Temporarily highlight updated node

                        steps.push({
                            type: 'relax-edge', u: u, v: v, newDist: distanceThroughU, oldDist: oldDist, edgeId: edgeId,
                            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                            distances: { ...currentDistances }, pqState: pq.getSnapshot(),
                            message: `Relax edge (${u}-${v}): Update dist(${v}) to ${distanceThroughU} (was ${oldDist === Infinity ? '∞' : oldDist}). Update PQ.`
                        });
                        // Reset highlight after showing update
                         nodeStates[v] = 'initial'; // Or keep 'processing' until extracted? Let's reset.
                    } else {
                         steps.push({
                            type: 'no-relax', u: u, v: v, currentDist: currentDistances[v], pathDist: distanceThroughU, edgeId: edgeId,
                            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                            distances: { ...currentDistances }, pqState: pq.getSnapshot(),
                            message: `No relaxation needed for ${v} via ${u} (${distanceThroughU} >= ${currentDistances[v] === Infinity ? '∞' : currentDistances[v]}).`
                        });
                    }
                     edgeStates[edgeId] = 'idle'; // Reset edge state after check
                }
            }
              // Optional: Step indicating finished exploring neighbors of u
              steps.push({
                 type: 'finish-explore', nodeId: u,
                 nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                 distances: { ...currentDistances }, pqState: pq.getSnapshot(),
                 message: `Finished exploring neighbors of ${u}.`
             });
        }

        // Final step - highlight final paths
         Object.keys(edgeStates).forEach(id => edgeStates[id] = 'idle'); // Reset all edges
         for(const node in currentPrevious){
             const prev = currentPrevious[node];
             if(prev !== null){
                 const pathEdgeId = `edge-${Math.min(node, prev)}-${Math.max(node, prev)}`;
                 edgeStates[pathEdgeId] = 'path';
             }
         }
         Object.keys(nodeStates).forEach(id => { // Ensure all reachable nodes are marked visited
             if(currentDistances[id] !== Infinity) nodeStates[id] = 'visited';
         });

        steps.push({
            type: 'finish',
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            distances: { ...currentDistances }, pqState: [],
            message: `Dijkstra Complete. Final distances calculated.`
        });

        return { steps, elements: svgElements };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.nodes || !elements.edges || !step.nodeStates || !step.edgeStates || !step.distances) {
            console.error("Dijkstra RenderStep: Missing data", step);
            return;
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
            circle.classList.remove('initial', 'processing', 'visited'); // Reset states
            if (state === 'processing') { // Highlight node being updated/relaxed
                circle.classList.add('processing');
            } else if (state === 'visited') { // Node finalized
                circle.classList.add('visited');
            } else if (state === 'initial') { // Node not yet finalized
                circle.classList.add('initial');
            }
             // Specific highlight for the node just extracted
             if (step.type === 'extract-min' && nodeId == step.nodeId) {
                 circle.classList.remove('initial');
                 circle.classList.add('processing'); // Highlight extracted node
             }
        });

        // Apply edge states
        Object.keys(elements.edges).forEach(edgeId => {
             const edgeGroup = elements.edges[edgeId];
             const line = edgeGroup.querySelector('line');
             if (!line) return;
             const state = step.edgeStates[edgeId];

             line.classList.remove('checking', 'path'); // Reset specific states
             if (state === 'checking') {
                 line.classList.add('checking'); // Use 'checking' style
             } else if (state === 'path') {
                 line.classList.add('path'); // Use 'path' style
             }
         });

         // Update Priority Queue Display
         const pqContainer = document.getElementById('dijkstra-pq-container');
         if (pqContainer) {
             pqContainer.innerHTML = '<span>Priority Queue:</span>'; // Clear previous
             if (step.pqState && Array.isArray(step.pqState)) {
                 step.pqState.forEach(itemString => {
                     const span = document.createElement('span');
                     span.className = 'pq-item'; // New class for styling
                     span.textContent = itemString; // e.g., "3(5)"
                     pqContainer.appendChild(span);
                 });
             }
         }

         // Update Distances Table Display (Optional but helpful)
         const distTableContainer = document.getElementById('dijkstra-dist-table');
         if (distTableContainer) {
             distTableContainer.innerHTML = '<span>Distances:</span>'; // Clear previous
             const table = document.createElement('div');
             table.className = 'dist-table-grid'; // Class for grid layout
             Object.keys(step.distances).sort((a,b) => a-b).forEach(nodeId => {
                 const dist = step.distances[nodeId];
                 const cell = document.createElement('span');
                 cell.className = 'dist-table-cell';
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
}; // End of dijkstraConfig
