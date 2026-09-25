//js object
const palindromeChecker = {

    word: "",
    algorithm: 0,
    caseSensitive: false,

    // ALGORITHM 1
    // Reverses the word and compares it to itself.
    algorithm1: function(word) {
        let reverse = "";
/// "--" subtracts 1 from the index
        for (let i = word.length - 1; i >= 0; i--) {
            reverse += word[i];
        }
/// "===" returns false instead of true
        return word === reverse;
    },
    // ALGORITHM 2
    // Compares the first and last characters,
    // then moves toward the middle. meet in the middle method dont worry about odd numbers
    algorithm2: function(word) {
        let left = 0;
        let right = word.length - 1;

        while (left < right) {

            if (word[left] !== word[right]) {
                return false;
            }
/// "++" adds 1 to the index
            left++;
            right--;
        }

        return true;
    },
    // ALGORITHM 3
    // choice of third algorithm, Use split(), reverse(), and join().
    algorithm3: function(word) {
        return word.split("").reverse().join("") === word;
    }
};
const form = document.getElementById("form");
// using form This gets the form from the HTML and responds on buttom

/// event listener waits for click @vs ai<form id="form"><form id="form">
form.addEventListener("submit", function(event) {

    // stops page from refreshing when the form submits
    event.preventDefault();

    // Get the values entered by the user
    const word = document.getElementById("word").value.trim();
    const algorithm = document.getElementById("algorithm").value;
    // case-sensitive or case-insensitive.
    const caseSensitive =
        document.getElementById("caseSensitive").checked;
//.checked gets check box from html #boolean
    // Get the message area from the HTML
    const message = document.getElementById("message");
    // VALIDATION
    if (word === "") {

        message.innerHTML =
            '<div class="alert alert-danger">Please enter a word.</div>';

        return;
    }
// Validate that algorithm 1 or 2 or 3

    if (
        algorithm !== "1" &&
        algorithm !== "2" &&
        algorithm !== "3"
    ) {

        message.innerHTML =
            '<div class="alert alert-danger">Please select algorithm 1, 2, or 3.</div>';

        return;
    }
    // case-sensitive or not if selected the wordconverted to lowercase before being checked.

    let testWord = word;

    if (!caseSensitive) {
        testWord = word.toLowerCase();
    }
    // store values in js

    palindromeChecker.word = testWord;
    palindromeChecker.algorithm = algorithm;
    palindromeChecker.caseSensitive = caseSensitive;
    // store the result
    let result;

    // Choosing algorithm

    if (algorithm === "1") {

        // Run Algorithm 1
        result = palindromeChecker.algorithm1(testWord);

        // Put result in Algorithm 1 list
        addResult(
            "algorithm1Results",
            word,
            result
        );

    } else if (algorithm === "2") {

        // Run Algorithm 2
        result = palindromeChecker.algorithm2(testWord);

        // Put result in Algorithm 2 list
        addResult(
            "algorithm2Results",
            word,
            result
        );

    } else {

        // Run Algorithm 3
        result = palindromeChecker.algorithm3(testWord);

        // Put result in Algorithm 3 list
        addResult(
            "algorithm3Results",
            word,
            result
        );
    }
    // success message, Bootstrap alert class to enhance the UI.
    message.innerHTML =
        '<div class="alert alert-success">Palindrome check completed!</div>';      
});
// Results, function adds the result to the correct list depends on algorithm selected
function addResult(listID, word, result) {

    // Get the correct list from the HTML
    const list = document.getElementById(listID);

    // new list item
    const item = document.createElement("li");
    // DISPLAY WHETHER OR NOT THE WORD IS A PALINDROME
    if (result) {

        item.textContent = word + " is apalindrome.";

    } else {

        item.textContent = word + "NOT palindrome.";
    }
    // Add the result to the right list
    list.appendChild(item);
}
