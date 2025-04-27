// js/algorithms/merge-sort.js

const mergeSortConfig = {
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
       let arr = [...data];
       let sortedStatus = new Array(arr.length).fill(false);

       function merge(l, m, r) {
           let n1 = m - l + 1;
           let n2 = r - m;
           let L = new Array(n1);
           let R = new Array(n2);

           steps.push({ type: 'merge-start', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, message: `Merging subarrays [${l}..${m}] and [${m+1}..${r}]` });

           for (let i = 0; i < n1; i++) L[i] = arr[l + i];
           for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

           steps.push({ type: 'merge-copy', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, leftArr: [...L], rightArr: [...R], message: `Copied subarrays to temporary storage.` });

           let i = 0, j = 0, k = l;
           let tempArrStateDuringMerge = [...arr];

           while (i < n1 && j < n2) {
                steps.push({ type: 'merge-compare', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, leftIndexInL: i, rightIndexInR: j, k: k, leftVal: L[i], rightVal: R[j], message: `Comparing Left (${L[i]}) and Right (${R[j]})` });

               if (L[i] <= R[j]) {
                   tempArrStateDuringMerge[k] = L[i];
                    steps.push({ type: 'merge-place', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, sourceVal: L[i], targetIndex: k, fromLeft: true, message: `Placing ${L[i]} from left subarray into index ${k}` });
                   i++;
               } else {
                   tempArrStateDuringMerge[k] = R[j];
                    steps.push({ type: 'merge-place', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, sourceVal: R[j], targetIndex: k, fromLeft: false, message: `Placing ${R[j]} from right subarray into index ${k}` });
                   j++;
               }
               k++;
           }

           while (i < n1) {
               tempArrStateDuringMerge[k] = L[i];
                steps.push({ type: 'merge-place-remaining', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, sourceVal: L[i], targetIndex: k, fromLeft: true, message: `Placing remaining ${L[i]} from left into index ${k}` });
               i++; k++;
           }
           while (j < n2) {
               tempArrStateDuringMerge[k] = R[j];
                steps.push({ type: 'merge-place-remaining', arrayState: [...tempArrStateDuringMerge], sortedStatus: [...sortedStatus], low: l, mid: m, high: r, sourceVal: R[j], targetIndex: k, fromLeft: false, message: `Placing remaining ${R[j]} from right into index ${k}` });
               j++; k++;
           }

            arr = [...tempArrStateDuringMerge];

            if (l === 0 && r === arr.length - 1) {
                for(let idx = l; idx <= r; idx++) sortedStatus[idx] = true;
            }
            steps.push({ type: 'merge-done', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, high: r, message: `Merge complete for range [${l}..${r}]` });
       }

       function mergeSortRecursive(l, r) {
           if (l >= r) {
                steps.push({ type: 'base-case', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, high: r, message: `Base case reached for range [${l}..${r}].` });
               return;
           }
           const m = l + Math.floor((r - l) / 2);

            steps.push({ type: 'recursive-call-left', arrayState: [...arr], sortedStatus: [...sortedStatus], low: l, high: m, message: `Recursive call for left subarray [${l}..${m}]` });
           mergeSortRecursive(l, m);

            steps.push({ type: 'recursive-call-right', arrayState: [...arr], sortedStatus: [...sortedStatus], low: m + 1, high: r, message: `Recursive call for right subarray [${m+1}..${r}]` });
           mergeSortRecursive(m + 1, r);

           merge(l, m, r);
       }

       steps.push({ type: 'start', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Starting Merge Sort' });
        if (arr.length > 0) {
            mergeSortRecursive(0, arr.length - 1);
        } else {
            steps.push({ type: 'finish', arrayState: [...arr], sortedStatus: [...sortedStatus], message: 'Array is empty, already sorted!' });
        }

       sortedStatus.fill(true);
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

            if (step.low !== undefined && step.high !== undefined && step.type !== 'finish' && step.type !== 'start' && !bar.classList.contains('sorted-final')) {
                if (index < step.low || index > step.high) {
                    bar.classList.add('outside-merge-range');
                    bar.style.opacity = '0.4';
                } else {
                    bar.classList.add('merge-range');
                }
            }
        });

        switch (step.type) {
            case 'merge-start':
            case 'merge-copy':
            case 'merge-done':
            case 'recursive-call-left':
            case 'recursive-call-right':
            case 'base-case':
                break;
            case 'merge-compare':
                // We don't have direct access to the original indices easily here without more complex state tracking.
                // Rely on range highlight and message.
                break;
            case 'merge-place':
            case 'merge-place-remaining':
                if (elements[step.targetIndex]) {
                    elements[step.targetIndex].classList.add('placing-merge');
                }
                break;
            case 'start':
                break;
            case 'finish':
                elements.forEach(bar => { bar.className = 'vis-bar sorted-final'; bar.style.opacity = '1'; });
                break;
        }
    }
};