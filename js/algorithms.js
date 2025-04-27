// js/algorithms.js

// This object holds the definitions for all algorithms.
// Each algorithm has:
// - name: Display name
// - code: String containing HTML-formatted JavaScript code example
// - pseudocode: String containing pseudocode example
// - setup: Function to initialize the visualization for this algorithm (creates bars, calculates steps)
// - renderStep: Function to display a specific step of the visualization
// - Optional flags like requiresSortedData or requiresPositiveInts for data generation

const algorithms = {
    // ================== LINEAR SEARCH ==================
    'linear-search': {
        name: 'Linear Search',
        code: `<span class="code-keyword">function</span> <span class="code-function">linearSearch</span>(arr, target) {
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < arr.length; i++) {
    <span class="code-comment">// Visualize comparison</span>
    <span class="code-keyword">if</span> (arr[i] === target) {
      <span class="code-comment">// Visualize found</span>
      <span class="code-keyword">return</span> i; <span class="code-comment">// Return index if found</span>
    }
    <span class="code-comment">// Visualize element checked, not found yet</span>
  }
  <span class="code-comment">// Visualize not found after loop</span>
  <span class="code-keyword">return</span> -<span class="code-number">1</span>; <span class="code-comment">// Return -1 if not found</span>
}`,
        pseudocode: `LinearSearch(A, value):
  for i = 0 to length(A) - 1
    // Compare A[i] with value
    if A[i] == value
      // Found
      return i
    // Checked, not found yet
  // Not found
  return -1`,
        setup: (data) => {
            // Get references to visualization areas (assuming they exist in the scope where setup is called via main.js)
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = ''; // Clear main area
            extraVisualizationArea.innerHTML = ''; // Clear extra area

            if (!data || data.length === 0) {
                 visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                 return { steps: [], elements: [], target: null };
            }
            const maxValue = Math.max(...data, 1); // Ensure maxValue is at least 1
            const elements = data.map((value) => {
                 const bar = document.createElement('div');
                 bar.classList.add('vis-bar');
                 bar.style.height = `${(value / maxValue) * 95}%`; // Use 95% to leave space
                 bar.setAttribute('data-value', value);
                 bar.title = `Value: ${value}`;
                 visualizationArea.appendChild(bar);
                 return bar;
            });

            let steps = [];
            let arr = [...data]; // Use a copy for simulation
            // Select a random target from the array to ensure it exists
            const targetIndex = Math.floor(Math.random() * arr.length);
            const target = arr[targetIndex];
            let found = false;

            steps.push({ type: 'start', arrayState: [...arr], target: target, message: `Starting Linear Search. Target: ${target}` });

            for (let i = 0; i < arr.length; i++) {
                 // Step: Comparing current element
                 steps.push({ type: 'compare', index: i, target: target, arrayState: [...arr], message: `Checking index ${i} (Value: ${arr[i]})` });
                 if (arr[i] === target) {
                     // Step: Target found
                     steps.push({ type: 'found', index: i, target: target, arrayState: [...arr], message: `Found target ${target} at index ${i}!` });
                     found = true;
                     break; // Exit loop once found
                 } else {
                     // Step: Element checked, but not the target
                     steps.push({ type: 'checked', index: i, target: target, arrayState: [...arr], message: `Index ${i} (Value: ${arr[i]}) is not the target.` });
                 }
            }
            if (!found) {
                 // Step: Target not found after checking all elements
                 steps.push({ type: 'not-found', target: target, arrayState: [...arr], message: `Target ${target} not found in the array.` });
            }
            // Step: Final state
            steps.push({ type: 'finish', target: target, arrayState: [...arr], found: found, message: `Search finished. Target ${target} ${found ? 'was found' : 'was not found'}.` });

            return { steps, elements, target }; // Return necessary info for main.js
        },
        renderStep: (step, elements, animationState) => {
            if (!step || !elements || elements.length === 0) return;

            // Reset all bars to default appearance first
            elements.forEach((bar, index) => {
                bar.className = 'vis-bar'; // Reset all specific classes
                bar.style.opacity = '1';
                bar.style.transform = 'translateY(0)';
                bar.style.borderColor = 'transparent';

                 // Apply final state styling if the step type is 'finish' or 'found'/'not-found'
                 if (step.type === 'finish') {
                     if (step.found && index === step.index) { // step.index should exist if found=true
                         bar.classList.add('found');
                     } else {
                         bar.classList.add('checked'); // Mark non-found elements as checked in final state
                         bar.style.opacity = '0.6';
                     }
                 }
                 // Apply dimmed style to already checked elements before finish
                 else if (step.type !== 'start' && step.index !== undefined && index < step.index && !bar.classList.contains('found')) {
                    if (step.type === 'checked' || step.type === 'compare') {
                         bar.classList.add('checked');
                         bar.style.opacity = '0.6';
                    }
                 }
            });

            // Apply step-specific styling
            switch (step.type) {
                case 'compare':
                    if (elements[step.index]) elements[step.index].classList.add('comparing');
                    break;
                case 'found':
                    if (elements[step.index]) {
                        elements[step.index].classList.add('found');
                        // Dim all other bars immediately when found
                        elements.forEach((bar, idx) => {
                           if (idx !== step.index) {
                               bar.classList.add('checked');
                               bar.style.opacity = '0.6';
                           }
                        });
                    }
                    break;
                case 'checked':
                     // Apply dimming based on the loop above
                     if (elements[step.index]) {
                         // Keep the 'checked' class and opacity from the loop
                         elements[step.index].classList.add('checked');
                         elements[step.index].style.opacity = '0.6';
                     }
                    break;
                 case 'not-found':
                     // Dim all elements if not found after loop finishes
                     elements.forEach(bar => {
                         bar.classList.add('checked');
                         bar.style.opacity = '0.6';
                     });
                     break;
                case 'start':
                case 'finish':
                    // General styling handled by the initial loop and finish condition
                    break;
            }
             // Update status message (handled in main.js)
        }
    },
    // ================== BINARY SEARCH ==================
    'binary-search': {
        name: 'Binary Search',
        requiresSortedData: true, // Important for data generation
        code: `<span class="code-keyword">function</span> <span class="code-function">binarySearch</span>(sortedArr, target) {
  <span class="code-keyword">let</span> low = <span class="code-number">0</span>;
  <span class="code-keyword">let</span> high = sortedArr.length - <span class="code-number">1</span>;

  <span class="code-keyword">while</span> (low <= high) {
    <span class="code-comment">// Visualize current range [low, high]</span>
    <span class="code-keyword">const</span> mid = Math.<span class="code-function">floor</span>((low + high) / <span class="code-number">2</span>);
    <span class="code-comment">// Visualize mid element comparison</span>
    <span class="code-keyword">const</span> guess = sortedArr[mid];

    <span class="code-keyword">if</span> (guess === target) {
      <span class="code-comment">// Visualize found</span>
      <span class="code-keyword">return</span> mid; <span class="code-comment">// Found</span>
    } <span class="code-keyword">else if</span> (guess > target) {
      <span class="code-comment">// Visualize adjusting high</span>
      high = mid - <span class="code-number">1</span>; <span class="code-comment">// Target is in the lower half</span>
    } <span class="code-keyword">else</span> {
      <span class="code-comment">// Visualize adjusting low</span>
      low = mid + <span class="code-number">1</span>; <span class="code-comment">// Target is in the upper half</span>
    }
  }
  <span class="code-comment">// Visualize not found</span>
  <span class="code-keyword">return</span> -<span class="code-number">1</span>; <span class="code-comment">// Not found</span>
}`,
        pseudocode: `BinarySearch(A, value):
  // Ensure A is sorted
  low = 0
  high = length(A) - 1

  while low <= high
    // Consider range [low, high]
    mid = floor((low + high) / 2)
    // Compare A[mid] with value
    guess = A[mid]

    if guess == value
      // Found
      return mid
    else if guess > value
      // Adjust high pointer
      high = mid - 1
    else
      // Adjust low pointer
      low = mid + 1
  // Not found
  return -1`,
        setup: (data) => {
             // Get references to visualization areas
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = ''; // Clear main area
            extraVisualizationArea.innerHTML = ''; // Clear extra area

            if (!data || data.length === 0) {
                visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                return { steps: [], elements: [], target: null };
            }
            // Ensure data is sorted (should be handled by generateSampleData if flag is set, but double-check)
            const sortedData = [...data].sort((a, b) => a - b);
            const maxValue = Math.max(...sortedData, 1);
            const elements = sortedData.map((value) => {
                const bar = document.createElement('div');
                bar.classList.add('vis-bar');
                bar.style.height = `${(value / maxValue) * 95}%`;
                bar.setAttribute('data-value', value);
                 bar.title = `Value: ${value}`;
                visualizationArea.appendChild(bar);
                return bar;
            });

            let steps = [];
            let arr = sortedData; // Use the sorted data
            let target;
             // Make it more likely to find the target, but still possible not to
            if (Math.random() > 0.2) { // 80% chance target is in the array
                const targetIndex = Math.floor(Math.random() * arr.length);
                target = arr[targetIndex];
            } else { // 20% chance target is outside the range
                target = Math.floor(Math.random() * (maxValue + 20)) + (maxValue + 5); // Target likely larger than max
                 if (Math.random() > 0.5) { // Or smaller than min
                    target = Math.floor(Math.random() * (Math.min(...arr) - 5));
                 }
            }

            let low = 0;
            let high = arr.length - 1;
            let found = false;
            let foundIndex = -1;

            steps.push({ type: 'start', arrayState: [...arr], target: target, low: low, high: high, message: `Starting Binary Search. Target: ${target}. Range [${low}, ${high}]` });

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const guess = arr[mid];
                // Step: Check middle element
                steps.push({ type: 'check-mid', arrayState: [...arr], target: target, low: low, high: high, mid: mid, message: `Checking middle index ${mid} (Value: ${guess}). Range [${low}, ${high}]` });

                if (guess === target) {
                     // Step: Found target
                    steps.push({ type: 'found', arrayState: [...arr], target: target, low: low, high: high, mid: mid, index: mid, message: `Found target ${target} at index ${mid}!` });
                    found = true;
                    foundIndex = mid;
                    break;
                } else if (guess > target) {
                    const newHigh = mid - 1;
                    // Step: Adjust high pointer
                    steps.push({ type: 'adjust-high', arrayState: [...arr], target: target, low: low, high: newHigh, mid: mid, message: `Target ${target} < ${guess}. Adjusting range to [${low}, ${newHigh}]` });
                    high = newHigh;
                } else { // guess < target
                    const newLow = mid + 1;
                    // Step: Adjust low pointer
                    steps.push({ type: 'adjust-low', arrayState: [...arr], target: target, low: newLow, high: high, mid: mid, message: `Target ${target} > ${guess}. Adjusting range to [${newLow}, ${high}]` });
                    low = newLow;
                }
            }

            if (!found) {
                 // Step: Target not found
                steps.push({ type: 'not-found', arrayState: [...arr], target: target, low: low, high: high, message: `Target ${target} not found (low > high).` });
            }
            // Step: Final state
            steps.push({ type: 'finish', arrayState: [...arr], target: target, found: found, index: foundIndex, message: `Search finished. Target ${target} ${found ? `found at index ${foundIndex}` : 'not found'}.` });

            return { steps, elements, target };
        },
        renderStep: (step, elements, animationState) => {
            if (!step || !elements || elements.length === 0) return;

            elements.forEach((bar, index) => {
                // Reset common classes first
                bar.className = 'vis-bar'; // Reset all specific classes
                bar.style.opacity = '1';
                bar.style.transform = 'translateY(0)';
                bar.style.borderColor = 'transparent';

                 // Determine if the bar is within the current search range [low, high]
                let isInRange = false;
                 let isOutOfRange = true;
                 if (step.low !== undefined && step.high !== undefined) {
                    if (index >= step.low && index <= step.high) {
                        isInRange = true;
                         isOutOfRange = false;
                     }
                 }

                // Apply range styling for non-finish steps
                 if (step.type !== 'finish') {
                    if (isInRange) {
                         bar.classList.add('in-range'); // Keeps normal appearance
                    } else if (isOutOfRange && step.type !== 'start') { // Don't dim at the very start
                        bar.classList.add('out-of-range');
                        bar.style.opacity = '0.4';
                    }
                 }
                 // Handle final state styling
                 else {
                    if (step.found && index === step.index) {
                         bar.classList.add('found');
                     } else {
                         bar.classList.add('out-of-range'); // Dim all non-found elements
                         bar.style.opacity = '0.4';
                     }
                 }
            });

            // Apply step-specific highlights (on top of range styling)
            switch (step.type) {
                 case 'check-mid':
                     if (elements[step.mid]) {
                         elements[step.mid].classList.remove('in-range', 'out-of-range'); // Ensure mid is fully visible
                         elements[step.mid].style.opacity = '1';
                         elements[step.mid].classList.add('comparing'); // Highlight as being checked
                     }
                     break;
                 case 'adjust-high':
                 case 'adjust-low':
                     // Highlight the mid element that was just checked and ruled out
                     if (elements[step.mid]) {
                        elements[step.mid].classList.remove('comparing');
                        elements[step.mid].classList.add('checked'); // Mark as checked
                        elements[step.mid].style.opacity = '0.4'; // Dim it as it's no longer in range
                     }
                     break;
                 case 'found':
                    // Final 'found' styling is handled in the main loop/finish state
                    if (elements[step.index]) {
                        elements[step.index].classList.add('found'); // Ensure it's marked found
                        elements[step.index].style.opacity = '1'; // Ensure it's fully visible
                    }
                     break;
                case 'start':
                case 'not-found':
                case 'finish':
                     // Styling handled by the main loop logic
                     break;
            }
             // Update status message (handled in main.js)
        }
    },
    // ================== BUBBLE SORT ==================
    'bubble-sort': {
        name: 'Bubble Sort',
        code: `<span class="code-keyword">function</span> <span class="code-function">bubbleSort</span>(arr) {
  <span class="code-keyword">let</span> n = arr.length;
  <span class="code-keyword">let</span> swapped;
  <span class="code-keyword">do</span> {
    swapped = <span class="code-keyword">false</span>;
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < n - <span class="code-number">1</span>; i++) {
      <span class="code-comment">// Compare adjacent elements</span>
      <span class="code-keyword">if</span> (arr[i] > arr[i + <span class="code-number">1</span>]) {
        <span class="code-comment">// Swap them</span>
        [arr[i], arr[i + <span class="code-number">1</span>]] = [arr[i + <span class="code-number">1</span>], arr[i]];
        swapped = <span class="code-keyword">true</span>;
        <span class="code-comment">// Visualize swap</span>
      }
      <span class="code-comment">// Visualize comparison</span>
    }
    <span class="code-comment">// Mark last element as sorted for this pass</span>
    n--; // Optimization: Reduce the range for next pass
  } <span class="code-keyword">while</span> (swapped);
  <span class="code-comment">// Mark all as sorted</span>
  <span class="code-keyword">return</span> arr;
}`,
        pseudocode: `BubbleSort(A):
  n = length(A)
  repeat
    swapped = false
    // Iterate through the unsorted part of the array
    for i = 0 to n - 2
      // Compare adjacent elements
      if A[i] > A[i + 1]
        // Swap elements
        swap(A[i], A[i + 1])
        swapped = true
        // Visualize swap
      // Visualize comparison
    // The last element of the current pass is now in its sorted position
    // Mark A[n-1] as sorted for this pass
    n = n - 1 // Reduce the size of the unsorted part
  until not swapped or n <= 1
  // Mark all elements as sorted`,
        setup: (data) => {
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = '';
            extraVisualizationArea.innerHTML = '';

            if (!data || data.length === 0) {
                visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                return { steps: [], elements: [] };
            }
            const maxValue = Math.max(...data, 1);
            const elements = data.map((value) => {
                const bar = document.createElement('div');
                bar.classList.add('vis-bar');
                bar.style.height = `${(value / maxValue) * 95}%`;
                bar.setAttribute('data-value', value);
                 bar.title = `Value: ${value}`;
                visualizationArea.appendChild(bar);
                return bar;
            });

            let steps = [];
            let arr = [...data];
            let n = arr.length;
            let localSwapped;
            let sortedBoundary = n; // Index after which elements are considered sorted

            steps.push({ type: 'start', arrayState: [...arr], sortedBoundary: n, message: 'Starting Bubble Sort' });

            if (n <= 1) {
                 steps.push({ type: 'finish', arrayState: [...arr], message: 'Array is already sorted (size <= 1)!' });
                 return { steps, elements };
            }


            do {
                localSwapped = false;
                let passBoundary = sortedBoundary - 1; // The last index to compare in this pass
                for (let i = 0; i < passBoundary; i++) {
                    // Step: Compare elements at i and i+1
                    steps.push({ type: 'compare', indices: [i, i + 1], arrayState: [...arr], sortedBoundary: sortedBoundary, message: `Comparing ${arr[i]} and ${arr[i+1]}` });

                    if (arr[i] > arr[i + 1]) {
                        // Step: Swap elements
                        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                        localSwapped = true;
                        steps.push({ type: 'swap', indices: [i, i + 1], arrayState: [...arr], sortedBoundary: sortedBoundary, message: `Swapping ${arr[i+1]} and ${arr[i]}` });
                    }
                }
                // After a pass, the element at passBoundary is sorted relative to this pass
                if (sortedBoundary > 0) {
                     // Mark the element at the end of the pass
                    steps.push({ type: 'mark-sorted-pass', index: passBoundary, arrayState: [...arr], sortedBoundary: passBoundary, message: `Element ${arr[passBoundary]} is in its final place for this pass.` });
                }
                sortedBoundary--; // Reduce the boundary for the next pass

            } while (localSwapped && sortedBoundary > 0);

             // Mark remaining elements as sorted if loop finished early
             if (sortedBoundary > 0) {
                 for (let k = sortedBoundary - 1; k >= 0; k--) {
                     steps.push({ type: 'mark-sorted-pass', index: k, arrayState: [...arr], sortedBoundary: k, message: `Element ${arr[k]} is sorted.` });
                 }
             }

            steps.push({ type: 'finish', arrayState: [...arr], message: 'Array is sorted!' });
            return { steps, elements };
        },
        renderStep: (step, elements) => {
            if (!step || !elements || elements.length === 0) return;

            const maxValue = Math.max(...step.arrayState, 1);

            elements.forEach((bar, index) => {
                // Reset common classes first
                bar.className = 'vis-bar';
                bar.style.opacity = '1';
                bar.style.transform = 'translateY(0)';
                bar.style.borderColor = 'transparent';

                // Update height and value based on the current step's array state
                const value = step.arrayState[index];
                bar.style.height = `${(value / maxValue) * 95}%`;
                bar.setAttribute('data-value', value);
                 bar.title = `Value: ${value}`;

                // Apply sorted style based on the boundary IN THE STEP DATA
                 if (step.sortedBoundary !== undefined && index >= step.sortedBoundary && step.type !== 'finish') {
                    bar.classList.add('sorted-final'); // Use final sorted style
                 }
            });

            // Apply step-specific highlights
            switch (step.type) {
                case 'compare':
                    if (elements[step.indices[0]]) elements[step.indices[0]].classList.add('comparing');
                    if (elements[step.indices[1]]) elements[step.indices[1]].classList.add('comparing');
                    break;
                case 'swap':
                    if (elements[step.indices[0]]) elements[step.indices[0]].classList.add('swapping');
                    if (elements[step.indices[1]]) elements[step.indices[1]].classList.add('swapping');
                    break;
                case 'mark-sorted-pass':
                    // The styling is handled by the sortedBoundary check above
                     if (elements[step.index]) {
                        elements[step.index].classList.add('sorted-final'); // Ensure it gets the final style
                    }
                    break;
                 case 'start':
                     // No specific highlight needed for start
                     break;
                case 'finish':
                    // Apply final sorted style to all bars
                    elements.forEach(bar => bar.classList.add('sorted-final'));
                    break;
            }
             // Update status message (handled in main.js)
        }
    },
    // ================== SELECTION SORT ==================
    'selection-sort': {
        name: 'Selection Sort',
        code: `<span class="code-keyword">function</span> <span class="code-function">selectionSort</span>(arr) {
  <span class="code-keyword">const</span> n = arr.length;
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < n - <span class="code-number">1</span>; i++) {
    <span class="code-comment">// Assume the minimum is the first element of the unsorted part</span>
    <span class="code-keyword">let</span> minIndex = i;
    <span class="code-comment">// Visualize starting search for minimum in arr[i..n-1]</span>

    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> j = i + <span class="code-number">1</span>; j < n; j++) {
      <span class="code-comment">// Visualize comparing j with current minimum</span>
      <span class="code-keyword">if</span> (arr[j] < arr[minIndex]) {
        <span class="code-comment">// Visualize new minimum found</span>
        minIndex = j;
      }
    }

    <span class="code-comment">// Swap the found minimum element with the first element of the unsorted part</span>
    <span class="code-keyword">if</span> (minIndex !== i) {
      <span class="code-comment">// Visualize swap</span>
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    <span class="code-comment">// Visualize element at index i is now sorted</span>
  }
  <span class="code-comment">// Visualize final element is sorted</span>
  <span class="code-keyword">return</span> arr;
}`,
        pseudocode: `SelectionSort(A):
  n = length(A)
  for i = 0 to n - 2
    // Find the index of the minimum element in A[i..n-1]
    minIndex = i
    // Visualize starting search for min in A[i..n-1]
    for j = i + 1 to n - 1
      // Compare A[j] with current minimum A[minIndex]
      if A[j] < A[minIndex]
        // Found new minimum
        minIndex = j
        // Visualize new minimum

    // Swap A[i] with A[minIndex] if they are different
    if minIndex != i
      // Visualize swap
      swap(A[i], A[minIndex])

    // Mark A[i] as sorted
  // Mark A[n-1] as sorted (implicitly sorted after loop)`,
        setup: (data) => {
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = '';
            extraVisualizationArea.innerHTML = '';

            if (!data || data.length === 0) {
                visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                return { steps: [], elements: [] };
            }
            const maxValue = Math.max(...data, 1);
            const elements = data.map((value) => {
                const bar = document.createElement('div');
                bar.classList.add('vis-bar');
                bar.style.height = `${(value / maxValue) * 95}%`;
                bar.setAttribute('data-value', value);
                bar.title = `Value: ${value}`;
                visualizationArea.appendChild(bar);
                return bar;
            });

            let steps = [];
            let arr = [...data];
            const n = arr.length;

            steps.push({ type: 'start', arrayState: [...arr], message: 'Starting Selection Sort' });

            if (n <= 1) {
                 steps.push({ type: 'finish', arrayState: [...arr], message: 'Array is already sorted (size <= 1)!' });
                 return { steps, elements };
            }

            for (let i = 0; i < n - 1; i++) {
                let minIndex = i;
                 // Step: Start finding minimum for the current outer loop position 'i'
                steps.push({ type: 'find-min-start', arrayState: [...arr], outerIndex: i, minIndex: minIndex, message: `Finding minimum for index ${i} (currently ${arr[minIndex]})` });

                for (let j = i + 1; j < n; j++) {
                    // Step: Compare element 'j' with the current minimum found so far
                    steps.push({ type: 'compare-inner', arrayState: [...arr], outerIndex: i, minIndex: minIndex, compareIndex: j, message: `Comparing index ${j} (${arr[j]}) with current min (${arr[minIndex]})` });

                    if (arr[j] < arr[minIndex]) {
                        const oldMinIndex = minIndex; // Store the old index before updating
                        minIndex = j;
                        // Step: Found a new minimum
                        steps.push({ type: 'new-min', arrayState: [...arr], outerIndex: i, minIndex: minIndex, oldMinIndex: oldMinIndex, compareIndex: j, message: `New minimum found at index ${j} (${arr[j]})` });
                    }
                }

                // After inner loop, minIndex holds the index of the minimum element in arr[i..n-1]
                if (minIndex !== i) {
                    // Step: Prepare to swap minimum with element at 'i'
                    steps.push({ type: 'swap', arrayState: [...arr], outerIndex: i, swapIndices: [i, minIndex], message: `Swapping minimum (${arr[minIndex]}) with element at index ${i} (${arr[i]})` });
                    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                    // Step: Show state after swap
                    steps.push({ type: 'after-swap', arrayState: [...arr], outerIndex: i, swapIndices: [i, minIndex], message: `Swap complete. Minimum now at index ${i}.` });
                } else {
                    // Step: Element at 'i' was already the minimum, no swap needed
                    steps.push({ type: 'no-swap', arrayState: [...arr], outerIndex: i, message: `Element at index ${i} (${arr[i]}) is already the minimum. No swap needed.` });
                }
                 // Step: Mark the element at index 'i' as sorted
                 steps.push({ type: 'mark-sorted', arrayState: [...arr], index: i, message: `Element at index ${i} is now sorted.` });
            }
            // Mark the last element as sorted (it's sorted by default after the loop finishes)
            if (n > 0) {
                 steps.push({ type: 'mark-sorted', arrayState: [...arr], index: n - 1, message: `Element at index ${n-1} is now sorted.` });
            }

            steps.push({ type: 'finish', arrayState: [...arr], message: 'Array is sorted!' });
            return { steps, elements };
        },
        renderStep: (step, elements) => {
            if (!step || !elements || elements.length === 0) return;
            const maxValue = Math.max(...step.arrayState, 1);

            elements.forEach((bar, index) => {
                 // Reset common classes first
                bar.className = 'vis-bar';
                bar.style.opacity = '1';
                bar.style.transform = 'translateY(0)';
                bar.style.borderColor = 'transparent';

                // Update height and value based on the current step's array state
                const value = step.arrayState[index];
                bar.style.height = `${(value / maxValue) * 95}%`;
                bar.setAttribute('data-value', value);
                bar.title = `Value: ${value}`;

                 // Apply sorted style up to (but not including) the outer loop index 'i'
                 // OR apply if the step explicitly marks it as sorted
                 if (step.type === 'finish' || (step.type === 'mark-sorted' && index <= step.index) || (step.outerIndex !== undefined && index < step.outerIndex)) {
                     bar.classList.add('sorted-final');
                 }
            });

            // Apply step-specific highlights
            switch (step.type) {
                case 'find-min-start':
                    if (elements[step.outerIndex]) elements[step.outerIndex].classList.add('current-outer'); // Mark the start of the unsorted section
                    if (elements[step.minIndex]) elements[step.minIndex].classList.add('minimum'); // Highlight initial minimum assumption
                    break;
                case 'compare-inner':
                    if (elements[step.outerIndex]) elements[step.outerIndex].classList.add('current-outer');
                    if (elements[step.minIndex] && !elements[step.minIndex].classList.contains('sorted-final')) elements[step.minIndex].classList.add('minimum'); // Current minimum
                    if (elements[step.compareIndex] && !elements[step.compareIndex].classList.contains('sorted-final')) elements[step.compareIndex].classList.add('comparing'); // Element being compared
                    break;
                case 'new-min':
                    if (elements[step.outerIndex]) elements[step.outerIndex].classList.add('current-outer');
                    // Remove 'minimum' from the old minimum element if it wasn't the outerIndex itself
                    if (step.oldMinIndex !== undefined && elements[step.oldMinIndex] && step.oldMinIndex !== step.outerIndex) {
                       elements[step.oldMinIndex].classList.remove('minimum');
                    }
                    // Highlight the new minimum
                    if (elements[step.minIndex] && !elements[step.minIndex].classList.contains('sorted-final')) elements[step.minIndex].classList.add('minimum');
                    // Highlight the element that was just compared (which became the new min)
                    if (elements[step.compareIndex] && !elements[step.compareIndex].classList.contains('sorted-final')) elements[step.compareIndex].classList.add('comparing'); // Show the comparison happened
                    break;
                case 'swap':
                case 'after-swap':
                    if (elements[step.swapIndices[0]] && !elements[step.swapIndices[0]].classList.contains('sorted-final')) elements[step.swapIndices[0]].classList.add('swapping');
                    if (elements[step.swapIndices[1]] && !elements[step.swapIndices[1]].classList.contains('sorted-final')) elements[step.swapIndices[1]].classList.add('swapping');
                     // In the 'swap' step, also keep the minimum highlighted on the element being swapped *from*
                     if (step.type === 'swap' && elements[step.swapIndices[1]]) {
                        elements[step.swapIndices[1]].classList.add('minimum');
                     }
                     // Keep the outer index marked during swap
                     if (elements[step.outerIndex]) elements[step.outerIndex].classList.add('current-outer');
                    break;
                case 'no-swap':
                    // Highlight the outer index element as both current and minimum
                    if (elements[step.outerIndex] && !elements[step.outerIndex].classList.contains('sorted-final')) {
                        elements[step.outerIndex].classList.add('current-outer');
                        elements[step.outerIndex].classList.add('minimum');
                    }
                    break;
                case 'mark-sorted':
                    // Styling handled by the initial loop based on outerIndex/index
                     if (elements[step.index]) elements[step.index].classList.add('sorted-final'); // Explicitly set final style
                    break;
                case 'start':
                     break;
                case 'finish':
                    elements.forEach(bar => bar.classList.add('sorted-final'));
                    break;
            }
             // Update status message (handled in main.js)
        }
    },
     // ================== INSERTION SORT ==================
     'insertion-sort': {
         name: 'Insertion Sort',
         code: `<span class="code-keyword">function</span> <span class="code-function">insertionSort</span>(arr) {
  <span class="code-keyword">const</span> n = arr.length;
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">1</span>; i < n; i++) {
    <span class="code-comment">// Select the element to be inserted</span>
    <span class="code-keyword">let</span> current = arr[i]; // The element to insert
    <span class="code-keyword">let</span> j = i - <span class="code-number">1</span>; // Start comparing with the element before it
    <span class="code-comment">// Visualize selecting 'current'</span>

    <span class="code-comment">// Shift elements of the sorted segment (arr[0..i-1])</span>
    <span class="code-comment">// that are greater than 'current', to one position ahead</span>
    <span class="code-keyword">while</span> (j >= <span class="code-number">0</span> && arr[j] > current) {
      <span class="code-comment">// Visualize comparison and shift</span>
      arr[j + <span class="code-number">1</span>] = arr[j]; // Shift element to the right
      j--; // Move to the next element on the left
    }
    <span class="code-comment">// Insert the 'current' element into its correct position</span>
    <span class="code-comment">// This position is after the element just smaller than it (or at the start)</span>
    arr[j + <span class="code-number">1</span>] = current;
    <span class="code-comment">// Visualize insertion</span>
  }
  <span class="code-comment">// Visualize array is sorted</span>
  <span class="code-keyword">return</span> arr;
}`,
         pseudocode: `InsertionSort(A):
  n = length(A)
  // Assume A[0] is sorted, start from the second element
  for i = 1 to n - 1
    key = A[i]  // Element to insert into the sorted subarray A[0..i-1]
    j = i - 1   // Index of the last element in the sorted subarray

    // Visualize selecting key

    // Move elements of A[0..i-1] that are greater than key,
    // to one position ahead of their current position
    while j >= 0 and A[j] > key
      // Visualize comparison
      A[j + 1] = A[j] // Shift element right
      // Visualize shift
      j = j - 1

    // Place key at after the element just smaller than it, or at the beginning
    A[j + 1] = key
    // Visualize insertion

  // Visualize array sorted`,
         setup: (data) => {
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = '';
            extraVisualizationArea.innerHTML = '';

             if (!data || data.length === 0) {
                visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                return { steps: [], elements: [] };
             }
             const maxValue = Math.max(...data, 1);
             const elements = data.map((value) => {
                 const bar = document.createElement('div');
                 bar.classList.add('vis-bar');
                 bar.style.height = `${(value / maxValue) * 95}%`;
                 bar.setAttribute('data-value', value);
                 bar.title = `Value: ${value}`;
                 visualizationArea.appendChild(bar);
                 return bar;
             });

             let steps = [];
             let arr = [...data];
             const n = arr.length;

             steps.push({ type: 'start', arrayState: [...arr], sortedUntil: 0, message: 'Starting Insertion Sort. First element is considered sorted.' });

             if (n <= 1) {
                 steps.push({ type: 'finish', arrayState: [...arr], message: 'Array is already sorted (size <= 1)!' });
                 return { steps, elements };
             }


             for (let i = 1; i < n; i++) {
                 let key = arr[i]; // The element to be inserted
                 let j = i - 1; // Last index of the sorted portion

                 // Step: Select the key element at index i
                 steps.push({ type: 'select-key', arrayState: [...arr], keyIndex: i, keyVal: key, sortedUntil: i - 1, message: `Selecting element ${key} at index ${i} to insert.` });

                 let shiftOccurred = false;
                 let tempArrState = [...arr]; // Create a temporary state for visualization during shifts

                 // Step: Start comparing key with elements in the sorted portion (j moving left)
                 // Add a step *before* the while loop starts for the first comparison (if j >= 0)
                 if (j >= 0) {
                    steps.push({ type: 'compare-shift', arrayState: [...tempArrState], keyIndex: i, keyVal: key, compareIndex: j, sortedUntil: i - 1, shifting: false, message: `Comparing key ${key} with ${tempArrState[j]} at index ${j}.` });
                 }


                 while (j >= 0 && tempArrState[j] > key) {
                     shiftOccurred = true;
                     // Step: Comparison indicates a shift is needed
                     steps.push({ type: 'compare-shift', arrayState: [...tempArrState], keyIndex: i, keyVal: key, compareIndex: j, sortedUntil: i - 1, shifting: true, message: `${tempArrState[j]} > ${key}. Shifting ${tempArrState[j]} to index ${j + 1}.` });

                     tempArrState[j + 1] = tempArrState[j]; // Perform shift in temporary array for visualization

                     // Step: Show the state *after* the shift
                     steps.push({ type: 'after-shift', arrayState: [...tempArrState], keyIndex: i, keyVal: key, shiftedFrom: j, shiftedTo: j + 1, sortedUntil: i - 1, message: `Shifted element from ${j} to ${j + 1}.` });

                     j--; // Move pointer left

                    // Step: Prepare for next comparison or end of loop
                    if (j >= 0) {
                         steps.push({ type: 'compare-shift', arrayState: [...tempArrState], keyIndex: i, keyVal: key, compareIndex: j, sortedUntil: i - 1, shifting: false, message: `Comparing key ${key} with ${tempArrState[j]} at index ${j}.` });
                     }
                 }

                 // While loop finished. j is now the index *before* the insertion point.
                 const insertPos = j + 1;

                 // Step: Insert the key at the correct position (j+1)
                 if (insertPos !== i || shiftOccurred) { // Only insert if position changed or shifts happened
                     tempArrState[insertPos] = key; // Insert key into temporary array
                      steps.push({ type: 'insert', arrayState: [...tempArrState], keyIndex: i, keyVal: key, insertIndex: insertPos, sortedUntil: i, message: `Inserting key ${key} at index ${insertPos}.` });
                      arr = [...tempArrState]; // Update the main array *after* visualizing the insertion
                 } else {
                     // Key was already in its sorted position relative to the sorted part
                     steps.push({ type: 'no-insert-needed', arrayState: [...arr], keyIndex: i, sortedUntil: i, message: `Element ${key} already in sorted position.` });
                 }

                  // Add a final step for this iteration marking the new sorted boundary
                  steps.push({ type: 'mark-sorted', arrayState: [...arr], sortedUntil: i, message: `Elements up to index ${i} are now sorted.` });
             }

             steps.push({ type: 'finish', arrayState: [...arr], message: 'Array is sorted!' });
             return { steps, elements };
         },
         renderStep: (step, elements) => {
             if (!step || !elements || elements.length === 0) return;
             const maxValue = Math.max(...step.arrayState, 1);

             elements.forEach((bar, index) => {
                // Reset common classes first
                bar.className = 'vis-bar';
                bar.style.opacity = '1';
                bar.style.transform = 'translateY(0)'; // Reset lift/shift effect
                bar.style.borderColor = 'transparent';

                 // Update height and value based on the current step's array state
                 const value = step.arrayState[index];
                 bar.style.height = `${(value / maxValue) * 95}%`;
                 bar.setAttribute('data-value', value);
                 bar.title = `Value: ${value}`;

                 // Apply sorted style up to the sorted boundary FOR THE CURRENT STEP
                 if (step.sortedUntil !== undefined && index <= step.sortedUntil && step.type !== 'finish') {
                    // Exception: don't mark the key being inserted as sorted yet
                    if (step.type !== 'select-key' || index !== step.keyIndex) {
                         bar.classList.add('sorted-final');
                    }
                 }
             });

             // Apply step-specific highlights
             switch (step.type) {
                 case 'select-key':
                     if (elements[step.keyIndex]) {
                         elements[step.keyIndex].classList.add('current-insertion'); // Lift the key
                         // Ensure it's not marked sorted yet
                        elements[step.keyIndex].classList.remove('sorted-final');
                     }
                     break;
                 case 'compare-shift':
                     // Highlight the key being inserted
                     if (elements[step.keyIndex]) elements[step.keyIndex].classList.add('current-insertion');
                      // Highlight the element in the sorted part being compared
                     if (elements[step.compareIndex]) elements[step.compareIndex].classList.add('comparing');
                     // If shifting, also apply shifting style to the compared element
                     if (step.shifting && elements[step.compareIndex]) {
                         elements[step.compareIndex].classList.add('shifting');
                     }
                     break;
                 case 'after-shift':
                      // Highlight the key being inserted
                      if (elements[step.keyIndex]) elements[step.keyIndex].classList.add('current-insertion');
                      // Highlight the element that *was* shifted (now at shiftedTo index)
                      if (elements[step.shiftedTo]) {
                          elements[step.shiftedTo].classList.add('shifting');
                      }
                      break;
                 case 'insert':
                      // Highlight the position where the key is inserted
                      if (elements[step.insertIndex]) {
                          elements[step.insertIndex].classList.add('placing-merge'); // Use a distinct color for placement
                          // Ensure the inserted element is marked as sorted now
                          elements[step.insertIndex].classList.add('sorted-final');
                          elements[step.insertIndex].classList.remove('current-insertion'); // Remove lift
                      }
                      break;
                 case 'no-insert-needed':
                     // Key was already sorted, just mark it as sorted
                      if (elements[step.keyIndex]) {
                         elements[step.keyIndex].classList.add('sorted-final');
                          elements[step.keyIndex].classList.remove('current-insertion'); // Remove lift
                      }
                     break;
                 case 'mark-sorted':
                     // Styling is handled by the initial loop based on sortedUntil
                      // Ensure the element at sortedUntil index is styled correctly
                      if (step.sortedUntil >= 0 && elements[step.sortedUntil]) {
                           elements[step.sortedUntil].classList.add('sorted-final');
                           elements[step.sortedUntil].classList.remove('current-insertion', 'comparing', 'shifting', 'placing-merge');
                      }
                     break;
                 case 'start':
                      if (elements[0]) elements[0].classList.add('sorted-final'); // Mark first element sorted
                     break;
                 case 'finish':
                     elements.forEach(bar => bar.classList.add('sorted-final'));
                     break;
             }
             // Update status message (handled in main.js)
         }
     },
      // ================== QUICK SORT ==================
     'quick-sort': {
         name: 'Quick Sort (Lomuto)',
         code: `<span class="code-keyword">function</span> <span class="code-function">quickSort</span>(arr, low, high) {
  <span class="code-keyword">if</span> (low < high) {
    <span class="code-comment">// pi is partitioning index, arr[pi] is now at right place</span>
    <span class="code-keyword">let</span> pi = <span class="code-function">partition</span>(arr, low, high);
    <span class="code-comment">// Visualize pivot in final place</span>

    <span class="code-comment">// Separately sort elements before partition and after partition</span>
    <span class="code-function">quickSort</span>(arr, low, pi - <span class="code-number">1</span>); <span class="code-comment">// Visualize recursive call left</span>
    <span class="code-function">quickSort</span>(arr, pi + <span class="code-number">1</span>, high); <span class="code-comment">// Visualize recursive call right</span>
  } <span class="code-keyword">else</span> {
      <span class="code-comment">// Visualize base case (partition of size 0 or 1 is sorted)</span>
  }
}

<span class="code-comment">// Lomuto partition scheme</span>
<span class="code-keyword">function</span> <span class="code-function">partition</span>(arr, low, high) {
  <span class="code-comment">// Select the last element as pivot</span>
  <span class="code-keyword">let</span> pivot = arr[high];
  <span class="code-comment">// Visualize pivot selection</span>

  <span class="code-comment">// Index of smaller element (or the position for the next smaller element)</span>
  <span class="code-keyword">let</span> i = low - <span class="code-number">1</span>;
  <span class="code-comment">// Visualize pointers i and j start</span>

  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> j = low; j < high; j++) {
    <span class="code-comment">// Visualize comparison of j with pivot</span>
    <span class="code-keyword">if</span> (arr[j] < pivot) {
      i++; <span class="code-comment">// Increment index of smaller element boundary</span>
      <span class="code-comment">// Visualize swap of i and j</span>
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap arr[j] with the element at boundary i
    }
    <span class="code-comment">// Visualize pointer j moving</span>
  }
  <span class="code-comment">// Swap pivot (arr[high]) with the element at i + 1</span>
  <span class="code-comment">// (the first element greater than the pivot)</span>
  <span class="code-comment">// Visualize final pivot swap</span>
  [arr[i + <span class="code-number">1</span>], arr[high]] = [arr[high], arr[i + <span class="code-number">1</span>]];
  <span class="code-keyword">return</span> i + <span class="code-number">1</span>; <span class="code-comment">// Return the partition index (pivot's final position)</span>
}`,
         pseudocode: `QuickSort(A, low, high):
  if low < high:
    // Partition the array around a pivot
    pi = Partition(A, low, high)
    // Mark pivot A[pi] as sorted relative to this partition level

    // Recursively sort elements before and after partition
    QuickSort(A, low, pi - 1)  // Sort left subarray
    QuickSort(A, pi + 1, high) // Sort right subarray
  else:
    // Base case: Mark element(s) in range [low, high] as sorted
    // (If low == high, single element is sorted)
    // (If low > high, range is empty, implicitly sorted)

Partition(A, low, high): // Lomuto partition scheme
  pivot = A[high] // Choose last element as pivot
  // Visualize pivot selection

  i = low - 1 // Initialize index for the boundary of elements smaller than pivot
  // Visualize pointers i and j start

  for j = low to high - 1:
    // Compare current element A[j] with pivot
    if A[j] < pivot:
      i = i + 1       // Move the smaller element boundary
      swap(A[i], A[j]) // Swap A[j] with the element at the boundary
      // Visualize swap
    // Visualize j pointer moving

  // Swap the pivot element with the element at position i + 1
  // (This places the pivot between smaller and larger elements)
  swap(A[i + 1], A[high])
  // Visualize final pivot swap

  return (i + 1) // Return the final index of the pivot`,
         setup: (data) => {
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = '';
            extraVisualizationArea.innerHTML = '';

            if (!data || data.length === 0) {
                visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                return { steps: [], elements: [] };
            }
            const maxValue = Math.max(...data, 1);
            const elements = data.map((value) => {
                const bar = document.createElement('div');
                bar.classList.add('vis-bar');
                bar.style.height = `${(value / maxValue) * 95}%`;
                bar.setAttribute('data-value', value);
                bar.title = `Value: ${value}`;
                visualizationArea.appendChild(bar);
                return bar;
            });

            let steps = [];
            let arr = [...data];
            let sortedStatus = new Array(arr.length).fill(false); // Track final sorted elements

            function partition(low, high) {
                let pivotValue = arr[high]; // Choose the last element as pivot
                let i = low - 1; // Index for the smaller element boundary

                // Step: Start partition, select pivot
                 steps.push({ type: 'partition-start', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, message: `Partitioning [${low}, ${high}]. Pivot: ${pivotValue} (index ${high})` });

                for (let j = low; j < high; j++) {
                    // Step: Compare element j with pivot
                    steps.push({ type: 'compare-partition', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, j: j, message: `Comparing element ${arr[j]} (j=${j}) with pivot ${pivotValue}` });

                    if (arr[j] < pivotValue) {
                        i++; // Increment smaller element boundary
                        // Step: Swap element j with element at boundary i
                         steps.push({ type: 'swap-partition', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, j: j, swapIndices: [i, j], message: `Element ${arr[j]} < pivot ${pivotValue}. Swapping A[${i}] (${arr[i]}) and A[${j}] (${arr[j]})` });
                        [arr[i], arr[j]] = [arr[j], arr[i]]; // Perform swap
                         // Step: Show state after swap (optional, but good for clarity)
                         steps.push({ type: 'after-swap-partition', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, j: j, swapIndices: [i, j], message: `Swap complete. Smaller element boundary now at ${i}.` });
                    }
                     // Step: visualize j pointer moving (even if no swap) - implied by next compare step
                }

                // After loop, swap pivot into its final position (i + 1)
                const pivotFinalIndex = i + 1;
                 steps.push({ type: 'swap-pivot-final', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, swapIndices: [pivotFinalIndex, high], message: `Swapping pivot ${arr[high]} with element at i+1 (${arr[pivotFinalIndex]})` });
                [arr[pivotFinalIndex], arr[high]] = [arr[high], arr[pivotFinalIndex]]; // Swap pivot

                // Mark the pivot as sorted *within this partition level*
                sortedStatus[pivotFinalIndex] = true;
                 steps.push({ type: 'partition-done', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotFinalIndex: pivotFinalIndex, message: `Pivot ${arr[pivotFinalIndex]} is in final position ${pivotFinalIndex}. Partition complete for [${low}, ${high}].` });

                return pivotFinalIndex; // Return pivot's final index
            }

            function quickSortRecursive(low, high) {
                if (low < high) {
                    // Step: Announce recursive call (before partition)
                     steps.push({ type: 'recursive-call-start', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, message: `QuickSort called for [${low}, ${high}]` });

                    let pi = partition(low, high); // Partition and get pivot index

                    // Step: Announce recursive call for left subarray
                    steps.push({ type: 'recursive-call-left', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: pi - 1, pivotFinalIndex: pi, message: `Recursive call for left subarray [${low}, ${pi - 1}]` });
                    quickSortRecursive(low, pi - 1);

                    // Step: Announce recursive call for right subarray
                    steps.push({ type: 'recursive-call-right', arrayState: [...arr], sortedStatus: [...sortedStatus], low: pi + 1, high: high, pivotFinalIndex: pi, message: `Recursive call for right subarray [${pi + 1}, ${high}]` });
                    quickSortRecursive(pi + 1, high);
                } else {
                     // Step: Base case (range is 0 or 1 element, or invalid)
                     if (low >= 0 && low < arr.length && low === high) {
                        // If single element, mark it as sorted
                        sortedStatus[low] = true;
                         steps.push({ type: 'base-case', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, message: `Base case: Element at index ${low} is sorted.` });
                     } else if (low > high) {
                          steps.push({ type: 'base-case', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, message: `Base case: Range [${low}, ${high}] is empty/sorted.` });
                     } else {
                         // Handle potential invalid indices if needed, though unlikely with correct calls
                          steps.push({ type: 'base-case', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, message: `Base case: Range [${low}, ${high}] reached.` });
                     }
                }
            }

            steps.push({ type: 'start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Starting Quick Sort' });
            if (arr.length > 0) {
                 quickSortRecursive(0, arr.length - 1);
            } else {
                 steps.push({ type: 'finish', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Array is empty, already sorted!' });
            }

            // Ensure all elements are marked sorted at the very end if not already
            let allSorted = true;
            for(let k=0; k<arr.length; k++) { if (!sortedStatus[k]) allSorted = false; }
            if (!allSorted) {
                sortedStatus.fill(true);
                 steps.push({ type: 'final-sort-mark', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Marking all elements as finally sorted.' });
            }

            steps.push({ type: 'finish', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Array is sorted!' });

            return { steps, elements };
         },
         renderStep: (step, elements) => {
             if (!step || !elements || elements.length === 0) return;
             const maxValue = Math.max(...step.arrayState, 1);

             elements.forEach((bar, index) => {
                // Reset common classes first, remove pseudo-elements if they exist
                bar.className = 'vis-bar';
                bar.style.opacity = '1';
                bar.style.transform = 'translateY(0)';
                bar.style.borderColor = 'transparent';
                 while(bar.firstChild) bar.removeChild(bar.firstChild); // Clear old i/j pseudo-elements if any library added them

                // Apply final sorted style if marked in the step's status array
                if (step.sortedStatus && step.sortedStatus[index]) {
                    bar.classList.add('sorted-final');
                }

                // Update height and title ALWAYS
                bar.style.height = `${(step.arrayState[index] / maxValue) * 95}%`;
                 bar.setAttribute('data-value', step.arrayState[index]);
                bar.title = `Value: ${step.arrayState[index]}`;

                 // Highlight the current partition range (dim outside)
                if (step.low !== undefined && step.high !== undefined && step.type !== 'finish' && !bar.classList.contains('sorted-final')) {
                    if (index < step.low || index > step.high) {
                        bar.classList.add('outside-partition');
                        bar.style.opacity = '0.4';
                    } else {
                        bar.classList.add('partition-range'); // Active partition
                    }
                }
             });

             // Apply step-specific styling
             switch (step.type) {
                 case 'partition-start':
                    if (elements[step.pivotIndex]) elements[step.pivotIndex].classList.add('pivot');
                    // Visualize initial i (-1 relative to low) implicitly
                    break;
                 case 'compare-partition':
                     if (elements[step.pivotIndex]) elements[step.pivotIndex].classList.add('pivot');
                     if (step.i >= step.low && elements[step.i]) elements[step.i].classList.add('partition-i'); // Show i pointer only if valid index
                     if (elements[step.j]) {
                         elements[step.j].classList.add('partition-j'); // Show j pointer
                         elements[step.j].classList.add('comparing'); // Highlight j as comparing
                     }
                     break;
                 case 'swap-partition':
                 case 'after-swap-partition':
                     if (elements[step.pivotIndex]) elements[step.pivotIndex].classList.add('pivot');
                     if (step.i >= step.low && elements[step.i]) elements[step.i].classList.add('partition-i');
                     if (elements[step.j]) elements[step.j].classList.add('partition-j');
                     // Highlight elements being swapped
                     if (elements[step.swapIndices[0]]) elements[step.swapIndices[0]].classList.add('swapping');
                     if (elements[step.swapIndices[1]]) elements[step.swapIndices[1]].classList.add('swapping');
                     break;
                 case 'swap-pivot-final':
                     // Highlight pivot (at original high index) and element at final position (i+1) being swapped
                     if (elements[step.swapIndices[0]]) elements[step.swapIndices[0]].classList.add('swapping');
                     if (elements[step.swapIndices[1]]) {
                         elements[step.swapIndices[1]].classList.add('swapping');
                         elements[step.swapIndices[1]].classList.add('pivot'); // Keep pivot style during swap
                     }
                      if (step.i >= step.low && elements[step.i]) elements[step.i].classList.add('partition-i'); // Show final i
                     break;
                 case 'partition-done':
                      // Pivot element (at pivotFinalIndex) is marked sorted by the initial loop
                     if (elements[step.pivotFinalIndex]) {
                         elements[step.pivotFinalIndex].classList.remove('pivot', 'swapping', 'partition-i', 'partition-j'); // Clean up styles
                         elements[step.pivotFinalIndex].classList.add('sorted-final'); // Ensure final style
                     }
                     break;
                case 'recursive-call-start':
                 case 'recursive-call-left':
                 case 'recursive-call-right':
                 case 'base-case':
                 case 'final-sort-mark':
                     // Styling (range dimming, sorted status) handled by the initial loop
                     break;
                 case 'start':
                     // No specific styling
                     break;
                 case 'finish':
                     elements.forEach(bar => { bar.className = 'vis-bar sorted-final'; bar.style.opacity = '1'; }); // Set final state
                     break;
             }
             // Update status message (handled in main.js)
         }
     },
      // ================== MERGE SORT ==================
     'merge-sort': {
         name: 'Merge Sort',
         code: `<span class="code-keyword">function</span> <span class="code-function">mergeSort</span>(arr, l, r) {
  <span class="code-keyword">if</span> (l >= r) {
    <span class="code-keyword">return</span>; <span class="code-comment">// Base case: array of size 0 or 1 is sorted</span>
  }
  <span class="code-keyword">const</span> m = l + Math.<span class="code-function">floor</span>((r - l) / <span class="code-number">2</span>);
  <span class="code-comment">// Visualize recursive call left</span>
  <span class="code-function">mergeSort</span>(arr, l, m);
  <span class="code-comment">// Visualize recursive call right</span>
  <span class="code-function">mergeSort</span>(arr, m + <span class="code-number">1</span>, r);
  <span class="code-comment">// Visualize merge operation</span>
  <span class="code-function">merge</span>(arr, l, m, r);
}

<span class="code-keyword">function</span> <span class="code-function">merge</span>(arr, l, m, r) {
  <span class="code-keyword">let</span> n1 = m - l + <span class="code-number">1</span>; // Size of left subarray
  <span class="code-keyword">let</span> n2 = r - m;     // Size of right subarray

  <span class="code-comment">// Create temporary arrays</span>
  <span class="code-keyword">let</span> L = <span class="code-keyword">new</span> <span class="code-function">Array</span>(n1);
  <span class="code-keyword">let</span> R = <span class="code-keyword">new</span> <span class="code-function">Array</span>(n2);

  <span class="code-comment">// Copy data to temp arrays L[] and R[]</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < n1; i++) L[i] = arr[l + i];
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> j = <span class="code-number">0</span>; j < n2; j++) R[j] = arr[m + <span class="code-number">1</span> + j];
  <span class="code-comment">// Visualize subarrays copied</span>

  <span class="code-comment">// Merge the temp arrays back into arr[l..r]</span>
  <span class="code-keyword">let</span> i = <span class="code-number">0</span>; <span class="code-comment">// Initial index of first subarray</span>
  <span class="code-keyword">let</span> j = <span class="code-number">0</span>; <span class="code-comment">// Initial index of second subarray</span>
  <span class="code-keyword">let</span> k = l; <span class="code-comment">// Initial index of merged subarray</span>

  <span class="code-keyword">while</span> (i < n1 && j < n2) {
    <span class="code-comment">// Visualize comparison</span>
    <span class="code-keyword">if</span> (L[i] <= R[j]) {
      <span class="code-comment">// Visualize placing L[i]</span>
      arr[k] = L[i];
      i++;
    } <span class="code-keyword">else</span> {
      <span class="code-comment">// Visualize placing R[j]</span>
      arr[k] = R[j];
      j++;
    }
    k++;
  }

  <span class="code-comment">// Copy the remaining elements of L[], if any</span>
  <span class="code-keyword">while</span> (i < n1) {
    <span class="code-comment">// Visualize placing remaining L[i]</span>
    arr[k] = L[i];
    i++;
    k++;
  }

  <span class="code-comment">// Copy the remaining elements of R[], if any</span>
  <span class="code-keyword">while</span> (j < n2) {
    <span class="code-comment">// Visualize placing remaining R[j]</span>
    arr[k] = R[j];
    j++;
    k++;
  }
  <span class="code-comment">// Visualize merge complete for this range</span>
}`,
         pseudocode: `MergeSort(A, l, r):
  if l >= r:
    return // Base case: Array with 0 or 1 element is sorted

  m = floor(l + (r - l) / 2) // Find midpoint
  // Visualize recursive call left
  MergeSort(A, l, m)         // Sort left half
  // Visualize recursive call right
  MergeSort(A, m + 1, r)     // Sort right half
  // Visualize merge operation
  Merge(A, l, m, r)          // Merge the two sorted halves

Merge(A, l, m, r):
  // Calculate sizes of the two subarrays to be merged
  n1 = m - l + 1
  n2 = r - m

  // Create temporary arrays L and R
  L = copy of A[l..m]
  R = copy of A[m+1..r]
  // Visualize subarrays copied

  i = 0 // Initial index for L
  j = 0 // Initial index for R
  k = l // Initial index for merged array A

  // Merge L and R back into A[l..r] in sorted order
  while i < n1 and j < n2:
    // Compare elements from L and R
    if L[i] <= R[j]:
      // Place L[i] into A[k]
      A[k] = L[i]
      i = i + 1
    else:
      // Place R[j] into A[k]
      A[k] = R[j]
      j = j + 1
    // Visualize placement into A[k]
    k = k + 1

  // Copy any remaining elements of L (if R ran out first)
  while i < n1:
    A[k] = L[i]
    i = i + 1
    k = k + 1
    // Visualize placement of remaining L elements

  // Copy any remaining elements of R (if L ran out first)
  while j < n2:
    A[k] = R[j]
    j = j + 1
    k = k + 1
    // Visualize placement of remaining R elements

  // Visualize merge complete for range [l..r]`,
         setup: (data) => {
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = '';
            extraVisualizationArea.innerHTML = '';

            if (!data || data.length === 0) {
                visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                return { steps: [], elements: [] };
            }
            const maxValue = Math.max(...data, 1);
            const elements = data.map((value) => {
                const bar = document.createElement('div');
                bar.classList.add('vis-bar');
                bar.style.height = `${(value / maxValue) * 95}%`;
                bar.setAttribute('data-value', value);
                 bar.title = `Value: ${value}`;
                visualizationArea.appendChild(bar);
                return bar;
            });

            let steps = [];
            let arr = [...data]; // Work on a copy
            let sortedStatus = new Array(arr.length).fill(false); // Track final sorted elements

            function merge(l, m, r) {
                let n1 = m - l + 1;
                let n2 = r - m;
                let L = new Array(n1);
                let R = new Array(n2);

                // Capture state *before* copying to temp arrays
                 steps.push({ type: 'merge-start', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, message: `Merging subarrays [${l}..${m}] and [${m+1}..${r}]` });

                for (let i = 0; i < n1; i++) L[i] = arr[l + i];
                for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

                // Step: Show temp arrays copied (conceptually)
                 steps.push({ type: 'merge-copy', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, leftArr: [...L], rightArr: [...R], message: `Copied subarrays to temporary storage.` });


                let i = 0, j = 0, k = l;
                let tempArrStateDuringMerge = [...arr]; // Use this to show placement step-by-step

                while (i < n1 && j < n2) {
                    // Step: Compare elements from L and R
                     steps.push({ type: 'merge-compare', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, leftIndexInL: i, rightIndexInR: j, k: k, leftVal: L[i], rightVal: R[j], message: `Comparing Left (${L[i]}) and Right (${R[j]})` });

                    if (L[i] <= R[j]) {
                        tempArrStateDuringMerge[k] = L[i]; // Place value in temp state
                         // Step: Place element from L into position k
                         steps.push({ type: 'merge-place', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, sourceVal: L[i], targetIndex: k, fromLeft: true, message: `Placing ${L[i]} from left subarray into index ${k}` });
                        i++;
                    } else {
                        tempArrStateDuringMerge[k] = R[j]; // Place value in temp state
                         // Step: Place element from R into position k
                         steps.push({ type: 'merge-place', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, sourceVal: R[j], targetIndex: k, fromLeft: false, message: `Placing ${R[j]} from right subarray into index ${k}` });
                        j++;
                    }
                    k++;
                }

                // Copy remaining elements from L
                while (i < n1) {
                    tempArrStateDuringMerge[k] = L[i];
                     steps.push({ type: 'merge-place-remaining', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, sourceVal: L[i], targetIndex: k, fromLeft: true, message: `Placing remaining ${L[i]} from left into index ${k}` });
                    i++; k++;
                }
                // Copy remaining elements from R
                while (j < n2) {
                    tempArrStateDuringMerge[k] = R[j];
                     steps.push({ type: 'merge-place-remaining', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, sourceVal: R[j], targetIndex: k, fromLeft: false, message: `Placing remaining ${R[j]} from right into index ${k}` });
                    j++; k++;
                }

                 // Update the main array *after* the merge is fully visualized in steps
                 arr = [...tempArrStateDuringMerge];

                 // If this was the final merge, mark the whole range as sorted
                 if (l === 0 && r === arr.length - 1) {
                     for(let idx = l; idx <= r; idx++) sortedStatus[idx] = true;
                 }
                 // Step: Merge for this range is complete
                 steps.push({ type: 'merge-done', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, high: r, message: `Merge complete for range [${l}..${r}]` });
            }

            function mergeSortRecursive(l, r) {
                if (l >= r) {
                     // Step: Base case
                     steps.push({ type: 'base-case', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, high: r, message: `Base case reached for range [${l}..${r}].` });
                    return;
                }
                const m = l + Math.floor((r - l) / 2);

                // Step: Announce recursive call left
                 steps.push({ type: 'recursive-call-left', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, high: m, message: `Recursive call for left subarray [${l}..${m}]` });
                mergeSortRecursive(l, m);

                // Step: Announce recursive call right
                 steps.push({ type: 'recursive-call-right', arrayState: [...arr], sortedStatus: [...sortedStatus], low: m + 1, high: r, message: `Recursive call for right subarray [${m+1}..${r}]` });
                mergeSortRecursive(m + 1, r);

                 // Merge step is announced within the merge function itself
                merge(l, m, r);
            }

            steps.push({ type: 'start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Starting Merge Sort' });
             if (arr.length > 0) {
                 mergeSortRecursive(0, arr.length - 1);
             } else {
                 steps.push({ type: 'finish', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Array is empty, already sorted!' });
             }

            // Ensure all elements are marked sorted at the very end
            sortedStatus.fill(true);
            steps.push({ type: 'finish', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Array is sorted!' });

            return { steps, elements };
         },
         renderStep: (step, elements) => {
             if (!step || !elements || elements.length === 0) return;
             const maxValue = Math.max(...step.arrayState, 1);

             elements.forEach((bar, index) => {
                // Reset common classes first
                bar.className = 'vis-bar';
                bar.style.opacity = '1';
                bar.style.transform = 'translateY(0)';
                bar.style.borderColor = 'transparent';

                // Apply final sorted style if marked
                if (step.sortedStatus && step.sortedStatus[index]) {
                    bar.classList.add('sorted-final');
                }

                // Update height and title ALWAYS based on arrayState
                bar.style.height = `${(step.arrayState[index] / maxValue) * 95}%`;
                bar.setAttribute('data-value', step.arrayState[index]);
                bar.title = `Value: ${step.arrayState[index]}`;

                // Highlight the current merge range (dim outside)
                 if (step.low !== undefined && step.high !== undefined && step.type !== 'finish' && step.type !== 'start' && !bar.classList.contains('sorted-final')) {
                     if (index < step.low || index > step.high) {
                         bar.classList.add('outside-merge-range');
                         bar.style.opacity = '0.4';
                     } else {
                         bar.classList.add('merge-range'); // Active merge range
                     }
                 }
             });

             // Apply step-specific styling
             switch (step.type) {
                 case 'merge-start':
                 case 'merge-copy':
                 case 'merge-done':
                 case 'recursive-call-left':
                 case 'recursive-call-right':
                 case 'base-case':
                     // Range highlighting is handled above
                     break;
                 case 'merge-compare':
                     // Highlight elements being compared *within their original positions*
                     // This requires knowing the original indices or visualizing the temp arrays separately.
                     // For simplicity with bars, we highlight the bars corresponding to the merge range.
                     // Optionally, highlight the `k` index where the result will be placed.
                     if (elements[step.k]) {
                         // elements[step.k].classList.add('comparing'); // Highlight target merge position
                     }
                      // Highlight the *indices* within the current merge range being considered (l+i, m+1+j)
                      // We don't have direct access to L[i] and R[j]'s original index easily here without more complex state tracking.
                      // So, we'll just rely on the range highlight and the message.
                     break;
                 case 'merge-place':
                 case 'merge-place-remaining':
                     // Highlight the target position `k` where the element is being placed
                     if (elements[step.targetIndex]) {
                         elements[step.targetIndex].classList.add('placing-merge');
                         // Height/title updated in the main loop
                     }
                     break;
                 case 'start':
                     break;
                 case 'finish':
                     elements.forEach(bar => { bar.className = 'vis-bar sorted-final'; bar.style.opacity = '1'; });
                     break;
             }
             // Update status message (handled in main.js)
         }
     },
       // ================== HEAP SORT ==================
     'heap-sort': {
         name: 'Heap Sort',
         code: `<span class="code-keyword">function</span> <span class="code-function">heapSort</span>(arr) {
    <span class="code-keyword">let</span> n = arr.length;

    <span class="code-comment">// Build max heap (rearrange array)</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = Math.<span class="code-function">floor</span>(n / <span class="code-number">2</span>) - <span class="code-number">1</span>; i >= <span class="code-number">0</span>; i--) {
        <span class="code-function">heapify</span>(arr, n, i); <span class="code-comment">// Visualize heapify call</span>
    }
    <span class="code-comment">// Visualize heap built</span>

    <span class="code-comment">// One by one extract an element from heap</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = n - <span class="code-number">1</span>; i > <span class="code-number">0</span>; i--) {
        <span class="code-comment">// Move current root (max element) to end</span>
        <span class="code-comment">// Visualize swap root and end</span>
        [arr[<span class="code-number">0</span>], arr[i]] = [arr[i], arr[<span class="code-number">0</span>]];
        <span class="code-comment">// Visualize element i is now sorted</span>

        <span class="code-comment">// call max heapify on the reduced heap (size i)</span>
        <span class="code-function">heapify</span>(arr, i, <span class="code-number">0</span>); <span class="code-comment">// Visualize heapify call on reduced heap</span>
    }
    <span class="code-comment">// Visualize array sorted (element 0 is sorted implicitly)</span>
    <span class="code-keyword">return</span> arr;
}

<span class="code-comment">// To heapify a subtree rooted with node i which is an index in arr[]</span>
<span class="code-comment">// n is size of heap</span>
<span class="code-keyword">function</span> <span class="code-function">heapify</span>(arr, n, i) {
    <span class="code-keyword">let</span> largest = i; <span class="code-comment">// Initialize largest as root</span>
    <span class="code-keyword">let</span> l = <span class="code-number">2</span> * i + <span class="code-number">1</span>; <span class="code-comment">// left child index</span>
    <span class="code-keyword">let</span> r = <span class="code-number">2</span> * i + <span class="code-number">2</span>; <span class="code-comment">// right child index</span>
    <span class="code-comment">// Visualize comparing root, left, right</span>

    <span class="code-comment">// If left child is larger than root</span>
    <span class="code-keyword">if</span> (l < n && arr[l] > arr[largest]) {
        largest = l;
    }

    <span class="code-comment">// If right child is larger than largest so far</span>
    <span class="code-keyword">if</span> (r < n && arr[r] > arr[largest]) {
        largest = r;
    }
    <span class="code-comment">// Visualize largest identified</span>

    <span class="code-comment">// If largest is not root</span>
    <span class="code-keyword">if</span> (largest !== i) {
        <span class="code-comment">// Visualize swap i and largest</span>
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        <span class="code-comment">// Recursively heapify the affected sub-tree</span>
        <span class="code-function">heapify</span>(arr, n, largest); <span class="code-comment">// Visualize recursive heapify call</span>
    }
    <span class="code-comment">// Visualize heapify for node i complete</span>
}`,
         pseudocode: `HeapSort(A):
  n = length(A)

  // 1. Build max heap from the array
  BuildMaxHeap(A, n)
  // Visualize heap built

  // 2. Repeatedly extract the maximum element (root) and move it to the end
  //    then heapify the reduced heap
  for i = n - 1 down to 1:
    // Move root (max element A[0]) to current end A[i]
    swap(A[0], A[i])
    // Visualize swap and mark A[i] as sorted (now part of the sorted portion)

    // Reduce heap size and heapify the root element (index 0)
    heapSize = i
    Heapify(A, heapSize, 0)
    // Visualize heapify call on reduced heap

  // A[0] is implicitly sorted after the loop

BuildMaxHeap(A, n):
  // Start from the last non-leaf node and heapify down to the root
  // Last non-leaf node index is floor(n / 2) - 1
  for i = floor(n / 2) - 1 down to 0:
    Heapify(A, n, i)
    // Visualize heapify call during build phase

Heapify(A, heapSize, i): // Restore heap property at index i
  largest = i       // Assume current node i is largest
  left = 2*i + 1    // Index of left child
  right = 2*i + 2   // Index of right child
  // Visualize comparing root i, left child, right child

  // Check if left child exists and is larger than current largest
  if left < heapSize and A[left] > A[largest]:
    largest = left

  // Check if right child exists and is larger than current largest
  if right < heapSize and A[right] > A[largest]:
    largest = right
  // Visualize largest identified among i, left, right

  // If the largest element is not the current node i
  if largest != i:
    // Swap A[i] with the largest element A[largest]
    swap(A[i], A[largest])
    // Visualize swap

    // Recursively call Heapify on the subtree rooted at the original 'largest' index
    // to ensure the heap property holds down the tree
    Heapify(A, heapSize, largest)
    // Visualize recursive heapify call

  // Visualize heapify for node i complete`,
         setup: (data) => {
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = '';
            extraVisualizationArea.innerHTML = '';

            if (!data || data.length === 0) {
                 visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                 return { steps: [], elements: [] };
            }
            const maxValue = Math.max(...data, 1);
            const elements = data.map((value) => {
                 const bar = document.createElement('div');
                 bar.classList.add('vis-bar');
                 bar.style.height = `${(value / maxValue) * 95}%`;
                 bar.setAttribute('data-value', value);
                  bar.title = `Value: ${value}`;
                 visualizationArea.appendChild(bar);
                 return bar;
            });

            let steps = [];
            let arr = [...data];
            const n = arr.length;
            let sortedStatus = new Array(n).fill(false); // Track final sorted elements

            // Heapify function that generates steps
            function heapify(heapSize, i) {
                let largest = i; // Initialize largest as root
                let l = 2 * i + 1; // left = 2*i + 1
                let r = 2 * i + 2; // right = 2*i + 2
                let compareIndices = [i]; // Indices involved in the comparison
                if (l < heapSize) compareIndices.push(l);
                if (r < heapSize) compareIndices.push(r);

                // Step: Start comparing node i with its children
                 steps.push({ type: 'heapify-compare', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, compareIndices: [...compareIndices], currentLargest: i, nodeIndex: i, message: `Heapify(${i}): Comparing node ${i} (${arr[i]}) with children.` });


                // Find largest among root, left child, and right child
                if (l < heapSize && arr[l] > arr[largest]) {
                    largest = l;
                }
                if (r < heapSize && arr[r] > arr[largest]) {
                    largest = r;
                }

                // Step: Show which node was identified as largest
                 steps.push({ type: 'heapify-largest', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, compareIndices: [...compareIndices], largest: largest, nodeIndex: i, message: `Heapify(${i}): Largest is at index ${largest} (${arr[largest]})` });

                // If largest is not root
                if (largest !== i) {
                    // Step: Prepare to swap root i with largest
                    steps.push({ type: 'heapify-swap', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, swapIndices: [i, largest], nodeIndex: i, message: `Heapify(${i}): Swapping node ${i} (${arr[i]}) with largest ${largest} (${arr[largest]})` });
                    [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Perform swap
                     // Step: Show state after swap
                     steps.push({ type: 'after-heapify-swap', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, swapIndices: [i, largest], nodeIndex: i, message: `Heapify(${i}): Swap complete. Recursively heapify subtree at ${largest}.` });

                    // Recursively heapify the affected sub-tree
                    heapify(heapSize, largest);
                } else {
                     // Step: Heap property holds at node i
                     steps.push({ type: 'heapify-done', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, nodeIndex: i, message: `Heapify(${i}): Node ${i} (${arr[i]}) is largest. Heap property satisfied.` });
                }
            }

            steps.push({ type: 'start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Starting Heap Sort' });

             if (n <= 1) {
                 if (n === 1) sortedStatus[0] = true;
                 steps.push({ type: 'finish', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Array is already sorted (size <= 1)!' });
                 return { steps, elements };
             }

            // Build max heap
            steps.push({ type: 'build-heap-start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Phase 1: Building Max Heap...' });
            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                 steps.push({ type: 'heapify-call', phase: 'build', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: n, nodeIndex: i, message: `Build Heap: Calling Heapify on node ${i}` });
                heapify(n, i);
            }
            steps.push({ type: 'build-heap-done', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Max Heap built.' });


            // Extract elements from heap
             steps.push({ type: 'extract-phase-start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Phase 2: Extracting elements...' });
            for (let i = n - 1; i > 0; i--) {
                // Step: Swap root (max) with element at end of current heap (index i)
                 steps.push({ type: 'extract-swap', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: i + 1, swapIndices: [0, i], message: `Extract Max: Swapping root (${arr[0]}) with end of heap (${arr[i]})` });
                [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap
                sortedStatus[i] = true; // Mark the swapped element (at index i) as sorted
                 // Step: Show state after swap, element i is now sorted
                 steps.push({ type: 'after-extract-swap', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: i, sortedIndex: i, message: `Element ${arr[i]} moved to sorted position ${i}. Heap size reduced to ${i}.` });

                // Heapify the reduced heap (size i) starting from the root (0)
                 steps.push({ type: 'heapify-call', phase: 'extract', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: i, nodeIndex: 0, message: `Heapify reduced heap (size ${i}) from root 0` });
                heapify(i, 0);
            }

            // Mark the first element as sorted too (it's the only one left in the heap)
            if (n > 0) {
                sortedStatus[0] = true;
                 steps.push({ type: 'mark-sorted', arrayState: [...arr], sortedStatus: [...sortedStatus], index: 0, message: `Element at index 0 is now sorted.` });
            }

            steps.push({ type: 'finish', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Array is sorted!' });

            return { steps, elements };
         },
         renderStep: (step, elements) => {
            if (!step || !elements || elements.length === 0) return;
            const maxValue = Math.max(...step.arrayState, 1);

            elements.forEach((bar, index) => {
                // Reset common classes first
                bar.className = 'vis-bar';
                bar.style.opacity = '1';
                bar.style.transform = 'translateY(0)';
                bar.style.borderColor = 'transparent';

                // Apply final sorted style if marked
                if (step.sortedStatus && step.sortedStatus[index]) {
                    bar.classList.add('sorted-final');
                }

                // Update height and title ALWAYS
                bar.style.height = `${(step.arrayState[index] / maxValue) * 95}%`;
                 bar.setAttribute('data-value', step.arrayState[index]);
                bar.title = `Value: ${step.arrayState[index]}`;

                // Highlight the current heap range (dim outside)
                 if (step.heapSize !== undefined && step.type !== 'finish' && !bar.classList.contains('sorted-final')) {
                    if (index >= step.heapSize) {
                        bar.classList.add('outside-heap-range');
                        bar.style.opacity = '0.4';
                    } else {
                        bar.classList.add('heap-range'); // Elements currently considered part of the heap
                    }
                 }
            });

             // Apply step-specific styling (within the heap range, unless swapping with sorted part)
             function applyStyleIfNotSorted(index, styleClass) {
                if (elements[index] && !elements[index].classList.contains('sorted-final')) {
                    elements[index].classList.add(styleClass);
                } else if (elements[index] && (step.type === 'extract-swap' || step.type === 'after-extract-swap') && step.swapIndices?.includes(index)) {
                    // Special case for extract swap: temporarily highlight sorted element being swapped
                     elements[index].classList.add(styleClass);
                }
             }

            switch (step.type) {
                case 'heapify-call':
                case 'heapify-done':
                    applyStyleIfNotSorted(step.nodeIndex, 'heapify-node'); // Highlight node being heapified
                    break;
                case 'heapify-compare':
                    step.compareIndices.forEach(idx => applyStyleIfNotSorted(idx, 'heapify-node')); // Highlight nodes being compared
                    break;
                case 'heapify-largest':
                    step.compareIndices.forEach(idx => applyStyleIfNotSorted(idx, 'heapify-node'));
                    applyStyleIfNotSorted(step.largest, 'heapify-largest'); // Highlight the largest among them
                    break;
                case 'heapify-swap':
                case 'after-heapify-swap':
                    applyStyleIfNotSorted(step.swapIndices[0], 'swapping');
                    applyStyleIfNotSorted(step.swapIndices[1], 'swapping');
                     // Keep node border during swap animation if applicable
                     applyStyleIfNotSorted(step.nodeIndex, 'heapify-node');
                    break;
                case 'extract-swap':
                case 'after-extract-swap':
                     // Use applyStyleIfNotSorted's special case to highlight both ends of swap
                    applyStyleIfNotSorted(step.swapIndices[0], 'swapping');
                    applyStyleIfNotSorted(step.swapIndices[1], 'swapping');
                    break;
                case 'mark-sorted': // Handles marking during extraction and the final element
                case 'build-heap-start':
                case 'build-heap-done':
                case 'extract-phase-start':
                 case 'start':
                    // Styling handled by heap range or sortedStatus
                    break;
                case 'finish':
                    elements.forEach(bar => { bar.className = 'vis-bar sorted-final'; bar.style.opacity = '1'; });
                    break;
            }
            // Update status message (handled in main.js)
         }
     },
       // ================== COUNTING SORT ==================
     'counting-sort': {
         name: 'Counting Sort',
         requiresPositiveInts: true, // Crucial for this algorithm
         code: `<span class="code-keyword">function</span> <span class="code-function">countingSort</span>(arr) {
  <span class="code-keyword">if</span> (arr.length === <span class="code-number">0</span>) <span class="code-keyword">return</span> arr;

  <span class="code-comment">// 1. Find the maximum element to determine range</span>
  <span class="code-keyword">let</span> max = arr[<span class="code-number">0</span>];
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">1</span>; i < arr.length; i++) {
    <span class="code-keyword">if</span> (arr[i] > max) max = arr[i];
  }
  <span class="code-comment">// Visualize max found</span>

  <span class="code-comment">// 2. Initialize count array (size max+1) with zeros</span>
  <span class="code-keyword">const</span> count = <span class="code-keyword">new</span> <span class="code-function">Array</span>(max + <span class="code-number">1</span>).<span class="code-function">fill</span>(<span class="code-number">0</span>);
  <span class="code-comment">// Visualize count array initialized</span>

  <span class="code-comment">// 3. Store count of each element in the input array</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < arr.length; i++) {
    count[arr[i]]++;
    <span class="code-comment">// Visualize incrementing count[arr[i]]</span>
  }

  <span class="code-comment">// 4. Modify count array to store cumulative counts (end positions)</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">1</span>; i <= max; i++) {
    count[i] += count[i - <span class="code-number">1</span>];
    <span class="code-comment">// Visualize updating count[i] with cumulative sum</span>
  }

  <span class="code-comment">// 5. Build the output array (iterate backwards for stability)</span>
  <span class="code-keyword">const</span> output = <span class="code-keyword">new</span> <span class="code-function">Array</span>(arr.length);
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = arr.length - <span class="code-number">1</span>; i >= <span class="code-number">0</span>; i--) {
    <span class="code-keyword">const</span> value = arr[i];
    <span class="code-keyword">const</span> position = count[value] - <span class="code-number">1</span>; // Get position from cumulative count
    output[position] = value;         // Place value in output array
    count[value]--;                   // Decrement count for next same element
    <span class="code-comment">// Visualize placing value in output[position] and decrementing count[value]</span>
  }

  <span class="code-comment">// 6. Copy the sorted output array back to the original array</span>
  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">0</span>; i < arr.length; i++) {
    arr[i] = output[i];
    <span class="code-comment">// Visualize copying back to original array</span>
  }

  <span class="code-keyword">return</span> arr;
}`,
         pseudocode: `CountingSort(A): // A contains non-negative integers
  n = length(A)
  if n == 0: return A

  // 1. Find the maximum element k in A
  k = maximum value in A
  // Visualize max found

  // 2. Initialize count array C of size k+1 with zeros
  C = array of size (k + 1) initialized to 0
  // Visualize count array C initialized

  // 3. Count occurrences of each element value in A
  for i = 0 to n - 1:
    C[A[i]] = C[A[i]] + 1
    // Visualize reading A[i] and incrementing C[A[i]]

  // 4. Calculate cumulative counts: C[i] now stores the number
  //    of elements less than or equal to i
  for i = 1 to k:
    C[i] = C[i] + C[i - 1]
    // Visualize reading C[i-1], C[i] and updating C[i]

  // 5. Build the output array B by placing elements in sorted order
  //    Iterate backwards through A for stability
  B = array of size n
  for i = n - 1 down to 0:
    value = A[i]
    // C[value] stores the end position (1-based) for 'value'
    position = C[value] - 1 // Convert to 0-based index
    B[position] = value     // Place value in its sorted position in B
    C[value] = C[value] - 1 // Decrement count for this value
    // Visualize reading A[i], reading C[A[i]], writing to B[position], updating C[A[i]]

  // 6. Copy sorted array B back to A (optional if returning B is okay)
  for i = 0 to n - 1:
    A[i] = B[i]
    // Visualize copying B[i] to A[i]

  return A`,
         setup: (data) => {
            // Get references to visualization areas
            const visualizationArea = document.getElementById('visualization-area');
            const extraVisualizationArea = document.getElementById('extra-visualization-area');
            visualizationArea.innerHTML = ''; // Clear main vis area
            extraVisualizationArea.innerHTML = ''; // Clear area for count/output arrays

             if (!data || data.length === 0) {
                 visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
                 return { steps: [], elements: [], countElements: [], outputElements: [] };
             }
             // Validate data: must be non-negative integers
             if (data.some(val => val < 0 || !Number.isInteger(val))) {
                 visualizationArea.innerHTML = `<p class="text-red-500 dark:text-red-400 self-center font-medium">Counting Sort requires non-negative integers.</p>`;
                 extraVisualizationArea.innerHTML = '';
                 return { steps: [], elements: [], countElements: [], outputElements: [] }; // Return empty state
             }

             const arr = [...data];
             const n = arr.length;
             const dataMaxValue = n > 0 ? Math.max(...arr) : 0; // Find max value IN DATA for count array size
             const visMaxValue = n > 0 ? Math.max(...arr, 1) : 1; // Max value for scaling bars (at least 1)

             // Create main visualization bars (Input Array)
             const elements = arr.map((value, index) => {
                 const bar = document.createElement('div');
                 bar.classList.add('vis-bar');
                 bar.style.height = `${(value / visMaxValue) * 95}%`;
                 bar.setAttribute('data-value', value);
                 bar.title = `Input[${index}]: ${value}`;
                 visualizationArea.appendChild(bar);
                 return bar;
             });

             // --- Create Count Array Visualization ---
             const countVisContainer = document.createElement('div');
             countVisContainer.id = 'count-array-vis';
             countVisContainer.className = 'count-array-vis'; // Use class for styling
             countVisContainer.setAttribute('data-label', 'Count Array');
             extraVisualizationArea.appendChild(countVisContainer);
             const countElements = [];
             for (let i = 0; i <= dataMaxValue; i++) {
                 const cell = document.createElement('div');
                 cell.className = 'count-cell'; // Use class for styling
                 cell.textContent = '0'; // Initial value
                 cell.setAttribute('data-index', i); // Store index for label/lookup
                 cell.title = `Count Index: ${i}`;
                 countVisContainer.appendChild(cell);
                 countElements.push(cell);
             }

             // --- Create Output Array Visualization ---
             const outputVisContainer = document.createElement('div');
             outputVisContainer.id = 'output-array-vis';
             outputVisContainer.className = 'output-array-vis'; // Use class for styling
             outputVisContainer.setAttribute('data-label', 'Output Array');
             extraVisualizationArea.appendChild(outputVisContainer);
             const outputElements = [];
             for (let i = 0; i < n; i++) {
                 const cell = document.createElement('div');
                 cell.className = 'output-cell empty'; // Start as empty, use class
                 cell.textContent = '?'; // Placeholder
                 cell.setAttribute('data-index', i);
                 cell.title = `Output Index: ${i}`;
                 outputVisContainer.appendChild(cell);
                 outputElements.push(cell);
             }


             // --- Generate Steps ---
             let steps = [];
             let currentArr = [...arr]; // Use a copy for generating steps
             let count = new Array(dataMaxValue + 1).fill(0);
             let output = new Array(n).fill(undefined); // Use undefined for empty slots

             steps.push({ type: 'start', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Starting Counting Sort. Max value: ${dataMaxValue}` });

             // --- Phase 1: Counting occurrences ---
             steps.push({ type: 'phase-count', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Phase 1: Counting occurrences` });
             for (let i = 0; i < n; i++) {
                const value = currentArr[i];
                 // Step: Read value from input array
                 steps.push({ type: 'read-input-count', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, message: `Reading input[${i}] = ${value}` });
                 // Step: Increment the corresponding count cell
                 count[value]++;
                 steps.push({ type: 'increment-count', arrayState: [...currentArr], countState: [...count], outputState: [...output], countIndex: value, readIndex: i, message: `Incrementing count[${value}] to ${count[value]}` });
             }

             // --- Phase 2: Calculating cumulative counts ---
             steps.push({ type: 'phase-cumulative', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Phase 2: Calculating cumulative counts (end positions)` });
             for (let i = 1; i <= dataMaxValue; i++) {
                 // Step: Read current and previous count values
                 steps.push({ type: 'read-cumulative', arrayState: [...currentArr], countState: [...count], outputState: [...output], currentIndex: i, prevIndex: i-1, message: `Reading count[${i-1}] (${count[i-1]}) and count[${i}] (${count[i]})` });
                 // Step: Update count[i] with cumulative sum
                 count[i] += count[i - 1];
                 steps.push({ type: 'write-cumulative', arrayState: [...currentArr], countState: [...count], outputState: [...output], writeIndex: i, message: `Updating count[${i}] to cumulative sum ${count[i]}` });
             }

             // --- Phase 3: Building output array (backwards for stability) ---
             steps.push({ type: 'phase-output', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Phase 3: Building output array (stable)` });
             for (let i = n - 1; i >= 0; i--) {
                 const value = currentArr[i];
                 // Step: Read value from input array (end to start)
                 steps.push({ type: 'read-input-output', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, message: `Reading input[${i}] = ${value}` });
                 // Step: Read the end position from (cumulative) count array
                 steps.push({ type: 'read-count-pos', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, countIndex: value, message: `Reading position from count[${value}] = ${count[value]}` });
                 const position = count[value] - 1; // Calculate 0-based position
                 output[position] = value; // Place value in output array
                 // Step: Show value placed in output array
                 steps.push({ type: 'write-output', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, writeIndex: position, message: `Placing ${value} into output[${position}]` });
                 count[value]--; // Decrement count for next identical element
                 // Step: Show count being decremented
                 steps.push({ type: 'decrement-count-output', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, countIndex: value, message: `Decrementing count[${value}] to ${count[value]}` });
             }

             // --- Phase 4: Copying output back to original array (visual only) ---
             steps.push({ type: 'phase-copy', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Phase 4: Copying sorted output back to input array` });
             for (let i = 0; i < n; i++) {
                // Step: Show copying from output[i] to input[i]
                steps.push({ type: 'copy-back-read', arrayState: [...currentArr], countState: [...count], outputState: [...output], index: i, message: `Reading output[${i}] (${output[i]})` });
                 currentArr[i] = output[i]; // Update the array state being tracked
                 steps.push({ type: 'copy-back-write', arrayState: [...currentArr], countState: [...count], outputState: [...output], index: i, message: `Writing ${output[i]} to input[${i}]` });
             }

             steps.push({ type: 'finish', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: 'Array is sorted!' });

             // Return all necessary elements and steps
             return { steps, elements, countElements, outputElements };
         },
         renderStep: (step, elements, animationState) => {
            // Ensure all required elements are available
             if (!step || !elements || !animationState || !animationState.countElements || !animationState.outputElements) {
                console.error("Counting Sort renderStep missing required state elements.");
                return;
             }

             const visMaxValue = step.arrayState.length > 0 ? Math.max(...step.arrayState, 1) : 1;
             const { countElements, outputElements } = animationState; // Get refs from state

             // --- Reset Highlights ---
             elements.forEach(bar => bar.className = 'vis-bar'); // Reset main bars (input array)
             countElements.forEach(cell => cell.className = 'count-cell'); // Reset count cells
             outputElements.forEach(cell => {
                 // Reset output cells, preserving empty state visual if applicable
                 const isEmpty = cell.textContent === '?' || cell.classList.contains('empty');
                 cell.className = `output-cell ${isEmpty ? 'empty' : ''}`;
             });

             // --- Update Array States ---
             // Update main bars (Input Array) based on arrayState for the current step
             elements.forEach((bar, index) => {
                 const value = step.arrayState[index];
                 bar.style.height = `${(value / visMaxValue) * 95}%`;
                 bar.setAttribute('data-value', value);
                 bar.title = `Input[${index}]: ${value}`;
                 // Apply final sorted style during copy phase or at the end
                 if (step.type === 'finish' || (step.type === 'copy-back-write' && index <= step.index)) {
                     bar.classList.add('sorted-final');
                 }
             });

             // Update count array visualization based on countState
             countElements.forEach((cell, index) => {
                 if (step.countState && index < step.countState.length) {
                     cell.textContent = step.countState[index];
                 } else {
                     // Should not happen if setup is correct, but hide extra cells just in case
                     cell.style.display = 'none';
                 }
             });

             // Update output array visualization based on outputState
             outputElements.forEach((cell, index) => {
                 if (step.outputState && index < step.outputState.length && step.outputState[index] !== undefined) {
                     cell.textContent = step.outputState[index];
                     cell.classList.remove('empty'); // Mark as not empty
                 } else {
                     cell.textContent = '?'; // Reset to placeholder if undefined
                     cell.classList.add('empty'); // Mark as empty
                 }
             });


             // --- Apply Step-Specific Highlights ---
             switch (step.type) {
                 // Phase 1: Counting
                 case 'read-input-count':
                     if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading'); // Highlight input bar being read
                     if (countElements[step.value]) countElements[step.value].classList.add('highlight-read'); // Highlight count cell being read before increment
                     break;
                 case 'increment-count':
                     if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading'); // Keep input highlighted
                     if (countElements[step.countIndex]) countElements[step.countIndex].classList.add('highlight-write'); // Highlight count cell being written to
                     break;

                 // Phase 2: Cumulative Count
                 case 'read-cumulative':
                     if (countElements[step.currentIndex]) countElements[step.currentIndex].classList.add('highlight-read');
                     if (countElements[step.prevIndex]) countElements[step.prevIndex].classList.add('highlight-read');
                     break;
                 case 'write-cumulative':
                     if (countElements[step.writeIndex]) countElements[step.writeIndex].classList.add('highlight-write');
                     break;

                 // Phase 3: Build Output
                 case 'read-input-output':
                     if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading');
                     break;
                 case 'read-count-pos':
                     if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading'); // Keep input highlighted
                     if (countElements[step.countIndex]) countElements[step.countIndex].classList.add('highlight-read'); // Highlight count cell providing position
                     break;
                 case 'write-output':
                     if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading'); // Keep input highlighted
                     if (countElements[step.value]) countElements[step.value].classList.add('highlight-read'); // Keep count highlighted
                     if (outputElements[step.writeIndex]) outputElements[step.writeIndex].classList.add('highlight-write'); // Highlight output cell being written
                     break;
                 case 'decrement-count-output':
                     if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading'); // Keep input highlighted
                     if (outputElements[step.writeIndex]) outputElements[step.writeIndex].classList.add('highlight-write'); // Keep output highlighted from previous step
                     if (countElements[step.countIndex]) countElements[step.countIndex].classList.add('highlight-write'); // Highlight count cell being decremented
                     break;

                 // Phase 4: Copy Back
                 case 'copy-back-read':
                     if (outputElements[step.index]) outputElements[step.index].classList.add('highlight-read'); // Highlight output cell being read
                     break;
                 case 'copy-back-write':
                     if (outputElements[step.index]) outputElements[step.index].classList.add('highlight-read'); // Keep output read highlighted
                     if (elements[step.index]) elements[step.index].classList.add('writing'); // Highlight input bar being written to
                     break;

                 // Other Phases/States
                 case 'start':
                 case 'phase-count':
                 case 'phase-cumulative':
                 case 'phase-output':
                 case 'phase-copy':
                      // No specific highlights, just rely on messages
                     break;
                 case 'finish':
                     elements.forEach(bar => bar.classList.add('sorted-final')); // Ensure all input bars are marked sorted
                     break;
             }

             // Update status message (handled in main.js)
         }
     },

    // --- Placeholders for other algorithms ---
    // --- Add full definitions for these later ---
    'tree-traversals': { name: 'Tree Traversals (In/Pre/Post)', code: '// TODO: Tree Traversal Code', pseudocode: '// TODO: Tree Traversal Pseudocode', setup: null, renderStep: null },
    'bst': { name: 'Binary Search Tree Ops', code: '// TODO: BST Operations Code', pseudocode: '// TODO: BST Operations Pseudocode', setup: null, renderStep: null },
    'avl': { name: 'AVL Tree Rotations', code: '// TODO: AVL Tree Rotations Code', pseudocode: '// TODO: AVL Tree Rotations Pseudocode', setup: null, renderStep: null },
    'heap-ops': { name: 'Heap Operations (Insert/Extract)', code: '// TODO: Heap Operations Code', pseudocode: '// TODO: Heap Operations Pseudocode', setup: null, renderStep: null },
    'tree-bfs-dfs': { name: 'BFS & DFS (Trees)', code: '// TODO: Tree BFS/DFS Code', pseudocode: '// TODO: Tree BFS/DFS Pseudocode', setup: null, renderStep: null },
    'graph-bfs': { name: 'BFS (Graphs)', code: '// TODO: Graph BFS Code', pseudocode: '// TODO: Graph BFS Pseudocode', setup: null, renderStep: null },
    'graph-dfs': { name: 'DFS (Graphs)', code: '// TODO: Graph DFS Code', pseudocode: '// TODO: Graph DFS Pseudocode', setup: null, renderStep: null },
    'dijkstra': { name: 'Dijkstra’s Algorithm', code: '// TODO: Dijkstra Code', pseudocode: '// TODO: Dijkstra Pseudocode', setup: null, renderStep: null },
    'bellman-ford': { name: 'Bellman-Ford', code: '// TODO: Bellman-Ford Code', pseudocode: '// TODO: Bellman-Ford Pseudocode', setup: null, renderStep: null },
    'floyd-warshall': { name: 'Floyd-Warshall', code: '// TODO: Floyd-Warshall Code', pseudocode: '// TODO: Floyd-Warshall Pseudocode', setup: null, renderStep: null },
    'kruskal': { name: 'Kruskal’s MST', code: '// TODO: Kruskal Code', pseudocode: '// TODO: Kruskal Pseudocode', setup: null, renderStep: null },
    'prim': { name: 'Prim’s MST', code: '// TODO: Prim Code', pseudocode: '// TODO: Prim Pseudocode', setup: null, renderStep: null },
    'topo-sort': { name: 'Topological Sorting', code: '// TODO: Topological Sort Code', pseudocode: '// TODO: Topological Sort Pseudocode', setup: null, renderStep: null },
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