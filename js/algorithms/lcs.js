// js/algorithms/lcs.js

const lcsConfig = {
    name: 'Longest Common Subsequence',
    type: 'dynamic-programming', // Use DP type
    code: `<span class="code-keyword">function</span> <span class="code-function">lcs</span>(str1, str2) {
  <span class="code-keyword">const</span> m = str1.length;
  <span class="code-keyword">const</span> n = str2.length;
  <span class="code-comment">// Create DP table, initialized with 0s</span>
  <span class="code-keyword">const</span> dp = <span class="code-keyword">new</span> <span class="code-function">Array</span>(m + <span class="code-number">1</span>).<span class="code-function">fill</span>(<span class="code-number">0</span>).<span class="code-function">map</span>(() => <span class="code-keyword">new</span> <span class="code-function">Array</span>(n + <span class="code-number">1</span>).<span class="code-function">fill</span>(<span class="code-number">0</span>));
  <span class="code-comment">// Visualize initial table</span>

  <span class="code-comment">// Fill the DP table</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">1</span>; i <= m; i++) {
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> j = <span class="code-number">1</span>; j <= n; j++) {
      <span class="code-comment">// Visualize current cell (i, j) and characters being compared</span>
      <span class="code-keyword">const</span> char1 = str1[i - <span class="code-number">1</span>];
      <span class="code-keyword">const</span> char2 = str2[j - <span class="code-number">1</span>];

      <span class="code-keyword">if</span> (char1 === char2) {
        <span class="code-comment">// Characters match: Take diagonal + 1</span>
        <span class="code-comment">// Visualize match and dependency dp[i-1][j-1]</span>
        dp[i][j] = dp[i - <span class="code-number">1</span>][j - <span class="code-number">1</span>] + <span class="code-number">1</span>;
      } <span class="code-keyword">else</span> {
        <span class="code-comment">// Characters don't match: Take max of top or left</span>
        <span class="code-comment">// Visualize mismatch and dependencies dp[i-1][j], dp[i][j-1]</span>
        dp[i][j] = Math.<span class="code-function">max</span>(dp[i - <span class="code-number">1</span>][j], dp[i][j - <span class="code-number">1</span>]);
      }
      <span class="code-comment">// Visualize update of dp[i][j]</span>
    }
  }

  <span class="code-comment">// Length of LCS is in dp[m][n]</span>
  <span class="code-keyword">const</span> lcsLength = dp[m][n];

  <span class="code-comment">// Backtrack to find the LCS string (optional but good for visualization)</span>
  <span class="code-keyword">let</span> lcsString = <span class="code-string">""</span>;
  <span class="code-keyword">let</span> i = m, j = n;
  <span class="code-comment">// Visualize start of backtrack</span>
  <span class="code-keyword">while</span> (i > <span class="code-number">0</span> && j > <span class="code-number">0</span>) {
     <span class="code-comment">// Visualize current cell (i, j) during backtrack</span>
    <span class="code-keyword">if</span> (str1[i - <span class="code-number">1</span>] === str2[j - <span class="code-number">1</span>]) {
      <span class="code-comment">// Match found, part of LCS. Move diagonally up-left.</span>
      lcsString = str1[i - <span class="code-number">1</span>] + lcsString;
      <span class="code-comment">// Visualize backtrack diagonal move</span>
      i--; j--;
    } <span class="code-keyword">else if</span> (dp[i - <span class="code-number">1</span>][j] > dp[i][j - <span class="code-number">1</span>]) {
      <span class="code-comment">// Move up (value came from top cell)</span>
       <span class="code-comment">// Visualize backtrack up move</span>
      i--;
    } <span class="code-keyword">else</span> {
      <span class="code-comment">// Move left (value came from left cell)</span>
       <span class="code-comment">// Visualize backtrack left move</span>
      j--;
    }
  }
   <span class="code-comment">// Visualize completion</span>
  <span class="code-keyword">return</span> { length: lcsLength, sequence: lcsString };
}`,
    pseudocode: `LCS(str1, str2):
  m = length(str1)
  n = length(str2)
  Create dp_table[m+1][n+1], initialized to 0
  // Visualize: Initial DP table

  // Fill DP table
  for i = 1 to m:
    for j = 1 to n:
      // Visualize: Consider cell (i, j), compare str1[i-1] and str2[j-1]
      if str1[i-1] == str2[j-1]: // Match
        // Visualize: Highlight diagonal dependency dp[i-1][j-1]
        dp_table[i][j] = dp_table[i-1][j-1] + 1
      else: // No match
        // Visualize: Highlight top (dp[i-1][j]) and left (dp[i][j-1]) dependencies
        dp_table[i][j] = max(dp_table[i-1][j], dp_table[i][j-1])
      // Visualize: Update dp_table[i][j]

  lcsLength = dp_table[m][n]

  // Backtracking (to find the sequence)
  lcsSequence = ""
  i = m, j = n
  // Visualize: Start backtrack from dp[m][n]
  while i > 0 and j > 0:
    // Visualize: Current backtrack cell (i, j)
    if str1[i-1] == str2[j-1]: // Match was used
      lcsSequence = str1[i-1] + lcsSequence // Prepend character
      // Visualize: Move diagonally (i-1, j-1)
      i = i - 1
      j = j - 1
    else if dp_table[i-1][j] > dp_table[i][j-1]: // Value came from top
      // Visualize: Move up (i-1, j)
      i = i - 1
    else: // Value came from left (or equal, choose one)
      // Visualize: Move left (i, j-1)
      j = j - 1

  // Visualize: Complete
  return {length: lcsLength, sequence: lcsSequence}`,

    setup: function(data) { // data ignored
        console.log("Running LCS setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        extraVisualizationArea.innerHTML = '';
        const mainVisualizationArea = document.getElementById('visualization-area');
        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';

        // --- 1. Generate Random Strings ---
        function generateRandomString(length) {
            const chars = "AGCT"; // Example alphabet (DNA/RNA-like)
            // const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let result = "";
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
        const str1Length = 7; // Keep lengths reasonable for visualization
        const str2Length = 8;
        const str1 = generateRandomString(str1Length);
        const str2 = generateRandomString(str2Length);
        const m = str1.length;
        const n = str2.length;

        // --- 2. Setup Display Areas ---
        const container = document.createElement('div');
        container.className = 'lcs-container p-2';

        // Display Strings
        const stringContainer = document.createElement('div');
        stringContainer.className = 'lcs-strings mb-4 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-6';
        stringContainer.innerHTML = `
            <div class="flex items-center gap-2"> <span class="font-medium">String 1:</span> <div id="lcs-str1" class="lcs-string-display"></div> </div>
            <div class="flex items-center gap-2"> <span class="font-medium">String 2:</span> <div id="lcs-str2" class="lcs-string-display"></div> </div>
        `;
        container.appendChild(stringContainer);

        // DP Table Area
        const tableContainer = document.createElement('div');
        tableContainer.id = 'lcs-table-container';
        tableContainer.className = 'lcs-table-container overflow-x-auto bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2';
        container.appendChild(tableContainer);

        // Result Area
        const resultContainer = document.createElement('div');
        resultContainer.id = 'lcs-result-container';
        resultContainer.className = 'lcs-result-container mt-3 text-center';
        resultContainer.innerHTML = `<span>LCS Length: -</span><br><span>Sequence: -</span>`;
        container.appendChild(resultContainer);

        extraVisualizationArea.appendChild(container);

        // Populate String Displays
        const str1Display = document.getElementById('lcs-str1');
        const str2Display = document.getElementById('lcs-str2');
        str1.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.id = `s1-char-${index}`;
            span.className = 'lcs-char';
            str1Display.appendChild(span);
        });
        str2.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.id = `s2-char-${index}`;
            span.className = 'lcs-char';
            str2Display.appendChild(span);
        });


        // --- 3. Initialize DP Table and Generate Steps ---
        let steps = [];
        let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
        let cellStates = Array(m + 1).fill(0).map(() => Array(n + 1).fill('initial')); // 'initial', 'checking', 'match-diag', 'mismatch-top', 'mismatch-left', 'updated', 'backtrack-path', 'backtrack-current'
        let charStates = { s1: Array(m).fill('initial'), s2: Array(n).fill('initial') }; // 'initial', 'comparing', 'match', 'in-lcs'
        let lcsResult = { length: 0, sequence: "" };

        // Create Matrix DOM Elements (Table)
        const table = document.createElement('table');
        table.className = 'lcs-dp-table';
        let matrixElements = Array(m + 1).fill(0).map(() => Array(n + 1).fill(null));

        // Header Row (String 2)
        const headerRow = table.insertRow();
        headerRow.insertCell().className = 'lcs-table-header corner';
        headerRow.insertCell().className = 'lcs-table-header'; // Empty cell above str1
        for (let j = 0; j < n; j++) { const th = document.createElement('th'); th.className = 'lcs-table-header'; th.textContent = str2[j]; th.id = `th-s2-${j}`; headerRow.appendChild(th); }

        // Data Rows (including String 1 header column)
        for (let i = 0; i <= m; i++) {
            const row = table.insertRow();
            const th = document.createElement('th'); // Header cell for str1 char or empty
            th.className = 'lcs-table-header';
            if (i > 0) { th.textContent = str1[i - 1]; th.id = `th-s1-${i-1}`; }
            row.appendChild(th);

            for (let j = 0; j <= n; j++) {
                const cell = row.insertCell();
                cell.className = 'lcs-table-cell';
                cell.id = `cell-${i}-${j}`;
                cell.textContent = dp[i][j]; // Initial value (0)
                matrixElements[i][j] = cell;
            }
        }
        tableContainer.appendChild(table);

        // Initial Step
        steps.push({
            type: 'init', i: -1, j: -1,
            dpTable: JSON.parse(JSON.stringify(dp)),
            cellStates: JSON.parse(JSON.stringify(cellStates)),
            charStates: JSON.parse(JSON.stringify(charStates)),
            lcsResult: {...lcsResult},
            message: 'Initialized DP table with zeros.'
        });

        // Fill DP Table - Step Generation
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                // Reset previous highlights
                if (i > 1) cellStates[i - 1][j] = 'final';
                if (j > 1) cellStates[i][j - 1] = 'final';
                if (i > 1 && j > 1) cellStates[i - 1][j - 1] = 'final';
                 charStates.s1.fill('initial'); charStates.s2.fill('initial');

                cellStates[i][j] = 'checking';
                charStates.s1[i - 1] = 'comparing';
                charStates.s2[j - 1] = 'comparing';

                steps.push({
                    type: 'check-cell', i: i, j: j, char1: str1[i - 1], char2: str2[j - 1],
                    dpTable: JSON.parse(JSON.stringify(dp)),
                    cellStates: JSON.parse(JSON.stringify(cellStates)),
                    charStates: JSON.parse(JSON.stringify(charStates)),
                    lcsResult: {...lcsResult},
                    message: `Comparing str1[${i - 1}] ('${str1[i - 1]}') and str2[${j - 1}] ('${str2[j - 1]}') for cell [${i}][${j}].`
                });

                if (str1[i - 1] === str2[j - 1]) {
                    // Highlight dependency
                    cellStates[i - 1][j - 1] = 'match-diag';
                    charStates.s1[i - 1] = 'match'; charStates.s2[j - 1] = 'match';
                    steps.push({
                        type: 'match', i: i, j: j, char1: str1[i - 1],
                        dpTable: JSON.parse(JSON.stringify(dp)),
                        cellStates: JSON.parse(JSON.stringify(cellStates)),
                        charStates: JSON.parse(JSON.stringify(charStates)),
                        lcsResult: {...lcsResult},
                        message: `Match! Taking value from diagonal [${i - 1}][${j - 1}] (${dp[i - 1][j - 1]}) + 1.`
                    });
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    cellStates[i - 1][j - 1] = 'final'; // Reset dependency highlight
                } else {
                    // Highlight dependencies
                    cellStates[i - 1][j] = 'mismatch-top';
                    cellStates[i][j - 1] = 'mismatch-left';
                     charStates.s1[i - 1] = 'comparing'; charStates.s2[j - 1] = 'comparing'; // Keep comparing style
                    steps.push({
                        type: 'mismatch', i: i, j: j,
                        dpTable: JSON.parse(JSON.stringify(dp)),
                        cellStates: JSON.parse(JSON.stringify(cellStates)),
                        charStates: JSON.parse(JSON.stringify(charStates)),
                        lcsResult: {...lcsResult},
                        message: `Mismatch. Taking max of top [${i - 1}][${j}] (${dp[i - 1][j]}) and left [${i}][${j - 1}] (${dp[i][j - 1]}).`
                    });
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    cellStates[i - 1][j] = 'final'; // Reset dependency highlights
                    cellStates[i][j - 1] = 'final';
                }
                cellStates[i][j] = 'updated'; // Mark current cell as updated
                steps.push({
                    type: 'update-cell', i: i, j: j, value: dp[i][j],
                    dpTable: JSON.parse(JSON.stringify(dp)),
                    cellStates: JSON.parse(JSON.stringify(cellStates)),
                    charStates: JSON.parse(JSON.stringify(charStates)),
                    lcsResult: {...lcsResult},
                    message: `Set dp[${i}][${j}] = ${dp[i][j]}.`
                });
                 cellStates[i][j] = 'final'; // Mark as final after update shown
                 charStates.s1[i - 1] = 'initial'; charStates.s2[j - 1] = 'initial'; // Reset char highlights
            }
        }
        lcsResult.length = dp[m][n];

        // Backtracking - Step Generation
        steps.push({
            type: 'start-backtrack', i: m, j: n,
            dpTable: JSON.parse(JSON.stringify(dp)),
            cellStates: JSON.parse(JSON.stringify(cellStates)), // Use final cell states
            charStates: JSON.parse(JSON.stringify(charStates)), // Reset chars
            lcsResult: {...lcsResult},
            message: `DP table filled. LCS length = ${lcsResult.length}. Starting backtrack from [${m}][${n}].`
        });

        let bt_i = m, bt_j = n;
        let tempLcs = "";
        while (bt_i > 0 && bt_j > 0) {
            cellStates[bt_i][bt_j] = 'backtrack-current'; // Highlight current backtrack cell

            // Add step showing current backtrack position
            steps.push({
                type: 'backtrack-check', i: bt_i, j: bt_j,
                dpTable: JSON.parse(JSON.stringify(dp)),
                cellStates: JSON.parse(JSON.stringify(cellStates)),
                charStates: JSON.parse(JSON.stringify(charStates)), // Keep track of LCS chars
                lcsResult: {...lcsResult, sequence: tempLcs}, // Show intermediate sequence
                message: `Backtrack at [${bt_i}][${bt_j}]. Comparing '${str1[bt_i - 1]}' and '${str2[bt_j - 1]}'.`
            });


            if (str1[bt_i - 1] === str2[bt_j - 1]) {
                tempLcs = str1[bt_i - 1] + tempLcs;
                charStates.s1[bt_i - 1] = 'in-lcs'; // Mark characters in LCS
                charStates.s2[bt_j - 1] = 'in-lcs';
                cellStates[bt_i][bt_j] = 'backtrack-path'; // Mark path
                bt_i--; bt_j--; // Move diagonally
                steps.push({
                    type: 'backtrack-match', i: bt_i + 1, j: bt_j + 1, next_i: bt_i, next_j: bt_j, char: tempLcs.charAt(0),
                    dpTable: JSON.parse(JSON.stringify(dp)),
                    cellStates: JSON.parse(JSON.stringify(cellStates)),
                    charStates: JSON.parse(JSON.stringify(charStates)),
                    lcsResult: {...lcsResult, sequence: tempLcs},
                    message: `Match ('${tempLcs.charAt(0)}')! Added to LCS. Moving diagonally to [${bt_i}][${bt_j}].`
                });
            } else if (dp[bt_i - 1][bt_j] > dp[bt_i][bt_j - 1]) {
                cellStates[bt_i][bt_j] = 'backtrack-path'; // Mark path
                bt_i--; // Move up
                 steps.push({
                    type: 'backtrack-move', i: bt_i + 1, j: bt_j, next_i: bt_i, next_j: bt_j, direction: 'up',
                    dpTable: JSON.parse(JSON.stringify(dp)),
                    cellStates: JSON.parse(JSON.stringify(cellStates)),
                    charStates: JSON.parse(JSON.stringify(charStates)),
                    lcsResult: {...lcsResult, sequence: tempLcs},
                    message: `Value came from top. Moving up to [${bt_i}][${bt_j}].`
                });
            } else {
                cellStates[bt_i][bt_j] = 'backtrack-path'; // Mark path
                bt_j--; // Move left
                 steps.push({
                    type: 'backtrack-move', i: bt_i, j: bt_j + 1, next_i: bt_i, next_j: bt_j, direction: 'left',
                    dpTable: JSON.parse(JSON.stringify(dp)),
                    cellStates: JSON.parse(JSON.stringify(cellStates)),
                    charStates: JSON.parse(JSON.stringify(charStates)),
                    lcsResult: {...lcsResult, sequence: tempLcs},
                    message: `Value came from left. Moving left to [${bt_i}][${bt_j}].`
                });
            }
        }
         // Mark final backtrack path cell
         if(bt_i >= 0 && bt_j >= 0) cellStates[bt_i][bt_j] = 'backtrack-path';

        lcsResult.sequence = tempLcs;
        steps.push({
            type: 'finish', i: -1, j: -1,
            dpTable: JSON.parse(JSON.stringify(dp)),
            cellStates: JSON.parse(JSON.stringify(cellStates)), // Show final path
            charStates: JSON.parse(JSON.stringify(charStates)), // Show final LCS chars
            lcsResult: {...lcsResult},
            message: `LCS Found: "${lcsResult.sequence}" (Length: ${lcsResult.length})`
        });

        console.log("LCS setup complete. Steps generated:", steps.length);
        // Return matrix elements and initial string data
        return { steps, elements: { matrix: matrixElements }, str1: str1, str2: str2, m: m, n: n };
    }, // End of setup

    // --- renderStep Function ---
    renderStep: function(step, elements, animationState) {
        if (!step || !elements || !elements.matrix || !step.dpTable || !step.cellStates || !step.charStates || !animationState) {
            console.error("LCS RenderStep: Missing data", { step, elements, animationState });
            return;
        }
        const matrixElements = elements.matrix;
        const m = animationState.m; // Dimensions from state
        const n = animationState.n;

        // Update DP Table Cells
        for (let r = 0; r <= m; r++) {
            for (let c = 0; c <= n; c++) {
                const cell = matrixElements[r]?.[c];
                if (!cell) continue;

                const dpValue = step.dpTable[r]?.[c];
                if (dpValue === undefined) continue;
                cell.textContent = dpValue;

                // Apply cell state styling
                const state = step.cellStates[r]?.[c] || 'initial';
                cell.className = 'lcs-table-cell'; // Reset classes
                if (state !== 'initial' && state !== 'final') {
                     cell.classList.add(state);
                }
                // Add 'final' class if state implies it's done being calculated/checked in this phase
                 if (state === 'final' || (step.type.startsWith('backtrack') && state !== 'backtrack-current' && state !== 'backtrack-path')) {
                     cell.classList.add('final');
                 }
                 if (state === 'backtrack-path') {
                     cell.classList.add('backtrack-path');
                 }
                 if (state === 'backtrack-current') {
                     cell.classList.add('backtrack-current');
                 }
            }
        }

        // Update String Character Highlights
        const str1Display = document.getElementById('lcs-str1');
        const str2Display = document.getElementById('lcs-str2');
        if (str1Display && str2Display) {
            for (let i = 0; i < m; i++) {
                const charSpan = document.getElementById(`s1-char-${i}`);
                if (charSpan) {
                    const state = step.charStates.s1[i] || 'initial';
                    charSpan.className = 'lcs-char'; // Reset
                    if (state !== 'initial') charSpan.classList.add(state);
                }
            }
            for (let j = 0; j < n; j++) {
                const charSpan = document.getElementById(`s2-char-${j}`);
                if (charSpan) {
                    const state = step.charStates.s2[j] || 'initial';
                    charSpan.className = 'lcs-char'; // Reset
                    if (state !== 'initial') charSpan.classList.add(state);
                }
            }
        }
         // Also highlight table headers corresponding to comparing chars
         const thS1 = document.getElementById(`th-s1-${step.i - 1}`);
         const thS2 = document.getElementById(`th-s2-${step.j - 1}`);
         document.querySelectorAll('.lcs-table-header.comparing').forEach(th => th.classList.remove('comparing'));
         if (step.charStates.s1[step.i - 1] === 'comparing' && thS1) thS1.classList.add('comparing');
         if (step.charStates.s2[step.j - 1] === 'comparing' && thS2) thS2.classList.add('comparing');
         if (step.charStates.s1[step.i - 1] === 'match' && thS1) thS1.classList.add('match');
         if (step.charStates.s2[step.j - 1] === 'match' && thS2) thS2.classList.add('match');


        // Update Result Display
        const resultContainer = document.getElementById('lcs-result-container');
        if (resultContainer && step.lcsResult) {
            const len = step.lcsResult.length !== undefined ? step.lcsResult.length : '-';
            const seq = step.lcsResult.sequence !== undefined ? step.lcsResult.sequence : '-';
            resultContainer.innerHTML = `<span>LCS Length: ${len}</span><br><span>Sequence: ${seq || "(building...)"}</span>`;
             if (step.type === 'finish' && seq) { // Emphasize final sequence
                 resultContainer.querySelector('span:last-child').innerHTML = `Sequence: <strong class="text-green-600 dark:text-green-400">${seq}</strong>`;
             }
        }

        // Update status message
        const statusMessageEl = document.getElementById('status-message');
        if (statusMessageEl && step.message) {
            statusMessageEl.textContent = step.message;
        }
    } // End of renderStep
}; // End of lcsConfig
