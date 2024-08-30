let footer = document.createElement("footer");
let body = document.querySelector("body");
body.appendChild(footer);

let today = new Date();
let thisYear = today.getFullYear();
let copyright = document.createElement("p");
copyright.innerHTML = `\u00A9 Maria Zasypkina ${thisYear}`;
footer.appendChild(copyright);

let skills = [
  "JavaScript",
  "HTML",
  "CSS",
  "GitHub",
  "Adobe Photoshop",
  "Responsive Design",
  "Accessibility (a11y)",
  "ProCreate",
  "Debugging",
  "Figma",
  "Canva",
  "Sketch",
];
let skillsSection = document.getElementById("skills");
let skillsList = skillsSection.querySelector("ul");

for (let i = 0; i < skills.length; i++) {
  let skill = document.createElement("li");
  skill.innerText = skills[i];
  skillsList.appendChild(skill);
}
//message section

let messageForm = document.querySelector("[name='leave_message']");
let messageSection = document.getElementById("message-section");
let messageList = messageSection.querySelector('ul');
messageSection.hidden = true;

let idCounter = 0;
//make unic ids for entries
function makeId() {
  return 'entry' + idCounter++;
}

//save entrie by id for initializing the edit form
let entryById = {}; 

//Manage the new message list entries
messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let name = event.target.usersName.value;
  let email = event.target.usersEmail.value;
  let message = event.target.usersMessage.value;

  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);
  let uid = makeId();
  let newMessage = document.createElement('li');
  newMessage.classList.add('message-item');

  newMessage.innerHTML = `<a href="mailto:${email} ">${name} </a><span>wrote: ${message} </span>`;
    newMessage.setAttribute('id', uid);

entryById[uid] = {usersName: name,
                  usersEmail: email,
                  usersMessage: message
                };
newMessage.appendChild(makeEditButton());
newMessage.appendChild(makeRemoveButton());

messageList.appendChild(newMessage);
messageForm.reset();
messageSection.hidden = false;
});

//create a button Remove

function makeRemoveButton(){
    let removeButton = document.createElement('button');
    removeButton.innerText = 'remove';
    removeButton.type = 'button';
    removeButton.className = 'remove-button';
    removeButton.addEventListener('click', () => {

        let entry = removeButton.parentNode;
        
        let uid1 = entry.getAttribute('id');
        delete entryById[uid1];
        entry.remove();
        if (messageList.childElementCount === 0) {
            messageSection.hidden = true;
        };
    });
    return removeButton;
};

//create a button Edit

function makeEditButton() {
    let editButton = document.createElement('button');
    editButton.innerText = 'edit';
    editButton.type = 'button';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => {

        let entry = editButton.parentNode;

//Edit buttton is hidden while editing
        let oldEditButton = entry.querySelector('button.edit-button');
        oldEditButton.hidden = true;

//Remove buttton is hidden while editing
let oldRemoveButton = entry.querySelector('button.remove-button');
oldRemoveButton.hidden = true;        

//get the id for the entry
        let uid = entry.getAttribute('id');
        let clonedForm = messageForm.cloneNode(true);
        clonedForm.className = "edit-message-form";
        clonedForm.usersName.value = entryById[uid].usersName;
        clonedForm.usersEmail.value = entryById[uid].usersEmail;
        clonedForm.usersMessage.value = entryById[uid].usersMessage;
        entry.appendChild(clonedForm);
        clonedForm.addEventListener('submit', function editMessage(event){
            event.preventDefault();
            entryById[uid].usersName = event.target.usersName.value;
            entryById[uid].usersEmail = event.target.usersEmail.value;
            entryById[uid].usersMessage = event.target.usersMessage.value;
            let newEntry = document.createElement('li');
            newEntry.classList.add('message-item');
            newEntry.setAttribute('id', uid);
            newEntry.innerHTML = `<a href="mailto:${entryById[uid].usersEmail} "> ${entryById[uid].usersName} </a><span>wrote: ${entryById[uid].usersMessage} </span>`;
            newEntry.appendChild(makeEditButton());
            newEntry.appendChild(makeRemoveButton());
            entry.parentNode.replaceChild(newEntry, entry);
        });
    });
    return editButton;
};

