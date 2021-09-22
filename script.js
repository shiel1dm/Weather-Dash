var searchHistory = [];
var apiRoot = 'https://api.openweathermap.org';
const apiKey = 'a2c548ada840c55d400c1f48446c1b5a';

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone)

//DOM
var form = document.querySelector('#form');
var userInput = document.querySelector('#user-input')
var current = document.querySelector('#current')
var srcHistory = document.querySelector('#history')

//functions
function renderHistory() {
  srcHistory.innerHTML = '';

  for(var i = searchHistory.length - 1; i >= 0; i--){
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('class','button is-small')
    btn.classList.add('historyBtn')
    btn.setAttribute('search-log', searchHistory[i]);
    btn.textContent = searchHistory[i];
    srcHistory.append(btn);
  }
}

function addSearch(search) {
  if(searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search)

  localStorage.setItem('search-history', JSON.stringify(searchHistory)) //creates item in local storage classified as search-history
  renderHistory()
}

function initHistory() {
  var storeSearch = localStorage.getItem('search-history')
  if(storeSearch) {
    searchHistory = JSON.parse(storeSearch)
  }
  renderHistory();
}

function createCard(forecast, name, image, timezone){
  var date = dayjs().tz(timezone).format('MM/DD/YYYY')
  
  var temp = forecast.current.temp;
  var humidity = forecast.current.humidity;
  var name = name;
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
  var dateText = document.createElement('p');
  var tempText = document.createElement('p');
  var windText = document.createElement('p');
  var humidityText = document.createElement('p');
  var uvInfo = document.createElement('p');
  var uvBtn = document.createElement('button')//Wanted to use another method, b/c this is the same as the instructor file. But this is easiest option with the tools available.
  //If I had more time I would set my own css rules to create a custom banner/background. Perhaps w/ my own warning icons as well.
  current.classList.remove('is-hidden')
  card.setAttribute('class', 'is-flex-grow-1')
  card.setAttribute('id','now')
  cardBody.setAttribute('class', 'container is-fluid col is-full')
  icon.setAttribute('src', iconUrl) //sets attribute and passes in relevent url
  icon.setAttribute('alt', iconDescription) //sets attribute and passes in alternative search variables
  card.append(cardBody)
  
  heading.textContent = `${name}`
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
  cardBody.append(heading, dateText, tempText, windText, humidityText, uvInfo)
  dateText.textContent= date

  tempText.textContent= `Current Temp: ${temp} ℉`
  windText.textContent= `Wind speed: ${windSpeed} MPH`
  humidityText.textContent= `Today's humidity: ${humidity}%`

  current.innerHTML = '' //empties previous content on a new search.
  current.append(card)

/**
 * This is a huge function. For now, this was the best method though, instead of passing my api data
 * through multiple functions. In a future update, I plan to use express and other npm packages to 
 * meet seperation of concern standards (using seperate files and exporting the needed functions on an index
 * or a routed page.)
 */
}

function renderForecast(forecast, timezone) {
  var unixTs = forecast.dt
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description || forecast.weather[0].main; 
  var temp = forecast.temp.day;
  var humidity = forecast.humidity;
  var windSpeed = forecast.wind_speed

  var forecast = document.querySelector('#forecast')
  
  var col = document.createElement('div')
  var card= document.createElement('div')
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  col.append(card)
  card.append(cardBody)
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl)

  col.setAttribute('class', 'col is-one-fifth has-background-info')
  col.classList.add('dailyForecast')
  card.setAttribute('id', 'forecastCard')

  cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('MM/DD/YY')
  weatherIcon.setAttribute('src', iconUrl)
  weatherIcon.setAttribute('alt', iconDescription)

  tempEl.textContent= `Temp: ${temp} ℉`
  windEl.textContent= `Wind speed: ${windSpeed}`
  humidityEl.textContent= `Humidity: ${humidity}%`

  forecast.append(col)
}

function fiveDay(dailyForecasts, timezone) {
  var startT = dayjs().tz(timezone).add(1, 'day').startOf('dat').unix();
  var endT = dayjs().tz(timezone).add(6, 'day').startOf('dat').unix();

  console.log(startT,endT)
  
  var forecastCard= document.createElement('div');
  var heading = document.createElement('h4');

  forecastCard.setAttribute('class', 'col is-full is-flex is-justify-content-space-between px-2')
  forecastCard.setAttribute('id', 'forecast')
  heading.textContent='Five-day forecast:'
  forecastCard.append(heading)

  current.append(forecastCard)

  for(var i = 0; i<dailyForecasts.length; i++){
    if(dailyForecasts[i].dt >= startT && dailyForecasts[i].dt < endT){
      renderForecast(dailyForecasts[i], timezone)
    }
  }

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
       
    createCard(data, location.name, data.current.weather[0], data.timezone)
    fiveDay(data.daily, data.timezone)
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
      addSearch(input)
      weatherFetch(data, data.coord.lat, data.coord.lon)
    })

}

function submitHandle(event) {
  if (!userInput.value){
    return;
  }
  
event.preventDefault();
var input = userInput.value.trim();

console.log(input)
Coords(input)
}

function historyClick(event){
  if(!event.target.matches('.historyBtn')){
    console.log('whoops')
    return;
  }

  var btn = event.target;
  var search = btn.getAttribute('search-log');

  Coords(search)
}

initHistory()
form.addEventListener('submit', submitHandle)
srcHistory.addEventListener('click', historyClick)