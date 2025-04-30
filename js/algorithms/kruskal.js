// js/algorithms/kruskal.js

const kruskalConfig = {
    name: 'Kruskal’s MST',
    type: 'graph', // Use graph type
    requiresPositiveInts: true, // Weights should be positive for standard MST
    code: `// Disjoint Set Union (DSU) Helper Functions
function findSet(parent, i) { /* ... DSU find ... */ }
function unionSets(parent, rank, i, j) { /* ... DSU union ... */ }

function kruskal(nodes, edges) { // nodes = [{id: 0}, ...], edges = [{u, v, weight, id}, ...]
  const mst = [];
  let mstCost = 0;
  const numNodes = nodes.length;

  // 1. Initialize DSU
  const parent = Array(numNodes).fill(0).map((_, i) => i);
  const rank = Array(numNodes).fill(0);
  // Visualize initial DSU state (optional)

  // 2. Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);
  // Visualize sorted edges list

  // 3. Iterate through sorted edges
  for (const edge of edges) {
    const u = edge.u; const v = edge.v; const weight = edge.weight;
    // Visualize checking edge (u, v)

    // 4. Check if adding edge forms a cycle using DSU
    if (unionSets(parent, rank, u, v)) {
      // No cycle: Add edge to MST
      mst.push(edge);
      mstCost += weight;
      // Visualize adding edge to MST and updating cost
    } else {
      // Cycle detected: Discard edge
      // Visualize discarding edge
    }

    // Optimization: Stop if MST has |V| - 1 edges
    if (mst.length === numNodes - 1) break;
  }

  // Visualize completion
  return { mst, mstCost };
}`, // End of code string
    pseudocode: `Kruskal(nodes, edges): // nodes is a list of node IDs, edges is list of {u, v, weight}
  Create List, MST_edges = empty
  Create Number, MST_cost = 0
  numNodes = count(nodes)

  // 1. Initialize Disjoint Set Union (DSU) structure
  parent = array of size numNodes
  rank = array of size numNodes, initialized to 0
  for i = 0 to numNodes - 1: parent[i] = i
  // Visualize: Initial state (each node is separate component)

  // 2. Sort all edges by weight in non-decreasing order
  Sort edges based on edge.weight
  // Visualize: Sorted edge list

  // 3. Iterate through sorted edges
  for each edge {u, v, weight} in sorted edges:
    // Visualize: Consider edge (u, v) with weight
    Find root_u = FindSet(parent, u)
    Find root_v = FindSet(parent, v)
    // Visualize: Highlight nodes u, v and their components/sets

    // 4. Check if u and v are already in the same component
    if root_u != root_v:
      // Not in the same component, add edge
      Add edge {u, v, weight} to MST_edges
      MST_cost = MST_cost + weight
      UnionSets(parent, rank, u, v)
      // Visualize: Add edge to MST, update cost, show sets merging
    else:
      // Cycle would form, discard edge
      // Visualize: Discard edge (highlight as cycle forming)

    // 5. Check if MST is complete (|V| - 1 edges)
    if count(MST_edges) == numNodes - 1: break

  // Visualize: Algorithm complete
  return {MST_edges, MST_cost}

// DSU Helper Functions (FindSet, UnionSets): ...`, // End of pseudocode string

    setup: function(data) { // Data ignored
        console.log("Running Kruskal setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = '';
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        const numNodes = 8;
        const edgeProbability = 0.5;
        const minWeight = 1;
        const maxWeight = 20;

        // --- 1. Generate Graph ---
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
        // Connectivity Check (same as before)
        const visitedCheck = new Set(); const qCheck = [0]; visitedCheck.add(0); let head = 0;
        if(numNodes > 0 && adj[0] !== undefined){
             while(head < qCheck.length){ const u = qCheck[head++]; (adj[u] || []).forEach(edge => { const neighbor = edge.node; if(!visitedCheck.has(neighbor)){ visitedCheck.add(neighbor); qCheck.push(neighbor); } }); }
             if(visitedCheck.size < numNodes){
                 console.log("Graph not connected, adding edges for Kruskal..."); let lastVisited = 0; qCheck.forEach(n => lastVisited = n);
                 for(let i = 0; i < numNodes; i++){ if(!visitedCheck.has(i)){ const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight; const edgeId = `edge-${Math.min(lastVisited,i)}-${Math.max(lastVisited,i)}-${edgeCounter++}`; edges.push({u: lastVisited, v: i, weight: weight, id: edgeId }); adj[lastVisited].push({node: i, weight: weight, id: edgeId}); adj[i].push({node: lastVisited, weight: weight, id: edgeId}); console.log(`Connecting ${lastVisited} to ${i} with weight ${weight}`); const qCheck2 = [i]; visitedCheck.add(i); let head2 = 0; while(head2 < qCheck2.length){ const u2 = qCheck2[head2++]; (adj[u2] || []).forEach(edge => { const v2 = edge.node; if(!visitedCheck.has(v2)){ visitedCheck.add(v2); qCheck2.push(v2); } }); } lastVisited = i; } }
             }
        } else if (numNodes > 1) { console.warn("Graph might be disconnected or empty initially."); }
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
        edges.forEach(edge => { /* ... SVG edge creation (same as before) ... */
            const u = edge.u; const v = edge.v; const weight = edge.weight; const edgeId = edge.id;
            const edgeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); edgeGroup.id = edgeId; edgeGroup.setAttribute("class", "graph-edge-group");
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", nodes[u].x); line.setAttribute("y1", nodes[u].y); line.setAttribute("x2", nodes[v].x); line.setAttribute("y2", nodes[v].y);
            line.setAttribute("class", "graph-edge undirected"); edgeGroup.appendChild(line);
            const midX = (nodes[u].x + nodes[v].x) / 2; const midY = (nodes[u].y + nodes[v].y) / 2;
            const angle = Math.atan2(nodes[v].y - nodes[u].y, nodes[v].x - nodes[u].x);
            const offsetX = 8 * Math.sin(angle); const offsetY = -8 * Math.cos(angle);
            const weightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            weightText.setAttribute("x", midX + offsetX); weightText.setAttribute("y", midY + offsetY);
            weightText.setAttribute("text-anchor", "middle"); weightText.setAttribute("dy", ".3em");
            weightText.setAttribute("class", `graph-edge-weight`); weightText.textContent = weight; edgeGroup.appendChild(weightText);
            svgContainer.appendChild(edgeGroup); svgElements.edges[edgeId] = edgeGroup;
        });
        nodes.forEach(node => { /* ... SVG node creation (same as before) ... */
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g"); group.setAttribute("transform", `translate(${node.x}, ${node.y})`); group.id = `node-${node.id}`;
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); circle.setAttribute("r", nodeRadius); circle.setAttribute("class", "graph-node"); group.appendChild(circle);
            const idText = document.createElementNS("http://www.w3.org/2000/svg", "text"); idText.setAttribute("text-anchor", "middle"); idText.setAttribute("dy", ".3em");
            idText.setAttribute("class", "graph-node-label"); idText.textContent = node.id; group.appendChild(idText);
            svgContainer.appendChild(group); svgElements.nodes[node.id] = group;
        });

        // --- 5. Setup Sorted Edge List and Cost Display ---
        const displayContainer = document.createElement('div'); displayContainer.className = 'flex flex-col md:flex-row gap-4 mt-4';
        const edgeListContainer = document.createElement('div'); edgeListContainer.id = 'kruskal-edge-list'; edgeListContainer.className = 'kruskal-edge-list';
        edgeListContainer.innerHTML = '<span>Sorted Edges:</span><div class="edge-items"></div>'; displayContainer.appendChild(edgeListContainer);
        const costContainer = document.createElement('div'); costContainer.id = 'kruskal-cost-container'; costContainer.className = 'kruskal-cost-container';
        costContainer.innerHTML = '<span>MST Cost: 0</span>'; displayContainer.appendChild(costContainer);
        extraVisualizationArea.appendChild(displayContainer);

        // --- 6. Generate Kruskal Steps ---
        let steps = [];
        let nodeStates = {}; let edgeStates = {}; let mstCost = 0; let mstEdgesCount = 0;
        const mstEdgeIds = new Set();

        nodes.forEach(node => nodeStates[node.id] = 'initial');
        edges.forEach(edge => edgeStates[edge.id] = 'idle');

        const parent = Array(numNodes).fill(0).map((_, i) => i); const rank = Array(numNodes).fill(0);
        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
        // Store the full sorted edge data for use in renderStep
        const sortedEdgeData = sortedEdges.map(e => ({ id: e.id, u: e.u, v: e.v, weight: e.weight }));

        steps.push({
            type: 'init',
            // Pass sorted edge data in the step itself
            sortedEdgeInfo: sortedEdgeData,
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
            message: 'Initialized DSU. Edges sorted by weight.'
        });

        function findSet(p, i) { if (p[i] === i) return i; return p[i] = findSet(p, p[i]); }
        function unionSets(p, r, i, j) { let rootI = findSet(p, i); let rootJ = findSet(p, j); if (rootI !== rootJ) { if (r[rootI] < r[rootJ]) [rootI, rootJ] = [rootJ, rootI]; p[rootJ] = rootI; if (r[rootI] === r[rootJ]) r[rootI]++; return true; } return false; }

        for (let edgeIndex = 0; edgeIndex < sortedEdges.length; edgeIndex++) {
            const edge = sortedEdges[edgeIndex];
            const u = edge.u; const v = edge.v; const weight = edge.weight; const edgeId = edge.id;

            edgeStates[edgeId] = 'checking';
            const initialUState = nodeStates[u]; const initialVState = nodeStates[v];
            nodeStates[u] = 'checking'; nodeStates[v] = 'checking';

            steps.push({
                type: 'check-edge', edgeId: edgeId, u: u, v: v, weight: weight,
                sortedEdgeInfo: sortedEdgeData, currentEdgeIndex: edgeIndex, // Pass index
                nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                message: `Checking edge (${u}-${v}) with weight ${weight}.`
            });

            nodeStates[u] = initialUState; nodeStates[v] = initialVState; // Reset node highlight after check

            let rootU = findSet(parent, u); let rootV = findSet(parent, v);

            if (rootU !== rootV) {
                unionSets(parent, rank, u, v);
                mstCost += weight; mstEdgesCount++; mstEdgeIds.add(edgeId);
                edgeStates[edgeId] = 'mst'; nodeStates[u] = 'in-mst'; nodeStates[v] = 'in-mst';

                steps.push({
                    type: 'add-edge', edgeId: edgeId, u: u, v: v, weight: weight,
                    sortedEdgeInfo: sortedEdgeData, currentEdgeIndex: edgeIndex,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                    message: `Added edge (${u}-${v}) to MST. Cost: ${mstCost}.`
                });
            } else {
                edgeStates[edgeId] = 'discarded';
                steps.push({
                    type: 'discard-edge', edgeId: edgeId, u: u, v: v, weight: weight,
                    sortedEdgeInfo: sortedEdgeData, currentEdgeIndex: edgeIndex,
                    nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
                    mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
                    message: `Discarded edge (${u}-${v}). Forms a cycle.`
                });
            }
            // Reset non-mst/discarded edge state
            if (edgeStates[edgeId] === 'checking') edgeStates[edgeId] = 'idle';

            if (mstEdgesCount === numNodes - 1) {
                steps.push({ type: 'mst-complete', sortedEdgeInfo: sortedEdgeData, nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates }, mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds), message: `MST complete with ${mstEdgesCount} edges.` });
                break;
            }
        }

        // Final Step - ensure final states are correct
        edges.forEach(edge => { edgeStates[edge.id] = mstEdgeIds.has(edge.id) ? 'mst' : 'idle'; });
        nodes.forEach(node => nodeStates[node.id] = 'in-mst'); // Assume connected graph

        steps.push({
            type: 'finish',
            sortedEdgeInfo: sortedEdgeData,
            nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates },
            mstCost: mstCost, mstEdgeIds: new Set(mstEdgeIds),
            message: `Kruskal's Algorithm Complete. Final MST Cost: ${mstCost}.`
        });

        console.log("Kruskal setup complete. Steps generated:", steps.length);
        // Pass graph elements, numNodes, and the initial sorted edge list data
        return { steps, elements: { graph: svgElements }, numNodes: numNodes, initialSortedEdges: sortedEdgeData };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.graph || !step.nodeStates || !step.edgeStates || !animationState) {
            console.error("Kruskal RenderStep: Missing data", { step, elements, animationState });
            return;
        }
        const graphElements = elements.graph;
        // Get sorted edge info from the step if available, otherwise from initial state
        const sortedEdgeInfo = step.sortedEdgeInfo || animationState.initialSortedEdges || [];

        // --- Render Graph ---
        Object.keys(graphElements.nodes).forEach(nodeId => { /* ... Apply nodeStates (checking, in-mst, initial) ... */
            const nodeGroup = graphElements.nodes[nodeId];
            const circle = nodeGroup.querySelector('circle');
            if (!circle) return;
            const state = step.nodeStates[nodeId];
            circle.classList.remove('initial', 'checking', 'in-mst');
            if (state === 'checking') circle.classList.add('checking');
            else if (state === 'in-mst') circle.classList.add('in-mst');
            else circle.classList.add('initial');
        });
        Object.keys(graphElements.edges).forEach(edgeId => { /* ... Apply edgeStates (checking, mst, discarded, idle) ... */
            const edgeGroup = graphElements.edges[edgeId];
            const line = edgeGroup.querySelector('line');
            if (!line) return;
            const state = step.edgeStates[edgeId];
            line.classList.remove('idle', 'checking', 'mst', 'discarded');
            if (state === 'checking') line.classList.add('checking');
            else if (state === 'mst') line.classList.add('mst');
            else if (state === 'discarded') line.classList.add('discarded');
            else line.classList.add('idle');
        });

        // --- Update Sorted Edge List Display ---
        const edgeListDiv = document.querySelector('#kruskal-edge-list .edge-items');
        if (edgeListDiv && sortedEdgeInfo) { // Use sortedEdgeInfo
            edgeListDiv.innerHTML = ''; // Clear previous
            sortedEdgeInfo.forEach((edgeData, index) => {
                const item = document.createElement('span');
                item.className = 'kruskal-edge-item';
                item.textContent = `(${edgeData.u}-${edgeData.v}, w:${edgeData.weight})`;
                item.dataset.edgeId = edgeData.id;

                const edgeState = step.edgeStates[edgeData.id];
                // Highlight based on current step's focus or final state
                if (step.currentEdgeIndex === index && step.type !== 'finish' && step.type !== 'init' && step.type !== 'mst-complete') {
                     item.classList.add('checking'); // Highlight the edge being actively checked
                } else if (edgeState === 'mst') {
                    item.classList.add('mst');
                } else if (edgeState === 'discarded') {
                    item.classList.add('discarded');
                }
                edgeListDiv.appendChild(item);
            });
             // Scroll the currently checked item into view
             const currentItem = edgeListDiv.querySelector(`.kruskal-edge-item.checking`);
             if (currentItem) {
                 currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
             }
        }

        // --- Update MST Cost Display ---
        const costContainer = document.getElementById('kruskal-cost-container');
        if (costContainer && step.mstCost !== undefined) {
            costContainer.innerHTML = `<span>MST Cost: ${step.mstCost}</span>`;
        }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    } // End of renderStep
}; // End of kruskalConfig

