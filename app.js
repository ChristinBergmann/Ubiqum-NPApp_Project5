////////--------------------------------   BUILDS FIRST PAGE // (Fetch Data,Carousel,Search Input(List Of Parks,Error Div))  ----------------------------------------//////////////////

api_Url =
  document.location.hostname === "localhost"
    ? "http://localhost:8080/parks.json"
    : "https://np-mobile-app.netlify.app/parks.json";

fetch(`${api_Url}`)
  .then((response) => {
    return response.json();
  })
  .then((result) => {
    console.log(result);
    let data = result.data;
    // console.log(data);
    // console.log(data[0].images[1].url)

    // builds carousel + fills content:
    let carousel = document.getElementById("carouselID");

    for (let i = 0; i < data.length; i++) {
      for (let x = 0; x < data[i].images.length; x++) {
        let a = document.createElement("figure");
        a.setAttribute("class", "carousel-item");

        let parkName = document.createElement("figcaption");
        parkName.setAttribute("id", data[i].id);
        parkName.setAttribute("class", "imgCaption");
        parkName.innerHTML = data[i].name;
        parkName.addEventListener("click", function (event) {
          filterContentParkList(data, event);
        });

        let parkState = document.createElement("p");
        parkState.innerHTML = data[i].states;

        // work around bc no backend for imgs:
        let img = document.createElement("img");
        img.src =
          document.location.hostname === "localhost"
            ? "http://localhost:8081/signature/auto/200/0/sm/0/plain/" +
              data[i].images[x].url
            : "/Images/parks/" + data[i].images[x].url.split("/").pop();
        // base64 encoded url:
        // "http://localhost:8081/signature/auto/200/0/sm/0/" + btoa(result.data[i].images[x].url);

        a.appendChild(img);
        a.appendChild(parkName);
        a.appendChild(parkState);
        carousel.appendChild(a);
      }
    }
    M.AutoInit(); // calls the carousel
    filterParkListDiv(data);
  })
  .catch(function (error) {
    console.log(error, "this is wrong");
  });

// filters the list of park - depending on search input:
function filterParkListDiv(parks) {
  document.getElementById("searchButton").addEventListener("click", () => {
    // when clicked shows filtered search below:
    let searchTerm = document.getElementById("searchInput").value;
    let filteredList = [];

    parks.forEach(function (park) {
      if (
        searchTerm.toLowerCase() === park.name.toLowerCase() ||
        searchTerm.toLowerCase() === park.states.toLowerCase()
      ) {
        filteredList.push(park);
        document.getElementById("dropdownList").style.visibility = "visible";
      } else if (!searchTerm) {
        document.getElementById("carouselID").style.display = "block";
        document.getElementById("errorDiv").style.visibility = "hidden";
        document.getElementById("dropdownList").style.visibility = "hidden";
      }
    });
    buildParkListDiv(filteredList);
  });
}

// to use ENTER on keyboard:
function handleKeyPress(e) {
  let searchButton = document.getElementById("searchButton");

  e = e || window.event;
  if (e.keyCode === 13) {
    searchButton.click();
    return false;
  }
}
let searchInput;
searchInput = document.getElementById("searchInput");
searchInput.onkeypress = handleKeyPress;

