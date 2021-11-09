let apiKey = "485e84787811d6e504c528765edb36fe";
let city = "Berlin";
let unit = "metric";
let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
let form = document.querySelector("#city-search");
let fahrenheit = document.querySelector("#fahrenheit");
let celcius = document.querySelector("#celcius");
let locateMe = document.querySelector("#locate-me");
let celciusTemperature = null;
let celciusForecast = [
  { max: 0, min: 0 },
  { max: 0, min: 0 },
  { max: 0, min: 0 },
  { max: 0, min: 0 },
  { max: 0, min: 0 },
];

function formatDateTime(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month = months[date.getMonth()];
  let dayNumber = date.getDate();
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${month} ${dayNumber}, ${year} at ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getWeatherForecast(coordinates) {
  let forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${unit}&appid=${apiKey}`;
  axios.get(forecastURL).then(updateForecast);
}

function updateTemperature(response) {
  let temperature = document.querySelector("#current-temperature");
  let city = document.querySelector("#current-city");
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let dateTime = document.querySelector("#date-time");
  let icon = document.querySelector("#day-weather-icon");
  let iconURL = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
  let searchedCity = response.data.name;

  celciusTemperature = response.data.main.temp;

  temperature.innerHTML = Math.round(celciusTemperature);
  city.innerHTML = searchedCity;
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  dateTime.innerHTML = formatDateTime(response.data.dt * 1000);
  icon.setAttribute("src", iconURL);
  icon.setAttribute("alt", response.data.weather[0].description);
  getWeatherForecast(response.data.coord);

  if (searchedCity === "Aiglun") {
    document.querySelector("#hidden-message").innerHTML = "Salut Nicoline !";
  } else if (searchedCity === "Amsterdam") {
    document.querySelector("#hidden-message").innerHTML = "Salut Coralie !";
  } else if (searchedCity === "Mignaloux-Beauvoir") {
    document.querySelector("#hidden-message").innerHTML = "Salut les parents !";
  }
}

function search(city) {
  let apiKey = "485e84787811d6e504c528765edb36fe";
  let unit = "metric";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiURL).then(updateTemperature);
}

function citySubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#submit-form");
  search(cityInput.value);
}

function updateToFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemp = Math.round((celciusTemperature * 9) / 5 + 32);
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = fahrenheitTemp;
  [0, 1, 2, 3, 4].forEach(function (index) {
    let dayMax = document.querySelector(`#max-${index}`);
    let dayMin = document.querySelector(`#min-${index}`);
    dayMax.innerHTML = Math.round((celciusForecast[index].max * 9) / 5 + 32);
    dayMin.innerHTML = Math.round((celciusForecast[index].min * 9) / 5 + 32);
  });
  celcius.classList.remove("active");
  fahrenheit.classList.add("active");
}

function updateToCelcius(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = Math.round(celciusTemperature);
  [0, 1, 2, 3, 4].forEach(function (index) {
    let dayMax = document.querySelector(`#max-${index}`);
    let dayMin = document.querySelector(`#min-${index}`);
    dayMax.innerHTML = Math.round(celciusForecast[index].max);
    dayMin.innerHTML = Math.round(celciusForecast[index].min);
  });
  celcius.classList.add("active");
  fahrenheit.classList.remove("active");
}

function updateForecast(response) {
  let forecast = document.querySelector("#weather-forecast");
  let forecastSource = response.data.daily;

  let forecastHTML = `<div class="WeatherForecast row">`;
  forecastSource.forEach(function (dailyForecast, index) {
    if (index < 5) {
      celciusForecast[index] = {
        max: dailyForecast.temp.max,
        min: dailyForecast.temp.min,
      };
      forecastHTML += `
        <div class="col">
            <div class="WeatherForecastPreview">
                <div class="forecast-time" id="day3">${formatDay(
                  dailyForecast.dt
                )}</div>
                  <img src="http://openweathermap.org/img/wn/${
                    dailyForecast.weather[0].icon
                  }@2x.png" alt="${
        dailyForecast.weather[0].description
      }" class="forecast-icon" 
                  width="64" height="64"/>
                  <div class="forecast-temperature">
                    <span class="forecast-temperature-max" id="max-${index}">${Math.round(
        dailyForecast.temp.max
      )}</span><span>°
                      </span>
                    <span class="forecast-temperature-min" id="min-${index}">${Math.round(
        dailyForecast.temp.min
      )}<span>°</span></span>
                  </div>
            </div>
        </div>
  `;
    }
  });

  forecast.innerHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function retrievePosition(position) {
  let apiKey = "6810fbd82d0a172a870e47bd04543f6c";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(updateTemperature);
}

function updateLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

axios.get(apiURL).then(updateTemperature);
form.addEventListener("submit", citySubmit);
fahrenheit.addEventListener("click", updateToFahrenheit);
celcius.addEventListener("click", updateToCelcius);
locateMe.addEventListener("click", updateLocation);
search("Berlin");
