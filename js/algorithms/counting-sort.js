// js/algorithms/counting-sort.js

const countingSortConfig = {
    name: 'Counting Sort',
    requiresPositiveInts: true,
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
       const visualizationArea = document.getElementById('visualization-area');
       const extraVisualizationArea = document.getElementById('extra-visualization-area');
       visualizationArea.innerHTML = '';
       extraVisualizationArea.innerHTML = '';

        if (!data || data.length === 0) {
            visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
            return { steps: [], elements: [], countElements: [], outputElements: [] };
        }
        if (data.some(val => val < 0 || !Number.isInteger(val))) {
            visualizationArea.innerHTML = `<p class="text-red-500 dark:text-red-400 self-center font-medium">Counting Sort requires non-negative integers.</p>`;
            extraVisualizationArea.innerHTML = '';
            return { steps: [], elements: [], countElements: [], outputElements: [] };
        }

        const arr = [...data];
        const n = arr.length;
        const dataMaxValue = n > 0 ? Math.max(...arr) : 0;
        const visMaxValue = n > 0 ? Math.max(...arr, 1) : 1;

        const elements = arr.map((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('vis-bar');
            bar.style.height = `${(value / visMaxValue) * 95}%`;
            bar.setAttribute('data-value', value);
            bar.title = `Input[${index}]: ${value}`;
            visualizationArea.appendChild(bar);
            return bar;
        });

        const countVisContainer = document.createElement('div');
        countVisContainer.id = 'count-array-vis';
        countVisContainer.className = 'count-array-vis';
        countVisContainer.setAttribute('data-label', 'Count Array');
        extraVisualizationArea.appendChild(countVisContainer);
        const countElements = [];
        for (let i = 0; i <= dataMaxValue; i++) {
            const cell = document.createElement('div');
            cell.className = 'count-cell';
            cell.textContent = '0';
            cell.setAttribute('data-index', i);
            cell.title = `Count Index: ${i}`;
            countVisContainer.appendChild(cell);
            countElements.push(cell);
        }

        const outputVisContainer = document.createElement('div');
        outputVisContainer.id = 'output-array-vis';
        outputVisContainer.className = 'output-array-vis';
        outputVisContainer.setAttribute('data-label', 'Output Array');
        extraVisualizationArea.appendChild(outputVisContainer);
        const outputElements = [];
        for (let i = 0; i < n; i++) {
            const cell = document.createElement('div');
            cell.className = 'output-cell empty';
            cell.textContent = '?';
            cell.setAttribute('data-index', i);
            cell.title = `Output Index: ${i}`;
            outputVisContainer.appendChild(cell);
            outputElements.push(cell);
        }

        let steps = [];
        let currentArr = [...arr];
        let count = new Array(dataMaxValue + 1).fill(0);
        let output = new Array(n).fill(undefined);

        steps.push({ type: 'start', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Starting Counting Sort. Max value: ${dataMaxValue}` });

        steps.push({ type: 'phase-count', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Phase 1: Counting occurrences` });
        for (let i = 0; i < n; i++) {
           const value = currentArr[i];
            steps.push({ type: 'read-input-count', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, message: `Reading input[${i}] = ${value}` });
            count[value]++;
            steps.push({ type: 'increment-count', arrayState: [...currentArr], countState: [...count], outputState: [...output], countIndex: value, readIndex: i, message: `Incrementing count[${value}] to ${count[value]}` });
        }

        steps.push({ type: 'phase-cumulative', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Phase 2: Calculating cumulative counts (end positions)` });
        for (let i = 1; i <= dataMaxValue; i++) {
            steps.push({ type: 'read-cumulative', arrayState: [...currentArr], countState: [...count], outputState: [...output], currentIndex: i, prevIndex: i-1, message: `Reading count[${i-1}] (${count[i-1]}) and count[${i}] (${count[i]})` });
            count[i] += count[i - 1];
            steps.push({ type: 'write-cumulative', arrayState: [...currentArr], countState: [...count], outputState: [...output], writeIndex: i, message: `Updating count[${i}] to cumulative sum ${count[i]}` });
        }

        steps.push({ type: 'phase-output', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Phase 3: Building output array (stable)` });
        for (let i = n - 1; i >= 0; i--) {
            const value = currentArr[i];
            steps.push({ type: 'read-input-output', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, message: `Reading input[${i}] = ${value}` });
            steps.push({ type: 'read-count-pos', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, countIndex: value, message: `Reading position from count[${value}] = ${count[value]}` });
            const position = count[value] - 1;
            output[position] = value;
            steps.push({ type: 'write-output', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, writeIndex: position, message: `Placing ${value} into output[${position}]` });
            count[value]--;
            steps.push({ type: 'decrement-count-output', arrayState: [...currentArr], countState: [...count], outputState: [...output], readIndex: i, value: value, countIndex: value, message: `Decrementing count[${value}] to ${count[value]}` });
        }

        steps.push({ type: 'phase-copy', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: `Phase 4: Copying sorted output back to input array` });
        for (let i = 0; i < n; i++) {
           steps.push({ type: 'copy-back-read', arrayState: [...currentArr], countState: [...count], outputState: [...output], index: i, message: `Reading output[${i}] (${output[i]})` });
            currentArr[i] = output[i];
            steps.push({ type: 'copy-back-write', arrayState: [...currentArr], countState: [...count], outputState: [...output], index: i, message: `Writing ${output[i]} to input[${i}]` });
        }

        steps.push({ type: 'finish', arrayState: [...currentArr], countState: [...count], outputState: [...output], message: 'Array is sorted!' });

        return { steps, elements, countElements, outputElements };
    },
    renderStep: (step, elements, animationState) => {
        if (!step || !elements || !animationState || !animationState.countElements || !animationState.outputElements) {
           console.error("Counting Sort renderStep missing required state elements.");
           return;
        }

        const visMaxValue = step.arrayState.length > 0 ? Math.max(...step.arrayState, 1) : 1;
        const { countElements, outputElements } = animationState;

        elements.forEach(bar => bar.className = 'vis-bar');
        countElements.forEach(cell => cell.className = 'count-cell');
        outputElements.forEach(cell => {
            const isEmpty = cell.textContent === '?' || cell.classList.contains('empty');
            cell.className = `output-cell ${isEmpty ? 'empty' : ''}`;
        });

        elements.forEach((bar, index) => {
            const value = step.arrayState[index];
            bar.style.height = `${(value / visMaxValue) * 95}%`;
            bar.setAttribute('data-value', value);
            bar.title = `Input[${index}]: ${value}`;
            if (step.type === 'finish' || (step.type === 'copy-back-write' && index <= step.index)) {
                bar.classList.add('sorted-final');
            }
        });

        countElements.forEach((cell, index) => {
            if (step.countState && index < step.countState.length) {
                cell.textContent = step.countState[index];
            } else {
                cell.style.display = 'none';
            }
        });

        outputElements.forEach((cell, index) => {
            if (step.outputState && index < step.outputState.length && step.outputState[index] !== undefined) {
                cell.textContent = step.outputState[index];
                cell.classList.remove('empty');
            } else {
                cell.textContent = '?';
                cell.classList.add('empty');
            }
        });

        switch (step.type) {
            case 'read-input-count':
                if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading');
                if (countElements[step.value]) countElements[step.value].classList.add('highlight-read');
                break;
            case 'increment-count':
                if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading');
                if (countElements[step.countIndex]) countElements[step.countIndex].classList.add('highlight-write');
                break;
            case 'read-cumulative':
                if (countElements[step.currentIndex]) countElements[step.currentIndex].classList.add('highlight-read');
                if (countElements[step.prevIndex]) countElements[step.prevIndex].classList.add('highlight-read');
                break;
            case 'write-cumulative':
                if (countElements[step.writeIndex]) countElements[step.writeIndex].classList.add('highlight-write');
                break;
            case 'read-input-output':
                if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading');
                break;
            case 'read-count-pos':
                if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading');
                if (countElements[step.countIndex]) countElements[step.countIndex].classList.add('highlight-read');
                break;
            case 'write-output':
                if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading');
                if (countElements[step.value]) countElements[step.value].classList.add('highlight-read');
                if (outputElements[step.writeIndex]) outputElements[step.writeIndex].classList.add('highlight-write');
                break;
            case 'decrement-count-output':
                if (elements[step.readIndex]) elements[step.readIndex].classList.add('reading');
                if (outputElements[step.writeIndex]) outputElements[step.writeIndex].classList.add('highlight-write');
                if (countElements[step.countIndex]) countElements[step.countIndex].classList.add('highlight-write');
                break;
            case 'copy-back-read':
                if (outputElements[step.index]) outputElements[step.index].classList.add('highlight-read');
                break;
            case 'copy-back-write':
                if (outputElements[step.index]) outputElements[step.index].classList.add('highlight-read');
                if (elements[step.index]) elements[step.index].classList.add('writing');
                break;
            case 'start':
            case 'phase-count':
            case 'phase-cumulative':
            case 'phase-output':
            case 'phase-copy':
                 break;
            case 'finish':
                elements.forEach(bar => bar.classList.add('sorted-final'));
                break;
        }
    }
};