import getCity from "./currentLocation.js";
import getCityPhotoURL from "./cityPhoto.js";

const searchBtn = document.querySelector(".search-icon");
const cityInput = document.querySelector(".search-input");
const weatherSummary = document.querySelector(".weather-summary-container");
const noCityFoundContainer = document.querySelector(".no-city-found-container");
const tempVal = document.querySelector(".temperature");
const humidityVal = document.querySelector(".humidity");
const windSpeedVal = document.querySelector(".wind-speed");
const weatherVal = document.querySelector(".weather-info");
const locationVal = document.querySelectorAll(".location");
const temperatureImg = document.querySelector(".temperature-img");
const forecastSection = document.querySelector(".forecast-section");
const currentLocationBtn = document.querySelector(".current-location-icon");

const dateVal = document.querySelectorAll(".current-date");

const apiKey = "36961022d8f534feb5b95f14be590dc6";
let currCity = await getCity();

const getTimeFromOffset = (offsetInSeconds) => {
    const now = new Date();
    const localTime = new Date(now.getTime() + offsetInSeconds * 1000);
    localTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const updateCurrentDate = () => {
    const updateDate = () => {
        const date = new Date();
        const time = date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        // Format date
        const formattedDate = `${time} - ${date.toLocaleString("en-US", {
            weekday: "long",
        })}, ${date.getDate()} ${date.toLocaleString("en-US", {
            month: "short",
        })} ${date.getFullYear()}`;
        dateVal.forEach((x) => {
            x.innerText = formattedDate;
        });
    };

    updateDate();
    setInterval(updateDate, 60000);
};

async function getData(endPoint) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${currCity}&appid=${apiKey}&units=metric`;

    console.log(apiURL);

    try {
        const response = await fetch(apiURL);
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

const getTemperatureImg = (id) => {
    if (id <= 232) return "thunderstorms";
    else if (id <= 321) return "drizzle";
    else if (id <= 531) return "rain";
    else if (id <= 622) return "snow";
    else if (id <= 781) return "atmosphere";
    else if (id === 800) return "clear";
    else return "clouds";
};

const updateWeatherUI = async () => {
    const weatherData = await getData("weather");

    if (weatherData.cod != 200) {
        alert("Enter a valid city");
        return;
    }

    const {
        name: city,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
        timezone,
    } = weatherData;

    tempVal.innerText = temp.toFixed(1);
    humidityVal.innerText = humidity;
    windSpeedVal.innerText = speed;
    if (city.length >= 8) {
        locationVal[0].style.fontSize = "75px"; // or any smaller size you prefer
        locationVal[0].style.lineHeight = "60px";
    } else {
        locationVal[0].style.fontSize = "100px"; // default size
        locationVal[0].style.lineHeight = "80px";
    }
    locationVal.forEach((x) => {
        x.innerText = city;
    });
    weatherVal.innerText = main;

    const imageUrl = await getCityPhotoURL(city);
    const img = new Image();
    img.src = imageUrl;

    console.log(imageUrl);

    // Wait for the image to fully load before applying as background
    img.onload = () => {
        document.body.style.backgroundImage = `url("${imageUrl}")`;
        // document.body.style.backgroundSize = "cover";
        // document.body.style.backgroundPosition = "center";
        console.log("Background image successfully set.");
    };

    img.onerror = () => {
        console.error("Failed to load background image:", imageUrl);
    };

    temperatureImg.setAttribute(
        "src",
        `assets/weather/${getTemperatureImg(id)}.svg`
    );
    temperatureImg.setAttribute("alt", main);

    await updateForecastUI();

    noCityFoundContainer.style.display = "none";
    weatherSummary.style.display = "block";
};

const updateForecastUI = async () => {
    const forecastData = await getData("forecast");

    if (forecastData.cod != 200) {
        forecastSection.style.display = "none";
        return;
    }

    const timeTaken = "12:00:00";

    const todayDate = new Date().toISOString().split("T")[0];

    forecastSection.innerHTML = "";

    let n = 4;

    forecastData.list.forEach((forecastWeather) => {
        if (
            n != 0 &&
            forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)
        ) {
            n--;

            const {
                main: { temp },
                weather: [{ id, main }],
                dt_txt: dateString,
            } = forecastWeather;

            const actualDate = new Date(dateString);

            const formattedDate = `${actualDate.getDate()} ${actualDate.toLocaleString(
                "en-US",
                { month: "short" }
            )}`;

            forecastSection.innerHTML += `
            <div class="forecast-container">
                    <img src="assets/weather/${getTemperatureImg(
                id
            )}.svg" alt="${main}" class="temperature-img small">
                    <div class="day-info">
                        <p class="day-date">${formattedDate}</p>
                        <p class="day-temperature-info"><span class="day-temperature">${temp.toFixed(
                1
            )}</span>° C</p>
                    </div>
                </div>
            `;
        }
    });
};

const handleSearch = async () => {
    if (cityInput.value.trim() !== "") {
        currCity = cityInput.value.trim().toLowerCase();
        await updateWeatherUI();
    }
    cityInput.value = "";
    cityInput.blur();
};

searchBtn.addEventListener("click", handleSearch);

currentLocationBtn.addEventListener("click", async () => {
    currCity = await getCity();
    await updateWeatherUI();
});

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
});

updateCurrentDate();
updateWeatherUI();
