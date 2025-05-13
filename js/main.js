// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const algoNav = document.getElementById('algo-nav');
    const currentAlgoTitle = document.getElementById('current-algo-title');
    const visualizationArea = document.getElementById('visualization-area'); // For bars
    const extraVisualizationArea = document.getElementById('extra-visualization-area'); // For trees, graphs, matrices, extra displays
    const codeBlock = document.getElementById('code-block');
    const pseudoBlock = document.getElementById('pseudo-block');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const stepForwardBtn = document.getElementById('step-forward-btn');
    const stepBackBtn = document.getElementById('step-back-btn');
    const resetBtn = document.getElementById('reset-btn');
    const generateDataBtn = document.getElementById('generate-data-btn');
    const speedSlider = document.getElementById('speed-slider');
    const codeContent = document.getElementById('code-content');
    const pseudoContent = document.getElementById('pseudo-content');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const statusMessage = document.getElementById('status-message');
    const tabButtons = document.querySelectorAll('.tab-btn');

    // --- State Variables ---
    let currentAlgorithmKey = null;
    let currentAlgorithm = null;
    let currentData = [];
    let animationState = {
        steps: [],
        elements: null, // Use null initially, will hold array (bars), object (tree/graph), or 2D array (matrix)
        countElements: [],
        outputElements: [],
        currentStep: -1,
        isPlaying: false,
        timerId: null,
        speed: 500,
        targetValue: null,
        numNodes: 0, // For graph/matrix algorithms
        numItems: 0, // For knapsack
        capacity: 0, // For knapsack
        items: [],   // For knapsack
        m: 0,        // For LCS
        n: 0,        // For LCS
        initialSortedEdges: [], // For Kruskal
    };

    // --- Collect Algorithm Definitions ---
    const algorithms = {
        'linear-search': typeof linearSearchConfig !== 'undefined' ? linearSearchConfig : null,
        'binary-search': typeof binarySearchConfig !== 'undefined' ? binarySearchConfig : null,
        'bubble-sort': typeof bubbleSortConfig !== 'undefined' ? bubbleSortConfig : null,
        'selection-sort': typeof selectionSortConfig !== 'undefined' ? selectionSortConfig : null,
        'insertion-sort': typeof insertionSortConfig !== 'undefined' ? insertionSortConfig : null,
        'merge-sort': typeof mergeSortConfig !== 'undefined' ? mergeSortConfig : null,
        'quick-sort': typeof quickSortConfig !== 'undefined' ? quickSortConfig : null,
        'heap-sort': typeof heapSortConfig !== 'undefined' ? heapSortConfig : null,
        'counting-sort': typeof countingSortConfig !== 'undefined' ? countingSortConfig : null,
        'tree-traversals': typeof treeTraversalsConfig !== 'undefined' ? treeTraversalsConfig : null,
        'bst': typeof bstConfig !== 'undefined' ? bstConfig : null,
        'avl': typeof avlConfig !== 'undefined' ? avlConfig : null,
        'heap-ops': typeof heapOpsConfig !== 'undefined' ? heapOpsConfig : null,
        'tree-bfs-dfs': typeof treeBfsDfsConfig !== 'undefined' ? treeBfsDfsConfig : null,
        'graph-bfs': typeof graphBfsConfig !== 'undefined' ? graphBfsConfig : null,
        'graph-dfs': typeof graphDfsConfig !== 'undefined' ? graphDfsConfig : null,
        'dijkstra': typeof dijkstraConfig !== 'undefined' ? dijkstraConfig : null,
        'bellman-ford': typeof bellmanFordConfig !== 'undefined' ? bellmanFordConfig : null,
        'floyd-warshall': typeof floydWarshallConfig !== 'undefined' ? floydWarshallConfig : null,
        'kruskal': typeof kruskalConfig !== 'undefined' ? kruskalConfig : null,
        'prim': typeof primConfig !== 'undefined' ? primConfig : null,
        'topo-sort': typeof topoSortConfig !== 'undefined' ? topoSortConfig : null,
        'fibonacci': typeof fibonacciConfig !== 'undefined' ? fibonacciConfig : null,
        'lcs': typeof lcsConfig !== 'undefined' ? lcsConfig : null,
        'coin-change': typeof coinChangeConfig !== 'undefined' ? coinChangeConfig : null,
        'mcm': typeof mcmConfig !== 'undefined' ? mcmConfig : null,
        'n-queens': typeof nQueensConfig !== 'undefined' ? nQueensConfig : null,
        'sudoku-solver': typeof sudokuSolverConfig !== 'undefined' ? sudokuSolverConfig : null,
        'rat-maze': typeof ratMazeConfig !== 'undefined' ? ratMazeConfig : null,
    };

    // --- Filter out missing algorithms and assign defaults ---
    Object.keys(algorithms).forEach(key => {
        if (algorithms[key] === null) {
            console.warn(`[Main Init] Algorithm config for '${key}' not found or loaded. Removing from list.`);
            delete algorithms[key];
        } else {
            if (!algorithms[key].setup) {
                console.warn(`[Main Init] Assigning default setup for '${key}'.`);
                algorithms[key].setup = defaultSetup.bind(algorithms[key]);
            }
            if (!algorithms[key].renderStep) {
                 console.warn(`[Main Init] Assigning default renderStep for '${key}'.`);
                algorithms[key].renderStep = defaultRender;
            }
        }
    });

    // --- Default/Placeholder Functions ---
    function defaultSetup(data) {
        const algoName = this.name || 'Algorithm';
        console.log(`[Default Setup] Running for ${algoName}.`); // Log when default is used
        const visArea = document.getElementById('visualization-area');
        const extraVisArea = document.getElementById('extra-visualization-area');
        const displayArea = (this.type === 'tree' || this.type === 'graph' || this.type === 'dynamic-programming') ? extraVisArea : visArea;
        if (displayArea) {
             displayArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center p-4">${algoName} visualization not implemented yet.</p>`;
             if (this.type === 'tree' || this.type === 'graph' || this.type === 'dynamic-programming') {
                 if (visArea) visArea.style.display = 'none';
                 if (extraVisArea) extraVisArea.style.display = 'block';
             } else {
                 if (visArea) visArea.style.display = 'flex';
                 if (extraVisArea) { extraVisArea.style.display = 'block'; extraVisArea.innerHTML = ''; }
             }
        } else {
             console.error(`[Default Setup] Could not find display area for ${algoName}`);
        }
        if (statusMessage) statusMessage.textContent = 'Visualization not implemented.';
        // Return a structure that won't break main.js
        return { steps: [], elements: null, numItems: 0, capacity: 0, items: [], m: 0, n: 0, numNodes: 0, initialSortedEdges: [], target: null };
    }

    function defaultRender(step, elements, animationState) {
        if (statusMessage) statusMessage.textContent = 'Rendering logic not implemented for this step.';
        console.warn("[Default Render] Rendering logic not implemented.");
    }

    // --- Helper Functions ---
    function calculateDelay(sliderValue) { /* ... (same as before) ... */
        const minDelay = 50; const maxDelay = 1500;
        const value = Math.max(1, Math.min(10, sliderValue));
        return maxDelay - (value - 1) * (maxDelay - minDelay) / (10 - 1);
     }
    function generateSampleData(algoKey) { /* ... (same as before) ... */
        const size = 20; let minVal = 10; let maxVal = 100;
        let onlyPositiveInts = false; let requiresSorted = false;
        if (algorithms[algoKey]) { if (algorithms[algoKey].requiresPositiveInts) { onlyPositiveInts = true; minVal = 0; maxVal = 50; } if (algorithms[algoKey].requiresSortedData) { requiresSorted = true; } }
        let data = Array.from({ length: size }, () => { let val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal; return onlyPositiveInts ? Math.max(0, val) : val; });
        if (requiresSorted) { data.sort((a, b) => a - b); }
        console.log("[Generate Data] Generated:", data); return data;
     }

    // --- Core Application Logic ---
    function selectAlgorithm(algoKey) {
        console.log(`[Select Algorithm] Attempting: ${algoKey}`);
        if (!algorithms[algoKey]) {
            console.error(`[Select Algorithm] Algorithm "${algoKey}" not found.`);
            resetVisualizationState();
            currentAlgoTitle.textContent = 'Algorithm Not Found';
            codeBlock.innerHTML = '// Algorithm definition missing';
            pseudoBlock.textContent = '// Algorithm definition missing';
            visualizationArea.innerHTML = `<p class="text-red-500 dark:text-red-400 self-center">Error: Algorithm '${algoKey}' definition missing.</p>`;
            extraVisualizationArea.innerHTML = '';
            statusMessage.textContent = 'Algorithm definition missing.';
            updateButtonStates();
            return;
        }

        pauseAnimation();
        currentAlgorithmKey = algoKey;
        currentAlgorithm = algorithms[algoKey];
        currentData = generateSampleData(currentAlgorithmKey); // Generate data even if setup ignores it

        console.log(`[Select Algorithm] Selected: ${currentAlgorithm.name}`);
        currentAlgoTitle.textContent = currentAlgorithm.name;
        codeBlock.innerHTML = currentAlgorithm.code || '// Code not available';
        pseudoBlock.textContent = currentAlgorithm.pseudocode || '// Pseudocode not available';

        setupVisualization(); // Setup will handle data generation if needed
    }

    function setupVisualization() {
        if (!currentAlgorithm) {
            console.warn("[Setup Vis] Called without an algorithm selected.");
            visualizationArea.innerHTML = '<p class="text-gray-500 dark:text-gray-400 self-center">Select an Algorithm</p>';
            extraVisualizationArea.innerHTML = '';
            statusMessage.textContent = 'Error: No algorithm selected.';
            updateButtonStates();
            return;
        }

        console.log(`[Setup Vis] Starting for: ${currentAlgorithm.name}`);
        pauseAnimation(); // Ensure animation is stopped

        // --- Reset Animation State ---
        console.log("[Setup Vis] Resetting animationState.");
        animationState = {
            ...animationState, // Preserve speed setting
            steps: [], elements: null, countElements: [], outputElements: [],
            currentStep: -1, targetValue: null, numNodes: 0, numItems: 0,
            capacity: 0, items: [], m: 0, n: 0, initialSortedEdges: [],
            isPlaying: false, // Ensure isPlaying is reset
            timerId: null,    // Ensure timerId is cleared
        };
         if (animationState.timerId) { clearTimeout(animationState.timerId); animationState.timerId = null; }

        // --- Configure Display Areas based on Algorithm Type ---
        const mainVisArea = document.getElementById('visualization-area');
        const extraVisArea = document.getElementById('extra-visualization-area');
        const algoType = currentAlgorithm.type || 'default'; // Handle missing type
        console.log(`[Setup Vis] Algorithm type: ${algoType}`);

        if (algoType === 'tree' || algoType === 'graph' || algoType === 'dynamic-programming') {
            console.log("[Setup Vis] Configuring display for tree/graph/dp type.");
            if (mainVisArea) mainVisArea.style.display = 'none';
            if (extraVisArea) { extraVisArea.style.display = 'block'; extraVisArea.innerHTML = ''; }
            else { console.error("[Setup Vis] extraVisualizationArea not found!"); }
        } else { // Default (bar-based)
            console.log("[Setup Vis] Configuring display for default/bar type.");
            if (mainVisArea) { mainVisArea.style.display = 'flex'; mainVisArea.innerHTML = ''; }
            else { console.error("[Setup Vis] visualizationArea not found!"); }
            if (extraVisArea) { extraVisArea.style.display = 'block'; extraVisArea.innerHTML = ''; }
            else { console.error("[Setup Vis] extraVisualizationArea not found!"); }
        }

       // --- Run Algorithm Setup ---
       let setupResult = null; // Define outside try
       try {
            console.log("[Setup Vis] Calling setup function...");
            setupResult = currentAlgorithm.setup(currentData);
            console.log("[Setup Vis] Setup function returned:", setupResult); // Log the result

            // Validate the setup result structure minimally
            if (!setupResult || typeof setupResult !== 'object') {
                throw new Error("Setup function did not return a valid object.");
            }
            if (!Array.isArray(setupResult.steps)) {
                 console.warn("[Setup Vis] setupResult.steps is not an array. Defaulting to empty array.");
                 setupResult.steps = []; // Attempt recovery
            }

            // Store results in animationState
            animationState.steps = setupResult.steps;
            animationState.elements = setupResult.elements; // Store whatever setup returns
            animationState.countElements = setupResult.countElements || [];
            animationState.outputElements = setupResult.outputElements || [];
            animationState.targetValue = setupResult.target;
            animationState.numNodes = setupResult.numNodes || 0;
            animationState.numItems = setupResult.numItems || 0;
            animationState.capacity = setupResult.capacity || 0;
            animationState.items = setupResult.items || [];
            animationState.m = setupResult.m || 0;
            animationState.n = setupResult.n || 0;
            animationState.initialSortedEdges = setupResult.initialSortedEdges || [];

            console.log(`[Setup Vis] Stored setup results. Steps generated: ${animationState.steps.length}`);

            // Render the initial step if steps exist
            if (animationState.steps.length > 0) {
                animationState.currentStep = 0;
                console.log("[Setup Vis] Rendering initial step (step 0)...");
                currentAlgorithm.renderStep(animationState.steps[0], animationState.elements, animationState);
                statusMessage.textContent = animationState.steps[0]?.message || 'Ready';
                console.log("[Setup Vis] Initial step rendered.");
            } else {
                console.log("[Setup Vis] No steps generated by setup.");
                const displayArea = (algoType === 'tree' || algoType === 'graph' || algoType === 'dynamic-programming') ? extraVisArea : mainVisArea;
                if (displayArea && !displayArea.innerHTML.includes('not implemented yet')) {
                    displayArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center p-4">No visualization steps generated.</p>`;
                }
                statusMessage.textContent = 'No steps to visualize.';
            }
        } catch (error) {
             console.error(`[Setup Vis] Error during setup for ${currentAlgorithm.name}:`, error);
             statusMessage.textContent = 'Error during setup'; // Display error message
             // Attempt to display error in the correct area
             const errorArea = (algoType === 'tree' || algoType === 'graph' || algoType === 'dynamic-programming') ? extraVisArea : mainVisArea;
             if(errorArea) errorArea.innerHTML = `<p class="text-red-500 dark:text-red-400 self-center p-4">Error during setup: ${error.message}. Check console.</p>`;
             // Reset state parts to prevent issues
             animationState.steps = [];
             animationState.elements = null;
             animationState.currentStep = -1;
             // Reset other algorithm-specific state
             animationState.countElements = []; animationState.outputElements = [];
             animationState.targetValue = null; animationState.numNodes = 0;
             animationState.numItems = 0; animationState.capacity = 0;
             animationState.items = []; animationState.m = 0; animationState.n = 0;
             animationState.initialSortedEdges = [];
        } finally {
             // Always update button states, regardless of success or failure
             console.log("[Setup Vis] Updating button states.");
             updateButtonStates();
        }
    }

    function resetVisualizationState() { /* ... (same as before) ... */
        console.log("[Reset Vis] Resetting visualization state.");
        pauseAnimation();
        currentAlgorithmKey = null; currentAlgorithm = null; currentData = [];
        animationState = { ...animationState, steps: [], elements: null, countElements: [], outputElements: [], currentStep: -1, isPlaying: false, timerId: null, targetValue: null, numNodes: 0, numItems: 0, capacity: 0, items: [], m: 0, n: 0, initialSortedEdges: [] };
        visualizationArea.innerHTML = '<p class="text-gray-500 dark:text-gray-400 self-center">Select an Algorithm</p>'; visualizationArea.style.display = 'flex';
        extraVisualizationArea.innerHTML = ''; extraVisualizationArea.style.display = 'block';
        currentAlgoTitle.textContent = 'Select an Algorithm'; codeBlock.innerHTML = '// Select algorithm...'; pseudoBlock.textContent = '// Select algorithm...';
        statusMessage.textContent = ''; updateButtonStates();
        document.querySelectorAll('#algo-nav a.active').forEach(a => a.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'font-semibold', 'active'));
    }
    function switchTab(tabName) { /* ... (same as before) ... */
        console.log(`[Switch Tab] Switching to: ${tabName}`);
        tabButtons.forEach(button => { const isActive = button.dataset.tab === tabName; button.classList.toggle('active', isActive); button.classList.toggle('border-blue-500', isActive); button.classList.toggle('text-blue-600', isActive); button.classList.toggle('dark:text-blue-400', isActive); button.classList.toggle('border-transparent', !isActive); button.classList.toggle('text-gray-500', !isActive); button.classList.toggle('dark:text-gray-400', !isActive); button.classList.toggle('hover:text-gray-700', !isActive); button.classList.toggle('dark:hover:text-gray-300', !isActive); button.classList.toggle('hover:border-gray-300', !isActive); button.classList.toggle('dark:hover:border-gray-600', !isActive); });
        codeContent.style.display = tabName === 'code' ? 'block' : 'none'; pseudoContent.style.display = tabName === 'pseudo' ? 'block' : 'none';
     }
    function updateSpeed() { /* ... (same as before) ... */
        animationState.speed = calculateDelay(speedSlider.value); console.log(`[Speed Update] Speed set to: ${animationState.speed}ms`); if (animationState.isPlaying) { clearTimeout(animationState.timerId); animationState.timerId = null; playAnimation(); }
     }
    function togglePlayPause() { /* ... (same as before) ... */
        if (animationState.isPlaying) { console.log("[Play/Pause] Pausing."); pauseAnimation(); } else { console.log("[Play/Pause] Playing."); playAnimation(); }
     }
    function playAnimation() { /* ... (same as before, with logging) ... */
        if (!currentAlgorithm || !animationState.steps || animationState.steps.length === 0 || animationState.isPlaying || animationState.currentStep >= animationState.steps.length - 1) { console.log("[Play] Cannot play.", {playing: animationState.isPlaying, steps: animationState.steps?.length, current: animationState.currentStep}); pauseAnimation(); updateButtonStates(); return; }
        animationState.isPlaying = true; playPauseBtn.textContent = 'Pause'; playPauseBtn.classList.remove('bg-green-600', 'hover:bg-green-700'); playPauseBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600'); updateButtonStates();
        function step() { if (!animationState.isPlaying) { console.log("[Play Step] Stopped during execution."); return; } if (animationState.currentStep < animationState.steps.length - 1) { animationState.currentStep++; try { currentAlgorithm.renderStep(animationState.steps[animationState.currentStep], animationState.elements, animationState); statusMessage.textContent = animationState.steps[animationState.currentStep]?.message || ''; } catch (error) { console.error(`[Play Step] Error rendering step ${animationState.currentStep}:`, error); statusMessage.textContent = `Error on step ${animationState.currentStep + 1}`; pauseAnimation(); return; } updateButtonStates(); animationState.timerId = setTimeout(step, animationState.speed); } else { console.log("[Play Step] Animation finished."); pauseAnimation(); } }
        clearTimeout(animationState.timerId); animationState.timerId = setTimeout(step, animationState.speed);
     }
    function pauseAnimation() { /* ... (same as before, with logging) ... */
        if (animationState.timerId) { clearTimeout(animationState.timerId); animationState.timerId = null; } animationState.isPlaying = false; playPauseBtn.textContent = 'Play'; playPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600'); playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700'); updateButtonStates(); console.log("[Pause] Animation paused.");
     }
    function stepForward() { /* ... (same as before, with logging) ... */
        if (!currentAlgorithm || animationState.isPlaying || !animationState.steps || animationState.steps.length === 0 || animationState.currentStep >= animationState.steps.length - 1) { console.log("[Step Fwd] Cannot step forward."); return; } pauseAnimation(); animationState.currentStep++; console.log(`[Step Fwd] Stepping to step: ${animationState.currentStep}`); try { currentAlgorithm.renderStep(animationState.steps[animationState.currentStep], animationState.elements, animationState); statusMessage.textContent = animationState.steps[animationState.currentStep]?.message || ''; } catch (error) { console.error(`[Step Fwd] Error rendering step ${animationState.currentStep}:`, error); statusMessage.textContent = `Error on step ${animationState.currentStep + 1}`; } updateButtonStates();
     }
    function stepBack() { /* ... (same as before, with logging) ... */
        if (!currentAlgorithm || animationState.isPlaying || !animationState.steps || animationState.steps.length === 0 || animationState.currentStep <= 0) { console.log("[Step Back] Cannot step back."); return; } pauseAnimation(); animationState.currentStep--; console.log(`[Step Back] Stepping back to step: ${animationState.currentStep}`); try { currentAlgorithm.renderStep(animationState.steps[animationState.currentStep], animationState.elements, animationState); statusMessage.textContent = animationState.steps[animationState.currentStep]?.message || ''; } catch (error) { console.error(`[Step Back] Error rendering step ${animationState.currentStep}:`, error); statusMessage.textContent = `Error on step ${animationState.currentStep + 1}`; } updateButtonStates();
     }
    function resetToStart() { /* ... (same as before, with logging) ... */
        if (!currentAlgorithm || !animationState.steps || animationState.steps.length === 0) { console.log("[Reset] Nothing to reset."); return; } console.log("[Reset] Resetting to start (step 0)."); pauseAnimation(); animationState.currentStep = 0; try { currentAlgorithm.renderStep(animationState.steps[0], animationState.elements, animationState); statusMessage.textContent = animationState.steps[0]?.message || 'Ready'; } catch (error) { console.error(`[Reset] Error rendering step 0:`, error); statusMessage.textContent = `Error on step 1`; } updateButtonStates();
     }
    function handleGenerateData() { /* ... (same as before, with logging) ... */
        if (!currentAlgorithmKey) { statusMessage.textContent = "Please select an algorithm first."; return; } if (animationState.isPlaying) { pauseAnimation(); } console.log(`[Generate Data] Generating new data for: ${currentAlgorithmKey}`); currentData = generateSampleData(currentAlgorithmKey); setupVisualization();
     }
    function updateButtonStates() { /* ... (same as before) ... */
        const stepsAvailable = animationState.steps && animationState.steps.length > 0;
        const isAtStart = !stepsAvailable || animationState.currentStep <= 0;
        const isAtEnd = !stepsAvailable || animationState.currentStep >= animationState.steps.length - 1;
        playPauseBtn.disabled = !stepsAvailable || isAtEnd || !currentAlgorithm; stepForwardBtn.disabled = !stepsAvailable || isAtEnd || animationState.isPlaying || !currentAlgorithm; stepBackBtn.disabled = !stepsAvailable || isAtStart || animationState.isPlaying || !currentAlgorithm; resetBtn.disabled = !stepsAvailable || isAtStart || animationState.isPlaying || !currentAlgorithm; generateDataBtn.disabled = !currentAlgorithmKey || animationState.isPlaying;
        if (stepsAvailable && isAtEnd && !animationState.isPlaying) { playPauseBtn.textContent = 'Done'; playPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600'); playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700'); } else if (!animationState.isPlaying) { playPauseBtn.textContent = 'Play'; playPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600'); playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700'); } else { playPauseBtn.textContent = 'Pause'; playPauseBtn.classList.remove('bg-green-600', 'hover:bg-green-700'); playPauseBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600'); }
        const buttonsToStyle = [playPauseBtn, stepForwardBtn, stepBackBtn, resetBtn, generateDataBtn]; buttonsToStyle.forEach(btn => { if (btn.disabled) { btn.classList.add('opacity-50', 'cursor-not-allowed'); } else { btn.classList.remove('opacity-50', 'cursor-not-allowed'); } });
     }

    // --- Event Listeners ---
    algoNav.addEventListener('click', (e) => { /* ... (same as before) ... */
        let targetLink = e.target.closest('a[data-algo]'); if (targetLink) { e.preventDefault(); const algoKey = targetLink.dataset.algo; console.log(`[Sidebar] Link clicked: ${algoKey}`); document.querySelectorAll('#algo-nav a.active').forEach(a => a.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'font-semibold', 'active')); targetLink.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'font-semibold', 'active'); selectAlgorithm(algoKey); } else if (e.target.tagName === 'SUMMARY') { /* Allow toggle */ }
     });
    darkModeToggle.addEventListener('change', () => { /* ... (same as before) ... */
        if (darkModeToggle.checked) { document.documentElement.classList.add('dark'); localStorage.setItem('darkMode', 'enabled'); console.log("[Dark Mode] Enabled"); } else { document.documentElement.classList.remove('dark'); localStorage.setItem('darkMode', 'disabled'); console.log("[Dark Mode] Disabled"); }
     });
    tabButtons.forEach(button => { button.addEventListener('click', () => switchTab(button.dataset.tab)); });
    playPauseBtn.addEventListener('click', togglePlayPause);
    stepForwardBtn.addEventListener('click', stepForward);
    stepBackBtn.addEventListener('click', stepBack);
    resetBtn.addEventListener('click', resetToStart);
    generateDataBtn.addEventListener('click', handleGenerateData);
    speedSlider.addEventListener('input', updateSpeed);

    // --- Initial Setup ---
    if (localStorage.getItem('darkMode') === 'enabled' || (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) { darkModeToggle.checked = true; document.documentElement.classList.add('dark'); } else { darkModeToggle.checked = false; document.documentElement.classList.remove('dark'); }
    animationState.speed = calculateDelay(speedSlider.value); switchTab('code'); resetVisualizationState(); console.log("Algorithm Visualizer Initialized.");

    // Expose main state/functions if needed
    window.algorithmVisualizerMain = { animationState: animationState, updateButtonStates: updateButtonStates, resetToStart: resetToStart, playAnimation: playAnimation, pauseAnimation: pauseAnimation };

}); // End DOMContentLoaded
