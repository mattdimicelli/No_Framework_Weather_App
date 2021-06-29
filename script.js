'use strict';

//You should be able to search for a specific location and toggle 
// displaying the data in Fahrenheit or Celsius.
// You should change the look of the page based on the data


async function getWeatherDataForCity(cityName) {

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=72e691cc8e68804d3b51462e3f5c963f`, { mode: 'cors' });
    const data = await response.json();
    return data;
}


function makeUsefulWeatherDataObj(data) {
    return {
            weather: data.weather,
            main: data.main,
            name: data.name,
        };
}



getWeatherDataForCity('Tijuana').then(makeUsefulWeatherDataObj).then(console.log);
