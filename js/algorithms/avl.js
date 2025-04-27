// js/algorithms/avl.js

const avlConfig = {
    name: 'AVL Tree (Insertion & Rotations)',
    type: 'tree',
    code: `<span class="code-keyword">class</span> <span class="code-function">AvlNode</span> { <span class="code-comment">/* ... */</span> }

<span class="code-keyword">function</span> <span class="code-function">getHeight</span>(node) { <span class="code-comment">/* ... */</span> }
<span class="code-keyword">function</span> <span class="code-function">getBalanceFactor</span>(node) { <span class="code-comment">/* ... */</span> }
<span class="code-keyword">function</span> <span class="code-function">rightRotate</span>(y) { <span class="code-comment">/* ... */</span> }
<span class="code-keyword">function</span> <span class="code-function">leftRotate</span>(x) { <span class="code-comment">/* ... */</span> }

<span class="code-keyword">function</span> <span class="code-function">insert</span>(node, value) {
  <span class="code-comment">// 1. Standard BST Insert</span>
  <span class="code-keyword">if</span> (node === <span class="code-keyword">null</span>) <span class="code-keyword">return</span> <span class="code-keyword">new</span> <span class="code-function">AvlNode</span>(value);
  <span class="code-keyword">if</span> (value < node.value) node.left = <span class="code-function">insert</span>(node.left, value);
  <span class="code-keyword">else if</span> (value > node.value) node.right = <span class="code-function">insert</span>(node.right, value);
  <span class="code-keyword">else return</span> node; <span class="code-comment">// Duplicate values not allowed/handled</span>

  <span class="code-comment">// 2. Update height of current node</span>
  node.height = <span class="code-number">1</span> + Math.<span class="code-function">max</span>(<span class="code-function">getHeight</span>(node.left), <span class="code-function">getHeight</span>(node.right));
  <span class="code-comment">// Visualize height update</span>

  <span class="code-comment">// 3. Get balance factor</span>
  <span class="code-keyword">let</span> balance = <span class="code-function">getBalanceFactor</span>(node);
  <span class="code-comment">// Visualize balance check</span>

  <span class="code-comment">// 4. Perform rotations if unbalanced</span>
  <span class="code-comment">// Left Left Case</span>
  <span class="code-keyword">if</span> (balance > <span class="code-number">1</span> && value < node.left.value) {
    <span class="code-comment">// Visualize LL imbalance and right rotation</span>
    <span class="code-keyword">return</span> <span class="code-function">rightRotate</span>(node);
  }
  <span class="code-comment">// Right Right Case</span>
  <span class="code-keyword">if</span> (balance < -<span class="code-number">1</span> && value > node.right.value) {
     <span class="code-comment">// Visualize RR imbalance and left rotation</span>
    <span class="code-keyword">return</span> <span class="code-function">leftRotate</span>(node);
  }
  <span class="code-comment">// Left Right Case</span>
  <span class="code-keyword">if</span> (balance > <span class="code-number">1</span> && value > node.left.value) {
    <span class="code-comment">// Visualize LR imbalance and rotations</span>
    node.left = <span class="code-function">leftRotate</span>(node.left);
    <span class="code-keyword">return</span> <span class="code-function">rightRotate</span>(node);
  }
  <span class="code-comment">// Right Left Case</span>
  <span class="code-keyword">if</span> (balance < -<span class="code-number">1</span> && value < node.right.value) {
    <span class="code-comment">// Visualize RL imbalance and rotations</span>
    node.right = <span class="code-function">rightRotate</span>(node.right);
    <span class="code-keyword">return</span> <span class="code-function">leftRotate</span>(node);
  }

  <span class="code-comment">// Return unchanged node pointer (if balanced)</span>
  <span class="code-keyword">return</span> node;
}`,
    pseudocode: `Insert(node, value):
  // 1. Perform standard BST insertion
  if node is null: return CreateNode(value)
  if value < node.value: node.left = Insert(node.left, value)
  else if value > node.value: node.right = Insert(node.right, value)
  else: return node // Duplicate

  // 2. Update height of the ancestor node
  node.height = 1 + max(Height(node.left), Height(node.right))
  // Visualize height update

  // 3. Get the balance factor
  balance = GetBalance(node)
  // Visualize balance check

  // 4. If node becomes unbalanced, perform rotations
  // Left Left Case (LL)
  if balance > 1 and value < node.left.value:
    // Visualize LL imbalance
    return RightRotate(node) // Visualize Right Rotation

  // Right Right Case (RR)
  if balance < -1 and value > node.right.value:
    // Visualize RR imbalance
    return LeftRotate(node) // Visualize Left Rotation

  // Left Right Case (LR)
  if balance > 1 and value > node.left.value:
    // Visualize LR imbalance
    node.left = LeftRotate(node.left) // Visualize Left Rotation on child
    return RightRotate(node)          // Visualize Right Rotation on node

  // Right Left Case (RL)
  if balance < -1 and value < node.right.value:
    // Visualize RL imbalance
    node.right = RightRotate(node.right) // Visualize Right Rotation on child
    return LeftRotate(node)             // Visualize Left Rotation on node

  // Return the (possibly updated) node pointer
  return node`,

  setup: (data) => {
    const extraVisualizationArea = document.getElementById('extra-visualization-area');
    extraVisualizationArea.innerHTML = '';
    const mainVisualizationArea = document.getElementById('visualization-area');
    if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

    // --- AVL Node Structure ---
    class AvlNode {
        constructor(value, id) {
            this.value = value; this.left = null; this.right = null; this.id = id;
            this.height = 1;
            this.domElement = null; this.level = 0; this.position = 0; this.x = 0; this.y = 0;
            this.inorderIndex = 0;
        }
    }
    let nodeCounter = 0;
    function createAvlNode(value) { return new AvlNode(value, `avl-node-${nodeCounter++}`); }

    // --- 1. Generate Random Sequence ---
    const minValue = 1; const maxValue = 99; const minNodes = 7; const maxNodes = 10; // Reduced max nodes slightly
    const numNodes = Math.floor(Math.random() * (maxNodes - minNodes + 1)) + minNodes;
    const valuesToInsert = []; const generatedValues = new Set();
    while (valuesToInsert.length < numNodes) { /* ... (keep unique value generation) ... */
         const randomVal = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
         if (!generatedValues.has(randomVal)) { generatedValues.add(randomVal); valuesToInsert.push(randomVal); }
         if (generatedValues.size >= (maxValue - minValue + 1)) break;
    }
    console.log("AVL Values to insert:", valuesToInsert);

    // --- 2. Generate Steps by Simulating Insertions and Rotations ---
    let root = null;
    let steps = [];
    let nodeMap = {}; // Still needed to map final nodes to DOM elements
    let nodeStates = {}; // Tracks state for visualization

    // --- AVL Core Logic with SIMPLIFIED Step Generation ---
    function getHeight(node) { return node ? node.height : 0; }
    function getBalanceFactor(node) { return node ? getHeight(node.left) - getHeight(node.right) : 0; }

    // Keep track of all nodes created during the process for final layout/DOM creation
    let allNodesCreated = {};

    function rightRotate(y) {
        const y_id = y.id;
        const x = y.left;
        if (!x) return y; // Should not happen in valid AVL rotation scenario, but safety check
        const x_id = x.id;

        // Step: Start Rotation
        nodeStates[y_id] = 'rotating'; nodeStates[x_id] = 'rotating';
        steps.push({ type: 'start-rotate', rotationType: 'right', nodes: [y_id, x_id], states: { ...nodeStates }, message: `Right-rotating around ${y.value}` });

        // Perform rotation
        const T2 = x.right;
        x.right = y;
        y.left = T2;

        // Update heights
        y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));

         // Update map references (important!)
         allNodesCreated[y_id] = y;
         allNodesCreated[x_id] = x;
         if(T2) allNodesCreated[T2.id] = T2;


        // Step: Finish Rotation
        nodeStates[y_id] = 'visible'; nodeStates[x_id] = 'visible';
        steps.push({ type: 'finish-rotate', rotationType: 'right', nodes: [y_id, x_id], newRootId: x_id, states: { ...nodeStates }, message: `Finished right rotation. New root: ${x.value}` });

        return x; // Return new root
    }

    function leftRotate(x) {
        const x_id = x.id;
        const y = x.right;
        if (!y) return x; // Safety check
        const y_id = y.id;

         // Step: Start Rotation
        nodeStates[x_id] = 'rotating'; nodeStates[y_id] = 'rotating';
        steps.push({ type: 'start-rotate', rotationType: 'left', nodes: [x_id, y_id], states: { ...nodeStates }, message: `Left-rotating around ${x.value}` });

        // Perform rotation
        const T2 = y.left;
        y.left = x;
        x.right = T2;

        // Update heights
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
        y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));

         // Update map references (important!)
         allNodesCreated[x_id] = x;
         allNodesCreated[y_id] = y;
         if(T2) allNodesCreated[T2.id] = T2;

        // Step: Finish Rotation
        nodeStates[x_id] = 'visible'; nodeStates[y_id] = 'visible';
        steps.push({ type: 'finish-rotate', rotationType: 'left', nodes: [x_id, y_id], newRootId: y_id, states: { ...nodeStates }, message: `Finished left rotation. New root: ${y.value}` });

        return y; // Return new root
    }

    function insertWithSteps(node, value) {
        if (node === null) {
            const newNode = createAvlNode(value);
            allNodesCreated[newNode.id] = newNode; // Track all created nodes
            nodeStates[newNode.id] = 'inserting';
            steps.push({ type: 'insert-new', nodeId: newNode.id, value: value, states: { ...nodeStates }, message: `Insert new node ${value}` });
            nodeStates[newNode.id] = 'visible'; // Becomes visible right after insertion step
            return newNode;
        }

        // --- Simplified Path/Compare Steps ---
        nodeStates[node.id] = 'comparing';
        steps.push({ type: 'compare', nodeId: node.id, value: value, states: { ...nodeStates }, message: `Compare ${value} with ${node.value}` });
        // nodeStates[node.id] = 'path'; // Optional: uncomment if distinct path style is desired after compare

        if (value < node.value) {
             // steps.push({ type: 'go-left', ... }); // Reduced verbosity
            node.left = insertWithSteps(node.left, value);
        } else if (value > node.value) {
             // steps.push({ type: 'go-right', ... }); // Reduced verbosity
            node.right = insertWithSteps(node.right, value);
        } else {
            nodeStates[node.id] = 'visible';
            steps.push({ type: 'duplicate', nodeId: node.id, value: value, states: { ...nodeStates }, message: `Duplicate value ${value}.` });
            return node; // Duplicate
        }

        // Reset current node state after recursion returns
        nodeStates[node.id] = 'visible';

        // --- Update height (no specific step generated) ---
        node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));

        // --- Get balance factor and check ---
        let balance = getBalanceFactor(node);
        // steps.push({ type: 'check-balance', ... }); // Reduced verbosity

        if (balance > 1 || balance < -1) {
             nodeStates[node.id] = 'imbalanced';
             steps.push({ type: 'imbalanced', nodeId: node.id, balance: balance, states: { ...nodeStates }, message: `Node ${node.value} imbalanced (${balance})! Rotation needed.` });
        }

        // --- Perform rotations if unbalanced (with null checks) ---
        if (balance > 1 && node.left && value < node.left.value) { // LL
            // steps.push({ type: 'rotation-needed', case: 'LL', ... }); // Reduced verbosity
            return rightRotate(node);
        }
        if (balance < -1 && node.right && value > node.right.value) { // RR
            // steps.push({ type: 'rotation-needed', case: 'RR', ... }); // Reduced verbosity
            return leftRotate(node);
        }
        if (balance > 1 && node.left && value > node.left.value) { // LR
            // steps.push({ type: 'rotation-needed', case: 'LR', ... }); // Reduced verbosity
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }
        if (balance < -1 && node.right && value < node.right.value) { // RL
            // steps.push({ type: 'rotation-needed', case: 'RL', ... }); // Reduced verbosity
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }

        // Return node if balanced
         if (Math.abs(balance) <= 1 && nodeStates[node.id] !== 'imbalanced') { // Don't add 'balanced' step if it was just marked imbalanced but didn't rotate (e.g. due to null child check)
            // steps.push({ type: 'balanced', ... }); // Reduced verbosity
         }
        return node;
    }
    // --- End AVL Core Logic ---

    // Simulate insertions to generate steps
    valuesToInsert.forEach((value) => {
        // Reset temporary states before inserting next value
        Object.keys(nodeStates).forEach(id => { if (nodeStates[id] !== 'hidden' && nodeStates[id] !== 'visible') nodeStates[id] = 'visible'; });
        // steps.push({ type: 'start-overall-insert', ...}); // Reduced verbosity
        root = insertWithSteps(root, value);
        // Reset temporary states after insertion/balancing finishes
        Object.keys(nodeStates).forEach(id => { if (nodeStates[id] !== 'hidden' && nodeStates[id] !== 'visible') nodeStates[id] = 'visible'; });
        // steps.push({ type: 'finish-overall-insert', ...});// Reduced verbosity
    });


    if (!root) { return { steps: [], elements: {} }; }

    // --- 3. Create Containers ---
    const treeContainer = document.createElement('div'); /* ... */ extraVisualizationArea.appendChild(treeContainer);
    const nodesContainer = document.createElement('div'); /* ... */ treeContainer.appendChild(nodesContainer);

    // --- 4. Calculate Final Layout and Create DOM Elements ---
    let finalNodeElements = {}; currentInorderIndex = 0;
    const assignFinalInorderIndex = (node) => { if (!node) return; assignFinalInorderIndex(node.left); node.inorderIndex = currentInorderIndex++; assignFinalInorderIndex(node.right); };
    assignFinalInorderIndex(root); // Assign inorder index on final tree

    const finalLevels = {}; let finalQueue = [{ n: root, l: 0 }]; let finalVisited = new Set(); let finalMaxLevel = 0;
    while (finalQueue.length > 0) { // Calculate levels on final tree
        const { n, l } = finalQueue.shift(); if (!n || finalVisited.has(n.id)) continue; finalVisited.add(n.id);
        finalLevels[n.id] = l; finalMaxLevel = Math.max(finalMaxLevel, l);
        if (n.left) finalQueue.push({ n: n.left, l: l + 1 }); if (n.right) finalQueue.push({ n: n.right, l: l + 1 });
    }

    const finalTotalNodes = finalVisited.size; const verticalGap = 70; const horizontalPaddingPercent = 5;
    Object.values(allNodesCreated).forEach(node => { // Use allNodesCreated map
        node.level = finalLevels[node.id] ?? node.level; // Get final level
        node.y = node.level * verticalGap + 30;
        const availableWidthPercent = 100 - (2 * horizontalPaddingPercent);
        node.x = horizontalPaddingPercent + (finalTotalNodes <= 1 ? availableWidthPercent / 2 : (node.inorderIndex / (finalTotalNodes - 1)) * availableWidthPercent);

        const nodeDiv = document.createElement('div');
        nodeDiv.id = node.id; nodeDiv.className = 'tree-node'; nodeDiv.textContent = node.value; nodeDiv.title = `Node Value: ${node.value}`;
        nodeDiv.style.top = `${node.y}px`; nodeDiv.style.left = `${node.x}%`;
        nodeDiv.style.opacity = '0'; nodeDiv.style.pointerEvents = 'none'; // Start hidden
        nodesContainer.appendChild(nodeDiv);
        node.domElement = nodeDiv; finalNodeElements[node.id] = nodeDiv; // Add to final elements map
    });
    nodesContainer.style.minHeight = `${(finalMaxLevel + 1) * verticalGap + 20}px`;


    // --- Add initial state step ---
    Object.keys(finalNodeElements).forEach(id => nodeStates[id] = 'hidden');
    if (root) nodeStates[root.id] = 'visible';
    steps.unshift({ type: 'initial-layout', states: { ...nodeStates }, message: `AVL Tree Initialized. Root: ${root.value}` });


    // --- Final step state ---
    Object.keys(finalNodeElements).forEach(id => nodeStates[id] = 'visible'); // All visible at end
    steps.push({ type: 'finish-all', states: { ...nodeStates }, message: 'AVL Tree construction complete.' });

    console.log(`Generated ${steps.length} steps for AVL.`);
    return { steps, elements: finalNodeElements };
}, // End of setup

