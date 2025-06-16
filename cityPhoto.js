

const accessKey = "DHnIsV8pJbROJpKqvCpEFSiDr0EH2WGetMSprslaMoY"

const getCityPhotoURL = async (city) => {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}&query=${city}&orientation=landscape`);
        const data = await response.json();
        console.log("Rate Limit Remaining:", response.headers.get("X-Ratelimit-Remaining"));
        return data.urls.regular;
    } catch (error) {
        console.error("Error:", error);
    }
}

export default getCityPhotoURL;

// getCityPhotoURL("delhi")

