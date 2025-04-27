// js/algorithms/linear-search.js

const linearSearchConfig = {
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
        // Get references to visualization areas
        const visualizationArea = document.getElementById('visualization-area');
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        visualizationArea.innerHTML = '';
        extraVisualizationArea.innerHTML = '';

        if (!data || data.length === 0) {
             visualizationArea.innerHTML = `<p class="text-gray-500 dark:text-gray-400 self-center">Cannot visualize empty array.</p>`;
             return { steps: [], elements: [], target: null };
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
        const targetIndex = Math.floor(Math.random() * arr.length);
        const target = arr[targetIndex];
        let found = false;

        steps.push({ type: 'start', arrayState: [...arr], target: target, message: `Starting Linear Search. Target: ${target}` });

        for (let i = 0; i < arr.length; i++) {
             steps.push({ type: 'compare', index: i, target: target, arrayState: [...arr], message: `Checking index ${i} (Value: ${arr[i]})` });
             if (arr[i] === target) {
                 steps.push({ type: 'found', index: i, target: target, arrayState: [...arr], message: `Found target ${target} at index ${i}!` });
                 found = true;
                 break;
             } else {
                 steps.push({ type: 'checked', index: i, target: target, arrayState: [...arr], message: `Index ${i} (Value: ${arr[i]}) is not the target.` });
             }
        }
        if (!found) {
             steps.push({ type: 'not-found', target: target, arrayState: [...arr], message: `Target ${target} not found in the array.` });
        }
        steps.push({ type: 'finish', target: target, arrayState: [...arr], found: found, message: `Search finished. Target ${target} ${found ? 'was found' : 'was not found'}.` });

        return { steps, elements, target };
    },
    renderStep: (step, elements, animationState) => {
        if (!step || !elements || elements.length === 0) return;

        elements.forEach((bar, index) => {
            bar.className = 'vis-bar';
            bar.style.opacity = '1';
            bar.style.transform = 'translateY(0)';
            bar.style.borderColor = 'transparent';

             if (step.type === 'finish') {
                 if (step.found && index === step.index) {
                     bar.classList.add('found');
                 } else {
                     bar.classList.add('checked');
                     bar.style.opacity = '0.6';
                 }
             }
             else if (step.type !== 'start' && step.index !== undefined && index < step.index && !bar.classList.contains('found')) {
                if (step.type === 'checked' || step.type === 'compare') {
                     bar.classList.add('checked');
                     bar.style.opacity = '0.6';
                }
             }
        });

        switch (step.type) {
            case 'compare':
                if (elements[step.index]) elements[step.index].classList.add('comparing');
                break;
            case 'found':
                if (elements[step.index]) {
                    elements[step.index].classList.add('found');
                    elements.forEach((bar, idx) => {
                       if (idx !== step.index) {
                           bar.classList.add('checked');
                           bar.style.opacity = '0.6';
                       }
                    });
                }
                break;
            case 'checked':
                 if (elements[step.index]) {
                     elements[step.index].classList.add('checked');
                     elements[step.index].style.opacity = '0.6';
                 }
                break;
             case 'not-found':
                 elements.forEach(bar => {
                     bar.classList.add('checked');
                     bar.style.opacity = '0.6';
                 });
                 break;
            case 'start':
            case 'finish':
                break;
        }
    }
};