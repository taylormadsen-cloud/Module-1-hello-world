const button = document.getElementById("duckButton");
const image = document.getElementById("duckImage");

button.addEventListener("click", function() {

    fetch("https://random-d.uk/api/v2/random")
        .then(response => response.json())
        .then(data => {
            image.src = data.url;
        });

});
