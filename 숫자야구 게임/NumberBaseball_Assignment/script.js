// 게임 상태를 관리할 변수들
let answer = [];
let attempts = 0;
const MAX_ATTEMPTS = 9;

// DOM 요소들
const inputFields = [
    document.getElementById('number1'),
    document.getElementById('number2'),
    document.getElementById('number3')
];
const submitButton = document.querySelector('.submit-button');
const resultDisplay = document.querySelector('.result-display');
const gameResultImg = document.getElementById('game-result-img');

// 게임 초기화 함수
function initializeGame() {
    answer = generateAnswer();
    attempts = 0;
    resultDisplay.innerHTML = '';
    gameResultImg.src = '';
    inputFields.forEach(field => field.value = '');
    submitButton.disabled = false;
}

// 3개의 랜덤한 숫자 생성
function generateAnswer() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = [];
    for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * numbers.length);
        result.push(numbers[index]);
        numbers.splice(index, 1);
    }
    return result;
}

// 숫자 확인 함수
function check_numbers() {
    const userGuess = inputFields.map(field => parseInt(field.value));
    
    // 입력값 검증
    if (userGuess.some(isNaN) || userGuess.some(num => num < 0 || num > 9)) {
        alert('0부터 9까지의 숫자만 입력해주세요.');
        return;
    }

    attempts++;
    const result = checkGuess(userGuess);
    updateResultDisplay(userGuess, result);

    if (result.strikes === 3) {
        endGame(true);
    } else if (attempts >= MAX_ATTEMPTS) {
        endGame(false);
    }

    // 입력 필드 초기화
    inputFields.forEach(field => field.value = '');
}

// 추측 결과 확인
function checkGuess(guess) {
    let strikes = 0;
    let balls = 0;

    for (let i = 0; i < 3; i++) {
        if (guess[i] === answer[i]) {
            strikes++;
        } else if (answer.includes(guess[i])) {
            balls++;
        }
    }

    return { strikes, balls };
}

// 결과 표시 업데이트
function updateResultDisplay(guess, result) {
    const resultElement = document.createElement('div');
    resultElement.className = 'check-result';
    
    let resultText;
    if (result.strikes === 0 && result.balls === 0) {
        resultText = '<div class="out num-result">O</div>';
    } else {
        resultText = `${result.strikes}<div class="strike num-result">S</div> ${result.balls}<div class="ball num-result">B</div>`;
    }

    resultElement.innerHTML = `
        <div class="left">${guess.join(' ')}</div>
        :
        <div class="right">
            ${resultText}
        </div>
    `;
    resultDisplay.prepend(resultElement);
}

// 게임 종료
function endGame(isWin) {
    gameResultImg.src = isWin ? 'success.png' : 'fail.png';
    submitButton.disabled = true;
}

// HTML이 모두 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 기존의 onclick 이벤트 제거 및 새 이벤트 리스너 추가
    submitButton.removeAttribute('onclick');
    submitButton.addEventListener('click', check_numbers);

    // 게임 시작
    initializeGame();
});