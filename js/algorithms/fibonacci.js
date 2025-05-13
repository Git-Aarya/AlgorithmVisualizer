// js/algorithms/fibonacci.js

const fibonacciConfig = {
    name: 'Fibonacci (DP/Memo)',
    type: 'dynamic-programming', // New type or use 'tree'/'other'
    requiresPositiveInts: true, // Input 'n' should be non-negative integer
    code: `// --- Recursive ---
<span class="code-keyword">function</span> <span class="code-function">fib_recursive</span>(n) {
  <span class="code-keyword">if</span> (n <= <span class="code-number">1</span>) {
    <span class="code-keyword">return</span> n; <span class="code-comment">// Base cases F(0)=0, F(1)=1</span>
  }
  <span class="code-comment">// Visualize recursive calls</span>
  <span class="code-keyword">return</span> <span class="code-function">fib_recursive</span>(n - <span class="code-number">1</span>) + <span class="code-function">fib_recursive</span>(n - <span class="code-number">2</span>);
}

// --- Memoization (Top-Down DP) ---
<span class="code-keyword">function</span> <span class="code-function">fib_memo</span>(n, memo = {}) {
  <span class="code-keyword">if</span> (n <span class="code-keyword">in</span> memo) {
    <span class="code-comment">// Visualize cache hit</span>
    <span class="code-keyword">return</span> memo[n];
  }
  <span class="code-keyword">if</span> (n <= <span class="code-number">1</span>) {
    <span class="code-keyword">return</span> n; <span class="code-comment">// Base cases</span>
  }
  <span class="code-comment">// Visualize recursive calls</span>
  memo[n] = <span class="code-function">fib_memo</span>(n - <span class="code-number">1</span>, memo) + <span class="code-function">fib_memo</span>(n - <span class="code-number">2</span>, memo);
  <span class="code-comment">// Visualize storing result in cache</span>
  <span class="code-keyword">return</span> memo[n];
}

// --- Tabulation (Bottom-Up DP) ---
<span class="code-keyword">function</span> <span class="code-function">fib_tab</span>(n) {
  <span class="code-keyword">if</span> (n <= <span class="code-number">1</span>) <span class="code-keyword">return</span> n;
  <span class="code-keyword">const</span> table = <span class="code-keyword">new</span> <span class="code-function">Array</span>(n + <span class="code-number">1</span>);
  table[<span class="code-number">0</span>] = <span class="code-number">0</span>;
  table[<span class="code-number">1</span>] = <span class="code-number">1</span>;
  <span class="code-comment">// Visualize table initialization</span>

  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">2</span>; i <= n; i++) {
    table[i] = table[i - <span class="code-number">1</span>] + table[i - <span class="code-number">2</span>];
    <span class="code-comment">// Visualize calculating table[i]</span>
  }
  <span class="code-keyword">return</span> table[n];
}`,
    pseudocode: `// --- Recursive ---
FibRecursive(n):
  if n <= 1: return n // Base Cases
  // Visualize: Call FibRecursive(n-1)
  left_val = FibRecursive(n - 1)
  // Visualize: Return from left call, Call FibRecursive(n-2)
  right_val = FibRecursive(n - 2)
  // Visualize: Return from right call, Calculate sum
  return left_val + right_val

// --- Memoization (Top-Down DP) ---
FibMemo(n, memo_cache):
  if n is in memo_cache:
    // Visualize: Cache Hit! Return memo_cache[n]
    return memo_cache[n]
  if n <= 1: return n // Base Cases

  // Visualize: Call FibMemo(n-1)
  left_val = FibMemo(n - 1, memo_cache)
  // Visualize: Return from left call, Call FibMemo(n-2)
  right_val = FibMemo(n - 2, memo_cache)

  result = left_val + right_val
  memo_cache[n] = result // Store result
  // Visualize: Store result in cache
  return result

// --- Tabulation (Bottom-Up DP) ---
FibTab(n):
  if n <= 1: return n
  Create table of size n + 1
  table[0] = 0
  table[1] = 1
  // Visualize: Initialize table[0] and table[1]

  for i = 2 to n:
    // Visualize: Read table[i-1] and table[i-2]
    table[i] = table[i - 1] + table[i - 2]
    // Visualize: Write result to table[i]

  return table[n]`,

    selectedMethod: 'recursive', // Default method
    targetN: 6, // Default N value

    setup: function(data) { // data ignored
        const currentConfig = this;
        console.log(`Fibonacci setup for n=${currentConfig.targetN}, method=${currentConfig.selectedMethod}`);
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = ''; // Clear previous
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none'; // Hide bar area

        // --- 1. Create Controls ---
        const controlContainer = document.createElement('div');
        controlContainer.className = 'fib-controls mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm flex flex-wrap justify-center items-center gap-4';

        // Input for N
        const nLabel = document.createElement('label');
        nLabel.htmlFor = 'fib-n-input';
        nLabel.textContent = 'Calculate F(n) for n = ';
        nLabel.className = 'text-sm font-medium';
        const nInput = document.createElement('input');
        nInput.type = 'number';
        nInput.id = 'fib-n-input';
        nInput.min = '0';
        nInput.max = '15'; // Keep N small for recursive visualization performance
        nInput.value = currentConfig.targetN;
        nInput.className = 'w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500';
        nInput.addEventListener('change', () => {
            let newN = parseInt(nInput.value, 10);
            if (isNaN(newN) || newN < 0) newN = 0;
            if (newN > 15 && (currentConfig.selectedMethod === 'recursive' || currentConfig.selectedMethod === 'memoization')) {
                 newN = 15; // Limit for tree-based methods
                 nInput.value = newN;
                 alert("N capped at 15 for Recursive/Memoization visualization due to performance.");
             } else if (newN > 30) { // Higher limit for tabulation
                 newN = 30;
                 nInput.value = newN;
                 alert("N capped at 30 for Tabulation visualization.");
             }
            currentConfig.targetN = newN;
            // Trigger regeneration via main.js button click simulation
            document.getElementById('generate-data-btn')?.click();
        });

        // Method Selector (Radio Buttons)
        const methodLabel = document.createElement('span');
        methodLabel.textContent = 'Method:';
        methodLabel.className = 'text-sm font-medium mr-2';
        const methods = ['recursive', 'memoization', 'tabulation'];
        const radioGroup = document.createElement('div');
        radioGroup.className = 'flex gap-3';
        methods.forEach(method => {
            const label = document.createElement('label');
            label.className = 'flex items-center gap-1 text-sm cursor-pointer';
            const radio = document.createElement('input');
            radio.type = 'radio'; radio.name = 'fibMethod'; radio.value = method;
            radio.checked = (method === currentConfig.selectedMethod);
            radio.className = 'accent-blue-500';
            radio.addEventListener('change', (event) => {
                if (event.target.checked) {
                    currentConfig.selectedMethod = event.target.value;
                     // Adjust N limit if switching to recursive/memoization with high N
                     if ((currentConfig.selectedMethod === 'recursive' || currentConfig.selectedMethod === 'memoization') && currentConfig.targetN > 15) {
                         currentConfig.targetN = 15;
                         nInput.value = 15;
                         alert("N capped at 15 for Recursive/Memoization visualization due to performance.");
                     }
                    // Trigger regeneration
                    document.getElementById('generate-data-btn')?.click();
                }
            });
            label.appendChild(radio);
            label.appendChild(document.createTextNode(method.charAt(0).toUpperCase() + method.slice(1)));
            radioGroup.appendChild(label);
        });

        controlContainer.appendChild(nLabel);
        controlContainer.appendChild(nInput);
        controlContainer.appendChild(methodLabel);
        controlContainer.appendChild(radioGroup);
        extraVisualizationArea.appendChild(controlContainer);

        // --- 2. Setup Visualization Area ---
        const visContainer = document.createElement('div');
        visContainer.id = 'fib-visualization-content';
        visContainer.className = 'fib-visualization-content relative'; // Relative for potential absolute positioning
        extraVisualizationArea.appendChild(visContainer);

        // --- 3. Generate Steps based on Selected Method ---
        let steps = [];
        let elements = null; // Will hold tree nodes or table cells

        if (currentConfig.selectedMethod === 'recursive' || currentConfig.selectedMethod === 'memoization') {
            // Setup for Recursion Tree (SVG)
            const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const containerWidth = extraVisualizationArea.clientWidth || 600;
            const containerHeight = 400; // Adjust height as needed
            svgContainer.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
            svgContainer.setAttribute("width", "100%"); svgContainer.setAttribute("height", containerHeight);
            svgContainer.id = "fib-tree-svg";
            visContainer.appendChild(svgContainer);
            elements = { nodes: {}, edges: {}, svg: svgContainer }; // Store SVG elements
            steps = generateTreeSteps(currentConfig.targetN, currentConfig.selectedMethod, elements);
        } else { // Tabulation
            // Setup for Table Display
            const tableContainer = document.createElement('div');
            tableContainer.id = 'fib-table-container';
            tableContainer.className = 'fib-table-container mt-4 p-2';
            visContainer.appendChild(tableContainer);
            elements = { cells: [], container: tableContainer }; // Store table cells
            steps = generateTableSteps(currentConfig.targetN, elements);
        }

        console.log(`Fibonacci setup complete. Method: ${currentConfig.selectedMethod}, Steps: ${steps.length}`);
        return { steps, elements }; // Return steps and DOM elements
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements) { console.error("Fibonacci RenderStep: Missing data"); return; }

        const method = step.method || this.selectedMethod; // Get method from step or config

        if (method === 'recursive' || method === 'memoization') {
            renderTreeStep(step, elements);
        } else { // Tabulation
            renderTableStep(step, elements);
        }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    } // End of renderStep
}; // End of fibonacciConfig


