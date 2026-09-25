//js object
const palindromeChecker = {
    word: "",
    algorithm: 0,
    caseSensitive:false,

    // alogrithm 1
    algorithm1: function(word) {
        let reverse ="";
        for (let i = word.length -1; i>= 0; i--) {
            reverse += word[i];
        }
        return word === reverse;
    },
    algorithm2: function(word) {
        let left =0;
        let right = word.length - 1;
        while(left < right){
            if (word[left] !== word[right]) {
                return false;
            }
        left++;
        right--;
        }
        return true;
    },
    algorithm3: function(word){
        return word.split("").reverse().join('')===word;
    }

};
//js form
const form = document.getElementById("palindromeForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const word = document.getElementById("word").value.trim();
    const algorithm = document.getElementById("algorithm").value;
    const caseSensitive =
    document.getElementById("caseSensitive").checked;
    const message = document.getElementById("message");
    // validation
    if (word === "") {
        message.innerHTML = 
        <div class="danger">select algorithm 1,2, or 3</div>;
        return;
    }
    if (algorithm!=="1" && algorithm!=="2" && algorithm!=="3"){
        message.innerHTML = 
        <div class="danger">select algorithm 1,2, or 3</div>;
        return;
    }  

// case sensitivty
let testWord = word;
if (!caseSensitive) {
    testWord = word.toLowerCase();
}
palindromeChecker.word = testWord;
palindromeChecker.algorithm = algorithm;
palindromeChecker.caseSensitive = caseSensitive;
let result;
if (algorithm === "1") {
    result = palindromeChecker.algorithm1(testWord);
    addResult(
        "algorithm1Results",
        word,
        result
    );
    } else if (algorithm === "2") {
        result = palindromeChecker.algorithm2(testWord);
        addResult(
            "algorithm2Results",
            word,
            result
        );
    } else {
        result = palindromeChecker.algorithm3(testWord);
        addResult(
            "algorithm3Results",
            word,
            result
        );
    }

message.innerHTML = `<div class="success">">Palindrome check completed!</div>`;
});
function addResult(listID, word, result) {
    const list = document.getElementById(listID);
    const item = document.createElement("li");
    if (result) {
        item.textContent = word + " is a palindrome.";
    }
    list.appendChild(item);
}