// --- renderStep Function ---
renderStep: (step, elements, animationState) => {
    if (!step || !elements || !step.states) { console.error("AVL RenderStep: Missing step, elements, or states"); return; }
    Object.keys(elements).forEach(nodeId => {
        const nodeEl = elements[nodeId]; if (!nodeEl) return;
        const state = step.states[nodeId];
        // Reset classes
        nodeEl.classList.remove('comparing', 'node-path', 'inserting', 'imbalanced', 'rotating', 'visited', 'visiting', 'processing');
        // Set Visibility & Pointer Events
        if (state === 'hidden') { nodeEl.style.opacity = '0'; nodeEl.style.pointerEvents = 'none'; }
        else {
             nodeEl.style.opacity = '1'; nodeEl.style.pointerEvents = 'auto';
             // Apply specific state class
             switch (state) {
                 case 'comparing': nodeEl.classList.add('comparing'); break;
                 //case 'path': nodeEl.classList.add('node-path'); break; // Path highlight removed for simplicity
                 case 'inserting': nodeEl.classList.add('inserting'); break;
                 case 'imbalanced': nodeEl.classList.add('imbalanced'); break;
                 case 'rotating': nodeEl.classList.add('rotating'); break;
                 case 'visible': /* Default visible */ break;
             }
        }
    });
    // Update status message
    const statusMessageEl = document.getElementById('status-message'); if (statusMessageEl && step.message) { statusMessageEl.textContent = step.message; }
} // End of renderStep
}; // End of avlConfig