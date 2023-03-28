const form = document.querySelector("form");
const main = document.querySelector("main");
const upcomingWeather = document.querySelector("main aside");
const sidebarSection = document.querySelector(".sidebar .replace");
const article = document.getElementById("today");
const widget = document.querySelector(".widget aside");
const searchHistory = [];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  //Grabs the location from the text field
  fetchWeatherData(document.getElementById("location").value);
});

//Adds previous searches to sidebar
function renderSearchHistory() {
 if (searchHistory.length > 0) {
   sidebarSection.innerHTML = "";
   const list = document.createElement("ul");
   searchHistory.forEach((searchItem) => {
     const searchLink = document.createElement("a");
     searchLink.href = `https://wttr.in/${searchItem.query}`;
     searchLink.textContent = `${searchItem.query}`;
     searchLink.addEventListener("click", (event) => {
       event.preventDefault();
       fetchWeatherData(searchItem.query);
     });
     const temp = document.createElement("span");
     temp.textContent = ` - ${searchItem.feelsLike}°F`;
     const listItem = document.createElement("li");
     listItem.appendChild(searchLink);
     listItem.appendChild(temp);
     list.appendChild(listItem);
   });
   sidebarSection.appendChild(list);
 }
}

//Grabs data from api and displays on page
function fetchWeatherData(query) {
  fetch(`https://wttr.in/${query}?format=j1`)
    .then((response) => response.json())
    .then((json) => {
      const weatherData = json;
      
      //Grab current weather in Fahrenheit
      const currentweather = weatherData.current_condition[0].FeelsLikeF;
      
      const {
        nearest_area: [
          {
            region: [{ value: region }],
            country: [{ value: country }],
            areaName: [{ value: areaName }],
          },
        ],
      } = weatherData;

      // Grab chances for precipitation
      const chanceOfSunshine =
        weatherData.weather[0].hourly[0].chanceofsunshine;
      const chanceOfRain = weatherData.weather[0].hourly[0].chanceofrain;
      const chanceOfSnow = weatherData.weather[0].hourly[0].chanceofsnow;

      //Add api information to main article html
      article.innerHTML = `
			<h2>${query}</h2>
			<p><strong>${query != areaName ? `Nearest ` : ``}Area:</strong> ${areaName}</p>
			<p><strong>Region:</strong> ${region}</p>
			<p><strong>Country:</strong> ${country}</p>
			<p><strong>Currently:</strong> Feels Like ${currentweather}°F</p>
			<p><strong>Chance of Sunshine:</strong> ${chanceOfSunshine}</p>
			<p><strong>Chance of Rain:</strong> ${chanceOfRain}</p>
			<p><strong>Chance of Snow:</strong> ${chanceOfSnow}</p>`;

      //Create icon element based on chance of precipitation
      const icon = document.createElement("img");
      if (chanceOfSunshine > 50) {
        icon.src = "./assets/icons8-summer.gif";
        icon.alt = "sun";
      } else if (chanceOfRain > 50) {
        icon.src = "./assets/icons8-torrential-rain.gif";
        icon.alt = "rain";
      } else if (chanceOfSnow > 50) {
        icon.src = "./assets/icons8-light-snow.gif";
        icon.alt = "snow";
      }
      
      //Add icon element to top of article element
      article.prepend(icon);

      //Add api information to upcoming weather section below main article
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
			</article>`;

      //Add temp conversion widget on page load
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
			</form>`;

      //Convert temp from Celsius to Fahrenheit and vice versa
      function convertTemp(event) {
        event.preventDefault();
        const temp = document.getElementById("temp-to-convert").value;
        const celsius = document.getElementById("to-c").checked;
        const result = widgetForm.querySelector("h4");

        if (!celsius && !document.getElementById("to-f").checked) {
          result.innerText = "Please select a conversion option.";
          return;
        }

        if (celsius) result.innerText = `${(((temp - 32) * 5) / 9).toFixed(2)}`;
        else result.innerText = `${((temp * 9) / 5 + 32).toFixed(2)}`;
      }

      const widgetForm = document.getElementById("widgetForm");
      widgetForm.addEventListener("submit", convertTemp);

      //Loops through search history and checks if current result matches previous search result
      let add = true;
      for (const area of searchHistory)
        if (area.query === query) {
          add = false;
          break;
        }

      //Adds search result to unordered list if current result doesn't match previous result
      if (add)
        searchHistory.push({
          query: query,
          feelsLike: currentweather,
        });

      renderSearchHistory();
    })

    .catch((error) => {
      console.log(error);
    });

  //Reset search field after button is clicked
  form.reset();
}