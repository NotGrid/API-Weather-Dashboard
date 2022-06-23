
// once data is called, display it on the screen
// when user clicks button, store input into local storage
var apiKey = 'a9d874db25b84f268b5f65d99fb0c620'
var searchButtonEl = $('#submit')
var pastCities = JSON.parse(localStorage.getItem('cities')) || []
var currentWeatherCityEl = $('#name');
var currentWeatherCondEl = $('#conditions');
var currentWeatherTempEl = $('#temperature');
var currentWeatherHumidityEl = $('#humidity');
var currentWeatherWindEl = $('#wind-speed');
var currentWeatherUVEl = $('#uv-index');
var currentWeatherDateEl = $('#date');
var city;
var fiveDayEl = $('#fiveDay');
var pastButtonEl = $('#pastButton');
function submitHandler() {
    console.log($(this).text())
    if ($(this).attr('id') === 'submit') {


        var userInputEl = $('#search-city').val()
        pastCities.push(userInputEl);
        localStorage.setItem('cities', JSON.stringify(pastCities));
        displayPastCities();

    } else {
        var userInputEl = $(this).text();
    }
    city = userInputEl;
    geocoding(userInputEl);
}
// call api for city and lon/lat
function geocoding(city) {
    var URL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey + ''
    fetch(URL).then(function (response) {
        return response.json()
    }).then(function (data) {
        console.log(data)
        weatherDataApi(data[0].lat, data[0].lon)
    })
}
function weatherDataApi(lat, lon) {
    var URL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial'
    fetch(URL).then(function (response) {
        return response.json()
    }).then(function (data) {
        console.log(data)
        displayCurrent(data.current);
        displayFiveDay(data.daily);
    })
}
// displays the overall current weather for the selected city
function displayCurrent(current) {
    currentWeatherCityEl.text(city.toUpperCase());
    currentWeatherDateEl.text(moment.unix(current.dt).format('MM/DD/YYYY'));
    currentWeatherCondEl.attr('src', 'https://openweathermap.org/img/wn/' + current.weather[0].icon + '@2x.png')
    currentWeatherTempEl.text('temp: ' + current.temp);
    currentWeatherHumidityEl.text('humidity: ' + current.humidity + '%');
    currentWeatherWindEl.text('wind: ' + current.wind_speed);
    currentWeatherUVEl.text('UV: ' + current.uvi);
}
// appends the 5 day forcast to the screen
function displayFiveDay(daily) {
    fiveDayEl.empty();
    for (var i = 1; i < 6; i++) {
        var divCard = $('<div>');
        divCard.addClass('column card');
        var divBottomCards = $('<div>');
        divBottomCards.addClass('bottom-cards');
        var h4Date = $('<h4>');
        h4Date.text(moment.unix(daily[i].dt).format('MM/DD/YYYY'));
        var h4Temp = $('<h4>');
        h4Temp.text('temp: ' + daily[i].temp.day);
        var h4Wind = $('<h4>');
        h4Wind.text('wind: ' + daily[i].wind_speed);
        var h4Humidity = $('<h4>');
        h4Humidity.text('humidity: ' + daily[i].humidity + '%');
        var iconImage = $('<img>');
        iconImage.attr('src', 'https://openweathermap.org/img/wn/' + daily[i].weather[0].icon + '@2x.png');
        divCard.append(divBottomCards, h4Date, h4Temp, h4Humidity, iconImage);
        fiveDayEl.append(divCard);
    }
} function displayPastCities() {
    pastButtonEl.empty();
    for (var i = 0; i < pastCities.length; i++) {
        var button = $('<button>');
        button.text(pastCities[i]);
        pastButtonEl.append(button);
    }
}

displayPastCities();
pastButtonEl.on('click', 'button', submitHandler);
searchButtonEl.on('click', submitHandler);
