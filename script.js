"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderCountryDiv = function (data, className = "") {
  const countryHTML = `
    <article class="country ${className}">
            <img class="country__img" src="${data.flags.png}" />
            <div class="country__data">
              <h3 class="country__name">${data.name.common}</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${(
                data.population / 1000000
              ).toFixed(1)}M People</p>
              <p class="country__row"><span>🗣️</span>${
                Object.values(data.languages)[0]
              }</p>
              <p class="country__row"><span>💰</span>${
                Object.values(data.currencies)[0].name
              }</p>
            </div>
          </article>`;

  countriesContainer.insertAdjacentHTML("beforeend", countryHTML);
};

const renderError = function (msg) {
  let msgError = `<div>${msg}</div>`;
  // countriesContainer.insertAdjacentText("beforeend", msg);
  countriesContainer.insertAdjacentHTML("beforeend", msgError);
};

const resetCountries = function () {
  let [...child] = countriesContainer.children;
  child.map((ele) => ele.remove());
};

const getJSON = function (url, errorMessage = "Something went wrong") {
  const request = fetch(url).then((valuePromise) => {
    if (!valuePromise.ok)
      throw new Error(`${errorMessage} - ${valuePromise.status}`);
    return valuePromise.json();
  });

  return request;
};

const getCountryData = async function (country) {
  try {
    // Get Main Country
    const responseRestCountries = await fetch(
      `https://restcountries.com/v3.1/name/${country.toLowerCase()}`
    );
    if (!responseRestCountries.ok)
      throw new Error(`Main Country Error - ${responseRestCountries.status}`);

    // Parse response to Text
    const jsonCountries = await responseRestCountries.json();

    // Get First Element
    const mainCountryData = jsonCountries[0];
    renderCountryDiv(mainCountryData);

    // Get Neighbor Name
    const neighborCountry = mainCountryData.borders?.[0];
    if (!neighborCountry) throw new Error("No Neighbour found");

    // Get Neighbor Response
    const responseNeighbour = await fetch(
      `https://restcountries.com/v3.1/alpha/${neighborCountry.toLowerCase()}`
    );
    if (!responseNeighbour.ok)
      throw new Error(`Neighbour Error - ${responseNeighbour.status}`);

    // Parse response to Text
    const jsonNeighborData = await responseNeighbour.json();

    // Get Neighbor Data
    const dataNeighbor = jsonNeighborData[0];

    // Visualize Neighbour
    renderCountryDiv(dataNeighbor, "neighbour");

    countriesContainer.getElementsByClassName.opacity = 1;

    return `You are in ${country}`;
  } catch (error) {
    let errStr = error.toString();
    console.log(errStr.includes("Neighbour"));
    errStr.includes("Neighbour")
      ? renderError(error)
      : alert(`Error: ${error}`);
    // console.log(String(error));
    //
  }
};

btn.addEventListener("click", function () {
  const inValue = prompt("Write a country: ");
  resetCountries();
  const resultado = getCountryData(String(inValue));
  resultado.then((ele) => console.log(ele));
});
