const coinChangeConfig = {
    name: 'Coin Change',
    type: 'dynamic-programming',
    requiresPositiveInts: true,
    code: `<span class="code-keyword">function</span> <span class="code-function">coinChange</span>(coins, amount) {
  <span class="code-keyword">const</span> dp = <span class="code-keyword">new</span> <span class="code-function">Array</span>(amount + <span class="code-number">1</span>).<span class="code-function">fill</span>(Infinity);
  dp[<span class="code-number">0</span>] = <span class="code-number">0</span>; <span class="code-comment">// Base case: 0 coins needed for amount 0</span>
  <span class="code-comment">// Visualize initial dp array</span>

  <span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-number">1</span>; i <= amount; i++) {
    <span class="code-comment">// Visualize current amount i</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> coin <span class="code-keyword">of</span> coins) {
      <span class="code-comment">// Visualize checking coin value</span>
      <span class="code-keyword">if</span> (coin <= i) {
        <span class="code-comment">// Visualize comparing dp[i] and dp[i-coin] + 1</span>
        dp[i] = <span class="code-function">Math</span>.<span class="code-function">min</span>(dp[i], dp[i - coin] + <span class="code-number">1</span>);
        <span class="code-comment">// Visualize updating dp[i]</span>
      }
    }
  }

  <span class="code-keyword">return</span> dp[amount] === Infinity ? -<span class="code-number">1</span> : dp[amount];
}`,
    pseudocode: `CoinChange(coins, amount):
  Create array dp[0..amount], initialized to Infinity
  dp[0] = 0  // Base case: 0 coins needed for amount 0
  // Visualize: Initialize dp array

  for i = 1 to amount:
    // Visualize: Current amount i
    for each coin in coins:
      // Visualize: Check coin value
      if coin <= i:
        // Visualize: Compare dp[i] and dp[i-coin] + 1
        dp[i] = min(dp[i], dp[i-coin] + 1)
        // Visualize: Update dp[i]

  if dp[amount] == Infinity:
    return -1  // No solution exists
  else:
    return dp[amount]  // Return minimum coins needed`,
    setup: function(data) {
        console.log("[Coin Change Setup] Starting setup...");
        const extraVisualizationArea = document.getElementById('extra-visualization-area');
        const mainVisualizationArea = document.getElementById('visualization-area');
        
        if (!extraVisualizationArea) {
            console.error("[Coin Change Setup] extraVisualizationArea not found!");
            return { steps: [], elements: null };
        }

        if (mainVisualizationArea) mainVisualizationArea.style.display = 'none';
        extraVisualizationArea.innerHTML = '';

        // Generate random coins and amount
        const numCoins = 4;
        const coins = Array.from({ length: numCoins }, () => Math.floor(Math.random() * 10) + 1);
        coins.sort((a, b) => a - b); // Sort coins for better visualization
        const amount = Math.floor(Math.random() * 30) + 10;

        // Create visualization elements
        const container = document.createElement('div');
        container.className = 'coin-change-container';
        
        // Create coins display
        const coinsDisplay = document.createElement('div');
        coinsDisplay.className = 'coins-display';
        coins.forEach(coin => {
            const coinElement = document.createElement('div');
            coinElement.className = 'coin';
            coinElement.textContent = coin;
            coinsDisplay.appendChild(coinElement);
        });
        container.appendChild(coinsDisplay);

        // Create amount display
        const amountDisplay = document.createElement('div');
        amountDisplay.className = 'amount-display';
        amountDisplay.textContent = `Target Amount: ${amount}`;
        container.appendChild(amountDisplay);

        // Create dp array display
        const dpDisplay = document.createElement('div');
        dpDisplay.className = 'dp-display';
        const dpTable = document.createElement('table');
        dpTable.className = 'dp-table';
        
        // Create header row
        const headerRow = dpTable.insertRow();
        const headerCell = headerRow.insertCell();
        headerCell.textContent = 'Amount';
        for (let i = 0; i <= amount; i++) {
            const cell = headerRow.insertCell();
            cell.textContent = i;
        }
        
        // Create value row
        const valueRow = dpTable.insertRow();
        const valueLabel = valueRow.insertCell();
        valueLabel.textContent = 'Min Coins';
        for (let i = 0; i <= amount; i++) {
            const cell = valueRow.insertCell();
            cell.id = `dp-cell-${i}`;
            cell.textContent = '∞';
        }
        
        dpDisplay.appendChild(dpTable);
        container.appendChild(dpDisplay);

        extraVisualizationArea.appendChild(container);

        // Generate steps
        const steps = [];
        const dp = new Array(amount + 1).fill(Infinity);
        dp[0] = 0;

        // Initial step
        steps.push({
            type: 'init',
            dp: [...dp],
            message: 'Initialize dp array with Infinity, dp[0] = 0'
        });

        // Main algorithm steps
        for (let i = 1; i <= amount; i++) {
            steps.push({
                type: 'current-amount',
                amount: i,
                dp: [...dp],
                message: `Processing amount ${i}`
            });

            for (const coin of coins) {
                if (coin <= i) {
                    const prevValue = dp[i];
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                    
                    steps.push({
                        type: 'check-coin',
                        amount: i,
                        coin: coin,
                        prevValue: prevValue,
                        newValue: dp[i],
                        dp: [...dp],
                        message: `Checking coin ${coin} for amount ${i}`
                    });
                }
            }
        }

        // Final step
        steps.push({
            type: 'finish',
            dp: [...dp],
            result: dp[amount] === Infinity ? -1 : dp[amount],
            message: dp[amount] === Infinity ? 
                'No solution exists' : 
                `Minimum coins needed: ${dp[amount]}`
        });

        return { steps, elements: null };
    },
    renderStep: function(step, elements, animationState) {
        if (!step) return;

        // Update dp table cells
        for (let i = 0; i < step.dp.length; i++) {
            const cell = document.getElementById(`dp-cell-${i}`);
            if (cell) {
                cell.textContent = step.dp[i] === Infinity ? '∞' : step.dp[i];
                
                // Reset previous highlights
                cell.classList.remove('current-amount', 'checking-coin', 'updated-value');
                
                // Apply new highlights based on step type
                if (step.type === 'current-amount' && i === step.amount) {
                    cell.classList.add('current-amount');
                } else if (step.type === 'check-coin' && i === step.amount) {
                    cell.classList.add('checking-coin');
                } else if (step.type === 'check-coin' && i === step.amount && step.newValue !== step.prevValue) {
                    cell.classList.add('updated-value');
                }
            }
        }

        // Update status message
        const statusMessage = document.getElementById('status-message');
        if (statusMessage) {
            statusMessage.textContent = step.message;
        }
    }
}; 