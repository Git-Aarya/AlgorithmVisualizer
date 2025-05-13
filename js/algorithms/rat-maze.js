const ratMazeConfig = {
    name: 'Rat in a Maze',
    type: 'backtracking',
    requiresPositiveInts: true,
    code: `<span class="code-keyword">function</span> <span class="code-function">solveMaze</span>(maze) {
  <span class="code-keyword">const</span> n = maze.<span class="code-function">length</span>;
  <span class="code-keyword">const</span> solution = <span class="code-keyword">new</span> <span class="code-function">Array</span>(n).<span class="code-function">fill</span>(<span class="code-number">0</span>).<span class="code-function">map</span>(() => <span class="code-keyword">new</span> <span class="code-function">Array</span>(n).<span class="code-function">fill</span>(<span class="code-number">0</span>));
  <span class="code-comment">// Visualize initial maze</span>

  <span class="code-keyword">function</span> <span class="code-function">isSafe</span>(x, y) {
    <span class="code-comment">// Visualize checking position</span>
    <span class="code-keyword">return</span> x >= <span class="code-number">0</span> && x < n && y >= <span class="code-number">0</span> && y < n && maze[x][y] === <span class="code-number">1</span>;
  }

  <span class="code-keyword">function</span> <span class="code-function">solve</span>(x, y) {
    <span class="code-comment">// Visualize current position</span>
    <span class="code-keyword">if</span> (x === n - <span class="code-number">1</span> && y === n - <span class="code-number">1</span>) {
      solution[x][y] = <span class="code-number">1</span>;
      <span class="code-comment">// Visualize solution found</span>
      <span class="code-keyword">return</span> <span class="code-keyword">true</span>;
    }

    <span class="code-keyword">if</span> (<span class="code-function">isSafe</span>(x, y)) {
      solution[x][y] = <span class="code-number">1</span>;
      <span class="code-comment">// Visualize marking path</span>

      <span class="code-keyword">if</span> (<span class="code-function">solve</span>(x + <span class="code-number">1</span>, y)) <span class="code-keyword">return</span> <span class="code-keyword">true</span>;
      <span class="code-keyword">if</span> (<span class="code-function">solve</span>(x, y + <span class="code-number">1</span>)) <span class="code-keyword">return</span> <span class="code-keyword">true</span>;
      <span class="code-keyword">if</span> (<span class="code-keyword">x</span> > <span class="code-number">0</span> && <span class="code-function">solve</span>(x - <span class="code-number">1</span>, y)) <span class="code-keyword">return</span> <span class="code-keyword">true</span>;
      <span class="code-keyword">if</span> (<span class="code-keyword">y</span> > <span class="code-number">0</span> && <span class="code-function">solve</span>(x, y - <span class="code-number">1</span>)) <span class="code-keyword">return</span> <span class="code-keyword">true</span>;

      solution[x][y] = <span class="code-number">0</span>;
      <span class="code-comment">// Visualize backtracking</span>
    }

    <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
  }

  <span class="code-keyword">return</span> <span class="code-function">solve</span>(<span class="code-number">0</span>, <span class="code-number">0</span>) ? solution : <span class="code-keyword">null</span>;
}`,
    pseudocode: `SolveMaze(maze):
  n = maze.length
  Create n×n solution matrix filled with 0
  // Visualize: Initialize maze

  function IsSafe(x, y):
    // Visualize: Checking position
    Return true if position is valid and not blocked

  function Solve(x, y):
    // Visualize: Current position
    if reached destination:
      Mark current position in solution
      // Visualize: Solution found
      return true

    if IsSafe(x, y):
      Mark current position in solution
      // Visualize: Marking path
      Try moving right
      Try moving down
      Try moving left
      Try moving up
      If no path found:
        Unmark current position
        // Visualize: Backtracking
    return false

  return Solve(0, 0) ? solution : null`,
    setup: function(data) {
        console.log("[Rat Maze Setup] Starting setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        const mainVisualizationArea = document.getElementById('visualization-area');
        
        if (!extraVisualizationArea) {
            console.error("[Rat Maze Setup] extraVisualizationArea not found!");
            return { steps: [], elements: null };
        }

        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';
        extraVisualizationArea.innerHTML = '';

        // Create visualization elements
        const container = document.createElement('div');
        container.className = 'maze-container';
        
        // Create maze display
        const mazeDisplay = document.createElement('div');
        mazeDisplay.className = 'maze-display';
        const maze = document.createElement('table');
        maze.className = 'maze-grid';
        
        // Create maze cells
        const n = 8; // Default maze size
        const mazeState = Array(n).fill(0).map(() => Array(n).fill(1));
        const solutionState = Array(n).fill(0).map(() => Array(n).fill(0));
        
        // Ensure start and end points are accessible
        mazeState[0][0] = 1;  // Start point
        mazeState[n-1][n-1] = 1;  // End point
        
        // Add some random walls, but ensure there's always a path
        let wallsAdded = 0;
        const maxWalls = n * 2;
        
        while (wallsAdded < maxWalls) {
            const x = Math.floor(Math.random() * n);
            const y = Math.floor(Math.random() * n);
            
            // Don't place walls at start or end points
            if ((x === 0 && y === 0) || (x === n-1 && y === n-1)) {
                continue;
            }
            
            // Don't place walls that would completely block a path
            if (mazeState[x][y] === 1) {
                mazeState[x][y] = 0;
                wallsAdded++;
            }
        }
        
        for (let i = 0; i < n; i++) {
            const row = maze.insertRow();
            for (let j = 0; j < n; j++) {
                const cell = row.insertCell();
                cell.id = `cell-${i}-${j}`;
                cell.className = 'maze-cell';
                if (mazeState[i][j] === 0) {
                    cell.classList.add('wall');
                }
                // Add rat emoji at start
                if (i === 0 && j === 0) {
                    cell.textContent = '🐀';
                }
            }
        }
        
        mazeDisplay.appendChild(maze);
        container.appendChild(mazeDisplay);

        // Create status display
        const statusDisplay = document.createElement('div');
        statusDisplay.className = 'status-display';
        statusDisplay.id = 'maze-status';
        statusDisplay.textContent = 'Finding path...';
        container.appendChild(statusDisplay);

        extraVisualizationArea.appendChild(container);

        // Generate steps
        const steps = [];
        let pathFound = false;

        function isSafe(x, y) {
            return x >= 0 && x < n && y >= 0 && y < n && mazeState[x][y] === 1;
        }

        function solve(x, y) {
            steps.push({
                type: 'check',
                x: x,
                y: y,
                maze: JSON.parse(JSON.stringify(mazeState)),
                solution: JSON.parse(JSON.stringify(solutionState)),
                message: `Checking position (${x}, ${y})`
            });

            if (x === n - 1 && y === n - 1) {
                solutionState[x][y] = 1;
                steps.push({
                    type: 'solution',
                    x: x,
                    y: y,
                    maze: JSON.parse(JSON.stringify(mazeState)),
                    solution: JSON.parse(JSON.stringify(solutionState)),
                    message: 'Path found!'
                });
                pathFound = true;
                return true;
            }

            if (isSafe(x, y)) {
                solutionState[x][y] = 1;
                steps.push({
                    type: 'mark',
                    x: x,
                    y: y,
                    maze: JSON.parse(JSON.stringify(mazeState)),
                    solution: JSON.parse(JSON.stringify(solutionState)),
                    message: `Marking path at (${x}, ${y})`
                });

                if (solve(x + 1, y)) return true;
                if (solve(x, y + 1)) return true;
                if (x > 0 && solve(x - 1, y)) return true;
                if (y > 0 && solve(x, y - 1)) return true;

                solutionState[x][y] = 0;
                steps.push({
                    type: 'backtrack',
                    x: x,
                    y: y,
                    maze: JSON.parse(JSON.stringify(mazeState)),
                    solution: JSON.parse(JSON.stringify(solutionState)),
                    message: `Backtracking from (${x}, ${y})`
                });
            }

            return false;
        }

        solve(0, 0);

        // Final step
        steps.push({
            type: 'finish',
            maze: JSON.parse(JSON.stringify(mazeState)),
            solution: JSON.parse(JSON.stringify(solutionState)),
            pathFound: pathFound,
            message: pathFound ? 'Path found!' : 'No path exists'
        });

        return { steps, elements: null };
    },
    renderStep: function(step, elements, animationState) {
        if (!step) return;

        // Update maze cells
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (cell) {
                    // Reset previous highlights
                    cell.classList.remove('checking', 'path', 'backtracking');
                    
                    // Update cell content and style
                    if (step.maze[i][j] === 0) {
                        cell.classList.add('wall');
                    } else {
                        cell.classList.remove('wall');
                    }

                    if (step.solution[i][j] === 1) {
                        cell.classList.add('path');
                    }

                    // Apply highlights based on step type
                    if (step.type === 'check' && i === step.x && j === step.y) {
                        cell.classList.add('checking');
                    } else if (step.type === 'mark' && i === step.x && j === step.y) {
                        cell.classList.add('path');
                    } else if (step.type === 'backtrack' && i === step.x && j === step.y) {
                        cell.classList.add('backtracking');
                    }

                    // Keep rat emoji at start
                    if (i === 0 && j === 0) {
                        cell.textContent = '🐀';
                    } else {
                        cell.textContent = '';
                    }
                }
            }
        }

        // Update status message
        const statusMessage = document.getElementById('maze-status');
        if (statusMessage) {
            statusMessage.textContent = step.message;
        }
    }
}; 