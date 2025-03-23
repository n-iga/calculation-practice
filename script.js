// Elements
const elemId_answer = document.getElementById("answer")         // main
const elemId_result = document.getElementById("result")
const elemId_hint = document.getElementById("hint")

const rangeModal = document.getElementById("rangeModal");       // range modal
const openRangeModalBtn = document.getElementById("btn_openRangeModal");
const closeRangeModalBtn = document.querySelector(".close-range");

const hintModal = document.getElementById("hintModal");         // hint modal
const openHintModalBtn = document.getElementById("btn_openHintModal");
const closeHintModalBtn = document.querySelector(".close-hint");

const elemId_btn_C = document.getElementById("btn_c");          // numbers
const elemId_btn_BS = document.getElementById("btn_bs");

// 2桁の乱数生成（範囲指定）
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 桁の分解
function sliceNumber(num) {
    ones_place = num % 10;
    tens_place = (num - ones_place) / 10;
    return [ones_place, tens_place];
}

// パターン生成
function getPattern() {

    const arr = document.querySelectorAll(".ptns:checked");     // 入力されたパターン
    const len = arr.length;                                     // 配列の長さ

    if (len !== 0) {                                            // 入力されたパターンからランダムに出題       
        return arr[Math.floor(Math.random() * len)].value;
    } else {                                                    // ランダムにパターン生成        
        return String(getRandomNumber(1, 6));
    }
}

// パターンに応じて2桁の乱数を2つ生成
function getNumbers() {
    let pattern, tens_place, ones_place;

    pattern = getPattern()                                      // 出題パターンの取得

    if (pattern === "1") {                                      // パターン1
        num1 = getRandomNumber(91, 99);
        num2 = getRandomNumber(91, 99);

    } else if (pattern === "2") {                               // パターン2
        num1 = getRandomNumber(11, 89);
        [ones_place, tens_place] = sliceNumber(num1);

        num2 = tens_place * 10 + (10 - ones_place);

    } else if (pattern === "3") {                               // パターン3
        num1 = getRandomNumber(11, 29);
        [ones_place, tens_place] = sliceNumber(num1);

        ones_place = getRandomNumber(1, 9);
        num2 = tens_place * 10 + ones_place;

    } else if (pattern === "4") {                               // パターン4
        num1 = getRandomNumber(11, 89);
        [ones_place, tens_place] = sliceNumber(num1);

        num2 = (10 - tens_place) * 10 + ones_place;

    } else if (pattern === "5") {                               // パターン5    
        num1 = getRandomNumber(21, 89);
        [ones_place, tens_place] = sliceNumber(num1);

        num2 = (tens_place - 1) * 10 + (10 - ones_place);

    } else {                                                    // パターン6 OR 未選択
        num1 = getRandomNumber(11, 99);
        num2 = getRandomNumber(11, 99);
    }

    return [num1, num2];
}

// パターン判定
function judgePattern() {

    [ones1, tens1] = sliceNumber(num1);
    [ones2, tens2] = sliceNumber(num2);

    if (tens1 * tens2 === 81) {
        return "1"
    }
    else if (tens1 === tens2 && ones1 + ones2 === 10) {
        return "2"
    }
    else if (tens1 === tens2 && tens1 < 3) {
        return "3"
    }
    else if (tens1 + tens2 === 10 && ones1 === ones2) {
        return "4"
    }
    else if (ones1 === tens1 * 10 - num2 || ones2 === tens2 * 10 - num1) {
        return "5"
    } else {
        return "6"
    }
}

// 問題を生成
function generateQuestion() {

    // 出題と計算
    [num1, num2] = getNumbers();                                // 乱数生成
    correctAnswer = num1 * num2;                                // 正解の計算

    // 表示設定
    document.getElementById("question").textContent = `${num1} × ${num2}`;
    elemId_result.textContent = "　";                           // 結果をリセット
    elemId_hint.textContent = "";                               // ヒントをリセット
    elemId_answer.value = "";                                   // 入力欄をクリア
    elemId_answer.focus();                                      // 入力欄にフォーカス
}

