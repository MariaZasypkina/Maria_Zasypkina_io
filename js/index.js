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
  "Postman",
  "SQL",
  "Xcode",
  "Android Studio",
  "Adobe Photoshop",
  "Responsive Design",
  "Accessibility (a11y)",
  "ProCreate",
  "Debugging",
  "Figma",
  "Canva",
  "Sketch",
  "NodeJS",
  "React",
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
let messageList = messageSection.querySelector("ul");
messageSection.hidden = true;

let idCounter = 0;
//make unic ids for entries
function makeId() {
  return "entry" + idCounter++;
}

//save entrie by id for initializing the edit form
let entryById = {};

//Manage the new message list entries
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let name = event.target.usersName.value;
  let email = event.target.usersEmail.value;
  let message = event.target.usersMessage.value;

  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);
  let uid = makeId();
  let newMessage = document.createElement("li");
  newMessage.classList.add("message-item");

  newMessage.innerHTML = `<a href="mailto:${email} ">${name} </a><span>wrote: ${message} </span>`;
  newMessage.setAttribute("id", uid);

  entryById[uid] = {
    usersName: name,
    usersEmail: email,
    usersMessage: message,
  };
  newMessage.appendChild(makeEditButton());
  newMessage.appendChild(makeRemoveButton());

  messageList.appendChild(newMessage);
  messageForm.reset();
  messageSection.hidden = false;
});

//create a button Remove

function makeRemoveButton() {
  let removeButton = document.createElement("button");
  removeButton.innerText = "remove";
  removeButton.type = "button";
  removeButton.className = "remove-button";
  removeButton.addEventListener("click", () => {
    let entry = removeButton.parentNode;

    let uid1 = entry.getAttribute("id");
    delete entryById[uid1];
    entry.remove();
    if (messageList.childElementCount === 0) {
      messageSection.hidden = true;
    }
  });
  return removeButton;
}

//create a button Edit

function makeEditButton() {
  let editButton = document.createElement("button");
  editButton.innerText = "edit";
  editButton.type = "button";
  editButton.className = "edit-button";
  editButton.addEventListener("click", () => {
    let entry = editButton.parentNode;

    //Edit buttton is hidden while editing
    let oldEditButton = entry.querySelector("button.edit-button");
    oldEditButton.hidden = true;

    //Remove buttton is hidden while editing
    let oldRemoveButton = entry.querySelector("button.remove-button");
    oldRemoveButton.hidden = true;

    //get the id for the entry
    let uid = entry.getAttribute("id");
    let clonedForm = messageForm.cloneNode(true);
    clonedForm.className = "edit-message-form";
    clonedForm.usersName.value = entryById[uid].usersName;
    clonedForm.usersEmail.value = entryById[uid].usersEmail;
    clonedForm.usersMessage.value = entryById[uid].usersMessage;
    entry.appendChild(clonedForm);
    clonedForm.addEventListener("submit", function editMessage(event) {
      event.preventDefault();
      entryById[uid].usersName = event.target.usersName.value;
      entryById[uid].usersEmail = event.target.usersEmail.value;
      entryById[uid].usersMessage = event.target.usersMessage.value;
      let newEntry = document.createElement("li");
      newEntry.classList.add("message-item");
      newEntry.setAttribute("id", uid);
      newEntry.innerHTML = `<a href="mailto:${entryById[uid].usersEmail} "> ${entryById[uid].usersName} </a><span>wrote: ${entryById[uid].usersMessage} </span> <br><br>`;
      newEntry.appendChild(makeEditButton());
      newEntry.appendChild(makeRemoveButton());
      entry.parentNode.replaceChild(newEntry, entry);
    });
  });
  return editButton;
}

/*create a fetch to the gitHub repos*/
let userName = "MariaZasypkina";
fetch(`https://api.github.com/users/${userName}/repos`)
  .then((Response) => {
    if (Response.ok) {
      return Response.text();
    } else {
      throw new Error("Failed to fetch repositories");
    }
  })
  .then((data) => {
    let repositories = JSON.parse(data);
    console.log(repositories);

    //Sort repositories by creation date

    repositories.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    //DOM Selection to select projects by id

    let projectSection = document.getElementById("projects");

    //Create a 'ul' list

    let projectList = projectSection.querySelector("ul");

    for (let repository of repositories) {
      //create 'li' element

      let project = document.createElement("li");

      //create anchor element for the repo link

      let projectLink = document.createElement("a");
      projectLink.href = repository.html_url; // url of GitHub repo

      // set inner text of a variable as a repo's name property
      projectLink.innerText = repository.name;

      //open link in a new tap
      projectLink.target = "_blank";

      //Convert to a readeble format
      let createdAt = new Date(repository.created_at);
      let formattedDate = createdAt.toLocaleDateString();

      //appent the project link and creation date

      project.appendChild(projectLink);
      project.innerHTML += ` created on: ${formattedDate}`;

      // append the project element to the ProjectList

      projectList.appendChild(project);
    }
  })
  .catch((error) => {
    if (error instanceof SyntaxError) {
      console.error("Unparsable response from server");
    } else {
      console.error("Error fetching data: ", error.message);
    }
  });

//Switching color themes

let toggleButton = document.getElementById("toggleGrayMode");

let isGrayMode = false; //saving current state of gray mode
toggleButton.addEventListener("click", () => {
  //toggle the state
  isGrayMode = !isGrayMode;

  //enable or disable gray mode
  if (isGrayMode) {
    document.body.classList.add("gray-mode");
    toggleButton.textContent = "Add Color"; //changing the button text
  } else {
    document.body.classList.remove("gray-mode");
    toggleButton.textContent = "No Color"; //changing the button text
  }
});
