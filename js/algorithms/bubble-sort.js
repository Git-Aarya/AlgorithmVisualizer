// js/algorithms/bubble-sort.js

const bubbleSortConfig = {
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
        let sortedBoundary = n;

        steps.push({ type: 'start', arrayState: [...arr], sortedBoundary: n, message: 'Starting Bubble Sort' });

        if (n <= 1) {
             steps.push({ type: 'finish', arrayState: [...arr], message: 'Array is already sorted (size <= 1)!' });
             return { steps, elements };
        }

        do {
            localSwapped = false;
            let passBoundary = sortedBoundary - 1;
            for (let i = 0; i < passBoundary; i++) {
                steps.push({ type: 'compare', indices: [i, i + 1], arrayState: [...arr], sortedBoundary: sortedBoundary, message: `Comparing ${arr[i]} and ${arr[i+1]}` });

                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    localSwapped = true;
                    steps.push({ type: 'swap', indices: [i, i + 1], arrayState: [...arr], sortedBoundary: sortedBoundary, message: `Swapping ${arr[i+1]} and ${arr[i]}` });
                }
            }
            if (sortedBoundary > 0) {
                steps.push({ type: 'mark-sorted-pass', index: passBoundary, arrayState: [...arr], sortedBoundary: passBoundary, message: `Element ${arr[passBoundary]} is in its final place for this pass.` });
            }
            sortedBoundary--;

        } while (localSwapped && sortedBoundary > 0);

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
            bar.className = 'vis-bar';
            bar.style.opacity = '1';
            bar.style.transform = 'translateY(0)';
            bar.style.borderColor = 'transparent';

            const value = step.arrayState[index];
            bar.style.height = `${(value / maxValue) * 95}%`;
            bar.setAttribute('data-value', value);
             bar.title = `Value: ${value}`;

             if (step.sortedBoundary !== undefined && index >= step.sortedBoundary && step.type !== 'finish') {
                bar.classList.add('sorted-final');
             }
        });

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
                 if (elements[step.index]) {
                    elements[step.index].classList.add('sorted-final');
                }
                break;
             case 'start':
                 break;
            case 'finish':
                elements.forEach(bar => bar.classList.add('sorted-final'));
                break;
        }
    }
};