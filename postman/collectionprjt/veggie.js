
function initializeVeggieApp() {
    const veggieList = document.getElementById("veggieList");
    const veggieForm = document.getElementById("veggieForm");
    const message = document.getElementById("message");
    const nameInput = document.getElementById("name");

    if (!veggieList || !veggieForm || !message || !nameInput) {
        console.error("Expected #veggieList, #veggieForm, #message, and #name elements in the page.");
        return;
    }

    async function loadVeggies() {
        try {
            const response = await fetch("/veggies");
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const veggies = await response.json();

            veggieList.innerHTML = "";
            veggies.forEach(veggie => {
                const title = document.createElement("h3");
                title.textContent = veggie.name;

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-button";
                deleteButton.addEventListener("click", () => deleteVeggie(veggie.id));

                veggieList.append(title, deleteButton);
            });
        } catch (error) {
            message.textContent = "Unable to load veggies. Make sure the server is running.";
            console.error("Loading veggies failed:", error);
        }
    }

    veggieForm.addEventListener("submit", async event => {
        event.preventDefault();
        const name = nameInput.value.trim();
        if (!name) {
            message.textContent = "Please enter a veggie name.";
            return;
        }

    fetch("/veggies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
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
 });
}
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
initializeVeggieApp();