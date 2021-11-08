let apiKey = "485e84787811d6e504c528765edb36fe";
let city = "Berlin";
let unit = "metric";
let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
let form = document.querySelector("#city-search");
let fahrenheit = document.querySelector("#fahrenheit");
let celcius = document.querySelector("#celcius");
let celciusTemperature = null;

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
  let date = new Date(timestamp);
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
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

  celciusTemperature = response.data.main.temp;

  temperature.innerHTML = Math.round(celciusTemperature);
  city.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  dateTime.innerHTML = formatDateTime(response.data.dt * 1000);
  icon.setAttribute("src", iconURL);
  icon.setAttribute("alt", response.data.weather[0].description);
  updateForecast();
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
  celcius.classList.remove("active");
  fahrenheit.classList.add("active");
}

function updateToCelcius(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = Math.round(celciusTemperature);
  celcius.classList.add("active");
  fahrenheit.classList.remove("active");
}

function updateForecast() {
  let forecast = document.querySelector("#weather-forecast");

  let days = ["Tue", "Wed", "Thu", "Fri", "Sat"];

  let forecastHTML = `<div class="WeatherForecast row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
        <div class="col">
            <div class="WeatherForecastPreview">
                <div class="forecast-time" id="day3">${day}</div>
                  <canvas width="38" height="38"></canvas>
                  <div class="forecast-temperature">
                    <span class="forecast-temperature-max">9°</span>
                    <span class="forecast-temperature-min">7°</span>
                  </div>
            </div>
        </div>
  `;
  });

  forecast.innerHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

axios.get(apiURL).then(updateTemperature);
form.addEventListener("submit", citySubmit);
fahrenheit.addEventListener("click", updateToFahrenheit);
celcius.addEventListener("click", updateToCelcius);
search("Berlin");