// --- Helper: Generate Steps for Recursion Tree (Recursive/Memoization) ---
function generateTreeSteps(n, method, elements) {
    let steps = [];
    let nodeIdCounter = 0;
    let memo = {}; // For memoization method
    const treeNodes = {}; // Store node data { id, value, result, x, y, children: [], parentId }
    const treeEdges = {}; // Store edge data { id, u, v }

    function buildTreeRecursive(num, parentId = null, level = 0, position = 0) {
        const nodeId = `node-${nodeIdCounter++}`;
        treeNodes[nodeId] = { id: nodeId, value: num, result: null, level: level, position: position, children: [], parentId: parentId };

        // Add edge from parent if exists
        if (parentId !== null) {
            const edgeId = `edge-${parentId}-${nodeId}`;
            treeEdges[edgeId] = { id: edgeId, u: parentId, v: nodeId };
        }

        // Initial state step (node appears)
        steps.push({
            type: 'node-create', method: method, nodeId: nodeId, value: num, parentId: parentId,
            nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo},
            message: `${method === 'memoization' ? 'Memo ' : ''}Call F(${num})`
        });

        // Memoization Check
        if (method === 'memoization' && memo[num] !== undefined) {
            treeNodes[nodeId].result = memo[num];
            steps.push({
                type: 'cache-hit', method: method, nodeId: nodeId, value: num, result: memo[num],
                nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo},
                message: `Cache hit for F(${num}) = ${memo[num]}. Returning.`
            });
            return memo[num];
        }

        // Base Cases
        if (num <= 1) {
            treeNodes[nodeId].result = num;
            steps.push({
                type: 'base-case', method: method, nodeId: nodeId, value: num, result: num,
                nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo},
                message: `Base case F(${num}) = ${num}. Returning.`
            });
            if (method === 'memoization') memo[num] = num; // Store base case in memo
            return num;
        }

        // Recursive Calls
        // Call F(n-1)
        steps.push({ type: 'call-left', method: method, nodeId: nodeId, value: num, childValue: num - 1, nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo}, message: `Calling F(${num - 1})` });
        const leftChildId = Object.keys(treeNodes).length; // Predict next ID (approx)
        const leftResult = buildTreeRecursive(num - 1, nodeId, level + 1, position * 2);
        treeNodes[nodeId].children.push(Object.keys(treeNodes).find(id => treeNodes[id].value === num - 1 && treeNodes[id].parentId === nodeId)); // Link child ID properly after creation

        // Return from F(n-1)
        steps.push({ type: 'return-left', method: method, nodeId: nodeId, value: num, childValue: num - 1, result: leftResult, nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo}, message: `F(${num - 1}) returned ${leftResult}.` });

        // Call F(n-2)
        steps.push({ type: 'call-right', method: method, nodeId: nodeId, value: num, childValue: num - 2, nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo}, message: `Calling F(${num - 2})` });
        const rightChildId = Object.keys(treeNodes).length; // Predict next ID (approx)
        const rightResult = buildTreeRecursive(num - 2, nodeId, level + 1, position * 2 + 1);
        treeNodes[nodeId].children.push(Object.keys(treeNodes).find(id => treeNodes[id].value === num - 2 && treeNodes[id].parentId === nodeId)); // Link child ID properly

        // Return from F(n-2)
        steps.push({ type: 'return-right', method: method, nodeId: nodeId, value: num, childValue: num - 2, result: rightResult, nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo}, message: `F(${num - 2}) returned ${rightResult}.` });

        // Calculate Result
        const finalResult = leftResult + rightResult;
        treeNodes[nodeId].result = finalResult;

        // Store in Memo Cache if applicable
        if (method === 'memoization') {
            memo[num] = finalResult;
            steps.push({
                type: 'store-memo', method: method, nodeId: nodeId, value: num, result: finalResult,
                nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo},
                message: `Store F(${num}) = ${finalResult} in cache.`
            });
        }

        // Final Return Step for this node
        steps.push({
            type: 'return-final', method: method, nodeId: nodeId, value: num, result: finalResult,
            nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo},
            message: `F(${num}) = F(${num-1}) + F(${num-2}) = ${leftResult} + ${rightResult} = ${finalResult}. Returning.`
        });

        return finalResult;
    }

    const finalValue = buildTreeRecursive(n);
    // Add a final step showing the overall result
    steps.push({ type: 'finish', method: method, finalValue: finalValue, nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)), memo: {...memo}, message: `Final Result: F(${n}) = ${finalValue}` });

    // --- Calculate Layout Positions ---
    // Simple level-based layout - could be improved
    const levels = {};
    let maxNodesPerLevel = 0;
    Object.values(treeNodes).forEach(node => {
        if (!levels[node.level]) levels[node.level] = [];
        levels[node.level].push(node.id);
        maxNodesPerLevel = Math.max(maxNodesPerLevel, levels[node.level].length);
    });

    const containerWidth = elements.svg.viewBox.baseVal.width;
    const containerHeight = elements.svg.viewBox.baseVal.height;
    const yGap = containerHeight / (Object.keys(levels).length + 1); // Vertical spacing
    const nodeRadius = 18;

    Object.keys(levels).forEach(level => {
        const nodesOnLevel = levels[level];
        const numNodesOnLevel = nodesOnLevel.length;
        const xGap = containerWidth / (numNodesOnLevel + 1); // Horizontal spacing
        nodesOnLevel.forEach((nodeId, index) => {
            treeNodes[nodeId].x = xGap * (index + 1);
            treeNodes[nodeId].y = yGap * (parseInt(level) + 1);
        });
    });

    // Update steps with calculated positions
    steps.forEach(step => {
        if (step.nodes) {
            Object.keys(step.nodes).forEach(id => {
                if (treeNodes[id]) {
                    step.nodes[id].x = treeNodes[id].x;
                    step.nodes[id].y = treeNodes[id].y;
                }
            });
        }
    });


    return steps;
}


