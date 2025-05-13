const sudokuSolverConfig = {
    name: 'Sudoku Solver',
    type: 'backtracking',
    requiresPositiveInts: false,
    code: `<span class="code-keyword">function</span> <span class="code-function">solveSudoku</span>(board) {
  <span class="code-keyword">const</span> n = <span class="code-number">9</span>;
  <span class="code-comment">// Visualize initial board</span>

  <span class="code-keyword">function</span> <span class="code-function">isValid</span>(row, col, num) {
    <span class="code-comment">// Visualize checking row, column, and box</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < n; i++) {
      <span class="code-keyword">if</span> (board[row][i] === num) <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
      <span class="code-keyword">if</span> (board[i][col] === num) <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
    }
    
    <span class="code-keyword">const</span> boxRow = Math.<span class="code-function">floor</span>(row / <span class="code-number">3</span>) * <span class="code-number">3</span>;
    <span class="code-keyword">const</span> boxCol = Math.<span class="code-function">floor</span>(col / <span class="code-number">3</span>) * <span class="code-number">3</span>;
    
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < <span class="code-number">3</span>; i++) {
      <span class="code-keyword">for</span> (<span class="code-keyword">let</span> j = <span class="code-number">0</span>; j < <span class="code-number">3</span>; j++) {
        <span class="code-keyword">if</span> (board[boxRow + i][boxCol + j] === num) <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
      }
    }
    <span class="code-keyword">return</span> <span class="code-keyword">true</span>;
  }

  <span class="code-keyword">function</span> <span class="code-function">solve</span>() {
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> row = <span class="code-number">0</span>; row < n; row++) {
      <span class="code-keyword">for</span> (<span class="code-keyword">let</span> col = <span class="code-number">0</span>; col < n; col++) {
        <span class="code-comment">// Visualize current cell</span>
        <span class="code-keyword">if</span> (board[row][col] === <span class="code-string">'.'</span>) {
          <span class="code-keyword">for</span> (<span class="code-keyword">let</span> num = <span class="code-number">1</span>; num <= <span class="code-number">9</span>; num++) {
            <span class="code-comment">// Visualize trying number</span>
            <span class="code-keyword">if</span> (<span class="code-function">isValid</span>(row, col, num)) {
              board[row][col] = num;
              <span class="code-comment">// Visualize placing number</span>
              <span class="code-keyword">if</span> (<span class="code-function">solve</span>()) <span class="code-keyword">return</span> <span class="code-keyword">true</span>;
              board[row][col] = <span class="code-string">'.'</span>;
              <span class="code-comment">// Visualize backtracking</span>
            }
          }
          <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
        }
      }
    }
    <span class="code-keyword">return</span> <span class="code-keyword">true</span>;
  }

  <span class="code-keyword">return</span> <span class="code-function">solve</span>();
}`,
    pseudocode: `SolveSudoku(board):
  n = 9
  // Visualize: Initialize board

  function IsValid(row, col, num):
    // Visualize: Checking row, column, and box
    Check row for num
    Check column for num
    Check 3x3 box for num
    Return true if valid, false otherwise

  function Solve():
    for each cell in board:
      // Visualize: Current cell
      if cell is empty:
        for num = 1 to 9:
          // Visualize: Trying number
          if IsValid(row, col, num):
            Place num in cell
            // Visualize: Placing number
            if Solve() returns true:
              return true
            Remove num from cell
            // Visualize: Backtracking
        return false
    return true

  return Solve()`,
    setup: function(data) {
        console.log("[Sudoku Solver Setup] Starting setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        const mainVisualizationArea = document.getElementById('visualization-area');
        
        if (!extraVisualizationArea) {
            console.error("[Sudoku Solver Setup] extraVisualizationArea not found!");
            return { steps: [], elements: null };
        }

        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';
        extraVisualizationArea.innerHTML = '';

        // Create visualization elements
        const container = document.createElement('div');
        container.className = 'sudoku-container';
        
        // Create board display
        const boardDisplay = document.createElement('div');
        boardDisplay.className = 'board-display';
        const board = document.createElement('table');
        board.className = 'sudoku-board';
        
        // Create board cells
        for (let i = 0; i < 9; i++) {
            const row = board.insertRow();
            for (let j = 0; j < 9; j++) {
                const cell = row.insertCell();
                cell.id = `cell-${i}-${j}`;
                cell.className = 'sudoku-cell';
                // Add thicker borders for 3x3 boxes
                if (i % 3 === 0) cell.style.borderTop = '2px solid #000';
                if (j % 3 === 0) cell.style.borderLeft = '2px solid #000';
                if (i === 8) cell.style.borderBottom = '2px solid #000';
                if (j === 8) cell.style.borderRight = '2px solid #000';
            }
        }
        
        boardDisplay.appendChild(board);
        container.appendChild(boardDisplay);

        // Create status display
        const statusDisplay = document.createElement('div');
        statusDisplay.className = 'status-display';
        statusDisplay.textContent = 'Solving Sudoku...';
        container.appendChild(statusDisplay);

        extraVisualizationArea.appendChild(container);

        // Generate steps
        const steps = [];
        const boardState = Array(9).fill(0).map(() => Array(9).fill('.'));
        let solutionFound = false;

        function isValid(row, col, num) {
            for (let i = 0; i < 9; i++) {
                if (boardState[row][i] === num) return false;
                if (boardState[i][col] === num) return false;
            }
            
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (boardState[boxRow + i][boxCol + j] === num) return false;
                }
            }
            return true;
        }

        function solve() {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    steps.push({
                        type: 'check',
                        row: row,
                        col: col,
                        board: JSON.parse(JSON.stringify(boardState)),
                        message: `Checking cell (${row}, ${col})`
                    });

                    if (boardState[row][col] === '.') {
                        for (let num = 1; num <= 9; num++) {
                            steps.push({
                                type: 'try',
                                row: row,
                                col: col,
                                num: num,
                                board: JSON.parse(JSON.stringify(boardState)),
                                message: `Trying number ${num} at (${row}, ${col})`
                            });

                            if (isValid(row, col, num)) {
                                boardState[row][col] = num;
                                steps.push({
                                    type: 'place',
                                    row: row,
                                    col: col,
                                    num: num,
                                    board: JSON.parse(JSON.stringify(boardState)),
                                    message: `Placing ${num} at (${row}, ${col})`
                                });

                                if (solve()) {
                                    solutionFound = true;
                                    return true;
                                }

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
                        return false;
                    }
                }
            }
            return true;
        }

        solve();

        // Final step
        steps.push({
            type: 'finish',
            board: JSON.parse(JSON.stringify(boardState)),
            solutionFound: solutionFound,
            message: solutionFound ? 'Sudoku solved!' : 'No solution found'
        });

        return { steps, elements: null };
    },
    renderStep: function(step, elements, animationState) {
        if (!step) return;

        // Update board cells
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (cell) {
                    // Reset previous highlights
                    cell.classList.remove('checking', 'trying', 'placed', 'backtracking');
                    
                    // Update cell content
                    if (step.board[i][j] !== '.') {
                        cell.textContent = step.board[i][j];
                        cell.classList.add('filled');
                    } else {
                        cell.textContent = '';
                        cell.classList.remove('filled');
                    }

                    // Apply highlights based on step type
                    if (step.type === 'check' && i === step.row && j === step.col) {
                        cell.classList.add('checking');
                    } else if (step.type === 'try' && i === step.row && j === step.col) {
                        cell.classList.add('trying');
                        cell.textContent = step.num;
                    } else if (step.type === 'place' && i === step.row && j === step.col) {
                        cell.classList.add('placed');
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