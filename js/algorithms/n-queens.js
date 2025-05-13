const nQueensConfig = {
    name: 'N-Queens',
    type: 'backtracking',
    requiresPositiveInts: true,
    code: `<span class="code-keyword">function</span> <span class="code-function">solveNQueens</span>(n) {
  <span class="code-keyword">const</span> board = <span class="code-keyword">new</span> <span class="code-function">Array</span>(n).<span class="code-function">fill</span>(<span class="code-number">0</span>).<span class="code-function">map</span>(() => <span class="code-keyword">new</span> <span class="code-function">Array</span>(n).<span class="code-function">fill</span>(<span class="code-string">'.'</span>));
  <span class="code-keyword">const</span> solutions = [];
  <span class="code-comment">// Visualize initial board</span>

  <span class="code-keyword">function</span> <span class="code-function">isSafe</span>(row, col) {
    <span class="code-comment">// Visualize checking position</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < row; i++) {
      <span class="code-keyword">if</span> (board[i][col] === <span class="code-string">'Q'</span>) <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
    }
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = row - <span class="code-number">1</span>, j = col - <span class="code-number">1</span>; i >= <span class="code-number">0</span> && j >= <span class="code-number">0</span>; i--, j--) {
      <span class="code-keyword">if</span> (board[i][j] === <span class="code-string">'Q'</span>) <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
    }
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = row - <span class="code-number">1</span>, j = col + <span class="code-number">1</span>; i >= <span class="code-number">0</span> && j < n; i--, j++) {
      <span class="code-keyword">if</span> (board[i][j] === <span class="code-string">'Q'</span>) <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
    }
    <span class="code-keyword">return</span> <span class="code-keyword">true</span>;
  }

  <span class="code-keyword">function</span> <span class="code-function">solve</span>(row) {
    <span class="code-comment">// Visualize current row</span>
    <span class="code-keyword">if</span> (row === n) {
      solutions.<span class="code-function">push</span>(board.<span class="code-function">map</span>(row => row.<span class="code-function">join</span>(<span class="code-string">''</span>)));
      <span class="code-comment">// Visualize solution found</span>
      <span class="code-keyword">return</span>;
    }

    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> col = <span class="code-number">0</span>; col < n; col++) {
      <span class="code-comment">// Visualize trying column</span>
      <span class="code-keyword">if</span> (<span class="code-function">isSafe</span>(row, col)) {
        board[row][col] = <span class="code-string">'Q'</span>;
        <span class="code-comment">// Visualize placing queen</span>
        <span class="code-function">solve</span>(row + <span class="code-number">1</span>);
        board[row][col] = <span class="code-string">'.'</span>;
        <span class="code-comment">// Visualize backtracking</span>
      }
    }
  }

  <span class="code-function">solve</span>(<span class="code-number">0</span>);
  <span class="code-keyword">return</span> solutions;
}`,
    pseudocode: `SolveNQueens(n):
  Create n×n board filled with '.'
  solutions = empty list
  // Visualize: Initialize board

  function IsSafe(row, col):
    // Visualize: Checking position
    Check column above
    Check upper-left diagonal
    Check upper-right diagonal
    Return true if safe, false otherwise

  function Solve(row):
    // Visualize: Current row
    if row == n:
      Add current board to solutions
      // Visualize: Solution found
      return

    for col = 0 to n-1:
      // Visualize: Trying column
      if IsSafe(row, col):
        Place queen at (row, col)
        // Visualize: Placing queen
        Solve(row + 1)
        Remove queen from (row, col)
        // Visualize: Backtracking

  Solve(0)
  return solutions`,
    setup: function(data) {
        console.log("[N-Queens Setup] Starting setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        const mainVisualizationArea = document.getElementById('visualization-area');
        
        if (!extraVisualizationArea) {
            console.error("[N-Queens Setup] extraVisualizationArea not found!");
            return { steps: [], elements: null };
        }

        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';
        extraVisualizationArea.innerHTML = '';

        // Create visualization elements
        const container = document.createElement('div');
        container.className = 'n-queens-container';
        
        // Create board display
        const boardDisplay = document.createElement('div');
        boardDisplay.className = 'board-display';
        const board = document.createElement('table');
        board.className = 'chess-board';
        
        // Create board cells
        for (let i = 0; i < 8; i++) {
            const row = board.insertRow();
            for (let j = 0; j < 8; j++) {
                const cell = row.insertCell();
                cell.id = `cell-${i}-${j}`;
                cell.className = (i + j) % 2 === 0 ? 'white' : 'black';
            }
        }
        
        boardDisplay.appendChild(board);
        container.appendChild(boardDisplay);

        // Create status display
        const statusDisplay = document.createElement('div');
        statusDisplay.className = 'status-display';
        statusDisplay.textContent = 'Placing queens...';
        container.appendChild(statusDisplay);

        extraVisualizationArea.appendChild(container);

        // Generate steps
        const steps = [];
        const boardState = Array(8).fill(0).map(() => Array(8).fill('.'));
        let solutionCount = 0;

        function isSafe(row, col) {
            for (let i = 0; i < row; i++) {
                if (boardState[i][col] === 'Q') return false;
            }
            for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
                if (boardState[i][j] === 'Q') return false;
            }
            for (let i = row - 1, j = col + 1; i >= 0 && j < 8; i--, j++) {
                if (boardState[i][j] === 'Q') return false;
            }
            return true;
        }

        function solve(row) {
            if (row === 8) {
                solutionCount++;
                steps.push({
                    type: 'solution',
                    board: JSON.parse(JSON.stringify(boardState)),
                    solutionNumber: solutionCount,
                    message: `Solution ${solutionCount} found!`
                });
                return;
            }

            for (let col = 0; col < 8; col++) {
                steps.push({
                    type: 'check',
                    row: row,
                    col: col,
                    board: JSON.parse(JSON.stringify(boardState)),
                    message: `Checking position (${row}, ${col})`
                });

                if (isSafe(row, col)) {
                    boardState[row][col] = 'Q';
                    steps.push({
                        type: 'place',
                        row: row,
                        col: col,
                        board: JSON.parse(JSON.stringify(boardState)),
                        message: `Placing queen at (${row}, ${col})`
                    });

                    solve(row + 1);

                    boardState[row][col] = '.';
                    steps.push({
                        type: 'backtrack',
                        row: row,
                        col: col,
                        board: JSON.parse(JSON.stringify(boardState)),
                        message: `Backtracking from (${row}, ${col})`
                    });
                }
            }
        }

        solve(0);

        // Final step
        steps.push({
            type: 'finish',
            board: JSON.parse(JSON.stringify(boardState)),
            totalSolutions: solutionCount,
            message: `Found ${solutionCount} solutions`
        });

        return { steps, elements: null };
    },
    renderStep: function(step, elements, animationState) {
        if (!step) return;

        // Update board cells
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (cell) {
                    // Reset previous highlights
                    cell.classList.remove('checking', 'queen', 'attacking', 'backtracking');
                    
                    // Update cell content
                    if (step.board[i][j] === 'Q') {
                        cell.textContent = '♛';
                        cell.classList.add('queen');
                    } else {
                        cell.textContent = '';
                    }

                    // Apply highlights based on step type
                    if (step.type === 'check' && i === step.row && j === step.col) {
                        cell.classList.add('checking');
                    } else if (step.type === 'place' && i === step.row && j === step.col) {
                        cell.classList.add('queen');
                    } else if (step.type === 'backtrack' && i === step.row && j === step.col) {
                        cell.classList.add('backtracking');
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