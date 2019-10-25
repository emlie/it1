// jshint esversion: 6

// Get HTML-elements
let formSendAnimal = document.querySelector('#formSendAnimal');
let inpAnimal = document.querySelector('#inpAnimal');

let formSend = document.querySelector('#formSend');
let inpName = document.querySelector('#inpName');
let inpAge = document.querySelector('#inpAge');
let selAnimal = document.querySelector('#selAnimal');

let formDelete = document.querySelector('#formDelete');
let selDel = document.querySelector('#selDel');

let formUpdate = document.querySelector('#formUpdate');
let selUpdate = document.querySelector('#selUpdate');
let inpNewName = document.querySelector('#inpNewName');

let table = document.querySelector('#table');


// Get main Firebase database
let db = firebase.database();

// Get databases
let animalsDB = db.ref('animals');
let personsDB = db.ref('persons');





// SEND ANIMAL TO ANIMALS DATABASE
// event = the event of clicking the submit button
function sendAnimal(event) {

  // Check that the function is working
  // by loggig some text in the console
  console.log('sendAnimal');

  // Prevent reloading page
  event.preventDefault();

  // Get form input values
  let animal = inpAnimal.value;

  // Reset input field after submitting the form
  inpAnimal.value = '';

  // Make a data entry of data type="object"
  // and sendt it to the database by using the function push()
  // with a randomly generated primary key
  animalsDB.push({
    "name": animal
  });

}





// FILL SELECT MENU WITH OPTIONS
function fillSelAnimal(snapshot) {

  // Check that the function is working
  // by loggig some text in the console
  console.log('fillSelAnimal');

  // Get primary key for data entry in animalsDB
  let key = snapshot.key;

  // Get all other data in data entry
  let animalData = snapshot.val();

  // Get animal name
  let animalName = animalData.name;

  // Update select menu for animals, where the option value
  // is the primary key
  selAnimal.innerHTML += `
  <option value="${key}">
    ${animalName}
  </option>
  `;

}





// SEND PERSON DATA TO PERSONS DATABASE
// event = the event of clicking the submit button
function sendData(event) {

  // Check that the function is working
  // by loggig some text in the console
  console.log('sendData');

  // Prevent reloading page
  event.preventDefault();

  // Get form input values
  let name = inpName.value;
  let age = inpAge.value;
  let animal = selAnimal.value;

  // Make a data entry of data type="object"
  // and sendt it to the database by using the function push()
  // with a randomly generated primary key
  personsDB.push({
    "name": name,
    "age": age,
    "animal": animal
  });

  // Reset input fields after submitting the form
  name.value = '';
  age.value = '';
  animal = 0;
}





// DISPLAY DATA IN TABLE
function showData(snapshot) {

  // Check that the function is working
  // by loggig some text in the console
  console.log('showData');

  // Get primary key for specific data entry
  let key = snapshot.key;

  // Get all data of specific data entry
  let person = snapshot.val();

  // Get specific data from data entry
  let personName = person.name;
  let personAge = person.age;
  let personAnimalKey = person.animal; // primary key of animal in animalsDB

  // Find path to specific animal from animalsDB
  let animalDataRef = db.ref('animals/' + personAnimalKey);

  // Because the animal primary is used as a foreign key in the person data,
  // we get the specific animal from animalsDB by creating a nested function,
  // where 'value' reads static (snapshot) data from the database
  animalDataRef.on('value', function(snapshotAnimals) {

    // Get data for data entry
    let animalData = snapshotAnimals.val();

    // Get specific data from data entry
    let animalName = animalData.name;

    // Add data to table in HTML
    table.innerHTML += `
    <tr>
      <td>${personName}</td>
      <td>${personAge}</td>
      <td>${animalName}</td>
    </tr>
    `;

    // Add data to select menu for deleting a data entry
    selDel.innerHTML += `
    <option value="${key}">
      ${personName} | ${personAge} | ${animalName}
    </option>
    `;

    // Add data to select menu for updating a data entry
    selUpdate.innerHTML += `
    <option value="${key}">
      ${personName} | ${personAge} | ${animalName}
    </option>
    `;

  });


}





// DELETE DATA
// event = the event of clicking the submit button
function deleteData(event) {

  // Reload page after running function
  // to update the table with correct data

  // Get select menu option value,
  // which is the data entry we want to delete;
  // the value is the primary key
  let chosenData = selDel.value;

  // Get exact reference to this data entry
  let dataRef = db.ref('persons/' + chosenData);

  // Delete data entry
  dataRef.remove();

}





// UPDATE THE NAME OF A DATA ENTRY
function updateData(event) {

  console.log('updateName');

  // Value is primary key of data entry
  let chosenData = selUpdate.value;

  // Get input value
  let newName = inpNewName.value;

  // Find specific data entry in personsDB
  let person = db.ref('persons/' + chosenData);

  // Update data
  person.update({
    "name": newName
  });

}





// RUN FUNCTIONS

// When form is submitted by clicking the button of type="submit", run function
formSendAnimal.onsubmit = sendAnimal;
formSend.onsubmit = sendData;
formDelete.onsubmit = deleteData;
formUpdate.onsubmit = updateData;

// A child (data entry) is added to the database every time a form is submitted
// When a child is added, run function
animalsDB.on('child_added', fillSelAnimal);
personsDB.on('child_added', showData);

// When a child is removed, run function
personsDB.on('child_removed', showData);
