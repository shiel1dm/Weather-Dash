const searchHistory = [];
var apiRoot = 'https://api.openweathermap.org';
const apiKey = 'a2c548ada840c55d400c1f48446c1b5a';

var form = document.querySelector('#form');
var userInput = document.querySelector('#user-input')
var current = document.querySelector('#current')
var history = document.querySelector('#history')

function createCard(forecast){
  const temp = forecast.temp
  
  //variables to set card for api data.
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var tempText = document.createElement('p');
  var windText = document.createElement('p');
  var humidityText = document.createElement('p');
  var uvInfo = document.createElement('p');

  card.setAttribute('class', 'block')
  cardBody.setAttribute('class', 'container is-fluid has-background-primary')
  card.append(cardBody)

  //heading.textContent = `${temp}`  This was just a test.

  cardBody.append(heading)

  current.innerHTML = '' //empties previous content on a new search.
  current.append(card)

}

function weatherFetch(location){
  var apiCall = `${apiRoot}/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`

fetch(apiCall)
  .then(function (res) {
    return res.json();
  })
  .then(function(data) {
    console.log(data.main, data) //test purposes
    createCard(data.main)
  })
  .catch(function (err) {
    console.error(err);
  })

}

function submitHandle(event) {
  if (!userInput.value){
    return;
  }
  
event.preventDefault();
var input = userInput.value.trim();
console.log(input)

weatherFetch(input)

}

form.addEventListener('submit', submitHandle)