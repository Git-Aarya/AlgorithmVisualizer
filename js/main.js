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
        // Add other implemented algorithms here
        // Placeholders for unimplemented ones:
        'fibonacci': { name: 'Fibonacci (DP/Memo)', code: '// TODO: Fibonacci Code', pseudocode: '// TODO: Fibonacci Pseudocode', setup: null, renderStep: null },
        'lcs': { name: 'Longest Common Subsequence', code: '// TODO: LCS Code', pseudocode: '// TODO: LCS Pseudocode', setup: null, renderStep: null },
        'knapsack': { name: '0/1 Knapsack', code: '// TODO: Knapsack Code', pseudocode: '// TODO: Knapsack Pseudocode', setup: null, renderStep: null },
        'coin-change': { name: 'Coin Change', code: '// TODO: Coin Change Code', pseudocode: '// TODO: Coin Change Pseudocode', setup: null, renderStep: null },
        'mcm': { name: 'Matrix Chain Multiplication', code: '// TODO: MCM Code', pseudocode: '// TODO: MCM Pseudocode', setup: null, renderStep: null },
        'n-queens': { name: 'N-Queens', code: '// TODO: N-Queens Code', pseudocode: '// TODO: N-Queens Pseudocode', setup: null, renderStep: null },
        'sudoku': { name: 'Sudoku Solver', code: '// TODO: Sudoku Solver Code', pseudocode: '// TODO: Sudoku Solver Pseudocode', setup: null, renderStep: null },
        'rat-maze': { name: 'Rat in a Maze', code: '// TODO: Rat Maze Code', pseudocode: '// TODO: Rat Maze Pseudocode', setup: null, renderStep: null },
        'word-search': { name: 'Word Search', code: '// TODO: Word Search Code', pseudocode: '// TODO: Word Search Pseudocode', setup: null, renderStep: null },
        'union-find': { name: 'Union-Find', code: '// TODO: Union-Find Code', pseudocode: '// TODO: Union-Find Pseudocode', setup: null, renderStep: null },
        'kmp': { name: 'KMP Algorithm', code: '// TODO: KMP Code', pseudocode: '// TODO: KMP Pseudocode', setup: null, renderStep: null },
        'rabin-karp': { name: 'Rabin-Karp', code: '// TODO: Rabin-Karp Code', pseudocode: '// TODO: Rabin-Karp Pseudocode', setup: null, renderStep: null },
        'sliding-window': { name: 'Sliding Window', code: '// TODO: Sliding Window Code', pseudocode: '// TODO: Sliding Window Pseudocode', setup: null, renderStep: null },
        'two-pointers': { name: 'Two Pointers', code: '// TODO: Two Pointers Code', pseudocode: '// TODO: Two Pointers Pseudocode', setup: null, renderStep: null },
    };

    // --- Filter out missing algorithms and assign defaults ---
    Object.keys(algorithms).forEach(key => {
        if (algorithms[key] === null) {
            console.warn(`Algorithm config for '${key}' not found or loaded. Removing from list.`);
            delete algorithms[key];
        } else {
            if (!algorithms[key].setup) {
                algorithms[key].setup = defaultSetup.bind(algorithms[key]);
            }
            if (!algorithms[key].renderStep) {
                algorithms[key].renderStep = defaultRender;
            }
        }
    });

    // --- Default/Placeholder Functions ---
    function defaultSetup(data) {
        const algoName = this.name || 'Algorithm';
        const visArea = document.getElementById('visualization-area');
        const extraVisArea = document.getElementById('extra-visualization-area');
        // Display message in the appropriate area based on expected type
        const displayArea = (this.type === 'tree' || this.type === 'graph') ? extraVisArea : visArea;
        if (displayArea) {
             displayArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center p-4">${algoName} visualization not implemented yet.</p>`;
             // Ensure the correct area is visible
             if (this.type === 'tree' || this.type === 'graph') {
                 if (visArea) visArea.style.display = 'none';
                 if (extraVisArea) extraVisArea.style.display = 'block';
             } else {
                 if (visArea) visArea.style.display = 'flex';
                 if (extraVisArea) extraVisArea.style.display = 'block'; // Keep potentially needed
                 if (extraVisArea) extraVisArea.innerHTML = ''; // Clear extra if not tree/graph
             }
        }
        if (statusMessage) statusMessage.textContent = 'Visualization not implemented.';
        return { steps: [], elements: null, countElements: [], outputElements: [], target: null, numNodes: 0 };
    }

    function defaultRender(step, elements, animationState) {
        if (statusMessage) statusMessage.textContent = 'Rendering logic not implemented for this step.';
    }

    // --- Helper Functions ---
    function calculateDelay(sliderValue) {
        const minDelay = 50; const maxDelay = 1500;
        const value = Math.max(1, Math.min(10, sliderValue));
        return maxDelay - (value - 1) * (maxDelay - minDelay) / (10 - 1);
    }

    function generateSampleData(algoKey) {
        const size = 20; // Default size for bar-based algorithms
        let minVal = 10; let maxVal = 100;
        let onlyPositiveInts = false; let requiresSorted = false;

        if (algorithms[algoKey]) {
            if (algorithms[algoKey].requiresPositiveInts) { onlyPositiveInts = true; minVal = 0; maxVal = 50; }
            if (algorithms[algoKey].requiresSortedData) { requiresSorted = true; }
            // Graph/Tree algorithms generate their own structure in setup, so data array isn't primary
        }

        let data = Array.from({ length: size }, () => {
            let val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
            return onlyPositiveInts ? Math.max(0, val) : val;
        });
        if (requiresSorted) { data.sort((a, b) => a - b); }
        console.log("Generated sample data (for non-graph/tree):", data);
        return data; // Return array, even if graph/tree setup ignores it
    }

    // --- Core Application Logic ---
    function selectAlgorithm(algoKey) {
        console.log(`Selecting algorithm: ${algoKey}`);
        if (!algorithms[algoKey]) {
            console.error(`Algorithm "${algoKey}" not found.`);
            resetVisualizationState(); // Reset UI
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
        // Generate data, although graph/tree setups might ignore it
        currentData = generateSampleData(currentAlgorithmKey);

        console.log(`Selected: ${currentAlgorithm.name}`);
        currentAlgoTitle.textContent = currentAlgorithm.name;
        codeBlock.innerHTML = currentAlgorithm.code || '// Code not available';
        pseudoBlock.textContent = currentAlgorithm.pseudocode || '// Pseudocode not available';

        setupVisualization(); // Setup will handle data generation if needed
    }

    function setupVisualization() {
        if (!currentAlgorithm) {
            console.warn("Setup called without an algorithm selected.");
            visualizationArea.innerHTML = '<p class="text-gray-500 dark:text-gray-400 self-center">Select an Algorithm</p>';
            extraVisualizationArea.innerHTML = '';
            statusMessage.textContent = 'Error: No algorithm selected.';
            updateButtonStates();
            return;
        }

        console.log(`Setting up visualization for: ${currentAlgorithm.name}`);
        pauseAnimation(); // Ensure animation is stopped

        // --- Reset Animation State ---
        animationState = {
            ...animationState, // Preserve speed setting
            steps: [],
            elements: null, // Reset elements
            countElements: [],
            outputElements: [],
            currentStep: -1,
            targetValue: null,
            numNodes: 0,
            isPlaying: false, // Ensure isPlaying is reset
            timerId: null,    // Ensure timerId is cleared
        };
         if (animationState.timerId) { // Explicitly clear any lingering timer
             clearTimeout(animationState.timerId);
             animationState.timerId = null;
         }

        // --- Configure Display Areas based on Algorithm Type ---
        const mainVisArea = document.getElementById('visualization-area');
        const extraVisArea = document.getElementById('extra-visualization-area');

        if (currentAlgorithm.type === 'tree' || currentAlgorithm.type === 'graph') {
            console.log("Configuring display for tree/graph type.");
            if (mainVisArea) mainVisArea.style.display = 'none';
            if (extraVisArea) {
                extraVisArea.style.display = 'block';
                extraVisArea.innerHTML = ''; // Let setup populate this area
            }
        } else { // Default (bar-based) or others using main area
            console.log("Configuring display for default/bar type.");
            if (mainVisArea) {
                mainVisArea.style.display = 'flex';
                mainVisArea.innerHTML = ''; // Clear bar area
            }
            if (extraVisArea) {
                extraVisArea.style.display = 'block'; // Still potentially used (e.g., count sort)
                extraVisArea.innerHTML = ''; // Clear extra area
            }
        }

       // --- Run Algorithm Setup ---
       try {
            // Pass currentData, though graph/tree setups might ignore it
            const setupResult = currentAlgorithm.setup(currentData);

            // Store results in animationState
            animationState.steps = setupResult.steps || [];
            // Store whatever 'elements' structure the setup returns
            animationState.elements = setupResult.elements;
            animationState.countElements = setupResult.countElements || [];
            animationState.outputElements = setupResult.outputElements || [];
            animationState.targetValue = setupResult.target; // For search algorithms
            animationState.numNodes = setupResult.numNodes || 0; // For graph/matrix size

            console.log(`Setup generated ${animationState.steps.length} steps.`);

            // Render the initial step if steps exist
            if (animationState.steps.length > 0) {
                animationState.currentStep = 0;
                // Pass the potentially complex 'elements' structure to renderStep
                currentAlgorithm.renderStep(animationState.steps[0], animationState.elements, animationState);
                statusMessage.textContent = animationState.steps[0]?.message || 'Ready';
            } else {
                // Handle cases where setup generates no steps (e.g., empty input)
                const displayArea = (currentAlgorithm.type === 'tree' || currentAlgorithm.type === 'graph') ? extraVisArea : mainVisArea;
                if (displayArea && !displayArea.innerHTML.includes('not implemented yet')) { // Avoid overwriting "not implemented" message
                    displayArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center p-4">No visualization steps generated (e.g., empty input).</p>`;
                }
                statusMessage.textContent = 'No steps to visualize.';
            }
        } catch (error) {
             console.error(`Error during setup for ${currentAlgorithm.name}:`, error);
             const errorArea = (currentAlgorithm.type === 'tree' || currentAlgorithm.type === 'graph') ? extraVisArea : mainVisArea;
             if(errorArea) errorArea.innerHTML = `<p class="text-red-500 dark:text-red-400 self-center p-4">Error during setup. Check console.</p>`;
             statusMessage.textContent = 'Error during setup';
             // Reset state parts that might be inconsistent
             animationState.steps = [];
             animationState.elements = null;
             animationState.countElements = [];
             animationState.outputElements = [];
             animationState.currentStep = -1;
             animationState.numNodes = 0;
        }

        updateButtonStates(); // Update buttons based on the new state
    }

    function resetVisualizationState() {
        console.log("Resetting visualization state.");
        pauseAnimation();
        currentAlgorithmKey = null;
        currentAlgorithm = null;
        currentData = [];
        animationState = {
            ...animationState, // Keep speed
            steps: [], elements: null, countElements: [], outputElements: [],
            currentStep: -1, isPlaying: false, timerId: null, targetValue: null, numNodes: 0,
        };
        // Reset display areas
        visualizationArea.innerHTML = '<p class="text-gray-500 dark:text-gray-400 self-center">Select an Algorithm</p>';
        visualizationArea.style.display = 'flex'; // Show default area
        extraVisualizationArea.innerHTML = '';
        extraVisualizationArea.style.display = 'block'; // Keep visible but clear

        // Reset UI text
        currentAlgoTitle.textContent = 'Select an Algorithm';
        codeBlock.innerHTML = '// Select an algorithm to view the code';
        pseudoBlock.textContent = '// Select an algorithm to view the pseudocode';
        statusMessage.textContent = '';
        updateButtonStates(); // Disable buttons appropriately
        // Clear active state from sidebar
        document.querySelectorAll('#algo-nav a.active').forEach(a => a.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'font-semibold', 'active'));
    }

    function switchTab(tabName) {
        console.log(`Switching tab to: ${tabName}`);
        tabButtons.forEach(button => {
            const isActive = button.dataset.tab === tabName;
            button.classList.toggle('active', isActive);
            button.classList.toggle('border-blue-500', isActive);
            button.classList.toggle('text-blue-600', isActive);
            button.classList.toggle('dark:text-blue-400', isActive);
            button.classList.toggle('border-transparent', !isActive);
            button.classList.toggle('text-gray-500', !isActive);
            button.classList.toggle('dark:text-gray-400', !isActive);
            button.classList.toggle('hover:text-gray-700', !isActive);
            button.classList.toggle('dark:hover:text-gray-300', !isActive);
            button.classList.toggle('hover:border-gray-300', !isActive);
            button.classList.toggle('dark:hover:border-gray-600', !isActive);
        });
        codeContent.style.display = tabName === 'code' ? 'block' : 'none';
        pseudoContent.style.display = tabName === 'pseudo' ? 'block' : 'none';
    }

    function updateSpeed() {
        animationState.speed = calculateDelay(speedSlider.value);
        console.log(`Animation speed set to: ${animationState.speed}ms`);
        if (animationState.isPlaying) {
            clearTimeout(animationState.timerId);
            animationState.timerId = null; // Clear timer ID
            playAnimation(); // Restart loop with new speed
        }
    }

    function togglePlayPause() {
        if (animationState.isPlaying) {
            console.log("Pausing animation.");
            pauseAnimation();
        } else {
            console.log("Playing animation.");
            playAnimation();
        }
    }

    function playAnimation() {
        // Ensure we can play: algorithm selected, steps exist, not already playing, not at the end
        if (!currentAlgorithm || !animationState.steps || animationState.steps.length === 0 || animationState.isPlaying || animationState.currentStep >= animationState.steps.length - 1) {
            if (animationState.currentStep >= animationState.steps.length - 1) {
                console.log("Play called but already at the end or no steps.");
                pauseAnimation(); // Ensure state is paused
            } else if (animationState.isPlaying) {
                 console.log("Play called while already playing.");
            } else {
                 console.log("Cannot play - no algorithm or steps.");
            }
            updateButtonStates(); // Ensure buttons reflect inability to play
            return;
        }

        animationState.isPlaying = true;
        playPauseBtn.textContent = 'Pause';
        playPauseBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        playPauseBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
        updateButtonStates(); // Disable step/reset buttons

        function step() {
            // Double-check if still playing before proceeding
            if (!animationState.isPlaying) {
                 console.log("Animation stopped during step execution.");
                 return;
            }

            if (animationState.currentStep < animationState.steps.length - 1) {
                animationState.currentStep++;
                try {
                    // Render the current step
                    currentAlgorithm.renderStep(animationState.steps[animationState.currentStep], animationState.elements, animationState);
                    statusMessage.textContent = animationState.steps[animationState.currentStep]?.message || '';
                } catch (error) {
                     console.error(`Error rendering step ${animationState.currentStep} for ${currentAlgorithm.name}:`, error);
                     statusMessage.textContent = `Error on step ${animationState.currentStep + 1}`;
                     pauseAnimation(); // Stop on error
                     return; // Exit step function
                }
                updateButtonStates(); // Update buttons (e.g., disable step back/forward if at ends)

                // Schedule the next step
                animationState.timerId = setTimeout(step, animationState.speed);
            } else {
                // Reached the end
                console.log("Animation finished.");
                pauseAnimation(); // Set state to paused, update buttons
            }
        }
        // Clear any previous timer just in case before starting a new one
        clearTimeout(animationState.timerId);
        animationState.timerId = setTimeout(step, animationState.speed); // Start the loop
    }

    function pauseAnimation() {
        if (animationState.timerId) {
             clearTimeout(animationState.timerId); // Stop scheduled next step
             animationState.timerId = null;
        }
        animationState.isPlaying = false; // Set state flag
        playPauseBtn.textContent = 'Play'; // Update button text
        playPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        updateButtonStates(); // Re-enable step/reset buttons if applicable
    }

    function stepForward() {
        // Ensure we can step forward
        if (!currentAlgorithm || animationState.isPlaying || !animationState.steps || animationState.steps.length === 0 || animationState.currentStep >= animationState.steps.length - 1) {
            console.log("Cannot step forward.");
            return;
        }
        pauseAnimation(); // Ensure paused before stepping
        animationState.currentStep++;
        console.log(`Stepping forward to step: ${animationState.currentStep}`);
        try {
            currentAlgorithm.renderStep(animationState.steps[animationState.currentStep], animationState.elements, animationState);
            statusMessage.textContent = animationState.steps[animationState.currentStep]?.message || '';
        } catch (error) {
             console.error(`Error rendering step ${animationState.currentStep} for ${currentAlgorithm.name}:`, error);
             statusMessage.textContent = `Error on step ${animationState.currentStep + 1}`;
        }
        updateButtonStates(); // Update button enabled/disabled states
    }

    function stepBack() {
        // Ensure we can step back
        if (!currentAlgorithm || animationState.isPlaying || !animationState.steps || animationState.steps.length === 0 || animationState.currentStep <= 0) {
            console.log("Cannot step back.");
            return;
        }
        pauseAnimation(); // Ensure paused before stepping
        animationState.currentStep--;
        console.log(`Stepping back to step: ${animationState.currentStep}`);
         try {
            currentAlgorithm.renderStep(animationState.steps[animationState.currentStep], animationState.elements, animationState);
            statusMessage.textContent = animationState.steps[animationState.currentStep]?.message || '';
         } catch (error) {
             console.error(`Error rendering step ${animationState.currentStep} for ${currentAlgorithm.name}:`, error);
             statusMessage.textContent = `Error on step ${animationState.currentStep + 1}`;
         }
        updateButtonStates(); // Update button enabled/disabled states
    }

    function resetToStart() {
        // Ensure there's something to reset
        if (!currentAlgorithm || !animationState.steps || animationState.steps.length === 0) {
            console.log("Nothing to reset.");
            return;
        }
        console.log("Resetting to start (step 0).");
        pauseAnimation(); // Ensure paused
        animationState.currentStep = 0; // Go back to the first step
        try {
            // Render the first step
            currentAlgorithm.renderStep(animationState.steps[0], animationState.elements, animationState);
            statusMessage.textContent = animationState.steps[0]?.message || 'Ready';
        } catch (error) {
             console.error(`Error rendering step 0 for ${currentAlgorithm.name}:`, error);
             statusMessage.textContent = `Error on step 1`;
        }
        updateButtonStates(); // Update buttons (e.g., disable step back)
    }

    function handleGenerateData() {
        if (!currentAlgorithmKey) {
            statusMessage.textContent = "Please select an algorithm first.";
            return;
        }
        if (animationState.isPlaying) {
             pauseAnimation(); // Pause if playing before generating new data
        }
        console.log(`Generating new data for: ${currentAlgorithmKey}`);
        // Generate new base data (might be ignored by graph/tree setups)
        currentData = generateSampleData(currentAlgorithmKey);
        // Re-run the setup for the current algorithm
        setupVisualization();
    }

    function updateButtonStates() {
        const stepsAvailable = animationState.steps && animationState.steps.length > 0;
        const isAtStart = !stepsAvailable || animationState.currentStep <= 0;
        const isAtEnd = !stepsAvailable || animationState.currentStep >= animationState.steps.length - 1;

        // Enable/disable based on state
        playPauseBtn.disabled = !stepsAvailable || isAtEnd || !currentAlgorithm;
        stepForwardBtn.disabled = !stepsAvailable || isAtEnd || animationState.isPlaying || !currentAlgorithm;
        stepBackBtn.disabled = !stepsAvailable || isAtStart || animationState.isPlaying || !currentAlgorithm;
        resetBtn.disabled = !stepsAvailable || isAtStart || animationState.isPlaying || !currentAlgorithm;
        generateDataBtn.disabled = !currentAlgorithmKey || animationState.isPlaying; // Disable generate if playing

        // Update Play/Pause button text and style
        if (stepsAvailable && isAtEnd && !animationState.isPlaying) {
            playPauseBtn.textContent = 'Done';
            playPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
            playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        } else if (!animationState.isPlaying) {
            playPauseBtn.textContent = 'Play';
            playPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
            playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        } else { // Is playing
            playPauseBtn.textContent = 'Pause';
            playPauseBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            playPauseBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
        }

        // Apply generic disabled styling
        const buttonsToStyle = [playPauseBtn, stepForwardBtn, stepBackBtn, resetBtn, generateDataBtn];
        buttonsToStyle.forEach(btn => {
            if (btn.disabled) {
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
    }

    // --- Event Listeners ---
    algoNav.addEventListener('click', (e) => {
        // Handle clicks on algorithm links within the sidebar details/summary structure
        let targetLink = e.target.closest('a[data-algo]'); // Find the closest link with data-algo
        if (targetLink) {
            e.preventDefault();
            const algoKey = targetLink.dataset.algo;
            console.log(`Sidebar link clicked: ${algoKey}`);
            // Remove active class from previously active link
            document.querySelectorAll('#algo-nav a.active').forEach(a => a.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'font-semibold', 'active'));
            // Add active class to the clicked link
            targetLink.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'font-semibold', 'active');
            selectAlgorithm(algoKey);
        } else if (e.target.tagName === 'SUMMARY') {
           // Allow details/summary toggle without preventing default
        }
        // Ignore clicks that are not on links or summaries
    });

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
            console.log("Dark mode enabled");
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
            console.log("Dark mode disabled");
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    playPauseBtn.addEventListener('click', togglePlayPause);
    stepForwardBtn.addEventListener('click', stepForward);
    stepBackBtn.addEventListener('click', stepBack);
    resetBtn.addEventListener('click', resetToStart);
    generateDataBtn.addEventListener('click', handleGenerateData);
    speedSlider.addEventListener('input', updateSpeed);

    // --- Initial Setup ---
    // Dark Mode Initialization
    if (localStorage.getItem('darkMode') === 'enabled' ||
       (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        darkModeToggle.checked = true;
        document.documentElement.classList.add('dark');
    } else {
        darkModeToggle.checked = false;
        document.documentElement.classList.remove('dark');
    }

    animationState.speed = calculateDelay(speedSlider.value); // Set initial speed
    switchTab('code'); // Default to code tab
    resetVisualizationState(); // Initialize UI to default state
    console.log("Algorithm Visualizer Initialized.");

    // Expose main state/functions if needed by other modules (like heap-ops)
    window.algorithmVisualizerMain = {
        animationState: animationState,
        updateButtonStates: updateButtonStates,
        resetToStart: resetToStart,
        playAnimation: playAnimation,
        pauseAnimation: pauseAnimation,
        // Add other functions if needed by specific algorithm modules
   };

}); // End DOMContentLoaded
