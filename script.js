'use strict';

const cityNameInput = document.querySelector('#cityName');
const submitBtn = document.querySelector('#cityName + button');
const degreesSwitch = document.querySelector('.degrees-switch input');

degreesSwitch.addEventListener('input', chooseTempScale);
submitBtn.addEventListener('click', searchForCity);


let scale = 'F';
let data;

initializePage();

function chooseTempScale(e) {
    if (e.currentTarget.checked === false) {
        scale = 'F';
    } else {
        scale = 'C';
    }

    if (data) data.then(renderText);
}

function initializePage() {
    data = getWeatherDataForCity('New York').then(data => {
        renderText(data);
        renderCurrentWeatherImg(data);
        return data;
    }).catch(err => console.error(err));
}

function searchForCity(e) {
    e.preventDefault();
    data = getWeatherDataForCity(cityNameInput.value).then(data => {
        renderText(data);
        renderCurrentWeatherImg(data);
        return data;
    }).catch(err => console.error(err));
}



function renderText(data) {
    const cityName = document.querySelector('.current-city-name > div');
    const currentDataTime = document.querySelector('.current-data-time > div');
    const currentTemp = document.querySelector('.current-temp > div');
    const currentDescription = document.querySelector('.current-description > div');
    const currentHumidity = document.querySelector('.current-humidity > div');
    const currentFeelsLike = document.querySelector('.current-feels-like > div');
    const currentWindSpeed = document.querySelector('.current-wind-speed > div');
    const precipitationNextHour = document.querySelector('.precipitation-next-hour > div');
    
    const dateOptions = { dateStyle: 'full', timeStyle: 'short' };

    // The API request fetches the temp values in  F, so only need to calculate C
    const currentTempValue = convertTempToChosenScaleAndRound(data.currentTemperature);
    const currentFeelsLikeValue = convertTempToChosenScaleAndRound(data.currentFeelsLike);
    const degrees = '°' + scale; 

    cityName.textContent = data.cityName;
    currentDataTime.textContent = new Date(data.utcTimeOfData * 1000).toLocaleString(undefined, dateOptions);
    currentTemp.textContent = currentTempValue + ' ' + degrees;
    currentDescription.textContent = data.currentDescription.includes(' ') ? data.currentDescription.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') : data.currentDescription[0].toUpperCase() + data.currentDescription.slice(1);
    currentHumidity.textContent = data.currentHumidity + ' %';
    currentFeelsLike.textContent = currentFeelsLikeValue + ' ' + degrees;
    currentWindSpeed.textContent = data.currentWindSpeed + ' mph';
    precipitationNextHour.textContent = data.precipitationNextHour + ' %';

    const dailyForecastDiv = document.querySelector('.daily-forecast');
    const hourlyForecastDiv = document.querySelector('.hourly-forecast');
    data.dailyData.forEach((day, index) => {
        if (dailyForecastDiv.children.length >= 0 && dailyForecastDiv.children.length <= 6) {
            const singleDay = document.createElement('div');
            const nameOfDayDiv = document.createElement('div');
            let nameOfDay;
            if (new Date(day.dayTime * 1000).getDate() === new Date().getDate()) {
                nameOfDay = 'Today';
            } else {
                nameOfDay = new Date(day.dayTime * 1000).toLocaleDateString(undefined, { weekday: 'long' });
            }
            nameOfDayDiv.textContent = nameOfDay;
            nameOfDayDiv.className = `nameOfDay day${index}`;
            const maxTemp = document.createElement('div');
            const dailyMaxTempValue = convertTempToChosenScaleAndRound(day.maxTemp);
            maxTemp.textContent = dailyMaxTempValue + ' ' + degrees;
            maxTemp.className = `maxTemp day${index}`;
            const minTemp = document.createElement('div');
            const dailyMinTempValue = convertTempToChosenScaleAndRound(day.minTemp);
            minTemp.textContent = dailyMinTempValue + ' ' + degrees;
            minTemp.className = `minTemp day${index}`;
            const icon = document.createElement('img');
            icon.src = `http://openweathermap.org/img/wn/${day.iconId}@2x.png`;
            icon.className = `icon day${index}`;
            singleDay.append(nameOfDayDiv, maxTemp, minTemp, icon);
            dailyForecastDiv.append(singleDay);
        } else {
            const maxTemp = document.getElementsByClassName(`maxTemp day${index}`)[0];
            const dailyMaxTempValue = convertTempToChosenScaleAndRound(day.maxTemp);
            maxTemp.textContent = dailyMaxTempValue + ' ' + degrees;
            const minTemp = document.getElementsByClassName(`minTemp day${index}`)[0];
            const dailyMinTempValue = convertTempToChosenScaleAndRound(day.minTemp);
            minTemp.textContent = dailyMinTempValue + ' ' + degrees;
            let nameOfDay;
            if (new Date(day.dayTime * 1000).getDate() === new Date().getDate()) {
                nameOfDay = 'Today';
            } else {
                nameOfDay = new Date(day.dayTime * 1000).toLocaleDateString(undefined, { weekday: 'long' });
            }           
            const nameOfDayDiv = document.getElementsByClassName(`nameOfDay day${index}`)[0];
            nameOfDayDiv.textContent = nameOfDay;
            nameOfDayDiv.className = `nameOfDay day${index}`;
            const icon = document.getElementsByClassName(`icon day${index}`)[0];
            icon.src = `http://openweathermap.org/img/wn/${day.iconId}@2x.png`;
            icon.className = `icon day${index}`;
        } 
    });
    data.hourlyData.forEach((hour, index) => {
        if (hourlyForecastDiv.children.length >= 0 && hourlyForecastDiv.children.length <= 24) {
            const singleHour = document.createElement('div');
            const time = document.createElement('div');
            time.className = `time hour${index}`;
            const timeValue = new Date(hour.hourTime * 1000).toLocaleTimeString(undefined, { hour: 'numeric', hour12: true, });
            time.textContent = timeValue;
            const temp = document.createElement('div');
            temp.className = `temp hour${index}`;
            const tempValue = convertTempToChosenScaleAndRound(hour.hourTemp);
            temp.textContent = tempValue + ' ' + degrees;
            const icon = document.createElement('img');
            icon.src = `http://openweathermap.org/img/wn/${hour.iconId}@2x.png`;
            icon.className = `icon hour${index}`;
            singleHour.append(time, temp, icon);
            hourlyForecastDiv.append(singleHour);

        }
    });
}

