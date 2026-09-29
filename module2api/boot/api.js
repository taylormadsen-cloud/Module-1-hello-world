const duckButton = document.getElementById("duckButton");
const duckImage = document.getElementById("duckImage");
const message = document.getElementById("message");

duckButton.addEventListener("click", getDuck);

async function getDuck() {

    try {

        message.textContent = "Finding your duck.. ";

        const response = await fetch("https://random-d.uk/api/v2/random");

        const data = await response.json();

        duckImage.src = data.url;

        message.textContent = data.message || "Powered by random-d.uk";

    } catch (error) {

        message.textContent = "Sorry! We couldn't find a duck.";

    }
}
