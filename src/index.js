import './style.css'; // Import the CSS file
import { format } from 'date-fns';

const resultContainer = document.querySelector('#result-container');
const errorContainer = document.querySelector('#error-container');
const searchContainer = document.querySelector('#search-container');

const searchBar = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-button');

const location = document.querySelector('#location');
const dateToday = document.querySelector('#date-today');
const lastUpdated = document.querySelector('#last-updated');

const today = document.querySelector('#today');
const tomorrow = document.querySelector('#tomorrow');
const dayAfterTomorrow = document.querySelector('#day-after-tomorrow');

searchButton.addEventListener('click', fetchLocation);

// create async function
async function fetchLocation() {
  try {
    // prepare searchValue for api
    let searchValue = searchBar.value.replace(' ', '-').toLowerCase();
    const response = await fetch(
      'http://api.weatherapi.com/v1/current.json?key=e0b3e243fbb04b31a0891012240202&q=' +
        searchValue
    );

    const locationData = await response.json();

    resultContainer.style.display = 'flex';
    resultContainer.style.flex = '5';
    searchContainer.style.marginTop = '10vh';

    errorContainer.style.display = 'none';

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

    // weather forecast
    console.log('Fetching current weather data from API...');
    console.log(locationData);
  } catch (err) {
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'flex';
    errorContainer.style.display = 'flex';
    errorContainer.style.flex = '5';
    searchContainer.style.marginTop = '10vh';
    console.log(err);
  }
}
