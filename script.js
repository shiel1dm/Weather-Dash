const searchHistory = [];
var apiRoot = 'https://api.openweathermap.org';
const apiKey = 'a2c548ada840c55d400c1f48446c1b5a';

var form = document.querySelector('#form');
var userInput = document.querySelector('#user-input')
var current = document.querySelector('#current')
var history = document.querySelector('#history')

function createCard(forecast, name, country, image){
  var temp = forecast.current.temp;
  var humidity = forecast.current.humidity;
  var name = name;
  var country = country;
  var windSpeed = forecast.current.wind_speed
  var UV = forecast.current.uvi

  var iconUrl = `https://openweathermap.org/img/w/${image.icon}.png`;
  var iconDescription = image.description || weather[0].main; 
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
  var uvBtn = document.createElement('button')//Wanted to use another method, b/c this is the same as the instructor file. But this is easiest option with the tools available.
  //If I had more time I would set my own css rules to create a custom banner/background. Perhaps w/ my own warning icons as well.

  card.setAttribute('class', 'block')
  cardBody.setAttribute('class', 'container is-fluid has-background-primary')
  icon.setAttribute('src', iconUrl) //sets attribute and passes in relevent url
  icon.setAttribute('alt', iconDescription) //sets attribute and passes in alternative search variables
  card.append(cardBody)
  
  heading.textContent = `${name}, ${country}`
  heading.append(icon)

  
  
  uvInfo.textContent= `Todays UV index: `;
  uvBtn.classList.add('button')

  if(UV < 3){
    uvBtn.classList.add('is-success')
  } else if (UV < 7){
    uvBtn.classList.add('is-warning')
  }else{
    uvBtn.classList.add('is-danger')
  }
  //simple if statment checking the UV variable against my values, and changing the button color via bulma.

  uvBtn.textContent= UV;
  uvInfo.append(uvBtn);
  cardBody.append(heading, tempText, windText, humidityText, uvInfo)

  tempText.textContent= `Current Temp: ${temp} ℉`
  windText.textContent= `Wind speed: ${windSpeed} MPH`
  humidityText.textContent= `Today's humidity: ${humidity}%`

  current.innerHTML = '' //empties previous content on a new search.
  current.append(card)

}

function weatherFetch(location, lat, lon) {
  var lat = lat
  var lon = lon
 
  var apiCall = `${apiRoot}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`

fetch(apiCall)
  .then(function (res) {
    return res.json();
  })
  .then(function(data) {
    console.log(data) //test purposes
    //I still need humididty, wind speed, UV index.
    
    createCard(data, location.name, location.sys.country, data.current.weather[0])
  })
  .catch(function (err) {
    console.error(err);
  })

}

function Coords(input){
  var apiCall = `${apiRoot}/data/2.5/weather?q=${input}&units=imperial&appid=${apiKey}`

  fetch(apiCall)
    .then(function (res) {
      return res.json()
    })
    .then(function(data){
      weatherFetch(data, data.coord.lat, data.coord.lon)
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

Coords(input)

}

form.addEventListener('submit', submitHandle)