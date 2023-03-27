const form = document.querySelector("form");
const main = document.querySelector("main");
const upcomingWeather = document.querySelector("aside");
const searches = document.querySelector("sidebar");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  //Grabs the location from the text field
  let location = document.querySelector("#location").value;
  
  //Add specific location to url
  let api_url = `https://wttr.in/${location}?format=j1`;
  
  fetch(api_url)
    .then((response) => response.json())
    .then((json) => {
        const weatherData = json;
        
    //Grab current weather in Fahrenheit
      currentweather = weatherData.current_condition[0].FeelsLikeF;
      
      const {
        nearest_area: [
          {
            region: [{ value: region }],
            country: [{ value: country }],
            areaName: [{ value: areaName }],
          },
        ],
      } = weatherData;

      main.innerHTML = `
        <h2>${areaName}</h2>
        <p><strong>Area:</strong> ${areaName}</p>
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Currently:</strong> Feels Like ${currentweather}°F</p>
      `;

      upcomingWeather.innerHTML = `
      <article>
      <h3>Today</h3>
        <p><strong>Average Temperature:</strong> ${weatherData.weather[0].avgtempF}°F</p>
        <p><strong>Max Temperature:</strong> ${weatherData.weather[0].maxtempF}°F</p>
        <p><strong>Min Temperature:</strong> ${weatherData.weather[0].mintempF}°F</p>
      </article>

      <article>
        <h3>Tomorrow</h3>
        <p><strong>Average Temperature:</strong> ${weatherData.weather[1].avgtempF}°F</p>
        <p><strong>Max Temperature:</strong> ${weatherData.weather[1].maxtempF}°F</p>
        <p><strong>Min Temperature:</strong> ${weatherData.weather[1].mintempF}°F</p>
      </article>   

      <article>
        <h3>Day After Tomorrow</h3>
        <p><strong>Average Temperature:</strong> ${weatherData.weather[2].avgtempF}°F</p>
        <p><strong>Max Temperature:</strong> ${weatherData.weather[2].maxtempF}°F</p>
        <p><strong>Min Temperature:</strong> ${weatherData.weather[2].mintempF}°F</p>
      </article>
      `;

      main.appendChild(upcomingWeather);

    })


    .catch((error) => {
      console.log(error);
    });
});
