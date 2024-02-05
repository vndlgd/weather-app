import './style.css'; // Import the CSS file

const searchBar = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-button');
const locationHeader = document.querySelector('#location');

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
    if (locationData.location.country === 'United States of America') {
      // truncate USA string to be centered inside div
      locationData.location.country = locationData.location.country.substring(
        0,
        13
      );
    }
    // locationHeader.textContent = `${locationData.location.name} - ${locationData.location.country}`;
    console.log(locationData);
  } catch (err) {
    console.log(err);
  }
}
