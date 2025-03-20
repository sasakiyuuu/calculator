let currentInput = '';
let steps = [];

function appendNumber(number) {
    currentInput += number;
    document.getElementById('display').innerText = currentInput;
}

function appendOperator(operator) {
    currentInput += ' ' + operator + ' ';
    document.getElementById('display').innerText = currentInput;
}

function clearDisplay() {
    currentInput = '';
    steps = [];
    document.getElementById('display').innerText = '0';
    document.getElementById('steps').innerText = '';
}

function calculate() {
    try {
        let result = eval(currentInput);
        steps.push(currentInput + ' = ' + result);
        currentInput = result.toString();
        document.getElementById('display').innerText = currentInput;
        document.getElementById('steps').innerText = steps.join('\n');
    } catch (e) {
        document.getElementById('display').innerText = 'Error';
    }
}
