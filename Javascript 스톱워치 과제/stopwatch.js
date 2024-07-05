let timer;
let isRunning = false;
let time = 0;
let records = [];

const timeDisplay = document.querySelector('.time');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const recordList = document.getElementById('recordList');
const selectAllBtn = document.getElementById('selectAllBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

function formatTime(ms) {
    let minutes = Math.floor(ms / 600000);
    let seconds = Math.floor((ms % 600000) / 1000);
    let milliseconds = Math.floor((ms % 10000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timeDisplay.textContent = formatTime(time);
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        let startTime = Date.now() - time;
        timer = setInterval(() => {
            time = Date.now() - startTime;
            updateDisplay();
        }, 10);
    }
}

function stopTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
        addRecord();
    }
}

function resetTimer() {
    isRunning = false;
    clearInterval(timer);
    time = 0;
    updateDisplay();
    records = [];
    updateRecordList();
}

function addRecord() {
    records.push(time);
    updateRecordList();
}

function updateRecordList() {
    recordList.innerHTML = '';
    records.forEach((record, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="record-checkbox" data-index="${index}">
            <span>${formatTime(record)}</span>
        `;
        recordList.appendChild(li);
    });
}

function selectAllRecords() {
    document.querySelectorAll('.record-checkbox').forEach(checkbox => {
        checkbox.checked = true;
    });
}

function deleteSelectedRecords() {
    const selectedIndexes = Array.from(document.querySelectorAll('.record-checkbox:checked'))
        .map(checkbox => parseInt(checkbox.dataset.index))
        .sort((a, b) => b - a);

    selectedIndexes.forEach(index => {
        records.splice(index, 1);
    });

    updateRecordList();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
selectAllBtn.addEventListener('click', selectAllRecords);
deleteSelectedBtn.addEventListener('click', deleteSelectedRecords);

updateDisplay();