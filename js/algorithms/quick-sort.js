// js/algorithms/quick-sort.js

const quickSortConfig = {
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
       let sortedStatus = new Array(arr.length).fill(false);

       function partition(low, high) {
           let pivotValue = arr[high];
           let i = low - 1;

           steps.push({ type: 'partition-start', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, message: `Partitioning [${low}, ${high}]. Pivot: ${pivotValue} (index ${high})` });

           for (let j = low; j < high; j++) {
               steps.push({ type: 'compare-partition', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, j: j, message: `Comparing element ${arr[j]} (j=${j}) with pivot ${pivotValue}` });

               if (arr[j] < pivotValue) {
                   i++;
                    steps.push({ type: 'swap-partition', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, j: j, swapIndices: [i, j], message: `Element ${arr[j]} < pivot ${pivotValue}. Swapping A[${i}] (${arr[i]}) and A[${j}] (${arr[j]})` });
                   [arr[i], arr[j]] = [arr[j], arr[i]];
                    steps.push({ type: 'after-swap-partition', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, j: j, swapIndices: [i, j], message: `Swap complete. Smaller element boundary now at ${i}.` });
               }
           }

           const pivotFinalIndex = i + 1;
            steps.push({ type: 'swap-pivot-final', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotIndex: high, i: i, swapIndices: [pivotFinalIndex, high], message: `Swapping pivot ${arr[high]} with element at i+1 (${pivotFinalIndex >= 0 && pivotFinalIndex < arr.length ? arr[pivotFinalIndex] : 'out of bounds'})` });
            // Boundary check for swap
            if (pivotFinalIndex >= 0 && pivotFinalIndex < arr.length && high >= 0 && high < arr.length) {
               [arr[pivotFinalIndex], arr[high]] = [arr[high], arr[pivotFinalIndex]];
            } else {
               console.error("Pivot swap index out of bounds:", { pivotFinalIndex, high, arrLength: arr.length});
                // Potentially add a step indicating an error or skip?
            }


           // Mark the pivot as sorted only if index is valid
           if (pivotFinalIndex >= 0 && pivotFinalIndex < arr.length) {
               sortedStatus[pivotFinalIndex] = true;
               steps.push({ type: 'partition-done', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotFinalIndex: pivotFinalIndex, message: `Pivot ${arr[pivotFinalIndex]} is in final position ${pivotFinalIndex}. Partition complete for [${low}, ${high}].` });
           } else {
                steps.push({ type: 'partition-error', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, pivotFinalIndex: pivotFinalIndex, message: `Error: Pivot final index ${pivotFinalIndex} invalid after partition.` });
           }


           return pivotFinalIndex;
       }

       function quickSortRecursive(low, high) {
           if (low < high) {
                steps.push({ type: 'recursive-call-start', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, message: `QuickSort called for [${low}, ${high}]` });

               let pi = partition(low, high);

                // Ensure pi is valid before making recursive calls
                if (pi >= 0 && pi < arr.length) {
                   steps.push({ type: 'recursive-call-left', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: pi - 1, pivotFinalIndex: pi, message: `Recursive call for left subarray [${low}, ${pi - 1}]` });
                   quickSortRecursive(low, pi - 1);

                   steps.push({ type: 'recursive-call-right', arrayState: [...arr], sortedStatus: [...sortedStatus], low: pi + 1, high: high, pivotFinalIndex: pi, message: `Recursive call for right subarray [${pi + 1}, ${high}]` });
                   quickSortRecursive(pi + 1, high);
                } else {
                    console.error("Invalid partition index, stopping recursion branch:", pi);
                }

           } else {
                if (low >= 0 && low < arr.length && low === high) {
                   sortedStatus[low] = true;
                    steps.push({ type: 'base-case', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, message: `Base case: Element at index ${low} is sorted.` });
                } else if (low > high) {
                     steps.push({ type: 'base-case', arrayState: [...arr], sortedStatus: [...sortedStatus], low: low, high: high, message: `Base case: Range [${low}, ${high}] is empty/sorted.` });
                } else {
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
           bar.className = 'vis-bar';
           bar.style.opacity = '1';
           bar.style.transform = 'translateY(0)';
           bar.style.borderColor = 'transparent';
            while(bar.firstChild) bar.removeChild(bar.firstChild);

           if (step.sortedStatus && step.sortedStatus[index]) {
               bar.classList.add('sorted-final');
           }

           bar.style.height = `${(step.arrayState[index] / maxValue) * 95}%`;
            bar.setAttribute('data-value', step.arrayState[index]);
           bar.title = `Value: ${step.arrayState[index]}`;

            if (step.low !== undefined && step.high !== undefined && step.type !== 'finish' && !bar.classList.contains('sorted-final')) {
               if (index < step.low || index > step.high) {
                   bar.classList.add('outside-partition');
                   bar.style.opacity = '0.4';
               } else {
                   bar.classList.add('partition-range');
               }
           }
        });

        switch (step.type) {
            case 'partition-start':
               if (elements[step.pivotIndex]) elements[step.pivotIndex].classList.add('pivot');
               break;
            case 'compare-partition':
                if (elements[step.pivotIndex]) elements[step.pivotIndex].classList.add('pivot');
                if (step.i >= step.low && elements[step.i]) elements[step.i].classList.add('partition-i');
                if (elements[step.j]) {
                    elements[step.j].classList.add('partition-j');
                    elements[step.j].classList.add('comparing');
                }
                break;
            case 'swap-partition':
            case 'after-swap-partition':
                if (elements[step.pivotIndex]) elements[step.pivotIndex].classList.add('pivot');
                if (step.i >= step.low && elements[step.i]) elements[step.i].classList.add('partition-i');
                if (elements[step.j]) elements[step.j].classList.add('partition-j');
                if (elements[step.swapIndices[0]]) elements[step.swapIndices[0]].classList.add('swapping');
                if (elements[step.swapIndices[1]]) elements[step.swapIndices[1]].classList.add('swapping');
                break;
            case 'swap-pivot-final':
                if (elements[step.swapIndices[0]]) elements[step.swapIndices[0]].classList.add('swapping');
                if (elements[step.swapIndices[1]]) {
                    elements[step.swapIndices[1]].classList.add('swapping');
                    elements[step.swapIndices[1]].classList.add('pivot');
                }
                 if (step.i >= step.low && elements[step.i]) elements[step.i].classList.add('partition-i');
                break;
            case 'partition-done':
                if (elements[step.pivotFinalIndex]) {
                    elements[step.pivotFinalIndex].classList.remove('pivot', 'swapping', 'partition-i', 'partition-j');
                    elements[step.pivotFinalIndex].classList.add('sorted-final');
                }
                break;
           case 'recursive-call-start':
            case 'recursive-call-left':
            case 'recursive-call-right':
            case 'base-case':
            case 'final-sort-mark':
            case 'partition-error': // Added case
                break;
            case 'start':
                break;
            case 'finish':
                elements.forEach(bar => { bar.className = 'vis-bar sorted-final'; bar.style.opacity = '1'; });
                break;
        }
    }
};