'use strict';

const cityInput = document.querySelector('#city');
const submitBtn = document.querySelector('#city + button');
const degreesSwitch = document.querySelector('.degrees-switch input');
const dailyHourlySwitch = document.querySelector('.daily-hourly-switch input');
const dailyForecastDiv = document.querySelector('.daily-forecast');
const firstEightHoursDiv = document.querySelector('.first-eight-hours');
const secondEightHoursDiv = document.querySelector('.second-eight-hours');
const thirdEightHoursDiv = document.querySelector('.third-eight-hours');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const navDots = document.querySelector('.navigation-dots');
const dot1 = document.querySelector('.dot1');
const dot2 = document.querySelector('.dot2');
const dot3 = document.querySelector('.dot3');
const city = document.querySelector('.city > div');
const dataTime = document.querySelector('.data-time > div');
const currentTemp = document.querySelector('.current-temp > div');
const description = document.querySelector('.description > div');
const humidity = document.querySelector('.humidity > div');
const feelsLike = document.querySelector('.feels-like > div');
const windSpeed = document.querySelector('.wind-speed > div');
const precipitationNextHour = document.querySelector('.precipitation-next-hour > div');



degreesSwitch.addEventListener('input', chooseTempScale);
dailyHourlySwitch.addEventListener('input', changeForecast);
submitBtn.addEventListener('click', searchForCity);
navDots.addEventListener('click', cycleHours);



let scale = 'F';
let data;

initializePage();

function cycleHours(e) {
    if (e.target === leftArrow) {
        if (dot1.classList.contains('filled-in')) {
            fillDot3();
        } else if (dot2.classList.contains('filled-in')) {
            fillDot1();
        } else if (dot3.classList.contains('filled-in')) {
            fillDot2();
        }
    } else if (e.target === rightArrow) {
        if (dot1.classList.contains('filled-in')) {
            fillDot2();
        } else if (dot2.classList.contains('filled-in')) {
            fillDot3();
        } else if (dot3.classList.contains('filled-in')) {
            fillDot1();
        }
    } else if (e.target === dot1) {
        fillDot1();
    } else if (e.target === dot2) {
        fillDot2();
    } else if (e.target === dot3) {
        fillDot3();
    }
    function fillDot2() {
        dot2.classList.add('filled-in');
        dot1.classList.remove('filled-in');
        dot3.classList.remove('filled-in');
        firstEightHoursDiv.style.display = 'none';
        secondEightHoursDiv.style.display = 'flex';
        thirdEightHoursDiv.style.display = 'none';
    }
    function fillDot3() {
        dot3.classList.add('filled-in');
        dot1.classList.remove('filled-in');
        dot2.classList.remove('filled-in');
        firstEightHoursDiv.style.display = 'none';
        secondEightHoursDiv.style.display = 'none';
        thirdEightHoursDiv.style.display = 'flex';
    }
}

function fillDot1() {
    dot1.classList.add('filled-in');
    dot2.classList.remove('filled-in');
    dot3.classList.remove('filled-in');
    firstEightHoursDiv.style.display = 'flex';
    secondEightHoursDiv.style.display = 'none';
    thirdEightHoursDiv.style.display = 'none';
}

function changeForecast() {
    if (dailyHourlySwitch.checked === true) {
        show8HourForecast();
    } else {
        showDailyForecast();
    }
    function show8HourForecast() {
        dailyForecastDiv.style.display = 'none';
        navDots.style.display = 'flex';
        fillDot1();
    }
    function showDailyForecast() {
        dailyForecastDiv.style.display = 'flex';
        firstEightHoursDiv.style.display = 'none';
        secondEightHoursDiv.style.display = 'none';
        thirdEightHoursDiv.style.display = 'none';
        navDots.style.display = 'none';
    }
}

function chooseTempScale(e) {
    const degreesSwitch = e.currentTarget;
    if (degreesSwitch.checked === false) {
        scale = 'F';
    } else {
        scale = 'C';
    }

    if (data) data.then(renderText);  // what is this?
}

function initializePage() {
    getForecast('New York');
}

function searchForCity(e) {
    e.preventDefault();
    getForecast(cityInput.value);
}

function getForecast(city) {
    data = getWeatherDataForCity(city).then(data => {
        renderText(data);
        renderCurrentWeatherImg(data);
        return data;
    }).catch(err => console.error(err));
}



