const form = document.querySelector("form");
const main = document.querySelector("main");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  //Grabs the location from the text field
  let location = document.querySelector("#location").value;
  
  //Add specific location to url
  let api_url = `https://wttr.in/${location}?format=j1`;
  
  fetch(api_url)
    .then((response) => response.json())
    .then((json) => {
        //Grab current weather in Fahrenheit
      currentweather = json.current_condition[0].FeelsLikeF;
      
        const {
        nearest_area: [
          {
            region: [{ value: region }],
            country: [{ value: country }],
            areaName: [{ value: areaName }],
          },
        ],
      } = json;


      main.innerHTML = `
        <article class="currentweather">
          <h2>${location}</h2>
          
        <p><strong>Area:</strong> ${areaName}</p>
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Currently:</strong> Feels Like ${currentweather}°F</p>
        </article>
      `;
    })


    .catch((error) => {
      console.log(error);
    });
});
