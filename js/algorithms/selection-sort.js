// js/algorithms/selection-sort.js

const selectionSortConfig = {
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
            steps.push({ type: 'find-min-start', arrayState: [...arr], outerIndex: i, minIndex: minIndex, message: `Finding minimum for index ${i} (currently ${arr[minIndex]})` });

            for (let j = i + 1; j < n; j++) {
                steps.push({ type: 'compare-inner', arrayState: [...arr], outerIndex: i, minIndex: minIndex, compareIndex: j, message: `Comparing index ${j} (${arr[j]}) with current min (${arr[minIndex]})` });

                if (arr[j] < arr[minIndex]) {
                    const oldMinIndex = minIndex;
                    minIndex = j;
                    steps.push({ type: 'new-min', arrayState: [...arr], outerIndex: i, minIndex: minIndex, oldMinIndex: oldMinIndex, compareIndex: j, message: `New minimum found at index ${j} (${arr[j]})` });
                }
            }

            if (minIndex !== i) {
                steps.push({ type: 'swap', arrayState: [...arr], outerIndex: i, swapIndices: [i, minIndex], message: `Swapping minimum (${arr[minIndex]}) with element at index ${i} (${arr[i]})` });
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                steps.push({ type: 'after-swap', arrayState: [...arr], outerIndex: i, swapIndices: [i, minIndex], message: `Swap complete. Minimum now at index ${i}.` });
            } else {
                steps.push({ type: 'no-swap', arrayState: [...arr], outerIndex: i, message: `Element at index ${i} (${arr[i]}) is already the minimum. No swap needed.` });
            }
             steps.push({ type: 'mark-sorted', arrayState: [...arr], index: i, message: `Element at index ${i} is now sorted.` });
        }
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
            bar.className = 'vis-bar';
            bar.style.opacity = '1';
            bar.style.transform = 'translateY(0)';
            bar.style.borderColor = 'transparent';

            const value = step.arrayState[index];
            bar.style.height = `${(value / maxValue) * 95}%`;
            bar.setAttribute('data-value', value);
            bar.title = `Value: ${value}`;

             if (step.type === 'finish' || (step.type === 'mark-sorted' && index <= step.index) || (step.outerIndex !== undefined && index < step.outerIndex)) {
                 bar.classList.add('sorted-final');
             }
        });

        switch (step.type) {
            case 'find-min-start':
                if (elements[step.outerIndex]) elements[step.outerIndex].classList.add('current-outer');
                if (elements[step.minIndex]) elements[step.minIndex].classList.add('minimum');
                break;
            case 'compare-inner':
                if (elements[step.outerIndex]) elements[step.outerIndex].classList.add('current-outer');
                if (elements[step.minIndex] && !elements[step.minIndex].classList.contains('sorted-final')) elements[step.minIndex].classList.add('minimum');
                if (elements[step.compareIndex] && !elements[step.compareIndex].classList.contains('sorted-final')) elements[step.compareIndex].classList.add('comparing');
                break;
            case 'new-min':
                if (elements[step.outerIndex]) elements[step.outerIndex].classList.add('current-outer');
                if (step.oldMinIndex !== undefined && elements[step.oldMinIndex] && step.oldMinIndex !== step.outerIndex) {
                   elements[step.oldMinIndex].classList.remove('minimum');
                }
                if (elements[step.minIndex] && !elements[step.minIndex].classList.contains('sorted-final')) elements[step.minIndex].classList.add('minimum');
                if (elements[step.compareIndex] && !elements[step.compareIndex].classList.contains('sorted-final')) elements[step.compareIndex].classList.add('comparing');
                break;
            case 'swap':
            case 'after-swap':
                if (elements[step.swapIndices[0]] && !elements[step.swapIndices[0]].classList.contains('sorted-final')) elements[step.swapIndices[0]].classList.add('swapping');
                if (elements[step.swapIndices[1]] && !elements[step.swapIndices[1]].classList.contains('sorted-final')) elements[step.swapIndices[1]].classList.add('swapping');
                 if (step.type === 'swap' && elements[step.swapIndices[1]]) {
                    elements[step.swapIndices[1]].classList.add('minimum');
                 }
                 if (elements[step.outerIndex]) elements[step.outerIndex].classList.add('current-outer');
                break;
            case 'no-swap':
                if (elements[step.outerIndex] && !elements[step.outerIndex].classList.contains('sorted-final')) {
                    elements[step.outerIndex].classList.add('current-outer');
                    elements[step.outerIndex].classList.add('minimum');
                }
                break;
            case 'mark-sorted':
                 if (elements[step.index]) elements[step.index].classList.add('sorted-final');
                break;
            case 'start':
                 break;
            case 'finish':
                elements.forEach(bar => bar.classList.add('sorted-final'));
                break;
        }
    }
};