// creates + fills park list div:
function buildParkListDiv(data) {
  //console.log(data);
  // searchInput.innerHTML = ""; is not working

  if (!data.length) {
    // Error Message Div:
    let parkListError = document.getElementById("errorDiv");
    parkListError.setAttribute("class", "container");
    parkListError.innerHTML = "";
    let listError = document.createElement("p");
    listError.setAttribute("class", "errorText deep-orange darken-4");
    listError.innerHTML = "Check Typing  -OR-  No Parks listed";
    let listError1 = document.createElement("p");
    listError1.setAttribute("class", "errorText");
    listError1.innerHTML =
      "-->>  use link above of official NPS Homepage  <<--";

    parkListError.appendChild(listError);
    parkListError.appendChild(listError1);

    document.getElementById("errorDiv").style.visibility = "visible";
    document.getElementById("carouselID").style.display = "none";
    document.getElementById("dropdownList").style.visibility = "hidden";
  } else {
    let parkListDiv = document.getElementById("dropdownList");
    parkListDiv.addEventListener(
      "mouseover",
      function (event) {
        // highlights the mouseover target:
        event.target.style.color = "rgb(64, 195, 151)";
        // resets the color after a short delay:
        setTimeout(function () {
          event.target.style.color = "";
        }, 200);
      },
      false
    );

    parkListDiv.classList.add;
    parkListDiv.innerHTML = "";

    data.forEach((park) => {
      // list of parks:
      let divTR = document.createElement("div");
      divTR.className = "divTR";

      let parkListDisplay = document.createElement("p");
      parkListDisplay.innerHTML = park.fullName + " / " + park.states;
      parkListDisplay.setAttribute("id", park.id);
      parkListDisplay.setAttribute("data-parkCode", park.parkCode);
      parkListDisplay.className = "parkClick";
      parkListDisplay.style.color = "white";

      // by click event the parkId + parkCode gets transmitted:
      parkListDisplay.addEventListener("click", function (event) {
        filterContentParkList(data, event);
      });

      parkListDiv.appendChild(divTR);
      divTR.appendChild(parkListDisplay);

      document.getElementById("carouselID").style.display = "none";
      document.getElementById("errorDiv").style.visibility = "hidden";
    });
  }
}

// filters which park of list is shown + displays on second page:
function filterContentParkList(data, event) {
  data.forEach(function (info) {
    if (event.target.id === info.id) {
      buildSecondPage(info);
    }
  });
}

///////-----------------------------------------------------  BUILDS SECOND PAGE (Park Infos) --------------------------------------------------////////

function buildSecondPage(parks) {
  let secondPage = document.getElementById("secondPage");
  secondPage.innerHTML = "";

  // Park Name:
  let divParkHeader = document.createElement("div");
  divParkHeader.setAttribute("class", "campDiv");
  let parkName = document.createElement("h1");
  parkName.innerHTML = parks.name;

  // Nav Button Directions:
  let divNavButtons = document.createElement("div");
  divNavButtons.setAttribute("class", "navBTN");
  let buttonDirections = document.createElement("button");
  buttonDirections.setAttribute("id", parks.id);
  buttonDirections.setAttribute(
    "class",
    "link-btn waves-effect waves-light btn-small"
  );
  buttonDirections.innerHTML = "How to get there";

  // builds third page:
  buttonDirections.addEventListener("click", function (event) {
    buildThirdPage(parks, event);
    // initMap()
  });

  // Nav Button Campgrounds:
  let buttonCampgrounds = document.createElement("button");
  buttonCampgrounds.setAttribute("data-parkCode", parks.parkCode);
  buttonCampgrounds.setAttribute(
    "class",
    "link-btn waves-effect waves-light btn-small"
  );
  buttonCampgrounds.innerHTML = "Find a Campground";

  // on click the parkcode is transmitted- builds fourth page:
  buttonCampgrounds.addEventListener("click", function (event) {
    let parkCode = event.target.getAttribute("data-parkCode");
    buildFourthPage(event, parkCode);
  });

  // Park Description:
  let divDescription = document.createElement("div");
  divDescription.setAttribute("class", "contextInfo");
  let headDescription = document.createElement("h2");
  headDescription.innerHTML = "Park Description:";
  let contextDescription = document.createElement("div");
  contextDescription.setAttribute("class", "contextDiv");
  let textDescription = document.createElement("p");
  textDescription.innerHTML = parks.description;

  // Weather Description:
  let divWeather = document.createElement("div");
  divWeather.setAttribute("class", "contextInfo");
  let headWeather = document.createElement("h2");
  headWeather.innerHTML = "Weather Information:";
  let contextWeather = document.createElement("div");
  contextWeather.setAttribute("class", "contextDiv");
  let textWeather = document.createElement("p");
  textWeather.innerHTML = parks.weatherInfo;
  textWeather.setAttribute("href", parks.weatherInfo); // pure link works but not if its w text or just "a"tag
  textWeather.setAttribute("target", "_blank");

  // BACK button:
  let backButton1 = document.createElement("div");
  backButton1.setAttribute("id", "backBTN");

  let button1 = document.createElement("button");
  button1.setAttribute("id", "button");
  button1.innerHTML = "BACK";
  button1.className = "btn waves-effect waves-teal";

  // first Page is shown + second Page is hidden:
  button1.addEventListener("click", function () {
    document.getElementById("firstPage").classList.add("active");
    document.getElementById("secondPage").classList.remove("active");
  });

  secondPage.appendChild(divParkHeader);
  divParkHeader.appendChild(parkName);
  divParkHeader.appendChild(divNavButtons);

  divNavButtons.appendChild(buttonDirections);
  divNavButtons.appendChild(buttonCampgrounds);

  divParkHeader.appendChild(divDescription);
  divDescription.appendChild(headDescription);
  divDescription.appendChild(contextDescription);
  contextDescription.appendChild(textDescription);

  divParkHeader.appendChild(divWeather);
  divWeather.appendChild(headWeather);
  divWeather.appendChild(contextWeather);
  contextWeather.appendChild(textWeather);

  secondPage.appendChild(backButton1);
  backButton1.appendChild(button1);

  document.getElementById("secondPage").classList.add("active");
  document.getElementById("firstPage").classList.remove("active");
  document.getElementById("headline").style.display = "none";
}

