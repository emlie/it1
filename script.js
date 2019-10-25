// jshint esversion: 6
// ** Alle norske kommentarer starter med stjerner

// Get HTML-elements
// ** Henter elementer fra HTML-dokumentet
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
// ** Henter hoveddatabasen (selve koblinga) til Firebase
let db = firebase.database();

// Get databases
// ** Henter (lager) databasene som skal brukes
let animalsDB = db.ref('animals');
let personsDB = db.ref('persons');





// SEND ANIMAL TO ANIMALS DATABASE
// event = the event of clicking the submit button
function sendAnimal(event) {

  // Check that the function is working
  // by loggig some text in the console
  console.log('sendAnimal');

  // Prevent reloading page
  // ** Forhindre at siden automatisk lastes inn på nytt hver gang
  // ** hendelsen klikk-på-knapp skjer
  event.preventDefault();

  // Get form input values
  // ** Hent verdien (det som ble skrevet inn i) input-feltet
  let animal = inpAnimal.value;

  // Reset input field after submitting the form
  // ** Tøm input-feltet etter hendelsen har skjedd
  inpAnimal.value = '';

  // Make a data entry of data type="object"
  // and sendt it to the database by using the function push()
  // with a randomly generated primary key
  // ** Send et dataobjekt med input-verdien til databasen,
  // ** hvor primærnøkkelen er tilfeldig generert av Firebase
  animalsDB.push({
    "name": animal
  });

}





// FILL SELECT MENU WITH OPTIONS
function fillSelAnimal(snapshot) {

  console.log('fillSelAnimal');

  // Get primary key for data entry in animalsDB
  // ** Hent primærnøkkelen til et dataobjekt
  let key = snapshot.key;

  // Get all other data in data entry
  // ** Hent resten av dataen til dataobjektet
  let animalData = snapshot.val();

  // Get animal name
  // ** Hent den spesifikke dataen ved "name" til dataobjektet
  let animalName = animalData.name;

  // Update select menu for animals, where the option value
  // is the primary key
  // ** Legg til flere options i HTML'en til select-menyen,
  // ** hvor verdien til et valg er primærnøkkelen
  selAnimal.innerHTML += `
  <option value="${key}">
    ${animalName}
  </option>
  `;

}





// SEND PERSON DATA TO PERSONS DATABASE
// ** Samme metode som i funksjonen sendAnimal()
function sendData(event) {

  console.log('sendData');

  event.preventDefault();

  let name = inpName.value;
  let age = inpAge.value;
  let animal = selAnimal.value;

  // ** Igjen, tilfeldig generert primærnøkkel
  personsDB.push({
    "name": name,
    "age": age,
    "animal": animal
  });

  // ** Tøm inputfelt og select-meny
  name.value = '';
  age.value = '';
  animal = 0;
}





// DISPLAY DATA IN TABLE
// ** Samme metode som i funksjonen fillSelAnimal()
function showData(snapshot) {

  console.log('showData');

  let key = snapshot.key;

  let person = snapshot.val();

  // Get specific data from data entry
  let personName = person.name;
  let personAge = person.age;
  let personAnimalKey = person.animal; // primary key of animal in animalsDB

  // ** Fordi verdien til animal er en fremmednøkkel, så må vi lage
  // ** en funksjon til inni showData() for å få tak i dataen tilknytta
  // ** fremmednøkkelen. Med andre ords, så må vi ved hjelp av fremmdnøkkelen
  // ** finne databasen hvor den er en primærnøkkel, og så finne riktig data.

  // Find path to specific animal from animalsDB
  // ** Finn det eksakte dataobjektet med primærnøkkelen, som blir
  // ** databasenavnet/primærnøkkel
  let animalDataRef = db.ref('animals/' + personAnimalKey);

  // Because the animal primary is used as a foreign key in the person data,
  // we get the specific animal from animalsDB by creating a nested function,
  // where 'value' reads static (snapshot) data from the database
  // ** Samme metode som når vi kjører funksjonene nederst i dette dokumentet,
  // ** men med 'value', som betyr at funksjonen bare leser av data som allerede
  // ** finnes i databasen
  animalDataRef.on('value', function(snapshotAnimals) {

    let animalData = snapshotAnimals.val();

    let animalName = animalData.name;

    // Add data to table in HTML
    // ** Vis data med fremmednøkkel-dataen i tabellen
    table.innerHTML += `
    <tr>
      <td>${personName}</td>
      <td>${personAge}</td>
      <td>${animalName}</td>
    </tr>
    `;

    // Add data to select menu for deleting a data entry
    // ** Legg til data i select-meny for å slette data
    selDel.innerHTML += `
    <option value="${key}">
      ${personName} | ${personAge} | ${animalName}
    </option>
    `;

    // Add data to select menu for updating a data entry
    // ** Legg til data i select-meny for å oppdatere data
    selUpdate.innerHTML += `
    <option value="${key}">
      ${personName} | ${personAge} | ${animalName}
    </option>
    `;

  });


}





// DELETE DATA
function deleteData(event) {

  // Reload page after running function
  // to update the table with correct data
  // ** La siden automatisk lastes inn etter å ha klikket på knappen,
  // ** for da vil riktig data vises i tabellene og select-menyen

  // Get select menu option value,
  // which is the data entry we want to delete;
  // the value is the primary key
  // ** Verdien er primærnøkkel
  let chosenData = selDel.value;

  // Get exact reference to this data entry
  // ** Finn det eksakte dataobjektet med primærnøkkelen vi ønsker
  let dataRef = db.ref('persons/' + chosenData);

  // Delete data entry
  // ** Innebygd firebase-funksjon for å slette data
  dataRef.remove();

}





// UPDATE THE NAME OF A DATA ENTRY
// ** Samme metode som i funksjonen deleteData()
function updateData(event) {

  console.log('updateName');

  let chosenData = selUpdate.value;

  let newName = inpNewName.value;

  let person = db.ref('persons/' + chosenData);

  // Update data
  // ** Innebygd firebase-funksjon for å oppdatere data ved å
  // ** oppdatere et dataobjekt med kun det du ønsker å endre
  // ** (her: kun 'name')
  person.update({
    "name": newName
  });

}





// RUN FUNCTIONS

// When form is submitted by clicking the button of type="submit", run function
// ** Når et skjema sendes inn (on_submit), så kjøres en funksjon (høyreside av likhetstegnet)
formSendAnimal.onsubmit = sendAnimal;
formSend.onsubmit = sendData;
formDelete.onsubmit = deleteData;
formUpdate.onsubmit = updateData;

// A child (data entry) is added to the database every time a form is submitted
// When a child is added, run function
// ** Når ny data er lagt (child_added) til i en database (animalsDB), så kjøres en funksjon (fillSelAnimal)
animalsDB.on('child_added', fillSelAnimal);
personsDB.on('child_added', showData);

// When a child is removed, run function
// ** Når data er fjerna (child_removed) fra en database, så kjøres en funksjon
personsDB.on('child_removed', showData);
