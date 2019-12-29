//
// function createElements(name, properties, parentNode){
//   const element = document.createElement(name);
//   if (Array.isArray(properties[0])){
//     for (let i=0; i<properties.length; i++){
//       element[properties[i][0]]=[properties[i][1]];
//     }
//   }
//   else {
//     element[properties[0]]=[properties[1]];
//     }
//   parentNode.appendChild(element);
//   return element;
// }

function addToGallery(dataArray){
  const galleryDiv = $(".gallery");
  let htmlString = "";
  dataArray.forEach( (employee) =>{
    htmlString += `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
        </div>
    </div> `
  })
  galleryDiv.html(htmlString);
}

let requestedJSON = $.getJSON("https://randomuser.me/api?results=12")
  .done( (data) => {
  addToGallery(data.results);
})
  .fail( () => {
  console.error(`An error occured: ${requestedJSON.statusText}`)
})
