let lowValue;
let highValue;
let numbers = [];

/// range button click event listener
document.getElementById("setRangeButton").addEventListener("click", function () {
    /// etablish high and low values from input fields
    lowValue = Number(document.getElementById("low").value);
    highValue = Number(document.getElementById("high").value);
/// make sure the low value is less than the high value
    if (lowValue >= highValue) {
        document.getElementById("rangeMessage").textContent =
            "make sure the low number is the lowest";
    } else {
        document.getElementById("rangeMessage").textContent =
            "Range set from " + lowValue + " to " + highValue + ".";

        numbers = [];
        /// clear the numbers, mean, and median displays
        document.getElementById("numbers").textContent = "";
        document.getElementById("mean").textContent = "";
        document.getElementById("median").textContent = "";
    }
});
document.getElementById("addNumberButton").addEventListener("click", function () {
    let input = Number(document.getElementById("numberInput").value);
    /// check if the input is a number
    if (isNaN(input)) {
        document.getElementById("inputMessage").textContent =
            "enter a valid number.";
    } else {
/// check if the input is within the range
    if (lowValue == null || highValue == null) {
    document.getElementById("inputMessage").textContent =
        "set a range first.";
    } else if (input < lowValue || input > highValue) {
        document.getElementById("inputMessage").textContent =
            "enter a number between " + lowValue + " and " + highValue + ".";
    } else {
        numbers.push(input);
/// message that the number was added successfully
        document.getElementById("inputMessage").textContent =
            input + " was added successfully.";

        document.getElementById("numberInput").value = "";

        calculateResults();
    }
    }
});

function calculateResults() {

    document.getElementById("numbers").textContent = numbers.join(", ");
    /// mean
    let total = 0;

    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }

    let mean = total / numbers.length;

    document.getElementById("mean").textContent = mean;

    // median fix!!!!
    let sortedNumbers = numbers.slice().sort(function (a, b) {
        return a - b;
    });

    let middle = Math.floor(sortedNumbers.length / 2);
    let median;

    if (sortedNumbers.length % 2 === 0) {
        median = (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
    } else {
        median = sortedNumbers[middle];
    }

    document.getElementById("median").textContent = median;
}