// --- Helper: Generate Steps for Tabulation ---
function generateTableSteps(n, elements) {
    let steps = [];
    if (n < 0) return steps;

    let table = new Array(n + 1).fill(null);
    let cellStates = new Array(n + 1).fill('initial'); // 'initial', 'calculating', 'final'

    // Initial state
    steps.push({ type: 'init', method: 'tabulation', n: n, table: [...table], cellStates: [...cellStates], message: `Initializing table of size ${n + 1}.` });

    if (n >= 0) {
        table[0] = 0;
        cellStates[0] = 'final';
        steps.push({ type: 'set-base', method: 'tabulation', index: 0, value: 0, table: [...table], cellStates: [...cellStates], message: `Set base case table[0] = 0.` });
    }
    if (n >= 1) {
        table[1] = 1;
        cellStates[1] = 'final';
        steps.push({ type: 'set-base', method: 'tabulation', index: 1, value: 1, table: [...table], cellStates: [...cellStates], message: `Set base case table[1] = 1.` });
    }

    for (let i = 2; i <= n; i++) {
        cellStates[i] = 'calculating'; // Mark cell being calculated
        cellStates[i - 1] = 'reading'; // Mark dependencies
        cellStates[i - 2] = 'reading';
        steps.push({
            type: 'calculate', method: 'tabulation', index: i, dep1: i - 1, dep2: i - 2,
            table: [...table], cellStates: [...cellStates],
            message: `Calculating table[${i}] = table[${i - 1}] (${table[i - 1]}) + table[${i - 2}] (${table[i - 2]})`
        });

        table[i] = table[i - 1] + table[i - 2];
        cellStates[i] = 'final'; // Mark as final
        cellStates[i - 1] = 'final'; // Reset dependencies
        cellStates[i - 2] = 'final';
        steps.push({
            type: 'set-value', method: 'tabulation', index: i, value: table[i],
            table: [...table], cellStates: [...cellStates],
            message: `Set table[${i}] = ${table[i]}.`
        });
    }

    steps.push({ type: 'finish', method: 'tabulation', finalValue: table[n], table: [...table], cellStates: [...cellStates], message: `Final Result: F(${n}) = ${table[n]}` });
    return steps;
}

