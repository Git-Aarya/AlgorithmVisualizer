// js/algorithms/graph-dfs.js

const graphDfsConfig = {
    name: 'DFS (Graphs)',
    type: 'graph', // Use graph type
    code: `<span class="code-keyword">function</span> <span class="code-function">dfs</span>(graph, startNode) {
  <span class="code-keyword">const</span> visited = <span class="code-keyword">new</span> <span class="code-function">Set</span>(); <span class="code-comment">// Track visited nodes</span>
  <span class="code-keyword">const</span> result = [];      <span class="code-comment">// Store DFS traversal order (pre-order)</span>

  <span class="code-function">dfsRecursive</span>(graph, startNode, visited, result);

  <span class="code-keyword">return</span> result;
}

<span class="code-keyword">function</span> <span class="code-function">dfsRecursive</span>(graph, node, visited, result) {
  <span class="code-keyword">if</span> (!node || !graph[node] || visited.<span class="code-function">has</span>(node)) {
    <span class="code-keyword">return</span>; <span class="code-comment">// Base case or already visited</span>
  }

  visited.<span class="code-function">add</span>(node); <span class="code-comment">// Mark as visited</span>
  result.<span class="code-function">push</span>(node); <span class="code-comment">// Process node (add to result - pre-order)</span>
  <span class="code-comment">// Visualize: Mark node as visiting/processing</span>

  <span class="code-keyword">const</span> neighbors = graph[node] || [];
  <span class="code-keyword">for</span> (<span class="code-keyword">const</span> neighbor <span class="code-keyword">of</span> neighbors) {
    <span class="code-comment">// Visualize: Check edge/neighbor</span>
    <span class="code-keyword">if</span> (!visited.<span class="code-function">has</span>(neighbor)) {
      <span class="code-comment">// Visualize: Recursive call to unvisited neighbor</span>
      <span class="code-function">dfsRecursive</span>(graph, neighbor, visited, result);
      <span class="code-comment">// Visualize: Return from recursive call</span>
    }
    <span class="code-comment">// Visualize: Neighbor already visited or finished check</span>
  }
  <span class="code-comment">// Visualize: Mark node as fully visited (finished exploring)</span>
}`,
    pseudocode: `DFS(graph, startNode):
  Create a Set, visited
  Create a List, result

  // Call the recursive helper function
  DFS_Recursive(graph, startNode, visited, result)
  return result

DFS_Recursive(graph, node, visited, result):
  // Base case: If node is null, not in graph, or already visited, return
  if node is null or node not in graph or node is in visited:
    // Visualize: Backtrack or skip if already visited
    return

  // Mark node as visited and process it (pre-order)
  Add node to visited
  Add node to result
  // Visualize: Mark node as visiting/processing, update result

  // Explore neighbors
  for each neighbor in graph[node]:
    // Visualize: Check edge (node -> neighbor)
    if neighbor is not in visited:
      // Visualize: Go deeper (recursive call)
      DFS_Recursive(graph, neighbor, visited, result)
      // Visualize: Return from recursive call (backtrack along edge)
    // else: Visualize: Neighbor already visited, skip

  // Visualize: Mark node as finished exploring (state: visited)
`,

    setup: function(data) { // Data ignored, generate graph
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = ''; // Clear previous content
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        const numNodes = 10;
        const edgeProbability = 0.3;

        // --- 1. Generate Random Graph (Adjacency List) ---
        //    (Using the same logic as graph-bfs.js for consistency)
        const adj = {};
        const nodes = [];
        for (let i = 0; i < numNodes; i++) {
            adj[i] = [];
            nodes.push({ id: i, x: 0, y: 0 });
        }
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.random() < edgeProbability) {
                    adj[i].push(j);
                    adj[j].push(i);
                }
            }
        }
        // Connectivity Check (same as BFS)
        const visitedCheck = new Set();
        const qCheck = [0];
        visitedCheck.add(0);
        let head = 0;
        while(head < qCheck.length){
            const u = qCheck[head++];
            (adj[u] || []).forEach(v => {
                if(!visitedCheck.has(v)){
                    visitedCheck.add(v);
                    qCheck.push(v);
                }
            });
        }
        if(visitedCheck.size < numNodes){
             console.log("Graph not connected, adding edges...");
             let lastVisited = 0;
             qCheck.forEach(n => lastVisited = n);
             for(let i = 0; i < numNodes; i++){
                 if(!visitedCheck.has(i)){
                     adj[lastVisited].push(i);
                     adj[i].push(lastVisited);
                     console.log(`Connecting ${lastVisited} to ${i}`);
                      const qCheck2 = [i]; visitedCheck.add(i); let head2 = 0;
                      while(head2 < qCheck2.length){ const u2 = qCheck2[head2++]; (adj[u2] || []).forEach(v2 => { if(!visitedCheck.has(v2)){ visitedCheck.add(v2); qCheck2.push(v2); } }); }
                      lastVisited = i;
                 }
             }
        }
        // --- End Graph Generation ---


        // --- 2. Setup SVG Container ---
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const containerWidth = extraVisualizationArea.clientWidth || 600;
        const containerHeight = 400;
        svgContainer.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
        svgContainer.setAttribute("width", "100%");
        svgContainer.setAttribute("height", containerHeight);
        svgContainer.id = "graph-svg-container";
        extraVisualizationArea.appendChild(svgContainer);

        // --- 3. Calculate Node Positions (Circular Layout) ---
        const radius = containerHeight * 0.4;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        nodes.forEach((node, index) => {
            const angle = (index / numNodes) * 2 * Math.PI;
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
        });

        // --- 4. Create SVG Elements ---
        const nodeRadius = 15;
        const svgElements = { nodes: {}, edges: {} };
        const createdEdges = new Set();
        // Edges
        for (let u = 0; u < numNodes; u++) {
            (adj[u] || []).forEach(v => {
                const edgeId = `${Math.min(u, v)}-${Math.max(u, v)}`;
                if (!createdEdges.has(edgeId)) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", nodes[u].x); line.setAttribute("y1", nodes[u].y);
                    line.setAttribute("x2", nodes[v].x); line.setAttribute("y2", nodes[v].y);
                    line.setAttribute("class", "graph-edge"); line.id = `edge-${edgeId}`;
                    svgContainer.appendChild(line);
                    svgElements.edges[edgeId] = line; createdEdges.add(edgeId);
                }
            });
        }
        // Nodes
        nodes.forEach(node => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", nodeRadius); circle.setAttribute("class", "graph-node");
            circle.id = `node-${node.id}`; group.appendChild(circle);
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("text-anchor", "middle"); text.setAttribute("dy", ".3em");
            text.setAttribute("class", "graph-node-label"); text.textContent = node.id;
            group.appendChild(text); svgContainer.appendChild(group);
            svgElements.nodes[node.id] = group;
        });

        // --- 5. Add Result Display Area ---
         const resultContainer = document.createElement('div');
         resultContainer.id = 'graph-result-container'; // Reuse ID from BFS
         resultContainer.className = 'graph-result-container mt-4'; // Reuse class, add margin
         resultContainer.innerHTML = '<span>Result:</span>';
         extraVisualizationArea.appendChild(resultContainer);


        // --- 6. Generate DFS Steps ---
        let steps = [];
        let nodeStates = {}; // 'initial', 'visiting', 'visited'
        let edgeStates = {}; // 'idle', 'active', 'backtrack'
        Object.keys(svgElements.nodes).forEach(id => nodeStates[id] = 'initial');
        Object.keys(svgElements.edges).forEach(id => edgeStates[id] = 'idle');

        const startNode = 0;
        const dfsVisited = new Set();
        const dfsResult = []; // Pre-order result

        steps.push({
            type: 'start',
            nodeId: startNode,
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            resultState: [],
            message: `Starting DFS from node ${startNode}`
        });

        function dfsRecursiveStepGen(u, parentEdgeId = null) {
            if (dfsVisited.has(u)) {
                // Optional: Add a step indicating node was already visited
                // steps.push({ type: 'already-visited', nodeId: u, ... });
                return;
            }

            dfsVisited.add(u);
            nodeStates[u] = 'visiting'; // Mark as visiting when first encountered
            dfsResult.push(u);
            steps.push({
                type: 'visit',
                nodeId: u, parentEdgeId: parentEdgeId, // Edge used to reach this node
                nodeStates: { ...nodeStates },
                edgeStates: { ...edgeStates },
                resultState: [...dfsResult],
                message: `Visiting node ${u}. Result: [${dfsResult.join(', ')}]`
            });

            const neighbors = adj[u] || [];
            for (const v of neighbors) {
                const edgeId = `edge-${Math.min(u, v)}-${Math.max(u, v)}`;
                edgeStates[edgeId] = 'active'; // Highlight edge being checked
                steps.push({
                    type: 'check-neighbor',
                    u: u, v: v, edgeId: edgeId,
                    nodeStates: { ...nodeStates },
                    edgeStates: { ...edgeStates },
                    resultState: [...dfsResult],
                    message: `Checking neighbor ${v} from ${u}`
                });

                if (!dfsVisited.has(v)) {
                     // Recursive call visualization happens in the 'visit' step of the neighbor
                    dfsRecursiveStepGen(v, edgeId);
                    // After returning from recursion, mark edge for backtracking
                    edgeStates[edgeId] = 'backtrack';
                    steps.push({
                        type: 'backtrack',
                        u: u, v: v, edgeId: edgeId,
                        nodeStates: { ...nodeStates },
                        edgeStates: { ...edgeStates },
                        resultState: [...dfsResult],
                        message: `Returning from neighbor ${v} to ${u}`
                    });
                } else {
                    // Optional: Add step if neighbor already visited
                     steps.push({
                        type: 'neighbor-visited',
                        u: u, v: v, edgeId: edgeId,
                        nodeStates: { ...nodeStates },
                        edgeStates: { ...edgeStates }, // Keep edge active briefly
                        resultState: [...dfsResult],
                        message: `Neighbor ${v} already visited.`
                    });
                }
                 edgeStates[edgeId] = 'idle'; // Deactivate edge after check/backtrack
            }

            nodeStates[u] = 'visited'; // Mark as fully visited after exploring all neighbors
            steps.push({
                type: 'mark-visited',
                nodeId: u,
                nodeStates: { ...nodeStates },
                edgeStates: { ...edgeStates },
                resultState: [...dfsResult],
                message: `Finished exploring node ${u}`
            });
        }

        if (adj[startNode] !== undefined) {
            dfsRecursiveStepGen(startNode);
             // Handle disconnected components if necessary
             for(let i=0; i<numNodes; ++i){
                 if(!dfsVisited.has(i)){
                     steps.push({ type: 'start-component', nodeId: i, message: `Starting DFS on unvisited component from node ${i}` });
                     dfsRecursiveStepGen(i);
                 }
             }
        } else {
             steps.push({ type: 'error', message: `Start node ${startNode} not found in graph.` });
        }

        // Ensure final state is consistent
        Object.keys(nodeStates).forEach(id => nodeStates[id] = 'visited');
        Object.keys(edgeStates).forEach(id => edgeStates[id] = 'idle');

        steps.push({
            type: 'finish',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            resultState: [...dfsResult],
            message: `DFS Complete. Result: [${dfsResult.join(', ')}]`
        });

        return { steps, elements: svgElements };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.nodes || !elements.edges || !step.nodeStates || !step.edgeStates) {
            console.error("Graph DFS RenderStep: Missing data");
            return;
        }

        // Apply node states
        Object.keys(elements.nodes).forEach(nodeId => {
            const nodeGroup = elements.nodes[nodeId];
            const circle = nodeGroup.querySelector('circle');
            if (!circle) return;
            const state = step.nodeStates[nodeId];

            circle.classList.remove('initial', 'visiting', 'visited', 'processing'); // Reset states
             // Add 'processing' as the active visiting state for DFS
             if (state === 'visiting') {
                 circle.classList.add('processing'); // Reuse processing style for active DFS visit
             } else if (state === 'visited') {
                 circle.classList.add('visited');
             } else if (state === 'initial') {
                 circle.classList.add('initial');
             }
        });

        // Apply edge states
        Object.keys(elements.edges).forEach(edgeId => {
             const edgeEl = elements.edges[edgeId];
             const state = step.edgeStates[edgeId];
             edgeEl.classList.remove('active', 'backtrack'); // Reset edge states
             if (state === 'active') {
                 edgeEl.classList.add('active');
             } else if (state === 'backtrack') {
                 edgeEl.classList.add('backtrack'); // Add style for backtracking edge
             }
         });

         // Highlight the parent edge during visit step if available
         if (step.type === 'visit' && step.parentEdgeId && elements.edges[step.parentEdgeId]) {
             elements.edges[step.parentEdgeId].classList.add('active');
         }


         // Update Result Display
         const resultContainer = document.getElementById('graph-result-container');
         if (resultContainer) {
             resultContainer.innerHTML = '<span>Result:</span>'; // Clear previous
             if (step.resultState && Array.isArray(step.resultState)) {
                 step.resultState.forEach(nodeId => {
                     const span = document.createElement('span');
                     span.className = 'result-item'; // Reuse class from BFS
                     span.textContent = nodeId;
                     resultContainer.appendChild(span);
                 });
             }
         }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    } // End of renderStep
}; // End of graphDfsConfig
