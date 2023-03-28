const form = document.querySelector("form");
const main = document.querySelector("main");
const upcomingWeather = document.querySelector("aside");
const sidebarSection = document.querySelector(".sidebar aside section");
const article = document.getElementById("today");
const widget = document.querySelector(".widget aside");

let searchHistory = [];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  //Grabs the location from the text field
  const location = document.querySelector("#location").value;
  
  //Add specific location to url
  const api_url = `https://wttr.in/${location}?format=j1`;
  
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

      article.innerHTML = `
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

      widget.innerHTML = `
    <form id="widgetForm">
        <div>
        <label for="temp-to-convert">Convert the temperature:</label>
        </div>
        <div>
            <input id="temp-to-convert" type="number"></input>
        </div>
        <div>
            <label for="to-c">To Celsius</label>
            <input id="to-c" name="convert-temp" type="radio" value="c"/>
        </div>
        <div>
            <label for="to-f">To Fahrenheit</label>
            <input id="to-f" name="convert-temp" type="radio" value="f"/>
        </div>
        <input type="submit" value="Submit" />
        <h4>0.00</h4>
    </form>
`;

    function convertTemp(event) {
      event.preventDefault();
      const temp = document.getElementById("temp-to-convert").value;
      const celsius = document.getElementById("to-c").checked;
      const fahrenheit = document.getElementById("to-f").checked;
      const result = document.querySelector("h4");

      if (!celsius && !fahrenheit) {
        result.innerText = "Please select a conversion option.";
        return;
      }

      if (celsius) {
        const fTemp = ((temp - 32) * 5) / 9;
        result.innerText = `${fTemp.toFixed(2)}`;
      } else if (fahrenheit) {
        const cTemp = (temp * 9) / 5 + 32;
        result.innerText = `${cTemp.toFixed(2)}`;
      }
    }

    const widgetForm = document.getElementById("widgetForm");
    widgetForm.addEventListener("submit", convertTemp);
      

      addSearchToHistory(location, currentweather);
      renderSearchHistory();
    })


    .catch((error) => {
      console.log(error);
    });

    form.reset();
});

function addSearchToHistory(searchQuery, feelsLikeTemperature) {
  const searchItem = {
    query: searchQuery,
    feelsLike: feelsLikeTemperature,
  };
  searchHistory.push(searchItem);
}

function renderSearchHistory() {
  sidebarSection.innerHTML = "";
  if (searchHistory.length === 0) {
    sidebarSection.innerHTML = "<p>No previous searches</p>";
  } else {
    const list = document.createElement("ul");
    searchHistory.forEach((searchItem) => {
      const searchLink = document.createElement("a");
      searchLink.href = `https://wttr.in/${searchItem.query}`;
      searchLink.textContent = `${searchItem.query} - ${searchItem.feelsLike}°F`;
      searchLink.addEventListener("click", (event) => {
        event.preventDefault();
        fetchWeatherData(searchItem.query);
      });
      const listItem = document.createElement("li");
      listItem.appendChild(searchLink);
      list.appendChild(listItem);
    });
    sidebarSection.appendChild(list);
  }
}



function fetchWeatherData(query) {
  const api_url = `https://wttr.in/${query}?format=j1`;

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

      article.innerHTML = `
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
    
    })




    .catch((error) => {
      console.log(error);
    });

    form.reset();
};