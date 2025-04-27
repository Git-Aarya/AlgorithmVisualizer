// js/algorithms/tree-bfs-dfs.js

const treeBfsDfsConfig = {
    name: 'BFS & DFS (Trees)',
    type: 'tree', // Identifier for tree algorithms
    code: `// --- BREADTH-FIRST SEARCH (BFS - Level Order using Queue) ---
<span class="code-keyword">function</span> <span class="code-function">bfs</span>(root) {
  <span class="code-keyword">if</span> (!root) <span class="code-keyword">return</span> []; <span class="code-comment">// Handle empty tree</span>

  <span class="code-keyword">const</span> queue = [root];   <span class="code-comment">// Initialize queue with root</span>
  <span class="code-keyword">const</span> result = [];      <span class="code-comment">// Stores visited node values</span>
  <span class="code-keyword">const</span> visited = <span class="code-keyword">new</span> <span class="code-function">Set</span>(); <span class="code-comment">// Keep track of visited nodes (optional for trees, essential for graphs)</span>
  visited.<span class="code-function">add</span>(root);    <span class="code-comment">// Mark root as visited/queued</span>
  <span class="code-comment">// Visualize: Add root to queue</span>

  <span class="code-keyword">while</span> (queue.length > <span class="code-number">0</span>) {
    <span class="code-keyword">const</span> node = queue.<span class="code-function">shift</span>(); <span class="code-comment">// Dequeue the next node</span>
    <span class="code-comment">// Visualize: Dequeue node</span>

    result.<span class="code-function">push</span>(node.value); <span class="code-comment">// Process the node</span>
    <span class="code-comment">// Visualize: Process node</span>

    <span class="code-comment">// Enqueue left child if it exists and hasn't been visited</span>
    <span class="code-keyword">if</span> (node.left && !visited.<span class="code-function">has</span>(node.left)) {
      visited.<span class="code-function">add</span>(node.left);
      queue.<span class="code-function">push</span>(node.left);
      <span class="code-comment">// Visualize: Add left child to queue</span>
    }

    <span class="code-comment">// Enqueue right child if it exists and hasn't been visited</span>
    <span class="code-keyword">if</span> (node.right && !visited.<span class="code-function">has</span>(node.right)) {
      visited.<span class="code-function">add</span>(node.right);
      queue.<span class="code-function">push</span>(node.right);
      <span class="code-comment">// Visualize: Add right child to queue</span>
    }
     <span class="code-comment">// Visualize: Mark node as fully visited/processed</span>
  }
  <span class="code-keyword">return</span> result;
}

// --- DEPTH-FIRST SEARCH (DFS - Preorder Recursive) ---
<span class="code-keyword">function</span> <span class="code-function">dfsPreorderRecursive</span>(node, result = []) {
  <span class="code-keyword">if</span> (!node) <span class="code-keyword">return</span> result; <span class="code-comment">// Base case: null node</span>
  <span class="code-comment">// Visualize: Process node (Visit)</span>
  result.<span class="code-function">push</span>(node.value);

  <span class="code-comment">// Visualize: Go left</span>
  <span class="code-function">dfsPreorderRecursive</span>(node.left, result); <span class="code-comment">// Recurse left</span>

  <span class="code-comment">// Visualize: Return from left, Go right</span>
  <span class="code-function">dfsPreorderRecursive</span>(node.right, result); <span class="code-comment">// Recurse right</span>

   <span class="code-comment">// Visualize: Return from right (Finish node)</span>
  <span class="code-keyword">return</span> result;
}`,
pseudocode: `// --- BREADTH-FIRST SEARCH (BFS - Level Order using Queue) ---
BFS(root):
  if root is null: return empty list
  Create a Queue, Q
  Create a List, result
  Create a Set, visited

  Add root to Q
  Add root to visited
  // Visualize: Add root to queue (state: queued)

  while Q is not empty:
    node = Q.dequeue()
    // Visualize: Dequeue node (state: processing)

    Add node.value to result
    // Visualize: Process node (update result display)

    // Check left child
    if node.left is not null and node.left is not in visited:
      Add node.left to visited
      Q.enqueue(node.left)
      // Visualize: Add left child to queue (state: queued)

    // Check right child
    if node.right is not null and node.right is not in visited:
      Add node.right to visited
      Q.enqueue(node.right)
      // Visualize: Add right child to queue (state: queued)

    // Visualize: Mark node as finished (state: visited)

  return result

// --- DEPTH-FIRST SEARCH (DFS - Preorder Recursive) ---
DFS_Preorder(node, result_list):
  if node is null:
    // Visualize: Reached null branch
    return

  // Visualize: Process node (state: processing)
  Add node.value to result_list

  // Visualize: Explore left subtree (state: visiting-left)
  DFS_Preorder(node.left, result_list)

  // Visualize: Return from left, Explore right subtree (state: visiting-right)
  DFS_Preorder(node.right, result_list)

  // Visualize: Finished with node and its subtrees (state: visited)
`,

    selectedSearchType: 'bfs', // Default

    setup: function(data) { // Data isn't used, we generate a tree
        const currentConfig = this;
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = ''; // Clear previous
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        // --- Node Structure ---
        class TreeNode {
            constructor(value, id) {
                this.value = value; this.left = null; this.right = null; this.id = id;
                this.domElement = null; this.level = 0; this.x = 0; this.y = 0;
                this.inorderIndex = 0;
            }
        }
        let nodeCounter = 0;
        function createNode(value) { return new TreeNode(value, `bfsdfs-node-${nodeCounter++}`); }

        // --- 1. Generate Random Tree (similar to traversals) ---
        let root = null;
        const minValue = 1; const maxValue = 99; const minNodes = 7; const maxNodes = 12;
        const numNodes = Math.floor(Math.random() * (maxNodes - minNodes + 1)) + minNodes;
        const values = []; const generatedValues = new Set();
        while (values.length < numNodes) {
             const randomVal = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
             if (!generatedValues.has(randomVal)) { generatedValues.add(randomVal); values.push(randomVal); }
             if (generatedValues.size >= (maxValue - minValue + 1)) break;
        }
        const nodeMap = {};
        if (values.length > 0) {
            root = createNode(values[0]);
            nodeMap[root.id] = root;
            const queue = [root]; let i = 1;
            while (i < values.length) {
                const current = queue.shift();
                if (!current) break; // Should not happen
                if (i < values.length) {
                    const leftChild = createNode(values[i++]);
                    nodeMap[leftChild.id] = leftChild;
                    current.left = leftChild;
                    queue.push(leftChild);
                }
                if (i < values.length) {
                    const rightChild = createNode(values[i++]);
                    nodeMap[rightChild.id] = rightChild;
                    current.right = rightChild;
                    queue.push(rightChild);
                }
                if (queue.length === 0 && i < values.length) queue.push(root);
            }
        }
         if (!root) {
              extraVisualizationArea.innerHTML = '<p>Failed to generate tree.</p>';
              return { steps: [], elements: {} };
         }

        // --- 2. Create Visualization Containers & Controls ---
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-visualization-container';
        extraVisualizationArea.appendChild(treeContainer);

        // --- Search Type Selector ---
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'bfs-dfs-type-selector'; // New class for styling
        treeContainer.appendChild(selectorContainer);

        const types = ['bfs', 'dfs'];
        types.forEach(type => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio'; radio.name = 'searchType'; radio.value = type;
            radio.checked = (type === currentConfig.selectedSearchType);
            radio.id = `radio-${type}`;
            radio.addEventListener('change', (event) => {
                if (event.target.checked) {
                    currentConfig.selectedSearchType = event.target.value;
                    // Regenerate steps and restart animation via main.js
                     const main = window.algorithmVisualizerMain;
                     if (main) {
                        const newSteps = currentConfig.generateSteps(root, nodeMap, currentConfig.selectedSearchType);
                        main.animationState.steps = newSteps;
                        main.animationState.currentStep = -1;
                        main.resetToStart();
                         document.getElementById('status-message').textContent = newSteps[0].message; // Show first message
                         main.updateButtonStates();
                     } else {
                         console.error("Main visualizer context not found.");
                     }
                }
            });
            label.appendChild(radio);
            label.appendChild(document.createTextNode(type.toUpperCase()));
            label.htmlFor = `radio-${type}`;
            selectorContainer.appendChild(label);
        });

        // --- Node Container & Result Display ---
        const nodesContainer = document.createElement('div');
        nodesContainer.id = 'tree-nodes-container';
        nodesContainer.className = 'tree-nodes-container';
        treeContainer.appendChild(nodesContainer);

        const resultContainer = document.createElement('div');
        resultContainer.id = 'bfs-dfs-result-container'; // New ID
        resultContainer.className = 'bfs-dfs-result-container'; // New class
        treeContainer.appendChild(resultContainer);

        // --- 3. Calculate Positions & Create DOM Elements ---
        const nodeElements = {}; let currentInorderIndex = 0;
        const assignInorderIndex = (node) => { if (!node) return; assignInorderIndex(node.left); node.inorderIndex = currentInorderIndex++; assignInorderIndex(node.right); };
        assignInorderIndex(root);

        const levels = []; let bfsQueue = [{ node: root, level: 0 }]; let visitedLayout = new Set(); let maxLevel = 0;
        while (bfsQueue.length > 0) {
            const { node, level } = bfsQueue.shift();
            if (!node || visitedLayout.has(node.id)) continue; visitedLayout.add(node.id);
            node.level = level; maxLevel = Math.max(maxLevel, level);
            if (!levels[level]) levels[level] = []; levels[level].push(node);
            if (node.left) bfsQueue.push({ node: node.left, level: level + 1 });
            if (node.right) bfsQueue.push({ node: node.right, level: level + 1 });
        }

        const verticalGap = 70; const totalNodesForLayout = visitedLayout.size; const horizontalPaddingPercent = 5;
        Object.values(nodeMap).forEach(node => {
            node.y = node.level * verticalGap + 30;
            const availableWidthPercent = 100 - (2 * horizontalPaddingPercent);
            node.x = horizontalPaddingPercent + (totalNodesForLayout <= 1 ? availableWidthPercent / 2 : (node.inorderIndex / (totalNodesForLayout - 1)) * availableWidthPercent);

            const nodeDiv = document.createElement('div');
            nodeDiv.id = node.id; nodeDiv.className = 'tree-node';
            nodeDiv.textContent = node.value; nodeDiv.title = `Node Value: ${node.value}`;
            nodeDiv.style.top = `${node.y}px`; nodeDiv.style.left = `${node.x}%`;
            nodeDiv.style.transform = 'translateX(-50%)'; // Center horizontally
            nodeDiv.style.opacity = '1'; nodeDiv.style.pointerEvents = 'auto';
            nodesContainer.appendChild(nodeDiv);
            node.domElement = nodeDiv; nodeElements[node.id] = nodeDiv;
        });
        nodesContainer.style.minHeight = `${(maxLevel + 1) * verticalGap + 20}px`;

        // --- 4. Generate Initial Steps (for default selected type) ---
        const initialSteps = currentConfig.generateSteps(root, nodeMap, currentConfig.selectedSearchType);

        return { steps: initialSteps, elements: nodeElements };
    }, // End of setup

    // --- Step Generation Function (called by setup and radio buttons) ---
    generateSteps: function(root, nodeMap, type) {
        const currentConfig = this;
        let steps = [];
        let searchResult = [];
        let nodeStates = {}; // 'visiting', 'processing', 'visited', 'queued', 'stacked'
        Object.keys(nodeMap).forEach(id => nodeStates[id] = 'initial'); // Start state

        const startMessage = `Starting ${type.toUpperCase()} Traversal.`;
        steps.push({ type: 'start', nodeId: root?.id, result: [...searchResult], states: {...nodeStates}, message: startMessage });

        if (!root) {
            steps.push({ type: 'finish', nodeId: null, result: [], states: {}, message: 'Tree is empty.' });
            return steps;
        }

        // --- BFS Step Generation ---
        if (type === 'bfs') {
            const queue = [{ node: root, id: root.id }]; // Store node object and id
            nodeStates[root.id] = 'queued';
            steps.push({ type: 'queue-add', nodeId: root.id, queueState: queue.map(item => item.id), result: [...searchResult], states: {...nodeStates}, message: `Add root ${root.value} to queue.` });

            while (queue.length > 0) {
                const { node: currentNode, id: currentId } = queue.shift();
                nodeStates[currentId] = 'processing';
                steps.push({ type: 'queue-remove', nodeId: currentId, queueState: queue.map(item => item.id), result: [...searchResult], states: {...nodeStates}, message: `Dequeue ${currentNode.value}.` });

                searchResult.push(currentNode.value);
                steps.push({ type: 'process', nodeId: currentId, result: [...searchResult], states: {...nodeStates}, message: `Process ${currentNode.value}. Result: [${searchResult.join(', ')}]` });

                if (currentNode.left) {
                    const leftChildId = currentNode.left.id;
                     if (nodeStates[leftChildId] === 'initial') { // Only queue if not seen
                        nodeStates[leftChildId] = 'queued';
                        queue.push({ node: currentNode.left, id: leftChildId });
                        steps.push({ type: 'queue-add', nodeId: leftChildId, parentId: currentId, queueState: queue.map(item => item.id), result: [...searchResult], states: {...nodeStates}, message: `Add left child ${currentNode.left.value} to queue.` });
                    }
                }
                if (currentNode.right) {
                     const rightChildId = currentNode.right.id;
                     if (nodeStates[rightChildId] === 'initial') { // Only queue if not seen
                        nodeStates[rightChildId] = 'queued';
                        queue.push({ node: currentNode.right, id: rightChildId });
                        steps.push({ type: 'queue-add', nodeId: rightChildId, parentId: currentId, queueState: queue.map(item => item.id), result: [...searchResult], states: {...nodeStates}, message: `Add right child ${currentNode.right.value} to queue.` });
                    }
                }
                nodeStates[currentId] = 'visited'; // Mark visited after processing children
                steps.push({ type: 'mark-visited', nodeId: currentId, result: [...searchResult], states: {...nodeStates}, message: `Finished processing ${currentNode.value}.` });
            }
        }
        // --- DFS Step Generation (Preorder Example) ---
        else if (type === 'dfs') {
            function dfsRecursive(node) {
                if (node === null) {
                    steps.push({ type: 'null-check', nodeId: null, result: [...searchResult], states: {...nodeStates}, message: `Reached null.` });
                    return;
                }
                const nodeId = node.id;
                nodeStates[nodeId] = 'processing';
                searchResult.push(node.value);
                steps.push({ type: 'process', nodeId: nodeId, result: [...searchResult], states: {...nodeStates}, message: `Process ${node.value}. Result: [${searchResult.join(', ')}]` });

                nodeStates[nodeId] = 'visiting-left';
                steps.push({ type: 'visit-left', nodeId: nodeId, result: [...searchResult], states: {...nodeStates}, message: `Go left from ${node.value}.` });
                dfsRecursive(node.left);

                nodeStates[nodeId] = 'visiting-right';
                 steps.push({ type: 'return-from-left', nodeId: nodeId, result: [...searchResult], states: {...nodeStates}, message: `Return from left subtree of ${node.value}.` });
                 steps.push({ type: 'visit-right', nodeId: nodeId, result: [...searchResult], states: {...nodeStates}, message: `Go right from ${node.value}.` });
                dfsRecursive(node.right);

                nodeStates[nodeId] = 'visited';
                 steps.push({ type: 'return-from-right', nodeId: nodeId, result: [...searchResult], states: {...nodeStates}, message: `Return from right subtree of ${node.value}. Finished ${node.value}.` });
            }
            dfsRecursive(root);
        }

        Object.keys(nodeMap).forEach(id => { // Ensure final state is 'visited'
             if(nodeStates[id] !== 'visited') nodeStates[id] = 'visited';
        });
        const finishMessage = `${type.toUpperCase()} Traversal Complete. Final Result: [${searchResult.join(', ')}]`;
        steps.push({ type: 'finish', nodeId: null, result: [...searchResult], states: {...nodeStates}, message: finishMessage });

        return steps;
    }, // End of generateSteps

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        const currentConfig = this;
        if (!step || !elements || !step.states) { console.error("BFS/DFS RenderStep: Missing data"); return; }

        Object.keys(elements).forEach(nodeId => {
            const nodeEl = elements[nodeId]; if (!nodeEl) return;
            const state = step.states[nodeId];
            // Reset common classes
            nodeEl.classList.remove('initial', 'visiting', 'processing', 'visited', 'queued', 'stacked', 'visiting-left', 'visiting-right', 'comparing', 'node-path', 'inserting');
            nodeEl.style.opacity = '1'; nodeEl.style.pointerEvents = 'auto'; // Ensure visibility

            switch (state) {
                case 'initial': break; // Default visible state
                case 'queued': nodeEl.classList.add('queued'); break; // Style for BFS queue
                case 'stacked': nodeEl.classList.add('stacked'); break; // Style for iterative DFS stack (if used)
                case 'processing': nodeEl.classList.add('processing'); break; // Node currently being processed
                case 'visiting': // General visiting state (if needed)
                case 'visiting-left':
                case 'visiting-right':
                    nodeEl.classList.add('visiting'); // Use visiting style
                    break;
                case 'visited': nodeEl.classList.add('visited'); break; // Node fully processed
            }
        });
        if(step.type === 'finish'){
             Object.values(elements).forEach(nodeEl => { if(nodeEl) nodeEl.classList.add('visited'); });
        }


        // Update result display
        const resultContainer = document.getElementById('bfs-dfs-result-container');
        if (resultContainer) {
            const typeLabel = currentConfig.selectedSearchType.toUpperCase();
            resultContainer.innerHTML = `<span>${typeLabel} Result:</span>`;
            if (step.result && Array.isArray(step.result)) {
                step.result.forEach(val => { const span = document.createElement('span'); span.textContent = val; resultContainer.appendChild(span); });
            }
        }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) { statusMessageEl.textContent = step.message; }
    } // End of renderStep
}; // End of treeBfsDfsConfig