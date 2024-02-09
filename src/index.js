import './style.css'; // Import the CSS file
import { format, parseISO } from 'date-fns';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const resultContainer = document.querySelector('#result-container');
const errorContainer = document.querySelector('#error-container');
const searchContainer = document.querySelector('#search-container');
const weatherContainer = document.querySelector('#weather-container');

const searchBar = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-button');

const location = document.querySelector('#location');
const dateToday = document.querySelector('#date-today');
const lastUpdated = document.querySelector('#last-updated');

let firstValidSearch = true;

const DOM = DOMController();

const cards = document.querySelectorAll('.card');

// two event listeners to trigger location fetch
searchButton.addEventListener('click', fetchLocation);
searchBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    fetchLocation();
  }
});

// create async function
async function fetchLocation() {
  try {
    // prepare searchValue for api
    let searchValue = searchBar.value.replace(' ', '-').toLowerCase();
    const response = await fetch(
      'https://api.weatherapi.com/v1/forecast.json?key=e0b3e243fbb04b31a0891012240202&q=' +
        searchValue +
        '&days=3&aqi=no&alerts=no'
    );

    const locationData = await response.json();

    // if successful fetch, display weather
    // hide error message incase previous fetch returned error message
    DOM.displayWeather();
    DOM.hideErrorMessage();

    // console message
    console.log('Fetching current weather data from API...');
    console.log(locationData);

    location.textContent = `${locationData.location.name} - ${locationData.location.country}`;
    dateToday.textContent = new Date().toLocaleString('en-US', {
      timeZone: `${locationData.location.tz_id}`,
      weekday: 'long', // or 'short' for abbreviated weekday
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    lastUpdated.textContent = `Last updated: ${locationData.current.last_updated}`;

    // array of 3-day weather forecast
    const weatherForecast = [];
    locationData.forecast.forecastday.forEach((day) => {
      weatherForecast.push(day);
    });

    console.log(weatherForecast);

    for (let i = 0; i < weatherForecast.length; i++) {
      // clear DOM before
      if (firstValidSearch) {
        firstValidSearch = false;
      } else {
        DOM.removeChildrenExceptFirst(cards[i]);
      }

      let yearMonthDay = weatherForecast[i].date;
      let fullDate = new Date(yearMonthDay + 'T00:00'); // to create date object in local time
      const options = { weekday: 'long' };
      let weekday = new Intl.DateTimeFormat('en-US', options).format(fullDate);

      let condition = weatherForecast[i].day.condition.text; // condition

      let averageTempF = weatherForecast[i].day.avgtemp_f; // temp F
      let averageTempC = weatherForecast[i].day.avgtemp_c; // temp C
      console.log(`${averageTempF} °F | ${averageTempC} °C`);

      let windspeed = weatherForecast[i].day.maxwind_mph;
      let humidity = weatherForecast[i].day.avghumidity;
      console.log(`Wind: ${windspeed} mph`);
      console.log(`Humidity: ${humidity}%`);

      // section that handles populating the images
      let iconLink = weatherForecast[i].day.condition.icon;

      // weatherContainer.children[i].appendChild(weekday);
      DOM.populateWeatherDivs(
        weekday,
        condition,
        averageTempF,
        averageTempC,
        windspeed,
        humidity,
        iconLink,
        i
      );

      console.log('\n');
    }

    console.log('------------');
  } catch (err) {
    DOM.hideWeather();
    DOM.showErrorMessage();
    console.error(err);
  }
}

function DOMController() {
  function displayWeather() {
    searchContainer.style.marginTop = '10vh'; // for styling
    resultContainer.style.display = 'flex';
    resultContainer.style.flex = '5';
  }

  function hideWeather() {
    resultContainer.style.display = 'none';
  }

  function showErrorMessage() {
    searchContainer.style.marginTop = '10vh'; // for styling
    errorContainer.style.display = 'flex';
    errorContainer.style.flex = '5';
  }

  function hideErrorMessage() {
    errorContainer.style.display = 'none';
  }

  function removeChildrenExceptFirst(parent) {
    // Get the first child of the parent
    const firstChild = parent.firstChild;
    // 2nd condition to avoid removing last card's first header when cards are initially empty
    while (
      parent.childNodes.length > 1 &&
      parent.lastChild.textContent !== 'Day After Tomorrow'
    ) {
      parent.removeChild(parent.lastChild);
    }
  }

  function populateWeatherDivs(
    weekday,
    condition,
    averageTempF,
    averageTempC,
    windspeed,
    humidity,
    iconLink,
    index
  ) {
    const weekdayHeader = document.createElement('div');
    weekdayHeader.setAttribute('class', 'weekday');
    weekdayHeader.textContent = weekday;

    const conditionHeader = document.createElement('div');
    conditionHeader.setAttribute('class', 'condition');
    conditionHeader.textContent = condition;

    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'temp-container');

    const tempF = document.createElement('h2');
    const tempC = document.createElement('h2');
    const tempFButton = document.createElement('button');
    const tempCButton = document.createElement('button');

    tempF.textContent = `${averageTempF}`;
    tempF.setAttribute('class', 'fahren');

    tempC.textContent = `${averageTempC}`;
    tempC.setAttribute('class', 'celsius');

    tempFButton.setAttribute('class', 'fahren-button');
    tempFButton.classList.add('selected');
    tempFButton.textContent = `°F`;

    tempCButton.setAttribute('class', 'celsius-button');
    tempCButton.textContent = `°C`;

    tempDiv.appendChild(tempF);
    tempDiv.appendChild(tempC);
    tempDiv.appendChild(tempFButton);
    tempDiv.appendChild(tempCButton);

    const windHeader = document.createElement('div');
    windHeader.setAttribute('class', 'wind');
    windHeader.textContent = `Wind: ${windspeed} mph`;

    const humidityHeader = document.createElement('div');
    humidityHeader.setAttribute('class', 'humidity');
    humidityHeader.textContent = `Humidity: ${humidity}%`;

    let icon = new Image();
    icon.setAttribute('class', 'icon');
    icon.src = iconLink;

    // display with fahren first
    weatherContainer.children[index].classList.add('preferFahren');

    weatherContainer.children[index].appendChild(weekdayHeader);
    weatherContainer.children[index].appendChild(conditionHeader);
    weatherContainer.children[index].appendChild(tempDiv);
    weatherContainer.children[index].appendChild(windHeader);
    weatherContainer.children[index].appendChild(humidityHeader);
    weatherContainer.children[index].appendChild(icon);
  }

  // handle DOM selection, highlighting, and display of Fahren and Celsius temperatures and buttons
  function updateTempMetric(event) {
    const answerCards = document.querySelectorAll('.card');
    const fahrenBtns = document.querySelectorAll('.fahren-button');
    const celsiusBtns = document.querySelectorAll('.celsius-button');

    if (event.target.classList.contains('fahren-button')) {
      answerCards.forEach((card) => {
        card.classList.add('preferFahren');
        card.classList.remove('preferCelsius');
        fahrenBtns.forEach((btn) => {
          btn.style.color = 'var(--text-color)';
        });
        celsiusBtns.forEach((btn) => {
          btn.style.color = 'var(--text-color-light)';
        });
      });
    }

    if (event.target.classList.contains('celsius-button')) {
      answerCards.forEach((card) => {
        card.classList.add('preferCelsius');
        card.classList.remove('preferFahren');
      });
      fahrenBtns.forEach((btn) => {
        btn.style.color = 'var(--text-color-light)';
      });
      celsiusBtns.forEach((btn) => {
        btn.style.color = 'var(--text-color)';
      });
    }
  }

  return {
    displayWeather,
    hideWeather,
    showErrorMessage,
    hideErrorMessage,
    removeChildrenExceptFirst,
    populateWeatherDivs,
    updateTempMetric,
  };
}

resultContainer.addEventListener('click', DOM.updateTempMetric);
