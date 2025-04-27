// js/algorithms/bst.js

const bstConfig = {
    name: 'Binary Search Tree (Insertion)',
    type: 'tree', // Identifier for tree algorithms
    code: `<span class="code-keyword">class</span> <span class="code-function">TreeNode</span> {
  <span class="code-function">constructor</span>(value) {
    <span class="code-keyword">this</span>.value = value;
    <span class="code-keyword">this</span>.left = <span class="code-keyword">null</span>;
    <span class="code-keyword">this</span>.right = <span class="code-keyword">null</span>;
  }
}

<span class="code-keyword">function</span> <span class="code-function">insert</span>(node, value) {
  <span class="code-comment">// 1. If the tree/subtree is empty, return a new node</span>
  <span class="code-keyword">if</span> (node === <span class="code-keyword">null</span>) {
    <span class="code-keyword">return</span> <span class="code-keyword">new</span> <span class="code-function">TreeNode</span>(value);
  }

  <span class="code-comment">// 2. Compare the new value with the node's value</span>
  <span class="code-comment">// Visualize comparison</span>
  <span class="code-keyword">if</span> (value < node.value) {
    <span class="code-comment">// Visualize going left</span>
    node.left = <span class="code-function">insert</span>(node.left, value); <span class="code-comment">// Recur down the left</span>
  } <span class="code-keyword">else</span> { <span class="code-comment">// value >= node.value</span>
    <span class="code-comment">// Visualize going right</span>
    node.right = <span class="code-function">insert</span>(node.right, value); <span class="code-comment">// Recur down the right</span>
  }

  <span class="code-comment">// 3. Return the unchanged node pointer</span>
  <span class="code-keyword">return</span> node;
}`,
    pseudocode: `Insert(node, value):
  // Base Case: If the current node is null, we found the spot
  if node is null:
    return CreateNode(value) // Create and return the new node

  // Recursive Step: Compare and decide direction
  // Visualize: Compare value with node.value
  if value < node.value:
    // Visualize: Go Left
    node.left = Insert(node.left, value) // Recursively insert in left subtree
  else: // value >= node.value
    // Visualize: Go Right
    node.right = Insert(node.right, value) // Recursively insert in right subtree

  // Return the current node (its child link might have been updated)
  return node`,

    setup: (data) => { // data is ignored, generating randomly
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = '';
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        // --- Node Structure ---
        class TreeNode {
            constructor(value, id) {
                this.value = value; this.left = null; this.right = null; this.id = id;
                this.domElement = null; this.level = 0; this.position = 0; this.x = 0; this.y = 0;
                this.parentId = null; this.parentDirection = null;
                this.inorderIndex = 0; // For layout
            }
        }
        let nodeCounter = 0;
        function createNode(value) { return new TreeNode(value, `node-${nodeCounter++}`); }

        // --- 1. Generate Random Sequence & Build Tree ---
        const minValue = 1;
        const maxValue = 99;
        const minNodes = 7;
        const maxNodes = 12;
        const numNodes = Math.floor(Math.random() * (maxNodes - minNodes + 1)) + minNodes;
        const valuesToInsert = [];
        const generatedValues = new Set();

        console.log(`Generating random BST with ${numNodes} unique nodes (values ${minValue}-${maxValue}).`);
        while (valuesToInsert.length < numNodes) {
            const randomVal = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
            if (!generatedValues.has(randomVal)) {
                generatedValues.add(randomVal);
                valuesToInsert.push(randomVal);
            }
            if (generatedValues.size >= (maxValue - minValue + 1)) {
                 console.warn("Could not generate enough unique values in the range.");
                 break;
            }
        }
        console.log("Values to insert:", valuesToInsert);

        let root = null;
        const nodeMap = {}; // Maps ID to the node object

        function buildTreeInsert(node, value) {
             if (node === null) { const newNode = createNode(value); nodeMap[newNode.id] = newNode; return newNode; }
             if (value < node.value) {
                 if (node.left === null) { const newNode = createNode(value); nodeMap[newNode.id] = newNode; newNode.parentId = node.id; newNode.parentDirection = 'left'; node.left = newNode; }
                 else { buildTreeInsert(node.left, value); }
             } else { // value >= node.value
                 if (node.right === null) { const newNode = createNode(value); nodeMap[newNode.id] = newNode; newNode.parentId = node.id; newNode.parentDirection = 'right'; node.right = newNode; }
                 else { buildTreeInsert(node.right, value); }
             }
             return node;
        }
        valuesToInsert.forEach((value, index) => {
             if (index === 0) { root = createNode(value); nodeMap[root.id] = root;}
             else { buildTreeInsert(root, value); }
        });
        if (!root) {
             extraVisualizationArea.innerHTML = '<p>Tree is empty or failed to generate.</p>';
             return { steps: [], elements: {} };
        }

        // --- 2. Create Visualization Containers ---
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-visualization-container';
        extraVisualizationArea.appendChild(treeContainer);
        const nodesContainer = document.createElement('div');
        nodesContainer.id = 'tree-nodes-container';
        nodesContainer.className = 'tree-nodes-container';
        treeContainer.appendChild(nodesContainer);

        // --- 3. Calculate Positions (BFS for Level, Inorder for X) & Create DOM ---
        const nodeElements = {};
        let currentInorderIndex = 0;
        const assignInorderIndex = (node) => {
            if (node === null) return;
            assignInorderIndex(node.left);
            node.inorderIndex = currentInorderIndex++;
            assignInorderIndex(node.right);
        };
        assignInorderIndex(root);

        const levels = []; let queue = [{ node: root, level: 0 }]; let visited = new Set(); let maxLevel = 0;
        while (queue.length > 0) {
            const { node, level } = queue.shift();
            if (!node || visited.has(node.id)) continue; visited.add(node.id);
            node.level = level; maxLevel = Math.max(maxLevel, level);
            if (!levels[level]) levels[level] = []; levels[level].push(node);
            if (node.left) queue.push({ node: node.left, level: level + 1 });
            if (node.right) queue.push({ node: node.right, level: level + 1 });
        }

        const verticalGap = 70;
        const totalNodes = Object.keys(nodeMap).length;
        const horizontalPaddingPercent = 5;

        Object.values(nodeMap).forEach(node => {
            node.y = node.level * verticalGap + 30;
            const availableWidthPercent = 100 - (2 * horizontalPaddingPercent);
            node.x = horizontalPaddingPercent + (totalNodes <= 1 ? availableWidthPercent / 2 : (node.inorderIndex / (totalNodes - 1)) * availableWidthPercent);

            const nodeDiv = document.createElement('div');
            nodeDiv.id = node.id;
            nodeDiv.className = 'tree-node'; // Base class (visible by default CSS)
            nodeDiv.textContent = node.value;
            nodeDiv.title = `Node Value: ${node.value}`;
            nodeDiv.style.top = `${node.y}px`;
            nodeDiv.style.left = `${node.x}%`;
            // Set initial hidden state ONLY for BST nodes via JS
            nodeDiv.style.opacity = '0';
            nodeDiv.style.pointerEvents = 'none';

            nodesContainer.appendChild(nodeDiv);
            node.domElement = nodeDiv;
            nodeElements[node.id] = nodeDiv;
        });
        nodesContainer.style.minHeight = `${(maxLevel + 1) * verticalGap + 20}px`;

        // --- 4. Generate Insertion Visualization Steps with State Tracking ---
        let steps = [];
        // State: 'hidden', 'visible', 'path', 'comparing', 'inserting'
        let nodeStates = {};
        Object.keys(nodeElements).forEach(id => nodeStates[id] = 'hidden');

        if (root) { nodeStates[root.id] = 'visible'; }
        steps.push({ type: 'initial-tree', value: null, states: {...nodeStates}, message: `Initial Tree (Root: ${root ? root.value : 'None'})` });

        function generateInsertionSteps(valueToInsert) {
             Object.keys(nodeStates).forEach(id => { if (nodeStates[id] === 'path' || nodeStates[id] === 'comparing' || nodeStates[id] === 'inserting') nodeStates[id] = 'visible'; });
            steps.push({ type: 'start-insert', value: valueToInsert, states: {...nodeStates}, message: `Start inserting value: ${valueToInsert}`});
            let current = root; let parent = null; let direction = null; let insertedNodeId = null;
            while (current !== null) {
                parent = current; nodeStates[current.id] = 'comparing'; steps.push({ type: 'compare', nodeId: current.id, value: valueToInsert, states: {...nodeStates}, message: `Compare ${valueToInsert} with ${current.value}`});
                nodeStates[current.id] = 'path'; // Mark as path after comparison
                if (valueToInsert < current.value) { direction = 'left'; steps.push({ type: 'go-left', nodeId: current.id, states: {...nodeStates}, message: `Go left from ${current.value}`}); current = current.left; }
                else { direction = 'right'; steps.push({ type: 'go-right', nodeId: current.id, states: {...nodeStates}, message: `Go right from ${current.value}`}); current = current.right; }
            }
            insertedNodeId = Object.values(nodeMap).find(n => n.parentId === parent?.id && n.parentDirection === direction && n.value === valueToInsert)?.id;
            if (insertedNodeId) {
                 nodeStates[insertedNodeId] = 'inserting'; if(parent) nodeStates[parent.id] = 'path'; steps.push({ type: 'insert-at', parentId: parent?.id, direction: direction, insertedNodeId: insertedNodeId, value: valueToInsert, states: {...nodeStates}, message: `Insert ${valueToInsert}`});
                 nodeStates[insertedNodeId] = 'visible'; steps.push({ type: 'finish-insert', value: valueToInsert, states: {...nodeStates}, message: `Finished inserting ${valueToInsert}`});
            } else {
                 console.error("Could not find node ID for insert step:", { valueToInsert, parentId: parent?.id, direction });
                 steps.push({ type: 'error', states: {...nodeStates}, message: `Error finding node for inserting ${valueToInsert}` });
                 Object.keys(nodeStates).forEach(id => { if (nodeStates[id] === 'path') nodeStates[id] = 'visible'; });
                 steps.push({ type: 'error-reset', states: {...nodeStates}, message: `Resetting highlights after error.` });
            }
        }
        valuesToInsert.forEach((value, index) => { if(index > 0) { generateInsertionSteps(value); } });
        Object.keys(nodeStates).forEach(id => { if(nodeStates[id] !== 'hidden') nodeStates[id] = 'visible'; });
        steps.push({ type: 'finish-all', states: {...nodeStates}, message: 'All insertions complete.' });

        return { steps, elements: nodeElements };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: (step, elements, animationState) => {
        if (!step || !elements || !step.states) { console.error("BST RenderStep: Missing step, elements, or states"); return; }
        Object.keys(elements).forEach(nodeId => {
            const nodeEl = elements[nodeId]; if (!nodeEl) return;
            const state = step.states[nodeId];
            nodeEl.classList.remove('comparing', 'node-path', 'inserting', 'visited', 'visiting', 'processing'); // Reset all possible classes
            if (state === 'hidden') { nodeEl.style.opacity = '0'; nodeEl.style.pointerEvents = 'none'; }
            else {
                 nodeEl.style.opacity = '1'; nodeEl.style.pointerEvents = 'auto';
                 switch (state) {
                     case 'comparing': nodeEl.classList.add('comparing'); break;
                     case 'path': nodeEl.classList.add('node-path'); break;
                     case 'inserting': nodeEl.classList.add('inserting'); break;
                     case 'visible': /* Default visible */ break;
                 }
            }
        });
        const statusMessageEl = document.getElementById('status-message'); if (statusMessageEl && step.message) { statusMessageEl.textContent = step.message; }
    } // End of renderStep
}; // End of bstConfig