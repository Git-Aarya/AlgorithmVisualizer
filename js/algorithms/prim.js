// js/algorithms/prim.js

const primConfig = {
    name: 'Prim’s MST',
    type: 'graph', // Use graph type
    requiresPositiveInts: true, // Standard Prim's assumes non-negative weights
    code: `<span class="code-comment">// Simplified Priority Queue (Min-Heap based) for demonstration</span>
<span class="code-keyword">class</span> <span class="code-function">MinPriorityQueue</span> {
  <span class="code-function">constructor</span>() { <span class="code-keyword">this</span>.heap = []; <span class="code-keyword">this</span>.indices = {}; }
  <span class="code-function">enqueue</span>(element, priority) { <span class="code-comment">/* ... Heap push and bubble up ... */</span> }
  <span class="code-function">dequeue</span>() { <span class="code-comment">/* ... Heap extract min and bubble down ... */</span> }
  <span class="code-function">decreaseKey</span>(element, newPriority) { <span class="code-comment">/* ... Find element, update priority, bubble up ... */</span> }
  <span class="code-function">isEmpty</span>() { <span class="code-keyword">return</span> <span class="code-keyword">this</span>.heap.length === <span class="code-number">0</span>; }
  <span class="code-function">has</span>(element) { <span class="code-keyword">return</span> <span class="code-keyword">this</span>.indices[element] !== undefined; }
  <span class="code-comment">// Note: A real implementation is more complex</span>
}

<span class="code-keyword">function</span> <span class="code-function">prim</span>(graph, nodes, startNode) {
  <span class="code-keyword">const</span> numNodes = nodes.length;
  <span class="code-keyword">const</span> key = {};      <span class="code-comment">// Stores minimum edge weight connecting node to MST</span>
  <span class="code-keyword">const</span> parent = {};   <span class="code-comment">// Stores the edge (parent node) that connects node to MST</span>
  <span class="code-keyword">const</span> inMST = <span class="code-keyword">new</span> <span class="code-function">Set</span>(); <span class="code-comment">// Tracks nodes included in the MST</span>
  <span class="code-keyword">const</span> pq = <span class="code-keyword">new</span> <span class="code-function">MinPriorityQueue</span>(); <span class="code-comment">// Stores [nodeId, key[nodeId]]</span>
  <span class="code-keyword">let</span> mstCost = <span class="code-number">0</span>;
  <span class="code-keyword">const</span> mstEdges = []; <span class="code-comment">// Store edges {u, v, weight, id} in the MST</span>

  <span class="code-comment">// 1. Initialize keys, parent, and PQ</span>
  nodes.<span class="code-function">forEach</span>(node => {
    key[node.id] = Infinity;
    parent[node.id] = null;
  });
  key[startNode] = <span class="code-number">0</span>;
  nodes.<span class="code-function">forEach</span>(node => pq.<span class="code-function">enqueue</span>(node.id, key[node.id]));
  <span class="code-comment">// Visualize initial state: keys=Infinity (start=0), PQ populated</span>

  <span class="code-comment">// 2. Loop while PQ is not empty</span>
  <span class="code-keyword">while</span> (!pq.<span class="code-function">isEmpty</span>()) {
    <span class="code-keyword">const</span> u = pq.<span class="code-function">dequeue</span>(); <span class="code-comment">// Extract node u with minimum key</span>
    <span class="code-comment">// Visualize: Extract min key node u from PQ</span>

    <span class="code-keyword">if</span> (inMST.<span class="code-function">has</span>(u)) <span class="code-keyword">continue</span>; <span class="code-comment">// Skip if already in MST (due to lazy decreaseKey in simple PQ)</span>

    inMST.<span class="code-function">add</span>(u); <span class="code-comment">// Add u to MST</span>
    <span class="code-comment">// Visualize: Add node u to MST set</span>

    <span class="code-comment">// If u has a parent, add the edge to MST result and update cost</span>
    <span class="code-keyword">if</span> (parent[u] !== null) {
      <span class="code-keyword">const</span> edgeWeight = key[u]; <span class="code-comment">// The weight of the edge that brought u in</span>
      mstCost += edgeWeight;
      <span class="code-comment">// Find the edge object (requires graph structure access or edge list)</span>
      <span class="code-comment">// mstEdges.push({ u: parent[u], v: u, weight: edgeWeight, ... });</span>
      <span class="code-comment">// Visualize: Add edge (parent[u], u) to MST, update cost</span>
    }

    <span class="code-comment">// 3. Update keys of adjacent nodes v not yet in MST</span>
    <span class="code-keyword">const</span> neighbors = graph[u] || [];
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> edge <span class="code-keyword">of</span> neighbors) { <span class="code-comment">// edge = { node: v, weight: w, id: edgeId }</span>
      <span class="code-keyword">const</span> v = edge.node;
      <span class="code-keyword">const</span> weight = edge.weight;
      <span class="code-comment">// Visualize: Checking edge (u, v)</span>

      <span class="code-keyword">if</span> (!inMST.<span class="code-function">has</span>(v) && weight < key[v]) {
        key[v] = weight;       <span class="code-comment">// Update minimum edge weight for v</span>
        parent[v] = u;         <span class="code-comment">// Set u as potential parent for v</span>
        pq.<span class="code-function">decreaseKey</span>(v, key[v]); <span class="code-comment">// Update v's priority in PQ</span>
        <span class="code-comment">// Visualize: Update key[v], parent[v], and PQ</span>
      }
    }
     <span class="code-comment">// Visualize: Finished exploring neighbors of u</span>
  }

  <span class="code-comment">// Visualize completion</span>
  <span class="code-keyword">return</span> { mstEdges, mstCost }; <span class="code-comment">// Need to construct mstEdges from parent array</span>
}`,
    pseudocode: `Prim(graph, nodes, startNode):
  Create Map, key      // key[v] = min weight of edge connecting v to MST
  Create Map, parent   // parent[v] = node in MST connected to v by min edge
  Create Set, inMST    // Nodes currently included in the MST
  Create MinPriorityQueue, pq // Stores {node, key[node]}

  // 1. Initialization
  for each node v in nodes:
    key[v] = Infinity
    parent[v] = null
  key[startNode] = 0
  // Visualize: Initialize keys (start=0, others=∞)

  for each node v in nodes:
    pq.enqueue(v, key[v])
  // Visualize: Add all nodes to PQ

  // 2. Main Loop
  while pq is not empty:
    u = pq.dequeue() // Extract node with minimum key
    // Visualize: Extract min node u (state: processing)

    if u is in inMST: continue // Skip if already processed

    Add u to inMST
    // Visualize: Add u to MST (state: in-mst)

    // If parent[u] exists, visualize adding edge (parent[u], u) to MST
    if parent[u] is not null:
       // Visualize: Add edge (parent[u], u) to MST display, update total cost

    // 3. Update Neighbors
    for each edge {neighbor: v, weight: w} adjacent to u:
      // Visualize: Check edge (u, v)
      if v is not in inMST and w < key[v]:
        // Found a cheaper edge to connect v to the growing MST
        parent[v] = u
        key[v] = w
        pq.decreaseKey(v, key[v]) // Update priority in PQ
        // Visualize: Update key[v] and parent[v], highlight edge (u,v) as candidate

    // Visualize: Finished exploring neighbors of u

  // Visualize: Algorithm complete
  Construct MST edges from parent array
  Return MST edges and total cost`,

    setup: function(data) { // Data ignored
        console.log("Running Prim setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = '';
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        const numNodes = 8;
        const edgeProbability = 0.5;
        const minWeight = 1;
        const maxWeight = 20;

        // --- 1. Generate Random Weighted Undirected Graph ---
        const adj = {}; const nodes = []; const edges = [];
        for (let i = 0; i < numNodes; i++) { adj[i] = []; nodes.push({ id: i, x: 0, y: 0 }); }
        let edgeCounter = 0;
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                if (Math.random() < edgeProbability) {
                    const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
                    const edgeId = `edge-${i}-${j}-${edgeCounter++}`;
                    edges.push({ u: i, v: j, weight: weight, id: edgeId });
                    adj[i].push({ node: j, weight: weight, id: edgeId });
                    adj[j].push({ node: i, weight: weight, id: edgeId });
                }
            }
        }
        // Connectivity Check (same as Kruskal)
        const visitedCheck = new Set(); const qCheck = [0]; visitedCheck.add(0); let head = 0;
        if(numNodes > 0 && adj[0] !== undefined){ while(head < qCheck.length){ const u = qCheck[head++]; (adj[u] || []).forEach(edge => { const neighbor = edge.node; if(!visitedCheck.has(neighbor)){ visitedCheck.add(neighbor); qCheck.push(neighbor); } }); } if(visitedCheck.size < numNodes){ console.log("Graph not connected, adding edges for Prim..."); let lastVisited = 0; qCheck.forEach(n => lastVisited = n); for(let i = 0; i < numNodes; i++){ if(!visitedCheck.has(i)){ const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight; const edgeId = `edge-${Math.min(lastVisited,i)}-${Math.max(lastVisited,i)}-${edgeCounter++}`; edges.push({u: lastVisited, v: i, weight: weight, id: edgeId }); adj[lastVisited].push({node: i, weight: weight, id: edgeId}); adj[i].push({node: lastVisited, weight: weight, id: edgeId}); console.log(`Connecting ${lastVisited} to ${i} with weight ${weight}`); const qCheck2 = [i]; visitedCheck.add(i); let head2 = 0; while(head2 < qCheck2.length){ const u2 = qCheck2[head2++]; (adj[u2] || []).forEach(edge => { const v2 = edge.node; if(!visitedCheck.has(v2)){ visitedCheck.add(v2); qCheck2.push(v2); } }); } lastVisited = i; } } } } else if (numNodes > 1) { console.warn("Graph might be disconnected or empty initially."); }
        // --- End Graph Generation ---


        // --- 2. Setup SVG Container ---
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const containerWidth = extraVisualizationArea.clientWidth || 600;
        const graphHeight = 350;
        svgContainer.setAttribute("viewBox", `0 0 ${containerWidth} ${graphHeight}`);
        svgContainer.setAttribute("width", "100%"); svgContainer.setAttribute("height", graphHeight);
        svgContainer.id = "graph-svg-container"; extraVisualizationArea.appendChild(svgContainer);

        // --- 3. Calculate Node Positions ---
        const nodeRadius = 15; const radius = graphHeight * 0.4; const centerX = containerWidth / 2; const centerY = graphHeight / 2;
        nodes.forEach((node, index) => { const angle = (index / numNodes) * 2 * Math.PI; node.x = centerX + radius * Math.cos(angle); node.y = centerY + radius * Math.sin(angle); });

        // --- 4. Create SVG Elements ---
        const svgElements = { nodes: {}, edges: {} };
        edges.forEach(edge => { /* ... SVG edge creation ... */
             const u = edge.u; const v = edge.v; const weight = edge.weight; const edgeId = edge.id;
             const edgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); edgeGroup.id = edgeId; edgeGroup.setAttribute("class", "graph-edge-group");
             const line = document.createElementNS("http://www.w3.org/2000/svg", "line"); line.setAttribute("x1", nodes[u].x); line.setAttribute("y1", nodes[u].y); line.setAttribute("x2", nodes[v].x); line.setAttribute("y2", nodes[v].y); line.setAttribute("class", "graph-edge undirected"); edgeGroup.appendChild(line);
             const midX = (nodes[u].x + nodes[v].x) / 2; const midY = (nodes[u].y + nodes[v].y) / 2; const angle = Math.atan2(nodes[v].y - nodes[u].y, nodes[v].x - nodes[u].x); const offsetX = 8 * Math.sin(angle); const offsetY = -8 * Math.cos(angle); const weightText = document.createElementNS("http://www.w3.org/2000/svg", "text"); weightText.setAttribute("x", midX + offsetX); weightText.setAttribute("y", midY + offsetY); weightText.setAttribute("text-anchor", "middle"); weightText.setAttribute("dy", ".3em"); weightText.setAttribute("class", `graph-edge-weight`); weightText.textContent = weight; edgeGroup.appendChild(weightText);
             svgContainer.appendChild(edgeGroup); svgElements.edges[edgeId] = edgeGroup;
        });
        nodes.forEach(node => { /* ... SVG node creation ... */
             const group = document.createElementNS("http://www.w3.org/2000/svg", "g"); group.setAttribute("transform", `translate(${node.x}, ${node.y})`); group.id = `node-${node.id}`;
             const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); circle.setAttribute("r", nodeRadius); circle.setAttribute("class", "graph-node"); group.appendChild(circle);
             // Add text element for key value, initially '∞'
             const keyText = document.createElementNS("http://www.w3.org/2000/svg", "text"); keyText.setAttribute("text-anchor", "middle"); keyText.setAttribute("dy", "-0.6em"); keyText.setAttribute("class", "graph-node-key"); keyText.id = `key-${node.id}`; keyText.textContent = "∞"; group.appendChild(keyText);
             const idText = document.createElementNS("http://www.w3.org/2000/svg", "text"); idText.setAttribute("text-anchor", "middle"); idText.setAttribute("dy", "0.5em"); // Position ID below key
             idText.setAttribute("class", "graph-node-label"); idText.textContent = node.id; group.appendChild(idText);
             svgContainer.appendChild(group); svgElements.nodes[node.id] = group;
        });

        // --- 5. Setup Key/Parent Table and Cost Display ---
        const displayContainer = document.createElement('div'); displayContainer.className = 'flex flex-col md:flex-row gap-4 mt-4';
        const keyParentTableContainer = document.createElement('div'); keyParentTableContainer.id = 'prim-keyparent-table'; keyParentTableContainer.className = 'prim-keyparent-table';
        keyParentTableContainer.innerHTML = '<span>Node Info (Key / Parent):</span><div class="keyparent-grid"></div>'; displayContainer.appendChild(keyParentTableContainer);
        const costContainer = document.createElement('div'); costContainer.id = 'prim-cost-container'; costContainer.className = 'prim-cost-container';
        costContainer.innerHTML = '<span>MST Cost: 0</span>'; displayContainer.appendChild(costContainer);
        extraVisualizationArea.appendChild(displayContainer);

        // --- 6. Generate Prim's Steps ---
        let steps = [];
        let nodeStates = {}; // 'initial', 'in-pq', 'in-mst', 'processing'
        let edgeStates = {}; // 'idle', 'checking', 'candidate', 'mst'
        let currentKeys = {}; let currentParents = {};
        let mstCost = 0; const mstEdgeIds = new Set();

        nodes.forEach(node => { nodeStates[node.id] = 'initial'; currentKeys[node.id] = Infinity; currentParents[node.id] = null; });
        edges.forEach(edge => edgeStates[edge.id] = 'idle');

        const startNode = 0;
        currentKeys[startNode] = 0;

        // Simple PQ simulation for visualization (stores node IDs)
        // A real implementation uses decreaseKey for efficiency
        let pq = nodes.map(n => n.id); // Start with all nodes
        const inMST = new Set();

        steps.push({
            type: 'init',
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            keys: { ...currentKeys }, parents: { ...currentParents },
            pqSnapshot: [...pq].sort((a,b) => currentKeys[a] - currentKeys[b]), // Show sorted by key
            mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
            message: `Initialized keys (start node ${startNode}=0). PQ contains all nodes.`
        });

        while (pq.length > 0) {
            // Find node u in pq with minimum key[u]
            pq.sort((a, b) => currentKeys[a] - currentKeys[b]); // Simulate PQ sort
            const u = pq.shift(); // Simulate extract-min

            if (inMST.has(u)) continue; // Should not happen with simple array PQ if no duplicates added

            nodeStates[u] = 'processing'; // Mark as being processed
            steps.push({
                type: 'extract-min', u: u, key_u: currentKeys[u],
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                keys: { ...currentKeys }, parents: { ...currentParents },
                pqSnapshot: [...pq].sort((a,b) => currentKeys[a] - currentKeys[b]), // Show PQ *after* extraction
                mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                message: `Extract node ${u} with minimum key ${currentKeys[u]}.`
            });

            inMST.add(u);
            nodeStates[u] = 'in-mst'; // Mark as added to MST

            // Add edge to MST visualization if it has a parent
            const parentU = currentParents[u];
            if (parentU !== null) {
                mstCost += currentKeys[u]; // Add weight of edge that brought u in
                const edgeToAdd = edges.find(e => (e.u === parentU && e.v === u) || (e.u === u && e.v === parentU));
                if (edgeToAdd) {
                    mstEdgeIds.add(edgeToAdd.id);
                    edgeStates[edgeToAdd.id] = 'mst';
                }
                 steps.push({
                    type: 'add-to-mst', u: u, parent: parentU, edgeId: edgeToAdd?.id,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    keys: { ...currentKeys }, parents: { ...currentParents },
                    pqSnapshot: [...pq].sort((a,b) => currentKeys[a] - currentKeys[b]),
                    mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                    message: `Add node ${u} to MST via edge (${parentU}-${u}). Cost: ${mstCost}.`
                });
            } else {
                 // First node added (start node)
                 steps.push({
                    type: 'add-to-mst', u: u, parent: null, edgeId: null,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    keys: { ...currentKeys }, parents: { ...currentParents },
                    pqSnapshot: [...pq].sort((a,b) => currentKeys[a] - currentKeys[b]),
                    mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                    message: `Add start node ${u} to MST.`
                });
            }


            // Update neighbors
            const neighbors = adj[u] || [];
            for (const edge of neighbors) {
                const v = edge.node;
                const weight = edge.weight;
                const edgeId = edge.id;

                edgeStates[edgeId] = 'checking'; // Highlight edge being checked
                 // Temporarily highlight neighbor node
                const initialVState = nodeStates[v];
                 if (!inMST.has(v)) nodeStates[v] = 'checking';

                steps.push({
                    type: 'check-neighbor', u: u, v: v, weight: weight, edgeId: edgeId,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    keys: { ...currentKeys }, parents: { ...currentParents },
                    pqSnapshot: [...pq].sort((a,b) => currentKeys[a] - currentKeys[b]),
                    mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                    message: `Checking neighbor ${v} from ${u} (edge weight ${weight}). Current key[${v}]=${currentKeys[v] === Infinity ? '∞' : currentKeys[v]}.`
                });

                 // Reset neighbor node highlight after check step shown
                 if (!inMST.has(v)) nodeStates[v] = initialVState;


                if (!inMST.has(v) && weight < currentKeys[v]) {
                    const oldKey = currentKeys[v];
                    currentKeys[v] = weight;
                    currentParents[v] = u;
                    // In a real PQ, we'd call decreaseKey(v, weight) here.
                    // For visualization, we just update the key and re-sort the pq array snapshot.
                    nodeStates[v] = 'in-pq'; // Mark as updated in PQ
                    edgeStates[edgeId] = 'candidate'; // Mark edge as candidate

                    steps.push({
                        type: 'update-key', u: u, v: v, newKey: weight, oldKey: oldKey, edgeId: edgeId,
                        nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                        keys: { ...currentKeys }, parents: { ...currentParents },
                        pqSnapshot: [...pq].sort((a,b) => currentKeys[a] - currentKeys[b]), // Show updated PQ order
                        mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                        message: `Update key[${v}] to ${weight} (via node ${u}). Parent[${v}]=${u}.`
                    });
                     // Reset edge state after update step shown
                     // edgeStates[edgeId] = 'idle'; // Keep as candidate? Let's reset.
                }
                 // Reset edge state if not updated or v is in MST
                 if (edgeStates[edgeId] === 'checking') edgeStates[edgeId] = 'idle';

            }
             // Optional step: Mark exploration of u complete
             steps.push({
                 type: 'finish-explore', u: u,
                 nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                 keys: { ...currentKeys }, parents: { ...currentParents },
                 pqSnapshot: [...pq].sort((a,b) => currentKeys[a] - currentKeys[b]),
                 mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                 message: `Finished exploring neighbors of ${u}.`
             });
        }

        // Final Step
        edges.forEach(edge => { edgeStates[edge.id] = mstEdgeIds.has(edge.id) ? 'mst' : 'idle'; });
        nodes.forEach(node => nodeStates[node.id] = 'in-mst');

        steps.push({
            type: 'finish',
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            keys: { ...currentKeys }, parents: { ...currentParents },
            pqSnapshot: [], mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
            message: `Prim's Algorithm Complete. Final MST Cost: ${mstCost}.`
        });

        console.log("Prim setup complete. Steps generated:", steps.length);
        return { steps, elements: { graph: svgElements }, numNodes: numNodes };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.graph || !step.nodeStates || !step.edgeStates || !step.keys || !step.parents || !animationState) {
            console.error("Prim RenderStep: Missing data", { step, elements, animationState });
            return;
        }
        const graphElements = elements.graph;
        const numNodes = animationState.numNodes;

        // --- Render Graph ---
        // Apply node states and update key text
        Object.keys(graphElements.nodes).forEach(nodeId => {
            const nodeGroup = graphElements.nodes[nodeId];
            const circle = nodeGroup.querySelector('circle');
            const keyText = nodeGroup.querySelector('.graph-node-key');
            if (!circle || !keyText) return;

            const state = step.nodeStates[nodeId];
            const keyVal = step.keys[nodeId];

            // Update key text on node
            keyText.textContent = keyVal === Infinity ? "∞" : keyVal;

            // Apply node style
            circle.classList.remove('initial', 'in-pq', 'processing', 'in-mst', 'checking'); // Reset Prim states
            if (state === 'processing') circle.classList.add('processing');
            else if (state === 'in-mst') circle.classList.add('in-mst');
            else if (state === 'in-pq') circle.classList.add('in-pq'); // Node updated in PQ
            else if (state === 'checking') circle.classList.add('checking'); // Neighbor node being checked
            else circle.classList.add('initial');
        });
        // Apply edge states
        Object.keys(graphElements.edges).forEach(edgeId => {
            const edgeGroup = graphElements.edges[edgeId];
            const line = edgeGroup.querySelector('line');
            if (!line) return;
            const state = step.edgeStates[edgeId];

            line.classList.remove('idle', 'checking', 'candidate', 'mst'); // Reset Prim states
            if (state === 'checking') line.classList.add('checking');
            else if (state === 'candidate') line.classList.add('candidate'); // Edge provides the current best key
            else if (state === 'mst') line.classList.add('mst');
            else line.classList.add('idle');
        });

        // --- Update Key/Parent Table ---
        const keyParentGrid = document.querySelector('#prim-keyparent-table .keyparent-grid');
        if (keyParentGrid) {
            keyParentGrid.innerHTML = ''; // Clear previous
            for (let i = 0; i < numNodes; i++) {
                const keyVal = step.keys[i];
                const parentVal = step.parents[i];
                const cell = document.createElement('span');
                cell.className = 'keyparent-cell';
                // Highlight if node state is relevant
                if (step.nodeStates[i] === 'processing') cell.classList.add('processing');
                else if (step.nodeStates[i] === 'in-mst') cell.classList.add('in-mst');
                else if (step.nodeStates[i] === 'in-pq') cell.classList.add('in-pq');

                cell.innerHTML = `<b>${i}:</b> ${keyVal === Infinity ? '∞' : keyVal} / ${parentVal === null ? '-' : parentVal}`;
                keyParentGrid.appendChild(cell);
            }
        }

        // --- Update MST Cost Display ---
        const costContainer = document.getElementById('prim-cost-container');
        if (costContainer && step.mstCost !== undefined) {
            costContainer.innerHTML = `<span>MST Cost: ${step.mstCost}</span>`;
        }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    } // End of renderStep
}; // End of primConfig
