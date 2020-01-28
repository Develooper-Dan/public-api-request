/********************************************
Functions for creating the gallery, searchbar and modals
********************************************/
/*
The JSON data received from a fetch-request to randomuser.me api is mapped to "employee"-objects which are
more concise and easier to access compared to the raw JSON data. If an error occurs, a message is printed on the screen.
*/
const requestedJSON = fetch("https://randomuser.me/api?results=12")
 .then( (data) => {
   if(!data.ok){
     $("header").hide();
     $("body").html(`<h2>An error occured: ${status} ${statusText}</h2>`);
   }
   return data.json();
 })
 .then ((parsedData) => {
   const mappedData = parsedData.results.map((employee) => {
     employee =
     {
       name: `${employee.name.first} ${employee.name.last}`,
       idName: `${employee.name.first} ${employee.name.last}`.toLowerCase().replace(" ", ""),
       email: employee.email,
       picture: employee.picture.large,
       city: employee.location.city,
       cell: convertString(employee.cell, "phone"),
       birthday: convertString(employee.dob.date, "birthday"),
       address: `${employee.location.street.number} ${employee.location.street.name},
                 ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}`
     }
     return employee
   });
   return mappedData;
 })
 .catch( (error) => {
   $("header").hide();
   $("body").html(`<h2>There was a problem with your request: ${error}</h2>`);
})
// Waits for the data from the fetch request and then creates the gallery out of the employee-objects
async function createGallery(){
  const dataArray = await requestedJSON;
  let htmlString = "";
  dataArray.forEach((employee) => {
    htmlString += `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="${employee.idName}" class="card-name cap">${employee.name}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.city}</p>
        </div>
    </div> `
  })
  $(".gallery").html(htmlString);
}

function createSearchBar(){
  let htmlString = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search by name...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
  $(".search-container").html(htmlString);
}
/* If an employee card is clicked, a modal window is created dynamically which shows more detailed information.
Also creates buttons to cycle through the modals of different employees. The prev/next button isn't shown if
the employee is the first/last one displayed in the gallery (that's what the employeeIndex and array of visibleEmployees are needed for).
*/
async function createModal(name, employeeIndex, visibleEmployees) {
  const dataArray = await requestedJSON;
  const clickedEmployee =  dataArray.find(employee => employee.name === name);
  let htmlString = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${clickedEmployee.picture}" alt="profile picture">
                <h3 id="${clickedEmployee.idName}" class="modal-name cap">${clickedEmployee.name}</h3>
                <p class="modal-text">${clickedEmployee.email}</p>
                <p class="modal-text cap">${clickedEmployee.city}</p>
                <hr>
                <p class="modal-text">${clickedEmployee.cell}</p>
                <p class="modal-text">${clickedEmployee.address}</p>
                <p class="modal-text">Birthday: ${clickedEmployee.birthday}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
      </div>`;
  $(htmlString).insertAfter(".gallery");

  if(employeeIndex===0){
    $("#modal-prev").remove()
  }
  if(employeeIndex===visibleEmployees.length-1){
    $("#modal-next").remove()
  }

  modalEventListeners(employeeIndex, visibleEmployees);
}
// Converts the phone number and the birthdate of the retrieved JSON data into a more readable/presentable way
function convertString(string, phoneOrBday){
  if (phoneOrBday === "phone"){
    const newPhone = string.replace(/\D/g, "")
    return `(${newPhone.substring(0, 3)}) ${newPhone.substring(3, 6)}-${newPhone.substring(6)}`;
  }
  if (phoneOrBday === "birthday"){
    const newBday = string.slice(0, string.indexOf("T")).replace(/\D/g, "");
    return `${newBday.substring(4, 6)}/${newBday.substring(6)}/${newBday.substring(0, 4)}`;
  }
}

/********************************************
Event listeners
********************************************/
// Click listener for creating modals
  $(".gallery").on("click", ".card", (e) =>{
    const visibleEmployees = $(".card:visible").toArray();
    const targetIndex = $(".card:visible").index(e.currentTarget);
    const targetName = $(e.currentTarget).find(".card-name").text();
    createModal(targetName, targetIndex, visibleEmployees);
  });
/* Submit listener for the search input field. Matches if either the first or last name of an employee
starts with the entered character(s) and hides all employee cards whitch aren't matched
*/
$(".search-container").on("submit", "form", (e) =>{
  e.preventDefault()
  const input = $(".search-input").val().toLowerCase();
  $(".card").each( function(){
    const employeeName = $(this).find(".card-name").text().toLowerCase();
    if(employeeName.startsWith(input) || employeeName.startsWith(input, employeeName.indexOf(" ")+1) || input == ""){
      $(this).show();
  } else {
      $(this).hide();
    }
  });
})
//The listeners for the prev/next and the "close" button on a modal.
function modalEventListeners(employeeIndex, visibleEmployees){
  $(".modal-close-btn").on("click", () =>{
    $(".modal-container").remove()
  });

  $("#modal-prev").on("click", () =>{
    $(".modal-container").remove()
    const prevEmployee = visibleEmployees[employeeIndex - 1];
    const prevName = $(prevEmployee).find(".card-name").text()
    createModal(prevName, employeeIndex - 1, visibleEmployees)
  });

  $("#modal-next").on("click", () =>{
    $(".modal-container").remove()
    const nextEmployee = visibleEmployees[employeeIndex + 1];
    const nextName = $(nextEmployee).find(".card-name").text()
    createModal(nextName, employeeIndex + 1, visibleEmployees)
  });
}

//Creating gallery and search bar
createGallery();
createSearchBar();
