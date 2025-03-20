let currentInput = '';
let currentCalculation = '';
let history = [];
let memory = 0;
let isDarkMode = false;
let isAdvancedVisible = false;
let isHistoryVisible = false;

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    document.addEventListener('keydown', handleKeyPress);
});

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function appendOperator(operator) {
    if (currentInput === '' && operator === '-') {
        currentInput = operator;
    } else if (currentInput !== '') {
        currentInput += ' ' + operator + ' ';
    }
    updateDisplay();
}

function appendFunction(func) {
    currentInput += func;
    if (!func.endsWith('(')) {
        currentInput += ' ';
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    currentCalculation = '';
    updateDisplay();
    updateSecondaryDisplay('');
}

function calculate() {
    try {
        if (currentInput === '') return;
        
        currentCalculation = currentInput.replace(/Math.sin/g, 'sin')
                                        .replace(/Math.cos/g, 'cos')
                                        .replace(/Math.tan/g, 'tan')
                                        .replace(/Math.sqrt/g, '√')
                                        .replace(/Math.log/g, 'log')
                                        .replace(/Math.log10/g, 'log10')
                                        .replace(/Math.pow/g, 'pow')
                                        .replace(/Math.PI/g, 'π');
        
        let openBrackets = (currentInput.match(/\(/g) || []).length;
        let closeBrackets = (currentInput.match(/\)/g) || []).length;
        
        if (openBrackets > closeBrackets) {
            currentInput += ')'.repeat(openBrackets - closeBrackets);
        }
        
        let result = eval(currentInput);
        
        addToHistory(currentCalculation, result);
        
        currentInput = result.toString();
        updateDisplay();
        updateSecondaryDisplay(currentCalculation + ' =');
        
    } catch (e) {
        document.getElementById('display').innerText = 'Error';
        setTimeout(() => {
            document.getElementById('display').innerText = currentInput || '0';
        }, 1000);
    }
}

function addToHistory(calculation, result) {
    const historyItem = {
        calculation: calculation,
        result: result,
        timestamp: new Date().toLocaleTimeString()
    };
    
    history.unshift(historyItem);
    
    if (history.length > 10) {
        history.pop();
    }
    
    updateHistoryDisplay();
    saveSettings();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="flex justify-between">
                <span>${item.calculation} = ${item.result}</span>
                <span class="text-xs opacity-50">${item.timestamp}</span>
            </div>
        `;
        
        historyItem.addEventListener('click', () => {
            currentInput = item.result.toString();
            updateDisplay();
        });
        
        historyList.appendChild(historyItem);
    });
}

function updateDisplay() {
    const display = document.getElementById('display');
    display.innerText = currentInput || '0';
    
    display.scrollLeft = display.scrollWidth;
}

function updateSecondaryDisplay(text) {
    document.getElementById('secondaryDisplay').innerText = text;
}

function toggleAdvanced() {
    const advancedPanel = document.getElementById('advancedPanel');
    const advancedIcon = document.getElementById('advancedIcon');
    
    isAdvancedVisible = !isAdvancedVisible;
    
    if (isAdvancedVisible) {
        advancedPanel.classList.remove('hidden');
        advancedIcon.classList.remove('fa-chevron-down');
        advancedIcon.classList.add('fa-chevron-up');
    } else {
        advancedPanel.classList.add('hidden');
        advancedIcon.classList.remove('fa-chevron-up');
        advancedIcon.classList.add('fa-chevron-down');
    }
    
    saveSettings();
}

function toggleHistory() {
    const historyPanel = document.getElementById('historyPanel');
    isHistoryVisible = !isHistoryVisible;
    
    if (isHistoryVisible) {
        historyPanel.classList.remove('hidden');
        updateHistoryDisplay();
    } else {
        historyPanel.classList.add('hidden');
    }
    
    saveSettings();
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        body.style.background = 'linear-gradient(to right, var(--background-start), var(--background-mid), var(--background-end))';
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-mode');
        body.style.background = 'linear-gradient(to right, var(--background-start), var(--background-mid), var(--background-end))';
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    saveSettings();
}

function handleKeyPress(e) {
    if (/[0-9]/.test(e.key)) {
        appendNumber(e.key);
    }
    else if (['+', '-', '*', '/'].includes(e.key)) {
        appendOperator(e.key);
    }
    else if (e.key === '.') {
        appendNumber('.');
    }
    else if (e.key === 'Enter') {
        calculate();
    }
    else if (e.key === 'Escape') {
        clearDisplay();
    }
    else if (e.key === '(' || e.key === ')') {
        appendNumber(e.key);
    }
}

function saveSettings() {
    const settings = {
        darkMode: isDarkMode,
        advancedVisible: isAdvancedVisible,
        historyVisible: isHistoryVisible,
        history: history
    };
    
    localStorage.setItem('calculatorSettings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('calculatorSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        isDarkMode = settings.darkMode || false;
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('themeIcon').classList.remove('fa-moon');
            document.getElementById('themeIcon').classList.add('fa-sun');
        }
        
        isAdvancedVisible = settings.advancedVisible || false;
        if (isAdvancedVisible) {
            document.getElementById('advancedPanel').classList.remove('hidden');
            document.getElementById('advancedIcon').classList.remove('fa-chevron-down');
            document.getElementById('advancedIcon').classList.add('fa-chevron-up');
        }
        
        isHistoryVisible = settings.historyVisible || false;
        if (isHistoryVisible) {
            document.getElementById('historyPanel').classList.remove('hidden');
        }
        
        history = settings.history || [];
        updateHistoryDisplay();
    }
}
