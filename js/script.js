
const requestedJSON = fetch("https://randomuser.me/api?results=12")
 .then( (data) => data.json())
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
   console.error(`An error occured: ${error}`)
})

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

  $(".gallery").on("click", ".card", (e) =>{
    const targetName = $(e.currentTarget).find(".card-name").text();
    createModal(targetName, dataArray);
  });
}

function createSearchBar(){
  let htmlString = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search by name...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
  $(".search-container").html(htmlString);

  $("form").on("submit", (e) =>{
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
}

function createModal(name, dataArray) {
  const clickedEmployee =  dataArray.find(employee => employee.name === name);
  const employeeIndex = dataArray.indexOf(clickedEmployee);
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
//todo
  if(employeeIndex===0 || $(":visible").find()"){
    $("#modal-prev").remove()
  }
  if(employeeIndex===dataArray.length-1 || ){
    $("#modal-next").remove()
  }

  modalEventListeners(employeeIndex, dataArray);
}

function modalEventListeners(employeeIndex, dataArray){
  $(".modal-close-btn").on("click", () =>{
    $(".modal-container").remove()
  });

  $("#modal-prev").on("click", () =>{
    $(".modal-container").remove()
    const prevEmployee = dataArray[employeeIndex - 1];
    createModal(prevEmployee.name, dataArray)
  });

  $("#modal-next").on("click", () =>{
    $(".modal-container").remove()
    const nextEmployee = dataArray[employeeIndex + 1];
    createModal(nextEmployee.name, dataArray)
  });
}

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

createGallery();
createSearchBar();