function renderText(data) {
    const dateOptions = { dateStyle: 'full', timeStyle: 'short' };

    const tempValue = convertTempToChosenScaleAndRound(data.currentTemperature);
    const feelsLikeValue = convertTempToChosenScaleAndRound(data.feelsLike);
    const degrees = '°' + scale; 

    renderCurrentWeatherText(); 
    
    data.dailyData.forEach((day, index) => {
        if (dailyForecastDiv.children.length >= 0 && dailyForecastDiv.children.length <= 6) {
            const singleDay = document.createElement('div');
            singleDay.classList = `singleDay day${index}`;
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
        if ((firstEightHoursDiv.children.length >= 0 && firstEightHoursDiv.children.length <= 7) || (secondEightHoursDiv.children.length >= 0 && secondEightHoursDiv.children.length <= 7) || (thirdEightHoursDiv.children.length >= 0 && thirdEightHoursDiv.children.length <= 7)) {
            const singleHour = document.createElement('div');
            singleHour.className = `singleHour hour${index}`;
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
            if (index < 8) {
                firstEightHoursDiv.append(singleHour);
            } else if (index >=8 && index <=15) {
                secondEightHoursDiv.append(singleHour);
            } else if (index > 15 && index <= 23) {
                thirdEightHoursDiv.append(singleHour);
            }
        } else {
            const time = document.getElementsByClassName(`time hour${index}`)[0];
            const temp = document.getElementsByClassName(`temp hour${index}`)[0];
            const icon = document.getElementsByClassName(`icon hour${index}`)[0];
            const timeValue = new Date(hour.hourTime * 1000).toLocaleTimeString(undefined, { hour: 'numeric', hour12: true, });
            time.textContent = timeValue;
            const tempValue = convertTempToChosenScaleAndRound(hour.hourTemp);
            temp.textContent = tempValue + ' ' + degrees;
            icon.src = `http://openweathermap.org/img/wn/${hour.iconId}@2x.png`;
        }
    });
    function renderCurrentWeatherText() {
        city.textContent = data.city;
        dataTime.textContent = new Date(data.utcTimeOfData * 1000).toLocaleString(undefined, dateOptions);
        currentTemp.textContent = tempValue + ' ' + degrees;
        description.textContent = data.description.includes(' ') ? data.description.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') : data.description[0].toUpperCase() + data.description.slice(1);
        humidity.textContent = data.humidity + ' %';
        feelsLike.textContent = feelsLikeValue + ' ' + degrees;
        windSpeed.textContent = data.windSpeed + ' mph';
        precipitationNextHour.textContent = data.precipitationNextHour + ' %';
    }
}

function renderCurrentWeatherImg(data) {
    const currentImg = document.querySelector('.current-img');
    getWeatherImg(data.currentWeatherCategory).then(url => currentImg.src = url);
}

function convertTempToChosenScaleAndRound(value) {
    // The API request fetches the temp values in  F, so only need to calculate C
    return scale === 'F' ? Math.round(value) : Math.round(Number(((value - 32) * (5/9)).toFixed(2)));
}

async function getWeatherDataForCity(city) {

    const responseCurrentWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=72e691cc8e68804d3b51462e3f5c963f`, { mode: 'cors' });
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
        feelsLike: dataCurrentWeather.main.feels_like,
        humidity: dataCurrentWeather.main.humidity,
        windSpeed: dataCurrentWeather.wind.speed,
        utcTimeOfData: dataCurrentWeather.dt,
        currentWeatherCategory: dataCurrentWeather.weather[0].main,
        description: dataCurrentWeather.weather[0].description,
        city: dataCurrentWeather.name,
        dailyData: dataHourlyAndDaily.daily.slice(0,7).map(day => {
            return { iconId: day.weather[0].icon, maxTemp: day.temp.max, minTemp: day.temp.min, description: day.weather[0].description, category: day.weather[0].main, dayTime: day.dt};
        }),
        hourlyData: dataHourlyAndDaily.hourly.slice(0,24).map(hour => {
            return { iconId: hour.weather[0].icon, hourTime: hour.dt, hourTemp: hour.temp, hourCategory: hour.weather[0].main };
        }),
        precipitationNextHour: dataHourlyAndDaily.hourly[0].pop,       
    };
}

async function getWeatherImg(weatherCategory) {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=yAhCNvI0f6znmTUpEGMtSmH48m1iAzKU&s=${weatherCategory}`, { mode: 'cors'} );
    const json = await response.json();
    const gifObj = json.data;
    console.log(gifObj);
    return gifObj.images.fixed_height.url;
}








