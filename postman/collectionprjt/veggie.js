
const veggieList = document.getElementById("veggieList");
const veggieForm = document.getElementById("veggieForm");
const message = document.getElementById("message");

// Display all veggies
function loadVeggies() {
    fetch("/veggies")
        .then(response => response.json())
        .then(veggies => {
            veggieList.innerHTML = "";

            veggies.forEach(veggie => {
                const title = document.createElement("h3");
                title.textContent = veggie.name;
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-button";

                deleteButton.onclick = function () {
                    deleteVeggie(veggie.id);
                };

                veggieList.appendChild(title);
                veggieList.appendChild(deleteButton);
            });
        });
}

// Add a new veggie
veggieForm.onsubmit = function (event) {
    event.preventDefault();

    const newVeggie = {
        name: document.getElementById("name").value
    };

    fetch("/veggies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newVeggie)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                message.textContent = data.message;
                return;
            }

            message.textContent = "Veggie added successfully!";
            veggieForm.reset();
            loadVeggies();
        });
};

// Delete a veggie
function deleteVeggie(id) {
    fetch("/veggies/" + id, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(() => {
            message.textContent = "Veggie deleted successfully!";
            loadVeggies();
        });
}

// Load veggies when the page opens
loadVeggies();
