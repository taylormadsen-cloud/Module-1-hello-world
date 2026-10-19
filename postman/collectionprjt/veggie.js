
function initializeVeggieApp() {
    const veggieList = document.getElementById("veggieList");
    const veggieForm = document.getElementById("veggieForm");
    const message = document.getElementById("message");
    const nameInput = document.getElementById("name");

    if (!veggieList || !veggieForm || !message || !nameInput) {
        console.error("Expected #veggieList, #veggieForm, #message, and #name elements in the page.");
        return;
    }

    async function deleteVeggie(id) {
        try {
            const response = await fetch(`/veggies/${encodeURIComponent(id)}`, { method: "DELETE" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            message.textContent = "Veggie deleted successfully!";
            await loadVeggies();
        } catch (error) {
            message.textContent = "Unable to delete veggie. Please try again.";
            console.error("Deleting veggie failed:", error);
        }
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

        try {
            const response = await fetch("/veggies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
            message.textContent = "Veggie added successfully!";
            veggieForm.reset();
            await loadVeggies();
        } catch (error) {
            message.textContent = error.message || "Unable to add veggie. Please try again.";
            console.error("Adding veggie failed:", error);
        }
    });

    loadVeggies();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeVeggieApp);
} else {
    initializeVeggieApp();
}