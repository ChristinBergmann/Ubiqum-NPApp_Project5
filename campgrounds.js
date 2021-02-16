/////////-----------------------------------------------------  BUILDS FOURTH PAGE  ----------------------------------------------////////////////

function buildFourthPage(event, parkCode) {
  // console.log(event);
  // console.log(parkCode);

  let fourthPage = document.getElementById("fourthPage");
  fourthPage.innerHTML = "";

  //fetch live data of specific campground:
  fetch(
    `https://developer.nps.gov/api/v1/campgrounds?&api_key=${API_key}&parkCode=${parkCode}`
  ).then(
      (response) => {
        console.log(response)
        return response.json();
      },
      (rejection) => {
        console.error(rejection.message);
      }
    )
    .then((result) => {
      let data = result.data;
  
      if (data == 0) {
        // Error Div:
        let divErrorCamp = document.createElement("div");
        divErrorCamp.setAttribute("class", "contextInfo");
        divErrorCamp.innerHTML = "Sorry there are no campgrounds listed";

        // BACK button:
        let backButton3 = document.createElement("div");
        backButton3.setAttribute("id", "backBTN");

        let button3 = document.createElement("button");
        button3.setAttribute("id", "button");
        button3.innerHTML = "Previous Page";
        button3.className = "btn waves-effect waves-teal onclick";

        //second Page is shown and fourth Page is hidden:
        button3.addEventListener("click", function () {
          document.getElementById("secondPage").classList.add("active");
          document.getElementById("fourthPage").classList.remove("active");
        });

        fourthPage.appendChild(divErrorCamp);
        fourthPage.appendChild(backButton3);
        backButton3.appendChild(button3);

        document.getElementById("fourthPage").classList.add("active");
        document.getElementById("secondPage").classList.remove("active");
        document.getElementById("thirdPage").classList.remove("active");
      } else {
        data.forEach(function (camp) {
          console.log(camp);

          // Camp Name:
          let divCampHeader = document.createElement("div");
          divCampHeader.setAttribute("class", "campDiv");
          let campName = document.createElement("h1");
          campName.innerHTML = camp.name;

          // Camp Description:
          let divCamp = document.createElement("div");
          divCamp.setAttribute("class", "contextInfo");
          let headDescriptions = document.createElement("h2");
          headDescriptions.innerHTML = "Camp Description:";
          let contextDescriptions = document.createElement("div");
          contextDescriptions.setAttribute("class", "contextDiv");
          let textDescriptions = document.createElement("tr");
          textDescriptions.innerHTML = camp.description;

          // Camp Directions:
          let divDirections = document.createElement("div");
          divDirections.setAttribute("class", "contextInfo");
          let headDirections = document.createElement("h2");
          headDirections.innerHTML = "Camp Directions:";
          let contextDirections = document.createElement("div");
          contextDirections.setAttribute("class", "contextDiv");
          let textDirections = document.createElement("p");
          textDirections.innerHTML = camp.directionsOverview;

          let hr = document.createElement("hr");
          hr.style.color = "white";
          hr.style.width = "70%";

          
          // Camp Reservations:
          let divReservations = document.createElement("div");
          divReservations.setAttribute("class", "contextInfo");
          let contextReservations = document.createElement("div");
          contextReservations.setAttribute("class", "contextDiv");
          let linkReservations = document.createElement("a");
          linkReservations.setAttribute("href", camp.reservationUrl);
          linkReservations.setAttribute("target", "_blank");
          linkReservations.innerHTML = "BOOK HERE";

          // BACK button:
          let backButton3 = document.createElement("div");
          backButton3.setAttribute("id", "backBTN");

          let button3 = document.createElement("button");
          button3.setAttribute("id", "button");
          button3.innerHTML = "Previous Page";
          button3.className = "btn waves-effect waves-teal onclick";

          // second Page is shown + fourth Page is hidden:
          button3.addEventListener("click", function () {
            document.getElementById("secondPage").classList.add("active");
            document.getElementById("fourthPage").classList.remove("active");
          });

          fourthPage.appendChild(divCampHeader);
          divCampHeader.appendChild(campName);
          divCampHeader.appendChild(divCamp);

          divCamp.appendChild(headDescriptions);
          divCamp.appendChild(textDescriptions);

          divCampHeader.appendChild(divDirections);
          divDirections.appendChild(headDirections);
          divDirections.appendChild(textDirections);

          divCampHeader.appendChild(hr);
          divCampHeader.appendChild(divReservations);
          divReservations.appendChild(linkReservations);

          fourthPage.appendChild(backButton3);
          backButton3.appendChild(button3);

          document.getElementById("fourthPage").classList.add("active");
          document.getElementById("secondPage").classList.remove("active");
          document.getElementById("thirdPage").classList.remove("active");
        });
      }
    });
}

