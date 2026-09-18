document.getElementById("getBacon").addEventListener("click", getBaconIpsum);

// Get Bacon Ipsum from the API
async function getBaconIpsum() {
    const apiUrl = "https://baconipsum.com/api/";
    const paragraphCount = document.getElementById("paragraphs").value;
    const baconType = document.getElementById("type").value;

    // Create the API request string
    const apiString = `${apiUrl}?type=${baconType}&paras=${paragraphCount}`;

    // Fetch the JSON data
    const response = await fetch(apiString);
    const jsonData = await response.json();

    // Show the raw JSON
    document.getElementById("rawJson").textContent = JSON.stringify(jsonData, null, 2);

    // Show the formatted paragraphs
    document.getElementById("formattedText").innerHTML = jsonData
        .map(paragraph => `<p>${paragraph}</p>`)
        .join("");

    // Convert the text to encoded binary, then to base64
    const baconText = jsonData.join(" ");
    const encodedText = new TextEncoder().encode(encodeURIComponent(baconText));
    let binaryText = "";

    for (const byte of encodedText) {
        binaryText += String.fromCharCode(byte);
    }

    // Display the encrypted text
    document.getElementById("encryptedText").textContent = btoa(binaryText);

    return true;
}