// --- Helper: Render Tree Step ---
function renderTreeStep(step, elements) {
    const svg = elements.svg;
    if (!svg) return;

    // Clear previous elements (simple approach)
    while (svg.firstChild) { svg.removeChild(svg.firstChild); }
     // Re-add marker definition
     const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"); const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker"); marker.setAttribute("id", "arrowhead-fib"); marker.setAttribute("markerWidth", "8"); marker.setAttribute("markerHeight", "6"); marker.setAttribute("refX", "7"); marker.setAttribute("refY", "3"); marker.setAttribute("orient", "auto"); const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon"); polygon.setAttribute("points", "0 0, 8 3, 0 6"); polygon.setAttribute("class", "fib-arrowhead"); marker.appendChild(polygon); defs.appendChild(marker); svg.appendChild(defs);


    const nodeRadius = 18;
    const nodesToRender = step.nodes || {};
    const edgesToRender = step.edges || {};

    // Render Edges
    Object.values(edgesToRender).forEach(edgeData => {
        const uNode = nodesToRender[edgeData.u];
        const vNode = nodesToRender[edgeData.v];
        if (!uNode || !vNode || uNode.x === undefined || vNode.x === undefined) return; // Skip if node data/pos is missing

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        // Adjust for radius
        const angle = Math.atan2(vNode.y - uNode.y, vNode.x - uNode.x);
        const startX = uNode.x + nodeRadius * 0.0 * Math.cos(angle); // Start near center
        const startY = uNode.y + nodeRadius * 0.0 * Math.sin(angle);
        const endX = vNode.x - nodeRadius * 1.0 * Math.cos(angle); // End before circle edge
        const endY = vNode.y - nodeRadius * 1.0 * Math.sin(angle);

        line.setAttribute("x1", startX); line.setAttribute("y1", startY);
        line.setAttribute("x2", endX); line.setAttribute("y2", endY);
        line.setAttribute("class", "fib-tree-edge");
        line.setAttribute("marker-end", "url(#arrowhead-fib)");
        svg.appendChild(line);
    });

    // Render Nodes
    Object.values(nodesToRender).forEach(nodeData => {
        if (nodeData.x === undefined || nodeData.y === undefined) return; // Skip if position is missing

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("transform", `translate(${nodeData.x}, ${nodeData.y})`);
        group.id = nodeData.id;
        group.classList.add('fib-tree-node-group'); // Add class for potential group styling

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", nodeRadius);
        circle.classList.add("fib-tree-node"); // Base class

        // Apply state classes based on step type and current node ID
        if (step.nodeId === nodeData.id) {
            if (step.type === 'node-create' || step.type.startsWith('call-')) circle.classList.add('calling');
            else if (step.type === 'base-case') circle.classList.add('base-case');
            else if (step.type === 'cache-hit') circle.classList.add('cache-hit');
            else if (step.type.startsWith('return-')) circle.classList.add('returning');
            else if (step.type === 'store-memo') circle.classList.add('memo-store');
        } else if (nodeData.result !== null) {
             circle.classList.add('completed'); // Mark nodes whose result is calculated
        }


        group.appendChild(circle);

        // Node Value Text (e.g., "F(5)")
        const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueText.setAttribute("text-anchor", "middle");
        valueText.setAttribute("dy", "-0.3em"); // Position slightly above center
        valueText.classList.add("fib-node-value");
        valueText.textContent = `F(${nodeData.value})`;
        group.appendChild(valueText);

        // Node Result Text (e.g., "= 5") - only if calculated
        if (nodeData.result !== null) {
            const resultText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            resultText.setAttribute("text-anchor", "middle");
            resultText.setAttribute("dy", "0.8em"); // Position below center
            resultText.classList.add("fib-node-result");
            resultText.textContent = `= ${nodeData.result}`;
            group.appendChild(resultText);
        }

        svg.appendChild(group);
    });
}


