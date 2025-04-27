// js/algorithms/heap-sort.js

const heapSortConfig = {
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
       let sortedStatus = new Array(n).fill(false);

       function heapify(heapSize, i) {
           let largest = i;
           let l = 2 * i + 1;
           let r = 2 * i + 2;
           let compareIndices = [i];
           if (l < heapSize) compareIndices.push(l);
           if (r < heapSize) compareIndices.push(r);

            steps.push({ type: 'heapify-compare', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, compareIndices: [...compareIndices], currentLargest: i, nodeIndex: i, message: `Heapify(${i}): Comparing node ${i} (${arr[i]}) with children.` });

           if (l < heapSize && arr[l] > arr[largest]) {
               largest = l;
           }
           if (r < heapSize && arr[r] > arr[largest]) {
               largest = r;
           }

            steps.push({ type: 'heapify-largest', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, compareIndices: [...compareIndices], largest: largest, nodeIndex: i, message: `Heapify(${i}): Largest is at index ${largest} (${arr[largest]})` });

           if (largest !== i) {
               steps.push({ type: 'heapify-swap', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, swapIndices: [i, largest], nodeIndex: i, message: `Heapify(${i}): Swapping node ${i} (${arr[i]}) with largest ${largest} (${arr[largest]})` });
               [arr[i], arr[largest]] = [arr[largest], arr[i]];
                steps.push({ type: 'after-heapify-swap', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, swapIndices: [i, largest], nodeIndex: i, message: `Heapify(${i}): Swap complete. Recursively heapify subtree at ${largest}.` });
               heapify(heapSize, largest);
           } else {
                steps.push({ type: 'heapify-done', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: heapSize, nodeIndex: i, message: `Heapify(${i}): Node ${i} (${arr[i]}) is largest. Heap property satisfied.` });
           }
       }

       steps.push({ type: 'start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Starting Heap Sort' });

        if (n <= 1) {
            if (n === 1) sortedStatus[0] = true;
            steps.push({ type: 'finish', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Array is already sorted (size <= 1)!' });
            return { steps, elements };
        }

       steps.push({ type: 'build-heap-start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Phase 1: Building Max Heap...' });
       for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            steps.push({ type: 'heapify-call', phase: 'build', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: n, nodeIndex: i, message: `Build Heap: Calling Heapify on node ${i}` });
           heapify(n, i);
       }
       steps.push({ type: 'build-heap-done', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Max Heap built.' });

        steps.push({ type: 'extract-phase-start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Phase 2: Extracting elements...' });
       for (let i = n - 1; i > 0; i--) {
            steps.push({ type: 'extract-swap', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: i + 1, swapIndices: [0, i], message: `Extract Max: Swapping root (${arr[0]}) with end of heap (${arr[i]})` });
           [arr[0], arr[i]] = [arr[i], arr[0]];
           sortedStatus[i] = true;
            steps.push({ type: 'after-extract-swap', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: i, sortedIndex: i, message: `Element ${arr[i]} moved to sorted position ${i}. Heap size reduced to ${i}.` });

            steps.push({ type: 'heapify-call', phase: 'extract', arrayState: [...arr], sortedStatus: [...sortedStatus], heapSize: i, nodeIndex: 0, message: `Heapify reduced heap (size ${i}) from root 0` });
           heapify(i, 0);
       }

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
           bar.className = 'vis-bar';
           bar.style.opacity = '1';
           bar.style.transform = 'translateY(0)';
           bar.style.borderColor = 'transparent';

           if (step.sortedStatus && step.sortedStatus[index]) {
               bar.classList.add('sorted-final');
           }

           bar.style.height = `${(step.arrayState[index] / maxValue) * 95}%`;
            bar.setAttribute('data-value', step.arrayState[index]);
           bar.title = `Value: ${step.arrayState[index]}`;

            if (step.heapSize !== undefined && step.type !== 'finish' && !bar.classList.contains('sorted-final')) {
               if (index >= step.heapSize) {
                   bar.classList.add('outside-heap-range');
                   bar.style.opacity = '0.4';
               } else {
                   bar.classList.add('heap-range');
               }
            }
       });

        function applyStyleIfNotSorted(index, styleClass) {
           if (elements[index] && !elements[index].classList.contains('sorted-final')) {
               elements[index].classList.add(styleClass);
           } else if (elements[index] && (step.type === 'extract-swap' || step.type === 'after-extract-swap') && step.swapIndices?.includes(index)) {
                elements[index].classList.add(styleClass);
           }
        }

       switch (step.type) {
           case 'heapify-call':
           case 'heapify-done':
               applyStyleIfNotSorted(step.nodeIndex, 'heapify-node');
               break;
           case 'heapify-compare':
               step.compareIndices.forEach(idx => applyStyleIfNotSorted(idx, 'heapify-node'));
               break;
           case 'heapify-largest':
               step.compareIndices.forEach(idx => applyStyleIfNotSorted(idx, 'heapify-node'));
               applyStyleIfNotSorted(step.largest, 'heapify-largest');
               break;
           case 'heapify-swap':
           case 'after-heapify-swap':
               applyStyleIfNotSorted(step.swapIndices[0], 'swapping');
               applyStyleIfNotSorted(step.swapIndices[1], 'swapping');
                applyStyleIfNotSorted(step.nodeIndex, 'heapify-node');
               break;
           case 'extract-swap':
           case 'after-extract-swap':
               applyStyleIfNotSorted(step.swapIndices[0], 'swapping');
               applyStyleIfNotSorted(step.swapIndices[1], 'swapping');
               break;
           case 'mark-sorted':
           case 'build-heap-start':
           case 'build-heap-done':
           case 'extract-phase-start':
            case 'start':
               break;
           case 'finish':
               elements.forEach(bar => { bar.className = 'vis-bar sorted-final'; bar.style.opacity = '1'; });
               break;
       }
    }
};