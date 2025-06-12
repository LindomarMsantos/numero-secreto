document.addEventListener('DOMContentLoaded', function() {
    // Configuração da roleta
     // comentario add direto do github
    const wheel = document.getElementById('wheel');
    const ball = document.getElementById('ball');
    const spinBtn = document.getElementById('spinBtn');
    const betAmountInput = document.getElementById('betAmount');
    const balanceDisplay = document.getElementById('balance');
    const resultDisplay = document.getElementById('result');
    const historyDisplay = document.getElementById('history');
    const betButtons = document.querySelectorAll('.bet-btn');
    
    let balance = 1000;
    let currentBet = null;
    let isSpinning = false;
    let spinHistory = [];
    
    // Cores dos números na roleta (0 é verde, outros alternam entre vermelho e preto)
    const numberColors = {
        0: 'green',
        1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black', 7: 'red', 8: 'black', 9: 'red', 10: 'black',
        11: 'black', 12: 'red', 13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red', 19: 'red', 20: 'black',
        21: 'red', 22: 'black', 23: 'red', 24: 'black', 25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red',
        31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red'
    };
    
    // Criar números na roleta
    function createRouletteNumbers() {
        const numbers = Object.keys(numberColors).map(Number);
        const centerX = wheel.offsetWidth / 2;
        const centerY = wheel.offsetHeight / 2;
        const radius = Math.min(centerX, centerY) - 30;
        
        numbers.forEach(num => {
            const angle = (num / 37) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle) - 15;
            const y = centerY + radius * Math.sin(angle) - 15;
            
            const numberElement = document.createElement('div');
            numberElement.className = `number ${numberColors[num]}`;
            numberElement.textContent = num;
            numberElement.style.left = `${x}px`;
            numberElement.style.top = `${y}px`;
            numberElement.style.transform = `rotate(${angle + Math.PI/2}rad)`;
            
            wheel.appendChild(numberElement);
        });
    }
    
    // Configurar apostas
    function setupBets() {
        betButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (isSpinning) return;
                
                const betValue = this.getAttribute('data-bet');
                currentBet = betValue;
                
                // Remover seleção anterior
                betButtons.forEach(btn => btn.style.boxShadow = 'none');
                
                // Destacar seleção atual
                this.style.boxShadow = '0 0 10px 3px rgba(255, 255, 255, 0.7)';
            });
        });
    }
    
    // Girar a roleta
    function spinRoulette() {
        if (isSpinning || !currentBet) return;
        
        const betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount < 1 || betAmount > balance) {
            alert('Por favor, insira um valor de aposta válido dentro do seu saldo.');
            return;
        }
        
        isSpinning = true;
        spinBtn.disabled = true;
        resultDisplay.textContent = '';
        resultDisplay.className = 'result';
        
        // Deduzir o valor da aposta do saldo
        balance -= betAmount;
        balanceDisplay.textContent = balance;
        
        // Gerar número aleatório (0-36)
        const winningNumber = Math.floor(Math.random() * 37);
        const winningColor = numberColors[winningNumber];
        
        // Calcular rotação (5-10 voltas + posição do número)
        const spins = 5 + Math.random() * 5;
        const rotation = spins * 360 + (winningNumber * (360 / 37));
        
        // Animação da roleta
        wheel.style.transform = `rotate(${-rotation}deg)`;
        
        // Animação da bola (pequeno atraso)
        setTimeout(() => {
            ball.style.transition = 'all 0.5s ease-out';
            ball.style.transform = 'translate(-50%, -50%) scale(1.5)';
            
            setTimeout(() => {
                ball.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 500);
        }, 3000);
        
        // Verificar resultado após a animação
        setTimeout(() => {
            checkResult(winningNumber, winningColor, betAmount);
            isSpinning = false;
            spinBtn.disabled = false;
            
            // Adicionar ao histórico
            addToHistory(winningNumber, winningColor);
        }, 6000);
    }
    
    // Verificar resultado da aposta
    function checkResult(number, color, betAmount) {
        let win = false;
        let payout = 0;
        
        if (currentBet === 'red' && color === 'red') {
            win = true;
            payout = betAmount * 2;
        } else if (currentBet === 'black' && color === 'black') {
            win = true;
            payout = betAmount * 2;
        } else if (currentBet === 'green' && color === 'green') {
            win = true;
            payout = betAmount * 36;
        } else if (currentBet === number.toString()) {
            win = true;
            payout = betAmount * 36;
        }
        
        if (win) {
            balance += payout;
            balanceDisplay.textContent = balance;
            resultDisplay.textContent = `Você ganhou! Número: ${number} (${color === 'green' ? 'Verde' : color === 'red' ? 'Vermelho' : 'Preto'}). Você recebeu ${payout} fichas.`;
            resultDisplay.className = 'result win';
        } else {
            resultDisplay.textContent = `Você perdeu! Número: ${number} (${color === 'green' ? 'Verde' : color === 'red' ? 'Vermelho' : 'Preto'}).`;
            resultDisplay.className = 'result lose';
        }
    }
    
    // Adicionar ao histórico
    function addToHistory(number, color) {
        spinHistory.unshift({ number, color });
        if (spinHistory.length > 10) {
            spinHistory.pop();
        }
        
        updateHistoryDisplay();
    }
    
    // Atualizar exibição do histórico
    function updateHistoryDisplay() {
        historyDisplay.innerHTML = '';
        
        spinHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${item.color}`;
            historyItem.textContent = item.number;
            historyDisplay.appendChild(historyItem);
        });
    }
    
    // Event listeners
    spinBtn.addEventListener('click', spinRoulette);
    
    // Inicialização
    createRouletteNumbers();
    setupBets();
});