// 解答をチェック
function checkAnswer() {
    let userAnswer = elemId_answer.value.trim();                // 空白を除去
    let resultText = "";

    if (parseInt(userAnswer) === correctAnswer) {               // 正解：次の問題を出題
        resultText = "That's right!";
        setTimeout(generateQuestion, 500);
    } else if (userAnswer != "") {                              // 不正解
        resultText = "Try again!";
    } else {                                                    // 未解答：正解を表示
        resultText = `Right Answer：${correctAnswer} `;
        showHint();
    }

    elemId_result.textContent = resultText;
}

// ヒントを表示
function showHint() {
    let arrHintTexts
    const pattern = judgePattern();
    const arrHint1 = [
        '100^2 - " & "100 * ( X  +  Y ) + ( X  *  Y )<br>',
        'X: 100 - 数1',
        'Y: 100 - 数2'
    ];
    const arrHint2 = [
        '100 * ((◆ + 1) * ◇) + (● * ○)<br>',
        `■■□□`,
        `□□■■`
    ];
    const arrHint3 = [
        '◆0 * (◆● + ○) + (● * ○)<br>',
        `■■□`,
        `□■■`
    ];
    const arrHint4 = [
        '100 * ((◆ * ◇) + ●) + (● * ○)<br>',
        `■■□□`,
        `□□■■`
    ];
    const arrHint5 = [
        'X^2 - Y^2<br>',
        'X: 大きいほうの数の[十の位]',
        'Y: 大きいほうの数の[一の位]'
    ];
    const arrHint6 = [
        '100(◆*◇) + 10(◆*○ + ◇*●) + (●*○)'
    ];
    arrHintTexts = eval(`arrHint${pattern}`);
    arrHintTexts.splice(0, 0, `Pattern: ${pattern}<br>`);
    elemId_hint.innerHTML = arrHintTexts.join('<br>');
}

// 数値ボタン押下時の処理
document.querySelectorAll(".btn_num").forEach(button => {       // 数値ボタン
    button.addEventListener("click", function () {
        const data_value = this.getAttribute("data-value");
        if (data_value !== "") {
            elemId_answer.value += data_value;
            answerInput();                                      // 解答入力時の処理                
        }
    });
});
elemId_btn_C.addEventListener("click", function () {            // Cボタン
    elemId_answer.value = "";
});
elemId_btn_BS.addEventListener("click", function () {           // BSボタン
    elemId_answer.value = elemId_answer.value.slice(0, -1);     // 最後の1文字を削除
});

// 解答入力時の処理
function answerInput() {
    elemId_result.textContent = "　";                           // 結果をリセット
    let enteredNum = elemId_answer.value.trim();                // 空白を除去
    if (parseInt(enteredNum) === correctAnswer) {
        checkAnswer();
    }
}

// キー押下時の処理
elemId_answer.addEventListener("keydown", function (event) {
    if (rangeModal.style.display === "block") {                  // 設定モーダルが開いている場合
        closeModal(rangeModal);
    } else if (hintModal.style.display === "block") {            // ヒントモーダルが開いている場合
        closeModal(hintModal);
    } else {
        if (event.key === "Enter") {                             // 上記以外の場合、Enter押下で解答をチェック
            checkAnswer();   
        }
    }
});

// チェックボックスの変更時に新しい問題を生成
document.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
    checkbox.addEventListener("change", generateQuestion);
});

// モーダルの動作
function openModal(eremId) {                                     // 表示
    eremId.style.display = "block";
}
function closeModal(eremId) {                                    // 非表示
    eremId.style.display = "none";
}

// 設定モーダル
openRangeModalBtn.addEventListener("click", function () {        // 表示
    openModal(rangeModal);
});
closeRangeModalBtn.addEventListener("click", function () {       // 非表示（ボタンクリック）
    closeModal(rangeModal);
});

// ヒントモーダル
openHintModalBtn.addEventListener("click", function () {         // 表示
    showHint();
    openModal(hintModal);
});
closeHintModalBtn.addEventListener("click", function () {        // 非表示（ボタンクリック）
    closeModal(hintModal);
});

// 背景クリック
window.addEventListener("click", function (event) {
    elemId_answer.focus();                                      // 入力欄にフォーカス
    if (event.target === rangeModal) {                          // 設定モーダル
        closeModal(rangeModal);
    } else if (event.target === hintModal) {                    // ヒントモーダル
        closeModal(hintModal);
    } else {
    }
});

// 初回の問題を生成
let num1, num2, correctAnswer;
let tens1, ones1, tens2, ones2;

generateQuestion();