// --- Helper: Render Table Step ---
function renderTableStep(step, elements) {
    const tableContainer = elements.container;
    if (!tableContainer) return;

    // Create table if it doesn't exist or clear previous
    let table = tableContainer.querySelector('.fib-table');
    if (!table) {
        table = document.createElement('div');
        table.className = 'fib-table';
        tableContainer.innerHTML = '<span>Tabulation Table (Index: Value):</span>'; // Add label
        tableContainer.appendChild(table);
        elements.cells = []; // Reset cell references
    } else {
        // Clear previous cell highlights
        elements.cells.forEach(cell => {
             if(cell) cell.classList.remove('reading', 'calculating', 'final', 'updated');
        });
    }


    // Ensure enough cells exist and update content/state
    const n = step.n;
    for (let i = 0; i <= n; i++) {
        let cell = elements.cells[i];
        if (!cell) {
            cell = document.createElement('div');
            cell.className = 'fib-table-cell';
            cell.id = `fib-cell-${i}`;
            const indexSpan = document.createElement('span');
            indexSpan.className = 'fib-cell-index';
            indexSpan.textContent = i;
            const valueSpan = document.createElement('span');
            valueSpan.className = 'fib-cell-value';
            valueSpan.id = `fib-value-${i}`;
            cell.appendChild(indexSpan);
            cell.appendChild(valueSpan);
            table.appendChild(cell);
            elements.cells[i] = cell;
        }

        // Update value
        const valueSpan = cell.querySelector('.fib-cell-value');
        const tableValue = step.table[i];
        valueSpan.textContent = tableValue === null ? '?' : tableValue;

        // Update state class
        const state = step.cellStates[i];
        cell.classList.remove('initial', 'reading', 'calculating', 'final', 'updated'); // Reset
        if (state === 'reading') cell.classList.add('reading');
        else if (state === 'calculating') cell.classList.add('calculating');
        else if (state === 'final') cell.classList.add('final');

        // Highlight updated cell
        if (step.type === 'set-value' && i === step.index) {
            cell.classList.add('updated');
        }
    }
}
