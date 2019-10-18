// jshint esversion: 6

// Get HTML-elements
let formSend = document.querySelector('#formSend');
let inpName = document.querySelector('#inpName');
let inpAge = document.querySelector('#inpAge');
let selAnimal = document.querySelector('#selAnimal');

let table = document.querySelector('#table');

// Animals
let animals = ['dog', 'cat', 'bird', 'horse'];


// Get Firebase database
let db = firebase.database();
let personsDB = db.ref('persons');





// Fill select menu
function fillSelAnimal() {
  for (let animal of animals) {
    selAnimal.innerHTML += `
    <option value="${animal}">
      ${animal}
    </option>
    `;
  }
}





// Send data to database
function sendData(event) {
  console.log('sendData');

  event.preventDefault();

  let name = inpName.value;
  let age = inpAge.value;
  let animal = selAnimal.value;

  personsDB.push({
    "name": name,
    "age": age,
    "animal": animal
  });

  name.value = '';
  age.value = '';
  animal = 0;
}





// Display data in table
function showData(snapshot) {
  console.log('showData');

  let person = snapshot.val();
  let personName = person.name;
  let personAge = person.age;
  let personAnimal = person.animal;

  table.innerHTML += `
  <tr>
    <td>${personName}</td>
    <td>${personAge}</td>
    <td>${personAnimal}</td>
  </tr>
  `;
}





// Run functions
fillSelAnimal();

formSend.onsubmit = sendData;

personsDB.on('child_added', showData);
