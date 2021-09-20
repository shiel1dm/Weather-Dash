const searchHistory = [];
var apiRoot = 'https://api.openweathermap.org';
const apiKey = 'a2c548ada840c55d400c1f48446c1b5a';

var form = document.querySelector('#form');
var userInput = document.querySelector('#user-input')
var current = document.querySelector('#current')
var history = document.querySelector('#history')

function createCard(forecast, name, country, image, wind){
  var temp = forecast.temp;
  var humidity = forecast.humidity;
  var name = name;
  var country = country;
  var iconUrl = `https://openweathermap.org/img/w/${image.icon}.png`;
  var iconDescription = image.description || weather[0].main; 
  var windSpeed = wind
  /** This sets an alt search func, in case the url changes or breaks.
   * sets attribute alt to search for the JSON description, or search
   * for an icon based on the weather data recieved from our api call.
  */

  
  //variables to set card for api data.
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var icon = document.createElement('img');
  var tempText = document.createElement('p');
  var windText = document.createElement('p');
  var humidityText = document.createElement('p');
  var uvInfo = document.createElement('p');

  card.setAttribute('class', 'block')
  cardBody.setAttribute('class', 'container is-fluid has-background-primary')
  icon.setAttribute('src', iconUrl) //sets attribute and passes in relevent url
  icon.setAttribute('alt', iconDescription) //sets attribute and passes in alternative search variables
  card.append(cardBody)
  
  heading.textContent = `${name}, ${country}`
  heading.append(icon)

  cardBody.append(heading)
  tempText.textContent= `Current Temp: ${temp} ℉`
  windText.textContent= `Wind speed: ${windSpeed} MPH`
  humidityText.textContent= `Today's humidity: ${humidity}%`
  current.innerHTML = '' //empties previous content on a new search.
  current.append(card, tempText, windText, humidityText)

}

function weatherFetch(location){
  var apiCall = `${apiRoot}/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`

fetch(apiCall)
  .then(function (res) {
    return res.json();
  })
  .then(function(data) {
    console.log(data, data.main, data.name, data.sys.country, data.weather[0]) //test purposes
    //I still need humididty, wind speed, UV index.
    
    createCard(data.main, data.name, data.sys.country, data.weather[0], data.wind.speed, )
  })
  .catch(function (err) {
    console.error(err);
  })

}

function submitHandle(event) {
  if (!userInput.value){
    console.log('failed on click')
    return;
  }
  
event.preventDefault();
var input = userInput.value.trim();
console.log(input)

weatherFetch(input)

}

form.addEventListener('submit', submitHandle)