function renderCurrentWeatherImg(data) {
    const currentImg = document.querySelector('.current-img');
    getWeatherImg(data.currentDescription).then(url => currentImg.src = url);
}

function convertTempToChosenScaleAndRound(value) {
    return scale === 'F' ? Math.round(value) : Math.round(Number(((value - 32) * (5/9)).toFixed(2)));
}

async function getWeatherDataForCity(cityName) {

    const responseCurrentWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=72e691cc8e68804d3b51462e3f5c963f`, { mode: 'cors' });
    const dataCurrentWeather = await responseCurrentWeather.json();

    const longitude = dataCurrentWeather.coord.lon;
    const latitude = dataCurrentWeather.coord.lat;

    const responseHourlyAndDaily = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=current,minutely,alerts&appid=72e691cc8e68804d3b51462e3f5c963f`, { mode: 'cors' });
    const dataHourlyAndDaily = await responseHourlyAndDaily.json();
    
    const dataObj = makeUsefulWeatherDataObj(dataCurrentWeather, dataHourlyAndDaily);
   
    return dataObj;
}


function makeUsefulWeatherDataObj(dataCurrentWeather, dataHourlyAndDaily) {

    return {
        currentTemperature: dataCurrentWeather.main.temp,
        currentFeelsLike: dataCurrentWeather.main.feels_like,
        currentHumidity: dataCurrentWeather.main.humidity,
        currentWindSpeed: dataCurrentWeather.wind.speed,
        utcTimeOfData: dataCurrentWeather.dt,
        currentWeatherCategory: dataCurrentWeather.weather[0].main,
        currentDescription: dataCurrentWeather.weather[0].description,
        cityName: dataCurrentWeather.name,
        dailyData: dataHourlyAndDaily.daily.slice(0,7).map(day => {
            return { iconId: day.weather[0].icon, maxTemp: day.temp.max, minTemp: day.temp.min, description: day.weather[0].description, category: day.weather[0].main, dayTime: day.dt};
        }),
        hourlyData: dataHourlyAndDaily.hourly.slice(0,24).map(hour => {
            return { iconId: hour.weather[0].icon, hourTime: hour.dt, hourTemp: hour.temp, hourCategory: hour.weather[0].main };
        }),
        precipitationNextHour: dataHourlyAndDaily.hourly[0].pop,       
    };
}

async function getWeatherImg(weatherDescription) {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=yAhCNvI0f6znmTUpEGMtSmH48m1iAzKU&s=${weatherDescription}`, { mode: 'cors'} );
    const json = await response.json();
    const gifObj = json.data;
    console.log(gifObj);
    return gifObj.images.fixed_height.url;
}








