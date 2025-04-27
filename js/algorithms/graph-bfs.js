// js/algorithms/graph-bfs.js

const graphBfsConfig = {
    name: 'BFS (Graphs)',
    type: 'graph', // New type for graph algorithms
    code: `<span class="code-keyword">function</span> <span class="code-function">bfs</span>(graph, startNode) {
  <span class="code-keyword">if</span> (!graph || !graph[startNode]) <span class="code-keyword">return</span> []; <span class="code-comment">// Handle missing graph/start node</span>

  <span class="code-keyword">const</span> queue = [startNode]; <span class="code-comment">// Initialize queue with start node</span>
  <span class="code-keyword">const</span> visited = <span class="code-keyword">new</span> <span class="code-function">Set</span>(); <span class="code-comment">// Keep track of visited nodes</span>
  <span class="code-keyword">const</span> result = [];      <span class="code-comment">// Stores the BFS traversal order</span>

  visited.<span class="code-function">add</span>(startNode);
  <span class="code-comment">// Visualize: Add start node to queue and mark as visited/queued</span>

  <span class="code-keyword">while</span> (queue.length > <span class="code-number">0</span>) {
    <span class="code-keyword">const</span> currentNode = queue.<span class="code-function">shift</span>(); <span class="code-comment">// Dequeue node</span>
    <span class="code-comment">// Visualize: Dequeue node</span>

    result.<span class="code-function">push</span>(currentNode); <span class="code-comment">// Process node</span>
    <span class="code-comment">// Visualize: Process node (add to result)</span>

    <span class="code-comment">// Explore neighbors</span>
    <span class="code-keyword">const</span> neighbors = graph[currentNode] || [];
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> neighbor <span class="code-keyword">of</span> neighbors) {
      <span class="code-comment">// Visualize: Check neighbor</span>
      <span class="code-keyword">if</span> (!visited.<span class="code-function">has</span>(neighbor)) {
        visited.<span class="code-function">add</span>(neighbor); <span class="code-comment">// Mark neighbor as visited</span>
        queue.<span class="code-function">push</span>(neighbor); <span class="code-comment">// Enqueue neighbor</span>
        <span class="code-comment">// Visualize: Add neighbor to queue and mark visited</span>
      }
    }
     <span class="code-comment">// Visualize: Mark current node as fully processed</span>
  }
  <span class="code-keyword">return</span> result;
}`,
    pseudocode: `BFS(graph, startNode):
  if startNode is not in graph: return empty list
  Create a Queue, Q
  Create a Set, visited
  Create a List, result

  Add startNode to Q
  Add startNode to visited
  // Visualize: Enqueue startNode (state: queued)

  while Q is not empty:
    currentNode = Q.dequeue()
    // Visualize: Dequeue currentNode (state: processing)

    Add currentNode to result
    // Visualize: Process currentNode (update result list)

    // Iterate through neighbors of currentNode
    for each neighbor in graph[currentNode]:
      // Visualize: Check edge (currentNode -> neighbor)
      if neighbor is not in visited:
        Add neighbor to visited
        Q.enqueue(neighbor)
        // Visualize: Enqueue neighbor (state: queued), Mark edge as traversed
      // else: Visualize: Neighbor already visited

    // Visualize: Mark currentNode as finished (state: visited)

  return result`,

    setup: function(data) { // Data is ignored, we generate a random graph
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = ''; // Clear previous content
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none'; // Hide bar area

        const numNodes = 10; // Adjust as needed
        const edgeProbability = 0.3; // Probability of an edge between two nodes

        // --- 1. Generate Random Graph (Adjacency List) ---
        const adj = {};
        const nodes = [];
        for (let i = 0; i < numNodes; i++) {
            adj[i] = [];
            nodes.push({ id: i, x: 0, y: 0 }); // Initial node data
        }

        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.random() < edgeProbability) {
                    adj[i].push(j);
                    adj[j].push(i); // Undirected graph
                }
            }
        }
        // Ensure graph is connected (simple approach: connect components if needed)
        // This is a basic check, more robust methods exist
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
            let lastVisited = 0; // From the visited component
             qCheck.forEach(n => lastVisited = n); // Get one node from the visited part
            for(let i = 0; i < numNodes; i++){
                if(!visitedCheck.has(i)){
                    // Connect the first unvisited node to the visited component
                    adj[lastVisited].push(i);
                    adj[i].push(lastVisited);
                    console.log(`Connecting ${lastVisited} to ${i}`);
                    // Run BFS again from the newly added node to find its component
                     const qCheck2 = [i];
                     visitedCheck.add(i);
                     let head2 = 0;
                     while(head2 < qCheck2.length){
                         const u2 = qCheck2[head2++];
                         (adj[u2] || []).forEach(v2 => {
                             if(!visitedCheck.has(v2)){
                                 visitedCheck.add(v2);
                                 qCheck2.push(v2);
                             }
                         });
                     }
                    lastVisited = i; // Update last visited for potential next component
                }
            }
        }


        // --- 2. Setup SVG Container ---
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const containerWidth = extraVisualizationArea.clientWidth || 600; // Get container width or default
        const containerHeight = 400; // Fixed height
        svgContainer.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
        svgContainer.setAttribute("width", "100%");
        svgContainer.setAttribute("height", containerHeight);
        svgContainer.id = "graph-svg-container";
        extraVisualizationArea.appendChild(svgContainer);

        // --- 3. Calculate Node Positions (Simple Circular Layout) ---
        const radius = containerHeight * 0.4;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        nodes.forEach((node, index) => {
            const angle = (index / numNodes) * 2 * Math.PI;
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
        });

        // --- 4. Create SVG Elements (Edges first, then Nodes) ---
        const nodeRadius = 15;
        const svgElements = { nodes: {}, edges: {} };

        // Create Edges
        const createdEdges = new Set(); // Avoid duplicate edge elements for u-v and v-u
        for (let u = 0; u < numNodes; u++) {
            (adj[u] || []).forEach(v => {
                const edgeId = `${Math.min(u, v)}-${Math.max(u, v)}`;
                if (!createdEdges.has(edgeId)) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", nodes[u].x);
                    line.setAttribute("y1", nodes[u].y);
                    line.setAttribute("x2", nodes[v].x);
                    line.setAttribute("y2", nodes[v].y);
                    line.setAttribute("class", "graph-edge"); // CSS class for styling
                    line.id = `edge-${edgeId}`;
                    svgContainer.appendChild(line);
                    svgElements.edges[edgeId] = line;
                    createdEdges.add(edgeId);
                }
            });
        }

        // Create Nodes (drawn on top of edges)
        nodes.forEach(node => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", `translate(${node.x}, ${node.y})`);

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", nodeRadius);
            circle.setAttribute("class", "graph-node"); // CSS class for styling
            circle.id = `node-${node.id}`;
            group.appendChild(circle);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dy", ".3em"); // Vertical alignment
            text.setAttribute("class", "graph-node-label");
            text.textContent = node.id;
            group.appendChild(text);

            svgContainer.appendChild(group);
            svgElements.nodes[node.id] = group; // Store the group element
        });

         // --- 5. Add Queue and Result Display Areas ---
         const displayContainer = document.createElement('div');
         displayContainer.className = 'flex flex-col sm:flex-row gap-4 mt-4'; // Layout for queue/result

         const queueContainer = document.createElement('div');
         queueContainer.id = 'graph-queue-container';
         queueContainer.className = 'graph-queue-container';
         queueContainer.innerHTML = '<span>Queue:</span>';
         displayContainer.appendChild(queueContainer);

         const resultContainer = document.createElement('div');
         resultContainer.id = 'graph-result-container';
         resultContainer.className = 'graph-result-container';
         resultContainer.innerHTML = '<span>Result:</span>';
         displayContainer.appendChild(resultContainer);

         extraVisualizationArea.appendChild(displayContainer);


        // --- 6. Generate BFS Steps ---
        let steps = [];
        let nodeStates = {}; // 'initial', 'queued', 'processing', 'visited'
        let edgeStates = {}; // 'idle', 'active'
        Object.keys(svgElements.nodes).forEach(id => nodeStates[id] = 'initial');
        Object.keys(svgElements.edges).forEach(id => edgeStates[id] = 'idle');

        const startNode = 0; // Start BFS from node 0
        const bfsQueue = [startNode];
        const bfsVisited = new Set();
        const bfsResult = [];

        steps.push({
            type: 'start',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            queueState: [],
            resultState: [],
            message: `Starting BFS from node ${startNode}`
        });

        if (adj[startNode] !== undefined) { // Check if start node exists in adj list
            bfsVisited.add(startNode);
            nodeStates[startNode] = 'queued';
            steps.push({
                type: 'enqueue',
                nodeId: startNode,
                nodeStates: { ...nodeStates },
                edgeStates: { ...edgeStates },
                queueState: [...bfsQueue],
                resultState: [...bfsResult],
                message: `Enqueue node ${startNode}`
            });

            while (bfsQueue.length > 0) {
                const u = bfsQueue.shift();
                nodeStates[u] = 'processing';
                steps.push({
                    type: 'dequeue',
                    nodeId: u,
                    nodeStates: { ...nodeStates },
                    edgeStates: { ...edgeStates },
                    queueState: [...bfsQueue], // Pass queue state *after* shift
                    resultState: [...bfsResult],
                    message: `Dequeue node ${u}`
                });

                bfsResult.push(u);
                 // Separate step to show adding to result
                 steps.push({
                    type: 'process-result',
                    nodeId: u,
                    nodeStates: { ...nodeStates },
                    edgeStates: { ...edgeStates },
                    queueState: [...bfsQueue],
                    resultState: [...bfsResult],
                    message: `Process node ${u}. Result: [${bfsResult.join(', ')}]`
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
                        queueState: [...bfsQueue],
                        resultState: [...bfsResult],
                        message: `Checking neighbor ${v} of ${u}`
                    });

                    if (!bfsVisited.has(v)) {
                        bfsVisited.add(v);
                        nodeStates[v] = 'queued';
                        bfsQueue.push(v);
                        steps.push({
                            type: 'enqueue',
                            nodeId: v, parentId: u, edgeId: edgeId,
                            nodeStates: { ...nodeStates },
                            edgeStates: { ...edgeStates }, // Keep edge active during enqueue step
                            queueState: [...bfsQueue],
                            resultState: [...bfsResult],
                            message: `Enqueue node ${v}`
                        });
                    }
                     edgeStates[edgeId] = 'idle'; // Deactivate edge after check/enqueue
                     // Add step to show edge deactivation (optional, can be combined)
                     steps.push({
                        type: 'finish-neighbor-check',
                        u: u, v: v, edgeId: edgeId,
                        nodeStates: { ...nodeStates },
                        edgeStates: { ...edgeStates },
                        queueState: [...bfsQueue],
                        resultState: [...bfsResult],
                        message: `Finished check for neighbor ${v}`
                    });
                }
                nodeStates[u] = 'visited'; // Mark as fully visited after exploring neighbors
                 steps.push({
                    type: 'mark-visited',
                    nodeId: u,
                    nodeStates: { ...nodeStates },
                    edgeStates: { ...edgeStates },
                    queueState: [...bfsQueue],
                    resultState: [...bfsResult],
                    message: `Finished processing node ${u}`
                });
            }
        } else {
             steps.push({ type: 'error', message: `Start node ${startNode} not found in graph.` });
        }


        steps.push({
            type: 'finish',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            queueState: [],
            resultState: [...bfsResult],
            message: `BFS Complete. Result: [${bfsResult.join(', ')}]`
        });

        return { steps, elements: svgElements }; // Return SVG elements
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.nodes || !elements.edges || !step.nodeStates || !step.edgeStates) {
            console.error("Graph BFS RenderStep: Missing data");
            return;
        }

        // Reset edge styles from previous step first
         Object.values(elements.edges).forEach(edgeEl => {
             edgeEl.classList.remove('active');
         });


        // Apply node states
        Object.keys(elements.nodes).forEach(nodeId => {
            const nodeGroup = elements.nodes[nodeId];
            const circle = nodeGroup.querySelector('circle');
            if (!circle) return;
            const state = step.nodeStates[nodeId];

            circle.classList.remove('initial', 'queued', 'processing', 'visited'); // Reset states
            switch (state) {
                case 'initial': circle.classList.add('initial'); break;
                case 'queued': circle.classList.add('queued'); break;
                case 'processing': circle.classList.add('processing'); break;
                case 'visited': circle.classList.add('visited'); break;
            }
        });

        // Apply edge states (highlight active edge)
        Object.keys(elements.edges).forEach(edgeId => {
             const edgeEl = elements.edges[edgeId];
             const state = step.edgeStates[edgeId];
             if (state === 'active') {
                 edgeEl.classList.add('active');
             } else {
                 edgeEl.classList.remove('active');
             }
         });

         // Update Queue Display
         const queueContainer = document.getElementById('graph-queue-container');
         if (queueContainer) {
             queueContainer.innerHTML = '<span>Queue:</span>'; // Clear previous
             if (step.queueState && Array.isArray(step.queueState)) {
                 step.queueState.forEach(nodeId => {
                     const span = document.createElement('span');
                     span.className = 'queue-item';
                     span.textContent = nodeId;
                     queueContainer.appendChild(span);
                 });
             }
         }

         // Update Result Display
         const resultContainer = document.getElementById('graph-result-container');
         if (resultContainer) {
             resultContainer.innerHTML = '<span>Result:</span>'; // Clear previous
             if (step.resultState && Array.isArray(step.resultState)) {
                 step.resultState.forEach(nodeId => {
                     const span = document.createElement('span');
                     span.className = 'result-item';
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
}; // End of graphBfsConfig
