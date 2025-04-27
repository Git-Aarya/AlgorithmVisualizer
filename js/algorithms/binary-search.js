// js/algorithms/binary-search.js

const binarySearchConfig = {
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
        visualizationArea.innerHTML = '';
        extraVisualizationArea.innerHTML = '';

        if (!data || data.length === 0) {
            visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
            return { steps: [], elements: [], target: null };
        }
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
        let arr = sortedData;
        let target;
         if (Math.random() > 0.2) {
            const targetIndex = Math.floor(Math.random() * arr.length);
            target = arr[targetIndex];
        } else {
            target = Math.floor(Math.random() * (maxValue + 20)) + (maxValue + 5);
             if (Math.random() > 0.5 && arr.length > 0) {
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
            steps.push({ type: 'check-mid', arrayState: [...arr], target: target, low: low, high: high, mid: mid, message: `Checking middle index ${mid} (Value: ${guess}). Range [${low}, ${high}]` });

            if (guess === target) {
                steps.push({ type: 'found', arrayState: [...arr], target: target, low: low, high: high, mid: mid, index: mid, message: `Found target ${target} at index ${mid}!` });
                found = true;
                foundIndex = mid;
                break;
            } else if (guess > target) {
                const newHigh = mid - 1;
                steps.push({ type: 'adjust-high', arrayState: [...arr], target: target, low: low, high: newHigh, mid: mid, message: `Target ${target} < ${guess}. Adjusting range to [${low}, ${newHigh}]` });
                high = newHigh;
            } else { // guess < target
                const newLow = mid + 1;
                steps.push({ type: 'adjust-low', arrayState: [...arr], target: target, low: newLow, high: high, mid: mid, message: `Target ${target} > ${guess}. Adjusting range to [${newLow}, ${high}]` });
                low = newLow;
            }
        }

        if (!found) {
            steps.push({ type: 'not-found', arrayState: [...arr], target: target, low: low, high: high, message: `Target ${target} not found (low > high).` });
        }
        steps.push({ type: 'finish', arrayState: [...arr], target: target, found: found, index: foundIndex, message: `Search finished. Target ${target} ${found ? `found at index ${foundIndex}` : 'not found'}.` });

        return { steps, elements, target };
    },
    renderStep: (step, elements, animationState) => {
        if (!step || !elements || elements.length === 0) return;

        elements.forEach((bar, index) => {
            bar.className = 'vis-bar';
            bar.style.opacity = '1';
            bar.style.transform = 'translateY(0)';
            bar.style.borderColor = 'transparent';

             let isInRange = false;
             let isOutOfRange = true;
             if (step.low !== undefined && step.high !== undefined) {
                if (index >= step.low && index <= step.high) {
                    isInRange = true;
                     isOutOfRange = false;
                 }
             }

             if (step.type !== 'finish') {
                if (isInRange) {
                     bar.classList.add('in-range');
                } else if (isOutOfRange && step.type !== 'start') {
                    bar.classList.add('out-of-range');
                    bar.style.opacity = '0.4';
                }
             }
             else {
                if (step.found && index === step.index) {
                     bar.classList.add('found');
                 } else {
                     bar.classList.add('out-of-range');
                     bar.style.opacity = '0.4';
                 }
             }
        });

        switch (step.type) {
             case 'check-mid':
                 if (elements[step.mid]) {
                     elements[step.mid].classList.remove('in-range', 'out-of-range');
                     elements[step.mid].style.opacity = '1';
                     elements[step.mid].classList.add('comparing');
                 }
                 break;
             case 'adjust-high':
             case 'adjust-low':
                 if (elements[step.mid]) {
                    elements[step.mid].classList.remove('comparing');
                    elements[step.mid].classList.add('checked');
                    elements[step.mid].style.opacity = '0.4';
                 }
                 break;
             case 'found':
                if (elements[step.index]) {
                    elements[step.index].classList.add('found');
                    elements[step.index].style.opacity = '1';
                }
                 break;
            case 'start':
            case 'not-found':
            case 'finish':
                 break;
        }
    }
};