// ===== Select Elements =====
const balance = document.getElementById('balance-amount');
const incomeEl = document.getElementById('income-amount');
const expenseEl = document.getElementById('expense-amount');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// ===== Get transactions from LocalStorage =====
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// ===== Add transaction =====
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please enter description and amount');
        return;
    }

    const transaction = {
        id: Date.now(),
        text: text.value,
        amount: +amount.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    form.reset();
});

// ===== Add transaction to DOM =====
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.innerHTML = `
        ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
        <button onclick="removeTransaction(${transaction.id})">x</button>
    `;
    item.style.color = transaction.amount < 0 ? 'red' : 'green';
    transactionList.appendChild(item);
}

// ===== Update balance, income, expense =====
function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0);
    const income = amounts.filter(a => a > 0).reduce((acc, item) => acc + item, 0);
    const expense = amounts.filter(a => a < 0).reduce((acc, item) => acc + item, 0);

    balance.innerText = `$${total.toFixed(2)}`;
    incomeEl.innerText = `$${income.toFixed(2)}`;
    expenseEl.innerText = `$${Math.abs(expense).toFixed(2)}`;
}

// ===== Remove transaction =====
function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

// ===== Update LocalStorage =====
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ===== Initialize app =====
function init() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();