/////////-------------------------------------------------  BUILDS THIRD PAGE  (Directions to park) -----------------------------------------------////////////////

function buildThirdPage(parks) {
  let thirdPage = document.getElementById("thirdPage");
  thirdPage.innerHTML = "";

  // Park Direction:
  let divHead = document.createElement("div");
  divHead.setAttribute("class", "contextInfoDirections");
  let headMaps = document.createElement("h2");
  headMaps.innerHTML = "Directions:";
  let contextMaps = document.createElement("div");
  contextMaps.setAttribute("class", "contextDiv");
  contextMaps.innerHTML = parks.directionsInfo;

  let hr = document.createElement("hr");
  hr.style.color = "white";
  hr.style.width = "70%";
  hr.style.margin = "7px auto";

  // Link Directions:
  let divMaps = document.createElement("div");
  divMaps.setAttribute("id", "maps");
  let mapsLink = document.createElement("a");
  mapsLink.setAttribute("href", parks.directionsUrl);
  mapsLink.setAttribute("target", "_blank");
  mapsLink.innerHTML = "Directions of NPS";

  // BACK button:
  let backButton2 = document.createElement("div");
  backButton2.setAttribute("id", "backBTN");

  let button2 = document.createElement("button");
  button2.setAttribute("id", "button");
  button2.innerHTML = "Previous Page";
  button2.className = "btn waves-effect waves-teal onclick";

  // second Page is shown + third Page is hidden:
  button2.addEventListener("click", function () {
    document.getElementById("secondPage").classList.add("active");
    document.getElementById("thirdPage").classList.remove("active");
    document.getElementById("fourthPage").classList.remove("active");
  });

  thirdPage.appendChild(divHead);
  divHead.appendChild(headMaps);
  divHead.appendChild(contextMaps);
  divHead.appendChild(hr);
  divHead.appendChild(divMaps);
  divMaps.appendChild(mapsLink);

  thirdPage.appendChild(backButton2);
  backButton2.appendChild(button2);

  document.getElementById("thirdPage").classList.add("active");
  document.getElementById("secondPage").classList.remove("active");
}

// let maps = document.getElementById("maps")

// function initMap(data) {

//     let map = data[i].latLong

//     // The map, centered at Uluru
//     maps = new google.maps.Map(
//         document.getElementById('maps'), {
//             zoom: 4,
//             center: map
//         });
//     // The marker, positioned at
//     marker = new google.maps.Marker({
//         position: map,
//         map: map
//     });
// }
/// extract data attrib out of the event
