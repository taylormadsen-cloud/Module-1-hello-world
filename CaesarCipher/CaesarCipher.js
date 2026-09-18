// ur mom
async function getBaconIpsum() { /// async allows fucntion to await and pause until the fetch is complete
    // api call string
    const apiUrl = "https://baconipsum.com/api/";

    // Get pp from html
    const paragraphCount = document.getElementById("newParagraphs").value;
    const baconType = document.getElementById("baconType").value;

    // Add params to the api call string
    const apiString = apiUrl + "?type=" + baconType + "&paras=" + paragraphCount;

    alert(apiString);  // Show string

    // Make api call links to async
    const response = await fetch(apiString);

    // taking from html
    document.getElementById("myRawData").innerHTML = "";
    document.getElementById("myFormattedData").innerHTML = "";
    document.getElementById("myEncryptedData").innerHTML = "";

    // Read JSON response
    const jsonData = await response.json();

    // Stringify put on raw json data on the page
    document.getElementById("myRawData").innerHTML =
        JSON.stringify(jsonData);

    // Loop for json pp one time
    for (const paragraph of jsonData) {
        document.getElementById("myFormattedData").innerHTML +=
            "<p>" + paragraph + "</p>";
    }

    // Combine 
    const baconText = jsonData.join(" ");

    // TextEncoder converts to bytes, btoa encodes the bytes in base64.
    const encodedText = new TextEncoder().encode(encodeURIComponent(baconText));
    let binaryText = "";
    for (const byte of encodedText) { 
        /// changes binary to string
        binaryText += String.fromCharCode(byte);
    }
    const encryptedData = btoa(binaryText);

    // Displayencrypted data
    document.getElementById("myEncryptedData").innerHTML = encryptedData;

    return true;
}