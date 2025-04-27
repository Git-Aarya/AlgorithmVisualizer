// js/algorithms/tree-traversals.js

const treeTraversalsConfig = {
    name: 'Tree Traversals', // Generic name now
    type: 'tree',
    code: `<span class="code-keyword">function</span> <span class="code-function">traverse</span>(node, type) {
  <span class="code-keyword">if</span> (node === null) <span class="code-keyword">return</span>;

  <span class="code-keyword">if</span> (type === <span class="code-string">'preorder'</span>) <span class="code-function">process</span>(node); <span class="code-comment">// Process root first</span>
  <span class="code-function">traverse</span>(node.left, type); <span class="code-comment">// Go left</span>
  <span class="code-keyword">if</span> (type === <span class="code-string">'inorder'</span>) <span class="code-function">process</span>(node);  <span class="code-comment">// Process root after left</span>
  <span class="code-function">traverse</span>(node.right, type); <span class="code-comment">// Go right</span>
  <span class="code-keyword">if</span> (type === <span class="code-string">'postorder'</span>) <span class="code-function">process</span>(node); <span class="code-comment">// Process root last</span>
}`,
    pseudocode: `Traverse(node, type):
  if node is null: return

  if type is PREORDER: visit(node)
  Traverse(node.left, type)
  if type is INORDER: visit(node)
  Traverse(node.right, type)
  if type is POSTORDER: visit(node)`,

    selectedTraversalType: 'inorder', // Default

    setup: function(data, /* optional: */ requestedType = this.selectedTraversalType) {
        const currentConfig = this;
        currentConfig.selectedTraversalType = requestedType;

        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = '';
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        class TreeNode {
            constructor(value, id) {
                this.value = value; this.left = null; this.right = null; this.id = id;
                this.domElement = null; this.level = 0; this.position = 0; this.x = 0; this.y = 0;
                this.inorderIndex = 0; // For layout calculation if needed
            }
        }
        let nodeCounter = 0;
        function createNode(value) { return new TreeNode(value, `node-${nodeCounter++}`); }

        // --- Generate Random Tree ---
        let root = null;
        const minValue = 1; const maxValue = 99; const minNodes = 7; const maxNodes = 12;
        const numNodes = Math.floor(Math.random() * (maxNodes - minNodes + 1)) + minNodes;
        const values = []; const generatedValues = new Set();
        while (values.length < numNodes) {
             const randomVal = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
             if (!generatedValues.has(randomVal)) { generatedValues.add(randomVal); values.push(randomVal); }
             if (generatedValues.size >= (maxValue - minValue + 1)) break;
        }
        // Build a random structure tree (not necessarily BST)
        if (values.length > 0) {
            root = createNode(values[0]);
            const queue = [root]; let i = 1;
            while (i < values.length) {
                const current = queue.shift();
                // Add left child
                if (i < values.length) {
                    const leftChild = createNode(values[i++]);
                    current.left = leftChild;
                    queue.push(leftChild);
                }
                // Add right child
                if (i < values.length) {
                    const rightChild = createNode(values[i++]);
                    current.right = rightChild;
                    queue.push(rightChild);
                }
                if (queue.length === 0 && i < values.length) { // Restart queue if needed
                    queue.push(root); // Should not happen with typical BFS building
                }
            }
        }
         if (!root) {
              extraVisualizationArea.innerHTML = '<p>Failed to generate tree.</p>';
              return { steps: [], elements: {} };
         }

        // --- Create Visualization Containers & Controls ---
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-visualization-container';
        extraVisualizationArea.appendChild(treeContainer);

        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'traversal-type-selector';
        treeContainer.appendChild(selectorContainer);

        const types = ['inorder', 'preorder', 'postorder'];
        types.forEach(type => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio'; radio.name = 'traversalType'; radio.value = type;
            radio.checked = (type === currentConfig.selectedTraversalType);
            radio.addEventListener('change', (event) => {
                if (event.target.checked) {
                    currentConfig.selectedTraversalType = event.target.value;
                    // Use the existing mechanism to re-trigger setup via main.js
                    const generateBtn = document.getElementById('generate-data-btn');
                    if (generateBtn) { generateBtn.click(); }
                     else { console.error("Generate button not found for reset"); }
                }
            });
            label.appendChild(radio);
            label.appendChild(document.createTextNode(type.charAt(0).toUpperCase() + type.slice(1)));
            selectorContainer.appendChild(label);
        });

        const nodesContainer = document.createElement('div');
        nodesContainer.id = 'tree-nodes-container';
        nodesContainer.className = 'tree-nodes-container';
        treeContainer.appendChild(nodesContainer);

        const resultContainer = document.createElement('div');
        resultContainer.id = 'traversal-result-container';
        resultContainer.className = 'traversal-result-container';
        treeContainer.appendChild(resultContainer);

        // --- Calculate Positions & Create DOM Elements ---
        const nodeElements = {}; let currentInorderIndex = 0;
        const assignInorderIndex = (node) => { /* ... (keep inorder assignment) ... */
            if (node === null) return; assignInorderIndex(node.left); node.inorderIndex = currentInorderIndex++; assignInorderIndex(node.right);
        };
        assignInorderIndex(root);

        const levels = []; let bfsQueue = [{ node: root, level: 0 }]; let visited = new Set(); let maxLevel = 0;
        const nodeMapForLayout = {}; // Need map for easy lookup during BFS
        const buildMapQueue = [root];
        while(buildMapQueue.length > 0) {
             const node = buildMapQueue.shift();
             if(!node) continue;
             nodeMapForLayout[node.id] = node;
             if(node.left) buildMapQueue.push(node.left);
             if(node.right) buildMapQueue.push(node.right);
        }

        while (bfsQueue.length > 0) {
            const { node, level } = bfsQueue.shift();
            if (!node || visited.has(node.id)) continue; visited.add(node.id);
            node.level = level; maxLevel = Math.max(maxLevel, level);
            if (!levels[level]) levels[level] = []; levels[level].push(node);
            if (node.left) bfsQueue.push({ node: node.left, level: level + 1 });
            if (node.right) bfsQueue.push({ node: node.right, level: level + 1 });
        }

        const verticalGap = 70; const totalNodesForLayout = visited.size; const horizontalPaddingPercent = 5;
        Object.values(nodeMapForLayout).forEach(node => {
            node.y = node.level * verticalGap + 30;
            const availableWidthPercent = 100 - (2 * horizontalPaddingPercent);
            node.x = horizontalPaddingPercent + (totalNodesForLayout <= 1 ? availableWidthPercent / 2 : (node.inorderIndex / (totalNodesForLayout - 1)) * availableWidthPercent);

            const nodeDiv = document.createElement('div');
            nodeDiv.id = node.id;
            nodeDiv.className = 'tree-node'; // Visible by default
            nodeDiv.textContent = node.value;
            nodeDiv.title = `Node Value: ${node.value}`;
            nodeDiv.style.top = `${node.y}px`;
            nodeDiv.style.left = `${node.x}%`;
            // Ensure visibility (since default CSS is now visible)
            nodeDiv.style.opacity = '1';
            nodeDiv.style.pointerEvents = 'auto';

            nodesContainer.appendChild(nodeDiv);
            node.domElement = nodeDiv;
            nodeElements[node.id] = nodeDiv;
        });
        nodesContainer.style.minHeight = `${(maxLevel + 1) * verticalGap + 20}px`;


        // --- Generate Traversal Steps (Based on Selected Type) ---
        let steps = []; let traversalResult = []; let nodeStates = {};
        Object.keys(nodeElements).forEach(id => nodeStates[id] = null); // Start visible, default style

        function generateInorderSteps(node) { /* ... (Keep function) ... */
            if (node === null) { steps.push({ type: 'null-check', nodeId: null, result: [...traversalResult], states: {...nodeStates}, message: `Reached null`}); return; }
            nodeStates[node.id] = 'visiting'; steps.push({ type: 'visit', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Visiting ${node.value}. Go left.` });
            generateInorderSteps(node.left);
            nodeStates[node.id] = 'visiting'; steps.push({ type: 'return-from-left', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Return from left of ${node.value}. Process.` });
            traversalResult.push(node.value); nodeStates[node.id] = 'processing'; steps.push({ type: 'process', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Process ${node.value}. Result: [${traversalResult.join(', ')}]` });
            nodeStates[node.id] = 'processing'; steps.push({ type: 'visit-right', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Visit ${node.value}. Go right.` });
            generateInorderSteps(node.right);
            nodeStates[node.id] = 'visited'; steps.push({ type: 'return-from-right', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Return from right of ${node.value}. Done.` });
        }
        function generatePreorderSteps(node) { /* ... (Keep function) ... */
            if (node === null) { steps.push({ type: 'null-check', nodeId: null, result: [...traversalResult], states: {...nodeStates}, message: `Reached null`}); return; }
            traversalResult.push(node.value); nodeStates[node.id] = 'processing'; steps.push({ type: 'process', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Process ${node.value}. Result: [${traversalResult.join(', ')}]` });
            nodeStates[node.id] = 'visiting-left'; steps.push({ type: 'visit-left', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Visit ${node.value}. Go left.` });
            generatePreorderSteps(node.left);
            nodeStates[node.id] = 'visiting-right'; steps.push({ type: 'visit-right', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Visit ${node.value}. Go right.` });
            generatePreorderSteps(node.right);
            nodeStates[node.id] = 'visited'; steps.push({ type: 'return', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Return from ${node.value}.` });
        }
        function generatePostorderSteps(node) { /* ... (Keep function) ... */
            if (node === null) { steps.push({ type: 'null-check', nodeId: null, result: [...traversalResult], states: {...nodeStates}, message: `Reached null`}); return; }
            nodeStates[node.id] = 'visiting-left'; steps.push({ type: 'visit-left', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Visit ${node.value}. Go left.` });
            generatePostorderSteps(node.left);
            nodeStates[node.id] = 'visiting-right'; steps.push({ type: 'visit-right', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Visit ${node.value}. Go right.` });
            generatePostorderSteps(node.right);
            traversalResult.push(node.value); nodeStates[node.id] = 'processing'; steps.push({ type: 'process', nodeId: node.id, result: [...traversalResult], states: {...nodeStates}, message: `Process ${node.value}. Result: [${traversalResult.join(', ')}]` });
            nodeStates[node.id] = 'visited'; // Mark visited after processing
        }

        const startMessage = `Starting ${currentConfig.selectedTraversalType.charAt(0).toUpperCase() + currentConfig.selectedTraversalType.slice(1)} Traversal.`;
        steps.push({ type: 'start', nodeId: root.id, result: [...traversalResult], states: {...nodeStates}, message: startMessage });
        if (currentConfig.selectedTraversalType === 'inorder') { generateInorderSteps(root); }
        else if (currentConfig.selectedTraversalType === 'preorder') { generatePreorderSteps(root); }
        else if (currentConfig.selectedTraversalType === 'postorder') { generatePostorderSteps(root); }
        Object.keys(nodeElements).forEach(id => nodeStates[id] = 'visited'); // Final state
        const finishMessage = `${currentConfig.selectedTraversalType.charAt(0).toUpperCase() + currentConfig.selectedTraversalType.slice(1)} Traversal Complete. Final Result: [${traversalResult.join(', ')}]`;
        steps.push({ type: 'finish', nodeId: null, result: [...traversalResult], states: {...nodeStates}, message: finishMessage });

        return { steps, elements: nodeElements };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        const currentConfig = this;
        if (!step || !elements || !step.states) { console.error("Traversal RenderStep: Missing step, elements, or states"); return; }

        // Update node styles based on step.states
        Object.keys(elements).forEach(nodeId => {
            const nodeEl = elements[nodeId]; if (!nodeEl) return;
            const state = step.states[nodeId];
            nodeEl.classList.remove('visiting', 'processing', 'visited', 'comparing', 'node-path', 'inserting'); // Reset all possible highlight classes
            // Ensure visible (opacity=1) unless explicitly hidden (not used in traversal)
            nodeEl.style.opacity = '1';
            nodeEl.style.pointerEvents = 'auto';
            // Apply traversal-specific highlight
            switch (state) {
                case 'visiting': case 'returning-left': case 'visiting-left': case 'visiting-right':
                    nodeEl.classList.add('visiting'); break;
                case 'processing':
                    nodeEl.classList.add('processing'); break;
                case 'visited':
                    nodeEl.classList.add('visited'); break;
            }
        });
        if(step.type === 'finish'){ // Ensure final state
             Object.values(elements).forEach(nodeEl => {
                 if (nodeEl) { nodeEl.classList.remove('visiting', 'processing'); nodeEl.classList.add('visited'); }
             });
        }

        // Update result display with correct label
        const resultContainer = document.getElementById('traversal-result-container');
        if (resultContainer) {
            const typeLabel = currentConfig.selectedTraversalType.charAt(0).toUpperCase() + currentConfig.selectedTraversalType.slice(1);
            resultContainer.innerHTML = `<span>${typeLabel} Result:</span>`;
            if (step.result && Array.isArray(step.result)) {
                step.result.forEach(val => { const span = document.createElement('span'); span.textContent = val; resultContainer.appendChild(span); });
            }
        } else { console.warn("Result container not found"); }

        // Update status message
        const statusMessageEl = document.getElementById('status-message'); if (statusMessageEl && step.message) { statusMessageEl.textContent = step.message; }
        else if (!statusMessageEl) { console.warn("Status message element not found"); }
    } // End of renderStep
}; // End of treeTraversalsConfig