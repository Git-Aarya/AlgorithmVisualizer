const mcmConfig = {
    name: 'Matrix Chain Multiplication',
    type: 'dynamic-programming',
    requiresPositiveInts: true,
    code: `<span class="code-keyword">function</span> <span class="code-function">matrixChainMultiplication</span>(dimensions) {
  <span class="code-keyword">const</span> n = dimensions.length - <span class="code-number">1</span>;
  <span class="code-keyword">const</span> dp = <span class="code-keyword">new</span> <span class="code-function">Array</span>(n).<span class="code-function">fill</span>(<span class="code-number">0</span>).<span class="code-function">map</span>(() => <span class="code-keyword">new</span> <span class="code-function">Array</span>(n).<span class="code-function">fill</span>(<span class="code-number">0</span>));
  <span class="code-keyword">const</span> parenthesis = <span class="code-keyword">new</span> <span class="code-function">Array</span>(n).<span class="code-function">fill</span>(<span class="code-number">0</span>).<span class="code-function">map</span>(() => <span class="code-keyword">new</span> <span class="code-function">Array</span>(n).<span class="code-function">fill</span>(<span class="code-number">0</span>));
  <span class="code-comment">// Visualize initial dp and parenthesis arrays</span>

  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> len = <span class="code-number">2</span>; len <= n; len++) {
    <span class="code-comment">// Visualize current chain length</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i <= n - len; i++) {
      <span class="code-keyword">const</span> j = i + len - <span class="code-number">1</span>;
      dp[i][j] = Infinity;
      <span class="code-comment">// Visualize current subproblem [i..j]</span>

      <span class="code-keyword">for</span> (<span class="code-keyword">let</span> k = i; k < j; k++) {
        <span class="code-comment">// Visualize current split point k</span>
        <span class="code-keyword">const</span> cost = dp[i][k] + dp[k + <span class="code-number">1</span>][j] + 
                    dimensions[i] * dimensions[k + <span class="code-number">1</span>] * dimensions[j + <span class="code-number">1</span>];
        <span class="code-comment">// Visualize cost calculation</span>

        <span class="code-keyword">if</span> (cost < dp[i][j]) {
          dp[i][j] = cost;
          parenthesis[i][j] = k;
          <span class="code-comment">// Visualize update to dp[i][j] and parenthesis[i][j]</span>
        }
      }
    }
  }

  <span class="code-keyword">return</span> { minCost: dp[<span class="code-number">0</span>][n - <span class="code-number">1</span>], parenthesis };
}`,
    pseudocode: `MatrixChainMultiplication(dimensions):
  n = length(dimensions) - 1
  Create dp[n][n] initialized to 0
  Create parenthesis[n][n] initialized to 0
  // Visualize: Initialize dp and parenthesis arrays

  for len = 2 to n:
    // Visualize: Current chain length
    for i = 0 to n - len:
      j = i + len - 1
      dp[i][j] = Infinity
      // Visualize: Current subproblem [i..j]

      for k = i to j - 1:
        // Visualize: Current split point k
        cost = dp[i][k] + dp[k+1][j] + 
               dimensions[i] * dimensions[k+1] * dimensions[j+1]
        // Visualize: Cost calculation

        if cost < dp[i][j]:
          dp[i][j] = cost
          parenthesis[i][j] = k
          // Visualize: Update dp[i][j] and parenthesis[i][j]

  return {minCost: dp[0][n-1], parenthesis}`,
    setup: function(data) {
        console.log("[MCM Setup] Starting setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        const mainVisualizationArea = document.getElementById('visualization-area');
        
        if (!extraVisualizationArea) {
            console.error("[MCM Setup] extraVisualizationArea not found!");
            return { steps: [], elements: null };
        }

        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';
        extraVisualizationArea.innerHTML = '';

        // Generate random matrix dimensions
        const numMatrices = 5;
        const dimensions = Array.from({ length: numMatrices + 1 }, () => Math.floor(Math.random() * 10) + 1);

        // Create visualization elements
        const container = document.createElement('div');
        container.className = 'mcm-container';
        
        // Create dimensions display
        const dimensionsDisplay = document.createElement('div');
        dimensionsDisplay.className = 'dimensions-display';
        dimensionsDisplay.innerHTML = '<h3>Matrix Dimensions:</h3>';
        const dimensionsList = document.createElement('div');
        dimensionsList.className = 'dimensions-list';
        for (let i = 0; i < numMatrices; i++) {
            const matrix = document.createElement('div');
            matrix.className = 'matrix-dimension';
            matrix.textContent = `${dimensions[i]} × ${dimensions[i + 1]}`;
            dimensionsList.appendChild(matrix);
        }
        dimensionsDisplay.appendChild(dimensionsList);
        container.appendChild(dimensionsDisplay);

        // Create dp table display
        const dpDisplay = document.createElement('div');
        dpDisplay.className = 'dp-display';
        const dpTable = document.createElement('table');
        dpTable.className = 'dp-table';
        
        // Create header row
        const headerRow = dpTable.insertRow();
        const headerCell = headerRow.insertCell();
        headerCell.textContent = 'i\\j';
        for (let j = 0; j < numMatrices; j++) {
            const cell = headerRow.insertCell();
            cell.textContent = j;
        }
        
        // Create dp table rows
        for (let i = 0; i < numMatrices; i++) {
            const row = dpTable.insertRow();
            const labelCell = row.insertCell();
            labelCell.textContent = i;
            for (let j = 0; j < numMatrices; j++) {
                const cell = row.insertCell();
                cell.id = `dp-cell-${i}-${j}`;
                cell.textContent = i === j ? '0' : '∞';
            }
        }
        
        dpDisplay.appendChild(dpTable);
        container.appendChild(dpDisplay);

        // Create parenthesis table display
        const parenthesisDisplay = document.createElement('div');
        parenthesisDisplay.className = 'parenthesis-display';
        const parenthesisTable = document.createElement('table');
        parenthesisTable.className = 'parenthesis-table';
        
        // Create header row
        const pHeaderRow = parenthesisTable.insertRow();
        const pHeaderCell = pHeaderRow.insertCell();
        pHeaderCell.textContent = 'i\\j';
        for (let j = 0; j < numMatrices; j++) {
            const cell = pHeaderRow.insertCell();
            cell.textContent = j;
        }
        
        // Create parenthesis table rows
        for (let i = 0; i < numMatrices; i++) {
            const row = parenthesisTable.insertRow();
            const labelCell = row.insertCell();
            labelCell.textContent = i;
            for (let j = 0; j < numMatrices; j++) {
                const cell = row.insertCell();
                cell.id = `p-cell-${i}-${j}`;
                cell.textContent = '-';
            }
        }
        
        parenthesisDisplay.appendChild(parenthesisTable);
        container.appendChild(parenthesisDisplay);

        extraVisualizationArea.appendChild(container);

        // Generate steps
        const steps = [];
        const dp = Array(numMatrices).fill(0).map(() => Array(numMatrices).fill(0));
        const parenthesis = Array(numMatrices).fill(0).map(() => Array(numMatrices).fill(0));

        // Initial step
        steps.push({
            type: 'init',
            dp: JSON.parse(JSON.stringify(dp)),
            parenthesis: JSON.parse(JSON.stringify(parenthesis)),
            message: 'Initialize dp and parenthesis arrays'
        });

        // Main algorithm steps
        for (let len = 2; len <= numMatrices; len++) {
            steps.push({
                type: 'chain-length',
                length: len,
                dp: JSON.parse(JSON.stringify(dp)),
                parenthesis: JSON.parse(JSON.stringify(parenthesis)),
                message: `Processing chain length ${len}`
            });

            for (let i = 0; i <= numMatrices - len; i++) {
                const j = i + len - 1;
                dp[i][j] = Infinity;

                steps.push({
                    type: 'subproblem',
                    i: i,
                    j: j,
                    dp: JSON.parse(JSON.stringify(dp)),
                    parenthesis: JSON.parse(JSON.stringify(parenthesis)),
                    message: `Processing subproblem [${i}..${j}]`
                });

                for (let k = i; k < j; k++) {
                    const cost = dp[i][k] + dp[k + 1][j] + 
                               dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

                    steps.push({
                        type: 'split-point',
                        i: i,
                        j: j,
                        k: k,
                        cost: cost,
                        dp: JSON.parse(JSON.stringify(dp)),
                        parenthesis: JSON.parse(JSON.stringify(parenthesis)),
                        message: `Checking split at k=${k}, cost=${cost}`
                    });

                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        parenthesis[i][j] = k;

                        steps.push({
                            type: 'update',
                            i: i,
                            j: j,
                            k: k,
                            cost: cost,
                            dp: JSON.parse(JSON.stringify(dp)),
                            parenthesis: JSON.parse(JSON.stringify(parenthesis)),
                            message: `Update dp[${i}][${j}]=${cost}, parenthesis[${i}][${j}]=${k}`
                        });
                    }
                }
            }
        }

        // Final step
        steps.push({
            type: 'finish',
            dp: JSON.parse(JSON.stringify(dp)),
            parenthesis: JSON.parse(JSON.stringify(parenthesis)),
            result: dp[0][numMatrices - 1],
            message: `Minimum cost: ${dp[0][numMatrices - 1]}`
        });

        return { steps, elements: null };
    },
    renderStep: function(step, elements, animationState) {
        if (!step) return;

        // Update dp table cells
        for (let i = 0; i < step.dp.length; i++) {
            for (let j = 0; j < step.dp[i].length; j++) {
                const cell = document.getElementById(`dp-cell-${i}-${j}`);
                if (cell) {
                    cell.textContent = step.dp[i][j] === Infinity ? '∞' : step.dp[i][j];
                    
                    // Reset previous highlights
                    cell.classList.remove('current-chain', 'current-subproblem', 'current-split', 'updated-value');
                    
                    // Apply new highlights based on step type
                    if (step.type === 'chain-length' && j - i + 1 === step.length) {
                        cell.classList.add('current-chain');
                    } else if (step.type === 'subproblem' && i === step.i && j === step.j) {
                        cell.classList.add('current-subproblem');
                    } else if (step.type === 'split-point' && i === step.i && j === step.j) {
                        cell.classList.add('current-split');
                    } else if (step.type === 'update' && i === step.i && j === step.j) {
                        cell.classList.add('updated-value');
                    }
                }
            }
        }

        // Update parenthesis table cells
        for (let i = 0; i < step.parenthesis.length; i++) {
            for (let j = 0; j < step.parenthesis[i].length; j++) {
                const cell = document.getElementById(`p-cell-${i}-${j}`);
                if (cell) {
                    cell.textContent = step.parenthesis[i][j] === 0 ? '-' : step.parenthesis[i][j];
                    
                    // Reset previous highlights
                    cell.classList.remove('current-chain', 'current-subproblem', 'current-split', 'updated-value');
                    
                    // Apply new highlights based on step type
                    if (step.type === 'chain-length' && j - i + 1 === step.length) {
                        cell.classList.add('current-chain');
                    } else if (step.type === 'subproblem' && i === step.i && j === step.j) {
                        cell.classList.add('current-subproblem');
                    } else if (step.type === 'split-point' && i === step.i && j === step.j) {
                        cell.classList.add('current-split');
                    } else if (step.type === 'update' && i === step.i && j === step.j) {
                        cell.classList.add('updated-value');
                    }
                }
            }
        }

        // Update status message
        const statusMessage = document.getElementById('status-message');
        if (statusMessage) {
            statusMessage.textContent = step.message;
        }
    }
}; 