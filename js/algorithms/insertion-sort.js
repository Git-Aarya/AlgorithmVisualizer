// js/algorithms/insertion-sort.js

const insertionSortConfig = {
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
            let key = arr[i];
            let j = i - 1;

            steps.push({ type: 'select-key', arrayState: [...arr], keyIndex: i, keyVal: key, sortedUntil: i - 1, message: `Selecting element ${key} at index ${i} to insert.` });

            let shiftOccurred = false;
            let tempArrState = [...arr];

            if (j >= 0) {
               steps.push({ type: 'compare-shift', arrayState: [...tempArrState], keyIndex: i, keyVal: key, compareIndex: j, sortedUntil: i - 1, shifting: false, message: `Comparing key ${key} with ${tempArrState[j]} at index ${j}.` });
            }


            while (j >= 0 && tempArrState[j] > key) {
                shiftOccurred = true;
                steps.push({ type: 'compare-shift', arrayState: [...tempArrState], keyIndex: i, keyVal: key, compareIndex: j, sortedUntil: i - 1, shifting: true, message: `${tempArrState[j]} > ${key}. Shifting ${tempArrState[j]} to index ${j + 1}.` });

                tempArrState[j + 1] = tempArrState[j];

                steps.push({ type: 'after-shift', arrayState: [...tempArrState], keyIndex: i, keyVal: key, shiftedFrom: j, shiftedTo: j + 1, sortedUntil: i - 1, message: `Shifted element from ${j} to ${j + 1}.` });

                j--;

               if (j >= 0) {
                    steps.push({ type: 'compare-shift', arrayState: [...tempArrState], keyIndex: i, keyVal: key, compareIndex: j, sortedUntil: i - 1, shifting: false, message: `Comparing key ${key} with ${tempArrState[j]} at index ${j}.` });
                }
            }

            const insertPos = j + 1;

            if (insertPos !== i || shiftOccurred) {
                tempArrState[insertPos] = key;
                 steps.push({ type: 'insert', arrayState: [...tempArrState], keyIndex: i, keyVal: key, insertIndex: insertPos, sortedUntil: i, message: `Inserting key ${key} at index ${insertPos}.` });
                 arr = [...tempArrState];
            } else {
                steps.push({ type: 'no-insert-needed', arrayState: [...arr], keyIndex: i, sortedUntil: i, message: `Element ${key} already in sorted position.` });
            }

             steps.push({ type: 'mark-sorted', arrayState: [...arr], sortedUntil: i, message: `Elements up to index ${i} are now sorted.` });
        }

        steps.push({ type: 'finish', arrayState: [...arr], message: 'Array is sorted!' });
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

            const value = step.arrayState[index];
            bar.style.height = `${(value / maxValue) * 95}%`;
            bar.setAttribute('data-value', value);
            bar.title = `Value: ${value}`;

            if (step.sortedUntil !== undefined && index <= step.sortedUntil && step.type !== 'finish') {
               if (step.type !== 'select-key' || index !== step.keyIndex) {
                    bar.classList.add('sorted-final');
               }
            }
        });

        switch (step.type) {
            case 'select-key':
                if (elements[step.keyIndex]) {
                    elements[step.keyIndex].classList.add('current-insertion');
                   elements[step.keyIndex].classList.remove('sorted-final');
                }
                break;
            case 'compare-shift':
                if (elements[step.keyIndex]) elements[step.keyIndex].classList.add('current-insertion');
                if (elements[step.compareIndex]) elements[step.compareIndex].classList.add('comparing');
                if (step.shifting && elements[step.compareIndex]) {
                    elements[step.compareIndex].classList.add('shifting');
                }
                break;
            case 'after-shift':
                 if (elements[step.keyIndex]) elements[step.keyIndex].classList.add('current-insertion');
                 if (elements[step.shiftedTo]) {
                     elements[step.shiftedTo].classList.add('shifting');
                 }
                 break;
            case 'insert':
                 if (elements[step.insertIndex]) {
                     elements[step.insertIndex].classList.add('placing-merge');
                     elements[step.insertIndex].classList.add('sorted-final');
                     elements[step.insertIndex].classList.remove('current-insertion');
                 }
                 break;
            case 'no-insert-needed':
                 if (elements[step.keyIndex]) {
                    elements[step.keyIndex].classList.add('sorted-final');
                     elements[step.keyIndex].classList.remove('current-insertion');
                 }
                break;
            case 'mark-sorted':
                 if (step.sortedUntil >= 0 && elements[step.sortedUntil]) {
                      elements[step.sortedUntil].classList.add('sorted-final');
                      elements[step.sortedUntil].classList.remove('current-insertion', 'comparing', 'shifting', 'placing-merge');
                 }
                break;
            case 'start':
                 if (elements[0]) elements[0].classList.add('sorted-final');
                break;
            case 'finish':
                elements.forEach(bar => bar.classList.add('sorted-final'));
                break;
        }
    }
};