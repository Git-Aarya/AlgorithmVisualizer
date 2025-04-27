// js/algorithms/heap-ops.js

const heapOpsConfig = {
    name: 'Heap Operations (Insert/Extract)',
    type: 'heap-ops', // Unique type identifier
    requiresPositiveInts: true, // Heaps typically use comparable numbers
    code: `// Max Heap Operations

<span class="code-keyword">function</span> <span class="code-function">insert</span>(heap, value) {
  heap.<span class="code-function">push</span>(value); <span class="code-comment">// Add to end</span>
  <span class="code-function">siftUp</span>(heap, heap.length - <span class="code-number">1</span>); <span class="code-comment">// Restore heap property</span>
}

<span class="code-keyword">function</span> <span class="code-function">siftUp</span>(heap, index) {
  <span class="code-keyword">let</span> parentIndex = Math.<span class="code-function">floor</span>((index - <span class="code-number">1</span>) / <span class="code-number">2</span>);
  <span class="code-keyword">while</span> (index > <span class="code-number">0</span> && heap[index] > heap[parentIndex]) {
    <span class="code-comment">// Visualize comparison and swap</span>
    [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];
    index = parentIndex;
    parentIndex = Math.<span class="code-function">floor</span>((index - <span class="code-number">1</span>) / <span class="code-number">2</span>);
  }
}

<span class="code-keyword">function</span> <span class="code-function">extractMax</span>(heap) {
  <span class="code-keyword">if</span> (heap.length === <span class="code-number">0</span>) <span class="code-keyword">return</span> <span class="code-keyword">null</span>;
  <span class="code-keyword">if</span> (heap.length === <span class="code-number">1</span>) <span class="code-keyword">return</span> heap.<span class="code-function">pop</span>();

  <span class="code-keyword">const</span> max = heap[<span class="code-number">0</span>];
  <span class="code-comment">// Move last element to root</span>
  heap[<span class="code-number">0</span>] = heap.<span class="code-function">pop</span>();
  <span class="code-comment">// Restore heap property from root</span>
  <span class="code-function">siftDown</span>(heap, heap.length, <span class="code-number">0</span>);
  <span class="code-keyword">return</span> max;
}

<span class="code-comment">// Same as heapify in Heap Sort</span>
<span class="code-keyword">function</span> <span class="code-function">siftDown</span>(heap, heapSize, index) {
  <span class="code-keyword">let</span> largest = index;
  <span class="code-keyword">const</span> left = <span class="code-number">2</span> * index + <span class="code-number">1</span>;
  <span class="code-keyword">const</span> right = <span class="code-number">2</span> * index + <span class="code-number">2</span>;
  <span class="code-comment">// Visualize comparison and swap</span>

  <span class="code-keyword">if</span> (left < heapSize && heap[left] > heap[largest]) largest = left;
  <span class="code-keyword">if</span> (right < heapSize && heap[right] > heap[largest]) largest = right;

  <span class="code-keyword">if</span> (largest !== index) {
    [heap[index], heap[largest]] = [heap[largest], heap[index]];
    <span class="code-function">siftDown</span>(heap, heapSize, largest); <span class="code-comment">// Recurse</span>
  }
}`,
    pseudocode: `// Max Heap Operations

Insert(Heap, value):
  Add value to the end of Heap
  SiftUp(Heap, last_index)

SiftUp(Heap, index):
  parent = floor((index - 1) / 2)
  while index > 0 and Heap[index] > Heap[parent]:
    // Visualize compare Heap[index] and Heap[parent]
    swap(Heap[index], Heap[parent])
    // Visualize swap
    index = parent
    parent = floor((index - 1) / 2)

ExtractMax(Heap):
  if Heap is empty: return null
  if Heap has 1 element: return remove and return element

  max_value = Heap[0] // Store the max value
  // Visualize move last element to root
  Heap[0] = remove last element from Heap
  // Visualize sift down from root
  SiftDown(Heap, size_of_Heap, 0)
  return max_value

SiftDown(Heap, heapSize, index): // (Heapify)
  largest = index
  left = 2 * index + 1
  right = 2 * index + 2
  // Visualize compare Heap[index], Heap[left], Heap[right]

  if left < heapSize and Heap[left] > Heap[largest]:
    largest = left
  if right < heapSize and Heap[right] > Heap[largest]:
    largest = right
  // Visualize largest found

  if largest != index:
    swap(Heap[index], Heap[largest])
    // Visualize swap
    SiftDown(Heap, heapSize, largest) // Recursively sift down
`,

    setup: function(initialData) {
        const visualizationArea = document.getElementById('visualization-area');
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        visualizationArea.innerHTML = ''; // Clear bar area initially
        extraVisualizationArea.innerHTML = ''; // Clear extra area

        // Initial heap data (start with a smaller heap)
        // Let's build an initial heap from the first ~7 elements for demonstration
        const initialHeapSize = Math.min(initialData.length, 7);
        let heapData = initialData.slice(0, initialHeapSize);

        // --- Build Initial Max Heap (similar to Heap Sort setup part) ---
        let buildSteps = [];
        const n_build = heapData.length;
        function buildHeapify(arr, size, i, stepsArr) {
            let largest = i; let l = 2 * i + 1; let r = 2 * i + 2;
            let compareIndices = [i]; if (l < size) compareIndices.push(l); if (r < size) compareIndices.push(r);
            stepsArr.push({ type: 'heapify-compare', arrayState: [...arr], heapSize: size, compareIndices: [...compareIndices], currentLargest: i, nodeIndex: i, message: `Building Heap - Heapify(${i}): Comparing node ${i} (${arr[i]}) with children.` });
            if (l < size && arr[l] > arr[largest]) largest = l;
            if (r < size && arr[r] > arr[largest]) largest = r;
            stepsArr.push({ type: 'heapify-largest', arrayState: [...arr], heapSize: size, compareIndices: [...compareIndices], largest: largest, nodeIndex: i, message: `Building Heap - Heapify(${i}): Largest is at index ${largest} (${arr[largest]})` });
            if (largest !== i) {
                stepsArr.push({ type: 'heapify-swap', arrayState: [...arr], heapSize: size, swapIndices: [i, largest], nodeIndex: i, message: `Building Heap - Heapify(${i}): Swapping node ${i} (${arr[i]}) with largest ${largest} (${arr[largest]})` });
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                stepsArr.push({ type: 'after-heapify-swap', arrayState: [...arr], heapSize: size, swapIndices: [i, largest], nodeIndex: i, message: `Building Heap - Heapify(${i}): Swap complete. Recursing.` });
                buildHeapify(arr, size, largest, stepsArr);
            } else {
                 stepsArr.push({ type: 'heapify-done', arrayState: [...arr], heapSize: size, nodeIndex: i, message: `Building Heap - Heapify(${i}): Node ${i} (${arr[i]}) is largest. Heap property satisfied.` });
            }
        }
        buildSteps.push({type: 'start-build', arrayState: [...heapData], heapSize: n_build, message: 'Building initial Max Heap...'});
        if (n_build > 1) {
            for (let i = Math.floor(n_build / 2) - 1; i >= 0; i--) {
                buildHeapify(heapData, n_build, i, buildSteps);
            }
        }
        buildSteps.push({type: 'end-build', arrayState: [...heapData], heapSize: n_build, message: 'Initial Max Heap Built.'});
        // --- End Build Initial Max Heap ---


        // --- Create DOM Elements for Bars ---
        let elements = [];
        function createBars(currentHeapData) {
            visualizationArea.innerHTML = ''; // Clear old bars
            elements = []; // Reset elements array
            if (currentHeapData.length === 0) {
                 visualizationArea.innerHTML = '<p class="text-gray-500 dark:text-gray-400 self-center">Heap is empty</p>';
                 return;
            }
            const maxValue = Math.max(...currentHeapData, 1);
            elements = currentHeapData.map((value, index) => {
                const bar = document.createElement('div');
                bar.classList.add('vis-bar', 'heap-range'); // Start in heap range
                bar.style.height = `${(value / maxValue) * 95}%`;
                bar.setAttribute('data-value', value);
                bar.title = `Heap[${index}]: ${value}`;
                visualizationArea.appendChild(bar);
                return bar;
            });
        }
        createBars(heapData); // Create initial bars

        // --- Add Controls for Insert/Extract ---
        const controlContainer = document.createElement('div');
        controlContainer.className = 'flex flex-wrap justify-center items-center gap-4 mt-4 mb-2'; // Adjusted margin

        const insertInput = document.createElement('input');
        insertInput.type = 'number';
        insertInput.id = 'heap-insert-value';
        insertInput.placeholder = 'Value to insert';
        insertInput.className = 'px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500';
        insertInput.min = '0'; // Assuming positive ints

        const insertButton = document.createElement('button');
        insertButton.id = 'heap-insert-btn';
        insertButton.textContent = 'Insert';
        insertButton.className = 'px-3 py-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed';

        const extractButton = document.createElement('button');
        extractButton.id = 'heap-extract-btn';
        extractButton.textContent = 'Extract Max';
        extractButton.className = 'px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed';

        controlContainer.appendChild(insertInput);
        controlContainer.appendChild(insertButton);
        controlContainer.appendChild(extractButton);
        extraVisualizationArea.appendChild(controlContainer); // Add controls to extra area

        // Store heap data and elements in a way accessible by event handlers and renderStep
        const state = {
            currentHeap: [...heapData],
            elements: elements, // Keep track of the DOM elements
            steps: buildSteps, // Start with build steps
            isPlaying: false, // Control animation from buttons
        };

        // --- Step Generation Functions (Called by Buttons) ---
        function generateInsertSteps(value) {
            if (isNaN(value) || value < 0) {
                 document.getElementById('status-message').textContent = "Please enter a non-negative number to insert.";
                 return [];
            }
            let steps = [];
            let tempHeap = [...state.currentHeap];
            steps.push({ type: 'op-start', op:'insert', value: value, arrayState: [...tempHeap], heapSize: tempHeap.length, message: `Operation: Insert ${value}` });

            // 1. Add to end
            tempHeap.push(value);
            let currentIndex = tempHeap.length - 1;
            steps.push({ type: 'insert-add-end', value: value, index: currentIndex, arrayState: [...tempHeap], heapSize: tempHeap.length, message: `Add ${value} to end (index ${currentIndex})` });

            // 2. Sift Up
            let parentIndex = Math.floor((currentIndex - 1) / 2);
            while (currentIndex > 0 && tempHeap[currentIndex] > tempHeap[parentIndex]) {
                 steps.push({ type: 'siftup-compare', arrayState: [...tempHeap], heapSize: tempHeap.length, compareIndices: [currentIndex, parentIndex], message: `Sift Up: Compare ${tempHeap[currentIndex]} (idx ${currentIndex}) with parent ${tempHeap[parentIndex]} (idx ${parentIndex})` });
                 steps.push({ type: 'siftup-swap', arrayState: [...tempHeap], heapSize: tempHeap.length, swapIndices: [currentIndex, parentIndex], message: `Sift Up: Swap ${tempHeap[currentIndex]} with ${tempHeap[parentIndex]}` });
                [tempHeap[currentIndex], tempHeap[parentIndex]] = [tempHeap[parentIndex], tempHeap[currentIndex]];
                currentIndex = parentIndex;
                parentIndex = Math.floor((currentIndex - 1) / 2);
            }
             if(currentIndex > 0) { // Add final compare if it didn't swap
                 steps.push({ type: 'siftup-compare', arrayState: [...tempHeap], heapSize: tempHeap.length, compareIndices: [currentIndex, parentIndex], message: `Sift Up: Compare ${tempHeap[currentIndex]} (idx ${currentIndex}) with parent ${tempHeap[parentIndex]} (idx ${parentIndex}) - No swap needed.` });
             }

            steps.push({ type: 'op-end', op:'insert', arrayState: [...tempHeap], heapSize: tempHeap.length, message: `Insert ${value} complete. Heap property restored.` });
            state.currentHeap = [...tempHeap]; // Update main state heap
            return steps;
        }

        function generateExtractSteps() {
            let steps = [];
            let tempHeap = [...state.currentHeap];
            let heapSize = tempHeap.length;
            let extractedValue = null;

            steps.push({ type: 'op-start', op:'extract', arrayState: [...tempHeap], heapSize: heapSize, message: `Operation: Extract Max` });

            if (heapSize === 0) {
                steps.push({ type: 'extract-empty', arrayState: [], heapSize: 0, message: `Heap is empty. Cannot extract.` });
                return steps;
            }

            extractedValue = tempHeap[0];

            if (heapSize === 1) {
                 steps.push({ type: 'extract-single', value: extractedValue, arrayState: [...tempHeap], heapSize: 1, message: `Extract Max: Heap has one element (${extractedValue}). Removing it.` });
                tempHeap.pop();
                heapSize = 0;
                 steps.push({ type: 'op-end', op:'extract', extractedValue: extractedValue, arrayState: [], heapSize: 0, message: `Extract Max complete. Extracted: ${extractedValue}. Heap is now empty.` });

            } else {
                steps.push({ type: 'extract-swap-root-last', arrayState: [...tempHeap], heapSize: heapSize, swapIndices: [0, heapSize - 1], message: `Extract Max: Swap root ${tempHeap[0]} with last ${tempHeap[heapSize - 1]}` });
                const lastElement = tempHeap.pop(); // Remove last element
                tempHeap[0] = lastElement;          // Place it at root
                heapSize--;                         // Decrease heap size
                steps.push({ type: 'after-extract-swap', extractedValue: extractedValue, arrayState: [...tempHeap], heapSize: heapSize, movedToIndex: heapSize, message: `Max value ${extractedValue} moved out. Place ${lastElement} at root. Heap size now ${heapSize}.` });

                // Sift Down (Heapify) from root
                let currentIndex = 0;
                while (true) {
                    let largest = currentIndex;
                    let l = 2 * currentIndex + 1;
                    let r = 2 * currentIndex + 2;
                    let compareIndices = [currentIndex];
                    if (l < heapSize) compareIndices.push(l);
                    if (r < heapSize) compareIndices.push(r);

                    steps.push({ type: 'heapify-compare', phase: 'extract', arrayState: [...tempHeap], heapSize: heapSize, compareIndices: [...compareIndices], currentLargest: currentIndex, nodeIndex: currentIndex, message: `Sift Down(${currentIndex}): Comparing node ${currentIndex} (${tempHeap[currentIndex]}) with children.` });

                    if (l < heapSize && tempHeap[l] > tempHeap[largest]) largest = l;
                    if (r < heapSize && tempHeap[r] > tempHeap[largest]) largest = r;

                     steps.push({ type: 'heapify-largest', phase: 'extract', arrayState: [...tempHeap], heapSize: heapSize, compareIndices: [...compareIndices], largest: largest, nodeIndex: currentIndex, message: `Sift Down(${currentIndex}): Largest is at index ${largest} (${tempHeap[largest]})` });

                    if (largest !== currentIndex) {
                         steps.push({ type: 'heapify-swap', phase: 'extract', arrayState: [...tempHeap], heapSize: heapSize, swapIndices: [currentIndex, largest], nodeIndex: currentIndex, message: `Sift Down(${currentIndex}): Swapping node ${currentIndex} (${tempHeap[currentIndex]}) with largest ${largest} (${tempHeap[largest]})` });
                        [tempHeap[currentIndex], tempHeap[largest]] = [tempHeap[largest], tempHeap[currentIndex]];
                         steps.push({ type: 'after-heapify-swap', phase: 'extract', arrayState: [...tempHeap], heapSize: heapSize, swapIndices: [currentIndex, largest], nodeIndex: currentIndex, message: `Sift Down(${currentIndex}): Swap complete. Continue sift down from ${largest}.` });
                        currentIndex = largest; // Continue sifting down from the new position
                    } else {
                         steps.push({ type: 'heapify-done', phase: 'extract', arrayState: [...tempHeap], heapSize: heapSize, nodeIndex: currentIndex, message: `Sift Down(${currentIndex}): Node ${currentIndex} (${tempHeap[currentIndex]}) is largest. Heap property satisfied.` });
                        break; // Heap property restored for this path
                    }
                }
                 steps.push({ type: 'op-end', op:'extract', extractedValue: extractedValue, arrayState: [...tempHeap], heapSize: heapSize, message: `Extract Max complete. Extracted: ${extractedValue}.` });
            }
            state.currentHeap = [...tempHeap]; // Update main state heap
            return steps;
        }

        // --- Event Listeners for Buttons ---
        function handleOperation(generateStepsFn, ...args) {
            const main = window.algorithmVisualizerMain; // Access main.js functions/state if needed
            if (!main || main.animationState.isPlaying) return; // Prevent overlap

            const newSteps = generateStepsFn(...args);
            if (newSteps.length > 0) {
                createBars(state.currentHeap); // Recreate bars based on potentially changed heap size
                state.elements = Array.from(visualizationArea.querySelectorAll('.vis-bar')); // Update elements reference
                main.animationState.steps = newSteps;
                main.animationState.elements = state.elements; // Update main.js state
                main.animationState.currentStep = -1; // Reset step counter
                main.resetToStart(); // Show the first step of the new operation
                 // Optionally auto-play: main.playAnimation();
                 document.getElementById('status-message').textContent = newSteps[0].message; // Show first message
                 main.updateButtonStates(); // Re-enable/disable controls
            }
             // Disable buttons during animation (handled by main.js updateButtonStates)
        }

        insertButton.addEventListener('click', () => {
            const value = parseInt(insertInput.value, 10);
             handleOperation(generateInsertSteps, value);
             insertInput.value = ''; // Clear input
        });

        extractButton.addEventListener('click', () => {
             handleOperation(generateExtractSteps);
        });

        // Return only the initial build steps and the elements array
        // The actual operation steps are generated dynamically on button clicks
        return { steps: buildSteps, elements: elements };
    }, // End of setup

    renderStep: function(step, elements, animationState) {
        // console.log("HeapOps Render:", step.type, step);
        if (!step || !elements) return;

        // Ensure elements match the array state size (especially after insert/extract)
        if (elements.length !== step.arrayState.length && step.type !== 'extract-empty' && step.type !== 'op-start') {
            // This might happen if bars weren't recreated correctly after an operation.
            // It's better handled by recreating bars within the setup/button handlers.
            // console.warn("Element count mismatch, might need bar recreation.");
           // return; // Or try to gracefully handle
        }
         if (step.type === 'extract-empty') {
            visualizationArea.innerHTML = '<p class="text-gray-500 dark:text-gray-400 self-center">Heap is empty</p>';
            return;
         }

        const maxValue = Math.max(...step.arrayState, 1);

        // Reset all bars first
        elements.forEach(bar => {
            if (!bar) return;
            bar.className = 'vis-bar'; // Reset classes
            bar.style.opacity = '1';
            bar.style.transform = 'translateY(0)';
            bar.style.borderColor = 'transparent';
        });

        // Update bar heights and apply base styles
        elements.forEach((bar, index) => {
             if (!bar || index >= step.arrayState.length) return; // Check if bar exists for index

            const value = step.arrayState[index];
            bar.style.height = `${(value / maxValue) * 95}%`;
            bar.setAttribute('data-value', value);
             bar.title = `Heap[${index}]: ${value}`;

            // Dim elements outside the current heap range (except the one being extracted)
            if (step.heapSize !== undefined) {
                if (index >= step.heapSize && !(step.type === 'after-extract-swap' && index === step.heapSize) && !(step.type === 'extract-swap-root-last' && index === step.swapIndices[1]) ) {
                     bar.classList.add('outside-heap-range');
                } else {
                     bar.classList.add('heap-range');
                }
            }
        });

         // Helper to apply styles only within heap bounds
         function applyStyleInHeap(index, styleClass) {
            if (elements[index] && index < step.heapSize) {
                 elements[index].classList.add(styleClass);
            }
         }
         function applyStyleAnywhere(index, styleClass) {
            if (elements[index]) {
                elements[index].classList.add(styleClass);
            }
         }

        // Apply step-specific styles
        switch (step.type) {
            // Build/SiftDown (Heapify) reused styles
            case 'heapify-call':
            case 'heapify-done':
                applyStyleInHeap(step.nodeIndex, 'heapify-node');
                break;
            case 'heapify-compare':
                step.compareIndices.forEach(idx => applyStyleInHeap(idx, 'heapify-node'));
                break;
            case 'heapify-largest':
                step.compareIndices.forEach(idx => applyStyleInHeap(idx, 'heapify-node'));
                applyStyleInHeap(step.largest, 'heapify-largest');
                break;
            case 'heapify-swap':
            case 'after-heapify-swap':
                applyStyleInHeap(step.swapIndices[0], 'swapping');
                applyStyleInHeap(step.swapIndices[1], 'swapping');
                applyStyleInHeap(step.nodeIndex, 'heapify-node');
                break;

             // Insert specific styles
             case 'insert-add-end':
                 applyStyleAnywhere(step.index, 'inserting'); // Style the newly added bar
                 break;
             case 'siftup-compare':
                  applyStyleInHeap(step.compareIndices[0], 'comparing'); // Current node
                  applyStyleInHeap(step.compareIndices[1], 'comparing'); // Parent node
                 break;
             case 'siftup-swap':
                  applyStyleInHeap(step.swapIndices[0], 'swapping');
                  applyStyleInHeap(step.swapIndices[1], 'swapping');
                 break;

             // Extract specific styles
            case 'extract-swap-root-last':
                 applyStyleAnywhere(step.swapIndices[0], 'swapping'); // Root
                 applyStyleAnywhere(step.swapIndices[1], 'swapping'); // Last element
                break;
            case 'after-extract-swap':
                 // Highlight the extracted element (now outside heap)
                 if (elements[step.movedToIndex]) {
                     elements[step.movedToIndex].classList.add('sorted-final'); // Reuse sorted style
                     elements[step.movedToIndex].style.opacity = '0.7';
                     elements[step.movedToIndex].title = `Extracted: ${step.extractedValue}`;
                 }
                 // Highlight the new root
                  applyStyleInHeap(0, 'heapify-node');
                break;
             case 'extract-single':
                  applyStyleAnywhere(0, 'sorted-final');
                  elements[0].style.opacity = '0.7';
                  elements[0].title = `Extracted: ${step.value}`;
                  break;

            // General / Build phases
            case 'start-build':
            case 'end-build':
            case 'op-start':
            case 'op-end':
                // Potentially highlight the whole range or extracted value briefly?
                 if (step.op === 'extract' && step.extractedValue !== null && step.arrayState.length > 0) {
                      // Find the element representing the extracted value (it's now at the end)
                      const extractedIndex = step.heapSize; // Index where it was moved before potential resize
                      if (elements[extractedIndex]) {
                           elements[extractedIndex].classList.add('sorted-final');
                           elements[extractedIndex].style.opacity = '0.7';
                            elements[extractedIndex].title = `Extracted: ${step.extractedValue}`;
                      }
                 }
                break;
        }
    } // End of renderStep
};

// Add access to main.js state/functions if needed (use cautiously)
window.algorithmVisualizerMain = null;
document.addEventListener('DOMContentLoaded', () => {
    // Assuming main.js assigns its state/functions to window.algorithmVisualizerMain
    // This is a simple way to allow heap-ops.js to interact with main.js controls
    // A more robust solution might use custom events or a shared state manager.
    if (window.algorithmVisualizerMain && typeof window.algorithmVisualizerMain === 'object') {
         console.log("Heap-ops: Found main.js context.");
    } else {
         console.warn("Heap-ops: Could not find main.js context (window.algorithmVisualizerMain). Button interaction might fail.");
    }
});