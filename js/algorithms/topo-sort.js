// js/algorithms/topo-sort.js

const topoSortConfig = {
    name: 'Topological Sorting (Kahn\'s)',
    type: 'graph', // Use graph type
    code: `<span class="code-keyword">function</span> <span class="code-function">topologicalSort</span>(graph, numNodes) {
  <span class="code-keyword">const</span> inDegree = <span class="code-keyword">new</span> <span class="code-function">Array</span>(numNodes).<span class="code-function">fill</span>(<span class="code-number">0</span>);
  <span class="code-keyword">const</span> adj = <span class="code-keyword">new</span> <span class="code-function">Map</span>(); <span class="code-comment">// Build adjacency list representation if needed</span>

  <span class="code-comment">// 1. Calculate in-degrees and build adjacency list</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">const</span> u <span class="code-keyword">in</span> graph) {
    adj.<span class="code-function">set</span>(<span class="code-function">parseInt</span>(u), []);
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> edge <span class="code-keyword">of</span> graph[u]) { <span class="code-comment">// edge = { node: v, ... }</span>
      <span class="code-keyword">const</span> v = edge.node;
      inDegree[v]++;
      <span class="code-keyword">if</span> (!adj.<span class="code-function">has</span>(<span class="code-function">parseInt</span>(u))) adj.<span class="code-function">set</span>(<span class="code-function">parseInt</span>(u), []);
      adj.<span class="code-function">get</span>(<span class="code-function">parseInt</span>(u)).<span class="code-function">push</span>(v);
    }
  }
   <span class="code-comment">// Ensure all nodes are in adj map keys</span>
   <span class="code-keyword">for</span>(<span class="code-keyword">let</span> i=0; i<numNodes; ++i) { <span class="code-keyword">if</span>(!adj.<span class="code-function">has</span>(i)) adj.<span class="code-function">set</span>(i, []); }
  <span class="code-comment">// Visualize initial in-degrees</span>

  <span class="code-comment">// 2. Initialize queue with nodes having in-degree 0</span>
  <span class="code-keyword">const</span> queue = [];
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < numNodes; i++) {
    <span class="code-keyword">if</span> (inDegree[i] === <span class="code-number">0</span>) {
      queue.<span class="code-function">push</span>(i);
    }
  }
  <span class="code-comment">// Visualize initial queue</span>

  <span class="code-comment">// 3. Process the queue</span>
  <span class="code-keyword">const</span> result = [];
  <span class="code-keyword">while</span> (queue.length > <span class="code-number">0</span>) {
    <span class="code-keyword">const</span> u = queue.<span class="code-function">shift</span>(); <span class="code-comment">// Dequeue node</span>
    result.<span class="code-function">push</span>(u);
    <span class="code-comment">// Visualize dequeue and add to result</span>

    <span class="code-comment">// Decrease in-degree of neighbors</span>
    <span class="code-keyword">const</span> neighbors = adj.<span class="code-function">get</span>(u) || [];
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> v <span class="code-keyword">of</span> neighbors) {
      inDegree[v]--;
      <span class="code-comment">// Visualize edge processing and in-degree decrease</span>
      <span class="code-keyword">if</span> (inDegree[v] === <span class="code-number">0</span>) {
        queue.<span class="code-function">push</span>(v);
        <span class="code-comment">// Visualize adding node v to queue</span>
      }
    }
  }

  <span class="code-comment">// 4. Check for cycles</span>
  <span class="code-keyword">if</span> (result.length !== numNodes) {
    <span class="code-comment">// Visualize cycle detected</span>
    <span class="code-keyword">return</span> { error: <span class="code-string">"Graph contains a cycle"</span> };
  }

  <span class="code-comment">// Visualize completion</span>
  <span class="code-keyword">return</span> { result };
}`,
    pseudocode: `TopologicalSort_Kahn(graph, numNodes):
  Create Array, inDegree[0..numNodes-1], initialized to 0
  Create Map, adjList // Adjacency list representation

  // 1. Compute In-degrees and Build Adjacency List
  for each node u in graph:
    for each edge (u -> v) in graph:
      inDegree[v] = inDegree[v] + 1
      Add v to adjList[u]
  // Visualize: Show initial in-degrees on nodes

  // 2. Initialize Queue
  Create Queue, Q
  for i = 0 to numNodes - 1:
    if inDegree[i] == 0:
      Q.enqueue(i)
  // Visualize: Add nodes with in-degree 0 to queue

  // 3. Process Queue
  Create List, sortedResult
  countVisitedNodes = 0
  while Q is not empty:
    u = Q.dequeue()
    // Visualize: Dequeue u (state: processing)
    Add u to sortedResult
    countVisitedNodes = countVisitedNodes + 1
    // Visualize: Add u to result list (state: sorted)

    // Process neighbors
    for each neighbor v in adjList[u]:
      // Visualize: Process edge (u -> v)
      inDegree[v] = inDegree[v] - 1
      // Visualize: Update inDegree[v] on node v
      if inDegree[v] == 0:
        Q.enqueue(v)
        // Visualize: Add v to queue (state: in-queue)

  // 4. Check for Cycles
  if countVisitedNodes != numNodes:
    // Visualize: Indicate cycle detected
    return Error("Graph contains a cycle")
  else:
    // Visualize: Algorithm complete
    return sortedResult`,

    setup: function(data) { // Data ignored
        console.log("Running Topological Sort setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = '';
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        const numNodes = 8; // Keep it manageable
        const edgeProbability = 0.35; // Control edge density

        // --- 1. Generate Random Directed Acyclic Graph (DAG) ---
        const adj = {}; // Stores outgoing neighbors: { u: [v1, v2,...], ... }
        const nodes = []; // Stores node objects { id, x, y }
        const edges = []; // Stores edge objects { u, v, id }
        const inDegree = new Array(numNodes).fill(0);

        for (let i = 0; i < numNodes; i++) {
            adj[i] = [];
            nodes.push({ id: i, x: 0, y: 0 });
        }
        let edgeCounter = 0;
        // Create edges only from lower index to higher index to guarantee acyclicity
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.random() < edgeProbability) {
                    const edgeId = `edge-${i}-${j}-${edgeCounter++}`;
                    adj[i].push(j); // Add neighbor
                    edges.push({ u: i, v: j, id: edgeId });
                    inDegree[j]++; // Increment in-degree of target node
                }
            }
        }
        // --- End Graph Generation ---

        // --- 2. Setup SVG Container ---
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const containerWidth = extraVisualizationArea.clientWidth || 600;
        const graphHeight = 350;
        svgContainer.setAttribute("viewBox", `0 0 ${containerWidth} ${graphHeight}`);
        svgContainer.setAttribute("width", "100%"); svgContainer.setAttribute("height", graphHeight);
        svgContainer.id = "graph-svg-container"; extraVisualizationArea.appendChild(svgContainer);
        // Arrowhead Definition
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"); const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker"); marker.setAttribute("id", "arrowhead"); marker.setAttribute("markerWidth", "10"); marker.setAttribute("markerHeight", "7"); marker.setAttribute("refX", "9"); marker.setAttribute("refY", "3.5"); marker.setAttribute("orient", "auto"); const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon"); polygon.setAttribute("points", "0 0, 10 3.5, 0 7"); polygon.setAttribute("class", "graph-arrowhead"); marker.appendChild(polygon); defs.appendChild(marker); svgContainer.appendChild(defs);

        // --- 3. Calculate Node Positions (Simple Linear/Layered Attempt) ---
        // Basic layering: position based on index (crude topological approximation)
        const layerWidth = containerWidth * 0.8;
        const layerHeight = graphHeight * 0.8;
        const xPadding = containerWidth * 0.1;
        const yPadding = graphHeight * 0.1;
        nodes.forEach((node, index) => {
            // Spread nodes horizontally, could use topological sort result for better layering
            node.x = xPadding + (index / (numNodes -1 || 1)) * layerWidth;
            // Add some vertical jitter or place based on level in a BFS/DFS if needed
            node.y = yPadding + Math.random() * layerHeight; // Random y for now
        });
        // --- End Node Position Calculation ---


        // --- 4. Create SVG Elements ---
        const nodeRadius = 18; // Slightly larger for in-degree
        const svgElements = { nodes: {}, edges: {} };
        // Edges
        edges.forEach(edge => {
            const u = edge.u; const v = edge.v; const edgeId = edge.id;
            const edgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); edgeGroup.id = edgeId; edgeGroup.setAttribute("class", "graph-edge-group");
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const angle = Math.atan2(nodes[v].y - nodes[u].y, nodes[v].x - nodes[u].x);
            const startX = nodes[u].x; const startY = nodes[u].y;
            const endX = nodes[v].x - nodeRadius * 1.0 * Math.cos(angle); const endY = nodes[v].y - nodeRadius * 1.0 * Math.sin(angle);
            line.setAttribute("x1", startX); line.setAttribute("y1", startY); line.setAttribute("x2", endX); line.setAttribute("y2", endY);
            line.setAttribute("class", "graph-edge directed"); line.setAttribute("marker-end", "url(#arrowhead)"); edgeGroup.appendChild(line);
            svgContainer.appendChild(edgeGroup); svgElements.edges[edgeId] = edgeGroup;
        });
        // Nodes (with In-Degree display)
        nodes.forEach(node => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g"); group.setAttribute("transform", `translate(${node.x}, ${node.y})`); group.id = `node-${node.id}`;
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); circle.setAttribute("r", nodeRadius); circle.setAttribute("class", "graph-node"); group.appendChild(circle);
            // In-Degree Text
            const inDegreeText = document.createElementNS("http://www.w3.org/2000/svg", "text"); inDegreeText.setAttribute("text-anchor", "middle"); inDegreeText.setAttribute("dy", "-0.6em"); // Position above center
            inDegreeText.setAttribute("class", "graph-node-indegree"); inDegreeText.id = `indegree-${node.id}`; inDegreeText.textContent = `in:${inDegree[node.id]}`; group.appendChild(inDegreeText);
            // Node ID Text
            const idText = document.createElementNS("http://www.w3.org/2000/svg", "text"); idText.setAttribute("text-anchor", "middle"); idText.setAttribute("dy", "0.5em"); // Position below center
            idText.setAttribute("class", "graph-node-label"); idText.textContent = node.id; group.appendChild(idText);
            svgContainer.appendChild(group); svgElements.nodes[node.id] = group;
        });

        // --- 5. Setup Queue and Result Display ---
        const displayContainer = document.createElement('div'); displayContainer.className = 'flex flex-col sm:flex-row gap-4 mt-4';
        const queueContainer = document.createElement('div'); queueContainer.id = 'topo-queue-container'; queueContainer.className = 'topo-queue-container';
        queueContainer.innerHTML = '<span>Queue (In-Degree 0):</span>'; displayContainer.appendChild(queueContainer);
        const resultContainer = document.createElement('div'); resultContainer.id = 'topo-result-container'; resultContainer.className = 'topo-result-container';
        resultContainer.innerHTML = '<span>Sorted Result:</span>'; displayContainer.appendChild(resultContainer);
        extraVisualizationArea.appendChild(displayContainer);

        // --- 6. Generate Topological Sort Steps (Kahn's) ---
        let steps = [];
        let currentInDegree = [...inDegree]; // Copy initial in-degrees
        let nodeStates = {}; // 'initial', 'in-queue', 'processing', 'sorted', 'cycle'
        let edgeStates = {}; // 'idle', 'processing'

        nodes.forEach(node => nodeStates[node.id] = 'initial');
        edges.forEach(edge => edgeStates[edge.id] = 'idle');

        steps.push({
            type: 'init',
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            inDegrees: [...currentInDegree], queue: [], result: [],
            message: 'Calculated initial in-degrees.'
        });

        const queue = [];
        for (let i = 0; i < numNodes; i++) {
            if (currentInDegree[i] === 0) {
                queue.push(i);
                nodeStates[i] = 'in-queue'; // Mark as in queue
            }
        }

        steps.push({
            type: 'init-queue',
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            inDegrees: [...currentInDegree], queue: [...queue], result: [],
            message: `Initialized queue with nodes having in-degree 0: [${queue.join(', ')}]`
        });

        const result = [];
        let countVisitedNodes = 0;

        while (queue.length > 0) {
            const u = queue.shift();
            nodeStates[u] = 'processing'; // Mark as processing
            steps.push({
                type: 'dequeue', u: u,
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                inDegrees: [...currentInDegree], queue: [...queue], result: [...result],
                message: `Dequeue node ${u}.`
            });

            result.push(u);
            countVisitedNodes++;
            nodeStates[u] = 'sorted'; // Mark as sorted after processing neighbors
            // Add step to show adding to result *before* processing neighbors
            steps.push({
                type: 'add-to-result', u: u,
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                inDegrees: [...currentInDegree], queue: [...queue], result: [...result],
                message: `Add node ${u} to sorted result: [${result.join(', ')}]`
            });


            const neighbors = adj[u] || [];
            for (const v of neighbors) {
                const edge = edges.find(e => e.u === u && e.v === v); // Find edge object
                const edgeId = edge?.id;
                if (edgeId) edgeStates[edgeId] = 'processing'; // Highlight edge

                steps.push({
                    type: 'process-neighbor', u: u, v: v, edgeId: edgeId,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    inDegrees: [...currentInDegree], queue: [...queue], result: [...result],
                    message: `Processing edge (${u} -> ${v}). Decreasing in-degree of ${v}.`
                });

                currentInDegree[v]--;
                // Update in-degree step
                steps.push({
                    type: 'update-indegree', u: u, v: v, edgeId: edgeId,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    inDegrees: [...currentInDegree], queue: [...queue], result: [...result],
                    message: `In-degree of ${v} is now ${currentInDegree[v]}.`
                });


                if (currentInDegree[v] === 0) {
                    queue.push(v);
                    nodeStates[v] = 'in-queue'; // Mark neighbor as in queue
                    steps.push({
                        type: 'enqueue-neighbor', u: u, v: v, edgeId: edgeId,
                        nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                        inDegrees: [...currentInDegree], queue: [...queue], result: [...result],
                        message: `In-degree of ${v} is 0. Add ${v} to queue.`
                    });
                }
                 if (edgeId) edgeStates[edgeId] = 'idle'; // De-highlight edge after processing
            }
             // Optional: Step indicating finished processing node u's neighbors
             steps.push({
                 type: 'finish-node', u: u,
                 nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                 inDegrees: [...currentInDegree], queue: [...queue], result: [...result],
                 message: `Finished processing neighbors of node ${u}.`
             });
        }

        // Check for cycles
        if (countVisitedNodes !== numNodes) {
            // Mark remaining nodes as part of cycle (simplified)
            for(let i=0; i<numNodes; ++i) {
                if(nodeStates[i] !== 'sorted') nodeStates[i] = 'cycle';
            }
            steps.push({
                type: 'cycle-detected',
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                inDegrees: [...currentInDegree], queue: [], result: [...result],
                message: `Cycle detected! Visited ${countVisitedNodes}/${numNodes} nodes.`
            });
        } else {
             steps.push({
                type: 'finish',
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                inDegrees: [...currentInDegree], queue: [], result: [...result],
                message: `Topological Sort Complete: [${result.join(', ')}]`
            });
        }

        console.log("Topological Sort setup complete. Steps generated:", steps.length);
        return { steps, elements: { graph: svgElements }, numNodes: numNodes };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.graph || !step.nodeStates || !step.edgeStates || !step.inDegrees || !animationState) {
            console.error("Topo Sort RenderStep: Missing data", { step, elements, animationState });
            return;
        }
        const graphElements = elements.graph;
        const numNodes = animationState.numNodes;

        // --- Render Graph ---
        // Apply node states and update in-degree text
        Object.keys(graphElements.nodes).forEach(nodeId => {
            const nodeGroup = graphElements.nodes[nodeId];
            const circle = nodeGroup.querySelector('circle');
            const inDegreeText = nodeGroup.querySelector('.graph-node-indegree'); // Get the text element
            if (!circle || !inDegreeText) return;

            const state = step.nodeStates[nodeId];
            const inDegreeVal = step.inDegrees[nodeId];

            // Update in-degree text
            inDegreeText.textContent = `in:${inDegreeVal}`;
            // Reset highlight from previous step
            inDegreeText.classList.remove('indegree-updated');
            // Apply highlight if this node's in-degree was just updated
            if (step.type === 'update-indegree' && nodeId == step.v) { // Use == for potential string/number comparison
                inDegreeText.classList.add('indegree-updated');
            }


            // Apply node style
            circle.classList.remove('initial', 'in-queue', 'processing', 'sorted', 'cycle'); // Reset states
            if (state === 'in-queue') circle.classList.add('in-queue');
            else if (state === 'processing') circle.classList.add('processing');
            else if (state === 'sorted') circle.classList.add('sorted');
            else if (state === 'cycle') circle.classList.add('cycle');
            else circle.classList.add('initial');
        });
        // Apply edge states
        Object.keys(graphElements.edges).forEach(edgeId => {
            const edgeGroup = graphElements.edges[edgeId];
            const line = edgeGroup.querySelector('line');
            if (!line) return;
            const state = step.edgeStates[edgeId];

            line.classList.remove('idle', 'processing'); // Reset states
            if (state === 'processing') line.classList.add('processing');
            else line.classList.add('idle');
        });

        // --- Update Queue Display ---
        const queueContainer = document.getElementById('topo-queue-container');
        if (queueContainer) {
            // Keep the label, clear previous items
            const label = queueContainer.querySelector('span:first-child');
            queueContainer.innerHTML = ''; // Clear all
            if (label) queueContainer.appendChild(label); // Re-add label

            if (step.queue && Array.isArray(step.queue)) {
                step.queue.forEach(nodeId => {
                    const item = document.createElement('span'); // Use span or div
                    item.className = 'topo-queue-item topo-vis-item'; // Add common class
                    item.textContent = nodeId;
                    // Optionally add animation for adding/removing items later
                    queueContainer.appendChild(item);
                });
            }
        }

        // --- Update Result Display ---
        const resultContainer = document.getElementById('topo-result-container');
        if (resultContainer) {
            // Keep the label, clear previous items
            const label = resultContainer.querySelector('span:first-child');
            resultContainer.innerHTML = ''; // Clear all
            if (label) resultContainer.appendChild(label); // Re-add label

            if (step.result && Array.isArray(step.result)) {
                step.result.forEach(nodeId => {
                    const item = document.createElement('span'); // Use span or div
                    item.className = 'topo-result-item topo-vis-item'; // Add common class
                    item.textContent = nodeId;
                     // Highlight the most recently added item
                     if (step.type === 'add-to-result' && nodeId == step.u) {
                         item.classList.add('newly-added');
                     }
                    resultContainer.appendChild(item);
                });
            }
        }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    }
}; // End of topoSortConfig
