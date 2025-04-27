// js/algorithms/tree-traversals.js

const treeTraversalsConfig = {
    name: 'Tree Traversals (Inorder)', // Start with Inorder
    // code/pseudocode omitted for brevity - add specific traversal code/pseudo if desired
    code: `<span class="code-keyword">function</span> <span class="code-function">inorderTraversal</span>(node) {
  <span class="code-keyword">if</span> (node === null) <span class="code-keyword">return</span>;
  <span class="code-comment">// Visualize going left</span>
  <span class="code-function">inorderTraversal</span>(node.left);
  <span class="code-comment">// Visualize processing node</span>
  console.<span class="code-function">log</span>(node.value);
  <span class="code-comment">// Visualize going right</span>
  <span class="code-function">inorderTraversal</span>(node.right);
  <span class="code-comment">// Visualize returning up</span>
}`,
    pseudocode: `Inorder(node):
  if node is null:
    return
  // Go left
  Inorder(node.left)
  // Process node
  visit(node)
  // Go right
  Inorder(node.right)
  // Return`,

    setup: (data) => { // data parameter is not used here, we generate a fixed tree
        const visualizationArea = document.getElementById('visualization-area');
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        visualizationArea.innerHTML = ''; // Clear main bar area
        extraVisualizationArea.innerHTML = ''; // Clear previous extra content

        // --- 1. Define Tree Structure ---
        // Simple node structure
        class TreeNode {
            constructor(value, id) {
                this.value = value;
                this.left = null;
                this.right = null;
                this.id = id; // Unique ID for mapping to DOM elements
                this.domElement = null; // Reference to the DOM element
            }
        }

        // Create a sample binary tree
        //       10
        //      /  \
        //     5    15
        //    / \   / \
        //   3   7 12  18
        let nodeCounter = 0;
        const root = new TreeNode(10, `node-${nodeCounter++}`);
        root.left = new TreeNode(5, `node-${nodeCounter++}`);
        root.right = new TreeNode(15, `node-${nodeCounter++}`);
        root.left.left = new TreeNode(3, `node-${nodeCounter++}`);
        root.left.right = new TreeNode(7, `node-${nodeCounter++}`);
        root.right.left = new TreeNode(12, `node-${nodeCounter++}`);
        root.right.right = new TreeNode(18, `node-${nodeCounter++}`);

        // --- 2. Create Visualization Containers ---
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-visualization-container';
        extraVisualizationArea.appendChild(treeContainer);

        const nodesContainer = document.createElement('div');
        nodesContainer.id = 'tree-nodes-container';
        nodesContainer.className = 'tree-nodes-container';
        treeContainer.appendChild(nodesContainer);

        const resultContainer = document.createElement('div');
        resultContainer.id = 'traversal-result-container';
        resultContainer.className = 'traversal-result-container dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'; // Added dark mode classes
        resultContainer.innerHTML = '<span>Inorder Result:</span>';
        treeContainer.appendChild(resultContainer);

        // --- 3. Create DOM Elements for Nodes (BFS approach for level-order creation) ---
        const nodeElements = {}; // Map ID to DOM element
        const queue = [root];
        while (queue.length > 0) {
            const node = queue.shift();
            if (node) {
                const nodeDiv = document.createElement('div');
                nodeDiv.id = node.id;
                nodeDiv.className = 'tree-node';
                nodeDiv.textContent = node.value;
                nodeDiv.title = `Node Value: ${node.value}`;
                nodesContainer.appendChild(nodeDiv); // Add node to the container
                node.domElement = nodeDiv; // Store reference
                nodeElements[node.id] = nodeDiv;

                // For simplicity, we're just placing nodes in reading order.
                // A proper tree layout requires more complex positioning (absolute/relative, or SVG).
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
        }
        // Basic Flexbox layout might need adjustments for a better tree look.


        // --- 4. Generate Inorder Traversal Steps ---
        let steps = [];
        let inorderResult = [];

        function generateInorderSteps(node) {
            if (node === null) {
                steps.push({ type: 'null-check', nodeId: null, result: [...inorderResult], message: `Reached a null node, returning.`});
                return;
            }

            // Step: Visiting node (before going left)
            steps.push({ type: 'visit', nodeId: node.id, result: [...inorderResult], message: `Visiting node ${node.value}. Going left.` });

            // Go Left
            generateInorderSteps(node.left);
            steps.push({ type: 'return-from-left', nodeId: node.id, result: [...inorderResult], message: `Returned from left subtree of ${node.value}. Processing node.` });

            // Process Node
            inorderResult.push(node.value);
            steps.push({ type: 'process', nodeId: node.id, result: [...inorderResult], message: `Processed node ${node.value}. Result: [${inorderResult.join(', ')}]` });

            // Step: Visiting node (before going right)
            steps.push({ type: 'visit-right', nodeId: node.id, result: [...inorderResult], message: `Visiting node ${node.value}. Going right.` });

            // Go Right
            generateInorderSteps(node.right);
            steps.push({ type: 'return-from-right', nodeId: node.id, result: [...inorderResult], message: `Returned from right subtree of ${node.value}. Returning up.` });

        }
        steps.push({ type: 'start', nodeId: root.id, result: [...inorderResult], message: 'Starting Inorder Traversal.' });
        generateInorderSteps(root);
        steps.push({ type: 'finish', nodeId: null, result: [...inorderResult], message: `Inorder Traversal Complete. Final Result: [${inorderResult.join(', ')}]` });


        // Return steps and the map of node elements
        return { steps, elements: nodeElements }; // 'elements' now maps node ID to DOM element
    },

    renderStep: (step, elements, animationState) => {
        // elements is the map of node ID to DOM element from setup
        if (!step || !elements) return;

        // Reset all node styles first
        Object.values(elements).forEach(nodeEl => {
            nodeEl.classList.remove('visiting', 'processing', 'visited');
        });

        // Find the result container (could be cached in animationState if needed)
        const resultContainer = document.getElementById('traversal-result-container');
        if (resultContainer) {
             // Filter out the "Inorder Result:" label span if present
             const resultSpans = Array.from(resultContainer.children).filter(el => el.tagName !== 'SPAN' || !el.textContent.includes(':'));
             resultContainer.innerHTML = '<span>Inorder Result:</span>'; // Keep the label
             step.result.forEach(val => {
                 const span = document.createElement('span');
                 span.textContent = val;
                 resultContainer.appendChild(span);
             });
        }


        // Apply styles based on step type
        const currentNodeElement = elements[step.nodeId]; // Get the DOM element for the current node ID

        switch (step.type) {
            case 'start':
            case 'visit':
            case 'visit-right':
            case 'return-from-left':
            case 'return-from-right':
                if (currentNodeElement) {
                    currentNodeElement.classList.add('visiting');
                }
                break;
            case 'process':
                if (currentNodeElement) {
                    currentNodeElement.classList.add('processing'); // Highlight processing node
                }
                break;
             case 'null-check':
                // No node highlight for null checks
                break;
            case 'finish':
                // Mark all nodes as 'visited' in the final state
                Object.values(elements).forEach(nodeEl => {
                    nodeEl.classList.add('visited');
                });
                break;
        }

        // Update status message (handled in main.js, but we can set it here too)
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    }
};